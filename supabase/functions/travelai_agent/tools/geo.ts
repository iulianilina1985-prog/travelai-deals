// Simple knowledge base stub. In a real system, this would call a real API or DB.

export const DESTINATION_KNOWLEDGE: Record<string, string> = {
    paris:
        "Paris is known as the City of Light. It is famous for the Eiffel Tower, the Louvre Museum, and its café culture. Did you know Paris has a smaller Statue of Liberty?",
    london:
        "London is a historic metropolis with landmarks like Big Ben and Buckingham Palace. It has a vibrant theatre scene in the West End.",
    rome:
        "Rome, the Eternal City, is home to the Colosseum and the Vatican. The food here is legendary—try the Cacio e Pepe!",
    tokyo:
        "Tokyo blends ultra-modern neon skyscrapers with historic temples. It has the most Michelin-starred restaurants in the world.",
    bali:
        "Bali is an Indonesian paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
    "new york":
        "New York City is a global hub of culture, finance, and media. Times Square and Central Park are must-sees.",
    dubai:
        "Dubai is known for luxury shopping, ultramodern architecture and a lively nightlife scene. Burj Khalifa is the tallest tower in the world.",
};

export function getDestinationInfo(city: string): string | null {
    const normalized = city.toLowerCase();
    for (const [key, val] of Object.entries(DESTINATION_KNOWLEDGE)) {
        if (normalized.includes(key)) return val;
    }
    return null;
}
