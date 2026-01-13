import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { SYSTEM_PROMPT } from "./system_prompt.ts";
import { resolveToIata } from "./airport_resolver.ts";
import { getAIProvidersByCategory, AffiliateProvider } from "../_shared/affiliates/registry.ts";

/* ================= CONFIG ================= */
console.log("🔥 AI-CHAT ACTIVE VERSION");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
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
    t.match(/din\s+([a-z ]+?)\s+(?:la|spre|catre)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/([a-z ]+?)\s*(?:->|→|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);


  if (!routeMatch) return null;

  const from = routeMatch[1].trim();
  const to = routeMatch[2].trim();

  // 🔹 DATE
  const dateMatch = t.match(
    /(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
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
  const year = dateMatch[4];

  const month = monthMap[dateMatch[3]];
  const startDay = pad(dateMatch[1]);
  const endDay = dateMatch[2] ? pad(dateMatch[2]) : null;

  return {
    from_city: from,
    to_city: to,
    depart_date: `${year}-${month}-${startDay}`,
    return_date: endDay ? `${year}-${month}-${endDay}` : undefined,
    passengers,
  };
}


function buildGenericCard(p: AffiliateProvider, intent: any) {
  const link = p.buildLink(intent);
  return {
    id: `${p.id}|${intent.to || intent.to_city || "gen"}`,
    type: intent.type,
    provider: p.name,
    title: intent.type === "flight"
      ? `Zbor ${intent.from_city || intent.from || ""} → ${intent.to_city || intent.to || ""}`
      : `${p.name} - ${intent.to || intent.to_city || "Destinație"}`,
    description: p.description,
    image_url: p.image_url,
    provider_meta: {
      id: p.id,
      name: p.name,
      brand_color: p.brandColor
    },
    cta: {
      label: p.ctaLabel,
      url: link
    }
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

    /* =========================================
       1. QUICK INTENT (REGEX) - OPTIONAL
       ========================================= */
    const flight = extractFlightData(prompt);
    if (flight) {
      const fromIata = await resolveToIata(flight.from_city);
      const toIata = await resolveToIata(flight.to_city);

      if (fromIata && toIata) {
        const intent = {
          type: "flight",
          ...flight,
          from_iata: fromIata,
          to_iata: toIata
        };
        const providers = getAIProvidersByCategory("flight");
        const cards = providers.map(p => buildGenericCard(p, intent));

        return new Response(
          JSON.stringify({
            reply: `✈️ Am găsit zboruri din ${flight.from_city} spre ${flight.to_city}.`,
            type: "flight",
            cards,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    /* =========================================
       2. AI GENERATION & FALLBACK
       ========================================= */

    if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_KEY") {
      console.warn("⚠️ OPENAI_API_KEY missing - Using Pseudo-AI");

      const lowerPrompt = prompt.toLowerCase();
      let replyText = "Sunt aici să te ajut cu planurile tale de vacanță! Spune-mi unde vrei să mergi. 🌍";
      let cards: any[] = [];
      let intent: any = { type: null };

      // 1. SALUT
      if (lowerPrompt.match(/^(buna|salut|hello|hi|neata)/)) {
        replyText = "Salut! 👋 Unde călătorim astăzi? Caut zboruri, căzări sau inspirație pentru tine?";
      }

      // 2. ACTIVITĂȚI
      else if (lowerPrompt.includes("activitat") || lowerPrompt.includes("ce pot face") || lowerPrompt.includes("tururi")) {
        const cities = ["paris", "roma", "londra", "barcelona", "dubai", "tokyo", "amsterdam", "bucuresti"];
        const foundCity = cities.find(c => lowerPrompt.includes(c));

        if (foundCity) {
          const capitalized = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
          replyText = `Oh, ${capitalized} este o alegere minunată! 🎨\n\nAm găsit câteva experiențe de neuitat pentru tine.`;
          intent = { type: "activity", to: capitalized };
          cards = getAIProvidersByCategory("activity").map(p => buildGenericCard(p, intent));
        } else {
          replyText = "Sună distractiv! În ce oraș te interesează activitățile? 🏙️";
        }
      }

      // 3. MASINI
      else if (lowerPrompt.includes("masina") || lowerPrompt.includes("auto") || lowerPrompt.includes("inchiriere")) {
        const cities = ["dubai", "otopeni", "bucuresti", "milano", "cipru", "grecia"];
        const foundCity = cities.find(c => lowerPrompt.includes(c));

        if (foundCity) {
          const capitalized = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
          replyText = `Pentru ${capitalized} îți recomand să închiriezi o mașină pentru libertate deplină de mișcare. 🚗`;
          intent = { type: "car_rental", to: capitalized };
          cards = getAIProvidersByCategory("car_rental").map(p => buildGenericCard(p, intent));
        } else {
          replyText = "Sigur! În ce destinație ai nevoie de mașină? 🏎️";
        }
      }

      return new Response(
        JSON.stringify({
          reply: replyText,
          message: { text: replyText, confidence: 1 },
          intent,
          cards,
          type: intent.type ? "offer" : null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // REAL AI PATH
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
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) throw new Error(`OpenAI API Error: ${aiRes.status}`);

    const aiJson = await aiRes.json();
    const rawContent = aiJson?.choices?.[0]?.message?.content ?? "";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = { reply: rawContent, intent: { type: null } };
    }

    /* =========================================
       3. INTENT PROCESSING
       ========================================= */
    let cards: any[] = [];
    const intent = parsed.intent || {};

    if (intent.type) {
      // Resolve IATA for flights if needed
      if (intent.type === "flight" && intent.from && intent.to) {
        const fromIata = await resolveToIata(intent.from);
        const toIata = await resolveToIata(intent.to);
        if (fromIata && toIata) {
          intent.from_iata = fromIata;
          intent.to_iata = toIata;
        }
      }

      const providers = getAIProvidersByCategory(intent.type);
      cards = providers.map(p => buildGenericCard(p, intent));
    }

    return new Response(
      JSON.stringify({
        message: {
          text: parsed.reply || "Nu am înțeles exact, poți reformula?",
          confidence: parsed.confidence || 0.8,
        },
        reply: parsed.reply,
        intent: parsed.intent,
        cards,
        type: cards.length > 0 ? "offer" : null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("AI-CHAT FATAL ERROR:", err);
    return new Response(
      JSON.stringify({
        reply: "Am întâmpinat o eroare internă. Te rog încearcă din nou.",
        error: String(err)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
