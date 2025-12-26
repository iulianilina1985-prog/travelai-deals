import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

/* ======================================================
   TYPES
====================================================== */

type ConversationState = {
  topic: "travel" | "other";
  activeIntent: "flight" | "hotel" | "activity" | null;
  from?: string | null;
  to?: string | null;
  depart_date?: string | null;
  return_date?: string | null;
  awaiting?: "dates" | "return_date" | null;
  discussedCities: string[];
};

type ParsedInput = {
  intent: "flight" | "hotel" | "activity" | "general";
  from?: string | null;
  to?: string | null;
  depart_date?: string | null;
  return_date?: string | null;
  hasDates: boolean;
};

/* ======================================================
   HELPERS
====================================================== */

const MONTHS_RO: Record<string, string> = {
  ianuarie: "01",
  februarie: "02",
  martie: "03",
  aprilie: "04",
  mai: "05",
  iunie: "06",
  iulie: "07",
  august: "08",
  septembrie: "09",
  octombrie: "10",
  noiembrie: "11",
  decembrie: "12",
};

function normalizeDate(d: string, m: string, y: string) {
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

/* ======================================================
   NLP PARSER (tolerant)
====================================================== */

function parseInput(text: string): ParsedInput {
  const t = text.toLowerCase();

  let intent: ParsedInput["intent"] = "general";
  if (/\b(zbor|avion|flight)\b/.test(t)) intent = "flight";
  if (/\b(hotel|cazare)\b/.test(t)) intent = "hotel";
  if (/\b(activitati|activități|ce pot vizita)\b/.test(t))
    intent = "activity";

  const from = t.includes("bucure") ? "București" : null;

  const to =
    t.includes("paris") ? "Paris" :
    t.includes("madrid") ? "Madrid" :
    t.includes("roma") ? "Roma" :
    t.includes("londra") ? "Londra" :
    t.includes("milano") ? "Milano" :
    null;

  // ISO range
  const iso = t.match(
    /(\d{4}-\d{2}-\d{2})\s*(?:-|–|până la|pana la)\s*(\d{4}-\d{2}-\d{2})/
  );

  if (iso) {
    return {
      intent,
      from,
      to,
      depart_date: iso[1],
      return_date: iso[2],
      hasDates: true,
    };
  }

  // RO range
  const ro = t.match(
    /(\d{1,2})\s*(?:-|–|până la|pana la)\s*(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/
  );

  if (ro) {
    return {
      intent,
      from,
      to,
      depart_date: normalizeDate(ro[1], MONTHS_RO[ro[3]], ro[4]),
      return_date: normalizeDate(ro[2], MONTHS_RO[ro[3]], ro[4]),
      hasDates: true,
    };
  }

  return { intent, from, to, hasDates: false };
}

/* ======================================================
   STATE ENGINE
====================================================== */

function updateState(
  state: ConversationState,
  input: ParsedInput
): ConversationState {
  const next = { ...state };

  if (input.intent !== "general") {
    next.activeIntent = input.intent;
  }

  if (input.from) next.from = input.from;
  if (input.to) {
    next.to = input.to;
    if (!next.discussedCities.includes(input.to)) {
      next.discussedCities.push(input.to);
    }
  }

  if (input.depart_date) next.depart_date = input.depart_date;
  if (input.return_date) next.return_date = input.return_date;

  if (next.activeIntent === "flight") {
    if (!next.depart_date || !next.return_date) {
      next.awaiting = "dates";
    } else {
      next.awaiting = null;
    }
  }

  return next;
}

/* ======================================================
   DIALOG ENGINE
====================================================== */

function decideReply(state: ConversationState): string {
  // GENERAL TRAVEL TALK
  if (!state.activeIntent) {
    return `Pot să te ajut cu idei de vacanță 🌍  
zboruri ✈️, cazare 🏨 sau activități 🎟️.

Spune-mi ce oraș te tentează sau ce vrei să comparăm.`;
  }

  // ACTIVITY
  if (state.activeIntent === "activity" && state.to) {
    return `${state.to} e o alegere super 😊  

Vrei:
• atracții principale  
• experiențe locale  
• sau comparăm cu alt oraș (ex: Roma, Madrid)?`;
  }

  // FLIGHT – missing data
  if (state.activeIntent === "flight") {
    if (!state.to) {
      return `Unde ai vrea să zbori ✈️?`;
    }

    if (!state.depart_date) {
      return `Am notat destinația **${state.to}** ✈️  
Spune-mi perioada (ex: 22–25 aprilie 2026).`;
    }

    if (!state.return_date) {
      return `Perfect ✈️  
Data plecării: **${state.depart_date}**  

Spune-mi și data de întoarcere.`;
    }

    return `Super ✈️  
Caut zboruri **${state.from ?? "din România"} → ${state.to}**  
📅 ${state.depart_date} → ${state.return_date}

Îți afișez imediat opțiunile.`;
  }

  return `Spune-mi cum te pot ajuta mai departe 😊`;
}

/* ======================================================
   SERVER
====================================================== */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  const body = await req.json();
  const prompt = body?.prompt ?? "";

  const prevState: ConversationState =
    body?.state ?? {
      topic: "travel",
      activeIntent: null,
      discussedCities: [],
    };

  const parsed = parseInput(prompt);
  const nextState = updateState(prevState, parsed);
  const reply = decideReply(nextState);

  return new Response(
    JSON.stringify({
      reply,
      state: nextState,
      intent: {
        type: nextState.activeIntent,
        from: nextState.from,
        to: nextState.to,
        depart_date: nextState.depart_date,
        return_date: nextState.return_date,
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
});
