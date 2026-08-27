"use client";
// components/worklist/AiDock.tsx — R-37.76 ①: the dock is an INPUT, not a logo row.
//
// WHY THE SHAPE AND NOT A BETTER LABEL. 「DREAMAI」 in a bar is a noun, and a noun in a bar
// reads as a trademark — the founder’s exact complaint. A rounded field with muted
// placeholder text is the universal costume of "you can talk to me"; no label ever taught
// that as fast. The placeholder carries ONE REAL ASK rather than a generic prompt, because
// an example teaches the grammar of the thing in the same glance.
//
// R-37.78, THE NAMING GRAMMAR: this affordance says 「Ask TDW」 — the verb. The Rooms row
// says 「TDW on WhatsApp」 — the founder’s byte. 「DreamAi」 stays the name, used in prose
// about who answers. Affordances invite; sentences attribute.
//
// THE DESTINATION IS HONEST TODAY. WhatsApp is where the assistant actually lives, so the tap
// opens the vendor line through waNumberFor(‘vendor’) — never an inline literal (F-09.190).
// When Phase 5 lands the in-app composer this one handler retargets and nothing else moves:
// the shape, the placeholder and the grammar are already right.
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor } from '@/lib/waNumbers';

export function AiDock() {
  const open = () => window.open(
    `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener');
  return (
    <>
      <div className="wl-dock">
        <button type="button" className="wl-dockfield" aria-label={COPY.dockAria} onClick={open}>
          <span className="wl-dockph">{COPY.dockPlaceholder}</span>
          <span className="wl-docksend" aria-hidden>&#8593;</span>
        </button>
      </div>
      <style>{DOCK_CSS}</style>
    </>
  );
}

const DOCK_CSS = `
.wl-dock{flex-shrink:0;padding:9px 12px;background:var(--atelier-header-bg);border-top:.5px solid var(--atelier-card-border)}
.wl-dockfield{display:flex;align-items:center;gap:9px;width:100%;min-height:46px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:999px;padding:11px 8px 11px 16px;cursor:pointer;text-align:left}
.wl-dockph{flex:1;font-family:var(--wl-body);font-weight:400;font-size:13.5px;color:var(--atelier-ink-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl-docksend{width:30px;height:30px;flex-shrink:0;border-radius:50%;background:var(--atelier-accent-text);color:var(--role-ink-deep);display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1}
.wl-dockfield:active{background:var(--atelier-row-hover)}
.wl-dockfield:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
