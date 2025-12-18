import type { KlookRawResponse } from "./types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const INTERNAL_KEY = Deno.env.get("INTERNAL_FUNCTION_KEY")!;

/**
 * Internal server-to-server call to klook-search
 * No user auth, protected via x-internal-key
 */
export async function klookSearchRaw(
  keyword: string
): Promise<KlookRawResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/klook-search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Supabase server role (ok for internal calls)
      Authorization: `Bearer ${SERVICE_KEY}`,

      // Internal protection (VERY IMPORTANT)
      "x-internal-key": INTERNAL_KEY,
    },
    body: JSON.stringify({ keyword }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("KLOOK RAW ERROR:", res.status, txt);
    return { results: [] };
  }

  return (await res.json()) as KlookRawResponse;
}
