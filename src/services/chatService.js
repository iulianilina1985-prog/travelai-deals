import { supabase } from "../lib/supabase";

/**
 * ✅ Salvare conversație în Supabase
 */
export async function saveChat(title, messages) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      console.warn("⚠️ User neautentificat – conversația NU a fost salvată.");
      return null;
    }

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert([
        {
          user_id: user.id,
          title,
          messages,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Eroare la salvarea conversației:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("❌ Eroare în saveChat:", err);
    return null;
  }
}
/**
 * 🔄 Actualizează conversația EXISTENTĂ
 */
export async function updateChat(id, title, messages) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) return null;

    const { data, error } = await supabase
      .from("chat_conversations")
      .update({
        title,
        messages
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("❌ Eroare la updateChat:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("❌ Eroare în updateChat:", err);
    return null;
  }
}

/**
 * ✅ Returnează toate conversațiile userului
 */
export async function getAllChats() {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) return [];

    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Eroare la încărcarea conversațiilor:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("❌ Eroare în getAllChats:", err);
    return [];
  }
}

// ✅ NOU: ștergere conversație din Supabase
export async function deleteChat(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Neautentificat" };
  const { error } = await supabase
    .from("chat_conversations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) { console.error("Eroare deleteChat:", error); }
  return { ok: !error };
}