import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// ==================================================
// CONSTANTE
// ==================================================

const MONTHS_RO: Record<string, string> = {
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

// ==================================================
// INTENT
// ==================================================

function detectIntent(text: string) {
  const t = text.toLowerCase();

  if (/\b(zbor|avion|flight)\b/.test(t)) return "flight";
  if (/\b(hotel|cazare)\b/.test(t)) return "hotel";
  if (/\b(activitati|activități|bilete)\b/.test(t)) return "activity";

  return "unknown";
}

// ==================================================
// CITIES
// ==================================================

function extractCities(text: string) {
  const t = text.toLowerCase();

  const from = t.includes("bucure") ? "București" : null;

  const to =
    t.includes("paris") ? "Paris" :
    t.includes("roma") ? "Roma" :
    t.includes("londra") ? "Londra" :
    t.includes("milano") ? "Milano" :
    null;

  return { from, to };
}

// ==================================================
// DATE PARSING (TOLERANT)
// ==================================================

function normalizeDate(day: string, month: string, year: string) {
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function extractDates(text: string) {
  const t = text.toLowerCase();

  // -----------------------------
  // ISO RANGE: 2026-02-22 - 2026-02-24
  // -----------------------------
  const isoRange = t.match(
    /(\d{4}-\d{2}-\d{2})\s*(?:-|–|pana la|până la)\s*(\d{4}-\d{2}-\d{2})/
  );

  if (isoRange) {
    return {
      depart_date: isoRange[1],
      return_date: isoRange[2],
      dates_confidence: "high",
    };
  }

  // -----------------------------
  // RO RANGE: 22 - 24 februarie 2026
  // -----------------------------
  const roRange = t.match(
    /(\d{1,2})\s*(?:-|–|pana la|până la)\s*(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
  );

  if (roRange) {
    const [, d1, d2, m, y] = roRange;
    return {
      depart_date: normalizeDate(d1, MONTHS_RO[m], y),
      return_date: normalizeDate(d2, MONTHS_RO[m], y),
      dates_confidence: "high",
    };
  }

  // -----------------------------
  // SINGLE DATE: 22.02.2026 / 22-02-2026 / 22/02/2026
  // -----------------------------
  const numeric = t.match(
    /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/
  );

  if (numeric) {
    const [, d, m, y] = numeric;
    return {
      depart_date: normalizeDate(d, m, y),
      return_date: null,
      dates_confidence: "medium",
    };
  }

  // -----------------------------
  // RO SINGLE DATE: 22 februarie 2026
  // -----------------------------
  const roSingle = t.match(
    /(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
  );

  if (roSingle) {
    const [, d, m, y] = roSingle;
    return {
      depart_date: normalizeDate(d, MONTHS_RO[m], y),
      return_date: null,
      dates_confidence: "medium",
    };
  }

  return {
    depart_date: null,
    return_date: null,
    dates_confidence: "low",
  };
}

// ==================================================
// SERVER
// ==================================================

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

  const intentType = detectIntent(prompt);
  const { from, to } = extractCities(prompt);
  const dates = extractDates(prompt);

  let reply = "Spune-mi cu ce te pot ajuta 😊";

  if (intentType === "flight") {
    if (dates.dates_confidence === "low") {
      reply = `Am înțeles că vrei un zbor ✈️${from ? ` din ${from}` : ""}${
        to ? ` spre ${to}` : ""
      }.

📅 Îmi poți spune **datele exacte**?  
De exemplu: **22.02.2026 – 24.02.2026**`;
    } else if (dates.return_date === null) {
      reply = `Perfect ✈️  
Am notat plecarea pe **${dates.depart_date}**.

📅 Spune-mi și **data de întoarcere**, dacă este un zbor dus-întors.`;
    } else {
      reply = `Perfect! ✈️  
Caut zboruri ${from ? `din ${from}` : ""}${to ? ` spre ${to}` : ""}  
📅 **${dates.depart_date} → ${dates.return_date}**

Îți afișez imediat opțiunile disponibile.`;
    }
  }

  return new Response(
    JSON.stringify({
      reply,
      intent: {
        type: intentType,
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
