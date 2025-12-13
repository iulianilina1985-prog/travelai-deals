/**
 * TravelAI – Supabase Function (KLOOK + HOTELS + MEMORY)
 * 2025 – Version final, stabil, 100% funcțional
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
const functionsUrl = `${supabaseUrl}/functions/v1`;   // 👈 SINGURUL URL CORECT!!!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const OPENAI_MODEL =
  Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

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
// TEXT HELPERS
// -------------------------------------------------------
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ă|â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș|ş/g, "s")
    .replace(/ț|ţ/g, "t");
}

function extractCity(text: string) {
  if (!text) return null;
  const n = normalize(text);

  const prep = n.match(/\b(in|la|din|to|at)\s+([a-z]+)\b/i);
  if (prep?.[2] && prep[2].length >= 3) {
    const c = prep[2];
    return c.charAt(0).toUpperCase() + c.slice(1);
  }

  const tokens = n.split(/[^a-z]+/).filter((t) => t.length >= 3);
  const stop = new Set([
    "hotel",
    "pret",
    "zbor",
    "vacanta",
    "oras",
    "city",
    "activitati",
    "bilete",
  ]);

  for (let i = tokens.length - 1; i >= 0; i--) {
    if (!stop.has(tokens[i])) {
      const c = tokens[i];
      return c.charAt(0).toUpperCase() + c.slice(1);
    }
  }

  return null;
}

// -------------------------------------------------------
// FETCH HELPERS (KLOOK + HOTELS)
// -------------------------------------------------------
async function fetchKlook(city: string | null) {
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
      console.error("KLOOK ERROR", await res.text());
      return [];
    }

    const data = await res.json();
    return data.results ?? data.activities ?? [];
  } catch (err) {
    console.error("KLOOK FETCH FAILED:", err);
    return [];
  }
}

async function fetchHotels(city: string | null) {
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
      console.error("HOTELS ERROR", await res.text());
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("FETCH HOTELS FAILED:", err);
    return null;
  }
}

// -------------------------------------------------------
// SYSTEM PROMPT
// -------------------------------------------------------
const SYSTEM_PROMPT = `
You are TravelAI. ALWAYS output VALID JSON:
{
  "reply": "...",
  "state_update": {}
}
NEVER output anything outside the JSON object.
Use activities/hotels from context if available.
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
        JSON.stringify({
          error: "Missing user_id, conversation_id or prompt",
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Load state
    let state = await loadState(conversation_id, user_id);

    // Detect city
    const cityDetected = extractCity(prompt);
    if (cityDetected) state.destination_city = cityDetected;

    const city = state.destination_city;

    // Fetch external data
    const activities = await fetchKlook(city);
    const hotels = await fetchHotels(city);

    // Build context
    const fullContext = `
CONVERSATION_STATE_JSON:
${JSON.stringify(state)}

CONTEXT_ACTIVITIES_JSON:
${JSON.stringify(activities)}

CONTEXT_HOTELS_JSON:
${JSON.stringify(hotels)}

USER_MESSAGE:
${prompt}
`;

    const ai = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: fullContext },
      ],
      max_tokens: 2000,
      temperature: 0.6,
    });

    let parsed;
    try {
      parsed = JSON.parse(ai.choices[0].message.content);
    } catch {
      parsed = {
        reply: ai.choices[0].message.content,
        state_update: {},
      };
    }

    // Update state
    state = { ...state, ...(parsed.state_update ?? {}) };
    await saveState(conversation_id, state);

    // Save chat history
    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: parsed.reply },
    ]);

    return new Response(
      JSON.stringify({
        reply: parsed.reply,
        state,
        city_used: city,
        activities,
        hotels,
      }),
      { headers: corsHeaders },
    );
  } catch (err) {
    console.error("AI-CHAT ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
