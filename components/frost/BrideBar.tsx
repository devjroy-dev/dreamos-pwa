'use client';
// components/frost/BrideBar.tsx
//
// ── TDW_09 · PACKAGE 4 · THE BRIDE BAR ────────────────────────────────────────
// The five ruled doors: Home · Discover · Muse · Journey · Circle.
// Ruled at docs/specs/TDW_09_S5_NAV_REMAP.md §2-REDELIVERY (R-X28), founder word
// 「 5 doors 」, Circle promoted from its seat under Journey to its own door.
//
// BUILT FROM ZERO (F-09.136): components/frost/CanvasShell.tsx carried a
// safe-area pad and no tab bar — the bride lane had no nav to amend.
//
// THE FLOOR THIS INHERITS (S5 §3, restated not re-invented):
//   · 48px stable tabs, one membership, forever
//   · labels ALWAYS visible (recognition over icon-recall)
//   · the F-09.21 pressed primitive — IMPORTED from lib/vendor/controls,
//     never re-rolled (c75d22c's own discipline: "pressedStyle imported not
//     re-rolled"). The import is read-only; no vendor byte moves.
//   · active = INK-WEIGHT SHIFT. NO GOLD IN CHROME — the spec's own law. There
//     is no accent, no brass, no signal colour anywhere in this file; the active
//     door is heavier ink, the resting doors are inkMute.
//   · safe-area padded
//   · prefers-reduced-motion collapses motion — handled inside pressedStyle,
//     which drops the transform arm and keeps the opacity arm (reduced motion
//     is not a request for zero feedback).
//
// ON-TOKEN FROM BIRTH: every colour here comes from getV2Tokens(homeMode).
// This file contains ZERO `dark ?` ternaries and ZERO colour literals by
// construction — F-09.27's disease is not re-introduced by its own cure's bar.

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Sparkles, Map, Users } from 'lucide-react';
import { getV2Tokens, FF, HomeModeKey } from '../../lib/frost/tokens';
import { pressedStyle } from '../../lib/vendor/controls';

export interface BrideDoor {
  key:   string;
  label: string;
  route: string;
  Icon:  React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

/** The five doors, in their ruled order. Serial position: Home first (the app
 *  opens where she rests), Circle last (the one door that is people). */
export const BRIDE_DOORS: BrideDoor[] = [
  { key: 'home',     label: 'Home',     route: '/frost/canvas/sanctuary',      Icon: Home     },
  { key: 'discover', label: 'Discover', route: '/frost/canvas/explore',        Icon: Compass  },
  { key: 'muse',     label: 'Muse',     route: '/frost/canvas/muse',           Icon: Sparkles },
  { key: 'journey',  label: 'Journey',  route: '/frost/canvas/journey',        Icon: Map      },
  { key: 'circle',   label: 'Circle',   route: '/frost/canvas/journey/circle', Icon: Users    },
];

/** THE BAR'S HEIGHT, exported so the layout reserves exactly this much and no
 *  surface has to guess. 48px of tab + the label's own line + the breathing the
 *  register asks for. Safe-area is added on top of this, outside the number. */
export const BRIDE_BAR_HEIGHT = 62;

/** Which door owns a pathname. LONGEST PREFIX WINS, and that is load-bearing:
 *  Circle's shipped route (/frost/canvas/journey/circle) lives UNDER Journey's,
 *  so a first-match walk would light Journey on every Circle screen. Exported
 *  because the bench asserts this function directly rather than a regex over
 *  the file (independent-method law: the check's failure mode differs from the
 *  code's). */
export function activeDoorKey(pathname: string | null): string | null {
  if (!pathname) return null;
  let best: BrideDoor | null = null;
  for (const d of BRIDE_DOORS) {
    if (pathname === d.route || pathname.startsWith(d.route + '/')) {
      if (!best || d.route.length > best.route.length) best = d;
    }
  }
  return best ? best.key : null;
}

/** The routes the bar is seated on: the five doors and everything beneath them.
 *  Onboarding, dream and surprise are DELIBERATELY absent — a bar on an
 *  onboarding flow is chrome competing with the one thing she is meant to do. */
export function barIsSeatedOn(pathname: string | null): boolean {
  return activeDoorKey(pathname) !== null;
}

/** `homeMode` arrives as a PROP, never through the frost context, and the reason
 *  is mechanical: the layout owns the context and mounts this bar, so importing
 *  `useFrostMode` back out of the layout would close an import cycle between the
 *  two files. One direction only — the layout knows the bar, the bar does not
 *  know the layout. */
export default function BrideBar({ homeMode }: { homeMode: HomeModeKey }) {
  const pathname = usePathname();
  const router   = useRouter();
  const t = getV2Tokens(homeMode);

  const [pressedKey,    setPressedKey]    = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Release on up, cancel AND leave: a drag off a door must not strand it lit.
  const press = useCallback((key: string) => ({
    onPointerDown:   () => setPressedKey(key),
    onPointerUp:     () => setPressedKey(null),
    onPointerCancel: () => setPressedKey(null),
    onPointerLeave:  () => setPressedKey(null),
  }), []);

  const active = activeDoorKey(pathname);
  if (active === null) return null;

  return (
    <nav
      aria-label="Main"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
        display: 'flex',
        background: t.glassBandBg,
        backdropFilter: t.glassBandBlur,
        WebkitBackdropFilter: t.glassBandBlur,
        borderTop: `0.5px solid ${t.line}`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {BRIDE_DOORS.map(d => {
        const on = d.key === active;
        return (
          <button
            key={d.key}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => router.push(d.route)}
            {...press(d.key)}
            style={{
              flex: 1,
              minHeight: 48,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              padding: '7px 0 9px',
              background: 'none', border: 'none', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              // ACTIVE = INK WEIGHT. No accent, no gold, no pill, no underline.
              color: on ? t.ink : t.inkMute,
              ...pressedStyle(pressedKey === d.key, reducedMotion),
            }}
          >
            <d.Icon size={19} color={on ? t.ink : t.inkMute} strokeWidth={on ? 1.7 : 1.3} />
            <span
              style={{
                fontFamily: FF.mono,
                fontSize: 8.5,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                fontWeight: on ? 400 : 300,
                lineHeight: 1,
              }}
            >
              {d.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
