// ================================
// Aviasales Flight Provider
// Deeplink + Affiliate Tracking
// ================================

type FlightIntent = {
  from?: string;
  to?: string;
  depart_date?: string; // YYYY-MM-DD
  return_date?: string; // YYYY-MM-DD
  passengers?: number;
};

// NOTE: Aviasales accepta city/airport codes.
// Aici pastram mapping simplu (oras -> cod).
const IATA_MAP: Record<string, string> = {
  // Romania
  "București": "OTP",
  "Bucuresti": "OTP",
  "Craiova": "CRA",
  "Cluj": "CLJ",
  "Cluj-Napoca": "CLJ",
  "Iasi": "IAS",
  "Iași": "IAS",
  "Timisoara": "TSR",
  "Timișoara": "TSR",

  // Europe
  "Paris": "PAR",
  "Roma": "ROM",
  "Londra": "LON",
  "Milano": "MIL",

  // Brussels
  "Bruxel": "BRU",
  "Bruxelles": "BRU",
  "Brussels": "BRU",
};

const AVIASALES_MARKER = "688834";

// fallback doar daca chiar lipsesc datele
const DEFAULT_ORIGIN = "OTP";
const DEFAULT_DESTINATION = "PAR";

function normKey(v?: string) {
  return String(v ?? "").trim();
}

function makeCardId(intent: FlightIntent, origin: string, destination: string) {
  const raw = `flight|aviasales|${intent.from ?? ""}|${intent.to ?? ""}|${origin}|${destination}|${intent.depart_date ?? ""}|${intent.return_date ?? ""}|${intent.passengers ?? 1}`;
  return raw.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-|]/g, "");
}

export function getAviasalesOffer(intent: FlightIntent) {
  const fromLabel = normKey(intent.from) || "București";
  const toLabel = normKey(intent.to) || "Paris";

  // IMPORTANT: folosim label-urile reale ca sa cautam in map
  const origin = IATA_MAP[fromLabel] ?? DEFAULT_ORIGIN;
  const destination = IATA_MAP[toLabel] ?? DEFAULT_DESTINATION;

  const url = new URL("https://www.aviasales.com/search");
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  url.searchParams.set("marker", AVIASALES_MARKER);
  url.searchParams.set("locale", "ro");
  url.searchParams.set("currency", "EUR");

  if (intent.depart_date) url.searchParams.set("depart_date", intent.depart_date);
  if (intent.return_date) url.searchParams.set("return_date", intent.return_date);

  // Aviasales foloseste "adults"
  const pax = intent.passengers && intent.passengers > 0 ? intent.passengers : 1;
  url.searchParams.set("adults", String(pax));

  return {
    // ✅ campuri pt UI (sa nu mai ai Bucuresti->Paris aiurea)
    from: fromLabel,
    to: toLabel,
    passengers: pax,

    // ✅ extra pt card system (nu strica nimic daca nu le folosesti)
    id: makeCardId(intent, origin, destination),
    image_url: "/assets/flight/flight.jpg",
    provider_meta: {
      id: "aviasales",
      name: "Aviasales",
      brand_color: "#2563eb",
      logo_url: null, // optional, pui mai tarziu /assets/providers/aviasales.svg
    },
    dates: {
      start: intent.depart_date ?? null,
      end: intent.return_date ?? null,
      label:
        intent.depart_date && intent.return_date
          ? `${intent.depart_date} → ${intent.return_date}`
          : intent.depart_date
          ? `${intent.depart_date}`
          : "date flexibile",
    },

    // ✅ ce aveai deja (compat)
    type: "flight",
    title: `Zbor ${fromLabel} → ${toLabel}`,
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
      passengers: pax,
    },
    cta: {
      label: "Vezi zboruri",
      url: url.toString(),
    },
  };
}
