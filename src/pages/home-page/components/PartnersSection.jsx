import React from "react";

const partners = [
  { name: "Booking.com", logo: "/assets/partners/booking.png" },
  { name: "Trip.com", logo: "/assets/partners/trip.png" },
  { name: "Kiwi.com", logo: "/assets/partners/kiwi.png" },
  { name: "Skyscanner", logo: "/assets/partners/skyscanner.png" },
  { name: "Agoda", logo: "/assets/partners/agoda.png" },
  { name: "Expedia", logo: "/assets/partners/expedia.png" },
  { name: "Momondo", logo: "/assets/partners/momondo.png" },
];

const PartnersSection = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-2xl lg:text-3xl font-bold mb-10 text-foreground">
          Ofertele sunt verificate automat de pe cele mai populare platforme
        </h2>

        <div className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-7 
          gap-10 
          place-items-center
        ">
          {partners.map((p) => (
            <div
              key={p.name}
              className="
                flex items-center justify-center 
                transition duration-200 
                hover:scale-110 
                hover:opacity-100
              "
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
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersSection;
