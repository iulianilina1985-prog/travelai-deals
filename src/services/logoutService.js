// src/services/logoutService.js
import { supabase } from "../lib/supabase";

export async function logoutUser() {
  await supabase.auth.signOut();

  // NU ștergem tot deocamdată — doar elementele legate de sesiune curentă
  localStorage.removeItem("chatMessages");
  localStorage.removeItem("allChats");

  // savedDeals și chatNotifications le lăsăm momentan
}
