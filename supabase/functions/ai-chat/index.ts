// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

import { SYSTEM_PROMPT } from "./system_prompt.ts";
import {
  AiChatResponse,
  isValidAiChatResponse,
  safeJsonParse,
} from "./schema.ts";

/* =========================================
   CONFIG
========================================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

/* =========================================
   SERVER
========================================= */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const prompt: string = String(body?.prompt ?? "").trim();
  const history: { role: "user" | "assistant"; content: string }[] =
    body?.history ?? [];

  if (!prompt) {
    return json({
      reply: "Spune-mi ce vrei să planificăm 😊",
      intent: {
        type: null,
        from: null,
        to: null,
        depart_date: null,
        return_date: null,
      },
      memory_update: {},
    });
  }

  /* =========================================
     OPENAI CALL
  ========================================= */

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },

    // 🔁 conversație anterioară (ultimele mesaje)
    ...history.slice(-10),

    // 🧍 mesajul curent
    { role: "user", content: prompt },
  ];

  let aiText = "";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages,
      response_format: { type: "json_object" },
    });

    aiText = completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    console.error("OpenAI error:", err);
    return json({
      reply:
        "Ups… am avut o mică problemă tehnică 😅 Hai să încercăm din nou.",
      intent: {
        type: null,
        from: null,
        to: null,
        depart_date: null,
        return_date: null,
      },
      memory_update: {},
    });
  }

  /* =========================================
     VALIDARE STRICTĂ
  ========================================= */

  const parsed = safeJsonParse<AiChatResponse>(aiText);

  if (!parsed.ok || !isValidAiChatResponse(parsed.value)) {
    console.error("AI invalid JSON:", aiText);

    return json({
      reply:
        "Hai să o luăm puțin diferit 😊 Spune-mi ce oraș te interesează sau ce vrei să comparăm.",
      intent: {
        type: null,
        from: null,
        to: null,
        depart_date: null,
        return_date: null,
      },
      memory_update: {},
    });
  }

  return json(parsed.value);
});

/* =========================================
   HELPERS
========================================= */

function json(data: any) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
