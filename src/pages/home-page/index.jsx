import React, { useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import AuthModal from "../../components/AuthModal";
import TravelGuidesSection from "./components/TravelGuidesSection";

// 🔥 Noua secțiune de conținut travel
import FeaturedDestinationsSection from "./components/FeaturedDestinationsSection";

import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import PartnersSection from "./components/PartnersSection"; // 🔥 Nou

const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <div className="relative min-h-screen flex flex-col text-foreground overflow-hidden">

      {/* 🌅 Background doar în prima zonă (hero) */}
      <div className="absolute top-0 left-0 w-full h-[550px] -z-10 overflow-hidden">
        <img
          src="/assets/images/frontimage.png"
          alt="Travel AI background"
          className="w-full h-full object-cover opacity-[0.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/90 backdrop-blur-[2px]" />
      </div>

      {/* HEADER */}
      <Header onAuthClick={openAuthModal} />

      {/* MAIN CONTENT */}
      <main className="flex-grow">

        <HeroSection onStart={openAuthModal} />

        {/* 🔥 Secțiune parteneri logo */}
        <PartnersSection />

        {/* 🗺️ Secțiune cu destinații — OBLIGATORIE pentru Travelpayouts */}
        <FeaturedDestinationsSection />

        {/* 🔥 GHIDURI TRAVEL – Conținut editorial pentru Travelpayouts */}
        <TravelGuidesSection />

        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection onStart={openAuthModal} />
      </main>
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
    </div>
  );
};

export default HomePage;
