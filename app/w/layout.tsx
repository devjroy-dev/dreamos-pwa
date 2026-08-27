"use client";
// app/w/layout.tsx — the branch shell's root. PRODUCTION main CARRIES ZERO BYTES OF THIS.
//
// It sits beside /vendor rather than replacing it, because A-4's interim deep-links need the
// old routes alive: every job stays reachable from day one, and nothing is deleted to make
// room for a shell.
//
// THE SESSION GUARD IS THE OLD ONE'S SHAPE, not a second definition. It asks and it obeys.
// No onboarding verdict is computed here; that belongs to app/vendor/layout.tsx's guard,
// which still runs on every deep-linked destination.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

export default function WorklistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading } = useVendorSession();

  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);

  // ZIP 14 · THE FLASH CURE (F-09.166 lineage, ruled 2026-08-27). This div used to carry
  // NO background, so during every session resolution the vendor saw whatever `html, body`
  // paints — and globals.css:897/:906 paints the OLD hub atmosphere with `!important`:
  // a warm bone gradient (#F7F4EF -> #F3EFE8) under `html.theme-light`. Chalk's own ground
  // is #F3F4F4, a COOL neutral. Warm-bone into cool-Chalk is the blink the founder kept
  // catching, and it was intermittent because `html.theme-light` is set by the OLD vendor
  // theme system while this shell keys on `data-wl-mode` — two mechanisms, and only the old
  // one is in force during the gate.
  //
  // WHICH ARM THE DERIVATION PICKED, per the chair's rider: THE DEFAULT-DARK ARM. The mode
  // lives in localStorage under 'tdw_worklist_mode' (WorklistShell.tsx:20) and is read in a
  // useEffect, so it is NOT knowable at this guard's first paint — the guard renders before
  // the shell mounts, by construction. So the ground is pinned to the dark token literal,
  // matching --atelier-page-bg's dark value. A dark blink into Chalk is the benign
  // direction; warm-bone into cool-Chalk was the witnessed offense.
  if (loading || !session) return (
    <div style={{ minHeight: '100dvh', background: '#141516' }} aria-busy="true" />
  );
  return <>{children}</>;
}
