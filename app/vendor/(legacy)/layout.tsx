'use client';
// app/vendor/(legacy)/layout.tsx — P7.2 (CE-39, 2026-09-04), FORK 1 arm (a).
//
// WHAT THIS IS. The flip (arm (a), R-39.24) deleted `app/vendor/layout.tsx` — the old
// `WeddingLayout` with its Splash, BottomNav, onboarding guard, `/vendor?draft=` ask door
// and lane-key write path (F-38.3 CLOSED for this lane). Eight pages survive the
// delete because the shell has no twin for them and the product still promises the door:
// the four auth screens (pin, pin-login, pin-reset, onboarding) and the four Discover pages
// (hub, submit, preview, profile — F-39.77 ports them into the shell in Block 09). They sit
// in this route group so the URL is unchanged and the shell's layout does not wrap them.
//
// WHAT THIS PROVIDES, AND NOTHING ELSE. `ThemeProvider`, because the eight and `Header`
// read `useT()`; FORK 3 ported the SHELL's readers to CSS vars, and these pages were not in
// the port's radius (Block 09's). The service worker registrar, one home per tree.
//
// NOT here, by derivation: an `AskProvider` — no page in this group and no component they
// import calls `useAsk()` (grep at 659df90: zero callers), so a provider would be a door
// onto a route that does not exist. NOT here, by ruling: Splash, BottomNav, the onboarding
// guard (`WorklistBoot` owns it in the shell), `useThemeInit`/`applyLightVars`.
//
// F-P72.A (walk finding, 2026-09-04): Chalk did not reach these pages. The provider below
// initialises from the OLD lane's storage key, and nothing writes that key any
// more: the shell never did (R-38, modeBridge 1.2/1.6) and the old Settings toggle was
// deleted with the tree. The only door into these pages is now the shell, so the shell's
// mode is the truth. This layout READS it (`readModeClient()`, cookie-backed) and sets the
// one signal the provider already follows, `html.theme-light` (its MutationObserver flips
// tokens and the CSS vars). One reader, no writer of the lane key: modeBridge stays green.
import { useEffect } from 'react';
import { ThemeProvider } from '@/lib/vendor/ThemeContext';
import { ServiceWorkerRegistrar } from '@/components/vendor/ServiceWorkerRegistrar';
import { readModeClient } from '@/lib/worklist/mode';

function useShellModeOnLegacy(): void {
  useEffect(() => {
    const html = document.documentElement;
    const had = html.classList.contains('theme-light');
    html.classList.toggle('theme-light', readModeClient() === 'light');
    return () => { html.classList.toggle('theme-light', had); };
  }, []);
}

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  useShellModeOnLegacy();
  return (
    <ThemeProvider>
      <ServiceWorkerRegistrar />
      {children}
    </ThemeProvider>
  );
}
