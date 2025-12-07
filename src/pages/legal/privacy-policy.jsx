// src/pages/legal/PrivacyPolicy.jsx

import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 
                      py-14 md:py-24 px-4 md:px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Politica de Confidențialitate 🔐
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          Înțelege cum îți protejăm datele și cum funcționează platforma TravelAI Deals.
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

          {/* Intro */}
          <p className="text-muted-foreground mb-10 text-base md:text-lg">
            Această Politică de Confidențialitate descrie modul în care platforma{" "}
            <strong>TravelAI Deals</strong>, operată de <strong>GLOBAL LINKNET SRL</strong>,
            prelucrează datele personale ale utilizatorilor, conform Regulamentului (UE)
            2016/679 (GDPR).
          </p>

          <div className="space-y-10 md:space-y-12">

            {/* 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="User" size={20} className="text-primary" />
                1. Operatorul Datelor
              </h2>

              <p className="text-muted-foreground">
                Operatorul responsabil pentru datele tale este:
                <br /><br />
                <strong>GLOBAL LINKNET SRL</strong><br />
                CUI: 48291648<br />
                J03/1287/2023<br />
                Str. Dorobanților 14, Bl. 51, Sc. A, Pitești, Argeș<br />
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
                2. Ce date colectăm
              </h2>

              <p className="text-muted-foreground mb-3">
                Colectăm următoarele tipuri de date:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Email, nume, avatar (opțional)</li>
                <li>Preferințe de călătorie și interacțiuni cu funcțiile platformei</li>
                <li>IP, device, browser, cookie-uri</li>
                <li>Date tehnice transmise către Stripe pentru plăți</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Target" size={20} className="text-primary" />
                3. Scopul prelucrării datelor
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Crearea și administrarea contului</li>
                <li>Generarea de recomandări AI</li>
                <li>Procesarea abonamentelor prin Stripe</li>
                <li>Analiză internă pentru îmbunătățirea platformei</li>
                <li>Securitate și prevenirea abuzului</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Shield" size={20} className="text-primary" />
                4. Temeiul legal
              </h2>

              <p className="text-muted-foreground">
                Prelucrarea are loc în baza art. 6 GDPR: contract, consimțământ,
                obligații legale și interes legitim.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Cookie" size={20} className="text-primary" />
                5. Cookie-uri
              </h2>

              <p className="text-muted-foreground">
                Folosim cookie-uri esențiale, analitice și de marketing pentru buna
                funcționare a platformei și pentru optimizare.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Share2" size={20} className="text-primary" />
                6. Cui transmitem datele
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li><strong>Stripe</strong> – procesare plăți</li>
                <li><strong>Supabase</strong> – baze de date, autentificare și securitate</li>
                <li>Servicii analytics (date agregate și anonimizate)</li>
              </ul>

              <p className="text-muted-foreground mt-3">
                Nu vindem și nu cedăm datele personale către terți.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Clock" size={20} className="text-primary" />
                7. Perioada de stocare
              </h2>

              <p className="text-muted-foreground">
                Datele sunt păstrate atât timp cât contul este activ.  
                Datele fiscale sunt păstrate conform legislației – 10 ani.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Key" size={20} className="text-primary" />
                8. Drepturile tale GDPR
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Drept de acces</li>
                <li>Drept de rectificare</li>
                <li>Drept de ștergere („dreptul de a fi uitat”)</li>
                <li>Drept de portabilitate</li>
                <li>Drept de opoziție</li>
                <li>Dreptul de a depune plângere la ANSPDCP</li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Lock" size={20} className="text-primary" />
                9. Securitatea datelor
              </h2>

              <p className="text-muted-foreground">
                Folosim criptare, autentificare pe token, sisteme anti-abuz și
                monitorizare activă pentru a proteja datele utilizatorilor.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="RefreshCw" size={20} className="text-primary" />
                10. Modificări ale politicii
              </h2>

              <p className="text-muted-foreground">
                Politica poate fi actualizată periodic. Versiunea curentă este afișată
                și disponibilă în platformă.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon name="Mail" size={20} className="text-primary" />
                11. Contact
              </h2>

              <p className="text-muted-foreground">
                Pentru orice întrebare legată de datele tale personale, ne poți scrie la:{" "}
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

export default PrivacyPolicy;
