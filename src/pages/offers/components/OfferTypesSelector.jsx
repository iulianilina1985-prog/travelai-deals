import React from "react";
import Icon from "../../../components/AppIcon";

const OFFER_TYPES = [
  { id: "vacation", label: "Vacanță", icon: "Umbrella" },
  { id: "flight", label: "Zbor", icon: "Plane" },
  { id: "hotel", label: "Hotel", icon: "Building2" },
  { id: "car", label: "Rent a car", icon: "Car" },
];

const OfferTypesSelector = ({ offerType, setOfferType }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {OFFER_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => setOfferType(type.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all ${
            offerType === type.id
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Icon
            name={type.icon}
            size={16}
            color={offerType === type.id ? "white" : "#1f2937"}
          />
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default OfferTypesSelector;
