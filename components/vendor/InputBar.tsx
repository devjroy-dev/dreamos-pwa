'use client';
import { useEffect, useRef, useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useT } from '@/lib/vendor/ThemeContext';

const LINE_HEIGHT = 20;
const MAX_ROWS = 4;

export function InputBar({ onSend, onSendNote, disabled, placeholder, initialValue, onPrimerApplied }: {
  onSend: (text: string) => void;
  onSendNote?: (text: string) => void | Promise<void>;
  disabled?: boolean; placeholder?: string;
  initialValue?: string; onPrimerApplied?: () => void;
}) {
  const T = useT();
  const [value, setValue] = useState('');
  const [noteMode, setNoteMode] = useState(false);
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

  // Note mode is only live when the parent supplies a note sink.
  const canNote = !!onSendNote;
  const inNote = canNote && noteMode;

  function send() {
    const t = value.trim();
    if (!t || disabled) return;
    if (inNote && onSendNote) { void onSendNote(t); }
    else { onSend(t); }
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  }

  const canSend = !!value.trim() && !disabled;

  // Brass accents for the toggle + note-mode tint.
  const brassGrad = 'linear-gradient(180deg, var(--atelier-accent-text) 0%, var(--atelier-accent-text) 100%)';
  const toggleOffBg = T.isLight ? 'rgba(139,75,55,0.08)' : 'rgba(201,168,76,0.10)';
  const noteBorder = inNote ? 'var(--atelier-label)' : T.inputBorder;

  return (
    <div style={{
      background: inNote
        ? (T.isLight ? 'rgba(201,168,76,0.07)' : 'rgba(201,168,76,0.06)')
        : T.headerBg,
      backdropFilter: 'blur(28px) saturate(1.6)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
      borderTop: `0.5px solid ${inNote ? 'rgba(201,168,76,0.45)' : T.brassLine}`,
      padding: '12px 16px calc(14px + env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'flex-end', gap: 10,
      transition: 'background 220ms cubic-bezier(0.22,1,0.36,1), border-color 220ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Note-mode toggle — sticky; lights up when on */}
      {canNote && (
        <button
          type="button"
          onClick={() => setNoteMode(m => !m)}
          aria-label="Note to self"
          aria-pressed={inNote}
          title={inNote ? 'Note to self — on' : 'Note to self'}
          style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            border: `0.5px solid ${inNote ? 'var(--atelier-label)' : T.inputBorder}`,
            background: inNote ? brassGrad : toggleOffBg,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: inNote ? '0 4px 14px -4px rgba(201,168,76,0.5), inset 0 1px 1px rgba(255,235,200,0.6)' : 'none',
            transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke={inNote ? (T.isLight ? '#F5F2EE' : INK_DEEP) : T.inkDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
      )}

      <textarea ref={ref} value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
        placeholder={inNote ? 'Note to self…' : (placeholder ?? 'Ask anything…')}
        rows={1}
        style={{
          flex: 1, resize: 'none',
          border: `0.5px solid ${noteBorder}`,
          borderRadius: 999,
          background: T.inputBg,
          color: T.ink,
          padding: '12px 18px',
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontStyle: value ? 'normal' : 'italic',
          fontWeight: 400, fontSize: 16,
          lineHeight: `${LINE_HEIGHT}px`,
          outline: 'none', overflowY: 'hidden',
          caretColor: T.interactive,
          letterSpacing: '0.005em',
          transition: 'border-color 220ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <button type="button" onClick={send} disabled={!canSend} aria-label={inNote ? 'Save note' : 'Send'} style={{
        width: 42, height: 42, borderRadius: '50%',
        border: '0.5px solid var(--atelier-label)',
        background: canSend
          ? brassGrad
          : T.isLight ? 'rgba(139,75,55,0.12)' : 'rgba(201,168,76,0.15)',
        cursor: canSend ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        color: canSend ? (T.isLight ? '#F5F2EE' : INK_DEEP) : T.inkDim,  // F-09.102: brassGrad ground themes
        fontFamily: 'var(--font-italiana), Georgia, serif',
        fontSize: 16, lineHeight: 1, fontWeight: 400,
        boxShadow: canSend
          ? T.isLight
            ? '0 4px 12px -4px rgba(42,26,16,0.2), inset 0 1px 1px rgba(255,235,200,0.6)'
            : '0 6px 16px -4px rgba(201,168,76,0.5), inset 0 1px 1px rgba(255,235,200,0.6)'
          : 'none',
        transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
      }}>{inNote ? '✎' : '↑'}</button>
    </div>
  );
}
