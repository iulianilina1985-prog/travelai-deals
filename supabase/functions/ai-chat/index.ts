/**
 * TravelAI – Travel Orchestrator AI
 * STABLE + CORS SAFE
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

/* ================= CORS ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, content-type, apikey, x-client-info",
  "Content-Type": "application/json",
};

/* ================= CONFIG ================= */

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const functionsUrl = `${supabaseUrl}/functions/v1`;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

const MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

/* ================= MEMORY ================= */

const DEFAULT_STATE = { context: null as any };

async function loadState(conversation_id: string, user_id: string) {
  const { data } = await supabase
    .from("conversation_state")
    .select("state")
    .eq("conversation_id", conversation_id)
    .maybeSingle();

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
    .update({ state })
    .eq("conversation_id", conversation_id);
}

async function loadHistory(conversation_id: string) {
  const { data } = await supabase
    .from("chat_history")
    .select("role, content")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true })
    .limit(15);

  return data ?? [];
}

/* ================= AI PARSER ================= */

async function parseTravelRequest(text: string) {
  const system = `
Raspunde DOAR cu JSON valid.
{
  "city": string | null,
  "start_date": string | null,
  "end_date": string | null,
  "needs_flight": boolean,
  "needs_hotel": boolean
}
`;

  const res = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: text },
    ],
  });

  return JSON.parse(res.choices[0].message.content!);
}

function cityToIata(city: string): string {
  const map: Record<string, string> = {
    PARIS: "PAR",
    BUCHAREST: "BUH",
    BUCURESTI: "BUH",
    ROME: "ROM",
    MILAN: "MIL",
    LONDON: "LON",
  };
  return map[city.toUpperCase()] ?? city.toUpperCase();
}

/* ================= FLIGHTS ================= */

async function searchFlights(ctx: any) {
  if (!ctx.start_date || !ctx.end_date || !ctx.city) return null;

  const url = new URL(`${functionsUrl}/aviasales-cheap`);
  url.searchParams.set("origin", "BUH");
  url.searchParams.set("destination", cityToIata(ctx.city));
  url.searchParams.set("depart_date", ctx.start_date);
  url.searchParams.set("return_date", ctx.end_date);

  const res = await fetch(url.toString(), {
    headers: {
      apikey: Deno.env.get("SUPABASE_ANON_KEY")!,
      Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")!}`,
    },
  });

  return await res.json();
}

/* ================= PROMPT ================= */

const CONSULTANT_PROMPT = `
Esti TravelAI, un consultant de vacante real.

- Vorbeste natural
- Ofera solutii concrete
- NU inventa preturi
- Cand exista zboruri, mentioneaza ca sunt live si verificabile

REGULA CRITICA:
- NU genera linkuri
- Daca exista un link in context, foloseste-l EXACT
`;

/* ================= MAIN ================= */

serve(async (req) => {
  // ✅ PRE-FLIGHT
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: { ...corsHeaders, "Content-Length": "2" },
    });
  }

  try {
    const { user_id, conversation_id, prompt } = await req.json();

    if (!user_id || !conversation_id || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const state = await loadState(conversation_id, user_id);
    const history = await loadHistory(conversation_id);

    if (!state.context) {
      state.context = await parseTravelRequest(prompt);
    }

    let flightOffer = null;
    if (state.context?.needs_flight) {
      const result = await searchFlights(state.context);
      flightOffer = result?.offers?.[0] ?? null;
    }

    const messages = [
      { role: "system", content: CONSULTANT_PROMPT },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 800,
    });

    const reply = completion.choices[0].message.content!;

    await saveState(conversation_id, state);

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: reply },
    ]);

    return new Response(
      JSON.stringify({
        reply,
        context: state.context,
        flight_offer: flightOffer,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("AI CHAT ERROR:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});


