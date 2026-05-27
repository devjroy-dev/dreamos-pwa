'use client';
// components/BottomNav.tsx — Atelier rebuild
//
// Bottom nav fixed; content scrolls behind it.
// Italiana glyphs instead of SVG icons. Brass-bordered. Atelier material.
//
// STUDIO mode  → CALENDAR | BUSINESS | MORE
// AI mode      → no bottom nav (chat input owns the bottom)
// DISCOVER mode → HUB | LEADS | COLLAB

import { usePathname } from 'next/navigation';
import { useVendorMode, type VendorMode } from '@/hooks/vendor/useVendorMode';
import { useT } from '@/lib/vendor/ThemeContext';

const A = {
  ink:       'var(--atelier-ink)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassDeep: '#B59548',
  brassLine: 'rgba(201,168,76,0.18)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ── Mode from pathname ───────────────────────────────────────────
function modeFromPathname(pathname: string): VendorMode {
  if (pathname === '/vendor' || pathname.startsWith('/vendor/auth')) return 'ai';
  if (
    pathname.startsWith('/vendor/discover') ||
    pathname.startsWith('/vendor/portfolio') ||
    pathname.startsWith('/vendor/couture') ||
    pathname.startsWith('/vendor/featured') ||
    pathname.startsWith('/vendor/collab')
  ) return 'discover';
  return 'studio';
}

// ── ModePill (Atelier-styled, brass-bordered) ───────────────────
interface ModePillProps {
  key?: React.Key; mode: VendorMode; onChange: (m: VendorMode) => void; }

const SEGMENTS: { key: VendorMode; label: string; star?: boolean }[] = [
  { key: 'studio',   label: 'Studio' },
  { key: 'ai',       label: 'AI',  star: true },
  { key: 'discover', label: 'Discover' },
];

export function ModePill({ mode, onChange }: ModePillProps) {
  const T = useT();
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--atelier-input-bg)',
      border: '0.5px solid rgba(201,168,76,0.22)',
      borderRadius: 999, padding: 3,
    }}>
      {SEGMENTS.map(seg => {
        const active = mode === seg.key;
        return (
          <button key={seg.key} type="button" onClick={() => onChange(seg.key)} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 11px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: active ? 'rgba(201,168,76,0.18)' : 'transparent',
            boxShadow: active ? 'inset 0 0 0 0.5px rgba(201,168,76,0.5)' : 'none',
            transition: `all 200ms ${EASE}`,
            WebkitTapHighlightColor: 'transparent',
          }}>
            {seg.star && (
              <span style={{
                fontSize: 9,
                color: active ? A.brassWarm : A.inkMute,
                transition: `color 200ms ${EASE}`,
                lineHeight: 1,
              }}>✦</span>
            )}
            <span style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: active ? A.brassWarm : T.inkMute,
              transition: `color 200ms ${EASE}`, lineHeight: 1,
            }}>{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Sub-nav definitions ──────────────────────────────────────────
type SubItem = { href: string; label: string; glyph: string; exact?: boolean; locked?: boolean };

const STUDIO_ITEMS: SubItem[] = [
  { href: '/vendor/calendar', label: 'Calendar', glyph: '◐' },
  { href: '/vendor/list',     label: 'Business', glyph: '≡', exact: true },
  { href: '/vendor/more',     label: 'More',     glyph: '⋯', exact: true },
];

const DISCOVER_ITEMS: SubItem[] = [
  { href: '/vendor/portfolio',      label: 'Portfolio', glyph: '▣' },
  { href: '/vendor/discover/leads', label: 'Leads',  glyph: '✉' },
  { href: '/vendor/collab',          label: 'Collab', glyph: '◇' },
];

// ── NavTab ───────────────────────────────────────────────────────
function NavTab({ item, active }: { item: SubItem; active: boolean }) {
  const color = item.locked ? 'rgba(240,230,210,0.18)' : active ? A.brassWarm : A.inkMute;

  const inner = (
    <>
      <span style={{
        fontFamily: F.display,
        fontSize: 22,
        lineHeight: 1,
        color,
        transition: `color 200ms ${EASE}, text-shadow 200ms ${EASE}`,
        textShadow: active ? '0 0 12px rgba(224,188,110,0.4)' : 'none',
      }}>{item.glyph}</span>
      <span style={{
        fontFamily: F.label,
        fontWeight: active ? 400 : 300,
        fontSize: 8,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color,
        transition: `color 200ms ${EASE}`,
      }}>{item.label}</span>
    </>
  );

  if (item.locked || !item.href) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '4px 8px', cursor: 'default', opacity: 0.45,
      }}>{inner}</div>
    );
  }

  return (
    <a href={item.href} aria-current={active ? 'page' : undefined} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '4px 8px', textDecoration: 'none',
      WebkitTapHighlightColor: 'transparent',
    }}>{inner}</a>
  );
}

// ── BottomNav ────────────────────────────────────────────────────
export function BottomNav() {
  const pathname    = usePathname() ?? '/vendor';
  const activeMode  = modeFromPathname(pathname);
  const T = useT();

  // AI mode — full-page chat, no bottom nav (peek-a-boo arrives later)
  if (activeMode === 'ai') return null;

  const items = activeMode === 'studio' ? STUDIO_ITEMS : DISCOVER_ITEMS;

  return (
    <nav aria-label="Section navigation" data-tour="bottom-nav" data-atelier-backdrop="warm" style={{
      position: 'sticky', bottom: 0, zIndex: 9,
      background: T.headerBg,
      backdropFilter: 'blur(28px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
      borderTop: `0.5px solid ${T.brassLine}`,
      boxShadow: '0 -1px 0 rgba(255,235,200,0.04)',
      padding: '10px 8px calc(12px + env(safe-area-inset-bottom))',
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
    }}>
      {items.map(item => {
        const active = item.exact
          ? pathname === item.href
          : item.href ? pathname.startsWith(item.href) : false;
        return <NavTab key={item.label} item={item} active={active} />;
      })}
    </nav>
  );
}
