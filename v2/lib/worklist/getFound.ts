// lib/worklist/getFound.ts · DESIGN-1 · STAGE 3 · THE GET FOUND CARD (the founder and the chair).
//
// One quiet card on Home for ONE "Get found" room she has not set up yet, in this order: her website, Google reviews,
// posts and ads. Hide puts that one away on this phone; the next one waits for her next visit. Each "not set up" is read
// from what its own room reads, never guessed: a read that fails, or a room she has set up, shows nothing.
//   website        her page's own lines (seo_title, seo_description on GET /me) are both unwritten
//   google         she has not asked a single couple for a review (askedCount on the Google reviews door)
//   posts          Instagram is not connected (GET /ig/status), which the posts' insights and the cards need
import { WEBSITE_HREF, GOOGLE_REVIEWS_HREF, POSTS_HREF } from '@/v2/lib/solutions/routes';

export type GetFoundKey = 'website' | 'google' | 'posts';
export const GET_FOUND_ORDER: readonly GetFoundKey[] = ['website', 'google', 'posts'];
export const GET_FOUND_HIDDEN_KEY = 'tdw_getfound_hidden';

export const GET_FOUND: Record<GetFoundKey, { line: string; act: string; href: string }> = {
  website: { line: 'Your website is not set up yet.', act: 'Set up your website', href: WEBSITE_HREF },
  google:  { line: 'You have not asked a client for a Google review yet.', act: 'Ask for reviews', href: GOOGLE_REVIEWS_HREF },
  posts:   { line: 'Posts and ads are not set up yet.', act: 'Set up posts and ads', href: POSTS_HREF },
};
export const GET_FOUND_WORDS = { eyebrow: 'Get found', hide: 'Hide' } as const;

/** true: not set up · false: set up · null: unknown (a failed read), which never shows a card */
export type SetUp = Record<GetFoundKey, boolean | null>;

export function notSetUp(me: unknown, reviews: unknown, ig: unknown): SetUp {
  const v = me && typeof me === 'object' && (me as { ok?: boolean }).ok ? (me as { vendor?: { seo_title?: unknown; seo_description?: unknown } }).vendor : null;
  const g = reviews && typeof reviews === 'object' && (reviews as { ok?: boolean }).ok ? (reviews as { googleReviews?: { askedCount?: unknown } }).googleReviews : null;
  const i = ig && typeof ig === 'object' && (ig as { ok?: boolean }).ok ? (ig as { connected?: unknown }) : null;
  const blank = (x: unknown) => x == null || String(x).trim() === '';
  return {
    website: v ? blank(v.seo_title) && blank(v.seo_description) : null,
    google: g && typeof g.askedCount === 'number' ? g.askedCount === 0 : null,
    posts: i && typeof i.connected === 'boolean' ? !i.connected : null,
  };
}

/** The one card to show: the first in order she has not set up and has not hidden; or none. */
export function pickCard(state: SetUp, hidden: readonly string[]): GetFoundKey | null {
  return GET_FOUND_ORDER.find((k) => state[k] === true && !hidden.includes(k)) ?? null;
}

export function readHidden(): string[] {
  try { const v = JSON.parse(localStorage.getItem(GET_FOUND_HIDDEN_KEY) || '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []; } catch { return []; }
}
export function hide(k: GetFoundKey): void {
  try { localStorage.setItem(GET_FOUND_HIDDEN_KEY, JSON.stringify([...new Set([...readHidden(), k])])); } catch { /* this phone only */ }
}
