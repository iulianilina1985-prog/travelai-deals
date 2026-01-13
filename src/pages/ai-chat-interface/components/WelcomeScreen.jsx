import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

/* ==================== GREETINGS ==================== */

const greetings = [
  "Unde te poartă gândul azi, {{name}}?",
  "La ce te gândești astăzi, {{name}}?",
  "Ai chef de o aventură, {{name}}?",
  "Ce destinație îți face cu ochiul, {{name}}?",
  "Hai să plecăm undeva, {{name}} ✈️",
  "Ce plan de vacanță ai azi, {{name}}?",
  "Unde vrei să ajungem, {{name}}?",
  "Ce explorăm azi, {{name}}?",
  "Cu ce te pot ajuta, {{name}}?",
  "Pregătit de drum, {{name}}? 🌍"
];

function getFirstName(user) {
  if (!user) return "prieten";

  const full =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "";

  return full.split("@")[0].split(" ")[0] || "prieten";
}

/* ==================== COMPONENT ==================== */

const WelcomeScreen = () => {
  const [heroMessage, setHeroMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      const firstName = getFirstName(user);
      const random = greetings[Math.floor(Math.random() * greetings.length)];

      setHeroMessage(random.replace("{{name}}", firstName));
    };

    load();
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">

      {/* ================= TOP ================= */}
      <div className="text-center pt-10 pb-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow-lg">
          <Icon name="Plane" size={32} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bun venit la TravelAI ✈️
        </h1>
        <p className="text-muted-foreground">
          Asistentul tău personal pentru călătorii perfecte
        </p>
      </div>

      {/* ================= HERO ================= */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">

        <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
          {heroMessage || "La ce te gândești astăzi?"}
        </h2>

        <p className="text-muted-foreground text-lg">
          Întreabă-mă orice despre călătorii.
        </p>

      </div>

      {/* ================= STICKY FOOTER ================= */}
      <div className="sticky bottom-0 w-full bg-background/90 backdrop-blur border-t border-border py-2">
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 text-primary text-sm font-medium">
            <Icon name="Sparkles" size={14} />
            <span>
              Powered by OpenAI GPT-4 — Răspunsuri inteligente și personalizate
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WelcomeScreen;
