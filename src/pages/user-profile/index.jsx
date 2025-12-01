import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import { supabase } from "../../lib/supabase";

import PersonalInfoTab from "./components/PersonalInfoTab";
import TravelPreferencesTab from "./components/TravelPreferencesTab";
import SubscriptionTab from "./components/SubscriptionTab";
import NotificationSettingsTab from "./components/NotificationSettingsTab";
import DataPrivacyTab from "./components/DataPrivacyTab";
import LanguageCurrencyTab from "./components/LanguageCurrencyTab";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeUserProfileTab") || "personal"
  );

  const [currentLanguage, setCurrentLanguage] = useState("ro");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("activeUserProfileTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      // 1) USER
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      // 2) SUBSCRIPTION REALĂ
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_name")
        .eq("user_id", user.id)
        .maybeSingle();

      const realPlan = sub?.plan_name || "Free";

      // 3) UPDATE USER INFO
      setUserInfo({
        name: user.user_metadata?.full_name || "Utilizator",
        email: user.email,
        avatar: user.user_metadata?.avatar_url || "",
        subscriptionTier: realPlan, // 🔥 PLAN REAL, NU metadata veche!
        memberSince: new Date(user.created_at).toLocaleDateString("ro-RO", {
          year: "numeric",
          month: "long",
        }),
      });

    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  const tabs = [
    { id: "personal", label: "Informații Personale", icon: "User", component: PersonalInfoTab },
    { id: "travel", label: "Preferințe Călătorie", icon: "Plane", component: TravelPreferencesTab },
    { id: "subscription", label: "Abonament", icon: "Crown", component: SubscriptionTab },
    { id: "notifications", label: "Notificări", icon: "Bell", component: NotificationSettingsTab },
    { id: "privacy", label: "Confidențialitate", icon: "Shield", component: DataPrivacyTab },
    { id: "language", label: "Limbă & Monedă", icon: "Globe", component: LanguageCurrencyTab },
  ];

  const ActiveTabComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || PersonalInfoTab;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("activeUserProfileTab", tabId);
    setIsMobileMenuOpen(false); // închide slide-over
  };

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-16 px-4 sm:px-6 lg:px-8 py-8">
        {/* Profil */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          {loading ? (
            <p className="text-muted-foreground">Se încarcă profilul...</p>
          ) : (
            userInfo && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary">
                    <Image
                      src={userInfo.avatar || defaultAvatar}
                      alt={userInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                    <Icon name="Check" size={12} color="white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{userInfo.name}</h1>
                  <p className="text-muted-foreground">{userInfo.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Membru din {userInfo.memberSince}
                  </p>
                </div>

                <div>
                  <div className="text-lg font-bold text-primary">
                    {userInfo.subscriptionTier}
                  </div>
                  <div className="text-sm text-muted-foreground">Plan Curent</div>
                </div>
              </div>
            )
          )}
        </div>

        {/* ✅ TAB + SLIDE-OVER */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ✅ Buton meniu mobil */}
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
            >
              <Icon name="Menu" size={20} />
              <span>Meniu Profil</span>
            </button>
          </div>

          {/* ✅ Slide-over pe mobil */}
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <div className="fixed top-0 left-0 h-full w-72 bg-white border-r border-border shadow-xl z-50 animate-slide-in">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Meniu Profil</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-black"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>

                <nav className="p-4 flex flex-col gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon name={tab.icon} size={20} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* ✅ Meniu desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon name={tab.icon} size={20} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* ✅ Conținut tab */}
          <div className="flex-1 min-w-0">
            <div className="animate-fade-in">
              <ActiveTabComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
