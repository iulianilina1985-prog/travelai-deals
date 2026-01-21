// src/pages/offers/mockData.js
// Mock offers for public search page - displayed ONLY before first search
// These are clearly marked as "Demo" and disappear after real search

export const MOCK_OFFERS = [
    {
        id: "mock-flight-1",
        type: "flight",
        provider: "Demo",
        title: "Example flight Bucharest → London",
        description: "This is a demonstration card. Search for real offers for updated results from hundreds of airlines.",
        image_url: "/assets/flight/flight.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Search real flights",
            url: "#search"
        }
    },
    {
        id: "mock-activity-1",
        type: "activity",
        provider: "Demo",
        title: "Example activities in Paris",
        description: "Demonstration card for activities and tourist attractions. Use the search form for real offers.",
        image_url: "/assets/images/activity-default.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Search real activities",
            url: "#search"
        }
    },
    {
        id: "mock-car-1",
        type: "car_rental",
        provider: "Demo",
        title: "Example car rental",
        description: "Demonstration card for car rentals. Search for real offers to see current availability and prices.",
        image_url: "/assets/images/car-default.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Search real cars",
            url: "#search"
        }
    },
    {
        id: "mock-transfer-1",
        type: "transfer",
        provider: "Demo",
        title: "Example airport transfer",
        description: "Demonstration card for transfers. Use the search for real offers from our verified partners.",
        image_url: "/assets/images/car-default.jpg",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Search real transfers",
            url: "#search"
        }
    },
    {
        id: "mock-esim-1",
        type: "esim",
        provider: "Demo",
        title: "Example travel eSIM",
        description: "Demonstration card for eSIM. Search for real offers for connectivity in over 200 countries.",
        image_url: "/assets/images/no_image.png",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Search real eSIM",
            url: "#search"
        }
    },
    {
        id: "mock-hotel-1",
        type: "hotel",
        provider: "Demo",
        title: "Example hotel accommodation",
        description: "Demonstration card for hotels. Use the form to find real accommodations at the best prices.",
        image_url: "/assets/images/no_image.png",
        isMock: true,
        provider_meta: {
            id: "demo",
            name: "Demo",
            brand_color: "#94a3b8"
        },
        cta: {
            label: "Search real hotels",
            url: "#search"
        }
    }
];
