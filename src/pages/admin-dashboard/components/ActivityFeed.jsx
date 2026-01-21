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
    if (!date) return "unknown";

    const diff = (Date.now() - new Date(date).getTime()) / 1000; // seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // ✅ Fetch real activities
  const fetchActivities = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((item) => ({
      id: item.id,
      type: item.event_type,
      user: item.user_id || "System",
      action: item.description || "Event recorded",
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
        <p className="text-muted-foreground">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent activity</h3>
          <button
            onClick={fetchActivities}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Reload
          </button>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            There is no activity recorded at the moment.
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
                      {activity.user === "System" ? "System" : activity.user}
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
