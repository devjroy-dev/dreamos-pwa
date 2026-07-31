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
// THE EIGHT-DOT CAP IS DELIBERATE AND PRE-EXISTING. `Math.min(total, 8)` was already here
// before the display cap was retired, so a vendor at the portfolio's twenty-photo ceiling
// renders eight dots rather than twenty. That is the right behaviour — twenty dots on a
// phone is a smear, not an indicator — and it is named here rather than left to be
// rediscovered, because the executor raised "a vendor at the ceiling will render 20 dots"
// as an open affordance question during MICRO-2 and the answer, derived from this file, is
// that he will not. The question is closed by the code that always handled it.
//
// A CONSEQUENCE, STATED HONESTLY: past the eighth photo the highlighted dot sits on the
// eighth and stops moving, so the indicator under-reports position deep in a long
// carousel. That is a real limitation, it predates this sitting, and it is the founder's
// deck walk that decides whether it matters at nine-plus photos. Not silently inherited.

import React from 'react';

export default function ImageDots({ total, current }: { total: number; current: number }) {
  if (total <= 1) return null;
  return (
    <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top,0px) + 20px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 24, pointerEvents: 'none' }}>
      {Array.from({ length: Math.min(total, 8) }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 16 : 5, height: 5, borderRadius: 3, background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)', transition: 'all 240ms cubic-bezier(0.22,1,0.36,1)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      ))}
    </div>
  );
}
