// lib/worklist/paymentReminders.ts
// BLOCK 19 · G3.4 — THE PAYMENT REMINDERS ROOM'S STRINGS, AND THEIR ONE HOME.
//
// Every byte here was vetoed on `docs/mocks/G34_VETO_SHEET.md` and ratified
// 2026-09-06 (founder, delegated to the chair, R-40.42). The sheet's numbers are
// carried in the comments so a reader can walk from a string on glass back to the
// row that approved it without opening two files and guessing.
//
// ⚠ THREE OF THESE WERE AMENDED AT THE VETO AND THE SEAT WAS WRONG.
// Rows #3, #6 and #7 were proposed as **Landed**. The founder ruled **Sent**, on
// reasoning the seat had held and not carried far enough: a `wamid` means
// WhatsApp ACCEPTED the message, never that it reached her client's phone, and
// *Landed* claims the second. #7 was rewritten in the same breath to name BOTH
// blind spots — delivered and read — where the seat's draft named only reading.
// Recorded here rather than only in the sheet so the word is not re-proposed by
// someone who finds `Sent` terse and thinks it an oversight.
//
// ⚠ AND THE WORD ON THIS ROOM IS **CLIENT**, NEVER COUPLE (R-G34.3).
// An invoice carries `client_name` and `client_phone`; it has no `couple_id`,
// and `clients` has none either. There is no `couples` row behind an invoice, so
// a room saying "couple" would name a record that does not exist on this path.

export const PR = {
  // ── THE ROOM ────────────────────────────────────────────────────────────
  // #1 is R-40.1's byte, frozen. It matches `ROOM_ROWS`' label exactly; a room
  // whose title disagrees with the row that opened it is two names for one place.
  roomTitle: 'Payment reminders',                                      // #1

  sectionAsked: 'Asked',                                               // #2
  sectionSent:  'Sent',                                                // #3 (amended)
  sectionDue:   'Due',                                                 // #4

  askedState: 'Asked',                                                 // #5
  sentState:  'Sent',                                                  // #6 (amended)

  // #7 — THE ROOM'S MOST IMPORTANT SENTENCE, and the reason band 2 can carry a
  // count at all. There are no read receipts on this path; `sendWa` returns a
  // wamid and nothing after it. Without this line, "Sent 2" is read as "she got
  // it twice", which is a claim the estate cannot support for a single one.
  sentNote: 'Sent means WhatsApp accepted it. We cannot tell you whether it was delivered or read.', // #7

  // ── THE EMPTY STATE ─────────────────────────────────────────────────────
  // #9 names the TRIGGER (her own first tap, on an invoice) and the room's job
  // (keeping the record) — the two things a vendor asks, in that order. It does
  // NOT name the three days: that number belongs to the switch's line, and
  // stating it here would promise a cadence before she has armed anything.
  emptyHead: 'No reminders sent yet',                                  // #8
  emptyBody: 'Open an invoice with a payment schedule and send the first reminder yourself. After that, this room keeps the record.', // #9

  // ── THE SWITCH ──────────────────────────────────────────────────────────
  // #12 carries the whole guarantee in one sentence — the first reminder is
  // always hers, per invoice, and the switch releases only the rest. That is
  // "silence never means yes" made legible to the person it protects, and it is
  // why the sentence is long rather than snappy.
  sectionSending: 'Sending',
  switchLabel:    'Send the rest automatically',                       // #10
  switchOffState: 'Off',
  switchOnState:  'On',
  switchOff: 'Off. You send every reminder yourself.',                 // #11
  switchOn:  'On. After you send the first reminder on an invoice yourself, the rest go out three days before they are due.', // #12

  // ── THE DARK GATE ───────────────────────────────────────────────────────
  // #13 — THE STATE ON THE DAY THIS SHIPS, and it is not a failure mode.
  // `PAYMENT_REMINDER_SEND_ENABLED` is unset in every environment. The template
  // IS Active at Meta, so the sentence must not blame the approval; it says the
  // sending is off and that nothing set here will act until it is on.
  //
  // ⚠ THE SWITCH IS DRAWN AND INERT IN THIS STATE, NOT HIDDEN AND NOT ARMED.
  // Arming a control that cannot act is the lying-control class this estate has
  // filed twice (R-G11c.8's lineage). Hiding it would be worse — she would not
  // know the feature exists.
  darkNote:      'Reminders are not sending yet. Nothing you set here will go out until they are.', // #13
  darkNotFiled:  'Reminders are not sending yet. WhatsApp is still approving the message.',

  // The room still stands when the read fails. R-38.2: the chrome is a fact
  // about the product, the numbers are a fact about the fetch, and only the
  // second one failed. Billing paid for that lesson; this room inherits it.
  unavailable: 'We could not load your reminders just now. Nothing has been sent.',
} as const;

// ── THE MONEY, THROUGH ONE FUNCTION ───────────────────────────────────────
// `Rs 60,000` and `Rs 2,00,000` — the estate's one spelling, never the glyph
// (master §7). `en-IN` supplies the Indian grouping; it is the platform's own
// and is not hand-rolled here.
//
// ⚠ THIS IS THE SECOND HOME FOR THIS FORMAT AND THAT IS NOT AN ACCIDENT.
// `src/lib/vendor/paymentReminders.js:formatRs` is the first, and it lives in
// the OTHER REPO — the backend composes the figure that goes into the WhatsApp
// message, this composes the figure on glass. Neither can import the other.
// Named as a transcription rather than left to look like an oversight, and the
// two are asserted identical on a shared case by the pwa bench.
export function reminderRs(amount: number): string {
  const n = Number(amount || 0);
  return `Rs ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)}`;
}

// ── THE DATE, THROUGH THE HOUSE FORMAT ────────────────────────────────────
// `12 Sep 2026`. NOT `Intl`: `Intl('en-IN')` renders September as `Sept`, four
// letters alone among the twelve, and the S2 veto sheet carries that as a ruled
// byte. The month table is transcribed for the same reason `googleReviews.ts`
// transcribes it — that home is in the other repo.
//
// A `date` column arrives as `YYYY-MM-DD` with no zone, so it is read in UTC.
// Parsing it locally would shift the day backwards in any negative-offset
// deploy region: a bug invisible from India, on the one field a client reads.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export function reminderDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// ── THE ROW'S SECOND LINE ─────────────────────────────────────────────────
// `Second instalment · Rs 60,000`. The milestone label is the VENDOR'S OWN free
// text and is printed as she typed it — capitalising or trimming it here would
// be this room editing her words on her own screen.
export function reminderDetail(milestone: string, amount: number): string {
  const label = String(milestone || '').trim();
  return label ? `${label} \u00B7 ${reminderRs(amount)}` : reminderRs(amount);
}

// ── THE CONFIRM SHEET'S PREVIEW ───────────────────────────────────────────
// `tdw_payment_reminder`'s FILED bytes (R-40.76, Meta ID 1781270206634381) with
// the four variables substituted:
//
//   Hi {{1}}, a payment reminder from {{3}}. {{2}} is due on {{4}}.
//   UPI or cash, whichever suits.
//
// ⚠ THIS IS A TRANSCRIPTION AND IT CAN DRIFT. The authoritative composition is
// `src/lib/vendor/paymentReminders.js` in the OTHER REPO — `composeMilestonePhrase`
// for {{2}} and the registry's `body` for the frame. Neither repo can import the
// other. If the two ever disagree, THIS ONE IS THE LIE and the backend is what a
// client receives; the bench asserts them identical on a shared case.
//
// ⚠ `{{2}}` OPENS A SENTENCE, SO IT IS CAPITALISED — the same first-character-only
// rule the backend applies (R-G34.11). Meta's filed review sample is lowercase;
// samples are for the reviewer and never transmitted, so the two differ by design.
//
// ⚠ `vendorName` MUST BE `vendors.business_name`, WHICH IS WHAT THE DOOR SENDS AS
// {{3}} — never the session's `name`. They are different columns and can hold
// different words; a preview showing one while the client receives the other would
// be a confirm sheet that fails at the only job it has (F-39.70/.71). The caller
// reads it from `fetchMe()`. Null renders an em dash rather than a guess: an
// unset business name is a real state, and a sheet that invented one would have
// her approve words that are not the words.
export function reminderPreview(
  clientName: string | null,
  milestone: { milestone_label: string; amount_due: number; due_date: string | null },
  vendorName: string | null,
): string {
  const raw    = String(milestone.milestone_label || '').trim();
  const safe   = raw || 'The next instalment';
  const phrase = `${safe.charAt(0).toUpperCase()}${safe.slice(1)} of ${reminderRs(milestone.amount_due)}`;
  const due    = reminderDueWords(milestone.due_date);
  return `Hi ${clientName || '\u2014'}, a payment reminder from ${vendorName || '\u2014'}. ${phrase} is due on ${due}. UPI or cash, whichever suits.`;
}

// The date AS THE CLIENT READS IT — `12 September`, no year. Distinct from
// `reminderDate` above, which is the room's `12 Sep 2026` house format. Two
// formats because they answer two questions: the room is a ledger and wants the
// year, the message is a nudge three days out and a year makes it read like a
// legal notice. The backend's `formatDueDate` is this one.
export function reminderDueWords(iso: string | null): string {
  if (!iso) return '\u2014';
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return '\u2014';
  const FULL = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'] as const;
  return `${d.getUTCDate()} ${FULL[d.getUTCMonth()]}`;
}
