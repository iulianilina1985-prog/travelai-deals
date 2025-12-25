import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAviasalesOffer } from "./flights/aviasales.ts";


/**
 * OFFERS – ROUTER CENTRAL
 * Primeste intentia si decide ce oferta returneaza
 * NU contine AI
 * NU contine afiliere hardcodata (inca)
 */

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const intent = body?.intent;

  if (!intent || !intent.type) {
    return new Response(
      JSON.stringify({ error: "Missing intent" }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  // 🔀 ROUTER CENTRAL
  let card: any = null;

  switch (intent.type) {
    case "flight":
      card = getAviasalesOffer(intent);
      break;

    case "hotel":
      card = buildHotelCard(intent);
      break;

    case "activity":
      card = buildActivityCard(intent);
      break;

    default:
      return new Response(
        JSON.stringify({ error: "Unsupported intent type" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
  }

  return new Response(
    JSON.stringify({ card }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});

/* =========================
   CARD BUILDERS (MVP)
   ========================= */



function buildHotelCard(intent: any) {
  return {
    type: "hotel",
    title: `Cazare în ${intent.to ?? "destinația aleasă"}`,
    subtitle: intent.dates ?? "date flexibile",
    provider: "Booking",
    cta: {
      label: "Vezi cazări",
      url: "/affiliate-redirect?type=hotel",
    },
  };
}

function buildActivityCard(intent: any) {
  return {
    type: "activity",
    title: `Activități în ${intent.to ?? "orașul ales"}`,
    subtitle: "Top experiențe disponibile",
    provider: "Klook",
    cta: {
      label: "Vezi activități",
      url: "/affiliate-redirect?type=activity",
    },
  };
}
