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
 * `coming` IS APPROVED — `docs/COPY_REGISTER_TDW19.md` §1a, CE-38 consolidated
 * relay, 2026-08-28. The register is the one home for that fact; this comment
 * points at it rather than restating a status it can drift from.
 *
 * ── F-42.200 · THIS COMMENT SAID THE OPPOSITE FOR TWO WEEKS ─────────────────
 * It read "NOT IN THE FOUNDER'S APPROVED CHIP SET … the founder's to strike"
 * while §1a recorded the approval, the register's own table row said PROPOSED,
 * and `bs_audit` C8 printed it as awaiting veto on every run. Four sites, one
 * fact, three spellings of the wrong answer. Cured together, the register wins.
 *
 * Why it exists at all is unchanged: spec §9's six (Not connected · Connected ·
 * Needs attention · Searching · Live · Expired) predate R-19.5's gates, and
 * `Not connected` would tell a vendor she could connect something she cannot.
 *
 * R-42.12 AMENDED (S4(c)) gives it a second use without a second word: a row
 * that ROUTES to a screen whose act cannot run yet still reads `Coming`, because
 * the chip describes the capability and the row is only the door to hear it.
 */
export const CHIPS = {
  not_connected:   'Not connected',
  connected:       'Connected',
  needs_attention: 'Needs attention',
  searching:       'Searching',
  live:            'Live',
  expired:         'Expired',
  coming:          'Coming',
  /**
   * ⚠ `Open` IS A NEW BYTE AND IT IS FOUNDER-VETOED — 2026-09-05, on his walk,
   * from the four-arm rider `docs/mocks/g11-hub-row-rider.html`. It is NOT a
   * proposal awaiting a pass like `coming` is, and `bs_audit` C8 is amended by
   * label to say which of the two each extra chip is.
   *
   * BORN OF THE WALK, NOT THE MOCK. `W5-hub` drew the live row with NO chip, on
   * the reasoning that a chip saying nothing is chrome. That read correctly on a
   * screenshot and failed on glass: beside eight `Coming` rows, the one WORKING
   * row was the only one with nothing on its right, so it read as a heading
   * rather than a door. R-39.15 — the rendered surface outranks the instrument
   * reasoning about it, and that includes a ratified frame.
   */
  open:            'Open',
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
  // ⚠ R-40.26 — FOUNDER-RULED 2026-09-05, AMENDING R-40.1 FOR R3 ALONE.
  // `Your website` becomes `Your website & SEO`. The other eight stand, and
  // R-40.23's mapping is unchanged: Website -> here, SEO -> here, Proof -> here.
  // Three retired rows land on this one successor, and the name now says so.
  //
  // THIS BYTE DEPARTS FROM THE RATIFIED MOCK BY RULING. `W5-hub` draws
  // `Your website`; the founder's word of 2026-09-05 supersedes the frame on
  // this one string and NO RE-SHOOT IS OWED (his ruling). `b42` C3's list is
  // amended in the same edit and its C7 pin excludes it BY NAME, so the mock
  // stays the authority for every byte except the two that were ruled past it.
  //
  // FOUR WORDS, AND THAT COSTS NOTHING NEW: R-19.6's "≤2 words" rule and the
  // `bs_audit` C6 cell that pinned it already retired under R-G11.25, because
  // four of R-40.1's nine broke it by the founder's word. This lands in the
  // space that ruling cleared.
  { key: 'website',       label: 'Your website & SEO' },
  { key: 'contracts',     label: 'Contracts & deposits' },
  { key: 'reminders',     label: 'Payment reminders' },
  { key: 'posts',         label: 'Posts & ads' },
  { key: 'referrals',     label: 'Referrals & partners' },
  // ── R-42.16 · THE ELEVENTH ROW. FOUNDER-RULED 2026-09-10.
  // The Collab room is a REGISTRY room (`lib/worklist/rooms.ts:181`, band
  // business) and has never appeared on this hub, so a vendor browsing what TDW
  // does for her saw no word for the thing she is most likely to reach for on a
  // quiet week. Barter and collaboration are a POSITIONING CLAIM, and a claim
  // with no row on the hub is not made.
  //
  // ⚠ IT SITS HERE, IMMEDIATELY AFTER `referrals`, BY THAT RULING — the two peer
  // rows belong together — and `introductions` STAYS LAST, which is R-42.8's
  // ruling and is untouched by this one.
  //
  // ⚠ THE TEN BECOME ELEVEN AND FOUR CELLS MOVE BY NAME, NONE LOOSENED. `b42` C3
  // is a PAIR (count + exact ordered join) and `b42` C7 pins every byte against
  // the ratified mock; `b69`:263 and `b73`:227 carry the same guarantee from
  // their own seats. The count IS the guarantee — it is what makes a row nobody
  // ruled impossible to add quietly — so every one of them is amended to eleven
  // with this label in this position, on R-42.8's own precedent.
  // ── R-42.16's LABEL, FOUNDER-RE-RULED 2026-09-10 (folded into CE-42 SHELL-2's
  // packet: one file, one apply). `Collabs & barter` under-claimed the room: it
  // takes requirement posts, which is HIRING. Key, position and href unchanged;
  // the ampersand matches its six neighbours. `b42` C3's ordered join fired on
  // the new byte and was amended by name at its own site, count still eleven.
  { key: 'collabs',       label: 'Hire, collab & barter' },
  { key: 'dates',         label: 'Open dates & rates' },
  // ── CE-45 IGD-1 cut 1 · R-45.27 (the founder, 25 Sept 2026, A1 (a)): the row becomes the room for both
  // Meta channels. Key, place, href and Coming unchanged; eleven rows. "Your own number" now heads its
  // section inside the room (lib/worklist/metaRoom.ts SECTIONS.number). b42, b69 and b122 re-aimed by label.
  { key: 'number',        label: 'WhatsApp and Instagram' },
  // ── R-42.8 · THE TENTH ROW. CHAIR-RULED 2026-09-10, THE FOUNDER'S COPY ACT
  // EXECUTED BY THE CHAIR. It goes LAST, after `number`, by that ruling.
  //
  // ⚠ THE NINE BECOME TEN AND `b42` C3 IS AMENDED BY NAME, NOT LOOSENED. That
  // cell is a PAIR — `labels.length === 9` and an exact ordered join of all
  // nine — and the count IS the guarantee: it is what makes a row nobody ruled
  // impossible to add quietly. Both halves move to ten with this label in this
  // position, on `b06_forkc` §5.8d's precedent (its census went 5 -> 6 with
  // writer 6 NAMED). Relaxing it to `>= 9` would have retired the
  // exhaustiveness permanently, for this row and every row after it.
  { key: 'introductions', label: 'Introductions' },
] as const;

/**
 * CE-45 FE-1 · THE HUB'S FOUR GROUPS (R-45.19, R-45.20; the founder's copy table, 24 Sept 2026).
 * Business Solutions keeps its page and route (P3, ruled "the page") and its eleven rows, now
 * under four headings. Names N4 to N7 are his; the order of rows inside each group is the ruled
 * mock's (docs/mocks/TDW_CE45_BS1_UI_HOME_AND_SHELVES.html, HUB). Every RoomKey appears in
 * exactly one group, which b122 pins; ROOM_ROWS above stays the one home of each row's label.
 */
//
// CE-45 FE-1 HOME_2 · R-45.21, AMENDING THE ORDER AT SITE. The founder, walking HOME_1 live on 24 Sept
// 2026: "work together should be at the top. then get fonud get booked etc." Work together now leads;
// names and member rows are unchanged. b122 1.3 pins this order.
export const HUB_GROUPS: readonly { name: string; keys: readonly RoomKey[] }[] = [
  { name: 'Work together', keys: ['collabs'] },
  { name: 'Get found',     keys: ['website', 'wedding_pages', 'google', 'posts'] },
  // CE-45 IGD-1 cut 1b · R-45.28 (the founder, after cut 1's walk, 25 Sept 2026): "whatsapp and instagram should be the First one
  // in GET BOOKED-above open dates and rates". A2's "last" amended by his word; ROOM_ROWS' own order is untouched.
  { name: 'Get booked',    keys: ['number', 'dates', 'introductions', 'referrals'] },
  { name: 'Get paid',      keys: ['contracts', 'reminders'] },
] as const;

/**
 * CE-45 FE-1 · R-45.20 · ONE LINE UNDER EACH BUSINESS SOLUTIONS ROW. The founder's copy table,
 * rows D13, D14 and D21 to D29, as he took them. D28 keeps "Your own" by his word: it is the
 * room's own name, the one place R-45.20 yields. D13 is kept as a claim because the Contracts
 * room draws exactly those steps (app/vendor/(shell)/contracts/screen.tsx :332, :1057).
 * Where a row also sits on the Money shelf (R-45.19), the shelf reads THIS line; no second byte.
 */
export const ROW_DESC: Readonly<Record<RoomKey, string>> = {
  website:       'A web address, and being found on Google',
  wedding_pages: 'A page for each wedding, with its credit list',
  google:        'Review requests sent after each published wedding',
  posts:         'Posts, reels and ad briefs, drafted from the portfolio and calendar',
  dates:         'Dates still open, and offers to fill them',
  introductions: 'Couples introduced, in both directions',
  referrals:     'Enquiries passed to peers, and received from them',
  // CE-45 IGD-1 cut 1 · R-45.27, A3 (his, 25 Sept 2026): D28 retires with the row's old name; R-45.20's plain register.
  number:        'Enquiries on WhatsApp and Instagram, answered in the studio\u2019s name',
  contracts:     'Agreements signed on WhatsApp; the date held on deposit',
  reminders:     'Payment reminders sent on invoices',
  collabs:       'Crew, models and partners to hire or trade with',
};

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

  /**
   * R-42.12 AMENDED · the one byte every act that cannot run yet says on tap —
   * `/vendor/dates`' `Suggest rates` and `/vendor/number`'s `Connect` today.
   * Founder-vetoed (T1, `docs/mocks/SHELL_VETO_SHEET.md`). ONE HOME: any screen
   * that needs it imports it from here and never types it.
   */
  launchingSoon: 'Launching soon.',

  /**
   * R-42.17 · the sub-head above the can-do list on `/vendor/dates` and
   * `/vendor/number` — the second of the four rungs the chair's hierarchy mock
   * puts to work (`docs/mocks/solutions-hierarchy-mock.html`). Founder-vetoed
   * (T2, `docs/mocks/SHELL_VETO_SHEET.md`). ONE HOME, SHARED: both screens read
   * it from here. Sentence case; `.sol-subhead` uppercases it on the glass.
   */
  canHead: 'What this will do',

  /** When a surface's own door fails. Same shape as `indexUnavailable`. */
  surfaceUnavailable: 'This could not be loaded just now.',

  /** A thing that exists but has not happened yet. Never "N/A", never "empty". */
  noneYet: 'None yet',

  /* `checkLive` / `checkPending` stood here — an SEO checklist the surface never
     rendered (F-40.253; master §7: SEO is a property of the pages, never a
     score). Retired with no reader. */

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

  /* F-19.21's `websiteAddressPending` / `websiteAddressNote` stood here. The
     address is live (/v/<handle>, G3.1 s1) and the room shows it; the two bytes
     had no reader (F-40.253). Retired. */

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
/**
 * The ten keys as a LITERAL UNION, not `string`. `support/page.tsx` types
 * `ROOM_HREFS` as `Record<RoomKey, string>`, so a row ruled into `ROOM_ROWS`
 * without a destination is a `tsc` error rather than a row that renders and
 * goes nowhere (R-42.12 amended, S5(b)). `ROOM_ROWS` is `as const`, which is
 * what makes this a union at all.
 */
export type RoomKey   = (typeof ROOM_ROWS)[number]['key'];
/** A row's label by its key — the screens' titles read this, never a literal. */
export function roomLabel(key: RoomKey): string {
  for (const r of ROOM_ROWS) if (r.key === key) return r.label;
  return '';   // unreachable: `key` is typed to the ten
}
export type ButtonKey = keyof typeof BUTTONS;
// `RowKey` retired with `ROWS` (R-40.23). The nine are an ordered array, not a
// keyed record, because their ORDER is the ruling and a record's key order is
// not a contract.
