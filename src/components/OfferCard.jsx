// src/components/OfferCard.jsx
// Unified Offer Card – used everywhere (Chat, Search, Dashboard)

import React from "react";
import Icon from "./AppIcon";
import Button from "./ui/Button";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";

const MODE_CONFIG = {
    demo: {
        badge: "Demo",
        badgeColor: "bg-yellow-500",
        allowFavorite: false,
        allowClick: false,
    },
    live: {
        badge: null,
        allowFavorite: true,
        allowClick: true,
    },
    generated: {
        badge: "AI",
        badgeColor: "bg-purple-600",
        allowFavorite: true,
        allowClick: true,
    },
};

const OfferCard = ({
    offer,
    mode = "live",
    onViewDetails,
}) => {
    const { user } = useAuth();
    const { favorites, toggleFavorite } = useFavorites();
    const cfg = MODE_CONFIG[mode] ?? MODE_CONFIG.live;

    const imageUrl = offer.image_url || "/assets/images/no_image.png";
    const providerColor = offer.provider_meta?.brand_color || "#2563eb";

    const offerId = offer.id ?? offer.cta?.url;
    const isFavorite = favorites.some(
        (f) => f.offer_id === offerId && f.provider === offer.provider
    );

    // =========================
    // ✈️ FLIGHT META
    // =========================
    const price = offer.price;
    const transfers = offer.transfers;
    const departDate = offer.depart_date || offer.departure_at;

    const formattedDate = departDate
        ? new Date(departDate).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "short",
        })
        : null;

    const flightSubtitle =
        price != null
            ? `€${price} • ${transfers === 0 ? "Direct" : `${transfers} escale`}${formattedDate ? ` • ${formattedDate}` : ""
            }`
            : null;

    // =========================
    // HANDLERS
    // =========================
    const handleFavoriteClick = () => {
        if (!cfg.allowFavorite) return;

        if (!user) {
            alert("Te rog autentifică-te pentru a salva favorite.");
            return;
        }

        toggleFavorite(offer);
    };

    const handleCTA = () => {
        if (!cfg.allowClick) {
            alert("Acesta este un exemplu demonstrativ.");
            return;
        }

        if (offer.cta?.url) {
            window.open(offer.cta.url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">

            {/* IMAGE */}
            <div className="relative h-48 bg-gray-100">
                <img
                    src={imageUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/assets/images/no_image.png")}
                />

                {/* MODE BADGE */}
                {cfg.badge && (
                    <div
                        className={`absolute top-3 left-3 ${cfg.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                    >
                        <Icon name="Info" size={14} />
                        {cfg.badge}
                    </div>
                )}

                {/* ❤️ FAVORITE */}
                {cfg.allowFavorite && (
                    <button
                        onClick={handleFavoriteClick}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${isFavorite
                                ? "bg-rose-500 text-white"
                                : "bg-white/80 text-gray-600 hover:bg-white"
                            }`}
                        title={isFavorite ? "Șterge din favorite" : "Adaugă la favorite"}
                    >
                        <Icon name="Heart" size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
                {/* PROVIDER */}
                <div className="flex items-center gap-2 mb-2">
                    <span
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: providerColor }}
                    >
                        {offer.provider}
                    </span>

                    {offer.type && (
                        <span className="text-xs text-gray-500 capitalize">
                            {offer.type.replace("_", " ")}
                        </span>
                    )}
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {offer.title}
                </h3>

                {/* FLIGHT META or DESCRIPTION */}
                <p className="text-sm text-gray-600 mb-4">
                    {flightSubtitle || offer.description}
                </p>

                {/* CTA */}
                <Button
                    fullWidth
                    iconName="ExternalLink"
                    iconPosition="right"
                    onClick={handleCTA}
                >
                    {price != null ? `Vezi zborul €${price}` : (offer.cta?.label || "Vezi oferta")}
                </Button>

                {/* DETAILS */}
                {onViewDetails && (
                    <button
                        onClick={() => onViewDetails(offer)}
                        className="w-full mt-2 text-sm text-primary hover:underline"
                    >
                        Vezi detalii
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfferCard;
