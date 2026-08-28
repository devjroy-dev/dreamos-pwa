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
import { useVendorInitials, forgetVendorMe } from '@/hooks/vendor/useVendorHandle';
import { waNumberFor } from '@/lib/waNumbers';
import { scopeCss, typeCss } from '@/lib/worklist/theme';
import { AiDock } from '@/components/worklist/AiDock';
import { AccountDrawer } from '@/components/worklist/AccountDrawer';

const MODE_KEY = 'tdw_worklist_mode';
const SCOPE = '.wl';

// `DLink` and `DAct` retired here with the markup they built. The shared AccountDrawer owns
// the row shapes now, and two row builders for one row set is exactly the duplication this
// consolidation removed — leaving them behind as unused helpers would have been the
// wl-plink disease in TypeScript.
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
  // ── F-38.20 · THE DRAWER OWNS ITS OWN DISMISSAL ───────────────────────────
  // `close()` used to be the FIRST thing both of these did, which is why the acknowledgement
  // beat did nothing when it was added: the drawer scheduled its exit for 170ms and the
  // handler tore it down in the same frame anyway. Two authorities over one dismissal, and
  // the louder one won.
  // Neither closes now. `AccountDrawer` decides when the menu leaves, because it is the
  // thing that knows a row was pressed and that the press is still being shown.
  // F-38.26: the remembered GET /me is dropped here and only here. The read is memoised
  // for the session and keyed on the access token, so a new sign-in would miss it anyway —
  // but identity is the one place where being stale is unrecoverable rather than untidy,
  // and a structural guarantee plus an explicit one is the right amount of care for it.
  const signOut = () => { forgetVendorMe(); clearVendorSession(); router.replace('/'); };

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
            <div className="wl-drawer">
              {/* ONE DEFINITION, TWO MOUNTS. See components/worklist/AccountDrawer.tsx —
                  the carried rooms mount the same component through Header.tsx, so the
                  founder meets one menu behind one medallion everywhere in the estate. */}
              <AccountDrawer mode={mode} onPickMode={pick} onSignOut={signOut} onClose={close} />
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

// ⚠ NO BACKTICKS BELOW THIS LINE, EVER. Everything after it is inside a JS template
// literal, so a backtick — including one written around a CSS selector in a comment while
// explaining that selector — ENDS THE LITERAL and fails the compile. This sitting paid for
// that four separate times, in four files, always in a comment ABOUT a syntax written
// INSIDE that syntax. ZIP 14 ⑧ named the family; naming it did not stop it. The rule is
// mechanical now: selectors in these comments are written in words, not in code marks.
const SHELL_CSS = `
.wl-drawerscrim{position:fixed;inset:0;z-index:19;background:var(--role-scrim);border:none;cursor:pointer}
.wl-drawer{position:absolute;top:calc(100% + var(--wl-step));right:var(--wl-gutter);z-index:20}
/* R-37.82 the gutter law, raised 12 to 16 (R-38.5). ONE horizontal gutter, owned by the
   scroll column. Every element inherits it; no component sets its own horizontal margin or
   width, ever. The founder's misalignment existed because rows chose their own inset, and
   that freedom is removed by construction rather than by care.
   The rhythm law: vertical spacing is the 8-scale, nothing improvised. Gutter, step, tile
   and row are emitted by typeCss from the theme GRID, so the grid has one home and this
   stylesheet reads it rather than restating it.

   THIS RULE WAS DESTROYED ONCE AND THE ARM CAUGHT IT. Consolidating the drawer, I deleted
   the old row rules with a regex instead of reading them; it ate the declaration bodies and
   left the selectors, which then swallowed this rule into a malformed one. C-R2 reported
   the gutter rendering at 0 of 390 and C-R7a reported the tile and plan-card edges at 0.
   An automated edit to a stylesheet is a blind edit, and the block below is hand-written. */
.wl-main > *{padding-left:var(--wl-gutter);padding-right:var(--wl-gutter)}
/* SHARED CARD CHROME, ONE HOME. Used by the first-run cards, the Today empty state and
   Billing. A class used by three components and owned by one is a single-home violation
   wearing CSS; the shell emits them, because the shell is what every surface is inside. */
.wl-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:16px;margin:0 0 8px}
.wl-card-lead{border-left:2px solid var(--atelier-accent-text)}
.wl-cardtitle{font:var(--wl-t4);color:var(--atelier-accent-text);margin:0 0 8px}
.wl-cardbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0}
.wl-cardaction{margin-top:12px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.wl-cardaction:active{background:var(--atelier-row-hover)}
.wl-cardaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
/* TOUCH. Two defects in the first cut, both found on the founder's device and neither
   visible in a desktop render: no pressed state anywhere, and no touch-action, so the
   browser held every tap for the double-tap-zoom gesture before dispatching the click. */
.wl{font:var(--wl-t3);touch-action:manipulation;-webkit-tap-highlight-color:rgba(104,201,180,0.16)}
.wl button,.wl a{touch-action:manipulation}
/* R-38.5 the edge. The header's horizontal padding IS the gutter, so the wordmark's left
   edge, the first tile's border, the dock field's border and Billing's plan card all
   resolve to one x. It was 22px here and 12px everywhere else, which is the misalignment
   the founder kept seeing and no cell could name. */
.wl-hdr{flex-shrink:0;background:var(--atelier-header-bg);padding:16px var(--wl-gutter);display:flex;justify-content:space-between;align-items:center;border-bottom:.5px solid var(--atelier-card-border)}
.wl-hstack{display:flex;flex-direction:column;gap:2px;min-width:0}
.wl-house{font:var(--wl-t2);color:var(--atelier-ink)}
.wl-lbl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-coin{background:transparent;border:1px solid var(--role-metal);border-radius:50%;cursor:pointer;color:var(--role-metal);font:var(--wl-t4);line-height:1;width:44px;height:44px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center}
.wl-main{flex:1;display:flex;flex-direction:column;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
/* R-38.5: the nav's content box shares the main column's left edge, which is the container
   half of the edge cell. The seats' TEXT is centred, so the text-edge cell reads the
   wordmark, the grid, the dock and the plan card, and this one reads the boxes. */
.wl-nav{display:flex;flex-shrink:0;border-top:.5px solid var(--atelier-card-border);background:var(--atelier-header-bg);padding-bottom:env(safe-area-inset-bottom)}
.wl-seat{flex:1;min-height:52px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;text-align:center;text-decoration:none;font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-seat.on{color:var(--atelier-accent-text)}
.wl-seat:active{background:var(--atelier-row-hover)}
.wl-coin:active{background:var(--atelier-row-hover)}
.wl-seat:focus-visible,.wl-coin:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
@media (prefers-reduced-motion:reduce){.wl *{transition:none!important;animation:none!important}}
`;

