import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, authorization, apikey",
};

// LINKUL TĂU OFICIAL KLOOK (din Travelpayouts)
const AFFILIATE_KLOOK = "https://klook.tpx.lt/jnEi9ZtF";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { keyword } = await req.json();

    if (!keyword || keyword.length < 2) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: corsHeaders,
      });
    }

    const clean = keyword.trim();

    const results = [
      {
        type: "city_activities",
        city: clean,
        title: `Activități și experiențe în ${clean}`,
        description: `Tururi, muzee și experiențe locale în ${clean}.`,
        affiliate_link: AFFILIATE_KLOOK,
      },
      {
        type: "popular",
        city: clean,
        title: `Top atracții în ${clean}`,
        description: `Locuri populare și experiențe recomandate.`,
        affiliate_link: AFFILIATE_KLOOK,
      },
      {
        type: "day_trips",
        city: clean,
        title: `Excursii de o zi din ${clean}`,
        description: `Tururi și excursii organizate în apropiere.`,
        affiliate_link: AFFILIATE_KLOOK,
      }
    ];

    return new Response(JSON.stringify({ keyword: clean, results }), {
      headers: corsHeaders,
    });

  } catch (err) {
    console.error("KLOOK SEARCH ERROR:", err);
    return new Response(JSON.stringify({ results: [] }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
