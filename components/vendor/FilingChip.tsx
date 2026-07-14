'use client';
// FilingChip — TDW_02 P6: the verified-write chip. Renders ONLY from an
// operator_action beat, i.e. only what a door actually confirmed (F8's covenant:
// done means witnessed). House form: Cormorant italic on a hairline, quiet.
// The Undo word lives 30 seconds, client-timed — no server pending state, no
// modal, no toast. Error chips warm to terracotta and offer Retry.
import React, { useEffect, useState } from 'react';
import { undoCall, type FilingBeat } from '@/lib/vendor/api/vendor';

const INK = 'rgba(12,10,9,0.55)';
const TERRACOTTA = '#B85C38';

export function FilingChip({ beat, onRetry }: { beat: FilingBeat; onRetry?: () => void }) {
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

  const color = isError || phase === 'undo_failed' ? TERRACOTTA : INK;
  const text = isError
    ? beat.summary || "That didn't land — nothing was changed."
    : phase === 'undone' ? `${beat.summary} — undone.`
    : beat.summary || 'Filed';

  return (
    <div className="flex items-center gap-2 pl-3 py-[3px] border-l border-[#0C0A09]/15 select-none">
      <span className="font-[Cormorant] italic text-[13px] leading-tight" style={{ color }}>
        {text}
      </span>
      {isError && onRetry && (
        <button onClick={onRetry} className="font-[Cormorant] italic text-[13px] underline underline-offset-2" style={{ color: TERRACOTTA }}>
          Retry
        </button>
      )}
      {!isError && beat.undo && phase === 'live' && (
        <button onClick={doUndo} className="font-[Cormorant] italic text-[13px] underline underline-offset-2" style={{ color: INK }}>
          Undo
        </button>
      )}
      {phase === 'undoing' && <span className="font-[Cormorant] italic text-[13px]" style={{ color: INK }}>…</span>}
      {phase === 'undo_failed' && (
        <button onClick={doUndo} className="font-[Cormorant] italic text-[13px] underline underline-offset-2" style={{ color: TERRACOTTA }}>
          Retry undo
        </button>
      )}
    </div>
  );
}
