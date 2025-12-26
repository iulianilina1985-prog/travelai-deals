import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const MONTHS: Record<string, string> = {
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

function detectIntent(text: string) {
  const lower = text.toLowerCase();
  if (/\b(zbor|avion|flight)\b/.test(lower)) return "flight";
  if (/\b(hotel|cazare)\b/.test(lower)) return "hotel";
  if (/\b(activitati|activități|bilete)\b/.test(lower)) return "activity";
  return "unknown";
}

function extractCities(text: string) {
  const lower = text.toLowerCase();

  const from =
    lower.includes("bucure") ? "București" : null;

  const to =
    lower.includes("paris") ? "Paris" :
    lower.includes("roma") ? "Roma" :
    lower.includes("londra") ? "Londra" :
    null;

  return { from, to };
}

/**
 * Acceptă:
 * - 22.02.2026 - 24.02.2026
 * - 22 februarie 2026 - 24 februarie 2026
 */
function extractDates(text: string) {
  // ISO format
  const isoMatch = text.match(
    /(\d{4}-\d{2}-\d{2})\s*(?:-|–|până la)\s*(\d{4}-\d{2}-\d{2})/
  );

  if (isoMatch) {
    return {
      depart_date: isoMatch[1],
      return_date: isoMatch[2],
      dates_human: `${isoMatch[1]} – ${isoMatch[2]}`,
    };
  }

  // Romanian format
  const roMatch = text.match(
    /(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})\s*(?:-|–|până la)\s*(\d{1,2})\s+\2\s+\3/i
  );

  if (!roMatch) return null;

  const day1 = roMatch[1].padStart(2, "0");
  const month = MONTHS[roMatch[2].toLowerCase()];
  const year = roMatch[3];
  const day2 = roMatch[4].padStart(2, "0");

  return {
    depart_date: `${year}-${month}-${day1}`,
    return_date: `${year}-${month}-${day2}`,
    dates_human: `${day1} – ${day2} ${roMatch[2]} ${year}`,
  };
}

// --------------------------------------------------
// SERVER
// --------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  const body = await req.json();
  const prompt = body?.prompt ?? "";

  const type = detectIntent(prompt);
  const { from, to } = extractCities(prompt);
  const dates = extractDates(prompt);

  let reply = "Spune-mi cu ce te pot ajuta 😊";

  if (type === "flight") {
    reply = `Perfect! ✈️  
Caut zboruri ${from ? `din ${from}` : ""}${to ? ` spre ${to}` : ""}${
      dates ? ` (${dates.dates_human})` : ""
    }.

Îți afișez imediat opțiunile disponibile.`;
  }

  return new Response(
    JSON.stringify({
      reply,
      intent: {
        type,
        from,
        to,
        ...dates,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
});
