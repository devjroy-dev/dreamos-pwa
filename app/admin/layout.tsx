'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0908; color: #F5F0E8; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 2px; } ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:0.7} 100%{opacity:0.4} }
  .fade-up { animation: fadeUp 280ms cubic-bezier(0.22,1,0.36,1) both; }
  .shimmer { animation: shimmer 1.4s ease-in-out infinite; }
  input, select, textarea { font-family: inherit; color: #F5F0E8 !important; }
  input::placeholder, textarea::placeholder { color: rgba(245,240,232,0.25) !important; }
  button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
`;

const G = '#C9A84C';
const BG = '#0A0908';
const BORDER = 'rgba(201,168,76,0.15)';
const INK = '#F5F0E8';
const SOFT = 'rgba(245,240,232,0.5)';
const SIDEBAR_W = 220;

const NAV = [
  { group: 'OVERVIEW', items: [
    { label: 'Dashboard',   path: '/admin',                        icon: '◈' },
  ]},
  { group: 'PEOPLE', items: [
    { label: 'Makers',      path: '/admin/makers',                 icon: '✦' },
    { label: 'Portfolios',  path: '/admin/vendors/portfolio',      icon: '⬡' },
    { label: 'Dreamers',    path: '/admin/dreamers',               icon: '♡' },
    { label: 'Invites',     path: '/admin/invites',                icon: '⌘' },
  ]},
  { group: 'CONTENT', items: [
    { label: 'Landing',     path: '/admin/content/landing',        icon: '⬡' },
    { label: 'Exploring',   path: '/admin/content/exploring',      icon: '◎' },
    { label: 'Heroes',      path: '/admin/content/heroes',         icon: '★' },
    { label: 'Spotlight',   path: '/admin/content/spotlight',      icon: '◐' },
    { label: 'Muse Pool',   path: '/admin/content/muse-pool',      icon: '♡' },
    { label: 'Surprise Me', path: '/admin/content/surprise-me',    icon: '✦' },
  ]},
  { group: 'APPROVALS', items: [
    { label: 'Photos',      path: '/admin/approvals/photos',       icon: '⬡' },
    { label: 'Discover',    path: '/admin/approvals/discover',     icon: '◈' },
  ]},
  { group: 'CONVERSATIONS', items: [
    { label: 'Vendors',     path: '/admin/conversations/vendors',  icon: '◎' },
    { label: 'Brides',      path: '/admin/conversations/brides',   icon: '◎' },
  ]},
  { group: 'COMMERCE', items: [
    { label: 'Couture',     path: '/admin/couture',                icon: '✦' },
    { label: 'Hot Dates',   path: '/admin/hot-dates',              icon: '◈' },
  ]},
  { group: 'INVITE REQUESTS', items: [
    { label: 'Dreamers',        path: '/admin/invite-requests/dreamers', icon: '♡' },
    { label: 'Makers',          path: '/admin/invite-requests/makers',   icon: '✦' },
  ]},
  { group: 'OUTREACH', items: [
    { label: 'Demo Profiles', path: '/admin/demo-profiles', icon: '◉' },
  ]},
  { group: 'CONFIG', items: [
    { label: 'AI Caps',     path: '/admin/config',                 icon: '⚙' },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed]   = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const s = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null;
    if (!s && pathname !== '/admin/login') router.replace('/admin/login');
    else setAuthed(true);
  }, [pathname, router]);

  if (!authed && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <><style>{FONTS}</style>{children}</>;

  const isActive = (path: string) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0D0B09', borderRight: `0.5px solid ${BORDER}` }}>
      <div style={{ padding: '28px 20px 20px', flexShrink: 0 }}>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: INK }}>The Dream Wedding</div>
        <div style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 7, color: G, letterSpacing: '0.35em', textTransform: 'uppercase' as const, marginTop: 4 }}>Control Room</div>
        <div style={{ height: '0.5px', background: `linear-gradient(to right, ${G}55, transparent)`, marginTop: 16 }} />
      </div>
      <nav style={{ flex: 1, overflowY: 'auto' as const, paddingBottom: 24, scrollbarWidth: 'none' as const }}>
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <div style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 7, color: 'rgba(201,168,76,0.4)', letterSpacing: '0.35em', textTransform: 'uppercase' as const, padding: '18px 20px 6px' }}>{group}</div>
            {items.map(({ label, path, icon }) => {
              const active = isActive(path);
              return (
                <button key={path} onClick={() => { router.push(path); setNavOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left' as const, padding: '10px 20px 10px 16px', border: 'none', outline: 'none', background: active ? 'rgba(201,168,76,0.08)' : 'transparent', color: active ? G : SOFT, borderLeft: `2px solid ${active ? G : 'transparent'}`, fontFamily: '"DM Sans", sans-serif', fontWeight: active ? 400 : 300, fontSize: 13, transition: 'all 0.15s ease', minHeight: 44 }}>
                  <span style={{ fontSize: 10, width: 14, flexShrink: 0, opacity: active ? 1 : 0.5 }}>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: `0.5px solid ${BORDER}`, flexShrink: 0 }}>
        <button onClick={() => { localStorage.removeItem('admin_session'); router.replace('/admin/login'); }} style={{ background: 'none', border: 'none', fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: SOFT, padding: 0, minHeight: 44, display: 'flex', alignItems: 'center' }}>Sign Out</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{FONTS}</style>
      {navOpen && <div onClick={() => setNavOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 199, backdropFilter: 'blur(4px)' }} />}
      <div style={{ position: 'fixed', top: 0, left: navOpen ? 0 : -SIDEBAR_W - 10, bottom: 0, width: SIDEBAR_W, zIndex: 200, transition: 'left 300ms cubic-bezier(0.22,1,0.36,1)' }} id="m-nav">{sidebarContent}</div>
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: SIDEBAR_W, display: 'none', flexDirection: 'column' as const }} id="d-nav">{sidebarContent}</div>
      <div id="admin-main" style={{ background: BG, minHeight: '100vh' }}>
        <div id="m-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 56, borderBottom: `0.5px solid ${BORDER}`, background: '#0D0B09', position: 'sticky', top: 0, zIndex: 100 }}>
          <button onClick={() => setNavOpen(o => !o)} style={{ background: 'none', border: 'none', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 20, height: 1.5, background: INK }} />
            <div style={{ width: 14, height: 1.5, background: INK }} />
            <div style={{ width: 20, height: 1.5, background: INK }} />
          </button>
          <div style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 17, fontWeight: 300, color: INK }}>TDW</div>
          <div style={{ width: 44 }} />
        </div>
        <div style={{ padding: '24px 20px 100px', maxWidth: 960, margin: '0 auto' }} className="fade-up">{children}</div>
      </div>
      <style>{`@media(min-width:768px){#d-nav{display:flex!important;}#m-bar{display:none!important;}#m-nav{display:none!important;}#admin-main{margin-left:${SIDEBAR_W}px;}}`}</style>
    </>
  );
}
