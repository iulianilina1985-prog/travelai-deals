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

  // =====================================================
  // ✈️ FLIGHT OFFER CARD
  // =====================================================
  if (message?.type === "offer" && message?.card?.type === "flight") {
    const card = message.card;

    return (
      <div className="flex justify-start mb-6">
        <div className="flex max-w-[85%] items-start gap-3">
          {/* Avatar AI */}
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary shadow">
            <Icon name="Plane" size={16} color="white" />
          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm w-full">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">
                ✈️ {card.from} → {card.to}
              </h3>
              <span className="text-xs text-gray-400">
                Powered by {card.provider}
              </span>
            </div>

            {/* AIRLINES */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {card.airlines?.map((airline) => (
                <img
                  key={airline}
                  src={`/assets/airlines/${airline}.svg`}
                  alt={airline}
                  className="h-6 object-contain opacity-90"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ))}
            </div>

            {/* INFO ROW */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} />
                <span>{card.duration}</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon name="Euro" size={14} />
                <span>Prețuri de la {card.priceRange}</span>
              </div>

              <div className="flex items-center gap-2">
                <Icon name="Briefcase" size={14} />
                <span>Bagaj opțional</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href={card.cta.url}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button className="w-full flex items-center justify-center gap-2">
                <Icon name="ExternalLink" size={16} />
                {card.cta.label}
              </Button>
            </a>
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
