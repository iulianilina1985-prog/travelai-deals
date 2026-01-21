import React, { useMemo } from "react";

/* ==============================
   CONFIG
============================== */

const ITEMS_PER_WEEK = 6;
const KLOOK_LINK = "https://klook.tpx.lt/IVfayTj9";

/* ==============================
   📅 DESTINAȚII – LUNA CURENTĂ
   24 destinații = 4 săptămâni
============================== */

const MONTH_DESTINATIONS = [
  // WEEK 1
  { name: "Paris", country: "Franța", image: "/assets/images/paris.png", tag: "City-break romantic" },
  { name: "Roma", country: "Italia", image: "/assets/images/roma.png", tag: "Istorie & gastronomie" },
  { name: "Barcelona", country: "Spania", image: "/assets/images/barcelona.jpg", tag: "Cultură & plajă" },
  { name: "Viena", country: "Austria", image: "/assets/images/vienna.jpg", tag: "City-break elegant" },
  { name: "Praga", country: "Cehia", image: "/assets/images/prague.jpg", tag: "Romantic & cultural" },
  { name: "Budapesta", country: "Ungaria", image: "/assets/images/budapest.jpg", tag: "Relax & băi termale" },

  // WEEK 2
  { name: "Dubai", country: "EAU", image: "/assets/images/dubai.jpg", tag: "Lux & experiențe" },
  { name: "Istanbul", country: "Turcia", image: "/assets/images/istanbul.png", tag: "Cultură & shopping" },
  { name: "Atena", country: "Grecia", image: "/assets/images/athens.jpg", tag: "Istorie & soare" },
  { name: "Lisabona", country: "Portugalia", image: "/assets/images/lisbon.jpg", tag: "City-break boem" },
  { name: "Madrid", country: "Spania", image: "/assets/images/madrid.jpg", tag: "Urban & vibrant" },
  { name: "Milano", country: "Italia", image: "/assets/images/milan.jpg", tag: "Fashion & city" },

  // WEEK 3
  { name: "Tenerife", country: "Spania", image: "/assets/images/tenerife.jpg", tag: "Soare tot anul" },
  { name: "Madeira", country: "Portugalia", image: "/assets/images/madeira.jpg", tag: "Natură & relax" },
  { name: "Malta", country: "Malta", image: "/assets/images/malta.jpg", tag: "Insulă & explorare" },
  { name: "Ibiza", country: "Spania", image: "/assets/images/ibiza.jpg", tag: "Distracție & plajă" },
  { name: "Creta", country: "Grecia", image: "/assets/images/creta.jpg", tag: "Vacanță completă" },
  { name: "Sardinia", country: "Italia", image: "/assets/images/sardinia.jpg", tag: "Plaje & relax" },

  // WEEK 4
  { name: "Amsterdam", country: "Olanda", image: "/assets/images/amsterdam.jpg", tag: "City-break cool" },
  { name: "Copenhaga", country: "Danemarca", image: "/assets/images/copenhagen.jpg", tag: "Nordic & design" },
  { name: "Stockholm", country: "Suedia", image: "/assets/images/stockholm.jpg", tag: "Natură & oraș" },
  { name: "Berlin", country: "Germania", image: "/assets/images/berlin.jpg", tag: "Cultură & istorie" },
  { name: "Edinburgh", country: "Scoția", image: "/assets/images/edinburgh.jpg", tag: "Istorie & mister" },
  { name: "Zurich", country: "Elveția", image: "/assets/images/zurich.jpg", tag: "Alpin & urban" },
];

/* ==============================
   COMPONENT
============================== */

const FeaturedDestinationsSection = () => {
  const currentWeekIndex = useMemo(() => {
    const dayOfMonth = new Date().getDate(); // 1–31
    return Math.min(Math.floor((dayOfMonth - 1) / 7), 3);
  }, []);

  const visibleDestinations = MONTH_DESTINATIONS.slice(
    currentWeekIndex * ITEMS_PER_WEEK,
    currentWeekIndex * ITEMS_PER_WEEK + ITEMS_PER_WEEK
  );

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Destinații populare recomandate de TravelAI
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Selecție editorială actualizată săptămânal, bazată pe sezon și interesul călătorilor.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Actualizat săptămânal • Conținut editorial
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleDestinations.map((dest) => (
            <article
              key={dest.name}
              className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-44 object-cover rounded-t-xl"
              />

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dest.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {dest.tag}
                  </span>
                </div>

                <p className="text-xs uppercase text-gray-400 mb-3">
                  {dest.country}
                </p>

                <a
                  href={KLOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Vezi experiențe și activități →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinationsSection;
