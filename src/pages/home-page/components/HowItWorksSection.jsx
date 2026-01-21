import React from "react";
import Icon from "../../../components/AppIcon";

const HowItWorksSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        How does TravelAI Deals work?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

        {/* CARD 1 */}
        <div className="
          group p-8 rounded-2xl 
          bg-white 
          shadow-lg 
          transition-all duration-300 
          border border-gray-200 
          hover:-translate-y-2 
          hover:shadow-2xl 
          hover:border-blue-500/40
          hover:bg-gradient-to-b 
          hover:from-blue-50 
          hover:to-indigo-50
        ">
          <div className="
            w-16 h-16 mx-auto rounded-full 
            flex items-center justify-center 
            bg-blue-100 text-blue-600 
            shadow-inner
            group-hover:scale-110 
            transition
          ">
            <Icon name="Search" size={34} color="#2563eb" />
          </div>

          <h3 className="text-2xl font-semibold mt-6 text-gray-900">
            1. Search
          </h3>
          <p className="text-gray-600 mt-3">
            Enter your destination, period, and preferences. We do the rest.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="
          group p-8 rounded-2xl 
          bg-white 
          shadow-lg 
          transition-all duration-300 
          border border-gray-200 
          hover:-translate-y-2 
          hover:shadow-2xl 
          hover:border-blue-500/40
          hover:bg-gradient-to-b 
          hover:from-blue-50 
          hover:to-indigo-50
        ">
          <div className="
            w-16 h-16 mx-auto rounded-full 
            flex items-center justify-center 
            bg-blue-100 text-blue-600 
            shadow-inner
            group-hover:scale-110 
            transition
          ">
            <Icon name="Bot" size={34} color="#2563eb" />
          </div>

          <h3 className="text-2xl font-semibold mt-6 text-gray-900">
            2. AI filters
          </h3>
          <p className="text-gray-600 mt-3">
            We automatically analyze thousands of offers and select the best ones.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="
          group p-8 rounded-2xl 
          bg-white 
          shadow-lg 
          transition-all duration-300 
          border border-gray-200 
          hover:-translate-y-2 
          hover:shadow-2xl 
          hover:border-blue-500/40
          hover:bg-gradient-to-b 
          hover:from-blue-50 
          hover:to-indigo-50
        ">
          <div className="
            w-16 h-16 mx-auto rounded-full 
            flex items-center justify-center 
            bg-blue-100 text-blue-600 
            shadow-inner
            group-hover:scale-110 
            transition
          ">
            <Icon name="Gift" size={34} color="#2563eb" />
          </div>

          <h3 className="text-2xl font-semibold mt-6 text-gray-900">
            3. Book
          </h3>
          <p className="text-gray-600 mt-3">
            We send you directly to the best available price, with no hidden fees.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
