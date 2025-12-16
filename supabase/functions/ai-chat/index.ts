/**
 * TravelAI – Conversational Travel AI (STABLE)
 * - conversational ca ChatGPT
 * - memorie reala (chat_history)
 * - multiple orase
 * - fara comportament prostesc
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

/* ================= CONFIG ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

/* ================= STATE ================= */

const DEFAULT_STATE = {
  current_city: null as string | null,
  cities_mentioned: [] as string[],
};

/* ================= MEMORY ================= */

async function loadState(conversation_id: string, user_id: string) {
  const { data } = await supabase
    .from("conversation_state")
    .select("state")
    .eq("conversation_id", conversation_id)
    .single();

  if (!data) {
    await supabase.from("conversation_state").insert({
      conversation_id,
      user_id,
      state: DEFAULT_STATE,
    });
    return structuredClone(DEFAULT_STATE);
  }

  return data.state ?? structuredClone(DEFAULT_STATE);
}

async function saveState(conversation_id: string, state: any) {
  await supabase
    .from("conversation_state")
    .update({
      state,
      updated_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversation_id);
}

async function loadHistory(conversation_id: string) {
  const { data } = await supabase
    .from("chat_history")
    .select("role, content")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true })
    .limit(20);

  return data ?? [];
}

/* ================= CITY DETECTION ================= */

function extractCity(text: string): string | null {
  const matches = text.match(/\b([A-ZĂÂÎȘȚ][a-zăâîșț]{2,})\b/g);
  if (!matches) return null;
  return matches[matches.length - 1];
}

/* ================= SYSTEM PROMPT ================= */

const SYSTEM_PROMPT = `
You are TravelAI, a friendly and knowledgeable travel assistant.

You speak naturally, like a human travel expert.
You remember the conversation and continue it naturally.

Guidelines:
- If a city is already being discussed, continue talking about that city.
- If the user switches to another city, smoothly switch the discussion.
- Do NOT ask unnecessary clarification questions.
- Do NOT sound like customer support or a form.
- Speak Romanian.
- Talk ONLY about travel: cities, destinations, activities, accommodation, tips.

Your goal is to feel like a human travel companion.
`;

/* ================= MAIN ================= */

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { user_id, conversation_id, prompt } = await req.json();

    if (!user_id || !conversation_id || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // load memory
    let state = await loadState(conversation_id, user_id);
    const history = await loadHistory(conversation_id);

    // detect city switch
    const city = extractCity(prompt);
    if (city) {
      state.current_city = city;
      if (!state.cities_mentioned.includes(city)) {
        state.cities_mentioned.push(city);
      }
    }

    // factual context as assistant message (CRUCIAL)
    const cityFact = state.current_city
      ? `Discutia curenta este despre orasul ${state.current_city}.`
      : `Orasul nu a fost inca stabilit.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "assistant", content: cityFact },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1200,
    });

    const reply = completion.choices[0].message.content!;

    await saveState(conversation_id, state);

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: reply },
    ]);

    return new Response(
      JSON.stringify({ reply, state }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("AI-CHAT ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
