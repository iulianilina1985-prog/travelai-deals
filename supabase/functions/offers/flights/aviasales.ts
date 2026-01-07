// ================================
// Aviasales Flight Provider
// IATA ONLY – STRICT
// ================================

export type FlightIntent = {
  from_iata: string;      // "PAR"
  to_iata: string;        // "LON"
  from_city?: string;     // "Paris"
  to_city?: string;       // "Londra"
  depart_date?: string;  // YYYY-MM-DD
  return_date?: string;  // YYYY-MM-DD
  passengers?: number;
};

const AVIASALES_MARKER = "688834";
const TOKEN = Deno.env.get("TRAVELPAYOUTS_API_TOKEN");

/* ================= HELPERS ================= */

function safe(v?: string): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > 0 ? s : null;
}

function isIata(v: string) {
  return /^[A-Z]{3}$/.test(v);
}

function makeCardId(intent: FlightIntent) {
  return [
    "flight",
    "aviasales",
    intent.from_iata,
    intent.to_iata,
    intent.depart_date ?? "",
    intent.return_date ?? "",
    intent.passengers ?? 1,
  ]
    .join("|")
    .toLowerCase();
}

/**
 * Validates text dates YYYY-MM-DD and converts to DDMM for Aviasales Short Link
 */
function toShortDate(isoDate: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  // 2024-05-20 -> 2005
  const param = isoDate.slice(8, 10) + isoDate.slice(5, 7);
  return param;
}

/**
 * Builds the compact URL: aviasales.com/search/OTP1205LHR15051
 */
function buildDeepLink(from: string, to: string, depart?: string, ret?: string, pax = 1) {
  const base = "https://www.aviasales.com/search";

  if (!depart) {
    // Fallback to query params if no date
    return `${base}?origin=${from}&destination=${to}&marker=${AVIASALES_MARKER}&locale=ro`;
  }

  const d1 = toShortDate(depart);
  if (!d1) return `${base}?origin=${from}&destination=${to}&marker=${AVIASALES_MARKER}&locale=ro`;

  let path = `${from}${d1}${to}`;

  if (ret) {
    const d2 = toShortDate(ret);
    if (d2) {
      path += d2;
    }
  }

  // Append passengers (at least 1)
  path += String(pax);

  return `${base}/${path}?marker=${AVIASALES_MARKER}&locale=ro&currency=EUR`;
}

/**
 * Fetch price from TravelPayouts "cheap" API
 */


/* ================= PROVIDER ================= */

export async function getAviasalesOffer(intent: FlightIntent) {
  const from = safe(intent.from_iata)?.toUpperCase();
  const to = safe(intent.to_iata)?.toUpperCase();

  if (!from || !to || !isIata(from) || !isIata(to)) {
    return null; // 🔒 HARD FAIL – fără IATA
  }

  const passengers =
    typeof intent.passengers === "number" && intent.passengers > 0
      ? intent.passengers
      : 1;

  // 1. Build Better Link
  const link = buildDeepLink(from, to, intent.depart_date, intent.return_date, passengers);



  const fromLabel = intent.from_city
    ? `${intent.from_city} (${from})`
    : from;

  const toLabel = intent.to_city
    ? `${intent.to_city} (${to})`
    : to;

  const dateLabel =
    intent.depart_date && intent.return_date
      ? `${intent.depart_date} – ${intent.return_date}`
      : intent.depart_date ?? "";

  return {
    type: "flight",
    provider: "Aviasales",

    title: `Zbor ${fromLabel} → ${toLabel}`,
    subtitle: `${dateLabel}${dateLabel ? " · " : ""}${passengers} adulți`,

    from,
    to,
    passengers,


    dates: {
      start: intent.depart_date,
      end: intent.return_date,
    },

    id: makeCardId(intent),
    image_url: "/assets/flight/flight.jpg",

    provider_meta: {
      id: "aviasales",
      name: "Aviasales",
      brand_color: "#2563eb",
    },

    cta: {
      label: "Vezi zboruri pe Aviasales",
      url: link,
    },

  };
}
