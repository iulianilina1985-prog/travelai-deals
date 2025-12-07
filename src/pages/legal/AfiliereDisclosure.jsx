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
          Disclosure Afiliere 🤝
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transparență totală: vezi cum funcționează parteneriatele noastre și cum pot apărea comisioane.
        </p>

        <p className="text-xs md:text-sm text-muted-foreground mt-4">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
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
            Platforma <strong>TravelAI Deals</strong> colaborează cu parteneri internaționali precum{" "}
            <strong>Booking.com, Klook, Trip.com, Momondo, Aviasales</strong> și alții. Unele linkuri de pe site pot fi
            linkuri de afiliere.
          </p>

          {/* 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Link" size={20} className="text-primary" />
              1. Ce înseamnă linkurile de afiliere?
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Dacă accesezi un link și finalizezi o rezervare, este posibil să primim un comision. Important:
              <strong> nu plătești nimic în plus</strong>. Prețul rămâne identic cu cel afișat pe site-ul partenerului.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Rocket" size={20} className="text-primary" />
              2. De ce folosim afilierea?
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Comisioanele ne permit să menținem platforma gratuită și să investim în dezvoltarea funcțiilor AI care
              caută automat cele mai bune oferte pentru zboruri, hoteluri și activități travel.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="ShieldCheck" size={20} className="text-primary" />
              3. Transparență și obiectivitate
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Recomandările AI nu sunt influențate de parteneriate sau comisioane. Algoritmul caută obiectiv cele mai
              bune opțiuni disponibile în baza datelor furnizate de parteneri. Comisionul nu afectează ordinea și nici
              preferințele afișate.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Users" size={20} className="text-primary" />
              4. Cine sunt partenerii noștri?
            </h2>

            <ul className="space-y-2 ml-6 text-muted-foreground list-disc leading-relaxed text-sm md:text-base">
              <li>Booking.com – hoteluri și cazări</li>
              <li>Klook – activități & bilete</li>
              <li>Momondo / Aviasales – zboruri</li>
              <li>Trip.com – zboruri & hoteluri</li>
              <li>Parteneri globali din industria travel</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg md:text-2xl font-semibold text-foreground mb-3">
              <Icon name="Mail" size={20} className="text-primary" />
              5. Contact
            </h2>

            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Pentru întrebări suplimentare legate de afiliere, ne poți contacta la:
              <br />
              <a href="mailto:contact@travelai-deals.com" className="text-primary underline">
                contact@travelai-deals.com
              </a>
            </p>
          </section>
        </div>
      </div>

      
    </div>
  );
};

export default AfiliereDisclosure;
