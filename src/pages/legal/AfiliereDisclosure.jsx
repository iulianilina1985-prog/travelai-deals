import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const AfiliereDisclosure = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* HERO SECTION */}
      <section className="w-full text-center py-16 bg-white border-b border-border">
        <h1 className="text-5xl font-bold text-foreground mb-4 flex justify-center items-center gap-3">
          Disclosure Afiliere 🤝
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Transparență totală: vezi cum funcționează parteneriatele noastre și cum pot apărea comisioane.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>
      </section>

      {/* CARD CONTENT */}
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl shadow-xl p-10 space-y-10">

          {/* INTRO */}
          <p className="text-muted-foreground text-lg leading-relaxed">
            Platforma <strong>TravelAI Deals</strong> colaborează cu parteneri internaționali precum{" "}
            <strong>Booking.com, Klook, Trip.com, Momondo, Aviasales</strong> și alții. Unele linkuri afișate pe site 
            pot fi linkuri de afiliere.
          </p>

          {/* 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
              <Icon name="Link" size={22} className="text-primary" />
              1. Ce înseamnă linkurile de afiliere?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Dacă accesezi un link și finalizezi o rezervare, este posibil să primim un comision. 
              Important: <strong>nu plătești nimic în plus</strong>. Prețul este identic cu cel afișat 
              pe site-ul partenerului.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
              <Icon name="Rocket" size={22} className="text-primary" />
              2. De ce folosim afilierea?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Comisioanele ne permit să menținem platforma gratuită pentru utilizatori și să investim în 
              dezvoltarea funcționalităților AI care caută automat cele mai bune oferte pentru zboruri, 
              hoteluri și activități travel.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
              <Icon name="ShieldCheck" size={22} className="text-primary" />
              3. Transparență și obiectivitate
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Recomandările generate de AI nu sunt influențate de comisioane. AI-ul caută obiectiv 
              cele mai bune opțiuni disponibile în baza datelor furnizate de parteneri. Comisionul 
              nu afectează ordinea sau preferințele afișate.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
              <Icon name="Users" size={22} className="text-primary" />
              4. Cine sunt partenerii noștri?
            </h2>

            <ul className="space-y-2 ml-6 text-muted-foreground list-disc leading-relaxed">
              <li>Booking.com (hoteluri, cazări)</li>
              <li>Klook (activități și bilete)</li>
              <li>Momondo / Aviasales (zboruri)</li>
              <li>Trip.com (zboruri + hoteluri)</li>
              <li>Companii aeriene și furnizori globali de travel</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground mb-3">
              <Icon name="Mail" size={22} className="text-primary" />
              5. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Dacă ai întrebări despre afiliere sau dorești clarificări, ne poți contacta la:
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
