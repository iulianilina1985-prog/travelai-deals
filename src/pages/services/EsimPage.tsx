const EsimPage = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-16">

            {/* PAGE TITLE */}
            <section className="space-y-4">
                <h1 className="text-3xl font-semibold">
                    Travel eSIM
                </h1>
                <p className="text-gray-600 max-w-2xl">
                    Stay connected while traveling without the need for physical SIM cards.
                    Travel eSIM solutions offer convenient mobile data access in many destinations worldwide.
                </p>
            </section>

            {/* WHY USE ESIM */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Why use an eSIM when traveling?
                </h2>

                <p className="text-gray-700 max-w-2xl">
                    eSIM technology allows you to activate a mobile data plan digitally,
                    eliminating the need to visit local stores or swap physical SIM cards.
                    It is especially useful for international travelers who want reliable
                    internet access immediately after arrival.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    How it works
                </h2>

                <ul className="space-y-3 text-gray-700 list-disc pl-6 max-w-2xl">
                    <li>Choose a destination or regional data plan</li>
                    <li>Purchase and activate the eSIM online</li>
                    <li>Connect to mobile data without changing physical SIM cards</li>
                </ul>
            </section>

            {/* USE CASES */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Common use cases
                </h2>

                <ul className="space-y-2 list-disc pl-6 text-gray-700 max-w-2xl">
                    <li>International travel and roaming avoidance</li>
                    <li>Short trips and city breaks</li>
                    <li>Remote work while traveling</li>
                    <li>Backup internet connection abroad</li>
                </ul>
            </section>

            {/* RECOMMENDED PLATFORMS */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Recommended eSIM platforms
                </h2>

                <p className="text-gray-600 max-w-2xl">
                    TravelAI points you to trusted eSIM providers that offer coverage
                    in multiple countries and regions. Data plans, coverage details,
                    and pricing are displayed directly on the partner websites.
                </p>

                {/* partner cards will be added later */}
                <div className="border border-dashed rounded-lg p-6 text-gray-400 max-w-2xl">
                    eSIM providers will be listed here.
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
                            Does my phone support eSIM?
                        </p>
                        <p className="text-gray-600">
                            Most modern smartphones support eSIM technology, but compatibility
                            depends on the device model and manufacturer.
                        </p>
                    </div>

                    <div>
                        <p className="font-medium">
                            Can I keep my physical SIM active?
                        </p>
                        <p className="text-gray-600">
                            Yes. Many devices allow you to use an eSIM for data while keeping
                            your physical SIM active for calls and messages.
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

export default EsimPage;
