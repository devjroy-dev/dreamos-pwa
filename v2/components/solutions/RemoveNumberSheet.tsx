'use client';
// components/solutions/RemoveNumberSheet.tsx · CE-46 · G6-4 · THE ROOM FINISHED · "Remove this number".
// SignOutSheet's pattern (R-38.22): full cover, scrim tap and Escape dismiss, portalled to the nearest shell scope so the
// shell's tokens and rungs travel with it. Cancel FIRST, the destructive button SECOND and outlined in the critical role,
// never filled: the thumb that opened the sheet is nearest Cancel (F-b, ruled 28 September 2026).
//
// THE CONTROL INVENTORY (protocol §10 part 4):
//   asking    two controls: Cancel -> back, nothing sent; Remove -> POST number/remove, then `removing`
//   removing  NO control. The state is stated (FLOW.removing); scrim and Escape are inert while the door answers.
// No text node is typed here: every word is FLOW's; her number is DATA.
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { typeCss } from '@/v2/lib/worklist/theme';   // LANDING: the v2 twin (the new layout's rungs), main's file otherwise verbatim
import { FLOW, withNumber } from '@/lib/worklist/ownNumberFlow';
import type { OwnNumberWay } from '@/lib/vendor/ownNumberDoor';

export const REMOVE_SCOPE = 'tdw-rmnum';

export function RemoveNumberSheet({ host, number, way, working, onCancel, onConfirm }: {
  host: Element; number: string; way: OwnNumberWay; working: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !working) onCancel(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onCancel, working]);
  const line = withNumber(way === 'moved' ? FLOW.removeMoved : FLOW.removeShared, number);
  return createPortal(
    <div className={REMOVE_SCOPE} role="dialog" aria-modal="true" aria-label={String(FLOW.remove)} data-state={working ? 'removing' : 'asking'} data-way={way}>
      <style>{typeCss('.' + REMOVE_SCOPE) + SHEET_CSS}</style>
      <button type="button" className="rm-scrim" aria-label={String(FLOW.removeCancel)} onClick={() => { if (!working) onCancel(); }} />
      <div className="rm-panel">
        <p className="rm-number">{number}</p>
        {working ? (
          <p className="rm-line" role="status">{FLOW.removing}</p>
        ) : (
          <>
            <p className="rm-line">{line}</p>
            <div className="rm-row">
              <button type="button" className="rm-btn" onClick={onCancel}>{FLOW.removeCancel}</button>
              <button type="button" className="rm-btn danger" onClick={onConfirm}>{FLOW.removeGo}</button>
            </div>
          </>
        )}
      </div>
    </div>,
    host,
  );
}

// ⚠ NO BACKTICKS BELOW THIS LINE (SignOutSheet's rule: the CSS is a template literal).
const SHEET_CSS = `
.tdw-rmnum{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;justify-content:flex-end}
.tdw-rmnum .rm-scrim{position:absolute;inset:0;background:var(--role-scrim);border:none;cursor:pointer}
.tdw-rmnum .rm-panel{position:relative;background:var(--atelier-sheet-bg);border:.5px solid var(--atelier-sheet-border);border-bottom:none;border-radius:12px 12px 0 0;padding:20px 16px calc(16px + env(safe-area-inset-bottom))}
.tdw-rmnum .rm-number{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 8px;font-variant-numeric:tabular-nums}
.tdw-rmnum .rm-line{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0 0 20px;max-width:46ch}
.tdw-rmnum .rm-row{display:flex;gap:8px}
.tdw-rmnum .rm-btn{flex:1;min-height:44px;padding:10px 12px;border-radius:2px;cursor:pointer;background:transparent;border:.5px solid var(--atelier-input-border);color:var(--atelier-accent-text);font:var(--wl-t4);touch-action:manipulation}
.tdw-rmnum .rm-btn.danger{border-color:var(--role-critical);color:var(--role-critical)}
.tdw-rmnum .rm-btn:active{background:var(--atelier-row-hover)}
.tdw-rmnum .rm-btn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.tdw-rmnum *{transition:none!important;animation:none!important}}
`;
