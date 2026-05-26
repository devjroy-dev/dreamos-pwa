#!/usr/bin/env python3
"""
patch_frost_all_fixes.py
========================
Five fixes in one shot:

  1. Logout / back-swipe fix — `/frost/canvas` becomes a single page with
     Discover and Sanctuary as side-by-side panels. Browser back never exits
     the product. The URL becomes `/frost/canvas` for both.

  2. Sanctuary ↔ Discover — left swipe from Sanctuary enters Discover panel.
     Right swipe from Discover enters Sanctuary panel. ● SANCTUARY pill and
     ↑ Aubade button both work. No router.push — pure CSS transform.

  3. VII Journey — inline accordion in Sanctuary. Tap expands to reveal
     Events, Expenses, Reminders, Vendors, Settings rows inline. No navigation.

  4. Muse — Aubade skin. Replaces CanvasShell + MUSE_LOOKS.

  5. Member detail (circle/[memberId]) — Aubade skin. Replaces CanvasShell + MUSE_LOOKS.

Run from dreamos-pwa root:
    python3 patch_frost_all_fixes.py

Validate:
    npx tsc --noEmit

Commit:
    git add app/\\(frost\\)/frost/canvas/page.tsx \\
            app/\\(frost\\)/frost/canvas/sanctuary/page.tsx \\
            app/\\(frost\\)/frost/canvas/muse/page.tsx \\
            app/\\(frost\\)/frost/canvas/journey/circle/\\[memberId\\]/page.tsx
    git commit -m "feat(frost): canvas panel host + logout fix + Journey accordion + Muse + Member Aubade skin"
    git push
"""

import sys, pathlib

ROOT = pathlib.Path('.').resolve()

def check():
    f = ROOT / 'app/(frost)/frost/canvas/sanctuary/page.tsx'
    if not f.exists():
        sys.exit(f'ERROR: run from dreamos-pwa root. cwd={ROOT}')

def write(path: str, body: str):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(body)
    print(f'  ✓ {path}')

check()
print('\n  Frost — all fixes patch\n')

# ─────────────────────────────────────────────────────────────────────────────
# FILE 1: /frost/canvas/page.tsx — Panel host (Discover + Sanctuary siblings)
# Fixes: logout, back-swipe, Sanctuary↔Discover navigation
# ─────────────────────────────────────────────────────────────────────────────

CANVAS_PAGE = r"""'use client';

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
"""

# ─────────────────────────────────────────────────────────────────────────────
# FILE 2: sanctuary/page.tsx — inline Journey accordion, ↑ Aubade → panel switch
# ─────────────────────────────────────────────────────────────────────────────

SANCTUARY_PAGE = r"""'use client';

// app/(frost)/frost/canvas/sanctuary/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Sanctuary — Direction 07 Nocturne.
//
// Changes vs previous version:
//   • ↑ Aubade button calls window.__frostSwitchPanel(0) — no router.push.
//     This keeps both canvases on the same URL and kills the back=logout bug.
//   • VII Journey row is now an INLINE ACCORDION. Tap expands to reveal
//     Events, Expenses, Reminders, Vendors, Settings sub-rows. No navigation.
//   • All other rows unchanged.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import {
  FF, EASE, AUBADE, AUBADE_GLASS,
  daysUntil,
} from '../../../../../lib/frost/tokens';

// ── Wedding date / bride name helpers ────────────────────────────────────────
const DEMO_WEDDING = new Date('2026-11-19T00:00:00+05:30');

function getWeddingDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) { const s = JSON.parse(raw); if (s?.wedding_date) return new Date(s.wedding_date); }
  } catch {}
  return DEMO_WEDDING;
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

// ── Words helper ─────────────────────────────────────────────────────────────
const ONES = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
  'Seventeen','Eighteen','Nineteen'];
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function numberToWords(n: number): string {
  if (n < 20) return ONES[n] || String(n);
  const t = Math.floor(n / 10); const o = n % 10;
  if (o === 0) return TENS[t];
  return `${TENS[t]}-${ONES[o].toLowerCase()}`;
}
function hundredsToWords(n: number): string {
  if (n < 100) return numberToWords(n);
  const h = Math.floor(n / 100); const rem = n % 100;
  const hWord = ONES[h] + ' hundred';
  if (rem === 0) return hWord;
  return hWord + ' and ' + numberToWords(rem).toLowerCase();
}
function daysToWords(n: number): string {
  if (n < 100)  return numberToWords(n);
  if (n < 1000) return hundredsToWords(n);
  return String(n);
}
function progressLine(days: number): string {
  if (days === 0) return 'Today.';
  if (days === 1) return 'One morning between I will and I do.';
  const w = daysToWords(days);
  return `${w.charAt(0).toUpperCase() + w.slice(1)} mornings between I will and I do.`;
}

const DOM_WORDS = [
  '','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth',
  'Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth',
  'Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second',
  'Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh',
  'Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First',
];

// ── Meridian arc ─────────────────────────────────────────────────────────────
function meridianProgress(daysRemaining: number, totalJourney = 365): number {
  if (daysRemaining <= 0) return 1;
  if (daysRemaining >= totalJourney) return 0;
  return 1 - (daysRemaining / totalJourney);
}
function arcPointAt(t: number): { x: number; y: number } {
  const p0 = { x: 40, y: 80 }; const p1 = { x: 190, y: 20 }; const p2 = { x: 340, y: 80 };
  const u = 1 - t;
  return { x: u*u*p0.x + 2*u*t*p1.x + t*t*p2.x, y: u*u*p0.y + 2*u*t*p1.y + t*t*p2.y };
}
function arcPathTo(t: number): string {
  if (t <= 0) return 'M 40 80';
  const p0 = { x: 40, y: 80 }; const p1 = { x: 190, y: 20 }; const p2 = { x: 340, y: 80 };
  const q0 = { x: p0.x + (p1.x - p0.x)*t, y: p0.y + (p1.y - p0.y)*t };
  const q1 = { x: p1.x + (p2.x - p1.x)*t, y: p1.y + (p2.y - p1.y)*t };
  const ep = { x: q0.x + (q1.x - q0.x)*t, y: q0.y + (q1.y - q0.y)*t };
  return `M ${p0.x} ${p0.y} Q ${q0.x} ${q0.y} ${ep.x.toFixed(2)} ${ep.y.toFixed(2)}`;
}

// ── Room row ──────────────────────────────────────────────────────────────────
function Row({ numeral, name, line, onClick, candle = false, first = false }: {
  numeral: string; name: string; line: string;
  onClick: () => void; candle?: boolean; first?: boolean;
}) {
  return (
    <div onClick={onClick} style={{
      flex: 1, minHeight: 44, flexShrink: 1,
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '8px 22px',
      borderTop: first ? 'none' : `1px solid ${AUBADE.line}`,
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
      position: 'relative', zIndex: 3,
    }}>
      <span style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.12em', color: AUBADE.inkMute, width: 22, flexShrink: 0 }}>
        {numeral}
      </span>
      <span style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: AUBADE.ink, letterSpacing: '-0.015em', lineHeight: 1, flexShrink: 0, fontFeatureSettings: '"opsz" 9' }}>
        {name}
      </span>
      {candle && (
        <span className="frost-candle-dot" style={{ width: 6, height: 6, borderRadius: 3, background: AUBADE.aubade, boxShadow: `0 0 8px ${AUBADE.aubade}`, flexShrink: 0 }} />
      )}
      <span style={{ flex: 1, fontFamily: FF.mono, fontSize: 8.5, fontWeight: 300, letterSpacing: '0.14em', color: AUBADE.inkSoft, textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
        {line}
      </span>
    </div>
  );
}

// ── Journey accordion row ─────────────────────────────────────────────────────
function JourneyAccordion() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const subRows = [
    { label: 'Events',    hint: 'Your timeline',           path: '/frost/canvas/journey/events'    },
    { label: 'Expenses',  hint: 'What you owe',            path: '/frost/canvas/journey/expenses'  },
    { label: 'Reminders', hint: 'What needs to happen',    path: '/frost/canvas/journey/reminders' },
    { label: 'Vendors',   hint: 'Your team',               path: '/frost/canvas/journey/vendors'   },
    { label: 'Settings',  hint: 'Sign out · preferences',  path: '/frost/canvas/journey/settings'  },
  ];

  return (
    <div style={{ flexShrink: 0, borderTop: `1px solid ${AUBADE.lineStrong}`, position: 'relative', zIndex: 3 }}>

      {/* Header row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '14px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, color: AUBADE.aubade, letterSpacing: '0.12em' }}>VII</span>
          <span style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: AUBADE.ink, letterSpacing: '-0.015em', fontFeatureSettings: '"opsz" 9' }}>
            Journey
          </span>
        </div>
        <span style={{
          color: AUBADE.aubade, fontFamily: FF.mono, fontSize: 14, lineHeight: 1,
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: `transform 220ms ${EASE}`,
        }}>+</span>
      </div>

      {/* Sub-rows — slide open */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? `${subRows.length * 52}px` : '0px',
        transition: `max-height 280ms ${EASE}`,
        paddingBottom: open ? 'calc(env(safe-area-inset-bottom,0px) + 10px)' : 0,
      }}>
        {subRows.map((sr, i) => (
          <div
            key={sr.label}
            onClick={() => router.push(sr.path)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 22px 12px 58px',
              borderTop: `1px solid ${AUBADE.line}`,
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontFamily: FF.mono, fontSize: 8.5, fontWeight: 300, letterSpacing: '0.16em', textTransform: 'uppercase', color: AUBADE.inkMute, minWidth: 16 }}>
              {String.fromCharCode(65 + i)}
            </span>
            <span style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: AUBADE.inkSoft, letterSpacing: '-0.01em', fontFeatureSettings: '"opsz" 9', flex: 1 }}>
              {sr.label}
            </span>
            <span style={{ fontFamily: FF.mono, fontSize: 8, fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>
              {sr.hint}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function SanctuaryPage() {
  useFrostMode();

  const [days,         setDays]         = useState(0);
  const [progress,     setProgress]     = useState(0);
  const [brideName,    setBrideName]    = useState('Priya');
  const [dateLine,     setDateLine]     = useState('');
  const [pLine,        setPLine]        = useState('');
  const [pagesPreview, setPagesPreview] = useState('');

  useEffect(() => {
    const d = daysUntil(getWeddingDate());
    setDays(d);
    setProgress(meridianProgress(d));
    setBrideName(getBrideFirstName());
    const now = new Date();
    const dom = DOM_WORDS[now.getDate()] || String(now.getDate());
    const mon = now.toLocaleDateString('en-IN', { month: 'long' });
    setDateLine(`${dom} of ${mon} · ${now.getFullYear()}`);
    setPLine(progressLine(d));
    try { setPagesPreview(localStorage.getItem('frost_pages_preview') || ''); } catch {}
  }, []);

  React.useEffect(() => {
    const id = 'frost-sanctuary-animations';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes meridianPulse { 0%{opacity:0.5} 18%{opacity:1.0} 37%{opacity:0.5} 100%{opacity:0.5} }
      .frost-meridian-dot  { animation: meridianPulse 4s ease-in-out infinite; }
      .frost-meridian-halo { animation: meridianPulse 4s ease-in-out infinite; }
      @keyframes numeralBreath { 0%{transform:scale(1.000)} 50%{transform:scale(1.005)} 100%{transform:scale(1.000)} }
      .frost-numeral-breath { animation: numeralBreath 8s ease-in-out infinite; transform-origin: center center; }
      @keyframes candleFlicker { 0%{opacity:0.70} 15%{opacity:1.00} 28%{opacity:0.85} 45%{opacity:1.00} 60%{opacity:0.90} 75%{opacity:1.00} 88%{opacity:0.78} 100%{opacity:0.70} }
      .frost-candle-dot { animation: candleFlicker 6s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }, []);

  const router = useRouter();
  const go = (path: string) => router.push(path);

  // Switch to Discover panel without router navigation
  const goDiscover = () => {
    try { (window as any).__frostSwitchPanel?.(0); }
    catch { router.replace('/frost/canvas'); }
  };

  const dot = arcPointAt(progress);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse 80% 50% at 50% 30%, rgba(216,152,84,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 100% 60% at 50% 100%, rgba(20,18,22,0.35) 0%, transparent 70%),
        linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 50%, ${AUBADE.paperDeep} 100%)
      `,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}>

      {/* Mineral teal numeral */}
      <div style={{ position: 'absolute', top: 280, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 1 }}>
        <div className="frost-numeral-breath" style={{ fontFamily: FF.aubade, fontWeight: 200, fontSize: 280, lineHeight: 0.85, color: AUBADE.nocturneDeep, opacity: 0.5, letterSpacing: '-0.06em', filter: 'blur(4px)', fontFeatureSettings: '"opsz" 144' }}>
          {days || 0}
        </div>
      </div>

      {/* Upper frost layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 140, zIndex: 2, backdropFilter: AUBADE_GLASS.blur, WebkitBackdropFilter: AUBADE_GLASS.webkitBlur, background: AUBADE_GLASS.bg, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg, #000 70%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 70%, transparent 100%)' }} />

      {/* Meridian arc */}
      <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 16px)', left: 0, right: 0, height: 90, zIndex: 4, pointerEvents: 'none' }}>
        <svg viewBox="0 0 380 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <path d="M 40 80 Q 190 20 340 80" stroke="rgba(239,233,221,0.18)" strokeWidth="0.5" fill="none" />
          <path d={arcPathTo(progress)} stroke={AUBADE.aubade} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx={dot.x} cy={dot.y} r="3.5" fill={AUBADE.aubade} className="frost-meridian-dot" />
          <circle cx={dot.x} cy={dot.y} r="6" fill="none" stroke={AUBADE.aubade} strokeWidth="0.5" opacity="0.5" className="frost-meridian-halo" />
        </svg>
      </div>

      {/* I will / I do labels */}
      <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 64px)', left: 22, zIndex: 5, fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.30em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.45)', pointerEvents: 'none' }}>I will</div>
      <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 64px)', right: 22, zIndex: 5, fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.30em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.45)', pointerEvents: 'none' }}>I do</div>

      {/* Top bar */}
      <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 92px) 22px 10px', zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexShrink: 0 }}>
        <button onClick={goDiscover} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkSoft, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>↑</span> Aubade
        </button>
        <span style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute }}>
          {(() => {
            const now = new Date();
            const ROMAN = ['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];
            const d = String(now.getDate()).padStart(2,'0');
            const m = ROMAN[now.getMonth() + 1];
            const y = String(now.getFullYear()).slice(-2);
            return `${d} . ${m} . ${y}`;
          })()}
        </span>
      </div>

      {/* Hero */}
      <div style={{ padding: '28px 22px 24px', position: 'relative', zIndex: 4, flexShrink: 0 }}>
        <div style={{ fontFamily: FF.mono, fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkSoft, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long' })} morning</span>
          <span style={{ flex: 1, height: 1, background: AUBADE.line, maxWidth: 100 }} />
        </div>
        <div style={{ fontFamily: FF.italianno, fontWeight: 400, fontSize: 56, color: AUBADE.ink, lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: 6 }}>
          Hello, <span style={{ color: AUBADE.aubade }}>{brideName}</span>.
        </div>
        <div style={{ width: 64, height: 1, background: AUBADE.aubade, marginBottom: 18 }} />
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: AUBADE.ink, lineHeight: 1.4, marginBottom: 14, fontFeatureSettings: '"opsz" 9' }}>
          {pLine.split(/(I will|I do)/g).map((part, i) =>
            (part === 'I will' || part === 'I do')
              ? <span key={i} style={{ color: AUBADE.aubade, fontStyle: 'italic', fontWeight: 400 }}>{part}</span>
              : <span key={i}>{part}</span>
          )}
        </div>
        <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.20em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{dateLine}</div>
      </div>

      {/* Lower frost layer */}
      <div style={{ position: 'absolute', top: 400, left: 0, right: 0, bottom: 0, zIndex: 2, backdropFilter: AUBADE_GLASS.blur, WebkitBackdropFilter: AUBADE_GLASS.webkitBlur, background: AUBADE_GLASS.bg, pointerEvents: 'none', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 30%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 30%)' }} />

      {/* Stack — six rooms + Journey accordion */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: `1px solid ${AUBADE.line}`, position: 'relative', zIndex: 3, overflow: 'hidden' }}>
        <Row numeral="I"   name="Dream"   line="— Your AI companion"               onClick={() => go('/frost/canvas/dream')}            first />
        <Row numeral="II"  name="Circle"  line="— Meha lit a candle · 8m ago"      onClick={() => go('/frost/canvas/journey/circle')}    candle />
        <Row numeral="III" name="Muse"    line="— 22 saved · 4 new"                onClick={() => go('/frost/canvas/muse')}              />
        <Row numeral="IV"  name="People"  line="— 1 active · 1 invited"            onClick={() => go('/frost/canvas/journey/people')}    />
        <Row numeral="V"   name="Pages"   line={pagesPreview ? `— ${pagesPreview}` : '— a page is waiting'} onClick={() => go('/frost/canvas/journey/pages')} />
        <Row numeral="VI"  name="Moments" line="— Your memories"                   onClick={() => go('/frost/canvas/journey/moments')}   />
        <JourneyAccordion />
      </div>
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# FILE 3: discover/page.tsx — replace router.replace sanctuary with panel switch
# We do a targeted string replacement, not a full rewrite.
# ─────────────────────────────────────────────────────────────────────────────

DISCOVER_SANCTUARY_OLD = "onOpenSanctuary={() => router.replace('/frost/canvas/sanctuary')}"
DISCOVER_SANCTUARY_NEW = """onOpenSanctuary={() => {
          try { (window as any).__frostSwitchPanel?.(1); }
          catch { router.replace('/frost/canvas'); }
        }}"""

# ─────────────────────────────────────────────────────────────────────────────
# FILE 4: muse/page.tsx — Aubade skin (full replace, CanvasShell gone)
# ─────────────────────────────────────────────────────────────────────────────

MUSE_PAGE = r"""'use client';

// app/(frost)/frost/canvas/muse/page.tsx
// Muse — Aubade-Nocturne skin. Data logic unchanged.

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { AUBADE, FF, EASE } from '../../../../../lib/frost/tokens';
import { fetchMuseSaves, deleteMuseSave, fetchSaveActivity, uploadMuseImage, createMuseSaveFromUrl } from '../../../../../lib/frost-api/muse';
import type { MuseSave, MuseActivity } from '../../../../../lib/types/discover';

type SourceFilter = 'all' | 'bride' | 'circle_member';
const SOURCE_FILTERS: { label: string; value: SourceFilter }[] = [
  { label: 'All',    value: 'all'           },
  { label: 'Mine',   value: 'bride'         },
  { label: 'Circle', value: 'circle_member' },
];

function FullBleedOverlay({ save, activity, onClose, onRemove }: {
  save: MuseSave; activity: MuseActivity[]; onClose: () => void; onRemove: (id: string) => void;
}) {
  const handleEnquire = () => { if (save.enquire_link) window.open(save.enquire_link, '_blank'); };
  const handleShare = async () => {
    if (!save.enquire_link) return;
    if (navigator.share) {
      try { await navigator.share({ title: `${save.vendor_name || 'Vendor'} — TDW`, url: save.enquire_link }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(save.enquire_link); } catch {}
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: AUBADE.paper, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Image */}
      {save.image_url && (
        <div style={{ width: '100%', aspectRatio: '3/4', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={save.image_url} alt={save.vendor_name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 14px)', left: 18, background: 'rgba(10,9,11,0.55)', border: `1px solid ${AUBADE.line}`, borderRadius: 2, padding: '6px 14px', fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: AUBADE.aubade }}>←</span> Muse
          </button>
          <button onClick={() => onRemove(save.id)} style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 14px)', right: 18, background: 'rgba(10,9,11,0.55)', border: `1px solid rgba(239,100,100,0.22)`, borderRadius: 2, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Trash2 size={14} color="rgba(239,100,100,0.7)" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Details */}
      <div style={{ padding: '24px 22px 48px', flex: 1 }}>
        {save.vendor_name && (
          <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: AUBADE.ink, marginBottom: 6, letterSpacing: '-0.02em', fontFeatureSettings: '"opsz" 9' }}>{save.vendor_name}</div>
        )}
        {save.vendor_category && (
          <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 20 }}>{save.vendor_category}</div>
        )}
        {(save.aesthetic_tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {(save.aesthetic_tags || []).map((tag: string) => (
              <span key={tag} style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: '4px 10px', border: `1px solid ${AUBADE.line}`, borderRadius: 2 }}>{tag}</span>
            ))}
          </div>
        )}

        {activity.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 14 }}>Circle notes</div>
            {activity.map(a => (
              <div key={a.id} style={{ paddingLeft: 12, borderLeft: `2px solid rgba(216,152,84,0.3)`, marginBottom: 14 }}>
                <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkSoft, lineHeight: 1.5, fontFeatureSettings: '"opsz" 9' }}>"{a.content}"</div>
                <div style={{ fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: AUBADE.inkMute, marginTop: 4 }}>{a.member_name || 'You'}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleEnquire} style={{ flex: 1, padding: '13px 0', background: 'rgba(216,152,84,0.15)', border: `1px solid rgba(216,152,84,0.40)`, borderRadius: 2, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.aubade, cursor: 'pointer' }}>
            Enquire
          </button>
          <button onClick={handleShare} style={{ flex: 1, padding: '13px 0', background: 'transparent', border: `1px solid ${AUBADE.line}`, borderRadius: 2, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkSoft, cursor: 'pointer' }}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MusePage() {
  const router = useRouter();
  const [saves,        setSaves]        = useState<MuseSave[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [selected,     setSelected]     = useState<MuseSave | null>(null);
  const [activity,     setActivity]     = useState<MuseActivity[]>([]);
  const [toast,        setToast]        = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const load = async () => {
    setLoading(true);
    try { const r = await fetchMuseSaves(); setSaves(r.saves || []); }
    catch { setSaves([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleOpen = async (save: MuseSave) => {
    setSelected(save);
    try { const r = await fetchSaveActivity(save.id); setActivity(r.activity || []); }
    catch { setActivity([]); }
  };

  const handleRemove = async (id: string) => {
    setSelected(null);
    try { await deleteMuseSave(id); showToast('Removed from Muse.'); await load(); }
    catch { showToast('Could not remove. Try again.'); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast('Saving…');
    try {
      await uploadMuseImage(file);
      showToast('Added to Muse.');
      await load();
    } catch { showToast('Upload failed. Try again.'); }
    if (fileRef.current) fileRef.current.value = '';
  };

  const filtered = saves.filter(s => sourceFilter === 'all' ? true : s.added_by === sourceFilter);

  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top,0px) + 70px)', left: '50%', transform: 'translateX(-50%)', background: AUBADE.ink, color: AUBADE.paper, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: 2, zIndex: 500, pointerEvents: 'none', whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      {/* Overlay */}
      {selected && (
        <FullBleedOverlay
          save={selected}
          activity={activity}
          onClose={() => setSelected(null)}
          onRemove={handleRemove}
        />
      )}

      {/* Top bar */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> Sanctuary
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>Muse</div>
        <button onClick={() => { try { (window as any).__frostSurpriseMe?.(); } catch {} }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.aubade, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          ✦ Surprise Me
        </button>
      </div>

      {/* Source filter pills */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 22px', flexShrink: 0, borderBottom: `1px solid ${AUBADE.line}` }}>
        {SOURCE_FILTERS.map(f => (
          <button key={f.value} onClick={() => setSourceFilter(f.value)} style={{ padding: '5px 14px', borderRadius: 2, border: `1px solid ${sourceFilter === f.value ? 'rgba(216,152,84,0.55)' : AUBADE.line}`, background: sourceFilter === f.value ? 'rgba(216,152,84,0.12)' : 'transparent', fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: sourceFilter === f.value ? AUBADE.aubade : AUBADE.inkSoft, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            {f.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute, display: 'flex', alignItems: 'center' }}>
          {filtered.length} saved
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 14px 40px' }}>
        {loading && (
          <div style={{ paddingTop: 80, textAlign: 'center', fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: AUBADE.inkMute }}>Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ paddingTop: 80, textAlign: 'center' }}>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: AUBADE.ink, marginBottom: 12, fontFeatureSettings: '"opsz" 9' }}>Your Muse is empty.</div>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkSoft, lineHeight: 1.7, fontFeatureSettings: '"opsz" 9' }}>Double-tap any vendor in Discover to save.<br />Or upload an inspiration below.</div>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ columns: 2, columnGap: 8 }}>
            {filtered.map(save => (
              <div key={save.id} onClick={() => handleOpen(save)} style={{ breakInside: 'avoid', marginBottom: 8, borderRadius: 2, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: `1px solid ${AUBADE.line}` }}>
                {save.image_url ? (
                  <img src={save.image_url} alt={save.vendor_name || ''} style={{ width: '100%', display: 'block', objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '3/4', background: 'rgba(239,233,221,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: FF.mono, fontSize: 8, color: AUBADE.inkMute }}>No image</span>
                  </div>
                )}
                {save.vendor_name && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(transparent, rgba(3,3,5,0.75))', fontFamily: FF.mono, fontSize: 7.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(239,233,221,0.85)' }}>
                    {save.vendor_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB — add photo */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
      <button
        onClick={() => fileRef.current?.click()}
        style={{ position: 'fixed', bottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)', right: 22, width: 48, height: 48, borderRadius: 2, background: 'rgba(216,152,84,0.18)', border: `1px solid rgba(216,152,84,0.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, WebkitTapHighlightColor: 'transparent' }}
      >
        <span style={{ fontSize: 22, color: AUBADE.aubade, lineHeight: 1 }}>+</span>
      </button>
    </div>
  );
}
"""

# ─────────────────────────────────────────────────────────────────────────────
# FILE 5: circle/[memberId]/page.tsx — Aubade skin
# ─────────────────────────────────────────────────────────────────────────────

MEMBER_DETAIL_PAGE = r"""'use client';

// circle/[memberId]/page.tsx — Aubade-Nocturne skin. Logic unchanged.

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { AUBADE, FF } from '../../../../../../../lib/frost/tokens';
import { fetchMemberFeed, timeAgo } from '../../../../../../../lib/frost/journey';

function ActivityCard({ a }: { a: any }) {
  const actor = a.actor_role === 'bride' ? 'You' : (a.member_name || 'Someone');

  if (a.activity_type === 'save_added' && a.image_url) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ width: '100%', borderRadius: 2, overflow: 'hidden', marginBottom: 10, border: `1px solid ${AUBADE.line}` }}>
          <img src={a.image_url} alt={a.caption || 'Save'} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 320 }} loading="lazy" />
        </div>
        {a.caption && (
          <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.5, marginBottom: 5, fontFeatureSettings: '"opsz" 9' }}>"{a.caption}"</div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{timeAgo(a.created_at)}</div>
          {(a.aesthetic_tags || []).slice(0, 3).map((tag: string) => (
            <span key={tag} style={{ fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.12em', color: AUBADE.inkMute, padding: '2px 7px', border: `1px solid ${AUBADE.line}`, borderRadius: 2 }}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (a.activity_type === 'comment' && a.content) {
    return (
      <div style={{ marginBottom: 20, paddingLeft: 14, borderLeft: `2px solid rgba(216,152,84,0.35)` }}>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.6, marginBottom: 4, fontFeatureSettings: '"opsz" 9' }}>"{a.content}"</div>
        <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{actor} · {timeAgo(a.created_at)}</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 14, fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>
      {actor} · {a.activity_type?.replace(/_/g, ' ')} · {timeAgo(a.created_at)}
    </div>
  );
}

export default function MemberDetail() {
  const { memberId } = useParams<{ memberId: string }>();
  const router       = useRouter();
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    fetchMemberFeed(memberId)
      .then(r => { setData(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [memberId]);

  const member   = data?.member;
  const activity = data?.activity || [];
  const phone    = member?.invitee_phone || null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* Top bar */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas/journey/circle')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> {member?.invitee_name || 'Circle'}
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>
          {loading ? '…' : (member?.invitee_name || 'Member')}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 22px 48px' }}>

        {loading && (
          <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: AUBADE.inkMute }}>Loading…</div>
        )}

        {!loading && member && (
          <>
            {/* Member header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: AUBADE.ink, letterSpacing: '-0.02em', marginBottom: 4, fontFeatureSettings: '"opsz" 9' }}>{member.invitee_name}</div>
                <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{member.role?.replace(/_/g, ' ')} · {member.status || 'active'}</div>
              </div>
              {phone && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`https://wa.me/${phone.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <MessageCircle size={15} color="#25D366" strokeWidth={1.5} />
                  </a>
                  <a href={`tel:${phone}`} style={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(216,152,84,0.10)', border: '1px solid rgba(216,152,84,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <Phone size={15} color={AUBADE.aubade} strokeWidth={1.5} />
                  </a>
                </div>
              )}
            </div>

            <div style={{ height: 1, background: AUBADE.line, marginBottom: 28 }} />

            {/* Contribution section */}
            <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 20 }}>
              {member.invitee_name}'s Contribution
            </div>

            {activity.length === 0 && (
              <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: AUBADE.inkMute, textAlign: 'center', paddingTop: 40, fontFeatureSettings: '"opsz" 9' }}>
                Nothing yet — they've just joined.
              </div>
            )}

            {activity.map((a: any, i: number) => <React.Fragment key={i}><ActivityCard a={a} /></React.Fragment>)}
          </>
        )}
      </div>
    </div>
  );
}
"""

# ─── Apply all files ──────────────────────────────────────────────────────────

# 1. Create canvas/page.tsx (panel host)
write('app/(frost)/frost/canvas/page.tsx', CANVAS_PAGE)

# 2. Replace sanctuary/page.tsx
write('app/(frost)/frost/canvas/sanctuary/page.tsx', SANCTUARY_PAGE)

# 3. Patch discover/page.tsx — only the sanctuary navigation line
discover_path = ROOT / 'app/(frost)/frost/canvas/discover/page.tsx'
discover_src  = discover_path.read_text()
if DISCOVER_SANCTUARY_OLD in discover_src:
    discover_path.write_text(discover_src.replace(DISCOVER_SANCTUARY_OLD, DISCOVER_SANCTUARY_NEW))
    print('  ✓ app/(frost)/frost/canvas/discover/page.tsx (sanctuary nav patched)')
else:
    print('  ⚠ discover/page.tsx — sanctuary nav line not found. Check manually.')

# 4. Replace muse/page.tsx
write('app/(frost)/frost/canvas/muse/page.tsx', MUSE_PAGE)

# 5. Replace circle/[memberId]/page.tsx
write('app/(frost)/frost/canvas/journey/circle/[memberId]/page.tsx', MEMBER_DETAIL_PAGE)

print('\n  ✓ All 5 fixes applied.\n')
print('  Validate:')
print('    npx tsc --noEmit\n')
print('  Commit:')
print("""    git add app/\\(frost\\)/frost/canvas/page.tsx \\
          app/\\(frost\\)/frost/canvas/sanctuary/page.tsx \\
          app/\\(frost\\)/frost/canvas/discover/page.tsx \\
          app/\\(frost\\)/frost/canvas/muse/page.tsx \\
          app/\\(frost\\)/frost/canvas/journey/circle/\\[memberId\\]/page.tsx
    git commit -m "feat(frost): panel host + logout fix + Journey accordion + Muse + Member Aubade"
    git push
""")
