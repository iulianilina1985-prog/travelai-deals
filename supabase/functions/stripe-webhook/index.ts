// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@12.0.0";

// --------------------------------------------------------
// CONFIG
// --------------------------------------------------------
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, stripe-signature",
};

// --------------------------------------------------------
// TRAVELAI TOKEN PLAN CONFIG
// --------------------------------------------------------
const PLAN_TOKEN_CONFIG = {
  free:  { monthly_quota: 20000, hard_limit_tokens: 800 },
  basic: { monthly_quota: 120000, hard_limit_tokens: 2000 },
  pro:   { monthly_quota: 300000, hard_limit_tokens: 4000 },
};

// --------------------------------------------------------
// SYNC CREDITS WITH PLAN
// --------------------------------------------------------
async function syncUserCreditsForPlan(supabaseClient, userId, rawPlanName) {
  const key = (rawPlanName ?? "free").toLowerCase();
  const cfg = PLAN_TOKEN_CONFIG[key] ?? PLAN_TOKEN_CONFIG.free;

  const now = new Date();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  const { data: existing } = await supabaseClient
    .from("credits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    console.log("🔄 Updating credits for user", userId, "plan", key);
    await supabaseClient
      .from("credits")
      .update({
        plan_type: key,
        monthly_quota: cfg.monthly_quota,
        hard_limit_tokens: cfg.hard_limit_tokens,
        balance: cfg.monthly_quota,
        expires_at: expires.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("user_id", userId);
  } else {
    console.log("🆕 Creating credits row for user", userId, "plan", key);
    await supabaseClient
      .from("credits")
      .insert({
        user_id: userId,
        plan_type: key,
        balance: cfg.monthly_quota,
        monthly_quota: cfg.monthly_quota,
        hard_limit_tokens: cfg.hard_limit_tokens,
        lifetime_used: 0,
        expires_at: expires.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      });
  }
}

// --------------------------------------------------------
// UTILS
// --------------------------------------------------------
function parseStripeSignatureHeader(header: string) {
  const map: Record<string, string> = {};
  header.split(",").forEach((part) => {
    const [k, v] = part.trim().split("=");
    if (k && v) map[k] = v;
  });
  return map;
}

async function computeHmacSha256(secret: string, payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function unixToIso(sec: number | null | undefined) {
  if (!sec) return null;
  return new Date(sec * 1000).toISOString();
}

// helpers
function getStripeClient() {
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
}

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// --------------------------------------------------------
// HANDLERS
// --------------------------------------------------------

// 1) checkout.session.completed → create / update subscription + credits
async function handleCheckoutCompleted(event) {
  const stripe = getStripeClient();
  const supabase = getSupabaseClient();

  const session = event.data?.object ?? {};
  console.log("🧾 checkout.session.completed:", {
    id: session.id,
    metadata: session.metadata,
    customer: session.customer,
    subscription: session.subscription,
  });

  const userId =
    session.metadata?.supabase_user_id ??
    session.client_reference_id ??
    null;

  if (!userId) {
    console.error("⚠️ No userId on checkout session");
    return;
  }

  const stripeCustomerId = session.customer ?? null;
  const stripeSubscriptionId = session.subscription ?? null;

  if (!stripeSubscriptionId) {
    console.error("⚠️ No Stripe subscription id on checkout session");
    return;
  }

  // Full subscription from Stripe
  const stripeSub = await stripe.subscriptions.retrieve(String(stripeSubscriptionId));
  const item0 = stripeSub.items?.data?.[0];
  const stripePriceId = item0?.price?.id ?? null;

  const currentPeriodStartIso = unixToIso(stripeSub.current_period_start);
  const currentPeriodEndIso = unixToIso(stripeSub.current_period_end);

  // Match plan in Supabase
  const supabaseClient = supabase;
  let plan = null;

  // 1) după metadata.plan_id
  if (session.metadata?.plan_id) {
    const { data } = await supabaseClient
      .from("plans")
      .select("*")
      .eq("id", session.metadata.plan_id)
      .maybeSingle();
    if (data) plan = data;
  }

  // 2) după metadata.plan_name
  if (!plan && session.metadata?.plan_name) {
    const { data } = await supabaseClient
      .from("plans")
      .select("*")
      .eq("name", session.metadata.plan_name)
      .maybeSingle();
    if (data) plan = data;
  }

  // 3) fallback după stripe_price_id
  if (!plan && stripePriceId) {
    const { data } = await supabaseClient
      .from("plans")
      .select("*")
      .eq("stripe_price_id", stripePriceId)
      .maybeSingle();
    if (data) plan = data;
  }

  if (!plan) {
    console.error("❌ No matching plan found in database for checkout");
    return;
  }

  console.log("📋 Matched plan:", plan.name, plan.id);

  const subPayload = {
    plan_id: plan.id,
    plan_name: plan.name,
    price_per_month: (plan.price_cents ?? 0) / 100,
    max_notifications: plan.credits ?? 0,
    features: plan.features ?? {},
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    status: stripeSub.status,
    current_period_start: currentPeriodStartIso,
    current_period_end: currentPeriodEndIso,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabaseClient
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    console.log("🔄 Updating existing subscription for user", userId);
    await supabaseClient
      .from("subscriptions")
      .update(subPayload)
      .eq("user_id", userId);
  } else {
    console.log("🆕 Creating new subscription for user", userId);
    await supabaseClient.from("subscriptions").insert({
      user_id: userId,
      credits_allocated: 0,
      credits_used: 0,
      created_at: new Date().toISOString(),
      ...subPayload,
    });
  }

  // 🔁 SINCRONIZĂM ȘI TABELA CREDITS CU PLANUL (basic / pro)
  try {
    await syncUserCreditsForPlan(supabaseClient, userId, plan.name);
  } catch (err) {
    console.error("❌ Error syncing credits after checkout:", err);
  }
}

// 2) customer.subscription.updated → sync status & period (renew, downgrade, etc.)
async function handleSubscriptionUpdated(event) {
  const stripeSub = event.data?.object;
  const supabase = getSupabaseClient();

  const stripeSubscriptionId = stripeSub.id;
  const stripeCustomerId = stripeSub.customer;

  const currentPeriodStartIso = unixToIso(stripeSub.current_period_start);
  const currentPeriodEndIso = unixToIso(stripeSub.current_period_end);
  const status = stripeSub.status;

  // plan info din subscription
  const item0 = stripeSub.items?.data?.[0];
  const stripePriceId = item0?.price?.id ?? null;

  let plan = null;
  if (stripePriceId) {
    const { data } = await supabase
      .from("plans")
      .select("*")
      .eq("stripe_price_id", stripePriceId)
      .maybeSingle();
    if (data) plan = data;
  }

  const payload: any = {
    status,
    current_period_start: currentPeriodStartIso,
    current_period_end: currentPeriodEndIso,
    updated_at: new Date().toISOString(),
  };

  if (stripeCustomerId) {
    payload.stripe_customer_id = stripeCustomerId;
  }

  if (plan) {
    payload.plan_id = plan.id;
    payload.plan_name = plan.name;
    payload.price_per_month = (plan.price_cents ?? 0) / 100;
    payload.max_notifications = plan.credits ?? 0;
  }

  console.log("🔄 customer.subscription.updated sync:", {
    stripeSubscriptionId,
    status,
  });

  await supabase
    .from("subscriptions")
    .update(payload)
    .eq("stripe_subscription_id", stripeSubscriptionId);

  // 🔁 ACTUALIZĂM ȘI CREDITS (upgrade / downgrade / renew)
  try {
    const { data: subRow } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .maybeSingle();

    if (subRow?.user_id) {
      await syncUserCreditsForPlan(
        supabase,
        subRow.user_id,
        plan?.name ?? null,
      );
    } else {
      console.warn(
        "⚠️ No subscription row found for updating credits",
        stripeSubscriptionId,
      );
    }
  } catch (err) {
    console.error("❌ Error syncing credits on subscription.updated:", err);
  }
}

// 3) customer.subscription.deleted → mark subscription cancelled + reset credits la FREE
async function handleSubscriptionDeleted(event) {
  const stripeSub = event.data?.object;
  const supabase = getSupabaseClient();
  const stripeSubscriptionId = stripeSub.id;

  console.log("🗑 customer.subscription.deleted:", stripeSubscriptionId);

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  // 🔁 RESET CREDITS LA PLAN FREE
  try {
    const { data: subRow } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", stripeSubscriptionId)
      .maybeSingle();

    if (subRow?.user_id) {
      await syncUserCreditsForPlan(supabase, subRow.user_id, "free");
    } else {
      console.warn(
        "⚠️ No subscription row found for resetting credits on delete",
        stripeSubscriptionId,
      );
    }
  } catch (err) {
    console.error("❌ Error resetting credits on subscription.deleted:", err);
  }
}

// 4) invoice.payment_succeeded → insert billing_history
async function handleInvoicePaymentSucceeded(event) {
  const invoice = event.data?.object;
  const supabase = getSupabaseClient();

  console.log("💸 invoice.payment_succeeded:", invoice.id);

  const stripeCustomerId = invoice.customer;
  const stripeInvoiceId = invoice.id;
  const amountPaid = (invoice.amount_paid ?? 0) / 100;
  const currency = (invoice.currency ?? "eur").toUpperCase();

  // status real: paid / pending
  const status =
    invoice.paid === true ||
    invoice.payment_intent?.status === "succeeded"
      ? "paid"
      : "pending";

  const invoiceNumber = invoice.number ?? null;
  const paidAt = invoice.status_transitions?.paid_at
    ? unixToIso(invoice.status_transitions.paid_at)
    : new Date().toISOString();

  // mapăm la user
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id, plan_name")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  if (!sub?.user_id) {
    console.error(
      "❌ Could not map invoice to user for customer",
      stripeCustomerId,
    );
    return;
  }

  // idempotent: nu mai inserăm a doua oară aceeași factură
  const { data: existingInvoice } = await supabase
    .from("billing_history")
    .select("id")
    .eq("stripe_invoice_id", stripeInvoiceId)
    .maybeSingle();

  if (existingInvoice) {
    console.log(
      "ℹ️ Billing history already exists for invoice",
      stripeInvoiceId,
    );
    return;
  }

  const { error } = await supabase.from("billing_history").insert([
    {
      user_id: sub.user_id,
      plan_name: sub.plan_name,
      amount: amountPaid,
      currency,
      status,
      invoice_number: invoiceNumber,
      payment_date: paidAt,
      stripe_invoice_id: stripeInvoiceId,
      stripe_customer_id: stripeCustomerId,
      type: "subscription",
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("❌ Error inserting billing_history:", error);
  } else {
    console.log("✅ Billing history saved:", invoiceNumber);
  }
}

// --------------------------------------------------------
// MAIN SERVER
// --------------------------------------------------------
serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  if (!endpointSecret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Server misconfigured", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) {
    console.error("❌ Missing stripe-signature");
    return new Response("Missing signature", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const rawBody = await req.text();

  // verify signature
  const parsed = parseStripeSignatureHeader(sigHeader);
  const timestamp = parsed["t"];
  const received = parsed["v1"];

  if (!timestamp || !received) {
    console.error("❌ Invalid Stripe signature header");
    return new Response("Invalid signature", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = await computeHmacSha256(endpointSecret, signedPayload);

  if (expected !== received) {
    console.error("❌ Stripe signature mismatch");
    return new Response("Invalid signature", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // parse event safely
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    return new Response("Bad JSON", {
      status: 400,
      headers: corsHeaders,
    });
  }

  console.log("➡️ Stripe event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event);
        break;
      default:
        // pentru celelalte evenimente doar logăm
        console.log("ℹ️ Unhandled event type:", event.type);
        break;
    }
  } catch (err) {
    console.error("❌ Error handling event:", event.type, err);
    // răspundem 200 ca să nu repete Stripe la infinit
  }

  return new Response("OK", {
    status: 200,
    headers: corsHeaders,
  });
});
