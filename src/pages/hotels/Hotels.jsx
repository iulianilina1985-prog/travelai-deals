import React from "react";
import { Search } from "lucide-react";

// ===================================================
// 1. HERO BANNER
// ===================================================
const HeroBanner = () => (
  <div className="w-full h-80 rounded-2xl overflow-hidden mb-12 relative shadow-xl">
    <img
      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80"
      className="w-full h-full object-cover"
      alt="Travel banner"
    />

    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-start px-10">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg max-w-2xl">
        Find the perfect accommodation for your next adventure
      </h1>

      {/* SEARCH BAR */}
      <div className="flex items-center bg-white rounded-xl px-4 py-3 w-full max-w-xl shadow-xl">
        <Search className="text-gray-500 mr-2 w-5 h-5" />
        <input
          placeholder="Search destinations (e.g., Brasov, Bucharest, Rome)"
          className="w-full outline-none text-gray-700"
        />
      </div>
    </div>
  </div>
);

// ===================================================
// 2. HOTEL LIST (MOCK CARDS CU LINKURI NORMALE)
// ===================================================
const hotels = [
  {
    name: "Casa Wagner",
    location: "Brasov, Romania",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    link: "https://www.booking.com/hotel/ro/casa-wagner-brasov.ro.html",
  },
  {
    name: "Hotel Aro Palace",
    location: "Brasov, Romania",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    link: "https://www.booking.com/hotel/ro/aro-palace.ro.html",
  },
  {
    name: "Novotel Bucharest City Centre",
    location: "Bucharest, Romania",
    image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
    link: "https://www.booking.com/hotel/ro/novotel-bucharest-city-centre.ro.html",
  },
  {
    name: "Radisson Blu",
    location: "Bucharest, Romania",
    image: "https://images.unsplash.com/photo-1551887413-1d76b1e0f5c0",
    link: "https://www.booking.com/hotel/ro/radisson-blu-bucharest.ro.html",
  },
  {
    name: "Hotel Teleferic",
    location: "Poiana Brasov",
    image: "https://images.unsplash.com/photo-1551776235-dde6d4829808",
    link: "https://www.booking.com/hotel/ro/teleferic-grand-poiana-brasov.ro.html",
  },
  {
    name: "Hotel International",
    location: "Sinaia, Romania",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
    link: "https://www.booking.com/hotel/ro/international-sinaia.ro.html",
  },
  {
    name: "InterContinental Athénée Palace",
    location: "Bucharest, Romania",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    link: "https://www.booking.com/hotel/ro/athenee-palace-hilton-bucharest.ro.html",
  },
  {
    name: "Hotel Platinia",
    location: "Cluj-Napoca",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    link: "https://www.booking.com/hotel/ro/platinia-cluj-napoca.ro.html",
  },
  // Exotice / internaționale (linkuri simple, fără tracking)
  {
    name: "Kuramathi Maldives",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101f",
    link: "https://www.booking.com/hotel/mv/kuramathi-island-resort.html",
  },
  {
    name: "Rixos Premium Dubai",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126",
    link: "https://www.booking.com/hotel/ae/rixos-premium-dubai.html",
  },
  {
    name: "Four Seasons Bali",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad",
    link: "https://www.booking.com/hotel/id/four-seasons-resort-bali-at-sayan.html",
  },
  {
    name: "Hilton Hawaiian Village",
    location: "Honolulu, USA",
    image: "https://images.unsplash.com/photo-1505732549923-edc0897c82b0",
    link: "https://www.booking.com/hotel/us/hilton-hawaiian-village.html",
  },
];

const HotelsSection = () => (
  <section className="mb-16">
    <h2 className="text-2xl font-bold mb-2">Recommended properties</h2>
    <p className="text-gray-600 mb-6">
      The most popular options for your perfect stay.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {hotels.map((h, idx) => (
        <div
          key={idx}
          className="rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white"
        >
          <img src={h.image} className="h-48 w-full object-cover" alt={h.name} />
          <div className="p-4">
            <p className="font-bold">{h.name}</p>
            <p className="text-gray-500 text-sm">{h.location}</p>
            <a
              href={h.link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center py-2 rounded-lg"
            >
              View offer →
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ===================================================
// 3. CATEGORII
// ===================================================
const categories = [
  {
    name: "Hotels",
    image: "https://images.unsplash.com/photo-1551887413-1d76b1e0f5c0",
  },
  {
    name: "Apartments",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb",
  },
  {
    name: "Resorts",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353",
  },
  {
    name: "Villas",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
  },
];

const Categories = () => (
  <section className="mb-16">
    <h2 className="text-2xl font-bold mb-4">Search by property type</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((c, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow bg-white">
          <img src={c.image} className="h-40 w-full object-cover" alt={c.name} />
          <div className="p-3 font-medium text-center">{c.name}</div>
        </div>
      ))}
    </div>
  </section>
);

// ===================================================
// 4. DESTINAȚII ROMÂNIA
// ===================================================
const destinations = [
  {
    name: "Bucharest",
    props: "5,985 properties",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },
  {
    name: "Brasov",
    props: "2,605 properties",
    image: "https://images.unsplash.com/photo-1551776235-dde6d4829808",
  },
  {
    name: "Mamaia",
    props: "1,468 properties",
    image: "https://images.unsplash.com/photo-1559128010-dbb60d0fa38d",
  },
  {
    name: "Cluj-Napoca",
    props: "1,634 properties",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    name: "Sibiu",
    props: "1,303 properties",
    image: "https://images.unsplash.com/photo-1590402494682-cd3f6a5dbff3",
  },
];

const Destinations = () => (
  <section className="mb-28">
    <h2 className="text-2xl font-bold mb-3">Explore Romania</h2>
    <p className="text-gray-600 mb-4">Popular destinations with lots to offer</p>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {destinations.map((d, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow bg-white">
          <img src={d.image} className="h-36 w-full object-cover" alt={d.name} />
          <div className="p-3">
            <p className="font-semibold">{d.name}</p>
            <p className="text-gray-500 text-xs">{d.props}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ===================================================
// PAGE EXPORT
// ===================================================
const Hotels = () => (
  <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
    <HeroBanner />
    <HotelsSection />
    <Categories />
    <Destinations />

    <p className="text-xs text-gray-400 mt-10">
      TravelAI Deals is in development. The displayed links are demonstrative and
      may become affiliate links after the approval of collaborations with partners.
    </p>
  </div>
);

export default Hotels;
