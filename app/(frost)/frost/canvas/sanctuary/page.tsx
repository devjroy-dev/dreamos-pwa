'use client';

// app/(frost)/frost/canvas/sanctuary/page.tsx
// Sanctuary — the bride's quiet planner.
// Lifted from the sanctuary mode of frost/page.tsx and extracted as its own route.
//
// Top chrome: single pill top-left [✦ Dream] → /frost/canvas/discover
// Sections (hairline separated, flex, tappable):
//   Dream Ai · Circle · Muse · My People · Moments · Events
// Bottom: Journey accordion (shorter, expands inline)
//   Sub-links: Expenses · Vendors · Reminders · Settings
//   Settings row shows: Mode: Light / Mode: Dark — tap to toggle homeMode

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import {
  FF, FROST_COPY, EASE,
  daysUntil,
  type ModeDescriptor,
} from '../../../../../lib/frost/tokens';

// ── Helpers (verbatim from frost/page.tsx) ────────────────────────────────────

const DEMO_WEDDING = new Date('2026-11-19T00:00:00+05:30');

function getWeddingDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) { const s = JSON.parse(raw); if (s?.wedding_date) return new Date(s.wedding_date); }
  } catch {}
  return DEMO_WEDDING;
}

const DOM_WORDS = [
  '','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth',
  'Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth',
  'Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second',
  'Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh',
  'Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First',
];

function pickIdleLines(): [string, string] {
  const pool = FROST_COPY.idlePool;
  const h = new Date().getHours();
  return [pool[h % pool.length], pool[(h + 4) % pool.length]];
}

function bgGradient(dark: boolean): string {
  return dark
    ? 'radial-gradient(ellipse 120% 60% at 50% 0%, #2A2118 0%, #1B1612 55%, #130F0C 100%)'
    : 'radial-gradient(ellipse 120% 60% at 50% 0%, #DDD8D0 0%, #C8C2BA 55%, #ADA79E 100%)';
}

// ── Section — flex so it compresses when Journey expands ─────────────────────
// flex: proportional weight (gradual decrease Dream Ai → Events)
// minHeight: floor so label + one line always visible even when compressed
// flexShrink: 1 — sections yield space to Journey sub-rows

function Section({
  label, lines, onClick, mode, dark, flex, minHeight, first = false,
}: {
  label:     string;
  lines:     string[];
  onClick:   () => void;
  mode:      ModeDescriptor;
  dark:      boolean;
  flex:      number;
  minHeight: number;
  first?:    boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex,
        minHeight,
        flexShrink: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderTop: first ? 'none' : `0.5px solid ${mode.hairline}`,
        padding: '6px 24px',
        cursor: 'pointer',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        fontFamily: FF.display, fontStyle: 'italic', fontSize: 19,
        color: dark ? mode.brass : mode.ink, marginBottom: 5,
        flexShrink: 0,
      }}>
        {label}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < lines.length - 1 ? 4 : 0, flexShrink: 0 }}>
          <span style={{ fontFamily: FF.label, fontSize: 9, color: dark ? mode.brass : mode.brassMuted, marginTop: 2, flexShrink: 0 }}>✦</span>
          <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 15, color: mode.soft, lineHeight: 1.4 }}>{line}</span>
        </div>
      ))}
    </div>
  );
}

// ── Journey accordion ─────────────────────────────────────────────────────────
// Chevron points DOWN when closed, UP when open.
// Sub-links are italic Cormorant, same colour as section context lines.
// Each sub-row is compact (32px) so all 5 rows + Journey header fit on screen.

const JOURNEY_LINKS = [
  { label: 'Expenses',   route: '/frost/canvas/journey/expenses'  },
  { label: 'Vendors',    route: '/frost/canvas/journey/vendors'   },
  { label: 'Reminders',  route: '/frost/canvas/journey/reminders' },
  { label: 'Settings',   route: '/frost/canvas/journey/settings'  },
];

function JourneyAccordion({
  mode, dark, onNavigate, onToggleMode,
}: {
  mode:          ModeDescriptor;
  dark:          boolean;
  onNavigate:    (route: string) => void;
  onToggleMode:  () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      flexShrink: 0,
      borderTop: `0.5px solid ${mode.hairline}`,
      paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 6px)',
    }}>
      {/* Header — same font as sections, compact height */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px',
          minHeight: 44,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          fontFamily: FF.display, fontStyle: 'italic', fontSize: 19,
          color: dark ? mode.brass : mode.ink,
        }}>
          Journey
        </span>
        {/* Chevron — points down when closed, up when open */}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 220ms ${EASE}`,
          }}
        >
          <path d="M2 4.5L7 9.5L12 4.5" stroke={dark ? mode.brassMuted : mode.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Sub-links — compact rows, italic Cormorant, mode.soft colour */}
      {open && (
        <div>
          {JOURNEY_LINKS.map(link => (
            <div
              key={link.label}
              onClick={() => onNavigate(link.route)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 24px 5px 32px',
                borderTop: `0.5px solid ${mode.hairline}`,
                minHeight: 30,
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ fontFamily: FF.label, fontSize: 8, color: dark ? mode.brass : mode.brassMuted, flexShrink: 0 }}>✦</span>
              <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 15, color: mode.soft, lineHeight: 1.3 }}>
                {link.label}
              </span>
            </div>
          ))}
          {/* Mode row — value uses mode.soft in light mode for legibility */}
          <div
            onClick={onToggleMode}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 24px 5px 32px',
              borderTop: `0.5px solid ${mode.hairline}`,
              minHeight: 30,
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: FF.label, fontSize: 8, color: dark ? mode.brass : mode.brassMuted, flexShrink: 0 }}>✦</span>
              <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 15, color: mode.soft }}>Mode</span>
            </div>
            <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 15, color: mode.soft }}>
              {dark ? 'Dark' : 'Light'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function SanctuaryPage() {
  const router = useRouter();
  const { homeMode, setHomeMode, mode } = useFrostMode();
  const dark = homeMode === 'E1A';

  const [days,      setDays]      = useState(0);
  const [weekday,   setWeekday]   = useState('');
  const [domWord,   setDomWord]   = useState('');
  const [monthName, setMonthName] = useState('');
  const [year,      setYear]      = useState('');
  const [lineA,     setLineA]     = useState('');
  const [lineB,     setLineB]     = useState('');

  useEffect(() => {
    setDays(daysUntil(getWeddingDate()));
    const now = new Date();
    setWeekday(now.toLocaleDateString('en-IN', { weekday: 'long' }));
    setDomWord(DOM_WORDS[now.getDate()] || String(now.getDate()));
    setMonthName('of ' + now.toLocaleDateString('en-IN', { month: 'long' }));
    setYear(String(now.getFullYear()));
    const [a, b] = pickIdleLines();
    setLineA(a); setLineB(b);
  }, []);

  const go = (path: string) => router.push(path);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: bgGradient(dark),
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}>

      {/* Grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '160px 160px', opacity: dark ? 0.35 : 0.18,
      }} />

      {/* Top-left pill — [✦ Dream] → Discover */}
      <button
        onClick={() => go('/frost/canvas/discover')}
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top,0px) + 14px)',
          left: 16, zIndex: 50,
          display: 'flex', alignItems: 'center', gap: 5,
          height: 28, padding: '0 10px 0 8px',
          borderRadius: 100,
          background: dark ? 'rgba(255,253,248,0.10)' : 'rgba(44,40,35,0.08)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: `0.5px solid ${mode.hairline}`,
          cursor: 'pointer', touchAction: 'manipulation',
        }}
      >
        <span style={{ fontSize: 9, color: mode.brassMuted, lineHeight: 1 }}>✦</span>
        <span style={{
          fontFamily: FF.label, fontSize: 8, fontWeight: 300,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: dark ? 'rgba(245,240,232,0.75)' : 'rgba(44,40,35,0.65)',
          whiteSpace: 'nowrap',
        }}>Dream</span>
      </button>

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 1, flexShrink: 0,
        padding: `calc(env(safe-area-inset-top,0px) + 36px) 24px 20px`,
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: FF.label, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.soft, marginBottom: 8 }}>
          {weekday}
        </div>
        <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: mode.ink, lineHeight: 1.15, marginBottom: 3 }}>
          {domWord} {monthName}
        </div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: mode.soft, marginBottom: 12 }}>
          {year}
        </div>
        <div style={{ height: '0.5px', background: mode.hairline, width: 40, margin: '0 auto 12px' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 56, color: mode.brass, lineHeight: 1 }}>{days}</span>
          <span style={{ fontFamily: FF.label, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: mode.brassMuted }}>
            {FROST_COPY.landing.daysWord}
          </span>
        </div>
      </div>

      {/* Descent — overflow hidden, sections compress, Journey stays fixed */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        borderTop: `0.5px solid ${mode.hairline}`,
      }}>
        {/* flex = weight (gradual decrease), minHeight = floor so label never disappears */}
        <Section label="Dream Ai"  lines={[lineA, lineB]}              onClick={() => go('/frost/canvas/dream')}              mode={mode} dark={dark} flex={1} minHeight={52} first />
        <Section label="Circle"    lines={['Quiet here for now.']}     onClick={() => go('/frost/canvas/journey/circle')}     mode={mode} dark={dark} flex={1} minHeight={44} />
        <Section label="Muse"      lines={['Your saved inspiration.']} onClick={() => go('/frost/canvas/muse')}               mode={mode} dark={dark} flex={1} minHeight={40} />
        <Section label="My People" lines={['Your circle & guests.']}   onClick={() => go('/frost/canvas/journey/people')}     mode={mode} dark={dark} flex={1} minHeight={40} />
        <Section label="Moments"   lines={['Your wedding memories.']}  onClick={() => go('/frost/canvas/journey/moments')}    mode={mode} dark={dark} flex={1} minHeight={40} />
        <Section label="Events"    lines={['Your timeline.']}          onClick={() => go('/frost/canvas/journey/events')}     mode={mode} dark={dark} flex={1} minHeight={40} />

        <JourneyAccordion
          mode={mode}
          dark={dark}
          onNavigate={go}
          onToggleMode={() => setHomeMode(dark ? 'E3' : 'E1A')}
        />
      </div>
    </div>
  );
}
