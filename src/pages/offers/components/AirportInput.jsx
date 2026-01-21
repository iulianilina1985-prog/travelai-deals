import React, { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";

const AirportInput = ({ formData, handleChange, offerType }) => {
  const isFlight = offerType === "flight" || offerType === "vacation";

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {isFlight ? "Airports" : "Destination"}
      </h2>

      {isFlight ? (
        /* ======================
                    FLIGHT / VACATION
           ====================== */
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">
              Departure airport
            </label>
            <input
              value={formData.fromAirport}
              onChange={(e) => handleChange("fromAirport", e.target.value)}
              placeholder="E.g.: Bucharest OTP"
              className="w-full rounded-xl border px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">
              Destination airport
            </label>
            <input
              value={formData.toAirport}
              onChange={(e) => handleChange("toAirport", e.target.value)}
              placeholder="Ex: FCO, CDG, LHR"
              className="w-full rounded-xl border px-3 py-2.5 text-sm"
            />
          </div>
        </div>
      ) : (
        /* ======================
           HOTEL / CAR / ESIM / ETC
           ====================== */
        <div>
          <label className="text-xs font-medium text-slate-600">
            City / country
          </label>
          <input
            value={formData.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            placeholder="E.g.: Paris, Italy, Spain"
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>
      )}
    </section>
  );
};

export default AirportInput;
