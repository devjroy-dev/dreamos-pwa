// lib/vendor/profileMeter.ts — THE COMPLETENESS MODEL, ONE HOME (client side).
//
// TDW_09 PHASE B — MOVED from app/vendor/discover/profile/page.tsx (not
// rewritten; the F11(c) studioShared precedent) so the Storefront door's §1
// (F-3(a), founder-vetoed heading 「 Complete your bio 」) renders THE SAME
// score the profile screen shows — never a second authority on one number
// (F-07.15's whole disease). The SERVER's one home remains
// src/lib/vendor/profileScore.js (TERM_WEIGHTS + SECTION_ORDER, TDW_07 P2);
// these client weights mirror it and move only with it.

const W = { hero: 0.135, about: 0.135, photos: 0.270, tags: 0.135, travel: 0.100, rate: 0.135, ig: 0.090 } as const;
const SECTION_ORDER = ['hero', 'about', 'photos', 'tags', 'travel', 'rate', 'ig'] as const;
type Term = typeof SECTION_ORDER[number];
const MIN_TAGS = 3;

type Gaps = Record<Term, {
  met: boolean; gap: number; have?: number; need?: number;
  pending?: number; partial?: boolean;
}>;

function buildGaps(o: {
  approved: number; pending: number; floor: number; hasHero: boolean; about: string;
  tags: string[]; travelNotes: string; rateMin: string; ig: string;
}): Gaps {
  const photoHave = Math.min(o.approved, o.floor);
  const tagHave = Math.min(o.tags.length, MIN_TAGS);
  return {
    hero:   { met: o.hasHero, gap: o.hasHero ? 0 : 1 },
    about:  { met: o.about.trim() !== '', gap: o.about.trim() !== '' ? 0 : 1 },
    photos: { met: o.approved >= o.floor, gap: o.floor > 0 ? (o.floor - photoHave) / o.floor : 0,
              have: o.approved, need: o.floor, pending: o.pending },
    tags:   { met: o.tags.length >= MIN_TAGS, gap: (MIN_TAGS - tagHave) / MIN_TAGS, have: o.tags.length, need: MIN_TAGS },
    // The STATED policy, never the boolean — a vendor who has written "Delhi NCR only"
    // has a complete travel policy and must not be penalised for answering honestly.
    travel: { met: o.travelNotes.trim() !== '', gap: o.travelNotes.trim() !== '' ? 0 : 1 },
    // TDW_07 P4b · F4 — MIN-ONLY, mirroring src/lib/vendor/rateMet.js exactly. This term
    // MUST move in the same sitting as the server's, or the meter tells the vendor his rate
    // is incomplete while the server scores it complete — two authorities on one number,
    // which is the disease F-07.15 killed one surface over.
    // `partial` retires with the upper bound: there is no half-set rate any more. A
    // starting price is set or it is not, and `partial: false` is the honest constant
    // rather than a field left computing over a retired input.
    rate:   { met: o.rateMin !== '', gap: o.rateMin !== '' ? 0 : 1, partial: false },
    ig:     { met: o.ig.trim() !== '', gap: o.ig.trim() !== '' ? 0 : 1 },
  };
}

const scoreOf = (g: Gaps) => SECTION_ORDER.reduce((sum, k) => sum + W[k] * (1 - g[k].gap), 0);export { W, SECTION_ORDER, MIN_TAGS, buildGaps, scoreOf };
export type { Term, Gaps };
