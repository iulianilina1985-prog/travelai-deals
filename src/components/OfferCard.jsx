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

/* =========================
   IMAGE RESOLVER
========================= */
const resolveImage = (img) => {
    if (!img) return "/assets/images/no_image.png";

    // url complet
    if (img.startsWith("http")) return img;

    // deja absolut
    if (img.startsWith("/")) return img;

    // ex: assets/flight/flight.jpg
    return "/" + img;
};

const OfferCard = ({ offer, mode = "live", onViewDetails }) => {
    const { user } = useAuth();
    const { favorites, toggleFavorite } = useFavorites();

    const cfg = MODE_CONFIG[mode] || MODE_CONFIG.live;

    /* =========================
       NORMALIZARE OFERTĂ
    ========================= */
    const offerId = offer.offer_id || offer.id || offer.cta?.url;

    const image = offer.image || offer.image_url;
    const link = offer.link || offer.cta?.url;
    const price = offer.price ?? null;
    const transfers = offer.transfers ?? null;
    const departDate = offer.depart_date || offer.departure_at;

    const provider = offer.provider || "Partner";

    const providerColor =
        offer.provider_meta?.brand_color ||
        offer.provider_color ||
        "#2563eb";

    const isFavorite = favorites.some(
        (f) => f.offer_id === offerId && f.provider === provider
    );

    /* =========================
       FLIGHT META
    ========================= */
    const formattedDate = departDate
        ? new Date(departDate).toLocaleDateString("ro-RO", {
            day: "2-digit",
            month: "short",
        })
        : null;

    const flightSubtitle =
        price != null
            ? `De la €${price} • ${transfers === 0 ? "Direct" : `${transfers} escale`
            }${formattedDate ? ` • ${formattedDate}` : ""}`
            : null;

    /* =========================
       HANDLERS
    ========================= */
    const handleFavorite = () => {
        if (!cfg.allowFavorite) return;

        if (!user) {
            alert("Te rog autentifică-te pentru a salva favorite.");
            return;
        }

        const normalized = {
            offer_id: offerId,
            provider,
            title: offer.title,
            image: image,
            price: price,
            link: link,
            raw: offer, // păstrăm originalul
        };

        toggleFavorite(normalized);
    };

    const handleCTA = () => {
        if (!cfg.allowClick) {
            alert("Acesta este un exemplu demonstrativ.");
            return;
        }

        if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    };

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">

            {/* IMAGE */}
            <div className="relative h-48 bg-gray-100">
                <img
                    src={resolveImage(image)}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "/assets/images/no_image.png";
                    }}
                />

                {/* BADGE */}
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
                        onClick={handleFavorite}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${isFavorite
                                ? "bg-rose-500 text-white"
                                : "bg-white/80 text-gray-600 hover:bg-white"
                            }`}
                        title={isFavorite ? "Șterge din favorite" : "Adaugă la favorite"}
                    >
                        <Icon
                            name="Heart"
                            size={18}
                            fill={isFavorite ? "currentColor" : "none"}
                        />
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
                        {provider}
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

                {/* META */}
                <p className="text-sm text-gray-600 mb-4">
                    {flightSubtitle || offer.description}
                </p>

                {/* CTA */}
                <Button fullWidth iconName="ExternalLink" iconPosition="right" onClick={handleCTA}>
                    {price != null ? `Vezi oferta €${price}` : offer.cta?.label || "Vezi oferta"}
                </Button>

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
