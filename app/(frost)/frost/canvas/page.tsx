'use client';

// app/(frost)/frost/canvas/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CANVAS PANEL HOST — Direction 07 Aubade & Nocturne.
//
// Discover and Sanctuary as sibling panels — no router navigation between them.
// Threshold welcome overlay shown first session only (localStorage flag).
// ─────────────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import DiscoverCanvas  from './discover/page';
import SanctuaryCanvas from './sanctuary/page';

const SWIPE_X_MIN = 40;
const SWIPE_RATIO = 1.2;
const THRESHOLD_FLAG = 'frost_threshold_seen';

// Cookie fallback — survives iOS Safari ITP localStorage wipe (7-day limit).
// We write both; read either. Cookie lasts 365 days.
function thresholdSeen(): boolean {
  try {
    if (localStorage.getItem(THRESHOLD_FLAG)) return true;
  } catch {}
  try {
    return document.cookie.split(';').some(c => c.trim().startsWith(THRESHOLD_FLAG + '='));
  } catch {}
  return false;
}
function markThresholdSeen() {
  try { localStorage.setItem(THRESHOLD_FLAG, '1'); } catch {}
  try {
    const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
    document.cookie = `${THRESHOLD_FLAG}=1; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}

function getBrideFirstName(): string {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      const n = (s?.user_name || s?.name || '').trim().split(' ')[0];
      if (n) return n;
    }
  } catch {}
  return 'Priya';
}

// ── Threshold overlay — first session only ────────────────────────────────────
function ThresholdOverlay({ name, onDone }: { name: string; onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // in: 800ms fade-in → hold: 1800ms → out: 600ms fade-out → done
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('out'),  2600);
    const t3 = setTimeout(() => onDone(),         3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const opacity = phase === 'in' ? 0 : phase === 'hold' ? 1 : 0;

  return (
    <div
      onClick={onDone}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0A090B',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'default',
        transition: 'opacity 600ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Name dissolve */}
      <div style={{
        opacity,
        transition: 'opacity 700ms cubic-bezier(0.22,1,0.36,1)',
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        {/* Italianno greeting */}
        <div style={{
          fontFamily: "'Italianno', 'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: 72,
          color: '#EFE9DD',
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          marginBottom: 20,
        }}>
          Welcome, <span style={{ color: '#D89854' }}>{name}</span>.
        </div>

        {/* Saffron hairline */}
        <div style={{
          width: 48, height: 1,
          background: 'linear-gradient(90deg, transparent, #D89854, transparent)',
          margin: '0 auto 20px',
        }} />

        {/* Mono sub */}
        <div style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 9,
          fontWeight: 300,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(239,233,221,0.38)',
        }}>
          Your wedding. Your world.
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function CanvasHost() {
  const [panel,     setPanel]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [threshold, setThreshold] = useState<'pending' | 'showing' | 'done'>('pending');
  const [brideName, setBrideName] = useState('Priya');
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Check threshold flag on mount
  useEffect(() => {
    const name = getBrideFirstName();
    setBrideName(name);
    try {
      if (thresholdSeen()) {
        setThreshold('done');
      } else {
        setThreshold('showing');
        markThresholdSeen();
      }
    } catch {
      setThreshold('done');
    }
  }, []);

  // Panel intent from sessionStorage (sub-room returns)
  useEffect(() => {
    try {
      const intent = sessionStorage.getItem('frost_canvas_panel');
      if (intent === 'discover')  { setPanel(0); sessionStorage.removeItem('frost_canvas_panel'); }
      if (intent === 'sanctuary') { setPanel(1); sessionStorage.removeItem('frost_canvas_panel'); }
    } catch {}
  }, []);

  const switchPanel = useCallback((to: number) => {
    if (animating || to === panel) return;
    setAnimating(true);
    setPanel(to);
    setTimeout(() => setAnimating(false), 340);
  }, [animating, panel]);

  useEffect(() => {
    (window as any).__frostSwitchPanel = switchPanel;
    return () => { delete (window as any).__frostSwitchPanel; };
  }, [switchPanel]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx  = e.changedTouches[0].clientX - touchStart.current.x;
    const dy  = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_X_MIN) return;
    if (Math.abs(dy) * SWIPE_RATIO > Math.abs(dx)) return;
    if (dx < 0 && panel === 0) switchPanel(1);
    if (dx > 0 && panel === 1) switchPanel(0);
  };

  return (
    <>
      {/* Threshold — shown until dismissed or auto-completes */}
      {threshold === 'showing' && (
        <ThresholdOverlay name={brideName} onDone={() => setThreshold('done')} />
      )}

      {/* Panel track — always mounted so Discover preloads */}
      <div
        style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          display: 'flex', width: '200vw', height: '100%',
          transform: panel === 0 ? 'translateX(0)' : 'translateX(-100vw)',
          transition: animating ? 'transform 320ms cubic-bezier(0.22,1,0.36,1)' : 'none',
          willChange: 'transform',
        }}>
          <div style={{ width: '100vw', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            <DiscoverCanvas />
          </div>
          <div style={{ width: '100vw', height: '100%', flexShrink: 0, overflow: 'hidden' }}>
            <SanctuaryCanvas />
          </div>
        </div>
      </div>
    </>
  );
}
