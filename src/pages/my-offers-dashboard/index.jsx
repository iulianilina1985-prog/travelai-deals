import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DealCard from './components/DealCard';
import SavedSearchCard from './components/SavedSearchCard';
import FilterPanel from './components/FilterPanel';
import DealDetailsModal from './components/DealDetailsModal';
import SubscriptionBanner from './components/SubscriptionBanner';
import { useAuth } from '../../contexts/AuthContext';

import dealsService from '../../services/dealsService';
import savedSearchesService from '../../services/savedSearchesService';
import userService from '../../services/userService';

import { MOCK_DEALS, MOCK_SAVED_SEARCHES } from "./mockData";

const MyOffersDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('deals'); // deals | favorites | searches
  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    dealType: 'all',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    sortBy: 'newest'
  });

  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);

  const [deals, setDeals] = useState([]);
  const [favorites, setFavorites] = useState([]); // ❤️ NOU
  const [savedSearches, setSavedSearches] = useState([]);

  const [userStats, setUserStats] = useState({});
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      const [dealsResult, searchesResult, statsResult] = await Promise.all([
        dealsService?.getSavedDeals?.(),
        savedSearchesService?.getSavedSearches?.(),
        userService?.getUserDashboardStats?.()
      ]);

      // Oferte (fallback pe mock)
      const realDeals = dealsResult?.data || [];
      const finalDeals = realDeals.length > 0 ? realDeals : MOCK_DEALS;

      setDeals(finalDeals);

      // extragem favoritele
      setFavorites(finalDeals.filter((d) => d.is_saved));

      // Căutări salvate
      const realSearches = searchesResult?.data || [];
      setSavedSearches(realSearches.length > 0 ? realSearches : MOCK_SAVED_SEARCHES);

      setUserStats(statsResult?.data || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
      setDeals(MOCK_DEALS);
      setFavorites(MOCK_DEALS.filter(d => d.is_saved));
      setSavedSearches(MOCK_SAVED_SEARCHES);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------
  //  FILTER & SORT
  // -----------------------------------------------------------
  const filteredDeals = deals.filter((deal) => {
    if (filters.search && !deal.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.destination && filters.destination !== "all") {
      if (!deal.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;
    }
    if (filters.minPrice && deal.current_price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && deal.current_price > parseInt(filters.maxPrice)) return false;

    if (filters.startDate && new Date(deal.departure_date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(deal.departure_date) > new Date(filters.endDate)) return false;

    return true;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.current_price - b.current_price;
      case "price_high":
        return b.current_price - a.current_price;
      case "expiry":
        return new Date(a.expiry_date) - new Date(b.expiry_date);
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
    }
  });

  // -----------------------------------------------------------
  //  FAVORITE TOGGLE ❤️
  // -----------------------------------------------------------
  const handleToggleSave = (deal) => {
    const updated = deals.map((d) =>
      d.id === deal.id ? { ...d, is_saved: !d.is_saved } : d
    );

    setDeals(updated);
    setFavorites(updated.filter((d) => d.is_saved));
  };

  // -----------------------------------------------------------
  //  REMOVE (for saved deals)
  // -----------------------------------------------------------
  const handleRemoveDeal = (dealId) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
    setFavorites(prev => prev.filter(d => d.id !== dealId));
  };

  // -----------------------------------------------------------
  //  VIEW DETAILS
  // -----------------------------------------------------------
  const handleViewDetails = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
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
              <p className="text-muted-foreground">Favorite, oferte active și căutări monitorizate</p>
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
            <nav className="
              flex 
              space-x-6 
              overflow-x-auto 
              no-scrollbar 
              py-2
              sm:justify-start
            ">
              {/* ACTIVE DEALS */}
              <button
                onClick={() => setActiveTab("deals")}
                className={`py-2 px-1 border-b-2 ${activeTab === "deals" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="Gift" size={18} />
                  <span>Oferte active</span>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                    {deals.length}
                  </span>
                </div>
              </button>

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
            {activeTab === "deals" && (
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
                      minPrice: '',
                      maxPrice: '',
                      startDate: '',
                      endDate: '',
                      sortBy: 'newest'
                    })
                  }
                />
              </div>
            )}

            {/* CONTENT */}
            <div className={activeTab === "deals" ? "lg:col-span-3" : "lg:col-span-4"}>

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

                  {/* ░░░ TAB 1: DEALS ACTIVE ░░░ */}
                  {activeTab === "deals" && (
                    <>
                      <div className="text-sm text-muted-foreground mb-4">
                        {sortedDeals.length} rezultate
                      </div>

                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedDeals.map((deal) => (
                          <DealCard
                            key={deal.id}
                            deal={deal}
                            onViewDetails={handleViewDetails}
                            onToggleSave={handleToggleSave}
                            onRemove={handleRemoveDeal}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* ░░░ TAB 2: FAVORITE ❤️ ░░░ */}
                  {activeTab === "favorites" && (
                    <>
                      <div className="text-sm text-muted-foreground mb-4">
                        {favorites.length} favorite
                      </div>

                      {favorites.length === 0 ? (
                        <div className="text-center py-12">
                          <Icon name="HeartOff" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">Nicio ofertă favorită</h3>
                          <p className="text-muted-foreground mb-4">
                            Salvează ofertele pentru a le regăsi aici
                          </p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {favorites.map((deal) => (
                            <DealCard
                              key={deal.id}
                              deal={deal}
                              onViewDetails={handleViewDetails}
                              onToggleSave={handleToggleSave}
                              onRemove={handleRemoveDeal}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ░░░ TAB 3: SEARCHES ░░░ */}
                  {activeTab === "searches" && (
                    <div className="space-y-4">
                      {savedSearches.map((search) => (
                        <SavedSearchCard
                          key={search.id}
                          search={search}
                          onEdit={() => {}}
                          onDelete={() => {}}
                          onToggleMonitoring={() => {}}
                        />
                      ))}
                    </div>
                  )}

                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      <DealDetailsModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDeal(null);
        }}
      />
    </div>
  );
};

export default MyOffersDashboard;
