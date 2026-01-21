import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

/* 🔥 IMAGINI HERO (locale) */
const HERO_IMAGES = [
  "/assets/hero/pexels-asadphoto-1320679.jpg",
  "/assets/hero/pexels-asadphoto-1449767.jpg",
  "/assets/hero/pexels-asadphoto-3601426.jpg",
  "/assets/hero/pexels-asadphoto-9482128.jpg",
  "/assets/hero/pexels-efrem-efre-2786187-31238615.jpg",
  "/assets/hero/pexels-greta-soave-7237647.jpg",
];

/* 📝 TEXTE HERO */
const HERO_TEXTS = [
  {
    title: "Descoperă cele mai bune oferte de călătorie cu",
    highlight: "TravelAI Deals",
    subtitle:
      "Inteligență artificială care compară automat zboruri și vacanțe din peste 100 de surse.",
  },
  {
    title: "Planifică vacanțe inteligente cu",
    highlight: "AI-ul tău personal",
    subtitle:
      "Spune unde vrei să mergi, iar TravelAI îți găsește cele mai bune opțiuni.",
  },
  {
    title: "Călătorește mai mult, plătește mai puțin cu",
    highlight: "TravelAI Deals",
    subtitle:
      "Oferte reale, actualizate constant, fără să pierzi ore pe zeci de site-uri.",
  },
];

const ROTATE_EVERY_MS = 9000;

const HeroSection = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);

  /* 🔁 ROTIRE IMAGINI CU PRELOAD */
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % HERO_IMAGES.length;
      setIsLoaded(false);

      const img = new Image();
      img.src = HERO_IMAGES[nextIndex];
      img.onload = () => {
        setCurrentIndex(nextIndex);
        setIsLoaded(true);
      };
    }, ROTATE_EVERY_MS);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const text = HERO_TEXTS[currentIndex % HERO_TEXTS.length];

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* 🌅 BACKGROUND – fără flicker */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${HERO_IMAGES[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isLoaded ? 1 : 0,
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* 🧠 CONTENT */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {text.title}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Plane" size={24} color="white" />
            </div>
            <span className="text-4xl md:text-5xl font-bold text-white">
              {text.highlight}
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            {text.subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/cauta-oferte")}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-lg text-lg font-semibold hover:bg-gray-200 shadow-md"
            >
              Caută oferte
            </button>

            <button
              onClick={() => navigate("/ai-chat-interface")}
              className="
                w-full sm:w-auto
                px-8 py-3 rounded-lg text-lg font-semibold
                flex items-center justify-center gap-2
                shadow-md transition-all
                border border-white/70 text-white bg-white/10
                hover:bg-white/15
                sm:border-0 sm:bg-indigo-600 sm:hover:bg-indigo-700
              "
            >
              <Icon name="MessageCircle" size={18} />
              Chat AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
