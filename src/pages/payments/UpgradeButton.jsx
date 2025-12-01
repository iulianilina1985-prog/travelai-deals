import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

const UpgradeButton = ({ planName }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    // 1. Luăm tokenul userului
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    const token = sessionData?.session?.access_token;

    if (sessionError || !token) {
      alert("Trebuie să te loghezi!");
      setLoading(false);
      return;
    }

    // 2. Trimitem request către funcția Supabase
    const res = await fetch(
      "https://zgswdnwqvpeherfmjika.supabase.co/functions/v1/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planName }),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      console.error("Checkout error:", json);
      alert("A apărut o eroare la procesarea plății.");
      setLoading(false);
      return;
    }

    // 3. Redirect către Stripe Checkout
    window.location.href = json.url;
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      {loading ? "Se încarcă..." : `Upgrade → ${planName}`}
    </button>
  );
};

export default UpgradeButton;
