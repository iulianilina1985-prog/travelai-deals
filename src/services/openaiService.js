// src/services/openaiService.js
// -------------------------------------------------------
// TravelAI Frontend Service - CLEAN VERSION (fără credite)
// -------------------------------------------------------

import { supabase } from "../lib/supabase";

/**
 * Trimite mesajul la funcția Supabase Edge `ai-chat`
 * - gestionează istoricul
 * - apelează modelul AI pe backend
 */
export async function getTravelRecommendation(
  userMessage,
  conversationHistory = [],
  conversationId
) {
  try {
    console.log("➡️ Sending message to Edge Function:", userMessage);
    

    // 1️⃣ Obținem sesiunea userului
    const { data: { session } } = await supabase.auth.getSession();
    

    if (!session) {
      return {
        content: "Trebuie să fii autentificat pentru a folosi TravelAI. 🔐",
        errorType: "unauthorized",
      };
    }

    // 2️⃣ Trimitem mesajul către Edge Function
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session.user.id,
          conversation_id: conversationId,
          prompt: userMessage,
          history: conversationHistory,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Edge error:", err);

      return {
        content: "Am întâmpinat o eroare. Încearcă din nou. 🔧",
        errorType: "technical_error",
      };
    }

    // 3️⃣ Răspuns valid
    const data = await response.json();

    return {
      id: Date.now(),
      sender: "ai",
      content: data.reply,        // <-- UN SINGUR câmp, standardizat în toată aplicația
      isSupabaseMode: true,
      timestamp: new Date().toISOString(),
    };

  } catch (err) {
    console.error("🔥 Fatal frontend error:", err);
    return {
      content: "Serviciul este indisponibil momentan. Încearcă mai târziu. 🕒",
      errorType: "fatal",
    };
  }
}

/**
 * Moderare minimă locală
 */
export async function moderateUserInput(text) {
  if (!text || typeof text !== "string") return false;

  const banned = [
    "omor", "bombă", "arme", "droguri",
    "violență", "ură", "hack", "crimă",
  ];

  const lower = text.toLowerCase();
  if (banned.some(w => lower.includes(w))) return false;

  return text.length >= 2;
}

/**
 * Verifică dacă backend-ul e online
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
