import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import { useAuth } from "../../../contexts/AuthContext";

const CTASection = ({ onStart }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-24 px-0">
      <div className="
        w-full py-20 px-6
        bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
        shadow-xl text-white relative overflow-hidden
      ">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <Icon
                name={isAuthenticated ? "MessageCircle" : "Rocket"}
                size={34}
                color="#ffffff"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold mb-4">
            {isAuthenticated
              ? "Spune-i AI-ului ce vacanță vrei"
              : "Gata să descoperi cele mai bune oferte?"}
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            {isAuthenticated
              ? "Caută zboruri, hoteluri și experiențe personalizate în timp real, fără stres."
              : "Creează-ți cont gratuit și lasă AI-ul să caute automat pentru tine cele mai mici prețuri."}
          </p>

          {/* Button */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/ai-chat-interface")}
              className="
                bg-white text-indigo-700
                px-10 py-4 rounded-xl text-lg font-semibold
                shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all
              "
            >
              Deschide Chat AI
            </button>
          ) : (
            <button
              onClick={onStart}
              className="
                bg-white text-blue-700
                px-10 py-4 rounded-xl text-lg font-semibold
                shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all
              "
            >
              Creează contul gratuit
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
