// src/pages/offers/mockData.js
// Mock offers for public search page - displayed ONLY before first search
// These are clearly marked as "Demo" and disappear after real search

export const MOCK_OFFERS = [
    {
        id: "mock-flight-1",
        type: "flight",
        provider: "Demo",
        title: "Exemplu zbor București → Londra",
        description: "Acesta este un card demonstrativ. Caută oferte reale pentru rezultate actualizate din sute de companii aeriene.",
        image_url: "/assets/flight/flight.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Caută zboruri reale",
            url: "#search"
        }
    },
    {
        id: "mock-activity-1",
        type: "activity",
        provider: "Demo",
        title: "Exemplu activități în Paris",
        description: "Card demonstrativ pentru activități și atracții turistice. Folosește formularul de căutare pentru oferte reale.",
        image_url: "/assets/images/activity-default.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Caută activități reale",
            url: "#search"
        }
    },
    {
        id: "mock-car-1",
        type: "car_rental",
        provider: "Demo",
        title: "Exemplu închiriere mașină",
        description: "Card demonstrativ pentru închirieri auto. Caută oferte reale pentru a vedea disponibilitatea și prețurile actuale.",
        image_url: "/assets/images/car-default.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Caută mașini reale",
            url: "#search"
        }
    },
    {
        id: "mock-transfer-1",
        type: "transfer",
        provider: "Demo",
        title: "Exemplu transfer aeroport",
        description: "Card demonstrativ pentru transferuri. Folosește căutarea pentru oferte reale de la partenerii noștri verificați.",
        image_url: "/assets/images/car-default.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Caută transferuri reale",
            url: "#search"
        }
    },
    {
        id: "mock-esim-1",
        type: "esim",
        provider: "Demo",
        title: "Exemplu eSIM călătorii",
        description: "Card demonstrativ pentru eSIM. Caută oferte reale pentru conectivitate în peste 200 de țări.",
        image_url: "/assets/images/no_image.png",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Caută eSIM real",
            url: "#search"
        }
    },
    {
        id: "mock-hotel-1",
        type: "hotel",
        provider: "Demo",
        title: "Exemplu cazare hotel",
        description: "Card demonstrativ pentru hoteluri. Folosește formularul pentru a găsi cazări reale la cele mai bune prețuri.",
        image_url: "/assets/images/no_image.png",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Caută hoteluri reale",
            url: "#search"
        }
    }
];
