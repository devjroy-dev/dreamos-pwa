'use client';
import { useT } from '@/lib/vendor/ThemeContext';

const F = { label: 'var(--font-jost), system-ui, sans-serif' };

export function SuggestionChips({ chips, onTap, disabled }: { chips: string[]; onTap: (t: string) => void; disabled?: boolean; }) {
  const T = useT();
  if (!chips || chips.length === 0) return null;
  return (
    <div style={{
      background: T.headerBg,
      backdropFilter: 'blur(20px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
      borderTop: `0.5px solid ${T.brassLine}`,
      overflowX: 'auto', display: 'flex', gap: 8, padding: '6px 18px 10px',
      scrollbarWidth: 'none',
    }}>
      {chips.map((chip, i) => (
        <button key={i} type="button" onClick={() => !disabled && onTap(chip)} disabled={disabled} style={{
          flexShrink: 0, height: 32, paddingInline: 14,
          background: 'transparent',
          border: `0.5px solid ${T.brassSoft}`,
          borderRadius: 2,
          cursor: disabled ? 'default' : 'pointer',
          fontFamily: F.label,
          fontWeight: 300, fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase' as const,
          color: disabled ? T.inkDim : T.isLight ? T.accent : 'rgba(201,168,76,0.78)',
          whiteSpace: 'nowrap',
        }}>{chip}</button>
      ))}
    </div>
  );
}
