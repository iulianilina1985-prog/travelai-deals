import React from "react";
import Icon from "../../../components/AppIcon";

const FeaturesSection = () => {
  const features = [
    {
      icon: "Bot",
      title: "Căutare automată AI",
      desc: "Algoritmul nostru analizează în timp real mii de oferte și găsește cele mai bune variante pentru tine.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "Bell",
      title: "Notificări instant",
      desc: "Primești alerte inteligente când prețurile scad sau apare o ofertă mai bună.",
      color: "from-indigo-500 to-violet-600",
    },
    {
      icon: "ShieldCheck",
      title: "Date sigure",
      desc: "Respectăm cele mai stricte standarde GDPR. Datele tale rămân mereu în siguranță.",
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-4xl font-extrabold text-center mb-14 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Ce îți oferă TravelAI Deals
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((item, i) => (
          <div
            key={i}
            className="
              p-8 
              rounded-2xl 
              bg-white 
              shadow-lg 
              border border-gray-200
              text-center
              transition-all duration-300
              hover:-translate-y-2
              hover:shadow-2xl
              hover:border-blue-500/40
              hover:bg-gradient-to-b hover:from-white hover:to-blue-50
            "
          >
            {/* ICON */}
            <div
              className={`
                w-16 h-16 mx-auto rounded-full 
                flex items-center justify-center 
                bg-gradient-to-br ${item.color} text-white 
                shadow-lg shadow-blue-500/20
                group-hover:scale-110 
                transition duration-300
              `}
            >
              <Icon name={item.icon} size={30} color="#fff" />
            </div>

            {/* TITLU */}
            <h3 className="text-2xl font-semibold mt-6 text-gray-900">
              {item.title}
            </h3>

            {/* DESCRIERE */}
            <p className="text-gray-600 mt-3 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
