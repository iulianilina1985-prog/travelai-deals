import React from "react";

const partners = [
  { name: "Booking.com", logo: "/assets/partners/booking.png", url: "https://www.booking.com" },
  { name: "Trip.com", logo: "/assets/partners/trip.png", url: "https://www.trip.com" },
  { name: "Kiwi.com", logo: "/assets/partners/kiwi.png", url: "https://www.kiwi.com" },
  { name: "Skyscanner", logo: "/assets/partners/skyscanner.png", url: "https://www.skyscanner.net" },
  { name: "Agoda", logo: "/assets/partners/agoda.png", url: "https://www.agoda.com" },
  { name: "Expedia", logo: "/assets/partners/expedia.png", url: "https://www.expedia.com" },
  { name: "Momondo", logo: "/assets/partners/momondo.png", url: "https://www.momondo.com" },
  { name: "Airbnb", logo: "/assets/partners/airbnb.png", url: "https://www.airbnb.com" }, // 🔥 Adăugat cu link
];

const PartnersSection = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-2xl lg:text-3xl font-bold mb-10 text-foreground">
          Ofertele sunt verificate automat de pe cele mai populare platforme
        </h2>

        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-8 
            gap-10 
            place-items-center
          "
        >
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-center 
                transition duration-200 
                hover:scale-110 
                hover:opacity-100
              "
              title={`Vizitează ${p.name}`}
            >
              <img
                src={p.logo}
                alt={p.name}
                className="
                  w-28 sm:w-32 md:w-36 
                  object-contain 
                  drop-shadow-sm
                "
              />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersSection;
