// lib/worklist/enquiryRouting.ts · CE-45 · G6-1 · FE_2 (pwa half).
// EVERY VENDOR-FACING BYTE OF §7c's SETTINGS ROW, "Where enquiries go", ONE HOME.
//
// ⚠ EVERY LINE IS THE FOUNDER'S: E1 to E11 as written in the FE_2 read-first's copy table (iv) and approved by
// him in one word ("ok", relayed by CE-45, 2026-09-24); b125 §1.1 pins each by sha. E5b is spec §7c's own
// words (founder-approved 2026-08-29). E10 and E12 are NOT retyped here: they are imported from their approved
// homes, so one word has one home.
//
// NO PERSONA NAME in any value (b40 C32's law). The spec's rung-1 prose names one; the glass never does.
import { FLOW } from '@/lib/worklist/ownNumberFlow';
import { COPY } from '@/lib/solutions/copy';

export const ENQ = {
  /** E1 · the row's label */
  label:          'Where enquiries go',
  /** E2 · the row's line, under the label */
  line:           'Choose where couples land when they tap Enquire on WhatsApp on your page.',
  /** E3 · option 1 (default) */
  tdw:            'Through TDW',
  /** E3b · option 1, its line */
  tdwLine:        'TDW answers for you in your voice, and every enquiry lands in your leads.',
  /** E4 · option 2 */
  own:            'Straight to my WhatsApp',
  /** E4b · option 2, its line */
  ownLine:        'Couples message the number you type here.',
  /** E5 · option 3, shown disabled */
  waba:           'My own number in TDW app',
  /** E5b · option 3's state (F-19.20: disabled and stated, never hidden). Spec §7c's words. */
  wabaLine:       'Arrives with Own number',
  /** E6 · consent (a), on the second screen (§7c, twice-stated, FK3) */
  consentPublic:  'This number will be shown on your public page, where anyone can see it.',
  /** E7 · consent (b), on the second screen */
  consentBypass:  'Enquiries sent there skip TDW: no replies from TDW, and they will not appear in your leads.',
  /** E8 · the phone field's label */
  phoneLabel:     'Your WhatsApp number',
  /** E9 · the confirm */
  confirm:        'Yes, send enquiries to this number',
  /** E11 · the phone is not a phone */
  phoneInvalid:   'Enter a WhatsApp number with its country code.',
} as const;

/** E10 · cancel: the founder's "Not now", from the own-number flow's home. */
export const ENQ_CANCEL: string = String(FLOW.cancel);
/** E12 · a failed save: the approved failed-load line. */
export const ENQ_FAILED: string = COPY.surfaceUnavailable;

/**
 * Pure. The row's own phone check, the door's rule (FE_2 FK2): 10 to 15 digits, an optional leading +, spaces,
 * brackets and dashes allowed between. The door checks again; this only saves her a round trip.
 */
export function phoneLooksRight(raw: string): boolean {
  const t = String(raw || '').trim();
  if (!/^\+?[\d ()-]{10,24}$/.test(t)) return false;
  const d = t.replace(/\D/g, '');
  return d.length >= 10 && d.length <= 15;
}
