// lib/shared/tagVocabulary.ts — THE ONE VOCABULARY HOME (pwa side).
//
// TDW_09 PACKAGE 2 · PHASE B · F-5 = (a), chair relay #1 · lists FOUNDER-VETOED
// WHOLE, relay #5 (「 all ok 」, RIDER4 §5 drafts verbatim; `other` stays
// honestly list-free).
//
// THE MISMATCH THIS KILLS (F-10.52, re-derived at its own filing): the vendor
// picked from ten lowercase terms; the couple filtered on a DIFFERENT ten,
// capitalised, matched by `.overlaps()` — exact string. `traditional` never
// matched `Traditional`, and seven of ten had no counterpart at all. One
// vocabulary, one normalisation, both planes importing it, is the cure shape
// the chair ruled.
//
// ── THE MIRROR BINDING (F-06.98's precedent — BOTH directions) ──────────────
// dream-os carries a BYTE-EQUIVALENT mirror at `src/lib/shared/tagVocabulary.js`
// (its header names THIS file as the source). The pwa PARITY CELL
// (`scripts/tdw09_p2b_vocab.proof.mjs`) is THE ARBITER: it reads both repos
// side-by-side and asserts list equality term-for-term, order included. Editing
// either file without the other is the red that cell exists to throw. In-repo
// cells on each side guard the lists against their own drift meanwhile.
//
// ── NORMALISATION LAW (relay #4: at WRITE and at FILTER; tolerate-on-read,
//    NEVER backfill) ───────────────────────────────────────────────────────────
// `normalizeTag` = trim + case-fold (Unicode lower). Applied at every WRITE
// door (pwa editors before PATCH; dream-os me.js before store) and at every
// FILTER door (dream-os discover.js before .overlaps). Stored rows are never
// rewritten in bulk — a read tolerates legacy case by normalising its OWN
// comparison, and the row corrects itself on the vendor's next save.
//
// CUSTOM TAGS (F-7, ruled): chips + ONE custom input at each editor; custom
// words are stored, displayed, normalised, and NOT filterable in v1. The
// vendor-facing honesty byte lives with the editors and is founder-vetoed:
// 「 Your own words are shown on your profile, but couples can't filter by them yet. 」

export const TAG_VOCABULARY: Readonly<Record<string, readonly string[]>> = {
  photography:  ['candid', 'documentary', 'editorial', 'film', 'fine-art', 'moody', 'traditional', 'destination', 'intimate', 'luxury'],
  makeup:       ['dewy', 'matte', 'bridal-classic', 'contemporary', 'minimal', 'glam', 'airbrush', 'HD', 'south-indian', 'north-indian'],
  decor:        ['floral', 'minimal', 'royal', 'rustic', 'contemporary', 'traditional', 'destination', 'boho', 'opulent', 'pastel'],
  catering:     ['north-indian', 'south-indian', 'continental', 'pan-asian', 'live-counters', 'vegetarian', 'jain', 'fusion', 'street-food', 'plated'],
  venue:        ['palace', 'resort', 'farmhouse', 'banquet', 'beach', 'garden', 'heritage', 'rooftop', 'destination', 'intimate'],
  mehndi:       ['bridal', 'arabic', 'rajasthani', 'minimal', 'contemporary', 'portrait', 'glitter', 'traditional'],
  choreography: ['sangeet', 'couple', 'family', 'bollywood', 'classical', 'contemporary', 'flashmob'],
  music:        ['dj', 'live-band', 'classical', 'sufi', 'ghazal', 'folk', 'bollywood', 'qawwali'],
  planning:     ['full-service', 'day-of', 'destination', 'intimate', 'large-format', 'luxury'],
  // `other` — free entry only. The category has no vocabulary and should not
  // pretend to (the veto's own parenthetical). vocabularyFor returns null.
} as const;

/** The vetoed list for a category, or null where free entry is the honest
 *  answer ('other', unknown, or a vendor with no category on file). */
export function vocabularyFor(category: string | null | undefined): readonly string[] | null {
  if (!category) return null;
  const key = normalizeTag(category);
  return TAG_VOCABULARY[key] ?? null;
}

/** trim + Unicode case-fold. The ONE normal form, write-side and filter-side. */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

/** Normalise, drop empties, dedupe first-wins (order preserved). */
export function normalizeTags(tags: readonly string[]): string[] {
  const out: string[] = [];
  for (const t of tags) {
    const n = normalizeTag(t);
    if (n && !out.includes(n)) out.push(n);
  }
  return out;
}

/** Is this stored tag one of the category's vetoed terms (case-tolerant)?
 *  Custom words return false — displayed, never filterable (v1). */
export function isVocabularyTag(tag: string, category: string | null | undefined): boolean {
  const list = vocabularyFor(category);
  if (!list) return false;
  const n = normalizeTag(tag);
  return list.some((v) => normalizeTag(v) === n);
}
