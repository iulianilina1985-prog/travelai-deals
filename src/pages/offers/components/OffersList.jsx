// src/pages/offers/components/OffersList.jsx
import React from "react";
import OfferCard from "./OfferCard";
import { MOCK_OFFERS } from "./mockData";

const OffersList = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Oferte recomandate</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {MOCK_OFFERS.map((offer, index) => (
          <OfferCard key={index} offer={offer} />
        ))}
      </div>
    </div>
  );
};

export default OffersList;
