import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import TrustSignals from "./components/TrustSignals";
import { supabase } from "../../lib/supabase";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // 🔥 controlăm ce formular se afișează
  const [mode, setMode] = useState("login"); // "login" | "forgot"

  // Mesaje primite din redirect (signup etc.)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("signup") === "success") {
      setStatusMessage("Cont creat cu succes! Verifică emailul pentru confirmare.");
    }

    if (params.get("email_confirmed") === "true") {
      setStatusMessage("Email confirmat! Te poți autentifica acum.");
    }

    if (params.get("error") === "email_exists") {
      setStatusMessage("Această adresă de email este deja folosită.");
    }
  }, [location.search]);

  // Redirect dacă userul e deja logat
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) navigate("/ai-chat-interface");
    };
    checkSession();
  }, [navigate]);

  // 🔹 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatusMessage("Email sau parolă incorecte.");
      setLoading(false);
      return;
    }

    navigate("/ai-chat-interface");
    setLoading(false);
  };

  // 🔹 RESETARE PAROLĂ
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setStatusMessage("A apărut o eroare. Încearcă din nou.");
    } else {
      setStatusMessage("Verifică emailul pentru link-ul de resetare.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* LEFT SIDE */}
            <div className="order-2 lg:order-1">

              <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">

                {/* TITLU DINAMIC */}
                <h2 className="text-2xl font-semibold mb-4">
                  {mode === "login" ? "Autentificare" : "Resetare parolă"}
                </h2>

                <p className="text-muted-foreground mb-6">
                  {mode === "login"
                    ? "Intră în cont și începe să explorezi recomandările inteligente."
                    : "Introdu adresa ta de email pentru a primi un link de resetare."}
                </p>

                {/* STATUS MESSAGE */}
                {statusMessage && (
                  <div className="bg-blue-100 border border-blue-300 text-blue-700 text-sm p-3 rounded mb-4">
                    {statusMessage}
                  </div>
                )}

                {/* 🔥 LOGIN FORM */}
                {mode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                        placeholder="ex: utilizator@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Parolă</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    {/* Ai uitat parola? */}
                    <div className="flex justify-end -mt-2">
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-primary text-sm hover:underline"
                      >
                        Ai uitat parola?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {loading ? "Se conectează..." : "Conectează-te"}
                    </button>

                    <button
                      type="button"
                      onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
                      className="w-full flex items-center justify-center gap-3 border border-border bg-white hover:bg-gray-50 py-2.5 rounded-lg shadow-sm transition mt-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.3 0 20-8.7 20-20 0-1.3-.1-2.7-.4-3.5z"/>
                      </svg>
                      Continuă cu Google
                    </button>
                  </form>
                )}

                {/* 🔥 RESET PASSWORD FORM */}
                {mode === "forgot" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">

                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary"
                        placeholder="Introdu adresa ta de email"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      {loading ? "Se trimite..." : "Trimite link resetare"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="w-full text-primary text-sm mt-2 hover:underline"
                    >
                      ← Înapoi la autentificare
                    </button>
                  </form>
                )}

                {/* Sign up link */}
                {mode === "login" && (
                  <div className="mt-4 text-sm text-center">
                    Nu ai cont?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                      Creează unul
                    </Link>
                  </div>
                )}

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="order-1 lg:order-2">
              <TrustSignals />
            </div>

          </div>
          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TravelAI Deals. Toate drepturile rezervate.
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
