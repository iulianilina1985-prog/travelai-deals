import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/**
 * AI-CHAT
 * Rol: interpreteaza intentia userului
 * NU contine afiliere, provider, preturi sau CTA
 */

function detectIntent(text: string) {
  const lower = text.toLowerCase();

  if (
    lower.includes("zbor") ||
    lower.includes("flight") ||
    lower.includes("avion")
  ) {
    return "flight";
  }

  if (
    lower.includes("hotel") ||
    lower.includes("cazare")
  ) {
    return "hotel";
  }

  if (
    lower.includes("activitati") ||
    lower.includes("activități") ||
    lower.includes("ce pot face") ||
    lower.includes("bilete")
  ) {
    return "activity";
  }

  return "unknown";
}

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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
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

  let reply = "Am înțeles cererea ta 😊";

  if (intentType === "flight") {
    reply = "Caut opțiuni de zbor pentru tine ✈️";
  } else if (intentType === "hotel") {
    reply = "Caut opțiuni de cazare pentru tine 🏨";
  } else if (intentType === "activity") {
    reply = "Caut activități potrivite pentru tine 🎟";
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
