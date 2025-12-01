import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Resetare parolă - TravelAI Deals";
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatus("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    if (password !== confirm) {
      setStatus("Parolele nu coincid.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setStatus("A apărut o eroare. Încearcă din nou.");
    } else {
      setStatus("Parola a fost schimbată cu succes!");
      setTimeout(() => navigate("/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card border border-border p-8 rounded-lg shadow-sm w-full max-w-md">

        <h2 className="text-2xl font-semibold mb-4">Resetare parolă</h2>

        <p className="text-muted-foreground mb-6">
          Introdu noua parolă pentru contul tău TravelAI Deals.
        </p>

        {status && (
          <div className="bg-blue-100 border border-blue-300 text-blue-700 p-3 rounded mb-4 text-sm">
            {status}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">

          <div>
            <label className="block mb-1 text-sm font-medium">Parolă nouă</label>
            <input
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Confirmă parola</label>
            <input
              type="password"
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Se actualizează..." : "Resetează parola"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
