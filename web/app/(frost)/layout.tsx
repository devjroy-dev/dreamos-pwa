'use client';
// app/(frost)/layout.tsx
// Frost has NO tab bar, NO top chrome. The landing IS the home.
// Mode context provides E1A/E3 and dream/sanctuary to all canvases.

import React, { createContext, useContext, useState } from 'react';
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

const FrostCtx = createContext<FrostModeCtx>({
  homeMode:       'E3',
  contentMode:    'dream',
  mode:           MODES['E3'],
  look:           'E3',
  setHomeMode:    () => {},
  setContentMode: () => {},
});

export const useFrostMode = () => useContext(FrostCtx);

// Demo mode detection
function isBrideDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const s = localStorage.getItem('tdw_bride_demo_session');
    return !!s && JSON.parse(s).demo === true;
  } catch { return false; }
}



// Read persisted mode synchronously before first render to prevent flicker.
// getFrostMode() reads localStorage — safe only in client context.
// During SSR (server render) we default to 'E1A' (dark) which is the
// more common state and avoids a light→dark flash on load.
function getInitialHomeMode(): HomeModeKey {
  if (typeof window === 'undefined') return 'E1A';
  try { return getFrostMode(); } catch { return 'E1A'; }
}
function getInitialContentMode(): ContentMode {
  if (typeof window === 'undefined') return 'dream';
  try { return getContentMode(); } catch { return 'dream'; }
}

export default function FrostLayout({ children }: { children: React.ReactNode }) {
  const [homeMode,    setHome]    = useState<HomeModeKey>(getInitialHomeMode);
  const [contentMode, setContent] = useState<ContentMode>(getInitialContentMode);

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
