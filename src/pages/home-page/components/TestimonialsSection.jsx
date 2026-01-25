import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";


const isMobile = window.innerWidth < 768;

const ALL_TESTIMONIALS = [
  {
    name: "Alex M.",
    gender: "male",
    rating: 5,
    text: "TravelAI helped me plan a complete trip without jumping between multiple travel websites."
  },
  {
    name: "Emma R.",
    gender: "female",
    rating: 5,
    text: "Everything is structured and easy to follow. It feels like guided planning, not endless searching."
  },
  {
    name: "Daniel K.",
    gender: "male",
    rating: 5,
    text: "Perfect when you don’t have time to manually compare flights, stays, and extras."
  },
  {
    name: "Sofia L.",
    gender: "female",
    rating: 4,
    text: "The recommendations feel relevant and well organized, not random or overwhelming."
  },
  {
    name: "Michael T.",
    gender: "male",
    rating: 5,
    text: "I like that I’m always sent to the provider’s official website to book."
  },
  {
    name: "Laura B.",
    gender: "female",
    rating: 5,
    text: "Less stress, fewer tabs, and a much clearer picture of my travel options."
  },
  {
    name: "Chris W.",
    gender: "male",
    rating: 4,
    text: "TravelAI brings everything together in one place, which makes planning much easier."
  },
  {
    name: "Natalie P.",
    gender: "female",
    rating: 5,
    text: "It feels like having a smart assistant that organizes my travel research."
  },
  {
    name: "James H.",
    gender: "male",
    rating: 5,
    text: "I decide where to book, but TravelAI saves me a lot of research time."
  },
  {
    name: "Olivia S.",
    gender: "female",
    rating: 4,
    text: "Simple interface and clear recommendations. Exactly what I need for quick planning."
  },
  {
    name: "Mark D.",
    gender: "male",
    rating: 5,
    text: "A calm, efficient way to explore travel options without pressure."
  },
  {
    name: "Isabella C.",
    gender: "female",
    rating: 5,
    text: "Travel planning feels lighter and more organized with TravelAI."
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
    if (isMobile) return;

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

        <div
          className="
            flex gap-6 overflow-x-auto pb-4
            snap-x snap-mandatory
            md:grid md:grid-cols-3 md:overflow-visible md:pb-0
          "
        >
          {visibleTestimonials.map((t, i) => (
            <div
              key={i}
              className="
                min-w-[85%] snap-start
                md:min-w-0
                bg-white p-8 rounded-2xl
                shadow-md border border-gray-200
                hover:shadow-xl transition
              "
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
