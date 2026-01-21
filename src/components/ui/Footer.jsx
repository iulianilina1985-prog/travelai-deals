import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-3 mt-0">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-3">

        {/* 🔹 Legal links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms-and-conditions" className="hover:text-foreground transition">
            Terms and Conditions
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/privacy-policy" className="hover:text-foreground transition">
            Privacy Policy
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/cookie-policy" className="hover:text-foreground transition">
            Cookie Policy
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/affiliate-disclosure" className="hover:text-foreground transition">
            Affiliate Disclosure
          </Link>

          <span className="text-muted-foreground">•</span>

          <Link to="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </div>

        {/* 🔹 Affiliate disclosure legal text (mandatory) */}
        <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
          TravelAI Deals uses affiliate links to partners such as Booking.com,
          Klook, Trip.com, Momondo and others. We may receive a commission if you make
          a reservation through the links displayed, at no additional cost to you.
        </p>

        {/* 🔹 Copyright */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TravelAI Deals — Created with 💙 in Romania.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
