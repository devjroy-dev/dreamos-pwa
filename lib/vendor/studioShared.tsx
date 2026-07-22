// lib/vendor/studioShared.tsx
// TDW_04.5 · P4 — ruling F11(c): ONE home for the chapter-index row vocabulary.
//
// Two screens now render the Team Hub section: /vendor/studio (which has always
// shown it beneath Your Studio) and /vendor/team-hub (the new route More points
// at). If each kept its own Row, SectionLabel and STUDIO_ITEMS, the founder's
// verbatim three — Team · Tasks · Team Payments — would exist twice, and the
// second copy would start drifting the first time anyone edited one screen.
//
// This is the F8(d) precedent from P3 (the slot-word map hoisted to
// lib/vendor/slotWords.ts, both surfaces importing it) applied to the same class
// of problem: shared vocabulary lives in one file or it diverges.
//
// ZERO NEW STRINGS. Every label and description below is MOVED byte-for-byte
// from app/vendor/studio/page.tsx, where it already shipped. The Team Hub rider
// was declared expected-zero at read-first and it stays expected-zero.
'use client';

import Link from 'next/link';

export const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
} as const;

export const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

export interface Item { href: string; label: string; desc: string; glyph: string; locked?: boolean; }

// THE FOUNDER'S VERBATIM THREE. This array is the reason the module exists.
export const STUDIO_ITEMS: Item[] = [
  { href: '/vendor/studio/team',          label: 'Team',          desc: 'roster and contact details', glyph: 'T' },
  { href: '/vendor/studio/tasks',         label: 'Tasks',         desc: 'assignments and deadlines',  glyph: '✓' },
  { href: '/vendor/studio/team-payments', label: 'Team Payments', desc: 'what you owe your crew',     glyph: '◇' },
];

export function Chevron() {
  return <span style={{ color: 'var(--atelier-label)', fontFamily: F.display, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>›</span>;
}

export function SectionLabel({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{ padding: first ? '24px 24px 14px' : '32px 24px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass }}>{label}</span>
      <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
    </div>
  );
}

export function Row({ item }: { item: Item }) {
  const isLocked = item.locked;
  const rowStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 18,
    textDecoration: 'none',
    borderBottom: '0.5px solid var(--atelier-card-border)',
    cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.55 : 1,
  };
  const inner = (
    <>
      <span style={{
        flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.display, fontWeight: 400, fontSize: 26, color: A.brassWarm, lineHeight: 1,
      }}>{item.glyph}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 19, color: A.ink, letterSpacing: '0.005em', lineHeight: 1.15 }}>{item.label}</div>
        <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, marginTop: 2, letterSpacing: '0.01em' }}>{item.desc}</div>
      </div>
      {isLocked ? (
        <span style={{
          fontFamily: F.label, fontWeight: 400, fontSize: 8, color: A.brass,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          border: `0.5px solid rgba(201,168,76,0.5)`, borderRadius: 2, padding: '4px 9px', flexShrink: 0,
        }}>Prestige</span>
      ) : <Chevron />}
    </>
  );
  if (isLocked) return <div style={rowStyle}>{inner}</div>;
  return <Link href={item.href} style={rowStyle}>{inner}</Link>;
}

// THE ONE PRESTIGE GATE (F11(c)). Both entry points ask this function; neither
// decides for itself what Prestige means.
export function isPrestige(tier: string | null | undefined): boolean {
  return tier === 'prestige';
}
