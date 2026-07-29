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
  // TDW_06 M-3 — THE REPORT CHIP'S OWN WIRE. Deliberately NOT onChipTap: that prop is wired
  // to `send` at app/vendor/page.tsx, so routing the chip through it would post the label
  // into the thread as a vendor message. The chip calls the glitch-report route instead.
  onReportGlitch?: () => Promise<void> | void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}


export function ChatThread({ messages, loading, onChipTap, onReportGlitch, scrollRef, onRetryLast }: Props & { onRetryLast?: () => void }) {
  const T = useT();
  // SLOT FIVE, founder-vetoed: after one tap the chip DIMS AND DISABLES. No new words — the
  // InputBar's own disabled pattern. A second tap would file a second finding against the
  // same turn and inflate the very measurement this week exists to take.
  const [reported, setReported] = useState<Record<string, boolean>>({});
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
  // Also follow when a deliberation beat lands with no text yet — otherwise the turn's
  // first visible motion sits below the fold and the user has to scroll by hand.
  // TDW_06 F-06.133: this line's ORIGINAL subject (the pair-at-work line) is deleted with
  // `PairWork`; the EXPRESSION is byte-unmoved because its behaviour is still correct — a
  // FilingChip can land beat-first, and the scroll must follow it. Comment corrected rather
  // than left lying (the F-06.85 class); zero behavioural bytes moved.
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
      style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 64 /* TDW UI fix 2026-07-14: clear the fixed 'Your books' handle (bottom:76, h:40) so the FilingChips never sit under it (TDW_06 F-06.133: PairWork removed; comment corrected, padding byte-unmoved) */ }}
    >
      {messages.map((m, idx) => (
        <div key={m.id ?? idx}>
          {/* TDW_06 D-7 — the fresh-thread seam. A rule line, never a bubble:
              the scrollback above it stays exactly where it was (the visible
              truth D-7 requires), and the new thread continues beneath. Copy
              ("Fresh thread") is on the veto-on-sight list; persona-free per
              the A4 copy law. */}
          {m.divider ? (
            <div aria-label="Fresh thread starts here" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 22px 10px',
            }}>
              <span style={{ flex: 1, height: '0.5px', background: T.isLight ? 'rgba(26,15,8,0.16)' : 'rgba(201,168,76,0.22)' }} />
              <span style={{
                fontFamily: F.label, fontWeight: 300, fontSize: 8,
                letterSpacing: '0.34em', textTransform: 'uppercase' as const,
                color: T.isLight ? 'rgba(26,15,8,0.45)' : 'rgba(201,168,76,0.6)',
                whiteSpace: 'nowrap',
              }}>Fresh thread</span>
              <span style={{ flex: 1, height: '0.5px', background: T.isLight ? 'rgba(26,15,8,0.16)' : 'rgba(201,168,76,0.22)' }} />
            </div>
          ) : (
          <>
          <MessageBubble message={m} />

          {/* TDW_06 F-06.133 (founder-ruled twice; CE closing arc, fork C-1(b)) — THE WORK
              DRAWER IS REMOVED OUTRIGHT. `PairWork` is DELETED WHOLE, both branches: the
              collapsed expansion drawer AND its own three-dot streaming line. The
              working state is `TypingDots` alone (MessageBubble.tsx:149, `streaming && !text`)
              — ONE animation, ONE home, no caption, zero new bytes. THREE vendor-facing strings
              died with it — the drawer label + chevron, the streaming caption, and the beat
              renderer's prose — all three vetoed for deletion verbatim 「 approve all 」.
              THE BYTES THEMSELVES ARE DELIBERATELY NOT QUOTED HERE: the removal proof asserts
              their absence from this file COMMENTS INCLUDED (M-2c §5.9's precedent, which is
              the stricter arm), and this comment's first draft reproduced two of them and was
              convicted by that cell. Naming a deleted string is not the same act as keeping it.
              WHAT SURVIVES, and it is a DIFFERENT SURFACE: the FilingChip map below. It reads
              the same `deliberation` array but only `operator_action`/`error` beats CARRYING
              `summary` — F-04.41's verified-write chip, untouched by this movement.
              THE ORPHANED BEATS STAY ON THE WIRE BY RULING: `handoff`, `operator_report`, and
              summary-less `operator_action` (chat.js translateBeat :263/:278/:291) now have no
              renderer. DISPLAY DIES, DATA LIVES — the engine is 0-line and `useChat` still
              collects every beat, so the trace lives on in engine.messages.tool_calls and the
              guard log exactly as the ruling requires. */}
          {(m.deliberation ?? [])
            .filter((b: any) => (b.kind === 'operator_action' || b.kind === 'error') && b.summary)
            .map((b: any, i: number) => (
              <FilingChip key={`chip-${i}`} beat={b} onRetry={onRetryLast} isLight={T.isLight} />
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

          {/* TDW_06 M-3 — THE REPORT CHIP. Mirrors the suggestions block's position and
              register; renders ONLY on a reply the wire guard actually replaced. On the demo
              surface (app/demo/vendor/[handle]/studio/page.tsx renders this same component
              through useDemoChat) `intercepted` is never set, so the chip is dormant there BY
              CONSTRUCTION — asserted as a negative cell, never assumed. */}
          {m.intercepted && (
            <div style={{ padding: '2px 22px 10px 38px' }}>
              <button
                type="button"
                disabled={!!reported[m.id]}
                onClick={async () => {
                  if (reported[m.id]) return;
                  setReported((prev) => ({ ...prev, [m.id]: true }));
                  try { await onReportGlitch?.(); } catch { /* the chip never throws at the vendor */ }
                }}
                style={{
                  height: 30, paddingInline: 12,
                  background: 'transparent',
                  border: `0.5px dashed ${T.isLight ? 'rgba(122,56,40,0.35)' : 'rgba(201,168,76,0.38)'}`,
                  borderRadius: 2,
                  cursor: reported[m.id] ? 'default' : 'pointer',
                  opacity: reported[m.id] ? 0.4 : 1,
                  fontFamily: F.label, fontWeight: 300, fontSize: 9,
                  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  color: T.isLight ? 'rgba(122,56,40,0.85)' : 'rgba(201,168,76,0.8)',
                  whiteSpace: 'nowrap',
                }}
              >REPORT THIS GLITCH</button>
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
          </>
          )}
        </div>
      ))}

      {/* The working blob now lives inside the streaming bubble (it shows while
          the AI message is streaming but still empty), so no separate indicator. */}

      <div ref={bottomRef} />
    </div>
  );
}
