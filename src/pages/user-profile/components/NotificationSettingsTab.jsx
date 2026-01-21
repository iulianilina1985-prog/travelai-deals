import React, { useState, useEffect } from "react";
import { Checkbox, CheckboxGroup } from "../../../components/ui/Checkbox";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

const NotificationSettingsTab = () => {
  const [emailSettings, setEmailSettings] = useState({});
  const [pushSettings, setPushSettings] = useState({});
  const [preferences, setPreferences] = useState({});
  const [stats, setStats] = useState({
    weekly: 0,
    deals: 0,
    drops: 0,
    bookings: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Încarcă userul și preferințele
  useEffect(() => {
    const loadPrefs = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!data || error?.code === "PGRST116") {
        // ✅ Inițializează dacă nu există rând
        const defaults = {
          email_settings: {
            dealAlerts: true,
            priceDrops: true,
            weeklyDigest: false,
            systemUpdates: true,
            marketingEmails: false,
          },
          push_settings: {
            instantDeals: true,
            priceAlerts: true,
            bookingReminders: true,
            systemNotifications: false,
          },
          preferences: {
            frequency: "immediate",
            quietHours: "enabled",
            quietStart: "22:00",
            quietEnd: "08:00",
            timezone: "Europe/Bucharest",
          },
        };

        await supabase
          .from("notification_preferences")
          .insert([{ user_id: user.id, ...defaults }]);

        setEmailSettings(defaults.email_settings);
        setPushSettings(defaults.push_settings);
        setPreferences(defaults.preferences);
      } else {
        // ✅ Date existente
        setEmailSettings(data.email_settings || {});
        setPushSettings(data.push_settings || {});
        setPreferences(data.preferences || {});
      }

      await loadStats(user.id);
      setLoading(false);
    };

    loadPrefs();
  }, []);

  // 🔹 Încarcă statisticile reale din tabela "notifications"
  const loadStats = async (userId) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const { data, error } = await supabase
      .from("notifications")
      .select("type, created_at")
      .eq("user_id", userId)
      .gte("created_at", lastWeek.toISOString());

    if (error || !data) {
      console.warn("⚠️ Nicio notificare recentă sau eroare:", error?.message);
      setStats({ weekly: 0, deals: 0, drops: 0, bookings: 0 });
      return;
    }

    const statsCount = {
      weekly: data.length,
      deals: data.filter((n) => n.type === "deal").length,
      drops: data.filter((n) => n.type === "price_drop").length,
      bookings: data.filter((n) => n.type === "booking").length,
    };

    setStats(statsCount);
  };

  // 🔹 Salvează preferințele în DB
  const handleSaveSettings = async () => {
    if (!userId) return;
    setLoading(true);

    const { error } = await supabase
      .from("notification_preferences")
      .upsert(
        {
          user_id: userId,
          email_settings: emailSettings,
          push_settings: pushSettings,
          preferences: preferences,
          updated_at: new Date(),
        },
        { onConflict: "user_id" }
      );

    setIsEditing(false);
    setLoading(false);

    if (error) {
      console.error(error);
      alert("❌ Error saving preferences!");
    } else {
      alert("✅ Notification preferences saved successfully!");
    }
  };

  // 🔹 Trimite notificare de test
  const handleTestNotification = async () => {
    if (!userId) return;

    await supabase.from("notifications").insert([
      {
        user_id: userId,
        type: "test",
        title: "🔔 Test Notification",
        message:
          "This is a demonstration notification. Everything is working perfectly!",
        is_read: false,
        created_at: new Date(),
      },
    ]);

    await loadStats(userId);
    alert("✅ Test notification sent successfully!");
  };

  // 🔹 Opțiuni
  const frequencyOptions = [
    { value: "immediate", label: "Immediately" },
    { value: "hourly", label: "Once per hour" },
    { value: "daily", label: "Daily digest" },
    { value: "weekly", label: "Weekly digest" },
  ];

  const timezoneOptions = [
    { value: "Europe/Bucharest", label: "Romania (UTC+2)" },
    { value: "Europe/London", label: "London (UTC+0)" },
    { value: "Europe/Paris", label: "Paris (UTC+1)" },
    { value: "Europe/Berlin", label: "Berlin (UTC+1)" },
    { value: "Europe/Rome", label: "Rome (UTC+1)" },
  ];

  if (loading)
    return <p className="text-muted-foreground">Loading preferences...</p>;

  return (
    <div className="space-y-6">
      {/* --- Setări principale --- */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Notification Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage how and when you receive notifications
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Bell"
              onClick={handleTestNotification}
            >
              Test notification
            </Button>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              iconName={isEditing ? "X" : "Edit"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </div>

        {/* --- Email Notifications --- */}
        <Section
          icon="Mail"
          title="Email Notifications"
          description="Receive alerts and digests via email"
        >
          <CheckboxGroup className="space-y-3">
            <Checkbox
              label="Deal alerts"
              description="When new deals matching your preferences appear"
              checked={emailSettings.dealAlerts}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  dealAlerts: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
            <Checkbox
              label="Price drops"
              description="When a price for a destination drops"
              checked={emailSettings.priceDrops}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  priceDrops: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
            <Checkbox
              label="Weekly digest"
              description="A summary of the best deals"
              checked={emailSettings.weeklyDigest}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  weeklyDigest: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
            <Checkbox
              label="System updates"
              description="Notifications related to account or application"
              checked={emailSettings.systemUpdates}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  systemUpdates: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
            <Checkbox
              label="Marketing emails"
              description="Promotions and special offers"
              checked={emailSettings.marketingEmails}
              onChange={(e) =>
                setEmailSettings({
                  ...emailSettings,
                  marketingEmails: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
          </CheckboxGroup>
        </Section>

        {/* --- Push Notifications --- */}
        <Section
          icon="Smartphone"
          title="Push Notifications"
          description="Direct notifications on your device"
        >
          <CheckboxGroup className="space-y-3">
            <Checkbox
              label="Immediate alerts"
              checked={pushSettings.instantDeals}
              onChange={(e) =>
                setPushSettings({
                  ...pushSettings,
                  instantDeals: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
            <Checkbox
              label="Scăderi de preț"
              checked={pushSettings.priceAlerts}
              onChange={(e) =>
                setPushSettings({
                  ...pushSettings,
                  priceAlerts: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
            <Checkbox
              label="Booking reminders"
              checked={pushSettings.bookingReminders}
              onChange={(e) =>
                setPushSettings({
                  ...pushSettings,
                  bookingReminders: e.target.checked,
                })
              }
              disabled={!isEditing}
            />
          </CheckboxGroup>
        </Section>

        {/* --- Preferences --- */}
        <Section
          icon="Settings"
          title="General preferences"
          description="Frequency and quiet hours"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Notification frequency"
              options={frequencyOptions}
              value={preferences.frequency}
              onChange={(v) =>
                setPreferences({ ...preferences, frequency: v })
              }
              disabled={!isEditing}
            />
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={preferences.timezone}
              onChange={(v) => setPreferences({ ...preferences, timezone: v })}
              disabled={!isEditing}
            />
          </div>
        </Section>

        {isEditing && (
          <div className="flex justify-end mt-6 space-x-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} iconName="Save">
              Save
            </Button>
          </div>
        )}
      </div>

      {/* --- Statistici notificări --- */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Notification Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatBox label="This week" value={stats.weekly} color="primary" />
          <StatBox label="Deal alerts" value={stats.deals} color="success" />
          <StatBox label="Price drops" value={stats.drops} color="warning" />
          <StatBox label="Bookings" value={stats.bookings} color="accent" />
        </div>
      </div>
    </div>
  );
};

// 🔹 Subcomponente
const Section = ({ icon, title, description, children }) => (
  <div className="mb-8">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
        <Icon name={icon} size={20} />
      </div>
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const StatBox = ({ label, value, color }) => (
  <div className="text-center p-4 bg-muted rounded-lg">
    <div className={`text-2xl font-bold text-${color}`}>{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default NotificationSettingsTab;
