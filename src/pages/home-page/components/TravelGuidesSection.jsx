import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { GUIDES_MONTH_2026 } from "../../../data/guides";

const ITEMS_PER_WEEK = 3;

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
              key={g.slug}
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
                Practical guidance to help you plan this part of your trip more clearly.
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
