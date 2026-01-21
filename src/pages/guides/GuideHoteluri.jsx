import React from "react";

const tips = [
  {
    title: "1. Avoid peak periods",
    image: "/assets/bilet/receptie.jpg",
    text: `Hotel prices increase significantly during large concerts, festivals,
           international conferences, or very busy weekends. 
           Sometimes rates increase even by 200%. 
           If you can avoid these dates, the price difference will be huge.`,
  },
  {
    title: "2. Book 30–45 days in advance",
    image: "/assets/bilet/rezervare.jpg",
    text: `This is the ideal window in most cities in Europe. 
           Hotels optimize rates according to estimated occupancy, 
           and the best prices appear exactly in this interval.`,
  },
  {
    title: "3. Travel in the shoulder season",
    image: "/assets/bilet/intermediar.jpg",
    text: `The months March–May and September–November are excellent periods to find 
           much cheaper accommodation, without the crowds of the peak season. 
           In beach destinations, the price difference can be even 50–60%.`,
  },
  {
    title: "4. Choose Sunday–Thursday",
    image: "/assets/bilet/camera.jpg",
    text: `In tourist cities, weekends are the most expensive. 
           If you can travel during the week, you will find significantly reduced rates. 
           In business destinations, paradoxically, weekends are cheaper.`,
  },
  {
    title: "5. Use comparison platforms",
    image: "/assets/bilet/zile.jpg",
    text: `Booking, Trip.com, Agoda, and Expedia update prices in real-time. 
           Comparing rates before booking can reduce the final cost by 20–40%. 
           TravelAI Deals automatically analyzes these platforms and recommends the cheapest option.`,
  },
];

const GuideHoteluri = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">

      <h1 className="text-3xl font-bold mb-6 text-center">
        When is the best time to book a hotel
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10">
        Choosing the right period to book a hotel can reduce your costs
        even by half. Prices vary constantly according to season, local events
        and market demand. Here are the most important rules to catch the best offers.
      </p>

      {/* TIP LIST */}
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
        *Guide created by TravelAI – periodically updated based on real market data.*
      </p>

    </div>
  );
};

export default GuideHoteluri;
