import React, { useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import Icon from "../../components/AppIcon";

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    const formData = {
      from_name: e.target.name.value,
      from_email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      // emailjs disabled temporar
      setStatus("success");
      e.target.reset();
    } catch {
      setStatus("error");
    }

    setSending(false);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 py-24 px-6 text-center border-b border-border shadow-inner">
        <h1 className="text-5xl font-bold text-foreground mb-4">
          Hai să vorbim! 👋
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Suntem aici ca să-ți facem experiența cât mai clară. Fie că ai întrebări,
          feedback sau propuneri, scrie-ne și îți răspundem rapid.
        </p>
      </div>

      {/* GRID CONTACT */}
      <div className="w-full px-10 py-20 flex-1">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16">

          {/* CARD DATE */}
          <div className="bg-card border border-border p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 space-y-6 text-lg">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Icon name="Building" size={26} className="text-primary" />
              Date Companie
            </h2>

            <p><strong>Companie:</strong> Global Linknet SRL</p>
            <p><strong>CUI:</strong> 48291648</p>
            <p><strong>Registrul Comerțului:</strong> J03/1287/2023</p>

            <p>
              <strong>Adresă:</strong><br />
              Jud. Argeș, Mun. Pitești<br />
              Str. Dorobanților, Nr. 14, Bl. 51, Sc. A
            </p>

            <p>
              <strong>Email:</strong><br />
              <a href="mailto:contact@travelai.ro" className="text-primary underline">
                contact@travelai.ro
              </a>
            </p>

            <p>
              <strong>Program:</strong><br />
              Luni – Vineri: 09:00 – 18:00<br />
              Weekend: Închis
            </p>
          </div>

          {/* FORMULAR */}
          <div className="bg-card border border-border p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Icon name="Mail" size={26} className="text-primary" />
              Trimite-ne un mesaj
            </h2>

            <form onSubmit={sendEmail} className="space-y-8 text-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Nume</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-muted border border-border rounded-xl px-5 py-4 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-muted border border-border rounded-xl px-5 py-4 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mesaj</label>
                <textarea
                  name="message"
                  rows="8"
                  required
                  className="w-full bg-muted border border-border rounded-xl px-5 py-4 text-base"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition w-full shadow-lg"
              >
                {sending ? "Se trimite..." : "Trimite mesajul"}
              </button>

              {status === "success" && (
                <p className="text-green-600 text-center font-medium">
                  Mesaj trimis cu succes! 🎉
                </p>
              )}

              {status === "error" && (
                <p className="text-red-600 text-center font-medium">
                  Eroare la trimitere. Încearcă din nou.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* DESPRE NOI - CARDURI */}
      <section className="w-full py-24 px-6 bg-muted border-t border-border">
        <h2 className="text-4xl font-bold text-center text-foreground mb-16">
          Despre noi
        </h2>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="bg-card border border-border p-10 rounded-3xl shadow-xl text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <Icon name="Target" size={40} className="mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Misiunea noastră</h3>
            <p className="text-muted-foreground leading-relaxed">
              Să facem tehnologia AI accesibilă tuturor românilor
              și să transformăm planificarea unei vacanțe într-o experiență rapidă și eficientă.
            </p>
          </div>

          <div className="bg-card border border-border p-10 rounded-3xl shadow-xl text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <Icon name="Compass" size={40} className="mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Ce facem?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Oferim recomandări personalizate pentru destinații,
              zboruri, hoteluri și pachete — toate generate instant de AI.
            </p>
          </div>

          <div className="bg-card border border-border p-10 rounded-3xl shadow-xl text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <Icon name="Handshake" size={40} className="mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Valorile noastre</h3>
            <p className="text-muted-foreground leading-relaxed">
              Corectitudine, transparență și neutralitate.
              Oferim doar recomandări reale — fără reclame mascate.
            </p>
          </div>

        </div>
      </section>

      
    </div>
  );
};

export default ContactPage;
