// lib/admin-api/modelRoutesCopy.ts — THE WORDS ON THE MODEL ROUTES PANEL.
// CE-41 seat F, R-41.85. Every string ratified in seat E's veto sheet §D
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
export const SURFACE_ORDER = ['wa_vendor', 'pwa_vendor', 'wa_couple', 'wa_marketing', 'harvest'] as const;

const SURFACE_NAME: Record<string, string> = {
  wa_vendor:    'Answer vendors on WhatsApp',
  pwa_vendor:   'Answer vendors in the app',
  wa_couple:    'Answer couples on WhatsApp',
  wa_marketing: 'Write the marketing outreach',
  harvest:      'Harvest prospects',
};

const SURFACE_SUB: Record<string, string> = {
  wa_vendor:    'vendor line · Victor and Donna',
  pwa_vendor:   'vendor rooms · Victor and Donna',
  wa_couple:    'couple line',
  wa_marketing: 'marketing line · Mira and Mira’s nudge',
  harvest:      'one role',
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
  wa_vendor:    { provider: 'Victor', donna: 'Donna' },
  pwa_vendor:   { provider: 'Victor', donna: 'Donna' },
  wa_marketing: { provider: 'Mira',   nudge: 'Mira’s nudge' },
  wa_couple:    { provider: '' },   // a single unnamed role — the switch rides the surface row
  harvest:      { provider: '' },
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

// ── THE VALUE LINE (§D-31, amended) ─────────────────────────────────────────
// The frame ratified two shapes: `Anthropic · default` and `DeepSeek · changed 4 Sep`.
// Two more words are needed and both are named in the handover as additions:
//
//   `borrowed`  — a WhatsApp vendor lane with no row of its own resolves through
//                 its in-app twin (F-41.46). Calling that `default` would be false:
//                 there is no default for `wa_vendor` in the code matrix at all,
//                 and the value shown came from another lane's row.
//   `seeded`    — a row exists but no one has moved it (0153's four wa_vendor rows,
//                 and any row written before the panel existed). `default` would
//                 claim there is no row; `changed` would claim a hand moved it.
//
// Each word answers "where did this value come from", which is the only question
// the line is for.
export function provenanceWord(lane: {
  has_row: boolean; borrowed: boolean; changed_at: string | null;
}): string {
  if (lane.changed_at) return `changed ${shortDate(lane.changed_at)}`;
  if (lane.borrowed) return 'borrowed';
  if (lane.has_row) return 'seeded';
  return 'default';
}

export function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
}
