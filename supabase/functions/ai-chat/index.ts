import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

// ================================
// CORS
// ================================
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ================================
// OpenAI
// ================================
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// ================================
// Helpers: safe JSON parse
// ================================
function safeJsonParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

// ================================
// Types
// ================================
type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

type Intent =
  | {
      type: "flight";
      from_city?: string | null;
      to_city?: string | null;
      depart_date?: string | null; // YYYY-MM-DD
      return_date?: string | null; // YYYY-MM-DD
      passengers?: number | null;
      cabin?: "economy" | "premium_economy" | "business" | "first" | null;
      is_ready_for_offer: boolean;
      missing?: string[];
    }
  | {
      type: "hotel";
      city?: string | null;
      checkin?: string | null;
      checkout?: string | null;
      guests?: number | null;
      is_ready_for_offer: boolean;
      missing?: string[];
    }
  | {
      type: "activity";
      city?: string | null;
      date?: string | null;
      is_ready_for_offer: boolean;
      missing?: string[];
    }
  | { type: "none"; is_ready_for_offer: false };

type AIResponse = {
  reply: string;               // text normal, conversational
  intent: Intent;              // intent structurat
  memory_update?: Record<string, any>; // ce vrei să salvezi în conversation_state
};

// ================================
// Prompt (THE BRAIN)
// ================================
function buildSystemPrompt() {
  return `
You are TravelAI, a friendly Romanian travel buddy.
Your job: have a natural conversation about travel, like a helpful friend, not a sales bot.

Hard rules:
- Speak Romanian, friendly, natural, not robotic.
- DO NOT output cards or UI markup. Plain text only in "reply".
- DO NOT invent flight prices, airlines, hotel availability, or activities inventory.
- You MAY give general travel guidance (best areas, seasons, tips, budget ranges) but be clear it's general.
- Always keep context: user can change subjects mid-conversation; you must follow.
- If the user mentions multiple destinations, you can compare them.
- Extract travel intent when present, but don't force it.

Dates:
- Understand dates in many formats: "22.02.2026", "22-02-2026", "2026-02-22", "22 februarie 2026".
- If user gives a range, output YYYY-MM-DD for depart/return (or checkin/checkout).
- If ambiguous/missing, ask a short clarifying question.
- If user wants a flight offer and you have enough info, set intent.is_ready_for_offer=true.
- "Enough info" for flight offer: to_city + depart_date (and return_date if user clearly wants roundtrip OR user said "dus-intors"). from_city is optional (default Romania/Bucuresti if missing, but mark it in missing if not provided).

Output format:
Return a single valid JSON object with EXACT keys:
{
  "reply": "...",
  "intent": {...},
  "memory_update": {...}
}

Intent rules:
- If no clear offer request, set intent.type="none".
- If user asks "zbor", set type="flight".
- If user asks "cazare/hotel", set type="hotel".
- If user asks "ce vizitez/activitati", set type="activity".
- intent.missing should list needed fields in Romanian, e.g. ["perioada", "oras plecare"].

Memory:
- memory_update should contain ONLY useful stable facts from the conversation (cities discussed, preferences, budget, travel style, dates).
- Keep it short.

Be helpful, proactive, but never pushy.
`.trim();
}

// ================================
// Build messages with memory + history
// ================================
function buildMessages(args: {
  prompt: string;
  history?: ChatMsg[];
  memory?: Record<string, any>;
}) {
  const memoryText = args.memory
    ? `MEMORY (json): ${JSON.stringify(args.memory)}`
    : "MEMORY (json): {}";

  const sys: ChatMsg = {
    role: "system",
    content: `${buildSystemPrompt()}\n\n${memoryText}`,
  };

  // Keep last N turns to reduce token usage
  const trimmedHistory = (args.history ?? []).slice(-12);

  return [
    sys,
    ...trimmedHistory.filter((m) => m.role !== "system"),
    { role: "user", content: args.prompt },
  ] as ChatMsg[];
}

// ================================
// Server
// ================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        reply:
          "Config lipsă: OPENAI_API_KEY nu e setat pe funcția ai-chat. 🔧",
        intent: { type: "none", is_ready_for_offer: false },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const prompt: string = body?.prompt ?? "";
  const history: ChatMsg[] = body?.history ?? [];
  const memory: Record<string, any> = body?.memory ?? body?.state ?? {};

  if (!prompt.trim()) {
    return new Response(
      JSON.stringify({
        reply: "Zi-mi ce ai în plan și te ajut imediat 🙂",
        intent: { type: "none", is_ready_for_offer: false },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const messages = buildMessages({ prompt, history, memory });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse<AIResponse>(raw);

    if (!parsed?.reply || !parsed?.intent) {
      // fallback safe
      return new Response(
        JSON.stringify({
          reply:
            "Am înțeles. Spune-mi un pic mai clar ce vrei (destinație + perioadă) și îți fac un plan. 🙂",
          intent: { type: "none", is_ready_for_offer: false },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Final guard: ensure no HTML
    const reply = String(parsed.reply).replace(/<\/?[^>]+(>|$)/g, "");

    return new Response(
      JSON.stringify({
        reply,
        intent: parsed.intent,
        memory_update: parsed.memory_update ?? {},
        tokens_in: completion.usage?.prompt_tokens ?? 0,
        tokens_out: completion.usage?.completion_tokens ?? 0,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("AI error:", err);
    return new Response(
      JSON.stringify({
        reply:
          "Am avut o eroare tehnică. Mai încearcă o dată, te rog. 🙏",
        intent: { type: "none", is_ready_for_offer: false },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
