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

    // 2️⃣ Call backend AI (INTENT + optional REAL CARD)
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

    // 3️⃣ Dacă backend-ul a trimis CARD REAL (ex: Aviasales) → îl folosim
    if (data?.card) {
      return {
        id: Date.now(),
        sender: "ai",
        content: data.reply,
        type: data.card.type,
        card: data.card,
        isSupabaseMode: true,
      };
    }

    // 4️⃣ FALLBACK FRONTEND – affiliate-only cards (NO API)
    const lower = userMessage.toLowerCase();

    // 🚗 LOCALRENT – PRIORITATE MAXIMĂ
    if (
      lower.includes("masina") ||
      lower.includes("mașină") ||
      lower.includes("auto") ||
      lower.includes("inchiri")
    ) {
      return {
        id: Date.now(),
        sender: "ai",
        content: "Pentru flexibilitate maximă, îți recomand o mașină 👇",
        type: "car_rental",
        card: {
          type: "car_rental",
          provider: "Localrent",
          image_url: "/assets/images/car-default.jpg",
          cta: {
            label: "Vezi mașini disponibile",
            url: LOCALRENT_AFFILIATE_URL,
          },
          provider_meta: {
            name: "Localrent",
            brand_color: "#00A859",
          },
        },
      };
    }

    // 🎟️ KLOOK – doar dacă NU e mașină
    if (
      lower.includes("activ") ||
      lower.includes("ce pot face") ||
      lower.includes("atract")
    ) {
      return {
        id: Date.now(),
        sender: "ai",
        content: "Am găsit activități populare pentru destinația ta 👇",
        type: "activity",
        card: {
          type: "activity",
          provider: "Klook",
          image_url: "/assets/images/activity-default.jpg",
          cta: {
            label: "Vezi activități",
            url: KLOOK_AFFILIATE_URL,
          },
          provider_meta: {
            name: "Klook",
            brand_color: "#ff5b00",
          },
        },
      };
    }

    // 5️⃣ Default fallback text (IMPORTANT!)
    return {
      id: Date.now(),
      sender: "ai",
      content: data?.reply ?? "Spune-mi cu ce te pot ajuta mai departe 😊",
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
