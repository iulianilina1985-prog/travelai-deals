// supabase/functions/credits-status/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

type PlanType = "free" | "basic" | "pro";

function getWordLimit(plan: PlanType): number {
  if (plan === "free") return 80;
  if (plan === "basic") return 150;
  return 220; // pro
}

function wordsToTokens(words: number): number {
  return Math.ceil(words * 1.3);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing auth token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // 1. Aflăm user-ul
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // 2. Luăm rândul din credits
    const { data: creditRow, error: creditsError } = await supabase
      .from("credits")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (creditsError) {
      console.error("credits error:", creditsError);
      return new Response(JSON.stringify({ error: "Failed to load credits" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // fallback dacă user-ul nu are rând (de siguranță)
    let plan_type: PlanType = "free";
    let balance = 0;
    let expires_at: string | null = null;

    if (creditRow) {
      plan_type = (creditRow.plan_type ?? "free") as PlanType;
      balance = creditRow.balance ?? 0;
      expires_at = creditRow.expires_at;
    }

    // 3. Calculăm dacă abonamentul e expirat
    const now = new Date();
    let isExpired = false;

    if (plan_type === "basic" || plan_type === "pro") {
      if (!expires_at) {
        isExpired = true;
      } else {
        const exp = new Date(expires_at);
        if (exp.getTime() <= now.getTime()) {
          isExpired = true;
        }
      }
    }

    // 4. Determinăm planul efectiv
    let effectivePlan: PlanType = plan_type;
    if (isExpired) {
      effectivePlan = "free";
    }

    const wordLimit = getWordLimit(effectivePlan);
    const tokenLimit = wordsToTokens(wordLimit);

    // 5. Poate userul să trimită mesaj?
    const canChat =
      effectivePlan === "pro" // pro activ nu are limită de credite
        ? true
        : balance > 0;        // free/basic au nevoie de credite

    const responseBody = {
      plan_type,
      effective_plan: effectivePlan,
      is_expired: isExpired,
      balance,
      word_limit: wordLimit,
      token_limit: tokenLimit,
      can_chat: canChat,
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
