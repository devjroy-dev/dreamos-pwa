// lib/admin-api/modelRoutesCopy.ts — THE WORDS ON THE MODEL ROUTES PANEL.
// CE-41 seat F, R-41.85. OWNED BY SEAT E FROM CE-41 E2 (i) — R-41.110, after seat F
// stood down. The header's own rule below (one home each, no shared file edited by
// two seats mid-arc) is why this line exists rather than a silent edit.
// Every string ratified in seat E's veto sheet §D
// (`docs/mocks/COCKPIT/COCKPIT_VETO_SHEET.md`, rows 27–35) unless marked below.
//
// WHY THIS FILE AND NOT `switchboardCopy.ts`. R-41.99 gives seat E that file. These
// are seat F's words for seat F's room, so they live in seat F's home — one home
// each, no shared file edited by two seats mid-arc. If the chair wants one copy
// home for the whole cockpit, this file moves whole and nothing else changes: the
// panel imports three functions and knows nothing else about where words live.
//
// PERSONA NAMES ARE LAWFUL HERE AND NOWHERE ELSE (R-41.89). Victor, Donna and Mira
// appear because the founder is choosing WHO ANSWERS, and naming the hand is the
// whole point of the choice. They must not travel from this file to any other
// surface, and no key, log line or API field carries them.
//
// THE PANEL NEVER INVENTS A LANE. If the door serves a surface, tier or role this
// file has no word for, the raw identifier is rendered instead of a guess — a lane
// the founder cannot read is a lane he can still see, and that is the safer of the
// two failures.

// ── SURFACES ────────────────────────────────────────────────────────────────
// Order is the frame's (§D-28), and the panel renders in this order rather than
// the door's, so the room reads the same every load.
// `bride_app` is sixth and last. F0's panel already rendered it — under the "rest"
// rule, printing its raw key, because this file had no entry for it. That is the
// panel's no-invented-lane law working: the lane was on the wire and the founder
// could see it, unreadable but present. R-41.103 ② ratified its name; this entry is
// the only thing that changed.
export const SURFACE_ORDER = ['wa_vendor', 'pwa_vendor', 'wa_couple', 'wa_marketing', 'harvest', 'bride_app'] as const;

const SURFACE_NAME: Record<string, string> = {
  wa_vendor:    'Answer vendors on WhatsApp',
  pwa_vendor:   'Answer vendors in the app',
  wa_couple:    'Answer couples on WhatsApp',
  wa_marketing: 'Write the marketing outreach',
  // F-41.109 — `Harvest prospects` was false twice over: harvest is the post-turn
  // extraction on Victor's app chat that fills a vendor's own missing lead and record
  // cells (src/agent/harvest.js, one call site at chat.js:2765). It never sees a
  // prospect and never touches WhatsApp. A row naming a surface the founder does not
  // have is a switch he cannot reason about.
  harvest:      'Fill gaps after an app chat',
  bride_app:    'Answer couples in the app',
};

const SURFACE_SUB: Record<string, string> = {
  wa_vendor:    'vendor line · Victor and Donna',
  pwa_vendor:   'vendor rooms · Victor and Donna',
  wa_couple:    'couple line',
  wa_marketing: 'marketing line · Mira and Mira’s nudge',
  harvest:      'one role · the app',
  // Witnessed on the founder's walk, 2026-09-09 05:45: the bride row reads set on
  // the server, not in a row, and BRIDE_LLM_PROVIDER is not set.
  bride_app:    'bride app lane · set on the server',
};

// ── TIERS ───────────────────────────────────────────────────────────────────
// `basic` is here and `trial` is here, and the difference between them is the
// finding F0 filed: `basic` is the tier 25 of the estate's 29 vendors hold and the
// one `vendors.tier` defaults to; `trial` is a live row no code path can reach,
// because 0115 renamed the tier and left the route key behind. The frame drew
// `trial` as a live lane and did not draw `basic` at all — filed as a delta in the
// F2 handover, not silently reconciled either way. The panel shows both and lets
// the door say which is switchable.
const TIER_NAME: Record<string, string> = {
  basic:     'Basic',
  essential: 'Essential',
  signature: 'Signature',
  prestige:  'Prestige',
  advisor:   'Advisor',
  trial:     'Trial',
  default:   '',
};

// ── ROLES, PER SURFACE ──────────────────────────────────────────────────────
// A role's word depends on the room it is in: `provider` is Victor on a vendor
// lane and Mira on the marketing lane. One map, keyed by both, so no call site
// carries a conditional about which persona a surface belongs to.
const ROLE_NAME: Record<string, Record<string, string>> = {
  wa_vendor:    { provider: 'Victor', donna: 'Donna', listener: 'Listener' }, // Listener: the founder, "listen-yes" (CE-44)
  pwa_vendor:   { provider: 'Victor', donna: 'Donna', listener: 'Listener' },
  wa_marketing: { provider: 'Mira',   nudge: 'Mira’s nudge' },
  wa_couple:    { provider: '' },   // a single unnamed role — the switch rides the surface row
  harvest:      { provider: '' },
  bride_app:    { provider: '' },   // read-only; the switch renders as an outline
};

// ── PROVIDERS ───────────────────────────────────────────────────────────────
// DISPLAY ONLY. The switchable set itself is served by the door and is never
// listed here — this map turns an id into a word and falls back to the id, so a
// provider the estate adds tomorrow renders as itself rather than vanishing.
const PROVIDER_NAME: Record<string, string> = {
  anthropic: 'Anthropic',
  deepseek:  'DeepSeek',
  glm:       'GLM',
};

export function surfaceName(surface: string) { return SURFACE_NAME[surface] ?? surface; }
export function surfaceSub(surface: string)  { return SURFACE_SUB[surface] ?? ''; }
export function tierName(tier: string)       { return TIER_NAME[tier] ?? tier; }
export function roleName(surface: string, role: string) {
  const m = ROLE_NAME[surface];
  if (!m) return role;
  return m[role] ?? role;
}
export function providerName(id: string | undefined | null) {
  if (!id) return '—';
  return PROVIDER_NAME[id] ?? id;
}

// ── THE VALUE LINE (§D-31, amended; R-41.103 ③) ─────────────────────────────
// FIVE WORDS, each answering the same question — *where did this value come from* —
// and each of them false in the other four's place:
//
//   `default`   no row anywhere; the router's own literal or its code matrix.
//   `borrowed`  a WhatsApp vendor lane with no row of its own, resolving through its
//               in-app twin (F-41.46). Not `default`: there is no wa_vendor entry in
//               the matrix at all, and the value came from another lane's row.
//   `seeded`    a row exists and no hand has moved it — 0153's four, and any row
//               written before the panel existed.
//   `changed …` a hand moved it, and F-41.93 means THAT HAND. The stamp used to be
//               row-level and the panel showed it beside every hand, so flipping
//               Donna made Victor's line claim an edit he had not had. Each role now
//               reads its own; the row-level pair is consulted ONLY for rows that
//               carry no per-role stamp at all, which is every row written before
//               F1b, and never to speak for a hand that has one.
//   `server`    the lane is not a row. Only the bride app lane, whose value lives in
//               `BRIDE_LLM_PROVIDER` on the server.
export function provenanceWord(
  lane: {
    has_row: boolean; borrowed: boolean; changed_at: string | null;
    provenance?: 'server' | null;
    roles_changed?: Partial<Record<string, { at: string | null; by: string | null }>>;
  },
  role?: string,
): string {
  if (lane.provenance === 'server') return 'server';
  const stamps = lane.roles_changed || {};
  const mine = role ? stamps[role] : undefined;
  if (mine && mine.at) return `changed ${shortDate(mine.at)}`;
  // THE FALLBACK IS NARROW ON PURPOSE. A row with per-role stamps has already said
  // which hands moved; letting the row-level date speak for the others would put the
  // very defect this packet cures back on the glass one branch lower.
  if (Object.keys(stamps).length === 0 && lane.changed_at) return `changed ${shortDate(lane.changed_at)}`;
  if (lane.borrowed) return 'borrowed';
  if (lane.has_row) return 'seeded';
  return 'default';
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
}
