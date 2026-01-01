// supabase/functions/offers/cars/localrent.ts

type LocalrentParams = {
  city?: string;
  country?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
};

export function getLocalrentOffer(params: LocalrentParams) {
  const baseUrl = "https://localrent.tpx.lt/BDajXZeJ";

  // Params optional: nu stricam tracking-ul daca Localrent ignora query
  const qs = new URLSearchParams();

  if (params.city) qs.set("city", params.city);
  if (params.country) qs.set("country", params.country);

  // (denumirile pickup/dropoff sunt “best guess”; le ajustam daca vrei)
  if (params.startDate) qs.set("pickup", params.startDate);
  if (params.endDate) qs.set("dropoff", params.endDate);

  const url = qs.toString() ? `${baseUrl}?${qs.toString()}` : baseUrl;

  return {
    type: "car_rental" as const,
    provider: "Localrent",
    title: `Închirieri auto în ${params.city ?? "destinația ta"}`,
    // imagine default (poți schimba oricând)
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=60",
    cta: {
      label: "Vezi mașini",
      url,
    },
  };
}
