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
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
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
.wl{font-family:'DM Sans',system-ui,sans-serif;font-weight:300;-webkit-tap-highlight-color:transparent}
.wl-hdr{background:var(--atelier-header-bg);padding:16px 18px 13px;display:flex;justify-content:space-between;align-items:center;border-bottom:.5px solid var(--role-metal);position:sticky;top:0;z-index:5}
.wl-lbl{font-family:'Jost',sans-serif;font-weight:500;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-label)}
.wl-coin{background:none;border:none;cursor:pointer;color:var(--role-metal);font-size:16px;line-height:1;padding:6px;min-width:40px;min-height:40px}
.wl-coindrawer{background:var(--atelier-sheet-bg);border-bottom:.5px solid var(--atelier-sheet-border);padding:6px 0}
.wl-coinitem{display:flex;align-items:center;gap:10px;width:100%;background:none;border:none;cursor:pointer;padding:12px 20px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--atelier-ink);text-align:left}
.wl-coinitem[aria-current="true"]{color:var(--atelier-accent-text)}
.wl-glyph{color:var(--role-metal);font-size:11px}
.wl-sub{font-family:'Jost',sans-serif;font-weight:500;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-ink-mute);margin-left:auto}
.wl-main{flex:1;display:flex;flex-direction:column;min-height:0}
.wl-nav{display:flex;border-top:.5px solid var(--atelier-card-border);background:var(--atelier-header-bg);padding-bottom:env(safe-area-inset-bottom)}
.wl-seat{flex:1;background:none;border:none;cursor:pointer;text-align:center;padding:14px 0 16px;font-family:'Jost',sans-serif;font-weight:500;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-seat.on{color:var(--atelier-accent-text)}
.wl-seat:focus-visible,.wl-coin:focus-visible,.wl-coinitem:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){.wl *{transition:none!important;animation:none!important}}
`;
