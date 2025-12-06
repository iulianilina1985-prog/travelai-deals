// src/pages/offers/components/OfferCard.jsx
import React from "react";
import Icon from "../../../components/AppIcon";

const OfferCard = ({ offer }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
      <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover" />

      <div className="p-5 space-y-2">
        <h3 className="font-semibold text-lg">{offer.title}</h3>

        <div className="flex items-center text-sm text-slate-600 gap-2">
          <Icon name="Star" size={14} color="#fbbf24" />
          {offer.rating}
        </div>

        <p className="text-blue-600 font-bold text-xl">{offer.price} €</p>

        <p className="text-sm text-slate-500">
          Operator: <span className="font-semibold">{offer.operator}</span>
        </p>

        <a
          href={offer.url}
          target="_blank"
          rel="noreferrer"
          className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Vezi oferta →
        </a>
      </div>
    </div>
  );
};

export default OfferCard;
