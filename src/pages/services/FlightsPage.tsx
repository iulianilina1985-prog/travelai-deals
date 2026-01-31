import SEO from "../../components/seo/SEO";

const FlightsPage = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-16">
            <SEO
                title="Flights"
                description="Discover trusted flight booking platforms and choose the option that fits your travel needs."
                canonicalPath="/flights"
                image="/assets/flight/flight.jpg"
            />

            {/* PAGE TITLE */}
            <section className="space-y-4">
                <h1 className="text-3xl font-semibold">
                    Flights
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Discover trusted flight booking platforms and choose the option that fits your travel needs.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    How it works
                </h2>

                <ul className="space-y-3 text-gray-700 list-disc pl-6 max-w-2xl">
                    <li>Choose your destination and travel dates</li>
                    <li>Select a trusted flight booking platform</li>
                    <li>Complete your booking directly on the partner website</li>
                </ul>
            </section>

            {/* RECOMMENDED PLATFORMS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Recommended flight platforms
                </h2>

                <p className="text-gray-600 max-w-2xl">
                    We guide you to well-known platforms used by travelers worldwide.
                    Prices and availability are shown directly on the partner websites.
                </p>

                {/* partner cards will come here later */}
                <div className="border border-dashed rounded-lg p-6 text-gray-400 max-w-2xl">
                    Partner platforms will be listed here.
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
                            Does TravelAI sell flight tickets?
                        </p>
                        <p className="text-gray-600">
                            No. TravelAI guides you to external booking platforms where you complete your reservation.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">
                            Are prices shown on TravelAI?
                        </p>
                        <p className="text-gray-600">
                            Prices are displayed directly on the partner platforms.
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
                    <li>Hotels</li>
                    <li>Car rental</li>
                    <li>Travel eSIM</li>
                </ul>
            </section>

        </div>
    );
};

export default FlightsPage;
