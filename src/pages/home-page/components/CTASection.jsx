import React from "react";
import Icon from "../../../components/AppIcon";

const CTASection = ({ onStart }) => {
  return (
    <section className="py-24 px-0"> 
      {/* Full width gradient background */}
      <div
        className="
          w-full 
          py-20 
          px-6
          bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
          shadow-xl
          text-white 
          relative 
          overflow-hidden
          rounded-none    /* full width, no border radius */
        "
      >
        {/* Glow layer */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none" />

        {/* Inner centered container */}
        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="Rocket" size={34} color="#ffffff" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold mb-4">
            Gata să descoperi cele mai bune oferte?
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            Creează-ți cont gratuit și lasă AI-ul să caute automat pentru tine
            cele mai mici prețuri la zboruri și hoteluri.
          </p>

          {/* Button */}
          <button
            onClick={onStart}
            className="
              bg-white text-blue-700 
              px-10 py-4 
              rounded-xl 
              text-lg 
              font-semibold
              shadow-lg 
              hover:shadow-2xl 
              hover:-translate-y-1 
              transition-all
            "
          >
            Creează contul gratuit
          </button>

        </div>
      </div>
    </section>
  );
};

export default CTASection;
