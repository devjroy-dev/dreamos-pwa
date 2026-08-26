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

  cardLinkTitle: 'Your TDW link',
  cardLinkBody:  'Share it anywhere you already are \u2014 your bio, a story, a reply. A couple who taps it lands in WhatsApp already routed to you. Nothing for them to install.',
  cardLinkAction: 'Share link',

  cardAiTitle: 'DreamAi answers for you',
  cardAiBody:  'It picks up enquiries on WhatsApp at any hour and asks what you\u2019d ask. When a conversation is worth your time, it hands it over. You stay the one who quotes.',
  cardAiAction: 'Message DreamAi',

  // Each chip is backed by a tool in the engine census (src/agent/tools.js).
  // Verdicts per chip are stated in the handover; no chip ships unbacked.
  cardAskTitle: 'What to ask DreamAi',
  cardAskChips: [
    'Am I free on 14 February?',      // query_day        tools.js:443
    'How many open leads do I have?', // list_leads       tools.js:90
    'Log a studio hire expense',      // log_expense      tools.js:351
    'Mark Aarti\u2019s invoice paid', // record_payment   tools.js:291
  ] as const,

  cardAskTitle_: undefined as never | undefined,

  cardMoreTitle: 'Ask us for more',
  cardMoreBody:  'Want more reach \u2014 ads, better placement, a feature that would save you an hour a week? Tell us. Something broken works too, and it reaches a person who replies personally.',

  // ── 8 · 9 — Contact Support (R-37.67 / R-37.67-A) ────────────────────────
  supportTitle: 'Contact Support',
  supportBody:  'Ask us for anything that would grow your work \u2014 ads, reach-outs, search placement, a feature you keep wishing existed. Report what\u2019s broken here too. It reaches us directly on WhatsApp and we reply ourselves.',
  supportAction: 'Message us on WhatsApp',

  // ── 10 · 11 — the coin's two modes ───────────────────────────────────────
  themeDarkName:  'Graphite',
  themeLightName: 'Chalk',

  // ── the dock's summon. NOT a vetoed byte: it is an aria-label, invisible chrome.
  dockAria: 'Open DreamAi',
} as const;
