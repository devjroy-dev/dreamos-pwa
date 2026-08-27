// lib/worklist/copy.ts — ONE HOME FOR EVERY VENDOR-FACING BYTE OF PHASE 1.
//
// WHY A SINGLE HOME. Each string below is founder-vetoed by number. A vetoed byte that
// lives at its point of use can drift a character at a time and no instrument catches it;
// gathered here, a diff on this file IS the copy-veto audit. Nothing in the shell may
// inline a vendor-facing string — if a new one is needed, it is drafted, vetoed, and added
// here, never written at the call site.
//
// R-37.72 — THE SELF-REFERENCE REGISTER. TDW refers to itself as TDW (or The Dream Wedding
// in full dress), never "this app" / "the app". Swept across every byte below; the census
// is stated in the handover.
//
// R-37.70 — PERSONA NAMES. DreamAi in all chrome. "Victor" is an internal seat name and
// appears in no vendor-facing byte.
'use strict';

export const COPY = {
  // ── 1 · 2 — the manifest (R-37.42's own-name requirement) ────────────────
  manifestName:      'TDW Worklist \u03b2',
  manifestShortName: 'Worklist',

  // ── 3 · 4 — the two nav seats. There is no third; R-37.64 holds. ─────────
  navToday: 'Today',
  navRooms: 'Rooms',

  // ── 5 — Today's honest-empty line, PHASE 1 ONLY.
  // It says the instrument is not running. It does NOT say the reading is zero:
  // in Phase 1 nothing is read, so "all clear" would assert an absence never checked.
  todayEmptyLine1: 'Today is still being built.',
  todayEmptyLine2: 'Nothing is being read yet.',

  // ── 6 · 7 — the resting state. PHASE 4, not rendered by this shell. Carried here
  // so the vetoed bytes have one home from the moment they were vetoed.
  todayRestingHead:  'All clear.',
  todayRestingScope: 'Counts cover invoices, contracts and tasks \u2014 the three that record when they were finished.',

  // ── the first-run manual (R-37.68 / R-37.68-A). It deletes itself at Phase 4. ──
  firstRunHeader: 'What TDW does for you',   // R-37.72: amended from "this app"

  // ── R-37.68-B · THE FORWARD PROMISE ────────────────────────────────────
  // Above everything. The feed is absent in Phase 1 and the honest cure for an absence is
  // to name what fills it, not to hide the hole. It is also the only line here that will
  // still be true after the manual retires.
  todayPromise: 'Once your work starts flowing, Today becomes your morning brief \u2014 what needs attention, what\u2019s due, what got done.',

  // ── THE CARD SET (R-37.68-B) ───────────────────────────────────────────
  // ORDER FOLLOWS THE VENDOR\u2019S OWN TIMELINE, not a feature list: work reaches him
  // (1, 2), work gets run (3, 4), and if something is missing he asks (5). No section
  // headers between them — grouping by sequence rather than by chrome is what keeps this
  // a set of cards instead of documentation.
  // THREE-SENTENCE CEILING binds every body below and is asserted by the bench.

  cardDeskTitle: 'Your 24/7 enquiry desk',
  cardDeskBody:  'DreamAi answers every enquiry on WhatsApp, at any hour, in your name. It asks what you\u2019d ask \u2014 date, city, budget \u2014 and hands the conversation over once it\u2019s worth your time. You stay the one who quotes.',
  cardDeskAction: 'Message DreamAi',

  cardLinkTitle: 'Your TDW link',
  cardLinkBody:  'One link that routes every enquiry straight to you. Share it in your bio, a story, a reply \u2014 whoever taps it lands in WhatsApp already routed to you, with nothing to install. No enquiry ends up in an inbox you forget to open.',
  cardLinkAction: 'Share link',

  // Every chip is backed by a tool in the engine census (dream-os src/agent/tools.js).
  // Per-chip verdicts with line addresses are stated in the handover. No chip ships unbacked.
  //
  // ONE CHIP WAS NOT WRITTEN THE WAY THE TOOL\u2019S OWN DESCRIPTION WRITES IT: send_to_couple
  // names 「quote Ananya 4 lakh」 as its example, and 「4 lakh」 is exactly the shorthand the
  // money register forbids on a vendor-facing surface. The drafting chip uses the same
  // tool\u2019s other example instead, which carries no figure at all.
  cardAskTitle: 'Run it all from WhatsApp',
  cardAskBody:  'You never have to open TDW to use it. Text DreamAi the way you\u2019d text a colleague, and the work lands here.',
  cardAskChips: [
    'Am I free on 14 February?',        // query_day        tools.js:443
    'How many open leads do I have?',   // list_leads       tools.js:90
    'Raise an invoice for Meghna',      // create_invoice   tools.js:222
    'Log a studio hire expense',        // log_expense      tools.js:351
    'Tell Priya the date works',        // send_to_couple   tools.js:512
  ] as const,

  cardRoomsTitle: 'Every part of your business has a room',
  cardRoomsBody:  'Leads, invoices, contracts, expenses, your team, your calendar \u2014 each has a room of its own, and every one is a single tap from Rooms. Nothing is buried behind a menu.',
  cardRoomsAction: 'See your rooms',

  cardMoreTitle: 'Customised solutions for your business',
  cardMoreBody:  'Want more reach \u2014 ads, better placement, a feature that would save you an hour a week? Tell us. Something broken works too, and it reaches a person who replies personally.',

  // ── R-37.75 · THE ROOMS POINTER ────────────────────────────────────────
  // Rooms-first means a new vendor may never tap the second seat, and the first-run manual
  // lives behind it. This is the pointer that keeps him meeting it. It is UNCONDITIONAL in
  // Phase 1 because the signal that should gate it — the `has_any` flag — is Phase 3's, so
  // gating on it now would be gating on nothing. Phase 4 makes it conditional on the same
  // flag that retires the manual, and the two disappear together.
  roomsPointer: 'New here? Today has a short guide to what TDW does for you.',
  roomsPointerAction: 'Read it',

  // ── 8 · 9 — Contact Support (R-37.67 / R-37.67-A) ────────────────────────
  supportTitle: 'Business Solutions',
  supportHeader: 'Customised solutions for your business',
  supportBody:  'SEO, marketing automation, ads, campaign pages, a feature built for how you work \u2014 tell us what would grow your business and we build it with you. Something broken? That reaches us here too.',
  supportAction: 'Message us on WhatsApp',

  // ── 10 · 11 — the coin's two modes ───────────────────────────────────────
  themeDarkName:  'Graphite',
  themeLightName: 'Chalk',

  // ── the dock's summon. NOT a vetoed byte: it is an aria-label, invisible chrome.
  // ── R-37.78 · THE NAMING GRAMMAR, now law rather than accident ──────────
  // 「Ask TDW」 is the VERB — it labels affordances that invite the ask.
  // 「DreamAi」 is the NAME — it appears in prose about who answers.
  // 「TDW on WhatsApp」 is the founder's byte for the Rooms row.
  // Affordances invite; sentences attribute. No surface may freelance a fourth name.
  dockPlaceholder: 'Ask TDW \u2014 \u201cAm I free on 14 Feb?\u201d',
  dockAria: 'Ask TDW',
  // R-37.83: the dock names its destination while the chat is not yet here to answer.
  dockRowTitle: 'Ask TDW',
  roomsAskTitle: 'TDW on WhatsApp',
  roomsAskSub:   'your 24/7 enquiry desk',
  roomsProfileTitle: 'Profile layout',
  roomsProfileSub:   'how couples see you',
  linkCopy: 'Copy',
  linkCopied: 'Copied',
  todayMastheadCaption: 'needing you today',
} as const;
