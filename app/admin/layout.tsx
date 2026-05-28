'use client';
// app/admin/layout.tsx — TDW Control Room shell
// Editorial sidebar · PWA-optimised · Dark espresso · Gold accents

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const G    = '#C9A84C';
const BG   = '#0A0908';
const SURF = '#0D0B09';
const INK  = '#F0EAE0';
const SOFT = 'rgba(240,234,224,0.48)';
const DIM  = 'rgba(240,234,224,0.22)';
const BORDER = 'rgba(201,168,76,0.14)';
const BORDER_STRONG = 'rgba(201,168,76,0.28)';
const SIDEBAR_W = 228;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: #0A0908;
    color: #F0EAE0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;
  }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
  scrollbar-width: thin;
  scrollbar-color: rgba(201,168,76,0.2) transparent;

  input, select, textarea {
    font-family: "DM Sans", sans-serif;
    color: #F0EAE0 !important;
    -webkit-appearance: none;
  }
  input::placeholder, textarea::placeholder { color: rgba(240,234,224,0.22) !important; }
  button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
  option { background: #130F0C; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { opacity: 0.35; }
    50%  { opacity: 0.6; }
    100% { opacity: 0.35; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .fade-up   { animation: fadeUp 300ms ${EASE} both; }
  .shimmer   { animation: shimmer 1.6s ease-in-out infinite; }
  .slide-in  { animation: slideIn 240ms ${EASE} both; }
`;

const NAV = [
  { group: 'Overview', items: [
    { label:'Dashboard',     path:'/admin',                          glyph:'◈' },
  ]},
  { group: 'People', items: [
    { label:'Makers',        path:'/admin/makers',                   glyph:'✦' },
    { label:'Portfolios',    path:'/admin/vendors/portfolio',        glyph:'⬡' },
    { label:'Dreamers',      path:'/admin/dreamers',                 glyph:'♡' },
    { label:'Invites',       path:'/admin/invites',                  glyph:'⌘' },
  ]},
  { group: 'Content', items: [
    { label:'Landing',       path:'/admin/content/landing',         glyph:'⬡' },
    { label:'Exploring',     path:'/admin/content/exploring',       glyph:'◎' },
    { label:'Heroes',        path:'/admin/content/heroes',          glyph:'★' },
    { label:'Spotlight',     path:'/admin/content/spotlight',       glyph:'◐' },
    { label:'Muse Pool',     path:'/admin/content/muse-pool',       glyph:'♡' },
    { label:'Surprise Me',   path:'/admin/content/surprise-me',     glyph:'✦' },
  ]},
  { group: 'Approvals', items: [
    { label:'Photos',        path:'/admin/approvals/photos',        glyph:'⬡' },
    { label:'Discover',      path:'/admin/approvals/discover',      glyph:'◈' },
  ]},
  { group: 'Conversations', items: [
    { label:'Vendors',       path:'/admin/conversations/vendors',   glyph:'◎' },
    { label:'Brides',        path:'/admin/conversations/brides',    glyph:'◎' },
  ]},
  { group: 'Commerce', items: [
    { label:'Couture',       path:'/admin/couture',                 glyph:'✦' },
    { label:'Hot Dates',     path:'/admin/hot-dates',               glyph:'◈' },
  ]},
  { group: 'Invite Requests', items: [
    { label:'Dreamers',      path:'/admin/invite-requests/dreamers', glyph:'♡' },
    { label:'Makers',        path:'/admin/invite-requests/makers',   glyph:'✦' },
  ]},
  { group: 'Outreach', items: [
    { label:'Demo Profiles', path:'/admin/demo',                    glyph:'◈' },
  ]},
  { group: 'Config', items: [
    { label:'AI Caps',       path:'/admin/config',                  glyph:'⚙' },
  ]},
];

function NavItem({ label, path, glyph, active, onClick }: {
  label: string; path: string; glyph: string; active: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:'flex', alignItems:'center', gap:11,
        width:'100%', textAlign:'left',
        padding:'9px 18px 9px 14px',
        border:'none', outline:'none',
        background: active ? 'rgba(201,168,76,0.09)' : hov ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderLeft:`2px solid ${active ? G : 'transparent'}`,
        color: active ? G : hov ? INK : SOFT,
        fontFamily:'"DM Sans", sans-serif',
        fontWeight: active ? 400 : 300,
        fontSize:13, letterSpacing:'0.01em',
        transition:`all 140ms ${EASE}`,
        minHeight:40,
        cursor:'pointer',
      }}
    >
      <span style={{ fontSize:10, width:14, flexShrink:0, opacity: active ? 1 : 0.55, fontFamily:'"Jost",sans-serif' }}>{glyph}</span>
      {label}
    </button>
  );
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const router   = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background: SURF, borderRight:`0.5px solid ${BORDER}` }}>
      {/* Wordmark */}
      <div style={{ padding:'26px 20px 18px', flexShrink:0 }}>
        <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontWeight:300, fontSize:19, color:INK, letterSpacing:'-0.01em', lineHeight:1 }}>
          The Dream Wedding
        </div>
        <div style={{ fontFamily:'"Jost",sans-serif', fontWeight:200, fontSize:7, color:G, letterSpacing:'0.42em', textTransform:'uppercase', marginTop:5 }}>
          Control Room
        </div>
        <div style={{ height:'0.5px', background:`linear-gradient(to right, ${G}55, transparent)`, marginTop:14 }} />
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', paddingBottom:28, scrollbarWidth:'none' }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom:4 }}>
            <div style={{ fontFamily:'"Jost",sans-serif', fontWeight:200, fontSize:7, color:'rgba(201,168,76,0.35)', letterSpacing:'0.4em', textTransform:'uppercase', padding:'16px 18px 5px' }}>
              {group}
            </div>
            {items.map(({ label, path, glyph }) => (
              <div key={path}>
                <NavItem
                  label={label} path={path} glyph={glyph}
                  active={!!isActive(path)}
                  onClick={() => { router.push(path); onNavigate(); }}
                />
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding:'14px 18px', borderTop:`0.5px solid ${BORDER}`, flexShrink:0 }}>
        <button
          onClick={() => { localStorage.removeItem('admin_session'); router.replace('/admin/login'); }}
          style={{ background:'none', border:'none', fontFamily:'"Jost",sans-serif', fontWeight:200, fontSize:8, letterSpacing:'0.24em', textTransform:'uppercase', color:DIM, padding:0, minHeight:36, cursor:'pointer', transition:`color 150ms ${EASE}` }}
          onMouseEnter={e => (e.currentTarget.style.color = SOFT)}
          onMouseLeave={e => (e.currentTarget.style.color = DIM)}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [authed,  setAuthed]  = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const s = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null;
    if (!s && pathname !== '/admin/login') router.replace('/admin/login');
    else setAuthed(true);
  }, [pathname, router]);

  if (!authed && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <><style>{FONTS}</style>{children}</>;

  return (
    <>
      <style>{FONTS}</style>

      {/* PWA meta — admin scope installs as separate app on Android */}
      <head>
        <link rel="manifest" href="/admin-manifest.json" />
        <meta name="theme-color" content="#0D0B09" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TDW Control Room" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>

      {/* Mobile nav scrim */}
      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:199, backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}
        />
      )}

      {/* Mobile sidebar — slides in from left */}
      <div style={{ position:'fixed', top:0, left: navOpen ? 0 : -(SIDEBAR_W + 10), bottom:0, width:SIDEBAR_W, zIndex:200, transition:`left 320ms ${EASE}`, display:'block' }} id="m-nav">
        <Sidebar onNavigate={() => setNavOpen(false)} />
      </div>

      {/* Desktop sidebar — always visible */}
      <div style={{ position:'fixed', top:0, left:0, bottom:0, width:SIDEBAR_W, zIndex:10, display:'none', flexDirection:'column' }} id="d-nav">
        <Sidebar onNavigate={() => {}} />
      </div>

      {/* Main */}
      <div id="admin-main" style={{ background:BG, minHeight:'100dvh' }}>

        {/* Mobile top bar */}
        <div id="m-bar" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 20px', height:54,
          borderBottom:`0.5px solid ${BORDER}`,
          background: SURF,
          position:'sticky', top:0, zIndex:100,
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        }}>
          {/* Hamburger */}
          <button
            onClick={() => setNavOpen(o => !o)}
            style={{ background:'none', border:'none', padding:6, display:'flex', flexDirection:'column', gap:5, minWidth:40, minHeight:40, alignItems:'flex-start', justifyContent:'center' }}
          >
            <div style={{ width: navOpen ? 18 : 20, height:1.5, background:INK, transition:`width 200ms ${EASE}` }} />
            <div style={{ width:14, height:1.5, background:INK }} />
            <div style={{ width: navOpen ? 14 : 20, height:1.5, background:INK, transition:`width 200ms ${EASE}` }} />
          </button>

          <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontSize:17, fontWeight:300, color:INK }}>TDW</div>
          <div style={{ width:40 }} />
        </div>

        {/* Page content */}
        <div style={{ padding:'28px 22px 100px', maxWidth:980, margin:'0 auto' }} className="fade-up">
          {children}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          #d-nav  { display: flex !important; }
          #m-bar  { display: none !important; }
          #m-nav  { display: none !important; }
          #admin-main { margin-left: ${SIDEBAR_W}px; }
        }
        @media (max-width: 767px) {
          #d-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
