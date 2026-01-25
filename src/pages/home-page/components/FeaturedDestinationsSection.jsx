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
  { name: "Paris", country: "France", image: "/assets/images/paris.png", tag: "Romantic City-break" },
  { name: "Rome", country: "Italy", image: "/assets/images/roma.png", tag: "History & Gastronomy" },
  { name: "Barcelona", country: "Spain", image: "/assets/images/barcelona.jpg", tag: "Culture & Beach" },
  { name: "Vienna", country: "Austria", image: "/assets/images/vienna.jpg", tag: "Elegant City-break" },
  { name: "Prague", country: "Czech Republic", image: "/assets/images/prague.jpg", tag: "Romantic & Cultural" },
  { name: "Budapest", country: "Hungary", image: "/assets/images/budapest.jpg", tag: "Relax & Thermal Baths" },

  // WEEK 2
  { name: "Dubai", country: "UAE", image: "/assets/images/dubai.jpg", tag: "Luxury & Experiences" },
  { name: "Istanbul", country: "Turkey", image: "/assets/images/istanbul.png", tag: "Culture & Shopping" },
  { name: "Athens", country: "Greece", image: "/assets/images/athens.jpg", tag: "History & Sun" },
  { name: "Lisbon", country: "Portugal", image: "/assets/images/lisbon.jpg", tag: "Bohemian City-break" },
  { name: "Madrid", country: "Spain", image: "/assets/images/madrid.jpg", tag: "Urban & Vibrant" },
  { name: "Milan", country: "Italy", image: "/assets/images/milan.jpg", tag: "Fashion & City" },

  // WEEK 3
  { name: "Tenerife", country: "Spain", image: "/assets/images/tenerife.jpg", tag: "Sun year-round" },
  { name: "Madeira", country: "Portugal", image: "/assets/images/madeira.jpg", tag: "Nature & Relax" },
  { name: "Malta", country: "Malta", image: "/assets/images/malta.jpg", tag: "Island & Exploration" },
  { name: "Ibiza", country: "Spain", image: "/assets/images/ibiza.jpg", tag: "Fun & Beach" },
  { name: "Crete", country: "Greece", image: "/assets/images/creta.jpg", tag: "Complete Vacation" },
  { name: "Sardinia", country: "Italy", image: "/assets/images/sardinia.jpg", tag: "Beaches & Relax" },

  // WEEK 4
  { name: "Amsterdam", country: "Netherlands", image: "/assets/images/amsterdam.jpg", tag: "Cool City-break" },
  { name: "Copenhagen", country: "Denmark", image: "/assets/images/copenhagen.jpg", tag: "Nordic & Design" },
  { name: "Stockholm", country: "Sweden", image: "/assets/images/stockholm.jpg", tag: "Nature & City" },
  { name: "Berlin", country: "Germany", image: "/assets/images/berlin.jpg", tag: "Culture & History" },
  { name: "Edinburgh", country: "Scotland", image: "/assets/images/edinburgh.jpg", tag: "History & Mystery" },
  { name: "Zurich", country: "Switzerland", image: "/assets/images/zurich.jpg", tag: "Alpine & Urban" },
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
              Popular Destinations Recommended by TravelAI
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Editorial inspiration based on season and traveler interest. Availability and prices depend on providers.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Updated Weekly • Editorial Content
          </p>
        </div>

        {/* Grid */}
        <div
          className="
            flex gap-4 overflow-x-auto pb-4
            snap-x snap-mandatory
            md:grid md:overflow-visible md:pb-0
            md:grid-cols-2 lg:grid-cols-3
          "
        >
          {visibleDestinations.map((dest) => (
            <article
              key={dest.name}
              className="
                min-w-[85%] snap-start
                md:min-w-0
                rounded-xl border border-gray-100
                bg-white shadow-sm
                hover:shadow-md transition
              "
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
                  See experiences and activities →
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
