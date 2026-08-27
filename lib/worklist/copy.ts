// lib/worklist/copy.ts — ONE HOME FOR EVERY VENDOR-FACING BYTE OF THE SHELL.
//
// WHY A SINGLE HOME. Each string below is founder-vetoed by number. A vetoed byte that
// lives at its point of use can drift a character at a time and no instrument catches it;
// gathered here, a diff on this file IS the copy-veto audit. Nothing in the shell may
// inline a vendor-facing string — if a new one is needed, it is drafted, vetoed, and added
// here, never written at the call site.
//
// ── R-38.6 · THE FUNCTIONAL REGISTER (executes R-37.90) ─────────────────────
//
// THE RULE, AND IT IS A SHAPE RULE, NOT A TONE RULE:
//   · labels are NOUNS of at most two words
//   · buttons are VERBS of at most two words
//   · an empty state is ONE sentence naming what will appear here, and one action
//   · no paragraph explains the product on any surface except the first-run cards,
//     which are three cards of one sentence each
//
// WHAT RETIRED THIS SITTING, and why the list is written rather than implied: a byte that
// disappears without a tombstone gets re-added by the next reader who notices the gap.
//   roomsAskSub · roomsProfileSub          — caps-tracked subtitles; zero consumers since
//                                            R-37.82 (2) deleted the rows' second line.
//   roomsPointer · roomsPointerAction      — R-37.75's "New here? Today has a short guide"
//                                            pointer. Rooms is the tile grid and nothing
//                                            else now (R-38.7); a directory does not
//                                            advertise a manual.
//   todayMastheadCaption                   — 「needing you today」 is a phrase, not a noun.
//   todayPromise                           — a two-clause paragraph standing where a page
//                                            title goes. Recut to todayTitle at t1.
//   todayEmptyLine1 · todayEmptyLine2      — two sentences doing one sentence's job.
//                                            MERGED, NOT DROPPED: see todayNotLive.
//   cardDeskBody · cardLinkBody · cardAskBody — three-sentence bodies, cut to one each.
//   cardRoomsTitle/Body/Action             — the tile grid explains the rooms by being
//                                            them. A card about a directory, above a
//                                            directory, is the product narrating itself.
//   cardMoreTitle · cardMoreBody           — Business Solutions is a ROOM with its own
//                                            surface; the card was a second door to it.
//
// R-37.72 — THE SELF-REFERENCE REGISTER. TDW refers to itself as TDW (or The Dream Wedding
// in full dress), never "this app" / "the app". Swept across every byte below.
//
// R-37.70 — PERSONA NAMES. DreamAi in prose about who answers; never in a label. 「Victor」
// is an internal seat name and appears in no vendor-facing byte, and neither does
// 「Advisor」 as a persona — the Advisor ROOM is named for the room, not for a character.
'use strict';

export const COPY = {
  // ── 1 · 2 — the manifest (R-37.42's own-name requirement) ────────────────
  manifestName:      'TDW Worklist \u03b2',
  manifestShortName: 'Worklist',

  // ── 3 · 4 — the two nav seats. There is no third; R-37.64 holds. ─────────
  navToday: 'Today',
  navRooms: 'Rooms',

  // ── TODAY ────────────────────────────────────────────────────────────────
  // The numeral's caption. A NOUN, and deliberately not a claim: the numeral is 0 in this
  // phase because nothing is read, so a caption asserting what the 0 MEANT would be
  // reporting a measurement that never ran.
  todayCountCaption: 'open items',
  /** t1, the page title. One per surface. */
  todayTitle: 'Your morning brief.',
  /** The empty state's one sentence: what will appear here. */
  todayEmpty: 'When your work starts flowing, what needs attention lands here.',
  /** Its one action. A verb of two words. */
  todayEmptyAction: 'See your rooms',
  // THE HONEST LINE SURVIVES THE RECUT, merged into one sentence rather than dropped.
  // 「All clear」 would assert an absence never checked; this says the instrument is not
  // running, which is the difference between a zero reading and no reading. It retires at
  // Phase 4 with the feed, not before.
  todayNotLive: 'Today is not reading your work yet.',

  // ── 6 · 7 — the resting state. PHASE 4, not rendered by this shell. Carried here
  // so the vetoed bytes have one home from the moment they were vetoed.
  todayRestingHead:  'All clear.',
  todayRestingScope: 'Counts cover invoices, contracts and tasks \u2014 the three that record when they were finished.',

  // ── THE FIRST-RUN CARDS · THREE, ONE SENTENCE EACH (R-38.6) ──────────────
  // ORDER FOLLOWS THE VENDOR'S OWN TIMELINE, not a feature list: work reaches him (1, 2),
  // then he runs it from where he already is (3). The set deletes itself at Phase 4.
  firstRunHeader: 'What TDW does for you',   // R-37.72: amended from "this app"

  cardDeskTitle:  'Your 24/7 enquiry desk',
  cardDeskBody:   'DreamAi answers every enquiry on WhatsApp, at any hour, in your name.',
  cardDeskAction: 'Message DreamAi',

  cardLinkTitle:  'Your TDW link',
  cardLinkBody:   'One link that routes every enquiry straight to you, with nothing for anyone to install.',
  cardLinkAction: 'Share link',

  // Every chip is backed by a tool in the engine census (dream-os src/agent/tools.js).
  // Per-chip verdicts with line addresses are stated in the P1 handover. No chip ships
  // unbacked, and the count is asserted at five.
  //
  // ONE CHIP DELIBERATELY DOES NOT COPY ITS TOOL. `send_to_couple`'s description offers
  // 「quote Ananya 4 lakh」 as its first example, and 「4 lakh」 is exactly the shorthand
  // the money register forbids on a vendor-facing surface. The drafting chip uses the same
  // tool's other example, which carries no figure at all.
  cardAskTitle: 'Run it all from WhatsApp',
  cardAskBody:  'Text DreamAi the way you would text a colleague, and the work lands here.',
  cardAskChips: [
    'Am I free on 14 February?',        // query_day        tools.js:443
    'How many open leads do I have?',   // list_leads       tools.js:90
    'Raise an invoice for Meghna',      // create_invoice   tools.js:222
    'Log a studio hire expense',        // log_expense      tools.js:351
    'Tell Priya the date works',        // send_to_couple   tools.js:512
  ] as const,

  // ── 8 · 9 — Contact Support (R-37.67 / R-37.67-A) ────────────────────────
  // FOUNDER BYTES, UNTOUCHED. R-38.6's no-paragraph rule does not reach these: the
  // kickoff's standing refusals name R-37.67 and R-37.78 as untouchable, and this body is
  // the surface's whole content rather than a paragraph decorating a control.
  supportTitle: 'Business Solutions',
  supportHeader: 'Customised solutions for your business',
  supportBody:  'SEO, marketing automation, ads, campaign pages, a feature built for how you work \u2014 tell us what would grow your business and we build it with you. Something broken? That reaches us here too.',
  supportAction: 'Message us on WhatsApp',

  // ── 10 · 11 — the coin's two modes ───────────────────────────────────────
  themeDarkName:  'Graphite',
  themeLightName: 'Chalk',

  // ── R-37.78 · THE NAMING GRAMMAR ─────────────────────────────────────────
  // 「Ask TDW」 is the VERB — it labels affordances that invite the ask.
  // 「DreamAi」 is the NAME — it appears in prose about who answers.
  // 「TDW on WhatsApp」 is the founder's byte for the row.
  // Affordances invite; sentences attribute. No surface may freelance a fourth name.
  dockPlaceholder: 'Ask TDW \u2014 \u201cAm I free on 14 Feb?\u201d',
  dockAria: 'Ask TDW',
  dockRowTitle: 'Ask TDW',
  // R-38.7: the founder vetoed the horizontal-strip treatment on Rooms. This byte keeps
  // its ONE home and that home is now the coin drawer (R-37.69/.83 amended at R-38.7).
  roomsAskTitle: 'TDW on WhatsApp',
  // R-38.7: leaves the Rooms body and becomes a row inside Settings.
  roomsProfileTitle: 'Profile layout',
  linkCopy: 'Copy',
  linkCopied: 'Copied',

  // ── THE DRAWER · section eyebrows and rows ───────────────────────────────
  // Nouns, at most two words. 「Atelier」 retires as a section name: it named a design era,
  // not a group of rows, and a vendor reading it learns nothing about what is beneath it.
  // ── AMENDED · CE-38 relay #3 ITEM 3, arm (b) ─────────────────────────────
  // THE FOUNDER'S QUESTION WAS 「why do i have a dream wedding there?」 AND HE WAS RIGHT.
  // The shipped drawer read: ACCOUNT · Settings · Billing · TDW on WhatsApp · The Dream
  // Wedding — three of four rows under a heading true of two. R-38.6 retired 「Atelier」 as
  // a section name because it named a design era rather than a group of rows; this seat
  // replaced the NAME and carried the rows under it without re-deriving whether each one
  // belonged. The ruling being executed was about the name, and the grouping never got
  // looked at. A better heading over the same unexamined set is not a cure.
  //
  // `The Dream Wedding` RETIRES from the drawer entirely: it opened the marketing site, and
  // product chrome does not need a door to its own homepage.
  //
  // `REACH US` is the chair's byte, under founder veto. It exists so 「TDW on WhatsApp」 —
  // a founder byte with a ruled home in this drawer since R-38.7 — sits under a heading
  // that is true of it.
  drawerAccount: 'Account',
  drawerReachUs: 'Reach us',
  drawerDisplay: 'Display',
  drawerActions: 'Actions',
  // Sentence case. R-38.6: buttons are verbs of at most two words, and the engraved
  // Title Case went with the register that carried it.
  drawerSignOut: 'Sign out',
  // ── CE-38 SEAL ① · SIGN OUT CONFIRMS ─────────────────────────────────────
  // F-38.16: the founder tapped the word ACTIONS and the tap fell through to a 52px row
  // that ended his session. Clearance was widened; the asymmetry stayed — this was the one
  // destructive control in the estate acting on a single tap, while `CancelBlock` confirms
  // and carries its irreversibility in words. Ruled: it confirms, in a two-button row
  // INSIDE the drawer. No modal — a modal to leave a menu is more ceremony than the act.
  // Bytes ship pending the founder's veto.
  drawerCancel: 'Cancel',

  // ── R-38.9 · THE ADVISOR ROOM ────────────────────────────────────────────
  // The room's own word, at t2. Never a persona name (R-37.70).
  advisorTitle: 'Advisor',
  advisorEmpty: 'Ask about pricing, positioning or a decision you are weighing.',
  // THE DISCLOSED COST, ON THE SURFACE AND NOT ONLY IN A HANDOVER. One sentence, because
  // the vendor needs the fact and not the mechanism.
  advisorThreadNote: 'Moving between Advisor and the ask bar starts a fresh conversation each time.',
  // Rendered only when the mode PATCH did not land. It reports what the screen does NOT
  // know rather than asserting a state the server never confirmed.
  advisorUnset: 'Could not switch to Advisor just now \u2014 try again in a moment.',

  // ── R-38.8 · BILLING ─────────────────────────────────────────────────────
  // MONEY REGISTER IS LAW HERE: `Rs X,XXX`, zero rupee glyphs, zero k/L/Cr shorthand. The
  // figures themselves are NOT authored here — they are imported from PLAN_PRICE, whose
  // one home is components/vendor/SubscriptionCard.tsx and which mirrors dream-os
  // src/lib/billing/razorpay.js TIER_PAISE. A price retyped into a copy file is a second
  // home for a number that already drifted once (F-10.63).
  settingsTitle:    'Settings',
  billingTitle:     'Billing',
  billingPlanLead:  'Your plan',
  billingPlansHead: 'Plans',
  // The status chips. Each reports THE RAIL and stops — it makes no claim about her plan,
  // because the plan card one line above already names it correctly. The blend was the
  // whole of F-10.110, and R-38.8 retires the blended sentences by name.
  chipActive:    'Active',
  chipBasic:     'Basic',
  chipRetrying:  'Retrying',
  chipFailed:    'Payment failed',
  chipCancelled: 'Cancelled',
  chipNotSetUp:  'Not set up',
  // Basic's inclusion line. THE ONLY TIER WHOSE INCLUSION IS DERIVABLE FROM THIS TREE —
  // statusLine.ts's own vetoed byte says 「AI is off on Basic」 and dream-os
  // chat.js:buildLlmForTurn floors an unrecognised tier to basic. The three paid tiers
  // have NO inclusion source anywhere in this repo; they ship without a line this sitting
  // and are owed as bytes in docs/COPY_REGISTER_M-FINISH.md rather than invented here.
  planBasicIncludes: 'Profile and leads. No AI replies.',
  planAction:        'Choose',
  planCurrent:       'Current',
} as const;
