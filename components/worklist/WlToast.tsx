"use client";
// components/worklist/WlToast.tsx — THE SHELL'S OWN TOAST. CE-38 relay #2, arm (c).
//
// ── WHY THIS FILE EXISTS, AND WHY IT IS NOT A FORK ──────────────────────────
//
// `components/vendor/Toast.tsx` reads five values off `useT()` as JAVASCRIPT — `T.isLight`
// at :33/:38/:43/:51/:65/:77, plus `T.sheetTop`, `T.sheetBorder`, `T.accent`, `T.ink`. Not
// CSS variables: context values. So a Toast rendered inside `/w`, where no ThemeProvider
// mounts, falls to `createContext(DARK)`'s default and paints Graphite-dark on a Chalk
// page, in both modes, forever.
//
// TWO ARMS WERE OFFERED AND BOTH WERE REFUSED BY THE CHAIR, on reasons worth keeping:
//
//   (a) mount `<ThemeProvider pinned={mode}>` around the Toast. It works — AskSheet.tsx:32
//       already does exactly this. But F-38.3 is the reason it is refused: a pinned
//       provider is NOT inert on the document. `applyTheme` toggles
//       `documentElement.classList` for `theme-light` (ThemeContext.tsx:117) and
//       `applyCSSVars(t, pin)` writes `documentElement.style.background` and
//       `body.style.background` (:85-87). That is the SAME `html.theme-light` writer ZIP
//       14 ⑥ convicted as the flash mechanism. Arm (a) buys Billing at the price of the
//       defect the founder has caught most often.
//
//   (b) teach `Toast.tsx` to read `data-wl-mode`. That is an edit to a component `main`
//       renders, so that it can read an attribute only this branch sets. A fork wearing a
//       prop.
//
// SO: THE SHELL HAS ITS OWN TOAST, exactly as it has its own nav, its own coin and its own
// drawer (R-37.84 ①). The distinction that makes this one home rather than two: this file
// owns no state, no timing and no vocabulary. `useToast()` is the single home for all
// three and is imported, not copied — the same hook, the same `ToastState`, the same
// `show()` contract, so a caller swaps ONE import and nothing else. What lives here is
// presentation, and presentation is what a shell is.
//
// EVERY COLOUR BELOW IS A CSS VARIABLE EMITTED BY `scopeCss('.wl')`. There is no `useT`
// import in this file and the audit asserts there is none anywhere under
// `components/worklist/` or `app/w/` — which is what keeps arm (a) from creeping back in
// through a later convenience.
//
// ── THE MOUNT IS LOAD-BEARING (HONEST CONTROLS, CE-209) ─────────────────────
// Five of Billing's sentences reach the vendor ONLY through `show()`. A caller that
// renders the billing surface without mounting this component ships a Cancel button that,
// when the call fails, does nothing and says nothing — a failed cancel that looks like a
// successful one. Asserted by cell at every caller, never trusted.
import { useEffect, useState } from 'react';
import type { ToastState } from '@/hooks/vendor/useToast';

const SHRINK_AFTER_MS = 5000;

export function WlToast({ toast }: { toast: ToastState | null }) {
  // TDW_04 A3.3 (F-04.16(a), CE-ruled), CARRIED AS BEHAVIOUR: a 30-second undo window
  // forces a 30-second affordance, but not a 30-second announcement. After ~5s the toast
  // sheds its message and becomes a small tappable pill. The window itself is untouched —
  // it lives in `useToast`, which this file does not reimplement.
  const [shrunk, setShrunk] = useState(false);
  useEffect(() => {
    setShrunk(false);
    if (!toast?.action) return;
    const t = setTimeout(() => setShrunk(true), SHRINK_AFTER_MS);
    return () => clearTimeout(t);
  }, [toast?.id, toast?.action]);

  if (!toast) return null;
  const isErr = toast.kind === 'error';
  const asPill = shrunk && !!toast.action;
  return (
    <div key={toast.id} className={'wl-toast' + (isErr ? ' err' : '') + (asPill ? ' pill' : '')}
         role="status" aria-live="polite">
      <span className="wl-toastdot" aria-hidden />
      {!asPill && <span className="wl-toastmsg">{toast.message}</span>}
      {toast.action && (
        <button type="button" className="wl-toastaction" onClick={toast.action.onAction}>
          {toast.action.label}
        </button>
      )}
      <style>{TOAST_CSS}</style>
    </div>
  );
}

// F-04.75's LEGIBILITY LINE SURVIVES THE REBUILD, and it is the one thing here that is not
// a straight token read. The error variant's ground is dark red in BOTH modes, so its ink
// must NOT be `--atelier-ink`: in Chalk that resolves to #0E1112, and near-black on dark
// red measured 1.5:1 against a 4.5 floor. The error ink is pinned to Graphite's own ink
// literal, which is light in both modes by construction. Ratify-or-revert, named.
const TOAST_CSS = `
.wl-toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;
  display:flex;align-items:center;gap:8px;max-width:calc(100vw - 40px);
  padding:10px 18px;border-radius:999px;
  background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);
  box-shadow:0 8px 32px -8px var(--atelier-card-shadow);
  transition:padding 220ms cubic-bezier(0.22,1,0.36,1);
  animation:wlToastIn 220ms cubic-bezier(0.22,1,0.36,1) both}
.wl-toast.pill{padding:8px 14px}
.wl-toast.err{background:rgba(74,22,22,0.96);border-color:rgba(224,112,112,0.4)}
.wl-toastdot{width:6px;height:6px;border-radius:50%;flex-shrink:0;background:var(--role-metal)}
.wl-toast.err .wl-toastdot{background:var(--role-critical)}
.wl-toastmsg{font:var(--wl-t3);color:var(--atelier-ink);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl-toast.err .wl-toastmsg{color:#F1EFEC}
.wl-toastaction{background:transparent;border:none;cursor:pointer;padding:2px 4px;
  font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;
  color:var(--atelier-accent-text);touch-action:manipulation}
.wl-toast.err .wl-toastaction{color:#F1EFEC}
/* A2's smoke fix, carried: the animation's end-state transform used to REPLACE the
   centering translate under fill-mode both, so every toast anchored its left edge at 50%
   and clipped off narrow phones. The keyframes carry the centering transform through. */
@keyframes wlToastIn{from{opacity:0;transform:translate(-50%,-50%) translateY(-8px)}
                     to{opacity:1;transform:translate(-50%,-50%)}}
@media (prefers-reduced-motion:reduce){.wl-toast{animation:none}}
`;
