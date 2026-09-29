// lib/worklist/enquiryRouting.ts · CE-45 · G6-1 · FE_2 (pwa half).
// EVERY VENDOR-FACING BYTE OF §7c's SETTINGS ROW, "Where enquiries go", ONE HOME.
//
// ⚠ EVERY LINE IS THE FOUNDER'S: E1 to E11 as written in the FE_2 read-first's copy table (iv) and approved by
// him in one word ("ok", relayed by CE-45, 2026-09-24); b125 §1.1 pins each by sha. E10 and E12 are NOT retyped
// here: they are imported from their approved homes, so one word has one home.
// FE_2b (his "yes", 2026-09-24): the three options renamed (tdw, tdwLine, own, ownLine, waba, wabaLine); rung 3's
// state line folded into its description (no separate "Arrives with" byte); E11 now "Enter a WhatsApp number."
// "TDW’s" carries the typographic apostrophe (R-40.57) where the relay had a straight one. "Agent" is a plain word,
// not a persona name.
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
  tdw:            'Your TDW agent answers',
  /** E3b · option 1, its line */
  tdwLine:        'Couples message TDW’s number. Your agent replies for you and files every enquiry as a lead.',
  /** E4 · option 2 */
  own:            'You answer on your number',
  /** E4b · option 2, its line */
  ownLine:        'Couples message your WhatsApp. You reply yourself; nothing comes to TDW.',
  /** E5 · option 3, shown disabled */
  waba:           'Your TDW agent answers on your number',
  /** E5b · option 3's description, its state folded in (F-19.20: disabled and stated, never hidden). FE_2b, his. */
  wabaLine:       'Couples message your WhatsApp. Your agent replies for you there. Available once your own number is connected.',
  /** E6 · consent (a), on the second screen (§7c, twice-stated, FK3) */
  consentPublic:  'This number will be shown on your public page, where anyone can see it.',
  /** E7 · consent (b), on the second screen */
  consentBypass:  'Enquiries sent there skip TDW: no replies from TDW, and they will not appear in your leads.',
  /** E8 · the phone field's label */
  phoneLabel:     'Your WhatsApp number',
  /** E9 · the confirm */
  confirm:        'Yes, send enquiries to this number',
  /** E11 · the phone is not a phone */
  phoneInvalid:   'Enter a WhatsApp number.',
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
