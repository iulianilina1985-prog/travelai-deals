export interface AgentState {
    destination?: string;
    departure_city?: string;
    dates?: string; // e.g. "2024-06-01 to 2024-06-10"
    people?: string; // e.g. "2 adults, 1 child"
    budget?: string; // e.g. "medium", "2000 EUR"
    trip_type?: string; // e.g. "romantic", "business"
    interests?: string[]; // e.g. ["museums", "food"]

    // Internal tracking (hidden from prompt if needed, or included)
    last_offer_type?: 'flight' | 'hotel' | 'activity' | 'none';
    offers_shown?: string[]; // IDs of offers shown to avoid duplicates
}

export const INITIAL_STATE: AgentState = {
    interests: [],
    offers_shown: [],
    last_offer_type: 'none'
};
