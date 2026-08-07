'use client';
// app/(frost)/layout.tsx
// Frost has NO tab bar, NO top chrome. The landing IS the home.
// Mode context provides E1A/E3 and dream/sanctuary to all canvases.

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  HomeModeKey, ContentMode, ModeDescriptor, MuseLook, MODES,
  museLookFromHomeMode, getFrostMode, getContentMode,
  setFrostMode, setContentMode as persistContentMode,
} from '../../lib/frost/tokens';

export interface FrostModeCtx {
  homeMode:       HomeModeKey;
  contentMode:    ContentMode;
  mode:           ModeDescriptor;
  look:           MuseLook;
  setHomeMode:    (m: HomeModeKey) => void;
  setContentMode: (c: ContentMode) => void;
}

// ── F-09.160 · THE FIFTH SEAT OF THE SINGLE-THEME RULING (TDW_09 atelier) ──────
// The Wine-only ruling pinned four seats, all in lib/frost/tokens.ts: getV2Tokens,
// museLookFromHomeMode, getFrostMode, setFrostMode. THIS default was the fifth and
// it was left reading 'E3' — the LIGHT theme. It is inert while the provider wraps
// every consumer, which it does today. It is also byte-for-byte the shape of the
// defect the ruling's second seat cured: a light literal sitting upstream of a
// pinned reader, waiting for the one render that does not reach the provider.
// Pinned to Wine, deliberately NOT deleted — the context still needs a default, and
// a default that disagrees with the ruling is a trap with a fuse in it.
const FrostCtx = createContext<FrostModeCtx>({
  homeMode:       'E1A',
  contentMode:    'dream',
  mode:           MODES['E1A'],
  look:           'E1',
  setHomeMode:    () => {},
  setContentMode: () => {},
});

export const useFrostMode = () => useContext(FrostCtx);

// F-05.39 (R2): a third byte-identical copy of isBrideDemoMode stood here with
// ZERO callers in this file. Deleted, not re-pointed — the one home is
// lib/frost-api/_base.ts. Any surface in this tree that needs the demo
// authority imports it from there.



export default function FrostLayout({ children }: { children: React.ReactNode }) {
  // SINGLE-THEME RULING (2026-08-07, the chair's own hand, second seat): the
  // initial state seeds from the PINNED reader — getFrostMode() is now
  // window-free and returns 'E1A' unconditionally, so this is SSR-safe and the
  // server HTML itself renders Wine. The old literal 'E3' painted one light
  // frame before the mount effect corrected it — the flash the founder saw.
  const [homeMode,    setHome]    = useState<HomeModeKey>(getFrostMode());
  const [contentMode, setContent] = useState<ContentMode>('dream');

  useEffect(() => {
    setHome(getFrostMode());
    setContent(getContentMode());
  }, []);

  const ctx: FrostModeCtx = {
    homeMode,
    contentMode,
    mode: MODES[homeMode],
    look: museLookFromHomeMode(homeMode),
    setHomeMode:    (m) => { setHome(m);    setFrostMode(m); },
    setContentMode: (c) => { setContent(c); persistContentMode(c); },
  };

  return (
    <FrostCtx.Provider value={ctx}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italianno&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      `}</style>
      {children}
    </FrostCtx.Provider>
  );
}
