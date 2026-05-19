'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

// app/(vendor)/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Route-group layout for Frost vendor PWA.
//
// Route groups (the parens in the folder name) let us own /vendor/today,
// /vendor/leads, etc. without changing URLs. Login redirects to /vendor/today
// keep working unchanged because URL = path-minus-group.
//
// MODE CONTEXT:
//   Three modes drive the bottom nav and the shell:
//     BUSINESS  — today/clients/money/studio tabs
//     DISCOVERY — dash/leads/images/collab tabs
//     DREAMAI   — full-page chat, no bottom nav
//   Mode persists in localStorage (vendor_app_mode). On every pathname change,
//   mode syncs from path so navigation is the source of truth, not state.
//
// SESSION KEYS REUSED (login already writes these):
//   - access_token, refresh_token
//   - vendor_session, vendor_web_session (mirrors)
//   We don't touch them on entry — that would be redundant with login. We
//   only read from them via lib/frost-api/_base helpers.
// ─────────────────────────────────────────────────────────────────────────────

import { usePathname } from 'next/navigation';
import TopBar from '../../components/frost-vendor/TopBar';
import BottomNav from '../../components/frost-vendor/BottomNav';
import { COLORS } from '../../components/frost-vendor/tokens';

export type VendorMode = 'BUSINESS' | 'DISCOVERY' | 'DREAMAI';

const ModeContext = createContext<{
  mode: VendorMode;
  setMode: (m: VendorMode) => void;
}>({ mode: 'BUSINESS', setMode: () => {} });

export const useVendorMode = () => useContext(ModeContext);

function pathToMode(pathname: string): VendorMode {
  if (pathname.startsWith('/vendor/dreamai'))   return 'DREAMAI';
  if (pathname.startsWith('/vendor/discovery')) return 'DISCOVERY';
  return 'BUSINESS';
}

export default function FrostVendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || '/vendor/today';

  const [mode, setMode] = useState<VendorMode>(() => {
    if (typeof window === 'undefined') return 'BUSINESS';
    try {
      const saved = localStorage.getItem('vendor_app_mode');
      if (saved === 'BUSINESS' || saved === 'DISCOVERY' || saved === 'DREAMAI') {
        return saved as VendorMode;
      }
    } catch {}
    return 'BUSINESS';
  });

  // Sync mode from path on every navigation. Pathname is the source of truth;
  // state and localStorage chase it. This prevents stale mode after refresh
  // or back/forward.
  useEffect(() => {
    const next = pathToMode(pathname);
    setMode(next);
    try {
      localStorage.setItem('vendor_app_mode', next);
      localStorage.setItem('vendor_last_path', pathname);
    } catch {}
  }, [pathname]);

  const isDreamAi = mode === 'DREAMAI';

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      <div style={{
        backgroundColor: COLORS.bg,
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
      }}>
        <TopBar />
        <main style={{
          paddingTop: 56,
          paddingBottom: isDreamAi ? 0 : 'calc(80px + env(safe-area-inset-bottom))',
          overflowX: 'hidden',
          minHeight: isDreamAi ? 'calc(100dvh - 56px)' : 'auto',
        }}>
          {children}
        </main>
        <BottomNav />
      </div>
    </ModeContext.Provider>
  );
}
