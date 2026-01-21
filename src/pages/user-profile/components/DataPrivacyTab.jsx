import React, { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

// setări default dacă userul nu are încă rând în privacy_settings
const DEFAULT_PRIVACY = {
  data_collection: true,
  analytics: false,
  marketing: false,
  third_party_sharing: false,
};

const DataPrivacyTab = () => {
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState({
    data_collection: true,
    analytics: false,
    marketing: false,
    third_party_sharing: false,
  });
  const [dataUsage, setDataUsage] = useState({
    totalSearches: 0,
    savedDeals: 0,
    profileViews: 0,
    dataSize: "—",
    lastExport: "—",
    accountCreated: "—",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📥 1. luăm userul + setările din supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);


      // user curent
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user || userErr) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // citim privacy_settings
      const { data: privacyRow, error: privacyErr } = await supabase
        .from("privacy_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // dacă nu există, îl creăm cu valorile default
      if (!privacyRow) {
        const insertPayload = {
          user_id: user.id,
          ...DEFAULT_PRIVACY,
        };
        const { data: newRow } = await supabase
          .from("privacy_settings")
          .insert([insertPayload])
          .select()
          .single();

        setPrivacySettings({
          data_collection: newRow?.data_collection ?? true,
          analytics: newRow?.analytics ?? false,
          marketing: newRow?.marketing ?? false,
          third_party_sharing: newRow?.third_party_sharing ?? false,
        });
      } else {
        setPrivacySettings({
          data_collection:
            privacyRow?.data_collection ?? DEFAULT_PRIVACY.data_collection,
          analytics: privacyRow?.analytics ?? DEFAULT_PRIVACY.analytics,
          marketing: privacyRow?.marketing ?? DEFAULT_PRIVACY.marketing,
          third_party_sharing:
            privacyRow?.third_party_sharing ??
            DEFAULT_PRIVACY.third_party_sharing,
        });

        // punem și info deja stocat
        setDataUsage((prev) => ({
          ...prev,
          dataSize: privacyRow?.data_size || prev.dataSize,
          lastExport: privacyRow?.last_export
            ? new Date(privacyRow.last_export).toISOString().slice(0, 10)
            : prev.lastExport,
        }));
      }

      // 📊 citim activitatea reală din tabelele tale
      await loadUsageStats(user.id);

      setLoading(false);
    };

    loadData();
  }, []);

  // 🔁 helper separat ca să-l putem apela și după EXPORT
  const loadUsageStats = async (uid) => {
    // 🔎 CĂUTĂRI SALVATE
    const { count: savedSearchesCount } = await supabase
      .from("saved_searches")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid);

    // ❤️ OFERTE SALVATE (CORECT)
    const { count: savedOffersCount } = await supabase
      .from("saved_offers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid);

    // 💬 CHATURI (CORECT)
    const { count: chatCount } = await supabase
      .from("chat_conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", uid);

    /// 📅 DATA CREĂRII CONTULUI
    const { data: profileRow } = await supabase
      .from("user_profiles")
      .select("created_at")
      .eq("id", uid)
      .maybeSingle();

    setDataUsage((prev) => ({
      ...prev,
      totalSearches: savedSearchesCount ?? 0,
      savedDeals: savedOffersCount ?? 0,
      profileViews: chatCount ?? 0,
      accountCreated: profileRow?.created_at
        ? new Date(profileRow.created_at).toISOString().slice(0, 10)
        : "—",
    }));


  };


  // ✅ 2. când bifezi/debifezi o setare, o salvăm și în DB
  const handlePrivacyChange = async (setting, checked) => {
    const newState = {
      ...privacySettings,
      [setting]: checked,
    };
    setPrivacySettings(newState);

    if (!userId) return;
    await supabase
      .from("privacy_settings")
      .update({
        data_collection: newState.data_collection,
        analytics: newState.analytics,
        marketing: newState.marketing,
        third_party_sharing: newState.third_party_sharing,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  };

  // 📦 3. export date – luăm ce putem și facem JSON de descărcat
  const handleExportData = async () => {
    if (!userId) return;

    // luăm din tabelele pe care le ai
    const [profileRes, travelPrefsRes, notifPrefsRes, savesRes, searchesRes, notifsRes, chatsRes, subsRes, billingRes] =
      await Promise.all([
        supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("travel_preferences")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("notification_preferences")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.from("saved_deals").select("*").eq("user_id", userId),
        supabase.from("saved_searches").select("*").eq("user_id", userId),
        supabase.from("notifications").select("*").eq("user_id", userId),
        supabase.from("chat_history").select("*").eq("user_id", userId),
        supabase.from("subscriptions").select("*").eq("user_id", userId),
        supabase.from("billing_history").select("*").eq("user_id", userId),
      ]);

    const exportPayload = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      profile: profileRes.data || null,
      travel_preferences: travelPrefsRes.data || null,
      notification_preferences: notifPrefsRes.data || null,
      saved_deals: savesRes.data || [],
      saved_searches: searchesRes.data || [],
      notifications: notifsRes.data || [],
      chat_history: chatsRes.data || [],
      subscriptions: subsRes.data || [],
      billing_history: billingRes.data || [],
    };

    // descarcăm în browser
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travelai-data-export.json";
    a.click();
    URL.revokeObjectURL(url);

    // salvăm și în privacy_settings că s-a făcut export
    await supabase
      .from("privacy_settings")
      .update({
        last_export: new Date().toISOString(),
        data_size: `${blob.size} B`,
      })
      .eq("user_id", userId);

    // updatăm și UI-ul
    setDataUsage((prev) => ({
      ...prev,
      lastExport: new Date().toISOString().slice(0, 10),
      dataSize: `${blob.size} B`,
    }));
  };

  // 🧨 4. ștergere cont – ștergem datele din tabelele publice
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT" || !userId) return;

    // ștergem în ordine sigură
    await supabase.from("saved_deals").delete().eq("user_id", userId);
    await supabase.from("saved_searches").delete().eq("user_id", userId);
    await supabase.from("notifications").delete().eq("user_id", userId);
    await supabase.from("chat_history").delete().eq("user_id", userId);
    await supabase.from("travel_preferences").delete().eq("user_id", userId);
    await supabase.from("notification_preferences").delete().eq("user_id", userId);
    await supabase.from("subscriptions").delete().eq("user_id", userId);
    await supabase.from("billing_history").delete().eq("user_id", userId);
    await supabase.from("user_profiles").delete().eq("user_id", userId);
    await supabase.from("privacy_settings").delete().eq("user_id", userId);

    // auth.users delete requires edge function
    alert(
      "Your data from the application has been deleted. To permanently close your account (auth), please contact support."
    );

    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  // aceleași opțiuni UI ca în componenta ta, dar în română
  const privacyOptions = [
    {
      id: "data_collection",
      title: "Data collection",
      description:
        "Allows collecting usage data to improve service quality.",
      icon: "Database",
      required: true,
    },
    {
      id: "analytics",
      title: "Analysis and performance",
      description:
        "Help us understand how you use the platform to optimize it.",
      icon: "BarChart3",
      required: false,
    },
    {
      id: "marketing",
      title: "Marketing communications",
      description:
        "Receive personalized offers and travel recommendations.",
      icon: "Mail",
      required: false,
    },
    {
      id: "third_party_sharing",
      title: "Sharing with partners",
      description:
        "We share anonymized data with travel partners for better offers.",
      icon: "Share2",
      required: false,
    },
  ];

  if (loading)
    return (
      <p className="text-muted-foreground">Loading privacy settings…</p>
    );

  return (
    <div className="space-y-6">
      {/* 1. SETĂRI CONFIDENȚIALITATE */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Icon name="Shield" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Privacy Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Control how your data is used and shared
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {privacyOptions?.map((option) => (
            <div
              key={option?.id}
              className="p-4 border border-border rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mt-1">
                    <Icon
                      name={option?.icon}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">
                        {option?.title}
                      </h4>
                      {option?.required && (
                        <span className="px-2 py-1 bg-warning text-warning-foreground text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option?.description}
                    </p>
                  </div>
                </div>
                <Checkbox
                  checked={!!privacySettings?.[option?.id]}
                  onChange={(e) =>
                    handlePrivacyChange(option?.id, e?.target?.checked)
                  }
                  disabled={option?.required}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DASHBOARD DATE */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
            <Icon name="Activity" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Data usage panel
            </h3>
            <p className="text-sm text-muted-foreground">
              A quick look at your activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon="Search"
            color="text-primary"
            title="Saved searches"
            value={dataUsage?.totalSearches}
          />
          <StatCard
            icon="Bookmark"
            color="text-success"
            title="Saved deals"
            value={dataUsage?.savedDeals}
          />
          <StatCard
            icon="Eye"
            color="text-warning"
            title="Interactions / chat"
            value={dataUsage?.profileViews}
          />
          <StatCard
            icon="HardDrive"
            color="text-accent"
            title="Data size"
            value={dataUsage?.dataSize}
          />
          <StatCard
            icon="Download"
            color="text-secondary"
            title="Last export"
            value={dataUsage?.lastExport}
          />
          <StatCard
            icon="Calendar"
            color="text-primary"
            title="Member since"
            value={dataUsage?.accountCreated}
          />
        </div>
      </div>

      {/* 3. GDPR */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success text-success-foreground rounded-full flex items-center justify-center">
            <Icon name="FileText" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              GDPR Compliance
            </h3>
            <p className="text-sm text-muted-foreground">
              Your rights under European legislation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="Download" size={20} className="text-primary" />
              <h4 className="font-medium text-foreground">Export your data</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download a full copy of your data in JSON format.
            </p>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={handleExportData}
            >
              Export data
            </Button>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="FileText" size={20} className="text-secondary" />
              <h4 className="font-medium text-foreground">
                Privacy Policy
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Read our full privacy and data processing policy.
            </p>
            <Button
              variant="outline"
              size="sm"
              iconName="ExternalLink"
              onClick={() => navigate("/politica-confidentialitate")}
            >
              See policy
            </Button>

          </div>
        </div>
      </div>

      {/* 4. ȘTERGERE CONT – păstrăm EXACT structura ta */}
      <div className="bg-card border border-destructive rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
            <Icon name="Trash2" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Delete account
            </h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete account and all associated data
            </p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Icon
                  name="AlertTriangle"
                  size={20}
                  className="text-destructive mt-0.5"
                />
                <div>
                  <h4 className="font-medium text-destructive mb-2">
                    Attention: this action is irreversible
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All saved offers and searches will be deleted</li>
                    <li>• Your subscription will be canceled</li>
                    <li>• You will lose access to premium features</li>
                    <li>• This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              iconName="Trash2"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete my account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-foreground mb-3">
                To confirm account deletion, type{" "}
                <strong>"DELETE MY ACCOUNT"</strong> below:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e?.target?.value)}
                placeholder='Type: "DELETE MY ACCOUNT"'
                className="w-full px-3 py-2 border border-destructive rounded-md bg-background text-foreground focus:ring-2 focus:ring-destructive focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                iconName="Trash2"
                disabled={deleteConfirmText !== "DELETE MY ACCOUNT"}
                onClick={handleDeleteAccount}
              >
                Confirm deletion
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// mică subcomponentă pentru cardurile de statistici
const StatCard = ({ icon, color, title, value }) => (
  <div className="p-4 bg-muted rounded-lg">
    <div className="flex items-center space-x-2 mb-2">
      <Icon name={icon} size={16} className={color} />
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
    <div className="text-2xl font-bold text-foreground">
      {value !== undefined && value !== null ? value : "—"}
    </div>
  </div>
);

export default DataPrivacyTab;
