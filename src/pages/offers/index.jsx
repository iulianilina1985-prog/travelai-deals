// src/pages/offers/index.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SearchOffers from "./components/SearchOffers";
import OffersList from "./components/OffersList";
import { supabase } from "../../lib/supabase";

import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";

const OffersPage = () => {
  const navigate = useNavigate();

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

  // ✅ CĂUTARE REALĂ (NU O STRICĂM)
  const handleSearch = async (query, offerType, payload) => {
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY
              }`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
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
        const txt = await response.text().catch(() => "");
        throw new Error(`Failed to fetch offers: ${response.status} ${txt}`);
      }

      const data = await response.json();

      setSearchResults(data?.cards || []);
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
        {/* ================= HEADER ca “Ofertele mele” ================= */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          {/* STÂNGA: titlu + subtitlu + “Favorite” sub titlu */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Caută oferte de călătorie
            </h1>
            <p className="text-slate-600 mt-2">
              Folosește AI-ul nostru pentru a găsi cele mai bune oferte de la
              partenerii verificați.
            </p>

            {/* TAB “Favorite” sub titlu */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate("/my-offers-dashboard")}
                className="inline-flex items-center gap-2 text-blue-600 font-medium border-b-2 border-blue-600 pb-2"
              >
                <Icon name="Heart" size={18} />
                Favorite
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* DREAPTA: buton Chat AI */}
          <div className="flex items-start">
            <Button
              onClick={() => navigate("/ai-chat-interface")}
              className="flex items-center gap-2"
            >
              <Icon name="MessageCircle" size={18} />
              Chat AI
            </Button>
          </div>
        </div>

        {/* LINIE sub header */}
        <div className="border-b border-slate-200 mb-10" />

        {/* ================= FORMULAR ================= */}
        <SearchOffers onSearch={handleSearch} />

        {/* ⬇️ ANCORA */}
        <div ref={resultsRef} />

        {/* ================= LISTĂ OFERTE ================= */}
        <OffersList offers={searchResults} hasSearched={hasSearched} loading={loading} />
      </div>
    </div>
  );
};

export default OffersPage;
