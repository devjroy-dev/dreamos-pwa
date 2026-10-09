// lib/vendor/callOutside.ts · CE-47 · HUB-2c · PEOPLE FROM OUTSIDE TDW WHO ANSWERED HER CALL · THE DOOR AND ITS WORDS.
// Pure: no fetch, no window, so the bench drives it. One home for both trees (as metaRoomDoor.ts is).
//
// GET /api/v2/vendor/collab/<call>/responses (HUB-2b, dream-os) answers, beside the unchanged `responses`:
//   outside       newest first, each row one of two shapes:
//     Instagram or Threads   { id, source: 'instagram' | 'threads', name, platform_word, how, when }
//     a partner's suggestion { id, source: 'partner', name, role, role_word, link,
//                              partner: { name, kind_words, cities, instagram_url, website_url }, fee_line,
//                              check_words (only when 'partners.check_label' is on) }   (PTN's partnerRowsFor ROW_KEYS)
//   outside_note  one plain sentence when her rows or the partners could not be read; shown word for word.
// The server never sends a phone, an email or a handle for these rows.
//
// THE RULINGS (the chair, 9 Oct 2026): Instagram and Threads rows carry NO mark (the chip says where they came from);
// a partner's row, its mark and the mark's tap card are drawn by PTN's PartnerInterestRow.tsx, words in PTN's one home.
// Until that file lands, partner rows are read and kept here but not drawn (the slot in the screen).

/** The founder's words (9 Oct 2026, via the chair), R-47.1. */
export const REPLIES_WORDS = {
  /** The page's heading (was "Interested vendors"). A label. */
  heading: 'Interested',
  /** Nobody has answered: no TDW reply and no row from outside (was "No responses yet."). */
  none: 'No one has answered this call yet.',
  /** The section's label above the rows from outside TDW. */
  outside: 'From outside TDW',
  /** Where she answers them: the server sends no handle, so the row says where. */
  replyThere: {
    instagram: 'They answered your call on Instagram. Reply to them there.',
    threads: 'They answered your call on Threads. Reply to them there.',
  },
  /** The chip on each row. Labels. */
  chip: { instagram: 'From Instagram', threads: 'From Threads' },
} as const;

export type SocialSource = 'instagram' | 'threads';
export type SocialRow = { id: string; source: SocialSource; name: string; when: string | null };
export type PartnerRow = {
  id: string; source: 'partner'; name: string; role: string | null; role_word: string | null; link: string | null;
  partner: { name: string; kind_words: string; cities: string[]; instagram_url: string | null; website_url: string | null };
  fee_line: string | null; check_words?: string | null;
};
export type OutsideRow = SocialRow | PartnerRow;
export type Outside = { rows: OutsideRow[]; note: string | null };

const MAX_TEXT = 80;
function isObj(v: unknown): v is Record<string, unknown> { return typeof v === 'object' && v !== null && !Array.isArray(v); }
const text = (v: unknown, max = MAX_TEXT): string | null => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
/** A link is kept only on https; anything else is no link. */
export function asHttps(v: unknown): string | null {
  if (typeof v !== 'string' || v.length > 2048) return null;
  try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password ? u.toString() : null; } catch { return null; }
}
/** A time the server sent, or null. */
function asWhen(v: unknown): string | null { return typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : null; }
/** Nothing phone-shaped (ten digits or more) or email-shaped is ever drawn, whatever the server sent. */
function clean(v: string | null): string | null {
  if (!v) return null;
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(v)) return null;
  if ((v.replace(/[^\d]/g, '').length) >= 10 && /\d[\d\s().-]{8,}\d/.test(v)) return null;
  return v;
}

function asSocial(r: Record<string, unknown>): SocialRow | null {
  const source = r.source === 'instagram' || r.source === 'threads' ? r.source : null;
  const id = text(r.id, 64); const name = clean(text(r.name));
  if (!source || !id || !name) return null;
  return { id, source, name, when: asWhen(r.when) };
}
function asPartner(r: Record<string, unknown>): PartnerRow | null {
  const id = text(r.id, 64); const name = clean(text(r.name)); const p = r.partner;
  if (!id || !name || !isObj(p)) return null;
  const pname = clean(text(p.name)); if (!pname) return null;
  return {
    id, source: 'partner', name, role: text(r.role, 40), role_word: text(r.role_word, 40), link: asHttps(r.link),
    partner: {
      name: pname, kind_words: text(p.kind_words, 40) || 'Partner',
      cities: Array.isArray(p.cities) ? p.cities.map((c) => text(c, 40)).filter((c): c is string => !!c).slice(0, 10) : [],
      instagram_url: asHttps(p.instagram_url), website_url: asHttps(p.website_url),
    },
    fee_line: text(r.fee_line, 200),
    ...(typeof r.check_words === 'string' && r.check_words.trim() ? { check_words: r.check_words.trim().slice(0, 40) } : {}),
  };
}

/** The `outside` half of the replies door. A body without it (a server before HUB-2b) is an empty list, never a throw;
 *  a row of any other shape is dropped. */
export function asOutside(body: unknown): Outside {
  if (!isObj(body) || body.ok !== true) return { rows: [], note: null };
  const raw = Array.isArray(body.outside) ? body.outside : [];
  const rows: OutsideRow[] = [];
  for (const r of raw) {
    if (!isObj(r)) continue;
    const row = r.source === 'partner' ? asPartner(r) : asSocial(r);
    if (row) rows.push(row);
  }
  const note = typeof body.outside_note === 'string' && body.outside_note.trim() ? body.outside_note.trim().slice(0, 300) : null;
  return { rows, note };
}

export const isSocial = (r: OutsideRow): r is SocialRow => r.source !== 'partner';
export const isPartner = (r: OutsideRow): r is PartnerRow => r.source === 'partner';

/** A date as a short label ("9 Oct"), or null. India's calendar, the app's locale. */
export function shortDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
}
