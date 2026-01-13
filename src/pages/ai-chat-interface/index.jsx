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
  const hasInitializedRef = useRef(false);
  const isSendingRef = useRef(false); // 🔒 Prevent double-send
  const conversationIdRef = useRef(null);

  const [dbConversationId, setDbConversationId] = useState(null);

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

  useEffect(() => {
    if (!messages.length) return;

    const last = messages[messages.length - 1];

    // 🔥 doar când AI răspunde
    if (last.sender !== "ai") return;

    // dacă AI trimite text + carduri, ne ducem la TEXT
    let target = document.getElementById(`msg-${last.id}`);

    // fallback: caută ultimul mesaj AI cu text
    if (!last.content && messages.length > 1) {
      for (let i = messages.length - 2; i >= 0; i--) {
        if (messages[i].sender === "ai" && messages[i].content) {
          target = document.getElementById(`msg-${messages[i].id}`);
          break;
        }
      }
    }

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [messages]);

  // ------------------------------------------------------
  // 📌 Conversație ID (UUID din DB sau fallback local)
  // ------------------------------------------------------
  const [conversationId, setConversationId] = useState(() => {
    // Default to new ID; will be overwritten by initChat if history exists
    const id = window.crypto?.randomUUID?.() ?? `conv-${Date.now()}`;
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
  // 🔹 Load inițial — Sursa de Adevăr (Supabase vs Local)
  // ======================================================
  useEffect(() => {
    const initChat = async () => {
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // ✅ Import chat history if exists (robust for OAuth redirects)
        const importedId = await importChatHistory(user.id);

        // Authenticated: Supabase is source of truth
        const chats = await getAllChats();
        setAllChats(chats || []);

        // Verificăm dacă avem un chat activ (fie din import, fie din login-redirect-flag)
        const activeAfterLogin = importedId || localStorage.getItem("activeConversationAfterLogin");

        if (activeAfterLogin) {
          const chatToLoad = (chats || []).find(c => String(c.id) === String(activeAfterLogin));
          if (chatToLoad) {
            setConversationId(String(activeAfterLogin));
            setDbConversationId(activeAfterLogin);
            conversationIdRef.current = String(activeAfterLogin); // sau latestChat.id
            setMessages(chatToLoad.messages || []);
            const hist = (chatToLoad.messages || []).flatMap((m) =>
              m.sender === "user"
                ? [{ role: "user", content: m.content }]
                : [{ role: "assistant", content: m.content }]
            );
            setConversationHistory(hist);
          }
          localStorage.removeItem("activeConversationAfterLogin");
        } else {
          // Requirement Update: Load latest conversation if exists
          if (chats && chats.length > 0) {
            // Sort by created_at desc just in case, though usually API returns sorted
            // Assuming chats are ordered or we pick the first one
            const latestChat = chats[0];

            setConversationId(String(latestChat.id));
            setDbConversationId(latestChat.id);
            conversationIdRef.current = String(latestChat.id); // sau latestChat.id
            setMessages(latestChat.messages || []);
            const hist = (latestChat.messages || []).flatMap((m) =>
              m.sender === "user"
                ? [{ role: "user", content: m.content }]
                : [{ role: "assistant", content: m.content }]
            );
            setConversationHistory(hist);
          } else {
            // Really new user or no chats
            setMessages([]);
            setConversationHistory([]);
          }
        }
      } else {
        // Non-authenticated: Check if we have existing local history
        const localMsgs = JSON.parse(localStorage.getItem("chatMessages") || "[]");
        const localConvId = localStorage.getItem("currentConversationId");

        if (localMsgs.length > 0) {
          setMessages(localMsgs);
          setConversationId(localConvId || `conv-${Date.now()}`);

          const hist = localMsgs.flatMap((m) =>
            m.sender === "user"
              ? [{ role: "user", content: m.content }]
              : [{ role: "assistant", content: m.content }]
          );
          setConversationHistory(hist);
        } else {
          // Requirement D: Întotdeauna chat nou pe mount
          setMessages([]);
          setConversationHistory([]);
          localStorage.removeItem("chatMessages");
          localStorage.removeItem("currentConversationId");
        }
      }
    };

    initChat();
  }, []);

  /**
   * 🔄 Importă istoricul din localStorage în Supabase
   */
  const importChatHistory = async (userId) => {
    try {
      const localMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
      if (localMessages && localMessages.length > 0) {
        // 1. Create empty chat
        const title = localMessages.find(m => m.sender === "user")?.content || "Imported Chat";
        const { saveChat, updateChat } = await import("../../services/chatService"); // Dynamic import to ensure fresh logic

        const newChat = await saveChat(title.slice(0, 40));

        if (newChat?.id) {
          // 2. Populate messages immediately
          await updateChat(newChat.id, title.slice(0, 40), localMessages);

          localStorage.removeItem("chatMessages");
          localStorage.removeItem("currentConversationId");
          return newChat.id;
        }
      }
    } catch (err) {
      console.error("Eroare la importul istoricului:", err);
    }
    return null;
  };

  // Salvăm în localStorage DOAR dacă user-ul NU este logat (buffer temporar)
  useEffect(() => {
    const syncToLocal = async () => {
      // Robust check: getSession instead of getUser for speed/cache
      const { data: { session } } = await supabase.auth.getSession();

      // If we have a session, we are logged in -> DO NOT WRITE TO LOCAL STORAGE
      if (session) {
        // ACTIVE MEASURE: Wipe local storage to prevent ghosts
        if (localStorage.getItem("chatMessages")) {
          localStorage.removeItem("chatMessages");
          localStorage.removeItem("currentConversationId");
        }
        return;
      }

      if (messages.length > 0) {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
        localStorage.setItem("currentConversationId", conversationId);
      }
    };
    syncToLocal();
  }, [messages, conversationId]);

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


  // ======================================================
  // EVENTS — încarcă conversație din sidebar
  // ======================================================
  useEffect(() => {
    const handler = (e) => {
      const conv = e.detail; // row din chat_conversations

      if (!conv) return;

      setConversationId(String(conv.id));
      setDbConversationId(conv.id);
      conversationIdRef.current = String(conv.id); // 🔥


      const convMessages = conv.messages || [];
      setMessages(convMessages);

      const hist = convMessages.flatMap((m) =>
        m.sender === "user"
          ? [{ role: "user", content: m.content }]
          : [{ role: "assistant", content: m.content }]
      );
      setConversationHistory(hist);
    };

    window.addEventListener("loadChatFromHistory", handler);
    return () => window.removeEventListener("loadChatFromHistory", handler);
  }, []);

  // ======================================================
  // EVENTS — începe conversație nouă
  // ======================================================
  useEffect(() => {
    const handler = () => {
      setConversationId(window.crypto?.randomUUID?.() ?? `conv-${Date.now()}`);
      setDbConversationId(null);
      conversationIdRef.current = null; // 🔥 IMPORTANT
      setMessages([]);
      setConversationHistory([]);
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
        setMessages([]);
        setConversationHistory([]);
        setConversationId(window.crypto?.randomUUID?.() ?? `conv-${Date.now()}`);
        setDbConversationId(null);
        conversationIdRef.current = null;
      }
    };

    window.addEventListener("deleteConversation", handleDelete);
    return () => window.removeEventListener("deleteConversation", handleDelete);
  }, []);

  // ======================================================
  // ✉️ TRIMITERE MESAJ — FĂRĂ CREDITE, FĂRĂ LIMITĂ CUVINTE
  // ======================================================
  // ======================================================
  // ✉️ TRIMITERE MESAJ — STRICT LINEAR LOGIC
  // ======================================================
  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      const userMsg = {
        id: Date.now(),
        sender: "user",
        content,
        timestamp: new Date().toISOString(),
        title: generateTitle(content),
      };

      setIsTyping(true);
      setMessages((prev) => [...prev, userMsg]);
      setConversationHistory((prev) => [...prev, { role: "user", content }]);

      let currentDbId = conversationIdRef.current;

      // 🧠 DOAR aici se creează conversația
      if (user && !currentDbId) {
        const newChat = await saveChat(userMsg.title, [userMsg]);
        if (!newChat?.id) throw new Error("Failed to create conversation");

        currentDbId = String(newChat.id);
        conversationIdRef.current = currentDbId;

        setDbConversationId(currentDbId);
        setConversationId(currentDbId);
        setAllChats((prev) => [newChat, ...prev]);
      }

      const aiResponse = await getTravelRecommendation(
        content,
        conversationHistory,
        currentDbId
      );

      const aiContent = aiResponse?.content || "N-am primit răspuns.";

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        content: aiContent,
        timestamp: new Date().toISOString(),
        isError: !!aiResponse?.errorType,
        cards: aiResponse?.cards || [],
        card: aiResponse?.card,
        type: aiResponse?.type,
        intent: aiResponse?.intent,
      };

      setMessages((prev) => {
        const next = [...prev, aiMsg];
        if (user && currentDbId) {
          updateChat(currentDbId, generateTitle(next[0]?.content), next);
        }
        return next;
      });

      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiContent },
      ]);
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "ai", isError: true, content: "Eroare critică." },
      ]);
    } finally {
      setIsTyping(false);
      isSendingRef.current = false;
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
    <div className="bg-background pt-16 h-screen flex flex-col overflow-hidden">
      <Header />



      <div className="flex min-h-[calc(100vh-4rem)]">
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
          <div className="flex-1 overflow-y-auto px-4 py-3">
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
              onClose={() => { }}
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
