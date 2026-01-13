import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useFavorites } from "../../../contexts/FavoritesContext";

const ChatSidebar = ({ isOpen, onClose, history = [] }) => {
  const [activeTab, setActiveTab] = useState("history");
  const [conversations, setConversations] = useState(history);
  const { favorites, toggleFavorite } = useFavorites();

  // Sync history
  useEffect(() => {
    setConversations(history);
  }, [history]);

  // Live updates
  useEffect(() => {
    const onConversationCreated = (e) => {
      const conv = e.detail;
      setConversations((prev) => {
        if (prev.some((c) => c.id === conv.id)) return prev;
        return [
          {
            id: conv.id,
            title: conv.title || "Conversație nouă",
            created_at: conv.created_at || new Date().toISOString(),
          },
          ...prev,
        ];
      });
    };

    const onConversationUpdated = (e) => {
      const { id, title } = e.detail;
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
    };

    window.addEventListener("conversationCreated", onConversationCreated);
    window.addEventListener("conversationUpdated", onConversationUpdated);
    return () => {
      window.removeEventListener("conversationCreated", onConversationCreated);
      window.removeEventListener("conversationUpdated", onConversationUpdated);
    };
  }, []);

  const formatTimeAgo = (ts) => {
    if (!ts) return "";
    const diff = new Date() - new Date(ts);
    const hours = diff / 3600000;
    if (hours < 1) return "Acum";
    if (hours < 24) return `${Math.floor(hours)}h în urmă`;
    return `${Math.floor(hours / 24)} zile în urmă`;
  };

  const openConversation = (conv) => {
    window.dispatchEvent(new CustomEvent("loadChatFromHistory", { detail: conv }));
  };

  const deleteConversation = (id) => {
    window.dispatchEvent(new CustomEvent("deleteConversation", { detail: { id } }));
    setConversations((prev) => prev.filter((x) => x.id !== id));
  };

  const handleNewConversation = () => {
    window.dispatchEvent(new CustomEvent("startNewChat"));
  };

  const tabs = [
    { id: "history", icon: "MessageSquare", label: "Conversații" },
    { id: "saved", icon: "Heart", label: "Salvate" },
    { id: "notifications", icon: "Bell", label: "Notificări" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background border-l z-50 transition-transform flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        lg:relative lg:top-0 lg:h-full lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h3 className="font-semibold">Activitate</h3>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm ${activeTab === t.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
                }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <Button size="sm" onClick={handleNewConversation}>
                Chat nou
              </Button>

              {conversations.map((c) => (
                <div
                  key={c.id}
                  className="p-3 border rounded flex justify-between"
                >
                  <div
                    onClick={() => openConversation(c)}
                    className="cursor-pointer"
                  >
                    <p className="font-medium text-sm">{c.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(c.created_at)}
                    </span>
                  </div>

                  <button onClick={() => deleteConversation(c.id)}>
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SAVED */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              {favorites.length ? (
                favorites.map((deal) => (
                  <div key={deal.id} className="border rounded p-3">
                    <img
                      src={deal.image}
                      className="h-32 w-full object-cover rounded"
                    />
                    <h5 className="mt-2 font-semibold text-sm">
                      {deal.title}
                    </h5>
                    <p className="text-primary font-bold">{deal.price}</p>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(deal.link, "_blank")}
                      >
                        Vezi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFavorite(deal)}
                      >
                        Șterge
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nicio ofertă salvată.
                </p>
              )}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <p className="text-sm text-muted-foreground">
              În curând…
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t shrink-0 grid grid-cols-2 gap-2">
          <Link to="/my-offers-dashboard">
            <Button variant="outline" size="sm" className="w-full">
              Ofertele mele
            </Button>
          </Link>

          <Link to="/user-profile">
            <Button variant="outline" size="sm" className="w-full">
              Setări
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
