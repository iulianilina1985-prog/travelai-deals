import { getAIProvidersByCategory, AffiliateProvider } from "../../_shared/affiliates/registry.ts";

export class FallbackAgent {

    run(message: string): any {
        const lower = message.toLowerCase();

        // 1. FLIGHTS (Regex)
        const flight = this.extractFlightData(lower);
        if (flight) {
            // We can't resolve IATA without API (potentially), but let's try or skip.
            // For fallback, we'll return a generic flight card search.
            const intent = {
                type: "flight",
                ...flight
            };
            const providers = getAIProvidersByCategory("flight");
            const cards = providers.map(p => this.buildCard(p, intent));
            return {
                reply: `✈️ Am înțeles că cauți zbor din ${flight.from_city} spre ${flight.to_city}. (Mod Simplificat)`,
                cards: cards,
                state: {}
            };
        }

        // 2. GREETINGS
        if (lower.match(/^(buna|salut|hello|hi|neata)/)) {
            return {
                reply: "Salut! 👋 Momentan funcționez în mod limitat (fără AI). Spune-mi dacă cauți zboruri sau hoteluri.",
                cards: [],
                state: {}
            };
        }

        // 3. HOTELS / DESTINATIONS
        // Simple keyword matching
        const cities = ["paris", "roma", "londra", "barcelona", "dubai", "tokyo", "amsterdam", "bucuresti"];
        const foundCity = cities.find(c => lower.includes(c));

        if (foundCity) {
            const capitalized = foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
            const intent = { type: "hotel", to: capitalized };
            const cards = getAIProvidersByCategory("hotel").map(p => this.buildCard(p, intent));

            return {
                reply: `Am găsit oferte de cazare pentru ${capitalized}.`,
                cards: cards,
                state: { destination: capitalized }
            };
        }

        return {
            reply: "Îmi pare rău, nu pot procesa cererea complexă momentan. Te rog încearcă o căutare specifică (ex: 'Zbor Bucuresti Paris').",
            cards: [],
            state: {}
        };
    }

    private extractFlightData(t: string) {
        if (!t.includes("zbor")) return null;

        const routeMatch =
            t.match(/din\s+([a-z ]+?)\s+(?:la|spre|catre)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
            t.match(/zbor\s+([a-z ]+?)\s+([a-z ]+?)(?=\s+\d|\s*$)/) ||
            t.match(/([a-z ]+?)\s*(?:->|→|-)\s*([a-z ]+?)(?=\s+\d|\s*$)/);

        if (!routeMatch) return null;

        return {
            from_city: routeMatch[1].trim(),
            to_city: routeMatch[2].trim(),
            depart_date: new Date().toISOString().split('T')[0], // Default to today
            passengers: 1,
        };
    }

    private buildCard(p: AffiliateProvider, intent: any) {
        const link = p.buildLink(intent);
        return {
            id: `${p.id}|${intent.to || intent.to_city || "gen"}|fallback`,
            type: intent.type,
            provider: p.name,
            title: `${p.name} - ${intent.to || intent.to_city || "Oferta"}`,
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
}
