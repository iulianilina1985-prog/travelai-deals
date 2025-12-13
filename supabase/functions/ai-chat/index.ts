/**
 * TravelAI – Supabase Function (KLOOK + HOTELS + MEMORY)
 * VARIANTA FINALĂ – FUNCȚIONEAZĂ 100%
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
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// 🔥 AICI ESTE URL-UL CORECT PENTRU FUNCȚIILE TALE
const functionsUrl = `${supabaseUrl}/functions/v1`;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

// -------------------------------------------------------
// DEFAULT MEMORY STATE
// -------------------------------------------------------
const DEFAULT_STATE = {
  destination_city: null,
  destination_country: null,
  travelers_adults: null,
  travelers_children: null,
  start_date: null,
  end_date: null,
  dates_flexible: null,
  budget_level: null,
  budget_per_person: null,
  currency: null,
  focus: "general",
  last_question_type: null,
  last_question_text: null,
  language: "ro",
};

// -------------------------------------------------------
// STATE HELPERS
// -------------------------------------------------------
async function loadState(conversation_id, user_id) {
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

async function saveState(conversation_id, newState) {
  await supabase
    .from("conversation_state")
    .update({
      state: newState,
      updated_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversation_id);
}

// -------------------------------------------------------
// TEXT HELPERS
// -------------------------------------------------------
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/ă|â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș|ş/g, "s")
    .replace(/ț|ţ/g, "t");
}

function extractCity(text) {
  if (!text) return null;

  const n = normalize(text);

  const m = n.match(/\b(in|la|din|to|at)\s+([a-z]+)\b/i);
  if (m?.[2] && m[2].length >= 3) {
    return m[2].charAt(0).toUpperCase() + m[2].slice(1);
  }

  const tokens = n.split(/[^a-z]+/).filter((t) => t.length >= 3);
  const stop = new Set([
    "hotel",
    "pret",
    "zbor",
    "vacanta",
    "city",
    "oras",
    "bilete",
    "activitati",
  ]);

  for (let i = tokens.length - 1; i >= 0; i--) {
    if (!stop.has(tokens[i])) {
      return tokens[i].charAt(0).toUpperCase() + tokens[i].slice(1);
    }
  }

  return null;
}

// -------------------------------------------------------
// FETCH KLOOK
// -------------------------------------------------------
async function fetchKlook(city) {
  if (!city) return [];

  try {
    const res = await fetch(`${functionsUrl}/klook-search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ keyword: city }),
    });

    if (!res.ok) {
      console.error("KLOOK ERROR:", await res.text());
      return [];
    }

    const data = await res.json();
    return data.results ?? [];
  } catch (e) {
    console.error("KLOOK FETCH FAILED:", e);
    return [];
  }
}

// -------------------------------------------------------
// FETCH HOTELS
// -------------------------------------------------------
async function fetchHotels(city) {
  if (!city) return null;

  try {
    const res = await fetch(`${functionsUrl}/get-hotels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ city }),
    });

    if (!res.ok) {
      console.error("HOTELS ERROR:", await res.text());
      return null;
    }

    return await res.json();
  } catch (e) {
    console.error("HOTELS FETCH FAILED:", e);
    return null;
  }
}

// -------------------------------------------------------
// SYSTEM PROMPT
// -------------------------------------------------------
const SYSTEM_PROMPT = `
You are TravelAI. ALWAYS return valid JSON:
{
  "reply": "...",
  "state_update": {}
}
Use provided activities/hotels if available.
`;

// -------------------------------------------------------
// MAIN FUNCTION
// -------------------------------------------------------
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

    let state = await loadState(conversation_id, user_id);

    const city = extractCity(prompt) ?? state.destination_city;
    if (city) state.destination_city = city;

    const activities = await fetchKlook(city);
    const hotels = await fetchHotels(city);

    const context = `
STATE:
${JSON.stringify(state)}

ACTIVITIES:
${JSON.stringify(activities)}

HOTELS:
${JSON.stringify(hotels)}

USER:
${prompt}
`;

    const ai = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: context },
      ],
      max_tokens: 2000,
    });

    let parsed;
    try {
      parsed = JSON.parse(ai.choices[0].message.content);
    } catch {
      parsed = { reply: ai.choices[0].message.content, state_update: {} };
    }

    state = { ...state, ...(parsed.state_update ?? {}) };
    await saveState(conversation_id, state);

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: parsed.reply },
    ]);

    return new Response(
      JSON.stringify({
        reply: parsed.reply,
        state,
        activities,
        hotels,
        city_used: city,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("AI-CHAT ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
