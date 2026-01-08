// src/pages/offers/index.jsx
import React, { useState, useRef, useEffect } from "react";
import SearchOffers from "./components/SearchOffers";
import OffersList from "./components/OffersList";
import { supabase } from "../../lib/supabase";

const OffersPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (hasSearched && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [hasSearched, loading]);

  const handleSearch = async (query, offerType, payload) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            prompt: query,
            offerType,
            payload,
            user_id: session?.user?.id || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }

      const data = await response.json();

      setSearchResults(data.cards || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      alert("A apărut o eroare la căutare.");
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* Titlu */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Caută oferte de călătorie
          </h1>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            Folosește AI-ul nostru pentru a găsi cele mai bune oferte de la partenerii verificați.
          </p>
        </div>

        {/* FORMULAR */}
        <SearchOffers onSearch={handleSearch} />

        {/* ⬇️ ANCORA */}
        <div ref={resultsRef} />

        {/* LISTĂ OFERTE */}
        <OffersList
          offers={searchResults}
          hasSearched={hasSearched}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default OffersPage;
