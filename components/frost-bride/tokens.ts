// components/frost-bride/tokens.ts
// Design tokens for Frost bride PWA.
// Palette matches the locked TDW theme — same as vendor side EXCEPT:
//   - Bottom nav: light bg (#F8F7F5) + top border, not dark (#0C0A09)
//   - Active indicator: gold bar at bottom for PLAN, at top for DISCOVER
//     (matches existing couple BottomNav convention)

export const COLORS = {
  bg:       '#F8F7F5',
  card:     '#FFFFFF',
  warm:     '#F4F1EC',
  gold:     '#C9A84C',
  ink:      '#0C0A09',
  dark:     '#111111',
  muted:    '#8C8480',
  border:   '#E2DED8',
  navBg:    '#F8F7F5',   // light nav — bride differs from vendor
  navMuted: '#888580',
  success:  '#5B7C53',
  warn:     '#C28840',
  danger:   '#B8453E',
} as const;

export const FONTS = {
  cg300: "'Cormorant Garamond', serif",
  dm300: "'DM Sans', sans-serif",
  jost:  "'Jost', sans-serif",
} as const;

export const RADIUS = {
  sm:   6,
  md:   10,
  lg:   16,
  pill: 100,
} as const;

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const BORDER_THIN = `0.5px solid ${COLORS.border}`;

export function fmtINR(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  try { return '₹' + n.toLocaleString('en-IN'); } catch { return '₹' + String(n); }
}

export function fmtINRShort(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  const a = Math.abs(n);
  if (a >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\.?0+$/, '') + 'Cr';
  if (a >= 100000)   return '₹' + (n / 100000).toFixed(2).replace(/\.?0+$/, '') + 'L';
  if (a >= 1000)     return '₹' + (n / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K';
  return '₹' + n;
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

export function fmtTime(t: string | null | undefined): string {
  if (!t) return '';
  try {
    const d = t.includes('T') ? new Date(t) : new Date('2000-01-01T' + t);
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch { return t; }
}

export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + 'd ago';
    return fmtDate(iso);
  } catch { return iso; }
}

export function initials(name: string | null | undefined): string {
  if (!name) return 'P';
  return name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
}

export function daysLabel(n: number | null): string {
  if (n === null) return '';
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n < 0)  return Math.abs(n) + 'd ago';
  return n + ' days';
}
