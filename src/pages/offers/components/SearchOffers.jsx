// src/pages/offers/components/SearchOffers.jsx
import React, { useState } from "react";

import OfferTypesSelector from "./OfferTypesSelector";
import AirportInput from "./AirportInput";
import PeopleSelector from "./PeopleSelector";
import CalendarFields from "./CalendarFields";
import HotelFilters from "./HotelFilters";
import OperatorsSelector from "./OperatorsSelector";

const OPERATORS = [
  "Booking.com",
  "Agoda",
  "Trip.com",
  "Airbnb",
  "Kiwi.com",
  "Skyscanner",
];

const SearchOffers = () => {
  // 🌟 Tip ofertă
  const [offerType, setOfferType] = useState("hotel");

  // 🌟 State-ul unic al formularului
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

  // ============ HANDLERS ============

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCounterChange = (field, delta, min = 0, max = 10) => {
  setFormData((prev) => {
    const nextValue = Math.min(max, Math.max(min, prev[field] + delta));

    // dacă modificăm numărul de copii → actualizăm și array-ul de vârste
    let updatedChildrenAges = prev.childrenAges;

    if (field === "children") {
      if (nextValue > prev.childrenAges.length) {
        // adaugă copii noi cu vârsta default 5 ani
        updatedChildrenAges = [
          ...prev.childrenAges,
          ...Array(nextValue - prev.childrenAges.length).fill(5),
        ];
      } else {
        // taie array-ul dacă scade numărul de copii
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
      const ages = [...prev.childrenAges];
      ages[index] = Number(value);
      return { ...prev, childrenAges: ages };
    });
  };

  const toggleOperator = (op) => {
    setFormData((prev) => ({
      ...prev,
      selectedOperators: prev.selectedOperators.includes(op)
        ? prev.selectedOperators.filter((o) => o !== op)
        : [...prev.selectedOperators, op],
    }));
  };

  const handleSubmit = () => {
    console.log("Rezultatul căutării:", {
      offerType,
      ...formData,
    });
    alert("Mock search – funcționalitate OK.");
  };

  // ============ UI ============

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-10">

      {/* Tip ofertă */}
      <OfferTypesSelector
        offerType={offerType}
        setOfferType={setOfferType}
      />

      {/* Destinație + Aeroporturi */}
      <AirportInput
        formData={formData}
        handleChange={handleChange}
        offerType={offerType}
      />

      {/* Calendar */}
      <CalendarFields
        checkIn={formData.checkIn}
        checkOut={formData.checkOut}
        onChange={handleChange}
      />

      {/* Persoane */}
      <PeopleSelector
        adults={formData.adults}
        children={formData.children}
        childrenAges={formData.childrenAges}
        onAdultsChange={(v) => handleChange("adults", v)}
        onChildrenChange={(v) => handleChange("children", v)}
        onChildAgeChange={updateChildAge}
        handleCounterChange={handleCounterChange}
      />

      {/* Filtre hotel — doar pentru hotel & vacanță */}
      {(offerType === "hotel" || offerType === "vacation") && (
        <HotelFilters
          hotelStars={formData.hotelStars}
          hotelRating={formData.hotelRating}
          mealType={formData.mealType}
          onChange={handleChange}
        />
      )}

      {/* Operatorii */}
      <OperatorsSelector
        operators={OPERATORS}
        selected={formData.selectedOperators}
        toggle={toggleOperator}
      />

      {/* Buton submit */}
      <div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700"
        >
          Caută oferte
        </button>
      </div>
    </div>
  );
};

export default SearchOffers;
