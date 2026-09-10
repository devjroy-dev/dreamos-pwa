// lib/worklist/introductions.ts — R9-J1 · THE INTRODUCTIONS ROOM'S WORDS.
// CE-42 seat E3, 4a packet 3b. Base dreamos-pwa d22bdf2c.
//
// ═══ THE FIFTEEN ARE THE CHAIR'S, VETOED 2026-09-10, AND THIS IS THEIR ONE HOME
// Every byte below is transcribed from the veto sheet, numbered as the sheet
// numbers them. Not one is authored here and not one is spelled twice: the
// screen reads this file and holds no string of its own. `#8` and `#11` carry
// runtime values, so they are FUNCTIONS rather than templates the caller fills
// — a caller that interpolates is a caller that can reorder the sentence.
//
// ═══ WHAT IS NOT HERE, AND WHY ═══════════════════════════════════════════════
// The refusals. A missing slot, a second introduction to one number, and a dark
// plane are all the DOOR'S sentences (`INTRO_ASK_*`, `INTRO_ALREADY_SENT`,
// `INTRO_NOT_DELIVERED`, `cap.reason()`), forwarded on `body.error` by
// src/api/vendor/introductions.js and rendered as they arrive. Spelling any of
// them here would be a second home for a founder-vetoed byte in the other repo,
// which is the disease F-41.123 is named after. The screen renders `body.error`
// and never a local map.

/** The three fields the vendor fills, in the door's own `SLOT_ORDER`. */
export type IntroDraft = {
  recipient_phone: string;
  recipient_name: string;
  where_met: string;
};

/**
 * A row as `GET /api/v2/vendor/introductions` returns it. Re-derived from
 * src/api/vendor/introductions.js:67-79 at dream-os 876cef2 — the door maps
 * every field by hand, so this is the shape and not a guess.
 *
 * ⚠ `recipient_phone_last4`, NOT the number. Chair-ruled: a list is not a
 * phonebook. The wire does not carry a stranger's handset to draw a list.
 */
export type IntroRow = {
  id: string;
  recipient_name: string | null;
  recipient_phone_last4: string | null;
  where_met: string | null;
  status: string;
  chip: IntroChip;
  created_at: string | null;
  sent_at: string | null;
};

/** `chipState`'s seven answers (src/lib/vendor/introductions.js:160-172). */
export type IntroChip =
  | 'delivered' | 'read' | 'sent' | 'sent_no_receipt'
  | 'not_delivered' | 'not_sent' | 'none';

/** The 201 from `POST /` — payload spread at the top level, never under `data:`. */
export type IntroStaged = {
  id: string;
  recipient_name: string;
  body_filled: string;
  page_url: string;
};

export const IN = {
  /** #1 — the screen title. Passed to `WorklistShell`, which owns its ink. */
  title: 'Introductions',
  /** #2 */
  lede: 'Send your page to someone you met. It goes once, and only after you approve it.',
  /** #3 */
  labelNumber: 'Their number',
  /** #4 */
  labelName: 'Their name',
  /** #5 */
  labelWhere: 'Where you met',
  /** #6 */
  review: 'Review the message',
  /** #7 */
  previewEyebrow: 'They will receive',
  /** #9 — a TEXT LINK, and it sits ABOVE #8 (frame correction 1). */
  back: 'Back',
  /** #10 */
  sectionSent: 'Sent',
  /** #15 — ABOVE the form, under the Sent eyebrow. Never instead of the form. */
  empty: 'No introductions yet.',
} as const;

/**
 * #8 — `Send to {name}`, FULL WIDTH, ONE LINE, ellipsis on overflow.
 *
 * THE FRAME DREW THIS BESIDE `Back` AND IT WRAPPED. At 374 the two-up row gave
 * the confirm 168px and `Send to Anita Verma` broke onto a second line inside a
 * button — the shot is in `docs/mocks/j1-introductions-mock.html`'s own
 * GRAPHITE render. Correction 1 of the four: the confirm takes the full column
 * and `Back` becomes a text link above it. The clamp is CSS (`.itr-send`), not
 * a truncation here — a name cut in TypeScript is a name the vendor cannot
 * read by widening her window, and she is approving a message TO that person.
 */
export function sendTo(name: string): string {
  // The outer trim is for the degenerate case alone. With a name the byte is
  // `Send to <name>` exactly as the sheet writes it; with none it is `Send to`
  // rather than `Send to ` — a trailing space is invisible on glass and shows
  // up in a bench diff as a byte nobody vetoed. The door refuses a blank name
  // before it ever stages a row, so this arm should be unreachable; unreachable
  // is a claim about today's callers and not a property of the function.
  return `Send to ${String(name || '').trim()}`.trim();
}

/**
 * #11 — `met at {place} · {date}`.
 *
 * `place` is the vendor's own free text and is printed as she typed it.
 * Capitalising or trimming her words on her own screen is this room editing
 * her, and `reminderDetail` sets that precedent one file over.
 *
 * With no date on the row the separator goes too — `met at the Verma wedding ·`
 * with nothing after it is a row advertising a hole.
 */
export function introMeta(place: string | null, iso: string | null): string {
  const where = String(place || '').trim();
  const when = introDate(iso);
  const met = where ? `met at ${where}` : '';
  if (met && when) return `${met} \u00B7 ${when}`;
  return met || when;
}

// ── THE DATE, THROUGH THE HOUSE FORMAT ────────────────────────────────────
// `8 Sep`. Day and month, no year: the frame carries no year and a row three
// days old does not need one.
//
// ⚠ `Sep`, NOT `Sept`, AND THAT IS A FIFTH FRAME CORRECTION (F-42.112). The
// ratified frame draws `8 Sept` and `Sept` is exactly the byte the S2 veto
// sheet ruled against — `Intl('en-IN')` spells September with four letters
// alone among the twelve, and `lib/worklist/paymentReminders.ts:105` transcribes
// this table rather than call `Intl` for that reason. The house rule outranks
// an incidental spelling in a frame; the table is transcribed a second time
// here rather than imported, because the reminders file is another seat's and
// its two exports answer other questions (`12 Sep 2026`, `12 September`).
//
// ⚠ READ IN IST, NOT IN UTC. `created_at` and `sent_at` are TIMESTAMPS, not the
// `date` columns `reminderDate` was written for. An introduction sent at 02:00
// IST is `7 Sep` read in UTC and `8 Sep` on the handset that sent it, and the
// vendor is in India. The offset is the one `lib/vendor/istDay.ts` declares.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function introDate(iso: string | null): string {
  if (!iso) return '';
  const t = new Date(String(iso)).getTime();
  if (Number.isNaN(t)) return '';
  const d = new Date(t + IST_OFFSET_MS);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/**
 * #12 · #13 · #14 — THE THREE VETOED CHIPS, AND THE FOUR STATES THAT HAVE NONE.
 *
 * The door ships `chip`, which is `chipState`'s DERIVED vendor-facing answer,
 * and this maps it to a byte. `status` is on the row too and is deliberately
 * not read: `sent` with no wamid is `sent_no_receipt`, and a map keyed on
 * `status` would print `Delivered` over a send with no receipt to speak from.
 *
 * ⚠ `read` TAKES `Delivered`, WHICH IS TRUE AND IS LESS THAN THE TRUTH. A read
 * message was delivered. No `Read` byte was vetoed and minting one here would
 * be a sixteenth string; the state is not lost, it is under-reported, and that
 * is the safe direction on a receipt.
 *
 * ⚠ `sent_no_receipt` TAKES `Sent`, for the same reason and the same direction.
 *
 * ⚠ `not_sent` AND `none` TAKE NOTHING, AND THEIR ROWS ARE NOT DRAWN — F-42.111.
 * A staged row exists from the moment she is shown a draft; the dark half of
 * the walk files one and refuses. The section eyebrow is `Sent` (#10) and a row
 * that has not been sent does not belong under it, so `introSent()` filters
 * them out. That leaves a real gap, filed rather than papered: after a 503 the
 * row is on the plane and invisible on the glass, and a second attempt at the
 * same number is refused by the 409 naming a row she cannot see. The cure is a
 * vetoed byte for the state, which is not this seat's to write.
 */
export function chipWord(chip: IntroChip): string | null {
  if (chip === 'delivered' || chip === 'read') return 'Delivered';
  if (chip === 'sent' || chip === 'sent_no_receipt') return 'Sent';
  if (chip === 'not_delivered') return 'Not delivered';
  return null;
}

/** The rows the `Sent` section draws — those with a chip byte. See F-42.111. */
export function introSent(rows: IntroRow[]): IntroRow[] {
  return (rows || []).filter((r) => chipWord(r.chip) !== null);
}

/**
 * THE PAGE ADDRESS AS THE FRAME PRINTS IT — the door's `page_url` with the
 * scheme dropped. `https://` in a line under a button is eight characters of
 * chrome on the one line that has to be read as an address. The VALUE is the
 * door's and is never rebuilt here: no `thedreamwedding.in` literal exists in
 * this file, so a vendor on another host sees her own.
 */
export function pageLabel(url: string): string {
  return String(url || '').replace(/^https?:\/\//, '');
}

/**
 * THE TEMPLATE'S BUTTON LABEL — F-42.110, AND IT IS A SECOND HOME.
 *
 * `See my work` is `TEMPLATES.introduction.button.text` in dream-os
 * (src/lib/templates.js:954): Meta holds it, the send never transmits it, and
 * the 201 from `POST /` carries `id`, `recipient_name`, `body_filled` and
 * `page_url` — NOT the button. So the preview cannot render the button she is
 * about to send without a copy, and this is that copy, declared rather than
 * buried at a call site.
 *
 * It is proven equal to the registry entry at this cut and it CAN DRIFT. The
 * cure is one field on the door's 201, which is dream-os and read-only to this
 * seat; until it lands, this is the only spelling in the pwa and the bench
 * pins it to this one home.
 */
export const BUTTON_LABEL = 'See my work';
