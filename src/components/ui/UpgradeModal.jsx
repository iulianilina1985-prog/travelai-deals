// src/components/ui/UpgradeModal.jsx
import React from "react";
import Icon from "../AppIcon";
import Button from "./Button";

const UpgradeModal = ({ visible, onClose }) => {
  if (!visible) return null;

  const PRO_LINK =
    "https://checkout.stripe.com/c/pay/cs_live_a133UpBLyk9RitnGjZoxVvQFkREWVo1psiLPZIfXShE16swDRiCNfIberO#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blppbHNgWjA0Vk5oXERCdFRuYlNUYkJmd3VyaEhcT19ASWxPfXBgPUd8aTRtcGxNT21sZHZMcH12fGtPbm98QVJwX2NfQXFrVH1KNm5jdXdLMkNRcjNTSV1kVUFHdz1BNTVWd1NJXGRiaycpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <Icon name="X" size={20} />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <Icon
            name="Crown"
            size={48}
            className="text-purple-600 mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-foreground">
            Treci la planul PRO
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Acces nelimitat la AI, viteză maximă și recomandări premium.
            Spune adio limitelor și hello vacanțelor perfecte ✈️
          </p>
        </div>

        {/* ONLY PRO PLAN */}
        <div>
          <Button
            size="lg"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-md py-3 flex items-center justify-center gap-2"
            onClick={() => (window.location.href = PRO_LINK)}
          >
            <Icon name="Crown" size={18} />
            PRO – 5 € / lună
          </Button>
        </div>

        <div className="text-center mt-5 text-xs text-gray-500">
          Plăți securizate Stripe · Poți anula oricând
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
