// src/pages/ai-chat-interface/components/ChatInput.jsx

import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const ChatInput = ({
  onSendMessage,
  isTyping = false,
  isConnected = true,
  offlineMode = false,
}) => {
  const [message, setMessage] = useState("");
  const [dynamicSuggestions, setDynamicSuggestions] = useState([]);

  // =====================================================
  // 🔥 DYNAMIC SUGGESTIONS
  // =====================================================
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("chatMessages") || "[]");

      const lastUserMessages = saved
        .filter((m) => m.sender === "user")
        .slice(-5)
        .map((m) => (m.content || "").toLowerCase());

      if (lastUserMessages.length === 0) {
        setDynamicSuggestions([
          "Vacanță în Grecia sub 500€",
          "City break Paris weekend",
          "Sejur ieftin la munte",
        ]);
        return;
      }

      const last = lastUserMessages.at(-1);
      let suggestions = [];

      if (last.includes("grecia")) {
        suggestions = [
          "Top 3 insule ieftine în Grecia",
          "Zboruri low-cost spre Grecia",
          "Hoteluri aproape de plajă",
        ];
      } else if (last.includes("paris")) {
        suggestions = [
          "Itinerar 2 zile Paris",
          "Cazare ieftină lângă Turnul Eiffel",
          "Top muzee din Paris",
        ];
      } else {
        suggestions = [
          "Idei de vacanțe personalizate",
          "Top destinații Europa",
          "Cele mai ieftine zboruri luna aceasta",
        ];
      }

      setDynamicSuggestions(suggestions);
    } catch (err) {
      console.warn("Dynamic suggestion error:", err);
    }
  }, []);

  // =====================================================
  // ✈️ Trimite o sugestie ca un mesaj normal
  // =====================================================
  const sendSuggestion = (text) => {
    const saved = JSON.parse(localStorage.getItem("chatMessages") || "[]");

    const entry = {
      sender: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    saved.push(entry);
    localStorage.setItem("chatMessages", JSON.stringify(saved));

    onSendMessage?.(text);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim() || isTyping) return;

    const content = message.trim();
    setMessage("");

    const history = JSON.parse(localStorage.getItem("chatMessages") || "[]");

    history.push({
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    });

    localStorage.setItem("chatMessages", JSON.stringify(history));

    onSendMessage?.(content);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholderText = isTyping
    ? "Se procesează răspunsul..."
    : "Întreabă-mă orice despre călătorii...";

  return (
    <div className="p-6 border-t bg-white">
      {/* SUGESTII */}
      {!isTyping && message.length === 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            🚀 Sugestii rapide:
          </div>

          <div className="flex flex-wrap gap-3">
            {dynamicSuggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs hover:bg-primary/5 border-dashed px-3 py-1.5"
                onClick={() => sendSuggestion(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={isTyping}
            className={`w-full h-12 text-base px-4 shadow-sm ${
              isTyping ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <Button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="h-12 px-6 flex items-center justify-center"
        >
          {isTyping ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Icon name="Send" size={22} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
