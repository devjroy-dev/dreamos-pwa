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
// ── R-38.17 · WHAT RETIRED AT S2/2, AND THE ONE THING THAT CAME BACK ────────
//   todayTitle                             — 「Your morning brief.」 A page title over a
//                                            masthead that already names the day. The
//                                            masthead STATUS carries the surface's stature
//                                            now, at t1, one line instead of two.
//   todayEmpty · todayEmptyAction          — an empty state with its own action, above
//                                            three cards each of which is an action. The
//                                            nav's Rooms seat is the same destination and
//                                            is on screen at all times.
//   cardAskBody · cardLinkBody             — R-38.17 gives cards 2 and 3 no body at all.
//                                            A chip list and an address say what they are.
//   dockRowTitle                           — SEE BELOW. Not retired; re-homed.
//
// ⚠ todayNotLive DID NOT RETIRE, AND THE ROUND TRIP IS THE ENTRY WORTH KEEPING.
// R-38.17 first replaced it with 「Nothing needs you yet.」 and this seat filed F-38.31
// against the ruling: that sentence asserts an absence NOTHING HAS CHECKED, which is the
// exact claim `todayCountCaption` and `todayNotLive` were written to refuse. The chair
// amended his own byte at c-38.14 rather than defending it. So:
//   · until the Phase 4 feed answers, the status reads `todayNotLive` and THE NUMERAL DOES
//     NOT RENDER — an unmeasured 0 is the same lie in digits, and leaving it would have
//     cured the sentence while keeping the claim.
//   · `todayNothingYet` is the TRUE-empty state and ships behind the feed's first 200.
// Both bytes live here from the moment they were vetoed; lib/worklist/feed.ts decides which
// one the vendor sees, and it has exactly one home.
//
// R-37.72 — THE SELF-REFERENCE REGISTER. TDW refers to itself as TDW (or The Dream Wedding
// in full dress), never "this app" / "the app". Swept across every byte below.
//
// ── R-37.70 AS AMENDED AT R-38.17 · 「DreamAi」 JOINS THE BANNED LIST ────────
// It used to be permitted in PROSE about who answers, and forbidden only in labels. That
// distinction is retired with the grammar that carried it (see the R-37.78 tombstone
// below). 「Victor」, 「Donna」, 「Harvey」, 「Mira」 and now 「DreamAi」 appear in NO
// vendor-facing byte of the shell, in prose or in a label. 「Advisor」 is not a persona
// here either — the Advisor ROOM is named for the room, not for a character.
//
// THE REASON THE PROSE EXEMPTION HAD TO GO, rather than being narrowed again: it was a
// rule about WHERE a name may appear, and every surface that wanted the name could argue
// it was writing prose. `cardDeskBody` and `cardAskBody` both did. A ban with a
// register-shaped exception is a ban that loses one sentence at a time.
//
// WHAT THE VENDOR IS TOLD INSTEAD IS THE CHANNEL, NOT THE CHARACTER. 「on WhatsApp」,
// 「in your name」. The vendor does not need to know who answers; she needs to know that
// it is answered, where, and as whom.
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
  // ── THE MASTHEAD STATUS · R-38.17 AS AMENDED AT c-38.14 · TWO BYTES, ONE SLOT ──
  // Exactly one of these renders, and which one is not a copy decision — it is a question
  // about whether an instrument answered. lib/worklist/feed.ts holds that fact.
  //
  // THE NOT-READING LINE, at t1. It survives R-38.17's first cut, which had retired it.
  // 「All clear」 or 「Nothing needs you yet」 over an unread feed asserts an absence never
  // checked; this says the instrument is not running, which is the difference between a
  // zero reading and NO reading. Sentence recut to a contraction with the promotion to t1:
  // it is the surface's loudest line now, and 「is not」 at that stature reads as a notice
  // rather than as speech.
  todayNotLive: "Today isn't reading your work yet.",
  // THE TRUE-EMPTY STATE. Ships behind the feed's first 200 and not one deploy before it —
  // it is the only line here that makes a claim about the vendor's actual work.
  todayNothingYet: 'Nothing needs you yet.',

  // ── 6 · 7 — the resting state. PHASE 4, not rendered by this shell. Carried here
  // so the vetoed bytes have one home from the moment they were vetoed.
  todayRestingHead:  'All clear.',
  todayRestingScope: 'Counts cover invoices, contracts and tasks \u2014 the three that record when they were finished.',

  // ── THE FIRST-RUN CARDS · THREE, ONE SENTENCE EACH (R-38.6) ──────────────
  // ORDER FOLLOWS THE VENDOR'S OWN TIMELINE, not a feature list: work reaches him (1, 2),
  // then he runs it from where he already is (3). The set deletes itself at Phase 4.
  // R-38.17: a SECTION EYEBROW, not a sentence about the product. 「What TDW does for you」
  // was a heading that explained the set beneath it; three cards that each name an action
  // do not need a caption saying they are things TDW does.
  firstRunHeader: 'Get started',

  // ── CARD 1 · R-38.17 ─────────────────────────────────────────────────────
  // A NOUN, one word. The old title was a claim about hours (「Your 24/7 enquiry desk」)
  // and the body then repeated it. The body keeps the two facts that are the vendor's:
  // it is answered on WhatsApp, and it is answered as her.
  cardDeskTitle:  'Enquiries',
  cardDeskBody:   'Every enquiry is answered on WhatsApp in your name.',
  cardDeskAction: 'Open WhatsApp',

  // ── CARD 3 · R-38.17 ─────────────────────────────────────────────────────
  // No body. The address IS the explanation, and a sentence explaining an address the
  // vendor can read is the product narrating itself.
  cardLinkTitle:  'Your link',
  // TWO ACTIONS, TWO VERBS. `Copy` for the vendor putting it in a bio; `Share` for the
  // system sheet. They were one button that guessed which the vendor meant.
  cardLinkAction: 'Copy',
  cardLinkCopied: 'Copied',
  cardLinkShare:  'Share',
  // ⚠ WITHHELD BYTE · THE ADDRESS ITSELF. See components/worklist/FirstRun.tsx: the
  // `thedreamwedding.in/v/<handle>` row is withheld by rule (CE-38 S2/2 relay #2, arm (a))
  // because `/v/` is a 404 today — F-38.30, the same finding P0-B filed as F-19.14. The
  // byte is vetoed and lives here from the moment it was vetoed; the ROW that renders it
  // is commented out with its uncomment step dated to TDW_19 P0-B step 4.
  cardLinkAddressBase: 'thedreamwedding.in/v/',

  // Every chip is backed by a tool in the engine census (dream-os src/agent/tools.js).
  // Per-chip verdicts with line addresses are stated in the P1 handover. No chip ships
  // unbacked, and the count is asserted at five.
  //
  // ONE CHIP DELIBERATELY DOES NOT COPY ITS TOOL. `send_to_couple`'s description offers
  // 「quote Ananya 4 lakh」 as its first example, and 「4 lakh」 is exactly the shorthand
  // the money register forbids on a vendor-facing surface. The drafting chip uses the same
  // tool's other example, which carries no figure at all.
  // ── CARD 2 · R-38.17 · NO BODY ───────────────────────────────────────────
  // The title is the affordance's own name and the chips are the demonstration. The old
  // body (「Text DreamAi the way you would text a colleague…」) was a simile explaining a
  // list of examples that stands directly beneath it.
  cardAskTitle: 'Ask TDW',
  // The eyebrow over the chips. A verb of one word: they are examples to try, not a menu.
  cardAskChipsEyebrow: 'Try',
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

  // ── R-37.78 · THE NAMING GRAMMAR · RETIRED AT R-38.17, RECORDED ──────────
  // It read: 「Ask TDW」 is the VERB, 「DreamAi」 is the NAME appearing in prose about who
  // answers, 「TDW on WhatsApp」 is the founder's byte for the row — affordances invite,
  // sentences attribute.
  //
  // IT RETIRES BECAUSE ITS MIDDLE CLAUSE RETIRED. With 「DreamAi」 banned outright there is
  // no NAME left for the grammar to place, and a two-term grammar over one term is not a
  // grammar. What survives is simpler and needs no register theory: TDW refers to itself as
  // TDW (R-37.72), affordances are labelled with what they do, and nothing in the shell
  // attributes an answer to a character. The tombstone is written rather than the block
  // deleted, because a rule that vanishes gets reinvented by the next reader who notices
  // there is no rule.
  dockPlaceholder: 'Ask TDW \u2014 \u201cAm I free on 14 Feb?\u201d',
  // ⚠ THREE KEYS, ONE BYTE — the same shape as F-38.23's six header words, and named for
  // the same reason. `dockAria` labels the control, `dockRowTitle` labels the drawer row
  // and `cardAskTitle` titles card 2; they are three separately-vetoed bytes that currently
  // agree. b40 C32 asserts they cannot drift apart while all three exist. The honest
  // consolidation is a sitting of its own because each has its own ruling behind it.
  dockAria: 'Ask TDW',
  dockRowTitle: 'Ask TDW',
  // R-38.17: the sheet says where the answer comes back. The vendor types in-app and the
  // reply arrives on WhatsApp, and a surface that does not say so is a costume again.
  askSheetNote: 'TDW replies on WhatsApp.',
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

  // ── R-38.18 · THE ADD CONTROL ────────────────────────────────────────────
  // NOUNS, SINGULAR, ONE WORD EACH. A row in this sheet answers 「add a ___」, so the
  // plural room name would be the wrong word in the wrong grammatical slot: the vendor is
  // making ONE lead, not visiting Leads. That is also what keeps these seven bytes from
  // being a fourth spelling of the six header words (F-38.23) — they are a different word.
  addTitle:    'Add',
  addCalendar: 'Calendar',
  addLead:     'Lead',
  addClient:   'Client',
  addInvoice:  'Invoice',
  addExpense:  'Expense',
  addEvent:    'Event',
  addNote:     'Note',

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

  // ── M-FINISH S2 · R-38.11 · THE LIST FAMILY'S SIX HEADER WORDS ───────────
  // NOUNS, ONE WORD EACH — R-38.6's shape rule, met without effort because a room's word
  // IS a noun. They are the SAME bytes the tiles carry (lib/worklist/rooms.ts `label`) and
  // the same the Slice Door carries (components/vendor/slices/SliceRow.tsx LABELS), which
  // is a fact worth stating plainly rather than leaving for a reader to notice: THREE
  // SURFACES SPELL THESE WORDS AND THIS FILE IS NOT YET THE ONE HOME FOR THEM.
  //
  // It is not made the one home this sitting, and the reason is that `LABELS` is read by
  // the /vendor fallback too — pointing it at the shell's copy file would make a main-side
  // component depend on a branch-side register, which is the direction D-2 forbids. The
  // honest shape is the reverse (the shell reads LABELS), and it is a small sitting of its
  // own because LABELS is keyed by DoorSlice and the shell is keyed by room id. Filed as
  // F-38.23, priced, and asserted in the meantime: b40's C30 compares these six against
  // LABELS and reddens if they ever disagree, so the duplication cannot drift even while
  // it exists.
  leadsTitle:    'Leads',
  clientsTitle:  'Clients',
  invoicesTitle: 'Invoices',
  expensesTitle: 'Expenses',
  eventsTitle:   'Events',
  notesTitle:    'Notes',
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
