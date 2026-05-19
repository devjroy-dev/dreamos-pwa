// components/frost-vendor/tokens.ts
// Design tokens for Frost vendor PWA. Mirrors the native app's vendor palette
// (locked: bg/card/warm/gold/ink + Cormorant + DM Sans + Jost).
// Single source — every component imports from here, never hex literals.

export const COLORS = {
  bg:       '#F8F7F5',
  card:     '#FFFFFF',
  warm:     '#F4F1EC',
  gold:     '#C9A84C',
  ink:      '#0C0A09',
  dark:     '#111111',
  muted:    '#8C8480',
  border:   '#E2DED8',
  navBg:    '#0C0A09',
  navMuted: '#888580',
  peak:     '#FF6B35',
  // States
  success:  '#5B7C53',
  warn:     '#C28840',
  danger:   '#B8453E',
} as const;

export const FONTS = {
  cg300:   "'Cormorant Garamond', serif",
  dm300:   "'DM Sans', sans-serif",
  dm400:   "'DM Sans', sans-serif",
  jost:    "'Jost', sans-serif",
} as const;

export const RADIUS = {
  sm:  6,
  md:  10,
  lg:  16,
  pill: 100,
} as const;

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const BORDER_THIN = `0.5px solid ${COLORS.border}`;

// INR formatter — always returns "₹1,75,000" Indian locale grouping
export function fmtINR(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  try {
    return '₹' + n.toLocaleString('en-IN');
  } catch {
    return '₹' + String(n);
  }
}

// Short compact INR ("1.75L" / "60K" / "₹2.5L")
export function fmtINRShort(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  const a = Math.abs(n);
  if (a >= 10000000) return '₹' + (n / 10000000).toFixed(a >= 100000000 ? 0 : 2).replace(/\.?0+$/, '') + 'Cr';
  if (a >= 100000)   return '₹' + (n / 100000).toFixed(a >= 10000000 ? 0 : 2).replace(/\.?0+$/, '') + 'L';
  if (a >= 1000)     return '₹' + (n / 1000).toFixed(a >= 100000 ? 0 : 1).replace(/\.?0+$/, '') + 'K';
  return '₹' + n;
}

// Date formatter — "Nov 19, 2026" or "Tomorrow" / "Today" relative
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

// "11:00 AM" from "11:00:00" or full ISO
export function fmtTime(t: string | null | undefined): string {
  if (!t) return '';
  try {
    const isFull = t.includes('T');
    const d = isFull ? new Date(t) : new Date('2000-01-01T' + t);
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return t;
  }
}

// "2h ago" / "Yesterday" / "Nov 12" for created_at lines
export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const then = new Date(iso).getTime();
    const now  = Date.now();
    const mins = Math.floor((now - then) / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7)   return days + 'd ago';
    return fmtDate(iso);
  } catch {
    return iso;
  }
}

export function initials(name: string | null | undefined): string {
  if (!name) return 'M';
  return name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase();
}
