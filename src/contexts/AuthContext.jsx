// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // ===========================================================
  // LOAD PROFILE & ROLES
  // ===========================================================
  const loadProfile = async (userId) => {
    if (!userId) return;

    setProfileLoading(true);

    try {
      // profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("roles(name)")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      const roles = rolesData?.map(r => r.roles?.name).filter(Boolean) || [];

      setUserProfile({ ...profile, roles });
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const clearProfile = () => {
    setUserProfile(null);
    setProfileLoading(false);
  };

  // ===========================================================
  // AUTH STATE HANDLER
  // ===========================================================
  const handleAuthChange = async (event, session) => {
    const userData = session?.user || null;

    // if logout
    if (!session) {
      setUser(null);
      clearProfile();
      setLoading(false);
      return;
    }

    // set user
    setUser(userData);

    // load profile
    await loadProfile(userData.id);

    setLoading(false);

    // FIRST LOGIN ONLY → accept terms/privacy automatically
    if (event === "SIGNED_IN") {
      try {
        await supabase
          .from("user_profiles")
          .update({
            accepted_terms: true,
            accepted_terms_at: new Date().toISOString(),
            accepted_privacy: true,
            accepted_privacy_at: new Date().toISOString(),
          })
          .eq("id", userData.id);
      } catch (err) {
        console.warn("Auto-terms update failed:", err);
      }
    }
  };

  // ===========================================================
  // INITIAL LOAD + SUBSCRIBE TO AUTH EVENTS
  // ===========================================================
  useEffect(() => {
    let ignore = false;

    const init = async () => {
      let { data: { session } } = await supabase.auth.getSession();

      // 🔑 PWA FIX: try refresh if session expired
      if (!session) {
        const refreshed = await supabase.auth.refreshSession();
        session = refreshed.data?.session || null;
      }

      if (!ignore) await handleAuthChange("INITIAL_LOAD", session);
    };


    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!ignore) handleAuthChange(event, session);
      }
    );

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  // ===========================================================
  // SIGN IN / OUT / UPDATE PROFILE
  // ===========================================================
  const signIn = async (email, password) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        clearProfile();
      }
      return { error };
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: "No user logged in" } };

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (!error) setUserProfile(data);
      return { data, error };
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated: !!user,
        loading,
        profileLoading,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
