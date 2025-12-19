/**
 * TravelAI – Travel Orchestrator AI
 * STABIL / COMPATIBIL CU FRONTENDUL EXISTENT
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
    .limit(12);

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

/* ================= SYSTEM PROMPT ================= */

const CONSULTANT_PROMPT = `
Esti TravelAI, un consultant de vacante real.

Reguli:
- Vorbeste natural, ca un agent de turism.
- NU inventa preturi.
- NU genera linkuri.
- NU mentiona platforme externe.
- Daca utilizatorul cere zboruri, spune ca poti afisa oferte reale in interfata.

Scop:
- Ghideaza utilizatorul
- Clarifica optiunile
- Pregateste decizia
`;

/* ================= MAIN ================= */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let ctx: any = null;
  let reply = "";

  try {
    const { user_id, conversation_id, prompt } = await req.json();

    if (!prompt || !conversation_id) {
      return new Response(
        JSON.stringify({ reply: "Mesaj invalid." }),
        { headers: corsHeaders }
      );
    }

    let state = await loadState(conversation_id, user_id);
    const history = await loadHistory(conversation_id);

    // parse doar o singura data
    if (!state.context) {
      state.context = await parseTravelRequest(prompt);
    }

    ctx = state.context;

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

    reply = completion.choices[0].message.content ?? "";

    await saveState(conversation_id, state);

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: reply },
    ]);

    return new Response(
      JSON.stringify({
        reply,
        context: ctx,
      }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("AI-CHAT ERROR:", err);
    return new Response(
      JSON.stringify({
        reply: "Serviciul este temporar indisponibil.",
        context: ctx,
      }),
      { status: 200, headers: corsHeaders }
    );
  }
});
