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
  // ✈️ FLIGHT OFFER CARD (Booking style)
  // =====================================================
  if (message?.type === "offer" && message?.card?.type === "flight") {
    const card = message.card;

    // Safe fallbacks (sa nu crape daca lipsesc campuri)
    const fromLabel = card.from ?? card.destination?.from ?? "București";
    const toLabel = card.to ?? card.destination?.to ?? "Paris";

    const providerName = card.provider_meta?.name ?? card.provider ?? "Provider";
    const brandColor = card.provider_meta?.brand_color ?? "#2563eb";

    // Dates (prefer din backend, dar le facem frumoase aici)
    const start =
      card.dates?.start ?? card.meta?.depart_date ?? null;
    const end =
      card.dates?.end ?? card.meta?.return_date ?? null;

    const dateLabelPretty = buildPrettyDateRange(start, end);

    // Imagine (fallback)
    const imageUrl = card.image_url ?? "/assets/flight/flight.jpg";

    // ID stabil pt save (prefer card.id)
    const saveId =
      card.id ??
      card.cta?.url ??
      `flight|${providerName}|${fromLabel}|${toLabel}|${start ?? ""}|${end ?? ""}`;

    const isSaved = !!savedMap[saveId];

    // Extra info “premium”
    const isRoundTrip = !!end;
    const passengers =
      card.passengers ??
      card.meta?.passengers ??
      card.meta?.adults ??
      null;

    return (
      <div className="flex justify-start mb-6">
        <div className="flex max-w-[92%] items-start gap-3 w-full">
          {/* Avatar AI */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow">
            <Icon name="Plane" size={16} color="white" />
          </div>

          {/* Booking-ish Offer Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden">
            <div className="flex gap-4 p-4">
              {/* IMAGE */}
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-black/5 shadow-sm">
                <img
                  src={imageUrl}
                  alt={`${fromLabel} - ${toLabel}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // daca nu gaseste imaginea, nu stricam layout-ul
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Provider pill */}
                      <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border"
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

                      {/* Date (pretty) */}
                      <span className="text-xs text-gray-500">
                        {dateLabelPretty}
                      </span>
                    </div>

                    <h3 className="mt-2 font-semibold text-lg text-gray-900 truncate">
                      ✈️ {fromLabel} → {toLabel}
                    </h3>
                  </div>

                  {/* ❤️ Save */}
                  <button
                    onClick={() => toggleSave(saveId)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                      isSaved
                        ? "bg-red-50 border-red-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    title={isSaved ? "Salvat" : "Salvează"}
                    aria-label={isSaved ? "Salvat" : "Salvează"}
                  >
                    {/* Heart SVG (independent de Icon names) */}
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

                {/* AIRLINES (păstrat, dar safe) */}
                {Array.isArray(card.airlines) && card.airlines.length > 0 ? (
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
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

                {/* INFO ROW (mai “complete”) */}
                <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-600">
                  {/* dus-intors / one-way */}
                  <div className="flex items-center gap-2">
                    <Icon name="Repeat" size={14} />
                    <span>{isRoundTrip ? "Dus-întors" : "One-way"}</span>
                  </div>

                  {/* pax */}
                  {passengers ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={14} />
                      <span>{passengers} adulți</span>
                    </div>
                  ) : null}

                  {/* price */}
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

                  {/* baggage */}
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
                      className="w-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition"
                      style={{ backgroundColor: brandColor }}
                    >
                      <Icon name="ExternalLink" size={16} />
                      {card.cta?.label ?? "Vezi oferta"}
                    </Button>
                  </a>

                  {/* tiny note (optional) */}
                  <div className="mt-2 text-[11px] text-gray-400">
                    Link afiliat • prețurile pot varia în timp real
                  </div>
                </div>
              </div>
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
