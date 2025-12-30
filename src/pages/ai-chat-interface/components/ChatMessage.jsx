import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

/**
 * ChatMessage – versiune FINALĂ și STABILĂ
 * - flight offer (Aviasales)
 * - activity offer (Klook – link simplu)
 * - normal chat message
 */

const ChatMessage = ({ message }) => {
  const isUser = message?.sender === "user";

  /* ================================
   ❤️ Saved offers (localStorage)
  ================================= */
  const SAVED_KEY = "travelai_saved_offers";
  const [savedMap, setSavedMap] = React.useState({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSavedMap(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleSave = (id) => {
    setSavedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  /* ================================
   ⏱️ Time formatter
  ================================= */
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

  /* =====================================================
   ✈️ FLIGHT OFFER CARD (Aviasales)
  ===================================================== */
  if (message?.type === "offer" && message?.card?.type === "flight") {
    const card = message.card;

    const from = card.from ?? card.destination?.from ?? "București";
    const to = card.to ?? card.destination?.to ?? "Paris";

    const provider = card.provider_meta?.name ?? "Aviasales";
    const color = card.provider_meta?.brand_color ?? "#2563eb";

    const saveId =
      card.id ??
      card.cta?.url ??
      `flight|${from}|${to}`;

    const isSaved = !!savedMap[saveId];

    return (
      <div className="flex justify-start mb-6">
        <div className="flex w-full max-w-[92%] gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <Icon name="Plane" size={16} color="white" />
          </div>

          <div className="bg-white border rounded-2xl w-full p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <span
                className="text-xs px-3 py-1 rounded-full border"
                style={{
                  color,
                  borderColor: `${color}33`,
                  background: `${color}0D`,
                }}
              >
                {provider} • Afiliere
              </span>

              <button onClick={() => toggleSave(saveId)}>
                <Icon
                  name="Heart"
                  size={18}
                  color={isSaved ? "#E11D48" : "#94A3B8"}
                />
              </button>
            </div>

            <h3 className="mt-2 font-semibold text-lg">
              ✈️ {from} → {to}
            </h3>

            <a href={card.cta?.url} target="_blank" rel="noreferrer">
              <Button className="w-full mt-4" style={{ backgroundColor: color }}>
                <Icon name="ExternalLink" size={16} />
                {card.cta?.label ?? "Vezi oferta"}
              </Button>
            </a>

            <div className="text-[11px] text-gray-400 mt-2">
              Link afiliat • prețurile pot varia
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
   🎟️ ACTIVITY OFFER CARD (Klook – SIMPLU)
  ===================================================== */
  if (message?.type === "offer" && message?.card?.type === "activity") {
    const card = message.card;

    const city = card.city ?? "destinație";
    const provider = card.provider ?? "Klook";
    const color = card.provider_meta?.brand_color ?? "#ff5b00";

    const saveId = card.id ?? card.cta?.url ?? `activity|${city}`;
    const isSaved = !!savedMap[saveId];

    return (
      <div className="flex justify-start mb-6">
        <div className="flex w-full max-w-[92%] gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <Icon name="MapPin" size={16} color="white" />
          </div>

          <div className="bg-white border rounded-2xl w-full p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <span
                className="text-xs px-3 py-1 rounded-full border"
                style={{
                  color,
                  borderColor: `${color}33`,
                  background: `${color}0D`,
                }}
              >
                {provider} • Afiliere
              </span>

              <button onClick={() => toggleSave(saveId)}>
                <Icon
                  name="Heart"
                  size={18}
                  color={isSaved ? "#E11D48" : "#94A3B8"}
                />
              </button>
            </div>

            <h3 className="mt-2 font-semibold text-lg">
              🎟️ {card.title ?? `Activități în ${city}`}
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Tururi, atracții și experiențe locale
            </p>

            <a href={card.cta?.url} target="_blank" rel="noreferrer">
              <Button className="w-full mt-4" style={{ backgroundColor: color }}>
                <Icon name="ExternalLink" size={16} />
                {card.cta?.label ?? "Vezi activitățile"}
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

  /* =====================================================
   💬 NORMAL CHAT MESSAGE
  ===================================================== */
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3`}
      >
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${
            isUser
              ? "bg-blue-600"
              : "bg-gradient-to-br from-primary to-secondary"
          }`}
        >
          <Icon name={isUser ? "User" : "Bot"} size={16} color="white" />
        </div>

        <div className="flex-1">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${
              isUser
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-white border text-gray-800 rounded-bl-md"
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
