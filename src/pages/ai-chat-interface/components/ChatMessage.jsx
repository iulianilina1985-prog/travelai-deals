import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

/**
 * ChatMessage – versiune modernă
 * suport special pentru OFFER CARD (flight snapshot)
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

  // =====================================================
  // ✈️ FLIGHT OFFER CARD (Responsive Booking style)
  // =====================================================
  if (message?.type === "offer" && message?.card?.type === "flight") {
    const card = message.card;

    const fromLabel = card.from ?? card.destination?.from ?? "București";
    const toLabel = card.to ?? card.destination?.to ?? "Paris";

    const providerName = card.provider_meta?.name ?? card.provider ?? "Provider";
    const brandColor = card.provider_meta?.brand_color ?? "#2563eb";

    const start = card.dates?.start ?? card.meta?.depart_date ?? null;
    const end = card.dates?.end ?? card.meta?.return_date ?? null;
    const dateLabelPretty = buildPrettyDateRange(start, end);

    const imageUrl = card.image_url ?? "/assets/flight/flight.jpg";

    const saveId =
      card.id ??
      card.cta?.url ??
      `flight|${providerName}|${fromLabel}|${toLabel}|${start ?? ""}|${end ?? ""}`;

    const isSaved = !!savedMap[saveId];

    const isRoundTrip = !!end;
    const passengers =
      card.passengers ?? card.meta?.passengers ?? card.meta?.adults ?? null;

    return (
      <div className="flex justify-start mb-6">
        <div className="flex w-full max-w-full sm:max-w-[92%] items-start gap-3">
          {/* Avatar AI */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow flex-shrink-0">
            <Icon name="Plane" size={16} color="white" />
          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden">
            {/* Layout: column on mobile, row on >=sm */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
              {/* IMAGE */}
              <div className="w-full sm:w-28 sm:h-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-black/5 shadow-sm">
                <img
                  src={imageUrl}
                  alt={`${fromLabel} - ${toLabel}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Provider pill */}
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs border"
                        style={{
                          borderColor: `${brandColor}33`,
                          color: brandColor,
                          background: `${brandColor}0D`,
                        }}
                      >
                        <span className="font-semibold">{providerName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">Afiliere</span>
                      </span>

                      {/* Date */}
                      <span className="text-[11px] sm:text-xs text-gray-500">
                        {dateLabelPretty}
                      </span>
                    </div>

                    <h3 className="mt-2 font-semibold text-base sm:text-lg text-gray-900 truncate">
                      ✈️ {fromLabel} → {toLabel}
                    </h3>
                  </div>

                  {/* ❤️ Save */}
                  <button
                    onClick={() => toggleSave(saveId)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition flex-shrink-0 ${
                      isSaved
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    title={isSaved ? "Salvat" : "Salvează"}
                    aria-label={isSaved ? "Salvat" : "Salvează"}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isSaved ? "#E11D48" : "none"}
                      stroke={isSaved ? "#E11D48" : "#94A3B8"}
                      strokeWidth="2"
                    >
                      <path d="M20.8 4.6c-1.4-1.4-3.7-1.4-5.1 0L12 8.3 8.3 4.6c-1.4-1.4-3.7-1.4-5.1 0s-1.4 3.7 0 5.1l3.7 3.7L12 20.5l5.1-7.1 3.7-3.7c1.4-1.4 1.4-3.7 0-5.1z" />
                    </svg>
                  </button>
                </div>

                {/* AIRLINES (hide on mobile if it clutters) */}
                {Array.isArray(card.airlines) && card.airlines.length > 0 ? (
                  <div className="mt-3 hidden sm:flex items-center gap-3 flex-wrap">
                    {card.airlines.map((airline) => (
                      <img
                        key={airline}
                        src={`/assets/airlines/${airline}.svg`}
                        alt={airline}
                        className="h-6 object-contain opacity-90"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                ) : null}

                {/* INFO ROW (compact on mobile) */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Icon name="Repeat" size={14} />
                    <span>{isRoundTrip ? "Dus-întors" : "One-way"}</span>
                  </div>

                  {passengers ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={14} />
                      <span>{passengers} adulți</span>
                    </div>
                  ) : null}

                  {card.priceRange ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Euro" size={14} />
                      <span>Prețuri de la {card.priceRange}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon name="Euro" size={14} />
                      <span>Prețuri disponibile</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Icon name="Briefcase" size={14} />
                    <span>Bagaj opțional</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4">
                  <a
                    href={card.cta?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <Button
                      className="w-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition text-sm sm:text-base"
                      style={{ backgroundColor: brandColor }}
                    >
                      <Icon name="ExternalLink" size={16} />
                      {card.cta?.label ?? "Vezi oferta"}
                    </Button>
                  </a>

                  <div className="mt-2 text-[10px] sm:text-[11px] text-gray-400">
                    Link afiliat • prețurile pot varia în timp real
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Card */}
        </div>
      </div>
    );
  }

  /* =====================================================
   🎟️ KLOOK – ACTIVITY CARD (GENERAL)
  ===================================================== */
  if (
    message?.type === "offer" &&
    message?.card?.type === "activity" &&
    message?.card?.provider === "Klook"
  ) {
    const card = message.card;
    const city = card.city ?? "orașul tău";
    const color = card.provider_meta?.brand_color ?? "#ff5b00";

    const saveId = card.cta?.url ?? `klook-${city}`;
    const isSaved = !!savedMap[saveId];

    return (
      <div className="flex justify-start mb-6">
        <div className="flex w-full max-w-[92%] gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <Icon name="Map" size={16} color="white" />
          </div>

          <div className="bg-white border rounded-2xl w-full p-4">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className="text-xs px-3 py-1 rounded-full border"
                  style={{ color, borderColor: `${color}33`, background: `${color}0D` }}
                >
                  Klook • Afiliere
                </span>

                <h3 className="mt-2 font-semibold text-lg">
                  🎟️ Activități în {city}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Tururi, atracții, experiențe locale și bilete oficiale
                </p>
              </div>

              <button onClick={() => toggleSave(saveId)}>
                <Icon
                  name="Heart"
                  size={18}
                  color={isSaved ? "#E11D48" : "#94A3B8"}
                />
              </button>
            </div>

            <a href={card.cta?.url} target="_blank" rel="noreferrer">
              <Button
                className="w-full mt-4"
                style={{ backgroundColor: color }}
              >
                <Icon name="ExternalLink" size={16} />
                Vezi activitățile
              </Button>
            </a>

            <div className="text-[11px] text-gray-400 mt-2">
              Link afiliat • disponibilitatea poate varia
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
// 🎟️ KLOOK ACTIVITY CARD (GENERAL, SINGLE)
// =====================================================
if (message?.type === "offer" && message?.card?.type === "activity") {
  const card = message.card;
  const city = card.city ?? "destinație";
  const color = card.provider_meta?.brand_color ?? "#ff5b00";

  return (
    <div className="flex justify-start mb-6">
      <div className="flex w-full max-w-[92%] gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
          <Icon name="MapPin" size={16} color="white" />
        </div>

        <div className="bg-white border rounded-2xl w-full p-4">
          <span
            className="text-xs px-3 py-1 rounded-full border"
            style={{ color, borderColor: `${color}33`, background: `${color}0D` }}
          >
            Klook • Afiliere
          </span>

          <h3 className="mt-2 font-semibold text-lg">
            🎟️ Activități în {city}
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Tururi, atracții, experiențe locale și bilete oficiale
          </p>

          <a href={card.cta?.url} target="_blank" rel="noreferrer">
            <Button className="w-full mt-4" style={{ backgroundColor: color }}>
              <Icon name="ExternalLink" size={16} />
              Vezi activitățile
            </Button>
          </a>

          <div className="text-[11px] text-gray-400 mt-2">
            Link afiliat • disponibilitatea poate varia
          </div>
        </div>
      </div>
    </div>
  );
}



  // =====================================================
  // 💬 NORMAL CHAT MESSAGE
  // =====================================================
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3`}
      >
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${
            isUser
              ? "bg-blue-600"
              : "bg-gradient-to-br from-primary to-secondary"
          }`}
        >
          <Icon name={isUser ? "User" : "Bot"} size={16} color="white" />
        </div>

        {/* Bubble */}
        <div className="flex-1">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${
              isUser
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
            }`}
            dangerouslySetInnerHTML={{ __html: message?.content || "" }}
          />

          <div className="mt-2 text-xs text-gray-400">
            {formatTime(message?.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
