import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const location = useLocation();

  // 🔥 IMPORTANT: NU return null!
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        Se verifică sesiunea...
      </div>
    );
  }

  // 🔒 Dacă nu e logat → redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 👑 Admin logic
  const isAdmin = userProfile?.roles?.includes("admin");
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdmin && isAdminRoute) return children;

  return children;
};

export default ProtectedRoute;
