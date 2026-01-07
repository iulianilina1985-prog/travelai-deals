import { AIRPORT_INDEX } from "./airports_index.ts";

function strip(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isIata(v: string) {
  return /^[A-Z]{3}$/.test(v);
}

export async function resolveToIata(input: string): Promise<string | null> {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();
  if (isIata(upper)) return upper;

  const key = strip(raw);

  // ⚡ MANUAL OVERRIDES (common variations)
  const OVERRIDES: Record<string, string> = {
    "bucuresti": "OTP",
    "bucharest": "OTP",
    "otopeni": "OTP",
    "cluj": "CLJ",
    "timisoara": "TSR",
    "iasi": "IAS",
    "londra": "LON",
    "london": "LON",
    "paris": "PAR",
    "roma": "ROM",
    "rome": "ROM",
    "milano": "MIL",
    "milan": "MIL",
    "barcelona": "BCN",
    "madrid": "MAD",
    "dubai": "DXB",
    "amsterdam": "AMS",
    "iena": "VIE",
    "viena": "VIE",
    "vienna": "VIE",
    "budapesta": "BUD",
    "budapest": "BUD",
    "istambul": "IST",
    "istanbul": "IST",
    "antalya": "AYT"
  };

  if (OVERRIDES[key]) return OVERRIDES[key];

  const hits = AIRPORT_INDEX[key];

  if (!hits || hits.length === 0) return null;

  return hits[0]; // deterministic
}
