// v2/lib/vendor/api/brands.ts · CE-47 · PRO · P3 app · Brand collaborations: her doors (dream-os src/api/vendor/brands.js).
// TDW never sends a pitch: she sends it herself, then tells TDW she sent it, and TDW counts it.
import { getJson, postJson } from '@/lib/vendor/api/_base';

export type ApiErr = { ok: false; error: string };
export type Channel = 'instagram' | 'email' | 'form';
export type PitchState = 'pitched' | 'replied' | 'agreed' | 'kit_received' | 'posted' | 'declined' | 'no_reply';
export type Tone = 'ok' | 'warn' | 'bad' | 'soon' | 'plain';
export type BrandRow = { id: string; name: string; looks_for: string | null; works_with: string | null; reach: string; channels: Channel[];
  instagram_handle: string; instagram_url: string; website_url: string; source_url: string; checked_line: string };
export type Pitch = { id: string; brand_id: string; brand: string; channel: Channel; state: PitchState; post_due: string | null;
  pill: { text: string; tone: string }; line: string; next: { to: PitchState; label: string }[]; asci: string | null; pitched_at: string };
export type Counts = { day: number; week: number; day_left: number; week_left: number; line: string; limits: string };
export type Kit = { url: string | null; contact_email: string | null; followers: number | null; followers_on: string | null; weddings: number | null };
export type BrandsRoom = { kit: Kit; counts: Counts; trade: string; trade_word: string; brands: BrandRow[]; pitches: Pitch[] };
export type BrandPage = BrandRow & { pitch: string; blocked: string | null; send: { channel: Channel; link: string | null; step: string }[]; sent_ask: string; last_pitch: Pitch | null; counts: Counts };

export const fetchBrands = (vendorId: string): Promise<{ ok: true; room: BrandsRoom } | ApiErr> => getJson(`/api/v2/vendor/brands/${vendorId}`);
export const fetchBrand = (vendorId: string, brandId: string): Promise<{ ok: true; brand: BrandPage } | ApiErr> => getJson(`/api/v2/vendor/brands/${vendorId}/brands/${brandId}`);
export const sentPitch = (vendorId: string, brandId: string, channel: Channel): Promise<{ ok: true; counts: Counts } | ApiErr> =>
  postJson(`/api/v2/vendor/brands/${vendorId}/brands/${brandId}/sent`, { channel });
export const movePitch = (vendorId: string, pitchId: string, body: { to?: PitchState; post_due?: string }): Promise<{ ok: true; pitch: Pitch } | ApiErr> =>
  postJson(`/api/v2/vendor/brands/${vendorId}/pitches/${pitchId}`, body);
export const saveKit = (vendorId: string, contact_email: string): Promise<{ ok: true; kit: { contact_email: string | null } } | ApiErr> =>
  postJson(`/api/v2/vendor/brands/${vendorId}/kit`, { contact_email });
/** A pill tone the room's rows understand. */
export const toneOf = (t: string): Tone => (t === 'warn' ? 'warn' : t === 'done' || t === 'ok' ? 'ok' : 'plain');
