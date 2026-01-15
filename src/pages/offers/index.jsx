import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchOffers from "./components/SearchOffers";
import OffersList from "./components/OffersList";
import { supabase } from "../../lib/supabase";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useFavorites } from "../../contexts/FavoritesContext";

/* ===============================
   🖼 Image normalizer
================================ */
const normalizeImage = (img) => {
  if (!img) return "/assets/images/default.jpg";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  return "/" + img;
};

const OffersPage = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites(); // ❤️ sursa unică

  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (hasSearched && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [hasSearched, loading]);

  /* ===============================
      LOAD SAVED SEARCHES
================================ */
  const loadSavedSearches = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setSavedSearches(data || []);
  };

  /* ===============================
        SEARCH
================================ */
  const handleSearch = async (query, offerType, payload) => {
    setLoading(true);
    setActiveTab("search");

    try {
      const { data: { session } } = await supabase.auth.getSession();

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

      const data = await response.json();

      const normalized = (data?.cards || []).map((o) => {
        const rawImage =
          o.image ||
          o.image_url ||
          o.imageUrl ||
          o.thumbnail ||
          o.photo ||
          null;

        return {
          ...o,
          image: normalizeImage(rawImage),
          offer_id: o.offer_id || o.id || o.cta?.url || `${o.provider}-${o.title}`,
        };
      });

      setSearchResults(normalized);
      setHasSearched(true);
    } catch (err) {
      console.error("Search error", err);
      alert("Eroare la căutare");
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
        TAB CONTENT
================================ */
  const renderContent = () => {
    if (activeTab === "search") {
      return (
        <OffersList
          offers={searchResults}
          hasSearched={hasSearched}
          loading={loading}
        />
      );
    }

    if (activeTab === "favorites") {
      return (
        <OffersList
          offers={favorites.map((o) => ({
            ...o,
            image: normalizeImage(o.image),
          }))}
          hasSearched={true}
          loading={false}
        />
      );
    }

    if (activeTab === "searches") {
      return (
        <div className="space-y-4">
          {savedSearches.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-white rounded-lg border flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{s.query}</div>
                <div className="text-xs text-slate-500">
                  {new Date(s.created_at).toLocaleString()}
                </div>
              </div>
              <Button size="sm" onClick={() => handleSearch(s.query)}>
                Repetă
              </Button>
            </div>
          ))}
        </div>
      );
    }
  };

  /* ===============================
              UI
================================ */
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Caută oferte
            </h1>
            <p className="text-slate-600 mt-2">
              Motorul tău de găsit vacanțe bune.
            </p>

            {/* TABS */}
            <div className="flex gap-6 mt-6">
              <button
                onClick={() => setActiveTab("search")}
                className={activeTab === "search" ? "tab-active" : "tab"}
              >
                🔍 Caută
              </button>

              <button
                onClick={() => setActiveTab("favorites")}
                className={activeTab === "favorites" ? "tab-active" : "tab"}
              >
                ❤️ Favorite ({favorites.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab("searches");
                  loadSavedSearches();
                }}
                className={activeTab === "searches" ? "tab-active" : "tab"}
              >
                🕘 Căutări
              </button>
            </div>
          </div>

          <Button onClick={() => navigate("/ai-chat-interface")}>
            <Icon name="MessageCircle" size={18} />
            Chat AI
          </Button>
        </div>

        <div className="border-b mb-8" />

        {/* FORM – NU mai dispare */}
        <div style={{ display: activeTab === "search" ? "block" : "none" }}>
          <SearchOffers onSearch={handleSearch} />
        </div>

        <div ref={resultsRef} />

        {/* CONTENT */}
        <div className="mt-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default OffersPage;
