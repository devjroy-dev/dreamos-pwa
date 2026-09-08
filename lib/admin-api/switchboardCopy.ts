// lib/admin-api/switchboardCopy.ts — THE SWITCHBOARD'S WORDS, ONE HOME. CE-41 seat C, C3 (F-41.52, F-41.53).
//
// Every gate on the Switchboard is one plain sentence that names the RECIPIENT,
// the LINE it leaves on and the EFFECT — so the founder reading a row on his
// phone knows who gets what if he flips it. The card prints `sentence`; the
// command palette matches any word of it, the register key, and the Meta
// template name, and jumps to the row (`/admin/switchboard#<key>`).
//
// Lines and recipients are derived from the senders at dream-os `66b4dc6`:
//   reviewAsk.js LANE='bride' · paymentReminders.js LANE='bride' · referralAlert.js
//   line:'vendor' · creditInvite.js line:'vendor' (both invites) · contractSend.js
//   line:'vendor' (sign link and sealed copy) · sign.js lane:'vendor' (the OTP) ·
//   couple/assistance.js: lead_outside line:'marketing', found_vendor / found_outside
//   line:'bride'. Categories from templates.js and the B1 record.
// The three lane words, ruled (c-41.22): couple line · vendor line · marketing
// line — never possessive, never a number, never a persona name. The platform is
// written The Dream Wedding in full on the glass. Every "records only until …"
// names the seat or packet that wakes the send.
//
// A key with no entry falls back to a humanised key so a new row is never blank.

export interface GateCopy {
  /** The one sentence on the glass. */
  sentence: string;
  /** The Meta template name, when the gate is or guards one. */
  meta?: string;
}

export const GATE_COPY: Readonly<Record<string, GateCopy>> = Object.freeze({
  // ── Features you switch on (flag.*) ──────────────────────────────────────
  'flag.contract_sign_send':    { sentence: 'Send the couple their contract to sign — to the couple, vendor line, Utility.', meta: 'tdw_contract_sign' },
  'flag.contract_copy_send':    { sentence: 'Send the signed contract\'s copy — to the vendor and the couple, vendor line, Utility.', meta: 'tdw_contract_copy' },
  'flag.payment_reminder_send': { sentence: 'Send the client her payment reminder — to the client, couple line, Utility.', meta: 'tdw_payment_reminder' },
  'flag.referral_alert_send':   { sentence: 'Tell the peer vendor a referral has arrived — to the peer vendor, vendor line, Utility.', meta: 'tdw_referral_alert' },
  'flag.wedding_credit_send':   { sentence: 'Invite a peer to be credited on the wedding page — to the peer vendor, vendor line, Utility.', meta: 'tdw_wedding_credit' },
  'flag.wedding_consent_send':  { sentence: 'Ask the couple to consent to the guest gallery — to the couple, vendor line, Utility.', meta: 'tdw_wedding_consent' },
  'flag.review_ask_send':       { sentence: 'Ask the couple for a Google review — to the couple, couple line, Marketing.', meta: 'tdw_review_request' },
  'flag.wedding_reel':          { sentence: 'Render the wedding reel — no message; needs ffmpeg on the server, which today it does not have.' },

  // ── Message templates on Meta (template.*) — the words themselves ─────────
  'template.tdw_contract_sign':     { sentence: 'Meta\'s words for the contract signing link — to the couple, vendor line, Utility.', meta: 'tdw_contract_sign' },
  'template.tdw_contract_sign_otp': { sentence: 'Meta\'s words for the contract signing code — to the couple, vendor line, Authentication.', meta: 'tdw_contract_sign_otp' },
  'template.tdw_contract_copy':     { sentence: 'Meta\'s words for the signed contract\'s copy — to the vendor and the couple, vendor line, Utility.', meta: 'tdw_contract_copy' },
  'template.tdw_payment_reminder':  { sentence: 'Meta\'s words for the payment reminder — to the client, couple line, Utility.', meta: 'tdw_payment_reminder' },
  'template.tdw_referral_alert':    { sentence: 'Meta\'s words for the peer referral alert — to the peer vendor, vendor line, Utility.', meta: 'tdw_referral_alert' },
  'template.tdw_wedding_credit':    { sentence: 'Meta\'s words for the wedding credit invite — to the peer vendor, vendor line, Utility.', meta: 'tdw_wedding_credit' },
  'template.tdw_wedding_consent':   { sentence: 'Meta\'s words for the guest gallery consent ask — to the couple, vendor line, Utility.', meta: 'tdw_wedding_consent' },
  'template.tdw_review_request':    { sentence: 'Meta\'s words for the Google review ask — to the couple, couple line, Marketing.', meta: 'tdw_review_request' },
  // The concierge four — arms dark behind these rows until A10 wakes the send (R-41.20).
  'template.tdw_assist_lead_outside':  { sentence: 'Send the outsider her join alert — to the outside vendor, marketing line, Marketing; records only until A10 wakes the send.', meta: 'tdw_assist_lead_outside' },
  'template.tdw_assist_found_vendor':  { sentence: 'Tell the couple we found her a vendor from The Dream Wedding — to the couple, couple line, Utility; records only until A10 wakes the send.', meta: 'tdw_assist_found_vendor' },
  'template.tdw_assist_found_outside': { sentence: 'Tell the couple we found her a vendor from outside The Dream Wedding — to the couple, couple line, Utility; records only until seat D wakes the send.', meta: 'tdw_assist_found_outside' },
  'template.tdw_introduction':         { sentence: 'Introduce a vendor to a couple — to the vendor, marketing line, Marketing; not sent before R9.', meta: 'tdw_introduction' },
  'template.tdw_capability_armed':     { sentence: 'Tell you a gate is ready to switch on — to you, vendor line, Utility; not yet filed at Meta.', meta: 'tdw_capability_armed' },

  // ── Meta app permissions (perm.*) ─────────────────────────────────────────
  'perm.whatsapp_business_pair':             { sentence: 'Meta\'s permission to send and manage WhatsApp for the business — in review since 2 September.' },
  'perm.instagram_business_basic':           { sentence: 'Meta\'s permission to read the Instagram account — the first Instagram door; not filed.' },
  'perm.instagram_business_manage_messages': { sentence: 'Meta\'s permission to reply to Instagram DMs — needed to bridge DMs to WhatsApp; not filed.' },
  'perm.instagram_business_manage_insights': { sentence: 'Meta\'s permission to read Instagram insights — needed for the Sunday brief; not filed.' },
  'perm.instagram_business_content_publish': { sentence: 'Meta\'s permission to publish to Instagram — needed to post from the studio; not filed.' },
  'perm.instagram_business_manage_comments': { sentence: 'Meta\'s permission to reply to Instagram comments — not filed.' },
  'perm.ads_read':                           { sentence: 'Meta\'s permission to read ad results — needs the second Meta app, not created.' },
  'perm.business_management':                { sentence: 'Meta\'s permission to manage the business assets — needs the second Meta app, not created.' },

  // ── Google access (scope.*) ───────────────────────────────────────────────
  'scope.google.siteverification':    { sentence: 'Google\'s leave to verify site ownership — on the house grant, for every vendor\'s website.' },
  'scope.google.webmasters.readonly': { sentence: 'Google\'s leave to read Search Console — on the house grant, for every vendor\'s website.' },
  'scope.google.business.manage':     { sentence: 'Google\'s leave to manage Business Profiles — for reviews and the profile claim; not requested until late October.' },
});

/** The sentence for a key, or a humanised key when no entry exists. */
export function gateSentence(key: string): string {
  const c = GATE_COPY[key];
  if (c) return c.sentence;
  return key.replace(/^(template|perm|scope|flag)\./, '').replace(/^tdw_/, '').replace(/[_.]/g, ' ');
}

/** The Meta template name a key is or guards, if any. */
export function gateMeta(key: string): string | undefined {
  return GATE_COPY[key]?.meta;
}

/** Where the palette jumps: the card, anchored on the row. */
export function gatePath(key: string): string {
  return `/admin/switchboard#${key}`;
}

/**
 * Does a palette needle match this gate? Any word of the sentence (prefix or
 * substring), the register key, or the Meta template name — lowercased.
 */
export function gateMatches(key: string, needle: string): boolean {
  const n = needle.trim().toLowerCase();
  if (!n) return false;
  const c = GATE_COPY[key];
  const sentence = (c ? c.sentence : gateSentence(key)).toLowerCase();
  if (sentence.includes(n)) return true;
  if (key.toLowerCase().includes(n)) return true;
  if (c?.meta && c.meta.toLowerCase().includes(n)) return true;
  return sentence.split(/[^a-z0-9']+/).some(w => w.startsWith(n));
}

/** Every key in the one home, in the card's order. */
export const GATE_KEYS: readonly string[] = Object.freeze(Object.keys(GATE_COPY));
