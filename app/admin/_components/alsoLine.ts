// ADM-1 · THE "ALSO A DREAMER / ALSO A VENDOR" LINE (CE-47 ruling, 1 Oct 2026).
// Both deletes remove the whole users row, so one account holding both profiles loses both.
// user_id wins whenever both lists carry it (certain line). Otherwise the phone, through the
// estate's one normaliser (phoneKey, v2/lib/vendor/cabinet.ts), gives a HEDGED line, because
// users.phone is indexed, not unique. No key, no line: absence never claims "no other profile".
import { phoneKey } from '@/v2/lib/vendor/cabinet';

export interface PersonKey { user_id?: string | null; phone?: string | null }
export type AlsoMatch = { how: 'user_id' } | { how: 'phone' } | null;

export function alsoMatch(target: PersonKey, others: PersonKey[]): AlsoMatch {
  const bothCarry = typeof target.user_id === 'string' && target.user_id.length > 0
    && others.length > 0 && others.every(o => typeof o.user_id === 'string' && o.user_id.length > 0);
  if (bothCarry) return others.some(o => o.user_id === target.user_id) ? { how: 'user_id' } : null;
  const k = phoneKey(target.phone ?? null);
  if (!k) return null;
  return others.some(o => phoneKey(o.phone ?? null) === k) ? { how: 'phone' } : null;
}

/** The card's words. `other` is what the OTHER profile is called: 'Dreamer' or 'vendor'. */
export function alsoLine(m: AlsoMatch, other: 'Dreamer' | 'vendor'): string | null {
  if (!m) return null;
  if (m.how === 'user_id') return `This account is also a ${other}. Their ${other} profile is deleted too.`;
  return `A ${other} has the same phone number. If it is the same account, their ${other} profile is deleted too.`;
}
