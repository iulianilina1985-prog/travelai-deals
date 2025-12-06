// src/pages/offers/index.jsx
import React from "react";
import SearchOffers from "./components/SearchOffers";
import OffersList from "./components/OffersList";

const OffersPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* Titlu */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Caută oferte de călătorie
          </h1>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            Folosește filtre avansate și descoperă cele mai bune prețuri de pe platformele partenere.
          </p>
        </div>

        {/* FORMULAR */}
        <SearchOffers />

        {/* LISTĂ OFERTE MOCK */}
        <OffersList />

      </div>
    </div>
  );
};

export default OffersPage;
