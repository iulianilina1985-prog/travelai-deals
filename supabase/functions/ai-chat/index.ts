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
    t.match(/din\s+([a-z ]+?)\s+la\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
    t.match(/([a-z ]+?)\s*(?:->|→|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);


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

    /* =========================================
       1. QUICK INTENT (REGEX) - OPTIONAL
       Potențială optimizare pentru zboruri clare
       ========================================= */
    const flight = extractFlightData(prompt);

    if (flight) {
      const fromIata = await resolveToIata(flight.from_city);
      const toIata = await resolveToIata(flight.to_city);

      if (fromIata && toIata) {
        const card = getAviasalesOffer({
          from_iata: fromIata,
          to_iata: toIata,
          depart_date: flight.depart_date,
          return_date: flight.return_date,
          passengers: flight.passengers,
        });

        if (card) {
          return new Response(
            JSON.stringify({
              message: {
                text: `✈️ Am găsit zboruri din ${flight.from_city} spre ${flight.to_city}!`,
                confidence: 1,
              },
              offer: {
                type: "flight",
                card,
              },
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    /* =========================================
       2. AI GENERATION & FALLBACK
       ========================================= */

    // 🛡️ SUPER-MOCK MODE (Pseudo-AI)
    // If we don't have an OpenAI key, OR if the request fails, 
    // we use this logic to generate "natural" responses and offers.
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_KEY") {
      console.warn("⚠️ OPENAI_API_KEY missing - Using Pseudo-AI");

      const lowerPrompt = prompt.toLowerCase();
      let replyText = "Sunt aici să te ajut cu planurile tale de vacanță! Spune-mi unde vrei să mergi. 🌍";
      let offer = null;
      let intent = { type: null };

      // --- LOGICĂ SIMPLĂ DE "CONVERSAȚIE" ---

      // 1. SALUT
      if (lowerPrompt.match(/^(buna|salut|hello|hi|neata)/)) {
        replyText = "Salut! 👋 Unde călătorim astăzi? Caut zboruri, cazări sau inspirație pentru tine?";
      }

      // 2. ACTIVITĂȚI (KLOOK)
      // ex: "ce pot face in paris", "activitati roma"
      if (lowerPrompt.includes("activitat") || lowerPrompt.includes("ce pot face") || lowerPrompt.includes("tururi")) {
        // Extragem orașul simplist
        const cities = ["paris", "roma", "londra", "barcelona", "dubai", "tokyo", "amsterdam", "bucuresti"];
        const foundCity = cities.find(c => lowerPrompt.includes(c));

        if (foundCity) {
          const capitalized = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
          replyText = `Oh, ${capitalized} este o alegere minunată! 🎨\n\nAm găsit câteva experiențe de neuitat pentru tine. De la tururi ghidate la bilete skip-the-line, iată ce recomand:`;

          const { getKlookOffer } = await import("../offers/activities/klook.ts");
          const klookCard = getKlookOffer({ city: capitalized });
          if (klookCard) {
            offer = { type: "offer", card: klookCard };
            intent = { type: "activity", to: capitalized };
          }
        } else {
          replyText = "Sună distractiv! În ce oraș te interesează activitățile? 🏙️";
        }
      }

      // 3. MASINI (LOCALRENT)
      // ex: "vreau masina in dubai", "inchiriere auto"
      else if (lowerPrompt.includes("masina") || lowerPrompt.includes("auto") || lowerPrompt.includes("inchiriere")) {
        const cities = ["dubai", "otopeni", "bucuresti", "milano", "cipru", "grecia"];
        const foundCity = cities.find(c => lowerPrompt.includes(c));

        if (foundCity) {
          const capitalized = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
          replyText = `Pentru ${capitalized} îți recomand să închiriezi o mașină pentru libertate deplină de mișcare. 🚗\n\nAm verificat partenerii locali și am găsit aceste opțiuni:`;

          const { getLocalrentOffer } = await import("../offers/cars/localrent.ts");
          const localrentCard = getLocalrentOffer({ location: capitalized });
          if (localrentCard) {
            offer = { type: "offer", card: localrentCard };
            intent = { type: "car_rental", to: capitalized };
          }
        } else {
          replyText = "Sigur! În ce destinație ai nevoie de mașină? 🏎️";
        }
      }

      // 4. ZBORURI (AVIASALES)
      // ex: "zbor paris", "bilet avion londra"
      else if (lowerPrompt.includes("zbor") || lowerPrompt.includes("avion")) {
        // Logică simplă fallback dacă regex-ul de sus nu a prins
        replyText = "Vrei să zburăm? ✈️ Spune-mi de unde pleci și unde vrei să ajungi (ex: 'zbor București Londra').";
      }

      // 5. GENERIC DESTINATION TALK
      else if (lowerPrompt.includes("paris")) {
        replyText = "Parisul este mereu o idee bună! 🥐 Turnul Eiffel, Luvru, plimbările pe Sena... Te interesează zboruri sau activități acolo?";
      }


      return new Response(
        JSON.stringify({
          // Frontend-ul caută 'reply' în openaiService.js
          reply: replyText,
          message: {
            text: replyText,
            confidence: 1,
          },
          intent,
          offer
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ... restul logicii OpenAI reale (dacă cheia există) ...

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cost efficient
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenAI Error:", aiRes.status, errText);
      throw new Error(`OpenAI API Error: ${aiRes.status}`);
    }

    const aiJson = await aiRes.json();
    const rawContent = aiJson?.choices?.[0]?.message?.content ?? "";
    console.log("AI RAW CONTENT:", rawContent);

    // Parse JSON from AI
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      console.warn("AI returned non-JSON text. Wrapping...", e);
      parsed = {
        reply: rawContent,
        intent: { type: null }
      };
    }

    /* =========================================
       3. INTENT PROCESSING (New Integrations)
       ========================================= */
    let offer = null;
    const intent = parsed.intent || {};

    // A. FLIGHT (Aviasales) - handled by parsing intent IATA (if needed)
    // (Implementation logic normally here, reusing existing simplified regex flow for now 
    // or could expand to use AI's extracted cities)
    // For stricter control, we often rely on the REGEX step above for flights.
    if (intent.type === "flight" && intent.from && intent.to) {
      // Resolve IATA again if AI inferred cities
      // (Implementation logic normally here, reusing existing simplified regex flow for now 
      // or could expand to use AI's extracted cities)
      // For stricter control, we often rely on the REGEX step above for flights.
    }

    // B. ACTIVITY (Klook)
    if (intent.type === "activity" && intent.to) {
      const { getKlookOffer } = await import("../offers/activities/klook.ts");
      const klookCard = getKlookOffer({ city: intent.to });
      if (klookCard) {
        offer = {
          type: "offer",
          card: klookCard
        };
      }
    }

    // C. CAR RENTAL (Localrent)
    if (intent.type === "car_rental" && intent.to) {
      const { getLocalrentOffer } = await import("../offers/cars/localrent.ts");
      const localrentCard = getLocalrentOffer({ location: intent.to });
      if (localrentCard) {
        offer = {
          type: "offer",
          card: localrentCard
        };
      }
    }

    return new Response(
      JSON.stringify({
        message: {
          text: parsed.reply || "Nu am înțeles exact, poți reformula?",
          confidence: parsed.confidence || 0.8,
        },
        // We structure it to match frontend expectation
        // Frontend looks for 'type', 'card', etc. in the root response usually? 
        // Checking frontend code: 
        // const data = await response.json(); 
        // return { ... type: data?.type || null, card: data?.card || null, content: data?.reply ... }
        // So we should map our output closely.

        reply: parsed.reply,
        intent: parsed.intent,
        offer: offer || null, // Ensure offer is passed
        type: offer?.type || null,
        card: offer?.card || null

      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("AI-CHAT FATAL ERROR:", err);
    return new Response(
      JSON.stringify({
        reply: "Am întâmpinat o eroare internă. Te rog încearcă din nou.",
        message: { text: "Eroare internă." },
        error: String(err)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
