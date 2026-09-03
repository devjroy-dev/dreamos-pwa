"use client";
// app/w/WorklistBoot.tsx — THE SHELL'S ONE CLIENT ROOT.
//
// ── R-38.1 AMENDED BY LABEL (CE-38 S3) · THE SPLIT ─────────────────────────
// This file WAS `app/w/layout.tsx`. It is now the client half of it, and `layout.tsx` is
// a thin server component above it whose only job is to read the mode cookie before the
// first byte is emitted.
//
// THE AMENDED RULING'S TWO PROPERTIES BOTH SURVIVE, which is why this is a label and not
// a re-ruling. There is still ONE route-tree root for `/w`, and there is still ONE
// session resolve — the effect below, once, with an empty dependency list. What changed
// is that the root now has a server layer, because the thing it must know at first paint
// arrives on the request rather than from the browser.
//
// ── R-38.1 · IT IS NOW THE ONLY ROOT THE VENDOR MEETS ───────────────────────
// At 366a7b5 this layout sat BESIDE app/vendor/layout.tsx and sixteen of seventeen tiles
// crossed from one to the other. Every such tap unmounted this tree and mounted that one:
// a second root layout, a second Splash, a second masthead, a second medallion with its
// own drawer, a second glyph nav, a second token scope, and a second session resolve. The
// founder's whole grievance list — the lag, the two mastheads, the two coins, the two
// navs, the fonts — was that one structure, and it is not a set of defects. It is one.
//
// Rooms, Today, Business Solutions, Billing, Settings and Advisor are children of this
// layout. app/vendor/layout.tsx's chrome mounts for NO route the shell serves; the
// /vendor routes survive on disk as untouched fallbacks for the fourteen rooms that have
// not crossed yet (lib/worklist/rooms.ts INTERIM_VENDOR_ROOMS names them, derived).
//
// ── R-38.3 · ONE SESSION RESOLVE ────────────────────────────────────────────
// The onboarding verdict is fetched ONCE HERE, on mount, with an empty dependency list.
// The old shell's guard (app/vendor/layout.tsx:148-168) re-ran on EVERY pathname, so a
// vendor walking six rooms paid for six identical round trips to /api/v2/vendor/me — and
// paid for them on the tap, in front of the next screen. The verdict cannot change while
// she is inside the shell: the only door that changes it is the onboarding form itself,
// which lives outside this tree and redirects on completion.
//
// IT FAILS OPEN, DELIBERATELY, AND THAT IS CARRIED VERBATIM FROM THE OLD GUARD'S REASONING.
// A network error, a 401 mid-refresh, or a response without the verdict leaves the vendor
// where she is. `=== false` and not `!complete`: an ABSENT verdict is a server that did
// not answer the question, not a vendor who is incomplete. Only an explicit false
// redirects. A guard that strands a paying vendor because a fetch flaked is worse than one
// that misses a turn, and R-OB.9's gate is the backstop on the WhatsApp side.
//
// THIS CLIENT NEVER DECIDES COMPLETENESS. It asks and it obeys.
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getVendorSession } from '@/lib/vendor/session';
import { vendorMe } from '@/hooks/vendor/useVendorHandle';
import { ModeProvider } from '@/lib/worklist/ModeContext';
import { scopeCss } from '@/lib/worklist/theme';
import type { WlMode } from '@/lib/worklist/mode';

export function WorklistBoot({ initialMode, children }: { initialMode: WlMode; children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  // The ref is the whole of "once". React 18 mounts effects twice in development strict
  // mode, and a plain empty-dependency effect would fire two requests on every dev load —
  // which is exactly the shape of the defect this ruling removes, reintroduced by the tool
  // rather than by the code.
  const asked = useRef(false);

  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);

  useEffect(() => {
    if (loading || !session || asked.current) return;
    if (typeof window === 'undefined') return;
    if (!getVendorSession()?.access_token) return;
    asked.current = true;

    let live = true;
    // F-38.26: the SAME request the medallion and the link card await. This layout asks
    // once per document and the shell asks on every remount, so the three reads were three
    // round trips a vendor paid for on the tap. One site now owns the question.
    vendorMe()
      .then((d) => {
        if (!live || !d.ok) return;
        if (d.vendor?.onboarding?.complete === false) router.replace('/vendor/onboarding');
      })
      .catch(() => { /* non-fatal — fail open, see above */ });
    return () => { live = false; };
  }, [loading, session, router]);

  // ZIP 14 · THE FLASH CURE (F-09.166 lineage). This div used to carry NO background, so
  // during every session resolution the vendor saw whatever `html, body` paints — and
  // globals.css:897/:906 paints the OLD hub atmosphere with `!important`: a warm bone
  // gradient (#F7F4EF -> #F3EFE8) under `html.theme-light`. Chalk's own ground is #F3F4F4,
  // a COOL neutral, and warm-bone into cool-Chalk is the blink the founder kept catching.
  //
  // THE DEFAULT-DARK ARM, per the chair's rider: the mode lives in localStorage under
  // 'tdw_worklist_mode' and is read in a useEffect, so it is NOT knowable at this guard's
  // first paint — the guard renders before the shell mounts, by construction. The ground
  // is pinned to the dark token literal. A dark blink into Chalk is the benign direction.
  //
  // ⚠ F-38.3 IS OPEN AND THIS IS NOT ITS CURE. components/worklist/AskSheet.tsx:32 mounts
  // `<ThemeProvider pinned>`, and a pinned provider WRITES `html.theme-light` and
  // `documentElement.style.background` (lib/vendor/ThemeContext.tsx:117, :85-87). That is a
  // SECOND writer of the class ZIP 14 convicted, living inside this tree. Filed OPEN at
  // CE-38 relay #2, cure priced for sitting 2; no new ThemeProvider mounts under /w.
  // ── F-38.41 · THE GROUND IS A TOKEN AGAIN, NOT A LITERAL ──────────────────
  // This div used to be pinned to `#141516` — the dark page-bg written out by hand —
  // with a comment explaining that the mode was NOT KNOWABLE here because it lived in
  // localStorage and was read in an effect. It is knowable now: the cookie rode the
  // request and the server put it on `initialMode`. So the guard paints the vendor's own
  // mode, from the same token the shell paints, and `#141516` leaves this file.
  //
  // THE SCOPE IS EMITTED HERE TOO, and that is not duplication. The shell's `<style>`
  // ships with the shell, which has not mounted yet; a guard that referenced
  // `--atelier-page-bg` without it would paint transparent and let globals.css's warm
  // bone gradient through — the exact blink ZIP 14 convicted. Both emit the SAME
  // `scopeCss('.wl')` from the one home in theme.ts, so there is one definition and two
  // consumers, not two definitions.
  if (loading || !session) return (
    <div className="wl" data-wl-mode={initialMode} aria-busy="true"
         style={{ minHeight: '100dvh', background: 'var(--atelier-page-bg)' }}>
      <style>{scopeCss('.wl')}</style>
    </div>
  );
  return <ModeProvider initial={initialMode}>{children}</ModeProvider>;
}
