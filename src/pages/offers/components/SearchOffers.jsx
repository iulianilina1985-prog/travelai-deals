// src/pages/offers/components/SearchOffers.jsx
import React, { useEffect, useMemo, useState } from "react";

import OfferTypesSelector from "./OfferTypesSelector";
import AirportInput from "./AirportInput";
import PeopleSelector from "./PeopleSelector";
import CalendarFields from "./CalendarFields";
import HotelFilters from "./HotelFilters";
import OperatorsSelector from "./OperatorsSelector";

// ✅ Registry (single source of truth)
// Ajustează path-ul dacă la tine e altfel (ex: "../../../affiliates/registry")
import { AFFILIATES } from "../../../affiliates/registry";

// ==============================
// 1) Offer types + form config
// ==============================
const OFFER_TYPES = ["vacation", "flight", "hotel", "car", "transfer", "taxi", "esim", "activities", "insurance", "flight_compensation"];

// ce câmpuri afișează formularul, în funcție de tip
const FORM_CONFIG = {
  // Pachet complet (zbor + hotel) — folosește aeroporturi + hotel filters
  vacation: { fields: ["airports", "dates", "people", "hotelFilters", "operators"] },

  flight: { fields: ["airports", "dates", "people", "operators"] },

  hotel: { fields: ["destination", "dates", "people", "hotelFilters", "operators"] },

  car: { fields: ["destination", "dates", "people", "operators"] },

  // viitoare:
  transfer: { fields: ["destination", "dates", "people", "operators"] },
  taxi: { fields: ["destination", "dates", "people", "operators"] },
  esim: { fields: ["destination", "operators"] },
  activities: { fields: ["destination", "dates", "operators"] },
  insurance: { fields: ["destination", "dates", "people", "operators"] },
  flight_compensation: { fields: ["airports", "dates", "operators"] },
};

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeOperatorName(s) {
  return String(s ?? "").trim();
}

// ==============================
// 2) Map offerType -> registry categories
// ==============================
// IMPORTANT: adaptează după cum ți-ai pus tu category în registry.ts
const TYPE_TO_CATEGORIES = {
  hotel: ["hotels"],
  vacation: ["hotels", "flights"],
  flight: ["flights"],
  car: ["cars"],
  transfer: ["transfers"],
  taxi: ["transfers", "transport"],
  esim: ["esim"],
  activities: ["activities", "tickets", "tours", "food"],
  insurance: ["insurance"],
  flight_compensation: ["compensation"],
};

// Extrage operatorii din registry pe baza categoriilor
function getOperatorsFromRegistry(offerType) {
  const categories = TYPE_TO_CATEGORIES[offerType] || [];
  const providers = Object.values(AFFILIATES || {}).filter((p) =>
    categories.includes(p.category)
  );

  // OperatorsSelector-ul tău pare să lucreze cu stringuri (nume)
  // Așa că trimitem o listă de nume.
  return providers.map((p) => p.name);
}

// ==============================
// 3) Build structured payload + query text (backward compatible)
// ==============================
function buildSearchPayload(offerType, formData) {
  const base = {
    offerType,
    // operatori selectați (poate fi [] => "caută în toți")
    operators: safeArray(formData.selectedOperators),
    dates: {
      start: formData.checkIn || null,
      end: formData.checkOut || null,
    },
    people: {
      adults: formData.adults ?? 2,
      children: formData.children ?? 0,
      childrenAges: safeArray(formData.childrenAges),
    },
    destination: formData.destination || "",
    airports: {
      from: formData.fromAirport || "",
      to: formData.toAirport || "",
    },
    filters: {
      maxBudget: formData.maxBudget || "",
      hotelStars: formData.hotelStars || "3+",
      mealType: formData.mealType || "any",
      hotelRating: formData.hotelRating ?? 3,
    },
  };

  // Un queryText simplu pentru compatibilitate cu ce ai acum
  // (AI poate folosi queryText + payload)
  let queryText = "";

  switch (offerType) {
    case "flight":
      queryText = `zbor ${base.airports.from || "București"} ${base.airports.to || base.destination || "destinație"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "hotel":
      queryText = `hotel ${base.destination || "destinație"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "vacation":
      queryText = `vacanță ${base.destination || base.airports.to || "destinație"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "car":
      queryText = `închiriere mașină ${base.destination || "destinație"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "esim":
      queryText = `esim ${base.destination || "țară/region"}`;
      break;

    case "activities":
      queryText = `activități ${base.destination || "oraș"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      break;

    case "transfer":
    case "taxi":
      queryText = `transfer ${base.destination || "destinație"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      break;

    case "insurance":
      queryText = `asigurare călătorie ${base.destination || "destinație"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "flight_compensation":
      queryText = `compensație zbor ${base.airports.from || ""} ${base.airports.to || ""}`.trim();
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      break;

    default:
      queryText = `${offerType} ${base.destination || ""}`.trim();
  }

  return { payload: base, queryText };
}

// ==============================
// Component
// ==============================
const SearchOffers = ({ onSearch }) => {
  const [offerType, setOfferType] = useState("hotel");

  const [formData, setFormData] = useState({
    destination: "",
    fromAirport: "",
    toAirport: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    childrenAges: [],
    maxBudget: "",
    hotelStars: "3+",
    mealType: "any",
    hotelRating: 3,
    selectedOperators: [],
  });

  const fields = FORM_CONFIG[offerType]?.fields ?? FORM_CONFIG.hotel.fields;

  // Operators din registry, în funcție de offerType
  const activeOperators = useMemo(() => {
    try {
      const ops = getOperatorsFromRegistry(offerType);
      // fallback: dacă registry e gol / mismatch, nu crăpăm UI-ul
      return ops.length ? ops : [];
    } catch {
      return [];
    }
  }, [offerType]);

  // reset selected operators când schimbăm tipul
  useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedOperators: [] }));
  }, [offerType]);

  // helpers
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCounterChange = (field, delta, min = 0, max = 10) => {
    setFormData((prev) => {
      const current = Number(prev[field] ?? 0);
      const nextValue = Math.min(max, Math.max(min, current + delta));

      // menține childrenAges sincronizat cu nr. copii
      let updatedChildrenAges = prev.childrenAges;

      if (field === "children") {
        const prevLen = prev.childrenAges.length;
        if (nextValue > prevLen) {
          updatedChildrenAges = [
            ...prev.childrenAges,
            ...Array(nextValue - prevLen).fill(5),
          ];
        } else {
          updatedChildrenAges = prev.childrenAges.slice(0, nextValue);
        }
      }

      return {
        ...prev,
        [field]: nextValue,
        childrenAges: updatedChildrenAges,
      };
    });
  };

  const updateChildAge = (index, value) => {
    setFormData((prev) => {
      const ages = [...safeArray(prev.childrenAges)];
      ages[index] = Number(value);
      return { ...prev, childrenAges: ages };
    });
  };

  const toggleOperator = (op) => {
    const name = normalizeOperatorName(op);
    if (!name) return;

    setFormData((prev) => {
      const selected = safeArray(prev.selectedOperators);
      const next = selected.includes(name)
        ? selected.filter((o) => o !== name)
        : [...selected, name];

      return { ...prev, selectedOperators: next };
    });
  };

  const handleSubmit = () => {
    const { payload, queryText } = buildSearchPayload(offerType, formData);

    if (onSearch) {
      // ✅ Backward compatible: dacă părintele așteaptă (query, offerType)
      // trimitem și payload ca al 3-lea param
      onSearch(queryText, offerType, payload);
    }
  };

  // Guard: dacă cineva dă un offerType invalid din UI
  useEffect(() => {
    if (!OFFER_TYPES.includes(offerType)) {
      setOfferType("hotel");
    }
  }, [offerType]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-10">

      {/* Tip ofertă */}
      <OfferTypesSelector offerType={offerType} setOfferType={setOfferType} />

      {/* Airports OR Destination (config-driven) */}
      {fields.includes("airports") && (
        <AirportInput
          formData={formData}
          handleChange={handleChange}
          offerType={offerType}
        />
      )}

      {fields.includes("destination") && (
        // Refolosim AirportInput dacă el știe să randăm "destination"
        // (la tine pare că AirportInput deja tratează și destination în funcție de offerType)
        <AirportInput
          formData={formData}
          handleChange={handleChange}
          offerType={offerType}
        />
      )}

      {/* Calendar (date fields apar la multe tipuri) */}
      {fields.includes("dates") && (
        <CalendarFields
          checkIn={formData.checkIn}
          checkOut={formData.checkOut}
          onChange={handleChange}
        />
      )}

      {/* People */}
      {fields.includes("people") && (
        <PeopleSelector
          adults={formData.adults}
          children={formData.children}
          childrenAges={formData.childrenAges}
          onAdultsChange={(v) => handleChange("adults", v)}
          onChildrenChange={(v) => handleChange("children", v)}
          onChildAgeChange={updateChildAge}
          handleCounterChange={handleCounterChange}
        />
      )}

      {/* Hotel filters */}
      {fields.includes("hotelFilters") && (
        <HotelFilters
          hotelStars={formData.hotelStars}
          hotelRating={formData.hotelRating}
          mealType={formData.mealType}
          onChange={handleChange}
        />
      )}

      {/* Operators from registry */}
      {fields.includes("operators") && (
        <OperatorsSelector
          operators={activeOperators}
          selected={formData.selectedOperators}
          toggle={toggleOperator}
        />
      )}

      {/* Buton căutare */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700"
      >
        Caută oferte
      </button>

      {/* Travelpayouts info */}
      <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 text-sm leading-relaxed">
        <h3 className="font-semibold mb-2 text-blue-900">
          Despre căutarea ofertelor
        </h3>
        <p className="text-blue-900/90">
          Această funcție utilizează infrastructura și partenerii integrați prin
          platforma <strong>Travelpayouts</strong>, un hub global de agregare
          a ofertelor de zboruri, hoteluri și servicii turistice. Rezultatele afișate
          provin exclusiv de la furnizorii parteneri și respectă tarifele, disponibilitatea
          și politicile acestora.
        </p>
        <p className="mt-2 text-blue-900/90">
          În etapa de verificare tehnică (audit Travelpayouts), anumite rezultate pot fi
          simulate (mock data) până la activarea completă a API-urilor.
        </p>
      </div>

      {/* DISCLAIMER LEGAL */}
      <p className="text-xs text-slate-500 border-t pt-4">
        TravelAI Deals nu vinde direct servicii turistice. Toate rezervările sunt procesate de
        operatorii parteneri. Prețurile și disponibilitatea sunt furnizate în timp real de aceștia
        prin intermediul rețelei Travelpayouts.
      </p>
    </div>
  );
};

export default SearchOffers;
