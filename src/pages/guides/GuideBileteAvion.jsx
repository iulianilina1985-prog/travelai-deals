import React from "react";
import SEO from "../../components/seo/SEO";

const tips = [
  {
    title: "1. Use date flexibility",
    image: "/assets/bilet/flex.jpg",
    text: `Tuesday and Wednesday flights are generally the cheapest. 
           The price difference between a Friday and a Tuesday flight can reach up to 40 %.
           If you can leave a day earlier or later, you have a high chance of saving.`,
  },
  {
    title: "2. Check alternative airports",
    image: "/assets/bilet/aeroport.jpg",
    text: `Smaller airports often have reduced fees and are used by low - cost companies.
  Examples: Milan Bergamo, Paris Beauvais, Barcelona Girona.
           You can find prices even 60 % lower than at main airports.`,
  },
  {
    title: "3. Search in advance, but not too early",
    image: "/assets/bilet/zbor.jpg",
    text: `For European flights, the best time to book is 35–70 days in advance.
           For intercontinental flights, the optimal windows are between 2 and 5 months. 
           Too early or too late = increased prices.`,
  },
  {
    title: "4. Use incognito browsing",
    image: "/assets/bilet/incognito.jpg",
    text: `Some search engines may adjust prices based on your repeated interest
for the same route. 
           Search for tickets in an incognito window for cleaner results.`,
  },
  {
    title: "5. Choose connecting flights",
    image: "/assets/bilet/escala.jpg",
    text: `Direct flights are faster, but often more expensive.
           A cleverly chosen layover can reduce the total price by 30–50 %.`,
  },
  {
    title: "6. Activate smart price alerts in TravelAI Deals",
    image: "/assets/bilet/alerta.jpg",
    text: `Ticket prices change rapidly, and good offers disappear in a few hours.Subscribe to TravelAI Deals
          and you can activate personalized alerts for your favorite routes. 
          Every time the AI detects a significant price drop, you get a notification 
          instantly and can book at the best available rate.`,
  },

];

const GuideBileteAvion = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <SEO
        title="How to find the cheapest air tickets"
        description="Practical strategies to find cheaper flight tickets: flexible dates, alternative airports, booking windows and more."
        canonicalPath="/guides/cheap-tickets"
        image="/assets/bilet/zbor.jpg"
        type="article"
      />
      <h1 className="text-3xl font-bold mb-6 text-center">
        How to find the cheapest air tickets
      </h1>

      <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto mb-10">
        Air ticket prices change quickly — sometimes even 5 times in the same day.
        With the right strategies, you can save significant amounts on every trip.
        Here are the most effective methods used by experienced travelers in 2025.
      </p>

      {/* LIST OF TECHNIQUES */}
      {tips.map((t, index) => (
        <div key={index} className="mb-12">
          {/* Image */}
          <img
            src={t.image}
            alt={t.title}
            className="w-full h-64 object-cover rounded-xl shadow mb-4"
          />

          {/* Title */}
          <h2 className="text-2xl font-semibold mt-2 mb-2">{t.title}</h2>

          {/* Text */}
          <p className="text-gray-700 leading-relaxed">{t.text}</p>
        </div>
      ))}

      <p className="mt-12 text-sm text-gray-500 text-center">
        *Guide created by TravelAI – periodically updated with new smart-booking techniques.*
      </p>
    </div>
  );
};

export default GuideBileteAvion;
