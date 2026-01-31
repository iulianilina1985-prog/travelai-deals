import { supabase } from "../lib/supabase";
import { userService } from "./userService";

export async function askAI({ userId, conversationId, prompt }) {
  const { data, error } = await supabase.functions.invoke("ai-chat", {
    body: {
      user_id: userId,
      conversation_id: conversationId,
      prompt,
      session_id: typeof window !== "undefined" ? userService.getSessionId() : null,
      client_path:
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}${window.location.hash}`
          : null,
      source: "aiChatService",
    }
  });

  if (error) {
    console.error("ai-chat error:", error);
    throw error;
  }

  return data; 
  // { reply, type, card, confidence }

}
