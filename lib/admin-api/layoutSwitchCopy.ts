// lib/admin-api/layoutSwitchCopy.ts · DESIGN-1 · THE SWITCHES (the founder and the chair): the Switchboard's layout card,
// its words and its derivations. The doors are dream-os src/api/admin/capabilities.js (GET /layout, POST /layout/master,
// POST /layout/vendor); the one predicate home is dream-os src/lib/vendorLayout.js. CE-46 F3 (30 Sept 2026): the
// per-vendor list is her row's layout_v2, added and removed on this card; no Railway variable.
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
  listNote: 'They see the new layout while the switch above is off. Remove takes a vendor back to today’s layout.',
  listNone: 'No vendors listed.',
  find: 'Find a vendor',
  findHint: 'Name or phone',
  noMatch: 'No vendor found.',
  add: 'Add',
  remove: 'Remove',
  added: (name: string) => `${name} now sees the new layout.`,
  removed: (name: string) => `${name} is back on today’s layout.`,
  unread: 'The layout switch could not be read. Reload to try again.',
  flipped: (on: boolean) => (on ? 'New layout for everyone: on.' : 'New layout for everyone: off.'),
} as const;

export type LayoutMaster = { on: boolean; seeded: boolean; first_on_at: string | null; classic_kept_until: string | null };
export type LayoutVendor = { id: string; name: string; phone: string | null };
export type LayoutState = { flag: string; default_on: boolean; vendors: LayoutVendor[]; master?: LayoutMaster };
export type LayoutCandidate = { id: string; label: string; sub?: string };

/** "12 November 2026", from the door's YYYY-MM-DD (read as a calendar date, never shifted by a time zone). */
export function keptDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${d} ${months[m - 1]} ${y}`;
}

/** The door's list as vendors, each with a string id and name; anything else is dropped, never guessed. */
export function asLayoutVendors(v: unknown): LayoutVendor[] | null {
  if (!Array.isArray(v)) return null;
  return v.filter((x) => x && typeof x === 'object' && typeof (x as LayoutVendor).id === 'string' && (x as LayoutVendor).id.length > 0)
    .map((x) => ({ id: (x as LayoutVendor).id, name: typeof (x as LayoutVendor).name === 'string' && (x as LayoutVendor).name ? (x as LayoutVendor).name : 'Unnamed',
      phone: typeof (x as LayoutVendor).phone === 'string' ? (x as LayoutVendor).phone : null }));
}

/** The door's answer as the panel's state, or null when it is not one (an older door without the master or the list). */
export function asLayoutState(d: unknown): LayoutState | null {
  if (!d || typeof d !== 'object') return null;
  const o = d as Partial<LayoutState>;
  const m = o.master;
  const vendors = asLayoutVendors(o.vendors);
  if (!vendors || !m || typeof m.on !== 'boolean') return null;
  return {
    flag: String(o.flag || ''), default_on: !!o.default_on, vendors,
    master: { on: m.on, seeded: !!m.seeded, first_on_at: typeof m.first_on_at === 'string' ? m.first_on_at : null,
      classic_kept_until: typeof m.classic_kept_until === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.classic_kept_until) ? m.classic_kept_until : null },
  };
}

/** From the admin search's answer: the VENDORS group only, minus the vendors already listed. Couples, prospects, demo
 *  vendors and leads are never offered (only a real vendor row can carry the layout). */
export function layoutCandidates(search: unknown, listed: LayoutVendor[]): LayoutCandidate[] {
  const groups = search && typeof search === 'object' && Array.isArray((search as { groups?: unknown }).groups) ? (search as { groups: unknown[] }).groups : [];
  const vendors = groups.find((g) => g && typeof g === 'object' && (g as { key?: unknown }).key === 'vendors') as { hits?: unknown } | undefined;
  const hits = vendors && Array.isArray(vendors.hits) ? vendors.hits : [];
  const on = new Set(listed.map((v) => v.id));
  return hits.filter((h) => h && typeof h === 'object' && typeof (h as LayoutCandidate).id === 'string' && !on.has((h as LayoutCandidate).id))
    .map((h) => ({ id: (h as LayoutCandidate).id, label: String((h as LayoutCandidate).label || 'Unnamed vendor'),
      ...(typeof (h as LayoutCandidate).sub === 'string' ? { sub: (h as LayoutCandidate).sub } : {}) }));
}
