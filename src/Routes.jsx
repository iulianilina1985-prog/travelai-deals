import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import { userService } from "./services/userService";

// Layout
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import CookieBanner from "./components/CookieBanner";

// Pagini
import HomePage from "./pages/home-page";
import AdminDashboard from "./pages/admin-dashboard";
import LoginPage from "./pages/login";
import AIChatInterface from "./pages/ai-chat-interface";

import UserProfile from "./pages/user-profile";

import Register from "./pages/register";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPolicy from "./pages/legal/privacy-policy";
import ResetPasswordPage from "./pages/user-profile/components/reset-password";
import CookiePolicy from "./pages/legal/CookiePolicy";
import ContactPage from "./pages/legal/contact";

import AfiliereDisclosure from "./pages/legal/AfiliereDisclosure";
import GuideDestinatii2025 from "./pages/guides/GuideDestinatii2025";
import GuideBileteAvion from "./pages/guides/GuideBileteAvion";
import GuideHoteluri from "./pages/guides/GuideHoteluri";

import OffersPage from "./pages/offers"; // 🔥 PAGINA CORECTĂ
import FavoritesPage from "./pages/offers/FavoritesPage.jsx";

import CheckoutSuccess from "./pages/payments/CheckoutSuccess";
import CheckoutCancel from "./pages/payments/CheckoutCancel";
import TravelGuidePage from "./pages/guides/TravelGuidePage";

// Protecție rute
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ui/ProtectedAdminRoute";

import FlightsPage from "./pages/services/FlightsPage";
import HotelsPage from "./pages/services/HotelsPage";
import CarRentalPage from "./pages/services/CarRentalPage";
import EsimPage from "./pages/services/EsimPage";
import ActivitiesPage from "./pages/services/ActivitiesPage";


const PageViewTracker = () => {
  const location = useLocation();
  const lastPathRef = React.useRef("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const path = location.pathname + location.search + location.hash;
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    userService.trackEvent("page_view", "route_change", {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      referrer: document.referrer || null,
      language: navigator.language || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      platform: navigator.platform || null,
      screen: {
        width: window.screen?.width || null,
        height: window.screen?.height || null,
      },
      viewport: {
        width: window.innerWidth || null,
        height: window.innerHeight || null,
      },
      user_agent: navigator.userAgent || null,
    });
  }, [location]);

  return null;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <PageViewTracker />

        {/* Header global */}
        <Header />

        {/* Cookie Banner global */}
        <CookieBanner />

        <RouterRoutes>

          {/* Publice */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/affiliate-disclosure" element={<AfiliereDisclosure />} />
          <Route path="/guides/destinations-2025" element={<GuideDestinatii2025 />} />
          <Route path="/guides/cheap-tickets" element={<GuideBileteAvion />} />
          <Route path="/guides/hotel-booking" element={<GuideHoteluri />} />
          <Route path="/guides/:slug" element={<TravelGuidePage />} />

          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/car-rental" element={<CarRentalPage />} />
          <Route path="/esim" element={<EsimPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />



          {/* 🔥 New search page */}
          <Route path="/search-offers" element={<OffersPage />} />
          <Route
            path="/search-offers/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />

          {/* Legal */}
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Protejate */}
          <Route
            path="/ai-chat-interface"
            element={<AIChatInterface />}
          />




          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </RouterRoutes>

        {/* Footer global */}
        <Footer />

      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
