import React from "react";
import SEO from "../../components/seo/SEO";

const cities = [
  {
    id: 1,
    name: "Budapest, Hungary",
    image: "/assets/guides/budapesta.jpg",
    description:
      "Budapest remains one of the cheapest European capitals for a city break. The bridges over the Danube, the thermal baths, and the Jewish quarter offer memorable experiences at affordable prices. Public transport is excellent, and the local food is surprisingly cheap. Ideal for couples and groups.",
    link: "https://www.booking.com/city/hu/budapest.en-gb.html",
  },
  {
    id: 2,
    name: "Athens, Greece",
    image: "/assets/guides/atena.jpg",
    description:
      "Athens combines ancient history with accessible beaches just minutes from the city. Flight prices are low most of the year, and traditional restaurants offer cheap menus. Perfect for those who want culture + relaxation without spending a fortune.",
    link: "https://www.booking.com/city/gr/athens.en-gb.html",
  },
  {
    id: 3,
    name: "Prague, Czech Republic",
    image: "/assets/guides/praga.jpg",
    description:
      "Prague is considered by many to be the most beautiful European capital. With gothic castles, impressive bridges, and bohemian neighborhoods, the city offers a lot for small budgets. Accommodation is cheap, and Czech beer is famous for its low price.",
    link: "https://www.booking.com/city/cz/prague.en-gb.html",
  },
  {
    id: 4,
    name: "Valencia, Spain",
    image: "/assets/guides/valencia.jpg",
    description:
      "A sunny city all year round, with excellent food (original paella!) and wide, clean, and free beaches. Flights to Valencia are among the cheapest in Spain. Ideal for families and sea lovers.",
    link: "https://www.booking.com/city/es/valencia.en-gb.html",
  },
  {
    id: 5,
    name: "Krakow, Poland",
    image: "/assets/guides/krakow.jpg",
    description:
      "Krakow is surprisingly beautiful and very affordable. The historical center is a UNESCO heritage site, and Polish food is cheap and consistent. Transport and museums have low prices, perfect for a budget-friendly city break.",
    link: "https://www.booking.com/city/pl/krakow.en-gb.html",
  },
];

const GuideDestinatii2025 = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <SEO
        title="Top 5 affordable destinations in 2025"
        description="Top 5 affordable city-break destinations in 2025, selected by analyzing average flight prices and city costs."
        canonicalPath="/guides/destinations-2025"
        image="/assets/guides/budapesta.jpg"
        type="article"
      />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top 5 affordable destinations in 2025
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10">
        In 2025, travelers are looking for beautiful, safe, and affordable destinations.
        We analyzed average flight prices, city costs, optimal seasons, and local experiences —
        and selected the 5 best cities for a cheap city break.
      </p>

      {/* DESTINATION LIST */}
      {cities.map((c) => (
        <div key={c.id} className="mb-12">
          <img
            src={c.image}
            alt={c.name}
            className="w-full h-64 object-cover rounded-xl shadow mb-4"
          />

          <h2 className="text-2xl font-semibold mt-2 mb-2">{c.id}. {c.name}</h2>

          <p className="text-gray-700 leading-relaxed mb-3">{c.description}</p>

          <a
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            See accommodation in {c.name} →
          </a>
        </div>
      ))}

      <p className="mt-12 text-sm text-gray-500 text-center">
        *Guide created by TravelAI – periodically updated according to trends and real prices.*
      </p>
    </div>
  );
};

export default GuideDestinatii2025;
