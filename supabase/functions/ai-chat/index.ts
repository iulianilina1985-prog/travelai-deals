import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SYSTEM_PROMPT } from "./system_prompt.ts";

// ✅ PROVIDER DEDICAT AVIASALES
import { getAviasalesOffer } from "../offers/flights/aviasales.ts";

/* ================= CONFIG ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

/* ================= HELPERS ================= */

function norm(v: unknown) {
  return String(v ?? "").trim();
}

/* ---- DETERMINISTIC PARSER (NU AI) ---- */

function extractFlightData(text: string) {
  const strip = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // fara diacritice

  const t = strip(text);

  // --- CITY dictionary (extinzi usor)
  const CITY_CANON: Record<string, string> = {
    bucuresti: "București",
    craiova: "Craiova",
    paris: "Paris",
    roma: "Roma",
    milano: "Milano",
    londra: "Londra",
    bruxel: "Bruxelles",
    bruxelles: "Bruxelles",
    brussels: "Bruxelles",
  };

  const canonCity = (raw: string) => {
    const key = strip(raw).trim().replace(/\s+/g, " ");
    return CITY_CANON[key] ?? raw.trim();
  };

  // --- route: "craiova - bruxel" / "craiova -> bruxelles"
  let from: string | null = null;
  let to: string | null = null;

  const routeMatch =
    t.match(/(?:zbor|flight)\s+([a-z ]{3,})\s*(?:->|→| - |–|—)\s*([a-z ]{3,})/i) ||
    t.match(/(?:din|de la)\s+([a-z ]{3,})\s+(?:la|catre|către)\s+([a-z ]{3,})/i);

  if (routeMatch) {
    from = canonCity(routeMatch[1]);
    to = canonCity(routeMatch[2]);
  } else {
    // fallback: cauta doua orase mentionate
    for (const key of Object.keys(CITY_CANON)) {
      if (t.includes(key) && !from) from = CITY_CANON[key];
      else if (t.includes(key) && from && !to) to = CITY_CANON[key];
    }
  }

  // --- passengers: "2 persoane / 2 adulti"
  const paxMatch = t.match(/(\d+)\s*(persoane|pers|adulti|adulti|adulți)/);
  const passengers = paxMatch ? Number(paxMatch[1]) : 1;

  // --- dates
  const MONTHS: Record<string, string> = {
    ianuarie: "01", ian: "01",
    februarie: "02", feb: "02",
    martie: "03", mar: "03",
    aprilie: "04", apr: "04",
    mai: "05",
    iunie: "06", iun: "06",
    iulie: "07", iul: "07",
    august: "08", aug: "08",
    septembrie: "09", sept: "09", sep: "09",
    octombrie: "10", oct: "10",
    noiembrie: "11", nov: "11",
    decembrie: "12", dec: "12",
  };

  const pad2 = (n: string) => (n.length === 1 ? `0${n}` : n);

  let depart: string | null = null;
  let ret: string | null = null;

  // format: 19.02.2026 - 22.02.2026
  const dmY = t.match(
    /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})\s*(?:-|–|—)\s*(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/
  );
  if (dmY) {
    depart = `${dmY[3]}-${pad2(dmY[2])}-${pad2(dmY[1])}`;
    ret = `${dmY[6]}-${pad2(dmY[5])}-${pad2(dmY[4])}`;
  }

  // format: 19 - 22 februarie 2026
  if (!depart) {
    const sameMonth = t.match(
      /(\d{1,2})\s*(?:-|–|—)\s*(\d{1,2})\s+([a-z]{3,10})\s+(\d{4})/
    );
    if (sameMonth) {
      const m = MONTHS[sameMonth[3]] ?? null;
      if (m) {
        depart = `${sameMonth[4]}-${m}-${pad2(sameMonth[1])}`;
        ret = `${sameMonth[4]}-${m}-${pad2(sameMonth[2])}`;
      }
    }
  }

  // ✅ IMPORTANT: returnam si cand lipseste ceva (dar card il facem doar daca avem minim)
  if (!from || !to || !depart || !ret) return null;

  return { from, to, depart, ret, passengers };
}


/* ================= SERVER ================= */

serve(async (req) => {
  // ✅ CORS PRE-FLIGHT
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const prompt = norm(body?.prompt);

    /* ---------- 1. PARSARE ZBOR (DET) ---------- */

    const flight = extractFlightData(prompt);

    if (flight) {
      const card = getAviasalesOffer({
        from: flight.from,
        to: flight.to,
        depart_date: flight.depart,
        return_date: flight.ret,
        passengers: flight.passengers,
      });

      const reply = `Perfect ✈️  
Am găsit configurația completă pentru zbor:

🛫 **${flight.from} → ${flight.to}**  
📅 **${flight.depart} → ${flight.ret}**  
👥 **${flight.passengers} persoane**

Poți vedea zborurile mai jos 👇`;

      return new Response(
        JSON.stringify({
          reply,
          intent: {
            type: "flight",
            from: flight.from,
            to: flight.to,
            depart_date: flight.depart,
            return_date: flight.ret,
          },
          card,
          confidence: "high",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ---------- 2. MOD CONVERSAȚIE (AI) ---------- */

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    // ✅ FIXUL CRITIC: PARSARE JSON
    let reply = "Spune-mi ce tip de vacanță îți dorești 🙂";
    let intent: any = null;
    let confidence = "medium";

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.reply === "string") reply = parsed.reply;
      if (parsed.intent) intent = parsed.intent;
      if (parsed.confidence) confidence = parsed.confidence;
    } catch {
      // fallback dacă AI răspunde liber
      reply = raw || reply;
    }

    return new Response(
      JSON.stringify({
        reply,
        intent,
        confidence,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("AI-CHAT ERROR:", err);

    return new Response(
      JSON.stringify({
        reply: "Hai să o luăm pas cu pas 🙂",
        intent: null,
        confidence: "low",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
