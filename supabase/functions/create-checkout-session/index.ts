// supabase/functions/create-checkout/index.ts
import Stripe from "npm:stripe@12.0.0";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse body
  let body;
  try {
    body = await req.json();
  } catch (_) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const { planName } = body;
  if (!planName) {
    return new Response(JSON.stringify({ error: "Missing planName" }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Stripe init
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
    apiVersion: "2023-10-16"
  });

  // JWT
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 401,
      headers: corsHeaders
    });
  }

  // Supabase service client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  // Validate user
  const { data: authUser, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authUser?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders
    });
  }

  const user = authUser.user;

  // Get plan from DB
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

  // Origin for redirect
  const origin = req.headers.get("origin") || "http://localhost:4028";

  // ============================================================
  // CREATE CHECKOUT SESSION  💳
  // metadata MUST be inside "subscription_data"
  // ============================================================
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

    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan_id: plan.id,
        plan_name: plan.name
      }
    }
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
