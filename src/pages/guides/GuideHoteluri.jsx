import React from "react";

const tips = [
  {
    title: "1. Evită perioadele de vârf",
    image: "/assets/bilet/receptie.jpg",
    text: `Prețurile hotelurilor cresc semnificativ în timpul concertelor mari, festivalurilor,
           conferințelor internaționale sau în weekendurile foarte aglomerate. 
           Uneori tarifele cresc chiar cu 200%. 
           Dacă poți evita aceste date, diferența de preț va fi uriașă.`,
  },
  {
    title: "2. Rezervă cu 30–45 de zile înainte",
    image: "/assets/bilet/rezervare.jpg",
    text: `Aceasta este fereastra ideală în majoritatea orașelor din Europa. 
           Hotelurile optimizează tarifele în funcție de gradul de ocupare estimat, 
           iar cele mai bune prețuri apar exact în acest interval.`,
  },
  {
    title: "3. Călătorește în sezonul intermediar",
    image: "/assets/bilet/intermediar.jpg",
    text: `Lunile martie–mai și septembrie–noiembrie sunt perioade excelente pentru a găsi 
           cazări mult mai ieftine, fără aglomerația din sezonul de vârf. 
           În destinațiile de plajă, diferența de preț poate fi chiar de 50–60%.`,
  },
  {
    title: "4. Alege zilele de duminică–joi",
    image: "/assets/bilet/camera.jpg",
    text: `În orașele turistice, weekendurile sunt cele mai scumpe. 
           Dacă poți călători în timpul săptămânii, vei găsi tarife semnificativ reduse. 
           În destinațiile business, paradoxal, weekendurile sunt mai ieftine.`,
  },
  {
    title: "5. Folosește platformele de comparare",
    image: "/assets/bilet/zile.jpg",
    text: `Booking, Trip.com, Agoda și Expedia actualizează prețurile în timp real. 
           Compararea tarifelor înainte de rezervare poate reduce costul final cu 20–40%. 
           TravelAI Deals analizează automat aceste platforme și îți recomandă cea mai ieftină variantă.`,
  },
];

const GuideHoteluri = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Când este cel mai bun moment să rezervi un hotel
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10">
        Alegerea perioadei potrivite pentru rezervarea unui hotel îți poate reduce costurile 
        chiar și la jumătate. Prețurile variază constant în funcție de sezon, evenimente locale 
        și cererea de pe piață. Iată cele mai importante reguli pentru a prinde cele mai bune oferte.
      </p>

      {/* LISTA SFATURILOR */}
      {tips.map((t, index) => (
        <div key={index} className="mb-12">
          <img
            src={t.image}
            alt={t.title}
            className="w-full h-64 object-cover rounded-xl shadow mb-4"
          />

          <h2 className="text-2xl font-semibold mt-2 mb-2">{t.title}</h2>

          <p className="text-gray-700 leading-relaxed">{t.text}</p>
        </div>
      ))}

      <p className="mt-12 text-sm text-gray-500 text-center">
        *Ghid creat de TravelAI – actualizat periodic pe baza datelor reale de piață.*
      </p>

    </div>
  );
};

export default GuideHoteluri;
