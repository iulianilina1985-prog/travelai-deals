// src/pages/legal/CookiePolicy.jsx

import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 md:pt-28">
      <Header />

      {/* HERO */}
      <section className="w-full text-center py-14 md:py-24 
                          bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20
                          border-b border-border shadow-inner px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex justify-center items-center gap-3">
          Cookie Policy 🍪
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Find out how we use cookies for a fast, secure and personalized experience.
        </p>

        <p className="text-xs md:text-sm text-muted-foreground mt-4">
          Last update: {new Date().toLocaleDateString("en-US")}
        </p>
      </section>

      {/* CONTENT */}
      <div className="py-10 md:py-20 px-4 md:px-6 flex-1">
        <div className="max-w-4xl mx-auto bg-card border border-border 
                        rounded-2xl md:rounded-3xl 
                        p-6 md:p-10 shadow-xl space-y-10 md:space-y-12 
                        text-sm md:text-base leading-relaxed">

          {/* INTRO */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            This policy explains how <strong>GLOBAL LINKNET SRL</strong>
            (CIF 48291648, J03/1287/2023, Pitesti, Str. Dorobantilor Nr. 14)
            uses cookies and similar technologies in the TravelAI Deals platform.
          </p>

          {/* 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Info" size={20} className="text-primary" />
              1. What are cookies?
            </h2>

            <p className="text-muted-foreground">
              Cookies are small files stored on your device, necessary for a
              personalized, fast and secure experience in the platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="List" size={20} className="text-primary" />
              2. Types of cookies used
            </h2>

            <div className="space-y-6 mt-4 text-muted-foreground">

              {/* a */}
              <div>
                <h3 className="text-lg font-semibold">a) Essential cookies</h3>
                <p>
                  Necessary for the operation of the platform: authentication, security, UI preferences.
                  They cannot be deactivated.
                </p>
              </div>

              {/* b */}
              <div>
                <h3 className="text-lg font-semibold">b) Analytics cookies</h3>
                <p>
                  Used to improve the service through anonymous statistics
                  (e.g. Google Analytics). Requires user consent.
                </p>
              </div>

              {/* c */}
              <div>
                <h3 className="text-lg font-semibold">c) Marketing and affiliate cookies</h3>
                <p>
                  Used for affiliate tracking and measuring conversions from
                  partner links (Booking, airlines, etc.). Requires consent.
                </p>
              </div>

            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Globe" size={20} className="text-primary" />
              3. Third-party cookies
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Google Analytics – anonymous statistics</li>
              <li>Stripe – secure payments and fraud prevention</li>
              <li>Affiliation platforms – conversion tracking</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Sliders" size={20} className="text-primary" />
              4. How can you control cookies?
            </h2>

            <p className="text-muted-foreground">
              You can manage cookies from your browser (deletion, partial or total blocking).
              Soon you will be able to manage cookies directly from the platform through a dedicated module.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="RotateCcw" size={20} className="text-primary" />
              5. Withdrawing consent
            </h2>

            <p className="text-muted-foreground">
              You can withdraw your consent at any time by deleting cookies or disabling
              optional ones.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Mail" size={20} className="text-primary" />
              6. Contact
            </h2>

            <p className="text-muted-foreground">
              For any questions about cookies, you can contact us at:
              <br />
              <a href="mailto:office@globallinknet.ro" className="text-primary underline">
                office@globallinknet.ro
              </a>
            </p>
          </section>

        </div>
      </div>

    </div>
  );
};

export default CookiePolicy;
