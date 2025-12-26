// supabase/functions/ai-chat/schema.ts

export type TravelIntent = {
  type: "flight" | "hotel" | "activity" | null;
  from: string | null;
  to: string | null;
  depart_date: string | null; // YYYY-MM-DD
  return_date: string | null; // YYYY-MM-DD
};

export type AiChatResponse = {
  reply: string;
  intent: TravelIntent;
  memory_update: Record<string, unknown>;
};

export function safeJsonParse<T>(text: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    const v = JSON.parse(text);
    return { ok: true, value: v as T };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export function isValidAiChatResponse(x: any): x is AiChatResponse {
  if (!x || typeof x !== "object") return false;
  if (typeof x.reply !== "string") return false;
  if (!x.intent || typeof x.intent !== "object") return false;

  const t = x.intent.type;
  const okType = t === null || t === "flight" || t === "hotel" || t === "activity";
  if (!okType) return false;

  for (const k of ["from", "to", "depart_date", "return_date"] as const) {
    const v = x.intent[k];
    if (!(v === null || typeof v === "string")) return false;
  }

  if (!x.memory_update || typeof x.memory_update !== "object") return false;
  return true;
}
