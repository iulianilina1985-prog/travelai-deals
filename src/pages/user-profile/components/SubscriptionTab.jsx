import React, { useState, useEffect, useCallback } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../lib/supabase";
import UpgradeButton from "../../payments/UpgradeButton";
import BillingHistoryCard from "../../subscription-management/components/BillingHistoryCard";

const SubscriptionTab = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [userId, setUserId] = useState(null);

  // ======================================================
  // 🔹 DOWNLOAD INVOICE PDF
  // ======================================================
  const handleDownloadInvoice = async (stripeInvoiceId) => {
    if (!stripeInvoiceId) {
      alert("Factura nu are un ID Stripe valid.");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "get-invoice-pdf",
        {
          body: { invoiceId: stripeInvoiceId },
        }
      );

      if (error) {
        console.error("Eroare PDF:", error);
        alert("Eroare la descărcarea facturii.");
        return;
      }

      const blob = new Blob([data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${stripeInvoiceId}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Eroare la descărcarea facturii:", err);
      alert("Nu s-a putut descărca factura.");
    }
  };

  // ======================================================
  // 🔹 LOAD DATA
  // ======================================================
  const loadData = useCallback(async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    setUserId(user.id);

    // 1) Subscription record
    const { data: subData, error: subErr } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!subData && subErr?.code === "PGRST116") {
      const { data: newSub } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id: user.id,
            plan_name: "Free",
            status: "active",
            price_per_month: 0,
            max_notifications: 2,
          },
        ])
        .select()
        .single();

      setSubscription(newSub);
    } else {
      setSubscription(subData);
    }

    // 2) Billing history
    const { data: bills } = await supabase
      .from("billing_history")
      .select("*")
      .eq("user_id", user.id)
      .order("payment_date", { ascending: false });

    setBillingHistory(bills || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ======================================================
  // 🔹 CANCEL SUBSCRIPTION
  // ======================================================
  const handleCancelSubscription = async () => {
    if (!userId) return;

    if (!confirm("Sigur vrei să anulezi abonamentul?")) return;

    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        plan_name: "Free",
        price_per_month: 0,
        max_notifications: 2,
        current_period_start: null,
        current_period_end: null,
        cancelled_at: new Date(),
      })
      .eq("user_id", userId);

    await loadData();

    alert("Abonamentul a fost anulat.");
  };

  // ======================================================
  // 🔹 AVAILABLE PLANS — ONLY FREE + PRO
  // ======================================================
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      billingCycle: "permanent",
      features: [
        "Interfață AI de bază",
        "Limită zilnică: 5 mesaje AI",
        "Acces la căutarea manuală de oferte",
        "Istoric conversații nelimitat",
      ],
      current: subscription?.plan_name === "Free",
    },
    {
      id: "pro",
      name: "Pro",
      price: 5,
      billingCycle: "lună",
      features: [
        "Conversații AI nelimitate",
        "Fără limită zilnică",
        "Viteză AI prioritară",
        "Recomandări premium",
        "Top oferte actualizate zilnic",
        "Alerte inteligente de prețuri",
        "Itinerarii și planificator AI",
      ],
      current: subscription?.plan_name === "Pro",
      popular: true,
      stripe: true,
    },
  ];

  if (loading)
    return <p className="text-muted-foreground">Se încarcă...</p>;

  // ======================================================
  // 🔹 UI
  // ======================================================
  return (
    <div className="space-y-10">

      {/* Current subscription */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold text-foreground">
            Abonamentul curent
          </h3>

          <div
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              subscription?.status === "active"
                ? "bg-success text-success-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {subscription?.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Plan */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Crown" size={20} className="text-primary" />
              <span className="font-medium">Plan</span>
            </div>

            <div className="text-xl font-bold">
              {subscription?.plan_name}
            </div>
            <div className="text-sm text-muted-foreground">
              €{subscription?.price_per_month}/lună
            </div>
          </div>

          {/* Period */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Calendar" size={20} className="text-primary" />
              <span>Perioadă</span>
            </div>

            <div className="text-xl font-bold">
              {subscription?.current_period_start
                ? new Date(
                    subscription.current_period_start
                  ).toLocaleDateString()
                : "-"}
            </div>

            <div className="text-sm text-muted-foreground">
              până la{" "}
              {subscription?.current_period_end
                ? new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()
                : "∞"}
            </div>
          </div>

          {/* Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <span>Statut</span>
            </div>

            <div className="text-xl font-bold">{subscription?.status}</div>
            <div className="text-sm text-muted-foreground">
              actualizat
            </div>
          </div>

          {/* AI Limit */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={20} className="text-primary" />
              <span>Limiă AI</span>
            </div>

            <div className="text-xl font-bold">
              {subscription?.plan_name === "Pro"
                ? "Nelimitat"
                : "5 mesaje / zi"}
            </div>

            <div className="text-sm text-muted-foreground">
              {subscription?.plan_name === "Pro"
                ? "Acces complet"
                : "Se resetează la miezul nopții"}
            </div>
          </div>

        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            iconName="X"
            onClick={handleCancelSubscription}
          >
            Anulează abonamentul
          </Button>
        </div>
      </div>

      {/* Available plans – PREMIUM UI */}
      <div className="bg-card border border-border rounded-lg p-10">
        <h3 className="text-2xl font-bold mb-10 text-center">
          Planuri disponibile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border rounded-2xl p-8 transition shadow-sm hover:shadow-md ${
                plan.current
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white"
              } ${plan.popular ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs">
                  POPULAR
                </span>
              )}

              <h4 className="text-2xl font-bold mb-1">{plan.name}</h4>
              <p className="text-4xl font-extrabold mb-1 text-primary">
                €{plan.price}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                /{plan.billingCycle}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Icon name="Check" size={18} className="text-green-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <Button fullWidth variant="outline" disabled>
                  Planul actual
                </Button>
              ) : plan.stripe ? (
                <UpgradeButton planName={plan.name} />
              ) : (
                <Button fullWidth disabled>
                  Gratuit
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing history */}
      <BillingHistoryCard
        billingHistory={billingHistory}
        onDownloadInvoice={handleDownloadInvoice}
      />
    </div>
  );
};

export default SubscriptionTab;
