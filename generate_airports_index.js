// generate_airports_index.js
// Rulează local: node generate_airports_index.js

import fs from "fs";

function strip(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// parser CSV cu ghilimele
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out;
}

// === LOAD airports.dat ===
const raw = fs.readFileSync(
  "./supabase/functions/ai-chat/data/airports.dat",
  "utf8",
);

const index = {};

for (const line of raw.split("\n")) {
  const l = line.trim();
  if (!l) continue;

  const cols = parseCsvLine(l);

  const name = cols[1];
  const city = cols[2];
  const iata = (cols[4] || "").toUpperCase();

  if (!iata || iata === "\\N") continue;
  if (!city || city === "\\N") continue;

  const cityKey = strip(city);
  if (!index[cityKey]) index[cityKey] = [];
  if (!index[cityKey].includes(iata)) index[cityKey].push(iata);

  const nameKey = strip(name);
  if (!index[nameKey]) index[nameKey] = [];
  if (!index[nameKey].includes(iata)) index[nameKey].push(iata);
}

// === WRITE TS FILE ===
let out = `// AUTO-GENERATED – DO NOT EDIT
// City / airport name → IATA codes

export const AIRPORT_INDEX: Record<string, string[]> = {\n`;

for (const [k, v] of Object.entries(index)) {
  const safeKey = k.replace(/"/g, '\\"');
  out += `  "${safeKey}": ${JSON.stringify(v)},\n`;
}


out += "};\n";

fs.writeFileSync(
  "./supabase/functions/ai-chat/airports_index.ts",
  out,
);

console.log("✔ airports_index.ts generated");
