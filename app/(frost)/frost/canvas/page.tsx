'use client';

// app/(frost)/frost/canvas/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CANVAS PANEL HOST — Direction 07 Aubade & Nocturne.
//
// Discover (Aubade) and Sanctuary (Nocturne) live as SIBLINGS on this single
// page. No router navigation between them — pure CSS transform.
// This permanently kills the logout-on-back-swipe bug: the browser has
// nothing to go back to because both canvases are the same route.
//
// Layout: two panels side by side, each 100vw wide.
//   [ Discover | Sanctuary ]
// Active panel controlled by `panel` state (0 = Discover, 1 = Sanctuary).
// Transition: translateX(-100vw) with 320ms ease-out.
//
// Horizontal swipe gesture: ≥ 40px horizontal, less vertical than horizontal.
// Swipe LEFT  from Discover → Sanctuary.
// Swipe RIGHT from Sanctuary → Discover.
//
// Sub-room navigation (Circle, Dream, Muse, etc.) stays as router.push —
// those are full pages. Back from sub-room → /frost/canvas (lands on Sanctuary
// panel by default, which is correct).
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import DiscoverCanvas   from './discover/page';
import SanctuaryCanvas  from './sanctuary/page';

const SWIPE_X_MIN = 40;   // px horizontal travel to trigger panel switch
const SWIPE_RATIO = 1.2;  // horizontal must exceed vertical × ratio

export default function CanvasHost() {
  // 0 = Discover (left panel), 1 = Sanctuary (right panel)
  const [panel,      setPanel]      = useState(0);
  const [animating,  setAnimating]  = useState(false);
  const touchStart   = useRef<{ x: number; y: number } | null>(null);

  // Sub-rooms navigate back to /frost/canvas → this component mounts fresh.
  // Default to Sanctuary on return (the natural "home" after exploring a sub-room).
  // We encode intent via sessionStorage so Sanctuary rows (Circle, Muse, etc.)
  // can push their route and return here landing on the right panel.
  useEffect(() => {
    try {
      const intent = sessionStorage.getItem('frost_canvas_panel');
      if (intent === 'discover') { setPanel(0); sessionStorage.removeItem('frost_canvas_panel'); }
      else if (intent === 'sanctuary') { setPanel(1); sessionStorage.removeItem('frost_canvas_panel'); }
      // Default: 0 (Discover) on first load, 1 (Sanctuary) on return from sub-room
    } catch {}
  }, []);

  const switchPanel = useCallback((to: number) => {
    if (animating || to === panel) return;
    setAnimating(true);
    setPanel(to);
    setTimeout(() => setAnimating(false), 340);
  }, [animating, panel]);

  // Expose panel switcher on window so child canvases can call it without
  // prop-drilling through the entire discover/sanctuary trees.
  useEffect(() => {
    (window as any).__frostSwitchPanel = switchPanel;
    return () => { delete (window as any).__frostSwitchPanel; };
  }, [switchPanel]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t   = e.changedTouches[0];
    const dx  = t.clientX - touchStart.current.x;
    const dy  = t.clientY - touchStart.current.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    touchStart.current = null;

    if (adx < SWIPE_X_MIN) return;
    if (ady * SWIPE_RATIO > adx) return; // too vertical

    if (dx < 0 && panel === 0) switchPanel(1); // swipe left → Sanctuary
    if (dx > 0 && panel === 1) switchPanel(0); // swipe right → Discover
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Sliding track — two panels side by side */}
      <div style={{
        display: 'flex',
        width: '200vw',
        height: '100%',
        transform: panel === 0 ? 'translateX(0)' : 'translateX(-100vw)',
        transition: animating ? 'transform 320ms cubic-bezier(0.22,1,0.36,1)' : 'none',
        willChange: 'transform',
      }}>
        {/* Left panel — Discover */}
        <div style={{ width: '100vw', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
          <DiscoverCanvas />
        </div>
        {/* Right panel — Sanctuary */}
        <div style={{ width: '100vw', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
          <SanctuaryCanvas />
        </div>
      </div>
    </div>
  );
}
