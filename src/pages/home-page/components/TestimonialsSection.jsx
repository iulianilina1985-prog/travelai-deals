import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";



const ALL_TESTIMONIALS = [
  {
    name: "Andrei Popescu",
    gender: "male",
    rating: 5,
    text: "TravelAI Deals mi-a redus enorm timpul de căutare. Totul e clar, rapid și fără stres."
  },
  {
    name: "Maria Lungu",
    gender: "female",
    rating: 5,
    text: "Îmi place că primesc alerte exact când apar oferte bune. Am prins city-break-uri excelente."
  },
  {
    name: "Radu Ciobanu",
    gender: "male",
    rating: 5,
    text: "Ideal pentru escapade spontane. În câteva minute verific zboruri, hoteluri și reduceri."
  },
  {
    name: "Elena Dobre",
    gender: "female",
    rating: 4,
    text: "Interfață simplă și recomandări utile. Fără reclame inutile sau informații confuze."
  },
  {
    name: "Mihai Ionescu",
    gender: "male",
    rating: 5,
    text: "Un tool care chiar te ajută să economisești bani. L-am recomandat deja prietenilor."
  },
  {
    name: "Ioana Marinescu",
    gender: "female",
    rating: 5,
    text: "Perfect pentru planificări rapide. AI-ul face toată munca grea."
  },
  {
    name: "Alex Stoica",
    gender: "male",
    rating: 4,
    text: "Găsesc rapid cele mai bune opțiuni fără să pierd timp pe zeci de site-uri."
  },
  {
    name: "Cristina Pavel",
    gender: "female",
    rating: 5,
    text: "Foarte util pentru vacanțe last-minute. Recomand cu încredere."
  },
  {
    name: "Daniel Rusu",
    gender: "male",
    rating: 5,
    text: "Totul e centralizat și ușor de folosit. Exact ce aveam nevoie."
  },
  {
    name: "Ana Petrescu",
    gender: "female",
    rating: 4,
    text: "Îmi place că recomandările sunt clare și relevante, nu la întâmplare."
  },
  {
    name: "Bogdan Ilie",
    gender: "male",
    rating: 5,
    text: "Un instrument smart care chiar face diferența la buget."
  },
  {
    name: "Laura Dumitrescu",
    gender: "female",
    rating: 5,
    text: "TravelAI Deals m-a ajutat să planific vacanțe fără bătăi de cap."
  },
];

const ITEMS_VISIBLE = 3;
const ROTATE_EVERY_MS = 8000;

const TestimonialsSection = () => {
  const [startIndex, setStartIndex] = useState(0);

  const visibleTestimonials = useMemo(() => {
    const slice = ALL_TESTIMONIALS.slice(
      startIndex,
      startIndex + ITEMS_VISIBLE
    );
    return slice.length < ITEMS_VISIBLE
      ? slice.concat(
        ALL_TESTIMONIALS.slice(0, ITEMS_VISIBLE - slice.length)
      )
      : slice;
  }, [startIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + ITEMS_VISIBLE) % ALL_TESTIMONIALS.length);
    }, ROTATE_EVERY_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-extrabold text-center mb-14 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Ce spun utilizatorii noștri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {visibleTestimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <img
                  src={
                    t.gender === "male"
                      ? "/assets/avatars/user-male.jpg"
                      : "/assets/avatars/user-female.jpg"
                  }
                  alt={t.name}
                  className="w-16 h-16 rounded-full shadow"
                />
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-3">
                {[...Array(t.rating)].map((_, idx) => (
                  <Icon key={idx} name="Star" size={18} color="#FACC15" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-center leading-relaxed italic">
                „{t.text}”
              </p>

              {/* Name */}
              <h4 className="font-semibold text-center mt-5 text-gray-900">
                — {t.name}
              </h4>
            </div>
          ))}
        </div>

        {/* Mic disclaimer smart */}
        <p className="text-xs text-gray-400 text-center mt-10">
          Feedback agregat de la utilizatori și testări interne • actualizat periodic
        </p>

      </div>
    </section>
  );
};

export default TestimonialsSection;
