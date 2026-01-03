import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { SYSTEM_PROMPT } from "./system_prompt.ts";
import { resolveToIata } from "./airport_resolver.ts";
import { getAviasalesOffer } from "../offers/flights/aviasales.ts";

/* ================= CONFIG ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

/* ================= HELPERS ================= */

function norm(v: unknown) {
  return String(v ?? "").trim();
}

function strip(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= FLIGHT PARSER ================= */

function extractFlightData(text: string) {
  const t = strip(text);

  if (!t.includes("zbor")) return null;

  // 🔹 RUTA – doar orașe (se oprește înainte de cifre)
  const routeMatch =
    t.match(/din\s+([a-zăîâșț ]+?)\s+la\s+([a-zăîâșț ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/zbor\s+([a-zăîâșț ]+?)\s+([a-zăîâșț ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/([a-zăîâșț ]+?)\s*(?:->|→|-)\s*([a-zăîâșț ]+?)(?=\s+\d|\s*$)/);

  if (!routeMatch) return null;

  const from = routeMatch[1].trim();
  const to = routeMatch[2].trim();

  // 🔹 DATE
  const dateMatch = t.match(
    /(\d{1,2})\s*[-–]\s*(\d{1,2})\s*(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s*(\d{4})/
  );

  if (!dateMatch) return null;

  // 🔹 PASAGERI
  const paxMatch = t.match(/(\d+)\s*(pasageri|persoane|adulti)/);
  const passengers = paxMatch ? Number(paxMatch[1]) : 1;

  const monthMap: Record<string, string> = {
    ianuarie: "01",
    februarie: "02",
    martie: "03",
    aprilie: "04",
    mai: "05",
    iunie: "06",
    iulie: "07",
    august: "08",
    septembrie: "09",
    octombrie: "10",
    noiembrie: "11",
    decembrie: "12",
  };

  const pad = (n: string) => (n.length === 1 ? `0${n}` : n);

  return {
    from_city: from,
    to_city: to,
    depart_date: `${dateMatch[4]}-${monthMap[dateMatch[3]]}-${pad(dateMatch[1])}`,
    return_date: `${dateMatch[4]}-${monthMap[dateMatch[3]]}-${pad(dateMatch[2])}`,
    passengers,
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

    const flight = extractFlightData(prompt);
    console.log("FLIGHT PARSED:", flight);

    if (flight) {
      const fromIata = await resolveToIata(flight.from_city);
      const toIata = await resolveToIata(flight.to_city);

      console.log("🧪 STEP 2 IATA:", fromIata, toIata);
      console.log("🧪 TYPES:", typeof fromIata, typeof toIata);
      console.log("🧪 RAW:", JSON.stringify({ fromIata, toIata }));

      if (fromIata && toIata) {
        const card = getAviasalesOffer({
  from_iata: fromIata,        // ✅ CRA
  to_iata: toIata,            // ✅ MAD
  depart_date: flight.depart_date,
  return_date: flight.return_date,
  passengers: flight.passengers,
});

        console.log("🧪 STEP 3 card:", card);
        if (card) {
          console.log("🚀 STEP 4 RETURNING CARD");

  return new Response(
    JSON.stringify({
      type: "offer",          // 🔴 CHEIA CRITICĂ
      content: "✈️ Am găsit o opțiune bună pentru tine 👇",
      card,                   // 🔴 CARDUL TREBUIE SĂ FIE DIRECT
      confidence: "high",
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

      }
    }

    // 🔁 FALLBACK AI (doar dacă NU e zbor valid)
    console.log("⚠️ FALLBACK AI TRIGGERED");

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
      }),
    });

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? "";

    return new Response(
      JSON.stringify({ reply: raw || "Spune-mi ce plan ai 🙂" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("AI-CHAT ERROR:", err);
    return new Response(
      JSON.stringify({ reply: "Hai să o luăm pas cu pas 🙂" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
