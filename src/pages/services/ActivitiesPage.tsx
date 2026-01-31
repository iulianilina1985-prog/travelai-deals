import SEO from "../../components/seo/SEO";

const ActivitiesPage = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-16">
            <SEO
                title="Activities & Experiences"
                description="Explore tours, attractions, and local experiences to make the most of your trip. Book on trusted platforms."
                canonicalPath="/activities"
            />

            {/* PAGE TITLE */}
            <section className="space-y-4">
                <h1 className="text-3xl font-semibold">
                    Activities & Experiences
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Explore tours, attractions, and local experiences to make the most of your trip.
                    From city tours to cultural events, activities can turn a simple trip into a memorable experience.
                </p>
            </section>

            {/* WHY BOOK ACTIVITIES */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Why book activities in advance?
                </h2>

                <p className="text-gray-700 max-w-2xl">
                    Popular attractions and experiences often sell out quickly, especially during peak travel seasons.
                    Booking activities in advance helps you secure availability, save time during your trip,
                    and focus on enjoying your destination instead of searching for last-minute options.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    How it works
                </h2>

                <ul className="space-y-3 text-gray-700 list-disc pl-6 max-w-2xl">
                    <li>Choose your destination and type of activity</li>
                    <li>Explore trusted platforms offering tours and experiences</li>
                    <li>Book directly on the partner website</li>
                </ul>
            </section>

            {/* ACTIVITY TYPES */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Types of activities you can explore
                </h2>

                <ul className="space-y-2 list-disc pl-6 text-gray-700 max-w-2xl">
                    <li>City tours and sightseeing experiences</li>
                    <li>Museums, attractions, and cultural landmarks</li>
                    <li>Food experiences and local dining events</li>
                    <li>Outdoor activities and adventure tours</li>
                    <li>Shows, events, and entertainment tickets</li>
                </ul>
            </section>

            {/* RECOMMENDED PLATFORMS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Recommended activity platforms
                </h2>

                <p className="text-gray-600 max-w-2xl">
                    TravelAI guides you to well-known platforms that specialize in tours, attractions,
                    and local experiences. Availability, details, and prices are displayed directly
                    on the partner websites.
                </p>

                {/* partner cards will be added later */}
                <div className="border border-dashed rounded-lg p-6 text-gray-400 max-w-2xl">
                    Activity platforms will be listed here.
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
                            Does TravelAI organize the activities?
                        </p>
                        <p className="text-gray-600">
                            No. TravelAI helps you discover activity platforms, while bookings are completed directly
                            on the partner websites.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">
                            Are activities available worldwide?
                        </p>
                        <p className="text-gray-600">
                            Availability depends on the destination and the partner platform, with many activities
                            offered in popular cities around the world.
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
                    <li>Car rental</li>
                </ul>
            </section>

        </div>
    );
};

export default ActivitiesPage;
