import { supabase } from "../lib/supabase";

const FREE_LIMIT = 5; // mesaje pe zi

export async function checkDailyLimit() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return { allowed: false, reason: "not_logged_in" };

  const today = new Date().toISOString().slice(0, 10);

  // verificăm înregistrarea din ziua curentă
  let { data: usage } = await supabase
    .from("daily_usage")
    .select("messages_count")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  // dacă nu există, o creăm
  if (!usage) {
    await supabase
      .from("daily_usage")
      .insert([{ user_id: user.id, date: today, messages_count: 0 }]);
    usage = { messages_count: 0 };
  }

  if (usage.messages_count >= FREE_LIMIT) {
    return {
      allowed: false,
      reason: "limit_reached",
      remaining: 0
    };
  }

  return {
    allowed: true,
    remaining: FREE_LIMIT - usage.messages_count
  };
}

export async function incrementDailyUsage() {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return;

  const today = new Date().toISOString().slice(0, 10);

  await supabase.rpc("increment_daily_usage", {
    uid: user.id,
    d: today
  });
}
