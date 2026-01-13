import { AgentState } from "./state.ts";

export interface Plan {
    next_action: 'ask_question' | 'suggest_offer' | 'provide_info' | 'general_chat';
    reasoning: string;
    focus_field?: string;
}

export function planNextMove(state: AgentState): Plan {
    // 1. Destination is fundamental
    if (!state.destination) {
        return {
            next_action: 'ask_question',
            reasoning: "Missing destination.",
            focus_field: 'destination'
        };
    }

    // 2. Dates (needed for flights/hotels)
    if (!state.dates) {
        return {
            next_action: 'ask_question',
            reasoning: "Missing dates.",
            focus_field: 'dates'
        };
    }

    // 3. Offers - Sequential Logic

    // A. FLIGHTS
    // Show if: We have dates, haven't shown flights, and user isn't in the destination city (assumed).
    if (state.last_offer_type !== 'flight' &&
        !state.offers_shown?.some(id => id.includes('flight'))) {
        return {
            next_action: 'suggest_offer',
            reasoning: "Ready to show flights."
        };
    }

    // B. HOTELS
    // Show if: Flights shown (or skipped), haven't shown hotels.
    if (state.last_offer_type !== 'hotel' &&
        !state.offers_shown?.some(id => id.includes('hotel'))) {
        return {
            next_action: 'suggest_offer',
            reasoning: "Ready to show hotels."
        };
    }

    // 4. Missing Details (People, Budget)
    if (!state.people) {
        return {
            next_action: 'ask_question',
            reasoning: "Need number of people.",
            focus_field: 'people'
        };
    }

    if (!state.budget) {
        return {
            next_action: 'ask_question',
            reasoning: "Need budget preference.",
            focus_field: 'budget'
        };
    }

    // C. ACTIVITIES
    if (state.last_offer_type !== 'activity' &&
        !state.offers_shown?.some(id => id.includes('activity'))) {
        return {
            next_action: 'suggest_offer',
            reasoning: "Ready to show activities."
        };
    }

    // Default: Chat/Refine
    return {
        next_action: 'general_chat',
        reasoning: "All main steps covered. Chatting or refining."
    };
}
