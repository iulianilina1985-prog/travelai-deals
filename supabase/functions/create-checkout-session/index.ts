// supabase/functions/create-checkout-session/index.ts

import Stripe from "npm:stripe@12.0.0";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---- CORS ----
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

serve(async (req) => {
  try {
    // --- OPTIONS (CORS) ---
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // --- Only POST allowed ---
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders
      });
    }

    // --- Parse body ---
    const { planName } = await req.json();
    if (!planName) {
      return new Response(JSON.stringify({ error: "Missing planName" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // --- Load Stripe Key ---
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY missing");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // --- Verify user token ---
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const user = authData.user;

    // --- Get plan details ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY")
    );

    const { data: plan, error: planErr } = await supabase
      .from("plans")
      .select("*")
      .eq("name", planName)
      .single();

    if (planErr || !plan) {
      return new Response(JSON.stringify({ error: "Plan not found" }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // --- Determine origin (fallback dev environment) ---
    const origin = req.headers.get("origin") || "http://localhost:4028";

    // --- Create Stripe Checkout Session ---
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1
        }
      ],

      success_url: `${origin}/checkout-success`,
      cancel_url: `${origin}/checkout-cancel`,

      client_reference_id: user.id,

      metadata: {
        supabase_user_id: user.id,
        plan_id: plan.id,
        plan_name: plan.name
      }
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("Checkout error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: `${err}`
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
