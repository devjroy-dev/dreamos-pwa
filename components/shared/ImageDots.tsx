'use client';

// components/shared/ImageDots.tsx
//
// TDW_07 P4b-FINAL · F1b — THE CAROUSEL'S POSITION INDICATOR, ONE HOME.
//
// Moved verbatim from the discover canvas (page.tsx:397–:406 at the charter tip) so the
// vendor's preview shows the same dots, in the same place, with the same easing, as the
// couple's card. It travelled with the pager because a carousel and its position indicator
// are one mechanic: a preview that paged without dots would not be showing the vendor what
// couples see, it would be showing him a different control.
//
// ── LABELED AMENDMENT · TDW_07 P6 (founder-ruled; the fold under F-D) ────────────────
// The paragraph below stood here from P4b-FINAL and is PRESERVED rather than rewritten,
// because it recorded a real derivation and a real answer. It is amended, not replaced:
//
//   ┌─ THE ORIGINAL, AS IT STOOD ────────────────────────────────────────────────────┐
//   │ "THE EIGHT-DOT CAP IS DELIBERATE AND PRE-EXISTING. `Math.min(total, 8)` was     │
//   │  already here before the display cap was retired, so a vendor at the portfolio's│
//   │  twenty-photo ceiling renders eight dots rather than twenty… The question is    │
//   │  closed by the code that always handled it."                                    │
//   └────────────────────────────────────────────────────────────────────────────────┘
//
// WHAT THE AMENDMENT CORRECTS. That paragraph answered "will a vendor at the ceiling
// render twenty dots?" for THIS component and called the 20-dot question closed. It was
// closed here and open one surface over: sanctuary's Discover room carried its OWN
// indicator (`DiscImageDots`, :1329) capped at SEVEN, bottom-placed, accent-coloured — and
// sanctuary is the only Discover surface a couple can reach. Two components, two caps, two
// positions, and the "closed" answer described the unreachable one. That is F-07.68's
// shape in miniature and it is named here so the lesson survives the fold: an in-file
// answer is only as wide as the file's audience.
//
// WHAT P6 CHANGES, ALL FOUNDER-RULED:
//   · the cap is 8 (sanctuary's 7 raised, this file's 8 kept) — ONE number now
//   · the placement is sanctuary's: BOTTOM, and `position:absolute` rather than `fixed`
//   · the colour is the ROOM ACCENT, passed in — see the accent contract below
//   · the dots are HAIRLINE per spec P6 ("in-card horizontal photo paging with hairline
//     dots") — 2px rather than 5px, the active dot a longer thin bar
//   · `DiscImageDots` is DELETED; this file is the estate's only position indicator
//
// THE CAP'S CONSEQUENCE IS UNCHANGED AND STILL HONEST: past the eighth photo the
// highlighted bar sits on the eighth and stops moving, so the indicator under-reports
// position deep in a long carousel. ALL photos remain swipeable — the cap governs the
// INDICATOR, never the carousel (the display-cap overturn, shapeVendor.js, is untouched).
// It is the founder's deck walk that decides whether the under-report matters at nine-plus.
//
// ── `position: absolute`, DERIVED NOT ASSUMED ────────────────────────────────────────
// Both mounts provide a positioned ancestor: sanctuary's Discover room root is
// `position:relative` and /vendor/discover/preview's root is `position:fixed; inset:0`.
// `absolute` therefore resolves against the intended box at both. `fixed` would escape
// sanctuary's CanvasShell and pin the dots to the viewport instead of the room.
//
// ── THE ACCENT CONTRACT ──────────────────────────────────────────────────────────────
// Sanctuary's accent is a ROOM value — `dark ? '#C4856A' : '#2A5F82'` (sanctuary:4030),
// terracotta under Wine Night and slate blue under Sky Ivory. It has never been gold, and
// spec §3's "one gold per screen (Enquire owns detail; cards carry none)" is why it must
// not become gold: these dots sit on the card.
//
// The vendor's preview has NO room mode to read an accent from, so it passes nothing and
// takes `DEFAULT_DOT_ACCENT`. This is a deliberate, named imperfection in parity: the
// couple's dots are one of two colours depending on a setting the preview does not have,
// so the preview shows the neutral of the pair rather than guessing which of her two
// worlds to imitate. Parity of MECHANICS is exact; parity of hue is impossible here, and
// saying so beats picking one at random.

import React from 'react';

/** The preview's dot colour — see THE ACCENT CONTRACT above. Not a fallback for laziness:
 *  it is the honest answer for a mount that has no room accent to read. */
export const DEFAULT_DOT_ACCENT = 'rgba(248,247,245,0.95)';

/** The indicator's ceiling. Governs the DOTS, never the carousel. */
export const MAX_DOTS = 8;

export default function ImageDots({
  total, current, accent = DEFAULT_DOT_ACCENT,
}: { total: number; current: number; accent?: string }) {
  if (total <= 1) return null;
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(env(safe-area-inset-bottom,0px) + 92px)',
      left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 5, zIndex: 24, pointerEvents: 'none',
    }}>
      {Array.from({ length: Math.min(total, MAX_DOTS) }).map((_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6,
          height: 2,
          borderRadius: 1,
          background: i === current ? accent : 'rgba(255,255,255,0.30)',
          transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)',
          boxShadow: i === current ? `0 0 6px ${accent}66` : 'none',
        }} />
      ))}
    </div>
  );
}
