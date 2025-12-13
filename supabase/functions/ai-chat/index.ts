/**
 * TravelAI – Supabase Function (KLOOK + MEMORY)
 * - Memory state (destination, dates, etc.)
 * - Klook activities (via klook-search)
 * - Hotels (via get-hotels)
 * - Strict JSON reply: { reply, state_update }
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

// -------------------------------------------------------
// CORS
// -------------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// -------------------------------------------------------
// CLIENTS
// -------------------------------------------------------
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

// -------------------------------------------------------
// DEFAULT MEMORY STATE
// -------------------------------------------------------
const DEFAULT_CONVERSATION_STATE = {
  destination_city: null as string | null,
  destination_country: null as string | null,

  travelers_adults: null as number | null,
  travelers_children: null as number | null,

  start_date: null as string | null,
  end_date: null as string | null,
  dates_flexible: null as boolean | null,

  budget_level: null as ("low" | "medium" | "high") | null,
  budget_per_person: null as number | null,
  currency: null as string | null,

  focus: "general" as
    | "general"
    | "flights"
    | "accommodation"
    | "activities"
    | "transport"
    | "food"
    | "other",

  last_question_type: null as string | null,
  last_question_text: null as string | null,

  language: "ro" as string | null,
};

// -------------------------------------------------------
// HELPERS – STATE
// -------------------------------------------------------
async function loadOrInitState(conversation_id: string, user_id: string) {
  const { data } = await supabase
    .from("conversation_state")
    .select("state")
    .eq("conversation_id", conversation_id)
    .single();

  if (!data) {
    await supabase.from("conversation_state").insert({
      conversation_id,
      user_id,
      state: DEFAULT_CONVERSATION_STATE,
    });

    // deep copy ca să nu stricăm constantul
    return JSON.parse(JSON.stringify(DEFAULT_CONVERSATION_STATE));
  }

  return data.state ?? JSON.parse(JSON.stringify(DEFAULT_CONVERSATION_STATE));
}

async function saveState(conversation_id: string, newState: any) {
  await supabase
    .from("conversation_state")
    .update({
      state: newState,
      updated_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversation_id);
}

// -------------------------------------------------------
// HELPERS – TEXT / CITY
// -------------------------------------------------------
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ă|â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș|ş/g, "s")
    .replace(/ț|ţ/g, "t");
}

/**
 * City extractor simplu:
 * - încearcă să prindă "in/la/din Milano"
 * - fallback: ultimul cuvânt semnificativ
 */
function extractCity(text: string): string | null {
  if (!text) return null;
  const n = normalize(text);

  // "in milano", "la paris", "din roma", "to london", "at madrid"
  const prep = n.match(/\b(in|la|din|to|at)\s+([a-z]+)\b/i);
  if (prep?.[2]) {
    const c = prep[2];
    if (c.length >= 3) return c.charAt(0).toUpperCase() + c.slice(1);
  }

  const tokens = n.split(/[^a-z]+/).filter((t) => t.length >= 3);
  if (tokens.length === 0) return null;

  const stop = new Set([
    "hotel",
    "hoteluri",
    "cazare",
    "pret",
    "preturi",
    "zbor",
    "zboruri",
    "bilete",
    "activitati",
    "atractii",
    "vacanta",
    "sejur",
    "oras",
    "orasul",
    "unde",
    "city",
    "locuri",
    "transport",
    "mancare",
    "buget",
    "ieftin",
    "scump",
  ]);

  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i];
    if (!stop.has(t)) {
      return t.charAt(0).toUpperCase() + t.slice(1);
    }
  }

  return null;
}

// -------------------------------------------------------
// KLOOK CONNECTOR
// -------------------------------------------------------
async function fetchKlook(city: string | null) {
  if (!city) return [];

  try {
    const res = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/klook-search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY",
          )}`,
        },
        body: JSON.stringify({ keyword: city }),
      },
    );

    if (!res.ok) return [];
    const data = await res.json();

    // klook-search returnează { keyword, results: [...] }
    if (Array.isArray(data.results)) return data.results;

    // fallback – dacă vreodată schimbi structura
    if (Array.isArray(data.activities)) return data.activities;

    return [];
  } catch (e) {
    console.error("fetchKlook error", e);
    return [];
  }
}

// -------------------------------------------------------
// HOTELS CONNECTOR
// -------------------------------------------------------
async function fetchHotels(city: string | null) {
  if (!city) return null;

  try {
    const res = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/get-hotels`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY",
          )}`,
        },
        body: JSON.stringify({ city }),
      },
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("fetchHotels error", e);
    return null;
  }
}

// -------------------------------------------------------
// SYSTEM PROMPT – FOCUS PE KLOOK + JSON STRICT
// -------------------------------------------------------
const SYSTEM_PROMPT = `
You are TravelAI, a world-class travel assistant.

You MUST ALWAYS return a single valid JSON object:

{
  "reply": "string",
  "state_update": { }
}

NEVER output anything outside this JSON.
NEVER use markdown.

You will receive a USER message that looks like this:

CONVERSATION_STATE_JSON:
<json>

CONTEXT_ACTIVITIES_JSON:
<json array>

CONTEXT_HOTELS_JSON:
<json object or null>

USER_MESSAGE:
<the latest user message>

The JSON blocks above are NOT to be sent back to the user.
They are just context for you.

CONVERSATION_STATE_JSON is the persistent memory.
You may update ONLY the fields that changed and return them in "state_update".
If nothing changes, use:
  "state_update": {}

CONTEXT_ACTIVITIES_JSON is an ARRAY of activities from Klook for the current city.
Each item looks like:
{
  "type": "city_activities" | "popular" | "day_trips",
  "city": "Milano",
  "title": "Activități și experiențe în Milano",
  "description": "...",
  "affiliate_link": "https://tp.media/..."
}

RULES FOR KLOOK:
- If the array is NOT empty AND the user asks about activities
  ("activitati", "atractii", "ce pot face", "things to do", etc.),
  YOU MUST:
  - Use these items in your reply as concrete suggestions.
  - Mention at least 2–3 ideas, based on "title" and "description".
  - Optionally mention that they can book via the links shown in the app,
    but do NOT invent new URLs or prices.
- You MUST NOT say that you have no Klook activities
  when the array is non-empty.

CONTEXT_HOTELS_JSON may contain hotels and affiliate metadata.
Use it when the user asks about accommodation (cazare, hoteluri, etc.).
Summarize neighborhoods, style, and which traveler each hotel suits.
Do not invent prices if they are not in the JSON.

LANGUAGE:
- ALWAYS answer in the same language as USER_MESSAGE.
- If the user writes in Romanian, answer in Romanian.
- Internal field names in state_update stay in English.

STYLE:
- Friendly, expert, concrete.
- Move the planning forward with 1–2 short follow-up questions
  (dates, budget, or what they want next: zboruri, cazare, activități, etc.).
`;

// -------------------------------------------------------
// MAIN FUNCTION
// -------------------------------------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id, conversation_id, prompt } = await req.json();

    if (!user_id || !conversation_id || !prompt) {
      return new Response(
        JSON.stringify({
          error: "Missing user_id, conversation_id or prompt",
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    // 1) LOAD STATE
    let state = await loadOrInitState(conversation_id, user_id);

    // 2) LOAD LAST MESSAGES (optional context)
    const { data: history } = await supabase
      .from("chat_history")
      .select("role, content")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true })
      .limit(15);

    // 3) CITY DETECTION – salvat înainte de Klook/Hotels
    const cityFromMsg = extractCity(prompt);
    if (cityFromMsg) {
      state.destination_city = cityFromMsg;
    }

    const city = state.destination_city;

    // 4) FETCH CONTEXT (Klook + Hotels)
    const activities = await fetchKlook(city ?? null);
    const hotels = await fetchHotels(city ?? null);

    // 5) BUILD MESSAGES PENTRU OPENAI
    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    if (history) {
      history.forEach((m) => {
        messages.push({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        });
      });
    }

    // Un singur mesaj "user" cu TOT contextul + întrebarea reală
    const structuredUserMessage =
      "CONVERSATION_STATE_JSON:\n" +
      JSON.stringify(state) +
      "\n\nCONTEXT_ACTIVITIES_JSON:\n" +
      JSON.stringify(activities ?? []) +
      "\n\nCONTEXT_HOTELS_JSON:\n" +
      JSON.stringify(hotels ?? null) +
      "\n\nUSER_MESSAGE:\n" +
      prompt;

    messages.push({ role: "user", content: structuredUserMessage });

    // 6) OPENAI CALL – JSON ENFORCED
    const ai = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages,
      max_tokens: 2000,
      temperature: 0.6,
    });

    const content =
      ai.choices?.[0]?.message?.content ??
      '{"reply":"","state_update":{}}';

    let parsed: { reply: string; state_update: Record<string, any> };
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { reply: content, state_update: {} };
    }

    const reply = parsed.reply ?? "";
    const updates = parsed.state_update ?? {};

    // 7) MERGE STATE
    state = { ...state, ...updates };

    // 8) SAVE STATE
    await saveState(conversation_id, state);

    // 9) SAVE HISTORY (doar textul reply-ului, nu JSON-ul complet)
    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: reply },
    ]);

    // 10) RETURN (cu debug ca să vezi că vine Klook)
    return new Response(
      JSON.stringify({
        reply,
        state,
        city_used: city,
        activities_count: activities.length,
        activities,
        hotels,
      }),
      { headers: corsHeaders },
    );
  } catch (err: any) {
    console.error("TRAVELAI ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Unknown error" }),
      { status: 500, headers: corsHeaders },
    );
  }
});
