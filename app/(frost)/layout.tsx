'use client';
// app/(frost)/layout.tsx
// Frost has NO tab bar, NO top chrome. The landing IS the home.
// Mode context provides E1A/E3 and dream/sanctuary to all canvases.

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiGet, getAccessToken, isBrideDemoMode } from '../../lib/frost-api/_base';
import {
  HomeModeKey, ContentMode, ModeDescriptor, MuseLook, MODES,
  museLookFromHomeMode, getFrostMode, getContentMode,
  setFrostMode, setContentMode as persistContentMode,
} from '../../lib/frost/tokens';
import { FrostCtx, type FrostModeCtx } from '../../lib/frost/FrostCtx';
import { ServiceWorkerRegistrar } from '@/components/vendor/ServiceWorkerRegistrar';

// ── THE CONTEXT MOVED OUT (R-36.11) ─────────────────────────────────────────
// `FrostModeCtx`, `FrostCtx` and `useFrostMode` lived HERE and are now in
// lib/frost/FrostCtx.tsx, with the F-09.160 reasoning that travels with the
// default value. Next 16 refuses any export from a `layout.tsx` outside its
// permitted set, and this file now exports exactly one thing: its default.
//
// The move was forced by a coupling, not by the age of the export — see that
// file's header for the bisect that killed my first explanation.
// MODULE EXTRACTION ONLY: zero copy, zero behaviour delta.

// F-05.39 (R2): a third byte-identical copy of isBrideDemoMode stood here with
// ZERO callers in this file. Deleted, not re-pointed — the one home is
// lib/frost-api/_base.ts. Any surface in this tree that needs the demo
// authority imports it from there.



// ── ARC OB · charter OB-P · THE MANDATORY REDIRECT, BRIDE TWIN (F-1) ────────
// The vendor lane's guard, same shape, same reasons. It lives in the LAYOUT and
// the guard inside sanctuary/page.tsx (:4242-4245) is deleted in this same diff
// — MOVED, not duplicated.
//
// WHAT THE OLD ONE GOT WRONG, identically to its vendor twin: it read
// `onboarding_state !== 'complete'`, a FLOW POSITION and not a fact (R-OB.8).
// The bride endpoint stamped that marker unconditionally until CE-32's micro —
// `const updates = { onboarding_state: 'complete' }` was the first key of the
// object — so every bride onboarded before the cure carries a marker that says
// complete over a row with no name and no budget. Those are exactly the rows
// backfill-on-login is owed to, and the old guard waved every one of them
// through. It now reads the server-computed predicate verdict.
//
// It also sat inside a 4,300-line page, so it only ran on Sanctuary. The layout
// mounts on every frost canvas.
//
// DEMO IS EXEMPT: isBrideDemoMode is the estate's one authority on that
// question (F-05.39) and a demo bride has no couple row to be judged against.
//
// FAILS OPEN. An absent verdict is a server that did not answer, not a bride who
// is incomplete — only an explicit false redirects.
function useBrideOnboardingGuard() {
  const pathname = usePathname() ?? '/frost';
  const router   = useRouter();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // The form is exempt from its own guard, or the redirect is a loop.
    if (pathname.startsWith('/frost/canvas/onboarding')) return;
    if (isBrideDemoMode()) return;
    if (!getAccessToken()) return;

    let live = true;
    apiGet<{ ok: boolean; couple?: { onboarding?: { complete: boolean } } }>('/api/v2/couple/me')
      .then((d) => {
        if (!live) return;
        if (d.couple?.onboarding?.complete === false) router.replace('/frost/canvas/onboarding');
      })
      .catch(() => { /* non-fatal — fail open, see above */ });
    return () => { live = false; };
  }, [pathname, router]);
}

export default function FrostLayout({ children }: { children: React.ReactNode }) {
  useBrideOnboardingGuard();
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
      {/* F-19.36: the SW registrar mounts PER AUTHENTICATED SHELL. It used to sit
          in the root layout registering an origin-wide scope, so one visit to the
          public landing claimed /v/ and /r/ for that browser. */}
      <ServiceWorkerRegistrar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italianno&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@300;400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      `}</style>
      {children}
    </FrostCtx.Provider>
  );
}
