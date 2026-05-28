'use client';
// components/demo/DemoNav.tsx
// Bottom nav for demo vendor studio. NO session. Handle-based routing only.

import { usePathname, useRouter } from 'next/navigation';

const T = {
  bg:     '#0C0A09',
  soft:   'rgba(240,230,210,0.40)',
  gold:   '#C9A84C',
  border: 'rgba(240,230,210,0.08)',
  ff:     { label: "'Jost', sans-serif" },
};

export function DemoNav({ handle }: { handle: string }) {
  const router   = useRouter();
  const pathname = usePathname();
  const base     = `/demo/vendor/${handle}`;

  const tabs = [
    { label: 'DreamAi',  path: `${base}/studio`,   glyph: '◈' },
    { label: 'Leads',    path: `${base}/list`,      glyph: 'L' },
    { label: 'Calendar', path: `${base}/calendar`,  glyph: '○' },
    { label: 'Discover', path: `${base}/discover`,  glyph: '✦' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, height: 64, background: T.bg, borderTop: `0.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px' }}>
      {tabs.map(tab => {
        const active = pathname === tab.path || pathname.startsWith(tab.path + '/');
        return (
          <button key={tab.path} onClick={() => router.push(tab.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
            <span style={{ fontSize: 14, color: active ? T.gold : T.soft }}>{tab.glyph}</span>
            <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: active ? T.gold : T.soft }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
