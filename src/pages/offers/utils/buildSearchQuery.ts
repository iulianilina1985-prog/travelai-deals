export function buildSearchQuery({ offerType, formData }) {
    switch (offerType) {
        case "flight":
            return {
                type: "flight",
                from: formData.fromAirport,
                to: formData.toAirport,
                dates: [formData.checkIn, formData.checkOut],
                passengers: { adults: formData.adults, children: formData.children },
            };

        case "hotel":
            return {
                type: "hotel",
                location: formData.destination,
                dates: [formData.checkIn, formData.checkOut],
                filters: {
                    stars: formData.hotelStars,
                    rating: formData.hotelRating,
                    meal: formData.mealType,
                },
            };
    }
}
