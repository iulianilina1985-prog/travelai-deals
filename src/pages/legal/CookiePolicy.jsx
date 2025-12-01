import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 py-20 px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Politica de Cookie-uri 🍪
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Află cum folosim cookie-urile pentru a-ți oferi o experiență rapidă și personalizată.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>
      </div>

      {/* CONȚINUT */}
      <div className="py-20 px-6 flex-1">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-10 shadow-xl">

          {/* Intro */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Această politică explică modul în care <strong>GLOBAL LINKNET SRL</strong>
            (CUI 48291648, J03/1287/2023, Pitești, Str. Dorobanților nr. 14, bl. 51, sc. A)
            folosește cookie-uri și tehnologii similare în cadrul platformei <strong>TravelAI Deals</strong>.
          </p>

          {/* SECȚIUNI */}
          <div className="space-y-12">

            {/* 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground mb-3">
                <Icon name="Info" size={24} className="text-primary" />
                1. Ce sunt cookie-urile?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookie-urile sunt fișiere mici salvate pe dispozitivul tău care ne permit
                să oferim o experiență personalizată, sigură și optimizată.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground mb-3">
                <Icon name="List" size={24} className="text-primary" />
                2. Tipuri de cookie-uri folosite
              </h2>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">a) Cookie-uri esențiale</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Necesare pentru funcționarea platformei (autentificare, securitate, preferințe).
                    Nu pot fi dezactivate.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">b) Cookie-uri de analiză</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Folosite pentru îmbunătățirea serviciilor noastre prin statistici anonime
                    (ex. Google Analytics). Necesită acordul tău.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">c) Cookie-uri de marketing și afiliere</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Folosite pentru tracking afiliere și măsurarea conversiilor venite prin
                    link-urile partenerilor (Booking, zboruri, etc.). Necesită acordul tău.
                  </p>
                </div>
              </div>
            </section>

            {/* 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground mb-3">
                <Icon name="Globe" size={24} className="text-primary" />
                3. Cookie-uri terțe
              </h2>

              <ul className="space-y-2 ml-6 text-muted-foreground list-disc leading-relaxed">
                <li>Google Analytics</li>
                <li>Stripe (pentru plăți securizate)</li>
                <li>Parteneri de afiliere (Booking, companii aeriene etc.)</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground mb-3">
                <Icon name="Sliders" size={24} className="text-primary" />
                4. Cum poți controla cookie-urile?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Poți gestiona cookie-urile din setările browserului (ștergere, blocare totală
                sau parțială). În curând, vei putea gestiona cookie-urile direct din platforma TravelAI.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground mb-3">
                <Icon name="RotateCcw" size={24} className="text-primary" />
                5. Retragerea consimțământului
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Poți retrage consimțământul oricând prin ștergerea cookie-urilor din browser
                sau dezactivarea celor opționale.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-foreground mb-3">
                <Icon name="Mail" size={24} className="text-primary" />
                6. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Pentru întrebări legate de cookie-uri, ne poți contacta la:
                <br />
                <a href="mailto:contact@travelai.ro" className="text-primary underline">
                  contact@travelai.ro
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CookiePolicy;
