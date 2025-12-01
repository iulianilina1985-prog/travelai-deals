// src/services/aiChat.js
import { supabase } from "../lib/supabase"; // ajustează calea dacă e altfel

/**
 * Apelează edge function-ul `ai-chat` din Supabase.
 *
 * @param {Object} params
 * @param {string} params.userId          - ID-ul userului (UUID Supabase)
 * @param {string} params.conversationId  - ID conversație (UUID din chat_conversations)
 * @param {string} params.prompt          - Mesajul userului
 */
export async function callAiChat({ userId, conversationId, prompt }) {
  const { data, error } = await supabase.functions.invoke("ai-chat", {
    body: {
      user_id: userId,
      conversation_id: conversationId,
      prompt
    }
  });

  if (error) {
    console.error("ai-chat error:", error);
    throw error;
  }

  // data ar trebui să fie de forma:
  // { reply, tokens_in, tokens_out, remaining_credits }
  return data;
}
