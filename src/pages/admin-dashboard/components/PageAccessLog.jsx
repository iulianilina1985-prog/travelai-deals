import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

const MAX_EVENTS = 5000;
const DAYS_LOOKBACK = 30;
const RECENT_LIMIT = 20;

const formatDateTime = (value) => {
  if (!value) return "Unknown";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPath = (props) =>
  props?.path || props?.pathname || props?.url || props?.page || "Unknown";

const PageAccessLog = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - DAYS_LOOKBACK);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("id, created_at, user_id, event_type, event_name, properties")
      .eq("event_type", "page_view")
      .gte("created_at", cutoff.toISOString())
      .order("created_at", { ascending: false })
      .limit(MAX_EVENTS);

    if (error) {
      console.error("Error fetching page views:", error);
      setEvents([]);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const { topPages, recentViews } = useMemo(() => {
    const counts = new Map();
    events.forEach((event) => {
      const path = getPath(event.properties);
      counts.set(path, (counts.get(path) || 0) + 1);
    });

    const top = Array.from(counts.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    return {
      topPages: top,
      recentViews: events.slice(0, RECENT_LIMIT),
    };
  }, [events]);

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Page access</h3>
            <p className="text-sm text-muted-foreground">
              Latest page views and most visited routes (last {DAYS_LOOKBACK} days)
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw" onClick={fetchEvents}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-muted-foreground">Loading page views...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-foreground">Top pages</h4>
                <span className="text-xs text-muted-foreground">
                  {events.length} events
                </span>
              </div>
              {topPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No page views recorded.</p>
              ) : (
                <div className="space-y-3">
                  {topPages.map((item) => (
                    <div
                      key={item.path}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{item.path}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item.views}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-foreground">Recent views</h4>
                <span className="text-xs text-muted-foreground">Last {RECENT_LIMIT}</span>
              </div>
              {recentViews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentViews.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm text-foreground">
                          {getPath(event.properties)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.user_id ? `User ${event.user_id}` : "Anonymous"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(event.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAccessLog;
