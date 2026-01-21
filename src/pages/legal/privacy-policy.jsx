// src/pages/legal/PrivacyPolicy.jsx

import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 md:pt-28">
      <Header />

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 
                      py-14 md:py-24 px-4 md:px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Privacy Policy 🔐
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Understand how we protect your data and how the TravelAI Deals platform works.
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

          {/* Intro */}
          <p className="text-muted-foreground mb-10 text-base md:text-lg">
            This Privacy Policy describes how the{" "}
            <strong>TravelAI Deals</strong> platform, operated by <strong>GLOBAL LINKNET SRL</strong>,
            processes the personal data of users, according to Regulation (EU)
            2016/679 (GDPR).
          </p>

          <div className="space-y-10 md:space-y-12">

            {/* 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="User" size={20} className="text-primary" />
                1. Data Controller
              </h2>

              <p className="text-muted-foreground">
                The controller responsible for your data is:
                <br /><br />
                <strong>GLOBAL LINKNET SRL</strong><br />
                CIF: 48291648<br />
                J03/1287/2023<br />
                Str. Dorobantilor 14, Bl. 51, Sc. A, Pitesti, Arges<br />
                Email:{" "}
                <a href="mailto:contact@travelai.ro" className="text-primary underline">
                  contact@travelai.ro
                </a>
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Database" size={20} className="text-primary" />
                2. What data we collect
              </h2>

              <p className="text-muted-foreground mb-3">
                We collect the following types of data:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Email, name, avatar (optional)</li>
                <li>Travel preferences and interactions with platform features</li>
                <li>IP, device, browser, cookies</li>
                <li>Technical data transmitted to Stripe for payments</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Target" size={20} className="text-primary" />
                3. Purpose of data processing
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Account creation and administration</li>
                <li>Generating AI recommendations</li>
                <li>Processing subscriptions through Stripe</li>
                <li>Internal analysis to improve the platform</li>
                <li>Security and abuse prevention</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Shield" size={20} className="text-primary" />
                4. Legal basis
              </h2>

              <p className="text-muted-foreground">
                Processing takes place based on art. 6 GDPR: contract, consent,
                legal obligations and legitimate interest.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Cookie" size={20} className="text-primary" />
                5. Cookies
              </h2>

              <p className="text-muted-foreground">
                We use essential, analytical and marketing cookies for the good
                functioning of the platform and for optimization.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Share2" size={20} className="text-primary" />
                6. To whom we transmit the data
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li><strong>Stripe</strong> – payment processing</li>
                <li><strong>Supabase</strong> – databases, authentication and security</li>
                <li>Analytics services (aggregated and anonymized data)</li>
              </ul>

              <p className="text-muted-foreground mt-3">
                We do not sell or pass on personal data to third parties.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Clock" size={20} className="text-primary" />
                7. Storage period
              </h2>

              <p className="text-muted-foreground">
                The data is kept as long as the account is active.
                Fiscal data is kept according to legislation – 10 years.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Key" size={20} className="text-primary" />
                8. Your GDPR rights
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Right of access</li>
                <li>Right to rectification</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to portability</li>
                <li>Right to object</li>
                <li>The right to file a complaint with ANSPDCP</li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Lock" size={20} className="text-primary" />
                9. Data security
              </h2>

              <p className="text-muted-foreground">
                We use encryption, token authentication, anti-abuse systems and
                active monitoring to protect user data.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="RefreshCw" size={20} className="text-primary" />
                10. Policy changes
              </h2>

              <p className="text-muted-foreground">
                The policy can be updated periodically. The current version is displayed
                and available on the platform.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Mail" size={20} className="text-primary" />
                11. Contact
              </h2>

              <p className="text-muted-foreground">
                For any question related to your personal data, you can write to us at:{" "}
                <a href="mailto:contact@travelai.ro" className="text-primary underline">
                  contact@travelai.ro
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
