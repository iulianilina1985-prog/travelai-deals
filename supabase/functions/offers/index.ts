import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getAviasalesOffer } from "./flights/aviasales.ts";
import { getKlookActivityCards } from "./activities/klook.ts";
export * from "./cars/localrent.ts";
import { getLocalrentOffer } from "./cars/localrent.ts";

/**
 * OFFERS – ROUTER CENTRAL
 * Primește INTENT-ul deja interpretat de AI
 * Decide ce tip de CARD returnează
 * NU conține AI
 * DOAR logică de business + afiliere
 */

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const intent = body?.intent;

  if (!intent || !intent.type) {
    return jsonError("Missing intent or intent.type");
  }

  let card: any = null;

  switch (intent.type) {
    case "flight":
      card = getAviasalesOffer(intent);
      break;

    case "hotel":
      card = buildHotelCard(intent);
      break;

    case "activity":
      card = getKlookActivityCards(intent);
      break;

    case "car_rental":
      card = getLocalrentOffer(intent);
      break;
  
    default:
      return jsonError("Unsupported intent type");
  }

  return new Response(
  JSON.stringify(card?.cards ? { cards: card.cards } : { card }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});

/* ======================================================
   HELPERS
   ====================================================== */

function jsonError(message: string, status = 400) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

/* ======================================================
   CARD BUILDERS
   ====================================================== */

function buildHotelCard(intent: any) {
  return {
    type: "hotel",
    title: `Cazare în ${intent.to ?? "destinația aleasă"}`,
    subtitle: buildDateSubtitle(intent),
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

/* ======================================================
   DATE FORMATTER (folosit de mai multe carduri)
   ====================================================== */

function buildDateSubtitle(intent: any) {
  const { depart_date, return_date } = intent;

  if (depart_date && return_date) {
    return `📅 ${formatDate(depart_date)} – ${formatDate(return_date)}`;
  }

  if (depart_date) {
    return `📅 Plecare: ${formatDate(depart_date)}`;
  }

  return "Date flexibile";
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}
