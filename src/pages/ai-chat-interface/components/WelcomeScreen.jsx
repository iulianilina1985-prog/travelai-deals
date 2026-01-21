import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

/* ==================== GREETINGS ==================== */

const greetings = [
  "Where are you dreaming of going today, {{name}}?",
  "What's on your mind today, {{name}}?",
  "Feel like an adventure, {{name}}?",
  "Which destination is calling you, {{name}}?",
  "Let's go somewhere, {{name}} ✈️",
  "What's your travel plan for today, {{name}}?",
  "Where do you want to reach, {{name}}?",
  "What are we exploring today, {{name}}?",
  "How can I help you, {{name}}?",
  "Ready to hit the road, {{name}}? 🌍"
];

function getFirstName(user) {
  if (!user) return "friend";

  const full =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "";

  return full.split("@")[0].split(" ")[0] || "friend";
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
          Welcome to TravelAI ✈️
        </h1>
        <p className="text-muted-foreground">
          Your personal assistant for perfect travels
        </p>
      </div>

      {/* ================= HERO ================= */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">

        <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
          {heroMessage || "What's on your mind today?"}
        </h2>

        <p className="text-muted-foreground text-lg">
          Ask me anything about travel.
        </p>

      </div>

      {/* ================= STICKY FOOTER ================= */}
      <div className="sticky bottom-0 w-full bg-background/90 backdrop-blur border-t border-border py-2">
        <div className="flex justify-center">
          <div className="inline-flex items-center space-x-2 text-primary text-sm font-medium">
            <Icon name="Sparkles" size={14} />
            <span>
              Powered by OpenAI GPT-4 — Intelligent and personalized answers
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WelcomeScreen;
