// ================================
// Aviasales Flight Provider
// IATA ONLY – STRICT
// ================================

export type FlightIntent = {
  from_iata: string;      // "CRA"
  to_iata: string;        // "MAD"
  depart_date?: string;  // YYYY-MM-DD
  return_date?: string;  // YYYY-MM-DD
  passengers?: number;
};

const AVIASALES_MARKER = "688834";

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

/* ================= PROVIDER ================= */

export function getAviasalesOffer(intent: FlightIntent) {
  const from = safe(intent.from_iata)?.toUpperCase();
  const to = safe(intent.to_iata)?.toUpperCase();

  if (!from || !to || !isIata(from) || !isIata(to)) {
    return null; // 🔒 HARD FAIL – fără IATA nu continuăm
  }

  const passengers =
    typeof intent.passengers === "number" && intent.passengers > 0
      ? intent.passengers
      : 1;

  const url = new URL("https://www.aviasales.com/search");

  // 🔑 DOAR IATA
  url.searchParams.set("origin", from);
  url.searchParams.set("destination", to);

  if (intent.depart_date) {
    url.searchParams.set("depart_date", intent.depart_date);
  }

  if (intent.return_date) {
    url.searchParams.set("return_date", intent.return_date);
  }

  url.searchParams.set("adults", String(passengers));
  url.searchParams.set("marker", AVIASALES_MARKER);
  url.searchParams.set("locale", "ro");
  url.searchParams.set("currency", "EUR");

  return {
    type: "flight",
    provider: "Aviasales",

    title: `Zbor ${from} → ${to}`,
    subtitle:
      intent.depart_date && intent.return_date
        ? `${intent.depart_date} → ${intent.return_date}`
        : intent.depart_date ?? "date flexibile",

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
      label: "Vezi zboruri",
      url: url.toString(),
    },
  };
}
