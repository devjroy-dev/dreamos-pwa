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
import { fetchVictorMode, setVictorMode } from '@/lib/vendor/api/vendor';

export function AiDock({ mode }: { mode: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);
  const vendorId = getVendorSession()?.id || '';

  // ── R-38.9 · THE DOCK IS THE BUSINESS DOOR ────────────────────────────────
  // The Advisor ROOM sets `victor_mode` to advisor on entry; this returns it to business
  // when the vendor asks from anywhere else. Without it a vendor who visited Advisor once
  // would find her business assistant answering as an advisor days later, with nothing on
  // screen to explain why — a mode with a door in and no door back.
  //
  // READ BEFORE WRITE, AND ONLY WRITE ON A DIFFERENCE. `VictorModeResponse.thread_reset`
  // (vendor.ts:27) is real: an unconditional PATCH would wipe the thread every single time
  // the ask bar was tapped, which is most taps in the app.
  //
  // IT DOES NOT BLOCK THE SHEET. The chat opens immediately and the mode settles behind
  // it. A vendor waiting on a mode round trip to see her own conversation is the reactive
  // cadence, and the failure arm is silence rather than a toast: she asked to chat, not to
  // switch modes.
  async function ensureBusiness() {
    try {
      const cur = await fetchVictorMode();
      if (cur.victor_mode !== 'business') await setVictorMode('business');
    } catch { /* non-fatal — the ask still works; the room is the only place that claims */ }
  }

  return (
    <>
      <div className="wl-dock">
        <button type="button" className="wl-dockfield" aria-label={COPY.dockAria}
                onClick={() => { setOpen(true); void ensureBusiness(); }}>
          <span className="wl-dockph">{COPY.dockPlaceholder}</span>
          <span className="wl-docksend" aria-hidden>&#8593;</span>
        </button>
      </div>
      {open && vendorId && <AskSheet vendorId={vendorId} mode={mode} onClose={() => setOpen(false)} />}
      <style>{DOCK_CSS}</style>
    </>
  );
}

// ── R-38.4 · THE SEND GLYPH, AND THE RENDER ARM'S WHOLE WARRANT ────────────
// The .wl-docksend rule below used to set a bare font-size of 14 and NOTHING ELSE, so the
// glyph fell through to the user agent default and painted at 14px / weight 400 / ARIAL —
// a seventh tuple, in live chrome, on four surfaces, in both modes.
//
// NO SWEEP WOULD HAVE FOUND IT. This file names no font family at all, so a grep for stray
// families returns nothing and a source reader sees a rule that looks deliberate. Only
// asking the browser what it actually painted finds it, which is the argument for C-R6
// existing and for the ruling that the tuple set is asserted rather than described.
//
// (The explanation lives here, in a JS comment, and not in the CSS below. Written inside
// the template literal it would ship to the vendor's browser — and the backticks it wants
// would close the literal outright, which is the third time this sitting that writing
// ABOUT a syntax inside that syntax has cost a compile. ZIP 14 ⑧ named the family; the
// type floor has caught every instance.)
const DOCK_CSS = `
/* R-38.5 · THE EDGE. The dock's horizontal padding IS the gutter, so the field's left
   border shares one x with the wordmark above it and the first tile between them. It was
   12px against a 22px header, which is exactly the kind of near-miss that reads as
   sloppiness without ever being nameable by eye. */
.wl-dock{flex-shrink:0;padding:8px var(--wl-gutter);background:var(--atelier-header-bg);border-top:.5px solid var(--atelier-card-border)}
.wl-dockfield{display:flex;align-items:center;gap:8px;width:100%;min-height:44px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);border-radius:999px;padding:10px 8px 10px 16px;cursor:pointer;text-align:left;touch-action:manipulation}
.wl-dockph{flex:1;font:var(--wl-t3);color:var(--atelier-ink-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl-docksend{width:28px;height:28px;flex-shrink:0;border-radius:50%;background:var(--atelier-accent-text);color:var(--role-ink-deep);display:flex;align-items:center;justify-content:center;font:var(--wl-t4)}
.wl-dockfield:active{background:var(--atelier-row-hover)}
.wl-dockfield:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
