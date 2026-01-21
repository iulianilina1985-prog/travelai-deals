import React, { useMemo } from "react";
import { Link } from "react-router-dom";

/* ==============================
   CONFIG
============================== */

const ITEMS_PER_WEEK = 3;

/* ==============================
   📘 GHIDURI – LUNA CURENTĂ (2026)
   12 articole = 4 săptămâni
============================== */

const GUIDES_MONTH_2026 = [
  // WEEK 1
  {
    title: "Top destinații accesibile în 2026",
    image: "/assets/guides/guides1.jpg",
    description:
      "Orașe și regiuni cu cel mai bun raport calitate–preț în 2026. Analizăm costuri reale, sezonalitate și zboruri avantajoase.",
    link: "/ghiduri/destinatii-accesibile-2026",
  },
  {
    title: "Cum găsești bilete de avion mai ieftine în 2026",
    image: "/assets/guides/guides2.jpg",
    description:
      "Strategii actualizate pentru 2026: flexibilitate, alerte de preț și căutări inteligente care pot reduce costurile semnificativ.",
    link: "/ghiduri/bilete-ieftine-2026",
  },
  {
    title: "Greșeli frecvente când rezervi o vacanță",
    image: "/assets/guides/guides3.jpg",
    description:
      "De la date prost alese la taxe ascunse. Vezi ce să eviți pentru a nu plăti mai mult decât este necesar.",
    link: "/ghiduri/greseli-rezervare-vacanta",
  },

  // WEEK 2
  {
    title: "Când este cel mai bun moment să rezervi un hotel",
    image: "/assets/guides/guides4.jpg",
    description:
      "Prețurile hotelurilor fluctuează constant. Îți explicăm când să rezervi pentru cele mai bune tarife în 2026.",
    link: "/ghiduri/cand-rezervi-hotel",
  },
  {
    title: "City-break vs vacanță lungă: ce alegi?",
    image: "/assets/guides/guides5.jpg",
    description:
      "Comparăm costurile, experiențele și beneficiile fiecărei opțiuni, în funcție de buget și timp.",
    link: "/ghiduri/city-break-vs-vacanta",
  },
  {
    title: "Cum economisești bani folosind activități locale",
    image: "/assets/guides/guides6.jpg",
    description:
      "Tururi, bilete și experiențe locale pot fi mai ieftine decât crezi. Află cum să le alegi corect.",
    link: "/ghiduri/activitati-locale-economii",
  },

  // WEEK 3
  {
    title: "Cele mai bune perioade pentru vacanțe în Europa",
    image: "/assets/guides/europe-seasons.jpg",
    description:
      "Sezon de vârf vs extra-sezon. Unde și când merită să călătorești în 2026.",
    link: "/ghiduri/perioade-vacante-europa",
  },
  {
    title: "Cum să eviți taxele ascunse la rezervări",
    image: "/assets/guides/hidden-fees.jpg",
    description:
      "Bagaje, comisioane, conversii valutare. Ghid practic pentru a plăti exact cât te aștepți.",
    link: "/ghiduri/taxe-ascunse-rezervari",
  },
  {
    title: "Vacanțe potrivite pentru munca remote",
    image: "/assets/guides/remote-work.jpg",
    description:
      "Destinații prietenoase cu nomazii digitali: internet, costuri, stil de viață.",
    link: "/ghiduri/vacante-remote-work",
  },

  // WEEK 4
  {
    title: "Cum alegi asigurarea de călătorie potrivită",
    image: "/assets/guides/guides10.jpg",
    description:
      "Ce acoperă, ce nu și când merită să o faci. Ghid simplu pentru 2026.",
    link: "/ghiduri/asigurare-calatorie",
  },
  {
    title: "Activități care merită rezervate din timp",
    image: "/assets/guides/guides11.jpg",
    description:
      "Atracții și experiențe care se epuizează rapid. Ce să rezervi înainte să pleci.",
    link: "/ghiduri/activitati-rezervare-din-timp",
  },
  {
    title: "Cum planifici o vacanță fără stres",
    image: "/assets/guides/guides12.jpg",
    description:
      "Checklist complet: de la bilete la activități, pentru o vacanță organizată cap-coadă.",
    link: "/ghiduri/planificare-vacanta",
  },
];

/* ==============================
   COMPONENT
============================== */

const TravelGuidesSection = () => {
  const currentWeekIndex = useMemo(() => {
    const dayOfMonth = new Date().getDate(); // 1–31
    return Math.min(Math.floor((dayOfMonth - 1) / 7), 3);
  }, []);

  const visibleGuides = GUIDES_MONTH_2026.slice(
    currentWeekIndex * ITEMS_PER_WEEK,
    currentWeekIndex * ITEMS_PER_WEEK + ITEMS_PER_WEEK
  );

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl lg:text-3xl font-bold mb-10 text-center text-gray-900">
          Ghiduri și sfaturi de călătorie
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {visibleGuides.map((g) => (
            <article
              key={g.title}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 border border-gray-100"
            >
              <img
                src={g.image}
                alt={g.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {g.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {g.description}
              </p>

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
