'use client';

// app/(frost)/frost/page.tsx
// Frost Landing v5.
// Dream:     hero → 2x2 photo grid (brass border) → Dream Ai flat → Journey flat
// Sanctuary: hero → Dream Ai flat → Circle flat → Muse flat → Moments flat → Pages flat → Journey flat
// Flat sections: no card, no blur, no border. Page bg + hairline dividers only.

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FROST_COPY, FF, EASE,
  daysUntil,
  type HomeModeKey, type ContentMode, type ModeDescriptor,
} from '../../../lib/frost/tokens';
import { useFrostMode } from '../layout';

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

// ─── Mode picker ──────────────────────────────────────────────────────────────
const CONTENT_OPTIONS: { key: ContentMode; title: string; sub: string }[] = [
  { key: 'dream',     title: 'Dream',     sub: 'Photos and inspiration' },
  { key: 'sanctuary', title: 'Sanctuary', sub: 'A quiet space — your planner' },
];
const TONE_OPTIONS: { key: HomeModeKey; title: string; sub: string }[] = [
  { key: 'E1A', title: 'Dark',  sub: 'Warm-night frame, soft dark descent' },
  { key: 'E3',  title: 'Light', sub: 'Warm paper, atelier frame' },
];

function ModeSheet({
  visible, mode, homeMode, contentMode, onPickTone, onPickContent, onClose,
}: {
  visible: boolean; mode: ModeDescriptor; homeMode: HomeModeKey; contentMode: ContentMode;
  onPickTone: (m: HomeModeKey) => void; onPickContent: (c: ContentMode) => void; onClose: () => void;
}) {
  return (
    <>
      {visible && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200 }} />}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
        background: mode.cardFill,
        borderTop: `0.5px solid ${mode.hairlineStrong}`,
        borderRadius: '22px 22px 0 0',
        paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 40px)', paddingTop: 12,
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: `transform 340ms ${EASE}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(191,160,77,0.3)' }} />
        </div>
        <div style={{ padding: '0 18px', maxHeight: '60vh', overflowY: 'auto' }}>
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 22, color: mode.brass, textAlign: 'center', marginBottom: 4 }}>Pick a home rendition</div>
          <div style={{ fontFamily: FF.body, fontSize: 12, color: mode.soft, textAlign: 'center', marginBottom: 16 }}>Tone and content independently.</div>
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: mode.soft, marginBottom: 8, marginTop: 14, paddingLeft: 14 }}>Content</div>
          {CONTENT_OPTIONS.map(c => {
            const active = c.key === contentMode;
            return (
              <button key={c.key} onClick={() => onPickContent(c.key)} style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '14px', borderRadius: 12, marginBottom: 6, border: 'none', cursor: 'pointer',
                background: active ? `${mode.brass}22` : 'transparent',
                outline: active ? `0.5px solid ${mode.brass}` : `0.5px solid ${mode.hairline}`,
              }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: FF.label, fontSize: 12, color: active ? mode.brass : mode.ink }}>{c.title}</div>
                  <div style={{ fontFamily: FF.body, fontSize: 11, color: mode.soft, marginTop: 2 }}>{c.sub}</div>
                </div>
                {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: mode.brass }} />}
              </button>
            );
          })}
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: mode.soft, marginBottom: 8, marginTop: 18, paddingLeft: 14 }}>Tone</div>
          {TONE_OPTIONS.map(t => {
            const active = t.key === homeMode;
            return (
              <button key={t.key} onClick={() => onPickTone(t.key)} style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: '14px', borderRadius: 12, marginBottom: 6, border: 'none', cursor: 'pointer',
                background: active ? `${mode.brass}22` : 'transparent',
                outline: active ? `0.5px solid ${mode.brass}` : `0.5px solid ${mode.hairline}`,
              }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: FF.label, fontSize: 12, color: active ? mode.brass : mode.ink }}>{t.title}</div>
                  <div style={{ fontFamily: FF.body, fontSize: 11, color: mode.soft, marginTop: 2 }}>{t.sub}</div>
                </div>
                {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: mode.brass }} />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Photo tile — brass border, fills flex container ─────────────────────────
function PhotoTile({ imageUrl, label, onClick, mode }: {
  imageUrl: string | null; label: string; onClick: () => void; mode: ModeDescriptor;
}) {
  return (
    <div onClick={onClick} style={{
      flex: 1, position: 'relative', cursor: 'pointer',
      borderRadius: 14,
      border: '1px solid rgba(191,160,77,0.42)',
      overflow: 'hidden',
      background: mode.stampFill,
      minHeight: 0,
    }}>
      {imageUrl && (
        <img src={imageUrl} alt={label} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'grayscale(15%) contrast(0.95)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.52) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 10, left: 10,
        fontFamily: FF.label, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'rgba(245,240,232,0.92)',
        background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        padding: '4px 9px', borderRadius: 20,
      }}>{label}</div>
      <div style={{
        position: 'absolute', top: 12, right: 12,
        width: 5, height: 5, borderRadius: '50%', background: mode.brass,
      }} />
    </div>
  );
}

// ─── Flat section — no card, no blur, no border, just hairline top + content ─
function FlatSection({ label, lines, onClick, mode, first = false }: {
  label: string; lines: string[]; onClick: () => void;
  mode: ModeDescriptor; first?: boolean;
}) {
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, cursor: 'pointer',
      borderTop: first ? 'none' : `0.5px solid ${mode.hairline}`,
      padding: '18px 24px 16px',
    }}>
      <div style={{
        fontFamily: FF.display, fontStyle: 'italic', fontSize: 18,
        color: mode.brass, marginBottom: 10,
      }}>
        {label}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < lines.length - 1 ? 6 : 0 }}>
          <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 3, flexShrink: 0 }}>✦</span>
          <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft, lineHeight: 1.55 }}>{line}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Journey word — flat, centered, hairline top ──────────────────────────────
function JourneyWord({ onClick, mode }: { onClick: () => void; mode: ModeDescriptor }) {
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, textAlign: 'center', cursor: 'pointer',
      borderTop: `0.5px solid ${mode.hairline}`,
      padding: '16px 0 calc(env(safe-area-inset-bottom,0px) + 16px)',
      fontFamily: FF.display, fontStyle: 'italic', fontSize: 20, color: mode.brassMuted,
    }}>
      Journey
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
export default function FrostLanding() {
  const router = useRouter();
  const { homeMode, contentMode, mode, setHomeMode, setContentMode } = useFrostMode();
  const [pickerOpen,   setPickerOpen]   = useState(false);
  const [days,         setDays]         = useState(0);
  const [weekday,      setWeekday]      = useState('');
  const [domWord,      setDomWord]      = useState('');
  const [monthName,    setMonthName]    = useState('');
  const [year,         setYear]         = useState('');
  const [lineA,        setLineA]        = useState('');
  const [lineB,        setLineB]        = useState('');
  const [museUrl,      setMuseUrl]      = useState<string | null>(null);
  const [discoverUrl,  setDiscoverUrl]  = useState<string | null>(null);
  const [surpriseUrl,  setSurpriseUrl]  = useState<string | null>(null);
  const [circleUrl,    setCircleUrl]    = useState<string | null>(null);

  const isSanctuary = contentMode === 'sanctuary';
  const dark        = homeMode === 'E1A';

  useEffect(() => {
    setDays(daysUntil(getWeddingDate()));
    const now = new Date();
    setWeekday(now.toLocaleDateString('en-IN', { weekday: 'long' }));
    setDomWord(DOM_WORDS[now.getDate()] || String(now.getDate()));
    setMonthName('of ' + now.toLocaleDateString('en-IN', { month: 'long' }));
    setYear(String(now.getFullYear()));
    const [a, b] = pickIdleLines();
    setLineA(a); setLineB(b);
    // Placeholder images — replaced by real API in P2-9
    setMuseUrl('https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80&auto=format&fit=crop');
    setDiscoverUrl('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80&auto=format&fit=crop');
    setSurpriseUrl('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80&auto=format&fit=crop');
    setCircleUrl('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80&auto=format&fit=crop');
  }, []);

  const go = (path: string) => router.push(path);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: bgGradient(dark),
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '160px 160px', opacity: dark ? 0.35 : 0.18,
      }} />

      {/* Mode pill */}
      <button onClick={() => setPickerOpen(true)} style={{
        position: 'absolute',
        top: 'calc(env(safe-area-inset-top,0px) + 14px)', right: 16, zIndex: 50,
        background: dark ? 'rgba(255,253,248,0.10)' : 'rgba(44,40,35,0.08)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        border: `0.5px solid ${mode.hairline}`,
        borderRadius: 20, padding: '5px 12px',
        fontFamily: FF.label, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: mode.brassMuted, cursor: 'pointer',
      }}>{homeMode === 'E1A' ? 'Dark' : 'Light'} · {isSanctuary ? 'Sanctuary' : 'Dream'}</button>

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 1, flexShrink: 0,
        padding: `calc(env(safe-area-inset-top,0px) + 40px) 24px 20px`,
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: FF.label, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.soft, marginBottom: 5 }}>
          {weekday}
        </div>
        <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: mode.ink, lineHeight: 1.15, marginBottom: 3 }}>
          {domWord} {monthName}
        </div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: mode.soft, marginBottom: 18 }}>
          {year}
        </div>
        <div style={{ height: '0.5px', background: mode.hairline, width: 40, margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 52, color: mode.brass, lineHeight: 1 }}>{days}</span>
          <span style={{ fontFamily: FF.label, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: mode.brassMuted }}>
            {FROST_COPY.landing.daysWord}
          </span>
        </div>
      </div>

      {/* Descent */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        borderTop: `0.5px solid ${mode.hairline}`,
      }}>

        {!isSanctuary ? (
          // ── DREAM MODE ────────────────────────────────────────────────────
          <>
            {/* 2x2 photo grid — each row equal flex, gap between tiles only */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 16px 8px', minHeight: 0 }}>
              {/* Row 1: Muse | Discover */}
              <div style={{ flex: 1, display: 'flex', gap: 6, minHeight: 0 }}>
                <PhotoTile imageUrl={museUrl}     label="Muse"        onClick={() => go('/frost/canvas/muse')}             mode={mode} />
                <PhotoTile imageUrl={discoverUrl} label="Discover"    onClick={() => go('/frost/canvas/discover')}         mode={mode} />
              </div>
              {/* Row 2: Surprise Me | Circle */}
              <div style={{ flex: 1, display: 'flex', gap: 6, minHeight: 0 }}>
                <PhotoTile imageUrl={surpriseUrl} label="Surprise Me" onClick={() => go('/frost/canvas/muse')}             mode={mode} />
                <PhotoTile imageUrl={circleUrl}   label="Circle"      onClick={() => go('/frost/canvas/journey/circle')}   mode={mode} />
              </div>
            </div>

            {/* Dream Ai — flat */}
            <FlatSection
              label="Dream Ai" lines={[lineA, lineB]}
              onClick={() => go('/frost/canvas/dream')}
              mode={mode} first
            />

            {/* Journey */}
            <JourneyWord onClick={() => go('/frost/canvas/journey')} mode={mode} />
          </>
        ) : (
          // ── SANCTUARY MODE — sections descend in height, Journey pinned bottom ──
          <>
            <div style={{ flex: 2.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: 'none',        padding: '0 24px', cursor: 'pointer' }} onClick={() => go('/frost/canvas/dream')}>
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: mode.brass, marginBottom: 10 }}>Dream Ai</div>
              {[lineA, lineB].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i === 0 ? 6 : 0 }}>
                  <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 3, flexShrink: 0 }}>✦</span>
                  <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft, lineHeight: 1.55 }}>{line}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: `0.5px solid ${mode.hairline}`, padding: '0 24px', cursor: 'pointer' }} onClick={() => go('/frost/canvas/journey/circle')}>
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: mode.brass, marginBottom: 8 }}>Circle</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 3, flexShrink: 0 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft, lineHeight: 1.55 }}>Quiet here for now.</span>
              </div>
            </div>
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: `0.5px solid ${mode.hairline}`, padding: '0 24px', cursor: 'pointer' }} onClick={() => go('/frost/canvas/muse')}>
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: mode.brass, marginBottom: 8 }}>Muse</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 3, flexShrink: 0 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft, lineHeight: 1.55 }}>Your saved inspiration.</span>
              </div>
            </div>
            <div style={{ flex: 1.0, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: `0.5px solid ${mode.hairline}`, padding: '0 24px', cursor: 'pointer' }} onClick={() => go('/frost/canvas/journey')}>
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: mode.brass, marginBottom: 8 }}>Moments</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 3, flexShrink: 0 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft, lineHeight: 1.55 }}>Your wedding memories.</span>
              </div>
            </div>
            <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderTop: `0.5px solid ${mode.hairline}`, padding: '0 24px', cursor: 'pointer' }} onClick={() => go('/frost/canvas/journey')}>
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: mode.brass, marginBottom: 8 }}>Pages</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 3, flexShrink: 0 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft, lineHeight: 1.55 }}>Notes and pages.</span>
              </div>
            </div>
            <JourneyWord onClick={() => go('/frost/canvas/journey')} mode={mode} />
          </>
        )}
      </div>

      {/* Mode picker sheet */}
      <ModeSheet
        visible={pickerOpen} mode={mode} homeMode={homeMode} contentMode={contentMode}
        onPickTone={(m) => { setHomeMode(m); }}
        onPickContent={(c) => { setContentMode(c); }}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
