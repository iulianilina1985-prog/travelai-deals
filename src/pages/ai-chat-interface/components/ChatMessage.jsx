import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

/**
 * ChatMessage – versiune modernă
 * Renders Text AND/OR Card in the same message block (Hybrid support)
 */

const ChatMessage = ({ message, offlineMode = false }) => {
  const isUser = message?.sender === "user";

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

  // ================================
  // ❤️ Saved offers (localStorage)
  // ================================
  const SAVED_KEY = "travelai_saved_offers";
  const [savedMap, setSavedMap] = React.useState({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSavedMap(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const toggleSave = (id) => {
    setSavedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // ================================
  // Date formatting (RO, premium)
  // ================================
  const formatShortRO = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
    } catch {
      return iso;
    }
  };

  const buildPrettyDateRange = (start, end) => {
    const a = formatShortRO(start);
    const b = formatShortRO(end);
    if (a && b) return `${a} – ${b}`;
    if (a) return a;
    return "Date flexibile";
  };

  /* =====================================================
     HELPER: RENDER CARD CONTENT
     Returns the JSX for the card part only (no avatar/wrapper)
     ===================================================== */
  /* =====================================================
     HELPER: RENDER GENERIC CARD
     Used for all types of affiliates (flights, cars, esim, etc.)
     ===================================================== */
  const renderSingleCard = (card, index) => {
    if (!card) return null;

    const providerName = card.provider_meta?.name ?? card.provider ?? "Partener";
    const brandColor = card.provider_meta?.brand_color ?? "#2563eb";
    const imageUrl = card.image_url ?? "/assets/affiliates/default.jpg";
    const saveId = card.id ?? card.cta?.url ?? `card-${index}`;
    const isSaved = !!savedMap[saveId];

    return (
      <div key={index} className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden max-w-lg">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
          {/* IMAGE */}
          <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-black/5 shadow-sm">
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
              <div className="min-w-0">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs border mb-2"
                  style={{ borderColor: `${brandColor}33`, color: brandColor, background: `${brandColor}0D` }}
                >
                  <span className="font-semibold">{providerName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Partener Afiliat</span>
                </span>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 leading-tight">
                  {card.title}
                </h3>
              </div>
              <button
                onClick={() => toggleSave(saveId)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition flex-shrink-0 ${isSaved ? "bg-red-50 border-red-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
              >
                <Icon name="Heart" size={18} color={isSaved ? "#E11D48" : "#94A3B8"} />
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {card.description}
            </p>

            {/* CTA */}
            <div className="mt-4">
              <a href={card.cta?.url} target="_blank" rel="noreferrer" className="block">
                <Button
                  className="w-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition text-sm sm:text-base py-2.5 h-auto font-medium"
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

  const renderCards = () => {
    const cards = message.cards || (message.card ? [message.card] : []);
    if (!cards.length) return null;

    return (
      <div className="flex flex-col gap-3 w-full">
        {cards.map((c, i) => renderSingleCard(c, i))}
      </div>
    );
  };

  /* =====================================================
     MAIN RENDER: HYBRID TEXT + CARD
     ===================================================== */
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`flex max-w-full ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>

        {/* AVATAR */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow flex-shrink-0 ${isUser ? "bg-blue-600" : "bg-gradient-to-br from-primary to-secondary"
            }`}
        >
          <Icon name={isUser ? "User" : "Bot"} size={16} color="white" />
        </div>

        {/* CONTAINER FOR CONTENT + CARD */}
        <div className="flex flex-col w-full max-w-[85%] sm:max-w-xl">

          {/* 1. TEXT BUBBLE (Render if content exists) */}
          {message.content && (
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${isUser
                ? "bg-blue-600 text-white rounded-br-md self-end"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-md self-start"
                }`}
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          )}

          {/* 2. CARDS (Render if cards exist, BELOW text) */}
          {renderCards()}

          {/* TIMESTAMP */}
          <div className={`mt-1 text-xs text-gray-400 ${isUser ? "text-right" : "text-left"}`}>
            {formatTime(message?.timestamp)}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
