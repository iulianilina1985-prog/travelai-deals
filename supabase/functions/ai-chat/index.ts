// supabase/functions/ai-chat/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SYSTEM_PROMPT } from "./system_prompt.ts";
import {
  safeJsonParse,
  isValidAiChatResponse,
  AiChatResponse,
} from "./schema.ts";


/* ======================================================
   CONFIG
====================================================== */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

/* ======================================================
   TYPES (loose, tolerant)
====================================================== */

type Period = {
  depart_date: string | null;
  return_date: string | null;
};

type Route = {
  from: string | null;
  to: string | null;
};

type ConversationState = {
  active_intent?: "flight" | "hotel" | "activity" | "compare" | null;
  from?: string | null;
  to?: string | null;

  // last confirmed period used for searching (and ONLY for that route)
  active_period?: Period; // optional convenience
  period_route?: Route; // which route the active_period belongs to

  // UX flags
  pending?: {
    type: "confirm_period";
    for_to: string | null;
    suggested_period?: Period | null; // show user what we think they mean, but don't use it automatically
  } | null;

  updated_at?: string;
};

type ParsedAI = {
  reply?: string;
  intent?: {
    type?: "flight" | "hotel" | "activity" | "compare" | null;
    from?: string | null;
    to?: string | null;
    compare?: string[] | null;
    depart_date?: string | null;
    return_date?: string | null;
  };
  confidence?: "low" | "medium" | "high";
};

/* ======================================================
   HELPERS
====================================================== */
function normStr(s: unknown): string {
  return String(s ?? "").trim();
}

function isSamePeriodPhrase(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("aceeasi perioada") ||
    t.includes("aceeași perioad") ||
    t.includes("tot perioada") ||
    t.includes("perioada de mai sus") ||
    t.includes("ca mai sus") ||
    t.includes("same period") ||
    t.includes("same dates")
  );
}

function containsAnyDate(text: string) {
  const t = text.toLowerCase();
  // quick checks: ISO / numeric / Romanian month names
  if (/\d{4}-\d{2}-\d{2}/.test(t)) return true;
  if (/\b\d{1,2}[.\-/]\d{1,2}[.\-/]\d{2,4}\b/.test(t)) return true;
  if (/\b(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\b/.test(t)) {
    return true;
  }
  return false;
}

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

/**
 * Very small deterministic parser:
 * - extract a date RANGE if present
 * - extract a SINGLE date if present (as depart_date)
 * Keeps things stable even when AI is confused.
 */
function extractPeriodDeterministic(text: string): Period {
  const t = text.toLowerCase();

  // ISO range: 2026-02-22 - 2026-02-26
  const isoRange = t.match(
    /(\d{4}-\d{2}-\d{2})\s*(?:-|–|—|to|pana la|până la)\s*(\d{4}-\d{2}-\d{2})/,
  );
  if (isoRange) return { depart_date: isoRange[1], return_date: isoRange[2] };

  // numeric range: 22.02.2026 - 26.02.2026 OR 22/02/2026 - 26/02/2026 OR 22-02-2026 - 26-02-2026
  const numRange = t.match(
    /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})\s*(?:-|–|—|to|pana la|până la)\s*(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/,
  );
  if (numRange) {
    const [, d1, m1, y1, d2, m2, y2] = numRange;
    return {
      depart_date: normalizeDate(d1, m1, y1),
      return_date: normalizeDate(d2, m2, y2),
    };
  }

  // RO range: 22 - 26 februarie 2026
  const roRange = t.match(
    /(\d{1,2})\s*(?:-|–|—|pana la|până la)\s*(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/,
  );
  if (roRange) {
    const [, d1, d2, mon, y] = roRange;
    const mm = MONTHS_RO[mon];
    return {
      depart_date: normalizeDate(d1, mm, y),
      return_date: normalizeDate(d2, mm, y),
    };
  }

  // single ISO
  const isoSingle = t.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoSingle) return { depart_date: isoSingle[1], return_date: null };

  // single numeric: 22.02.2026 / 22-02-2026 / 22/02/2026
  const numSingle = t.match(/(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})/);
  if (numSingle) {
    const [, d, m, y] = numSingle;
    return { depart_date: normalizeDate(d, m, y), return_date: null };
  }

  // single RO: 22 februarie 2026
  const roSingle = t.match(
    /(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie)\s+(\d{4})/,
  );
  if (roSingle) {
    const [, d, mon, y] = roSingle;
    return { depart_date: normalizeDate(d, MONTHS_RO[mon], y), return_date: null };
  }

  return { depart_date: null, return_date: null };
}

/**
 * Minimal city extraction (you can extend this list).
 * We keep it deterministic so "Roma sau Viena" is recognized.
 */
const CITY_ALIASES: Array<{ key: string; value: string }> = [
  { key: "bucure", value: "București" },
  { key: "otp", value: "București" },

  { key: "paris", value: "Paris" },
  { key: "roma", value: "Roma" },
  { key: "rome", value: "Roma" },
  { key: "viena", value: "Viena" },
  { key: "vienna", value: "Viena" },
  { key: "londra", value: "Londra" },
  { key: "london", value: "Londra" },
  { key: "madrid", value: "Madrid" },
  { key: "milano", value: "Milano" },
  { key: "milan", value: "Milano" },
];

function extractToCitiesDeterministic(text: string): string[] {
  const t = text.toLowerCase();
  const hits: string[] = [];
  for (const c of CITY_ALIASES) {
    if (t.includes(c.key)) {
      if (!hits.includes(c.value)) hits.push(c.value);
    }
  }
  // remove București from "to" list (it’s usually origin)
  return hits.filter((x) => x !== "București");
}

function extractFromCityDeterministic(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("bucure") || t.includes("otp")) return "București";
  return null;
}

/**
 * Business rule:
 * - We NEVER auto-apply previous period to a NEW destination.
 * - If user says "aceeasi perioada" but changes destination → ask to confirm period again.
 * - If destination stays same and user doesn't provide dates → we can reuse active_period (good UX).
 */
function needsPeriodConfirmation(params: {
  intentType: string | null;
  nextTo: string | null;
  prevState: ConversationState;
  prompt: string;
  providedPeriod: Period;
}) {
  const { intentType, nextTo, prevState, prompt, providedPeriod } = params;

  if (intentType !== "flight") return { needed: false, reason: "" };

  const hasNewDates = !!(providedPeriod.depart_date || providedPeriod.return_date);
  if (hasNewDates) return { needed: false, reason: "" };

  // If no destination, we must ask anyway (route incomplete)
  if (!nextTo) return { needed: true, reason: "missing_to" };

  // If destination changed vs previous state, require confirmation
  const prevTo = prevState.to ?? null;
  const changedTo = prevTo && nextTo && prevTo !== nextTo;

  if (changedTo) {
    return { needed: true, reason: isSamePeriodPhrase(prompt) ? "changed_to_same_period_phrase" : "changed_to_no_dates" };
  }

  // If destination same, and we have an active_period for same route → not needed (we can reuse)
  const p = prevState.active_period ?? { depart_date: null, return_date: null };
  const r = prevState.period_route ?? { from: null, to: null };
  const canReuse =
    !!p.depart_date &&
    !!p.return_date &&
    (r.to ?? prevTo) === nextTo;

  if (canReuse) return { needed: false, reason: "reuse_ok" };

  // no saved period to reuse
  return { needed: true, reason: isSamePeriodPhrase(prompt) ? "same_period_but_none_saved" : "no_dates_no_saved_period" };
}

function buildProReplyConfirmPeriod(to: string | null, suggested: Period | null) {
  const sug = suggested?.depart_date && suggested?.return_date
    ? `\n\nUltima perioadă folosită: **${suggested.depart_date} → ${suggested.return_date}**.\nScrie „ok” ca să o folosesc sau trimite o perioadă nouă.`
    : "";

  return `Am notat destinația${to ? ` **${to}**` : ""} ✈️  
Ca să caut o ofertă nouă, te rog confirmă **perioada** (ex: 22.02.2026 – 26.02.2026).${sug}`;
}

function buildProReplyMissingTo() {
  return `Unde vrei să zbori ✈️? Spune-mi orașul (ex: Paris / Roma / Viena) și perioada.`;
}

function softFallbackReply(prompt: string) {
  // No “sincopa”, no “AI unavailable”. Just a clean recovery line.
  const hasTravel = /\b(zbor|flight|hotel|cazare|activit|bilete|city break|vacan)\b/i.test(prompt);
  if (hasTravel) {
    return `Am prins ideea 🙂 Ca să te ajut rapid, spune-mi **destinația** și **perioada** (ex: 22.02.2026 – 26.02.2026).`;
  }
  return `Sunt aici 🙂 Spune-mi ce vrei să planificăm legat de travel: zboruri, cazare sau activități.`;
}

/* ======================================================
   FINALIZE INTENT (with strict business rules)
====================================================== */

function finalizeIntent(args: {
  parsedIntent: any;
  state: ConversationState;
  prompt: string;
}): {
  finalIntent: {
    type: "flight" | "hotel" | "activity" | "compare" | null;
    from: string | null;
    to: string | null;
    compare: string[] | null;
    depart_date: string | null;
    return_date: string | null;
  };
  overrides: {
    forceReply?: string;
    setPending?: ConversationState["pending"];
    clearPending?: boolean;
  };
  nextStatePatch: Partial<ConversationState>;
} {
  const { parsedIntent, state, prompt } = args;

  // Deterministic signals (stability)
  const detFrom = extractFromCityDeterministic(prompt);
  const detToCities = extractToCitiesDeterministic(prompt);
  const detPeriod = extractPeriodDeterministic(prompt);

  // Intent type
  const type =
    (parsedIntent?.type as ConversationState["active_intent"]) ??
    state.active_intent ??
    // small heuristic: if user mentions “pret zbor / zbor”
    (/\b(zbor|flight|avion|pret)\b/i.test(prompt) ? "flight" : null);

  // Destination / compare
  const compare =
    Array.isArray(parsedIntent?.compare) ? parsedIntent.compare :
    (detToCities.length >= 2 ? detToCities.slice(0, 4) : null);

  const to =
    normStr(parsedIntent?.to) || (detToCities.length === 1 ? detToCities[0] : "") || normStr(state.to) || null;

  const from =
    normStr(parsedIntent?.from) || detFrom || normStr(state.from) || null;

  // Dates:
  // - prefer explicit dates provided now (detPeriod is reliable)
  // - otherwise use AI intent if it looks like an ISO date
  const aiDepart = normStr(parsedIntent?.depart_date);
  const aiReturn = normStr(parsedIntent?.return_date);

  const looksISO = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

  const providedPeriod: Period = {
    depart_date: detPeriod.depart_date ?? (looksISO(aiDepart) ? aiDepart : null),
    return_date: detPeriod.return_date ?? (looksISO(aiReturn) ? aiReturn : null),
  };

  // Decide if we need confirmation
  const confirm = needsPeriodConfirmation({
    intentType: type,
    nextTo: to,
    prevState: state,
    prompt,
    providedPeriod,
  });

  const overrides: {
    forceReply?: string;
    setPending?: ConversationState["pending"];
    clearPending?: boolean;
  } = {};

  const nextStatePatch: Partial<ConversationState> = {
    active_intent: type,
    from,
    to,
  };

  // If user typed "ok" and we had pending confirm_period with suggested period -> accept it
  const isOk = /^\s*(ok|da|yes|okey|okay)\s*$/i.test(prompt);
  if (isOk && state.pending?.type === "confirm_period" && state.pending?.suggested_period?.depart_date && state.pending?.suggested_period?.return_date) {
    const sp = state.pending.suggested_period;
    overrides.clearPending = true;

    // Confirmed period now becomes active_period BUT ONLY for current route
    nextStatePatch.active_period = { depart_date: sp.depart_date, return_date: sp.return_date };
    nextStatePatch.period_route = { from, to };

    return {
      finalIntent: {
        type: type ?? null,
        from,
        to,
        compare,
        depart_date: sp.depart_date,
        return_date: sp.return_date,
      },
      overrides,
      nextStatePatch,
    };
  }

  // If destination changed and user says “same period”, DO NOT auto-apply; ask confirmation.
  if (confirm.needed) {
    // offer suggested period if we have one (from last confirmed search), but do NOT use it
    const suggested = state.active_period?.depart_date && state.active_period?.return_date
      ? state.active_period
      : null;

    if (confirm.reason === "missing_to") {
      overrides.forceReply = buildProReplyMissingTo();
      overrides.setPending = null;
    } else {
      overrides.forceReply = buildProReplyConfirmPeriod(to, suggested);
      overrides.setPending = {
        type: "confirm_period",
        for_to: to,
        suggested_period: suggested,
      };
    }

    // In this situation, we intentionally return NO dates (so offers won't generate date params)
    return {
      finalIntent: {
        type: type ?? null,
        from,
        to,
        compare,
        depart_date: null,
        return_date: null,
      },
      overrides,
      nextStatePatch,
    };
  }

  // If destination is same and no dates provided now, reuse active_period ONLY if it belongs to this route.
  let depart_date = providedPeriod.depart_date;
  let return_date = providedPeriod.return_date;

  if (!depart_date && !return_date && type === "flight") {
    const p = state.active_period ?? { depart_date: null, return_date: null };
    const r = state.period_route ?? { from: null, to: null };

    const sameRoute = (r.to ?? state.to ?? null) === to;
    if (sameRoute && p.depart_date && p.return_date) {
      depart_date = p.depart_date;
      return_date = p.return_date;
    }
  }

  // If we have a new explicit period now -> this becomes the active_period for the current route
  if (type === "flight" && depart_date && return_date) {
    nextStatePatch.active_period = { depart_date, return_date };
    nextStatePatch.period_route = { from, to };
    overrides.clearPending = true;
  }

  return {
    finalIntent: {
      type: type ?? null,
      from,
      to,
      compare,
      depart_date: depart_date ?? null,
      return_date: return_date ?? null,
    },
    overrides,
    nextStatePatch,
  };
}

/* ======================================================
   SERVER
====================================================== */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const prompt = normStr(body?.prompt);
    const conversation_id = body?.conversation_id;
    const user_id = body?.user_id ?? null;

    if (!conversation_id) {
      return new Response(
        JSON.stringify({
          reply: "Lipsește conversation_id.",
          intent: {},
          confidence: "low",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({
          reply: "Spune-mi ce ai vrea să planificăm 🙂",
          intent: {},
          confidence: "low",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ================= LOAD HISTORY ================= */

    const { data: history } = await supabase
      .from("chat_history")
      .select("role, content")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true })
      .limit(20);

    /* ================= LOAD STATE ================= */

    const { data: stateRow } = await supabase
      .from("conversation_state")
      .select("state")
      .eq("conversation_id", conversation_id)
      .maybeSingle();

    const state: ConversationState = (stateRow?.state ?? {
      active_intent: null,
      from: null,
      to: null,
      active_period: { depart_date: null, return_date: null },
      period_route: { from: null, to: null },
      pending: null,
    }) as ConversationState;

    /* ================= OPENAI ================= */

    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content:
          "CONTEXT MEMORIE (folosește-l, nu repeta întrebări deja clarificate):\n" +
          JSON.stringify(state, null, 2),
      },
      ...(history ?? []),
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse<AiChatResponse>(raw);

if (!parsed.ok || !isValidAiChatResponse(parsed.value)) {
  // AI a răspuns prost → NU stricăm conversația
  const fallback = softFallbackReply(prompt);

  return new Response(
    JSON.stringify({
      reply: fallback,
      intent: {
        type: "null",
        from: state.from ?? null,
        to: state.to ?? null,
        depart_date: null,
        return_date: null,
      },
      confidence: "low",
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

const aiReply = parsed.value.reply;
const aiIntent = parsed.value.intent;
const aiConfidence = "medium";


    /* ================= FINALIZE + GUARD ================= */

    const { finalIntent, overrides, nextStatePatch } = finalizeIntent({
      parsedIntent: aiIntent,
      state,
      prompt,
    });

    const finalReply = overrides.forceReply ?? aiReply;

    /* ================= SAVE CHAT ================= */

    await supabase.from("chat_history").insert([
      { conversation_id, role: "user", content: prompt },
      { conversation_id, role: "assistant", content: finalReply },
    ]);

    /* ================= UPDATE STATE ================= */

    const nextState: ConversationState = {
      ...state,
      ...nextStatePatch,
      pending: overrides.clearPending ? null : (overrides.setPending ?? state.pending ?? null),
      updated_at: new Date().toISOString(),
    };

    await supabase.from("conversation_state").upsert({
      conversation_id,
      user_id,
      state: nextState,
    });

    /* ================= RESPONSE ================= */

    return new Response(
      JSON.stringify({
        reply: finalReply,
        intent: finalIntent,
        confidence: overrides.forceReply ? "high" : aiConfidence,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("AI-CHAT ERROR:", err);

    // Never show “sincopa” to users.
    return new Response(
      JSON.stringify({
        reply: "Hai să o luăm simplu 🙂 Spune-mi destinația și perioada (ex: 22.02.2026 – 26.02.2026).",
        intent: {},
        confidence: "low",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
