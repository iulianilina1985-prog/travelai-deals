import { supabase } from '../lib/supabase';

/**
 * Serviciu complet pentru autentificare și gestiunea utilizatorului.
 * Toate metodele comunică direct cu Supabase Auth (fără mock-uri locale).
 */
class AuthService {
  /** 🔑 Autentificare utilizator existent */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) return { data: null, error };

      // Salvăm sesiunea automat în localStorage
      if (data?.session) {
        localStorage.setItem('supabaseSession', JSON.stringify(data.session));
      }

      return { data, error: null };
    } catch (err) {
      console.error('❌ Eroare la autentificare:', err);
      return { data: null, error: { message: 'Autentificarea a eșuat. Încearcă din nou.' } };
    }
  }

  /** 🧾 Înregistrare utilizator nou */
  /** 🧾 Înregistrare utilizator nou (FULL + UPDATE user_profiles) */
async signUp(email, password, userData = {}) {
  try {

    // SIGN UP în Supabase (STRICT corect)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          full_name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          role: 'free',
          marketing_emails: userData.agreeToMarketing || false,
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });

    if (error) return { data: null, error };

    if (!data?.user?.id) {
      return { data: null, error: { message: 'Userul nu a fost creat.' } };
    }

    const userId = data.user.id;

    // UPDATE user_profiles (doar câmpuri care EXISTĂ în tabel)
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: `${userData.firstName} ${userData.lastName}`.trim(),
        email: email.trim(),
        role: 'free',
        marketing_emails: userData.agreeToMarketing || false,
        accepted_terms: true,
        accepted_terms_at: new Date().toISOString(),
        accepted_privacy: true,
        accepted_privacy_at: new Date().toISOString(),
        terms_version: "1.0",
        privacy_version: "1.0",
        is_active: true,
        email_verified: false,
      })
      .eq('id', userId);

    if (updateError) {
      console.error("❌ Eroare la update user_profiles:", updateError);
    }

    return { data, error: null };

  } catch (err) {
    console.error('❌ Eroare la signUp:', err);
    return { data: null, error: { message: 'Eroare la înregistrare.' } };
  }
}

  /** 🚪 Delogare completă */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem('supabaseSession');
      return { error };
    } catch (err) {
      console.error('❌ Eroare la delogare:', err);
      return { error: { message: 'Delogarea a eșuat. Încearcă din nou.' } };
    }
  }

  /** 👤 Obține utilizatorul curent */
  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Nu s-au putut obține datele utilizatorului.' } };
    }
  }

  /** 🕒 Obține sesiunea activă */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Verificarea sesiunii a eșuat.' } };
    }
  }

  /** 🔄 Resetare parolă prin email */
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (err) {
      console.error('❌ Eroare la resetarea parolei:', err);
      return { data: null, error: { message: 'Resetarea parolei a eșuat. Încearcă din nou.' } };
    }
  }

  /** 🧩 Actualizare parolă */
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Actualizarea parolei a eșuat.' } };
    }
  }

  /** 🌐 Autentificare socială (Google, GitHub, etc.) */
  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/ai-chat-interface` },
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: `Autentificarea cu ${provider} a eșuat.` } };
    }
  }
  /** 🔐 Autentificare rapidă cu Google */
async signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/ai-chat-interface`
      }
    });

    return { data, error };
  } catch (err) {
    return { data: null, error: { message: "Autentificarea cu Google a eșuat." } };
  }
}

  /** 🛠️ Actualizare metadate utilizator */
  async updateUserMetadata(updates) {
    try {
      const { data, error } = await supabase.auth.updateUser({ data: updates });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: 'Actualizarea profilului a eșuat.' } };
    }
  }

  /** 🔔 Ascultă modificările de stare ale autentificării */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
export default authService;
