'use client';
import { FilingChip } from '@/components/vendor/FilingChip';
import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import type { ChatMessage } from '@/hooks/vendor/useChat';
import { useT } from '@/lib/vendor/ThemeContext';

const F = {
  label: 'var(--font-jost), system-ui, sans-serif',
};

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  onConfirm: (id: string) => void;
  onCancel:  (id: string) => void;
  onChipTap: (text: string, displayText?: string) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

// ── The pair at work ────────────────────────────────────────────────────────
// While the turn streams, an animated "The pair is working…" line (three dots
// fading, ported from dreamai's desk). Once it lands, the line collapses to a
// tappable "The work ›" that expands to the Victor↔Operator exchange beneath the
// reply — answer first, the working folded away until asked for.
function PairWork({ beats, streaming, T }: {
  beats?: ChatMessage['deliberation'];
  streaming?: boolean;
  T: ReturnType<typeof useT>;
}) {
  const [open, setOpen] = useState(false);
  if (!beats || beats.length === 0) return null;

  const dim    = T.isLight ? 'rgba(26,15,8,0.5)'  : 'rgba(233,228,217,0.42)';
  const spine  = T.isLight ? 'rgba(26,15,8,0.16)' : 'rgba(233,228,217,0.16)';
  const accent = T.accent;

  // Live: the pair is working — animated three-dot fade.
  if (streaming) {
    return (
      <div style={{ padding: '2px 22px 9px 38px' }}>
        <span style={{
          fontFamily: F.label, fontSize: 11, fontWeight: 300, letterSpacing: '0.04em',
          color: dim, display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ color: accent }}>▸</span>
          The pair is working
          <span className="pw-dots" style={{ display: 'inline-flex', gap: 3, marginLeft: 1 }}>
            <i /><i /><i />
          </span>
        </span>
        <style>{`
          .pw-dots i { width: 4px; height: 4px; border-radius: 50%; background: ${accent}; display: inline-block; animation: pwWk 1s infinite; }
          .pw-dots i:nth-child(2) { animation-delay: .15s; }
          .pw-dots i:nth-child(3) { animation-delay: .3s; }
          @keyframes pwWk { 0%, 80%, 100% { opacity: .25 } 40% { opacity: 1 } }
          @media (prefers-reduced-motion: reduce) { .pw-dots i { animation: none } }
        `}</style>
      </div>
    );
  }

  // Done: collapsed "The work ›" — tap to reveal the exchange.
  return (
    <div style={{ padding: '2px 22px 9px 38px' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          fontFamily: F.label, fontSize: 11, fontWeight: 300, letterSpacing: '0.04em',
          color: dim, background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
      >
        The work
        <span style={{
          display: 'inline-block', color: accent,
          transition: 'transform 180ms cubic-bezier(0.22,1,0.36,1)',
          transform: open ? 'rotate(90deg)' : 'none',
        }}>›</span>
      </button>
      {open && (
        <div style={{
          marginTop: 6, paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 3,
          borderLeft: `2px solid ${spine}`,
          animation: 'pwOpen 200ms cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <style>{`@keyframes pwOpen { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: none } }`}</style>
          {beats.map((beat, i) => {
            const line =
              beat.kind === 'handoff' ? 'Handed to the operator'
              : beat.kind === 'operator_action' || beat.kind === 'error'
                ? `Operator \u00b7 ${beat.action ?? ''}${beat.detail ? ' \u2014 ' + beat.detail : ''}`
              : `Operator reported \u00b7 ${(beat as { message?: string }).message ?? ''}`;
            return (
              <div key={i} style={{
                fontFamily: F.label, fontSize: 11, fontWeight: 300, lineHeight: 1.5,
                letterSpacing: '0.01em', color: dim,
              }}>{line}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ChatThread({ messages, loading, onChipTap, scrollRef, onRetryLast }: Props & { onRetryLast?: () => void }) {
  const T = useT();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose scroll container via scrollRef
  useEffect(() => {
    if (scrollRef && containerRef.current) {
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
    }
  }, [scrollRef]);

  // The streaming reply grows by mutating the LAST message's text (count stays
  // constant), so we also key the scroll on the tail's length. And we only follow
  // when the user is already near the bottom — if they've scrolled up to read
  // history, we leave them be rather than yanking them back down mid-stream.
  const tail = messages[messages.length - 1];
  const tailLen = tail ? tail.text.length : 0;
  // Also follow when the pair-at-work line appears (a deliberation beat with no text yet) —
  // otherwise it lands below the fold and the user has to scroll by hand.
  const tailDelib = tail?.deliberation?.length ?? 0;
  const prevCount = useRef(0);
  useEffect(() => {
    const c = containerRef.current;
    const newTurn = messages.length > prevCount.current; // you just sent / a bubble was added
    prevCount.current = messages.length;
    // A NEW turn always lands at the bottom — you just typed, you expect to see it. Only
    // mid-stream growth respects the gate, so reading history isn't yanked.
    if (c && !newTurn) {
      const nearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 160;
      if (!nearBottom) return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, tailLen, tailDelib]);


  return (
    <div
      ref={containerRef}
      className="hide-scrollbar"
      style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 8 }}
    >
      {messages.map((m, idx) => (
        <div key={m.id ?? idx}>
          <MessageBubble message={m} />

          {/* The pair at work (5-B): Myra's reply is the bubble above; her
              operator's deliberation reads quietly beneath — answer first. */}
          <PairWork beats={m.deliberation} streaming={m.streaming} T={T} />
          {(m.deliberation ?? [])
            .filter((b: any) => (b.kind === 'operator_action' || b.kind === 'error') && b.summary)
            .map((b: any, i: number) => (
              <FilingChip key={`chip-${i}`} beat={b} onRetry={onRetryLast} />
            ))}
          {/* Clarify chips — brass in dark, oxblood in light */}
          {m.clarify?.options && m.clarify.options.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 7,
              padding: '4px 22px 8px 38px',
            }}>
              {m.clarify.options.map((opt, i) => {
                const label = typeof opt === 'string' ? opt : opt.label;
                const value = typeof opt === 'string' ? opt : opt.value;
                return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChipTap(value, label)}
                  style={{
                    height: 32, paddingInline: 14,
                    background: 'var(--atelier-input-bg)',
                    border: `0.5px solid ${T.isLight ? 'rgba(122,56,40,0.40)' : 'rgba(201,168,76,0.45)'}`,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 300, fontSize: 9,
                    letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                    color: T.isLight ? T.accent : 'var(--atelier-label)',
                    whiteSpace: 'nowrap',
                  }}
                >{label}</button>
                );
              })}
            </div>
          )}

          {/* Proactive suggestions (3.0-C2) — optional next-steps under a
              completed action. Lighter/ghost styling distinguishes them from
              clarify (which is a blocking question). Includes optional intro. */}
          {m.suggestions?.suggestions && m.suggestions.suggestions.length > 0 && (
            <div style={{ padding: '2px 22px 10px 38px' }}>
              {m.suggestions.intro && (
                <div style={{
                  fontFamily: F.label, fontSize: 12, fontWeight: 300,
                  color: T.isLight ? 'rgba(26,15,8,0.62)' : 'rgba(240,230,210,0.6)',
                  margin: '2px 0 7px', lineHeight: 1.45, fontStyle: 'italic',
                }}>{m.suggestions.intro}</div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {m.suggestions.suggestions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChipTap(opt.value, opt.label)}
                    style={{
                      height: 30, paddingInline: 12,
                      background: 'transparent',
                      border: `0.5px dashed ${T.isLight ? 'rgba(122,56,40,0.35)' : 'rgba(201,168,76,0.38)'}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      fontFamily: F.label, fontWeight: 300, fontSize: 9,
                      letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                      color: T.isLight ? 'rgba(122,56,40,0.85)' : 'rgba(201,168,76,0.8)',
                      whiteSpace: 'nowrap',
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* The working blob now lives inside the streaming bubble (it shows while
          the AI message is streaming but still empty), so no separate indicator. */}

      <div ref={bottomRef} />
    </div>
  );
}
