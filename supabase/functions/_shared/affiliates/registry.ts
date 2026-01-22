// supabase/functions/_shared/affiliates/registry.ts
// Single source of truth for all affiliate providers

export type AffiliateCategory =
    | "flights"
    | "transfers"
    | "tickets"
    | "activities"
    | "cars"
    | "esim"
    | "compensation"
    | "insurance"
    | "food"
    | "tours"
    | "transport"
    | "other";

export type AffiliateProvider = {
    id: string;
    name: string;
    category: AffiliateCategory;
    brandColor?: string;
    description: string;
    ctaLabel: string;
    image_url?: string;
    buildLink: (params?: Record<string, any>) => string;
};

export const AFFILIATES: Record<string, AffiliateProvider> = {
    /* ===============================
       COMPENSATION / CLAIMS
       =============================== */

    compensair: {
        id: "compensair",
        name: "Compensair",
        category: "compensation",
        brandColor: "#2563eb",
        description:
            "Claim compensation for delayed or cancelled flights. Check your eligibility for free.",
        ctaLabel: "Claim compensation",
        image_url: "/assets/images/no_image.png",
        buildLink: () => "https://compensair.tpx.lt/U5isYCUu",
    },

    airhelp: {
        id: "airhelp",
        name: "AirHelp",
        category: "compensation",
        brandColor: "#0f172a",
        description:
            "Global leader in air passenger rights. Get your money back for disrupted flights.",
        ctaLabel: "Check flight",
        image_url: "/assets/images/no_image.png",
        buildLink: () => "https://airhelp.tpx.lt/8Vc3jzeS",
    },

    /* ===============================
       TRANSFERS & TRANSPORT
       =============================== */

    kiwitaxi: {
        id: "kiwitaxi",
        name: "KiwiTaxi",
        category: "transfers",
        brandColor: "#00a650",
        description:
            "Private airport transfers to your hotel. Professional drivers and fixed prices.",
        ctaLabel: "Book taxi",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://kiwitaxi.tpx.lt/UkO0mEQp",
    },

    gettransfer: {
        id: "gettransfer",
        name: "GetTransfer",
        category: "transfers",
        brandColor: "#2563eb",
        description:
            "The world’s largest transfer marketplace. Choose the best offer for your trip.",
        ctaLabel: "View offers",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://gettransfer.tpx.lt/rn63Ywr6",
    },

    holidaytaxis: {
        id: "holidaytaxis",
        name: "Holiday Taxis",
        category: "transfers",
        brandColor: "#f97316",
        description:
            "Reliable transfers in over 150 countries. Options for every budget.",
        ctaLabel: "Book transfer",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://holidaytaxis.tpx.lt/JwHtT3CU",
    },

    intui: {
        id: "intui",
        name: "Intui Travel",
        category: "transfers",
        brandColor: "#0ea5e9",
        description:
            "Worldwide transfer booking system. Safety, comfort, and peace of mind.",
        ctaLabel: "Search transfer",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://intui.tpx.lt/uNkNui5o",
    },

    /* ===============================
       TICKETS / ATTRACTIONS / TOURS
       =============================== */

    tiqets: {
        id: "tiqets",
        name: "Tiqets",
        category: "tickets",
        brandColor: "#ff5b00",
        description:
            "Instant tickets for museums and attractions. Skip the lines and enjoy the experience.",
        ctaLabel: "View tickets",
        image_url: "/assets/images/activity-default.jpg",
        buildLink: () => "https://tiqets.tpx.lt/S3EpuE54",
    },

    gocity: {
        id: "gocity",
        name: "Go City",
        category: "tickets",
        brandColor: "#7c3aed",
        description:
            "One pass for dozens of top attractions. Save time and see more.",
        ctaLabel: "Choose pass",
        image_url: "/assets/images/activity-default.jpg",
        buildLink: () => "https://gocity.tpx.lt/S4LY11s7",
    },

    klook: {
        id: "klook",
        name: "Klook",
        category: "activities",
        brandColor: "#ff5b00",
        description:
            "Unique local activities, tours, and experiences. Discover what to do at your destination.",
        ctaLabel: "Discover activities",
        image_url: "/assets/images/activity-default.jpg",
        buildLink: (params) => {
            const city = params?.city || params?.to || "";
            return city
                ? `https://klook.tpx.lt/jnEi9ZtF?q=${encodeURIComponent(city)}`
                : "https://klook.tpx.lt/jnEi9ZtF";
        },
    },

    wegotrip: {
        id: "wegotrip",
        name: "WeGoTrip",
        category: "tours",
        brandColor: "#2563eb",
        description:
            "Self-guided audio tours on your phone. Explore at your own pace.",
        ctaLabel: "View tours",
        image_url: "/assets/activities/wegotrip.jpg",
        buildLink: () => "https://wegotrip.tpx.lt/wLLCYstz",
    },

    searadar: {
        id: "searadar",
        name: "SeaRadar",
        category: "tours",
        brandColor: "#0284c7",
        description:
            "Yacht rentals and sea experiences. Sail into your next adventure.",
        ctaLabel: "View yachts",
        image_url: "/assets/activities/searadar.jpg",
        buildLink: () => "https://searadar.tpx.lt/Zzzl97vT",
    },

    /* ===============================
       eSIM / CONNECTIVITY
       =============================== */

    airalo: {
        id: "airalo",
        name: "Airalo",
        category: "esim",
        brandColor: "#2563eb",
        description:
            "Stay connected in over 200 countries with eSIM. No roaming fees, instant setup.",
        ctaLabel: "View eSIM plans",
        image_url: "/assets/esim/airalo.jpg",
        buildLink: () => "https://airalo.tpx.lt/feoFvQ5n",
    },

    drimsim: {
        id: "drimsim",
        name: "Drimsim",
        category: "esim",
        brandColor: "#0f172a",
        description:
            "Universal SIM card for travelers. Local rates worldwide.",
        ctaLabel: "Order SIM",
        image_url: "/assets/esim/drimsim.jpg",
        buildLink: () => "https://drimsim.tpx.lt/3ntSCd91",
    },

    yesim: {
        id: "yesim",
        name: "Yesim",
        category: "esim",
        brandColor: "#22c55e",
        description:
            "Reliable mobile internet wherever you travel. Activate your eSIM in minutes.",
        ctaLabel: "View Yesim offers",
        image_url: "/assets/esim/yesim.jpg",
        buildLink: () => "https://yesim.tpx.lt/OeegGKjR",
    },

    ekta: {
        id: "ekta",
        name: "EKTA eSIM",
        category: "esim",
        brandColor: "#2563eb",
        description:
            "Simple global connectivity. Choose the right plan for your destination.",
        ctaLabel: "Activate eSIM",
        image_url: "/assets/esim/ekta.jpg",
        buildLink: () => "https://ektatraveling.tpx.lt/zSJixg2v",
    },

    /* ===============================
       FLIGHTS / CAR RENTALS
       =============================== */

    aviasales: {
        id: "aviasales",
        name: "Aviasales",
        category: "flights",
        brandColor: "#2563eb",
        description:
            "Fast flight search engine for cheap flights. Compare hundreds of airlines.",
        ctaLabel: "View flights",
        image_url: "/assets/flight/flight.jpg",
        buildLink: (params) => {
            const { from_iata, to_iata, depart_date, return_date, passengers = 1 } =
                params || {};
            if (!from_iata || !to_iata)
                return "https://www.aviasales.com/?marker=688834&locale=en";

            const toShortDate = (isoDate: string) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
                return isoDate.slice(8, 10) + isoDate.slice(5, 7);
            };

            const d1 = depart_date ? toShortDate(depart_date) : null;
            if (!d1)
                return `https://www.aviasales.com/search?origin=${from_iata}&destination=${to_iata}&marker=688834&locale=en`;

            let path = `${from_iata}${d1}${to_iata}`;
            if (return_date) {
                const d2 = toShortDate(return_date);
                if (d2) path += d2;
            }
            path += String(passengers);
            return `https://www.aviasales.com/search/${path}?marker=688834&locale=en&currency=EUR`;
        },
    },

    qeeq: {
        id: "qeeq",
        name: "QEEQ",
        category: "cars",
        brandColor: "#2563eb",
        description:
            "Worldwide car rentals. Find the best deals from top providers.",
        ctaLabel: "Search cars",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://qeeq.tpx.lt/yOJgifcr",
    },

    economybookings: {
        id: "economybookings",
        name: "EconomyBookings",
        category: "cars",
        brandColor: "#1e40af",
        description:
            "Affordable car rentals worldwide. Simple booking and 24/7 support.",
        ctaLabel: "View cars",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://economybookings.tpx.lt/H8mpmQJp",
    },

    localrent: {
        id: "localrent",
        name: "Localrent",
        category: "cars",
        brandColor: "#00A859",
        description:
            "Car rentals from local providers. Personalized service and fair prices.",
        ctaLabel: "View local deals",
        image_url: "/assets/images/car-default.jpg",
        buildLink: (params) => {
            const loc = params?.location || params?.to || "";
            return loc
                ? `https://localrent.tpx.lt/BDajXZeJ?pickup=${encodeURIComponent(loc)}`
                : "https://localrent.tpx.lt/BDajXZeJ";
        },
    },

    /* ===============================
       FOOD / EXPERIENCES
       =============================== */

    eatwith: {
        id: "eatwith",
        name: "Eatwith",
        category: "food",
        brandColor: "#dc2626",
        description:
            "Local dining experiences, cooking classes, and food tours. Eat with locals.",
        ctaLabel: "View experiences",
        image_url: "/assets/food/eatwith.jpg",
        buildLink: () => "https://eatwith.tpx.lt/i5TpILAX",
    },

    /* ===============================
       GENERIC / FALLBACK
       =============================== */

    travelpayouts: {
        id: "travelpayouts",
        name: "Travelpayouts",
        category: "other",
        description:
            "Access to hundreds of travel affiliate programs.",
        ctaLabel: "View partners",
        buildLink: () => "https://tpx.lt/IDhRRzm4",
    },
};

export const getProvidersByCategory = (
    category: AffiliateCategory
): AffiliateProvider[] => {
    return Object.values(AFFILIATES).filter((p) => p.category === category);
};

export const getAIProvidersByCategory = (
    aiCategory: string
): AffiliateProvider[] => {
    // Mapping internal AI intents to registry categories
    const mapping: Record<string, AffiliateCategory[]> = {
        flight: ["flights"],
        car_rental: ["cars"],
        activity: ["activities", "tickets", "tours"],
        transfer: ["transfers"],
        esim: ["esim"],
        compensation: ["compensation"],
        hotel: ["other"], // Booking handled separately for now
    };

    const categories = mapping[aiCategory] || [];
    return Object.values(AFFILIATES).filter((p) =>
        categories.includes(p.category)
    );
};
