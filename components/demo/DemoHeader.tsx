'use client';
// components/demo/DemoHeader.tsx
// Sessionless header for the demo vendor experience.
// NO imports from lib/vendor/session or hooks/vendor/*.

import { useRouter } from 'next/navigation';

const T = {
  bg:     '#0C0A09',
  ink:    '#F0E6D2',
  soft:   'rgba(240,230,210,0.55)',
  gold:   '#C9A84C',
  border: 'rgba(240,230,210,0.08)',
  ff:     { label: "'Jost', sans-serif", display: "'Cormorant Garamond', serif" },
};

interface DemoHeaderProps {
  vendorName: string | null;
  handle:     string;
}

export function DemoHeader({ vendorName, handle }: DemoHeaderProps) {
  const router = useRouter();
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 56, background: T.bg, borderBottom: `0.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <button onClick={() => router.push(`/demo/vendor/${handle}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.15em', color: T.soft, textTransform: 'uppercase' }}>← Demo</span>
      </button>
      <span style={{ fontFamily: T.ff.display, fontSize: 16, fontWeight: 300, color: T.ink, letterSpacing: '0.04em' }}>
        {vendorName || 'Studio'}
      </span>
      <div style={{ background: 'rgba(201,168,76,0.12)', border: `0.5px solid ${T.gold}`, borderRadius: 20, padding: '3px 10px' }}>
        <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.2em', color: T.gold, textTransform: 'uppercase' }}>Demo</span>
      </div>
    </div>
  );
}
