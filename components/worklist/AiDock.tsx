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
import { useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';

export function AiDock() {
  const router = useRouter();
  return (
    <>
      <button type="button" className="wl-dock" aria-label={COPY.dockAria}
              onClick={() => router.push('/w/rooms')}>
        <span className="wl-dockglyph" aria-hidden>&#9670;</span>
        <span className="wl-docktext">{COPY.dockRowTitle}</span>
        <span className="wl-dockchev" aria-hidden>&rsaquo;</span>
      </button>
      <style>{DOCK_CSS}</style>
    </>
  );
}

const DOCK_CSS = `
.wl-dock{flex-shrink:0;display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:0 18px;background:var(--atelier-header-bg);border:none;border-top:.5px solid var(--atelier-card-border);cursor:pointer;text-align:left;touch-action:manipulation}
.wl-dockglyph{color:var(--role-metal);font-size:12px;line-height:1;flex-shrink:0}
.wl-docktext{flex:1;font-family:var(--wl-body);font-weight:500;font-size:13px;color:var(--atelier-ink-soft)}
.wl-dockchev{color:var(--atelier-ink-dim);font-size:10px;line-height:1;flex-shrink:0}
.wl-dock:active{background:var(--atelier-row-hover)}
.wl-dock:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
`;
