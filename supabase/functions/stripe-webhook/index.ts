import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "npm:stripe@12.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Initialize Stripe
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
    apiVersion: "2023-10-16",
  });

  // Stripe event payload
  const payload = await req.json();
  const event = payload;

  // Supabase client (service role)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  console.log("➡️ Stripe Event:", event.type);

  // =====================================================
  // 1️⃣ CHECKOUT SESSSION COMPLETED → ACTIVATE SUBSCRIPTION
  // =====================================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("Checkout completed:", session.id);

    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", session.client_reference_id);
  }

  // =====================================================
  // 2️⃣ INVOICE PAYMENT SUCCEEDED → LOG PAYMENT IN DB
  // =====================================================
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;

    console.log("💰 Invoice paid:", invoice.id);

    // Get subscription to extract user_id
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", invoice.subscription)
      .single();

    if (subErr || !sub) {
      console.error("❌ Cannot match invoice to subscription!", subErr);
    } else {
      const userId = sub.user_id;

      await supabase.from("billing_history").insert({
  user_id: userId,
  stripe_subscription_id: invoice.subscription,   // ⬅ corect!
  amount: invoice.amount_paid / 100,
  currency: invoice.currency,
  status: "paid",
  provider: "stripe",
  provider_payment_id: invoice.payment_intent,
  created_at: new Date().toISOString()
});


      console.log("✅ Billing history entry created for user:", userId);
    }
  }

  // =====================================================
  // 3️⃣ SUBSCRIPTION CANCELLED
  // =====================================================
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    console.log("⚠️ Subscription cancelled:", subscription.id);

    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  // END RESPONSE
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: corsHeaders,
  });
});
