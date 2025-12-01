import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* 🖼️ Fundal */}
      <img
        src="/images/travel-bg.jpg"
        alt="Travel background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* 💬 Text + Logo + Buton */}
      <div className="relative z-10 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Descoperă cele mai bune oferte de călătorie cu
        </h1>

        {/* 🚀 Logo + Numele aplicației (identic cu cel din header) */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Icon name="Plane" size={24} color="white" />
          </div>
          <span className="text-5xl font-bold text-black-400 drop-shadow-md">
            TravelAI Deals
          </span>
        </div>

        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
          Platforma inteligentă care găsește automat cele mai avantajoase
          zboruri și vacanțe.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Începe acum
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
