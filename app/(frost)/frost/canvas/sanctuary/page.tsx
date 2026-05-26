'use client';

// app/(frost)/frost/canvas/sanctuary/page.tsx
// ──────────────────────────────────────────────────────────────────────────
// Sanctuary — Direction 07 (Aubade & Nocturne) · Phase 1 · STATIC ONLY.
//
// The bride's interior room. Nocturne. Cold paper. Mineral teal numeral
// living at the back of two frosted-glass layers. Italianno signature on
// her name. Meridian arc tracing her path from "I will" to "I do". Seven
// rooms: I Dream · II Circle · III Muse · IV People · V Pages · VI Moments
// · VII Journey.
//
// PHASE 1 SHIPS STATIC. No motion yet. The motion (heartbeat on the
// meridian dot, breath-drift on the numeral, candle flicker on Circle,
// daily greeting ribbon) lands in Phase 2 after we look at the room
// standing still and confirm the geometry, type, and palette are right.
//
// Phase 3 wires Pages interior surface and real entry data.
// Phase 4 builds Aubade (Discover).
// Phase 5 builds the Aubade↔Nocturne swipe transition.
// ──────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import {
  FF, FROST_COPY, EASE, AUBADE, AUBADE_GLASS,
  daysUntil,
} from '../../../../../lib/frost/tokens';

// ── Wedding date resolver — same logic as before ─────────────────────────
const DEMO_WEDDING = new Date('2026-06-25T00:00:00+05:30');

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

// ── Words-vs-numerals rule for the progress line ─────────────────────────
// Under 100 → words ("ninety-three mornings"). 100+ → numerals.
// Below 10 special line: "Nine mornings remain." (drama at the end)
// At zero: "Today."
const ONES = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
  'Seventeen','Eighteen','Nineteen'];
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function numberToWords(n: number): string {
  if (n < 20) return ONES[n] || String(n);
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (o === 0) return TENS[t];
  return `${TENS[t]}-${ONES[o].toLowerCase()}`;
}

function progressLine(days: number): string {
  if (days === 0)  return 'Today.';
  if (days === 1)  return 'One morning between I will and I do.';
  if (days < 100)  return `${numberToWords(days)} mornings between I will and I do.`;
  return `${days} mornings between I will and I do.`;
}

// ── Date for the mono footer ─────────────────────────────────────────────
const DOM_WORDS = [
  '','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth',
  'Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth',
  'Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second',
  'Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh',
  'Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First',
];

// ── Meridian arc — SVG calc ──────────────────────────────────────────────
// Background path: full curve from "I will" (left) to "I do" (right).
// Progress path: same curve, stopped at today position.
// Total journey: assumed engagement → wedding window. We compute progress
// as 1 - (daysRemaining / totalJourneyDays). Fallback total = 365 days
// if engagement date unknown — keeps the arc visually meaningful.
function meridianProgress(daysRemaining: number, totalJourney = 365): number {
  if (daysRemaining <= 0) return 1;
  if (daysRemaining >= totalJourney) return 0;
  return 1 - (daysRemaining / totalJourney);
}

// Quadratic bezier point at parameter t in [0,1] for the arc
// Control point at midpoint, top of arc. Path: M 40 80 Q 190 20 340 80
function arcPointAt(t: number): { x: number; y: number } {
  const p0 = { x: 40,  y: 80 };
  const p1 = { x: 190, y: 20 };  // control
  const p2 = { x: 340, y: 80 };
  const u = 1 - t;
  return {
    x: u*u*p0.x + 2*u*t*p1.x + t*t*p2.x,
    y: u*u*p0.y + 2*u*t*p1.y + t*t*p2.y,
  };
}

// Generate a SVG path string up to parameter t (for the saffron progress arc)
function arcPathTo(t: number): string {
  if (t <= 0) return 'M 40 80';
  // Approximate the partial bezier with a quadratic of its own
  // by splitting at t via De Casteljau's algorithm.
  const p0 = { x: 40,  y: 80 };
  const p1 = { x: 190, y: 20 };
  const p2 = { x: 340, y: 80 };
  const q0 = {
    x: p0.x + (p1.x - p0.x) * t,
    y: p0.y + (p1.y - p0.y) * t,
  };
  const q1 = {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
  const endpoint = {
    x: q0.x + (q1.x - q0.x) * t,
    y: q0.y + (q1.y - q0.y) * t,
  };
  return `M ${p0.x} ${p0.y} Q ${q0.x} ${q0.y} ${endpoint.x.toFixed(2)} ${endpoint.y.toFixed(2)}`;
}

// ── Row — single chapel in the building ──────────────────────────────────
function Row({
  numeral, name, line, onClick, candle = false, first = false,
}: {
  numeral: string;
  name:    string;
  line:    string;
  onClick: () => void;
  candle?: boolean;
  first?:  boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        minHeight: 44,
        flexShrink: 1,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '8px 22px',
        borderTop: first ? 'none' : `1px solid ${AUBADE.line}`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        zIndex: 3,
      }}
    >
      <span style={{
        fontFamily: FF.mono,
        fontSize: 9,
        fontWeight: 300,
        letterSpacing: '0.12em',
        color: AUBADE.inkMute,
        width: 22,
        flexShrink: 0,
      }}>
        {numeral}
      </span>

      <span style={{
        fontFamily: FF.aubade,
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 19,
        color: AUBADE.ink,
        letterSpacing: '-0.015em',
        lineHeight: 1,
        flexShrink: 0,
        fontFeatureSettings: '"opsz" 9',
      }}>
        {name}
      </span>

      {candle && (
        <span style={{
          width: 6, height: 6, borderRadius: 3,
          background: AUBADE.aubade,
          boxShadow: `0 0 8px ${AUBADE.aubade}`,
          flexShrink: 0,
        }} />
      )}

      <span style={{
        flex: 1,
        fontFamily: FF.mono,
        fontSize: 8.5,
        fontWeight: 300,
        letterSpacing: '0.14em',
        color: AUBADE.inkSoft,
        textTransform: 'uppercase',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'right',
      }}>
        {line}
      </span>
    </div>
  );
}

// ── Journey row — separated from the rest by lineStrong border ──────────
function JourneyRow({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: '14px 22px calc(env(safe-area-inset-bottom,0px) + 14px)',
        borderTop: `1px solid ${AUBADE.lineStrong}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        zIndex: 3,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          fontFamily: FF.mono,
          fontSize: 9,
          fontWeight: 300,
          color: AUBADE.aubade,
          letterSpacing: '0.12em',
        }}>VII</span>
        <span style={{
          fontFamily: FF.aubade,
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 22,
          color: AUBADE.ink,
          letterSpacing: '-0.015em',
          fontFeatureSettings: '"opsz" 9',
        }}>Journey</span>
      </div>
      <span style={{
        color: AUBADE.aubade,
        fontFamily: FF.mono,
        fontSize: 14,
        lineHeight: 1,
      }}>+</span>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────
export default function SanctuaryPage() {
  const router = useRouter();
  // Mode context kept for compat — Aubade-Nocturne is dark-first.
  // Light variant lands later as "Daylight"; we ignore homeMode for now.
  useFrostMode();

  const [days,         setDays]         = useState(0);
  const [progress,     setProgress]     = useState(0);
  const [brideName,    setBrideName]    = useState('Priya');
  const [dateLine,     setDateLine]     = useState('');
  const [pLine,        setPLine]        = useState('');

  useEffect(() => {
    const d = daysUntil(getWeddingDate());
    setDays(d);
    setProgress(meridianProgress(d));
    setBrideName(getBrideFirstName());

    const now = new Date();
    const dom = DOM_WORDS[now.getDate()] || String(now.getDate());
    const mon = now.toLocaleDateString('en-IN', { month: 'long' });
    const yr  = now.getFullYear();
    setDateLine(`${dom} of ${mon} · ${yr}`);

    setPLine(progressLine(d));
  }, []);

  const go = (path: string) => router.push(path);

  const dot = arcPointAt(progress);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: `
        radial-gradient(ellipse 80% 50% at 50% 30%, rgba(216,152,84,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 100% 60% at 50% 100%, rgba(40,28,18,0.35) 0%, transparent 70%),
        linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 50%, ${AUBADE.paperDeep} 100%)
      `,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}>

      {/* ── Mineral teal numeral — lives at the back, behind glass ──── */}
      <div style={{
        position: 'absolute',
        top: 95,
        left: 0, right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        <div style={{
          fontFamily: FF.aubade,
          fontWeight: 200,
          fontSize: 280,
          lineHeight: 0.85,
          color: AUBADE.nocturneDeep,
          opacity: 0.5,
          letterSpacing: '-0.06em',
          filter: 'blur(4px)',
          fontFeatureSettings: '"opsz" 144',
        }}>
          {days || 0}
        </div>
      </div>

      {/* ── Upper frost layer — covers meridian + top bar zone ──────── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 140,
        zIndex: 2,
        backdropFilter: AUBADE_GLASS.blur,
        WebkitBackdropFilter: AUBADE_GLASS.webkitBlur,
        background: AUBADE_GLASS.bg,
        pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(180deg, #000 70%, transparent 100%)',
        maskImage:        'linear-gradient(180deg, #000 70%, transparent 100%)',
      }} />

      {/* ── Meridian arc — above the upper frost ───────────────────── */}
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
        left: 0, right: 0,
        height: 90,
        zIndex: 4,
        pointerEvents: 'none',
      }}>
        <svg
          viewBox="0 0 380 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {/* Background arc — full curve */}
          <path
            d="M 40 80 Q 190 20 340 80"
            stroke="rgba(239,233,221,0.18)"
            strokeWidth="0.5"
            fill="none"
          />
          {/* Progress arc — saffron, ends at today */}
          <path
            d={arcPathTo(progress)}
            stroke={AUBADE.aubade}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Today dot — static for Phase 1 */}
          <circle
            cx={dot.x}
            cy={dot.y}
            r="3.5"
            fill={AUBADE.aubade}
          />
          {/* Halo — static for Phase 1, will heartbeat in Phase 2 */}
          <circle
            cx={dot.x}
            cy={dot.y}
            r="6"
            fill="none"
            stroke={AUBADE.aubade}
            strokeWidth="0.5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* "I will" / "I do" labels — on top of meridian zone */}
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0px) + 56px)',
        left: 22,
        zIndex: 5,
        fontFamily: FF.mono,
        fontSize: 8,
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
        color: 'rgba(239,233,221,0.45)',
        pointerEvents: 'none',
      }}>
        I will
      </div>
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top, 0px) + 56px)',
        right: 22,
        zIndex: 5,
        fontFamily: FF.mono,
        fontSize: 8,
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
        color: 'rgba(239,233,221,0.45)',
        pointerEvents: 'none',
      }}>
        I do
      </div>

      {/* ── Top bar — Aubade left link · 26.v.26 right ──────────────── */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top, 0px) + 92px) 22px 10px',
        zIndex: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative',
        flexShrink: 0,
      }}>
        <button
          onClick={() => go('/frost/canvas/discover')}
          style={{
            background: 'transparent', border: 'none', padding: 0,
            fontFamily: FF.mono,
            fontSize: 9,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: AUBADE.inkSoft,
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ color: AUBADE.aubade }}>↑</span>
          Aubade
        </button>
        <span style={{
          fontFamily: FF.mono,
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: AUBADE.inkMute,
        }}>
          {(() => {
            // 26 . v . 26  — Roman month, dot-separated. Universal museum date.
            const now = new Date();
            const ROMAN = ['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];
            const d  = String(now.getDate()).padStart(2, '0');
            const m  = ROMAN[now.getMonth() + 1];
            const y  = String(now.getFullYear()).slice(-2);
            return `${d} . ${m} . ${y}`;
          })()}
        </span>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div style={{
        padding: '28px 22px 24px',
        position: 'relative',
        zIndex: 4,
        flexShrink: 0,
        textAlign: 'left',
      }}>
        {/* mono greeting */}
        <div style={{
          fontFamily: FF.mono,
          fontSize: 9.5,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: AUBADE.inkSoft,
          marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>Tuesday morning</span>
          <span style={{
            flex: 1, height: 1,
            background: AUBADE.line,
            maxWidth: 100,
          }} />
        </div>

        {/* Italianno signature — Hello, Priya. */}
        <div style={{
          fontFamily: FF.italianno,
          fontWeight: 400,
          fontSize: 56,
          color: AUBADE.ink,
          lineHeight: 0.95,
          letterSpacing: '-0.01em',
          marginBottom: 6,
        }}>
          Hello, <span style={{ color: AUBADE.aubade }}>{brideName}</span>.
        </div>

        {/* saffron rule */}
        <div style={{
          width: 64, height: 1,
          background: AUBADE.aubade,
          marginBottom: 18,
        }} />

        {/* Fraunces italic progress line */}
        <div style={{
          fontFamily: FF.aubade,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 19,
          color: AUBADE.ink,
          lineHeight: 1.4,
          marginBottom: 14,
          fontFeatureSettings: '"opsz" 9',
        }}>
          {pLine.split(/(I will|I do)/g).map((part, i) =>
            (part === 'I will' || part === 'I do')
              ? <span key={i} style={{ color: AUBADE.aubade, fontStyle: 'italic', fontWeight: 400 }}>{part}</span>
              : <span key={i}>{part}</span>
          )}
        </div>

        {/* mono date footer */}
        <div style={{
          fontFamily: FF.mono,
          fontSize: 9,
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color: AUBADE.inkMute,
        }}>
          {dateLine}
        </div>
      </div>

      {/* ── Lower frost layer — covers stack zone ──────────────────── */}
      <div style={{
        position: 'absolute',
        top: 400,
        left: 0, right: 0, bottom: 0,
        zIndex: 2,
        backdropFilter: AUBADE_GLASS.blur,
        WebkitBackdropFilter: AUBADE_GLASS.webkitBlur,
        background: AUBADE_GLASS.bg,
        pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 30%)',
        maskImage:        'linear-gradient(180deg, transparent 0%, #000 30%)',
      }} />

      {/* ── Stack — six rooms + Journey ─────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        borderTop: `1px solid ${AUBADE.line}`,
        position: 'relative',
        zIndex: 3,
        overflow: 'hidden',
      }}>
        <Row numeral="I"   name="Dream"   line="— Something will go wrong"          onClick={() => go('/frost/canvas/dream')}            first />
        <Row numeral="II"  name="Circle"  line="— Meha lit a candle · 8m ago"       onClick={() => go('/frost/canvas/journey/circle')}    candle />
        <Row numeral="III" name="Muse"    line="— 22 saved · 4 new"                 onClick={() => go('/frost/canvas/muse')}              />
        <Row numeral="IV"  name="People"  line="— 1 active · 1 invited"             onClick={() => go('/frost/canvas/journey/people')}    />
        <Row numeral="V"   name="Pages"   line="— a page is waiting"                onClick={() => go('/frost/canvas/journey/pages')}     />
        <Row numeral="VI"  name="Moments" line="— Your memories"                    onClick={() => go('/frost/canvas/journey/moments')}   />
        <JourneyRow onClick={() => go('/frost/canvas/journey')} />
      </div>
    </div>
  );
}
