import React, { useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import AuthModal from "../../components/AuthModal";

import HeroSection from "./components/HeroSection";
import PartnersSection from "./components/PartnersSection";
import FeaturedDestinationsSection from "./components/FeaturedDestinationsSection";
import TravelGuidesSection from "./components/TravelGuidesSection";
import StatsSection from "./components/StatsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";
import ServicesEcosystemSection from "./components/ServicesEcosystemSection";


/* ==============================
   🖼️ IMAGINI HERO (LOCALE)
   ⚠️ NU CONTEAZĂ NUMELE
============================== */

const HERO_IMAGES = [
  "/assets/hero/paris.jpg",
  "/assets/hero/rome.png",
  "/assets/hero/barcelona.webp",
  "/assets/hero/dubai.jpeg",
  // 👉 adaugi aici toate imaginile tale
];

/* ==============================
   📅 IMAGINEA ZILEI (STABIL)
============================== */

const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0)) /
  (1000 * 60 * 60 * 24)
);

const heroBackground =
  HERO_IMAGES[dayOfYear % HERO_IMAGES.length];

/* ==============================
   🏠 HOMEPAGE
============================== */

const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-transparent">


      {/* HEADER */}
      <Header onAuthClick={openAuthModal} />

      {/* MAIN */}
      <main className="flex-grow pt-16">
        {/* HERO */}
        <HeroSection onStart={openAuthModal} />

        {/* PARTENERI */}
        <PartnersSection />

        {/* DESTINAȚII */}
        <FeaturedDestinationsSection />

        {/* GHIDURI */}
        <TravelGuidesSection />

        {/* REST */}
        <StatsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ServicesEcosystemSection />
        <CTASection onStart={openAuthModal} />
      </main>



      {/* AUTH MODAL */}
      {showAuthModal && <AuthModal onClose={closeAuthModal} />}
    </div>
  );
};

export default HomePage;
