import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

const MAX_EVENTS = 5000;
const DAYS_LOOKBACK = 30;
const DAYS_CHART = 14;
const RECENT_LIMIT = 20;

function floorToDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatDayLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildDailySeries(events, days) {
  const now = new Date();
  const map = new Map();

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    map.set(floorToDay(d).toISOString(), 0);
  }

  events.forEach((e) => {
    const key = floorToDay(new Date(e.created_at)).toISOString();
    if (map.has(key)) map.set(key, map.get(key) + 1);
  });

  const series = [];
  map.forEach((value, key) => {
    const d = new Date(key);
    series.push({ label: formatDayLabel(d), calls: value });
  });

  return series;
}

function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const AiChatUsage = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - DAYS_LOOKBACK);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("id, created_at, user_id, properties")
      .eq("event_type", "ai_chat")
      .gte("created_at", cutoff.toISOString())
      .order("created_at", { ascending: true })
      .limit(MAX_EVENTS);

    if (error) {
      console.error("Error fetching ai-chat analytics:", error);
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

  const summary = useMemo(() => {
    const uniqueUsers = new Set();
    let success = 0;
    let error = 0;
    let durationTotal = 0;
    let durationCount = 0;

    const sources = new Map();
    const paths = new Map();

    events.forEach((e) => {
      if (e.user_id) uniqueUsers.add(e.user_id);
      const ok = e.properties?.success;
      if (ok === false) error += 1;
      else success += 1;

      const duration = safeNumber(e.properties?.duration_ms);
      if (duration !== null) {
        durationTotal += duration;
        durationCount += 1;
      }

      const src = String(e.properties?.source || "unknown");
      sources.set(src, (sources.get(src) || 0) + 1);

      const path = String(e.properties?.client_path || "unknown");
      paths.set(path, (paths.get(path) || 0) + 1);
    });

    const topSources = Array.from(sources.entries())
      .map(([name, calls]) => ({ name, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 6);

    const topPaths = Array.from(paths.entries())
      .map(([path, calls]) => ({ path, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 6);

    return {
      total: events.length,
      uniqueUsers: uniqueUsers.size,
      success,
      error,
      avgDurationMs: durationCount ? Math.round(durationTotal / durationCount) : null,
      topSources,
      topPaths,
      recent: [...events]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, RECENT_LIMIT),
    };
  }, [events]);

  const chartData = useMemo(() => buildDailySeries(events, DAYS_CHART), [events]);

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Chat usage</h3>
            <p className="text-sm text-muted-foreground">
              Calls in the last {DAYS_LOOKBACK} days
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw" onClick={fetchEvents}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-muted-foreground">Loading AI usage...</p>
        ) : summary.total === 0 ? (
          <p className="text-muted-foreground">No ai-chat calls recorded.</p>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Total calls</p>
                <p className="text-2xl font-semibold text-foreground">{summary.total}</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Unique users</p>
                <p className="text-2xl font-semibold text-foreground">{summary.uniqueUsers}</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Success / errors</p>
                <p className="text-2xl font-semibold text-foreground">
                  {summary.success} / {summary.error}
                </p>
              </div>
              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Avg duration</p>
                <p className="text-2xl font-semibold text-foreground">
                  {summary.avgDurationMs === null ? "—" : `${summary.avgDurationMs} ms`}
                </p>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Daily calls</h4>
                <span className="text-xs text-muted-foreground">Last {DAYS_CHART} days</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="calls" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Top sources</h4>
                <div className="space-y-2">
                  {summary.topSources.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon name="Zap" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.calls}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Top pages</h4>
                <div className="space-y-2">
                  {summary.topPaths.map((item) => (
                    <div key={item.path} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{item.path}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.calls}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Recent calls</h4>
                <span className="text-xs text-muted-foreground">Last {RECENT_LIMIT}</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {summary.recent.map((event) => (
                  <div key={event.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-foreground">
                        {event.user_id ? `User ${event.user_id}` : "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(event.properties?.client_path || "unknown")} ·{" "}
                        {String(event.properties?.source || "unknown")}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatUsage;

