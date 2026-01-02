import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { SYSTEM_PROMPT } from "./system_prompt.ts";
import { resolveToIata } from "./airport_resolver.ts";

// Providers
import { getAviasalesOffer } from "../offers/flights/aviasales.ts";

/* ================= CONFIG ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}

/* ================= HELPERS ================= */

function norm(v: unknown) {
  return String(v ?? "").trim();
}

function strip(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isIata(v: string) {
  return /^[A-Z]{3}$/.test(v);
}

/* ================= CITY → IATA (TEMP RESOLVER) =================
   IMPORTANT:
   - user NU vede IATA
   - Aviasales PRIMEȘTE IATA
   - asta va fi înlocuit cu dataset global
*/


/* ================= FLIGHT PARSER ================= */

function extractFlightData(text: string) {
  const t = strip(text);

  let from: string | null = null;
  let to: string | null = null;

  const routeMatch =
    t.match(/din\s+([a-z ]+)\s+la\s+([a-z ]+)/) ||
    t.match(/([a-z ]+)\s*(?:->|→|-)\s*([a-z ]+)/);

  if (routeMatch) {
    from = routeMatch[1].trim();
    to = routeMatch[2].trim();
  }

  const dateMatch = t.match(
    /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4}).*?(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/
  );

  if (!from || !to || !dateMatch) return null;

  const pad = (n: string) => (n.length === 1 ? `0${n}` : n);

  return {
    from_city: from,
    to_city: to,
    depart_date: `${dateMatch[3]}-${pad(dateMatch[2])}-${pad(dateMatch[1])}`,
    return_date: `${dateMatch[6]}-${pad(dateMatch[5])}-${pad(dateMatch[4])}`,
    passengers: 1,
  };
}

/* ================= SERVER ================= */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const prompt = norm(body?.prompt);
    console.log("TEST Craiova:", resolveToIata("Craiova"));
    console.log("TEST Madrid:", resolveToIata("Madrid"));
    console.log("TEST Paris:", resolveToIata("Paris"));
    console.log("TEST CRA:", resolveToIata("CRA"));


    console.log("AI-CHAT PROMPT:", prompt);

    /* ---------- 1. FLIGHT FLOW ---------- */

    const flight = extractFlightData(prompt);

    if (flight) {
      const fromIata = await resolveToIata(flight.from_city);
      const toIata = await resolveToIata(flight.to_city);


      // 🔒 dacă nu putem rezolva sigur → NU dăm card
      if (fromIata && toIata) {
        const card = getAviasalesOffer({
          from: fromIata,
          to: toIata,
          depart_date: flight.depart_date,
          return_date: flight.return_date,
          passengers: flight.passengers,
        });

        if (card) {
          return new Response(
            JSON.stringify({
              type: "offer",
              reply: "✈️ Perfect! Am găsit o opțiune bună pentru tine 👇",
              intent: {
                type: "flight",
                from: flight.from_city,
                to: flight.to_city,
                from_iata: fromIata,
                to_iata: toIata,
                depart_date: flight.depart_date,
                return_date: flight.return_date,
              },
              card,
              confidence: "high",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
    }

    /* ---------- 2. AI GENERAL ---------- */

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? "";

    let reply = "Spune-mi ce plan ai 🙂";
    let intent: any = null;
    let confidence = "medium";

    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply ?? reply;
      intent = parsed.intent ?? null;
      confidence = parsed.confidence ?? confidence;
    } catch {
      reply = raw || reply;
    }

    return new Response(
      JSON.stringify({ reply, intent, confidence }),
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
