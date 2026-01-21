import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const AfiliereDisclosure = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 md:pt-28">
      <Header />

      {/* HERO SECTION */}
      <section
        className="
          w-full text-center 
          py-14 md:py-24 
          px-4 md:px-6 
          bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20
          border-b border-border shadow-inner
        "
      >
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 flex justify-center items-center gap-3">
          Affiliate Disclosure 🤝
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Total transparency: see how our partnerships work and how commissions may arise.
        </p>

        <p className="text-xs md:text-sm text-muted-foreground mt-4">
          Last update: {new Date().toLocaleDateString("en-US")}
        </p>
      </section>

      {/* CONTENT CARD */}
      <div className="flex-1 py-12 md:py-20 px-4 md:px-6">
        <div
          className="
            max-w-4xl mx-auto 
            bg-card border border-border 
            rounded-2xl md:rounded-3xl 
            shadow-xl p-6 md:p-10 
            space-y-10
          "
        >
          {/* INTRO */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            The <strong>TravelAI Deals</strong> platform collaborates with international partners such as{" "}
            <strong>Booking.com, Klook, Trip.com, Momondo, Aviasales</strong> and others. Some links on the site may be
            affiliate links.
          </p>

          {/* 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Link" size={20} className="text-primary" />
              1. What do affiliate links mean?
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              If you access a link and complete a reservation, we may receive a commission. Important:
              <strong> you don't pay anything extra</strong>. The price remains identical to the one displayed on the partner's site.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Rocket" size={20} className="text-primary" />
              2. Why do we use affiliation?
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Commissions allow us to keep the platform free and invest in the development of AI functions that
              automatically search for the best deals for flights, hotels, and travel activities.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="ShieldCheck" size={20} className="text-primary" />
              3. Transparency and objectivity
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              AI recommendations are not influenced by partnerships or commissions. The algorithm searches objectively for the
              best available options based on data provided by partners. The commission does not affect the order or the
              displayed preferences.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Users" size={20} className="text-primary" />
              4. Who are our partners?
            </h2>

            <ul className="space-y-2 ml-6 text-muted-foreground list-disc leading-relaxed text-sm md:text-base">
              <li>Booking.com – hotels and accommodation</li>
              <li>Klook – activities & tickets</li>
              <li>Momondo / Aviasales – flights</li>
              <li>Trip.com – flights & hotels</li>
              <li>Global partners in the travel industry</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Mail" size={20} className="text-primary" />
              5. Contact
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              For additional questions related to affiliation, you can contact us at:
              <br />
              <a href="mailto:contact@travelai-deals.com" className="text-primary underline">
                contact@travelai-deals.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AfiliereDisclosure;
