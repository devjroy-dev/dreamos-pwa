'use client';
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

export function ChatThread({ messages, loading, onChipTap, scrollRef }: Props) {
  const T = useT();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose scroll container via scrollRef
  useEffect(() => {
    if (scrollRef && containerRef.current) {
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
    }
  }, [scrollRef]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

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
          {m.deliberation && m.deliberation.length > 0 && (
            <div style={{ padding: '0 22px 9px 38px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {m.deliberation.map((beat, i) => {
                const line =
                  beat.kind === 'handoff' ? 'Handed to the operator'
                  : beat.kind === 'operator_action' ? `Operator \u00b7 ${beat.action}${beat.detail ? ' \u2014 ' + beat.detail : ''}`
                  : `Operator reported \u00b7 ${beat.message}`;
                return (
                  <div key={i} style={{
                    fontFamily: F.label, fontSize: 11, fontWeight: 300, lineHeight: 1.5,
                    letterSpacing: '0.01em',
                    color: T.isLight ? 'rgba(26,15,8,0.5)' : 'rgba(233,228,217,0.42)',
                  }}>{line}</div>
                );
              })}
            </div>
          )}
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
