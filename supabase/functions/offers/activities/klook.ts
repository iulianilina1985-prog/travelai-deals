type ActivityIntent = {
  to?: string;        // oras (Tokyo)
  category?: string; // theatre, food, attractions etc (optional)
};

const KLOOK_LINKS: Record<string, string[]> = {
  tokyo: [
    "https://klook.tpx.lt/jnEi9ZtF", // general Tokyo activities
    "https://klook.com/en-US/search/?query=theatre%20tokyo",
    "https://klook.com/en-US/search/?query=food%20tour%20tokyo",
  ],
};

function normCity(v?: string) {
  return String(v ?? "").toLowerCase().trim();
}

export function getKlookActivityCards(intent: ActivityIntent) {
  const city = normCity(intent.to) || "tokyo";
  const links = KLOOK_LINKS[city] ?? KLOOK_LINKS["tokyo"];

  const cards = links.map((url, idx) => ({
    id: `activity|klook|${city}|${idx}`,
    type: "activity",
    title:
      idx === 0
        ? `Activități în ${intent.to ?? "oraș"}`
        : idx === 1
        ? "Spectacole & teatru"
        : "Tururi culinare",
    subtitle: "Rezervare instant · bilete oficiale",
    provider: "Klook",
    provider_meta: {
      id: "klook",
      name: "Klook",
      brand_color: "#ff5b00",
    },
    cta: {
      label: "Vezi oferta",
      url,
    },
  }));

  return { cards };
}
