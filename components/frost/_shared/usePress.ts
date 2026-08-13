'use client';
// components/frost/_shared/usePress.ts
//
// TDW_13 · D-4 · MOVED ONCE. Nine components called this at module scope inside
// sanctuary/page.tsx; six of them now live in their own files and cannot. The
// body below is byte-identical to sanctuary/page.tsx:114-168 at b1448c4.
import { useState, useEffect, useCallback } from 'react';
import { pressedStyle } from '@/lib/vendor/controls';

// ── TDW_09 P2C · L4 · F-09.21's pressed acknowledgment, KEYED ─────────────────
//
// WHY A HOOK AND NOT A COMPONENT. Nineteen controls on this screen suppress the
// native tap flash and put nothing in its place — the founder's 「 insensitive 」.
// They are 13 <div>, 5 <button> and 1 <a> across nine owning components; a
// polymorphic wrapper would have to reproduce three element contracts to give
// them one shared behaviour. State is the only thing they actually share, so the
// hook carries the state and each site keeps its own element and its own style.
//
// WHY KEYED AND NOT BOOLEAN — this is the whole law. Seven of the nineteen render
// inside a `.map()` callback. A single boolean per component would light every
// sibling in the loop on one press: press one mood dot, all twelve dim. Each map
// site therefore composes its key from the SAME discriminator its React `key`
// already uses, so one press lights exactly one instance. A map site carrying a
// bare static key is a defect by definition, and `tdw09_p2c.proof.mjs` §4 convicts
// one structurally rather than trusting this comment.
//
// F-09.106 (chair-carried): the roster this hook was chartered against listed ten
// map sites. Three of them — the CircleRoom add button, the PagesRoom CTA and the
// Dream Ai anchor — sit AFTER their neighbouring map closes and their loop
// variables are out of scope there; the compiler said so (TS2304) before a byte
// shipped. The true split is 7 map / 12 standalone / 1 held. Do not re-promote
// the ten without re-deriving it.
//
// `pressedStyle` is IMPORTED from the canon home, never re-implemented here.
// Hand-rolling a copy of an existing primitive is the F-07.52 class that L3
// retired one delivery ago; the frost lane already crosses to @/lib/vendor for
// `formatRs`, so the boundary is precedent, not a new one.
//
// MECHANISM (F-06.85's law): the pressed VALUES — scale .98, opacity, 80ms, and
// the reduced-motion arm — all live in `pressedStyle`. If those move, they move
// there, not here. This hook owns WHICH control is pressed and nothing else.
export function usePress() {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  // Release on up, cancel AND leave: a drag off the control must not strand it lit.
  const press = useCallback((key: string) => ({
    onPointerDown: () => setPressedKey(key),
    onPointerUp: () => setPressedKey(null),
    onPointerCancel: () => setPressedKey(null),
    onPointerLeave: () => setPressedKey(null),
  }), []);
  const pressed = useCallback(
    (key: string) => pressedStyle(pressedKey === key, reducedMotion),
    [pressedKey, reducedMotion],
  );
  return { press, pressed };
}
