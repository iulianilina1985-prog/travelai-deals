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
  // LOAD PROFILE + ROLES
  // ===========================================================
  const loadProfile = async (userId) => {
    if (!userId) return;

    setProfileLoading(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("roles(name)")
        .eq("user_id", userId);

      if (rolesError) throw rolesError;

      const roles = rolesData?.map((r) => r.roles?.name).filter(Boolean) || [];

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
  // HANDLE AUTH EVENTS
  // ===========================================================
  const handleAuthChange = async (event, session) => {
    const userData = session?.user || null;

    if (!session) {
      setUser(null);
      clearProfile();
      setLoading(false);
      return;
    }

    setUser(userData);
    await loadProfile(userData.id);
    setLoading(false);

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
        console.warn("Auto-update terms failed:", err);
      }
    }
  };

  // ===========================================================
  // INITIAL SESSION LOAD
  // ===========================================================
  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!ignore) await handleAuthChange("INITIAL_LOAD", session);
      } catch (err) {
        console.error("Init session error:", err);
        if (!ignore) setLoading(false);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!ignore) await handleAuthChange(event, session);
      }
    );

    return () => {
      ignore = true;
      subscription?.unsubscribe?.();
    };
  }, []);

  // ===========================================================
  // SIGN IN (IMMEDIATE USER SET)
  // ===========================================================
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { error };

      const loggedUser = data?.user;

      if (loggedUser) {
        setUser(loggedUser);
        await loadProfile(loggedUser.id);
        setLoading(false);
      }

      return { data };
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  // ===========================================================
  // SIGN OUT
  // ===========================================================
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

  // ===========================================================
  // UPDATE PROFILE
  // ===========================================================
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
