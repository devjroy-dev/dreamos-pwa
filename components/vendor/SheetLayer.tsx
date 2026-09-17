'use client';
// components/vendor/SheetLayer.tsx — CE-43 LC-2 packet 3j · F-43.116. The ONE layer every vendor
// sheet mounts through (the rule and its derivation: lib/vendor/sheetStack.ts).
//
//   <SheetLayer open={open}> scrim + panel </SheetLayer>
//
// · PORTALED to document.body, so no ancestor's transform, filter or overflow can re-anchor or clip a
//   `position: fixed` sheet (the lead card's attach sheet sat inside DetailSheet's transformed panel).
// · STACKED by open order: the render prop receives the layer's z-indexes; a layer with an open sheet
//   above it is `inert` as a whole (scrim and panel), so it neither scrolls nor takes a tap.
// · KEYBOARD-AWARE: while any layer is open, the visual viewport is written to three CSS variables on
//   <html> (--tdw-vvh, --tdw-kb, --tdw-safe); sheets bound their height with sheetBound() and sit at
//   `bottom: var(--tdw-kb)`, so the action row stays above the keyboard and within thumb reach.
// A closed sheet stays mounted (its slide-out needs a node) and is not in the stack.
import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  openLayer, closeLayer, depthOf, isBeneath, subscribeLayers, layerZ, viewportVars, openLayers,
} from '@/lib/vendor/sheetStack';

export { sheetBound } from '@/lib/vendor/sheetStack';

/** The styles every sheet body carries: it scrolls on its own and never hands the gesture on. */
export const SHEET_BODY_SCROLL = {
  overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', minHeight: 0,
} as const;
/** Where a sheet's bottom edge sits: on the keyboard's top edge, or the screen's bottom. */
export const SHEET_BOTTOM = 'var(--tdw-kb, 0px)';
/** The bottom safe-area, dropped while the keyboard is up. */
export const SHEET_SAFE = 'var(--tdw-safe, env(safe-area-inset-bottom))';

let vvUsers = 0;
let vvDetach: (() => void) | null = null;
function writeViewport(): void {
  const vv = window.visualViewport;
  const v = viewportVars(window.innerHeight, vv ? { height: vv.height, offsetTop: vv.offsetTop } : null);
  const s = document.documentElement.style;
  s.setProperty('--tdw-vvh', v.vvh);
  s.setProperty('--tdw-kb', v.kb);
  s.setProperty('--tdw-safe', v.safe);
}
function watchViewport(): () => void {
  vvUsers += 1;
  if (vvUsers === 1) {
    writeViewport();
    const vv = window.visualViewport;
    const on = () => writeViewport();
    vv?.addEventListener('resize', on);
    vv?.addEventListener('scroll', on);
    window.addEventListener('resize', on);
    vvDetach = () => {
      vv?.removeEventListener('resize', on);
      vv?.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      const s = document.documentElement.style;
      s.removeProperty('--tdw-vvh'); s.removeProperty('--tdw-kb'); s.removeProperty('--tdw-safe');
    };
  }
  return () => {
    vvUsers -= 1;
    if (vvUsers === 0 && vvDetach) { vvDetach(); vvDetach = null; }
  };
}

const serverStack: readonly string[] = [];
const noSubscribe = () => () => {};

export function SheetLayer({ open, children, testId }: {
  open: boolean;
  /** The scrim and the panel, given this layer's z-indexes. */
  children: (z: { scrim: number; panel: number }) => ReactNode;
  testId?: string;
}) {
  const id = useId();
  // False on the server and through hydration, true in the browser: the portal needs document.body.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  useEffect(() => {
    if (!open) return undefined;
    openLayer(id);
    const unwatch = watchViewport();
    return () => { closeLayer(id); unwatch(); };
  }, [open, id]);
  // Re-render when the stack changes, so depth and `inert` follow the sheets above.
  useSyncExternalStore(subscribeLayers, openLayers, () => serverStack);
  if (!mounted) return null;
  const z = layerZ(depthOf(id));
  return createPortal(
    <div data-sheet-layer={testId || ''} inert={isBeneath(id)}>{children(z)}</div>,
    document.body,
  );
}

/** A body ref whose scroll returns to the top each time its sheet opens, so a sheet reopened for a
    different record does not start where the last one was left. */
export function useSheetScrollReset<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => { if (open && ref.current) ref.current.scrollTop = 0; }, [open]);
  return ref;
}
