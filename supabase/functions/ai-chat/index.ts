import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.30.0?target=deno";
import { SYSTEM_PROMPT } from "./system_prompt.ts";

// Providers
import { getAviasalesOffer } from "../offers/flights/aviasales.ts";
import { getKlookActivityCards } from "../offers/activities/klook.ts";

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

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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
    paris: "Paris",
    roma: "Roma",
    milano: "Milano",
    londra: "Londra",
    brussels: "Bruxelles",
    bruxelles: "Bruxelles",
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

    /* ---------- 1. ZBOR ---------- */

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
          reply: "Perfect ✈️ Am găsit o opțiune bună pentru tine 👇",
          intent: { type: "flight", ...flight },
          card,
          confidence: "high",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ---------- 2. ACTIVITY DETERMINIST ---------- */

    const t = prompt.toLowerCase();
    if (
      t.includes("activit") ||
      t.includes("things to do") ||
      t.includes("experien") ||
      t.includes("cultural")
    ) {
      let city: string | null = null;
      if (t.includes("madrid")) city = "Madrid";
      if (t.includes("paris")) city = "Paris";
      if (t.includes("tokyo")) city = "Tokyo";

      if (city) {
        const cards = getKlookActivityCards({ to: city });

        return new Response(
          JSON.stringify({
            reply: `Am selectat câteva activități interesante în ${city} 👇`,
            intent: { type: "activity", to: city },
            cards,
            confidence: "high",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    /* ---------- 3. AI CONVERSAȚIONAL ---------- */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    let reply = "Spune-mi ce tip de vacanță îți dorești 🙂";
    let intent: any = null;
    let confidence = "medium";
    let cards: any[] | null = null;

    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply ?? reply;
      intent = parsed.intent ?? null;
      confidence = parsed.confidence ?? confidence;
    } catch {
      reply = raw || reply;
    }

    if (intent?.type === "activity" && intent?.to) {
      cards = getKlookActivityCards({ to: intent.to });
    }

    return new Response(
      JSON.stringify({
        reply,
        intent,
        confidence,
        ...(cards && cards.length ? { cards } : {}),
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
