// src/pages/offers/components/SearchOffers.jsx
import React, { useState, useEffect } from "react";

import OfferTypesSelector from "./OfferTypesSelector";
import AirportInput from "./AirportInput";
import PeopleSelector from "./PeopleSelector";
import CalendarFields from "./CalendarFields";
import HotelFilters from "./HotelFilters";
import OperatorsSelector from "./OperatorsSelector";

//
// 🔥 Operatorii disponibili în funcție de tipul ofertei
//
const OPERATORS_BY_TYPE = {
  hotel: ["Booking.com", "Agoda", "Trip.com", "Airbnb"],
  vacation: ["Booking.com", "Agoda", "Trip.com"],
  flight: ["Skyscanner", "Kiwi.com", "Trip.com"],
  car: ["RentalCars.com", "DiscoverCars", "Kayak"],
};

const SearchOffers = () => {
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

  //
  // Operatorii activi pe baza ofertei selectate
  //
  const activeOperators = OPERATORS_BY_TYPE[offerType] || [];

  //
  // Reset operatori când schimbăm tipul ofertei
  //
  useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedOperators: [] }));
  }, [offerType]);

  //
  // Handlers
  //
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCounterChange = (field, delta, min = 0, max = 10) => {
    setFormData((prev) => {
      const nextValue = Math.min(max, Math.max(min, prev[field] + delta));

      let updatedChildrenAges = prev.childrenAges;

      if (field === "children") {
        if (nextValue > prev.childrenAges.length) {
          updatedChildrenAges = [
            ...prev.childrenAges,
            ...Array(nextValue - prev.childrenAges.length).fill(5),
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
    alert("Mock search – funcționalitate OK (faza audit Travelpayouts).");
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-10">

      {/* Tip ofertă */}
      <OfferTypesSelector offerType={offerType} setOfferType={setOfferType} />

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

      {/* Filtre hotel */}
      {(offerType === "hotel" || offerType === "vacation") && (
        <HotelFilters
          hotelStars={formData.hotelStars}
          hotelRating={formData.hotelRating}
          mealType={formData.mealType}
          onChange={handleChange}
        />
      )}

      {/* Operatorii dinamici */}
      <OperatorsSelector
        operators={activeOperators}
        selected={formData.selectedOperators}
        toggle={toggleOperator}
      />

      {/* Buton căutare */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700"
      >
        Caută oferte
      </button>

      {/* 🔥 Secțiune oficială Travelpayouts */}
      <div className="p-5 rounded-xl bg-blue-50 border border-blue-100 text-sm leading-relaxed">
        <h3 className="font-semibold mb-2 text-blue-900">Despre căutarea ofertelor</h3>
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

      {/* 🔥 DISCLAIMER LEGAL */}
      <p className="text-xs text-slate-500 border-t pt-4">
        TravelAI Deals nu vinde direct servicii turistice. Toate rezervările sunt procesate de
        operatorii parteneri. Prețurile și disponibilitatea sunt furnizate în timp real de aceștia
        prin intermediul rețelei Travelpayouts.
      </p>
    </div>
  );
};

export default SearchOffers;
