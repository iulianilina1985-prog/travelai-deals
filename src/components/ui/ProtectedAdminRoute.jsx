import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;

    // 🔒 dacă nu e logat
    if (!userProfile) {
      navigate("/login");
      return;
    }

    // 👑 dacă are rol admin → acces permis
    if (userProfile.roles?.includes("admin")) {
      setIsAllowed(true);
    } else {
      // 🚫 fără rol admin → redirect către homepage
      navigate("/");
    }
  }, [userProfile, loading, navigate]);

  if (loading || !isAllowed) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Se verifică accesul...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
