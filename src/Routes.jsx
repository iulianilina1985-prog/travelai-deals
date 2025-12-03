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
import SubscriptionManagement from "./pages/subscription-management";
import UserProfile from "./pages/user-profile";
import MyOffersDashboard from "./pages/my-offers-dashboard";
import Register from "./pages/register";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPolicy from "./pages/legal/privacy-policy";
import ResetPasswordPage from "./pages/user-profile/components/reset-password";
import CookiePolicy from "./pages/legal/CookiePolicy";
import ContactPage from "./pages/legal/contact";
import Hotels from "./pages/hotels/Hotels";
import AfiliereDisclosure from "./pages/legal/AfiliereDisclosure";

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

        {/* 🔥 Header vizibil pe toate paginile */}
        <Header />

        {/* 🔥 Cookie Banner integrat corect în Router */}
        <CookieBanner />

        <RouterRoutes>
          {/* Publice */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/politica-cookie" element={<CookiePolicy />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/afiliere-disclosure" element={<AfiliereDisclosure />} />

          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />

          {/* Legale */}
          <Route path="/termeni-si-conditii" element={<TermsPage />} />
          <Route path="/politica-confidentialitate" element={<PrivacyPolicy />} />

          {/* Protejate */}
          <Route
            path="/ai-chat-interface"
            element={
              <ProtectedRoute>
                <AIChatInterface />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscription-management"
            element={
              <ProtectedRoute>
                <SubscriptionManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-offers-dashboard"
            element={
              <ProtectedRoute>
                <MyOffersDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin-only */}
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

        {/* 🔥 Footer vizibil pe toate paginile */}
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
