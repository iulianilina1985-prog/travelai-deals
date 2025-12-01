import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { supabase } from "../../../lib/supabase";

const RevenueChart = () => {
  const [chartType, setChartType] = useState("bar");
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalRevenue: 0,
    totalSubscriptions: 0,
    totalCommissions: 0,
  });

  const fetchRevenue = async () => {
    setLoading(true);

    // ❗ AICI era problema — lipsea type
    const { data, error } = await supabase
      .from("billing_history")
      .select("amount, payment_date, type");

    if (error) {
      console.error("Eroare la extragerea veniturilor:", error);
      setLoading(false);
      return;
    }

    // Grupare pe luni (REVENUE TOTAL pentru chart)
    const grouped = {};
    data?.forEach((item) => {
      const d = new Date(item.payment_date);
      const key = d.toLocaleString("ro-RO", { month: "short" });
      grouped[key] = (grouped[key] || 0) + (item.amount || 0);
    });

    const chartFormatted = Object.entries(grouped).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    // 🔥 TOTAL VENIT REAL
    const totalRevenue =
      data?.reduce((acc, x) => acc + (x.amount || 0), 0) || 0;

    // 🔥 TOTAL ABONAMENTE (doar dacă ai type="subscription")
    const totalSubscriptions =
      data
        ?.filter((x) => x.type === "subscription")
        .reduce((acc, x) => acc + (x.amount || 0), 0) || 0;

    setTotals({
      totalRevenue,
      totalSubscriptions,
      totalCommissions: 0,
    });

    setRevenueData(chartFormatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: €{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-card">
        <p className="text-muted-foreground">Se încarcă datele...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Analiză venituri
            </h3>
            <p className="text-sm text-muted-foreground">
              Evoluția veniturilor reale pe lună
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              iconName="BarChart3"
            >
              Bară
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
              iconName="TrendingUp"
            >
              Linie
            </Button>
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Carduri sumar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Venit total</p>
            <p className="text-2xl font-bold text-foreground">
              €{totals.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Abonamente</p>
            <p className="text-2xl font-bold text-foreground">
              €{totals.totalSubscriptions.toLocaleString()}
            </p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Comisioane</p>
            <p className="text-2xl font-bold text-foreground">€0</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80" aria-label="Revenue Analytics Chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `€${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `€${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--color-primary)",
                    strokeWidth: 2,
                    r: 4,
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
