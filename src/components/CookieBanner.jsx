import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg p-4 z-50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        <p className="text-sm text-muted-foreground">
          Folosim cookie-uri pentru a îmbunătăți experiența ta. 
          <Link to="/politica-cookie" className="text-blue-600 underline ml-1">
            Află mai multe
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/70"
          >
            Refuz
          </button>

          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
