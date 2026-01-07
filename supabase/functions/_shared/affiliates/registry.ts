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
        description: "Obține compensații pentru zboruri întârziate sau anulate. Verifică eligibilitatea gratuit.",
        ctaLabel: "Solicită compensație",
        image_url: "/assets/images/no_image.png",
        buildLink: () => "https://compensair.tpx.lt/U5isYCUu",
    },

    airhelp: {
        id: "airhelp",
        name: "AirHelp",
        category: "compensation",
        brandColor: "#0f172a",
        description: "Lider mondial în drepturile pasagerilor aerieni. Recuperează-ți banii pentru zboruri cu probleme.",
        ctaLabel: "Verifică zbor",
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
        description: "Transferuri private de la aeroport către hotel. Șoferi profesioniști și prețuri fixe.",
        ctaLabel: "Rezervă taxi",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://kiwitaxi.tpx.lt/UkO0mEQp",
    },

    gettransfer: {
        id: "gettransfer",
        name: "GetTransfer",
        category: "transfers",
        brandColor: "#2563eb",
        description: "Cea mai mare platformă de transferuri din lume. Alege oferta potrivită pentru tine.",
        ctaLabel: "Vezi oferte",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://gettransfer.tpx.lt/rn63Ywr6",
    },

    holidaytaxis: {
        id: "holidaytaxis",
        name: "Holiday Taxis",
        category: "transfers",
        brandColor: "#f97316",
        description: "Transferuri de încredere în peste 150 de țări. Opțiuni pentru toate bugetele.",
        ctaLabel: "Rezervă transfer",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://holidaytaxis.tpx.lt/JwHtT3CU",
    },

    intui: {
        id: "intui",
        name: "Intui Travel",
        category: "transfers",
        brandColor: "#0ea5e9",
        description: "Sistem de rezervare pentru transferuri în toată lumea. Siguranță și confort.",
        ctaLabel: "Caută transfer",
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
        description: "Bilete instant pentru muzee și atracții. Sari peste coadă și bucură-te de experiență.",
        ctaLabel: "Vezi bilete",
        image_url: "/assets/images/activity-default.jpg",
        buildLink: () => "https://tiqets.tpx.lt/S3EpuE54",
    },

    gocity: {
        id: "gocity",
        name: "Go City",
        category: "tickets",
        brandColor: "#7c3aed",
        description: "Un singur permis pentru zeci de atracții de top. Economisește timp și vizitează mai mult.",
        ctaLabel: "Alege permis",
        image_url: "/assets/images/activity-default.jpg",
        buildLink: () => "https://gocity.tpx.lt/S4LY11s7",
    },

    klook: {
        id: "klook",
        name: "Klook",
        category: "activities",
        brandColor: "#ff5b00",
        description: "Aventuri, tururi și experiențe locale unice. Descoperă ce poți face în destinația ta.",
        ctaLabel: "Descoperă activități",
        image_url: "/assets/images/activity-default.jpg",
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
        description: "Audio-ghiduri și tururi pe telefonul tău. Explorează în propriul ritm.",
        ctaLabel: "Vezi tururi",
        image_url: "/assets/activities/wegotrip.jpg",
        buildLink: () => "https://wegotrip.tpx.lt/wLLCYstz",
    },

    searadar: {
        id: "searadar",
        name: "SeaRadar",
        category: "tours",
        brandColor: "#0284c7",
        description: "Închirieri de iahturi și experiențe pe mare. Navighează către următoarea aventură.",
        ctaLabel: "Vezi iahturi",
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
        description: "Rămâi conectat în peste 200 de țări cu eSIM. Fără taxe de roaming, instalare rapidă.",
        ctaLabel: "Vezi planuri eSIM",
        image_url: "/assets/esim/airalo.jpg",
        buildLink: () => "https://airalo.tpx.lt/feoFvQ5n",
    },

    drimsim: {
        id: "drimsim",
        name: "Drimsim",
        category: "esim",
        brandColor: "#0f172a",
        description: "Cartelă SIM universală pentru călători. Tarife locale peste tot în lume.",
        ctaLabel: "Comandă SIM",
        image_url: "/assets/esim/drimsim.jpg",
        buildLink: () => "https://drimsim.tpx.lt/3ntSCd91",
    },

    yesim: {
        id: "yesim",
        name: "Yesim",
        category: "esim",
        brandColor: "#22c55e",
        description: "Internet mobil stabil oriunde călătorești. Activează-ți eSIM-ul în câteva minute.",
        ctaLabel: "Vezi oferte Yesim",
        image_url: "/assets/esim/yesim.jpg",
        buildLink: () => "https://yesim.tpx.lt/OeegGKjR",
    },

    ekta: {
        id: "ekta",
        name: "EKTA eSIM",
        category: "esim",
        brandColor: "#2563eb",
        description: "Conectivitate globală simplă. Alege pachetul potrivit pentru destinația ta.",
        ctaLabel: "Activează eSIM",
        image_url: "/assets/esim/ekta.jpg",
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
        description: "Cel mai rapid motor de căutare pentru zboruri ieftine. Compară sute de companii aeriene.",
        ctaLabel: "Vezi zboruri",
        image_url: "/assets/flight/flight.jpg",
        buildLink: (params) => {
            const { from_iata, to_iata, depart_date, return_date, passengers = 1 } = params || {};
            if (!from_iata || !to_iata) return "https://www.aviasales.com/?marker=688834&locale=ro";

            const toShortDate = (isoDate: string) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
                return isoDate.slice(8, 10) + isoDate.slice(5, 7);
            };

            const d1 = depart_date ? toShortDate(depart_date) : null;
            if (!d1) return `https://www.aviasales.com/search?origin=${from_iata}&destination=${to_iata}&marker=688834&locale=ro`;

            let path = `${from_iata}${d1}${to_iata}`;
            if (return_date) {
                const d2 = toShortDate(return_date);
                if (d2) path += d2;
            }
            path += String(passengers);
            return `https://www.aviasales.com/search/${path}?marker=688834&locale=ro&currency=EUR`;
        }
    },

    qeeq: {
        id: "qeeq",
        name: "QEEQ",
        category: "cars",
        brandColor: "#2563eb",
        description: "Închirieri auto la nivel mondial. Cele mai bune oferte de la furnizori de top.",
        ctaLabel: "Caută mașini",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://qeeq.tpx.lt/yOJgifcr",
    },

    economybookings: {
        id: "economybookings",
        name: "EconomyBookings",
        category: "cars",
        brandColor: "#1e40af",
        description: "Rezervări auto accesibile în toată lumea. Proces simplu și suport non-stop.",
        ctaLabel: "Vezi mașini",
        image_url: "/assets/images/car-default.jpg",
        buildLink: () => "https://economybookings.tpx.lt/H8mpmQJp",
    },

    localrent: {
        id: "localrent",
        name: "Localrent",
        category: "cars",
        brandColor: "#00A859",
        description: "Închirieri auto de la furnizori locali. Servicii personalizate și prețuri oneste.",
        ctaLabel: "Vezi oferte locale",
        image_url: "/assets/images/car-default.jpg",
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
        description: "Cine locale, cursuri de gătit și tururi culinare. Mănâncă alături de localnici.",
        ctaLabel: "Vezi experiențe",
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
        description: "Acces la sute de programe de afiliere de călătorie.",
        ctaLabel: "Vezi parteneri",
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
