"use client";
// components/worklist/WorklistShell.tsx — the shell chrome. ONE HOME for the scope, the
// mode, the nav and the dock.
//
// THE SCOPE IS THE THEME. Every token is defined on this element, not on :root, so the old
// shell's own layer is untouched even though both trees live in one deployment. A component
// imported into a room here inherits Graphite; the same component on /vendor still inherits
// Espresso. That is R-37.65's "zero forks" carried literally.
//
// NO THIRD CONTAINER. R-37.64: no search field, no hamburger, no overflow. Two seats and a
// coin, and the coin is the only drawer.
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { clearVendorSession } from '@/lib/vendor/session';
import { useVendorInitials } from '@/hooks/vendor/useVendorHandle';
import { scopeCss, typeCss } from '@/lib/worklist/theme';
import { AiDock } from '@/components/worklist/AiDock';

const MODE_KEY = 'tdw_worklist_mode';
const SCOPE = '.wl';

function DRow({ label, sub, onClick, current, danger }: {
  label: string; sub?: string; onClick: () => void; current?: boolean; danger?: boolean;
}) {
  return (
    <button type="button" role="menuitem" className={'wl-drow' + (danger ? ' danger' : '')}
            aria-current={current ? 'true' : undefined} onClick={onClick}>
      <span className="wl-dlabel">{label}</span>
      {sub && <span className="wl-dsub">{sub}</span>}
    </button>
  );
}

export function WorklistShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? '/w';
  const router   = useRouter();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [coinOpen, setCoinOpen] = useState(false);
  const initials = useVendorInitials();
  const go = (href: string) => { setCoinOpen(false); router.push(href); };
  const signOut = () => { setCoinOpen(false); clearVendorSession(); router.replace('/'); };

  // Persisted per device. Its own key: the old shell's 'dreamai_theme' names a different
  // pair of themes, and sharing the key would make one coin silently rule two palettes.
  useEffect(() => {
    try {
      const s = localStorage.getItem(MODE_KEY);
      if (s === 'light' || s === 'dark') setMode(s);
    } catch { /* private mode — stay dark */ }
  }, []);

  function pick(next: 'dark' | 'light') {
    setMode(next);
    setCoinOpen(false);
    try { localStorage.setItem(MODE_KEY, next); } catch { /* non-fatal */ }
  }

  const onToday = pathname.startsWith('/w/today');
  const onRooms = pathname.startsWith('/w/rooms') || pathname.startsWith('/w/support');

  return (
    <div className="wl" data-wl-mode={mode} style={{
      // FIXED VIEWPORT, SCROLLING BODY. The first cut used minHeight and let the whole column
      // grow, so the dock and both nav seats scrolled off the bottom of a long Today and the
      // shell had no visible chrome at rest. The old shell pins its bar for exactly this
      // reason (app/vendor/layout.tsx: height 100dvh, overflowY hidden); this one now does too.
      height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'var(--atelier-page-bg)', color: 'var(--atelier-ink)',
    }}>
      <style>{scopeCss(SCOPE) + typeCss(SCOPE) + SHELL_CSS}</style>

      <header className="wl-hdr" style={{ position: "relative" }}>
        {/* R-37.84 (2): the shell header stops being bare. The house name leads; the surface
            label sits beneath it. Same treatment on both shell surfaces. */}
        <div className="wl-hstack">
          <span className="wl-house">The Dream Wedding</span>
          <span className="wl-lbl">{title}</span>
        </div>
        {/* R-37.79: ONE IDENTITY EVERYWHERE. The shell's \u25ce glyph and the rooms' DR medallion
            were two identities for one person. The medallion wins \u2014 it is the one a vendor
            already recognises. Initials are derived, never a fixture; a vendor with no name
            yet gets the glyph rather than an empty circle. */}
        <button type="button" className="wl-coin" aria-label="Your profile" aria-expanded={coinOpen}
                onClick={() => setCoinOpen((v) => !v)}>{initials || '\u25ce'}</button>
      </header>

      {coinOpen && (
        <>
          {/* R-37.79 COMPLETED: the ruling adopted the medallion WITH ITS DRAWER, and this seat
              shipped two rows of it. The founder could not sign out or reach Settings from the
              shell's own coin — a half-adoption that left the shell less capable than the
              rooms it fronts. Full row set, same order as the rooms' drawer, one scrim. */}
          <button type="button" className="wl-drawerscrim" aria-label="Close menu" onClick={() => setCoinOpen(false)} />
          <div className="wl-drawer" role="menu">
            <div className="wl-dsec">Atelier</div>
            <DRow label="Discover Profile" sub="How couples see you" onClick={() => go('/vendor/discover/preview')} />
            <DRow label="Settings"         sub="Profile and preferences" onClick={() => go('/vendor/settings')} />
            <DRow label="Billing"          sub="Plan and payment" onClick={() => go('/vendor/billing')} />
            <DRow label="The Dream Wedding" onClick={() => { setCoinOpen(false); window.open('https://thedreamwedding.in', '_blank', 'noopener'); }} />
            <DRow label="Tips & Features"  sub="Mini manual" onClick={() => go('/vendor/more')} />
            <div className="wl-dsec">Display</div>
            <DRow label="Dark"  sub={COPY.themeDarkName}  onClick={() => pick('dark')}  current={mode === 'dark'} />
            <DRow label="Light" sub={COPY.themeLightName} onClick={() => pick('light')} current={mode === 'light'} />
            <div className="wl-dsec">Actions</div>
            <DRow label="Sign Out" danger onClick={signOut} />
          </div>
        </>
      )}

      <main className="wl-main">{children}</main>

      <AiDock mode={mode} />

      {/* R-37.75: ROOMS IS THE FIRST SEAT. The order here, the manifest's start_url and
          /w's redirect are three statements of one decision — if they ever disagree, the app
          disagrees with itself, so C17 asserts all three together rather than any one alone. */}
      <nav className="wl-nav" aria-label="Sections">
        <button type="button" className={'wl-seat' + (onRooms ? ' on' : '')}
                aria-current={onRooms ? 'page' : undefined}
                onClick={() => router.push('/w/rooms')}>{COPY.navRooms}</button>
        <button type="button" className={'wl-seat' + (onToday ? ' on' : '')}
                aria-current={onToday ? 'page' : undefined}
                onClick={() => router.push('/w/today')}>{COPY.navToday}</button>
      </nav>
    </div>
  );
}

// Type weights are explicit everywhere. Jost at 300 antialiases toward the ground at these
// sizes and reads several shades lighter than its measured ratio — the founder caught
// exactly this on the Chalk walk-through, and the cure was weight, not ink.
const SHELL_CSS = `
.wl-drawerscrim{position:fixed;inset:0;z-index:19;background:var(--role-scrim);border:none;cursor:pointer}
.wl-drawer{position:absolute;top:calc(100% + 8px);right:var(--wl-gutter);z-index:20;min-width:248px;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-radius:3px;overflow:hidden;box-shadow:0 18px 40px -12px var(--atelier-card-shadow)}
.wl-dsec{font-family:var(--wl-label);font-weight:500;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:12px 16px 6px}
.wl-drow{display:flex;flex-direction:column;gap:2px;width:100%;min-height:48px;justify-content:center;padding:8px 16px;background:none;border:none;cursor:pointer;text-align:left}
.wl-drow + .wl-drow{border-top:.5px solid var(--atelier-card-border)}
.wl-dlabel{font-family:var(--wl-body);font-weight:400;font-size:14px;color:var(--atelier-ink)}
.wl-drow[aria-current="true"] .wl-dlabel{color:var(--atelier-accent-text)}
.wl-drow.danger .wl-dlabel{color:var(--role-critical)}
.wl-dsub{font-family:var(--wl-label);font-weight:500;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-drow:active{background:var(--atelier-row-hover)}
/* ── R-37.82 ① THE GUTTER LAW ────────────────────────────────────────────────────
   ONE horizontal gutter, owned by the scroll column, equal to the tile grid's own edge.
   Every element inherits it; no component sets its own horizontal margin or width, ever.
   The founder's misalignment existed because the rows chose their own inset — that
   freedom is removed by construction, not by care. C22 asserts no component takes it back.
   ── ③ THE RHYTHM LAW: vertical spacing is the 8-scale. Nothing improvised. */
.wl{--wl-gutter:12px;--wl-step:8px}
.wl-main > *{padding-left:var(--wl-gutter);padding-right:var(--wl-gutter)}
/* ── SHARED CARD CHROME · ONE HOME (founder walk, ZIP 7) ────────────────────────────
   These four classes are used by BOTH the first-run manual and the Rooms link card. They
   used to live inside FirstRun's own style block, which mounts on Today only — so the same
   markup rendered styled on one surface and unstyled on the other. A class used by two
   components and owned by one is a single-home violation wearing CSS. The shell emits them
   now, because the shell is the one thing every surface is inside. C21 holds the line. */
.wl-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:17px;margin:0 0 10px}
.wl-card-lead{border-left:2px solid var(--atelier-accent-text)}
.wl-cardtitle{font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--atelier-accent-text);margin:0 0 9px}
.wl-cardbody{font-family:var(--wl-body);font-weight:400;font-size:14.5px;line-height:1.65;color:var(--atelier-ink-soft);margin:0}
.wl-cardaction{margin-top:14px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 18px;min-height:46px;font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-cardaction:active{background:var(--atelier-row-hover)}
.wl-cardaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}

/* ── TOUCH ──────────────────────────────────────────────────────────────────
   Two defects in the first cut, both found on the founder's device and neither
   visible in a desktop render:

   (a) NO PRESSED STATE ANYWHERE. -webkit-tap-highlight-color was set to transparent
       and nothing replaced it, so a tap produced no feedback at all until the route
       resolved. On a throttled connection that reads as a dead control, and the
       honest response to a dead control is to tap it again. Every control below now
       answers the finger on contact.

   (b) NO touch-action. Without touch-action:manipulation the browser holds every tap for the
       double-tap-zoom gesture before dispatching the click. That delay is the
       difference between a shell that responds and one that has to be convinced. */
.wl{font-family:'DM Sans',system-ui,sans-serif;font-weight:300;touch-action:manipulation;-webkit-tap-highlight-color:rgba(104,201,180,0.16)}
.wl button{touch-action:manipulation}
.wl-hdr{flex-shrink:0;background:var(--atelier-header-bg);padding:17px 22px 14px;display:flex;justify-content:space-between;align-items:center;border-bottom:.5px solid var(--role-metal);z-index:5}
.wl-hstack{display:flex;flex-direction:column;gap:2px;min-width:0}
.wl-house{font-family:var(--wl-feature);font-weight:400;font-size:17px;line-height:1.1;color:var(--atelier-ink)}
.wl-lbl{font-family:var(--wl-label);font-weight:500;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--atelier-ink-mute)}
/* R-37.73 ①: 40×40 was under the floor. 44 is the floor; this is 46 with air. */
.wl-coin{background:transparent;border:1px solid var(--role-metal);border-radius:50%;cursor:pointer;color:var(--role-metal);font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.06em;line-height:1;width:44px;height:44px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center}
.wl-coindrawer{background:var(--atelier-sheet-bg);border-bottom:.5px solid var(--atelier-sheet-border);padding:6px 0}
.wl-coinitem{display:flex;align-items:center;gap:11px;width:100%;min-height:48px;background:none;border:none;cursor:pointer;padding:13px 22px;font-family:var(--wl-body);font-weight:400;font-size:14.5px;color:var(--atelier-ink);text-align:left}
.wl-coinitem[aria-current="true"]{color:var(--atelier-accent-text)}
.wl-glyph{color:var(--role-metal);font-size:11px}
.wl-sub{font-family:var(--wl-label);font-weight:500;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute);margin-left:auto}
.wl-main{flex:1;display:flex;flex-direction:column;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.wl-nav{display:flex;flex-shrink:0;border-top:.5px solid var(--atelier-card-border);background:var(--atelier-header-bg);padding-bottom:env(safe-area-inset-bottom)}
/* R-37.73 ①: no explicit height in ZIP 1 — it happened to clear 44 by padding alone,
   which is a target that survives by accident. Stated now. ②: 9.5 → 12, the interactive floor. */
.wl-seat{flex:1;min-height:52px;background:none;border:none;cursor:pointer;text-align:center;padding:15px 0 17px;font-family:var(--wl-label);font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-seat.on{color:var(--atelier-accent-text)}
.wl-seat:active{background:var(--atelier-row-hover)}
.wl-coin:active,.wl-coinitem:active{background:var(--atelier-row-hover)}
.wl-seat:focus-visible,.wl-coin:focus-visible,.wl-coinitem:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){.wl *{transition:none!important;animation:none!important}}
`;
