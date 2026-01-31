import SEO from "../../components/seo/SEO";

const CarRentalPage = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-16">
            <SEO
                title="Car Rental"
                description="Renting a car gives you flexibility and control over your trip. Compare trusted car rental platforms."
                canonicalPath="/car-rental"
            />

            {/* PAGE TITLE */}
            <section className="space-y-4">
                <h1 className="text-3xl font-semibold">
                    Car Rental
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Renting a car gives you flexibility and control over your trip.
                    Whether you’re exploring a city, countryside, or multiple destinations,
                    car rental services can help you travel at your own pace.
                </p>
            </section>

            {/* WHY RENT A CAR */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Why rent a car?
                </h2>

                <p className="text-gray-700 max-w-2xl">
                    Car rentals are ideal for travelers who want freedom beyond public transport schedules.
                    They allow easy access to remote locations, day trips, and flexible itineraries,
                    especially when traveling with family or luggage.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    How it works
                </h2>

                <ul className="space-y-3 text-gray-700 list-disc pl-6 max-w-2xl">
                    <li>Select your destination and rental dates</li>
                    <li>Compare trusted car rental platforms</li>
                    <li>Complete your booking directly on the partner website</li>
                </ul>
            </section>

            {/* CAR TYPES */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Car types available
                </h2>

                <ul className="space-y-2 list-disc pl-6 text-gray-700 max-w-2xl">
                    <li>Economy and compact cars</li>
                    <li>Family and SUV vehicles</li>
                    <li>Luxury and premium models</li>
                    <li>Vans and multi-passenger vehicles</li>
                </ul>
            </section>

            {/* RECOMMENDED PLATFORMS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Recommended car rental platforms
                </h2>

                <p className="text-gray-600 max-w-2xl">
                    TravelAI guides you to established car rental platforms used by travelers worldwide.
                    Vehicle availability, rental conditions, and prices are shown directly on the partner websites.
                </p>

                {/* partner cards will be added later */}
                <div className="border border-dashed rounded-lg p-6 text-gray-400 max-w-2xl">
                    Car rental platforms will be listed here.
                </div>
            </section>

            {/* FAQ */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Frequently asked questions
                </h2>

                <div className="space-y-4 max-w-2xl">
                    <div>
                        <p className="font-medium">
                            Does TravelAI rent cars directly?
                        </p>
                        <p className="text-gray-600">
                            No. TravelAI helps you find car rental platforms, while bookings are completed directly
                            on the partner websites.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">
                            What documents are usually required?
                        </p>
                        <p className="text-gray-600">
                            Requirements typically include a valid driver’s license and a payment method.
                            Exact conditions depend on the rental company and destination.
                        </p>
                    </div>
                </div>
            </section>

            {/* RELATED SERVICES */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Related travel services
                </h2>

                <ul className="list-disc pl-6 text-gray-700">
                    <li>Flights</li>
                    <li>Hotels</li>
                    <li>Activities</li>
                </ul>
            </section>

        </div>
    );
};

export default CarRentalPage;
