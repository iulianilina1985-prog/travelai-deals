// src/affiliates/registry.ts
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
        description: "Get compensation for delayed or cancelled flights. Check eligibility for free.",
        ctaLabel: "Request compensation",
        image_url: "/assets/partners/Compensair.png",
        buildLink: () => "https://compensair.tpx.lt/U5isYCUu",
    },

    airhelp: {
        id: "airhelp",
        name: "AirHelp",
        category: "compensation",
        brandColor: "#0f172a",
        description: "World leader in air passenger rights. Recover your money for flight issues.",
        ctaLabel: "Check flight",
        image_url: "/assets/partners/airhelp.png",
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
        description: "Private airport-to-hotel transfers. Professional drivers and fixed prices.",
        ctaLabel: "Book taxi",
        image_url: "/assets/partners/kiwi.png",
        buildLink: () => "https://kiwitaxi.tpx.lt/UkO0mEQp",
    },

    gettransfer: {
        id: "gettransfer",
        name: "GetTransfer",
        category: "transfers",
        brandColor: "#2563eb",
        description: "The largest transfer platform in the world. Choose the right offer for you.",
        ctaLabel: "See offers",
        image_url: "/assets/partners/get-transfer.png",
        buildLink: () => "https://gettransfer.tpx.lt/rn63Ywr6",
    },

    holidaytaxis: {
        id: "holidaytaxis",
        name: "Holiday Taxis",
        category: "transfers",
        brandColor: "#f97316",
        description: "Reliable transfers in over 150 countries. Options for all budgets.",
        ctaLabel: "Book transfer",
        image_url: "/assets/partners/holiday-taxis.png",
        buildLink: () => "https://holidaytaxis.tpx.lt/JwHtT3CU",
    },

    intui: {
        id: "intui",
        name: "Intui Travel",
        category: "transfers",
        brandColor: "#0ea5e9",
        description: "Booking system for transfers worldwide. Safety and comfort.",
        ctaLabel: "Search transfer",
        image_url: "/assets/partners/intui-travel.png",
        buildLink: () => "https://intui.tpx.lt/uNkNui5o",
    },
    welcome: {
        id: "welcome",
        name: "Welcome Pickups",
        category: "transfers",
        brandColor: "#0ea5e9",
        description: "Booking system for transfers worldwide. Safety and comfort.",
        ctaLabel: "Search transfer",
        image_url: "/assets/partners/welcome.png",
        buildLink: () => "https://tpx.lt/IDhRRzm4",
    },
    indrive: {
        id: "indrive",
        name: "Indrive - city to city",
        category: "transfers",
        brandColor: "#0ea5e9",
        description: "Booking system for transfers worldwide. Safety and comfort.",
        ctaLabel: "Search transfer",
        image_url: "/assets/partners/Indrive.png",
        buildLink: () => "https://indrive.tpx.lt/PjItpkkJ",
    },


    /* ===============================
       TICKETS / ATTRACTIONS / TOURS
       =============================== */
    ticketmaster: {
        id: "ticket",
        name: "Ticket Master",
        category: "tickets",
        brandColor: "#ff5b00",
        description: "Instant tickets for museums and attractions. Skip the line and enjoy the experience.",
        ctaLabel: "See tickets",
        image_url: "/assets/partners/ticketmaster.png",
        buildLink: () => "https://ticketmaster.tpx.lt/6baSABiP",
    },

    tiqets: {
        id: "tiqets",
        name: "Tiqets",
        category: "tickets",
        brandColor: "#ff5b00",
        description: "Instant tickets for museums and attractions. Skip the line and enjoy the experience.",
        ctaLabel: "See tickets",
        image_url: "/assets/partners/tiqets.png",
        buildLink: () => "https://tiqets.tpx.lt/S3EpuE54",
    },

    gocity: {
        id: "gocity",
        name: "Go City",
        category: "tickets",
        brandColor: "#7c3aed",
        description: "A single pass for dozens of top attractions. Save time and visit more.",
        ctaLabel: "Choose pass",
        image_url: "/assets/partners/go-city.png",
        buildLink: () => "https://gocity.tpx.lt/S4LY11s7",
    },

    klook: {
        id: "klook",
        name: "Klook",
        category: "activities",
        brandColor: "#ff5b00",
        description: "Adventures, tours and unique local experiences. Discover what you can do at your destination.",
        ctaLabel: "Discover activities",
        image_url: "/assets/partners/klook.png",
        buildLink: (params) => {
            const city = params?.city || params?.to || "";
            return city ? `https://klook.tpx.lt/jnEi9ZtF?q=${encodeURIComponent(city)}` : "https://klook.tpx.lt/jnEi9ZtF";
        }
    },

    wegotrip: {
        id: "wegotrip",
        name: "WeGoTrip",
        category: "tours",
        brandColor: "#2563eb",
        description: "Audio guides and tours on your phone. Explore at your own pace.",
        ctaLabel: "See tours",
        image_url: "/assets/partners/wegotrip.png",
        buildLink: () => "https://wegotrip.tpx.lt/wLLCYstz",
    },

    searadar: {
        id: "searadar",
        name: "SeaRadar",
        category: "tours",
        brandColor: "#0284c7",
        description: "Yacht rentals and sea experiences. Sail to your next adventure.",
        ctaLabel: "See yachts",
        image_url: "/assets/partners/searadar.png",
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
        description: "Stay connected in over 200 countries with eSIM. No roaming charges, fast installation.",
        ctaLabel: "See eSIM plans",
        image_url: "/assets/partners/airalo.png",
        buildLink: () => "https://airalo.tpx.lt/feoFvQ5n",
    },

    drimsim: {
        id: "drimsim",
        name: "Drimsim",
        category: "esim",
        brandColor: "#0f172a",
        description: "Universal SIM card for travelers. Local rates all over the world.",
        ctaLabel: "Order SIM",
        image_url: "/assets/partners/drimsim.png",
        buildLink: () => "https://drimsim.tpx.lt/3ntSCd91",
    },

    yesim: {
        id: "yesim",
        name: "Yesim",
        category: "esim",
        brandColor: "#22c55e",
        description: "Stable mobile internet wherever you travel. Activate your eSIM in minutes.",
        ctaLabel: "See Yesim offers",
        image_url: "/assets/partners/yesim.png",
        buildLink: () => "https://yesim.tpx.lt/OeegGKjR",
    },

    ekta: {
        id: "ekta",
        name: "EKTA eSIM",
        category: "esim",
        brandColor: "#2563eb",
        description: "Simple global connectivity. Choose the right package for your destination.",
        ctaLabel: "Activate eSIM",
        image_url: "/assets/partners/EKTA.png",
        buildLink: () => "https://ektatraveling.tpx.lt/zSJixg2v",
    },

    /* ===============================
       CAR RENTALS
       =============================== */

    aviasales: {
        id: "aviasales",
        name: "Aviasales",
        category: "flights",
        brandColor: "#2563eb",
        description: "The fastest search engine for cheap flights. Compare hundreds of airlines.",
        ctaLabel: "See flights",
        image_url: "/assets/partners/aviasales.png",
        buildLink: (params) => {
            const { from_iata, to_iata, depart_date, return_date, passengers = 1 } = params || {};
            if (!from_iata || !to_iata) return "https://www.aviasales.com/?marker=688834&locale=en";

            const toShortDate = (isoDate: string) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
                return isoDate.slice(8, 10) + isoDate.slice(5, 7);
            };

            const d1 = depart_date ? toShortDate(depart_date) : null;
            if (!d1) return `https://www.aviasales.com/search?origin=${from_iata}&destination=${to_iata}&marker=688834&locale=en`;

            let path = `${from_iata}${d1}${to_iata}`;
            if (return_date) {
                const d2 = toShortDate(return_date);
                if (d2) path += d2;
            }
            path += String(passengers);
            return `https://www.aviasales.com/search/${path}?marker=688834&locale=en&currency=EUR`;
        }
    },

    qeeq: {
        id: "qeeq",
        name: "QEEQ",
        category: "cars",
        brandColor: "#2563eb",
        description: "World-wide car rentals. The best deals from top providers.",
        ctaLabel: "Search cars",
        image_url: "/assets/partners/qeeq.png",
        buildLink: () => "https://qeeq.tpx.lt/yOJgifcr",
    },

    economybookings: {
        id: "economybookings",
        name: "EconomyBookings",
        category: "cars",
        brandColor: "#1e40af",
        description: "Affordable car bookings worldwide. Simple process and non-stop support.",
        ctaLabel: "See cars",
        image_url: "/assets/partners/economy-bookings.png",
        buildLink: () => "https://economybookings.tpx.lt/H8mpmQJp",
    },

    localrent: {
        id: "localrent",
        name: "Localrent",
        category: "cars",
        brandColor: "#00A859",
        description: "Car rentals from local providers. Personalized services and fair prices.",
        ctaLabel: "See local offers",
        image_url: "/assets/partners/localrent.png",
        buildLink: (params) => {
            const loc = params?.location || params?.to || "";
            return loc ? `https://localrent.tpx.lt/BDajXZeJ?pickup=${encodeURIComponent(loc)}` : "https://localrent.tpx.lt/BDajXZeJ";
        }
    },

    /* ===============================
       FOOD / EXPERIENCES
       =============================== */

    eatwith: {
        id: "eatwith",
        name: "Eatwith",
        category: "food",
        brandColor: "#dc2626",
        description: "Local dinners, cooking classes and culinary tours. Eat with the locals.",
        ctaLabel: "See experiences",
        image_url: "/assets/partners/Eatwith.png",
        buildLink: () => "https://eatwith.tpx.lt/i5TpILAX",
    },

    /* ===============================
       GENERIC / FALLBACK
       =============================== */

    travelpayouts: {
        id: "travelpayouts",
        name: "Travelpayouts",
        category: "other",
        description: "Access to hundreds of travel affiliate programs.",
        ctaLabel: "See partners",
        buildLink: () => "https://tpx.lt/IDhRRzm4",
    },
};

export const getProvidersByCategory = (category: AffiliateCategory): AffiliateProvider[] => {
    return Object.values(AFFILIATES).filter(p => p.category === category);
};

export const getAIProvidersByCategory = (aiCategory: string): AffiliateProvider[] => {
    // Mapping internal AI intents to registry categories
    const mapping: Record<string, AffiliateCategory[]> = {
        "flight": ["flights"],
        "car_rental": ["cars"],
        "activity": ["activities", "tickets", "tours"],
        "transfer": ["transfers"],
        "esim": ["esim"],
        "compensation": ["compensation"],
        "hotel": ["other"] // Booking is hardcoded for now or we can add it later
    };

    const categories = mapping[aiCategory] || [];
    return Object.values(AFFILIATES).filter(p => categories.includes(p.category));
};
