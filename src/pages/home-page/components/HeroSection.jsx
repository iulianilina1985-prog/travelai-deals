import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

/* 🔥 IMAGINI LOCALE – NU CONTEAZĂ NUMELE */
const HERO_IMAGES = [
  //"/assets/hero/pexels-aleksandar-11487629.jpg",
  //"/assets/hero/pexels-alfie-sta-825870-5943231.jpg",
  "/assets/hero/pexels-asadphoto-1320679.jpg",
  "/assets/hero/pexels-asadphoto-1449767.jpg",
  "/assets/hero/pexels-asadphoto-3601426.jpg",
  "/assets/hero/pexels-asadphoto-9482128.jpg",
  //"/assets/hero/pexels-bianca-jelz-niac-3871365-9330289.jpg",
  "/assets/hero/pexels-efrem-efre-2786187-31238615.jpg",
  "/assets/hero/pexels-greta-soave-7237647.jpg",
];

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

const HeroSection = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  /* 🔄 ROTIRE IMAGINI – FĂRĂ FLICKER */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const image = HERO_IMAGES[index];
  const text = HERO_TEXTS[index % HERO_TEXTS.length];

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {/* 🔥 BACKGROUND REAL – FĂRĂ <img> */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* OVERLAY – CONTRAST */}
      <div className="absolute inset-0 bg-black/45" />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            {text.title}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Plane" size={24} color="white" />
            </div>
            <span className="text-5xl font-bold text-white">
              {text.highlight}
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            {text.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/cauta-oferte")}
              className="px-8 py-3 bg-white text-black rounded-lg text-lg font-medium hover:bg-gray-200 shadow-md"
            >
              Caută oferte
            </button>

            <button
              onClick={() => navigate("/ai-chat")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-lg font-medium hover:bg-indigo-700 shadow-md flex items-center gap-2"
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
