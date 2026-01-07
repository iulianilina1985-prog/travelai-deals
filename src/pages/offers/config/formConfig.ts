export const FORM_CONFIG = {
    flight: {
        fields: [
            "airports",        // plecare / destinație
            "tripType",        // dus / dus-întors
            "dates",
            "passengers",
            "operators",
        ],
    },

    hotel: {
        fields: [
            "location",        // oraș / destinație
            "dates",
            "passengers",
            "hotelFilters",    // stele, masă, rating
            "operators",
        ],
    },
};
