'use client';
// components/frost/CanvasShell.tsx
// Wraps every Frost canvas. Provides: frosted page background + back button + scrollable content area.
// Ported from tdw-2/components/frost/FrostCanvasShell.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../app/(frost)/layout';
import { FROST_SURFACE, FF, EASE } from '../../lib/frost/tokens';

export default function CanvasShell({
  children,
  eyebrow,
  backTo = '/frost',
  scrollable = true,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  backTo?: string;
  scrollable?: boolean;
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
      </div>

      {/* Content */}
      <div style={{
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
