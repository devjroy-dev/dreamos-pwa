"use client";
// lib/worklist/ModeContext.tsx — the mode's ONE runtime authority.
//
// ── F-38.41 · WHY A PROVIDER AND NOT A BETTER useState ─────────────────────
//
// The mode used to live in `WorklistShell`, and every `/w` route mounts its own shell —
// so the mode was per-mount by construction. Any cure that leaves it there is a cure that
// re-reads the mode on every navigation and hopes the read is early enough. That is a
// re-timing, and this estate has learned twice now what a re-timing buys: the race still
// exists, it just gets harder to see.
//
// THIS PROVIDER SITS IN THE LAYOUT, WHICH DOES NOT REMOUNT ON NAVIGATION. So the mode
// SURVIVES a route change rather than being restored after one. There is no default to
// paint, no effect to wait for, and no frame in which the shell disagrees with itself.
// Rooms → Leads → Rooms cannot lose the mode because nothing in that walk unmounts the
// thing that holds it.
//
// THE SEED COMES FROM THE SERVER. `initial` is the cookie the server layout read off the
// request, so the very first paint of a cold load is already the vendor's mode. The lazy
// initialiser re-reads on the client only as a belt for the case where the two disagree —
// a cookie written in another tab since this document was served.
import { createContext, useContext, useState } from 'react';
import { readModeClient, writeMode, type WlMode } from '@/lib/worklist/mode';

type Ctx = { mode: WlMode; setMode: (m: WlMode) => void };

// No default worth having. A component reading this outside the provider is a bug, and a
// silently-plausible `'dark'` is how that bug ships — the failure shape F-38.50 was
// chartered over, and it does not get to be reintroduced by this file.
const ModeCtx = createContext<Ctx | null>(null);

export function ModeProvider({ initial, children }: { initial: WlMode; children: React.ReactNode }) {
  // Lazy, so it runs during render rather than after paint. On a cold load `initial` is
  // already right and this agrees with it; on a cross-tab change it corrects before the
  // first frame instead of flashing and then settling.
  const [mode, setModeState] = useState<WlMode>(() =>
    (typeof document === 'undefined' ? initial : readModeClient()));

  // ONE WRITER. The drawer's toggle calls this; the cookie and the state move together,
  // in one place, so there is no path by which the painted mode and the stored mode can
  // disagree.
  const setMode = (m: WlMode) => { setModeState(m); writeMode(m); };

  return <ModeCtx.Provider value={{ mode, setMode }}>{children}</ModeCtx.Provider>;
}

export function useMode(): Ctx {
  const c = useContext(ModeCtx);
  if (!c) throw new Error('useMode outside ModeProvider — the /w layout provides it');
  return c;
}
