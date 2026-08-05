'use client';
// app/admin/layout.tsx — TDW Control Room shell
// Editorial sidebar · PWA-optimised · Dark espresso · Gold accents

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hasAdminSession, clearAdminSession } from '@/lib/admin-api/_base';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const G    = '#C44058';
const INK  = '#F0EAE0';
const SOFT = 'rgba(240,234,224,0.48)';
const DIM  = 'rgba(240,234,224,0.22)';
const BORDER = 'rgba(255,255,255,0.10)';
const BORDER_STRONG = 'rgba(255,255,255,0.18)';
const SIDEBAR_W = 228;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Jost:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: linear-gradient(165deg, #213650 0%, #18293E 50%, #122031 100%);
    background-attachment: fixed;
    color: #F0EAE0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;
  }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(196,64,88,0.2); border-radius: 2px; }
  scrollbar-width: thin;
  scrollbar-color: rgba(196,64,88,0.2) transparent;

  input, select, textarea {
    font-family: "DM Sans", sans-serif;
    color: #F0EAE0 !important;
    -webkit-appearance: none;
  }
  input::placeholder, textarea::placeholder { color: rgba(240,234,224,0.22) !important; }
  button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
  option { background: #10171F; }

  /* ── F-08.42 LIMB 1 · CE-RULED FORK 1(e) ──────────────────────────────────
     THIS KEYFRAME DECLARES NO TRANSFORM, AND THAT IS THE WHOLE CURE.

     It used to run translateY(10px) -> translateY(0). With both fill the
     to state is RETAINED, so the element kept a transform of
     translateY(0) — which is not none, and ANY non-none transform makes
     the element a containing block for its position:fixed descendants.
     .fade-up sits on the wrapper around {children}, so all forty-one admin
     surfaces resolved their fixed chrome against a 980px column instead of
     the viewport: the toast landed below the document fold, the sheets and
     scrims stopped covering the screen. The founder concluded a button was
     dead, twice.

     WHY (e) AND NOT A NARROWER ARM. Dropping both, or dropping the
     transform from the to frame only, both leave a 300ms window in which
     the transform is interpolating and the trap is live — a timing residual
     on the founder's own instrument, bought to keep a 10px rise. Moving the
     class inward is not buildable: the fixed elements ARE inside {children}.
     Removing it from the wrapper alone would leave the SECOND application
     (app/admin/invite-requests/_list.tsx) trapping its own drawer and scrim
     on two surfaces. Curing the CLASS reaches both applications at once.

     THE TRADE, FOUNDER-VETOED AND NAMED: the admin console loses its 10px
     entrance rise on forty-one surfaces and keeps the fade. Internal
     instrument; correctness over motion.

     THE NAME SURVIVES DELIBERATELY. fadeUp/.fade-up is applied at exactly
     two sites and asserted by no cell; renaming would be churn for zero
     behaviour. This paragraph is why the name no longer describes the motion.

     DO NOT RE-INTRODUCE A TRANSFORM HERE. Guarded both ways at
     scripts/tdw08_console.proof.mjs, section 1. */
  @keyframes fadeUp {
    from { opacity: 0; }
    to   { opacity: 1; }
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
    { label:'Dashboard',     path:'/admin',                          icon:'dashboard' },
  ]},
  { group: 'People', items: [
    { label:'Makers',        path:'/admin/makers',                   icon:'makers' },
    { label:'Portfolios',    path:'/admin/vendors/portfolio',        icon:'portfolio' },
    { label:'Dreamers',      path:'/admin/dreamers',                 icon:'dreamers' },
  ]},
  { group: 'Content', items: [
    { label:'Landing',       path:'/admin/content/landing',         icon:'landing' },
    { label:'Exploring',     path:'/admin/content/exploring',       icon:'exploring' },
    { label:'Heroes',        path:'/admin/content/heroes',          icon:'heroes' },
    { label:'Spotlight',     path:'/admin/content/spotlight',       icon:'spotlight' },
    { label:'Muse Pool',     path:'/admin/content/muse-pool',       icon:'muse' },
    { label:'Surprise Me',   path:'/admin/content/surprise-me',     icon:'surprise' },
  ]},
  { group: 'Approvals', items: [
    { label:'Photos',        path:'/admin/approvals/photos',        icon:'photos' },
    { label:'Discover',      path:'/admin/approvals/discover',      icon:'discover' },
  ]},
  { group: 'Conversations', items: [
    { label:'Vendors',       path:'/admin/conversations/vendors',   icon:'chat' },
    { label:'Brides',        path:'/admin/conversations/brides',    icon:'chatHeart' },
  ]},
  { group: 'Commerce', items: [
    { label:'Couture',       path:'/admin/couture',                 icon:'couture' },
    { label:'Hot Dates',     path:'/admin/hot-dates',               icon:'calendar' },
  ]},
  { group: 'Outreach', items: [
    { label:'Demo Profiles', path:'/admin/demo',                    icon:'demo' },
    { label:'Prospects',     path:'/admin/prospects',               icon:'inbox' },
  ]},
  { group: 'Config', items: [
    { label:'AI Caps',       path:'/admin/config',                  icon:'config' },
  ]},
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const p: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    makers:    <><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9"/><path d="M3 9h18"/></>,
    portfolio: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
    dreamers:  <path d="M12 20s-7-4.3-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.7 12 20 12 20z"/>,
    invites:   <><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12"/></>,
    landing:   <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></>,
    exploring: <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></>,
    heroes:    <path d="M12 3l2.6 5.6 6.1.6-4.6 4 1.4 6L12 16.9 6.5 19.2l1.4-6-4.6-4 6.1-.6z"/>,
    spotlight: <><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/><circle cx="12" cy="12" r="3.5"/></>,
    muse:      <><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4M4 17l8 4 8-4"/></>,
    surprise:  <><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8S9 3 6.5 4.5 9 8 12 8zM12 8s3-5 5.5-3.5S15 8 12 8z"/></>,
    photos:    <><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.2"/><path d="M8 6l1.5-2h5L16 6"/></>,
    discover:  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M11 8v6M8 11h6"/></>,
    chat:      <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z"/>,
    chatHeart: <><path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z"/><path d="M12 14.5s-2.4-1.5-2.4-3a1.2 1.2 0 012.4-.5 1.2 1.2 0 012.4.5c0 1.5-2.4 3-2.4 3z"/></>,
    couture:   <><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5L20 18M8 16.5L20 6"/></>,
    calendar:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    inbox:     <><path d="M3 12l3-7h12l3 7v6a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M3 12h5l2 3h4l2-3h5"/></>,
    userplus:  <><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0112 0M18 8v6M21 11h-6"/></>,
    demo:      <><path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3"/><path d="M7.5 15h9"/></>,
    config:    <><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h6M14 18h6"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
      {p[name] || null}
    </svg>
  );
}

function NavItem({ label, path, icon, active, onClick }: {
  label: string; path: string; icon: string; active: boolean; onClick: () => void;
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
        background: active ? 'rgba(196,64,88,0.09)' : hov ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderLeft:`2px solid ${active ? G : 'transparent'}`,
        color: active ? G : hov ? INK : SOFT,
        fontFamily:'"DM Sans", sans-serif',
        fontWeight: active ? 600 : 500,
        fontSize:13.5, letterSpacing:'0.005em',
        transition:`all 140ms ${EASE}`,
        minHeight:42,
        cursor:'pointer',
      }}
    >
      <span style={{ width:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity: active ? 1 : 0.7 }}><Icon name={icon} size={18} /></span>
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
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'linear-gradient(180deg, #15273D 0%, #0E1B2C 100%)', borderRight:`0.5px solid ${BORDER}` }}>
      {/* Wordmark */}
      <div style={{ padding:'26px 20px 18px', flexShrink:0 }}>
        <div style={{ fontFamily:'"Cormorant Garamond",serif', fontStyle:'italic', fontWeight:400, fontSize:22, color:INK, letterSpacing:'-0.01em', lineHeight:1 }}>
          The Dream Wedding
        </div>
        <div style={{ fontFamily:'"Jost",sans-serif', fontWeight:400, fontSize:9, color:G, letterSpacing:'0.34em', textTransform:'uppercase', marginTop:6 }}>
          Control Room
        </div>
        <div style={{ height:'0.5px', background:`linear-gradient(to right, ${G}55, transparent)`, marginTop:14 }} />
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', paddingBottom:28, scrollbarWidth:'none' }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom:4 }}>
            <div style={{ fontFamily:'"Jost",sans-serif', fontWeight:600, fontSize:10, color:'rgba(196,64,88,0.9)', letterSpacing:'0.14em', textTransform:'uppercase', padding:'18px 18px 6px' }}>
              {group}
            </div>
            {items.map(({ label, path, icon }) => (
              <div key={path}>
                <NavItem
                  label={label} path={path} icon={icon}
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
          onClick={() => { clearAdminSession(); router.replace('/admin/login'); }}
          style={{ background:'none', border:'none', fontFamily:'"Jost",sans-serif', fontWeight:400, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:DIM, padding:0, minHeight:36, cursor:'pointer', transition:`color 150ms ${EASE}` }}
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
    // ── F-07.84 CURED — THE BOOLEAN OPENS NOTHING ────────────────────────────
    // THIS READ: `localStorage.getItem('admin_session')`, admitting on the mere
    // PRESENCE of a string anyone could type into devtools in four seconds. The
    // gate now demands a real, unexpired, server-minted session token; a hand-set
    // `admin_session='true'` satisfies nothing, and clearAdminSession() removes
    // that retired key from any browser still carrying it.
    const ok = hasAdminSession();
    if (!ok && pathname !== '/admin/login') { clearAdminSession(); router.replace('/admin/login'); }
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
        <meta name="theme-color" content="#0F1622" />
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
      <div id="admin-main" style={{ background:'linear-gradient(165deg, #213650 0%, #18293E 50%, #122031 100%)', backgroundAttachment:'fixed', minHeight:'100dvh' }}>

        {/* Mobile top bar */}
        <div id="m-bar" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 20px', height:54,
          borderBottom:`0.5px solid ${BORDER}`,
          background: 'rgba(15,29,46,0.82)',
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
