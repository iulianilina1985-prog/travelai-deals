import React from "react";

const cities = [
  {
    id: 1,
    name: "Budapesta, Ungaria",
    image: "/assets/guides/budapesta.jpg",
    description:
      "Budapesta rămâne una dintre cele mai ieftine capitale europene pentru city-break. Podurile peste Dunăre, băile termale și cartierul evreiesc oferă experiențe memorabile la prețuri accesibile. Transportul public este excelent, iar mâncarea locală este surprinzător de ieftină. Ideal pentru cupluri și grupuri.",
    link: "https://www.booking.com/city/hu/budapest.ro.html",
  },
  {
    id: 2,
    name: "Atena, Grecia",
    image: "/assets/guides/atena.jpg",
    description:
      "Atena combină istoria antică cu plaje accesibile la doar câteva minute de oraș. Prețurile la zboruri sunt mici mare parte din an, iar restaurantele tradiționale oferă meniuri ieftine. Perfectă pentru cei care vor cultură + relaxare fără să dea o avere.",
    link: "https://www.booking.com/city/gr/athens.ro.html",
  },
  {
    id: 3,
    name: "Praga, Cehia",
    image: "/assets/guides/praga.jpg",
    description:
      "Praga este considerată de mulți cea mai frumoasă capitală europeană. Cu castele gotice, poduri impresionante și cartiere boeme, orașul oferă foarte mult pentru bugete reduse. Cazările sunt ieftine, iar berea cehă este faimoasă pentru prețul mic.",
    link: "https://www.booking.com/city/cz/prague.ro.html",
  },
  {
    id: 4,
    name: "Valencia, Spania",
    image: "/assets/guides/valencia.jpg",
    description:
      "Un oraș însorit tot anul, cu mâncare excelentă (paella originală!) și plaje late, curate și gratuite. Zborurile spre Valencia sunt printre cele mai ieftine din Spania. Ideal pentru familii și iubitorii de mare.",
    link: "https://www.booking.com/city/es/valencia.ro.html",
  },
  {
    id: 5,
    name: "Krakow, Polonia",
    image: "/assets/guides/krakow.jpg",
    description:
      "Krakow este surprinzător de frumoasă și foarte accesibilă ca preț. Centrul istoric este patrimoniu UNESCO, iar mâncarea poloneză este ieftină și consistentă. Transportul și muzeele au prețuri mici, perfecte pentru un city-break buget-friendly.",
    link: "https://www.booking.com/city/pl/krakow.ro.html",
  },
];

const GuideDestinatii2025 = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Top 5 destinații accesibile în 2025
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10">
        În 2025, călătorii caută destinații frumoase, sigure și accesibile. 
        Am analizat prețurile medii la zboruri, costurile din orașe, sezonul optim și experiențele locale — 
        și am selectat cele mai bune 5 orașe pentru un city-break ieftin.
      </p>

      {/* LISTA DESTINAȚIILOR */}
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
            Vezi cazare în {c.name} →
          </a>
        </div>
      ))}

      <p className="mt-12 text-sm text-gray-500 text-center">
        *Ghid creat de TravelAI – actualizat periodic în funcție de tendințe și prețuri reale.*
      </p>
    </div>
  );
};

export default GuideDestinatii2025;
