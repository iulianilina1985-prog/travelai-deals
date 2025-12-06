import React from "react";

const tips = [
  {
    title: "1. Folosește flexibilitatea datelor",
    image: "/assets/bilet/flex.jpg",
    text: `Zborurile de marți și miercuri sunt în general cele mai ieftine. 
           Diferența de preț între un zbor de vineri și unul de marți poate ajunge și la 40%.
           Dacă poți pleca cu o zi mai devreme sau mai târziu, ai șanse mari să economisești.`,
  },
  {
    title: "2. Verifică aeroporturile alternative",
    image: "/assets/bilet/aeroport.jpg",
    text: `Aeroporturile mai mici au adesea taxe reduse și sunt folosite de companii low-cost.
           Exemple: Milano Bergamo, Paris Beauvais, Barcelona Girona.
           Poți găsi prețuri chiar și cu 60% mai mici față de aeroporturile principale.`,
  },
  {
    title: "3. Caută din timp, dar nu prea devreme",
    image: "/assets/bilet/zbor.jpg",
    text: `Pentru zborurile europene, cel mai bun moment pentru rezervare este cu 35–70 de zile înainte.
           Pentru zborurile intercontinentale, ferestrele optime sunt între 2 și 5 luni. 
           Prea devreme sau prea târziu = prețuri crescute.`,
  },
  {
    title: "4. Folosește navigarea incognito",
    image: "/assets/bilet/incognito.jpg",
    text: `Unele motoare de căutare pot ajusta prețurile în funcție de interesul tău repetat 
           pentru aceeași rută. 
           Caută bilete în fereastră incognito pentru rezultate mai curate.`,
  },
  {
    title: "5. Alege curse cu escală",
    image: "/assets/bilet/escala.jpg",
    text: `Zborurile directe sunt mai rapide, dar de multe ori mai scumpe.
           O escală inteligent aleasă poate reduce prețul total și cu 30–50%.`,
  },
  {
  title: "6. Activează alertele inteligente de preț în TravelAI Deals",
  image: "/assets/bilet/alerta.jpg",
  text: `Prețurile la bilete se modifică rapid, iar ofertele bune dispar în câteva ore. Aboneaza-te la TravelAi-Deals
         si poți activa alerte personalizate pentru rutele tale preferate. 
         De fiecare dată când AI-ul detectează o scădere semnificativă de preț, primești notificare 
         instant și poți rezerva la cel mai bun tarif disponibil.`,
},

];

const GuideBileteAvion = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cum găsești cele mai ieftine bilete de avion
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10">
        Prețurile la bilete de avion se schimbă rapid — uneori chiar de 5 ori în aceeași zi. 
        Cu strategiile potrivite, poți economisi sume semnificative la fiecare călătorie.
        Iată cele mai eficiente metode folosite de călătorii experimentați în 2025.
      </p>

      {/* LISTA TEHNICILOR */}
      {tips.map((t, index) => (
        <div key={index} className="mb-12">
          {/* Imagine */}
          <img
            src={t.image}
            alt={t.title}
            className="w-full h-64 object-cover rounded-xl shadow mb-4"
          />

          {/* Titlu */}
          <h2 className="text-2xl font-semibold mt-2 mb-2">{t.title}</h2>

          {/* Text */}
          <p className="text-gray-700 leading-relaxed">{t.text}</p>
        </div>
      ))}

      <p className="mt-12 text-sm text-gray-500 text-center">
        *Ghid creat de TravelAI – actualizat periodic cu tehnici noi de smart-booking.*
      </p>
    </div>
  );
};

export default GuideBileteAvion;
