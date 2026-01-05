// ================================
// Klook Activity Provider
// ================================

export type ActivityIntent = {
  city: string;
};

const KLOOK_AFFILIATE_BASE = "https://klook.tpx.lt/jnEi9ZtF";

export function getKlookOffer(intent: ActivityIntent) {
  const city = intent.city;
  if (!city) return null;

  // Klook acceptă query params pentru căutare
  const url = `${KLOOK_AFFILIATE_BASE}?q=${encodeURIComponent(city)}`;

  return {
    type: "activity",
    provider: "Klook",
    title: `Activități în ${city}`,
    subtitle: "Tururi, atracții și experiențe locale",
    city,
    id: `klook|${city.toLowerCase()}`,
    image_url: "/assets/activities/klook.jpg",
    provider_meta: {
      id: "klook",
      name: "Klook",
      brand_color: "#ff5b00",
    },
    cta: {
      label: "Vezi activități",
      url,
    },
  };
}
