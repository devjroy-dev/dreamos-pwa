'use client';
// app/vendor/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Vendor shell · TDW_09 PACKAGE 2 — THE FIVE DOORS (R-X27 arm (a)).
//
// ═══ THE PAGER TOMBSTONE (fork 8.1 = (a), chair relay #3) ═══════════════════
// This file was a Studio↔AI↔Discover horizontal PANEL PAGER: PANEL_ROOTS
// ['/vendor/calendar','/vendor','/vendor/discover'], touch handlers with an
// 8px direction lock, 25% commit threshold, flick velocity, rubber-band edges,
// gold edge hints, and the A2.3 suppression contract (`shouldSuppressPager` +
// the `data-pager-inert` opt-out that SwipeRow claims). The pager was THE MODE
// IN GESTURE FORM — panelIndexForPath was documented as "a projection of" the
// classifier — and with the mode dissolved it had nothing coherent to page
// between, so it retires BY SUBTRACTION with the pill: keeping it would
// re-teach the membership the five doors exist to kill. The verb "swipe
// between panels" is REMOVED-BY-RULING in this sitting's control inventory,
// warrant chair relay #3.
//
// SwipeRow's `data-pager-inert` attribute STANDS — the demo twin's pager
// (DECLARED-HELD, F-09.89) still reads it. Only this layout stopped listening.
//
// What SURVIVES, byte-purposed as before: Splash (RULED-INVARIANT, R-M4(c)),
// the theme init + LIGHT_VARS pre-paint pin (the-landing-is-the-law lawful
// exception), ThemeProvider, and the BottomNav mount — now the five-door bar.
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname } from 'next/navigation';
import { Splash } from '@/components/vendor/Splash'; // TDW_04 A4 (P6): cold-open hero
import { useEffect } from 'react';
import { BottomNav } from '@/components/vendor/BottomNav';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';

// Apply saved theme class immediately on mount to avoid flash
// This runs in layout so it fires once for the whole shell
// Inline light-mode vars applied before first paint — prevents dark flash
const LIGHT_VARS: [string, string][] = [
  ['--atelier-ink',          '#1A0F08'],
  ['--atelier-ink-soft',     'rgba(26,15,8,0.80)'],
  ['--atelier-ink-mute',     'rgba(26,15,8,0.58)'],
  ['--atelier-ink-dim',      'rgba(26,15,8,0.38)'],
  ['--atelier-label',        '#7A3828'],
  ['--atelier-accent-text',  '#7A3828'],
  ['--atelier-header-bg',    'rgba(245,242,238,0.96)'],
  ['--atelier-sheet-top',    '#F5F2EE'],
  ['--atelier-sheet-bot',    '#EDE8DF'],
  ['--atelier-sheet-border', 'rgba(122,56,40,0.25)'],
  ['--atelier-input-bg',     'rgba(26,15,8,0.04)'],
  ['--atelier-input-border', 'rgba(122,56,40,0.22)'],
  ['--atelier-card-border',  'rgba(122,56,40,0.20)'],
  ['--atelier-row-hover',    'rgba(26,15,8,0.03)'],
  ['--atelier-overlay-bg',   'rgba(26,15,8,0.55)'],
];

function applyLightVars() {
  const r = document.documentElement.style;
  LIGHT_VARS.forEach(([k, v]) => r.setProperty(k, v));
  document.documentElement.style.background = '#F5F2EE';
  document.body.style.background = '#F5F2EE';
}

function clearLightVars() {
  const r = document.documentElement.style;
  LIGHT_VARS.forEach(([k]) => r.removeProperty(k));
  document.documentElement.style.removeProperty('background');
  document.body.style.removeProperty('background');
}

function useThemeInit() {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dreamai_theme');
      if (saved === 'light') {
        document.documentElement.classList.add('theme-light');
        applyLightVars();
      }
    } catch { /* private mode — stay dark */ }
  }, []);
}

// ── THE ROOM ATMOSPHERES, RE-KEYED (fork 8.2, chair relay #3) ────────────────
// The `.room-studio` / `.room-discover` classes on html+body were keyed off the
// PANEL INDEX — a projection of the retired mode. The RULING is a pure
// indirection removal: same classes, same routes, ZERO visual delta,
// cell-asserted. The prefix buckets below are BYTE-EQUIVALENT to the retired
// classifier's own (lib/vendor/vendorModeForPath.ts @ base 84848e8):
//   '/vendor' exact + the '/vendor/auth' prefix             → no room class
//   (the prefix is written WITHOUT a glob here on purpose: a slash-star inside
//   a line comment opens a phantom block comment under every comment-stripping
//   instrument this estate runs — this bench's own §5 was its first casualty)
//   the old DISCOVER_ROOTS, verbatim, same order            → room-discover
//   everything else                                         → room-studio
// `/vendor/storefront` did not exist under the old world; it falls to the
// `else` bucket (room-studio) — the mapping's own default, no new atmosphere
// minted without a ruling. This function is the room-atmosphere authority ONLY
// — door membership and active state live on BottomNav's DOORS list (the
// F-07.30 one-authority law's successor); nothing here answers a nav question.
const ROOM_DISCOVER_PREFIXES = [
  '/vendor/discover',
  '/vendor/portfolio',
  '/vendor/couture',
  '/vendor/featured',
  '/vendor/collab',
] as const;

function roomClassForPath(pathname: string): 'room-studio' | 'room-discover' | null {
  if (pathname === '/vendor' || pathname.startsWith('/vendor/auth')) return null;
  if (ROOM_DISCOVER_PREFIXES.some((root) => pathname.startsWith(root))) return 'room-discover';
  return 'room-studio';
}

export default function WeddingLayout({ children }: { children: React.ReactNode }) {
  useThemeInit();
  const pathname = usePathname() ?? '/vendor';
  const onLogin  = pathname === '/' || pathname.startsWith('/vendor/auth') || pathname.startsWith('/vendor/pin');

  // Set room class on BOTH html and body so the atmosphere paints both layers
  // (some browsers paint the html background, others the body — we cover both).
  //   room-studio   — cooler daylight
  //   (none)        — default Hub atmosphere, warm dusk
  //   room-discover — near-black gallery
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const room = roomClassForPath(pathname);
    [html, body].forEach(el => el.classList.remove('room-studio', 'room-discover'));
    if (room) [html, body].forEach(el => el.classList.add(room));
    // Re-apply light vars immediately after class change to prevent dark flash
    if (html.classList.contains('theme-light')) applyLightVars();
    return () => {
      [html, body].forEach(el => el.classList.remove('room-studio', 'room-discover'));
    };
  }, [pathname]);

  return (
    <ThemeProvider>
    {!onLogin && <Splash />}{/* TDW_04 A4 (P6): cold-open only; nav never re-triggers */}
    <div style={{
      height: '100dvh', width: '100%', overflowX: 'clip', overflowY: 'hidden',
      userSelect: 'none' as const, WebkitUserSelect: 'none' as const,
      background: 'transparent',  // inherit body's Atelier warm gradient
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
        position: 'relative',
      }}>
        {children}
      </div>
      {!onLogin && <BottomNav />}
    </div>
    </ThemeProvider>
  );
}
