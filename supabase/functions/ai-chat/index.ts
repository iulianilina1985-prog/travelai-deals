import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SYSTEM_PROMPT } from "./system_prompt.ts";

// ✅ PROVIDER DEDICAT AVIASALES
import { getAviasalesOffer } from "../offers/flights/aviasales.ts";

/* ================= CONFIG ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

/* ================= HELPERS ================= */

function norm(v: unknown) {
  return String(v ?? "").trim();
}

/* ---- DETERMINISTIC PARSER (NU AI) ---- */

function extractFlightData(text: string) {
  const t = text.toLowerCase();

  const from = t.includes("bucure") || t.includes("otp") ? "București" : null;

  const destinations: Record<string, string> = {
    paris: "Paris",
    barcelona: "Barcelona",
    bali: "Bali",
    roma: "Roma",
    milano: "Milano",
    santorini: "Santorini",
  };

  let to: string | null = null;
  for (const k in destinations) {
    if (t.includes(k)) to = destinations[k];
  }

  const dateMatch = t.match(
    /(\d{2})[.\-/](\d{2})[.\-/](\d{4})\s*-\s*(\d{2})[.\-/](\d{2})[.\-/](\d{4})/
  );

  const depart =
    dateMatch && `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
  const ret =
    dateMatch && `${dateMatch[6]}-${dateMatch[5]}-${dateMatch[4]}`;

  const paxMatch = t.match(/(\d+)\s*(persoane|adulti|adulți)/);
  const passengers = paxMatch ? Number(paxMatch[1]) : 1;

  if (from && to && depart && ret) {
    return { from, to, depart, ret, passengers };
  }

  return null;
}

/* ================= SERVER ================= */

serve(async (req) => {
  // ✅ CORS PRE-FLIGHT
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const prompt = norm(body?.prompt);

    /* ---------- 1. PARSARE ZBOR (DET) ---------- */

    const flight = extractFlightData(prompt);

    if (flight) {
      const card = getAviasalesOffer({
        from: flight.from,
        to: flight.to,
        depart_date: flight.depart,
        return_date: flight.ret,
        passengers: flight.passengers,
      });

      const reply = `Perfect ✈️  
Am găsit configurația completă pentru zbor:

🛫 **${flight.from} → ${flight.to}**  
📅 **${flight.depart} → ${flight.ret}**  
👥 **${flight.passengers} persoane**

Poți vedea zborurile mai jos 👇`;

      return new Response(
        JSON.stringify({
          reply,
          intent: {
            type: "flight",
            from: flight.from,
            to: flight.to,
            depart_date: flight.depart,
            return_date: flight.ret,
          },
          card,
          confidence: "high",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ---------- 2. MOD CONVERSAȚIE (AI) ---------- */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    // ✅ FIXUL CRITIC: PARSARE JSON
    let reply = "Spune-mi ce tip de vacanță îți dorești 🙂";
    let intent: any = null;
    let confidence = "medium";

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.reply === "string") reply = parsed.reply;
      if (parsed.intent) intent = parsed.intent;
      if (parsed.confidence) confidence = parsed.confidence;
    } catch {
      // fallback dacă AI răspunde liber
      reply = raw || reply;
    }

    return new Response(
      JSON.stringify({
        reply,
        intent,
        confidence,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("AI-CHAT ERROR:", err);

    return new Response(
      JSON.stringify({
        reply: "Hai să o luăm pas cu pas 🙂",
        intent: null,
        confidence: "low",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
