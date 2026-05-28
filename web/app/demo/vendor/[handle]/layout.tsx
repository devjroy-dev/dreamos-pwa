'use client';
// app/demo/vendor/[handle]/layout.tsx
// Demo vendor shell. ThemeProvider + demo-aware BottomNav with correct routes.

import { useParams, usePathname, useRouter } from 'next/navigation';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';
import { useT } from '@/lib/vendor/ThemeContext';

const F = { display:'var(--font-italiana), "GFS Didot", Georgia, serif', label:'var(--font-jost), system-ui, sans-serif' };
const A = { brassWarm:'var(--atelier-label)', inkMute:'var(--atelier-ink-mute)' };
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

type DemoMode = 'ai' | 'studio' | 'discover';

function modeFromPath(path: string, base: string): DemoMode {
  if (path === `${base}/studio` || path === base) return 'ai';
  if (path.startsWith(`${base}/discover`) || path.startsWith(`${base}/portfolio`) || path.startsWith(`${base}/collab`) || path.startsWith(`${base}/featured`) || path.startsWith(`${base}/couture`)) return 'discover';
  return 'studio';
}

interface SubItem { href: string; label: string; glyph: string; }

function DemoBottomNav({ handle }: { handle: string }) {
  const pathname = usePathname() ?? '';
  const router   = useRouter();
  const T        = useT();
  const base     = `/demo/vendor/${handle}`;
  const mode     = modeFromPath(pathname, base);

  // No bottom nav on the AI/studio page — PeekNav handles it
  if (mode === 'ai') return null;

  const STUDIO_ITEMS: SubItem[] = [
    { href: `${base}/calendar`,  label: 'Calendar',  glyph: '◐' },
    { href: `${base}/business`,  label: 'Business',  glyph: '≡' },
    { href: `${base}/more`,      label: 'More',      glyph: '⋯' },
  ];

  const DISCOVER_ITEMS: SubItem[] = [
    { href: `${base}/portfolio`,       label: 'Portfolio', glyph: '▣' },
    { href: `${base}/discover/leads`,  label: 'Leads',     glyph: '✉' },
    { href: `${base}/collab`,          label: 'Collab',    glyph: '◇' },
  ];

  const items = mode === 'studio' ? STUDIO_ITEMS : DISCOVER_ITEMS;

  return (
    <nav style={{ position:'sticky', bottom:0, zIndex:9, background:T.headerBg, backdropFilter:'blur(28px) saturate(1.6)', WebkitBackdropFilter:'blur(28px) saturate(1.6)', borderTop:`0.5px solid rgba(201,168,76,0.18)`, boxShadow:'0 -1px 0 rgba(255,235,200,0.04)', padding:'10px 8px calc(12px + env(safe-area-inset-bottom))', display:'flex', justifyContent:'space-around', alignItems:'flex-end' }}>
      {items.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        const color = active ? A.brassWarm : A.inkMute;
        return (
          <button key={item.label} type="button" onClick={() => router.push(item.href)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', padding:'4px 8px', minWidth:56 }}>
            <span style={{ fontFamily:F.display, fontSize:22, lineHeight:1, color, transition:`color 200ms ${EASE}`, textShadow:active?'0 0 12px rgba(224,188,110,0.4)':'none' }}>{item.glyph}</span>
            <span style={{ fontFamily:F.label, fontWeight:300, fontSize:8, letterSpacing:'0.28em', textTransform:'uppercase', color, transition:`color 200ms ${EASE}` }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function DemoShell({ children }: { children: React.ReactNode }) {
  const params   = useParams();
  const handle   = typeof params.handle === 'string' ? params.handle : '';
  const pathname = usePathname() ?? '';
  const base     = `/demo/vendor/${handle}`;
  const isLanding = pathname === base;

  // Landing page uses position:fixed — must NOT be inside an overflow:auto container
  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', overflow:'hidden' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, overflowY:'auto', overflowX:'hidden' }}>
        {children}
      </div>
      <DemoBottomNav handle={handle} />
    </div>
  );
}

export default function DemoVendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DemoShell>{children}</DemoShell>
    </ThemeProvider>
  );
}
