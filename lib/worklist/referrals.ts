// lib/worklist/referrals.ts
// BLOCK 19 · G5.1 — THE OVERFLOW EXCHANGE. Every vendor-facing byte, one home.
//
// ⚠ TRANSCRIBED FROM `docs/mocks/G51_VETO_SHEET.md`, RATIFIED AT R-40.42 ("A1–F
// ratified as proposed") WITH B8 RULED AT RELAY 3. Not authored here, not
// improved here, not shortened to fit a layout. The row letters below are the
// veto sheet's own, so a founder reading a string on his screen can find the row
// that approved it without a search.
//
// ⚠ AND THE REFUSAL SENTENCES LIVE HERE RATHER THAN IN dream-os. The forward
// door returns a CODE (`ForwardRefusalCode`) plus an `error` string written for
// logs; rendering that string would put an unvetoed byte on a vendor's screen.
// The map at the bottom is the join, and it is exhaustive by type — add a code
// to the union in `lib/solutions/types.ts` and this file stops compiling until
// the founder has a sentence for it. That is deliberate: a refusal without a
// ratified sentence should not be shippable.

import type { ForwardRefusalCode } from '@/lib/solutions/types';

export const RF = {
  // ── A · THE LEAD RECORD (veto sheet §A) ───────────────────────────────────
  // A1. Not `Refer` — a referral is what the couple did to get here (Victor's
  // own word, `systemPrompt.js:92`), and reusing it makes two acts share one
  // verb. Not `Pass on`, which is what you do to an offer you decline.
  forwardControl: 'Forward to a peer',
  // A2/A3. Detail-row labels, rendered at the same rung as `Arrived` and
  // `Wedding date`, because a forward is the same kind of fact as those — not an
  // announcement.
  rowForwardedTo: 'Forwarded to',
  rowForwardedBy: 'Forwarded by',

  // R-G51.16 / R-40.52, vetoed by the chair. On the PEER'S copy only — the
  // sender's row stays unmarked because her record already says `Forwarded to`.
  // One word, because a chip is read in the moment a thumb passes it.
  chipReferral: 'Referral',
  // A4 has no byte: the note renders beneath A3's value with a rule at its left
  // and no label. A label above it would be a word between the vendor and the
  // sentence a peer actually wrote.

  // ── B · THE FORWARD SHEET (veto sheet §B) ─────────────────────────────────
  // B1. `Enquiry`, not `lead`: `lead` is the estate's word for the row,
  // `enquiry` is the word for the person who wrote in, and this sheet is about
  // handing over a person.
  sheetTitle: 'Forward this enquiry',
  fieldPeer: 'Peer',
  // B3. Not `Message` — a message implies it is sent to someone as a message.
  // This lands on a record.
  fieldNote: 'Note for them',
  notePlaceholder: "Why you’re passing it on",
  sendVerb: 'Forward',
  // B6. Two sentences doing two jobs: the first is what the peer sees, the
  // second is R-G51.7 said out loud BEFORE she taps. She will otherwise assume
  // TDW told the couple, and find out it didn't when the couple asks.
  sheetStandingLine:
    'They get it as a new enquiry, with your name and your note. Nothing is sent to the couple.',
  pickerTitle: 'Choose a peer',
  // B8, RULED AT RELAY 3: no way in from the picker this sitting. This line
  // deliberately does NOT name where to add a peer — the roster is written by
  // accepting a Collab response and by a manual add, and naming a door this
  // sheet cannot open is worse than naming none.
  // ── ⚠ B8 IS RETIRED. IT WAS RATIFIED AT R-40.42 AND R-40.104 MADE IT FALSE.
  // It read: "Peers you’ve worked with appear here." That was true while
  // R-G51.1 made a linked roster edge the boundary of the exchange. The founder
  // repealed that boundary: peers she has NEVER worked with appear here now, and
  // that is the whole point of the sitting. The sentence is REPLACED BY THE
  // THREE GROUP HEADS rather than reworded, because the heads say what it was
  // trying to say and say it beside the rows they describe.
  //
  // Recorded rather than deleted so a reader can see which ruling moved. A
  // ratified byte that quietly vanishes teaches nobody that it ever existed.

  // ── S1 · THE SEARCH PLACEHOLDER ─────────────────────────────────────────
  // It names BOTH keys and no third. Phone was struck at c-40.45: a phone match
  // answers "whose number is this", which is the reverse of what a storefront
  // answers and a direction nothing on this estate publishes — and the RESULTS
  // carrying no number would not have closed it, because the MATCH is the
  // disclosure. Saying "name or handle" also stops her typing a number and
  // reading the silence as a bug.
  searchPlaceholder: "Search by name or handle",

  // ── S2–S4 · THE THREE GROUP HEADS, in the ruled order ────────────────────
  // ⚠ A HEAD IS SUPPRESSED WHEN ITS GROUP IS EMPTY, and the DOOR decides that,
  // not this surface — `searchPeers` omits an empty group entirely, so the rule
  // is decided once. A head standing over nothing is the surface reporting on
  // itself.
  //
  // `Everyone` is deliberately not `All vendors` (sounds like a directory to
  // browse) and not `Others` (sounds like a leftovers bin). Alphabetical inside
  // each group, because master §7 refuses a ranked surface and every other order
  // is a ranking wearing a sort.
  groupWorkedWith: "Worked with",
  groupSameTrade:  "Same trade",
  groupEveryone:   "Everyone",

  // ── S5 · NO MATCH ───────────────────────────────────────────────────────
  // Two sentences doing two jobs. The first is the fact. The second is WHY, said
  // before she tries three more spellings — without it she assumes the search is
  // broken rather than that her peer has not joined.
  //
  // ⚠ AND IT DOES NOT SAY THE PEER IS ABSENT FROM TDW. A vendor who has switched
  // off peer visibility (R-40.107) must read IDENTICALLY from here, or the switch
  // is defeated on the first search — one vendor could confirm another's
  // existence and read her posture by elimination. The door takes the same
  // posture: four different worlds, one indistinguishable refusal.
  //
  // Nothing to press beneath it. The invite is its own arc, and a control
  // pointing at a door this sheet cannot open is worse than no control.
  searchNoMatch: "No one here matches that. You can only forward to a vendor who is on The Dream Wedding.",

  // ── C · THE REFUSAL (veto sheet §C) ───────────────────────────────────────
  // C1 is the sitting's most important sentence and it is three deliberate
  // choices, each of which could have gone the other way: it names the REASON
  // rather than the rule (not `Duplicate lead`); `Nothing was forwarded` is the
  // half that stops a false-done; and it neither apologises nor blames her — she
  // did a reasonable thing and the world was already in that state.
  refusalAlreadyHas:
    'They already have this enquiry — the same number is on their leads. Nothing was forwarded.',
  refusalClose: 'Close',

  // ── D · THE ROOM (veto sheet §D) ──────────────────────────────────────────
  // D1 is KEPT byte-for-byte from `lib/solutions/copy.ts`'s `ROOM_ROWS`. It is
  // NOT re-declared here — `roomTitle` reads that home at the room, so this file
  // cannot drift from the hub row that points at it.
  balanceSent: 'Sent',
  balanceReceived: 'Received',
  sectionPeers: 'Your peers',
  emptyHead: 'No forwards yet',
  // D6. `Both ways` is the load-bearing phrase. A vendor can picture giving work
  // away; she cannot picture the room being where it comes back, and that is the
  // only reason she would open it twice.
  emptyBody: "When you pass an enquiry to a peer, it’s counted here — both ways.",
  // R-38.2's inheritance: a failed read leaves the room standing with one
  // sentence rather than an empty page. Billing paid for that lesson.
  unavailable: "We couldn’t load your forwards just now.",

  // ── VETOED AS WRITTEN AT R-40.56. [F-40.219 · this paragraph was the finding]
  //
  // It stood here for a sitting reading "PROPOSED — NOT YET VETOED … FOUNDER:
  // veto or replace this line", after the founder had already ratified it. The
  // apostrophe cure at `24d6ed7` moved the STRING and left the PARAGRAPH — and a
  // later seat read this block, believed the byte was still straight and
  // unvetoed, and reported both to the chair. A comment true when written and
  // false when shipped is worse than none, because it is load-bearing for
  // whoever reads it next; here it was load-bearing within the hour.
  //
  // WHAT IT IS. The veto sheet ratified ONE refusal sentence (§C1, the
  // already-has case) because that is the refusal a vendor meets in the ordinary
  // course. Writing the join revealed the other three codes had no sentence at
  // all, and the first draft of `refusalSentence` referred to a "generic line"
  // that did not exist — a dangling reference that would have rendered an empty
  // sheet.
  //
  // Those three are states the SHEET PREVENTS rather than states she reaches, so
  // this line should never appear. But "should never appear" is exactly the class
  // of byte that appears, and an empty refusal is a false-done wearing silence.
  //
  // It says nothing it cannot back: no reason, because we do not have one worth
  // stating for a case that should not exist; no apology; and it does not claim
  // anything was sent.
  refusalGeneric: "That forward didn’t go through. Nothing was sent.",

  // ── T1 · THE TOLD STATE — R-G51.15 ──────────────────────────────────────
  // One word, on the SENDER's `Forwarded to` row and nowhere else. Not on the
  // peer's `Forwarded by` copy — she is the one who was told, and telling her
  // she was told is noise about a message she is holding. Not in the Referrals
  // room — those rows are per-peer totals and cannot carry a fact about one
  // forward.
  //
  // ⚠ IT APPEARS ONLY ONCE META RETURNS A WAMID, AND IS ABSENT OTHERWISE —
  // never a greyed "Pending". A state meaning "we do not know" must not look
  // like a state meaning "not yet"; the row with `status: sent` and a null wamid
  // is exactly the case where the message may well have arrived and the estate
  // cannot prove it, and a surface claiming proof it does not have is worse than
  // one that stays quiet.
  told: "Told",

  // ── P1/P2 · THE WITHDRAWAL SWITCH — R-40.107 ────────────────────────────
  // ⚠ POSITIVE, so the control and the column agree: `peer_discoverable`, safe
  // state `false`, and no reader anywhere inverts it. Not "Hide from peers" —
  // a switch whose ON means OFF is the mistake 0140 was written to avoid, one
  // column over on the same table.
  peerSwitchLabel: "Appear in peer searches",

  // TWO JOBS IN ONE LINE.
  // One: the switch is ON by default, so she is ALREADY listed, and she is owed
  // that fact before she has to ask for it. The default is not carelessness —
  // the search returns only `business_name`, `routing_handle`, `category` and
  // `city`, every one already on her PUBLIC storefront card, so this lets her
  // WITHDRAW from a directory built out of facts she already publishes rather
  // than consenting to a new exposure.
  // Two: "while your storefront is public" is the door's third predicate said
  // plainly. If she has paused her storefront she is in no peer search whatever
  // this switch says — she un-published with the one control she was given, so
  // she has published nothing.
  peerSwitchLine: "Peers can find you by name while your storefront is public and this is on.",
} as const;

/**
 * `2 sent · 1 received` — the per-peer figure, and the room's whole vocabulary.
 *
 * ⚠ LOWER CASE, ONE COLOUR FOR EVERY PEER, AND NO SUPERLATIVE. The first cut of
 * the mock drew the reciprocal peer in the accent ink and it was struck on the
 * walk: a colour that marks some peers and not others is a ranking, and master
 * §7 refuses ranking on this surface. The same reasoning forbids a `top partner`
 * label, a streak, an order by volume, or any phrasing that makes one peer read
 * better than another.
 *
 * ⚠ AND THE UNIT IS FORWARDS. Never `weddings` — the plane holds a lead. Never
 * money — there is no figure on this room and no `wl-rfig` rule in it.
 */
export function peerFigure(sent: number, received: number): string {
  return `${sent} sent \u00b7 ${received} received`;
}

/**
 * The join between the door's code and the founder's sentence.
 *
 * ⚠ ONLY ONE CODE HAS A RATIFIED SENTENCE, AND THE OTHERS RETURN NULL ON
 * PURPOSE. §C1 vetoed the already-has refusal because that is the one a vendor
 * meets in the ordinary course — she forwards to the peer who most obviously
 * fits, and that peer is the most likely to already know the couple.
 *
 * The other three are states the SHEET PREVENTS rather than states she reaches:
 * the search cannot list herself (`self`), the control is not offered on a lead
 * with no phone (`lead_has_no_phone`), and `not_a_peer` now needs a result that
 * went stale between the search and the tap. They fall to `refusalGeneric`,
 * which the founder VETOED AS WRITTEN at R-40.56. [F-40.219 · this sentence
 * read "PROPOSED AND UNVETOED" for a sitting after the ruling had landed.]
 *
 * ⚠ `referral_not_a_peer` KEPT ITS NAME AND CHANGED ITS MEANING — R-40.104.
 * It used to mean "not on your roster", because R-G51.1 made a linked roster
 * edge the boundary of the exchange. That boundary is repealed: the door now
 * refuses only a vendor who is not `status='active'`, or who has un-published
 * her storefront, or who has switched off peer discovery (R-40.107) — or who
 * does not exist at all.
 *
 * THE CODE WAS NOT RENAMED AND NO NEW CODE WAS MINTED, for two reasons. A new
 * code would grow `ForwardRefusalCode`, and this switch is exhaustive by type,
 * so the pwa would stop compiling until the founder had vetoed a sentence for a
 * state the search already prevents. And the door answers all four of those
 * worlds IDENTICALLY on purpose — distinguishing them would turn the forward
 * into an oracle for whether a given vendor exists and whether she has hidden
 * herself. One code, one sentence, no oracle.
 *
 * ⚠ THE SWITCH IS EXHAUSTIVE BY TYPE AND HAS NO `default`. Add a code to
 * `ForwardRefusalCode` and this function stops compiling until someone decides
 * which sentence it gets. That is the point: a refusal without a decided
 * sentence should not be shippable, and a `default` arm would have silently
 * swallowed every future code into the generic line.
 */
export function refusalSentence(code: ForwardRefusalCode): string {
  switch (code) {
    case 'referral_peer_already_has_lead': return RF.refusalAlreadyHas;
    case 'referral_self':
    case 'referral_not_a_peer':
    case 'referral_lead_has_no_phone':
      return RF.refusalGeneric;
  }
}
