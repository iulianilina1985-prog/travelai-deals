import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/**
 * OFFERS – ROUTER CENTRAL (ROBUST INLINED VERSION)
 * No external file dependencies for core registry logic to avoid BOOT_ERROR.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- INLINED REGISTRY DATA (Simplified for Edge Function) ---

const AFFILIATES_DATA = [
  { id: "compensair", name: "Compensair", category: "compensation", description: "Obține compensații pentru zboruri întârziate sau anulate.", ctaLabel: "Solicită compensație", link: "https://compensair.tpx.lt/U5isYCUu" },
  { id: "airhelp", name: "AirHelp", category: "compensation", description: "Lider mondial în drepturile pasagerilor aerieni.", ctaLabel: "Verifică zbor", link: "https://airhelp.tpx.lt/8Vc3jzeS" },
  { id: "kiwitaxi", name: "KiwiTaxi", category: "transfers", description: "Transferuri private de la aeroport către hotel.", ctaLabel: "Rezervă taxi", link: "https://kiwitaxi.tpx.lt/UkO0mEQp" },
  { id: "gettransfer", name: "GetTransfer", category: "transfers", description: "Cea mai mare platformă de transferuri din lume.", ctaLabel: "Vezi oferte", link: "https://gettransfer.tpx.lt/rn63Ywr6" },
  { id: "klook", name: "Klook", category: "activities", description: "Aventuri, tururi și experiențe locale unice.", ctaLabel: "Descoperă activități", link: "https://klook.tpx.lt/jnEi9ZtF" },
  { id: "tiqets", name: "Tiqets", category: "activities", description: "Bilete instant pentru muzee și atracții.", ctaLabel: "Vezi bilete", link: "https://tiqets.tpx.lt/S3EpuE54" },
  { id: "aviasales", name: "Aviasales", category: "flights", description: "Cel mai rapid motor de căutare pentru zboruri ieftine.", ctaLabel: "Vezi zboruri", link: "https://www.aviasales.com/?marker=688834&locale=ro" },
  { id: "localrent", name: "Localrent", category: "cars", description: "Închirieri auto de la furnizori locali.", ctaLabel: "Vezi oferte locale", link: "https://localrent.tpx.lt/BDajXZeJ" },
  { id: "qeeq", name: "QEEQ", category: "cars", description: "Închirieri auto la nivel mondial.", ctaLabel: "Caută mașini", link: "https://qeeq.tpx.lt/yOJgifcr" },
  { id: "airalo", name: "Airalo", category: "esim", description: "Rămâi conectat în peste 200 de țări cu eSIM.", ctaLabel: "Vezi planuri eSIM", link: "https://airalo.tpx.lt/feoFvQ5n" },
];

const CATEGORY_MAP: Record<string, string[]> = {
  "flight": ["flights"],
  "car_rental": ["cars"],
  "activity": ["activities", "tickets", "tours"],
  "transfer": ["transfers"],
  "esim": ["esim"],
  "compensation": ["compensation"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const intent = body?.intent;

    if (!intent || !intent.type) {
      return new Response(JSON.stringify({ error: "Missing intent Type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const targetCategories = CATEGORY_MAP[intent.type] || [];
    const providers = AFFILIATES_DATA.filter(p => targetCategories.includes(p.category));

    const cards = providers.map(p => {
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
        title: intent.type === "flight"
          ? `Zbor ${intent.from_city || intent.from || ""} → ${intent.to_city || intent.to || ""}`
          : `${p.name} - ${intent.to || intent.to_city || "Destinație"}`,
        description: p.description,
        image_url: intent.type === "flight" ? "/assets/flight/flight.jpg" :
          intent.type === "car_rental" ? "/assets/images/car-default.jpg" :
            "/assets/images/activity-default.jpg",
        cta: { label: p.ctaLabel, url: link }
      };
    });

    // Fallback Booking
    if (intent.type === "hotel" || (intent.type === "activity" && cards.length === 0)) {
      if (intent.type === "hotel") {
        cards.push({
          type: "hotel",
          provider: "Booking",
          title: `Cazare în ${intent.to || "destinația aleasă"}`,
          description: "Găsește hoteluri și apartamente la cel mai bun preț.",
          cta: { label: "Vezi cazări", url: "https://www.booking.com/searchresults.ro.html?ss=" + encodeURIComponent(intent.to || "") }
        });
      }
    }

    return new Response(
      JSON.stringify({ cards }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal Error", details: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
