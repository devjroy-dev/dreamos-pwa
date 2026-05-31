'use client';
import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingDots } from './TypingDots';
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
        </div>
      ))}

      {/* Typing indicator */}
      {loading && !messages.some(m => m.streaming) && (
        <div style={{ padding: '8px 22px 8px 38px', display: 'flex', alignItems: 'center' }}>
          <TypingDots />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
