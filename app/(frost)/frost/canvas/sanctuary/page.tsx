'use client';

// app/(frost)/frost/canvas/sanctuary/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Sanctuary V2 — Frost redesign.
//
// Architecture:
//   • Fixed viewport — no scroll anywhere on this screen
//   • Two modes: Wine Night (dark, E1A) · Sky & Ivory (light, E3)
//   • Mode toggle: tapping Mode in Journey sub-rows
//   • Arc: I will → I do, dot position computed from days remaining (moves daily)
//   • Ghost numeral: behind hero, masked before slices
//   • Journey: anchored to bottom, expands upward on tap
//     When open: hero collapses, slices compress, sub-rows appear
//     Everything fits on one screen. Zero scroll.
//   • Bloom rooms: each slice tap navigates to its sub-room
//     (bloom-in-place architecture comes in V2.1 — routing for now)
//   • Slices: Dream Ai · Circle · Muse · Discover · My People
//             Pages · Moments · Events · Meridian
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import {
  FF, EASE, FROST_COPY, daysUntil,
  getV2Tokens, type V2Tokens,
} from '../../../../../lib/frost/tokens';

// ── Constants ─────────────────────────────────────────────────────────────────
const DEMO_WEDDING    = new Date('2026-11-19T00:00:00+05:30');
const DEMO_ENGAGEMENT = new Date('2026-04-11T00:00:00+05:30');
const TOTAL_JOURNEY   = 365; // days — engagement → wedding window

// ── Helpers ───────────────────────────────────────────────────────────────────
function getWeddingDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) { const s = JSON.parse(raw); if (s?.wedding_date) return new Date(s.wedding_date); }
  } catch {}
  return DEMO_WEDDING;
}

function getEngagementDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) { const s = JSON.parse(raw); if (s?.engagement_date) return new Date(s.engagement_date); }
  } catch {}
  return DEMO_ENGAGEMENT;
}

function getBrideFirstName(): string {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      const n = (s?.user_name || s?.bride_name || s?.name || '').trim().split(' ')[0];
      if (n) return n;
    }
  } catch {}
  return 'Priya';
}

function daysSinceEngagement(engagementDate: Date): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const e = new Date(engagementDate); e.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - e.getTime()) / (1000 * 60 * 60 * 24)));
}

// Arc progress: 0 = I will, 1 = I do
function arcProgress(daysRemaining: number, totalJourney = TOTAL_JOURNEY): number {
  if (daysRemaining <= 0) return 1;
  if (daysRemaining >= totalJourney) return 0;
  return 1 - daysRemaining / totalJourney;
}

// Quadratic bezier point on the arc at parameter t
// Arc: M 18 92 Q 160 4 302 92
function arcPoint(t: number): { x: number; y: number } {
  const p0 = { x: 18, y: 92 }, p1 = { x: 160, y: 4 }, p2 = { x: 302, y: 92 };
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function arcPathTo(t: number): string {
  if (t <= 0) return 'M 18 92';
  const p0 = { x: 18, y: 92 }, p1 = { x: 160, y: 4 }, p2 = { x: 302, y: 92 };
  const q0 = { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t };
  const q1 = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t };
  const ep = { x: q0.x + (q1.x - q0.x) * t, y: q0.y + (q1.y - q0.y) * t };
  return `M 18 92 Q ${q0.x.toFixed(1)} ${q0.y.toFixed(1)} ${ep.x.toFixed(1)} ${ep.y.toFixed(1)}`;
}

// Words for the countdown prose
const ONES = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
  'Seventeen','Eighteen','Nineteen'];
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function toWords(n: number): string {
  if (n < 20) return ONES[n] || String(n);
  const t = Math.floor(n / 10), o = n % 10;
  if (o === 0) return TENS[t];
  return `${TENS[t]}-${ONES[o].toLowerCase()}`;
}
function toWordsLarge(n: number): string {
  if (n < 100) return toWords(n);
  const h = Math.floor(n / 100), rem = n % 100;
  const hWord = ONES[h] + ' hundred';
  if (rem === 0) return hWord;
  return hWord + ' and ' + toWords(rem).toLowerCase();
}
function daysToWords(n: number): string {
  if (n < 100) return toWords(n);
  if (n < 1000) return toWordsLarge(n);
  return String(n);
}
function progressLine(days: number): string {
  if (days === 0) return 'Today.';
  if (days === 1) return 'One morning between I will and I do.';
  const w = daysToWords(days);
  return `${w.charAt(0).toUpperCase() + w.slice(1)} mornings between I will and I do.`;
}

// Daily poetry — rotates by day of year
function getDailyPoetry(): string {
  const pool = FROST_COPY.idlePool;
  const d = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return pool[d % pool.length];
}

// Roman date for top-right
function romanDate(): string {
  const now = new Date();
  const ROMAN = ['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];
  const d = String(now.getDate()).padStart(2, '0');
  const m = ROMAN[now.getMonth() + 1];
  const y = String(now.getFullYear()).slice(-2);
  return `${d} · ${m} · ${y}`;
}

// ── Slice data ────────────────────────────────────────────────────────────────
interface SliceConfig {
  key:      string;
  label:    string;
  hint:     string;
  route:    string;
  candle?:  boolean;
  premium?: boolean;
}

const SLICES: SliceConfig[] = [
  { key: 'dream',    label: 'Dream Ai',  hint: 'Something will go wrong…',   route: '/frost/canvas/dream'            },
  { key: 'circle',   label: 'Circle',    hint: 'Meha lit a candle · 8m ago', route: '/frost/canvas/journey/circle',   candle: true },
  { key: 'muse',     label: 'Muse',      hint: '22 saved · 4 new',           route: '/frost/canvas/muse'             },
  { key: 'discover', label: 'Discover',  hint: 'Your curated world',          route: '/frost/canvas/discover'         },
  { key: 'people',   label: 'My People', hint: '1 active · 1 invited',       route: '/frost/canvas/journey/people'   },
  { key: 'pages',    label: 'Pages',     hint: 'a page is waiting',           route: '/frost/canvas/journey/pages'    },
  { key: 'moments',  label: 'Moments',   hint: 'Your memories',               route: '/frost/canvas/journey/moments'  },
  { key: 'events',   label: 'Events',    hint: 'Your timeline',               route: '/frost/canvas/journey/events'   },
  { key: 'meridian', label: 'Meridian',  hint: 'Skin · mind · body',          route: '/frost/canvas/journey/meridian', premium: true },
];

const JOURNEY_LINKS = [
  { label: 'Expenses',  hint: '₹2.4L logged',  route: '/frost/canvas/journey/expenses'  },
  { label: 'Vendors',   hint: '4 confirmed',    route: '/frost/canvas/journey/vendors'   },
  { label: 'Reminders', hint: '2 this week',    route: '/frost/canvas/journey/reminders' },
  { label: 'Settings',  hint: '',               route: '/frost/canvas/journey/settings'  },
];

// ── Animation keyframes — injected once ───────────────────────────────────────
const ANIMATION_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Italianno&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400&display=swap');

  @keyframes sanctuaryDotCore {
    0%,100%{ opacity:.42; r:4px; }
    50%    { opacity:1;   r:5.5px; }
  }
  @keyframes sanctuaryDotHalo {
    0%,100%{ opacity:.15; r:10px; }
    50%    { opacity:.55; r:13px; }
  }
  @keyframes sanctuaryDotOuter {
    0%,100%{ opacity:.05; r:18px; }
    50%    { opacity:.18; r:21px; }
  }
  @keyframes sanctuaryNumBreathe {
    0%,100%{ transform:translateX(-50%) scale(1);   }
    50%    { transform:translateX(-50%) scale(1.007); }
  }
  @keyframes sanctuaryNumCountBreathe {
    0%,100%{ transform:scale(1);    }
    50%    { transform:scale(1.003); }
  }
  @keyframes sanctuaryCandleFlicker {
    0%  { opacity:.70 } 15%{ opacity:1.00 } 28%{ opacity:.85 }
    45% { opacity:1.00 } 60%{ opacity:.88 } 75%{ opacity:1.00 }
    88% { opacity:.72 } 100%{ opacity:.70 }
  }
  @keyframes sanctuarySliceBloom {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0);   }
  }

  .s-dot-core  { animation: sanctuaryDotCore  4s ease-in-out infinite; }
  .s-dot-halo  { animation: sanctuaryDotHalo  4s ease-in-out infinite; }
  .s-dot-outer { animation: sanctuaryDotOuter 4s ease-in-out infinite; }
  .s-num-ghost { animation: sanctuaryNumBreathe      9s ease-in-out infinite; }
  .s-num-count { animation: sanctuaryNumCountBreathe 7s ease-in-out infinite; }
  .s-candle    { animation: sanctuaryCandleFlicker   5s ease-in-out infinite; }
  .s-slice-in  { animation: sanctuarySliceBloom 200ms cubic-bezier(0.22,1,0.36,1) forwards; }
`;

// ── Root component ────────────────────────────────────────────────────────────
export default function SanctuaryPage() {
  const router = useRouter();
  const { homeMode, setHomeMode } = useFrostMode();
  const T: V2Tokens = getV2Tokens(homeMode);
  const dark = homeMode === 'E1A';

  // State
  const [days,          setDays]          = useState(0);
  const [progress,      setProgress]      = useState(0);
  const [brideName,     setBrideName]     = useState('Priya');
  const [pLine,         setPLine]         = useState('');
  const [poetry,        setPoetry]        = useState('');
  const [daysSinceYes,  setDaysSinceYes]  = useState(0);
  const [journeyOpen,   setJourneyOpen]   = useState(false);
  const [weekdayMorn,   setWeekdayMorn]   = useState('');
  const [dateStamp,     setDateStamp]     = useState('');
  const [pagesPreview,  setPagesPreview]  = useState('');

  // Inject animations once
  useEffect(() => {
    const id = 'sanctuary-v2-anim';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = ANIMATION_CSS;
      document.head.appendChild(s);
    }
  }, []);

  // Load data
  useEffect(() => {
    const wDate = getWeddingDate();
    const eDate = getEngagementDate();
    const d = daysUntil(wDate);
    setDays(d);
    setProgress(arcProgress(d));
    setBrideName(getBrideFirstName());
    setPLine(progressLine(d));
    setPoetry(getDailyPoetry());
    setDaysSinceYes(daysSinceEngagement(eDate));
    const now = new Date();
    const wd = now.toLocaleDateString('en-IN', { weekday: 'long' });
    setWeekdayMorn(`${wd} morning`);
    // "Twenty-Seventh of May · 2026"
    const DOM_WORDS = ['','First','Second','Third','Fourth','Fifth','Sixth','Seventh',
      'Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth',
      'Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First',
      'Twenty-Second','Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth',
      'Twenty-Seventh','Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First'];
    const dom = DOM_WORDS[now.getDate()] || String(now.getDate());
    const mon = now.toLocaleDateString('en-IN', { month: 'long' });
    setDateStamp(`${dom} of ${mon} · ${now.getFullYear()}`);
    try { setPagesPreview(localStorage.getItem('frost_pages_preview') || ''); } catch {}
  }, []);

  const go = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const toggleJourney = useCallback(() => {
    setJourneyOpen(o => !o);
  }, []);

  const dot = arcPoint(progress);

  // Dynamic slice hint for pages
  const slicesWithData: SliceConfig[] = SLICES.map(s => {
    if (s.key === 'pages' && pagesPreview) return { ...s, hint: pagesPreview };
    return s;
  });

  // Background
  const bg = `
    ${T.bgRadial},
    linear-gradient(180deg, ${T.bg} 0%, ${T.bg2} 55%, ${T.bgDeep} 100%)
  `;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}>

      {/* ── Grain overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '160px 160px',
        opacity: dark ? 0.45 : 0.22,
      }} />

      {/* ── Ghost numeral — behind hero, fades before slices ── */}
      <div
        className="s-num-ghost"
        style={{
          position: 'absolute',
          bottom: journeyOpen ? '55%' : '38%',
          left: '50%',
          fontFamily: FF.fraunces,
          fontWeight: 700,
          fontSize: journeyOpen ? '180px' : '300px',
          lineHeight: 1,
          letterSpacing: '-.06em',
          whiteSpace: 'nowrap',
          color: T.ghost,
          opacity: T.ghostOpacity,
          filter: 'blur(9px)',
          fontFeatureSettings: '"opsz" 144',
          pointerEvents: 'none',
          zIndex: 1,
          transition: `bottom 480ms ${EASE}, font-size 480ms ${EASE}, opacity 480ms ${EASE}`,
          // KEY: mask fades numeral before slices — text is always readable
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.04) 58%, rgba(0,0,0,0) 72%)',
          maskImage:        'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 38%, rgba(0,0,0,0.04) 58%, rgba(0,0,0,0) 72%)',
        }}
      >
        {days || 0}
      </div>

      {/* ── Upper frost band ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 120,
        background: T.glassBandBg,
        backdropFilter: T.glassBandBlur,
        WebkitBackdropFilter: T.glassBandBlur,
        WebkitMaskImage: 'linear-gradient(180deg, #000 58%, transparent 100%)',
        maskImage:        'linear-gradient(180deg, #000 58%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* ── Meridian arc ── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 108,
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        <svg
          viewBox="0 0 320 108"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {/* Ghost rail — full arc I will → I do */}
          <path
            d="M 18 92 Q 160 4 302 92"
            stroke={T.arcRail}
            strokeWidth=".6"
            fill="none"
          />
          {/* Progress arc — I will → today */}
          <path
            d={arcPathTo(progress)}
            stroke={T.arc}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Three-ring pulsing dot — bigger, more presence */}
          <circle cx={dot.x} cy={dot.y} fill="none" stroke={T.arc} strokeWidth=".5" className="s-dot-outer" />
          <circle cx={dot.x} cy={dot.y} fill="none" stroke={T.arc} strokeWidth=".8" className="s-dot-halo"  />
          <circle cx={dot.x} cy={dot.y} fill={T.arc}                                className="s-dot-core"  />
        </svg>
      </div>

      {/* ── I will / I do labels ── */}
      <div style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top,0px) + 74px)',
        left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 6, pointerEvents: 'none',
      }}>
        <span style={{ fontFamily: FF.mono, fontSize: 7, letterSpacing: '.3em', textTransform: 'uppercase', color: T.inkMute }}>I will</span>
        <span style={{ fontFamily: FF.mono, fontSize: 7, letterSpacing: '.3em', textTransform: 'uppercase', color: T.inkMute }}>I do</span>
      </div>

      {/* ── Top chrome ── */}
      <div style={{
        position: 'relative', zIndex: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `calc(env(safe-area-inset-top,0px) + 82px) 18px 0`,
        flexShrink: 0,
      }}>
        {/* Discover pill */}
        <button
          onClick={() => go('/frost/canvas/discover')}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            height: 24, padding: '0 10px',
            borderRadius: 2,
            background: T.pillBg,
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            border: `0.5px solid ${T.pillBorder}`,
            fontFamily: FF.mono, fontSize: 7, letterSpacing: '.2em', textTransform: 'uppercase',
            color: T.pillText,
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.accent, flexShrink: 0 }} />
          Discover
        </button>
        {/* Roman date */}
        <span style={{ fontFamily: FF.mono, fontSize: 7, letterSpacing: '.2em', color: T.inkMute }}>
          {romanDate()}
        </span>
      </div>

      {/* ── Hero — collapses when Journey opens ── */}
      <div style={{
        position: 'relative', zIndex: 4,
        padding: journeyOpen ? '8px 18px 4px' : '14px 18px 10px',
        flexShrink: 0,
        transition: `padding 480ms ${EASE}`,
        overflow: 'hidden',
      }}>

        {/* Weekday eyebrow */}
        {!journeyOpen && (
          <div style={{
            fontFamily: FF.mono, fontSize: 7, letterSpacing: '.28em',
            textTransform: 'uppercase', color: T.inkMute,
            marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {weekdayMorn}
            <span style={{ flex: 1, maxWidth: 44, height: .5, background: T.line }} />
          </div>
        )}

        {/* Italianno greeting */}
        <div style={{
          fontFamily: FF.italianno,
          fontSize: journeyOpen ? 36 : 54,
          lineHeight: .9,
          letterSpacing: '-.01em',
          color: T.ink,
          marginBottom: journeyOpen ? 4 : 8,
          transition: `font-size 480ms ${EASE}`,
        }}>
          Hello,{' '}
          <span style={{ color: T.accent }}>
            {brideName}
          </span>
          .
        </div>

        {/* Saffron rule — hides when Journey open */}
        {!journeyOpen && (
          <div style={{
            width: 40, height: 1,
            background: `linear-gradient(90deg, ${T.accent}, transparent)`,
            marginBottom: 10,
          }} />
        )}

        {/* Fraunces countdown */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div
            className="s-num-count"
            style={{
              fontFamily: FF.fraunces,
              fontWeight: 700,
              fontSize: journeyOpen ? 46 : 80,
              lineHeight: .88,
              letterSpacing: '-.04em',
              color: T.accent,
              fontFeatureSettings: '"opsz" 144',
              transition: `font-size 480ms ${EASE}`,
            }}
          >
            {days}
          </div>
          <div style={{
            fontFamily: 'Jost, sans-serif', fontWeight: 200,
            fontSize: 8, letterSpacing: '.44em', textTransform: 'uppercase',
            color: T.accent, opacity: .5,
          }}>
            mornings
          </div>
        </div>

        {/* Prose + date + since — hides when Journey open */}
        {!journeyOpen && (
          <>
            <div style={{
              fontFamily: FF.fraunces, fontStyle: 'italic', fontWeight: 300,
              fontSize: 14, lineHeight: 1.6,
              color: T.inkSoft,
              marginTop: 10, marginBottom: 6,
              fontFeatureSettings: '"opsz" 9',
            }}>
              {pLine.split(/(I will|I do)/g).map((part, i) =>
                part === 'I will' || part === 'I do'
                  ? <span key={i} style={{ color: T.accent, fontWeight: 400 }}>{part}</span>
                  : <span key={i}>{part}</span>
              )}
            </div>
            <div style={{ fontFamily: FF.mono, fontSize: 6.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.inkMute, marginBottom: 3 }}>
              {dateStamp}
            </div>
            {daysSinceYes > 0 && (
              <div style={{ fontFamily: FF.mono, fontSize: 6.5, letterSpacing: '.16em', textTransform: 'uppercase', color: T.signal }}>
                ↑ {daysSinceYes} days since you said yes
              </div>
            )}
            <div style={{
              fontFamily: FF.fraunces, fontStyle: 'italic', fontWeight: 300,
              fontSize: 12, lineHeight: 1.55, marginTop: 8,
              color: T.inkMute,
              fontFeatureSettings: '"opsz" 9',
            }}>
              "{poetry}"
            </div>
          </>
        )}
      </div>

      {/* ── Lower frost band ── */}
      <div style={{
        position: 'absolute',
        top: journeyOpen ? '28%' : '38%',
        left: 0, right: 0, bottom: 0,
        background: T.glassBandBg,
        backdropFilter: T.glassBandBlur,
        WebkitBackdropFilter: T.glassBandBlur,
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 18%)',
        maskImage:        'linear-gradient(180deg, transparent 0%, #000 18%)',
        pointerEvents: 'none',
        zIndex: 2,
        transition: `top 480ms ${EASE}`,
      }} />

      {/* ── Slices — flex fills remaining space, compress when Journey opens ── */}
      <div style={{
        position: 'relative', zIndex: 3,
        flex: 1,
        display: 'flex', flexDirection: 'column',
        borderTop: `.5px solid ${T.lineStrong}`,
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {slicesWithData.map((slice, idx) => (
          <div
            key={slice.key}
            onClick={() => go(slice.route)}
            className="s-slice-in"
            style={{
              flex: 1,
              minHeight: journeyOpen ? 24 : 36,
              maxHeight: journeyOpen ? 36 : 999,
              display: 'flex', alignItems: 'center',
              padding: `0 18px`,
              gap: 7,
              borderBottom: `.5px solid ${T.line}`,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              transition: `min-height 480ms ${EASE}, max-height 480ms ${EASE}`,
              animationDelay: `${idx * 18}ms`,
              // Meridian gets a subtle accent background
              background: slice.premium ? T.accentSoft : 'transparent',
            }}
          >
            {/* Slice name */}
            <span style={{
              fontFamily: FF.fraunces,
              fontStyle: 'italic', fontWeight: 300,
              fontSize: journeyOpen ? 14 : 17,
              lineHeight: 1, flexShrink: 0,
              color: slice.premium ? T.accent : T.ink,
              fontFeatureSettings: '"opsz" 9',
              transition: `font-size 480ms ${EASE}`,
            }}>
              {slice.label}
            </span>

            {/* Candle dot for Circle */}
            {slice.candle && (
              <span
                className="s-candle"
                style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: T.signal,
                  boxShadow: `0 0 7px ${T.signal}`,
                  flexShrink: 0,
                }}
              />
            )}

            {/* Hint text */}
            <span style={{
              fontFamily: FF.mono, fontSize: 6.5, letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: slice.premium ? T.accent : T.inkMute,
              opacity: slice.premium ? .7 : 1,
              marginLeft: 'auto',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: 150,
            }}>
              {slice.hint}
            </span>

            {/* Arrow for Discover + Meridian */}
            {(slice.key === 'discover' || slice.key === 'meridian') && (
              <span style={{ fontFamily: FF.mono, fontSize: 9, color: T.inkMute, flexShrink: 0 }}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Journey — anchored to bottom, always visible ── */}
      <div style={{
        position: 'relative', zIndex: 4,
        flexShrink: 0,
        borderTop: `.5px solid ${T.lineStrong}`,
        paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 2px)',
        background: journeyOpen ? T.journeyRowBg : 'transparent',
        transition: `background 300ms ${EASE}`,
      }}>
        {/* Journey header — always tappable */}
        <div
          onClick={toggleJourney}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 18px',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            minHeight: 44,
          }}
        >
          <span style={{
            fontFamily: FF.fraunces, fontStyle: 'italic', fontWeight: 300,
            fontSize: 17,
            color: T.accent,
            fontFeatureSettings: '"opsz" 9',
          }}>
            Journey
          </span>
          <span style={{
            fontFamily: FF.mono, fontSize: 10,
            color: T.accent, opacity: .55,
            transform: journeyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 300ms ${EASE}`,
            display: 'inline-block',
          }}>
            ∨
          </span>
        </div>

        {/* Sub-rows — appear when Journey opens */}
        {journeyOpen && (
          <div style={{ borderTop: `.5px solid ${T.line}` }}>
            {JOURNEY_LINKS.map((link, i) => (
              <div
                key={link.label}
                onClick={() => go(link.route)}
                className="s-slice-in"
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '9px 24px',
                  borderBottom: `.5px solid ${T.line}`,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <span style={{
                  fontFamily: FF.fraunces, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 15, flex: 1,
                  color: T.inkSoft,
                  fontFeatureSettings: '"opsz" 9',
                }}>
                  {link.label}
                </span>
                {link.hint && (
                  <span style={{ fontFamily: FF.mono, fontSize: 6.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.inkMute }}>
                    {link.hint}
                  </span>
                )}
              </div>
            ))}
            {/* Mode toggle */}
            <div
              onClick={() => setHomeMode(dark ? 'E3' : 'E1A')}
              className="s-slice-in"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 24px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                animationDelay: `${JOURNEY_LINKS.length * 30}ms`,
              }}
            >
              <span style={{ fontFamily: FF.fraunces, fontStyle: 'italic', fontSize: 15, color: T.inkSoft, fontFeatureSettings: '"opsz" 9' }}>
                Mode
              </span>
              <span style={{ fontFamily: FF.mono, fontSize: 7, letterSpacing: '.18em', textTransform: 'uppercase', color: T.accent }}>
                {dark ? 'Dark' : 'Light'} ·{' '}
                <span style={{ opacity: .5 }}>tap to switch</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
