import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Content-Type": "application/json",
};

type OfferType =
  | "flight"
  | "hotel"
  | "package"
  | "car"
  | "activity"
  | "esim"
  | "insurance";

type Offer = {
  id: string;
  type: OfferType;
  source: string;
  title: string;
  subtitle?: string;
  destination?: string;
  country?: string;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  currency?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  affiliateUrl?: string | null;
  tags?: string[];
  raw?: any; // păstrăm și payloadul original dacă vrei debug mai târziu
};

// -------------------------
// HELPERS
// -------------------------
function safeNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchJson(url: string, body: any): Promise<any | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("fetchJson non-OK", url, res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("fetchJson error", url, err);
    return null;
  }
}

// -------------------------
// MAPPERS
// -------------------------

// KLOOK -> Offer[]
async function getActivityOffers(city: string | null): Promise<Offer[]> {
  if (!city) return [];

  const projectUrl = Deno.env.get("SUPABASE_URL");
  if (!projectUrl) return [];

  const data = await fetchJson(
    `${projectUrl}/functions/v1/klook-search`,
    { keyword: city },
  );
  if (!data) return [];

  const results = Array.isArray(data.results) ? data.results : [];
  return results.map((item: any, index: number): Offer => ({
    id: `klook-${city}-${index}`,
    type: "activity",
    source: "klook",
    title: item.title || `Activități în ${city}`,
    subtitle: item.description || "",
    destination: item.city || city,
    country: null,
    imageUrl: null,
    startDate: null,
    endDate: null,
    priceFrom: null,
    priceTo: null,
    currency: null,
    rating: null,
    reviewsCount: null,
    affiliateUrl: item.affiliate_link || null,
    tags: [item.type || "activities"],
    raw: item,
  }));
}

// HOTELS -> Offer[]
async function getHotelOffers(city: string | null): Promise<Offer[]> {
  if (!city) return [];

  const projectUrl = Deno.env.get("SUPABASE_URL");
  if (!projectUrl) return [];

  const data = await fetchJson(
    `${projectUrl}/functions/v1/get-hotels`,
    { city },
  );
  if (!data) return [];

  // incercăm să ghicim structura: hotels[] sau results[]
  const hotelsArr =
    Array.isArray(data.hotels)
      ? data.hotels
      : Array.isArray(data.results)
      ? data.results
      : [];

  return hotelsArr.map((h: any, index: number): Offer => ({
    id: String(h.id ?? `hotel-${city}-${index}`),
    type: "hotel",
    source: "travelpayouts_hotels",
    title: h.name || h.title || "Hotel",
    subtitle: h.address || h.description || "",
    destination: h.city || city,
    country: h.country || null,
    imageUrl: h.image || h.image_url || null,
    startDate: h.check_in || null,
    endDate: h.check_out || null,
    priceFrom: safeNumber(h.price_from ?? h.price ?? h.min_price),
    priceTo: safeNumber(h.price_to ?? h.max_price),
    currency: h.currency || "EUR",
    rating: safeNumber(h.rating),
    reviewsCount: safeNumber(h.reviews_count ?? h.reviews ?? h.reviewsCount),
    affiliateUrl: h.affiliate_link || h.deeplink || null,
    tags: ["hotel"],
    raw: h,
  }));
}

// Placeholder pentru alte tipuri (zboruri, pachete, etc.)
// Momentan întorc liste goale ca să nu-ți rupă nimic.
async function getFlightOffers(): Promise<Offer[]> {
  return [];
}
async function getPackageOffers(): Promise<Offer[]> {
  return [];
}
async function getCarOffers(): Promise<Offer[]> {
  return [];
}
async function getEsimOffers(): Promise<Offer[]> {
  return [];
}
async function getInsuranceOffers(): Promise<Offer[]> {
  return [];
}

// -------------------------
// SORTARE & FILTRARE
// -------------------------
function applyPriceFilter(
  offers: Offer[],
  minPrice?: number,
  maxPrice?: number,
): Offer[] {
  return offers.filter((o) => {
    const p = o.priceFrom ?? o.priceTo;
    if (p == null) return true;
    if (minPrice != null && p < minPrice) return false;
    if (maxPrice != null && p > maxPrice) return false;
    return true;
  });
}

function applySort(offers: Offer[], sortBy: string): Offer[] {
  const arr = [...offers];

  switch (sortBy) {
    case "price_low":
      return arr.sort((a, b) => (a.priceFrom ?? 999999) - (b.priceFrom ?? 999999));
    case "price_high":
      return arr.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
    case "rating":
      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    // "expiry" și "newest" le lăsăm ca TODO / fallback
    default:
      return arr;
  }
}

// -------------------------
// MAIN
// -------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const type: OfferType | "all" = body.type || "all";
    const destination: string = (body.destination || body.city || "").trim();
    const sortBy: string = body.sortBy || "newest";
    const minPrice = body.minPrice != null ? Number(body.minPrice) : undefined;
    const maxPrice = body.maxPrice != null ? Number(body.maxPrice) : undefined;

    const city = destination || null;

    // 1. adunăm promisiunile în funcție de tip
    const promises: Promise<Offer[]>[] = [];

    if (type === "all" || type === "hotel") {
      promises.push(getHotelOffers(city));
    }
    if (type === "all" || type === "activity") {
      promises.push(getActivityOffers(city));
    }
    if (type === "all" || type === "flight") {
      promises.push(getFlightOffers());
    }
    if (type === "all" || type === "package") {
      promises.push(getPackageOffers());
    }
    if (type === "all" || type === "car") {
      promises.push(getCarOffers());
    }
    if (type === "all" || type === "esim") {
      promises.push(getEsimOffers());
    }
    if (type === "all" || type === "insurance") {
      promises.push(getInsuranceOffers());
    }

    const resultsArrays = await Promise.all(promises);
    let offers = resultsArrays.flat();

    // 2. filtrare preț
    offers = applyPriceFilter(offers, minPrice, maxPrice);

    // 3. sortare
    offers = applySort(offers, sortBy);

    // 4. răspuns
    return new Response(
      JSON.stringify({
        destination: city,
        total: offers.length,
        offers,
      }),
      { headers: corsHeaders },
    );
  } catch (err: any) {
    console.error("search-offers ERROR:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500, headers: corsHeaders },
    );
  }
});
