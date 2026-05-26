'use client';

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
