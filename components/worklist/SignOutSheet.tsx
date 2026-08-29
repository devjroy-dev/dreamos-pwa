"use client";
// components/worklist/SignOutSheet.tsx — SIGN OUT. ONE VERB, ONE SHEET, EVERY DOOR.
//
// ── CE-39 S2/6 §3 · ONE HOME, BOTH DOORS ─────────────────────────────────────
// Two controls end a session: the Settings button and the drawer's Actions row. The
// drawer is one tap from every room; a confirm on Settings alone would have left the MORE
// reachable door unconfirmed (D-38.1 clause 3), and a confirm inside the drawer (CE-38
// seal ①) could not be the confirm Settings mounts. So the confirm is this sheet, and both
// doors mount it. The bench asserts every sign-out door in the shell does (bypass one → red).
//
// ── F-38.p14 CURED HERE · THE TWO VERBS WERE ALREADY DIVERGING ───────────────
// Settings ran `clearVendorSession(); router.replace('/')`. The shell ran
// `forgetVendorMe(); clearVendorSession(); router.replace('/')`. The difference is F-38.26's
// line — the memoised GET /me is keyed on the token and a new sign-in would miss it anyway,
// but identity is the one place where stale is unrecoverable rather than untidy. One door
// had the care and the other did not, which is how two homes for one verb always end.
// `signOutVendor` below is the one function; every door calls it and none carries a copy.
//
// ── R-38.22 · FULL-COVER, SCRIM-TAP DISMISSES ────────────────────────────────
// `position:fixed; inset:0` with a live catcher, the estate's ruled sheet behaviour. Escape
// dismisses too — a sheet with no way out is a trap (AskSheet's own note). The two buttons
// are the founder's vetoed bytes, read from COPY; nothing here inlines a vendor-facing
// string. The destructive button is SECOND and outlined in the critical role, never filled:
// the thumb that opened the sheet is nearest Cancel.
//
// ── WHY IT PORTALS, AND WHERE TO ─────────────────────────────────────────────
// The drawer renders this on both trees (「ONE DEFINITION, TWO MOUNTS」, AccountDrawer.tsx),
// and on the /vendor tree its container carries a `transform` (Header.tsx, the menu's
// entrance) — which makes it the containing block for any fixed descendant, so a sheet
// rendered in place would be a 260px box in the corner of the header. It portals out.
// NOT to document.body unconditionally: the shell's tokens live on `.wl[data-wl-mode]`,
// not on :root, and a body-mounted sheet inside the shell would paint the OLD layer's
// colours in the wrong mode. The host is the nearest `[data-wl-mode]` scope when there is
// one — the shell root, whose tokens and rungs it then inherits — and document.body
// otherwise, where the /vendor tree's :root tokens and `html.theme-light` apply. The type
// rungs are emitted onto the sheet's own class for the same reason AccountDrawer emits
// them: outside `.wl` no rung variable exists.
//
// ── THE CONFIRM IS OBSERVED AFTER THE PRESS, NOT ASSUMED (D-38.1 corollary) ──
// The render cell presses a door, waits 60ms and looks for the sheet. A sheet that is
// described in a handover and never seen on the founder's device is presence, not
// behaviour.
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { typeCss } from '@/lib/worklist/theme';
import { clearVendorSession } from '@/lib/vendor/session';
import { forgetVendorMe } from '@/hooks/vendor/useVendorHandle';

export const SIGNOUT_SCOPE = 'tdw-signout';

type Router = { replace: (href: string) => void };

/**
 * THE ONE SIGN-OUT VERB. Drop the remembered /me, clear the session, leave with `replace`
 * so the browser's back gesture cannot return a signed-out vendor to a shell surface.
 */
export function signOutVendor(router: Router) {
  forgetVendorMe();
  clearVendorSession();
  router.replace('/');
}

// ── THE HOST IS HANDED IN, NEVER READ FROM A REF DURING RENDER ──────────────
// The first cut read `anchorRef.current` in the render body and the lint rule caught it —
// a ref read during render is a value React never promised to have committed, and on the
// first render it is null, which would have mounted the estate's one destructive confirm
// on `document.body` INSIDE the shell, painting the old tree's tokens in whichever mode
// :root happened to hold. The second cut resolved it in an effect and traded one lint rule
// for another (setState in an effect body). The shape that is right rather than merely
// quiet is a CALLBACK REF at the door: React hands the element to `useSignOut` at commit,
// the host is derived there once, and this component receives a resolved element.
export function SignOutSheet({ host, onCancel }: { host: Element; onCancel: () => void }) {
  const router = useRouter();
  const confirm = useCallback(() => signOutVendor(router), [router]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel]);
  return createPortal(
    <div className={SIGNOUT_SCOPE} role="dialog" aria-modal="true" aria-label={COPY.signOutSheetLine}>
      <style>{typeCss('.' + SIGNOUT_SCOPE) + SHEET_CSS}</style>
      <button type="button" className="tdw-soscrim" aria-label={COPY.drawerCancel} onClick={onCancel} />
      <div className="tdw-sopanel">
        <p className="tdw-soline">{COPY.signOutSheetLine}</p>
        <div className="tdw-sorow">
          <button type="button" className="tdw-sobtn" onClick={onCancel}>{COPY.drawerCancel}</button>
          <button type="button" className="tdw-sobtn danger" onClick={confirm}>{COPY.drawerSignOut}</button>
        </div>
      </div>
    </div>,
    host,
  );
}

/**
 * A door's whole contract in one hook: `ask()` from the control, `sheet` rendered beside
 * it. The door never sees the verb — it cannot sign out without the sheet, which is the
 * property the bench asserts.
 */
export function useSignOut() {
  const [asking, setAsking] = useState(false);
  // A CALLBACK REF, not an object ref: React calls it at commit with the door's root
  // element, which is the only moment the host is both known and safe to read. The door
  // spreads it as `ref={anchorRef}` on whatever element it already has — no wrapper.
  const [host, setHost] = useState<Element | null>(null);
  const anchorRef = useCallback((el: HTMLDivElement | null) => {
    // The nearest shell scope if there is one — its tokens and its rungs travel to the
    // sheet — else the body, where the /vendor tree's :root tokens and its theme-light
    // class apply. See the file header for why the sheet cannot render where it stands.
    setHost(el ? (el.closest('[data-wl-mode]') ?? document.body) : null);
  }, []);
  const ask = useCallback(() => setAsking(true), []);
  const cancel = useCallback(() => setAsking(false), []);
  const sheet = asking && host ? <SignOutSheet host={host} onCancel={cancel} /> : null;
  return { ask, sheet, anchorRef, asking };
}

// ⚠ NO BACKTICKS BELOW THIS LINE, EVER. Everything after it is inside a JS template
// literal; a backtick in a comment ends the literal and fails the compile (ZIP 14 ⑧'s
// family). Selectors in these comments are written in words, not in code marks.
const SHEET_CSS = `
.tdw-signout{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;justify-content:flex-end}
.tdw-signout .tdw-soscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
.tdw-signout .tdw-sopanel{position:relative;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;padding:20px 16px calc(16px + env(safe-area-inset-bottom))}
.tdw-signout .tdw-soline{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 16px}
.tdw-signout .tdw-sorow{display:flex;gap:8px}
.tdw-signout .tdw-sobtn{flex:1;min-height:44px;padding:10px 12px;border-radius:2px;cursor:pointer;background:transparent;border:.5px solid var(--atelier-input-border);color:var(--atelier-accent-text);font:var(--wl-t4);touch-action:manipulation}
.tdw-signout .tdw-sobtn.danger{border-color:var(--role-critical);color:var(--role-critical)}
.tdw-signout .tdw-sobtn:active{background:var(--atelier-row-hover)}
.tdw-signout .tdw-sobtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.tdw-signout *{transition:none!important;animation:none!important}}
`;
