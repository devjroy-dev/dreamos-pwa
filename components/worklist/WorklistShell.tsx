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
import { scopeCss } from '@/lib/worklist/theme';
import { AiDock } from '@/components/worklist/AiDock';

const MODE_KEY = 'tdw_worklist_mode';
const SCOPE = '.wl';

export function WorklistShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? '/w';
  const router   = useRouter();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [coinOpen, setCoinOpen] = useState(false);

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

  const onToday = pathname === '/w';
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
      <style>{scopeCss(SCOPE) + SHELL_CSS}</style>

      <header className="wl-hdr">
        <span className="wl-lbl">{title}</span>
        <button type="button" className="wl-coin" aria-label="Settings" aria-expanded={coinOpen}
                onClick={() => setCoinOpen((v) => !v)}>&#9678;</button>
      </header>

      {coinOpen && (
        <div className="wl-coindrawer" role="menu">
          <button type="button" role="menuitem" className="wl-coinitem" onClick={() => pick('dark')}
                  aria-current={mode === 'dark' ? 'true' : undefined}>
            <span className="wl-glyph">&#9679;</span>Dark<span className="wl-sub">{COPY.themeDarkName}</span>
          </button>
          <button type="button" role="menuitem" className="wl-coinitem" onClick={() => pick('light')}
                  aria-current={mode === 'light' ? 'true' : undefined}>
            <span className="wl-glyph">&#9675;</span>Light<span className="wl-sub">{COPY.themeLightName}</span>
          </button>
        </div>
      )}

      <main className="wl-main">{children}</main>

      <AiDock />

      <nav className="wl-nav" aria-label="Sections">
        <button type="button" className={'wl-seat' + (onToday ? ' on' : '')}
                aria-current={onToday ? 'page' : undefined}
                onClick={() => router.push('/w')}>{COPY.navToday}</button>
        <button type="button" className={'wl-seat' + (onRooms ? ' on' : '')}
                aria-current={onRooms ? 'page' : undefined}
                onClick={() => router.push('/w/rooms')}>{COPY.navRooms}</button>
      </nav>
    </div>
  );
}

// Type weights are explicit everywhere. Jost at 300 antialiases toward the ground at these
// sizes and reads several shades lighter than its measured ratio — the founder caught
// exactly this on the Chalk walk-through, and the cure was weight, not ink.
const SHELL_CSS = `
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
.wl-lbl{font-family:'Jost',sans-serif;font-weight:500;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--atelier-label)}
/* R-37.73 ①: 40×40 was under the floor. 44 is the floor; this is 46 with air. */
.wl-coin{background:none;border:none;cursor:pointer;color:var(--role-metal);font-size:17px;line-height:1;padding:8px;min-width:46px;min-height:46px;display:flex;align-items:center;justify-content:center;margin:-8px -8px -8px 0}
.wl-coindrawer{background:var(--atelier-sheet-bg);border-bottom:.5px solid var(--atelier-sheet-border);padding:6px 0}
.wl-coinitem{display:flex;align-items:center;gap:11px;width:100%;min-height:48px;background:none;border:none;cursor:pointer;padding:13px 22px;font-family:'DM Sans',sans-serif;font-weight:400;font-size:14.5px;color:var(--atelier-ink);text-align:left}
.wl-coinitem[aria-current="true"]{color:var(--atelier-accent-text)}
.wl-glyph{color:var(--role-metal);font-size:11px}
.wl-sub{font-family:'Jost',sans-serif;font-weight:500;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute);margin-left:auto}
.wl-main{flex:1;display:flex;flex-direction:column;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.wl-nav{display:flex;flex-shrink:0;border-top:.5px solid var(--atelier-card-border);background:var(--atelier-header-bg);padding-bottom:env(safe-area-inset-bottom)}
/* R-37.73 ①: no explicit height in ZIP 1 — it happened to clear 44 by padding alone,
   which is a target that survives by accident. Stated now. ②: 9.5 → 12, the interactive floor. */
.wl-seat{flex:1;min-height:52px;background:none;border:none;cursor:pointer;text-align:center;padding:15px 0 17px;font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-seat.on{color:var(--atelier-accent-text)}
.wl-seat:active{background:var(--atelier-row-hover)}
.wl-coin:active,.wl-coinitem:active{background:var(--atelier-row-hover)}
.wl-seat:focus-visible,.wl-coin:focus-visible,.wl-coinitem:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){.wl *{transition:none!important;animation:none!important}}
`;
