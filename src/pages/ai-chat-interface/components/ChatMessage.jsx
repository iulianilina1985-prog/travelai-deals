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
  const renderCardContent = () => {
    const card = message.card;
    if (!card) return null;

    // --- 1. FLIGHT CARD ---
    if (card.type === "flight") {
      const fromLabel = card.from ?? card.destination?.from ?? "București";
      const toLabel = card.to ?? card.destination?.to ?? "Paris";
      const providerName = card.provider_meta?.name ?? card.provider ?? "Provider";
      const brandColor = card.provider_meta?.brand_color ?? "#2563eb";
      const start = card.dates?.start ?? card.meta?.depart_date ?? null;
      const end = card.dates?.end ?? card.meta?.return_date ?? null;
      const dateLabelPretty = buildPrettyDateRange(start, end);
      const imageUrl = card.image_url ?? "/assets/flight/flight.jpg";
      const saveId = card.id ?? card.cta?.url ?? `flight|${providerName}|${fromLabel}|${toLabel}|${start ?? ""}`;
      const isSaved = !!savedMap[saveId];
      const isRoundTrip = !!end;
      const passengers = card.passengers ?? card.meta?.passengers ?? card.meta?.adults ?? null;

      return (
        <div className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden max-w-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
            {/* IMAGE */}
            <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-black/5 shadow-sm">
              <img
                src={imageUrl}
                alt={`${fromLabel} - ${toLabel}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs border"
                      style={{ borderColor: `${brandColor}33`, color: brandColor, background: `${brandColor}0D` }}
                    >
                      <span className="font-semibold">{providerName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">Afiliere</span>
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500">{dateLabelPretty}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-base sm:text-lg text-gray-900 truncate">
                    ✈️ {fromLabel} → {toLabel}
                  </h3>
                </div>
                <button
                  onClick={() => toggleSave(saveId)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition flex-shrink-0 ${isSaved ? "bg-red-50 border-red-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}
                >
                  <Icon name="Heart" size={18} color={isSaved ? "#E11D48" : "#94A3B8"} />
                </button>
              </div>

              {/* INFO ROW */}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Icon name="Repeat" size={14} />
                  <span>{isRoundTrip ? "Dus-întors" : "One-way"}</span>
                </div>
                {passengers && ( // Ensure passengers is rendered conditionally
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={14} />
                    <span>{passengers} adulți</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Icon name="Euro" size={14} />
                  <span>{card.priceRange || card.price || "Prețuri disponibile"}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4">
                <a href={card.cta?.url} target="_blank" rel="noreferrer" className="block">
                  <Button
                    className="w-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition text-sm sm:text-base"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Icon name="ExternalLink" size={16} />
                    {card.cta?.label ?? "Vezi oferta"}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- 2. ACTIVITY CARD (KLOOK) ---
    if (card.type === "activity") {
      const providerName = card.provider_meta?.name ?? "Klook";
      const brandColor = card.provider_meta?.brand_color ?? "#ff5b00";
      const city = card.city ?? "destinație";
      const imageUrl = card.image_url ?? "/assets/activities/klook.jpg";
      const saveId = card.id ?? card.cta?.url ?? `klook|${city}`;
      const isSaved = !!savedMap[saveId];

      return (
        <div className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden max-w-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
            {/* IMAGE */}
            <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-black/5 shadow-sm">
              <img src={imageUrl} alt={`Activități ${city}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border" style={{ borderColor: `${brandColor}33`, color: brandColor, background: `${brandColor}0D` }}>
                    <strong>{providerName}</strong> • Afiliere
                  </span>
                  <h3 className="mt-2 font-semibold text-lg text-gray-900">🎟️ Activități în {city}</h3>
                  <p className="mt-1 text-sm text-gray-600">Tururi, atracții și bilete</p>
                </div>
                <button onClick={() => toggleSave(saveId)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${isSaved ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
                  <Icon name="Heart" size={18} color={isSaved ? "#E11D48" : "#94A3B8"} />
                </button>
              </div>
              {/* CTA */}
              <div className="mt-4">
                <a href={card.cta?.url} target="_blank" rel="noreferrer">
                  <Button className="w-full flex items-center justify-center gap-2" style={{ backgroundColor: brandColor }}>
                    <Icon name="ExternalLink" size={16} />
                    {card.cta?.label ?? "Vezi activitățile"}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- 3. CAR RENTAL CARD (LOCALRENT) ---
    if (card.type === "car_rental") {
      const providerName = card.provider_meta?.name ?? "Localrent";
      const brandColor = card.provider_meta?.brand_color ?? "#00A859";
      const location = card.location ?? "destinație";
      const imageUrl = card.image_url ?? "/assets/cars/localrent.jpg";
      const saveId = card.id ?? card.cta?.url ?? `localrent|${location}`;
      const isSaved = !!savedMap[saveId];

      return (
        <div className="mt-3 bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden max-w-lg">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
            {/* IMAGE */}
            <div className="w-full sm:w-28 sm:h-28 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-black/5 shadow-sm">
              <img src={imageUrl} alt={`Auto in ${location}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
            {/* CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border" style={{ borderColor: `${brandColor}33`, color: brandColor, background: `${brandColor}0D` }}>
                    <strong>{providerName}</strong> • Afiliere
                  </span>
                  <h3 className="mt-2 font-semibold text-lg text-gray-900">🚗 Închirieri Auto {location}</h3>
                  <p className="mt-1 text-sm text-gray-600">Oferte locale verificate</p>
                </div>
                <button onClick={() => toggleSave(saveId)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${isSaved ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
                  <Icon name="Heart" size={18} color={isSaved ? "#E11D48" : "#94A3B8"} />
                </button>
              </div>
              {/* CTA */}
              <div className="mt-4">
                <a href={card.cta?.url} target="_blank" rel="noreferrer">
                  <Button className="w-full flex items-center justify-center gap-2" style={{ backgroundColor: brandColor }}>
                    <Icon name="ExternalLink" size={16} />
                    {card.cta?.label ?? "Vezi ofertele"}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
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

          {/* 2. CARD (Render if card exists, BELOW text) */}
          {message.card && renderCardContent()}

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
