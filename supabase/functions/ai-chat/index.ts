import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false } }
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { user_id, conversation_id, prompt, history } = body;

    if (!user_id || !prompt) {
      return new Response(JSON.stringify({ error: "Missing user_id or prompt" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // -------------------------------------------------------
    // FETCH SUBSCRIPTION
    // -------------------------------------------------------
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    const sub = subs?.[0] || null;

    if (!sub) {
      return new Response(JSON.stringify({ error: "Subscription missing" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // -------------------------------------------------------
    // FETCH CREDITS
    // -------------------------------------------------------
    const { data: credit } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!credit) {
      return new Response(JSON.stringify({ error: "Credits missing" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // -------------------------------------------------------
    // PLAN LOGIC (PRO NU CONSUMĂ CREDITE)
    // -------------------------------------------------------
    const isPro = sub.plan_name?.toLowerCase() === "pro";
    const mustUseCredits = !isPro;

    if (mustUseCredits && credit.balance <= 0) {
      return new Response(JSON.stringify({ error: "No credits left" }), {
        status: 402,
        headers: corsHeaders
      });
    }

    // -------------------------------------------------------
    // OPENAI CALL
    // -------------------------------------------------------
    let aiText = "";
    let tokensIn = 0;
    let tokensOut = 0;

    try {
      const aiRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ești un asistent de călătorii prietenos." },
          ...(history ?? []),
          { role: "user", content: prompt }
        ]
      });

      aiText = aiRes.choices[0]?.message?.content || "";
      tokensIn = aiRes.usage?.prompt_tokens ?? 0;
      tokensOut = aiRes.usage?.completion_tokens ?? 0;
    } catch (err) {
      console.error("⚠️ OPENAI ERROR:", err);

      aiText =
        "Momentan întâmpin probleme în procesarea cererii tale. Încearcă din nou peste câteva momente. 🔧";
    }

    // -------------------------------------------------------
    // UPDATE CREDITS
    // -------------------------------------------------------
    if (mustUseCredits) {
      await supabase
        .from("credits")
        .update({
          balance: credit.balance - 1,
          lifetime_used: credit.lifetime_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user_id);
    }

    // -------------------------------------------------------
    // RETURN FIXED RESPONSE — FRONTEND EXPECTĂ EXACT “message”
    // -------------------------------------------------------
    return new Response(
      JSON.stringify({
        message: aiText,  // FIX CRUCIAL
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        remaining_credits: mustUseCredits ? credit.balance - 1 : credit.balance,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return new Response(
      JSON.stringify({
        error: "Server error: " + err.message
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
