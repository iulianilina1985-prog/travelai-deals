// src/pages/ai-chat-interface/components/ChatInput.jsx

import React, { useState } from "react";
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

  // ===============================
  // SEND MESSAGE
  // ===============================
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim() || isTyping) return;

    const content = message.trim();
    setMessage("");

    // backup local (pentru UX / reload)
    try {
      const history = JSON.parse(
        localStorage.getItem("chatMessages") || "[]"
      );
      history.push({
        sender: "user",
        content,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("chatMessages", JSON.stringify(history));
    } catch { }

    onSendMessage?.(content);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const placeholderText = isTyping
    ? "Generating answer..."
    : "Ask me anything about travel…";

  return (
    <div className="px-3 py-2 border-t bg-white sticky bottom-0">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 w-full"
      >
        {/* INPUT */}
        <div className="flex-1">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={isTyping}
            className={`w-full h-12 text-base px-4 shadow-sm ${isTyping ? "opacity-70 cursor-not-allowed" : ""
              }`}
          />
        </div>

        {/* SEND */}
        <Button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="h-12 px-5 flex items-center justify-center shrink-0"
        >
          {isTyping ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="Send" size={22} />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
