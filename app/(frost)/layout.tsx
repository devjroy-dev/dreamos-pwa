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

const FrostCtx = createContext<FrostModeCtx>({
  homeMode:       'E3',
  contentMode:    'dream',
  mode:           MODES['E3'],
  look:           'E3',
  setHomeMode:    () => {},
  setContentMode: () => {},
});

export const useFrostMode = () => useContext(FrostCtx);

export default function FrostLayout({ children }: { children: React.ReactNode }) {
  const [homeMode,    setHome]    = useState<HomeModeKey>('E3');
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      `}</style>
      {children}
    </FrostCtx.Provider>
  );
}
