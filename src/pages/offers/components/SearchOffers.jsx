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
const OFFER_TYPES = [
  "vacation",
  "flight",
  "hotel",
  "car",

  "taxi",
  "transfer",
  "shuttle",
  "intercity",

  "activities",
  "tickets",
  "events",

  "yacht",

  "esim",
  "insurance",
  "flight_compensation",
];


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

  taxi: ["transfers"],
  transfer: ["transfers"],
  shuttle: ["transfers"],
  intercity: ["transport", "transfers"],

  activities: ["activities", "tours", "food"],
  tickets: ["tickets"],
  events: ["events"],

  yacht: ["yacht"],

  esim: ["esim"],
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
      queryText = `flight ${base.airports.from || "Bucharest"} ${base.airports.to || base.destination || "destination"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "hotel":
      queryText = `hotel ${base.destination || "destination"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "vacation":
      queryText = `vacation ${base.destination || base.airports.to || "destination"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "car":
      queryText = `car rental ${base.destination || "destination"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "esim":
      queryText = `esim ${base.destination || "country/region"}`;
      break;

    case "activities":
      queryText = `activities ${base.destination || "city"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      break;

    case "transfer":
    case "taxi":
      queryText = `transfer ${base.destination || "destination"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      break;

    case "insurance":
      queryText = `travel insurance ${base.destination || "destination"}`;
      if (base.dates.start) queryText += ` ${base.dates.start}`;
      if (base.dates.end) queryText += ` - ${base.dates.end}`;
      break;

    case "flight_compensation":
      queryText = `flight compensation ${base.airports.from || ""} ${base.airports.to || ""}`.trim();
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
const SearchOffers = ({ onSearch, initialOfferType, initialFormData }) => {
  const [offerType, setOfferType] = useState(initialOfferType || "hotel");

  const [formData, setFormData] = useState({
    destination: initialFormData?.destination || "",
    fromAirport: initialFormData?.airports?.from || "",
    toAirport: initialFormData?.airports?.to || "",
    checkIn: initialFormData?.dates?.start || "",
    checkOut: initialFormData?.dates?.end || "",
    adults: initialFormData?.people?.adults ?? 2,
    children: initialFormData?.people?.children ?? 0,
    childrenAges: initialFormData?.people?.childrenAges || [],
    maxBudget: initialFormData?.filters?.maxBudget || "",
    hotelStars: initialFormData?.filters?.hotelStars || "3+",
    mealType: initialFormData?.filters?.mealType || "any",
    hotelRating: initialFormData?.filters?.hotelRating ?? 3,
    selectedOperators: initialFormData?.operators || [],
  });

  // Sync state if props change (important for resuming searches)
  useEffect(() => {
    if (initialOfferType) setOfferType(initialOfferType);
    if (initialFormData) {
      setFormData({
        destination: initialFormData.destination || "",
        fromAirport: initialFormData.airports?.from || "",
        toAirport: initialFormData.airports?.to || "",
        checkIn: initialFormData.dates?.start || "",
        checkOut: initialFormData.dates?.end || "",
        adults: initialFormData.people?.adults ?? 2,
        children: initialFormData.people?.children ?? 0,
        childrenAges: initialFormData.people?.childrenAges || [],
        maxBudget: initialFormData.filters?.maxBudget || "",
        hotelStars: initialFormData.filters?.hotelStars || "3+",
        mealType: initialFormData.filters?.mealType || "any",
        hotelRating: initialFormData.filters?.hotelRating ?? 3,
        selectedOperators: initialFormData.operators || [],
      });
    }
  }, [initialOfferType, initialFormData]);

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

      <AirportInput
        formData={formData}
        handleChange={handleChange}
        offerType={offerType}
      />


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
        Search offers
      </button>

      {/* Travelpayouts info */}
      <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 text-sm leading-relaxed">
        <h3 className="font-semibold mb-2 text-blue-900">
          About searching for offers
        </h3>
        <p className="text-blue-900/90">
          This function uses the infrastructure and partners integrated through the
          <strong>Travelpayouts</strong> platform, a global hub for aggregating
          flight, hotel, and tourist service offers. The displayed results
          come exclusively from partner providers and respect their rates, availability,
          and policies.
        </p>
        <p className="mt-2 text-blue-900/90">
          During the technical verification stage (Travelpayouts audit), certain results may be
          simulated (mock data) until full activation of the APIs.
        </p>
      </div>

      {/* DISCLAIMER LEGAL */}
      <p className="text-xs text-slate-500 border-t pt-4">
        TravelAI Deals does not sell travel services directly. All bookings are processed by
        partner operators. Prices and availability are provided in real time by them
        through the Travelpayouts network.
      </p>
    </div>
  );
};

export default SearchOffers;
