// ================================
// Aviasales Flight Provider
// Deeplink + Affiliate Tracking
// ================================

type FlightIntent = {
  from?: string;
  to?: string;
  dates?: string | null;
};

/**
 * IATA mapping minimal (extensibil)
 * IMPORTANT: Aviasales lucreaza cu coduri IATA
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
 * (NU API token, doar marker)
 */
const AVIASALES_MARKER = "688834";

/**
 * Default values (fallback safe)
 */
const DEFAULT_ORIGIN = "OTP";
const DEFAULT_DESTINATION = "PAR";

export function getAviasalesOffer(intent: FlightIntent) {
  // Mapare oras → IATA
  const origin =
    (intent.from && IATA_MAP[intent.from]) ?? DEFAULT_ORIGIN;

  const destination =
    (intent.to && IATA_MAP[intent.to]) ?? DEFAULT_DESTINATION;

  // Construim deeplink afiliat Aviasales
  const url = new URL("https://www.aviasales.com/search");

  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);

  // 🔑 AFILIERE (CRITICAL)
  url.searchParams.set("marker", AVIASALES_MARKER);

  // UX / localizare
  url.searchParams.set("locale", "ro");
  url.searchParams.set("currency", "EUR");

  return {
    type: "flight",
    title: `Zbor ${intent.from ?? "București"} → ${intent.to ?? "Paris"}`,
    subtitle: intent.dates ?? "date flexibile",
    provider: "Aviasales",
    cta: {
      label: "Vezi zboruri",
      url: url.toString(),
    },
  };
}
