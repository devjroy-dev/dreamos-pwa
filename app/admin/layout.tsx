// app/admin/layout.tsx — THE ADMIN SHELL, REDESIGNED (ADM-1, approved by CE-47, 1 Oct 2026)
//
// Five places with plain names: Home, Demo profiles, Vendors, Dreamers, More. A bottom bar on a
// phone, a left rail from 768px (iPad and laptop). The house name and a Search button sit in the
// top bar on every
// width opens the same palette Ctrl-K opens. One look: the new vendor app's design
// (v2/lib/worklist/theme.ts scope and type rungs, Inter, the TDW name in the brand serif),
// Graphite dark by default, Chalk light from More > Look. Every route path is kept.
// What stays exactly as it was: the session check and the login bypass, the one html.adm scope
// (R-41.72/.73) and its mode cookie, the head meta and the one theme-color read, the palette.
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { hasAdminSession, clearAdminSession, adminGet } from '@/lib/admin-api/_base';
import { scopeCss, typeCss, GRAPHITE } from '@/v2/lib/worklist/theme';
import { ModeProvider, useMode } from '@/lib/worklist/ModeContext';
import { PLACES, placeFor } from './_components/adminNav';
import CommandPalette from './_components/CommandPalette';
import { Ico, C, F, OpenHelpContext } from './_components/Kit';

// The same faces the new vendor app loads (app/v2/vendor/layout.tsx): Inter for every word,
// the brand serif for the TDW name only. v2's typeCss points the old face variables at Inter
// inside html.adm, so pages written against them read Inter too.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'block' });
const brand = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const RAIL_W = 96;

const FONTS = `
  :root { --font-inter: ${inter.style.fontFamily}; --font-brand: ${brand.style.fontFamily}; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: var(--atelier-page-bg);
    color: var(--atelier-ink);
    font-family: var(--font-inter), system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;
    overflow-x: hidden;
  }
  input, select, textarea {
    font-family: var(--font-inter), system-ui, sans-serif;
    color: var(--atelier-ink) !important;
    -webkit-appearance: none;
  }
  input::placeholder, textarea::placeholder { color: var(--atelier-ink-dim) !important; }
  button { cursor: pointer; -webkit-tap-highlight-color: transparent; font-family: inherit; }
  option { background: var(--atelier-sheet-bg); }

  /* ── F-08.42 LIMB 1 · CE-RULED FORK 1(e) ──────────────────────────────────
     THIS KEYFRAME DECLARES NO TRANSFORM, AND THAT IS THE WHOLE CURE.

     It used to run translateY(10px) -> translateY(0). With both fill the
     to state is RETAINED, so the element kept a transform of
     translateY(0) — which is not none, and ANY non-none transform makes
     the element a containing block for its position:fixed descendants.
     .fade-up sits on the wrapper around {children}, so the admin surfaces
     resolved their fixed chrome against a 980px column instead of the
     viewport: the toast landed below the document fold, the sheets and
     scrims stopped covering the screen. The founder concluded a button was
     dead, twice.

     WHY (e) AND NOT A NARROWER ARM. Dropping both, or dropping the
     transform from the to frame only, both leave a 300ms window in which
     the transform is interpolating and the trap is live — a timing residual
     on the founder's own instrument, bought to keep a 10px rise. Moving the
     class inward is not buildable: the fixed elements ARE inside {children}.

     THE SECOND APPLICATION IS GONE. This paragraph used to name
     app/admin/invite-requests/_list.tsx as a second .fade-up site whose own
     drawer and scrim the class had to reach. That surface was DELETED at
     1c5e0f9 (2026-08-05, F-09.20 retirement A) together with
     app/admin/invites — which is also why TDW_10 P1's deletion item shipped
     already-discharged (CE ruling R-A2). The cure stands unchanged on its
     own merits: .fade-up now has exactly ONE application, the wrapper below,
     and a transform here would trap that wrapper's own fixed descendants —
     the palette's scrim among them.

     THE NAME SURVIVES DELIBERATELY. fadeUp/.fade-up is asserted by no cell
     for its motion; renaming would be churn for zero behaviour. This
     paragraph is why the name no longer describes the motion.

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

  .fade-up   { animation: fadeUp 300ms ${EASE} both; }
  .shimmer   { animation: shimmer 1.6s ease-in-out infinite; }
  .slide-in  { animation: slideIn 240ms ${EASE} both; }

  #adm-rail { display: none; }
  #adm-main { padding: calc(64px + env(safe-area-inset-top)) 16px calc(96px + env(safe-area-inset-bottom)); max-width: 1100px; margin: 0 auto; }
  @media (min-width: 768px) {
    #adm-rail { display: flex; }
    #adm-bar  { display: none !important; }
    #adm-top  { left: ${RAIL_W}px !important; }
    #adm-main { margin-left: ${RAIL_W}px; padding: 76px 28px 40px; }
  }
`;

// Open help requests, for the badge on Dreamers. Unfiltered on purpose: the A2 door counts what
// it returns, so a status filter would count only itself.
function useOpenAssistanceCount(): number | null {
  const [n, setN] = useState<number | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    let live = true;
    adminGet<{ counts?: { open?: number } }>('/api/v2/admin/assistance?limit=200')
      .then(d => { if (live) setN(typeof d?.counts?.open === 'number' ? d.counts.open : null); })
      .catch(() => { if (live) setN(null); });
    return () => { live = false; };
  }, [pathname]);
  return n;
}

function AdmScope() {
  const { mode } = useMode();
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add('adm');
    el.setAttribute('data-wl-mode', mode);
    el.classList.toggle('theme-light', mode === 'light');
    return () => {
      el.classList.remove('adm');
      el.classList.remove('theme-light');
      el.removeAttribute('data-wl-mode');
    };
  }, [mode]);
  return null;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider initial="dark" lane="admin">
      <AdmScope />
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ModeProvider>
  );
}

// The badge sits just right of the icon's centre by an offset, never by viewport arithmetic:
// a subtracting calc(50% - …) is the shape tdw14_f1410_fab_clamp guards (F-SW.2).
function Badge({ n }: { n: number | null }) {
  if (typeof n !== 'number' || n <= 0) return null;
  return <span aria-label={`${n} open`} style={{ position: 'absolute', top: 4, left: '50%', marginLeft: 6, minWidth: 18, height: 18, borderRadius: 999, background: C.primary, color: C.onPrimary, font: F.t5, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{n}</span>;
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openAssist = useOpenAssistanceCount();

  useEffect(() => {
    const ok = hasAdminSession();
    if (!ok && pathname !== '/admin/login') { clearAdminSession(); router.replace('/admin/login'); }
    else setAuthed(true);
  }, [pathname, router]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      setPaletteOpen(o => !o);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  if (!authed && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <><style>{scopeCss('html.adm') + typeCss('html.adm')}</style><style>{FONTS}</style>{children}</>;

  const here = placeFor(pathname);

  return (
    <>
      {/* R-41.72/.73 — THE ONE MOUNT, on the document element (see AdmScope), so the fixed
          panes below keep the viewport as their containing block. */}
      <style>{scopeCss('html.adm') + typeCss('html.adm')}</style>
      <style>{FONTS}</style>

      {/* PWA meta — admin scope installs as separate app on Android */}
      <head>
        <link rel="manifest" href="/admin-manifest.json" />
        {/* R-B1 — the one colour that leaves the var(): a browser reads theme-color before any
            stylesheet. It reads the ground from the theme file, so it cannot drift. */}
        <meta name="theme-color" content={GRAPHITE['page-bg']} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TDW Control Room" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Top bar: the TDW name on a phone, Search on every width */}
      <header id="adm-top" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 'calc(56px + env(safe-area-inset-top))', paddingTop: 'env(safe-area-inset-top)', display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, paddingRight: 12, background: C.header, borderBottom: `0.5px solid ${C.line}` }}>
        {/* The ruled masthead (ce41_brand_family): the house name as type, on every width. */}
        <Link href="/admin" className="adm-brand" style={{ font: F.brand, fontSize: 22, color: C.accent, textDecoration: 'none', minHeight: 44, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
          The Dream Wedding
        </Link>
        <button type="button" onClick={() => setPaletteOpen(true)} aria-label="Search" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '0 14px', borderRadius: 12, border: `1px solid ${C.inputLine}`, background: C.input, color: C.soft, font: F.t4 }}>
          <Ico n="search" s={18} />Search
        </button>
      </header>

      {/* Left rail, iPad and laptop */}
      <nav id="adm-rail" aria-label="Admin" style={{ position: 'fixed', top: 0, bottom: 0, left: 0, width: RAIL_W, zIndex: 101, flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 'calc(14px + env(safe-area-inset-top))', background: C.header, borderRight: `0.5px solid ${C.line}` }}>
        <Link href="/admin" style={{ font: F.brand, color: C.accent, textDecoration: 'none', marginBottom: 12, minHeight: 44, display: 'flex', alignItems: 'center' }}>TDW</Link>
        {PLACES.map(p => {
          const on = here === p.key;
          return (
            <Link key={p.key} href={p.path} aria-current={on ? 'page' : undefined} style={{ position: 'relative', width: 82, minHeight: 60, padding: '8px 0', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: on ? C.accent : C.soft, background: on ? C.hover : 'transparent', font: F.t5, fontWeight: on ? 600 : 500, textAlign: 'center' }}>
              <Ico n={p.icon} s={22} />{p.label}
              {p.key === 'dreamers' && <Badge n={openAssist} />}
            </Link>
          );
        })}
      </nav>

      <main id="adm-main" className="fade-up"><OpenHelpContext.Provider value={openAssist}>{children}</OpenHelpContext.Provider></main>

      {/* Bottom bar, phone */}
      <nav id="adm-bar" aria-label="Admin" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 195, display: 'flex', alignItems: 'stretch', background: C.header, borderTop: `0.5px solid ${C.line}`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {PLACES.map(p => {
          const on = here === p.key;
          return (
            <Link key={p.key} href={p.path} aria-current={on ? 'page' : undefined} style={{ position: 'relative', flex: 1, minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: on ? C.accent : C.soft, font: F.t5, fontWeight: on ? 600 : 500 }}>
              <Ico n={p.icon} s={22} />{p.short}
              {p.key === 'dreamers' && <Badge n={openAssist} />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
