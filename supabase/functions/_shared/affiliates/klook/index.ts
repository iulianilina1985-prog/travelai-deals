/**
 * Klook affiliate wrapper
 * Expune o singura functie publica
 */

import { klookSearchRaw } from "./client.ts";
import { mapKlookToOffers } from "./mapper.ts";
import type { KlookActivityOffer } from "./types.ts";

export type { KlookActivityOffer };

export async function searchKlookActivities(
  city: string
): Promise<KlookActivityOffer[]> {
  const raw = await klookSearchRaw(city);
  return mapKlookToOffers(city, raw.results ?? []);
}
