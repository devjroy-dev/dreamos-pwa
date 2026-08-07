'use client';
// app/admin/layout.tsx — TDW Control Room shell
// TDW_10 P1 — the six-domain IA, the dark token set, the command palette.
// A-1 (founder law) · A-4 mobile-first · CE rulings R-A1 / R-A3 / R-A4 / R-A5 / R-A7.
//
// ── WHAT CHANGED AND WHY, IN ONE PLACE ──────────────────────────────────────
// 1. COLOUR LEFT THIS FILE. It held six module-level consts (G/INK/SOFT/DIM/
//    BORDER/BORDER_STRONG) and inline hex literals; app/admin as a whole
//    carried hundreds of hex occurrences and ZERO `var(--…)` reads. Every
//    colour here is now a role from app/admin/_components/tokens.css. The
//    values did not change — they were NAMED. The one exception is the accent,
//    below.
// 2. THE ACCENT IS GOLD, NOT ROSE. `const G = '#C44058'` is retired.
//    TDW_10_ADMIN_FINAL P1.1 reserves gold for the wordmark and genuine alerts;
//    R-A1 rider (ii) ruled the spec over the screen (the-product-is-the-spec)
//    and put the byte on the founder's smoke card with an OPEN VETO. Measured,
//    not asserted: rose 3.31:1 against the darkest ground, gold 7.18:1.
// 3. THE NAV LEFT THIS FILE. Eight ad-hoc groups became the six ruled domains,
//    and the registry now lives at ./_components/adminNav.ts so the shell, the
//    palette and the mapping table read ONE source.
// 4. MOBILE IS A DOMAIN BAR, NOT A HAMBURGER DRAWER (A-4). Six thumb-reachable
//    domains along the bottom; tapping one raises that domain's sections.
//
// ── ROUTE PATHS ARE UNTOUCHED ───────────────────────────────────────────────
// Every path below is byte-identical to the one it replaced. Deep links are
// preserved BY CONSTRUCTION, not by redirect — see the §0.2 report in
// ./_components/adminNav.ts, which names the unbuilt alternative rather than
// letting its absence pass for a decision.
//
// ── AUTH IS BYTE-UNTOUCHED (P1 item 4) ──────────────────────────────────────
// The gate below is the same three statements it was at f9b0600, and
// src/api/admin/requireAdmin.js has a zero-line diff in this delivery.

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hasAdminSession, clearAdminSession } from '@/lib/admin-api/_base';
import './_components/tokens.css';
import { BRIDGE, DOMAINS, type Domain, type Section } from './_components/adminNav';
import CommandPalette from './_components/CommandPalette';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
const SIDEBAR_W = 236;

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Jost:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: var(--admin-bg);
    background-attachment: fixed;
    color: var(--admin-ink);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;
  }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--admin-metal-line); border-radius: 2px; }
  scrollbar-width: thin;
  scrollbar-color: var(--admin-metal-line) transparent;

  input, select, textarea {
    font-family: "DM Sans", sans-serif;
    color: var(--admin-ink) !important;
    -webkit-appearance: none;
  }
  input::placeholder, textarea::placeholder { color: var(--admin-ink-dim) !important; }
  button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
  option { background: var(--admin-option-bg); }

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
`;

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const p: Record<string, React.ReactNode> = {
    // ── Domains ──
    bridge:      <><path d="M3 18h18M5 18V9M19 18V9"/><path d="M3 9l9-5 9 5"/><path d="M9 18v-4h6v4"/></>,
    growth:      <><path d="M3 17l5-5 4 4 8-8"/><path d="M15 8h5v5"/></>,
    marketplace: <><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9"/><path d="M3 9h18"/></>,
    people:      <><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0112 0"/><path d="M16 5.2a3.2 3.2 0 010 5.6M17.5 20a6 6 0 00-2-4.5"/></>,
    money:       <><circle cx="12" cy="12" r="9"/><path d="M9 8h6M9 12h6M11 8v8M15 16c-2.2 0-4-1.4-4-4"/></>,
    engine:      <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></>,
    content:     <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h8M8 16h5"/></>,
    // ── Sections ──
    inbox:     <><path d="M3 12l3-7h12l3 7v6a1 1 0 01-1 1H4a1 1 0 01-1-1z"/><path d="M3 12h5l2 3h4l2-3h5"/></>,
    demo:      <><path d="M9 3h6M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3"/><path d="M7.5 15h9"/></>,
    discover:  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M11 8v6M8 11h6"/></>,
    photos:    <><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.2"/><path d="M8 6l1.5-2h5L16 6"/></>,
    portfolio: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
    couture:   <><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5L20 18M8 16.5L20 6"/></>,
    calendar:  <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    makers:    <><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v10a1 1 0 001 1h14a1 1 0 001-1V9"/><path d="M3 9h18"/></>,
    dreamers:  <path d="M12 20s-7-4.3-7-9.5A3.5 3.5 0 0112 7a3.5 3.5 0 017 3.5C19 15.7 12 20 12 20z"/>,
    chat:      <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z"/>,
    chatHeart: <><path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z"/><path d="M12 14.5s-2.4-1.5-2.4-3a1.2 1.2 0 012.4-.5 1.2 1.2 0 012.4.5c0 1.5-2.4 3-2.4 3z"/></>,
    config:    <><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h6M14 18h6"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></>,
    landing:   <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></>,
    exploring: <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></>,
    heroes:    <path d="M12 3l2.6 5.6 6.1.6-4.6 4 1.4 6L12 16.9 6.5 19.2l1.4-6-4.6-4 6.1-.6z"/>,
    spotlight: <><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/><circle cx="12" cy="12" r="3.5"/></>,
    muse:      <><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4M4 17l8 4 8-4"/></>,
    surprise:  <><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8S9 3 6.5 4.5 9 8 12 8zM12 8s3-5 5.5-3.5S15 8 12 8z"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>,
    // ── F-10.74 · the sign-out glyph, MINTED HERE ────────────────────────────
    // The founder's word, verbatim: 「 just an icon---its for admin panel only.
    // the power button shall do fine. 」 Derived before minting: no glyph in
    // this map carried a power/exit sense, so this is a new entry, not a reuse.
    // The standard symbol — a broken ring with a vertical stem. Used at BOTH
    // seats (sidebar header, mobile bar) so the panel has one sign-out
    // vocabulary and not two.
    power:     <><path d="M12 3v9"/><path d="M6.8 6.8a7.5 7.5 0 1010.4 0"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {p[name] || null}
    </svg>
  );
}

function NavItem({ label, icon, active, retiring, onClick }: {
  label: string; icon: string; active: boolean; retiring?: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        width: '100%', textAlign: 'left',
        padding: '9px 18px 9px 14px',
        border: 'none', outline: 'none',
        background: active ? 'var(--admin-metal-wash)' : hov ? 'var(--admin-row-hover)' : 'transparent',
        borderLeft: `2px solid ${active ? 'var(--admin-metal)' : 'transparent'}`,
        color: active ? 'var(--admin-metal)' : hov ? 'var(--admin-ink)' : 'var(--admin-ink-mute)',
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: active ? 600 : 500,
        fontSize: 13.5, letterSpacing: '0.005em',
        transition: `all 140ms ${EASE}`,
        minHeight: 44,
        cursor: 'pointer',
      }}
    >
      <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: active ? 1 : 0.7 }}>
        <Icon name={icon} size={18} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
      {/* R-A4: the death warrant is VISIBLE. A surface chartered to retire says
          so on the nav, so nobody builds a habit on it between now and then. */}
      {retiring && (
        <span style={{ fontFamily: '"Jost", sans-serif', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--admin-ink-dim)' }}>
          retiring
        </span>
      )}
    </button>
  );
}

function DomainSections({ domain, onNavigate }: { domain: Domain; onNavigate: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (p: string) => (p === '/admin' ? pathname === '/admin' : pathname.startsWith(p));

  if (domain.sections.length === 0) {
    return (
      <div style={{
        padding: '10px 18px 14px', fontFamily: '"DM Sans", sans-serif',
        fontSize: 12, lineHeight: 1.5, color: 'var(--admin-ink-dim)',
      }}>
        {domain.empty}
      </div>
    );
  }
  return (
    <>
      {domain.sections.map((s: Section) => (
        <NavItem
          key={s.path}
          label={s.label}
          icon={s.icon}
          active={!!isActive(s.path)}
          retiring={!!s.retiresAt}
          onClick={() => { router.push(s.path); onNavigate(); }}
        />
      ))}
    </>
  );
}

function Sidebar({ onNavigate, onSearch }: { onNavigate: () => void; onSearch: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--admin-nav-bg)', borderRight: '0.5px solid var(--admin-hairline)' }}>
      {/* Wordmark — the metal's first sanctioned home (spec P1.1) */}
      <div style={{ padding: '26px 20px 14px', flexShrink: 0 }}>
        {/* ── F-10.74 LIMB 2 — THE SIGN-OUT MOVED UP HERE, AND WHY ────────────
            IT USED TO SIT AT THE SIDEBAR'S FOOT: a 10px uppercase word in
            --admin-ink-dim, below the wordmark, the Search box, the Bridge row
            and six domains' worth of nav. Bench-green the whole time
            (tdw07_f0784_panel §2.3 asserted the handler clears the real
            session, 34/34) — and the founder still said, verbatim:
              「 cant see the signout in desktop or phone. the button i have no
                idea where it is. 」
            That is CE-115's twin law by name, BENCHED-THE-MECHANISM-NOT-THE-
            AFFORDANCE: a cell proved the wiring existed; nothing ever asserted
            a human could find it, and he couldn't. A bench cannot catch what
            nobody told it to look for.
            THE HANDLER IS BYTE-IDENTICAL to the retired footer button's. Only
            the seat and the dress changed: header row, top-right, beside the
            wordmark — always visible, zero scroll, first glance. Icon-only per
            his ruling; aria-label carries the word. */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--admin-metal)', letterSpacing: '-0.01em', lineHeight: 1 }}>
              The Dream Wedding
            </div>
            <div style={{ fontFamily: '"Jost",sans-serif', fontWeight: 400, fontSize: 9, color: 'var(--admin-ink-mute)', letterSpacing: '0.34em', textTransform: 'uppercase', marginTop: 6 }}>
              Control Room
            </div>
          </div>
          <button
            onClick={() => { clearAdminSession(); router.replace('/admin/login'); }}
            aria-label="Sign out"
            title="Sign out"
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, marginTop: -10, marginRight: -10,
              background: 'none', border: 'none', padding: 0,
              color: 'var(--admin-ink-mute)', cursor: 'pointer',
            }}
          >
            <Icon name="power" size={18} />
          </button>
        </div>
        <div style={{ height: '0.5px', background: 'linear-gradient(to right, var(--admin-metal-soft), transparent)', marginTop: 14 }} />
      </div>

      {/* Palette opener — a visible door, not only a keystroke */}
      <div style={{ padding: '0 14px 10px', flexShrink: 0 }}>
        <button
          onClick={onSearch}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            background: 'var(--admin-input-bg)', border: '0.5px solid var(--admin-input-border)',
            borderRadius: 8, padding: '0 10px', minHeight: 40,
            color: 'var(--admin-ink-mute)', fontFamily: '"DM Sans", sans-serif', fontSize: 13,
          }}
        >
          <Icon name="search" size={15} />
          <span style={{ flex: 1, textAlign: 'left' }}>Search</span>
          <span style={{ fontFamily: '"Jost", sans-serif', fontSize: 10, letterSpacing: '0.1em', color: 'var(--admin-ink-dim)' }}>⌘K</span>
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 28, scrollbarWidth: 'none' }}>
        <NavItem
          label={BRIDGE.label}
          icon={BRIDGE.icon}
          active={pathname === '/admin'}
          onClick={() => { router.push(BRIDGE.path); onNavigate(); }}
        />
        {DOMAINS.map(d => (
          <div key={d.key} style={{ marginBottom: 4 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: '"Jost",sans-serif', fontWeight: 600, fontSize: 10,
              color: 'var(--admin-ink-dim)', letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '18px 18px 6px',
            }}>
              <Icon name={d.icon} size={13} />
              {d.label}
            </div>
            <DomainSections domain={d} onNavigate={onNavigate} />
          </div>
        ))}
      </nav>

      {/* F-10.74 · CONTROL INVENTORY — the foot's "Sign Out" text button is
          MOVED, not removed: its handler now hangs on the header's power glyph
          above (1 → 1, desktop). Nothing else lived in this footer, so the
          footer goes with it rather than standing as an empty hairline. */}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  // ⌘K / Ctrl-K. Bound at the shell so it works from every admin surface.
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
  if (pathname === '/admin/login') return <><style>{FONTS}</style>{children}</>;

  const activeDomain = DOMAINS.find(d => d.key === openDomain) || null;

  return (
    <>
      <style>{FONTS}</style>

      {/* PWA meta — admin scope installs as separate app on Android */}
      <head>
        <link rel="manifest" href="/admin-manifest.json" />
        {/* R-B1 — THE ONE HEX IN THIS FILE, AND IT MOVES WITH THE GROUND.
            A browser reads this attribute BEFORE any stylesheet, so it cannot be
            a var() — that is why the exception exists at all (P1). It was
            #0F1622, the cockpit navy. The retint made it a defect the moment it
            stopped matching: the phone's status bar and the Android splash would
            have stayed NAVY while every pixel below them went espresso, which is
            precisely the seam the founder's smoke test looks at. Caught by
            scripts/tdw10_p2_retint.proof.mjs §6, not by eye.
            #1F1612 is theme.ts DARK.pageBg, the same value --admin-shell carries. */}
        <meta name="theme-color" content="#1F1612" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TDW Control Room" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Desktop sidebar */}
      <div id="d-nav" style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: SIDEBAR_W, zIndex: 10, display: 'none', flexDirection: 'column' }}>
        <Sidebar onNavigate={() => {}} onSearch={() => setPaletteOpen(true)} />
      </div>

      {/* Mobile: the raised domain sheet */}
      {activeDomain && (
        <>
          <div
            onClick={() => setOpenDomain(null)}
            style={{ position: 'fixed', inset: 0, background: 'var(--admin-scrim)', zIndex: 190, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          />
          <div
            id="m-sheet"
            style={{
              position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 191,
              background: 'var(--admin-sheet)', borderTop: '0.5px solid var(--admin-sheet-border)',
              borderRadius: '14px 14px 0 0', paddingBottom: 'calc(74px + env(safe-area-inset-bottom))',
              maxHeight: '70vh', overflowY: 'auto',
            }}
          >
            <div style={{
              fontFamily: '"Jost",sans-serif', fontWeight: 600, fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--admin-ink-dim)', padding: '18px 18px 8px',
            }}>
              {activeDomain.label}
            </div>
            <DomainSections domain={activeDomain} onNavigate={() => setOpenDomain(null)} />
          </div>
        </>
      )}

      {/* Main */}
      <div id="admin-main" style={{ background: 'var(--admin-bg)', backgroundAttachment: 'fixed', minHeight: '100dvh' }}>

        {/* Mobile top bar — wordmark + the palette's pull-down */}
        <div id="m-bar" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', height: 54,
          borderBottom: '0.5px solid var(--admin-hairline)',
          background: 'var(--admin-bar-bg)',
          position: 'sticky', top: 0, zIndex: 100,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}>
          <div style={{ fontFamily: '"Cormorant Garamond",serif', fontStyle: 'italic', fontSize: 18, fontWeight: 400, color: 'var(--admin-metal)' }}>TDW</div>
          {/* F-10.74: the bar's justifyContent is space-between and it carried
              exactly two children. A third would have floated the Jump box into
              the middle of the bar, so the two right-hand controls group. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => { setOpenDomain(null); setPaletteOpen(true); }}
            aria-label="Search"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--admin-input-bg)', border: '0.5px solid var(--admin-input-border)',
              borderRadius: 8, padding: '0 12px', minHeight: 40, minWidth: 48,
              color: 'var(--admin-ink-mute)', fontFamily: '"DM Sans", sans-serif', fontSize: 13,
            }}
          >
            <Icon name="search" size={15} />
            <span>Jump</span>
          </button>
          {/* ── F-10.74 LIMB 1 — THE MOBILE SIGN-OUT, WHICH DID NOT EXIST ─────
              Below 768px the responsive block at the foot of this file sets
              `#d-nav { display: none !important }`, and the sidebar is where
              the ONLY sign-out lived. So on the founder's phone the control was
              not hidden behind a tap — it was absent from the DOM entirely, on
              a panel A-4 declared mobile-first. Fork 1 ruled (b): this seat,
              #m-bar top-right beside Jump, present on every admin route.
              Same glyph as the sidebar's, one vocabulary; 44px box (A-4's own
              number); aria-label carries the word the icon doesn't say. */}
          <button
            onClick={() => { clearAdminSession(); router.replace('/admin/login'); }}
            aria-label="Sign out"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, marginRight: -10,
              background: 'none', border: 'none', padding: 0,
              color: 'var(--admin-ink-mute)', cursor: 'pointer',
            }}
          >
            <Icon name="power" size={18} />
          </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '28px 22px 120px', maxWidth: 980, margin: '0 auto' }} className="fade-up">
          {children}
        </div>
      </div>

      {/* Mobile bottom domain bar (A-4) — six domains, one hand */}
      <div id="m-domains" style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 195,
        display: 'flex', alignItems: 'stretch',
        background: 'var(--admin-bar-bg)',
        borderTop: '0.5px solid var(--admin-hairline)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <button
          onClick={() => { setOpenDomain(null); router.push('/admin'); }}
          aria-label="The Bridge"
          style={domainBtn(pathname === '/admin')}
        >
          <Icon name={BRIDGE.icon} size={18} />
          <span style={domainBtnLabel}>Bridge</span>
        </button>
        {DOMAINS.map(d => (
          <button
            key={d.key}
            onClick={() => setOpenDomain(k => (k === d.key ? null : d.key))}
            aria-label={d.label}
            style={domainBtn(openDomain === d.key)}
          >
            <Icon name={d.icon} size={18} />
            <span style={domainBtnLabel}>{d.label}</span>
          </button>
        ))}
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          #d-nav      { display: flex !important; }
          #m-bar      { display: none !important; }
          #m-domains  { display: none !important; }
          #m-sheet    { display: none !important; }
          #admin-main { margin-left: ${SIDEBAR_W}px; }
        }
        @media (max-width: 767px) {
          #d-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}

// 48px targets, A-4's own number, applied at every bar button.
function domainBtn(active: boolean): React.CSSProperties {
  return {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 3, border: 'none', background: 'transparent', minHeight: 56, padding: '6px 2px',
    color: active ? 'var(--admin-metal)' : 'var(--admin-ink-mute)',
  };
}

const domainBtnLabel: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif', fontSize: 9, letterSpacing: '0.08em',
  textTransform: 'uppercase', whiteSpace: 'nowrap',
};
