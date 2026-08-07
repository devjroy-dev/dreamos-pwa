'use client';
// components/BottomNav.tsx — Atelier rebuild · TDW_09 PACKAGE 2 — THE FIVE DOORS
//
// Bottom nav fixed; content scrolls behind it.
// Italiana glyphs instead of SVG icons. Brass-bordered. Atelier material.
//
// ═══ THE FIVE STABLE DOORS (R-X27, arm (a); Paper A `docs/specs/TDW_09_S5_NAV_REMAP.md`) ═══
// ONE MEMBERSHIP, FOREVER: Home · Calendar · Business · Storefront · More.
// The two-membership bar (STUDIO_ITEMS / DISCOVER_ITEMS switched by mode) is the
// disease Paper A names — "a nav whose membership changes is a nav you cannot
// learn" — and it retires here WITH the mode, by subtraction (chair relay #3,
// fork 8.1 = (a)).
//
// ── THE ONE-AUTHORITY LESSON, CARRIED (F-07.30's leaf, retired caller-zero) ──
// lib/vendor/vendorModeForPath.ts was the ONE path classifier — minted when three
// files answered "which panel is this path?" and Header's enumerated list lied
// (the vendor read a STUDIO pill on his own Discover Profile; two more routes
// were minted into a stale list before the leaf ended the class). That leaf dies
// with the mode it classified, but its law survives HERE, in its successor:
// DOORS below is the ONE membership + active-state authority. No other file may
// answer "which door is this path?" — the demo twin (DECLARED-HELD, F-09.89)
// carries the OLD nav until its own rider and is not a second authority over
// this one. Active matching is PREFIX (exact only where a parent path would
// otherwise swallow its children's tabs), so a new sub-route classifies from its
// root without anyone remembering to enumerate it — the exact failure F-07.30
// paid for.
//
// ── ModePill TOMBSTONE (fork 8.4, named retirement, chair relay #3) ──────────
// `ModePill` + its SEGMENTS (Studio / AI ✦ / Discover) lived in this file and
// rendered in Header's centre slot. There is nothing left for it to switch: the
// mode is dissolved, so the pill retires by subtraction — not redesigned, not
// re-dressed. `VictorModeChip` (Business/Advisor) survives untouched as the ONE
// mode control; it shares no state, types, or hooks with what died here
// (VictorModeChip.tsx:5-8's own independence comment, chair-verified).
// ADDRESS UPDATED AT F-09.129 (mechanism-comment law): that one control is still
// the one control and is still byte-untouched, but it no longer stands under the
// Hub masthead. Its single mount is now INSIDE the risen chat
// (app/vendor/page.tsx, the `{risen && (` branch), beside the room label it
// publishes. The More mount died earlier at F-09.120. If you came here looking
// for a mode control on the Hub, there isn't one, and that is ruled.

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useT } from '@/lib/vendor/ThemeContext';
// TDW_09 P2 — F-09.21's cure, worn by construction on the new bar (S5 Paper A §3:
// "the F-09.21 pressed primitive" is what both bars inherit). First adopter of
// the P1-staged primitive; the carrier comment in controls.ts names this sitting.
import { pressedStyle } from '@/lib/vendor/controls';

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

// ── THE FIVE DOORS — the one membership + active-state authority ─────────────
// Labels are FOUNDER-VETOED BYTES (relay #2, 「 all ok 」): Home · Calendar ·
// Business · Storefront · More — none may drift a character without returning
// to him. Order is Paper A's own (serial-position: the two heaviest at the
// ends). Glyphs are CARRIED, not invented: ✦ is the AI star from the retired
// pill's own AI segment (Home is where the chat lives — the mark follows the
// meaning); ◐ ≡ ⋯ carry from the old studio set; ▣ carries from the Portfolio
// tab onto the door that absorbs it.
//
// ACTIVE MATCHING: Home and More are EXACT — '/vendor' prefixes everything and
// '/vendor/more' has no children, but exact-on-More also preserves the TDW_03
// P1 behaviour where list sub-slices light Business, not More. Storefront's
// prefix set is the door's own sections (Paper A: Portfolio · Discover status ·
// Discover leads · Collab live behind the word that says so), so standing on
// any of them lights the door that owns them. Screens outside every set
// (settings, tds, contracts, couture, featured, team-hub, studio leaves) light
// no tab — exactly as they lit none under the old bar.
type DoorItem = { href: string; label: string; glyph: string; exact?: boolean; activePrefixes?: string[] };

const DOORS: DoorItem[] = [
  { href: '/vendor',            label: 'Home',       glyph: '✦', exact: true },
  { href: '/vendor/calendar',   label: 'Calendar',   glyph: '◐' },
  // TDW_03 P1 (CE ruling Q1, 2026-07-14): prefix match so the tab highlights on
  // /vendor/list/* now that the landing redirects to a slice. Behaviour carried
  // verbatim from the retired STUDIO_ITEMS entry.
  { href: '/vendor/list',       label: 'Business',   glyph: '≡' },
  { href: '/vendor/storefront', label: 'Storefront', glyph: '▣',
    activePrefixes: ['/vendor/storefront', '/vendor/portfolio', '/vendor/discover', '/vendor/collab'] },
  { href: '/vendor/more',       label: 'More',       glyph: '⋯', exact: true },
];

function doorActive(item: DoorItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  if (item.activePrefixes) return item.activePrefixes.some(p => pathname.startsWith(p));
  return pathname.startsWith(item.href);
}

// ── NavTab ───────────────────────────────────────────────────────
function NavTab({ item, active, reducedMotion }: { item: DoorItem; active: boolean; reducedMotion: boolean }) {
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
  // THE DEMO SHELL CARRIES THE SAME RULE. Under TDW_09 P2 the demo twin is
  // DECLARED-HELD on the OLD two-membership bar (F-09.89, fork 8.5 = (b), chair
  // relay #3) — the structural divergence is FILED, founder-sequenced, and the
  // twin adopts the five doors wholesale when its own rider opens. Until then
  // its copy of this colour rule stands where the both-homes cure left it.
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
  const color = active ? A.brassWarm : A.ink;

  // TDW_09 P2 · F-09.21 — the pressed acknowledgment. The bar suppresses the
  // native tap flash (`WebkitTapHighlightColor: 'transparent'` below) and this
  // is its REPLACEMENT — suppression-without-replacement is the finding's whole
  // disease. Pointer events cover touch and mouse in one register; the pressed
  // state clears on up, cancel, and leave so a drag-off never wedges it.
  const [pressed, setPressed] = useState(false);

  return (
    <a href={item.href} aria-current={active ? 'page' : undefined}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        padding: '4px 8px', textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...pressedStyle(pressed, reducedMotion),
      }}>
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
    </a>
  );
}

// ── BottomNav ────────────────────────────────────────────────────
export function BottomNav() {
  const pathname = usePathname() ?? '/vendor';
  const T = useT();

  // prefers-reduced-motion, read once and tracked — pressedStyle's transform arm
  // drops under it; the opacity arm stays (reduced motion is not a request for
  // zero feedback — controls.ts's own law).
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // ── FORK 8.3 (chair relay #3): REST-VISIBLE, RISEN-HIDDEN ──────────────────
  // The bar renders on EVERY vendor screen — the old `if (activeMode === 'ai')
  // return null` died with the mode, so Home wears the bar for the first time
  // (a deliberate, RULED visual change to the sealed O-2 screen, stated in the
  // relay so the founder's walk meets it as intention). While the chat is RISEN
  // the bar hides — the amended Model 1's full-bleed acceptance picture is the
  // warrant. MECHANISM (F-06.85): the home page publishes `chat-risen` on
  // <body> (app/vendor/page.tsx, the risen effect); the rule in globals.css
  // (`body.chat-risen .tdw-bottom-nav`) reads it. The className below is that
  // rule's hook — if it moves, the globals.css selector moves with it.
  return (
    <nav aria-label="Section navigation" data-tour="bottom-nav" data-atelier-backdrop="warm"
      className="tdw-bottom-nav"
      style={{
      position: 'sticky', bottom: 0, zIndex: 9,
      background: T.headerBg,
      backdropFilter: 'blur(28px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
      borderTop: `0.5px solid ${T.brassLine}`,
      boxShadow: '0 -1px 0 rgba(255,235,200,0.04)',
      padding: '10px 8px calc(12px + env(safe-area-inset-bottom))',
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
    }}>
      {DOORS.map(item => (
        <NavTab key={item.label} item={item} active={doorActive(item, pathname)} reducedMotion={reducedMotion} />
      ))}
    </nav>
  );
}
