import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-2">

        {/* 🔹 Linkuri legale */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/termeni-si-conditii" className="hover:text-foreground transition">
            Termeni și Condiții
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/politica-confidentialitate" className="hover:text-foreground transition">
            Politica de Confidențialitate
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/politica-cookie" className="hover:text-foreground transition">
            Politica Cookie
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </div>

        {/* 🔹 Copyright */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TravelAI Deals — Creat cu 💙 în România.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
