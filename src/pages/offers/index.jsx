import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchOffers from "./components/SearchOffers";
import OffersList from "./components/OffersList";
import { supabase } from "../../lib/supabase";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useFavorites } from "../../contexts/FavoritesContext";

const normalizeImage = (img) => {
  if (!img) return "/assets/images/no_image.png";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  return "/" + img;
};

const OffersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useFavorites();

  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSearchIds, setSelectedSearchIds] = useState([]);

  // Auto-fill states for resumed searches
  const [initialFormData, setInitialFormData] = useState(null);
  const [initialOfferType, setInitialOfferType] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, hasSearched]);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  /* ===============================
      LOAD / SAVE / DELETE SEARCHES
  ================================ */
  /* ===============================
      LOAD / SAVE / DELETE SEARCHES
  ================================ */
  const loadSavedSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Adaptare date: decodăm metadata din description dacă e cazul
      const validData = (data || []).map(item => {
        try {
          // Încercăm să vedem dacă description conține payload (JSON)
          const parsed = JSON.parse(item.description);
          return {
            ...item,
            query: parsed.query || item.destination || "Căutare",
            offer_type: parsed.offerType || "hotel",
            payload: parsed.payload || {}
          };
        } catch (e) {
          // Fallback pentru date vechi sau format simplu
          return {
            ...item,
            query: item.description || item.destination || "Căutare",
            offer_type: "hotel",
            payload: { destination: item.destination }
          };
        }
      });

      setSavedSearches(validData);
    } catch (err) {
      console.error("Error loading searches:", err);
    }
  };

  const saveSearch = async (query, offerType, payload) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Adaptare pentru schema existentă:
      // Folosim 'description' ca stocare JSON pentru a nu pierde datele complexe
      const adaptedPayload = {
        user_id: user.id,
        name: `${offerType.toUpperCase()}: ${query.slice(0, 30)}`,
        destination: payload?.destination || query.slice(0, 50),
        description: JSON.stringify({ query, offerType, payload }), // Stocăm tot obiectul aici
        status: 'active'
      };

      const { error: insertError } = await supabase.from("saved_searches").insert(adaptedPayload);

      if (insertError) throw insertError;

      // FIFO Limit: 20
      const { data: all } = await supabase
        .from("saved_searches")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (all && all.length > 20) {
        const idsToDelete = all.slice(20).map(x => x.id);
        await supabase.from("saved_searches").delete().in("id", idsToDelete);
      }

      await loadSavedSearches();
    } catch (err) {
      console.error("Error saving search:", err);
    }
  };

  const deleteSelectedSearches = async () => {
    if (selectedSearchIds.length === 0) return;
    try {
      const { error } = await supabase
        .from("saved_searches")
        .delete()
        .in("id", selectedSearchIds);

      if (error) throw error;

      setSavedSearches(prev => prev.filter(s => !selectedSearchIds.includes(s.id)));
      setSelectedSearchIds([]);
    } catch (err) {
      alert("Eroare la ștergere");
    }
  };

  const deleteAllSearches = async () => {
    if (!window.confirm("Sigur vrei să ștergi TOATE căutările salvate?")) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("saved_searches")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setSavedSearches([]);
      setSelectedSearchIds([]);
    } catch (err) {
      alert("Eroare la ștergere");
    }
  };

  /* ===============================
        SEARCH HANDLER
  ================================ */
  const handleSearch = async (query, offerType, payload, isAuto = false) => {
    setLoading(true);
    setActiveTab("search");
    setInitialFormData(null); // Reset pre-fill
    setInitialOfferType(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
      const normalized = (data?.cards || []).map((o) => ({
        ...o,
        image: normalizeImage(o.image || o.image_url || o.imageUrl || o.thumbnail || o.photo || null),
        offer_id: o.offer_id || o.id || o.cta?.url || `${o.provider}-${o.title}`,
      }));

      setSearchResults(normalized);
      setHasSearched(true);

      // Salvare automată dacă NU este o reluare de căutare
      if (!isAuto && session?.user) {
        await saveSearch(query, offerType, payload);
      }
    } catch (err) {
      console.error("Search error", err);
      alert("Eroare la căutare");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      AUTO-RESUME FROM STATE
  ================================ */
  useEffect(() => {
    if (location.state?.autoSearch && location.state?.payload) {
      const { query, offerType, payload } = location.state;
      setInitialOfferType(offerType);
      setInitialFormData(payload);
      handleSearch(query, offerType, payload, true);
    }
  }, [location.state]);

  const toggleSelect = (id) => {
    setSelectedSearchIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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
          context="search"
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
          context="favorites"
        />
      );
    }

    if (activeTab === "searches") {
      return (
        <div className="space-y-4">

          {/* ACTION BAR */}
          <div className="bg-white border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm text-slate-600">
              {selectedSearchIds.length} selectate
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-rose-600 border-rose-300"
                disabled={selectedSearchIds.length === 0}
                onClick={deleteSelectedSearches}
                iconName="Trash2"
              >
                Șterge selectate
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-slate-500"
                onClick={deleteAllSearches}
              >
                Șterge toate
              </Button>
            </div>
          </div>

          {/* LIST */}
          {savedSearches.length === 0 ? (
            <div className="text-center py-16 text-slate-400 border rounded-lg bg-white">
              <Icon name="History" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Nu ai încă nicio căutare salvată.</p>
            </div>
          ) : (
            <div className="divide-y border rounded-lg bg-white">
              {savedSearches.map((s) => (
                <div
                  key={s.id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3
                ${selectedSearchIds.includes(s.id) ? "bg-blue-50" : ""}
              `}
                >
                  {/* LEFT */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedSearchIds.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {s.offer_type}
                        </span>
                        <span className="font-medium text-slate-900 truncate">
                          {s.query}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Icon name="Calendar" size={12} />
                        {new Date(s.created_at).toLocaleString("ro-RO", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    iconName="RotateCcw"
                    onClick={() =>
                      navigate(location.pathname, {
                        state: {
                          autoSearch: true,
                          query: s.query,
                          offerType: s.offer_type,
                          payload: s.payload,
                        },
                        replace: true,
                      })
                    }
                  >
                    Repetă
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

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
            <div className="mt-6">

              {/* MOBILE */}
              <div className="grid grid-cols-3 gap-2 sm:hidden bg-slate-100 p-1 rounded-xl">
                {[
                  { id: "search", label: "Caută", icon: "🔍" },
                  { id: "favorites", label: `Favorite (${favorites.length})`, icon: "❤️" },
                  { id: "searches", label: `Căutări (${savedSearches.length})`, icon: "🕘" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
          text-sm py-2 rounded-lg font-medium transition
          ${activeTab === tab.id
                        ? "bg-white text-blue-600 shadow font-semibold"
                        : "text-slate-600"}
        `}
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden sm:flex gap-6">
                <button
                  onClick={() => setActiveTab("search")}
                  className={`pb-1 transition-all ${activeTab === "search"
                    ? "font-bold text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  🔍 Caută
                </button>

                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`pb-1 transition-all ${activeTab === "favorites"
                    ? "font-bold text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  ❤️ Favorite ({favorites.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab("searches");
                    loadSavedSearches();
                  }}
                  className={`pb-1 transition-all ${activeTab === "searches"
                    ? "font-bold text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  🕘 Căutări ({savedSearches.length})
                </button>
              </div>

            </div>

          </div>

          <Button onClick={() => navigate("/ai-chat-interface")}>
            <Icon name="MessageCircle" size={18} />
            Chat AI
          </Button>
        </div>

        <div className="border-b mb-8" />

        {/* SEARCH FORM – rămâne montat */}
        <div style={{ display: activeTab === "search" ? "block" : "none" }}>
          <SearchOffers
            onSearch={handleSearch}
            initialFormData={initialFormData}
            initialOfferType={initialOfferType}
          />
        </div>

        <div ref={resultsRef} />

        {/* CONTENT */}
        <div className="mt-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default OffersPage;
