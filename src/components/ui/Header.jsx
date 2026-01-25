import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const toggleServices = () => setIsServicesOpen((p) => !p);

  const { isAuthenticated, signOut, userProfile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // 🔥 UNIFIED MENU
  const navigationItems = [
    { label: "Search Offers", path: "/search-offers", icon: "Search" },
    { label: "AI Chat", path: "/ai-chat-interface", icon: "MessageCircle" },
  ];

  const isActivePath = (path) => location?.pathname === path;
  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const servicesItems = [
    { label: "Flights", path: "/flights", icon: "Plane" },
    { label: "Hotels", path: "/hotels", icon: "Hotel" },
    { label: "Car Rental", path: "/car-rental", icon: "Car" },
    { label: "Activities", path: "/activities", icon: "Ticket" },
    { label: "Travel eSIM", path: "/esim", icon: "SimCard" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Plane" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              TravelAI Deals
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActivePath(item.path) ? "active" : ""
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}

            <div className="relative group">
              <button className="nav-item flex items-center space-x-2">
                <Icon name="Layers" size={18} />
                <span>Services</span>
              </button>

              <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-border bg-background shadow-lg
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                <div className="py-2">
                  {servicesItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted"
                    >
                      <Icon name={item.icon} size={16} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>



            {isAuthenticated && (
              <Link
                to="/user-profile"
                className={`nav-item ${isActivePath("/user-profile") ? "active" : ""}`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={18} />
                  <span>Profile</span>
                </div>
              </Link>
            )}


            {userProfile?.roles?.includes("admin") && (
              <Link
                to="/admin-dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${isActivePath("/admin-dashboard")
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-muted"
                  }`}
              >
                <Icon name="Shield" size={18} />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="ml-2"
                title="Logout"
              >
                <Icon name="LogOut" size={20} />
              </Button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="ml-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow">
          <nav className="px-4 py-4 space-y-2">

            {/* MAIN NAV */}
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActivePath(item.path)
                    ? "bg-muted font-medium"
                    : "hover:bg-muted"
                  }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* SERVICES DROPDOWN */}
            <div className="pt-3 border-t border-border">

              <button
                onClick={toggleServices}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-muted transition"
              >
                <div className="flex items-center gap-3">
                  <Icon name="Layers" size={20} />
                  <span className="text-sm font-medium">Services</span>
                </div>
                <Icon
                  name="ChevronDown"
                  size={18}
                  className={`transition-transform ${isServicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isServicesOpen && (
                <div className="mt-1 space-y-1">
                  {servicesItems.map((item) => {
                    const isActive = isActivePath(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`ml-6 flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive
                            ? "bg-muted font-medium"
                            : "hover:bg-muted"
                          }`}
                      >
                        <span
                          className={`h-5 w-1 rounded-full ${isActive ? "bg-primary" : "bg-transparent"
                            }`}
                        />
                        <Icon name={item.icon} size={18} />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* PROFILE */}
            {isAuthenticated && (
              <Link
                to="/user-profile"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActivePath("/user-profile")
                    ? "bg-muted font-medium"
                    : "hover:bg-muted"
                  }`}
              >
                <Icon name="User" size={20} />
                <span>Profile</span>
              </Link>
            )}

            {/* ADMIN */}
            {userProfile?.roles?.includes("admin") && (
              <Link
                to="/admin-dashboard"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActivePath("/admin-dashboard")
                    ? "bg-muted font-medium"
                    : "hover:bg-muted"
                  }`}
              >
                <Icon name="Shield" size={20} />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* AUTH */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                <Icon name="LogOut" size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/login");
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/register");
                  }}
                  className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg"
                >
                  Sign Up
                </button>
              </>
            )}

          </nav>
        </div>
      )}


      {
        isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/20"
            onClick={closeMobileMenu}
          />
        )
      }
    </header >
  );
};

export default Header;
