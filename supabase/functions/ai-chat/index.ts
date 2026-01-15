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

const TRAVELPAYOUTS_TOKEN = Deno.env.get("TRAVELPAYOUTS_API_TOKEN");

async function getCheapestFlightPrice(fromIata: string, toIata: string, date: string) {
  if (!TRAVELPAYOUTS_TOKEN) {
    console.error("❌ TRAVELPAYOUTS_API_TOKEN is missing!");
    return null;
  }

  // Use V2 Latest API - it's often more reliable than the V1 Calendar
  const url =
    `https://api.travelpayouts.com/v2/prices/latest` +
    `?origin=${fromIata}` +
    `&destination=${toIata}` +
    `&period_type=month` +
    `&beginning_of_period=${date.slice(0, 7)}-01` + // First of month
    `&currency=EUR` +
    `&limit=100` +
    `&token=${TRAVELPAYOUTS_TOKEN}`;

  console.log(`🔍 TP V2 Fetch: ${url.replace(TRAVELPAYOUTS_TOKEN, "***")}`);
  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json?.success || !json?.data || !Array.isArray(json.data)) {
      console.log("⚠️ TP V2 API Error:", JSON.stringify(json).slice(0, 200));
      return null;
    }

    const allOffers = json.data;
    console.log(`� Found ${allOffers.length} offers in cache.`);

    // 1. Try to find the exact date
    const exactDay = allOffers.find((o: any) => o.depart_date === date);
    if (exactDay) {
      console.log(`✅ Exact Match: ${exactDay.value} EUR (Found at: ${exactDay.found_at})`);
      return {
        price: exactDay.value,
        transfers: exactDay.number_of_changes,
        airline: exactDay.gate, // V2 uses gate or airline
        flight_number: exactDay.flight_number,
        depart_at: exactDay.depart_date,
        found_at: exactDay.found_at
      };
    }

    // 2. Fallback: cheapest in the whole result
    const cheapest = allOffers.sort((a: any, b: any) => a.value - b.value)[0];
    if (cheapest) {
      console.log(`💡 Suggesting cheapest: ${cheapest.value} EUR on ${cheapest.depart_date}`);
      return {
        price: cheapest.value,
        transfers: cheapest.number_of_changes,
        airline: cheapest.gate,
        flight_number: cheapest.flight_number,
        depart_at: cheapest.depart_date,
        found_at: cheapest.found_at,
        is_approximate: true
      };
    }

    return null;
  } catch (err) {
    console.error("❌ TP API Fatal Error:", err);
    return null;
  }
}



/* ================= FLIGHT PARSER ================= */

function extractFlightData(text: string) {
  const t = strip(text);

  if (!t.includes("zbor") && !t.includes("avion")) return null;

  // ==== RUTĂ ====
  const routeMatch =
    t.match(/din\s+([a-z ]+?)\s+(?:la|spre|catre)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||

    // catre paris din bucuresti
    t.match(/(?:la|spre|catre)\s+([a-z ]+?)\s+din\s+([a-z ]+?)(?=\s+\d|\s*$)/)?.slice(1).reverse() ||

    t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/avion\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/([a-z ]+?)\s*(?:->|→|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);


  if (!routeMatch) return null;

  const from = routeMatch[1].trim();
  const to = routeMatch[2].trim();

  // ==== PASAGERI ====
  const paxMatch = t.match(/(\d+)\s*(pasageri|persoane|adulti)/);
  const passengers = paxMatch ? Number(paxMatch[1]) : 1;

  // ==== LUNI ====
  const monthMap: Record<string, string> = {
    ianuarie: "01", februarie: "02", martie: "03", aprilie: "04",
    mai: "05", iunie: "06", iulie: "07", august: "08",
    septembrie: "09", octombrie: "10", noiembrie: "11", decembrie: "12",
  };

  let day, month, year;

  // TEXT: 22 mai 2026
  const textDate = t.match(
    /(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
  );

  // NUMERIC: 22.02.2026 | 22/02/2026 | 22-02-2026
  const numericDate = t.match(
    /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/
  );

  if (textDate) {
    day = textDate[1];
    month = monthMap[textDate[2]];
    year = textDate[3];
  }
  else if (numericDate) {
    day = numericDate[1];
    month = numericDate[2].padStart(2, "0");
    year = numericDate[3];
  }
  else {
    return null;
  }

  const pad = (n: string) => n.padStart(2, "0");

  return {
    from_city: from,
    to_city: to,
    depart_date: `${year}-${month}-${pad(day)}`,
    passengers,
  };
}



function buildGenericCard(p: AffiliateProvider, intent: any) {
  const link = p.buildLink(intent);
  const isFlight = intent.type === "flight";

  return {
    id: `${p.id}|${intent.to || intent.to_city || "gen"}`,
    type: intent.type,
    provider: p.name,
    title: isFlight
      ? `Zbor ${intent.from_city || intent.from || ""} → ${intent.to_city || intent.to || ""}`
      : `${p.name} - ${intent.to || intent.to_city || "Destinație"}`,
    description: intent.price
      ? `De la €${intent.price} • ${intent.transfers === 0 ? "Direct" : (intent.transfers ? `${intent.transfers} escale` : "Zbor disponibil")}`
      : p.description,
    price: intent.price,
    transfers: intent.transfers,
    depart_date: intent.depart_date,
    airline: intent.airline,
    flight_number: intent.flight_number,
    image_url: p.image_url,
    provider_meta: {
      id: p.id,
      name: p.name,
      brand_color: p.brandColor
    },
    cta: {
      label: (isFlight && intent.price) ? `Vezi zborul de la €${intent.price}` : p.ctaLabel,
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
       1. DATA EXTRACTION (REGEX)
       ========================================= */
    const flightMatch = extractFlightData(prompt);
    let pricingContext = "";
    let flightIntent = null;

    if (flightMatch) {
      console.log("📍 Flight Regex Match:", JSON.stringify(flightMatch));
      const fromIata = await resolveToIata(flightMatch.from_city);
      const toIata = await resolveToIata(flightMatch.to_city);

      if (fromIata && toIata) {
        console.log(`📍 Resolved IATAs: ${fromIata} -> ${toIata}`);
        const live = await getCheapestFlightPrice(fromIata, toIata, flightMatch.depart_date);

        // Populate intent even if price is null
        flightIntent = {
          type: "flight",
          ...flightMatch,
          from_iata: fromIata,
          to_iata: toIata,
          price: live?.price,
          transfers: live?.transfers,
          airline: live?.airline,
          flight_number: live?.flight_number,
          depart_at: live?.depart_at
        };

        if (live) {
          console.log(`✅ Live Data: ${live.price} EUR, Date: ${live.depart_at}, Cache Age: ${live.found_at}`);
          const isExact = live.depart_at?.startsWith(flightMatch.depart_date);

          pricingContext = `
[CONTEXT LIVE ZBOR]
Ruta: ${flightMatch.from_city} (${fromIata}) -> ${flightMatch.to_city} (${toIata})
Data Căutată: ${flightMatch.depart_date}
Data Găsită în Cache: ${live.depart_at}
Status Data: ${isExact ? "EXACTĂ" : "APROXIMATIVĂ (cea mai ieftină găsită recent)"}
Ultima actualizare în cache: ${live.found_at}
Pasageri: ${flightMatch.passengers}
Preț minim: ${live.price} EUR
Escale: ${live.transfers === 0 ? "Direct" : (live.transfers || "Necunoscut")}

INSTRUCȚIUNI: 
1. Dacă data găsită nu este exactă, spune "Prețurile pentru acea perioadă pornesc de la...".
2. Menționează că prețul poate varia în funcție de disponibilitatea live.
`;
        } else {
          console.log("⚠️ No live price found. Using regex data only.");
          pricingContext = `
[CONTEXT ZBOR - PREȚ INDISPONIBIL]
Ruta: ${flightMatch.from_city} (${fromIata}) -> ${flightMatch.to_city} (${toIata})
Data: ${flightMatch.depart_date}
Pasageri: ${flightMatch.passengers}
IMPORTANT: Spune-i utilizatorului că nu ai găsit un preț instant, dar poate verifica ofertele actualizate folosind cardul de mai jos.
`;
        }
      } else {
        console.log("⚠️ Could not resolve IATAs for one or both cities.");
      }
    } else {
      console.log("ℹ️ No flight intent detected by regex.");
    }


    /* =========================================
       2. AI GENERATION
       ========================================= */

    if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_KEY") {
      // (Keep pseudo-ai logic for emergency but simplified)
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

      // 4. ZBORURI (Pseudo-AI fallback)
      else if (flightIntent) {
        replyText = `Am găsit zborul tău către ${flightIntent.to_city}! ${flightIntent.price ? `Prețul este de la ${flightIntent.price}€.` : "Poți vedea prețurile actualizate pe link."}`;
        intent = flightIntent;
        cards = getAIProvidersByCategory("flight").map(p => buildGenericCard(p, intent));
      }

      console.log("🤖 Pseudo-AI Reply:", replyText);

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
    console.log("💉 Injecting context for AI:", pricingContext ? "YES" : "NO");
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + (pricingContext ? `\n\n${pricingContext}` : "") },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) throw new Error(`OpenAI API Error: ${aiRes.status}`);

    const aiJson = await aiRes.json();
    const rawContent = aiJson?.choices?.[0]?.message?.content ?? "";
    console.log("🧠 AI Raw Response:", rawContent.slice(0, 100));

    let parsed: any = {};
    try {
      // Handle potential markdown wrapping
      const cleanContent = rawContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleanContent);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err, "Raw:", rawContent);
      parsed = { reply: rawContent, intent: { type: null } };
    }

    /* =========================================
       3. INTENT PROCESSING
       ========================================= */
    let cards: any[] = [];
    const intent = flightIntent || parsed.intent || {};

    if (intent.type) {
      // Resolve IATA for flights if needed (unlikely if regex caught it, but good for pure AI)
      if (intent.type === "flight" && intent.from && intent.to && !intent.from_iata) {
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
          text: parsed.reply || (
            intent.type === "flight"
              ? `✈️ Am găsit zboruri din ${intent.from_city || intent.from || "?"} spre ${intent.to_city || intent.to || "?"}.`
              : "Nu am înțeles exact, poți reformula?"
          ),
          confidence: parsed.confidence || 0.8,
        },
        reply: parsed.reply || null,
        intent: intent,
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
