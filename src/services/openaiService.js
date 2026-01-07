// ======================================================
// src/services/openaiService.js
// TravelAI – Frontend AI Service (HYBRID / PRODUCTION)
// ======================================================

import { supabase } from "../lib/supabase";

// Affiliate links (NO API, redirect only)
const KLOOK_AFFILIATE_URL = "https://klook.tpx.lt/jnEi9ZtF";
const LOCALRENT_AFFILIATE_URL = "https://localrent.tpx.lt/BDajXZeJ";

export async function getTravelRecommendation(
  userMessage,
  _conversationHistory = [],
  conversationId
) {
  try {
    console.log("➡️ TravelAI → ai-chat:", userMessage);

    // 1️⃣ Check session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        id: Date.now(),
        sender: "ai",
        content: "Trebuie să fii autentificat pentru a folosi TravelAI 🔐",
        isError: true,
      };
    }

    // 2️⃣ Call backend AI (INTENT + REAL CARDS)
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_id: session.user.id,
          conversation_id: conversationId,
          prompt: userMessage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("AI backend error");
    }

    const data = await response.json();

    // 3️⃣ Use response from backend (including multiple cards if present)
    return {
      id: Date.now(),
      sender: "ai",
      content: data.reply || data.message?.text || "Spune-mi cu ce te pot ajuta mai departe 😊",
      type: data.type || null,
      card: data.card || null, // legacy support
      cards: data.cards || [], // modern multi-card support
      isSupabaseMode: true,
    };

  } catch (err) {
    console.error("🔥 getTravelRecommendation error:", err);

    return {
      id: Date.now(),
      sender: "ai",
      content:
        "A apărut o eroare în comunicarea cu serviciul AI. Încearcă din nou.",
      isError: true,
    };
  }
}

/**
 * Minimal frontend moderation
 */
export async function moderateUserInput(text) {
  if (!text || typeof text !== "string") return false;

  const banned = ["omor", "bombă", "arme", "droguri", "violență", "ură"];

  const lower = text.toLowerCase();
  if (banned.some((w) => lower.includes(w))) return false;

  return text.trim().length >= 2;
}

/**
 * UI health check
 */
export async function checkOpenAIServiceHealth() {
  return {
    status: "healthy",
    available: true,
    supabaseMode: true,
  };
}

export default {
  getTravelRecommendation,
  moderateUserInput,
  checkOpenAIServiceHealth,
};
