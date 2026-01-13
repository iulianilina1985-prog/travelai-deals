
import { TravelAgent } from "./core/agent.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Mock Supabase Client
const mockMemory = new Map<string, string>();

const mockSupabase = {
    from: (table: string) => ({
        select: (cols: string) => ({
            eq: (col: string, val: string) => {
                if (table === 'travelai_memory' && col === 'user_id') {
                    // Return all memories for this user
                    const mems = [];
                    for (const [k, v] of mockMemory.entries()) {
                        // Key format in mock: userId:key
                        if (k.startsWith(val + ":")) {
                            const key = k.split(":")[1];
                            mems.push({ key: key, value: v, confidence: 1 });
                        }
                    }
                    return Promise.resolve({ data: mems, error: null });
                }
                return Promise.resolve({ data: [], error: null });
            }
        }),
        upsert: (data: any, opts: any) => {
            if (table === 'travelai_memory') {
                const key = `${data.user_id}:${data.key}`;
                mockMemory.set(key, data.value);
                return Promise.resolve({ error: null });
            }
            return Promise.resolve({ error: null });
        },
        delete: () => ({
            eq: () => ({
                eq: () => Promise.resolve({ error: null })
            })
        })
    })
};

async function runTest() {
    const env = await config({ path: "../../../.env" });
    const apiKey = env["OPENAI_API_KEY"] || Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
        console.error("❌ NO OPENAI_API_KEY FOUND. Cannot run test.");
        return;
    }

    console.log("✅ Starting TravelAI Agent Test...\n");

    const userId = "test_user_123";
    const agent = new TravelAgent(mockSupabase as any, apiKey, userId);

    const inputs = [
        "Salut! Cine esti?",
        "Vreau sa merg in Paris luna viitoare.",
        "Suntem 2 persoane si bugetul e mediu.",
        "Ce am zis mai devreme ca vreau sa vizitez?"
    ];

    for (const input of inputs) {
        console.log(`\n👤 User: ${input}`);
        try {
            const res = await agent.run(input);
            console.log(`🤖 AI: ${res.reply}`);
            if (res.cards && res.cards.length > 0) {
                console.log(`   [OFFERS]: ${res.cards.length} cards generated (${res.cards.map((c: any) => c.type).join(', ')})`);
            }
            console.log(`   [STATE]: Destination=${res.state.destination}, Dates=${res.state.dates?.start}`);
        } catch (e) {
            console.error("Error:", e);
        }
    }
}

runTest();
