// ================================
// Aviasales Flight Provider
// Deeplink + Affiliate Tracking
// ================================

type FlightIntent = {
  from?: string;
  to?: string;
  depart_date?: string;   // YYYY-MM-DD
  return_date?: string;   // YYYY-MM-DD
  passengers?: number;
};

const IATA_MAP: Record<string, string> = {
  București: "OTP",
  Bucuresti: "OTP",
  Paris: "PAR",
  Roma: "ROM",
  Londra: "LON",
  Milano: "MIL",
};

const AVIASALES_MARKER = "688834";

const DEFAULT_ORIGIN = "OTP";
const DEFAULT_DESTINATION = "PAR";

export function getAviasalesOffer(intent: FlightIntent) {
  const origin = IATA_MAP[intent.from ?? ""] ?? DEFAULT_ORIGIN;
  const destination = IATA_MAP[intent.to ?? ""] ?? DEFAULT_DESTINATION;

  const url = new URL("https://www.aviasales.com/search");

  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  url.searchParams.set("marker", AVIASALES_MARKER);
  url.searchParams.set("locale", "ro");
  url.searchParams.set("currency", "EUR");

  if (intent.depart_date) {
    url.searchParams.set("depart_date", intent.depart_date);
  }

  if (intent.return_date) {
    url.searchParams.set("return_date", intent.return_date);
  }

  if (intent.passengers) {
    url.searchParams.set("adults", String(intent.passengers));
  }

  return {
    type: "flight",
    title: `Zbor ${intent.from ?? "București"} → ${intent.to ?? "Paris"}`,
    subtitle:
      intent.depart_date && intent.return_date
        ? `${intent.depart_date} → ${intent.return_date}`
        : "date flexibile",
    provider: "Aviasales",
    meta: {
      from: origin,
      to: destination,
      depart_date: intent.depart_date ?? null,
      return_date: intent.return_date ?? null,
    },
    cta: {
      label: "Vezi zboruri",
      url: url.toString(),
    },
  };
}
