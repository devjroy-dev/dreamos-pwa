// Small pure formatters. Locked to "Rs" currency prefix per Rule V7.

import { CURRENCY_PREFIX } from './tokens';

export function formatRs(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  if (!isFinite(n as number)) return `${CURRENCY_PREFIX} 0`;
  return `${CURRENCY_PREFIX} ${Number(n).toLocaleString('en-IN')}`;
}

// "2026-05-12" → "12 May" (short, no year). Returns input on parse failure.
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return '';
  // Parse loosely — accept YYYY-MM-DD or full ISO.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const d = new Date(Date.UTC(year, month, day));
  if (isNaN(d.getTime())) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[month]}`;
}

// "2026-05-12" → "12 May 2026" — used in primer text where year matters.
export function formatLongDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${formatShortDate(iso)} ${m[1]}`;
}

// Today as YYYY-MM-DD in the user's local zone.
export function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
