// lib/public/copy.ts
// THE PUBLIC LANE'S SHARED BYTES — R-G11.15, founder-ruled 2026-09-04.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY A HOIST AND NOT A COPY
// ═══════════════════════════════════════════════════════════════════════════
// Two strings on `app/v/[code]/page.tsx` were module-local `const`s, and Block
// 19 G1.1 added a second public leaf — `app/v/[code]/w/[slug]/page.tsx` — that
// needs both of them byte-identically.
//
// The read-first named this as FORK 6 and refused to pick it, because the one
// arm that must never be taken is the easy one: pasting the sentences into the
// second leaf. That mints a second home for a byte the founder has already
// vetoed, and the two copies then drift on the first edit — with nothing in the
// tree able to say which one is the ruling.
//
// ⚠ THE BYTES ARE UNCHANGED. Not re-voiced, not re-punctuated, not "tidied" in
// transit. A hoist that edits its cargo is a re-voicing wearing a refactor's
// name. `b41` hashes both strings against the values they carried at `ae30180`,
// so an edit here is a fresh veto and the bench says so.
//
// ⚠ AND THE REGISTER STILL WINS. `docs/COPY_REGISTER_TDW19.md` carries the
// colophon two-column for the founder's pass; if this file and the register ever
// disagree, the register is the ruling and this is the defect.

/**
 * THE MISS SENTENCE — F-19.19's byte, and R-G11.5's law made visible.
 *
 * It renders on the same ground as a real page, carrying one sentence and no
 * status code. `404` tells a couple nothing and tells a curious stranger that
 * the handle space is worth probing.
 *
 * It serves EVERY miss on both leaves, and that is the point rather than a
 * convenience: absent ≡ paused ≡ inactive on the card, and absent ≡ unpublished
 * ≡ consent-off ≡ owner-withdrawn on the wedding page. The door answers all of
 * them with one indistinguishable 404 body, so one sentence answers all of them
 * here. A second sentence for any one reason would leak that reason.
 */
export const PUBLIC_MISS = 'This page is no longer available.';

/**
 * THE COLOPHON — D-19.1 §2, founder-amended. TDW appears on a public page
 * EXACTLY ONCE, as a credit line at the foot: no logo, no gold, no rule of its
 * own. The page opens on her name and closes on it; this sits under the close,
 * smaller.
 *
 * `PUBLIC_COLOPHON_LEAD` is the same byte split at the address so the domain can
 * be an anchor. THE WHOLE LINE IS THE RULING and the split is a rendering
 * detail — if the two ever disagree, the whole line wins.
 */
export const PUBLIC_COLOPHON = 'Created and managed by The Dream Wedding \u00b7 thedreamwedding.in';
export const PUBLIC_COLOPHON_LEAD = 'Created and managed by The Dream Wedding \u00b7';
export const PUBLIC_COLOPHON_HREF = 'https://thedreamwedding.in';

/**
 * THE CLAIM PAGE'S FAILURE LINE — R-40.29, founder-vetoed 2026-09-05.
 *
 * BORN OF THE WALK. F-40.53: the claim page caught its error, re-enabled the
 * button and rendered NOTHING. The founder tapped, a stale service worker
 * returned 503, and the page looked exactly as it had before — he only learned
 * the tap had not landed by querying the database. A vendor has no database.
 *
 * It satisfied never-a-false-done (it never claimed success) and that was the
 * whole of what it got right. SILENCE IS NOT THE SAME AS HONESTY, and this is a
 * stranger's single interaction with the estate.
 *
 * ⚠ SHOWN ONLY ON A NON-2xx, AND ONLY AFTER A VISIBLE PENDING STATE. The tap is
 * acknowledged first; the line is what remains when the acknowledgement did not
 * become a result. A line that appears without the pending state would read as
 * a refusal rather than a failure.
 *
 * ⚠ THE APOSTROPHE IS TYPOGRAPHIC (U+2019), NOT ASCII — R-40.19. e-6 in this
 * sitting was this exact class caught one character wide.
 *
 * It says what happened and what to do, and it does NOT apologise or say
 * "something went wrong", which tells a person nothing they can act on — the
 * same reasoning `COPY.indexUnavailable` carries in the solutions home.
 */
export const CLAIM_FAILED = 'That didn\u2019t go through. Try again in a moment.';
