import React from "react";
import { Link } from "react-router-dom";

const guides = [
  {
    title: "Top 5 destinații accesibile în 2025",
    image: "/assets/guides/guides1.jpg",
    description:
      "Descoperă orașele europene cu cel mai bun raport calitate-preț în 2025. Analizăm trenduri, costuri și rute aeriene pentru escapade ieftine.",
    link: "/ghiduri/destinatii-2025",
  },
  {
    title: "Cum găsești cele mai ieftine bilete de avion",
    image: "/assets/guides/guides2.jpg",
    description:
      "Flexibilitatea datei și căutările inteligente pot reduce costul biletelor chiar și cu 40%. Află cum să profiți de strategiile de smart-booking.",
    link: "/ghiduri/bilete-ieftine",
  },
  {
    title: "Când este cel mai bun moment să rezervi un hotel",
    image: "/assets/guides/guides3.jpg",
    description:
      "Prețurile hotelurilor variază în funcție de sezon și cerere. Îți arătăm când să rezervi pentru a obține cele mai bune tarife fără compromisuri.",
    link: "/ghiduri/rezervare-hotel",
  },
];

const TravelGuidesSection = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-10 text-center text-foreground">
          Ghiduri și sfaturi de călătorie
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {guides.map((g) => (
            <article
              key={g.title}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 border border-gray-100"
            >
              <img
                src={g.image}
                alt={g.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <h3 className="text-lg font-semibold mb-2">{g.title}</h3>

              <p className="text-sm text-gray-600 mb-4">{g.description}</p>

              {/* 🔗 Link către pagina ghidului */}
              <Link
                to={g.link}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Citește mai mult →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelGuidesSection;
