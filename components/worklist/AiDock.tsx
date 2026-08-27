"use client";
// components/worklist/AiDock.tsx — R-37.83.
//
// THE COSTUME IS RETIRED UNTIL THE CHAT CAN ANSWER IT. ZIP 7 shipped this as a text field
// because an input is the universal costume of "you can talk to me" — and that was right
// about the shape and wrong about the promise: tapping it opened WhatsApp. A field that
// teleports lies with its shape, and it lies on every deploy it survives.
//
// So until the in-app chat lands, the dock wears the panel's row idiom instead: a glyph, a
// title that NAMES ITS DESTINATION, a chevron. A row that says where it goes is honest at any
// size. When ChatThread rises here, the field costume comes back and it will be telling the
// truth — the vendor will type where the shape promised.
//
// The WhatsApp deep-link keeps exactly ONE home: the Rooms panel's own top row. This dock does
// not duplicate it, because two doors to one destination is two places to drift.
import { useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { AskSheet } from '@/components/worklist/AskSheet';
import { getVendorSession } from '@/lib/vendor/session';

export function AiDock({ mode }: { mode: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);
  const vendorId = getVendorSession()?.id || '';
  return (
    <>
      <div className="wl-dock">
        <button type="button" className="wl-dockfield" aria-label={COPY.dockAria} onClick={() => setOpen(true)}>
          <span className="wl-dockph">{COPY.dockPlaceholder}</span>
          <span className="wl-docksend" aria-hidden>&#8593;</span>
        </button>
      </div>
      {open && vendorId && <AskSheet vendorId={vendorId} mode={mode} onClose={() => setOpen(false)} />}
      <style>{DOCK_CSS}</style>
    </>
  );
}

const DOCK_CSS = `
.wl-dock{flex-shrink:0;padding:9px 12px;background:var(--atelier-header-bg);border-top:.5px solid var(--atelier-card-border)}
.wl-dockfield{display:flex;align-items:center;gap:9px;width:100%;min-height:46px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:999px;padding:11px 8px 11px 16px;cursor:pointer;text-align:left;touch-action:manipulation}
.wl-dockph{flex:1;font-family:var(--wl-body);font-weight:400;font-size:13.5px;color:var(--atelier-ink-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl-docksend{width:30px;height:30px;flex-shrink:0;border-radius:50%;background:var(--atelier-accent-text);color:var(--role-ink-deep);display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1}
.wl-dockfield:active{background:var(--atelier-row-hover)}
.wl-dockfield:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
