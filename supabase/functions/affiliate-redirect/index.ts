// supabase/functions/affiliate-redirect/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    // ------------------------------------------------------
    // 1️⃣ Inițializare Supabase
    // ------------------------------------------------------
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // ------------------------------------------------------
    // 2️⃣ Citim parametrii din URL
    // ------------------------------------------------------
    const url = new URL(req.url);
    const partnerSlug = url.searchParams.get("partner");
    const forwardParams = url.searchParams; // orice alte parametri

    if (!partnerSlug) {
      return new Response("Missing partner slug.", { status: 400 });
    }

    // ------------------------------------------------------
    // 3️⃣ Luăm partenerul din DB
    // ------------------------------------------------------
    const { data: partner, error } = await supabase
      .from("affiliate_partners")
      .select("*")
      .eq("slug", partnerSlug)
      .eq("enabled", true)
      .single();

    if (error || !partner) {
      return new Response("Partner not found or disabled.", { status: 404 });
    }

    // ------------------------------------------------------
    // 4️⃣ Construim deeplink-ul afiliat
    // ------------------------------------------------------
    let deeplink = partner.tracking_url;

    const code = partner.code;
    const cfg = partner.api_config || {}; // JSONB din DB

    // exemplu pentru Booking -> parametru "aid"
    if (cfg.aid_param && code) {
      deeplink += `?${cfg.aid_param}=${code}`;
    }

    // adăugăm restul parametrilor (city, dates, hotel_id...)
    forwardParams.forEach((value, key) => {
      if (key === "partner") return; // să nu punem "partner" în URL
      deeplink += `${deeplink.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
    });

    // ------------------------------------------------------
    // 5️⃣ Salvăm click-ul în affiliate_clicks
    // ------------------------------------------------------
    const ip = req.headers.get("x-real-ip") ||
               req.headers.get("x-forwarded-for") ||
               null;

    const userAgent = req.headers.get("user-agent");

    await supabase.from("affiliate_clicks").insert({
      partner_id: partner.id,
      deeplink,
      user_agent: userAgent,
      ip_address: ip,
      source: forwardParams.get("source") || null,
      session_id: forwardParams.get("session") || null,
      meta: forwardParams.get("meta") || null
    });

    // ------------------------------------------------------
    // 6️⃣ Redirect final (HTTP 302)
    // ------------------------------------------------------
    return new Response(null, {
      status: 302,
      headers: {
        ...cors,
        Location: deeplink,
      },
    });

  } catch (err) {
    console.error("Affiliate redirect error:", err);
    return new Response("Server error affiliate redirect.", { status: 500 });
  }
});
