// src/pages/legal/TermsPage.jsx

import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 md:pt-28">
      <Header />

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 
                      py-14 md:py-24 px-4 md:px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Terms and Conditions 📘
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Consult the rules, rights, and obligations regarding the use of TravelAI Deals.
        </p>

        <p className="text-xs md:text-sm text-muted-foreground mt-4">
          Last update: {new Date().toLocaleDateString("en-US")}
        </p>
      </div>

      {/* CONTENT */}
      <div className="py-10 md:py-20 px-4 md:px-6 flex-1">
        <div className="max-w-4xl mx-auto bg-card border border-border 
                        rounded-2xl md:rounded-3xl 
                        p-6 md:p-10 shadow-xl text-sm md:text-base leading-relaxed">

          {/* INTRO */}
          <p className="text-muted-foreground mb-10 text-base md:text-lg">
            The <strong>TravelAI Deals</strong> platform is operated by{" "}
            <strong>GLOBAL LINKNET SRL</strong>
            (CIF 48291648, J03/1287/2023), headquartered in Pitesti, Str. Dorobantilor nr. 14.
          </p>

          <div className="space-y-10 md:space-y-12">

            {/* 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Book" size={20} className="md:w-6 md:h-6 text-primary" />
                1. Definitions
              </h2>

              <p className="text-muted-foreground">
                <strong>"Platform"</strong> – the TravelAI Deals application and its functions.<br />
                <strong>"User"</strong> – any person accessing the service.<br />
                <strong>"Operator"</strong> – GLOBAL LINKNET SRL.<br />
                <strong>"Partners"</strong> – external offer providers (booking, flights, etc.).
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="CheckCircle" size={20} className="text-primary" />
                2. Acceptance of terms
              </h2>

              <p className="text-muted-foreground">
                By using the platform you confirm that you have read and accept these terms.
                If you do not agree, you must stop using the service.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Globe" size={20} className="text-primary" />
                3. Nature of the service
              </h2>

              <p className="text-muted-foreground">
                TravelAI Deals provides AI recommendations and travel offer aggregation.
                <strong> It is not a travel agency</strong>, it does not process reservations and does not sell services.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="UserPlus" size={20} className="text-primary" />
                4. Account creation and use
              </h2>

              <p className="text-muted-foreground mb-3">
                The user is responsible for:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>the accuracy of the entered data</li>
                <li>keeping the password confidential</li>
                <li>the activity carried out in the account</li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="CreditCard" size={20} className="text-primary" />
                5. Subscriptions and payments
              </h2>

              <p className="text-muted-foreground">
                Premium features are available on a monthly subscription basis, processed 100% through{" "}
                <strong>Stripe</strong>. GLOBAL LINKNET does not access or store card data.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Link" size={20} className="text-primary" />
                6. Affiliation
              </h2>

              <p className="text-muted-foreground">
                The platform can generate commissions through affiliate links, without changing the
                prices displayed to users.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="AlertTriangle" size={20} className="text-primary" />
                7. Limitation of liability
              </h2>

              <p className="text-muted-foreground mb-3">
                The operator does not guarantee:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>real-time update of offers</li>
                <li>the accuracy of the data provided by partners</li>
                <li>continuous availability of the platform</li>
              </ul>

              <p className="text-muted-foreground">
                Any problem related to reservations must be addressed directly to the partners.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Slash" size={20} className="text-primary" />
                8. Account suspension or deletion
              </h2>

              <p className="text-muted-foreground">
                We reserve the right to suspend or delete accounts in case of fraud,
                abuse or violations of the terms.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Shield" size={20} className="text-primary" />
                9. Personal data processing
              </h2>

              <p className="text-muted-foreground">
                Data processing is carried out according to GDPR.
                Full details in the{" "}
                <a href="/privacy-policy" className="text-primary underline">
                  Privacy Policy
                </a>.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="RefreshCcw" size={20} className="text-primary" />
                10. Modification of terms
              </h2>

              <p className="text-muted-foreground">
                We may periodically update these terms. The current version is available
                on the platform.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Mail" size={20} className="text-primary" />
                11. Contact
              </h2>

              <p className="text-muted-foreground">
                For clarifications you can write to us at:{" "}
                <a href="mailto:office@globallinknet.ro" className="text-primary underline">
                  office@globallinknet.ro
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>

    </div>
  );
};

export default TermsPage;
