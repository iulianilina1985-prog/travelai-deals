import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TOKEN = Deno.env.get("TRAVELPAYOUTS_API_TOKEN")!;
const MARKER = Deno.env.get("TRAVELPAYOUTS_MARKER") ?? "";

function buildAviasalesLink(
  origin: string,
  destination: string,
  depart: string,
  ret?: string | null
) {
  // depart: YYYY-MM-DD
  const d1 = depart.slice(8, 10) + depart.slice(5, 7);

  if (ret) {
    const d2 = ret.slice(8, 10) + ret.slice(5, 7);
    return `https://www.aviasales.com/search/${origin}${d1}${destination}${d2}?marker=${MARKER}`;
  }

  // one-way
  return `https://www.aviasales.com/search/${origin}${d1}${destination}1?marker=${MARKER}`;
}

serve(async (req) => {
  const url = new URL(req.url);

  const origin = (url.searchParams.get("origin") ?? "BUH").toUpperCase();
  const destination = (url.searchParams.get("destination") ?? "PAR").toUpperCase();

  // YYYY-MM-DD
  const depart_date = url.searchParams.get("depart_date") ?? "2026-02-20";
  const return_date = url.searchParams.get("return_date"); // optional

  // apelam cheap API (cache)
  const apiUrl =
    `https://api.travelpayouts.com/v1/prices/cheap` +
    `?origin=${origin}` +
    `&destination=${destination}` +
    `&depart_date=${depart_date.slice(0, 7)}` +
    (return_date ? `&return_date=${return_date.slice(0, 7)}` : "");

  let cheapData: any = null;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        "x-access-token": TOKEN,
        "Accept-Encoding": "gzip, deflate",
      },
    });
    cheapData = await res.json();
  } catch {
    cheapData = null;
  }

  // 🔑 RASPUNS FINAL – ce vede frontend-ul
  const response = {
    success: true,
    search: {
      origin,
      destination,
      depart_date,
      return_date: return_date ?? null,
    },
    offers: [
      {
        provider: "Aviasales",
        note:
          cheapData?.data && Object.keys(cheapData.data).length > 0
            ? "Cached deal available"
            : "Live prices available on Aviasales",
        link: buildAviasalesLink(
          origin,
          destination,
          depart_date,
          return_date
        ),
      },
    ],
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
