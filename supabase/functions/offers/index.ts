import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/**
 * OFFERS – CENTRAL ROUTER (ROBUST INLINED VERSION)
 * No external file dependencies for core registry logic to avoid BOOT_ERROR.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- INLINED REGISTRY DATA (Simplified for Edge Function) ---

const AFFILIATES_DATA = [
  {
    id: "compensair",
    name: "Compensair",
    category: "compensation",
    description: "Claim compensation for delayed or cancelled flights.",
    ctaLabel: "Claim compensation",
    link: "https://compensair.tpx.lt/U5isYCUu",
  },
  {
    id: "airhelp",
    name: "AirHelp",
    category: "compensation",
    description: "Global leader in air passenger rights.",
    ctaLabel: "Check flight",
    link: "https://airhelp.tpx.lt/8Vc3jzeS",
  },
  {
    id: "kiwitaxi",
    name: "KiwiTaxi",
    category: "transfers",
    description: "Private airport-to-hotel transfers.",
    ctaLabel: "Book taxi",
    link: "https://kiwitaxi.tpx.lt/UkO0mEQp",
  },
  {
    id: "gettransfer",
    name: "GetTransfer",
    category: "transfers",
    description: "The world’s largest transfer marketplace.",
    ctaLabel: "View offers",
    link: "https://gettransfer.tpx.lt/rn63Ywr6",
  },
  {
    id: "klook",
    name: "Klook",
    category: "activities",
    description: "Unique local tours, activities, and experiences.",
    ctaLabel: "Discover activities",
    link: "https://klook.tpx.lt/jnEi9ZtF",
  },
  {
    id: "tiqets",
    name: "Tiqets",
    category: "activities",
    description: "Instant tickets for museums and attractions.",
    ctaLabel: "View tickets",
    link: "https://tiqets.tpx.lt/S3EpuE54",
  },
  {
    id: "aviasales",
    name: "Aviasales",
    category: "flights",
    description: "Fast flight search engine for cheap flights.",
    ctaLabel: "View flights",
    link: "https://www.aviasales.com/?marker=688834&locale=en",
  },
  {
    id: "localrent",
    name: "Localrent",
    category: "cars",
    description: "Car rentals from trusted local providers.",
    ctaLabel: "View local deals",
    link: "https://localrent.tpx.lt/BDajXZeJ",
  },
  {
    id: "qeeq",
    name: "QEEQ",
    category: "cars",
    description: "Worldwide car rentals at competitive prices.",
    ctaLabel: "Search cars",
    link: "https://qeeq.tpx.lt/yOJgifcr",
  },
  {
    id: "airalo",
    name: "Airalo",
    category: "esim",
    description: "Stay connected in over 200 countries with eSIM.",
    ctaLabel: "View eSIM plans",
    link: "https://airalo.tpx.lt/feoFvQ5n",
  },
];

const CATEGORY_MAP: Record<string, string[]> = {
  flight: ["flights"],
  car_rental: ["cars"],
  activity: ["activities", "tickets", "tours"],
  transfer: ["transfers"],
  esim: ["esim"],
  compensation: ["compensation"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const intent = body?.intent;

    if (!intent || !intent.type) {
      return new Response(
        JSON.stringify({ error: "Missing intent type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetCategories = CATEGORY_MAP[intent.type] || [];
    const providers = AFFILIATES_DATA.filter((p) =>
      targetCategories.includes(p.category)
    );

    const cards = providers.map((p) => {
      let link = p.link;

      if (p.id === "klook" && (intent.to || intent.to_city)) {
        link += `?q=${encodeURIComponent(intent.to || intent.to_city)}`;
      }
      if (p.id === "localrent" && (intent.to || intent.to_city)) {
        link += `?pickup=${encodeURIComponent(intent.to || intent.to_city)}`;
      }

      return {
        id: `${p.id}|${intent.to || intent.to_city || "gen"}`,
        type: intent.type,
        provider: p.name,
        title:
          intent.type === "flight"
            ? `Flight ${intent.from_city || intent.from || ""} → ${intent.to_city || intent.to || ""}`
            : `${p.name} – ${intent.to || intent.to_city || "Destination"}`,
        description: p.description,
        image_url:
          intent.type === "flight"
            ? "/assets/flight/flight.jpg"
            : intent.type === "car_rental"
              ? "/assets/images/car-default.jpg"
              : "/assets/images/activity-default.jpg",
        cta: { label: p.ctaLabel, url: link },
      };
    });

    // Fallback: Booking
    if (intent.type === "hotel" || (intent.type === "activity" && cards.length === 0)) {
      if (intent.type === "hotel") {
        cards.push({
          type: "hotel",
          provider: "Booking",
          title: `Accommodation in ${intent.to || "your destination"}`,
          description: "Find hotels and apartments at the best prices.",
          cta: {
            label: "View accommodations",
            url:
              "https://www.booking.com/searchresults.en.html?ss=" +
              encodeURIComponent(intent.to || ""),
          },
        });
      }
    }

    return new Response(
      JSON.stringify({ cards }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
