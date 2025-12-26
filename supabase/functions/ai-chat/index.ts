import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/**
 * AI-CHAT
 * Rol: interpretează intenția userului
 * NU conține afiliere, provider, prețuri sau CTA
 * Doar conversație + intent
 */

// --------------------------------------------------
// INTENT DETECTION
// --------------------------------------------------
function detectIntent(text: string) {
  const lower = text.toLowerCase();

  if (lower.match(/\b(zbor|avion|flight)\b/)) return "flight";
  if (lower.match(/\b(hotel|cazare)\b/)) return "hotel";
  if (lower.match(/\b(activitati|activități|bilete|ce pot face)\b/))
    return "activity";

  return "unknown";
}

// --------------------------------------------------
// ENTITY EXTRACTION
// --------------------------------------------------
function extractCities(text: string) {
  const lower = text.toLowerCase();

  const toCity =
    lower.includes("paris") ? "Paris" :
    lower.includes("roma") ? "Roma" :
    lower.includes("londra") ? "Londra" :
    null;

  const fromCity =
    lower.includes("bucure") ? "București" : null;

  return { fromCity, toCity };
}

function extractDates(text: string) {
  const match = text.match(
    /(\d{1,2})\s*(?:și|si|-|–|pana la|între)\s*(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)/i
  );

  if (!match) return null;
  return `${match[1]} – ${match[2]} ${match[3]}`;
}

// --------------------------------------------------
// SERVER
// --------------------------------------------------
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, apikey, content-type",
      },
    });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const prompt = body?.prompt ?? "";

  const intentType = detectIntent(prompt);
  const { fromCity, toCity } = extractCities(prompt);
  const dates = extractDates(prompt);

  let reply = "Spune-mi cu ce te pot ajuta 😊";

  // --------------------------------------------------
  // CONVERSATIONAL + PROACTIVE REPLIES
  // --------------------------------------------------
  if (intentType === "flight") {
    reply = `Perfect! ✈️  
Caut zboruri ${fromCity ? `din ${fromCity}` : ""}${
      toCity ? ` spre ${toCity}` : ""
    }${dates ? ` (${dates})` : ""}.

Îți afișez imediat opțiunile disponibile.  
Vrei să mă uit și după **cazare**, **mașină de închiriat** sau **activități** la destinație?`;
  }

  if (intentType === "hotel") {
    reply = `Super 🏨  
Mă uit după cazări potrivite pentru tine${
      toCity ? ` în ${toCity}` : ""
    }.

Îți arăt opțiunile imediat.  
Dacă vrei, pot verifica și **zboruri** sau **activități** în zonă.`;
  }

  if (intentType === "activity") {
    reply = `Sună bine 🎟  
Caut activități populare${toCity ? ` în ${toCity}` : ""}.

Îți arăt variantele disponibile.  
Spune-mi dacă ai nevoie și de **zbor** sau **cazare**.`;
  }

  if (intentType === "unknown") {
    reply = `Te ajut cu plăcere 😊  
Pot căuta pentru tine **zboruri**, **cazare**, **mașini de închiriat** sau **activități**.

Spune-mi ce plan ai.`;
  }

  const response = {
    reply,
    intent: {
      type: intentType,
      from: fromCity,
      to: toCity,
      dates,
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
