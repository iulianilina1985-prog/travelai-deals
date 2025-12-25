// ======================================================
// src/pages/ai-chat-interface/index.jsx
// VARIANTA COMPLETĂ – FĂRĂ CREDITE, FĂRĂ WORD-LIMIT
// TOTUL SE BAZEAZĂ DOAR PE RĂSPUNSUL AI
// ======================================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/ui/Header";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import ChatSidebar from "./components/ChatSidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import UpgradeModal from "../../components/ui/UpgradeModal";
import { checkDailyLimit, incrementDailyUsage } from "../../services/usageService";

import { supabase } from "../../lib/supabase";

import {
  getTravelRecommendation,
  moderateUserInput,
  checkOpenAIServiceHealth,
} from "../../services/openaiService";

import {
  saveChat,
  updateChat,
  getAllChats,
  deleteChat,
} from "../../services/chatService";


// ======================================================
// COMPONENTĂ PRINCIPALĂ
// ======================================================

const AIChatInterface = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [offerCard, setOfferCard] = useState(null);

  // ------------------------------------------------------
  // STATE
  // ------------------------------------------------------
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [supabaseMode, setSupabaseMode] = useState(false);
  const [allChats, setAllChats] = useState([]);
  const [plan, setPlan] = useState("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ------------------------------------------------------
  // 📌 Conversație ID (UUID din DB sau fallback local)
  // ------------------------------------------------------
  const [conversationId, setConversationId] = useState(() => {
    const stored = localStorage.getItem("currentConversationId");
    if (stored) return stored;

    const id = window.crypto?.randomUUID?.() ?? `conv-${Date.now()}`;
    localStorage.setItem("currentConversationId", id);
    return id;
  });

  const generateTitle = (text) =>
    !text
      ? "Conversație nouă"
      : text.split(" ").slice(0, 3).join(" ") +
        (text.split(" ").length > 3 ? "..." : "");

  // ------------------------------------------------------
  // 📌 Citire subscription (doar plan)
  // ------------------------------------------------------
  const getUserSubscription = async (userId) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan_name")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    return data;
  };

  // ======================================================
  // 🔹 Load mesaje din localStorage (fallback)
  // ======================================================
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("chatMessages") || "[]");
      setMessages(saved);

      // reconstruim și contextul pentru AI
      const hist = (saved || []).flatMap((m) =>
        m.sender === "user"
          ? [{ role: "user", content: m.content }]
          : [{ role: "assistant", content: m.content }]
      );
      setConversationHistory(hist);
    } catch {
      setMessages([]);
      setConversationHistory([]);
    }
  }, []);

  // salvăm în localStorage ca backup vizual
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // ======================================================
  // 🔹 Load istoric conversații din Supabase
  // ======================================================
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getAllChats();
        setAllChats(data || []);
        localStorage.setItem("allChats", JSON.stringify(data || []));
      } catch (err) {
        console.error("Eroare loadHistory:", err);
      }
    };
    loadHistory();
  }, []);

  // ======================================================
  // 🔹 Status AI
  // ======================================================
  useEffect(() => {
    const check = async () => {
      try {
        const status = await checkOpenAIServiceHealth();
        setServiceStatus(status);
        setIsConnected(status?.available);
        setOfflineMode(status?.offlineMode || false);
        setSupabaseMode(status?.supabaseMode || false);
      } catch {
        setServiceStatus({
          status: "database_mode",
          available: true,
          supabaseMode: true,
        });
      }
    };
    check();
  }, []);

  // Scroll la ultimul mesaj
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ======================================================
  // EVENTS — încarcă conversație din sidebar
  // ======================================================
  useEffect(() => {
    const handler = (e) => {
      const conv = e.detail; // row din chat_conversations

      if (!conv) return;

      setConversationId(String(conv.id));
      localStorage.setItem("currentConversationId", String(conv.id));


      const convMessages = conv.messages || [];
      setMessages(convMessages);

      const hist = convMessages.flatMap((m) =>
        m.sender === "user"
          ? [{ role: "user", content: m.content }]
          : [{ role: "assistant", content: m.content }]
      );
      setConversationHistory(hist);

      // și punem în localStorage pentru fallback
      localStorage.setItem("chatMessages", JSON.stringify(convMessages));
    };

    window.addEventListener("loadChatFromHistory", handler);
    return () => window.removeEventListener("loadChatFromHistory", handler);
  }, []);

  // ======================================================
  // EVENTS — începe conversație nouă
  // ======================================================
  useEffect(() => {
    const handler = (e) => {
      const { id } = e.detail;

      setConversationId(id);
      localStorage.setItem("currentConversationId", id);

      setMessages([]);
      setConversationHistory([]);
      localStorage.setItem("chatMessages", JSON.stringify([]));
    };

    window.addEventListener("startNewChat", handler);
    return () => window.removeEventListener("startNewChat", handler);
  }, []);

  // ======================================================
  // LISTENER — Ștergere conversație din Sidebar
  // ======================================================
  useEffect(() => {
    const handleDelete = async (e) => {
      const { id } = e.detail;

      await deleteChat(id);
      setAllChats((prev) => prev.filter((c) => c.id !== id));

      const current = localStorage.getItem("currentConversationId");
      if (current && current === id.toString()) {
        localStorage.removeItem("currentConversationId");
        localStorage.removeItem("chatMessages");
        setMessages([]);
        setConversationHistory([]);
        setConversationId(`conv-${Date.now()}`);
      }
    };

    window.addEventListener("deleteConversation", handleDelete);
    return () => window.removeEventListener("deleteConversation", handleDelete);
  }, []);

  // ======================================================
  // ✉️ TRIMITERE MESAJ — FĂRĂ CREDITE, FĂRĂ LIMITĂ CUVINTE
  // ======================================================
  const handleSendMessage = async (content) => {
  if (!content?.trim()) return;
    setOfferCard(null);

  // 1️⃣ Moderare
  const safe = await moderateUserInput(content).catch(() => true);
  if (!safe) {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "ai",
        content: "Mesaj nepotrivit. 🙏",
        isError: true,
      }
    ]);
    return;
  }

  // 2️⃣ User logat?
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "ai",
        content: "Trebuie să fii logat pentru a folosi TravelAI. 🔐",
        isError: true,
      }
    ]);
    return;
  }

  // 3️⃣ Planul utilizatorului
  const sub = await getUserSubscription(user.id);
  const userPlan = sub?.plan_name?.toLowerCase() || "free";
  setPlan(userPlan);

  // 4️⃣ Limita zilnică — doar FREE
  if (userPlan === "free") {
  const limit = await checkDailyLimit();

  if (!limit.allowed) {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "ai",
        content: `
Ai atins limita zilnică de 5 mesaje.  

🚀 Poți reveni mâine sau poți trece la PRO pentru acces nelimitat.  

🔎 Între timp, poți folosi pagina **Ofertele Mele** pentru a căuta manual cele mai bune oferte de vacanță:  

👉 <a href="/my-offers-dashboard" class="text-blue-500 underline">Deschide Ofertele Mele</a>
        `,
        isError: true,
        isHtml: true
      }
    ]);
    setShowUpgradeModal(true); // 👉 deschide modalul PRO
    return;
  }

  await incrementDailyUsage();
}


  const firstMessage = messages.length === 0;

  // 5️⃣ Construire mesaj user
  const userMsg = {
    id: Date.now(),
    sender: "user",
    content,
    timestamp: new Date().toISOString(),
    title: generateTitle(content),
  };

  // 6️⃣ Adăugăm la UI + SAVE / UPDATE DB
  setMessages(prev => {
    const newMessages = [...prev, userMsg];

    if (prev.length === 0) {
      // prima mesaj → INSERT
      saveChat(userMsg.title, newMessages).then(conv => {
        if (conv?.id) {
          setConversationId(conv.id);
          localStorage.setItem("currentConversationId", conv.id);
          setAllChats(prevChats => [conv, ...prevChats]);
        }
      });
    } else {
      // conversație existentă → UPDATE
      if (conversationId && !String(conversationId).startsWith("conv-")) {
        updateChat(
          conversationId,
          generateTitle(newMessages[0]?.content),
          newMessages
        );
      }
    }

    return newMessages;
  });

  if (firstMessage) {
    window.dispatchEvent(
      new CustomEvent("conversationCreated", {
        detail: {
          id: conversationId,
          title: generateTitle(content),
          created_at: new Date().toISOString(),
          messages: [userMsg],
        },
      })
    );
  }

  setConversationHistory(prev => [...prev, { role: "user", content }]);
  setIsTyping(true);

  try {
    // 7️⃣ AI
    const ai = await getTravelRecommendation(
      content,
      conversationHistory,
      conversationId
    );

    const aiContent =
      ai?.content || ai?.message || ai?.reply || "N-am primit text 😅";

    const aiMsg = {
      id: Date.now() + 1,
      sender: "ai",
      content: aiContent,
      timestamp: new Date().toISOString(),
      isError: !!ai?.errorType,
      tokens: {
        in: ai?.tokens_in || 0,
        out: ai?.tokens_out || 0,
      },
      isSupabaseMode: ai?.isSupabaseMode || supabaseMode,
    };    

    // 🔥 OFERTE (doar dacă AI a returnat intent)
if (ai?.intent) {
  try {
    const { data: auth } = await supabase.auth.getSession();
    const token = auth?.session?.access_token;

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/offers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          intent: ai.intent,
        }),
      }
    );

    const data = await res.json();

    if (data?.card) {
      setOfferCard(data.card);
    }
  } catch (err) {
    console.error("Eroare offers:", err);
  }
}


    // Salvare + update UI
    setMessages(prev => {
      const newMessages = [...prev, aiMsg];

      if (conversationId && !String(conversationId).startsWith("conv-")) {
        updateChat(
          conversationId,
          generateTitle(newMessages[0]?.content),
          newMessages
        );
      }

      return newMessages;
    });

    setConversationHistory(prev => [
      ...prev,
      { role: "assistant", content: aiContent },
    ]);
  } catch (error) {
    console.error("Eroare AI:", error);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "ai",
        content: "Eroare tehnică. Încearcă din nou.",
        isError: true,
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  // ======================================================
  // 🔹 Încarcă plan la intrare (fără credite)
  // ======================================================
  useEffect(() => {
    const loadPlan = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const subscription = await getUserSubscription(user.id);
      const p = subscription?.plan_name?.toLowerCase() || "free";
      setPlan(p);
    };

    loadPlan();
  }, []);

  // ======================================================
  // Render info plan (fără credite)
  // ======================================================
  const renderPlanInfo = () => {
    if (!plan) return "Plan: ...";
    if (plan === "pro") return "PRO · Acces nelimitat";
    return `${plan.toUpperCase()} · Acces activ`;
  };

  // ======================================================
  // UI FINAL
  // ======================================================

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  const statusInfo =
    serviceStatus &&
    {
      healthy: {
        text: "Online - AI Activ",
        color: "bg-green-500",
        icon: "CheckCircle",
      },
      database_mode: {
        text: "Mod Supabase",
        color: "bg-blue-500",
        icon: "Database",
      },
      offline: {
        text: "Offline",
        color: "bg-gray-500",
        icon: "Wifi",
      },
    }[serviceStatus.status];

  const statusDisplay =
    statusInfo ||
    {
      text: serviceStatus ? "Reconectare..." : "Verificare...",
      color: serviceStatus ? "bg-red-500" : "bg-yellow-500",
      icon: serviceStatus ? "AlertTriangle" : "Loader",
    };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Header />

      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* CHAT ZONE */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Bot" size={20} color="white" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  TravelAI Assistant
                </h2>

                {/* STATUS AI */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${statusDisplay.color}`}
                  />
                  <Icon name={statusDisplay.icon} size={12} />
                  <span className="text-sm text-muted-foreground">
                    {statusDisplay.text}
                  </span>
                </div>

                {/* PLAN INFO */}
                <span className="text-xs text-muted-foreground block mt-1">
                  {renderPlanInfo()}
                </span>
              </div>
            </div>

            {/* BUTOANE HEADER */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/my-offers-dashboard")}
              >
                <Icon name="Gift" size={20} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Icon name="Menu" size={20} />
              </Button>
            </div>
          </div>

          {/* MESAJE */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <WelcomeScreen
                onStartChat={(txt) => handleSendMessage(txt)}
                isServiceAvailable={isConnected}
                serviceStatus={serviceStatus}
                offlineMode={offlineMode}
                supabaseMode={supabaseMode}
              />
            ) : (
              <div className="max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    offlineMode={offlineMode}
                    supabaseMode={supabaseMode}
                  />
                ))}

                {offerCard && (
  <div className="mt-4 p-4 border rounded-lg bg-card">
    <h3 className="font-semibold text-lg">{offerCard.title}</h3>
    <p className="text-sm text-muted-foreground">
      {offerCard.subtitle}
    </p>

    <a
      href={offerCard.cta.url}
      target="_blank"
      rel="noreferrer"
      className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded"
    >
      {offerCard.cta.label}
    </a>
  </div>
)}


                {/* TYPING */}
                {isTyping && (
                  <div className="flex items-center space-x-2 p-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="Bot" size={16} color="white" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Se generează răspunsul...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="border-t border-border">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
              />
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        {isSidebarOpen ? (
          <ChatSidebar
            isOpen={true}
            onClose={() => setIsSidebarOpen(false)}
            messages={messages}
            history={allChats}
          />
        ) : (
          <div className="hidden lg:block w-80 border-l border-border">
            <ChatSidebar
              isOpen={true}
              onClose={() => {}}
              messages={messages}
              history={allChats}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatInterface;
