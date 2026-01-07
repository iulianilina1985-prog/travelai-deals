import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OfferCard from '../../components/OfferCard';
import SavedSearchCard from './components/SavedSearchCard';
import FilterPanel from './components/FilterPanel';
import SubscriptionBanner from './components/SubscriptionBanner';
import { useAuth } from '../../contexts/AuthContext';

import favoritesService from '../../services/favoritesService';
import savedSearchesService from '../../services/savedSearchesService';
import userService from '../../services/userService';

const MyOffersDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('favorites'); // favorites | searches
  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    dealType: 'all',
    sortBy: 'newest'
  });

  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);

  const [favorites, setFavorites] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  const [userStats, setUserStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -----------------------------------------------------------
  //  LOAD DATA
  // -----------------------------------------------------------
  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [favoritesResult, searchesResult, statsResult] = await Promise.all([
        favoritesService.getFavorites(),
        savedSearchesService?.getSavedSearches?.(),
        userService?.getUserDashboardStats?.()
      ]);

      // Favorites from Supabase
      setFavorites(favoritesResult?.data || []);

      // Saved searches
      setSavedSearches(searchesResult?.data || []);

      // User stats
      setUserStats(statsResult?.data || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
      setFavorites([]);
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  //  FILTER & SORT
  // -----------------------------------------------------------
  const filteredFavorites = favorites.filter((offer) => {
    if (filters.search && !offer.title?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.destination && filters.destination !== "all") {
      if (!offer.title?.toLowerCase().includes(filters.destination.toLowerCase())) return false;
    }
    if (filters.dealType && filters.dealType !== "all") {
      if (offer.type !== filters.dealType) return false;
    }
    return true;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
      default:
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });

  // -----------------------------------------------------------
  //  FAVORITE TOGGLE ❤️
  // -----------------------------------------------------------
  const handleToggleFavorite = async (offer) => {
    try {
      if (offer.isFavorite) {
        // Remove from favorites
        await favoritesService.removeFavorite(offer.id);
        setFavorites(prev => prev.filter(f => f.id !== offer.id));
      } else {
        // Add to favorites
        await favoritesService.addFavorite(offer);
        // Reload favorites to get the updated list
        const { data } = await favoritesService.getFavorites();
        setFavorites(data || []);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('A apărut o eroare. Te rog încearcă din nou.');
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Icon name="Loader2" size={32} className="animate-spin text-primary" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="text-center py-12">
          <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Te rog autentifică-te</h2>
          <p className="text-muted-foreground mb-4">Această pagină este disponibilă doar pentru utilizatori autentificați.</p>
          <Link to="/login"><Button>Login</Button></Link>
        </div>
      </main>
    </div>
  );

  // -----------------------------------------------------------
  //  UI
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Ofertele mele</h1>
              <p className="text-muted-foreground">Favorite și căutări monitorizate</p>
            </div>

            <Link to="/ai-chat-interface">
              <Button>
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Caută oferte noi
              </Button>
            </Link>
          </div>

          <SubscriptionBanner
            userPlan={userStats?.current_plan || "Free Trial"}
            notificationCount={userStats?.unread_notifications_count || 0}
            maxNotifications={userStats?.notification_limit || 2}
          />

          {/* TABS */}
          <div className="border-b mb-6">
            <nav className="flex space-x-6 overflow-x-auto no-scrollbar py-2 sm:justify-start">
              {/* FAVORITE ❤️ */}
              <button
                onClick={() => setActiveTab("favorites")}
                className={`py-2 px-1 border-b-2 ${activeTab === "favorites" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={18} />
                  <span>Favorite</span>
                  <span className="bg-rose-500 text-white px-2 py-1 rounded-full text-xs">
                    {favorites.length}
                  </span>
                </div>
              </button>

              {/* SEARCHES */}
              <button
                onClick={() => setActiveTab("searches")}
                className={`py-2 px-1 border-b-2 ${activeTab === "searches" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Search" size={18} />
                  <span>Căutări</span>
                  <span className="bg-secondary px-2 py-1 rounded-full text-xs">
                    {savedSearches.length}
                  </span>
                </div>
              </button>

            </nav>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">

            {/* FILTERS */}
            {activeTab === "favorites" && (
              <div className="lg:col-span-1">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  isCollapsed={isFilterCollapsed}
                  onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
                  onClearFilters={() =>
                    setFilters({
                      search: '',
                      destination: 'all',
                      dealType: 'all',
                      sortBy: 'newest'
                    })
                  }
                />
              </div>
            )}

            {/* CONTENT */}
            <div className={activeTab === "favorites" ? "lg:col-span-3" : "lg:col-span-4"}>

              {/* LOADING */}
              {loading && (
                <div className="flex justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="text-center py-12">
                  <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                  <p>{error}</p>
                </div>
              )}

              {/* TAB CONTENT */}
              {!loading && !error && (
                <>

                  {/* ░░░ TAB 1: FAVORITE ❤️ ░░░ */}
                  {activeTab === "favorites" && (
                    <>
                      <div className="text-sm text-muted-foreground mb-4">
                        {sortedFavorites.length} favorite
                      </div>

                      {sortedFavorites.length === 0 ? (
                        <div className="text-center py-12">
                          <Icon name="HeartOff" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">Nicio ofertă favorită</h3>
                          <p className="text-muted-foreground mb-4">
                            Salvează ofertele pentru a le regăsi aici
                          </p>
                          <Link to="/cauta-oferte">
                            <Button>Caută oferte</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {sortedFavorites.map((offer) => (
                            <OfferCard
                              key={offer.id}
                              offer={offer}
                              isFavorite={true}
                              onToggleFavorite={handleToggleFavorite}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ░░░ TAB 2: SEARCHES ░░░ */}
                  {activeTab === "searches" && (
                    <div className="space-y-4">
                      {savedSearches.length === 0 ? (
                        <div className="text-center py-12">
                          <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">Nicio căutare salvată</h3>
                          <p className="text-muted-foreground mb-4">
                            Salvează căutările pentru a le monitoriza
                          </p>
                        </div>
                      ) : (
                        savedSearches.map((search) => (
                          <SavedSearchCard
                            key={search.id}
                            search={search}
                            onEdit={() => { }}
                            onDelete={() => { }}
                            onToggleMonitoring={() => { }}
                          />
                        ))
                      )}
                    </div>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOffersDashboard;
