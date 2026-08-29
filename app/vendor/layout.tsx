// ══ BRANCH-ONLY · M-WORKLIST ZIP 3 (R-37.73 ④) ═══════════════════════
// LIGHT_VARS below are CHALK, not Editorial Paper. This pre-paint pin writes INLINE styles
// on documentElement, which beat every stylesheet — leaving it on the old values would
// have kept the light rooms cream no matter what globals.css said. Branch-only.
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

import { usePathname, useRouter } from 'next/navigation';
import { Splash } from '@/components/vendor/Splash'; // TDW_04 A4 (P6): cold-open hero
import { useEffect, useMemo } from 'react';
import { BottomNav } from '@/components/vendor/BottomNav';
import { AskProvider, type AskApi } from '@/lib/worklist/askContext';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';
import { getVendorSession } from '@/lib/vendor/session';
import { getJson } from '@/lib/vendor/api/_base';
import { ServiceWorkerRegistrar } from '@/components/vendor/ServiceWorkerRegistrar';

// Apply saved theme class immediately on mount to avoid flash
// This runs in layout so it fires once for the whole shell
// Inline light-mode vars applied before first paint — prevents dark flash
const LIGHT_VARS: [string, string][] = [
  ['--atelier-ink',          '#0E1112'],
  ['--atelier-ink-soft',     '#272B2D'],
  ['--atelier-ink-mute',     '#52585B'],
  ['--atelier-ink-dim',      '#3D4245'],
  ['--atelier-label',        '#3A3F42'],
  ['--atelier-accent-text',  '#0D6A5A'],
  ['--atelier-header-bg',    '#FFFFFF'],
  ['--atelier-sheet-top',    '#F8F9F9'],
  ['--atelier-sheet-bot',    '#EDEFEF'],
  ['--atelier-sheet-border', 'rgba(23,25,26,0.16)'],
  ['--atelier-input-bg',     'rgba(23,25,26,0.035)'],
  ['--atelier-input-border', 'rgba(13,106,90,0.68)'],
  ['--atelier-card-border',  'rgba(23,25,26,0.13)'],
  ['--atelier-row-hover',    'rgba(23,25,26,0.038)'],
  ['--atelier-overlay-bg',   'rgba(23,25,26,0.44)'],
];

function applyLightVars() {
  const r = document.documentElement.style;
  LIGHT_VARS.forEach(([k, v]) => r.setProperty(k, v));
  document.documentElement.style.background = '#F3F4F4';
  document.body.style.background = '#F3F4F4';
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

// ── ARC OB · charter OB-P · THE MANDATORY REDIRECT (F-1 ratified) ────────────
// R-OB.1/R-OB.2: one onboarding door, and it is the form; no grace turns. An
// un-onboarded vendor who signs in is sent to it, and no studio surface renders
// behind her back.
//
// IT LIVES IN THE LAYOUT, MOVED NOT DUPLICATED. The guard was a page guard in
// app/vendor/page.tsx (:799-802) and it is deleted there in this same diff. Two
// reasons it had to move:
//   · IT ONLY COVERED /vendor. A vendor landing on /vendor/discover,
//     /vendor/list or /vendor/settings — every one of them a real link she can
//     hold — bypassed it entirely. The layout mounts on all of them.
//   · IT READ THE MARKER. `onboarding_state !== 'complete'` is a FLOW POSITION,
//     not a fact (R-OB.8). Four live vendor rows carry 'complete' over rows the
//     predicate refuses, and the old guard waved exactly those four through
//     forever — the precise rows backfill-on-login is owed to. It now reads
//     `onboarding.complete`, computed server-side from the one predicate home
//     (dream-os src/lib/onboardingPredicate.js, on the wire since CE-32's micro).
//
// THIS CLIENT NEVER DECIDES COMPLETENESS. It asks and it obeys. A second
// definition of "onboarded" living in the PWA is the thing this arc spent four
// sittings collapsing into one.
//
// CIRCLE MEMBERS ARE EXEMPT BY STRUCTURE, NOT BY A BRANCH. They hold
// circle_session/circle_token and live entirely under /coplanner; this layout
// never mounts for them. A role check here would imply a shared path that does
// not exist, and would be a second thing to keep true.
//
// FAILS OPEN, deliberately. A network error, a 401 mid-refresh, or a response
// without the verdict leaves the vendor where she is. A guard that strands a
// paying vendor in her own studio because a fetch flaked is worse than one that
// misses a turn — and R-OB.9's gate is the backstop on the WhatsApp side.
function useOnboardingGuard(pathname: string, onLogin: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (onLogin) return;
    // The form itself is exempt, or the redirect is a loop.
    if (pathname.startsWith('/vendor/onboarding')) return;
    if (typeof window === 'undefined') return;
    if (!getVendorSession()?.access_token) return;

    let live = true;
    getJson<{ ok: boolean; vendor?: { onboarding?: { complete: boolean } } }>('/api/v2/vendor/me', true)
      .then((d) => {
        if (!live || !d.ok) return;
        // `=== false` not `!complete`: an ABSENT verdict is a server that did
        // not answer the question, not a vendor who is incomplete. Only an
        // explicit false redirects.
        if (d.vendor?.onboarding?.complete === false) router.replace('/vendor/onboarding');
      })
      .catch(() => { /* non-fatal — fail open, see above */ });
    return () => { live = false; };
  }, [pathname, onLogin, router]);
}

export default function WeddingLayout({ children }: { children: React.ReactNode }) {
  useThemeInit();
  const pathname = usePathname() ?? '/vendor';
  const onLogin  = pathname === '/' || pathname.startsWith('/vendor/auth') || pathname.startsWith('/vendor/pin');

  // ── ARC OB · OB-P · THE MANDATORY DOOR WEARS NO NAV ───────────────────────
  // The five-door bar rendered OVER the onboarding form and buried the submit
  // button. Founder caught it on the device walk.
  //
  // THE OCCLUSION IS THE VISIBLE HALF. The real defect is doctrinal: R-OB.2 is a
  // MANDATORY redirect with no grace and no skip, so a door that renders Home /
  // Calendar / Business / Storefront / More is advertising five exits the guard
  // would bounce her straight back from. Chrome contradicting the ruling
  // underneath it. Hiding the bar cures both halves in one act.
  //
  // ITS OWN PREDICATE, not an onLogin widening: onLogin means PRE-authentication
  // and also gates <Splash />. The form is the opposite — she is authenticated,
  // which is exactly why she is here. Folding it in would teach a later reader
  // that the form is a login screen, and would drag Splash along with it.
  const chromeless = pathname.startsWith('/vendor/onboarding');

  useOnboardingGuard(pathname, onLogin);

  // ── CE-39 S2/6 · ARM (a) · THIS TREE'S ASK DOOR IS TODAY'S PUSH ───────────
  // The four hub primers (F-38.47) are dual-tree — BinderCard is mounted by app/vendor/
  // page.tsx itself — so they ask lib/worklist/askContext.tsx and push nothing. On THIS
  // tree the answer is the push they used to make, byte for byte: `/vendor?draft=` primes
  // the risen chat through `InputBar initialValue` (app/vendor/page.tsx, R-O14-AMENDED).
  // `open` is always false and `closeAsk` is inert because this tree has no sheet; the hub
  // page owns its own risen state. It retires with this layout at Phase 7, alongside
  // INTERIM_BOTTOMNAV_MOUNTS.
  //
  // s-39.1 (seat, disclosed): the calendar door used `?aiPrimer=` here, which INJECTED its
  // stem as an assistant line (useChat.injectAiMessage) rather than prefilling the input.
  // Its stem 「About <date>: 」 is F-04.9 prefill grammar — a sentence for the VENDOR to
  // complete — so on this tree it now arrives as a draft like the other three. One
  // parameter, one home; the difference is named here rather than smuggled.
  const askRouter = useRouter();
  const ask = useMemo<AskApi>(() => ({
    open: false, prefill: '',
    openAsk: (text = '') => askRouter.push('/vendor?draft=' + encodeURIComponent(text)),
    closeAsk: () => {},
  }), [askRouter]);

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
    <AskProvider value={ask}>
    <ThemeProvider>
      {/* F-19.36: the SW registrar mounts PER AUTHENTICATED SHELL. It used to sit
          in the root layout registering an origin-wide scope, so one visit to the
          public landing claimed /v/ and /r/ for that browser. */}
      <ServiceWorkerRegistrar />
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
      {!onLogin && !chromeless && <BottomNav />}
    </div>
    </ThemeProvider>
    </AskProvider>
  );
}
