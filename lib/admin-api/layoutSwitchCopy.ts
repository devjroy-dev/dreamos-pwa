// lib/admin-api/layoutSwitchCopy.ts · DESIGN-1 · THE SWITCHES (the founder and the chair): the Switchboard's layout card,
// its words and its one derivation. The doors are dream-os src/api/admin/capabilities.js (GET /layout, POST
// /layout/master); the one predicate home is dream-os src/lib/vendorLayout.js.
export const LAYOUT_KEYS = ['flag.vendor_layout_v2', 'flag.vendor_layout_v2.first_on'] as const;

export const LAYOUT_WORDS = {
  title: 'Vendor layout',
  sub: 'The new vendor layout, for everyone or for the vendors listed below. Instant, no deploy.',
  master: 'New layout for everyone',
  on: 'On',
  off: 'Off',
  masterOn: 'Every vendor sees the new layout.',
  masterOff: 'Today’s layout for everyone except the vendors listed below.',
  kept: (date: string) => `Classic layout kept until ${date}`,
  keptNote: 'Until then the classic layout stays whole and this can be turned off at any time. Removing it is a separate cut, never automatic.',
  neverOn: 'Not turned on yet. The first time it is, the date is recorded here.',
  list: 'New layout for these vendors',
  listNote: (env: string) => `Set in Railway as ${env}, a comma list of vendor ids. They see the new layout while the switch above is off.`,
  listNone: 'No vendors listed.',
  unread: 'The layout switch could not be read. Reload to try again.',
  flipped: (on: boolean) => (on ? 'New layout for everyone: on.' : 'New layout for everyone: off.'),
} as const;

export type LayoutMaster = { on: boolean; seeded: boolean; first_on_at: string | null; classic_kept_until: string | null };
export type LayoutState = { flag: string; default_on: boolean; env: string; vendor_ids: string[]; master?: LayoutMaster };

/** "12 November 2026", from the door's YYYY-MM-DD (read as a calendar date, never shifted by a time zone). */
export function keptDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/** The door's answer as the panel's state, or null when it is not one (an older door without the master or the list). */
export function asLayoutState(d: unknown): LayoutState | null {
  if (!d || typeof d !== 'object') return null;
  const o = d as Partial<LayoutState>;
  const m = o.master;
  if (!Array.isArray(o.vendor_ids) || typeof o.env !== 'string' || !m || typeof m.on !== 'boolean') return null;
  return {
    flag: String(o.flag || ''), default_on: !!o.default_on, env: o.env, vendor_ids: o.vendor_ids.filter((x) => typeof x === 'string'),
    master: { on: m.on, seeded: !!m.seeded, first_on_at: typeof m.first_on_at === 'string' ? m.first_on_at : null,
      classic_kept_until: typeof m.classic_kept_until === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.classic_kept_until) ? m.classic_kept_until : null },
  };
}
