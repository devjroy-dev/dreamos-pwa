// lib/worklist/adsWire.ts · CE-46 · ADS-1 · cut 1 · THE ADS PAGE'S WIRE SHAPES AND PURE FORMATTERS.
// Shapes mirror dream-os src/api/vendor/ads.js and src/lib/ads/targeting.js at 0ac1a01 plus the ADS-1 cut. Nothing
// here holds a vendor-facing word; the words are lib/worklist/ads.ts's.
import { formatRs } from '@/lib/vendor/format';
import { ADS, fill } from '@/lib/worklist/ads';

export type Place = { type: 'city' | 'region' | 'country' | 'zip'; key: string; name: string; radius_km?: number };
export type Pick = { id: string; name: string };
export type Settings = {
  places: Place[]; exclude: Place[]; age_min: number; age_max: number; genders: number[]; locales: number[];
  interests: Pick[]; life_events: Pick[]; advantage_audience: boolean;
  placements: 'auto' | { instagram: string[]; facebook: string[] };
  budget: { kind: 'daily' | 'lifetime'; minor: number | null }; start: string; end: string;
  bid: { strategy: string; amount_minor?: number | null }; media_id: string | null;
  welcome: { text: string; icebreakers: string[] };
  post?: { url: string | null; caption_line: string | null } | null;   // stored by /run (gap 1); not part of the echo
};
export type Gap = { gap: null | 'scopes' | 'page' | 'link' | 'ad_account' | 'expired' | 'not_connected' | 'meta_unavailable';
  page?: { id: string; name: string }; ig?: { id: string; username: string | null }; account?: { id: string; name: string };
  inactive?: boolean; missing?: string[] };
export type Door = { ok: boolean; open?: boolean; configured?: boolean; connected?: boolean; gaps?: Gap };
export type Media = { id: string; caption: string; type: string | null; url: string | null; at: string | null; likes: number; comments: number;
  eligible: boolean; width?: number; height?: number; insights?: { saves: number; reach: number } | null; basis?: 'saves' | 'likes' };
export type Facts = { currency: string | null; minDailyMinor: number | null };
export type Start = { ok: boolean; facts?: Facts; settings?: Settings; suggestion?: Media | null; gaps?: Gap };
export type Prepared = { ok: boolean; errors?: string[]; facts?: Facts; settings?: Settings; days?: number; total_minor?: number; currency?: string; confirm?: string; gaps?: Gap };
export type AdRow = { id: string; status: string; settings: Settings; total_minor: number | null; started_at: string | null; ends_at: string | null;
  ended_at: string | null; last_insights: Day[] | null; created_at: string };
export type Day = { day: string; reach: number; spend: number; conversations: number };

/** Minor units (paise) to the room's money: "Rs 1,000". */
export const rs = (minor: number | null | undefined) => formatRs(minor ? minor / 100 : 0);
export const rsBare = (minor: number | null | undefined) => rs(minor).replace(/^Rs\s*/, '');

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = (iso: string | null | undefined) => { if (!iso) return ''; const d = new Date(iso); return `${d.getDate()} ${MON[d.getMonth()]}`; };
export const days = (s: Settings) => Math.max(1, Math.round((Date.parse(s.end) - Date.parse(s.start)) / 86400000));
export const totalMinor = (s: Settings) => (s.budget.kind === 'lifetime' ? s.budget.minor || 0 : (s.budget.minor || 0) * days(s));

/** The one-line summaries the draft's four rows show; every word from lib/worklist/ads.ts. */
export function whoLine(s: Settings): string {
  const p = s.places[0]; const F = ADS.fmt;
  const name = p ? p.name.split(',')[0] : '';
  let place = p && p.radius_km ? fill(F.placeKm, { name, km: p.radius_km }) : name;
  if (s.places.length > 1) place += ` ${fill(F.more, { n: s.places.length - 1 })}`;
  return fill(F.who, { place, min: s.age_min, max: s.age_max });
}
export function whereLine(s: Settings): string {
  if (s.placements === 'auto') return ADS.fmt.whereAuto;
  const out: string[] = [];
  if (s.placements.instagram.length) out.push(ADS.fmt.platforms.instagram);
  if (s.placements.facebook.length) out.push(ADS.fmt.platforms.facebook);
  return out.join(', ');
}
export const placesLine = (s: Settings) => s.places.map((p) => (p.radius_km ? fill(ADS.fmt.placeAround, { name: p.name.split(',')[0], km: p.radius_km }) : p.name.split(',')[0])).join(', ');
export const amountLine = (s: Settings) => (s.budget.kind === 'daily'
  ? fill(ADS.fmt.amountDaily, { daily: rs(s.budget.minor), total: rs(totalMinor(s)) }) : fill(ADS.fmt.amountTotal, { total: rs(s.budget.minor) }));
export const datesLine = (s: Settings) => fill(ADS.fmt.dates, { from: shortDate(s.start), to: shortDate(s.end) });

/** The media's own aspect (Meta's width and height when given, else the loaded image's). R-46.13's crop ruling. */
export const aspectOf = (m: Media | null | undefined, img?: HTMLImageElement | null) =>
  m && m.width && m.height ? m.width / m.height : img && img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;

/** Meta's own screens for the three gaps (R-46.11), opened as the platform's in-app sheet. Checked on the walk. */
export const META_SCREENS = {
  page: 'https://www.facebook.com/pages/create',
  link: 'https://www.facebook.com/settings/?tab=linked_instagram',
  account: 'https://business.facebook.com/settings/ad-accounts',
} as const;
