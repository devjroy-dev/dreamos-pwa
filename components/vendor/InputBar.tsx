'use client';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/vendor/ThemeContext';

const LINE_HEIGHT = 20;
const MAX_ROWS = 4;

export function InputBar({ onSend, disabled, placeholder, initialValue, onPrimerApplied }: {
  onSend: (text: string) => void; disabled?: boolean; placeholder?: string;
  initialValue?: string; onPrimerApplied?: () => void;
}) {
  const T = useT();
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const applied = useRef(false);

  useEffect(() => {
    const ta = ref.current; if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, MAX_ROWS * LINE_HEIGHT + 16) + 'px';
  }, [value]);

  useEffect(() => {
    if (!initialValue || applied.current) return;
    applied.current = true;
    setValue(initialValue);
    ref.current?.focus();
    onPrimerApplied?.();
  }, [initialValue, onPrimerApplied]);

  useEffect(() => { if (!initialValue) applied.current = false; }, [initialValue]);

  function send() {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t); setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  }

  const canSend = !!value.trim() && !disabled;

  return (
    <div style={{
      background: T.headerBg,
      backdropFilter: 'blur(28px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
      borderTop: `0.5px solid ${T.brassLine}`,
      padding: '12px 16px calc(14px + env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'flex-end', gap: 10,
    }}>
      <textarea ref={ref} value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        placeholder={placeholder ?? 'Ask DreamAi…'}
        rows={1}
        style={{
          flex: 1, resize: 'none',
          border: `0.5px solid ${T.inputBorder}`,
          borderRadius: 999,
          background: T.inputBg,
          color: T.ink,
          padding: '12px 18px',
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontStyle: value ? 'normal' : 'italic',
          fontWeight: 400, fontSize: 15,
          lineHeight: `${LINE_HEIGHT}px`,
          outline: 'none', overflowY: 'hidden',
          caretColor: T.brass,
          letterSpacing: '0.005em',
        }}
      />
      <button type="button" onClick={send} disabled={!canSend} aria-label="Send" style={{
        width: 42, height: 42, borderRadius: '50%',
        border: '0.5px solid #E0BC6E',
        background: canSend
          ? 'linear-gradient(180deg, #D4B86A 0%, #B59548 100%)'
          : T.isLight ? 'rgba(139,75,55,0.12)' : 'rgba(201,168,76,0.15)',
        cursor: canSend ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color: canSend ? '#1A120E' : T.inkDim,
        fontFamily: 'var(--font-italiana), Georgia, serif',
        fontSize: 18, lineHeight: 1, fontWeight: 400,
        boxShadow: canSend
          ? T.isLight
            ? '0 4px 12px -4px rgba(42,26,16,0.2), inset 0 1px 1px rgba(255,235,200,0.6)'
            : '0 6px 16px -4px rgba(201,168,76,0.5), inset 0 1px 1px rgba(255,235,200,0.6)'
          : 'none',
        transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
      }}>↑</button>
    </div>
  );
}
