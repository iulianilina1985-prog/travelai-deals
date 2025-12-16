/**
 * TravelAI – Travel Orchestrator AI
 * - intelege cereri complexe
 * - memorie reala
 * - raspunsuri naturale
 * - upsell logic (rent a car, activitati, esim)
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.28.0";

/* ================= CONFIG ================= */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const functionsUrl = `${supabaseUrl}/functions/v1`;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_KEY")!,
});

const MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4.1-mini";

/* ================= MEMORY ================= */

const DEFAULT_STATE = {
  context: null as any, // cererea structurata
};

async function loadState(conversation_id: string, user_id: string) {
  const { data } = await supabase
    .from("conversation_state")
    .select("state")
    .eq("conversation_id", conversation_id)
    .single();

  if (!data) {
    await supabase.from("conversation_state").insert({
      conversation_id,
      user_id,
      state: DEFAULT_STATE,
    });
    return structuredClone(DEFAULT_STATE);
  }

  return data.state ?? structuredClone(DEFAULT_STATE);
}

async function saveState(conversation_id: string, state: any) {
  await supabase
    .from("conversation_state")
    .update({
      state,
      updated_at: new Date().toISOString(),
    })
    .eq("conversation_id", conversation_id);
}

async function loadHistory(conversation_id: string) {
  const { data } = await supabase
    .from("chat_history")
    .select("role, content")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: true })
    .limit(15);

  return data ?? [];
}

/* ================= AI PARSER ================= */

async function parseTravelRequest(text: string) {
  const system = `
Extrage din text o cerere de vacanta.
Raspunde DOAR cu JSON valid, fara explicatii.

Structura:
{
  "city": string | null,
  "start_date": string | null,
  "end_date": string | null,
  "adults": number | null,
  "children": number[] | [],
  "hotel_stars": number | null,
  "meal_plan": string | null,
  "needs_flight": boolean,
  "needs_hotel": boolean
}
`;

  const res = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: text },
    ],
    max_tokens: 500,
  });

  return JSON.parse(res.choices[0].message.content!);
}

/* ================= MOCK PROVIDERS (TEMP) ================= */

function mockHotels(city: string) {
  return [
    { name: "Atlantis The Palm", stars: 5, price: "3200 EUR" },
    { name: "Jumeirah Beach Hotel", stars: 5, price: "2900 EUR" },
    { name: "Rixos The Palm", stars: 5, price: "3100 EUR" },
    { name: "Sofitel The Palm", stars: 5, price: "2700 EUR" },
    { name: "Address Sky View", stars: 5, price: "2600 EUR" },
  ];
}

function mockRentACar(city: string) {
  return [
    { company: "Hertz", price: "45 EUR / zi" },
    { company: "Sixt", price: "50 EUR / zi" },
    { company: "Budget", price: "38 EUR / zi" },
  ];
}

/* ================= SYSTEM PROMPT (CONSULTANT) ================= */

const CONSULTANT_PROMPT = `
Esti TravelAI, un consultant de vacante experimentat, care discuta natural cu utilizatorul,
exact ca un agent de turism bun, nu ca un formular sau suport clienti.

REGULI DE CONVERSATIE:
- Conversatia este continua. Fiecare mesaj se bazeaza pe ce s-a discutat anterior.
- Daca un oras sau o destinatie a fost mentionata anterior, aceasta este considerata activa.
- NU cere din nou orasul, perioada sau alte detalii daca ele apar deja in conversatie.
- Cand utilizatorul pune o intrebare scurta (ex: "preturi cazare", "activitati"),
  raspunzi direct folosind contextul deja cunoscut.

CUM RASPUNZI:
- Raspunde clar, direct si sigur pe tine.
- Evita formularile de tip "pentru a va putea oferi..."
- Nu cere detalii inutile daca poti oferi un raspuns util fara ele.
- Daca unele detalii lipsesc, ofera intervale orientative sau exemple, NU intreba imediat.

STRUCTURA RASPUNSULUI:
1. O fraza scurta de context despre destinatie (daca e relevant).
2. Oferte sau informatii concrete (hoteluri, preturi, optiuni).
3. Recomandari similare sau alternative (daca sunt potrivite).
4. Upsell logic, discret, doar daca are sens in context:
   - activitati
   - rent a car
   - eSIM
   - restaurante

UPSOLD – REGULA DE AUR:
- Propui upsell ca sugestie, nu ca intrebare insistenta.
- Exemplu corect:
  "Daca vrei, pot sa-ti arat si cateva optiuni de rent a car in Paris."
- Exemplu gresit:
  "Doriti sa va ofer informatii suplimentare despre..."

STIL:
- Limba romana
- Ton natural, prietenos, profesionist
- Ca un consultant real de travel, nu ca un chatbot rigid

SCOP:
- Ajuti utilizatorul sa aleaga si sa cumpere o vacanta.
- Nu filozofa, nu devia de la travel.
`;

/* ================= MAIN ================= */

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { user_id, conversation_id, prompt } = await req.json();

    let state = await loadState(conversation_id, user_id);
    const history = await loadHistory(conversation_id);

    // PAS 1: parse cererea daca nu avem context
    if (!state.context) {
      state.context = await parseTravelRequest(prompt);
    }

    const ctx = state.context;

    let hotels = [];
    let rentCars = [];

    if (ctx.city && ctx.needs_hotel) {
      hotels = mockHotels(ctx.city);
    }

    if (prompt.toLowerCase().includes("rent")) {
      rentCars = mockRentACar(ctx.city);
    }

    const messages = [
      { role: "system", content: CONSULTANT_PROMPT },
      ...history.map(h => ({ role: h.role, content: h.content })),
      {
        role: "assistant",
        content: `
Context vacanta:
${JSON.stringify(ctx)}

Hoteluri:
${JSON.stringify(hotels)}

Rent a car:
${JSON.stringify(rentCars)}
        `,
      },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1200,
    });

    const reply = completion.choices[0].message.content!;

    await saveState(conversation_id, state);

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: reply },
    ]);

    return new Response(
      JSON.stringify({ reply, context: ctx }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
