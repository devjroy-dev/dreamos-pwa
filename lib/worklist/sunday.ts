// lib/worklist/sunday.ts — G4.1 · THE SUNDAY BRIEF'S WORDS, FIXTURE AND PREVIEW FLAG.
// CE-42 seat R6, packet 4b-3a (R-42.14 shell-first). Base dreamos-pwa 34272f28.
//
// ═══ SUNDAY_PREVIEW — ONE FLAG, ONE HOME, ONE BRANCH ═════════════════════════
// While true, the section renders FIXTURE_BRIEF below under the vetoed eyebrow,
// every CTA toasts COPY.launchingSoon, and no door is called. FLIPPED TO FALSE
// at 4b-3b (dream-os c5de470 → the door), in the same edit that wired
// GET /api/v2/vendor/posts/sunday: the page now hands the section the door's
// answer and real actions; b76 pins that this is still the only branch and
// that no fixture literal reaches the live glass. The fixture stays for b76's
// eleven renders — it is never imported by the page.
export const SUNDAY_PREVIEW = false;

/** What the door answers (src/lib/vendor/sundayBrief.js readForDoor): one code, the brief, the card. */
export type SundayDoor = {
  state: Exclude<SundayState, 'arrows' | 'under100' | 'share'>;   // arrows/under100 are payload shapes; share is the tap
  brief: Brief | null;
  share_card_url: string | null;
};

/** The real controls (4b-3b). Absent → the shell's PREVIEW toasts (b76's renders). */
export type SundayActions = {
  connectHref: string | null;       // pre-minted /ig/authorize?scope=insights URL (the portfolio's anchor law)
  onConnectMint: () => void;        // when the anchor has no href yet
  onCheckAgain: () => void;
  onShare: () => void;
  onDownload: () => void;
  shareCardUrl: string | null;
  busy: boolean;
};

// ═══ THE ELEVEN STATES (chair-ruled 2026-09-10) — the frames are the spec ════
// docs/mocks/sunday-brief-mock.html, one frame each. The door at 4b-3b answers
// one of these; at 4b-3a the live glass shows `live` (ruled) and b76 renders
// each of the others from the fixture in a cell.
export type SundayState =
  | 'pending' | 'connect' | 'under100' | 'empty' | 'live' | 'arrows' | 'share'
  | 'error' | 'stale' | 'expired' | 'notconnected';

/** The stored brief's shape (accepted as 4b-3b's stored shape). `prev` null → no arrow. */
export type Metric = { value: number; prev: number | null };
export type Brief = {
  week_start: string;             // 'YYYY-MM-DD', Monday
  week_end: string;               // Sunday
  generated_at: string;
  reach: Metric;
  new_followers: Metric | null;   // null under 100 followers (Meta withholds follows_and_unfollows)
  saves: Metric;
  shares: Metric;
  best_post: { media_id: string; photo_url: string | null; saves: number; shares: number; permalink: string | null } | null;
  best_time: null;                // HELD — online_followers unwitnessed
  follower_count: number | null;
};

/** ILLUSTRATIVE, and the eyebrow says so on the glass. */
export const FIXTURE_BRIEF: Brief = {
  week_start: '2026-09-07', week_end: '2026-09-13', generated_at: '2026-09-13T18:30:00Z',
  reach: { value: 4120, prev: null },
  new_followers: { value: 18, prev: null },
  saves: { value: 64, prev: null },
  shares: { value: 22, prev: null },
  best_post: { media_id: 'sample', photo_url: null, saves: 31, shares: 9, permalink: null },
  best_time: null,
  follower_count: 640,
};

// ═══ EVERY BYTE VETOED (4b-3a read-first + frames veto, 2026-09-10) ══════════
export const SU = {
  eyebrow:       'Preview \u00b7 sample numbers',
  connect:       'Connect Instagram to see your week.',            // S2 and S11
  expired:       'Your Instagram connection has expired. Connect again to see your week.',
  connectCta:    'Connect Instagram',
  under100:      'Instagram shows this after 100 followers.',
  emptyWeek:     'Nothing posted this week.',
  stale:         'Last week\u2019s brief. This week\u2019s is on its way.',
  checkAgain:    'Check again',
  shareThis:     'Share this',
  reach:         'Reach',
  newFollowers:  'New followers',
  saves:         'Saves',
  shares:        'Shares',
  bestTime:      'Best time to post',
  held:          'Coming',                                          // the hub chip's own word
  bestPost:      'Best post',
  shareTitle:    'My week on Instagram',
} as const;

/** "Saves 31 · Shares 9" — the carried shape. */
export const bestPostLine = (saves: number, shares: number) => `${SU.saves} ${saves} \u00b7 ${SU.shares} ${shares}`;

/** "7–13 September" · "31 August – 6 September" — full month (R-42.13). */
export function weekLine(startIso: string, endIso: string): string {
  const s = new Date(`${startIso.slice(0, 10)}T00:00:00Z`), e = new Date(`${endIso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return `${startIso} \u2013 ${endIso}`;
  const month = (d: Date) => d.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' });
  if (s.getUTCMonth() === e.getUTCMonth()) return `${s.getUTCDate()}\u2013${e.getUTCDate()} ${month(e)}`;
  return `${s.getUTCDate()} ${month(s)} \u2013 ${e.getUTCDate()} ${month(e)}`;
}

/** "↑ 12%" · "↓ 4%" · "—" (prev 0 or equal) · null (prev null → no arrow). */
export function arrow(m: Metric): { text: string; dir: 'up' | 'down' | 'flat' } | null {
  if (m.prev == null) return null;
  if (m.prev === 0 || m.value === m.prev) return { text: '\u2014', dir: 'flat' };
  const pct = Math.round(Math.abs((m.value - m.prev) / m.prev) * 100);
  return m.value > m.prev ? { text: `\u2191 ${pct}%`, dir: 'up' } : { text: `\u2193 ${pct}%`, dir: 'down' };
}

/** Numbers through en-IN grouping; never money. */
export const count = (n: number) => n.toLocaleString('en-IN');
