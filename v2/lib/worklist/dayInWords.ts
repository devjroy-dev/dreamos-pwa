// CE-47 L4 (FE-7): a date in words, full month (F-42.112), for timestamps and for date fields.
// Timestamps are read as the India calendar day first, so nothing moves a day near midnight.
import { fullDate } from '@/lib/worklist/posts';
const IST_MS = 330 * 60 * 1000;
/** "8 September 2026" from an ISO timestamp or a YYYY-MM-DD date; '' when empty or unreadable. */
export function dayInWords(iso: string | null | undefined): string {
  if (!iso) return '';
  const s = String(iso);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return fullDate(s);
  const t = new Date(s).getTime();
  if (Number.isNaN(t)) return '';
  return fullDate(new Date(t + IST_MS).toISOString().slice(0, 10));
}
