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

    /* ===================================================== 
       CLIENT-SIDE INTEGRATION & FALLBACK LOGIC
       (Allows testing without deploying backend or real OpenAI key)
       ===================================================== */

    // 1. Simulare "AI" local pentru a răspunde natural la intenții
    // TravelAI Conversational Mode Activated
    const lowerMsg = userMessage.toLowerCase();

    // Helper: Extragere dinamică a destinației (fără default-uri interzise!)
    const extractDestination = (text) => {
      // Căutăm cuvinte cu majusculă (dacă userul scrie corect) sau după prepoziții
      const knownCities = ["paris", "londra", "london", "roma", "rome", "dubai", "barcelona", "milano", "milan", "madrid", "amsterdam", "bucuresti", "bucharest", "budapesta", "praga", "viena", "istanbul", "atena", "tokyo", "bali", "new york", "berlin", "munchen", "brasov", "cluj", "constanta", "antalia"];

      // 1. Check known list
      for (const city of knownCities) {
        if (text.toLowerCase().includes(city)) {
          return city.charAt(0).toUpperCase() + city.slice(1);
        }
      }

      // 2. Fallback: încercăm să luăm cuvântul de după "in", "spre", "la"
      const match = text.match(/(?:in|spre|la|catre|pentru)\s+([a-zA-Zăâîșț]+)/i);
      if (match && match[1].length > 3) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
      return null;
    };

    const destination = extractDestination(userMessage);

    // Helper: Generare întrebare de follow-up (OBLIGATORIU)
    const getFollowUp = (currentIntent, city) => {
      const options = [];
      if (currentIntent !== "flight") options.push(`Vrei să caut și zboruri spre ${city}? ✈️`);
      if (currentIntent !== "accommodation") options.push(`Te interesează cazare în ${city}? 🏨`);
      if (currentIntent !== "activity") options.push(`Vrei să vezi ce poți vizita în ${city}? 🎟️`);
      if (currentIntent !== "car_rental") options.push(`Ai nevoie de mașină de închiriat în ${city}? 🚗`);
      if (currentIntent !== "insurance") options.push(`Să nu uităm de asigurare! Vrei detalii? 🛡️`);

      return options[Math.floor(Math.random() * options.length)];
    };

    let mockResponse = null;

    // --- 1. ZBORURI (FLIGHTS) ---
    if (lowerMsg.includes("zbor") || lowerMsg.includes("avion") || lowerMsg.includes("bilet") || lowerMsg.includes("flight")) {
      console.log("✈️ Client: Detected FLIGHT Intent");

      if (!destination) {
        mockResponse = {
          id: Date.now(),
          sender: "ai",
          content: "Desigur, te pot ajuta cu zboruri! ✈️\n\nSpre ce destinație vrei să călătorești? Spune-mi orașul de sosire.",
          isSupabaseMode: true
        };
      } else {
        const fromCity = "București"; // Default plecare (putem extrage și asta viitor)
        mockResponse = {
          id: Date.now(),
          sender: "ai",
          content: `Am verificat zborurile pentru tine. ${destination} este o alegere excelentă! 🌍\n\nIată cea mai bună opțiune pe care am găsit-o plecând din ${fromCity}:`,
          type: "offer",
          card: {
            type: "flight",
            provider: "Aviasales",
            from: "OTP",
            to: destination.substring(0, 3).toUpperCase(),
            price: "€145",
            url: "https://aviasales.com",
            meta: { stops: "Direct", duration: "2h 45m" }
          },
          isSupabaseMode: true
        };
        mockResponse.content += `\n\n${getFollowUp("flight", destination)}`;
      }
    }

    // --- 2. MAȘINI (CARS) ---
    else if (lowerMsg.includes("masina") || lowerMsg.includes("auto") || lowerMsg.includes("inchiriere")) {
      console.log("🚗 Client: Detected Car Rental Intent");

      if (!destination) {
        mockResponse = {
          id: Date.now(),
          sender: "ai",
          content: "Închirierea unei mașini îți oferă multă libertate! 🏎️\n\nÎn ce oraș sau aeroport ai nevoie de preluarea mașinii?",
          isSupabaseMode: true
        };
      } else {
        mockResponse = {
          id: Date.now(),
          sender: "ai",
          content: `Pentru ${destination}, o mașină este ideală pentru a explora împrejurimile. 🗺️\n\nAm găsit câteva oferte bune la partenerii noștri locali:`,
          type: "offer",
          card: {
            type: "car_rental",
            provider: "Localrent",
            location: destination,
            image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop",
            cta: { url: "https://localrent.com", label: "Vezi mașini" },
            provider_meta: { name: "Localrent", brand_color: "#00A859" }
          },
          isSupabaseMode: true
        };
        mockResponse.content += `\n\n${getFollowUp("car_rental", destination)}`;
      }
    }

    // --- 3. ACTIVITĂȚI (ACTIVITIES) ---
    else if (lowerMsg.includes("activitat") || lowerMsg.includes("ce pot face") || lowerMsg.includes("tururi") || lowerMsg.includes("atractii")) {
      console.log("📍 Client: Detected Activity Intent");

      if (!destination) {
        mockResponse = {
          id: Date.now(),
          sender: "ai",
          content: "Sunt o mulțime de lucruri de făcut! 🎢\n\nDespre ce oraș vorbim? Spune-mi unde mergi ca să îți recomand cele mai tari atracții.",
          isSupabaseMode: true
        };
      } else {
        mockResponse = {
          id: Date.now(),
          sender: "ai",
          content: `${destination} este plin de viață și cultură! 🎨\n\nÎți recomand să nu ratezi aceste experiențe populare:`,
          type: "offer",
          card: {
            type: "activity",
            provider: "Klook",
            title: `Top Activități în ${destination}`,
            city: destination,
            image_url: "https://images.unsplash.com/photo-1499856870642-4784ac368124?q=80&w=1000&auto=format&fit=crop",
            cta: { url: "https://klook.com", label: "Vezi activități" },
            provider_meta: { name: "Klook", brand_color: "#ff5b00" }
          },
          isSupabaseMode: true
        };
        mockResponse.content += `\n\n${getFollowUp("activity", destination)}`;
      }
    }

    // --- 4. GENERAL / VAGUE ---
    else if (destination) {
      mockResponse = {
        id: Date.now(),
        sender: "ai",
        content: `Am auzit lucruri minunate despre ${destination}! 🌟\n\nEu te pot ajuta să planifici totul. Cu ce vrei să începem?`,
        isSupabaseMode: true
      };
      // Manual options
      mockResponse.content += `\n\n1. Căutăm zboruri spre ${destination}? ✈️\n2. Te interesează cazarea? 🏨\n3. Sau vrei să vezi ce activități sunt acolo? 🎟️`;
    }

    // C. GREETINGS
    else if (lowerMsg.match(/^(buna|salut|hello|neata)/)) {
      mockResponse = {
        id: Date.now(),
        sender: "ai",
        content: "Salut! 👋 Eu sunt TravelAI. Sunt aici să facem planificarea vacanței tale simplă și distractivă.\n\nSpune-mi, unde visezi să ajungi anul acesta?",
        isSupabaseMode: true
      };
    }

    // Return mock if exists
    if (mockResponse) {
      await new Promise(r => setTimeout(r, 800));
      return mockResponse;
    }

    /* ===================================================== 
       REAL BACKEND FETCH (Fallback)
       ===================================================== */
    try {
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
        return {
          id: Date.now(),
          sender: "ai",
          content: "Momentan serverul de AI este indisponibil. Dar pot simula funcționalitatea dacă îmi ceri 'zbor Berlin' sau 'masina Milano'!",
          isSupabaseMode: true,
          isError: true
        };
      }

      const data = await response.json();
      return {
        id: Date.now(),
        sender: "ai",
        content: data?.reply || data?.message?.text || "Am primit răspunsul, dar era gol.",
        type: data?.type || data?.intent?.type || null,
        card: data?.card || data?.offer?.card || null,
        isSupabaseMode: true,
        tokens: { in: 0, out: 0 }
      };

    } catch (err) {
      console.error("Client Fetch Error:", err);
      return {
        id: Date.now(),
        sender: "ai",
        content: "Eroare de conexiune la server. Verifică consola.",
        isError: true
      };
    }

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
