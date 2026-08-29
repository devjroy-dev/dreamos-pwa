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
// thumb is still travelling. No `router` call survives in this file: the one post-action
// redirect — after sign-out, which is not navigation the vendor aimed at — fires from the
// confirm sheet (`signOutVendor`, SignOutSheet.tsx).
//
// EVERY CONTROL ANSWERS THE FINGER WITHIN A FRAME. `:active` on every one, and
// `touch-action:manipulation` so the browser stops holding taps for the double-tap-zoom
// gesture. Neither is decoration: without them a fast route still reads as a dead control,
// and the honest response to a dead control is to tap it again.
import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { useVendorInitials } from '@/hooks/vendor/useVendorHandle';
import { scopeCss, typeCss } from '@/lib/worklist/theme';
import { useMode } from '@/lib/worklist/ModeContext';
import { AskProvider, type AskApi } from '@/lib/worklist/askContext';
import { AiDock } from '@/components/worklist/AiDock';
import { AccountDrawer } from '@/components/worklist/AccountDrawer';

const SCOPE = '.wl';

// `DLink` and `DAct` retired here with the markup they built. The shared AccountDrawer owns
// the row shapes now, and two row builders for one row set is exactly the duplication this
// consolidation removed — leaving them behind as unused helpers would have been the
// wl-plink disease in TypeScript.
export function WorklistShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? '/w';
  // ── F-38.41 · THE MODE IS READ, NOT HELD ──────────────────────────────────
  // It used to be `useState('dark')` here with a localStorage read in an effect, and that
  // is why the founder's walk lost Chalk: every /w route mounts its own shell, so the
  // mode reset to the default on every navigation and arrived one effect later. It now
  // comes from the layout's provider, which does not remount when the route changes — the
  // mode survives the walk by construction rather than by being restored after it.
  const { mode, setMode } = useMode();
  const [coinOpen, setCoinOpen] = useState(false);
  const initials = useVendorInitials();
  const close = () => setCoinOpen(false);
  // ── F-38.20 · THE DRAWER OWNS ITS OWN DISMISSAL ───────────────────────────
  // `close()` used to be the FIRST thing the row handlers did, which is why the
  // acknowledgement beat did nothing when it was added: the drawer scheduled its exit for
  // 170ms and the handler tore it down in the same frame anyway. Two authorities over one
  // dismissal, and the louder one won. `AccountDrawer` decides when the menu leaves.
  // ── CE-39 S2/6 §3 · SIGN-OUT LEFT THIS FILE ENTIRELY ──────────────────────
  // `signOut` stood here: forgetVendorMe (F-38.26), clearVendorSession, router.replace.
  // Settings carried a copy of two of the three and the two had already drifted
  // (F-38.p14). The verb now has ONE home, `signOutVendor` in
  // components/worklist/SignOutSheet.tsx, and ONE caller — the confirm sheet — which the
  // drawer opens itself. So this shell no longer holds a router at all: every navigation
  // in it is an anchor, and the one post-action redirect fires from the sheet.

  // ── CE-39 S2/6 · ARM (a) · THE SHELL'S ASK DOOR ───────────────────────────
  // This is the shell's implementation of lib/worklist/askContext.tsx: openAsk opens the
  // sheet IN PLACE with the prefill, and the masthead never leaves. The dock consumes it and
  // the four hub primers (F-38.47) call it from inside room bodies. The state lives here
  // and not in the dock because the shell is what every surface is inside; it lives here
  // and not in a module because a writer outside React's tree is F-38.3's class.
  const [askOpen, setAskOpen] = useState(false);
  const [askPrefill, setAskPrefill] = useState('');
  const openAsk = useCallback((text = '') => { setAskPrefill(text); setAskOpen(true); }, []);
  const closeAsk = useCallback(() => { setAskOpen(false); setAskPrefill(''); }, []);
  const ask = useMemo<AskApi>(() => ({ open: askOpen, prefill: askPrefill, openAsk, closeAsk }),
                              [askOpen, askPrefill, openAsk, closeAsk]);

  // THE READ-BACK EFFECT IS GONE WITH THE STATE IT CORRECTED. Persistence is
  // `lib/worklist/mode.ts` — one home, cookie-first so the server can paint it, with the
  // old localStorage key still written for one release so today's vendors are not reset
  // to Graphite by this deploy. `pick` is now just the toggle's name for `setMode`; the
  // provider owns the write.
  const pick = setMode;

  const onToday = pathname.startsWith('/w/today');
  const onRooms = !onToday;

  return (
    <AskProvider value={ask}>
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
              <AccountDrawer mode={mode} onPickMode={pick} onClose={close} />
            </div>
          </>
        )}
      </header>

      <main className="wl-main">{children}</main>

      <AiDock mode={mode} />

      {/* R-37.75: ROOMS IS THE FIRST SEAT. The order here, the manifest's start_url and
          /w's redirect are three statements of one decision — if they ever disagree, the
          app disagrees with itself, so C17 asserts all three together. */}
      {/* F-38.37 · THE BUILD STAMP. Hidden, inert, and the same shape RoomsGrid already uses
          for its room count — a fact the instruments need that the vendor must not see.
          It exists so `wl_audit` can name the commit it just measured rather than leaving
          the operator to infer it from which bytes came back. */}
      <div hidden data-tdw-commit={process.env.NEXT_PUBLIC_TDW_COMMIT || 'local'} />

      <nav className="wl-nav" aria-label="Sections">
        <Link href="/w/rooms" className={'wl-seat' + (onRooms ? ' on' : '')}
              aria-current={onRooms ? 'page' : undefined}>{COPY.navRooms}</Link>
        <Link href="/w/today" className={'wl-seat' + (onToday ? ' on' : '')}
              aria-current={onToday ? 'page' : undefined}>{COPY.navToday}</Link>
      </nav>
    </div>
    </AskProvider>
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
/* ── H-1(b) · F-38.40b · THE LEAD CARD'S INTERIOR REJOINS THE OTHERS ────────
   The accent border was added to the box without compensating the padding, so this
   card's contents painted at gutter + 2 + 16 = 34 while every other card's painted at
   gutter + .5 + 16 = 32.5. Three card titles, three x values, where the whole point of
   a card set is one. 1.5px is small and it is exactly the kind of thing an eye reads as
   「something is off」 without being able to name it. */
.wl-card-lead{border-left:2px solid var(--atelier-accent-text);padding-left:14.5px}
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

