'use client';
// TypingDots — Myra's "thinking" mark while she streams.
// Ported from dreamai's door: a single breathing ember dot with a thin, tilted
// Saturn ring. Colour follows the active theme (ember in Flair, oxblood in light,
// brass in dark), so the living mark sits right in every room.
import { useT } from '@/lib/vendor/ThemeContext';

export function TypingDots() {
  const T = useT();
  const ember = T.accent;
  const emberSoft = T.brassSoft;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '6px 2px 6px 4px' }}>
      <span
        style={{
          position: 'relative', display: 'inline-block',
          width: 11, height: 11, borderRadius: '50%',
          background: ember,
          boxShadow: `0 0 12px 3px ${emberSoft}`,
          animation: 'tdwBlob 2.4s ease-in-out infinite',
        }}
      >
        <span
          style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 24, height: 9,
            transform: 'translate(-50%,-50%) rotate(-18deg)',
            border: `1px solid ${emberSoft}`, borderRadius: '50%',
            opacity: 0.7,
            animation: 'tdwRing 2.4s ease-in-out infinite',
          }}
        />
      </span>
      <style>{`
        @keyframes tdwBlob {
          0%, 100% { opacity: .6; box-shadow: 0 0 9px 2px ${emberSoft}; transform: scale(.92); }
          50%      { opacity: 1;  box-shadow: 0 0 18px 5px ${emberSoft}; transform: scale(1.08); }
        }
        @keyframes tdwRing {
          0%, 100% { opacity: .45; transform: translate(-50%,-50%) rotate(-18deg) scale(.96); }
          50%      { opacity: .85; transform: translate(-50%,-50%) rotate(-18deg) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
