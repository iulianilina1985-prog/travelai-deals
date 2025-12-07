import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { X } from "lucide-react";

const AuthModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // =============================
  // 🔥 LOGIN CU GOOGLE
  // =============================
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
      alert("❌ Autentificarea cu Google a eșuat. Încearcă din nou.");
    }
  };

  // =============================
  // 🔥 LOGIN / REGISTER CU MAGIC LINK
  // =============================
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl },
      });

      if (error) throw error;

      alert("📩 Verifică emailul pentru linkul de autentificare!");
      onClose();
    } catch (err) {
      console.error("Eroare la trimiterea OTP:", err);
      alert("❌ A apărut o eroare. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex w-[90%] max-w-4xl overflow-hidden relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagine stânga */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="/assets/images/frontimage.png"
            alt="Travel"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Formular dreapta */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Autentificare / Înregistrare
          </h2>

          <p className="text-sm text-gray-500 mb-6 text-center">
            Creează-ți cont în câteva secunde. Fără parolă. Fără bătăi de cap.
          </p>

          {/* 🔥 Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 py-2.5 rounded-lg shadow-sm transition mb-4"
          >
            
            {/* SVG LOGO GOOGLE */}
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.3 0 20-8.7 20-20 0-1.3-.1-2.7-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 16.2 18.8 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 10.2-2 13.9-5.7l-6.4-5.9C29.3 36 26.8 37 24 37c-5.3 0-9.7-3.6-11.3-8.5l-6.5 5C9.3 39.4 16.1 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.6 6.6-8.6 7.3v7.1c7.6-.6 13.9-6.5 15-14.4.3-1.4.3-2.8.3-3.5z"/>
  </svg>
            <span className="text-sm font-medium">Continuă cu Google</span>
          </button>
            
          {/* Separator */}
          <div className="flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 w-1/3" />
            <span className="mx-2 text-gray-400 text-sm">SAU</span>
            <div className="border-t border-gray-300 w-1/3" />
          </div>

          {/* 🔥 Email OTP Login */}
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Introdu adresa ta de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Se trimite linkul..." : "Continuă cu emailul"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            Continuând, ești de acord cu{" "}
            <a href="/terms" className="underline">
              Termenii și condițiile
            </a>{" "}
            și{" "}
            <a href="/privacy" className="underline">
              Politica de confidențialitate
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
