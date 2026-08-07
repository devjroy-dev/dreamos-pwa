'use client';
// components/frost/CanvasShell.tsx
// Wraps every Frost canvas. Provides: frosted page background + back button + scrollable content area.
// Ported from tdw-2/components/frost/FrostCanvasShell.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../app/(frost)/layout';
import { FROST_SURFACE, FF, EASE } from '../../lib/frost/tokens';
import { BRIDE_BAR_CLEARANCE } from './BrideBar';

export default function CanvasShell({
  children,
  eyebrow,
  backTo = '/frost',
  scrollable = true,
  topRight,
}: {
  children:    React.ReactNode;
  eyebrow?:    string;
  backTo?:     string;
  scrollable?: boolean;
  topRight?:   React.ReactNode;
}) {
  const router = useRouter();
  const { mode } = useFrostMode();

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: mode.pagePaper,
      display: 'flex', flexDirection: 'column',
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      // ── F-09.145's CURE · THE DERIVED PATIENT ────────────────────────────
      // The founder's shot convicted SANCTUARY; this shell is the same disease
      // derived, not witnessed — it is `position:fixed` too, so the layout's
      // in-flow spacer never reserved anything for it either, and its content
      // ran under the bar exactly the same way.
      //
      // PADDING, NOT A SHORTER BOX, and the reason is the bar's own material:
      // BrideBar is a GLASS band (`glassBandBg` + `backdropFilter`). If the
      // shell stopped at the bar's top edge the blur would sample the document
      // behind the app instead of this surface, and the band would go pale on
      // Wine Night. The painted box stays full-bleed; only the CONTENT box
      // shrinks, so the scroller below ends where the bar begins.
      //
      // UNCONDITIONAL, and that is derived not assumed: every consumer of this
      // shell at this tip sits under a door route (muse, and journey/** —
      // events, moments, reminders, people, circle, circle/[memberId]), so
      // `barIsSeatedOn` is true on all of them. A consumer seated OFF the doors
      // would want this conditional; there is none, and adding the hook for a
      // caller that does not exist is the speculation this estate files against.
      paddingBottom: BRIDE_BAR_CLEARANCE,
    }}>
      {/* Frosted top bar */}
      <div style={{
        ...FROST_SURFACE.button,
        paddingTop: 'calc(env(safe-area-inset-top,0px) + 12px)',
        paddingBottom: 12,
        paddingLeft: 16, paddingRight: 16,
        display: 'flex', alignItems: 'center', gap: 12,
        flexShrink: 0,
        borderBottom: `0.5px solid ${mode.hairline}`,
      }}>
        <button
          onClick={() => router.push(backTo)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: FF.label, fontSize: 9, fontWeight: 300,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: mode.brassMuted, padding: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {eyebrow || 'Back'}
        </button>
        {topRight && <div style={{ marginLeft: 'auto' }}>{topRight}</div>}
      </div>

      {/* Content */}
      <div className="frost-scroll" style={{
        flex: 1,
        overflowY: scrollable ? 'auto' : 'hidden',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 24px)',
      }}>
        {children}
      </div>
    </div>
  );
}
