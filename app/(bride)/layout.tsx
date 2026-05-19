'use client';

// app/(bride)/layout.tsx
// Route-group layout for Frost bride PWA.
// URLs unchanged: /couple/today, /couple/muse, etc.
// Login (app/(auth)/couple/pin-login) redirects to /couple/today — works unchanged.
//
// MODE CONTEXT:
//   PLAN     — today/plan/circle tabs
//   DISCOVER — muse/feed/messages tabs
//
// SESSION KEYS READ (written by couple/pin-login):
//   couple_session / couple_web_session — JSON with id/coupleId/name/pin_set
//   access_token — JWT Bearer

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BrideTopBar from '../../components/frost-bride/TopBar';
import BrideBottomNav from '../../components/frost-bride/BottomNav';
import { COLORS } from '../../components/frost-bride/tokens';

export type BrideMode = 'PLAN' | 'DISCOVER';

const BrideModeContext = createContext<{
  mode: BrideMode;
  setMode: (m: BrideMode) => void;
}>({ mode: 'PLAN', setMode: () => {} });

export const useBrideMode = () => useContext(BrideModeContext);

function pathToMode(pathname: string): BrideMode {
  if (
    pathname.startsWith('/couple/muse') ||
    pathname.startsWith('/couple/discover') ||
    pathname.startsWith('/couple/messages')
  ) return 'DISCOVER';
  return 'PLAN';
}

export default function FrostBrideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/couple/today';

  const [mode, setMode] = useState<BrideMode>(() => {
    if (typeof window === 'undefined') return 'PLAN';
    try {
      const saved = localStorage.getItem('couple_app_mode');
      return saved === 'DISCOVER' ? 'DISCOVER' : 'PLAN';
    } catch { return 'PLAN'; }
  });

  useEffect(() => {
    const next = pathToMode(pathname);
    setMode(next);
    try {
      localStorage.setItem('couple_app_mode', next);
      // Skip auth routes from last_path persistence
      const skip = ['/couple/pin', '/couple/pin-login', '/couple/onboarding'];
      if (!skip.some(p => pathname.startsWith(p))) {
        localStorage.setItem('couple_last_path', pathname);
      }
    } catch {}
  }, [pathname]);

  // Discover feed is fully immersive — no shell (matches legacy layout behaviour)
  const isFeedImmersive =
    pathname === '/couple/discover/feed' ||
    pathname?.startsWith('/couple/discover/feed?');

  if (isFeedImmersive) {
    return (
      <BrideModeContext.Provider value={{ mode, setMode }}>
        {children}
      </BrideModeContext.Provider>
    );
  }

  return (
    <BrideModeContext.Provider value={{ mode, setMode }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        background: COLORS.bg,
        minHeight: '100svh',
      }}>
        <BrideTopBar />
        <main style={{
          paddingTop: 56,
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
          minHeight: '100svh',
        }}>
          {children}
        </main>
        <BrideBottomNav />
      </div>
    </BrideModeContext.Provider>
  );
}
