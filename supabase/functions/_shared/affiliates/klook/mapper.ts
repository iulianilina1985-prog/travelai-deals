import type { KlookActivityOffer } from "./types.ts";

export function mapKlookToOffers(
  city: string,
  rawResults: any[]
): KlookActivityOffer[] {
  return (rawResults || [])
    .map((item: any) => {
      const title = item.title ?? item.name ?? null;
      const affiliate_url =
        item.affiliate_link ??
        item.url ??
        item.link ??
        item.deeplink ??
        null;

      if (!title || !affiliate_url) return null;

      return {
        provider: "klook" as const,
        city,
        title,
        description: item.description ?? null,

        // ⬇️ pentru categorii Klook NU avem pret real
        price: null,
        currency: null,
        rating: null,
        image: null,

        affiliate_url,
      };
    })
    .filter(Boolean) as KlookActivityOffer[];
}
