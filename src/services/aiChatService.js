import { supabase } from "../lib/supabase";

export async function askAI({ userId, conversationId, prompt }) {
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

  return data; 
  // { reply, type, card, confidence }

}
