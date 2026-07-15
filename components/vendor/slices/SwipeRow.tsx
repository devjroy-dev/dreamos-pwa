'use client';
// components/vendor/slices/SwipeRow.tsx — TDW_04 A2 (the approved P4 swipe
// table's engine). Pointer/touch translateX, threshold 96px, spring back —
// pure presentational (ports to RN Gesture Handler 1:1, per the P4 note).
// The row reveals an action label on each side while dragging; crossing the
// threshold and releasing fires the side's handler. Vertical scroll wins:
// the gesture only captures once horizontal intent is clear (|dx| > 12 and
// |dx| > |dy|).

import { useRef, useState, type ReactNode } from 'react';

const THRESHOLD = 96;

export interface SwipeSide {
  label: string;
  /** brass for constructive, ember for destructive reveal */
  destructive?: boolean;
  onTrigger: () => void;
}

export function SwipeRow({ children, right, left, disabled }: {
  children: ReactNode;
  /** action when swiping right (positive translateX) */
  right?: SwipeSide;
  /** action when swiping left */
  left?: SwipeSide;
  disabled?: boolean;
}) {
  const [dx, setDx] = useState(0);
  const [springing, setSpringing] = useState(false);
  const start = useRef<{ x: number; y: number; captured: boolean } | null>(null);
  // A captured drag must NOT also fire the row's click (browsers synthesize a
  // click after pointerup; a real touch-drag doesn't tap, and neither may we —
  // otherwise every swipe opens the detail sheet behind its own toast).
  const suppressClick = useRef(false);

  function onPointerDown(e: React.PointerEvent) {
    if (disabled || (!right && !left)) return;
    start.current = { x: e.clientX, y: e.clientY, captured: false };
    setSpringing(false);
  }
  function onPointerMove(e: React.PointerEvent) {
    const s = start.current;
    if (!s) return;
    const ddx = e.clientX - s.x;
    const ddy = e.clientY - s.y;
    if (!s.captured) {
      if (Math.abs(ddx) < 12 || Math.abs(ddx) <= Math.abs(ddy)) return; // scroll wins
      s.captured = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    let next = ddx;
    if (next > 0 && !right) next = 0;
    if (next < 0 && !left) next = 0;
    setDx(Math.max(-140, Math.min(140, next)));
  }
  function onPointerEnd() {
    const s = start.current;
    start.current = null;
    if (!s?.captured) { setDx(0); return; }
    suppressClick.current = true;
    setTimeout(() => { suppressClick.current = false; }, 80);
    const fired = dx >= THRESHOLD ? right : dx <= -THRESHOLD ? left : undefined;
    setSpringing(true);
    setDx(0);
    if (fired) fired.onTrigger();
  }

  const reveal = dx > 0 ? right : dx < 0 ? left : undefined;
  const revealOn = Math.abs(dx) >= THRESHOLD;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', touchAction: 'pan-y' }}>
      {reveal && dx !== 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: dx > 0 ? 'flex-start' : 'flex-end', padding: '0 22px',
          fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 400,
          fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: reveal.destructive ? '#E07070' : 'var(--atelier-accent-text)',
          opacity: revealOn ? 1 : 0.45,
        }}>{reveal.label}</div>
      )}
      <div
        onClickCapture={(e) => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); } }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        style={{
          transform: `translateX(${dx}px)`,
          transition: springing ? 'transform 260ms cubic-bezier(0.22,1,0.36,1)' : undefined,
          background: 'var(--atelier-bg, transparent)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
