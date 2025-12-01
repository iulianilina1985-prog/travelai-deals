import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, signOut, userProfile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navigationItems = [
    { label: "Chat", path: "/ai-chat-interface", icon: "MessageCircle" },
    { label: "Ofertele mele", path: "/my-offers-dashboard", icon: "Gift" },
    { label: "Profil", path: "/user-profile", icon: "User" },
  ];

  const isActivePath = (path) => location?.pathname === path;
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ✅ LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Plane" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                TravelAI Deals
              </span>
            </Link>
          </div>

          {/* ✅ NAV DESKTOP */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${
                      isActivePath(item.path) ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={item.icon} size={18} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}

                {/* 👑 Buton vizibil doar pentru admin */}
                {userProfile?.roles?.includes("admin") && (
                  <Link
                    to="/admin-dashboard"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActivePath("/admin-dashboard")
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon name="Shield" size={18} />
                    <span>Panou Admin</span>
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="ml-2"
                  title="Delogare"
                >
                  <Icon name="LogOut" size={20} />
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Autentificare
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="ml-2 bg-transparent border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
                >
                  Înregistrare
                </button>
              </>
            )}
          </nav>

          {/* ✅ MOBILE BUTTON */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="relative"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ MENIU MOBIL */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-elevated animate-slide-down">
          <nav className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActivePath(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {/* 👑 Buton admin și în mobil */}
                {userProfile?.roles?.includes("admin") && (
                  <Link
                    to="/admin-dashboard"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActivePath("/admin-dashboard")
                        ? "bg-primary text-white"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon name="Shield" size={20} />
                    <span className="font-medium">Panou Admin</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  <Icon name="LogOut" size={20} />
                  <span className="font-medium">Delogare</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/login");
                  }}
                  className="w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Autentificare
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/register");
                  }}
                  className="w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
                >
                  Înregistrare
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* ✅ BACKDROP mobil */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-xs z-90"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;
