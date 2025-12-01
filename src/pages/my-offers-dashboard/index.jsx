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

const MyOffersDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('deals');
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
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data states
  const [deals, setDeals] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data when component mounts or user changes
  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  // Filter deals when filters change
  const filteredDeals = deals?.filter((deal) => {
    if (filters?.search && 
        !deal?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
        !deal?.destination?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
      return false;
    }
    if (filters?.destination !== 'all' && 
        !deal?.destination?.toLowerCase()?.includes(filters?.destination?.toLowerCase())) {
      return false;
    }
    if (filters?.minPrice && deal?.current_price < parseInt(filters?.minPrice)) {
      return false;
    }
    if (filters?.maxPrice && deal?.current_price > parseInt(filters?.maxPrice)) {
      return false;
    }
    if (filters?.startDate && new Date(deal?.departure_date) < new Date(filters?.startDate)) {
      return false;
    }
    if (filters?.endDate && new Date(deal?.departure_date) > new Date(filters?.endDate)) {
      return false;
    }
    return true;
  });

  // Sort deals
  const sortedDeals = [...filteredDeals]?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'price_low':
        return (a?.current_price || 0) - (b?.current_price || 0);
      case 'price_high':
        return (b?.current_price || 0) - (a?.current_price || 0);
      case 'expiry':
        return new Date(a?.expiry_date || 0) - new Date(b?.expiry_date || 0);
      case 'rating':
        return (b?.rating || 0) - (a?.rating || 0);
      case 'newest':
      default:
        return (b?.is_new ? 1 : 0) - (a?.is_new ? 1 : 0);
    }
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load saved deals, saved searches, and user stats in parallel
      const [dealsResult, searchesResult, statsResult] = await Promise.all([
        dealsService?.getSavedDeals(),
        savedSearchesService?.getSavedSearches(),
        userService?.getUserDashboardStats()
      ]);

      if (dealsResult?.error) {
        console.error('Failed to load deals:', dealsResult?.error);
      } else {
        setDeals(dealsResult?.data || []);
      }

      if (searchesResult?.error) {
        console.error('Failed to load searches:', searchesResult?.error);
      } else {
        setSavedSearches(searchesResult?.data || []);
      }

      if (statsResult?.error) {
        console.error('Failed to load stats:', statsResult?.error);
      } else {
        setUserStats(statsResult?.data || {});
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDeal = async (dealId) => {
    try {
      // Find the saved deal record
      const savedDeal = deals?.find(deal => deal?.id === dealId);
      if (!savedDeal?.saved_id) {
        return;
      }

      const { error } = await dealsService?.removeSavedDeal(savedDeal?.saved_id);
      
      if (error) {
        console.error('Failed to remove deal:', error);
        return;
      }

      // Update local state
      setDeals(prevDeals => prevDeals?.filter(deal => deal?.id !== dealId));
    } catch (error) {
      console.error('Failed to remove deal:', error);
    }
  };

  const handleShareDeal = (deal) => {
    if (navigator.share) {
      navigator.share({
        title: deal?.title,
        text: `Ofertă specială: ${deal?.title} - €${deal?.current_price}`,
        url: window.location?.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard?.writeText(`${deal?.title} - €${deal?.current_price} - ${window.location?.href}`);
    }
  };

  const handleViewDetails = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleEditSearch = (search) => {
    // Navigate to chat interface with pre-filled search parameters
    console.log('Edit search:', search);
  };

  const handleDeleteSearch = async (searchId) => {
    try {
      const { error } = await savedSearchesService?.deleteSavedSearch(searchId);
      
      if (error) {
        console.error('Failed to delete search:', error);
        return;
      }

      // Update local state
      setSavedSearches(prevSearches => prevSearches?.filter(search => search?.id !== searchId));
    } catch (error) {
      console.error('Failed to delete search:', error);
    }
  };

  const handleToggleMonitoring = async (searchId) => {
    try {
      const { data, error } = await savedSearchesService?.toggleSearchStatus(searchId);
      
      if (error) {
        console.error('Failed to toggle monitoring:', error);
        return;
      }

      // Update local state
      setSavedSearches(prevSearches => 
        prevSearches?.map(search =>
          search?.id === searchId ? { ...search, status: data?.status } : search
        )
      );
    } catch (error) {
      console.error('Failed to toggle monitoring:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      destination: 'all',
      dealType: 'all',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: '',
      sortBy: 'newest'
    });
  };

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Authentication Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your saved offers and searches.
              </p>
              <Link to="/login">
                <Button variant="default">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Ofertele mele
                </h1>
                <p className="text-muted-foreground">
                  Gestionează ofertele salvate și căutările monitorizate
                </p>
              </div>
              <Link to="/ai-chat-interface">
                <Button variant="default">
                  <Icon name="MessageCircle" size={18} className="mr-2" />
                  Caută oferte noi
                </Button>
              </Link>
            </div>
          </div>

          {/* Subscription Banner */}
          <SubscriptionBanner
            userPlan={userStats?.current_plan || 'Free Trial'}
            notificationCount={userStats?.unread_notifications_count || 0}
            maxNotifications={userStats?.notification_limit || 2}
          />

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'deals' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="Gift" size={18} />
                    <span>Oferte active</span>
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                      {deals?.length || 0}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('searches')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'searches' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="Search" size={18} />
                    <span>Căutări salvate</span>
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                      {savedSearches?.length || 0}
                    </span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                isCollapsed={isFilterCollapsed}
                onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Error Loading Data
                  </h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={loadDashboardData}>
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  {activeTab === 'deals' && (
                    <div>
                      {/* Results Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-sm text-muted-foreground">
                          {sortedDeals?.length} {sortedDeals?.length === 1 ? 'ofertă găsită' : 'oferte găsite'}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="lg:hidden"
                          onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                        >
                          <Icon name="Filter" size={16} className="mr-2" />
                          Filtre
                        </Button>
                      </div>

                      {/* Deals Grid */}
                      {sortedDeals?.length > 0 ? (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {sortedDeals?.map((deal) => (
                            <DealCard
                              key={deal?.id}
                              deal={deal}
                              onRemove={handleRemoveDeal}
                              onShare={handleShareDeal}
                              onViewDetails={handleViewDetails}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Gift" size={32} className="text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Nu ai oferte salvate
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Începe să cauți oferte pentru a le vedea aici
                          </p>
                          <Link to="/ai-chat-interface">
                            <Button variant="default">
                              <Icon name="MessageCircle" size={18} className="mr-2" />
                              Caută oferte
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'searches' && (
                    <div>
                      {/* Results Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-sm text-muted-foreground">
                          {savedSearches?.length} {savedSearches?.length === 1 ? 'căutare salvată' : 'căutări salvate'}
                        </div>
                        <Link to="/ai-chat-interface">
                          <Button variant="outline" size="sm">
                            <Icon name="Plus" size={16} className="mr-2" />
                            Căutare nouă
                          </Button>
                        </Link>
                      </div>

                      {/* Saved Searches */}
                      {savedSearches?.length > 0 ? (
                        <div className="space-y-4">
                          {savedSearches?.map((search) => (
                            <SavedSearchCard
                              key={search?.id}
                              search={search}
                              onEdit={handleEditSearch}
                              onDelete={handleDeleteSearch}
                              onToggleMonitoring={handleToggleMonitoring}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Search" size={32} className="text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Nu ai căutări salvate
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Salvează căutări pentru a monitoriza automat ofertele noi
                          </p>
                          <Link to="/ai-chat-interface">
                            <Button variant="default">
                              <Icon name="MessageCircle" size={18} className="mr-2" />
                              Începe o căutare
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Deal Details Modal */}
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