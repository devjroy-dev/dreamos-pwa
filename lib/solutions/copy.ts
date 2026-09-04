// lib/solutions/copy.ts — TDW_19 · EVERY BUSINESS SOLUTIONS STRING, ONE HOME (R-19.6).
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS IS A SECOND COPY FILE AND NOT A MERGE INTO lib/worklist/copy.ts
// ═══════════════════════════════════════════════════════════════════════════
// `lib/worklist/copy.ts` belongs to the M-FINISH S2 seat (kickoff §2). This
// seat does not edit it. That is a CONTENTION rule, not a doctrine one — and it
// happens to agree with the one-home law rather than fight it, because no string
// below duplicates one there. Three strings in the S2 file remain in use on the
// room index and are consumed UNCHANGED, from their own home:
//   COPY.supportTitle   — the shell title, already reads 'Business Solutions'
//   COPY.supportBody    — the footer body
//   COPY.supportAction  — the footer button
// (CE-38 relay #1 item 6: the WhatsApp line survives as the footer. The one row
// on this surface that reaches a human stays.)
//
// ── THE LAWS ON EVERY BYTE BELOW ───────────────────────────────────────────
// No persona names (Victor, Donna, Harvey, Mira) — this is product chrome.
// No rupee glyph and no k/L/Cr shorthand; money is `Rs X,XX,XXX` and is BUILT
// ONLY by `formatRs` in lib/vendor/format.ts, never by a template string here.
// (The glyph is NAMED here and not shown, so the raw file is clean and the cell
// that forbids it can read the whole file rather than only the stripped half —
// a rule stated by breaking itself makes its own gate weaker.)
// Row labels are nouns, ≤2 words. Buttons are verbs, ≤2 words. Both asserted by
// cells in tools/bs_audit.mjs rather than by this comment.
//
// ⚠ FOUNDER VETO IS NOT YET EXERCISED ON ANY BYTE IN THIS FILE. Spec §9 gives
// the founder ONE PASS over the register. `docs/COPY_REGISTER_TDW19.md` carries
// these two-column for that pass; what ships until he rules is PROPOSED, and
// every sentence below is marked in the register as such.

/**
 * ⚠ `coming` IS NOT IN THE FOUNDER'S APPROVED CHIP SET, and is flagged rather
 * than slipped in. Spec §9 approves six chips: Not connected · Connected ·
 * Needs attention · Searching · Live · Expired. R-19.5 then requires a chip for
 * a row whose env gate is closed, and none of the six says that honestly —
 * `Not connected` would tell a vendor she could connect it, which is the one
 * thing she cannot do. So a seventh is proposed here, named in the register as
 * NEW, and it is the founder's to strike.
 */
export const CHIPS = {
  not_connected:   'Not connected',
  connected:       'Connected',
  needs_attention: 'Needs attention',
  searching:       'Searching',
  live:            'Live',
  expired:         'Expired',
  coming:          'Coming',
} as const;

/** Spec §9's buttons, verbatim. Verbs, ≤2 words. */
export const BUTTONS = {
  connect:    'Connect',
  disconnect: 'Disconnect',
  get:        'Get',
  renew:      'Renew',
  make:       'Make',
  share:      'Share',
} as const;

// ── THE NINE ROOMS — R-40.1, FOUNDER-RULED 2026-09-04 ──────────────────────
// These replace spec §0's six (R-40.23). Every byte is the founder's own from
// the ruling and is BYTE-FROZEN; the ratified `W5-hub` frame draws exactly this
// list in exactly this order.
//
// ⚠ THE NINE CARRY NO EYEBROWS, AND THAT IS THE RULING'S SHAPE RATHER THAN AN
// OMISSION. The retired six each had one (`ROW_EYEBROWS`); nine replacements
// were never authored and sit outside the ratified forty, so writing them here
// would be nine strings the founder's pass never saw. The mock draws the rows
// bare and this ships them bare. `ROW_EYEBROWS` retires with its readers.
//
// ⚠ AND THE LABELS ARE NOT ALL ≤2 WORDS. `Contracts & deposits`, `Referrals &
// partners`, `Open dates & rates` and `Your own number` break the old row rule
// that `bs_audit` C6 pinned against `ROWS`. The founder ruled these names by
// name (R-40.1), so the RULE yields to the RULING and the cell retires with the
// list it was written for — said out loud here rather than quietly loosened.
export const ROOM_ROWS = [
  { key: 'wedding_pages', label: 'Wedding pages' },
  { key: 'google',        label: 'Google reviews' },
  { key: 'website',       label: 'Your website' },
  { key: 'contracts',     label: 'Contracts & deposits' },
  { key: 'reminders',     label: 'Payment reminders' },
  { key: 'posts',         label: 'Posts & ads' },
  { key: 'referrals',     label: 'Referrals & partners' },
  { key: 'dates',         label: 'Open dates & rates' },
  { key: 'number',        label: 'Your own number' },
] as const;

// ── ROW_EYEBROWS · RETIRED WITH ITS READERS (R-40.23) ──────────────────────
// The six functional-register eyebrows retired with the six rows they sat
// under. The nine carry none — see ROOM_ROWS above for why that is the ruling's
// shape and not an omission.

export const COPY = {
  // ── THE INDEX ────────────────────────────────────────────────────────────
  indexEyebrow: 'For your business',

  /**
   * When a status read fails. It says what is missing and what still works —
   * the rows are still on screen beneath it, and the WhatsApp footer still
   * reaches a person. R-38.2: the chrome is a fact about the product, the states
   * are a fact about the fetch, and only the second one failed. It does not
   * apologise, and it does not say "something went wrong", which tells a vendor
   * nothing she can act on.
   */
  indexUnavailable: 'Current status could not be loaded. The rows below still open.',

  // ── THE SMALL WORDS THE SURFACES NEED ────────────────────────────────────
  // Each is here rather than inline in a component, because a word typed into a
  // surface is a word the founder's one pass never sees.

  /** When a surface's own door fails. Same shape as `indexUnavailable`. */
  surfaceUnavailable: 'This could not be loaded just now.',

  /** A thing that exists but has not happened yet. Never "N/A", never "empty". */
  noneYet: 'None yet',

  /** The SEO checklist's two states. Words, not ticks — see the surface. */
  checkLive:    'Live',
  checkPending: 'Not yet',

  /** Proof document states. `stale` means a Couture change outran the document. */
  docReady: 'Ready',
  docStale: 'Needs redoing',

  /** Prefixes the cohort median so a vendor knows whose number the second one is. */
  medianLabel: 'median',

  /**
   * Spec §8 gates the Google SYNC on `GBP_QUOTA_APPROVED` separately from the
   * OAuth grant. This sentence exists so a vendor is told the truthful, specific
   * thing — that we are waiting on Google — rather than being shown a dead row.
   */
  googleQuotaPending: 'Automatic updates start once Google approves our access.',

  /**
   * F-19.20 · shown beside a button whose gate is closed. It names WHO is
   * waiting on WHAT, rather than leaving a dead control to explain itself.
   */
  withheldNote: 'This opens once we finish connecting the service.',

  /**
   * F-19.21 · THE WEBSITE ROW NO LONGER IMPLIES AN ADDRESS THAT RESOLVES.
   * The surface printed `<handle>.thedreamwedding.in` as though it were live;
   * the founder opened it and got DEPLOYMENT_NOT_FOUND. No wildcard DNS exists
   * — that is P2 infrastructure, and a founder-side Vercel/DNS action filed in
   * the ledger. Until the wildcard is live the row states when the address
   * arrives and shows nothing that looks clickable.
   */
  websiteAddressPending: 'Arrives with your own domain',
  websiteAddressNote:    'Your address is reserved. It goes live when your domain is set up.',

  /**
   * The room footer, shrunk to the ruled one line. The tail of the sentence IS
   * the button — `COPY.supportAction` in `lib/worklist/copy.ts` already reads
   * `Message us on WhatsApp`, so the two render as the ruled sentence without a
   * second home for those four words.
   */
  footerLine: 'Something broken?',

  // ── THE SENTENCES SPEC §9 REQUIRES TO EXIST ──────────────────────────────
  // Each is PROPOSED. The founder's bytes replace them at his one pass.

  /**
   * Spec §5's ownership honesty clause: the domain is registered in the
   * vendor's name and TDW is technical contact only. Written so the promise is
   * legible without a lawyer, and so the part that matters — it leaves with her
   * — is the part she reads last and remembers.
   */
  domainOwnership: 'The domain is registered in your name, not ours. If you ever leave, it goes with you.',

  /**
   * Spec §5's pass-through line. NOT a money string: the figure is rendered
   * beside it by formatRs, so no price is ever typed into copy and this
   * sentence cannot go stale when the registrar's rate moves.
   */
  costPassThrough: 'Billed at cost on your next invoice. We add nothing to it.',

  /**
   * Spec §7's below-cohort line, verbatim from the spec including the shape of
   * the substitution. Rendered with the city name; if the city is unknown the
   * `benchmarksNoCity` line below is used instead, because 'Not enough vendors
   * in null yet' is the byte that ships if nobody writes the second one.
   */
  benchmarksBelowCohort: 'Not enough vendors in {city} yet.',
  benchmarksNoCity:      'Not enough vendors in your category yet.',

  /**
   * CE-38 relay #1 item 4: what a vendor with no `routing_handle` sees where her
   * web address would be. She is mid-onboarding; the honest thing is to say when
   * it arrives, not to show her a broken address or an empty line.
   */
  subdomainPending: 'Your web address is ready once onboarding is finished.',

  // ── THE EMPTY STATES (R-19.2: the empty state is the product's real first
  //    state, not a placeholder). Each says what the row will do and what the
  //    vendor's one next action is. None of them apologises.
  googleEmpty:     'Connect your Google listing and we keep your name, hours and photos in step with your rooms — and ask each couple for a review after their date.',
  websiteEmpty:    'Every vendor gets an address on our domain. Search for your own name here and we buy it, wire it up and put your page on it.',
  seoEmpty:        'Once your page is live we make it findable — structured, fast, indexed — and show you what couples searched to reach it.',
  marketingEmpty:  'Posts and ad briefs written from your own portfolio and calendar. Nothing goes out without you sending it.',
  proofEmpty:      'The three documents you send most: a rate card, a one-page profile, and answers to what couples always ask.',
  benchmarksEmpty: 'How your reply time and enquiries compare with your category in your city. We never show another vendor\u2019s numbers.',

  // ── THE /v/<code> HOLDING PAGE (R-19.7, ruled at relay #1) ───────────────
  /**
   * F-19.14: no per-vendor public URL exists anywhere in the estate today, and
   * `tdw_referral_invite` is already APPROVED at Meta pointing here. This page
   * is that address from today. It says what is true and offers the one thing
   * that works — it does not apologise for a storefront that has not shipped,
   * because a couple arriving from a friend's WhatsApp did not come for an
   * explanation of our roadmap.
   */
  publicPageLine:    'Takes enquiries through The Dream Wedding.',
  publicPageEnquire: 'Enquire on WhatsApp',
  publicPageUnknown: 'This page is no longer available.',

  // ── THE /r/<code> UNSET CASE (R-19.7) ───────────────────────────────────
  /** When a vendor has no review URL on file, the redirect has nowhere to go. */
  reviewUnsetLine: 'This review link is not set up yet.',
} as const;

export type ChipKey   = keyof typeof CHIPS;
export type ButtonKey = keyof typeof BUTTONS;
// `RowKey` retired with `ROWS` (R-40.23). The nine are an ordered array, not a
// keyed record, because their ORDER is the ruling and a record's key order is
// not a contract.
