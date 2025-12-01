import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import StatsCard from './components/StatsCard';
import UserManagementTable from './components/UserManagementTable';
import RevenueChart from './components/RevenueChart';
import ActivityFeed from './components/ActivityFeed';
import SystemAlerts from './components/SystemAlerts';
import ApiMonitoring from './components/ApiMonitoring';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    activeSearches: 0,
    apiRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // total utilizatori
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // abonamente active
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // venit lunar
      const { data: billing } = await supabase
        .from('billing_history')
        .select('amount, payment_date');

      const currentMonth = new Date().getMonth();
      const monthlyRevenue =
        billing
          ?.filter(b => new Date(b.payment_date).getMonth() === currentMonth)
          ?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

      // căutări active
      const { count: activeSearches } = await supabase
        .from('saved_searches')
        .select('*', { count: 'exact', head: true });

      // cereri API
      const { count: apiRequests } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'api_call');

      setStats({
        totalUsers: totalUsers ?? 0,
        activeSubscriptions: activeSubscriptions ?? 0,
        monthlyRevenue,
        activeSearches: activeSearches ?? 0,
        apiRequests: apiRequests ?? 0,
      });

      setLoading(false);
    } catch (err) {
      console.error('Eroare la fetchStats:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: 'Utilizatori înregistrați', value: stats.totalUsers, icon: 'Users' },
    { title: 'Abonamente active', value: stats.activeSubscriptions, icon: 'Crown' },
    { title: 'Venit lunar', value: `${stats.monthlyRevenue} €`, icon: 'TrendingUp' },
    { title: 'Căutări active', value: stats.activeSearches, icon: 'Search' },
    { title: 'Cereri API', value: stats.apiRequests, icon: 'Activity' },
    { title: 'Disponibilitate sistem', value: '99.9%', icon: 'Shield' },
  ];

  const quickActions = [
    { label: 'Export utilizatori', icon: 'Download', action: () => console.log('Export utilizatori') },
    { label: 'Trimite notificare', icon: 'Bell', action: () => console.log('Trimite notificare') },
    { label: 'Setări sistem', icon: 'Settings', action: () => console.log('Setări sistem') },
    { label: 'Vizualizează rapoarte', icon: 'FileText', action: () => console.log('Vizualizează rapoarte') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Panou Administrator - TravelAI Deals</title>
        <meta name="description" content="Panou administrativ TravelAI Deals" />
      </Helmet>

      <Header />

      <main className="pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Panou Administrator</h1>
                <p className="text-muted-foreground mt-1">
                  Monitorizează și administrează platforma TravelAI Deals
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" iconName="RefreshCw" onClick={fetchStats}>
                  Reîncarcă datele
                </Button>
                <Button variant="default" iconName="Plus">
                  Acțiune rapidă
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <p className="text-muted-foreground mb-8">Se încarcă datele...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {cards.map((c, i) => (
                <StatsCard key={i} title={c.title} value={c.value} icon={c.icon} />
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Acțiuni rapide</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={action.action}
                >
                  <Icon name={action.icon} size={24} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>
            <div className="xl:col-span-1">
              <ActivityFeed />
            </div>
          </div>

          {/* User Management Table */}
          <div className="mb-8">
            <UserManagementTable />
          </div>

          {/* System Monitoring */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <SystemAlerts />
            <ApiMonitoring />
          </div>

          {/* Footer */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    Toate sistemele funcționează normal
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Ultima actualizare: {new Date().toLocaleTimeString('ro-RO')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Versiunea 2.1.0</span>
                <span>•</span>
                <span>© {new Date().getFullYear()} TravelAI Deals</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
