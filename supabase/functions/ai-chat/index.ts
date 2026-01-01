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

/* ================= FLIGHT PARSER (AVIASALES) ================= */

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

/* ================= CAR RENTAL PARSER (LOCALRENT) ================= */

function extractCarRentalData(text: string) {
  const strip = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const t = strip(text);

  // keywords clare, fara AI
  const CAR_KEYWORDS = [
    "inchiriere masina",
    "inchiriez masina",
    "masina de inchiriat",
    "rent a car",
    "car rental",
  ];

  const hasCarIntent = CAR_KEYWORDS.some(k => t.includes(k));
  if (!hasCarIntent) return null;

  const CITY_CANON: Record<string, string> = {
    bucuresti: "București",
    london: "London",
    londra: "London",
    paris: "Paris",
    roma: "Roma",
    milano: "Milano",
    dublin: "Dublin",
    madrid: "Madrid",
    barcelona: "Barcelona",
  };

  let city: string | null = null;

  for (const [k, v] of Object.entries(CITY_CANON)) {
    if (t.includes(k)) {
      city = v;
      break;
    }
  }

  // date (optional)
  const dateMatch = t.match(
    /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4}).*?(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/
  );

  const pad = (n: string) => (n.length === 1 ? `0${n}` : n);

  let depart_date: string | null = null;
  let return_date: string | null = null;

  if (dateMatch) {
    depart_date = `${dateMatch[3]}-${pad(dateMatch[2])}-${pad(dateMatch[1])}`;
    return_date = `${dateMatch[6]}-${pad(dateMatch[5])}-${pad(dateMatch[4])}`;
  }

  return {
    to: city,
    depart_date,
    return_date,
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

    /* ---------- 1. ZBOR (AVIASALES – SAFE) ---------- */

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

        /* ---------- 1.5 CAR RENTAL (LOCALRENT – SAFE) ---------- */

    const car = extractCarRentalData(prompt);
if (car) {
  const intent = {
    type: "car_rental",
    from: null,
    to: car.to,
    depart_date: car.depart_date,
    return_date: car.return_date,
  };

  const offersRes = await fetch(
    `${Deno.env.get("SUPABASE_URL")}/functions/v1/offers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") ?? "",
      },
      body: JSON.stringify({ intent }),
    }
  );

  const offersJson = await offersRes.json();

  return new Response(
    JSON.stringify({
      reply: "Perfect 🚗 Am găsit opțiuni de închiriere auto pentru tine 👇",
      intent,
      confidence: "high",
      ...offersJson, // 👈 AICI apare cardul
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}



    /* ---------- 2. AI INTENT (ACTIVITY / CHAT) ---------- */

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

    console.log("AI RAW:", raw);

    let reply = "Spune-mi ce plan ai 🙂";
    let intent: any = null;
    let confidence: string = "medium";
    let card: any = null;

    try {
      const parsed = JSON.parse(raw);
      reply = parsed.reply ?? reply;
      intent = parsed.intent ?? null;
      confidence = parsed.confidence ?? confidence;
    } catch {
      reply = raw || reply;
    }

        /* ---------- 2.5 OFFERS ROUTER (CAR RENTAL) ---------- */

    if (intent?.type === "car_rental") {
      const offersRes = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/offers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.get("Authorization") ?? "",
          },
          body: JSON.stringify({ intent }),
        },
      );

      const offersJson = await offersRes.json();

      return new Response(
        JSON.stringify({
          reply,
          intent,
          confidence,
          ...offersJson, // { card }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }


    /* ---------- 3. ACTIVITY CARD (KLOOK – GENERAL) ---------- */

    let cards: any[] | null = null;

if (intent?.type === "activity" && intent?.to) {
  cards = [
    {
      id: `activity|klook|${intent.to.toLowerCase()}`,
      type: "activity",
      title: `Activități în ${intent.to}`,
      subtitle: "Tururi, bilete, experiențe locale",
      provider: "Klook",
      provider_meta: {
        id: "klook",
        name: "Klook",
        brand_color: "#ff5b00",
      },
      image_url: "/assets/activities/klook.jpg",
      cta: {
        label: "Vezi activitățile",
        url: "https://klook.tpx.lt/jnEi9ZtF", // link afiliat general
      },
    },
  ];
}


    return new Response(
  JSON.stringify({
    reply,
    intent,
    confidence,
    ...(cards ? { cards } : {}),
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
