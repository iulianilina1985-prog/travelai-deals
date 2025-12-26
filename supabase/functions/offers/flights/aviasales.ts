// ================================
// Aviasales Flight Provider
// Deeplink + Affiliate Tracking
// ================================

type FlightIntent = {
  from?: string;
  to?: string;
  depart_date?: string;   // YYYY-MM-DD
  return_date?: string;   // YYYY-MM-DD | undefined
};

/**
 * IATA mapping minimal (extensibil)
 */
const IATA_MAP: Record<string, string> = {
  // Romania
  "București": "OTP",
  "Bucuresti": "OTP",

  // Europe
  "Paris": "PAR",
  "Roma": "ROM",
  "Londra": "LON",
  "Milano": "MIL",
  "Barcelona": "BCN",
  "Madrid": "MAD",
  "Berlin": "BER",
};

/**
 * Travelpayouts / Aviasales Partner ID
 */
const AVIASALES_MARKER = "688834";

/**
 * Fallback safe
 */
const DEFAULT_ORIGIN = "OTP";
const DEFAULT_DESTINATION = "PAR";

export function getAviasalesOffer(intent: FlightIntent) {
  const origin =
    (intent.from && IATA_MAP[intent.from]) ?? DEFAULT_ORIGIN;

  const destination =
    (intent.to && IATA_MAP[intent.to]) ?? DEFAULT_DESTINATION;

  const url = new URL("https://www.aviasales.com/search");

  // 🔑 RUTA
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);

  // 📅 DATE – CRITICAL
  if (intent.depart_date) {
    url.searchParams.set("depart_date", intent.depart_date);
  }

  if (intent.return_date) {
    url.searchParams.set("return_date", intent.return_date);
  }

  // 👤 DEFAULT UX
  url.searchParams.set("adults", "1");
  url.searchParams.set("travel_class", "economy");

  // 🌍 Localizare
  url.searchParams.set("locale", "ro");
  url.searchParams.set("currency", "EUR");

  // 💰 AFILIERE (NU SE ATINGE)
  url.searchParams.set("marker", AVIASALES_MARKER);

  return {
    type: "flight",
    title: `Zbor ${intent.from ?? "București"} → ${intent.to ?? "Paris"}`,
    subtitle: buildSubtitle(intent),
    provider: "Aviasales",
    cta: {
      label: "Vezi zboruri",
      url: url.toString(),
    },
  };
}

/* ============================= */

function buildSubtitle(intent: FlightIntent) {
  if (intent.depart_date && intent.return_date) {
    return `📅 ${formatDate(intent.depart_date)} – ${formatDate(intent.return_date)}`;
  }

  if (intent.depart_date) {
    return `📅 Plecare: ${formatDate(intent.depart_date)}`;
  }

  return "Date flexibile";
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}
