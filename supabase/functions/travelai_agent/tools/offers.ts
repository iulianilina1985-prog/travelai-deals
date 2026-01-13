import { getAIProvidersByCategory, AffiliateProvider } from "../../_shared/affiliates/registry.ts";
import { AgentState } from "../core/state.ts";

export async function selectOffers(state: AgentState): Promise<any[]> {
    const cards: any[] = [];

    if (!state.destination) return [];

    const shown = new Set(state.offers_shown || []);

    // 1. FLIGHTS
    // Logic: Only if dates present, budget present, and NOT shown before.
    if (state.dates &&
        !shown.has('flight_batch') &&
        state.last_offer_type !== 'flight') {

        const providers = getAIProvidersByCategory("flight");
        // Parse rough date string if possible, otherwise pass as is (registry handles nulls)
        // Example state.dates: "2024-06-01 to 2024-06-10"
        let depart_date = state.dates;
        let return_date = undefined;

        // Simple logic to split "X to Y" or "X - Y"
        if (state.dates && (state.dates.includes(' to ') || state.dates.includes(' - '))) {
            const parts = state.dates.split(/ to | - /);
            depart_date = parts[0].trim();
            return_date = parts[1]?.trim();
        }

        const intent: any = {
            to: state.destination,
            depart_date: depart_date,
            return_date: return_date
        };

        for (const p of providers) {
            cards.push(buildCard(p, "flight", state, intent));
        }
        return cards; // RETURN IMMEDIATELY (Sequence: One type at a time)
    }

    // 2. HOTELS
    // Logic: If Flight shown, now show Hotel.
    if (state.last_offer_type === 'flight' && !shown.has('hotel_batch')) {
        const providers = getAIProvidersByCategory("hotel");
        const intent: any = { to: state.destination, dates: state.dates };
        for (const p of providers) {
            cards.push(buildCard(p, "hotel", state, intent));
        }
        return cards;
    }

    // 3. ACTIVITIES
    // Logic: If Hotel shown, now show Activities.
    // Or if User specifically asked for activities (intent handled in planner, but here we enforce sequence too)
    if (state.last_offer_type === 'hotel' && !shown.has('activity_batch')) {
        const providers = getAIProvidersByCategory("activity");
        const intent: any = { to: state.destination };
        for (const p of providers) {
            cards.push(buildCard(p, "activity", state, intent));
        }
        return cards;
    }

    return [];
}

function buildCard(p: AffiliateProvider, type: string, state: AgentState, intent: any) {
    const link = p.buildLink(intent);
    return {
        id: `${p.id}|${state.destination}|${Date.now()}`,
        type: type,
        provider: p.name,
        title: `${type === 'flight' ? 'Zbor spre ' : ''}${state.destination}`,
        description: p.description,
        image_url: p.image_url,
        provider_meta: {
            id: p.id,
            name: p.name,
            brand_color: p.brandColor
        },
        cta: {
            label: p.ctaLabel,
            url: link
        }
    };
}
