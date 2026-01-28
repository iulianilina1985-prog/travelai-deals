import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";

const RANGE_CONFIG = {
  day: { label: "Day", hours: 24 },
  week: { label: "Week", days: 7 },
  month: { label: "Month", days: 30 },
  year: { label: "Year", months: 12 },
};

function getCountryName(props) {
  if (!props || typeof props !== "object") return "Unknown";
  return (
    props.country ||
    props.country_name ||
    props.countryCode ||
    props.country_code ||
    "Unknown"
  );
}

function floorToHour(d) {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  return x;
}

function floorToDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function floorToMonth(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatLabel(date, range) {
  if (range === "day") {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  if (range === "year") {
    return date.toLocaleString("en-US", { month: "short" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildTimeSeries(events, range) {
  const now = new Date();
  const buckets = [];
  const map = new Map();

  if (range === "day") {
    for (let i = RANGE_CONFIG.day.hours - 1; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setHours(now.getHours() - i);
      const key = floorToHour(d).toISOString();
      map.set(key, 0);
    }
    events.forEach((e) => {
      const key = floorToHour(new Date(e.created_at)).toISOString();
      if (map.has(key)) map.set(key, map.get(key) + 1);
    });
    map.forEach((value, key) => {
      const d = new Date(key);
      buckets.push({ label: formatLabel(d, range), visits: value });
    });
    return buckets;
  }

  if (range === "year") {
    for (let i = RANGE_CONFIG.year.months - 1; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i, 1);
      const key = floorToMonth(d).toISOString();
      map.set(key, 0);
    }
    events.forEach((e) => {
      const key = floorToMonth(new Date(e.created_at)).toISOString();
      if (map.has(key)) map.set(key, map.get(key) + 1);
    });
    map.forEach((value, key) => {
      const d = new Date(key);
      buckets.push({ label: formatLabel(d, range), visits: value });
    });
    return buckets;
  }

  const days = range === "week" ? RANGE_CONFIG.week.days : RANGE_CONFIG.month.days;
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = floorToDay(d).toISOString();
    map.set(key, 0);
  }
  events.forEach((e) => {
    const key = floorToDay(new Date(e.created_at)).toISOString();
    if (map.has(key)) map.set(key, map.get(key) + 1);
  });
  map.forEach((value, key) => {
    const d = new Date(key);
    buckets.push({ label: formatLabel(d, range), visits: value });
  });
  return buckets;
}

function buildCountrySeries(events) {
  const counts = new Map();
  events.forEach((e) => {
    const country = getCountryName(e.properties);
    counts.set(country, (counts.get(country) || 0) + 1);
  });

  const data = Array.from(counts.entries())
    .map(([country, visits]) => ({ country, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 8);

  return data.length > 0 ? data : [{ country: "Unknown", visits: 0 }];
}

const TrafficChart = () => {
  const [range, setRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    setLoading(true);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 365);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("created_at, properties, event_type")
      .gte("created_at", cutoff.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching traffic events:", error);
      setEvents([]);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filtered = useMemo(() => {
    if (!events.length) return [];
    const hasPageView = events.some((e) =>
      String(e.event_type || "").toLowerCase().includes("page")
    );
    const base = hasPageView
      ? events.filter((e) => String(e.event_type || "").toLowerCase().includes("page"))
      : events;
    const now = new Date();

    if (range === "day") {
      const cutoff = new Date(now);
      cutoff.setHours(now.getHours() - 24);
      return base.filter((e) => new Date(e.created_at) >= cutoff);
    }

    if (range === "week") {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 7);
      return base.filter((e) => new Date(e.created_at) >= cutoff);
    }

    if (range === "month") {
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - 30);
      return base.filter((e) => new Date(e.created_at) >= cutoff);
    }

    const cutoff = new Date(now);
    cutoff.setFullYear(now.getFullYear() - 1);
    return base.filter((e) => new Date(e.created_at) >= cutoff);
  }, [events, range]);

  const trafficSeries = useMemo(() => buildTimeSeries(filtered, range), [filtered, range]);
  const countrySeries = useMemo(() => buildCountrySeries(filtered), [filtered]);

  const totalVisits = filtered.length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Traffic overview</h3>
            <p className="text-sm text-muted-foreground">
              Visits grouped by time range and country distribution
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.keys(RANGE_CONFIG).map((key) => (
              <Button
                key={key}
                variant={range === key ? "default" : "outline"}
                size="sm"
                onClick={() => setRange(key)}
              >
                {RANGE_CONFIG[key].label}
              </Button>
            ))}
            <Button variant="outline" size="sm" iconName="RefreshCw" onClick={fetchEvents}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-muted-foreground">Loading traffic data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Total visits</p>
                <p className="text-2xl font-bold text-foreground">{totalVisits.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Icon name="Activity" size={14} />
                  <span>Based on analytics_events</span>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Top country</p>
                <p className="text-2xl font-bold text-foreground">
                  {countrySeries[0]?.country || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {countrySeries[0]?.visits?.toLocaleString() || 0} visits
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Tracked countries</p>
                <p className="text-2xl font-bold text-foreground">{countrySeries.length}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Country data relies on event properties
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <div className="h-64 sm:h-72" aria-label="Traffic Chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="label" stroke="var(--color-muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="visits"
                        stroke="var(--color-primary)"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "var(--color-primary)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="xl:col-span-1">
                <div className="h-64 sm:h-72" aria-label="Country Breakdown">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countrySeries} layout="vertical" margin={{ left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                      <YAxis
                        dataKey="country"
                        type="category"
                        stroke="var(--color-muted-foreground)"
                        fontSize={12}
                        width={90}
                      />
                      <Tooltip />
                      <Bar dataKey="visits" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrafficChart;
