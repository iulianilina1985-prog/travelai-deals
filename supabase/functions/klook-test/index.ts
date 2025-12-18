import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { klookSearch } from "../_shared/affiliates/klook/index.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only POST
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Internal key check (light protection)
  const internalKey = Deno.env.get("INTERNAL_FUNCTION_KEY") ?? "";
  const providedKey = req.headers.get("x-internal-key") ?? "";

  if (!internalKey || providedKey !== internalKey) {
    return json({ error: "Forbidden (missing/invalid internal key)" }, 403);
  }

  // Body
  let payload: { keyword?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const keyword = (payload.keyword ?? "").trim();
  if (!keyword) {
    return json({ error: "Missing keyword" }, 400);
  }

  // Call Klook (your shared implementation)
  try {
    const results = await klookSearch(keyword);
    return json({ keyword, count: results.length, results });
  } catch (e) {
    console.error("KLOOK SEARCH ERROR:", e);
    return json({ error: "Klook search failed" }, 500);
  }
});
