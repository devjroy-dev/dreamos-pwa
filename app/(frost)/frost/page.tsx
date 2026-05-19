'use client';

// app/(frost)/page.tsx
// Frost Landing — the home screen.
//
// Two tone modes: E1A (dark, warm-night) / E3 (light, warm paper)
// Two content modes: Dream (photos + inspiration) / Sanctuary (quiet planner)
// Mode pill top-right → tap → bottom sheet picker (both axes)
//
// Ported from tdw-2/app/(frost)/landing.tsx
// Key differences from native:
//   - AsyncStorage → localStorage
//   - LinearGradient → CSS linear-gradient
//   - BlurView → backdrop-filter + rgba
//   - Pressable → div/button
//   - router.push → Next.js useRouter
//   - Safe area insets → env(safe-area-inset-*)
//   - Mode pill replaces long-press-on-date to open picker

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  MODES, FROST_COPY, FF, EASE,
  dayNumberToWords, daysUntil, getCoupleIdForFrost,
  type HomeModeKey, type ContentMode, type ModeDescriptor,
} from '../../../lib/frost/tokens';
import { useFrostMode } from '../layout';

// ─── Wedding date — reads from session, falls back to demo ──────────────────
const DEMO_WEDDING = new Date('2026-11-19T00:00:00+05:30');

function getWeddingDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      if (s?.wedding_date) return new Date(s.wedding_date);
    }
  } catch {}
  return DEMO_WEDDING;
}

// ─── Idle line picker ────────────────────────────────────────────────────────
function pickIdleLines(): [string, string] {
  const pool = FROST_COPY.idlePool;
  const h = new Date().getHours();
  return [pool[h % pool.length], pool[(h + 4) % pool.length]];
}

// ─── Mode picker bottom sheet ────────────────────────────────────────────────
const CONTENT_OPTIONS: { key: ContentMode; title: string; sub: string }[] = [
  { key: 'dream',     title: 'Dream',     sub: 'Photos and inspiration' },
  { key: 'sanctuary', title: 'Sanctuary', sub: 'A quiet space — your planner' },
];
const TONE_OPTIONS: { key: HomeModeKey; title: string; sub: string }[] = [
  { key: 'E1A', title: 'Dark',  sub: 'Warm-night frame, soft dark descent' },
  { key: 'E3',  title: 'Light', sub: 'Warm paper, atelier frame' },
];

function ModeSheet({
  visible, mode, homeMode, contentMode,
  onPickTone, onPickContent, onClose,
}: {
  visible: boolean;
  mode: ModeDescriptor;
  homeMode: HomeModeKey;
  contentMode: ContentMode;
  onPickTone: (m: HomeModeKey) => void;
  onPickContent: (c: ContentMode) => void;
  onClose: () => void;
}) {
  return (
    <>
      {visible && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 200,
          }}
        />
      )}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        zIndex: 201,
        background: mode.cardFill,
        borderTop: `0.5px solid ${mode.hairlineStrong}`,
        borderRadius: '22px 22px 0 0',
        paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 40px)',
        paddingTop: 12,
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: `transform 340ms ${EASE}`,
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(245,240,232,0.3)' }} />
        </div>

        <div style={{ padding: '0 18px', maxHeight: '60vh', overflowY: 'auto' }}>
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 22, color: mode.brass, textAlign: 'center', marginBottom: 4 }}>
            Pick a home rendition
          </div>
          <div style={{ fontFamily: FF.body, fontSize: 12, color: mode.soft, textAlign: 'center', marginBottom: 16 }}>
            Pick tone and content independently.
          </div>

          {/* Content section */}
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: mode.soft, marginBottom: 8, marginTop: 14, paddingLeft: 14 }}>
            Content
          </div>
          {CONTENT_OPTIONS.map(c => {
            const active = c.key === contentMode;
            return (
              <button
                key={c.key}
                onClick={() => onPickContent(c.key)}
                style={{
                  display: 'flex', alignItems: 'center', width: '100%',
                  padding: '14px', borderRadius: 12, marginBottom: 6, border: 'none', cursor: 'pointer',
                  background: active ? `rgba(191,160,77,0.12)` : 'rgba(255,255,255,0.04)',
                  outline: active ? `0.5px solid rgba(191,160,77,0.4)` : 'none',
                }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 16, color: active ? mode.brass : mode.ink }}>{c.title}</div>
                  <div style={{ fontFamily: FF.body, fontSize: 12, color: mode.soft, marginTop: 2 }}>{c.sub}</div>
                </div>
                {active && <div style={{ width: 8, height: 8, borderRadius: 4, background: mode.brass, flexShrink: 0 }} />}
              </button>
            );
          })}

          {/* Tone section */}
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: mode.soft, marginBottom: 8, marginTop: 14, paddingLeft: 14 }}>
            Tone
          </div>
          {TONE_OPTIONS.map(t => {
            const active = t.key === homeMode;
            return (
              <button
                key={t.key}
                onClick={() => onPickTone(t.key)}
                style={{
                  display: 'flex', alignItems: 'center', width: '100%',
                  padding: '14px', borderRadius: 12, marginBottom: 6, border: 'none', cursor: 'pointer',
                  background: active ? `rgba(191,160,77,0.12)` : 'rgba(255,255,255,0.04)',
                  outline: active ? `0.5px solid rgba(191,160,77,0.4)` : 'none',
                }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 16, color: active ? mode.brass : mode.ink }}>{t.title}</div>
                  <div style={{ fontFamily: FF.body, fontSize: 12, color: mode.soft, marginTop: 2 }}>{t.sub}</div>
                </div>
                {active && <div style={{ width: 8, height: 8, borderRadius: 4, background: mode.brass, flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'block', width: '100%', padding: '14px 0',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: FF.display, fontStyle: 'italic', fontSize: 16,
            letterSpacing: '0.025em', color: mode.brass, marginTop: 14,
          }}
        >Done</button>
      </div>
    </>
  );
}

// ─── Canvas tile (frosted surface) ───────────────────────────────────────────
function CanvasTile({
  onClick, children, gradient, style,
}: {
  onClick: () => void;
  children: React.ReactNode;
  gradient: [string, string];
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(to bottom, ${gradient[0]}, ${gradient[1]})`,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...style,
      }}
    >{children}</div>
  );
}

// ─── Photo tile ──────────────────────────────────────────────────────────────
function PhotoTile({
  imageUrl, label, onClick, mode,
}: {
  imageUrl: string | null;
  label: string;
  onClick: () => void;
  mode: ModeDescriptor;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, position: 'relative', cursor: 'pointer',
        background: mode.stampFill, overflow: 'hidden', minHeight: 160,
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={label}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(20%) contrast(0.95)',
          }}
        />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 14,
        fontFamily: FF.label, fontSize: 9, fontWeight: 300,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: 'rgba(245,240,232,0.85)',
      }}>{label}</div>
      <div style={{
        position: 'absolute', bottom: 10, right: 14,
        width: 5, height: 5, borderRadius: '50%',
        background: mode.brass,
      }} />
    </div>
  );
}

// ─── Landing ────────────────────────────────────────────────────────────────
export default function FrostLanding() {
  const router = useRouter();
  const { homeMode, contentMode, mode, setHomeMode, setContentMode } = useFrostMode();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [days, setDays] = useState(0);
  const [dayWord, setDayWord] = useState('');
  const [weekday, setWeekday] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear]   = useState('');
  const [lineA, setLineA] = useState('');
  const [lineB, setLineB] = useState('');
  const [museUrl, setMuseUrl] = useState<string | null>(null);
  const [discoverUrl, setDiscoverUrl] = useState<string | null>(null);

  const isSanctuary = contentMode === 'sanctuary';

  useEffect(() => {
    // Date
    const wedding = getWeddingDate();
    const d = daysUntil(wedding);
    setDays(d);
    setDayWord(dayNumberToWords(d));
    const now = new Date();
    setWeekday(now.toLocaleDateString('en-IN', { weekday: 'long' }));
    setMonth(now.toLocaleDateString('en-IN', { month: 'long' }));
    setYear(String(now.getFullYear()));
    const dayNum = now.getDate();
    const ones = ['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth',
      'Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth',
      'Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second',
      'Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh',
      'Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First'];
    // Idle lines
    const [a, b] = pickIdleLines();
    setLineA(a); setLineB(b);

    // Static placeholder images (will be replaced by real API in P2-9)
    setMuseUrl('https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80&auto=format&fit=crop');
    setDiscoverUrl('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80&auto=format&fit=crop');
  }, []);

  const go = (path: string) => router.push(path);

  const sanctuaryMuseLine = 'Your saved inspiration.';
  const sanctuaryMomentsLine = 'Your wedding memories.';
  const sanctuaryPagesLine = 'Notes and pages.';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: mode.pagePaper,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ── Mode pill (top-right) ── */}
      <button
        onClick={() => setPickerOpen(true)}
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top,0px) + 14px)',
          right: 16,
          zIndex: 50,
          background: 'rgba(255,253,248,0.14)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `0.5px solid ${mode.hairline}`,
          borderRadius: 20,
          padding: '5px 12px',
          fontFamily: FF.label, fontSize: 8, fontWeight: 300,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: mode.brassMuted,
          cursor: 'pointer',
        }}
      >{homeMode === 'E1A' ? 'Dark' : 'Light'} · {isSanctuary ? 'Sanctuary' : 'Dream'}</button>

      {/* ── Hero block ── */}
      <div style={{
        background: `linear-gradient(to bottom, ${mode.heroGradient[0]}, ${mode.heroGradient[1]})`,
        padding: `calc(env(safe-area-inset-top,0px) + 40px) 24px 20px`,
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: FF.label, fontSize: 10, fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.soft, marginBottom: 4 }}>
          {weekday}
        </div>
        <div style={{ fontFamily: FF.display, fontSize: 28, color: mode.ink, lineHeight: 1.15, marginBottom: 2 }}>
          {month}
        </div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: mode.soft, marginBottom: 16 }}>
          {year}
        </div>
        <div style={{ height: '0.5px', background: mode.hairline, marginBottom: 16 }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 48, color: mode.brass, lineHeight: 1 }}>
            {dayWord}
          </span>
          <span style={{ fontFamily: FF.label, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: mode.brassMuted }}>
            {FROST_COPY.landing.daysWord}
          </span>
        </div>
      </div>

      {/* ── Canvas descent ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {!isSanctuary ? (
          // ── DREAM MODE ──────────────────────────────────────────────────
          <>
            {/* Photo row */}
            <div style={{ display: 'flex', height: 160, flexShrink: 0 }}>
              <PhotoTile imageUrl={museUrl}     label="Muse"     onClick={() => go('/frost/canvas/muse')}     mode={mode} />
              <div style={{ width: '0.5px', background: mode.hairline }} />
              <PhotoTile imageUrl={discoverUrl} label="Discover" onClick={() => go('/frost/canvas/discover')} mode={mode} />
            </div>

            {/* DreamAi tile */}
            <CanvasTile onClick={() => go('/frost/canvas/dream')} gradient={mode.dreamGradient} style={{ flex: 2.4, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 12 }}>
                Dream Ai
              </div>
              {[lineA, lineB].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                  <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 15, color: mode.soft, lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </CanvasTile>

            {/* Circle tile */}
            <CanvasTile onClick={() => go('/frost/canvas/journey/circle')} gradient={mode.circleGradient} style={{ flex: 1.8, padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 10 }}>
                Circle
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft }}>Quiet here for now.</span>
              </div>
            </CanvasTile>

            {/* Journey bar */}
            <CanvasTile
              onClick={() => go('/frost/canvas/journey')}
              gradient={mode.journeyGradient}
              style={{ flex: 1.2, paddingBottom: 'env(safe-area-inset-bottom,0px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}
            >
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted }}>
                Journey
              </div>
              <div style={{ fontFamily: FF.label, fontSize: 9, color: mode.hairline }}>→</div>
            </CanvasTile>
          </>
        ) : (
          // ── SANCTUARY MODE ───────────────────────────────────────────────
          <>
            <CanvasTile onClick={() => go('/frost/canvas/dream')} gradient={mode.dreamGradient} style={{ flex: 2.25, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 12 }}>Dream Ai</div>
              {[lineA, lineB].map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                  <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 15, color: mode.soft, lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </CanvasTile>

            <CanvasTile onClick={() => go('/frost/canvas/journey/circle')} gradient={mode.circleGradient} style={{ flex: 2.0, padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 10 }}>Circle</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.soft }}>Quiet here for now.</span>
              </div>
            </CanvasTile>

            <CanvasTile onClick={() => go('/frost/canvas/muse')} gradient={mode.museGradient} style={{ flex: 1.75, padding: '14px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 8 }}>Muse</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 13, color: mode.soft }}>{sanctuaryMuseLine}</span>
              </div>
            </CanvasTile>

            <CanvasTile onClick={() => go('/frost/canvas/journey')} gradient={mode.momentsGradient} style={{ flex: 1.5, padding: '12px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 8 }}>Moments</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 13, color: mode.soft }}>{sanctuaryMomentsLine}</span>
              </div>
            </CanvasTile>

            <CanvasTile onClick={() => go('/frost/canvas/journey')} gradient={mode.pagesGradient} style={{ flex: 1.25, padding: '10px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 6 }}>Pages</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontFamily: FF.label, fontSize: 9, color: mode.brass, marginTop: 2 }}>✦</span>
                <span style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 13, color: mode.soft }}>{sanctuaryPagesLine}</span>
              </div>
            </CanvasTile>

            <CanvasTile
              onClick={() => go('/frost/canvas/journey')}
              gradient={mode.journeyGradient}
              style={{ flex: 1.0, paddingBottom: 'env(safe-area-inset-bottom,0px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}
            >
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: mode.brassMuted }}>Journey</div>
              <div style={{ fontFamily: FF.label, fontSize: 9, color: mode.hairline }}>→</div>
            </CanvasTile>
          </>
        )}
      </div>

      {/* ── Mode picker sheet ── */}
      <ModeSheet
        visible={pickerOpen}
        mode={mode}
        homeMode={homeMode}
        contentMode={contentMode}
        onPickTone={(m) => { setHomeMode(m); }}
        onPickContent={(c) => { setContentMode(c); }}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
