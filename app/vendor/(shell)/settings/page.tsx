"use client";
// app/w/settings/page.tsx — SETTINGS, INSIDE THE SHELL. R-38.1.
//
// ── WHAT CROSSED, AND WHAT DID NOT — READ THIS BEFORE FILING A DEFECT ───────
//
// THE STRUCTURE CROSSED. This route is a child of app/w/layout.tsx, so tapping the
// Settings tile mounts no second layout, no second masthead, no second medallion, no
// second nav and no second session resolve. That is the whole of F-38.1 for this surface
// and it is the change the founder will feel.
//
// AND SO DID THE BODY, AT CE-39 S2/6 — the sitting this block was priced into. It read:
// 「the body did NOT cross. AtelierForm sets its labels in Jost at 9px with .42em–.5em
// tracking, the engraved register R-38.4 retires, so this surface still reads in the old
// type world below its own header」, and it named itself as the reason Settings was
// EXCLUDED from the render arm's tuple cell. Both halves are now false and the exclusion
// is gone with them: `SCALE_SURFACES` in tools/wl_render.cjs includes /w/settings, so the
// claim that the scale holds 「by construction, not by sweep」 is finally asserted on the
// surface that was built to test it.
//
// THE CROSSING IS A VARIANT, NOT A SWEEP (bank §2, chair-accepted). AtelierForm's five
// primitives take a `register` prop that DEFAULTS to the engraved bytes, so its four other
// importers — Discover Profile, Billing, SubscriptionCard, ProfileMeter, all of them D-2's
// concern — are byte-unchanged. `SettingsScreen` derives the variant from `chrome`, which
// is the same prop that already means 「the shell owns the frame」. One truth, one prop.
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { SettingsScreen } from '@/components/vendor/SettingsScreen';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

export default function ShellSettingsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.settingsTitle}>
      <div className="wl-set">
        {/* ── R-38.7 · THE SECOND VETOED ROW LANDS HERE ────────────────────────
            「Profile layout」 left the Rooms body with the WhatsApp row. Settings is its
            home because this is where the profile is edited, and a link belongs beside
            the thing that defines it.
            ⚠ LEGACY DESTINATION (P7.2). /vendor/discover/preview lives in app/vendor/(legacy)
            — the flip kept it (FORK 1 arm (a)); Block 09 ports it (F-39.77). This row leaves
            the shell's layout and is one of the three declared doors in
            lib/worklist/rooms.ts LEGACY_VENDOR_LINKS, asserted as a set by the inverted C31,
            so a second one cannot appear quietly. */}
        <Link href="/vendor/discover/preview" className="wl-setrow" data-legacy="true">
          <span className="wl-setrowlabel">{COPY.roomsProfileTitle}</span>
          <span className="wl-setrowchev" aria-hidden>&rsaquo;</span>
        </Link>
      </div>
      <SettingsScreen chrome={false} ToastView={WlToast} />
      <style>{`
.wl-set{padding-top:16px}
.wl-setrow{display:flex;align-items:center;gap:12px;width:100%;min-height:var(--wl-row);padding:0 16px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;text-decoration:none;touch-action:manipulation}
.wl-setrowlabel{flex:1;font:var(--wl-t3);color:var(--atelier-ink)}
.wl-setrowchev{color:var(--atelier-ink-dim);font-size:14px;line-height:1;flex-shrink:0}
.wl-setrow:active{background:var(--atelier-row-hover)}
.wl-setrow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
      `}</style>
    </WorklistShell>
  );
}
