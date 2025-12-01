import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { X } from "lucide-react";

const AuthModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/ai-chat-interface`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl },
      });

      if (error) throw error;

      alert("✅ Verifică emailul pentru linkul de autentificare!");
      onClose();
    } catch (err) {
      console.error("Eroare la login:", err);
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
            Introdu emailul tău. Vom trimite un link magic pentru autentificare.
          </p>

          <button
            onClick={() => alert("Google Login va fi disponibil în curând 🚀")}
            className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 mb-4"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            Continuă cu Google
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 w-1/3" />
            <span className="mx-2 text-gray-400 text-sm">SAU</span>
            <div className="border-t border-gray-300 w-1/3" />
          </div>

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
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {loading ? "Se trimite linkul..." : "Continuă"}
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
