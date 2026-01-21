import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";



const ALL_TESTIMONIALS = [
  {
    name: "Andrei Popescu",
    gender: "male",
    rating: 5,
    text: "TravelAI Deals has significantly reduced my search time. Everything is clear, fast, and stress-free."
  },
  {
    name: "Maria Lungu",
    gender: "female",
    rating: 5,
    text: "I love getting alerts exactly when good deals appear. I've caught some excellent city-breaks."
  },
  {
    name: "Radu Ciobanu",
    gender: "male",
    rating: 5,
    text: "Ideal for spontaneous getaways. In a few minutes, I check flights, hotels, and discounts."
  },
  {
    name: "Elena Dobre",
    gender: "female",
    rating: 4,
    text: "Simple interface and useful recommendations. No useless ads or confusing information."
  },
  {
    name: "Mihai Ionescu",
    gender: "male",
    rating: 5,
    text: "A tool that really helps you save money. I've already recommended it to friends."
  },
  {
    name: "Ioana Marinescu",
    gender: "female",
    rating: 5,
    text: "Perfect for quick planning. The AI does all the heavy lifting."
  },
  {
    name: "Alex Stoica",
    gender: "male",
    rating: 4,
    text: "I quickly find the best options without wasting time on dozens of websites."
  },
  {
    name: "Cristina Pavel",
    gender: "female",
    rating: 5,
    text: "Very useful for last-minute vacations. I highly recommend it."
  },
  {
    name: "Daniel Rusu",
    gender: "male",
    rating: 5,
    text: "Everything is centralized and easy to use. Exactly what I needed."
  },
  {
    name: "Ana Petrescu",
    gender: "female",
    rating: 4,
    text: "I like that the recommendations are clear and relevant, not random."
  },
  {
    name: "Bogdan Ilie",
    gender: "male",
    rating: 5,
    text: "A smart tool that really makes a difference to the budget."
  },
  {
    name: "Laura Dumitrescu",
    gender: "female",
    rating: 5,
    text: "TravelAI Deals helped me plan vacations with no headaches."
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
          What our users are saying
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

        {/* Smart disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-10">
          Aggregated feedback from users and internal testing • updated periodically
        </p>

      </div>
    </section>
  );
};

export default TestimonialsSection;
