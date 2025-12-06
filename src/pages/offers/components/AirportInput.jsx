import React, { useState, useMemo } from "react";
import Icon from "../../../components/AppIcon";

const AirportInput = ({ formData, handleChange }) => {
  const [query, setQuery] = useState("");
  const [activeField, setActiveField] = useState(null);

  const AIRPORTS = [
    { city: "București", airport: "Henri Coandă", code: "OTP", country: "România" },
    { city: "Cluj-Napoca", airport: "Avram Iancu", code: "CLJ", country: "România" },
    { city: "Timișoara", airport: "Traian Vuia", code: "TSR", country: "România" },
    { city: "Roma", airport: "Fiumicino", code: "FCO", country: "Italia" },
    { city: "Roma", airport: "Ciampino", code: "CIA", country: "Italia" },
    { city: "Paris", airport: "Charles de Gaulle", code: "CDG", country: "Franța" },
    { city: "Paris", airport: "Orly", code: "ORY", country: "Franța" },
    { city: "Londra", airport: "Heathrow", code: "LHR", country: "Marea Britanie" },
    { city: "Londra", airport: "Gatwick", code: "LGW", country: "Marea Britanie" },
  ];

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    return AIRPORTS.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.airport.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const selectAirport = (a) => {
    const label = `${a.city} – ${a.airport} (${a.code})`;

    if (activeField === "from") {
      handleChange("fromAirport", label);
    } else if (activeField === "to") {
      handleChange("toAirport", label);
    }

    setQuery("");
    setActiveField(null);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Aeroporturi
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* FROM */}
        <div className="relative space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Aeroport plecare
          </label>

          <input
            type="text"
            placeholder="Ex: București OTP"
            value={activeField === "from" ? query : formData.fromAirport}
            onChange={(e) => {
              setActiveField("from");
              setQuery(e.target.value);
            }}
            onFocus={() => {
              setActiveField("from");
              setQuery("");
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {activeField === "from" && filtered.length > 0 && (
            <div className="absolute w-full z-30 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-auto text-sm">
              {filtered.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectAirport(a)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Icon name="Plane" size={14} />
                  <div className="flex flex-col">
                    <span>{a.city} – {a.airport} ({a.code})</span>
                    <span className="text-xs text-slate-500">{a.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TO */}
        <div className="relative space-y-1">
          <label className="text-xs font-medium text-slate-600">
            Aeroport destinație
          </label>

          <input
            type="text"
            placeholder="Ex: FCO, CDG, LHR..."
            value={activeField === "to" ? query : formData.toAirport}
            onChange={(e) => {
              setActiveField("to");
              setQuery(e.target.value);
            }}
            onFocus={() => {
              setActiveField("to");
              setQuery("");
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {activeField === "to" && filtered.length > 0 && (
            <div className="absolute w-full z-30 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-auto text-sm">
              {filtered.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectAirport(a)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
                >
                  <Icon name="Plane" size={14} />
                  <div className="flex flex-col">
                    <span>{a.city} – {a.airport} ({a.code})</span>
                    <span className="text-xs text-slate-500">{a.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AirportInput;
