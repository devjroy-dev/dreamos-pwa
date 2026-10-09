// lib/admin-api/pictures.ts · TDW · CE-47 · WEB-4 admin package (cut 30's app half) · R-47.2, the founder's rule of
// 8 October 2026: a vendor's pictures belong to her.
// THE ONE HOME in the app for the admin's pictures: the doors (dream-os src/api/admin/photos.js and
// src/api/admin/vendorPortfolio.js, WEB-4 cut 30), the state of a picture as the admin reads it, and the admin's words.
//   · There is no approval any more. A picture is on her own pages at once unless Google's safety check HELD it.
//   · Discover shows a picture only when the check passed it and nobody hid it from Discover.
//   · The admin's one power is "Hide from Discover", with its one-tap undo. The one act on a held picture is Release.
//   · A Dreamer's report hides nothing by itself: the admin closes it, with "Hide from Discover" or "No change".
//   · There is no remove button. A removal for a legal reason asks for the reason, is logged first by the server, and
//     the vendor is told on her portfolio in the founder's words (the server writes that line, not the app).
// Every refusal sentence is the server's (R-47.1): the app shows AdminApiError's message and types none of them.
import { adminGet, adminPost } from './_base';

export type PictureKind = 'portfolio' | 'look';
export type Likelihood = 'UNKNOWN' | 'VERY_UNLIKELY' | 'UNLIKELY' | 'POSSIBLE' | 'LIKELY' | 'VERY_LIKELY';
export type SafetyScores = { adult?: Likelihood; violence?: Likelihood; racy?: Likelihood; spoof?: Likelihood; medical?: Likelihood } | null;
export type PictureVendor = { id: string; business_name: string; category: string | null; routing_handle: string | null } | null;

export type HeldPicture = {
  id: string; vendor_id: string; image_url: string; caption: string | null; kind: PictureKind;
  safety_state: string; safety_scores: SafetyScores; safety_checked_at: string | null; created_at: string;
  look_id?: string; discover_hidden_at?: string | null; vendor: PictureVendor;
};
export type PictureReport = {
  id: string; picture_id: string; vendor_id: string; reason: string; reason_line: string | null; note: string | null; created_at: string;
  picture: { id: string; image_url: string; safety_state: string; discover_hidden_at: string | null } | null; vendor: PictureVendor;
};
export type PictureQueue = { held: HeldPicture[]; reports: PictureReport[]; total_held: number; total_reports: number };
export type VendorPicture = {
  id: string; image_url: string; caption: string | null; aesthetic_tags: string[] | null; is_hero: boolean; in_carousel: boolean;
  safety_state: string; discover_hidden_at: string | null; created_at: string; position: number | null;
  held: boolean; hidden_from_discover: boolean;
};
export type ReportOutcome = 'hidden_from_discover' | 'no_change';

// ── the doors ────────────────────────────────────────────────────────────────────────────────────────────────────
const Q = '/api/v2/admin/photos';
const asList = <T,>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);

/** "Pictures to look at": the held pictures (portfolio and look) and the open reports, oldest first. */
export async function getPhotoQueue(): Promise<PictureQueue> {
  const d = await adminGet<Partial<PictureQueue>>(`${Q}/queue`);
  const held = asList<HeldPicture>(d && d.held); const reports = asList<PictureReport>(d && d.reports);
  return { held, reports, total_held: held.length, total_reports: reports.length };
}
export const hideFromDiscover = (id: string) => adminPost(`${Q}/${id}/discover-hide`, {});
export const showOnDiscover   = (id: string) => adminPost(`${Q}/${id}/discover-show`, {});
export const releasePicture   = (id: string, kind: PictureKind) => adminPost(`${Q}/${id}/release`, kind === 'look' ? { kind } : {});
export const closeReport      = (id: string, outcome: ReportOutcome) => adminPost(`${Q}/reports/${id}/handled`, { outcome });
export const legalRemoval     = (id: string, reason: string, kind: PictureKind) =>
  adminPost(`${Q}/${id}/legal-removal`, kind === 'look' ? { reason: reason.trim(), kind } : { reason: reason.trim() });

/** One vendor's portfolio as the admin reads it (with held and hidden from Discover). */
export async function getVendorPictures(vendorId: string): Promise<VendorPicture[]> {
  const d = await adminGet<{ photos?: unknown }>(`/api/v2/admin/vendors/${vendorId}/portfolio`);
  return asList<VendorPicture>(d && d.photos);
}

// ── the state, as the admin reads it ─────────────────────────────────────────────────────────────────────────────
export type PictureState = 'held' | 'hidden' | 'unchecked' | 'shown';
export function pictureState(p: { safety_state?: string | null; discover_hidden_at?: string | null }): PictureState {
  if (p.safety_state === 'held') return 'held';
  if (p.discover_hidden_at) return 'hidden';
  if (p.safety_state === 'passed') return 'shown';
  return 'unchecked';
}
export const STATE_LINE: Record<PictureState, string> = {
  held: 'Held by the safety check. Not on her pages or on Discover.',
  hidden: 'On her pages. Hidden from Discover.',
  unchecked: 'On her pages. Not checked yet, so not on Discover.',
  shown: 'On her pages and on Discover.',
};
export const STATE_BADGE: Record<PictureState, string> = { held: 'Held', hidden: 'Not on Discover', unchecked: 'Not checked yet', shown: 'On Discover' };

/** Google's answer, in words, for the admin (the five likelihoods, strongest first; nothing when it was not checked). */
const LEVEL_WORD: Record<string, string> = { VERY_LIKELY: 'very likely', LIKELY: 'likely', POSSIBLE: 'possible', UNLIKELY: 'unlikely', VERY_UNLIKELY: 'very unlikely' };
const LEVEL_RANK: Record<string, number> = { VERY_LIKELY: 5, LIKELY: 4, POSSIBLE: 3, UNLIKELY: 2, VERY_UNLIKELY: 1 };
const KIND_WORD: Record<string, string> = { adult: 'Adult', violence: 'Violence', racy: 'Racy', spoof: 'Spoof', medical: 'Medical' };
export function scoresLine(s: SafetyScores): string | null {
  if (!s || typeof s !== 'object') return null;
  const parts = Object.keys(KIND_WORD)
    .map((k) => [k, String((s as Record<string, unknown>)[k] || '')] as const)
    .filter(([, v]) => LEVEL_WORD[v])
    .sort((a, b) => (LEVEL_RANK[b[1]] - LEVEL_RANK[a[1]]));
  return parts.length ? 'Google: ' + parts.map(([k, v]) => `${KIND_WORD[k]} ${LEVEL_WORD[v]}`).join(', ') + '.' : null;
}

// ── a removal for a legal reason ─────────────────────────────────────────────────────────────────────────────────
export const LEGAL_MIN = 3; export const LEGAL_MAX = 300;
export const legalReasonOk = (s: string) => { const t = String(s || '').trim(); return t.length >= LEGAL_MIN && t.length <= LEGAL_MAX; };

// ── the admin's words (R-45.30: plain and literal). The vendor's and the Dreamer's lines are the server's. ─────────
export const WORDS = {
  title: 'Pictures to look at',
  sub: 'Pictures the safety check held, and pictures Dreamers reported',
  navSub: 'Held pictures and reports from Dreamers',
  heldHeading: 'Held by the safety check',
  heldNote: 'A held picture is not on her pages or on Discover. Release it if it is fine.',
  reportsHeading: 'Reported by Dreamers',
  reportsNote: 'A report hides nothing by itself. Hide the picture from Discover, or choose No change.',
  release: 'Release',
  hide: 'Hide from Discover',
  show: 'Show on Discover',
  noChange: 'No change',
  empty: 'Nothing to look at.',
  portfolio: 'Portfolio picture',
  look: 'Look picture',
  unknownVendor: 'Vendor not found',
  released: 'Released. It is on her pages now.',
  hidden: 'Hidden from Discover. It stays on her pages.',
  shownAgain: 'Shown on Discover again.',
  closed: 'Report closed.',
  removed: 'Removed. She is told on her portfolio.',
  tryAgain: 'That did not work. Please try again.',
  retry: 'Try again',
  openHers: 'Open her pictures',
  pickVendor: 'Choose a vendor',
  noPictures: 'She has no pictures yet.',
  legalLabel: 'Remove for a legal reason',
  legalLost: 'Deletes the picture everywhere. The reason is logged, and she sees it on her portfolio.',
  legalField: 'The legal reason (she will see it)',
  legalHint: `${LEGAL_MIN} to ${LEGAL_MAX} letters.`,
  legalConfirm: 'Yes, remove',
  vendorTitle: 'A vendor’s pictures',
  vendorSub: 'Pictures you add here are on her pages and on Discover at once.',
  vendorNav: 'A vendor’s pictures',
} as const;
