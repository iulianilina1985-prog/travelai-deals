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
        <div className="space-y-6">
          {/* BULK ACTIONS BAR */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm sticky top-20 z-10 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                {selectedSearchIds.length} selectate
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                disabled={selectedSearchIds.length === 0}
                onClick={deleteSelectedSearches}
                iconName="Trash2"
              >
                Șterge selectate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-rose-600"
                onClick={deleteAllSearches}
              >
                Șterge toate
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {savedSearches.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-slate-400">
                <Icon name="History" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Nu ai încă nicio căutare salvată.</p>
              </div>
            ) : (
              savedSearches.map((s) => (
                <div
                  key={s.id}
                  className={`p-4 bg-white rounded-xl border flex justify-between items-center transition-all hover:shadow-md ${selectedSearchIds.includes(s.id) ? "border-blue-500 bg-blue-50/30" : ""
                    }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedSearchIds.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                          {s.offer_type}
                        </span>
                        <div className="font-semibold text-slate-900 truncate">{s.query}</div>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        {new Date(s.created_at).toLocaleString("ro-RO", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate(location.pathname, {
                      state: {
                        autoSearch: true,
                        query: s.query,
                        offerType: s.offer_type,
                        payload: s.payload
                      },
                      replace: true
                    })}
                    iconName="RotateCcw"
                  >
                    Repetă
                  </Button>
                </div>
              ))
            )}
          </div>
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
            <div className="flex gap-6 mt-6">
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
