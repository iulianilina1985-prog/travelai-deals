import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useFavorites } from "../../../contexts/FavoritesContext";

/**
 * ChatMessage
 * - afișează mesaj text + carduri
 * - ❤️ conectat la Supabase prin FavoritesContext
 */
const ChatMessage = ({ message }) => {
  const isUser = message?.sender === "user";
  const { favorites, toggleFavorite } = useFavorites();

  /* =======================
     TIME FORMAT
  ======================= */
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  /* =======================
     CARDS
  ======================= */
  const cards = message.cards || (message.card ? [message.card] : []);

  const renderSingleCard = (card, index) => {
    if (!card) return null;

    const providerName = card.provider_meta?.name ?? card.provider ?? "Partener";
    const brandColor = card.provider_meta?.brand_color ?? "#2563eb";
    const imageUrl = card.image_url ?? "/assets/affiliates/default.jpg";
    const offerId = card.id ?? card.cta?.url;

    const isSaved = favorites.some(
      (f) => f.offer_id === offerId && f.provider === card.provider
    );

    const handleShare = () => {
      const url = card.cta?.url || window.location.href;
      const text = `🔥 Oferta TravelAI\n${card.title}\n${url}`;

      if (navigator.share) {
        navigator.share({
          title: card.title,
          text,
          url,
        });
      } else {
        navigator.clipboard.writeText(text);
        alert("Link copiat 📋");
      }
    };

    return (
      <div
        key={index}
        className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden max-w-lg"
      >
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          {/* IMAGE */}
          <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/assets/images/no_image.png")}
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs border mb-2"
                  style={{
                    color: brandColor,
                    borderColor: `${brandColor}33`,
                    background: `${brandColor}0D`,
                  }}
                >
                  {providerName}
                </span>

                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                {/* ❤️ FAVORITE */}
                <button
                  onClick={() => toggleFavorite(card)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center ${isSaved
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200"
                    }`}
                >
                  <Icon
                    name="Heart"
                    size={18}
                    color={isSaved ? "#E11D48" : "#94A3B8"}
                  />
                </button>

                {/* 📤 SHARE */}
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full border flex items-center justify-center bg-white border-gray-200 hover:bg-gray-50"
                >
                  <Icon name="Share2" size={18} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {card.description}
            </p>

            <div className="mt-4">
              <a href={card.cta?.url} target="_blank" rel="noreferrer">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  style={{ backgroundColor: brandColor }}
                >
                  <Icon name="ExternalLink" size={16} />
                  {card.cta?.label ?? "Vezi detalii"}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };


  /* =======================
     RENDER
  ======================= */
  return (
    <div
      id={`msg-${message.id}`}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 scroll-mt-24`}
    >
      <div className={`flex gap-3 max-w-full ${isUser ? "flex-row-reverse" : ""}`}>
        {/* AVATAR */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${isUser
            ? "bg-blue-600"
            : "bg-gradient-to-br from-primary to-secondary"
            }`}
        >
          <Icon name={isUser ? "User" : "Bot"} size={16} color="white" />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col w-full max-w-[85%] sm:max-w-xl">
          {message.content && (
            <div
              className={`px-4 py-3 rounded-2xl whitespace-pre-wrap ${isUser
                ? "bg-blue-600 text-white self-end rounded-br-md"
                : "bg-white border text-gray-800 self-start rounded-bl-md"
                }`}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          )}

          {cards.map((c, i) => renderSingleCard(c, i))}

          <div
            className={`mt-1 text-xs text-gray-400 ${isUser ? "text-right" : "text-left"
              }`}
          >
            {formatTime(message?.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
