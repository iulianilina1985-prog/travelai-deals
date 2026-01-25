import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import { useAuth } from "../../../contexts/AuthContext";

const SERVICES = [
    {
        title: "Activities & tickets",
        desc: "Attractions, tours, local experiences.",
        icon: "Ticket",
    },
    {
        title: "Rent a car",
        desc: "Cars at your destination, fast and secure.",
        icon: "Car",
    },
    {
        title: "Transfers & taxi",
        desc: "Airport → accommodation, stress-free.",
        icon: "CarTaxiFront",
    },
    {
        title: "eSIM & internet",
        desc: "Instant internet, anywhere in the world.",
        icon: "Smartphone",
    },
    {
        title: "Flight compensation",
        desc: "Get money back for delays.",
        icon: "Plane",
    },
    {
        title: "Guides & tips",
        desc: "Short, useful, updated advice.",
        icon: "BookOpen",
    },
];

const ServicesEcosystemSection = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleCTA = () => {
        if (isAuthenticated) navigate("/ai-chat-interface");
        else navigate("/register");
    };

    return (
        <section className="bg-white py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                            More than just flights and hotels
                        </h2>

                        <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl">
                            TravelAI helps you organize the essential parts of a trip into a clear plan —
                            from transport and connectivity to activities and useful extras.
                        </p>

                        <p className="mt-2 text-xs text-gray-500 max-w-2xl">
                            TravelAI does not sell services. You are always guided to trusted providers to complete your booking.
                        </p>
                    </div>

                    <p className="text-xs md:text-sm text-gray-500">
                        Complete ecosystem • Activated progressively
                    </p>
                </div>


                {/* Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((s) => (
                        <div
                            key={s.title}
                            className="group rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <Icon name={s.icon} size={22} color="#2563eb" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {s.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-10 flex justify-center">
                    <button
                        onClick={handleCTA}
                        className="
              px-8 py-3 rounded-xl text-base font-semibold
              bg-indigo-600 text-white
              hover:bg-indigo-700 transition
              shadow-sm hover:shadow-md
            "
                    >
                        {isAuthenticated ? "See recommendations in AI Chat" : "Create free account"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesEcosystemSection;
