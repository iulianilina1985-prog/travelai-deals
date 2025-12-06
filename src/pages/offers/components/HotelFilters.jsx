// src/pages/offers/components/HotelFilters.jsx
import React from "react";

const HotelFilters = ({ hotelStars, hotelRating, mealType, onChange }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Filtre hotel
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Stele hotel */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Stele hotel
          </label>
          <select
            value={hotelStars}
            onChange={(e) => onChange("hotelStars", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="any">Orice</option>
            <option value="2+">2+ stele</option>
            <option value="3+">3+ stele</option>
            <option value="4+">4+ stele</option>
            <option value="5">5 stele</option>
          </select>
        </div>

        {/* Tip masă */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Tip masă
          </label>
          <select
            value={mealType}
            onChange={(e) => onChange("mealType", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="any">Orice</option>
            <option value="no-meal">Fără masă</option>
            <option value="breakfast">Mic dejun</option>
            <option value="half-board">Demipensiune</option>
            <option value="all-inclusive">All inclusive</option>
          </select>
        </div>

        {/* Rating minim */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600 flex justify-between">
            <span>Rating minim</span>
            <span className="text-[11px] text-slate-500">{hotelRating}+</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={hotelRating}
            onChange={(e) =>
              onChange("hotelRating", parseFloat(e.target.value))
            }
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </section>
  );
};

export default HotelFilters;
