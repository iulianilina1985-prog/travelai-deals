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

function detectLang(text: string) {
  const t = strip(text);
  if (t.includes("zbor") || t.includes("spre") || t.includes("catre") || t.includes("bucuresti")) return "ro";
  if (t.includes("flight") || t.includes("from") || t.includes("to")) return "en";
  return "ro";
}

async function getCheapestFlightPrice(fromIata: string, toIata: string, date: string) {
  if (!TRAVELPAYOUTS_TOKEN) {
    console.error("TRAVELPAYOUTS_API_TOKEN is missing!");
    return null;
  }

  // Prefer V3 prices_for_dates (exact date only)
  const v3Url = new URL("https://api.travelpayouts.com/aviasales/v3/prices_for_dates");
  v3Url.searchParams.set("origin", fromIata);
  v3Url.searchParams.set("destination", toIata);
  v3Url.searchParams.set("departure_at", date); // YYYY-MM-DD
  v3Url.searchParams.set("one_way", "true");
  v3Url.searchParams.set("direct", "false");
  v3Url.searchParams.set("sorting", "price");
  v3Url.searchParams.set("limit", "10");
  v3Url.searchParams.set("currency", "EUR");
  v3Url.searchParams.set("token", TRAVELPAYOUTS_TOKEN);

  console.log(`TP V3 Fetch: ${v3Url.toString().replace(TRAVELPAYOUTS_TOKEN, "***")}`);
  try {
    const res = await fetch(v3Url);
    const json = await res.json();

    if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
      const exact = json.data.find((o: any) => {
        const dep = o.departure_at || o.depart_date || o.departure_date || "";
        return typeof dep === "string" && dep.startsWith(date);
      });

      if (exact && Number.isFinite(Number(exact.price))) {
        const currency = exact.currency || "EUR";
        return {
          price: null,
          currency,
          transfers: exact.transfers,
          airline: exact.airline,
          flight_number: exact.flight_number,
          depart_at: exact.departure_at || exact.depart_date || exact.departure_date,
          found_at: exact.found_at ?? null,
          is_exact: true
        };
      }
    }
  } catch (err) {
    console.error("TP V3 Error:", err);
  }

  // Fallback: V2 latest (exact date only)
  const v2Url =
    `https://api.travelpayouts.com/v2/prices/latest` +
    `?origin=${fromIata}` +
    `&destination=${toIata}` +
    `&period_type=month` +
    `&beginning_of_period=${date.slice(0, 7)}-01` +
    `&currency=EUR` +
    `&limit=100` +
    `&token=${TRAVELPAYOUTS_TOKEN}`;

  console.log(`TP V2 Fetch: ${v2Url.replace(TRAVELPAYOUTS_TOKEN, "***")}`);
  try {
    const res = await fetch(v2Url);
    const json = await res.json();

    if (!json?.success || !json?.data || !Array.isArray(json.data)) {
      return null;
    }

    const exactDay = json.data.find((o: any) => o.depart_date === date);
    if (exactDay && Number.isFinite(Number(exactDay.value))) {
      return {
        price: null,
        currency: null,
        transfers: exactDay.number_of_changes,
        airline: exactDay.gate,
        flight_number: exactDay.flight_number,
        depart_at: exactDay.depart_date,
        found_at: exactDay.found_at,
        is_exact: true
      };
    }

    return null;
  } catch (err) {
    console.error("TP V2 Error:", err);
    return null;
  }
}


/* ================= FLIGHT PARSER ================= */

function extractFlightData(text: string) {
  const t = strip(text);

  if (!t.includes("zbor") && !t.includes("avion") && !t.includes("flight") && !t.includes("fly")) return null;

  const routeMatch =
    t.match(/din\s+([a-z ]+?)\s+(?:la|spre|catre)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/(?:la|spre|catre)\s+([a-z ]+?)\s+din\s+([a-z ]+?)(?=\s+\d|\s*$)/)?.slice(1).reverse() ||
    t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/avion\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/from\s+([a-z ]+?)\s+(?:to|towards)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/(?:to|towards)\s+([a-z ]+?)\s+from\s+([a-z ]+?)(?=\s+\d|\s*$)/)?.slice(1).reverse() ||
    t.match(/(?:flight|fly)\s+(?:for\s+)?(?:from\s+)?([a-z ]+?)\s+(?:to|towards)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/([a-z ]+?)\s*(?:->|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);

  if (!routeMatch) return null;

  const from = routeMatch[1].trim();
  const to = routeMatch[2].trim();

  const paxMatch = t.match(/(\d+)\s*(pasageri|persoane|adulti|passengers|people|person|persons|adults|pax)/);
  const passengers = paxMatch ? Number(paxMatch[1]) : 1;

  const monthMap: Record<string, string> = {
    ianuarie: "01", februarie: "02", martie: "03", aprilie: "04",
    mai: "05", iunie: "06", iulie: "07", august: "08",
    septembrie: "09", octombrie: "10", noiembrie: "11", decembrie: "12",
    january: "01", february: "02", march: "03", april: "04",
    may: "05", june: "06", july: "07", august: "08",
    september: "09", october: "10", november: "11", december: "12"
  };

  let day, month, year;

  const textDate = t.match(
    /(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie|january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/
  );

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
    description: p.description,
    price: null,
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
        const live = null;

        // Populate intent even if price is null
        flightIntent = {
          type: "flight",
          ...flightMatch,
          from_iata: fromIata,
          to_iata: toIata,
          price: null,
          currency: null,
          transfers: null,
          airline: null,
          flight_number: null,
          depart_at: null
        };

        pricingContext = "";
        console.log("Price display disabled to avoid inaccurate quotes.");
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

      // 4. HOTELURI
      else if (lowerPrompt.includes("hotel") || lowerPrompt.includes("cazare") || lowerPrompt.includes("pensiun")) {
        const cities = ["paris", "roma", "londra", "barcelona", "dubai", "tokyo", "amsterdam", "bucuresti"];
        const foundCity = cities.find(c => lowerPrompt.includes(c));

        if (foundCity) {
          const capitalized = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
          replyText = `Am găsit câteva opțiuni de cazare superbe în ${capitalized}. 🏨`;
          intent = { type: "hotel", to: capitalized };
          cards = getAIProvidersByCategory("hotel").map(p => buildGenericCard(p, intent));
        } else {
          replyText = "Te pot ajuta să găsești cea mai bună cazare! În ce oraș vrei să stai? 🏨";
        }
      }

      // 4. ZBORURI (Pseudo-AI fallback)
      else if (flightIntent) {
        replyText = `Am găsit zborul tău către ${flightIntent.to_city}. Poți vedea prețurile actualizate pe link.`;
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

















