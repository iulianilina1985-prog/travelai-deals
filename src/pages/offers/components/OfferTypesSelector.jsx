import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

export const OFFER_TYPES = [
  { value: "flight", label: "Flight", icon: "Plane" },
  { value: "car", label: "Rent a car", icon: "Car" },
  { value: "taxi", label: "Taxi / Transfer", icon: "Taxi" },
  { value: "shuttle", label: "Shuttle / Pickup", icon: "Bus" },
  { value: "intercity", label: "Intercity transport", icon: "Map" },
  { value: "yacht", label: "Yacht rental", icon: "Ship" },

  { value: "hotel", label: "Hotel", icon: "Hotel" },
  { value: "vacation", label: "Vacation", icon: "PalmTree" },
  { value: "camper", label: "Camper / RV", icon: "Camper" },

  { value: "activities", label: "Activities & tours", icon: "Backpack" },
  { value: "tickets", label: "Attraction tickets", icon: "Ticket" },
  { value: "events", label: "Events", icon: "Music" },

  { value: "esim", label: "eSIM", icon: "Wifi" },
  { value: "insurance", label: "Insurance", icon: "Shield" },
  { value: "flight_compensation", label: "Flight compensation", icon: "Euro" },
];

const OfferTypesSelector = ({ offerType, setOfferType }) => {
  const [open, setOpen] = useState(false);

  const current = OFFER_TYPES.find((t) => t.value === offerType);

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-semibold text-slate-600">
        Offer type
      </label>

      {/* SELECT BOX */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100"
      >
        <div className="flex items-center gap-2">
          <Icon name={current.icon} size={18} />
          <span>{current.label}</span>
        </div>

        <Icon name="ChevronDown" size={16} />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-40 w-full mt-1 bg-white border rounded-xl shadow-lg overflow-hidden">
          {OFFER_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setOfferType(t.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100 ${t.value === offerType ? "bg-blue-50 text-blue-700" : ""
                }`}
            >
              <Icon name={t.icon} size={18} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfferTypesSelector;
