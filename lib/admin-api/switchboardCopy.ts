// lib/admin-api/switchboardCopy.ts — THE SWITCHBOARD'S WORDS, ONE HOME. CE-41 seat C, C3 (F-41.52, F-41.53).
//
// ── OWNERSHIP ──────────────────────────────────────────────────────────────────
// Authored by seat C (C3). Seat C rested mid-arc and R-41.99 gave this file to
// seat E, which holds it from CE-41 E2 (i) on. The cross-seat note is here rather
// than in a commit message because the next seat to open this file reads the file,
// not the log.
//
// ── R-41.102 · A TEMPLATE IS A LINE, NOT A ROW ────────────────────────────────
// A `template.*` gate guarded by a `flag.*` renders as that flag's SECOND LINE,
// and a flag carries EVERY template its door sends (the amendment: the contract
// flag carries both the signing link and the signing code). Only an orphan
// template — one no flag guards — gets a row of its own with a verb. This halves
// the card. The join is `meta` below; it is not a second list.
//
// ⚠ THE ROW ARITHMETIC THIS PARAGRAPH USED TO CARRY IS GONE, DELIBERATELY — and
// the old figures are NOT restated here, because a bench cell asserts their absence
// and a quotation would defeat it (R-40.105's shape: an absence cell reads what is
// on the page, and a comment is on the page). Read the diff for what they were.
// They had drifted twice unnoticed — F-41.122 added orphan rows, F-41.144 adds the
// ninth flag — and a count frozen in a comment goes stale on the next edit while
// reading as fact forever. That is the same defect as the note further down this
// file, which is why both are cured in one packet. The rows are DERIVED at render
// from `GATE_COPY`, `GUARDED_TEMPLATES` and `ROOM_OF`; if a number is wanted it is
// counted, not recalled. The gate total was never this file's fact either: the
// register is the `capabilities` table in dream-os and this file cannot see it.
//
// ── THE TWO DARK WORDS ARE NOT SYNONYMS ───────────────────────────────────────
// `Waiting` — Meta has not answered yet.
// `Not sending yet` — Meta HAS approved the words and the door is still dark.
// They sit adjacent in STATUS_WORD and a later seat will be tempted to tidy one
// into the other. Do not: a founder reading `Waiting` waits on Meta, and a founder
// reading `Not sending yet` waits on this estate. Different queue, different act.
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
  /** The Meta template ID, shown one tap deep in the evidence disclosure. */
  metaId?: string;
}

export const GATE_COPY: Readonly<Record<string, GateCopy>> = Object.freeze({
  // ── Features you switch on (flag.*) ──────────────────────────────────────
  'flag.contract_sign_send':               { name: 'Send the contract for signing', spec: 'to the couple · vendor line · Utility', meta: 'tdw_contract_sign' },
  'flag.contract_copy_send':               { name: 'Send the signed contract back', spec: 'to the vendor and the couple · vendor line · Utility', meta: 'tdw_contract_copy' },
  'flag.payment_reminder_send':            { name: 'Send payment reminders', spec: 'to the client · couple line · Utility', meta: 'tdw_payment_reminder' },
  'flag.referral_alert_send':              { name: 'Tell a peer vendor about a referral', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_referral_alert' },
  'flag.wedding_credit_send':              { name: 'Invite a peer vendor to claim wedding credit', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_wedding_credit' },
  'flag.wedding_consent_send':             { name: 'Ask the couple to allow the guest gallery', spec: 'to the couple · vendor line · Utility', meta: 'tdw_wedding_consent' },
  'flag.review_ask_send':                  { name: 'Ask the couple for a Google review', spec: 'to the couple · couple line · Marketing', meta: 'tdw_review_request' },
  'flag.wedding_reel':                     { name: 'Make the wedding reel', spec: 'no message · needs ffmpeg on the server · absent today' },
  // ── F-41.144 · THE NINTH FLAG, AND WHAT THE FILING GOT WRONG ────────────────
  // Filed by D3c as "renders its raw key". It does not: `gateName`'s fallback below
  // humanises, so the founder's glass read `assist forward alert` — lowercase, no
  // spec line at all, and (the half nobody filed) NO `ROOM_OF` entry, so `roomOf`
  // dropped it into `Your notices` while it belongs beside the concierge templates.
  // Both lines ship together; the copy entry alone would have been correct words in
  // the wrong room, which is F-41.122's shape a second time.
  //
  // The register has held this key since `0151_assist_forward_alert_flag.sql:19`,
  // seeded `off`. It gates `alertVendorOfForward` (dream-os
  // `src/lib/couple/assistance.js:826`, flag at `:106`), which sends the registry's
  // `lead_alert_utility` on the vendor line. Meta name and ID witnessed at
  // `docs/TEMPLATES.md:516` (dream-os `3fa603a4`): `tdw_lead_alert_utility`,
  // `1753685715867036`, UTILITY, APPROVED — read from the filing, not from memory.
  'flag.assist_forward_alert':             { name: 'Tell a vendor a concierge forward landed', spec: 'to the vendor · vendor line · Utility · records only until you switch it on', meta: 'tdw_lead_alert_utility', metaId: '1753685715867036' },

  // ── Message templates on Meta (template.*) — the words themselves ─────────
  'template.tdw_contract_sign':            { name: 'Contract signing link', spec: 'to the couple · vendor line · Utility', meta: 'tdw_contract_sign' },
  'template.tdw_contract_sign_otp':        { name: 'Contract signing code', spec: 'to the couple · vendor line · Authentication', meta: 'tdw_contract_sign_otp' },
  'template.tdw_contract_copy':            { name: 'Signed contract copy', spec: 'to the vendor and the couple · vendor line · Utility', meta: 'tdw_contract_copy' },
  'template.tdw_payment_reminder':         { name: 'Payment reminder', spec: 'to the client · couple line · Utility', meta: 'tdw_payment_reminder' },
  'template.tdw_referral_alert':           { name: 'Peer referral alert', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_referral_alert' },
  'template.tdw_wedding_credit':           { name: 'Wedding credit invite', spec: 'to the peer vendor · vendor line · Utility', meta: 'tdw_wedding_credit' },
  'template.tdw_wedding_consent':          { name: 'Guest gallery consent ask', spec: 'to the couple · vendor line · Utility', meta: 'tdw_wedding_consent' },
  'template.tdw_review_request':           { name: 'Google review ask', spec: 'to the couple · couple line · Marketing', meta: 'tdw_review_request' },
  // The concierge four — arms dark behind these rows until A10 wakes the send (R-41.20).
  // F-41.122 · THE RELABEL. Retired by 0155 and replaced by the _v2 row below. The KEY
  // does not move: gatePath, gateMatches and any capabilities row keyed on it all
  // still resolve, and a founder who searches the old Meta name still finds this row
  // and reads why it is off. A retired gate deleted from the copy home renders as a
  // raw key, which is how F-41.122 looked this morning.
  'template.tdw_assist_lead_outside':      { name: 'Outsider join alert (retired)', spec: 'replaced by the enquiry notice above', meta: 'tdw_assist_lead_outside', metaId: '1627376372249131' },
  // F-41.122 · THREE ORPHAN TEMPLATES, THREE ROWS. No flag.* guards any of them, so under
  // R-41.102 each keeps a row of its own with a verb rather than folding into a second line.
  // The register has held all four since 0155; without these entries they rendered as raw
  // keys on the founder's glass, which is the finding.
  'template.tdw_assist_lead_outside_v2':   { name: 'Send an outside vendor the enquiry notice', spec: 'to the outside vendor · marketing line · Utility', meta: 'tdw_assist_lead_outside_v2', metaId: '2544506315978894' },
  'template.tdw_assist_found_vendor':      { name: 'Tell the couple we found a TDW vendor', spec: 'to the couple · couple line · Utility', meta: 'tdw_assist_found_vendor', metaId: '3160852754105015' },
  'template.tdw_assist_found_outside':     { name: 'Tell the couple we found an outside vendor', spec: 'to the couple · couple line · Utility', meta: 'tdw_assist_found_outside', metaId: '3115277355330375' },
  'template.tdw_introduction':             { name: 'Introduce a vendor to The Dream Wedding', spec: 'to the vendor · marketing line · Marketing · not sent before R9', meta: 'tdw_introduction' },
  // F-41.69 — THE SPEC SAID `not yet filed at Meta` AND IT IS ACTIVE. A shipped byte
  // on the founder's glass asserting a false fact about Meta is worse than a blank
  // one: he plans around it. Filed and Active, ID 1063533856046167 — the ID rides
  // the evidence disclosure (R-41.103's form), not the spec line.
  'template.tdw_capability_armed':         { name: 'Tell me when a switch is ready', spec: 'to you · vendor line · Utility', meta: 'tdw_capability_armed', metaId: '1063533856046167' },

  // ── Meta app permissions (perm.*) ─────────────────────────────────────────
  'perm.whatsapp_business_pair':           { name: 'Use WhatsApp for every message below', spec: 'Meta app · in review since 2 September' },
  'perm.instagram_business_basic':         { name: "Read a vendor's Instagram account", spec: 'Meta app · the first Instagram door · not filed' },
  'perm.instagram_business_manage_messages': { name: 'Reply to Instagram DMs', spec: 'Meta app · bridges DMs to WhatsApp · not filed' },
  'perm.instagram_business_manage_insights': { name: "Read a vendor's Instagram insights", spec: 'Meta app · feeds the Sunday brief · not filed' },
  'perm.instagram_business_content_publish': { name: "Post to a vendor's Instagram", spec: 'Meta app · posts from the studio · not filed' },
  'perm.instagram_business_manage_comments': { name: 'Reply to Instagram comments', spec: 'Meta app · not filed' },
  'perm.ads_read':                         { name: "Read a vendor's ad results", spec: 'Meta app · needs the second app · not created' },
  'perm.business_management':              { name: "Manage a vendor's ads account", spec: 'Meta app · needs the second app · not created' },

  // ── Google access (scope.*) ───────────────────────────────────────────────
  'scope.google.siteverification':         { name: "Verify a vendor's website", spec: 'house grant · every vendor\'s website · granted' },
  'scope.google.webmasters.readonly':      { name: "Read a vendor's Search Console", spec: 'house grant · every vendor\'s website · granted' },
  'scope.google.business.manage':          { name: "Update a vendor's Google Business Profile", spec: 'reviews and the profile claim · not requested until late October' },
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
/** The Meta template ID, for the evidence disclosure. */
export function gateMetaId(key: string): string | undefined {
  return GATE_COPY[key]?.metaId;
}

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
// ── STATE WORDS · ONE HOME (R-41.99) ──────────────────────────────────────────
// These lived in `app/admin/switchboard/page.tsx` as a local const, which made the
// page both a renderer and a copy home. The four the E1 veto ratified could not be
// added there without deepening that: a word the founder vetoed belongs with the
// other words he vetoed.
//
// F-41.145 · THE SENTENCE THAT USED TO END THIS PARAGRAPH IS RETIRED, and it is not
// requoted here — a cell asserts its absence, and a quotation would defeat the cell.
// It described the page as still holding its own copy of these words, pending a
// later packet. That packet landed: E2 (iv-b) at `256d3eb7` retired the duplicate,
// and `app/admin/switchboard/page.tsx:63` is now an alias onto this map, not a
// second one. The comment outlived its condition and went on announcing a
// duplication that no longer existed — worse than silence, because a seat reading
// it would have gone hunting for a second home to cure. THIS IS THE ONE HOME.
export const STATUS_WORD: Readonly<Record<string, string>> = Object.freeze({
  on: 'On', off: 'Off', armed: 'Ready to switch on', approved: 'Approved',
  pending: 'Waiting', paused: 'Paused by Meta', rejected: 'Rejected',
  // Ratified at the E1 veto, 2026-09-09.
  granted: 'Granted',
  not_filed: 'Not filed',
  not_requested: 'Not requested',
  dark: 'Not sending yet',
});

// ── R-41.82 · THE ROOMS, AND WHICH ROOM A GATE BELONGS TO ────────────────────
// The card is grouped by ROOM — the thing the founder is switching, not the register's
// kind. `Features you switch on / Message templates / Meta app permissions / Google
// access` were the register's four internal categories: true of the data, useless to a
// founder deciding whether payment reminders are sending.
//
// The order is the chair's (R-41.82, amended: `Your notices` last). The standing row is
// not a group — `perm.whatsapp_business_pair` gates every WhatsApp send on the card, so
// filing it inside any one room makes a precondition look local (fork B, ruled).
export const STANDING_KEY = 'perm.whatsapp_business_pair';

export const ROOM_ORDER = [
  'Payment reminders', 'Contracts', 'Concierge', 'Reviews', 'Google',
  'Instagram', 'Ads', 'Introductions', 'Wedding reel', 'Model routes', 'Your notices',
] as const;
export type Room = typeof ROOM_ORDER[number];

// Fork A, ruled: the referral alert and the wedding credit invite are Introductions —
// both go to a peer vendor and both recruit. The guest gallery consent is Wedding reel,
// because consent is what makes a reel publishable.
const ROOM_OF: Readonly<Record<string, Room>> = Object.freeze({
  'flag.payment_reminder_send': 'Payment reminders',
  'template.tdw_payment_reminder': 'Payment reminders',

  'flag.contract_sign_send': 'Contracts',
  'template.tdw_contract_sign': 'Contracts',
  'template.tdw_contract_sign_otp': 'Contracts',
  'flag.contract_copy_send': 'Contracts',
  'template.tdw_contract_copy': 'Contracts',

  // F-41.144's second half: the flag belongs with the templates its lane sends, not
  // in `Your notices` where the room fallback was putting it.
  'flag.assist_forward_alert': 'Concierge',
  'template.tdw_assist_lead_outside': 'Concierge',
  'template.tdw_assist_lead_outside_v2': 'Concierge',
  'template.tdw_assist_found_vendor': 'Concierge',
  'template.tdw_assist_found_outside': 'Concierge',

  'flag.review_ask_send': 'Reviews',
  'template.tdw_review_request': 'Reviews',

  'scope.google.siteverification': 'Google',
  'scope.google.webmasters.readonly': 'Google',
  'scope.google.business.manage': 'Google',

  'perm.instagram_business_basic': 'Instagram',
  'perm.instagram_business_manage_messages': 'Instagram',
  'perm.instagram_business_manage_insights': 'Instagram',
  'perm.instagram_business_content_publish': 'Instagram',
  'perm.instagram_business_manage_comments': 'Instagram',

  'perm.ads_read': 'Ads',
  'perm.business_management': 'Ads',

  'flag.referral_alert_send': 'Introductions',
  'template.tdw_referral_alert': 'Introductions',
  'flag.wedding_credit_send': 'Introductions',
  'template.tdw_wedding_credit': 'Introductions',
  'template.tdw_introduction': 'Introductions',

  'flag.wedding_consent_send': 'Wedding reel',
  'template.tdw_wedding_consent': 'Wedding reel',
  'flag.wedding_reel': 'Wedding reel',

  'template.tdw_capability_armed': 'Your notices',
});

/** The room a gate belongs to. A gate with no room falls to `Your notices` rather than
 *  vanishing: a row the founder cannot see is worse than a row in the wrong place, and
 *  a gate added to the register without an entry here is exactly F-41.122 again. */
export function roomOf(key: string): Room {
  return ROOM_OF[key] ?? 'Your notices';
}

// ── R-41.102 · A TEMPLATE IS ITS FLAG'S SECOND LINE ──────────────────────────
// A `template.*` guarded by a `flag.*` renders as that flag's second line, and a flag
// carries EVERY template its door sends — the contract flag carries both the signing
// link and the signing code. Only an ORPHAN template gets a row. The join is the `meta`
// field already in GATE_COPY; this derives it rather than keeping a second list.
export function templatesUnder(flagKey: string): string[] {
  const meta = GATE_COPY[flagKey]?.meta;
  if (!meta || !flagKey.startsWith('flag.')) return [];
  return Object.keys(GATE_COPY).filter((k) => k === `template.${meta}`
    || (k.startsWith('template.') && GATE_COPY[k]?.meta?.startsWith(meta + '_')));
}

/** Every template that some flag speaks for — these do NOT get rows of their own. */
export const GUARDED_TEMPLATES: readonly string[] = Object.freeze(
  Object.keys(GATE_COPY).filter((k) => k.startsWith('flag.')).flatMap((f) => templatesUnder(f)),
);

export const GATE_KEYS: readonly string[] = Object.freeze(Object.keys(GATE_COPY));
