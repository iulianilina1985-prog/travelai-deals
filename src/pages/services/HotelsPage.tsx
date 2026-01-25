const HotelsPage = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-16">

            {/* PAGE TITLE */}
            <section className="space-y-4">
                <h1 className="text-3xl font-semibold">
                    Hotels & Accommodation
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Find accommodation options that match your travel style and budget.
                    From hotels and apartments to unique stays, choosing the right place
                    can make a big difference to your overall travel experience.
                </p>
            </section>

            {/* WHY CHOOSE ACCOMMODATION CAREFULLY */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Why accommodation matters
                </h2>

                <p className="text-gray-700 max-w-2xl">
                    Your accommodation affects comfort, location, and convenience during your trip.
                    Staying close to key attractions or transport hubs can save time and reduce stress,
                    while the right amenities can greatly improve your stay.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    How it works
                </h2>

                <ul className="space-y-3 text-gray-700 list-disc pl-6 max-w-2xl">
                    <li>Select your destination and travel dates</li>
                    <li>Explore trusted accommodation booking platforms</li>
                    <li>Complete your reservation directly on the partner website</li>
                </ul>
            </section>

            {/* ACCOMMODATION TYPES */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Types of accommodation available
                </h2>

                <ul className="space-y-2 list-disc pl-6 text-gray-700 max-w-2xl">
                    <li>Hotels and resorts</li>
                    <li>Apartments and vacation rentals</li>
                    <li>Guesthouses and boutique stays</li>
                    <li>Business and long-stay accommodation</li>
                </ul>
            </section>

            {/* RECOMMENDED PLATFORMS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Recommended accommodation platforms
                </h2>

                <p className="text-gray-600 max-w-2xl">
                    TravelAI guides you to well-known booking platforms offering a wide range
                    of accommodation options worldwide. Availability, reviews, and prices
                    are displayed directly on the partner websites.
                </p>

                {/* partner cards will be added later */}
                <div className="border border-dashed rounded-lg p-6 text-gray-400 max-w-2xl">
                    Accommodation platforms will be listed here.
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
                            Does TravelAI book hotels directly?
                        </p>
                        <p className="text-gray-600">
                            No. TravelAI helps you discover accommodation platforms, while
                            reservations are completed directly on the partner websites.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">
                            Can I compare different accommodation types?
                        </p>
                        <p className="text-gray-600">
                            Yes. Partner platforms typically allow you to filter by price,
                            location, accommodation type, and guest reviews.
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
                    <li>Car rental</li>
                    <li>Activities</li>
                </ul>
            </section>

        </div>
    );
};

export default HotelsPage;
