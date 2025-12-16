/**
 * TravelAI – AI CHAT CORE (UPDATE REAL)
 * Conversation memory
 * Multiple cities
 * Natural follow-up
 * Romanian travel assistant
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

/* =======================
   CONFIG
======================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const functionsUrl = `${supabaseUrl}/functions/v1`;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

/* =======================
   DEFAULT STATE
======================= */

const DEFAULT_STATE = {
  travel_context: {
    cities_mentioned: [] as string[],
    current_city: null as string | null,
    last_intent: null as "activities" | "hotels" | "general" | null,
  },
  language: "ro",
};

/* =======================
   MEMORY HELPERS
======================= */

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

/* =======================
   CITY / INTENT DETECTION
======================= */

function extractCities(text: string): string[] {
  const matches = text.match(/\b([A-ZĂÂÎȘȚ][a-zăâîșț]{2,})\b/g);
  if (!matches) return [];
  return matches.filter(w =>
    !["Si", "Dar", "Si", "In", "La", "De", "Pe", "Cu"].includes(w)
  );
}

function detectIntent(text: string) {
  const t = text.toLowerCase();
  if (t.includes("activit")) return "activities";
  if (t.includes("caz") || t.includes("hotel") || t.includes("pret")) return "hotels";
  return "general";
}

/* =======================
   PROVIDERS
======================= */

async function getActivities(city: string) {
  const res = await fetch(`${functionsUrl}/klook-search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ keyword: city }),
  });
  if (!res.ok) return [];
  return (await res.json()).results ?? [];
}

async function getHotels(city: string) {
  const res = await fetch(`${functionsUrl}/get-hotels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ city }),
  });
  if (!res.ok) return [];
  return await res.json();
}

/* =======================
   SYSTEM PROMPT
======================= */

const SYSTEM_PROMPT = `
You are TravelAI, friendly travel assistant.
You remember previous cities.
You answer naturally in Romanian.
`;

/* =======================
   MAIN
======================= */

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { user_id, conversation_id, prompt } = await req.json();

    let state = await loadState(conversation_id, user_id);
    const history = await loadHistory(conversation_id);

    // detect cities
    const cities = extractCities(prompt);
    if (cities.length > 0) {
      const last = cities[cities.length - 1];
      state.travel_context.current_city = last;
      if (!state.travel_context.cities_mentioned.includes(last)) {
        state.travel_context.cities_mentioned.push(last);
      }
    }

    const intent = detectIntent(prompt);
    state.travel_context.last_intent = intent;

    let activities = [];
    let hotels = [];

    if (intent === "activities" && state.travel_context.current_city) {
      activities = await getActivities(state.travel_context.current_city);
    }
    if (intent === "hotels" && state.travel_context.current_city) {
      hotels = await getHotels(state.travel_context.current_city);
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.content })),
      {
        role: "user",
        content: `
Current city: ${state.travel_context.current_city}
Intent: ${intent}
Activities: ${JSON.stringify(activities)}
Hotels: ${JSON.stringify(hotels)}
Message: ${prompt}
      `,
      },
    ];

    const ai = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1200,
    });

    const reply = ai.choices[0].message.content!;

    await saveState(conversation_id, state);

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: reply },
    ]);

    return new Response(
      JSON.stringify({ reply, state }),
      { headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
