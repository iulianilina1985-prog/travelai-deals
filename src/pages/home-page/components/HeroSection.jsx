import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background */}
      <img
        src="/images/travel-bg.jpg"
        alt="Travel background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto">
        
        {/* TITLU pe 2 rânduri — aerisit ca în poza bună */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow-lg leading-tight">
          Descoperă cele mai bune oferte de călătorie cu
        </h1>
        {/* Logo + nume */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Icon name="Plane" size={24} color="white" />
          </div>
          <span className="text-5xl font-bold text-white drop-shadow-lg">
            TravelAI Deals
          </span>
        </div>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          Platforma inteligentă care găsește automat cele mai avantajoase bilete
          de avion și vacanțe din peste 1.000 de site-uri turistice.
        </p>

        {/* Butoane */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/cauta-oferte")}
            className="px-8 py-3 bg-white text-black rounded-lg text-lg font-medium hover:bg-gray-200 transition-all shadow-md"
          >
            Caută oferte
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            Începe acum
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
