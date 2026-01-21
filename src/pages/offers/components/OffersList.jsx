// src/pages/offers/components/OffersList.jsx
import React from "react";
import OfferCard from "../../../components/OfferCard";
import { MOCK_OFFERS } from "../mockData";

const OffersList = ({
  offers = [],
  hasSearched,
  loading,
  context = "search", // 👈 "search" | "favorites"
}) => {
  const safeOffers = Array.isArray(offers) ? offers : [];
  const isMock = !hasSearched && context === "search";
  const displayOffers = isMock ? MOCK_OFFERS : safeOffers;

  if (loading) {
    return (
      <div className="mt-16 text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">Looking for the best offers...</p>
      </div>
    );
  }

  if (!isMock && hasSearched && safeOffers.length === 0) {
    return (
      <div className="mt-16 text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No offers found
        </h3>
        <p className="text-gray-600">
          Try modifying the search criteria or another destination.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {isMock
            ? "Offer examples"
            : context === "favorites"
              ? "Your favorite offers"
              : "Search results"}
        </h2>

        {!isMock && (
          <span className="text-sm text-gray-600">
            {safeOffers.length}{" "}
            {safeOffers.length === 1 ? "result" : "results"}
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayOffers.map((offer, index) => (
          <OfferCard
            key={offer.offer_id ?? offer.id ?? `offer-${index}`}
            offer={offer}
            mode={isMock ? "demo" : "live"}
          />
        ))}
      </div>

      {isMock && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> These are demonstrative examples.
            Use the search form above to see real offers.
          </p>
        </div>
      )}
    </div>
  );
};

export default OffersList;
