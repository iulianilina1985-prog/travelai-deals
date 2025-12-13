/**
 * get-hotels – Stable JSON hotel generator + affiliate link
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")
});

// ⭐ AICI PUI LINKUL TĂU REAL DE AFFILIERE
const AFFILIATE_HOTELS =
  "https://search.hotellook.com/?utm_source=travelai-deals&utm_medium=aff&utm_campaign=YOUR_ID";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { city } = await req.json();

    if (!city) {
      return new Response(
        JSON.stringify({ error: "Missing city name" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const prompt = `
Generează STRICT un JSON cu o listă de 6 hoteluri din orașul ${city}.
FORMAT EXACT (NU ADAUGA TEXT ÎN PLUS):

{
  "hotels": [
    {
      "name": "...",
      "area": "...",
      "price": "interval estimativ, ex: 120–250€/noapte",
      "for": "...",
      "reason": "..."
    }
  ]
}

Reguli:
- FĂRĂ TEXT ÎNAINTE SAU DUPĂ JSON
- Fără explicații
- Doar JSON-ul cerut
`;

    // ---------------------------------------------------------
    // AI REQUEST – force JSON-only output
    // ---------------------------------------------------------
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
      temperature: 0.6
    });

    let raw = aiRes.choices[0].message.content.trim();

    // ---------------------------------------------------------
    // TRY TO PARSE JSON + FIX IF MODEL OUTPUTS EXTRA TEXT
    // ---------------------------------------------------------
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      // încearcă să extragi JSON-ul din text
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = { hotels: [] };
        }
      } else {
        parsed = { hotels: [] };
      }
    }

    return new Response(
      JSON.stringify({
        city,
        hotels: parsed.hotels ?? [],
        affiliate_link: AFFILIATE_HOTELS
      }),
      { headers: corsHeaders }
    );

  } catch (err) {
    console.error("❌ get-hotels ERROR:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
