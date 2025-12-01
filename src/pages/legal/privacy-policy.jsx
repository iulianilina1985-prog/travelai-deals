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
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 py-20 px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Politica de Confidențialitate 🔐
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Înțelege cum îți protejăm datele și cum funcționează platforma TravelAI Deals.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>
      </div>

      {/* CONȚINUT */}
      <div className="py-20 px-6 flex-1">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-10 shadow-xl">
          {/* Intro */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            Această Politică de Confidențialitate descrie modul în care platforma{" "}
            <strong>TravelAI Deals</strong>, operată de <strong>GLOBAL LINKNET SRL</strong>,
            prelucrează datele personale ale utilizatorilor, conform Regulamentului (UE) 2016/679 (GDPR).
          </p>

          <div className="space-y-12">

            {/* 1 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="User" size={24} className="text-primary" />
                1. Operatorul Datelor
              </h2>

              <p className="text-muted-foreground leading-relaxed">
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
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Database" size={24} className="text-primary" />
                2. Ce date colectăm
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-3">
                Colectăm următoarele tipuri de date:
              </p>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Email, nume, avatar (opțional)</li>
                <li>Preferințe de călătorie și interacțiuni cu funcțiile platformei</li>
                <li>IP, device, browser, cookie-uri</li>
                <li>Date legate de plăți și abonamente (Stripe)</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Target" size={24} className="text-primary" />
                3. Scopul prelucrării datelor
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Crearea și administrarea contului</li>
                <li>Funcționarea platformei și generarea de recomandări AI</li>
                <li>Procesarea abonamentelor prin Stripe</li>
                <li>Analiză internă pentru îmbunătățirea serviciilor</li>
                <li>Securitate și prevenirea fraudei</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Shield" size={24} className="text-primary" />
                4. Temeiul legal
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Prelucrarea are loc în baza art. 6 GDPR: contract, consimțământ,
                obligații legale și interes legitim.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Cookie" size={24} className="text-primary" />
                5. Cookie-uri
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Folosim cookie-uri necesare, analitice și de marketing. Utilizatorii
                sunt informați și pot gestiona preferințele.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Share2" size={24} className="text-primary" />
                6. Cui transmitem datele
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li><strong>Stripe</strong> – procesare plăți</li>
                <li><strong>Supabase</strong> – baze de date & autentificare</li>
                <li>Servicii analytics (date anonime)</li>
              </ul>

              <p className="text-muted-foreground mt-3">
                Nu vindem datele tale către terți.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Clock" size={24} className="text-primary" />
                7. Perioada de stocare
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Datele sunt păstrate cât timp contul este activ. Datele fiscale – 10 ani.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Key" size={24} className="text-primary" />
                8. Drepturile tale GDPR
              </h2>

              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li>Drept de acces</li>
                <li>Drept de rectificare</li>
                <li>Drept de ștergere</li>
                <li>Drept de portabilitate</li>
                <li>Drept de opoziție</li>
                <li>Plângere la ANSPDCP</li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Lock" size={24} className="text-primary" />
                9. Securitatea datelor
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Folosim criptare, autentificare token, sisteme anti-abuz,
                monitorizare și acces strict limitat la date.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="RefreshCw" size={24} className="text-primary" />
                10. Modificări ale politicii
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Politica poate fi actualizată periodic. Versiunea curentă este afișată în aplicație.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3">
                <Icon name="Mail" size={24} className="text-primary" />
                11. Contact
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Ne poți scrie pentru orice solicitare GDPR la:{" "}
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
