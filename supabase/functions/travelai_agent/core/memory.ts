import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { AgentState, INITIAL_STATE } from "./state.ts";

export class AgentMemory {
    private client: SupabaseClient;
    private conversationId: string;

    constructor(client: SupabaseClient, conversationId: string) {
        this.client = client;
        this.conversationId = conversationId;
    }

    async loadState(): Promise<AgentState> {
        if (!this.conversationId) return { ...INITIAL_STATE };

        const { data, error } = await this.client
            .from("chat_conversations")
            .select("memory")
            .eq("id", this.conversationId)
            .single();

        if (error) {
            console.error("Memory Load Error:", error);
            return { ...INITIAL_STATE };
        }

        // Return merged state (defaults + loaded)
        return { ...INITIAL_STATE, ...(data?.memory || {}) };
    }

    async saveState(state: AgentState) {
        if (!this.conversationId) return;

        const { error } = await this.client
            .from("chat_conversations")
            .update({ memory: state })
            .eq("id", this.conversationId);

        if (error) console.error("Memory Save Error:", error);
    }
}
