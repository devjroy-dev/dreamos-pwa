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
// THE BODY DID NOT. `SettingsScreen`'s fields are AtelierForm primitives, and AtelierForm
// sets its labels in Jost at 9px with .42em–.5em tracking — the engraved register R-38.4
// retires. So this surface still reads in the old type world below its own header, and
// SAYING SO IS THE POINT: R-38.4's claim is that the scale holds "by construction, not by
// sweep", and a seat that quietly captured Settings and let the tuple cell pass over it
// would have made that claim false on the first surface that tested it.
//
// DECLARED GAP, NOT A SILENT ONE. The §5 tuple cell asserts over Rooms, Today and Billing
// this sitting and NAMES Settings as excluded, with this file as the reason. Recutting
// SettingsScreen to the six rungs is a copy-and-form sitting of its own — every field
// label is a vetoed byte and AtelierForm has main-side consumers (Discover Profile) that
// D-2 covers. Sitting 2's, priced, not smuggled.
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
            ⚠ INTERIM DESTINATION. /vendor/discover/preview has not crossed into the shell,
            so this row still leaves the shell's layout. It is the ONE declared exception
            to R-38.1's no-/vendor-href cell — named in lib/worklist/rooms.ts as
            INTERIM_VENDOR_LINKS and asserted as a set, so a second one cannot appear
            quietly. */}
        <Link href="/vendor/discover/preview" className="wl-setrow" data-interim="true">
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
