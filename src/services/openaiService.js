// ======================================================
// src/services/openaiService.js
// TravelAI – Frontend AI Service (HYBRID / PRODUCTION)
// ======================================================

import { supabase } from "../lib/supabase";
import { userService } from "./userService";

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

    // 1️⃣ Check session (optional)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 2️⃣ Call backend AI via Supabase Function (INTENT + REAL CARDS)
    const { data, error } = await supabase.functions.invoke("ai-chat", {
      body: {
        user_id: session?.user?.id || "guest",
        conversation_id: conversationId,
        prompt: userMessage,
        session_id: typeof window !== "undefined" ? userService.getSessionId() : null,
        client_path:
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}${window.location.hash}`
            : null,
        source: "openaiService",
      },
    });

    if (error) {
      console.error("❌ ai-chat invocation error:", error);
      throw error;
    }

    if (!data) {
      console.warn("⚠️ ai-chat returned no data");
      throw new Error("No data received from AI service");
    }

    console.log("✅ TravelAI ← response received:", data.reply?.substring(0, 50) + "...");

    // 3️⃣ Use response from backend (including multiple cards if present)
    return {
      id: Date.now(),
      sender: "ai",
      content: data.reply || data.message?.text || "Spune-mi cu ce te pot ajuta mai departe 😊",
      type: data.type || null,
      card: data.card || null, // legacy support
      cards: data.cards || [], // modern multi-card support
      isSupabaseMode: true,
      intent: data.intent || null,
    };

  } catch (err) {
    console.error("🔥 getTravelRecommendation error:", err);

    return {
      id: Date.now(),
      sender: "ai",
      content:
        "A apărut o eroare în comunicarea cu serviciul AI. Încearcă din nou.",
      isError: true,
      errorType: err.name || "Error",
      errorMessage: err.message
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
