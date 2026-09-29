'use client';
// components/worklist/ReportIssueSheet.tsx — THE REPORT DOOR. P7.2 Arm C (CE-39, 2026-09-04).
//
// WHAT THIS IS. The estate ships as beta and the masthead says so; this is the door that beta
// implies. A vendor who hits something wrong opens the drawer, taps one row, and sends what
// broke — with the room and the build already filled in, because those are the two facts a
// vendor cannot be expected to know and the two the reader needs first.
//
// WHERE IT LANDS, AND WHY THERE (F-P71.2, founder-ruled on his own scale). It composes the
// note and hands it to WhatsApp on the support lane. NOT a table and an admin page: no
// feedback table exists in either schema, three test accounts do not justify one, and the
// drawer already owns a WhatsApp door the founder answers. The table version is F-39.74, filed
// for when real vendors exist. Zero DDL, zero endpoint, zero new surface to maintain.
//
// THE TWO PREFILLS ARE READ, NEVER RETYPED. The room is the shell's own masthead title, passed
// in by the caller that already has it; the build is the `[data-tdw-commit]` stamp the shell
// layout renders per request (WorklistShell's note names it as the estate's build id). A
// vendor's bug report that names the wrong build is worse than one that names none, so both
// are lifted from the live document rather than remembered.
//
// THE VERB IS HONEST. `Send on WhatsApp` opens WhatsApp with the text prefilled; WhatsApp's own
// send is the send. The sheet says so in its own note (S17 was struck by the founder as
// belt-and-braces on a verb that already tells the truth).
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { COPY } from '@/lib/worklist/copy';
import { typeCss } from '@/lib/worklist/theme';
import { supportWaNumber } from '@/lib/waNumbers';

export const REPORT_SCOPE = 'tdw-report';

/** The build the document is actually running, or null when the stamp is absent (a bench, a
 *  test renderer). Null is rendered as an em dash rather than a guess. */
function liveBuild(): string | null {
  if (typeof document === 'undefined') return null;
  const el = document.querySelector('[data-tdw-commit]');
  return el?.getAttribute('data-tdw-commit') || null;
}

export function useReportIssue(room: string) {
  const [open, setOpen] = useState(false);
  // F-P72.F (founder walk, 2026-09-04): this hook first asked for its OWN `anchorRef`, the way
  // `useSignOut` does. The drawer has ONE root and one ref slot, `useSignOut` already holds it,
  // and the caller took only { ask, sheet } — so `host` stayed null, the sheet's
  // `open && host` render never fired, and the row pressed and did nothing. A second ref slot
  // would be a second answer to "which element are we anchored to"; the host is DERIVED at open
  // time instead, from the same question the ref was asking. Nothing to wire, nothing to forget.
  const ask = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const sheet = open ? <ReportIssueSheet room={room} onClose={close} /> : null;
  return { ask, sheet, open };
}

/** The tree's mode host, or the body when there is none (the (legacy) pages have no
 *  `[data-wl-mode]`). Read at open time so the sheet inherits Graphite or Chalk from the
 *  document it is opened in. */
function modeHost(): Element {
  return document.querySelector('[data-wl-mode]') ?? document.body;
}

function ReportIssueSheet({ room, onClose }: { room: string; onClose: () => void }) {
  const [text, setText] = useState('');
  const build = liveBuild();

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  function send() {
    // ONE COMPOSITION, ONE HOME. The prefix carries the two facts the reader needs before the
    // prose; the build rides so a reply thread is greppable against a commit. The vendor's own
    // words follow, untouched.
    const head = COPY.reportPrefix + ' \u00b7 ' + room + ' \u00b7 ' + (build ?? '\u2014');
    const body = head + '\n' + text.trim();
    window.open(
      'https://wa.me/' + supportWaNumber() + '?text=' + encodeURIComponent(body),
      '_blank', 'noopener',
    );
    onClose();
  }

  return createPortal(
    <div className={REPORT_SCOPE} role="dialog" aria-modal="true" aria-label={COPY.reportTitle}>
      <style>{typeCss('.' + REPORT_SCOPE) + SHEET_CSS}</style>
      <button type="button" className="tdw-rpscrim" aria-label={COPY.drawerCancel} onClick={onClose} />
      <div className="tdw-rppanel">
        <div className="tdw-rpgrip" />
        <p className="tdw-rptitle">{COPY.reportTitle}</p>
        <div className="tdw-rppre">
          <div className="tdw-rprow">
            <span className="tdw-rpk">{COPY.reportRoomKey}</span>
            <span className="tdw-rpv">{room}</span>
          </div>
          <div className="tdw-rprow">
            <span className="tdw-rpk">{COPY.reportBuildKey}</span>
            <span className="tdw-rpv tdw-rpmono">{build ?? '\u2014'}</span>
          </div>
        </div>
        <label className="tdw-rpfield">
          <span className="tdw-rpfl">{COPY.reportFieldLabel}</span>
          <textarea className="tdw-rpin" value={text} rows={4}
                    placeholder={COPY.reportPlaceholder}
                    onChange={(e) => setText(e.target.value)} />
        </label>
        <button type="button" className="wl-btn pri tdw-rpsend" onClick={send}>{COPY.reportSend}</button>
        <button type="button" className="tdw-rpcancel" onClick={onClose}>{COPY.drawerCancel}</button>
      </div>
    </div>,
    modeHost(),
  );
}

// NO BACKTICKS BELOW THIS LINE (the shell's own law, s-P72.5): everything after it is inside a
// template literal, and a backtick written around a selector in a comment ends the string.
const SHEET_CSS = `
.tdw-report{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;justify-content:flex-end}
.tdw-report .tdw-rpscrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
.tdw-report .tdw-rppanel{position:relative;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;padding:14px var(--wl-gutter, 22px) calc(28px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:14px}
.tdw-report .tdw-rpgrip{width:36px;height:4px;border-radius:2px;background:var(--atelier-card-border);margin:0 auto 2px}
.tdw-report .tdw-rptitle{font:var(--wl-t1);color:var(--atelier-ink);margin:0}
.tdw-report .tdw-rppre{border-top:.5px solid var(--atelier-card-border);padding-top:14px}
.tdw-report .tdw-rprow{display:flex;justify-content:space-between;align-items:baseline;min-height:36px;gap:16px}
.tdw-report .tdw-rpk{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.tdw-report .tdw-rpv{font:var(--wl-t3);color:var(--atelier-ink);text-align:right;min-width:0;overflow:hidden;text-overflow:ellipsis}
.tdw-report .tdw-rpmono{font-variant-numeric:lining-nums tabular-nums;color:var(--atelier-accent-text)}
.tdw-report .tdw-rpfield{display:flex;flex-direction:column;gap:6px}
.tdw-report .tdw-rpfl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-label)}
.tdw-report .tdw-rpin{min-height:120px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:3px;padding:12px;font:var(--wl-t3);color:var(--atelier-ink);outline:none;box-sizing:border-box;resize:none;-webkit-appearance:none;appearance:none}
.tdw-report .tdw-rpin::placeholder{color:var(--atelier-ink-fade)}
.tdw-report .tdw-rpin:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.tdw-report .tdw-rpsend{min-height:48px}
.tdw-report .tdw-rpcancel{min-height:44px;display:flex;align-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;font:var(--wl-t4);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.tdw-report .tdw-rpcancel:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.tdw-report *{transition:none!important;animation:none!important}}
`;
