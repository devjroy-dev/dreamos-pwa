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
  pickerFooter: "Peers you’ve worked with appear here.",

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

  // ── ⚠ PROPOSED — NOT YET VETOED. THIS IS THE ONE BYTE IN THIS FILE THE
  //      FOUNDER HAS NOT RATIFIED, AND IT IS FLAGGED RATHER THAN SMUGGLED.
  //
  // The veto sheet ratified ONE refusal sentence (§C1, the already-has case)
  // because that is the refusal a vendor meets in the ordinary course. Writing
  // the join revealed that the other three codes had no sentence at all and the
  // first draft of `refusalSentence` below referred to a "generic line" that did
  // not exist — a dangling reference that would have rendered an empty sheet.
  //
  // The three are states the SHEET PREVENTS rather than states she reaches: the
  // picker lists only linked peers, it cannot list her, and the control is not
  // offered on a lead with no phone. So this line should never appear. But
  // "should never appear" is exactly the class of byte that appears, and an
  // empty refusal is a false-done wearing silence.
  //
  // It says nothing it cannot back: no reason, because we do not have one worth
  // stating for a case that should not exist; no apology; and it does not claim
  // anything was sent.
  //
  // FOUNDER: veto or replace this line. If it is struck, the sheet needs another
  // behaviour for the unreachable codes and that is a ruling, not an edit.
  refusalGeneric: "That forward didn’t go through. Nothing was sent.",
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
 * the picker lists only linked peers (so `not_a_peer` needs a stale list), it
 * cannot list herself (`self`), and the control is not offered on a lead with no
 * phone (`lead_has_no_phone`). They fall to `refusalGeneric`, which is PROPOSED
 * AND UNVETOED — see its own block above.
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
