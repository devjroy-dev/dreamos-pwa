// lib/vendor/sheetStack.ts — CE-43 LC-2 packet 3j · F-43.116 (founder-raised, chair-ruled).
//
// THE ONE RULE FOR EVERY VENDOR SHEET, AT EVERY STACKING DEPTH:
//   · the topmost open sheet owns the scroll and the touch; every open sheet beneath it is inert
//     and still (its layer carries `inert`, so a finger on it does nothing and it cannot scroll);
//   · each layer's scrim sits ABOVE the sheet beneath it and below its own sheet, so a lower sheet
//     is covered, not merely drawn under;
//   · a sheet is never taller than the visible viewport, and it rides above the on-screen keyboard.
//
// WHY THIS EXISTS (derived at dreamos-pwa 45f6d906, re-derivable by reading the files named):
//   · every sheet hard-coded its own z-index: the shared Sheet and DetailSheet 40/50, the Clients
//     sheet 40/50, the WishboneSheet 60/61, the binder edit sheet 60. Two sheets at 50 stacked by DOM
//     order alone, and a stacked sheet's scrim (40) sat UNDER the sheet beneath it (50), so the lower
//     sheet stayed live and scrollable while the top one was open (the founder tapped the lead
//     detail's chip through an open booking sheet on card 3i);
//   · the lead card's attach sheet is rendered inside DetailSheet's panel, which carries a transform
//     and a backdrop-filter, so its `position: fixed` resolved against that panel, not the screen;
//   · the root layout emits two viewport metas and the later one (Next's `viewport` export) has no
//     `interactive-widget=resizes-content`, so on Android the keyboard overlays a bottom sheet; iOS
//     Safari overlays it regardless. Only the visual viewport knows where the keyboard is.
//
// Pure: no React, no DOM. components/vendor/SheetLayer.tsx is the only caller; the bench drives this.

type Listener = () => void;
let stack: readonly string[] = [];
const listeners = new Set<Listener>();

function emit(): void { listeners.forEach((fn) => fn()); }

/** A sheet opened: it goes on top. Opening twice is one layer. */
export function openLayer(id: string): void {
  if (stack.includes(id)) return;
  stack = [...stack, id];
  emit();
}

/** A sheet closed or unmounted: it leaves the stack wherever it was. */
export function closeLayer(id: string): void {
  if (!stack.includes(id)) return;
  stack = stack.filter((x) => x !== id);
  emit();
}

/** -1 when the sheet is not open. */
export function depthOf(id: string): number { return stack.indexOf(id); }

/** True when the sheet is open and no other open sheet is above it. */
export function isTop(id: string): boolean { return stack.length > 0 && stack[stack.length - 1] === id; }

/** True when the sheet is open and another open sheet is above it: its layer is inert and still. */
export function isBeneath(id: string): boolean { const d = depthOf(id); return d >= 0 && d < stack.length - 1; }

export function subscribeLayers(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** The open stack, bottom first (read-only; for the bench and for diagnostics). */
export function openLayers(): readonly string[] { return stack; }

/** Test hook: forget every layer. */
export function resetLayers(): void { stack = []; emit(); }

/** The estate's base for vendor sheets (the values every sheet used before: scrim 40, panel 50).
    Depth d puts the scrim at 40 + 20d and the panel at 50 + 20d, so layer d's scrim is strictly above
    layer d-1's panel and never ties with it. The header drawer (199/200) and the toast (9999) stay above any realistic depth. */
export const LAYER_BASE = 40;
export const LAYER_STEP = 20;
export function layerZ(depth: number): { scrim: number; panel: number } {
  const d = depth < 0 ? 0 : depth;
  return { scrim: LAYER_BASE + LAYER_STEP * d, panel: LAYER_BASE + 10 + LAYER_STEP * d };
}

/** The visual viewport as CSS values. `kb` is how much of the layout viewport the keyboard (or any
    overlaying browser UI) covers at the bottom; `vvh` is what remains visible; `safe` is the bottom
    safe-area, dropped while a keyboard covers it (the keyboard already clears the home indicator). */
export function viewportVars(layoutHeight: number, vv: { height: number; offsetTop: number } | null): { vvh: string; kb: string; safe: string } {
  if (!vv || !(vv.height > 0) || !(layoutHeight > 0)) return { vvh: '100dvh', kb: '0px', safe: 'env(safe-area-inset-bottom)' };
  const covered = Math.max(0, Math.round(layoutHeight - vv.height - vv.offsetTop));
  const open = covered > 80; // below this it is browser chrome settling, not a keyboard
  return {
    vvh: `${Math.round(vv.height)}px`,
    kb: open ? `${covered}px` : '0px',
    safe: open ? '0px' : 'env(safe-area-inset-bottom)',
  };
}

/** A sheet's height bound: its own cap, and never past the visible viewport less a 12px top gap. */
export function sheetBound(cap: string): string {
  return `min(${cap}, calc(var(--tdw-vvh, 100dvh) - 12px))`;
}
