// lib/worklist/posts.ts — R6 · THE "POSTS & ADS" ROOM'S WORDS AND WIRE SHAPE.
// CE-42 seat R6, packet 4b-1. Base dreamos-pwa a96e2e23a73081070a9d2155e247a847938713f0.
//
// ═══ EVERY BYTE BELOW IS THE CHAIR'S, VETOED 2026-09-10, AND THIS IS ITS ONE HOME
// The screen reads this file and holds no string of its own. Transcribed from the
// 4b veto sheet and the frame veto (docs/mocks/posts-ads-mock.html):
//   · section heads            Cards · Broadcast · Sunday          (frames veto)
//   · ledes                    the three sentences under each head (4b sheet)
//   · kinds                    Post · Status · Story               (4b sheet)
//   · controls                 Caption · Download · Share · Copy caption
//   · dark (vendor-facing)     "Not switched on yet."  — F-42.193: cap.reason()'s
//                              raw key never reaches vendor glass
//   · Sunday pending           "This opens once Instagram approves our access."
// The room's TITLE is not here: it is `ROOM_ROWS`' own label for `posts`
// ("Posts & ads", R-40.1), read by key on the page so the hub row and the room
// can never disagree.
//
// ═══ WHAT IS NOT HERE, AND WHY ═══════════════════════════════════════════════
// The cards' refusals ("Publish a wedding page with photos…", "Publish the page
// and get the couple's consent first.", "This page has no address yet.") and the
// caption are the DOOR'S, built by src/lib/vendor/postCards.js and forwarded on
// `body.error` / `body.caption`. Spelling them here would be a second home for a
// vetoed byte in the other repo (F-41.123's disease). The screen renders what
// arrives.
//
// ═══ 4b-1'S SCOPE FOR THE OTHER TWO SECTIONS ═════════════════════════════════
// Broadcast and Sunday render their pending state ONLY (the chair's build line).
// Neither has a door at 4b-1, so the sentences are TRUE by construction: no
// broadcast arm exists to be on, and no insights reader exists to be granted.
// 4b-2 and 4b-3 replace these static states with their doors' answers.

export const PO = {
  sectionCards:     'Cards',
  sectionBroadcast: 'Broadcast',
  sectionSunday:    'Sunday',

  ledeCards:     'Cards made from your last wedding page.',
  ledeBroadcast: 'Send one message to your past couples.',
  ledeSunday:    'Every Sunday: your week on Instagram.',

  caption:     'Caption',
  download:    'Download',
  share:       'Share',
  copyCaption: 'Copy caption',

  notOnYet:       'Not switched on yet.',
  sundayPending:  'This opens once Instagram approves our access.',

  // ── 4b-2 · BROADCAST (4b veto sheet + frame veto, 2026-09-10) ─────────────
  referralLabel:  'Referral message',
  noCouples:      'No past couples with a number yet.',
} as const;

/** "6 couples" — the vetoed `{n} couples`. */
export const couplesCount = (n: number) => `${n} couples`;
/** "Meta charges up to Rs 6.12 for this send." — the figure is formatRs's, never a literal. */
export const feeLine = (rs: string) => `Meta charges up to ${rs} for this send.`;
/** "Send to 6" — the button and the confirm's action, one byte. */
export const sendTo = (n: number) => `Send to ${n}`;
/** "Send to 6 couples? Meta charges up to Rs 6.12." — the confirm sheet. */
export const confirmLine = (n: number, rs: string) => `Send to ${n} couples? Meta charges up to ${rs}.`;
/** "Sent to 6. 1 not delivered." — the sent line, verbatim as vetoed. */
export const sentLine = (n: number, m: number) => `Sent to ${n}. ${m} not delivered.`;
/**
 * "Your referral message goes once a year. Next: 1 January 2027." — FULL month
 * (F-42.112's rule, estate-wide). The next date is the next IST calendar year's
 * first day: 0164's unique index keys the IST year, so that is when the database
 * next accepts one.
 */
export const referralNextLine = (iso: string) => `Your referral message goes once a year. Next: ${fullDate(iso)}.`;
export function fullDate(iso: string): string {
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** `GET /api/v2/vendor/posts/broadcast` — re-derived from src/lib/vendor/broadcasts.js `preview`. */
export type BroadcastPreview = {
  ok?: boolean;
  error?: string;
  code?: string;
  count?: number;
  couples?: { name: string | null; last4: string; source: string }[];
  stopped_count?: number;
  fee_paise?: number | null;
  bodies?: { couple: string; referral: string };
  button_label?: string;
  page_url?: string | null;
  on?: { couple: boolean; referral: boolean };
  referral_next?: string | null;
};
/** `POST /api/v2/vendor/posts/broadcast` — ok, or a refusal CODE (never cap.reason()). */
export type BroadcastSent = {
  ok?: boolean; error?: string; code?: string;
  broadcast_id?: string; sent?: number; not_delivered?: number; refused_stopped?: number;
};
export type BroadcastKind = 'couple' | 'referral';

/** The three kinds, in the door's own KIND_ORDER (src/lib/vendor/postCards.js). */
export const KINDS = [
  { key: 'post',   label: 'Post' },
  { key: 'status', label: 'Status' },
  { key: 'story',  label: 'Story' },
] as const;
export type CardKind = (typeof KINDS)[number]['key'];

/**
 * `GET /api/v2/vendor/posts/cards` — re-derived from src/api/vendor/posts.js at
 * the 4b-1 cut: `okRes(res, { page, caption, cards })`, the estate envelope with
 * the payload spread at the top level; a refusal is `{ ok:false, error, code }`.
 */
export type CardsBody = {
  ok?: boolean;
  error?: string;
  code?: string;
  page?: { id: string; slug: string; title: string };
  caption?: string;
  cards?: Record<CardKind, string>;
};

/** The file name a Download saves under: the page slug and the kind. */
export function cardFileName(slug: string | undefined, kind: CardKind): string {
  const base = String(slug || 'card').replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '') || 'card';
  return `${base}-${kind}.jpg`;
}
