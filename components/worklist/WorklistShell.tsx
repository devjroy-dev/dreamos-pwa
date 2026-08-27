"use client";
// components/worklist/WorklistShell.tsx — the shell chrome. ONE HOME for the scope, the
// mode, the drawer, the dock and the nav.
//
// THE SCOPE IS THE THEME. Every token is defined on this element, not on :root, so the old
// shell's own layer is untouched even though both trees live in one deployment.
//
// NO THIRD CONTAINER. R-37.64: no search field, no hamburger, no overflow. Two seats and a
// coin, and the coin is the only drawer.
//
// ── R-38.2 · NAVIGATION IS `<Link>` ─────────────────────────────────────────
// Every navigable control in this file is an anchor from `next/link` with default
// prefetch. It was `<button onClick={router.push}>` at 366a7b5, and that shape is why the
// founder's taps felt dead: a button tells Next nothing, so the route's chunk and its RSC
// payload were both fetched ON TAP. An anchor is announced, so the work happens while the
// thumb is still travelling. `router.push` survives in exactly one place below — the
// post-action redirect after sign-out, which is not navigation the vendor aimed at.
//
// EVERY CONTROL ANSWERS THE FINGER WITHIN A FRAME. `:active` on every one, and
// `touch-action:manipulation` so the browser stops holding taps for the double-tap-zoom
// gesture. Neither is decoration: without them a fast route still reads as a dead control,
// and the honest response to a dead control is to tap it again.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { clearVendorSession } from '@/lib/vendor/session';
import { useVendorInitials } from '@/hooks/vendor/useVendorHandle';
import { waNumberFor } from '@/lib/waNumbers';
import { scopeCss, typeCss } from '@/lib/worklist/theme';
import { AiDock } from '@/components/worklist/AiDock';

const MODE_KEY = 'tdw_worklist_mode';
const SCOPE = '.wl';

/** A drawer row that navigates. Anchor, prefetched, closes the drawer on the way out. */
function DLink({ label, href, onGo }: { label: string; href: string; onGo: () => void }) {
  return (
    <Link href={href} role="menuitem" className="wl-drow" onClick={onGo}>
      <span className="wl-dlabel">{label}</span>
    </Link>
  );
}

/** A drawer row that acts rather than navigates: mode picks, the external house link, sign-out. */
function DAct({ label, onClick, current, danger }: {
  label: string; onClick: () => void; current?: boolean; danger?: boolean;
}) {
  return (
    <button type="button" role="menuitem" className={'wl-drow' + (danger ? ' danger' : '')}
            aria-current={current ? 'true' : undefined} onClick={onClick}>
      <span className="wl-dlabel">{label}</span>
    </button>
  );
}

export function WorklistShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? '/w';
  const router   = useRouter();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [coinOpen, setCoinOpen] = useState(false);
  const initials = useVendorInitials();
  const close = () => setCoinOpen(false);
  // THE ONE SURVIVING router CALL. Sign-out is a post-action redirect, not a tap on a
  // destination, and `replace` is deliberate: the signed-out vendor must not be able to
  // come back to a shell surface with the browser's own back gesture.
  const signOut = () => { close(); clearVendorSession(); router.replace('/'); };

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
    close();
    try { localStorage.setItem(MODE_KEY, next); } catch { /* non-fatal */ }
  }

  const onToday = pathname.startsWith('/w/today');
  const onRooms = !onToday;

  return (
    <div className="wl" data-wl-mode={mode} style={{
      // FIXED VIEWPORT, SCROLLING BODY. The first cut used minHeight and let the whole
      // column grow, so the dock and both nav seats scrolled off the bottom of a long
      // Today and the shell had no visible chrome at rest.
      height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'var(--atelier-page-bg)', color: 'var(--atelier-ink)',
    }}>
      <style>{scopeCss(SCOPE) + typeCss(SCOPE) + SHELL_CSS}</style>

      <header className="wl-hdr" style={{ position: 'relative', zIndex: coinOpen ? 21 : 5 }}>
        {/* R-38.4: the wordmark is t2, DM SANS. It was Cormorant at 17/400 and CE-38's own
            first draft kept it there — struck at relay #1, because Cormorant-at-17 is a
            seventh tuple and the whole warrant of a closed set is that it is closed.
            Cormorant survives at t0 and t1: the numeral and the page title. */}
        <div className="wl-hstack">
          <span className="wl-house">The Dream Wedding</span>
          <span className="wl-lbl">{title}</span>
        </div>
        {/* R-37.79: ONE IDENTITY EVERYWHERE. Initials are derived, never a fixture; a
            vendor with no name yet gets the glyph rather than an empty circle.
            R-38.5/CE-38 relay #2: the coin stays 44 — at the tap floor, with the
            stale "this is 46 with air" comment retired alongside the rule it lied about. */}
        <button type="button" className="wl-coin" aria-label="Your profile" aria-expanded={coinOpen}
                onClick={() => setCoinOpen((v) => !v)}>{initials || '\u25ce'}</button>
        {coinOpen && (
          <>
            <button type="button" className="wl-drawerscrim" aria-label="Close menu" onClick={close} />
            {/* ZIP 14 · F-16.37's cure stands: this block is a CHILD of the <header> it
                anchors to, not its sibling. `.wl-drawer` is position:absolute with
                top:calc(100% + 8px); when the two were siblings that resolved against the
                initial containing block, so 100% meant one whole viewport down. */}
            <div className="wl-drawer" role="menu">
              <div className="wl-dsec">{COPY.drawerAccount}</div>
              {/* R-38.1: both of these are SHELL routes now. Tapping them mounts no second
                  layout, no second masthead and no second session resolve. */}
              <DLink label={COPY.settingsTitle} href="/w/settings" onGo={close} />
              <DLink label={COPY.billingTitle} href="/w/billing" onGo={close} />
              {/* R-38.7: the founder vetoed the horizontal-strip treatment of this row on
                  Rooms. It leaves the Rooms body and this is its ONE home
                  (R-37.69/.83 amended). The number keeps its own single home in
                  lib/waNumbers.ts — no literal enters this file (cell C3). */}
              <DAct label={COPY.roomsAskTitle} onClick={() => {
                close();
                window.open(`https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener');
              }} />
              <DAct label={COPY.drawerHouse} onClick={() => {
                close();
                window.open('https://thedreamwedding.in', '_blank', 'noopener');
              }} />
              <div className="wl-dsec">{COPY.drawerDisplay}</div>
              <DAct label={COPY.themeDarkName}  onClick={() => pick('dark')}  current={mode === 'dark'} />
              <DAct label={COPY.themeLightName} onClick={() => pick('light')} current={mode === 'light'} />
              <div className="wl-dsec">{COPY.drawerActions}</div>
              <DAct label={COPY.drawerSignOut} danger onClick={signOut} />
            </div>
          </>
        )}
      </header>

      <main className="wl-main">{children}</main>

      <AiDock mode={mode} />

      {/* R-37.75: ROOMS IS THE FIRST SEAT. The order here, the manifest's start_url and
          /w's redirect are three statements of one decision — if they ever disagree, the
          app disagrees with itself, so C17 asserts all three together. */}
      <nav className="wl-nav" aria-label="Sections">
        <Link href="/w/rooms" className={'wl-seat' + (onRooms ? ' on' : '')}
              aria-current={onRooms ? 'page' : undefined}>{COPY.navRooms}</Link>
        <Link href="/w/today" className={'wl-seat' + (onToday ? ' on' : '')}
              aria-current={onToday ? 'page' : undefined}>{COPY.navToday}</Link>
      </nav>
    </div>
  );
}

const SHELL_CSS = `
.wl-drawerscrim{position:fixed;inset:0;z-index:19;background:var(--role-scrim);border:none;cursor:pointer}
.wl-drawer{position:absolute;top:calc(100% + var(--wl-step));right:var(--wl-gutter);z-index:20;min-width:248px;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-radius:3px;overflow:hidden;box-shadow:0 18px 40px -12px var(--atelier-card-shadow)}
/* R-38.4: a section eyebrow. One of the TWO places letter-spaced uppercase is permitted,
   and at .08em rather than the retired .2em engraved register. */
.wl-dsec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);padding:12px var(--wl-gutter) 6px}
.wl-drow{display:flex;align-items:center;width:100%;min-height:var(--wl-row);padding:8px var(--wl-gutter);background:none;border:none;cursor:pointer;text-align:left;text-decoration:none}
.wl-drow + .wl-drow{border-top:.5px solid var(--atelier-card-border)}
.wl-dlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-drow[aria-current="true"] .wl-dlabel{color:var(--atelier-accent-text)}
.wl-drow.danger .wl-dlabel{color:var(--role-critical)}
.wl-drow:active{background:var(--atelier-row-hover)}
/* ── R-37.82 ① THE GUTTER LAW, RAISED 12 → 16 (R-38.5) ─────────────────────────
   ONE horizontal gutter, owned by the scroll column. Every element inherits it; no
   component sets its own horizontal margin or width, ever. The founder's misalignment
   existed because the rows chose their own inset — that freedom is removed by
   construction, not by care.
   ── ③ THE RHYTHM LAW: vertical spacing is the 8-scale. Nothing improvised.
   The gutter, step, tile and row values are emitted by typeCss() from lib/worklist/theme
   GRID, so the grid has one home and this stylesheet reads it rather than restating it. */
.wl-main > *{padding-left:var(--wl-gutter);padding-right:var(--wl-gutter)}
/* ── SHARED CARD CHROME · ONE HOME (founder walk, ZIP 7) ────────────────────────────
   Used by the first-run cards, the Today empty state and Billing. A class used by three
   components and owned by one is a single-home violation wearing CSS; the shell emits
   them, because the shell is the one thing every surface is inside. */
.wl-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:16px;margin:0 0 8px}
.wl-card-lead{border-left:2px solid var(--atelier-accent-text)}
.wl-cardtitle{font:var(--wl-t4);color:var(--atelier-accent-text);margin:0 0 8px}
.wl-cardbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0}
.wl-cardaction{margin-top:12px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.wl-cardaction:active{background:var(--atelier-row-hover)}
.wl-cardaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
/* ── TOUCH ──────────────────────────────────────────────────────────────────
   (a) NO PRESSED STATE ANYWHERE was the first cut's defect: tap-highlight was set to
       transparent and nothing replaced it, so a tap produced no feedback until the route
       resolved. Every control below answers the finger on contact.
   (b) NO touch-action. Without manipulation the browser holds every tap for the
       double-tap-zoom gesture before dispatching the click. */
.wl{font:var(--wl-t3);touch-action:manipulation;-webkit-tap-highlight-color:rgba(104,201,180,0.16)}
.wl button,.wl a{touch-action:manipulation}
/* R-38.5 · THE EDGE. The header's horizontal padding IS the gutter, so the wordmark's left
   edge, the first tile's left border, the dock field's left border and Billing's plan card
   all resolve to one x. It was 22px here and 12px everywhere else, which is the
   misalignment the founder kept seeing and no cell could name. */
.wl-hdr{flex-shrink:0;background:var(--atelier-header-bg);padding:16px var(--wl-gutter);display:flex;justify-content:space-between;align-items:center;border-bottom:.5px solid var(--atelier-card-border)}
.wl-hstack{display:flex;flex-direction:column;gap:2px;min-width:0}
.wl-house{font:var(--wl-t2);color:var(--atelier-ink)}
.wl-lbl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-coin{background:transparent;border:1px solid var(--role-metal);border-radius:50%;cursor:pointer;color:var(--role-metal);font:var(--wl-t4);line-height:1;width:44px;height:44px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center}
.wl-main{flex:1;display:flex;flex-direction:column;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
/* R-38.5 · the nav's content box shares the main column's left edge — the container half
   of the edge cell. The seats' TEXT is centred, so the text-edge cell reads the wordmark,
   the grid, the dock and the plan card, and this one reads the boxes. */
.wl-nav{display:flex;flex-shrink:0;border-top:.5px solid var(--atelier-card-border);background:var(--atelier-header-bg);padding-bottom:env(safe-area-inset-bottom)}
.wl-seat{flex:1;min-height:52px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;text-align:center;text-decoration:none;font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-seat.on{color:var(--atelier-accent-text)}
.wl-seat:active{background:var(--atelier-row-hover)}
.wl-coin:active{background:var(--atelier-row-hover)}
.wl-seat:focus-visible,.wl-coin:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){.wl *{transition:none!important;animation:none!important}}
`;
