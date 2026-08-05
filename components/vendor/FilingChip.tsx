'use client';
// FilingChip — TDW_02 P6 (v2, founder-ruled redesign 2026-07-14): the verified-write
// chip. Renders ONLY from an operator_action beat — done means witnessed (F8's
// covenant). v2 house form: a quiet card, not marker-text — soft ink-tint surface,
// hairline frame, brass spine for confirmed writes / terracotta for errors, a ringed
// glyph, and the Undo as a real pill affordance. The 30-second undo window is made
// VISIBLE: a hairline drains along the card's foot for exactly its lifetime.
// Semantics unchanged from v1: client-timed 30s, no server pending state, no modal,
// no toast; error chips offer Retry. Theming note: ink-palette constants (chat
// surface); TDW_09's token pass owns theme variables.
import React, { useEffect, useState } from 'react';
import { undoCall, type FilingBeat } from '@/lib/vendor/api/vendor';

// v2.1 (2026-07-14): theme-aware. v2 shipped ink-on-dark — illegible on the dark
// hub (founder-reported). Palette now derives from isLight, matching PairWork's
// convention; light values = v2's originals, dark values mirror the .dd-cab family.
const PALETTE = (isLight: boolean) => ({
  INK:       isLight ? 'rgba(12,10,9,0.78)'  : 'rgba(240,230,210,0.88)',
  INK_DIM:   isLight ? 'rgba(12,10,9,0.50)'  : 'rgba(240,230,210,0.55)',
  HAIRLINE:  isLight ? 'rgba(12,10,9,0.10)'  : 'rgba(240,230,210,0.14)',
  SURFACE:   isLight ? 'rgba(12,10,9,0.030)' : 'rgba(245,235,212,0.055)',
  PILL_EDGE: isLight ? 'rgba(12,10,9,0.25)'  : 'rgba(240,230,210,0.30)',
  PILL_INK:  isLight ? 'rgba(12,10,9,0.70)'  : 'rgba(240,230,210,0.75)',
  TERRACOTTA:isLight ? '#B85C38' : 'var(--role-critical)',
});
const BRASS = 'var(--role-metal)';

export function FilingChip({ beat, onRetry, isLight = true }: { beat: FilingBeat; onRetry?: () => void; isLight?: boolean }) {
  const { INK, INK_DIM, HAIRLINE, SURFACE, PILL_EDGE, PILL_INK, TERRACOTTA } = PALETTE(isLight);
  const [phase, setPhase] = useState<'live' | 'expired' | 'undoing' | 'undone' | 'undo_failed'>('live');
  const isError = beat.kind === 'error';

  useEffect(() => {
    if (isError || !beat.undo) return;
    const t = setTimeout(() => setPhase((p) => (p === 'live' ? 'expired' : p)), 30_000);
    return () => clearTimeout(t);
  }, [isError, beat.undo]);

  const doUndo = async () => {
    if (!beat.undo || phase !== 'live') return;
    setPhase('undoing');
    const ok = await undoCall(beat.undo);
    setPhase(ok ? 'undone' : 'undo_failed');
  };

  const failed = isError || phase === 'undo_failed';
  const spine = failed ? TERRACOTTA : BRASS;
  const glyph = failed ? '!' : phase === 'undone' ? '\u21BA' : '\u2713';
  const glyphColor = failed ? TERRACOTTA : phase === 'undone' ? INK_DIM : BRASS;
  const text = isError
    ? beat.summary || "That didn't land — nothing was changed."
    : phase === 'undone' ? `${beat.summary} — undone.`
    : beat.summary || 'Filed';

  const pill: React.CSSProperties = {
    fontFamily: 'Jost, system-ui, sans-serif', fontSize: 10, fontWeight: 500,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '3px 11px 2px', borderRadius: 999, cursor: 'pointer',
    background: 'transparent', lineHeight: '14px', whiteSpace: 'nowrap',
  };

  return (
    <div className="fchip-wrap" style={{ padding: '2px 22px 4px 38px' }}>
      <div
        className="fchip"
        style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 9,
          maxWidth: '100%', padding: '7px 12px 8px 10px', borderRadius: 10,
          background: SURFACE, border: `1px solid ${HAIRLINE}`,
          borderLeft: `2px solid ${spine}`,
          opacity: phase === 'undone' || phase === 'expired' ? 0.72 : 1,
          transition: 'opacity 300ms ease',
        }}
      >
        <span aria-hidden style={{
          width: 16, height: 16, borderRadius: '50%', flex: 'none',
          border: `1px solid ${glyphColor}`, color: glyphColor,
          fontSize: 10, lineHeight: '14px', textAlign: 'center', fontWeight: 600,
        }}>{glyph}</span>
        <span style={{ fontFamily: 'Cormorant, serif', fontStyle: 'italic', fontSize: 13.5, lineHeight: 1.35, color: failed ? TERRACOTTA : INK }}>
          {text}
        </span>
        {isError && onRetry && (
          <button onClick={onRetry} style={{ ...pill, border: `1px solid ${TERRACOTTA}55`, color: TERRACOTTA }}>Retry</button>
        )}
        {!isError && beat.undo && phase === 'live' && (
          <button onClick={doUndo} style={{ ...pill, border: `1px solid ${PILL_EDGE}`, color: PILL_INK }}>Undo</button>
        )}
        {phase === 'undoing' && (
          <span style={{ fontFamily: 'Cormorant, serif', fontStyle: 'italic', fontSize: 13, color: INK_DIM }}>…</span>
        )}
        {phase === 'undo_failed' && (
          <button onClick={doUndo} style={{ ...pill, border: `1px solid ${TERRACOTTA}55`, color: TERRACOTTA }}>Retry undo</button>
        )}
        {!isError && beat.undo && phase === 'live' && (
          <span aria-hidden className="fchip-drain" style={{
            position: 'absolute', left: 8, right: 8, bottom: 0, height: 2,
            borderRadius: 2, background: `${BRASS}59`, transformOrigin: 'left',
          }} />
        )}
      </div>
      <style>{`
        .fchip { animation: fchipIn 240ms cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes fchipIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .fchip-drain { animation: fchipDrain 30s linear forwards; }
        @keyframes fchipDrain { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .fchip { animation: none; }
          .fchip-drain { animation: none; display: none; }
        }
      `}</style>
    </div>
  );
}
