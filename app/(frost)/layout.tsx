'use client';
// app/(frost)/layout.tsx
// Mode context provides E1A/E3 and dream/sanctuary to all canvases.
//
// ── TDW_09 · PACKAGE 4 — THE BAR IS SEATED HERE ───────────────────────────────
// The header sentence 「 Frost has NO tab bar 」 was true from birth and is true
// no longer: F-09.136 recorded that the bride lane had no nav to amend, and the
// five ruled doors (S5 §2-REDELIVERY, founder word 「 5 doors 」) land here — ONE
// seat, so no canvas re-mounts chrome and no canvas can forget to.
//
// SEATED, NOT UNIVERSAL: BrideBar returns null on any route that is not a door
// or beneath one, so onboarding, dream and surprise stay bare — a bar on an
// onboarding flow is chrome competing with the one thing she is there to do.
// The spacer below is rendered under the same predicate as the bar itself, from
// the bar's own exported height, so the reservation can never drift from the
// thing it reserves.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import BrideBar, { barIsSeatedOn, BRIDE_BAR_HEIGHT } from '../../components/frost/BrideBar';
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

// F-05.39 (R2): a third byte-identical copy of isBrideDemoMode stood here with
// ZERO callers in this file. Deleted, not re-pointed — the one home is
// lib/frost-api/_base.ts. Any surface in this tree that needs the demo
// authority imports it from there.



export default function FrostLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const barSeated = barIsSeatedOn(pathname);
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
        @import url('https://fonts.googleapis.com/css2?family=Italianno&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      `}</style>
      {children}
      {barSeated && (
        <div
          aria-hidden
          style={{ height: `calc(${BRIDE_BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))` }}
        />
      )}
      <BrideBar homeMode={homeMode} />
    </FrostCtx.Provider>
  );
}
