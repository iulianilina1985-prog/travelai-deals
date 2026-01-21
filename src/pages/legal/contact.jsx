// src/pages/legal/ContactPage.jsx
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
    <div className="bg-background min-h-screen flex flex-col pt-24 md:pt-28">
      <Header />

      {/* HERO */}
      <div className="
        w-full 
        bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 
        py-14 md:py-24 
        px-4 md:px-6 
        text-center 
        border-b border-border shadow-inner
      ">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Let's talk! 👋
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We are here to make your experience as clear as possible. Whether you have questions,
          feedback or proposals, write to us and we will answer you quickly.
        </p>
      </div>

      {/* CONTACT GRID */}
      <div className="w-full px-4 md:px-10 py-12 md:py-20 flex-1">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 md:gap-16">

          {/* COMPANY DATA CARD */}
          <div className="
            bg-card border border-border 
            p-6 md:p-12 
            rounded-2xl md:rounded-3xl 
            shadow-xl hover:shadow-2xl 
            transition-shadow duration-300 
            text-base md:text-lg space-y-6
          ">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Icon name="Building" size={26} className="text-primary" />
              Company Data
            </h2>

            <p><strong>Company:</strong> Global Linknet SRL</p>
            <p><strong>CIF:</strong> 48291648</p>
            <p><strong>Trade Register:</strong> J03/1287/2023</p>

            <p>
              <strong>Address:</strong><br />
              Arges County, Pitesti City<br />
              Str. Dorobantilor, Nr. 14, Bl. 51, Sc. A
            </p>

            <p>
              <strong>Email:</strong><br />
              <a href="mailto:contact@travelai.ro" className="text-primary underline">
                contact@travelai.ro
              </a>
            </p>

            <p>
              <strong>Schedule:</strong><br />
              Monday – Friday: 09:00 – 18:00<br />
              Weekend: Closed
            </p>
          </div>

          {/* FORM */}
          <div className="
            bg-card border border-border 
            p-6 md:p-12 
            rounded-2xl md:rounded-3xl 
            shadow-xl hover:shadow-2xl 
            transition-shadow duration-300
          ">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Icon name="Mail" size={26} className="text-primary" />
              Send us a message
            </h2>

            <form onSubmit={sendEmail} className="space-y-6 md:space-y-8 text-base md:text-lg">

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-muted border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-muted border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows="6"
                  required
                  className="w-full bg-muted border border-border rounded-xl px-4 md:px-5 py-3 md:py-4 text-base"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="
                  bg-gradient-to-r from-primary to-secondary 
                  text-white 
                  px-6 md:px-8 
                  py-3 md:py-4 
                  rounded-xl font-medium 
                  hover:opacity-90 transition 
                  w-full shadow-lg
                "
              >
                {sending ? "Sending..." : "Send message"}
              </button>

              {status === "success" && (
                <p className="text-green-600 text-center font-medium">
                  Message sent successfully! 🎉
                </p>
              )}

              {status === "error" && (
                <p className="text-red-600 text-center font-medium">
                  Error sending. Try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ABOUT US */}
      <section className="w-full py-16 md:py-24 px-4 md:px-6 bg-muted border-t border-border">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12 md:mb-16">
          About us
        </h2>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

          {/* CARD 1 */}
          <div className="bg-card border border-border p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-xl text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <Icon name="Target" size={40} className="mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To make AI technology accessible to all and transform vacation planning into
              a fast and efficient experience.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-card border border-border p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-xl text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <Icon name="Compass" size={40} className="mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-semibold mb-4">What we do?</h3>
            <p className="text-muted-foreground leading-relaxed">
              We offer personalized recommendations for destinations,
              flights, hotels, and packages — all generated instantly by AI.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-card border border-border p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-xl text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <Icon name="Handshake" size={40} className="mx-auto mb-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Our Values</h3>
            <p className="text-muted-foreground leading-relaxed">
              Fairness, transparency, and neutrality.
              We only offer real recommendations — without hidden ads.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
