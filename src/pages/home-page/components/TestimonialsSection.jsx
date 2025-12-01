import React from "react";
import Icon from "../../../components/AppIcon";

const testimonials = [
  {
    name: "Andrei Popescu",
    text: "Nu mai pierd timp căutând pe zece site-uri. TravelAI Deals îmi arată într-un singur loc cele mai bune prețuri, filtrate inteligent. Economisesc bani și timp la fiecare călătorie.",
    avatar: "/assets/avatars/user1.png",
  },
  {
    name: "Maria Lungu",
    text: "Experiență super fluidă. Îmi place că AI-ul îmi trimite notificări exact când scad prețurile. Am prins două city-break-uri cu reducere majoră!",
    avatar: "/assets/avatars/user2.png",
  },
  {
    name: "Radu Ciobanu",
    text: "Ideal pentru escapade spontane. În 2 minute verific tot ce mă interesează: zboruri, hoteluri, prețuri și reduceri. E tool-ul meu preferat.",
    avatar: "/assets/avatars/user3.png",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-extrabold text-center mb-14 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Ce spun utilizatorii noștri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="
                bg-white 
                p-8 
                rounded-2xl 
                shadow-md 
                border 
                border-gray-200 
                hover:shadow-2xl 
                hover:-translate-y-2 
                transition 
                duration-300 
                relative
              "
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Stele rating */}
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Icon
                    key={idx}
                    name="Star"
                    size={18}
                    color="#FACC15"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-center leading-relaxed italic">
                „{t.text}”
              </p>

              {/* Nume */}
              <h4 className="font-bold text-center mt-5 text-gray-900">
                — {t.name}
              </h4>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
