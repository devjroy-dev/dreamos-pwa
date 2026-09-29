'use client';
import { RUNG_FONT as RUNG } from '@/lib/worklist/theme'; // CE-45 FE-2 TYPE_2: the app's own type, holding outside the shell (F7)
import { useEffect, useState } from 'react';
import type { ToastState } from '@/hooks/vendor/useToast';


const SHRINK_AFTER_MS = 5000;

// ── F-40.263 · THE REFUSAL SENTENCE WAS UNREADABLE, AND THE COMMENT SAID WHY ──
//
// F-04.75's cure (the paragraph at the message span, kept verbatim below) named the
// mechanism it stood on: `var(--atelier-ink)` being #F0E6D2 in the dark theme. The
// Graphite override layer moved that variable — app/globals.css:1347 forces
// `--atelier-ink: #0E1112 !important` under html.theme-light. So the error variant painted
// near-black ink on its own dark-red ground and measured **1.53:1** against a 4.5 floor, in
// five shell rooms (portfolio, couture, contracts, tds, calendar) plus NotesBody and
// SettingsScreen. F-06.85's mechanism-comment law worked exactly as designed: the comment
// named its donor, the donor moved, and the comment became the evidence of the regression.
//
// R-40.129 ② IS THE CURE, NOT A REPAINT. The toast reads THE SURFACE for both ink and
// ground, in every kind and both modes. A ground that is always the sheet and an ink that is
// always the sheet's ink cannot drift apart, because they are two reads of one decision.
// There is no longer any pinned literal for a later token move to invalidate — which is the
// class of defect this file has now shipped twice.
//
// MEASURED AT THIS SEAT, composited over the ground each value actually sits on:
//   message  var(--atelier-ink)          14.36:1 Graphite · 18.96:1 Chalk   (bar 4.5)
//   action   var(--atelier-accent-text)   8.42:1 Graphite ·  6.51:1 Chalk   (bar 4.5)
//   dot err  var(--role-critical)         6.27:1 Graphite ·  6.13:1 Chalk   (bar 3.0)
//   dot ok   var(--role-metal)            7.30:1 Graphite ·  4.79:1 Chalk   (bar 3.0)
//   edge err var(--role-critical)         6.27:1 Graphite ·  6.13:1 Chalk   (bar 3.0)
// The edge is the role token AT FULL WEIGHT and not a tint of it: every alpha below 0.7
// fails the 3:1 UI bar on Chalk (0.6 measures 2.81:1), and an alpha is one more constant
// that owes a number to another constant. Full weight owes nothing.
//
// THE JS THEME READ IS GONE (R-40.129 ⑥). This file read five values off `useT()` as
// JAVASCRIPT — `T.isLight`, `T.sheetTop`, `T.sheetBorder`, `T.accent`, `T.ink` — while its
// colours resolved from CSS variables. F-40.262 is that split: `html.theme-light`
// (ThemeContext.tsx:194) and `.wl[data-wl-mode]` (WorklistShell.tsx:126) are written
// independently and can disagree on one screen. Reading ONE system removes this file from
// that fault entirely. Unification of the two remains Block 09's shell pass; nothing here
// anticipates it.
//
// NOT IN SCOPE, NAMED SO THE NEXT SEAT DOES NOT THINK THEY WERE MISSED: `F.label` is Jost,
// retired from the shell at R-38.4 (lib/worklist/theme.ts:53), and the 16px/10px sizes are
// not rungs of the six-tuple scale. Both are typography under a colour ruling; neither is
// touched here.
//
// THE READING TAKEN on R-40.129 ②'s 「the dot, the edge and one line in the state role」:
// `roleInk` below IS the one line. The dot and the edge are its only two readers, so the
// kind→role mapping has exactly one home and a third reader cannot be added by accident.

export function Toast({ toast }: { toast: ToastState | null }) {
  // TDW_04 A3.3 (F-04.16(a), CE-ruled): a 30-second undo window forces a
  // 30-second affordance — but not a 30-second announcement. After ~5s the
  // toast sheds its message and becomes a small tappable pill: the undo stays
  // reachable for its whole ruled life, the vendor's screen gets it back.
  // Zero mechanism change — the window is untouched.
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
  // THE ONE LINE THE KIND MOVES. Its only readers are the dot and the edge, below.
  const roleInk = isErr ? 'var(--role-critical)' : 'var(--role-metal)';
  return (
    <div key={toast.id} style={{
      position: 'fixed', top: '50%',
      left: '50%', transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      backgroundColor: 'var(--atelier-sheet-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `0.5px solid ${isErr ? roleInk : 'var(--atelier-sheet-border)'}`,
      borderRadius: 999,
      padding: asPill ? '8px 14px' : '10px 18px',
      transition: 'padding 220ms cubic-bezier(0.22,1,0.36,1)',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 8px 32px -8px var(--atelier-card-shadow)',
      maxWidth: 'calc(100vw - 40px)',
      animation: 'toastIn 220ms cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        backgroundColor: roleInk,
      }} />
      {!asPill && (
        <span style={{
          font: RUNG.t3,
          // F-04.75 (B6-S2, the CE's legibility line — found by contrast
          // arithmetic, not by eye): the error variant's background is DARK RED
          // in BOTH themes, but this color fell through to var(--atelier-ink),
          // which is THEME-DEPENDENT — #1A0F08 (near-black) in porcelain.
          // Near-black on dark red measured 1.5:1 (WCAG floor is 4.5:1): the
          // refusal sentence was unreadable in the light theme.
          //
          // F-40.263 SUPERSEDES THAT CURE AND KEEPS ITS FINDING. The cure was a
          // cream LITERAL pinned against a token whose value it did not own; when
          // the Graphite layer moved --atelier-ink the pin held and the GROUND
          // was what had to change. It never did, so the defect returned at
          // 1.53:1. The dark red ground is gone (R-40.129 ②) and this line reads
          // the surface's own ink in every kind — 14.36:1 Graphite, 18.96:1
          // Chalk, measured. There is nothing left here to pin.
          color: 'var(--atelier-ink)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {toast.message}
        </span>
      )}
      {toast.action && (
        <button type="button" onClick={toast.action.onAction} style={{
          font: RUNG.t4,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          // One accent, both kinds, both modes (8.42:1 Graphite, 6.51:1 Chalk).
          // WlToast.tsx:102 already draws its action this way; the two toasts now
          // agree on the affordance, which is what R-40.129 ② asks of the kind.
          color: 'var(--atelier-accent-text)',
        }}>{toast.action.label}</button>
      )}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translate(-50%,-50%) translateY(-8px)}to{opacity:1;transform:translate(-50%,-50%)}}`}</style>
      {/* A2 smoke fix: the animation's end-state transform was REPLACING the
          centering translate(-50%,-50%) (fill-mode both) — every toast anchored
          its left edge at 50% and clipped off narrow phones. The keyframes now
          carry the centering transform through. */}
    </div>
  );
}
