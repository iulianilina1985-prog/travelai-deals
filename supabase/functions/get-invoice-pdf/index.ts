// supabase/functions/get-invoice-pdf/index.ts
import Stripe from "npm:stripe@12.0.0";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// -------------------------------------------------
// CORS — corect și complet
// -------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// -------------------------------------------------
serve(async (req) => {
  // Preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // ------------------------------
    // Read JSON body
    // ------------------------------
    const { invoiceId } = await req.json();
    if (!invoiceId) {
      return new Response(
        JSON.stringify({ error: "Missing invoiceId" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ------------------------------
    // Check JWT
    // ------------------------------
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing token" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // ------------------------------
    // Supabase auth
    // ------------------------------
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: authUser, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !authUser?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // ------------------------------
    // Stripe client
    // ------------------------------
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    // ------------------------------
    // Retrieve invoice
    // ------------------------------
    const invoice = await stripe.invoices.retrieve(invoiceId);

    if (!invoice?.invoice_pdf) {
      return new Response(
        JSON.stringify({ error: "Invoice PDF not available" }),
        { status: 404, headers: corsHeaders }
      );
    }

    // ------------------------------
    // Download actual PDF from Stripe
    // ------------------------------
    const pdfResponse = await fetch(invoice.invoice_pdf);
    const pdfBinary = await pdfResponse.arrayBuffer();

    // ------------------------------
    // Send PDF back to frontend
    // ------------------------------
    return new Response(pdfBinary, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
      },
    });

  } catch (err) {
    console.error("❌ PDF ERROR:", err);
    return new Response(
      JSON.stringify({ error: "Failed to download PDF" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
