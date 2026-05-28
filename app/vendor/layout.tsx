'use client';
// app/wedding/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Vendor shell + horizontal pager between the three panel roots.
//
// Panels (left → right):  STUDIO(0) · AI(1) · DISCOVER(2)
//   STUDIO   root  →  /wedding/calendar
//   AI       root  →  /wedding
//   DISCOVER root  →  /wedding/discover
//
// Gesture rules (locked):
//   • Swipe enabled ONLY on the three panel roots — sub-pages (Business, More,
//     Leads, Portfolio, etc.) keep their native scroll/gestures untouched.
//   • Finger drags RIGHT → page moves right → previous panel slides in from the
//     left.   (AI → STUDIO,  DISCOVER → AI)
//   • Finger drags LEFT  → page moves left  → next panel slides in from the
//     right.  (STUDIO → AI,  AI → DISCOVER)
//   • Vertical-dominant gestures (|dy| > |dx| × 0.65) cancel the pager — the
//     page scrolls normally.
//   • Pill state auto-updates because Header.tsx derives mode from pathname.
//
// Visual model:
//   While dragging, the active panel's content follows the finger via CSS
//   transform: translateX(). Phantom edge hints appear on the left/right
//   showing where the next panel lives. On release: if past 25% threshold OR
//   fast flick → router.push() to the new panel; else snap back to 0.
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

// ── Panel order ──────────────────────────────────────────────────────────────
const PANEL_ROOTS = ['/vendor/calendar', '/vendor', '/vendor/discover'] as const;

// Returns the panel index for ANY path under /wedding. Mirrors BottomNav's
// modeFromPathname() so swipe works from every sub-page.
//
// Mapping (must match components/BottomNav.tsx::modeFromPathname):
//   AI       (1) — /wedding (exact), /wedding/auth/*
//   Discover (2) — /wedding/discover, /wedding/portfolio, /wedding/couture,
//                  /wedding/featured, /wedding/collab (and sub-pages)
//   Studio   (0) — everything else under /wedding
function panelIndexForPath(pathname: string): number {
  if (pathname === '/vendor' || pathname.startsWith('/vendor/auth')) return 1; // AI
  if (
    pathname.startsWith('/vendor/discover')  ||
    pathname.startsWith('/vendor/portfolio') ||
    pathname.startsWith('/vendor/couture')   ||
    pathname.startsWith('/vendor/featured')  ||
    pathname.startsWith('/vendor/collab')
  ) return 2; // Discover
  return 0;   // Studio (calendar, list, more, settings, contracts, tds, studio)
}

// Walks up from `el` to `stopAt`. Returns true if any ancestor along the
// way is an element where the pager should stay inert — either an
// interactive form control, or an element with horizontal scroll that
// hasn't yet hit its edge in the direction of the drag.
function shouldSuppressPager(el: HTMLElement | null, stopAt: HTMLElement | null, dx: number): boolean {
  let node: HTMLElement | null = el;
  while (node && node !== stopAt) {
    const tag = node.tagName;
    // Form controls with text input — suppress pager so user can type/select
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return true;
    }
    // Element with horizontal scroll content?
    const styles = window.getComputedStyle(node);
    const overflowX = styles.overflowX;
    if ((overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth) {
      // Only suppress if there's room to scroll in the DRAG direction.
      // dx < 0  → finger moves left → scrollLeft must reach scrollWidth - clientWidth
      // dx > 0  → finger moves right → scrollLeft must reach 0
      const atLeft  = node.scrollLeft <= 0;
      const atRight = node.scrollLeft >= node.scrollWidth - node.clientWidth - 1;
      if (dx < 0 && !atRight) return true;  // can still scroll right inside element
      if (dx > 0 && !atLeft)  return true;  // can still scroll left inside element
    }
    node = node.parentElement;
  }
  return false;
}

// Gesture tuning
const HORIZONTAL_LOCK_PX = 8;            // movement before we decide direction
const VERTICAL_CANCEL_RATIO = 0.65;      // |dy|/|dx| > this → vertical scroll, cancel
const COMMIT_DISTANCE_RATIO = 0.25;      // drag past 25% viewport width → commit
const COMMIT_VELOCITY_PX_PER_MS = 0.5;   // OR flick faster than this → commit
const MAX_DRAG_RUBBERBAND = 0.35;        // when no neighbour, drag follows at 35%
const SNAP_DURATION_MS = 260;

export default function WeddingLayout({ children }: { children: React.ReactNode }) {
  useThemeInit();
  const pathname = usePathname() ?? '/vendor';
  const router   = useRouter();
  const onLogin  = pathname.startsWith('/') || pathname.startsWith('/vendor/auth');

  const currentPanelIdx = panelIndexForPath(pathname);
  const swipeEnabled    = !onLogin;

  // Set room class on BOTH html and body so the atmosphere paints both layers
  // (some browsers paint the html background, others the body — we cover both).
  //   Studio (0) → .room-studio   — cooler daylight
  //   AI     (1) → (default Hub atmosphere — warm dusk)
  //   Discov (2) → .room-discover — near-black gallery
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    [html, body].forEach(el => el.classList.remove('room-studio', 'room-discover'));
    if (currentPanelIdx === 0) [html, body].forEach(el => el.classList.add('room-studio'));
    if (currentPanelIdx === 2) [html, body].forEach(el => el.classList.add('room-discover'));
    // Re-apply light vars immediately after class change to prevent dark flash
    if (html.classList.contains('theme-light')) applyLightVars();
    return () => {
      [html, body].forEach(el => el.classList.remove('room-studio', 'room-discover'));
    };
  }, [currentPanelIdx]);

  // ── Drag state (refs, not state, to avoid re-renders during finger movement)
  const stageRef    = useRef<HTMLDivElement>(null);
  const startX      = useRef(0);
  const startY      = useRef(0);
  const startTime   = useRef(0);
  const isDragging  = useRef(false);          // committed to a horizontal drag
  const directionLocked = useRef(false);
  const [dragOffset, setDragOffset]   = useState(0);
  const [transition, setTransition]   = useState('');

  // Cancel any in-flight drag when route changes (panel committed).
  // CRITICAL: set transition to 'none' BEFORE resetting offset so the new panel
  // appears at 0 instantly — never with a visible reverse-slide animation.
  useEffect(() => {
    setTransition('none');
    setDragOffset(0);
    isDragging.current = false;
    directionLocked.current = false;
  }, [pathname]);

  // Capture the touch target on start so onTouchMove can walk up the DOM
  // and decide whether to suppress (form controls, inner horizontal scrolls).
  const touchTarget = useRef<HTMLElement | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    if (!swipeEnabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    startTime.current = performance.now();
    isDragging.current = false;
    directionLocked.current = false;
    touchTarget.current = e.target as HTMLElement;
    setTransition('none');
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!swipeEnabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Lock direction on first meaningful movement
    if (!directionLocked.current) {
      if (Math.abs(dx) < HORIZONTAL_LOCK_PX && Math.abs(dy) < HORIZONTAL_LOCK_PX) return;
      directionLocked.current = true;
      // Vertical-dominant → bail out; let native scroll happen
      if (Math.abs(dy) > Math.abs(dx) * VERTICAL_CANCEL_RATIO) {
        isDragging.current = false;
        return;
      }
      // Suppression guard: if the touch began inside an interactive control
      // or a horizontally-scrollable element with room to scroll, leave the
      // pager inert and let the native gesture run.
      if (shouldSuppressPager(touchTarget.current, stageRef.current, dx)) {
        isDragging.current = false;
        return;
      }
      isDragging.current = true;
    }
    if (!isDragging.current) return;

    // Rubber-band at boundaries (no neighbour to swipe to)
    const idx = currentPanelIdx;
    let offset = dx;
    if (dx < 0 && idx === PANEL_ROOTS.length - 1) offset = dx * MAX_DRAG_RUBBERBAND; // Discover, can't go further right
    if (dx > 0 && idx === 0)                       offset = dx * MAX_DRAG_RUBBERBAND; // Studio,   can't go further left
    setDragOffset(offset);
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!swipeEnabled || !isDragging.current) {
      isDragging.current = false;
      directionLocked.current = false;
      return;
    }

    const dx       = e.changedTouches[0].clientX - startX.current;
    const dt       = Math.max(1, performance.now() - startTime.current);
    const velocity = Math.abs(dx) / dt;                       // px / ms
    const width    = stageRef.current?.clientWidth ?? window.innerWidth;
    const idx      = currentPanelIdx;

    const pastDistance = Math.abs(dx) > width * COMMIT_DISTANCE_RATIO;
    const fastFlick    = velocity > COMMIT_VELOCITY_PX_PER_MS && Math.abs(dx) > 40;
    const shouldCommit = pastDistance || fastFlick;

    let targetIdx = idx;
    if (shouldCommit) {
      if (dx < 0 && idx < PANEL_ROOTS.length - 1) targetIdx = idx + 1; // swipe ← → next panel
      if (dx > 0 && idx > 0)                       targetIdx = idx - 1; // swipe → → prev panel
    }

    // Animate to commit/snap-back position. We can't translateX(-100%) because
    // we don't actually have the next panel mounted in this layout. Instead:
    //   • commit  → fly current content out, then router.push (new panel renders)
    //   • cancel  → spring back to 0
    setTransition(`transform ${SNAP_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`);

    if (targetIdx !== idx) {
      // Half-fly + early navigate: kick off router.push immediately so Next.js
      // begins rendering the new route while the slide-out is still animating.
      // By the time the slide completes, the new page is already painted under
      // it — no blink, single continuous motion.
      const exitOffset = dx < 0 ? -width : width;
      setDragOffset(exitOffset);
      router.push(PANEL_ROOTS[targetIdx]);
      // Belt-and-braces: if route change is somehow slow, the pathname effect
      // resets offset when it eventually lands.
    } else {
      setDragOffset(0);
    }

    isDragging.current = false;
    directionLocked.current = false;
  }

  // ── Edge hints: subtle gold ticks at left/right when a neighbour exists ────
  const hasLeftNeighbour  = currentPanelIdx > 0;
  const hasRightNeighbour = currentPanelIdx >= 0 && currentPanelIdx < PANEL_ROOTS.length - 1;
  const dragProgress      = stageRef.current ? Math.abs(dragOffset) / stageRef.current.clientWidth : 0;
  const leftHintOpacity   = hasLeftNeighbour  && dragOffset > 0 ? Math.min(1, dragProgress * 3) : 0;
  const rightHintOpacity  = hasRightNeighbour && dragOffset < 0 ? Math.min(1, dragProgress * 3) : 0;

  return (
    <ThemeProvider>
    <div style={{
      height: '100dvh', width: '100%', overflowX: 'clip', overflowY: 'hidden',
      userSelect: 'none' as const, WebkitUserSelect: 'none' as const,
      background: 'transparent',  // inherit body's Atelier warm gradient
      display: 'flex', flexDirection: 'column',
    }}>
      <div
        ref={stageRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
          position: 'relative',
          // Apply transform ONLY when actively dragging. Any transform value
          // (even translateX(0)) creates a containing block for position:fixed
          // descendants, breaking bottom sheets/modals on every sub-page.
          ...(dragOffset !== 0 ? { transform: `translateX(${dragOffset}px)` } : {}),
          transition,
          willChange: swipeEnabled && dragOffset !== 0 ? 'transform' : 'auto',
          // CRITICAL: don't claim touch-action — let children manage their own
          // pan-y. The browser will still send our handlers the events.
        }}
      >
        {children}

        {/* Edge hint: peek shadow when dragging at a boundary-having edge */}
        {swipeEnabled && (
          <>
            <div aria-hidden style={{
              position: 'fixed', left: 0, top: 0, bottom: 0, width: 3,
              background: 'linear-gradient(90deg, rgba(201,168,76,0.55) 0%, transparent 100%)',
              opacity: leftHintOpacity, pointerEvents: 'none', zIndex: 50,
              transition: dragOffset === 0 ? 'opacity 200ms' : 'none',
            }} />
            <div aria-hidden style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, width: 3,
              background: 'linear-gradient(-90deg, rgba(201,168,76,0.55) 0%, transparent 100%)',
              opacity: rightHintOpacity, pointerEvents: 'none', zIndex: 50,
              transition: dragOffset === 0 ? 'opacity 200ms' : 'none',
            }} />
          </>
        )}
      </div>
      {!onLogin && <BottomNav />}
    </div>
    </ThemeProvider>
  );
}
