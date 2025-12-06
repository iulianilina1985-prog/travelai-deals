import React from "react";

const destinations = [
  {
    name: "Paris",
    country: "Franța",
    image:
      "/assets/images/paris.png",
    description:
      "City-break clasic: turnul Eiffel, croissante calde dimineața și plimbări pe malul Senei. Ideal pentru cupluri și escapade romantice.",
    tag: "City-break romantic",
    link: "https://www.booking.com/city/fr/paris.ro.html",
  },
  {
    name: "Dubai",
    country: "Emiratele Arabe Unite",
    image:
      "/assets/images/dubai.jpg",
    description:
      "Zgârie-nori, plaje cu nisip fin și safari în deșert. O combinație între lux, shopping și experiențe extreme.",
    tag: "Lux & aventură",
    link: "https://www.booking.com/city/ae/dubai.ro.html",
  },
  {
    name: "Roma",
    country: "Italia",
    image:
      "/assets/images/roma.png",
    description:
      "Colosseum, Vatican, paste și gelato la fiecare colț de stradă. Perfectă pentru pasionații de istorie și gastronomie.",
    tag: "Istorie & mâncare bună",
    link: "https://www.booking.com/city/it/rome.ro.html",
  },
  {
    name: "Tenerife",
    country: "Spania",
    image:
       "/assets/images/tenerife.jpg",
    description:
      "Insulă vulcanică cu plaje spectaculoase, trasee de hiking și temperaturi blânde tot timpul anului.",
    tag: "Soare tot timpul anului",
    link: "https://www.booking.com/region/es/tenerife.ro.html",
  },
  {
    name: "Istanbul",
    country: "Turcia",
    image:
      "/assets/images/istanbul.png",
    description:
      "Între Europa și Asia: bazaruri colorate, moschee impunătoare și mâncare de stradă care creează dependență.",
    tag: "Cultură & shopping",
    link: "https://www.booking.com/city/tr/istanbul.ro.html",
  },
  {
    name: "Madeira",
    country: "Portugalia",
    image:
      "/assets/images/madeira.jpg",
    description:
      "Insula verde a Atlanticului: stânci dramatice, flori exotice și trasee spectaculoase de coastă.",
    tag: "Natură & relaxare",
    link: "https://www.booking.com/region/pt/madeira-islands.ro.html",
  },
];

const FeaturedDestinationsSection = () => {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Destinații populare recomandate de TravelAI
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl">
              Actualizăm constant destinațiile în funcție de prețuri, sezon și
              trenduri. Inspiră-te și lasă AI-ul să caute cele mai bune oferte
              pentru tine.
            </p>
          </div>
          <p className="text-xs md:text-sm text-gray-500">
            Conținut editorial original • Actualizat periodic
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <article
              key={dest.name}
              className="group rounded-xl border border-gray-100 bg-white/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Imagine */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-40 object-cover rounded-t-xl"
              />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dest.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                    {dest.tag}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                  {dest.country}
                </p>

                <p className="text-sm text-gray-700 flex-1">{dest.description}</p>

                {/* Link către Booking */}
                <a
                  href={dest.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700 underline-offset-2 hover:underline self-start"
                >
                  Vezi oferte pentru {dest.name} →
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
