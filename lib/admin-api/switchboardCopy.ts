// lib/admin-api/switchboardCopy.ts — THE SWITCHBOARD'S WORDS, ONE HOME. CE-41 seat C, C3 (F-41.52, F-41.53).
//
// Every gate on the Switchboard is TWO LINES (F-41.57, ruled (a)): a short bold
// NAME the founder scans for, and a dotted SPEC — recipient · line · category ·
// dark-state — in the estate's own idiom (`Rs 18,000 · 30% · 8 Sep 2026`). One
// sentence packed all four facts into a clause chain that wrapped to four lines
// on a 374 row and read as prose; the founder called it a poem, and he was right.
// The card prints both lines; the palette matches either, the register key, and
// the Meta template name, and jumps to the row (`/admin/switchboard#<key>`).
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
  /** Line one, bold: the short name a founder scans for. */
  name: string;
  /** Line two, small: the dotted spec — recipient · line · category · dark-state. */
  spec: string;
  /** The Meta template name, when the gate is or guards one. */
  meta?: string;
}

export const GATE_COPY: Readonly<Record<string, GateCopy>> = Object.freeze({
  // ── Features you switch on (flag.*) ──────────────────────────────────────
  'flag.contract_sign_send':               { name: 'Contract signing link', spec: 'to the couple · vendor line · Utility', meta: 'tdw_contract_sign' },
  'flag.contract_copy_send':               { name: 'Signed contract copy', spec: 'to the vendor and the couple · vendor line · Utility', meta: 'tdw_contract_copy' },
  'flag.payment_reminder_send':            { name: 'Payment reminder', spec: 'to the client · couple line · Utility', meta: 'tdw_payment_reminder' },
  'flag.referral_alert_send':              { name: 'Peer referral alert', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_referral_alert' },
  'flag.wedding_credit_send':              { name: 'Wedding credit invite', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_wedding_credit' },
  'flag.wedding_consent_send':             { name: 'Guest gallery consent ask', spec: 'to the couple · vendor line · Utility', meta: 'tdw_wedding_consent' },
  'flag.review_ask_send':                  { name: 'Google review ask', spec: 'to the couple · couple line · Marketing', meta: 'tdw_review_request' },
  'flag.wedding_reel':                     { name: 'Wedding reel', spec: 'no message · needs ffmpeg on the server · absent today' },

  // ── Message templates on Meta (template.*) — the words themselves ─────────
  'template.tdw_contract_sign':            { name: 'Contract signing link — Meta\'s words', spec: 'to the couple · vendor line · Utility', meta: 'tdw_contract_sign' },
  'template.tdw_contract_sign_otp':        { name: 'Contract signing code — Meta\'s words', spec: 'to the couple · vendor line · Authentication', meta: 'tdw_contract_sign_otp' },
  'template.tdw_contract_copy':            { name: 'Signed contract copy — Meta\'s words', spec: 'to the vendor and the couple · vendor line · Utility', meta: 'tdw_contract_copy' },
  'template.tdw_payment_reminder':         { name: 'Payment reminder — Meta\'s words', spec: 'to the client · couple line · Utility', meta: 'tdw_payment_reminder' },
  'template.tdw_referral_alert':           { name: 'Peer referral alert — Meta\'s words', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_referral_alert' },
  'template.tdw_wedding_credit':           { name: 'Wedding credit invite — Meta\'s words', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_wedding_credit' },
  'template.tdw_wedding_consent':          { name: 'Guest gallery consent ask — Meta\'s words', spec: 'to the couple · vendor line · Utility', meta: 'tdw_wedding_consent' },
  'template.tdw_review_request':           { name: 'Google review ask — Meta\'s words', spec: 'to the couple · couple line · Marketing', meta: 'tdw_review_request' },
  // The concierge four — arms dark behind these rows until A10 wakes the send (R-41.20).
  'template.tdw_assist_lead_outside':      { name: 'Outsider join alert', spec: 'to the outside vendor · marketing line · Marketing · dark until A10', meta: 'tdw_assist_lead_outside' },
  'template.tdw_assist_found_vendor':      { name: 'Found her a vendor from The Dream Wedding', spec: 'to the couple · couple line · Utility · dark until A10', meta: 'tdw_assist_found_vendor' },
  'template.tdw_assist_found_outside':     { name: 'Found her a vendor from outside The Dream Wedding', spec: 'to the couple · couple line · Utility · dark until seat D', meta: 'tdw_assist_found_outside' },
  'template.tdw_introduction':             { name: 'Vendor introduction', spec: 'to the vendor · marketing line · Marketing · not sent before R9', meta: 'tdw_introduction' },
  'template.tdw_capability_armed':         { name: 'Switchboard notice to you', spec: 'to you · vendor line · Utility · not yet filed at Meta', meta: 'tdw_capability_armed' },

  // ── Meta app permissions (perm.*) ─────────────────────────────────────────
  'perm.whatsapp_business_pair':           { name: 'WhatsApp business permissions', spec: 'Meta app · in review since 2 September' },
  'perm.instagram_business_basic':         { name: 'Instagram: read the account', spec: 'Meta app · the first Instagram door · not filed' },
  'perm.instagram_business_manage_messages': { name: 'Instagram: reply to DMs', spec: 'Meta app · bridges DMs to WhatsApp · not filed' },
  'perm.instagram_business_manage_insights': { name: 'Instagram: read insights', spec: 'Meta app · feeds the Sunday brief · not filed' },
  'perm.instagram_business_content_publish': { name: 'Instagram: publish', spec: 'Meta app · posts from the studio · not filed' },
  'perm.instagram_business_manage_comments': { name: 'Instagram: reply to comments', spec: 'Meta app · not filed' },
  'perm.ads_read':                         { name: 'Ads: read results', spec: 'Meta app · needs the second app · not created' },
  'perm.business_management':              { name: 'Ads: manage the business', spec: 'Meta app · needs the second app · not created' },

  // ── Google access (scope.*) ───────────────────────────────────────────────
  'scope.google.siteverification':         { name: 'Google: verify site ownership', spec: 'house grant · every vendor\'s website · granted' },
  'scope.google.webmasters.readonly':      { name: 'Google: read Search Console', spec: 'house grant · every vendor\'s website · granted' },
  'scope.google.business.manage':          { name: 'Google: manage Business Profiles', spec: 'reviews and the profile claim · not requested until late October' },
});

/** Line one: the short name, or a humanised key when no entry exists. */
export function gateName(key: string): string {
  const c = GATE_COPY[key];
  if (c) return c.name;
  return key.replace(/^(template|perm|scope|flag)\./, '').replace(/^tdw_/, '').replace(/[_.]/g, ' ');
}

/** Line two: the dotted spec, or '' when no entry exists. */
export function gateSpec(key: string): string {
  return GATE_COPY[key]?.spec ?? '';
}

/**
 * Both lines as one string — for the palette's label and anywhere a single line
 * is all there is room for. The card never uses this; it prints the two lines.
 */
export function gateSentence(key: string): string {
  const c = GATE_COPY[key];
  if (!c) return gateName(key);
  return `${c.name} — ${c.spec}`;
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
  const sentence = gateSentence(key).toLowerCase();
  if (sentence.includes(n)) return true;
  if (key.toLowerCase().includes(n)) return true;
  if (c?.meta && c.meta.toLowerCase().includes(n)) return true;
  return sentence.split(/[^a-z0-9']+/).some(w => w.startsWith(n));
}

/** Every key in the one home, in the card's order. */
export const GATE_KEYS: readonly string[] = Object.freeze(Object.keys(GATE_COPY));
