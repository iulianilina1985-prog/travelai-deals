import React, { useEffect, useState, useCallback } from "react";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ map pentru iconuri
  const iconMap = {
    user_registered: "UserPlus",
    user_login: "LogIn",
    subscription_upgrade: "Crown",
    subscription_cancelled: "XCircle",
    search_created: "Search",
    api_call: "Activity",
    api_error: "AlertTriangle",
    notification_sent: "Bell",
    deal_found: "Gift",
    default: "Dot",
  };

  // ✅ map pentru culori
  const colorMap = {
    user_registered: "bg-success",
    user_login: "bg-muted",
    subscription_upgrade: "bg-primary",
    subscription_cancelled: "bg-destructive",
    search_created: "bg-secondary",
    api_call: "bg-muted",
    api_error: "bg-warning",
    notification_sent: "bg-primary",
    deal_found: "bg-accent",
    default: "bg-muted",
  };

  const timeAgo = (date) => {
    if (!date) return "necunoscut";

    const diff = (Date.now() - new Date(date).getTime()) / 1000; // secunde

    if (diff < 60) return "acum câteva secunde";
    if (diff < 3600) return `${Math.floor(diff / 60)} minute în urmă`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore în urmă`;
    return `${Math.floor(diff / 86400)} zile în urmă`;
  };

  // ✅ Fetch activități reale
  const fetchActivities = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Eroare la extragerea activităților:", error);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((item) => ({
      id: item.id,
      type: item.event_type,
      user: item.user_id || "Sistem",
      action: item.description || "Eveniment înregistrat",
      timestamp: timeAgo(item.created_at),
      icon: iconMap[item.event_type] || iconMap.default,
      iconColor: colorMap[item.event_type] || colorMap.default,
    }));

    setActivities(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <p className="text-muted-foreground">Se încarcă activitățile...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Activitate recentă</h3>
          <button
            onClick={fetchActivities}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Reîncarcă
          </button>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nu există activitate înregistrată momentan.
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.iconColor}`}
                  >
                    <Icon name={activity.icon} size={20} color="white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {activity.user === "Sistem" ? "Sistem" : activity.user}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-1">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
