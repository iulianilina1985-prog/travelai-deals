import { LLM } from "../tools/llm.ts";
import { AgentMemory } from "./memory.ts";
import { AgentState, INITIAL_STATE } from "./state.ts";
import { SYSTEM_PROMPT } from "./personality.ts";
import { planNextMove } from "./planner.ts";
import { selectOffers } from "../tools/offers.ts";
import { getDestinationInfo } from "../tools/geo.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { FallbackAgent } from "./fallback.ts";

export class TravelAgent {
    private llm: LLM;
    private memory: AgentMemory;
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient, openaiKey: string, userId: string, conversationId: string) {
        this.supabase = supabase;
        this.llm = new LLM(openaiKey);
        // Use conversation-scoped memory
        this.memory = new AgentMemory(supabase, conversationId);
    }

    async run(userMessage: string) {
        try {
            return await this.runUnsafe(userMessage);
        } catch (error) {
            console.error("AI Agent Failed:", error);
            const fallback = new FallbackAgent();
            return fallback.run(userMessage);
        }
    }

    async runUnsafe(userMessage: string) {
        // 1. Load State from Conversation Record
        const currentState = await this.memory.loadState();

        // 2. Update State using LLM (Extract new info)
        const newState = await this.updateState(userMessage, currentState);

        // 3. Plan
        const plan = planNextMove(newState);
        console.log("PLAN:", plan);

        // 4. Select Tools/Info
        let toolContext = "";
        let cards: any[] = [];

        // Geo Info (Always add flavor if destination known)
        if (newState.destination) {
            const info = getDestinationInfo(newState.destination);
            if (info) toolContext += `\n[KNOWLEDGE]: ${info}\n`;
        }

        // Offers
        if (plan.next_action === 'suggest_offer') {
            cards = await selectOffers(newState);
            if (cards.length > 0) {
                toolContext += `\n[SYSTEM]: I have attached ${cards.length} ${cards[0].type} offers. Mention them briefly. Do NOT list details.\n`;

                // Update State: Mark these as shown
                newState.last_offer_type = cards[0].type;
                newState.offers_shown = [...(newState.offers_shown || [])];
                // Mark batch generic keys to track progress
                if (cards[0].type === 'flight') newState.offers_shown.push('flight_batch');
                if (cards[0].type === 'hotel') newState.offers_shown.push('hotel_batch');
                if (cards[0].type === 'activity') newState.offers_shown.push('activity_batch');
            }
        }

        // 5. Generate Response
        const systemMsg = `${SYSTEM_PROMPT}

## CURRENT TRIP STATE (JSON)
${JSON.stringify(newState, null, 2)}

## PLAN
${JSON.stringify(plan)}

## TOOL CONTEXT
${toolContext}
`;

        const reply = await this.llm.chat([
            { role: "system", content: systemMsg },
            { role: "user", content: userMessage }
        ]);

        // 6. Save State Back to Conversation
        await this.memory.saveState(newState);

        return {
            reply: reply,
            cards: cards,
            state: newState
        };
    }

    private async updateState(message: string, current: AgentState): Promise<AgentState> {
        const prompt = `
    Analyze user message. Update the JSON state.
    Merge new info with old info.
    
    CURRENT STATE:
    ${JSON.stringify(current)}

    USER MESSAGE:
    "${message}"

    Output ONLY the merged JSON.
    `;

        const result = await this.llm.chat(
            [{ role: 'system', content: prompt }],
            { type: "json_object" }
        );

        // Merge result safely
        return { ...current, ...result };
    }
}
