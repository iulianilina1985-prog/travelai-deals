// ================================
// Localrent Car Provider
// ================================

export type CarIntent = {
  location: string;
};

const LOCALRENT_AFFILIATE_BASE = "https://localrent.tpx.lt/BDajXZeJ";

export function getLocalrentOffer(intent: CarIntent) {
  const location = intent.location;
  if (!location) return null;

  const url = `${LOCALRENT_AFFILIATE_BASE}?pickup=${encodeURIComponent(location)}`;

  return {
    type: "car_rental",
    provider: "Localrent",
    title: `Închirieri auto în ${location}`,
    subtitle: "Oferte locale verificate, fără surprize",
    location,
    id: `localrent|${location.toLowerCase()}`,
    image_url: "/assets/cars/localrent.jpg",
    provider_meta: {
      id: "localrent",
      name: "Localrent",
      brand_color: "#00A859",
    },
    cta: {
      label: "Vezi mașini",
      url,
    },
  };
}
