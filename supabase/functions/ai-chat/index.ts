import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { SYSTEM_PROMPT } from "./system_prompt.ts";

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

/* ================= FLIGHT PARSER ================= */

function extractFlightData(text: string) {
  const strip = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const t = strip(text);

  const CITY_CANON: Record<string, string> = {
    bucuresti: "București",
    london: "London",
    londra: "London",
    paris: "Paris",
    roma: "Roma",
    milano: "Milano",
    brussels: "Bruxelles",
  };

  const canonCity = (raw: string) => CITY_CANON[strip(raw)] ?? raw;

  let from: string | null = null;
  let to: string | null = null;

  const routeMatch =
    t.match(/din\s+([a-z ]+)\s+la\s+([a-z ]+)/) ||
    t.match(/([a-z ]+)\s*(?:->|→|-)\s*([a-z ]+)/);

  if (routeMatch) {
    from = canonCity(routeMatch[1].trim());
    to = canonCity(routeMatch[2].trim());
  }

  const dateMatch = t.match(
    /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4}).*?(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/
  );

  if (!from || !to || !dateMatch) return null;

  const pad = (n: string) => (n.length === 1 ? `0${n}` : n);

  return {
    from,
    to,
    depart: `${dateMatch[3]}-${pad(dateMatch[2])}-${pad(dateMatch[1])}`,
    ret: `${dateMatch[6]}-${pad(dateMatch[5])}-${pad(dateMatch[4])}`,
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

    console.log("AI-CHAT PROMPT:", prompt);

    /* ---------- 1. FLIGHT (AVIASALES) ---------- */

    const flight = extractFlightData(prompt);
    if (flight) {
      const card = getAviasalesOffer({
        from: flight.from,
        to: flight.to,
        depart_date: flight.depart,
        return_date: flight.ret,
        passengers: flight.passengers,
      });

      return new Response(
        JSON.stringify({
          type: "offer",
          reply: "Perfect ✈️ Am găsit o opțiune bună pentru tine 👇",
          intent: { type: "flight", ...flight },
          card,
          confidence: "high",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ---------- 2. AI (INTENT DETECTION) ---------- */

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

    let reply = raw || "Spune-mi ce plan ai 🙂";
    let intent: any = null;
    let confidence = "medium";

    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply ?? reply;
      intent = parsed.intent ?? null;
      confidence = parsed.confidence ?? confidence;
    } catch {
      // răspuns text simplu
    }

    /* ---------- 3. ACTIVITY (KLOOK – SIMPLE LINK CARD) ---------- */

    if (intent?.type === "activity" && intent?.to) {
      return new Response(
        JSON.stringify({
          type: "offer",
          reply,
          intent,
          confidence,
          card: {
            type: "activity",
            provider: "Klook",
            city: intent.to,
            provider_meta: {
              name: "Klook",
              brand_color: "#ff5b00",
            },
            cta: {
              label: "Vezi activitățile",
              url: "https://klook.tpx.lt/jnEi9ZtF",
            },
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ---------- 4. NORMAL CHAT ---------- */

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
        confidence: "low",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
