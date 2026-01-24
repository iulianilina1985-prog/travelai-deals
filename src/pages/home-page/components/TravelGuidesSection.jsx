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
    title: "Top affordable destinations in 2026",
    image: "/assets/guides/guides1.jpg",
    description:
      "Cities and regions with the best value for money in 2026. We analyze real costs, seasonality, and advantageous flights.",
    link: "/ghiduri/destinatii-accesibile-2026",
  },
  {
    title: "How to find cheaper flight tickets in 2026",
    image: "/assets/guides/guides2.jpg",
    description:
      "Updated strategies for 2026: flexibility, price alerts, and smart searches that can significantly reduce costs.",
    link: "/ghiduri/bilete-ieftine-2026",
  },
  {
    title: "Common mistakes when booking a vacation",
    image: "/assets/guides/guides3.jpg",
    description:
      "From poorly chosen dates to hidden fees. See what to avoid so you don't pay more than necessary.",
    link: "/ghiduri/greseli-rezervare-vacanta",
  },

  // WEEK 2
  {
    title: "When is the best time to book a hotel",
    image: "/assets/guides/guides4.jpg",
    description:
      "Hotel prices fluctuate constantly. We explain when to book for the best rates in 2026.",
    link: "/ghiduri/cand-rezervi-hotel",
  },
  {
    title: "City-break vs. long vacation: what to choose?",
    image: "/assets/guides/guides5.jpg",
    description:
      "We compare the costs, experiences, and benefits of each option, depending on budget and time.",
    link: "/ghiduri/city-break-vs-vacanta",
  },
  {
    title: "How to save money using local activities",
    image: "/assets/guides/guides6.jpg",
    description:
      "Local tours, tickets, and experiences can be cheaper than you think. Learn how to choose them correctly.",
    link: "/ghiduri/activitati-locale-economii",
  },

  // WEEK 3
  {
    title: "The best times for vacations in Europe",
    image: "/assets/guides/europe-seasons.jpg",
    description:
      "Peak season vs. off-season. Where and when it's worth traveling in 2026.",
    link: "/ghiduri/perioade-vacante-europa",
  },
  {
    title: "How to avoid hidden fees when booking",
    image: "/assets/guides/hidden-fees.jpg",
    description:
      "Luggage, commissions, currency conversions. A practical guide to paying exactly what you expect.",
    link: "/ghiduri/taxe-ascunse-rezervari",
  },
  {
    title: "Vacations suitable for remote work",
    image: "/assets/guides/remote-work.jpg",
    description:
      "Digital nomad-friendly destinations: internet, costs, lifestyle.",
    link: "/ghiduri/vacante-remote-work",
  },

  // WEEK 4
  {
    title: "How to choose the right travel insurance",
    image: "/assets/guides/guides10.jpg",
    description:
      "What it covers, what it doesn't, and when it's worth it. Simple guide for 2026.",
    link: "/ghiduri/asigurare-calatorie",
  },
  {
    title: "Activities worth booking in advance",
    image: "/assets/guides/guides11.jpg",
    description:
      "Attractions and experiences that sell out quickly. What to book before you go.",
    link: "/ghiduri/activitati-rezervare-din-timp",
  },
  {
    title: "How to plan a stress-free vacation",
    image: "/assets/guides/guides12.jpg",
    description:
      "Complete checklist: from tickets to activities, for an end-to-end organized vacation.",
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
          Travel Guides and Tips
        </h2>

        <div
          className="
            flex gap-4 overflow-x-auto pb-4
            snap-x snap-mandatory
            sm:grid sm:overflow-visible sm:pb-0
            sm:grid-cols-2 lg:grid-cols-3
          "
        >
          {visibleGuides.map((g) => (
            <article
              key={g.title}
              className="
                min-w-[85%] snap-start
                sm:min-w-0
                bg-white rounded-xl
                shadow-sm hover:shadow-lg
                transition p-5
                border border-gray-100
              "
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
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelGuidesSection;
