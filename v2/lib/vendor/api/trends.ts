// v2/lib/vendor/api/trends.ts · CE-47 · PRO · P3 app · the Trend room: her doors (dream-os src/api/vendor/trends.js).
// Counts from enquiries across TDW, approved by TDW before she sees them. No client or vendor is named.
import { getJson } from '@/lib/vendor/api/_base';

export type ApiErr = { ok: false; error: string };
export type Brief = { id: string; week_start: string; head: string; lines: string[]; note: string; news: { line: string; source_url: string }[] };
export type TrendsRoom = { brief: Brief | null; past: { id: string; week_start: string; title: string }[]; made_line: string; empty: string | null };

export const fetchTrends = (vendorId: string): Promise<{ ok: true; room: TrendsRoom } | ApiErr> => getJson(`/api/v2/vendor/trends/${vendorId}`);
export const fetchWeek = (vendorId: string, briefId: string): Promise<{ ok: true; brief: Brief } | ApiErr> => getJson(`/api/v2/vendor/trends/${vendorId}/weeks/${briefId}`);
