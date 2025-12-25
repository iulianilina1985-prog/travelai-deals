import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ChatMessage = ({ message, onBookDeal, offlineMode = false }) => {
  const isUser = message?.sender === "user";
  const [isSaved, setIsSaved] = useState(false);

  // ------------------------
  // Time formatting
  // ------------------------
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

  // ============================================================
// 🧩 OFFER CARD (Aviasales / Booking / Klook)
// ============================================================
if (message?.type === "offer" && message?.card) {
  const { card } = message;

  return (
    <div className="flex justify-start mb-6">
      <div className="flex max-w-[80%] items-start gap-3">
        {/* Avatar AI */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow bg-gradient-to-br from-primary to-secondary">
          <Icon name="Bot" size={16} color="white" />
        </div>

        {/* Card ofertă */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-lg">{card.title}</h3>
          <p className="text-sm text-gray-500">{card.subtitle}</p>

          <p className="text-xs text-gray-400 mt-1">
            Powered by {card.provider}
          </p>

          <a
            href={card.cta.url}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            {card.cta.label}
          </a>
        </div>
      </div>
    </div>
  );
}

  // ------------------------
  // Error icons
  // ------------------------
  const getErrorIcon = (type) => {
    switch (type) {
      case "quota_exceeded":
        return "Clock";
      case "rate_limit":
        return "Zap";
      case "content_filtered":
        return "Shield";
      case "technical_error":
        return "AlertTriangle";
      default:
        return "AlertCircle";
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case "quota_exceeded":
        return "text-orange-600";
      case "rate_limit":
        return "text-yellow-600";
      case "content_filtered":
      case "technical_error":
        return "text-red-600";
      default:
        return "text-error";
    }
  };

  // ------------------------
  // Deal saved check
  // ------------------------
  useEffect(() => {
    if (message?.deal?.title) {
      const saved = JSON.parse(localStorage.getItem("savedDeals")) || [];
      setIsSaved(saved.some((d) => d.title === message.deal.title));
    }
  }, [message?.deal]);

  const handleSaveDeal = (deal) => {
    if (!deal) return;

    const saved = JSON.parse(localStorage.getItem("savedDeals")) || [];
    const exists = saved.some((d) => d.title === deal.title);

    if (!exists) {
      const newDeal = { ...deal, id: Date.now() };
      localStorage.setItem("savedDeals", JSON.stringify([newDeal, ...saved]));

      const notifs =
        JSON.parse(localStorage.getItem("chatNotifications")) || [];
      const notif = {
        id: Date.now(),
        title: "Ofertă salvată 💾",
        message: `Ai salvat oferta „${deal.title}”.`,
        timestamp: new Date(),
        isRead: false,
      };

      localStorage.setItem(
        "chatNotifications",
        JSON.stringify([notif, ...notifs])
      );

      setIsSaved(true);
    }
  };

  // ============================================================
  //                        RENDER
  // ============================================================

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-800"
              : message?.isError
              ? "bg-error/20"
              : message?.isSupabaseMode || offlineMode
              ? "bg-gradient-to-br from-blue-500 to-cyan-500"
              : "bg-gradient-to-br from-primary to-secondary"
          }`}
        >
          <Icon
            name={
              isUser
                ? "User"
                : message?.isError
                ? getErrorIcon(message?.errorType)
                : message?.isSupabaseMode || offlineMode
                ? "Database"
                : "Bot"
            }
            size={16}
            color={message?.isError ? getErrorColor(message?.errorType) : "white"}
          />
        </div>

        {/* BALON MESAJ */}
        <div className={`flex-1 ${isUser ? "text-right" : "text-left"}`}>
          <div
            className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
              isUser
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-br-md"
                : message?.isError
                ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-md"
                : message?.isSupabaseMode || offlineMode
                ? "bg-blue-50 border border-blue-200 text-gray-800 rounded-bl-md"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
            }`}
          >
            <div
  className={`max-w-none whitespace-pre-wrap ${
    isUser ? "text-white" : "text-gray-800"
  }`}
  dangerouslySetInnerHTML={{ __html: message?.content || "" }}
/>
          </div>

          {/* ---------------- DEAL CARD ---------------- */}
          {message?.deal && !message?.isError && (
            <div
              className={`mt-4 bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition ${
                message?.isSupabaseMode || offlineMode
                  ? "border-blue-200 bg-blue-50/50"
                  : "border-gray-200"
              }`}
            >
              <div className="relative h-48">
                <img
                  src={message?.deal?.image}
                  alt={message?.deal?.title || "Ofertă"}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/assets/images/no_image.png")}
                />

                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow">
                  -{message?.deal?.discount || 10}%
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{message?.deal?.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="text-sm text-gray-500">
                      {message?.deal?.rating || "4.7"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-3 flex items-center">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {message?.deal?.location}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">
                      €{message?.deal?.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      €
                      {message?.deal?.originalPrice ||
                        message?.deal?.price + 50}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={isSaved ? "solid" : "outline"}
                    size="sm"
                    className={`flex-1 ${
                      isSaved ? "bg-red-500 hover:bg-red-600 text-white" : ""
                    }`}
                    onClick={() => {
                      const dealToSave =
                        message?.deal || {
                          id: Date.now(),
                          title: message?.content?.slice(0, 50),
                          location: "Locație nespecificată",
                          price: 100 + Math.floor(Math.random() * 200),
                          image: "/assets/images/no_image.png",
                          discount: 0,
                        };

                      handleSaveDeal(dealToSave);
                    }}
                  >
                    <Icon
                      name="Heart"
                      size={16}
                      className={`mr-2 ${
                        isSaved ? "text-white" : "text-primary"
                      }`}
                    />
                    {isSaved ? "Salvat" : "Salvează"}
                  </Button>

                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onBookDeal?.(message?.deal)}
                  >
                    <Icon name="ExternalLink" size={16} className="mr-2" />
                    {offlineMode ? "Detalii" : "Rezervă"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`mt-2 text-xs text-gray-400 ${
              isUser ? "text-right" : "text-left"
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
