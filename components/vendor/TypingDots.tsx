'use client';
// TypingDots — Atelier rebuild
// Three brass dots that pulse gently — like a fountain pen tap-tap-tapping
// on a sheet of paper before the next sentence.

export function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 5, height: 5, borderRadius: '50%',
            backgroundColor: '#C9A84C',
            display: 'inline-block',
            animation: `atelierTyping 1.4s ease-in-out ${i * 0.18}s infinite`,
            opacity: 0.35,
          }}
        />
      ))}
      <style>{`
        @keyframes atelierTyping {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 0.95; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
