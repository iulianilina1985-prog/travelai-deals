// src/pages/legal/TermsPage.jsx

import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 
                      py-14 md:py-20 px-4 md:px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Termeni și Condiții 📘
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Consultă regulile, drepturile și obligațiile privind utilizarea TravelAI Deals.
        </p>

        <p className="text-xs md:text-sm text-muted-foreground mt-4">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>
      </div>

      {/* CONȚINUT */}
      <div className="py-10 md:py-20 px-4 md:px-6 flex-1">
        <div className="max-w-4xl mx-auto bg-card border border-border 
                        rounded-2xl md:rounded-3xl 
                        p-6 md:p-10 shadow-xl text-sm md:text-base leading-relaxed">

          {/* INTRO */}
          <p className="text-muted-foreground mb-10 text-base md:text-lg">
            Platforma <strong>TravelAI Deals</strong> este operată de{" "}
            <strong>GLOBAL LINKNET SRL</strong>
            (CUI 48291648, J03/1287/2023), cu sediul în Pitești, Str. Dorobanților nr. 14.
          </p>

          <div className="space-y-10 md:space-y-12">

            {/* 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Book" size={20} className="md:w-6 md:h-6 text-primary" />
                1. Definiții
              </h2>

              <p className="text-muted-foreground">
                <strong>„Platformă”</strong> – aplicația TravelAI Deals și funcțiile sale.<br />
                <strong>„Utilizator”</strong> – orice persoană care accesează serviciul.<br />
                <strong>„Operator”</strong> – GLOBAL LINKNET SRL.<br />
                <strong>„Parteneri”</strong> – furnizori externi de oferte (booking, zboruri etc.).
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="CheckCircle" size={20} className="text-primary" />
                2. Acceptarea termenilor
              </h2>

              <p className="text-muted-foreground">
                Folosind platforma confirmi că ai citit și accepți acești termeni. 
                Dacă nu ești de acord, trebuie să oprești utilizarea serviciului.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Globe" size={20} className="text-primary" />
                3. Natura serviciului
              </h2>

              <p className="text-muted-foreground">
                TravelAI Deals oferă recomandări AI și agregare de oferte turistice. 
                <strong> Nu este agenție de turism</strong>, nu procesează rezervări și nu vinde servicii.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="UserPlus" size={20} className="text-primary" />
                4. Crearea și utilizarea contului
              </h2>

              <p className="text-muted-foreground mb-3">
                Utilizatorul este responsabil pentru:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>exactitatea datelor introduse</li>
                <li>păstrarea confidențialității parolei</li>
                <li>activitatea desfășurată în cont</li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="CreditCard" size={20} className="text-primary" />
                5. Abonamente și plăți
              </h2>

              <p className="text-muted-foreground">
                Funcțiile premium sunt disponibile pe bază de abonament lunar, procesat 100% prin{" "}
                <strong>Stripe</strong>. GLOBAL LINKNET nu accesează și nu stochează date de card.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Link" size={20} className="text-primary" />
                6. Afiliere
              </h2>

              <p className="text-muted-foreground">
                Platforma poate genera comisioane prin link-uri de afiliere, fără a modifica
                prețurile afișate utilizatorilor.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="AlertTriangle" size={20} className="text-primary" />
                7. Limitarea responsabilității
              </h2>

              <p className="text-muted-foreground mb-3">
                Operatorul nu garantează:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>actualizarea în timp real a ofertelor</li>
                <li>exactitatea datelor furnizate de parteneri</li>
                <li>disponibilitatea continuă a platformei</li>
              </ul>

              <p className="text-muted-foreground">
                Orice problemă legată de rezervări trebuie adresată direct partenerilor.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Slash" size={20} className="text-primary" />
                8. Suspendarea sau ștergerea contului
              </h2>

              <p className="text-muted-foreground">
                Ne rezervăm dreptul de a suspenda sau șterge conturi în caz de fraudă,
                abuz sau încălcări ale termenilor.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Shield" size={20} className="text-primary" />
                9. Prelucrarea datelor personale
              </h2>

              <p className="text-muted-foreground">
                Prelucrarea datelor este realizată conform GDPR.
                Detalii complete în{" "}
                <a href="/politica-confidentialitate" className="text-primary underline">
                  Politica de Confidențialitate
                </a>.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="RefreshCcw" size={20} className="text-primary" />
                10. Modificarea termenilor
              </h2>

              <p className="text-muted-foreground">
                Putem actualiza periodic acești termeni. Versiunea curentă este disponibilă
                în platformă.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Mail" size={20} className="text-primary" />
                11. Contact
              </h2>

              <p className="text-muted-foreground">
                Pentru clarificări ne poți scrie la:{" "}
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

export default TermsPage;
