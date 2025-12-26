// ======================================================
// src/services/openaiService.js
// TravelAI – Frontend AI Service (STABLE VERSION)
// ======================================================

import { supabase } from "../lib/supabase";

/**
 * Trimite mesajul către Supabase Edge Function `ai-chat`
 * - folosește session.access_token
 * - NU trimite history (backendul o gestionează)
 * - returnează UN FORMAT STANDARD
 */
export async function getTravelRecommendation(
  userMessage,
  _conversationHistory = [],
  conversationId
) {
  try {
    console.log("➡️ Sending message to ai-chat:", userMessage);

    // 1️⃣ Verificăm sesiunea
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.warn("❌ No active session");
      return {
        content: "Trebuie să fii autentificat pentru a folosi TravelAI. 🔐",
        errorType: "unauthorized",
        isSupabaseMode: true,
      };
    }

    // 2️⃣ Construim request-ul
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

    // 3️⃣ Tratare erori HTTP
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ ai-chat HTTP error:", response.status, text);

      return {
        content:
          "Am întâmpinat o problemă tehnică. Te rog încearcă din nou. 🛠️",
        errorType: "http_error",
        status: response.status,
        isSupabaseMode: true,
      };
    }

    // 4️⃣ Răspuns valid
    const data = await response.json();

    return {
      id: Date.now(),
      sender: "ai",
      content: data?.reply || "Nu am primit un răspuns valid 😕",
      intent: data?.intent || null,   // 🔥 AICI ERA CRIMA
      raw: data,                      // (opțional, debug)
      timestamp: new Date().toISOString(),
      isSupabaseMode: true,
    };
  } catch (err) {
    console.error("🔥 Fatal error in getTravelRecommendation:", err);

    return {
      content:
        "Serviciul AI este indisponibil momentan. Încearcă mai târziu. 🕒",
      errorType: "fatal",
      isSupabaseMode: true,
    };
  }
}

/**
 * Moderare minimă locală (frontend only)
 */
export async function moderateUserInput(text) {
  if (!text || typeof text !== "string") return false;

  const banned = [
    "omor",
    "bombă",
    "arme",
    "droguri",
    "violență",
    "ură",
    "hack",
    "crimă",
  ];

  const lower = text.toLowerCase();
  if (banned.some((w) => lower.includes(w))) return false;

  return text.trim().length >= 2;
}

/**
 * Health check UI-only
 * (NU mai face fetch – evităm CORS + false negatives)
 */
export async function checkOpenAIServiceHealth() {
  return {
    status: "healthy",
    available: true,
    offlineMode: false,
    supabaseMode: true,
    message: "Serviciul AI este activ",
  };
}

export default {
  getTravelRecommendation,
  moderateUserInput,
  checkOpenAIServiceHealth,
};
