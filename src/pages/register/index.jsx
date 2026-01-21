import React, { useState } from "react";
import Header from "../../components/ui/Header";
import TrustSignals from "./components/TrustSignals";
import Icon from "../../components/AppIcon";
import RegistrationForm from "./components/RegistrationForm";
import SubscriptionTierSelector from "./components/SubscriptionTierSelector";
import authService from "../../services/authService";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [selectedTier, setSelectedTier] = useState("free");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // STEP 1 → colectăm datele din formular
  const handleFormSubmit = (data) => {
    setFormData({ ...data, selectedTier });
    setErrorMessage("");
    setCurrentStep(2);
  };

  // STEP 2 → facem signup folosind DOAR authService
  const handleRegistration = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!formData?.email || !formData?.password) {
        setErrorMessage("Please fill in your email and password.");
        setLoading(false);
        return;
      }

      const normalizedEmail = formData.email.trim().toLowerCase();

      // Signup corect prin authService (versiunea v2, fără PKCE, fără redirect_to în query)
      const { data, error } = await authService.signUp(
        normalizedEmail,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          agreeToMarketing: formData.agreeToMarketing,
          selectedTier,
        }
      );

      if (error) {
        setErrorMessage(error.message || "An error occurred during registration.");
        setLoading(false);
        return;
      }

      // SUCCESS → mergem la login cu mesaj
      window.location.href = "/login?signup=success";

    } catch (err) {
      console.error("Eroare la înregistrare:", err);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* LEFT */}
            <div className="order-2 lg:order-1">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">

                <div className="flex items-center justify-center mb-6 space-x-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Plane" size={24} color="white" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Create your TravelAI Deals account
                  </h1>
                </div>

                {/* error UI */}
                {errorMessage && (
                  <div className="bg-red-100 border border-red-300 text-red-700 text-sm p-3 rounded mb-4">
                    {errorMessage}
                  </div>
                )}

                {/* step 1 */}
                {currentStep === 1 && (
                  <>
                    <p className="text-muted-foreground text-sm mb-6 text-center">
                      Fill in your details to start your adventure.
                    </p>
                    <RegistrationForm onSubmit={handleFormSubmit} loading={loading} />
                  </>
                )}

                {/* step 2 */}
                {currentStep === 2 && (
                  <>
                    <h2 className="text-lg font-semibold mb-3 text-center">
                      Choose the right plan for you
                    </h2>

                    <SubscriptionTierSelector
                      selectedTier={selectedTier}
                      onTierChange={setSelectedTier}
                    />

                    <div className="mt-6 flex items-center justify-between">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-muted-foreground hover:text-foreground flex items-center space-x-2"
                      >
                        <Icon name="ArrowLeft" size={16} />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleRegistration}
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? "Creating..." : "Finish Registration"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="order-1 lg:order-2">
              <TrustSignals />
            </div>

          </div>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-border text-center">
        <div className="container mx-auto px-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TravelAI Deals. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
