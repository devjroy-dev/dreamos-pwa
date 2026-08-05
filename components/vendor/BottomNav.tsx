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
// TDW_07 MICRO-2 · F-07.30 — the ONE path authority.
import { vendorModeForPath } from '@/lib/vendor/vendorModeForPath';
import { useT } from '@/lib/vendor/ThemeContext';

const A = {
  ink:       'var(--atelier-ink)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassDeep: 'var(--role-metal)',
  brassLine: 'rgba(201,168,76,0.18)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ── Mode from pathname ───────────────────────────────────────────
// TDW_07 MICRO-2 · F-07.30 — modeFromPathname MOVED to lib/vendor/vendorModeForPath.ts.
// This implementation was CORRECT (prefix-based, agreeing with the layout's pager); it is
// retired anyway, because two correct copies of one rule are still two copies, and the
// third copy — Header's enumerated list — is what shipped the defect. One home is the cure,
// not one home plus two that happen to agree today.
const modeFromPathname = vendorModeForPath;

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
                fontSize: 16,
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
  // TDW_03 P1 (CE ruling Q1, 2026-07-14): exact-match dropped so the tab
  // highlights on /vendor/list/* now that the landing redirects to a slice.
  // Behavior preservation, not nav redesign — Block 09's rebuild inherits this.
  { href: '/vendor/list',     label: 'Business', glyph: '≡' },
  { href: '/vendor/more',     label: 'More',     glyph: '⋯', exact: true },
];

const DISCOVER_ITEMS: SubItem[] = [
  { href: '/vendor/portfolio',      label: 'Portfolio', glyph: '▣' },
  { href: '/vendor/discover/leads', label: 'Leads',  glyph: '✉' },
  { href: '/vendor/collab',          label: 'Collab', glyph: '◇' },
];

// ── NavTab ───────────────────────────────────────────────────────
function NavTab({ item, active }: { item: SubItem; active: boolean }) {
  // ── LEGIBILITY (founder-reported on the demo TDS room, 2026-08-03) ─────────
  // The INACTIVE tab read `--atelier-ink-mute` — alpha 0.45 on the espresso
  // theme and 0.34 on the third — under 8px uppercase at 0.28em tracking. On a
  // 555px viewport that is not a de-emphasised label, it is an unreadable one:
  // the founder could not tell the tabs were tabs.
  //
  // IT IS RAISED TO THE PRIMARY INK TOKEN, NOT TO `#fff`. A hardcoded white
  // would go INVISIBLE on the light theme, whose `--atelier-ink` is #1A0F08.
  // "White" here means "the ink this theme reads with"; the token already knows
  // which that is. The ACTIVE tab keeps brass, so the two are still distinct —
  // by hue now rather than by whether you can see one of them.
  //
  // THE DEMO SHELL CARRIES THE SAME RULE and it moves in the same delivery.
  // app/demo/vendor/[handle]/layout.tsx is an exact port of this nav and holds
  // its own copy of this line; curing one alone would leave a claimed vendor
  // reading tabs he could not see on the very screen the demo promised him.
  // Filed as the drift it is: two homes for one colour rule, corrected together
  // this time and NOT folded, because folding a live vendor nav into a demo
  // shell is an architecture act nobody ruled.
  // ── TDW_09 F-09.15b — THE HARDCODED CREAM, CURED ──────────────────────────
  // The locked branch read the espresso ink at 18% alpha as a bare CREAM
  // LITERAL, not a token — one theme's ink written into a component that three
  // themes render. On Editorial Paper the page is also cream: the measured pair
  // was 1.02:1. A locked tab was not dim there, it was ABSENT.
  //
  // THE LITERAL IS DELIBERATELY NOT QUOTED IN THIS COMMENT. The bench's ④ sweeps
  // the vendor tree for it and reads comments too (ChatThread.tsx's own precedent:
  // naming a deleted string is not the same act as keeping it). This comment's
  // first draft reproduced it and was convicted by that cell before delivery.
  //
  // The comment directly above already argued this exact case for the INACTIVE
  // branch ("a hardcoded white would go INVISIBLE on the light theme") and then
  // left the literal standing one branch below it. Same disease, same file, one
  // line apart, uncured for a block — which is why this is a token now and not a
  // second literal chosen more carefully.
  const color = item.locked ? 'var(--atelier-ink-fade)' : active ? A.brassWarm : A.ink;

  const inner = (
    <>
      <span style={{
        fontFamily: F.display,
        fontSize: 20,
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
