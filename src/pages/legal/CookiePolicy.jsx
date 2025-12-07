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
          Politica de Cookie-uri 🍪
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Află cum folosim cookie-urile pentru o experiență rapidă, sigură și personalizată.
        </p>

        <p className="text-xs md:text-sm text-muted-foreground mt-4">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
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
            Această politică explică modul în care <strong>GLOBAL LINKNET SRL</strong> 
            (CUI 48291648, J03/1287/2023, Pitești, Str. Dorobanților Nr. 14)
            folosește cookie-uri și tehnologii similare în platforma TravelAI Deals.
          </p>

          {/* 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Info" size={20} className="text-primary" />
              1. Ce sunt cookie-urile?
            </h2>

            <p className="text-muted-foreground">
              Cookie-urile sunt fișiere mici stocate pe dispozitivul tău, necesare pentru o
              experiență personalizată, rapidă și sigură în platformă.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="List" size={20} className="text-primary" />
              2. Tipuri de cookie-uri folosite
            </h2>

            <div className="space-y-6 mt-4 text-muted-foreground">

              {/* a */}
              <div>
                <h3 className="text-lg font-semibold">a) Cookie-uri esențiale</h3>
                <p>
                  Necesare funcționării platformei: autentificare, securitate, preferințe UI.
                  Nu pot fi dezactivate.
                </p>
              </div>

              {/* b */}
              <div>
                <h3 className="text-lg font-semibold">b) Cookie-uri de analiză</h3>
                <p>
                  Folosite pentru îmbunătățirea serviciului prin statistici anonime
                  (ex. Google Analytics). Necesită consimțământul utilizatorului.
                </p>
              </div>

              {/* c */}
              <div>
                <h3 className="text-lg font-semibold">c) Cookie-uri de marketing și afiliere</h3>
                <p>
                  Utilizate pentru tracking afiliere și măsurarea conversiilor venite din link-uri
                  partenerilor (Booking, companii aeriene etc.). Necesită consimțământ.
                </p>
              </div>

            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Globe" size={20} className="text-primary" />
              3. Cookie-uri terțe
            </h2>

            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Google Analytics – statistici anonime</li>
              <li>Stripe – plăți sigure și prevenție fraudă</li>
              <li>Platforme de afiliere – tracking conversii</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Sliders" size={20} className="text-primary" />
              4. Cum poți controla cookie-urile?
            </h2>

            <p className="text-muted-foreground">
              Poți gestiona cookie-urile din browser (ștergere, blocare parțială sau totală).
              În curând vei putea gestiona cookie-urile direct din platformă printr-un modul dedicat.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="RotateCcw" size={20} className="text-primary" />
              5. Retragerea consimțământului
            </h2>

            <p className="text-muted-foreground">
              Poți retrage oricând consimțământul prin ștergerea cookie-urilor sau dezactivarea
              celor opționale.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
              <Icon name="Mail" size={20} className="text-primary" />
              6. Contact
            </h2>

            <p className="text-muted-foreground">
              Pentru orice întrebări despre cookie-uri, ne poți contacta la:
              <br />
              <a href="mailto:contact@travelai.ro" className="text-primary underline">
                contact@travelai.ro
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
