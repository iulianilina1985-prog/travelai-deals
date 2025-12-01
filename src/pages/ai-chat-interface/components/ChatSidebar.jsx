import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ChatSidebar = ({ isOpen, onClose, history = [] }) => {
  const [activeTab, setActiveTab] = useState("history");
  const [conversations, setConversations] = useState(history); // 🟦 local state real
  const [savedDeals, setSavedDeals] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // =====================================================
  // 🟦 SYNC props → local state când history se schimbă
  // =====================================================
  useEffect(() => {
    setConversations(history);
  }, [history]);

  // =====================================================
  // 🔥 LIVE: receive conversationCreated + conversationUpdated
  // =====================================================
  useEffect(() => {
    const onConversationCreated = (e) => {
      const conv = e.detail;

      setConversations((prev) => [
        {
          id: conv.id,
          title: conv.title || "Conversație nouă",
          created_at: conv.created_at || new Date().toISOString(),
          messages: conv.messages || [],
        },
        ...prev,
      ]);
    };

    const onConversationUpdated = (e) => {
      const { id, title } = e.detail;

      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title } : c
        )
      );
    };

    window.addEventListener("conversationCreated", onConversationCreated);
    window.addEventListener("conversationUpdated", onConversationUpdated);

    return () => {
      window.removeEventListener("conversationCreated", onConversationCreated);
      window.removeEventListener("conversationUpdated", onConversationUpdated);
    };
  }, []);

  // =====================================================
  // Load local saved items
  // =====================================================
  useEffect(() => {
    setSavedDeals(JSON.parse(localStorage.getItem("savedDeals")) || []);
    setNotifications(JSON.parse(localStorage.getItem("chatNotifications")) || []);
  }, []);

  // =====================================================
  // Time formatter
  // =====================================================
  const formatTimeAgo = (ts) => {
    if (!ts) return "";
    const diff = new Date() - new Date(ts);
    const hours = diff / 3600000;

    if (hours < 1) return "Acum";
    if (hours < 24) return `${Math.floor(hours)}h în urmă`;
    return `${Math.floor(hours / 24)} zile în urmă`;
  };

  // =====================================================
  // Open conversation
  // =====================================================
  const openConversation = (conv) => {
    window.dispatchEvent(
      new CustomEvent("loadChatFromHistory", { detail: conv })
    );
  };

  // =====================================================
  // Delete conversation + UI update
  // =====================================================
  const deleteConversation = (id) => {
    window.dispatchEvent(
      new CustomEvent("deleteConversation", { detail: { id } })
    );

    setConversations((prev) => prev.filter((x) => x.id !== id));
  };

  // =====================================================
  // New conversation
  // =====================================================
  const handleNewConversation = () => {
    window.dispatchEvent(
      new CustomEvent("startNewChat", {
        detail: {
          id: Date.now(),
          title: "Conversație nouă",
          messages: [],
          created_at: new Date().toISOString(),
        },
      })
    );
  };

  // =====================================================
  // Sidebar UI
  // =====================================================
  const tabs = [
    { id: "history", icon: "MessageSquare", label: "Conversații" },
    { id: "saved", icon: "Heart", label: "Salvate" },
    { id: "notifications", icon: "Bell", label: "Notificări" },
  ];

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background border-l z-50 transform transition-transform duration-300 overflow-hidden
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        lg:relative lg:top-0 lg:h-full lg:translate-x-0`}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">Activitate</h3>

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex-1 flex items-center justify-center py-3 text-sm ${
                activeTab === t.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} size={16} />
              <span className="hidden sm:inline ml-2">{t.label}</span>

              {t.id === "notifications" && unread > 0 && (
                <span className="absolute top-1 right-4 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-10rem)]">

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Conversațiile mele</h4>
                <Button variant="ghost" size="sm" iconName="MessageSquarePlus" onClick={handleNewConversation}>
                  Chat nou
                </Button>
              </div>

              {conversations.length ? (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 border rounded-lg bg-card hover:shadow flex justify-between items-start"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => openConversation(conv)}>
                      <p className="font-medium text-sm">{conv.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(conv.created_at)}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteConversation(conv.id)}
                      className="ml-3 text-destructive hover:text-red-700"
                      title="Șterge conversația"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nu ai conversații salvate.</p>
              )}
            </div>
          )}

          {/* SAVED DEALS */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Oferte salvate</h4>

              {savedDeals.length ? (
                savedDeals.map((deal) => (
                  <div key={deal.id} className="bg-card border rounded-xl overflow-hidden shadow">
                    <div className="relative h-32 w-full">
                      <img src={deal.image} className="w-full h-full object-cover" />

                      {deal.days && (
                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                          {deal.days} zile
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h5 className="font-semibold text-sm">{deal.title}</h5>
                      <p className="text-xs text-muted-foreground">{deal.location}</p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-lg">€{deal.price}</span>

                        <button
                          onClick={() =>
                            setSavedDeals((prev) => prev.filter((d) => d.id !== deal.id))
                          }
                          className="text-destructive hover:text-red-700"
                        >
                          <Icon name="Trash2" size={20} />
                        </button>
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        className="w-full mt-4"
                        iconName="ShoppingCart"
                        onClick={() => window.location.href = `/checkout/${deal.id}`}
                      >
                        Rezervă
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nicio ofertă salvată.</p>
              )}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Notificări</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Check"
                  onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
                >
                  Marchează toate
                </Button>
              </div>

              {notifications.length ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border rounded-lg flex justify-between items-start ${
                      n.isRead ? "bg-card" : "bg-primary/10"
                    }`}
                  >
                    <div className="flex-1">
                      <h5 className="font-medium">{n.title}</h5>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </div>

                    <button
                      onClick={() =>
                        setNotifications((prev) => prev.filter((x) => x.id !== n.id))
                      }
                      className="ml-3 text-destructive hover:text-red-700"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nicio notificare.</p>
              )}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="p-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Link to="/my-offers-dashboard">
              <Button variant="outline" size="sm" iconName="Gift" className="w-full">
                Ofertele mele
              </Button>
            </Link>

            <Link to="/user-profile">
              <Button variant="outline" size="sm" iconName="Settings" className="w-full">
                Setări
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
