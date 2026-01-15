import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

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

// Protecție rute
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ui/ProtectedAdminRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

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
          <Route path="/politica-cookie" element={<CookiePolicy />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/afiliere-disclosure" element={<AfiliereDisclosure />} />
          <Route path="/ghiduri/destinatii-2025" element={<GuideDestinatii2025 />} />
          <Route path="/ghiduri/bilete-ieftine" element={<GuideBileteAvion />} />
          <Route path="/ghiduri/rezervare-hotel" element={<GuideHoteluri />} />

          {/* 🔥 Noua pagină de căutare */}
          <Route path="/cauta-oferte" element={<OffersPage />} />
          <Route
            path="/cauta-oferte/favorite"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />

          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />

          {/* Legale */}
          <Route path="/termeni-si-conditii" element={<TermsPage />} />
          <Route path="/politica-confidentialitate" element={<PrivacyPolicy />} />

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
