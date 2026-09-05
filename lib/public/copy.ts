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

// ═══════════════════════════════════════════════════════════════════════════
// G1.2 — THE GUEST GALLERY AND THE DOWNLOAD. Founder-vetoed 2026-09-05,
// strings 7-15 of the thirty ("veto all approved as proposed").
// ═══════════════════════════════════════════════════════════════════════════
// Source: `docs/mocks/wedding-guests-mock.html` @ `6eea5bf`, frames G2-gallery
// and G2-sheet. A string not in that file is a BOUNCE.
//
// ⚠ EVERY BYTE HERE IS READ BY A STRANGER — a guest at a wedding, on mobile
// data, who has never heard of this estate. No persona name, no house slang, no
// money register (nothing on this surface is money).

/** String 7's sibling — the gallery's own label. */
export const PUBLIC_GALLERY_LABEL = 'The gallery';

export const PUBLIC_DOWNLOAD = {
  /**
   * String 7 · the door. It is a `<summary>`, so it is the tap target AND the
   * thing that opens the sheet — R-G12.16's whole point: the frame the founder
   * ratified, with the browser owning the open and no script anywhere near it.
   */
  door: 'Download these photographs',

  /**
   * String 8. THE COUNT IS LIVE and it is the whole photograph set, hero
   * included — she is downloading the wedding, not the wedding minus its first
   * picture. Singular is handled because a page with one photograph is a real
   * state and "All 1 photographs" is the kind of byte that makes a product look
   * unattended.
   */
  head: (n: number) => (n === 1 ? 'The photograph' : `All ${n} photographs`),

  /**
   * String 9 · RE-VETOED — R-40.47, founder 2026-09-05.
   *
   * WAS 「We'll text you the link.」 and it was a promise the estate could not
   * keep: nothing in the download door texts anything. R-G12.17 ruled the fork
   * to (c) — the link is carried on the ANSWER PAGE, on screen, behind one tap —
   * so the sub-line now says what actually happens.
   *
   * ⚠ THE OLD BYTE IS RETIRED WITH ITS READER, not commented out. It returns in
   * G1.3 beside the button when F-40.104's texted link exists, and it comes back
   * as its own fresh veto rather than as a string someone un-commented.
   */
  sub: 'We\u2019ll have them ready in a moment.',

  /** String 10. */
  phoneLabel: 'Your number',

  /**
   * String 11, with R-G12.15's optional wording. The label ASKS and the
   * placeholder says it may be skipped, because a required-looking field she
   * cannot fill is a reason to abandon the form and lose the download too.
   */
  monthLabel: 'Getting married? Which month',
  /** String 12. */
  monthPlaceholder: 'Month and year \u2014 optional',

  /**
   * String 13 · THE ONE QUESTION (R-G12.3). Her vendor's REGISTERED business
   * name, never one anybody typed — the roll's own rule, and F-40.54's lesson
   * about a hurried credit mislabelling another business.
   */
  mayContact: (owner: string | null) => `${owner || 'This photographer'} may contact me.`,

  /** String 14. */
  cta: 'Send me the link',

  // ── THE ANSWER RENDER — R-40.47's bytes, founder-vetoed 2026-09-05 ────────
  /** The confirmation line the guest reads after her form POST lands. */
  readyHead: 'Your photographs are ready. Tap below to download.',
  /** The one tap. The archive URL sits behind it and never in the address bar. */
  readyCta:  'Download',
  /**
   * The `?sent=0` arm: the door could not mint a token (its signing secret is
   * absent) and said so rather than redirecting her to a link that cannot work.
   * Never-a-false-done at the one control this whole lane exists for.
   */
  readyFailed: 'That didn\u2019t go through. Try again in a moment.',

  /**
   * String 15 · the promise the door actually keeps. `wedding_credits.phone` and
   * `weddings.consent_phone` are both off every public wire by R-G11.6, and a
   * guest's number is never on one either — `publicRoll` builds its shape field
   * by field from an explicit list, with nothing spread.
   */
  fine: 'Your number is never shown on this page.',
} as const;
