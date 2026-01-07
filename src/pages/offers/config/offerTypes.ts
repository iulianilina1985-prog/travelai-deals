export const OFFER_TYPES = {
    flight: {
        id: "flight",
        label: "Zbor",
        icon: "Plane",
    },
    hotel: {
        id: "hotel",
        label: "Hotel",
        icon: "Hotel",
    },
    // urmează: car_rental, transfer, esim etc.
};

export type OfferType = keyof typeof OFFER_TYPES;
