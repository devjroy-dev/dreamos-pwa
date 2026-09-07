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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/vendor/useSettings';
import { updateMe } from '@/lib/vendor/api/vendor';
import { RF } from '@/lib/worklist/referrals';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { SettingsScreen } from '@/components/vendor/SettingsScreen';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

/**
 * ── THE PEER-DISCOVERY SWITCH · R-40.107 ─────────────────────────────────────
 *
 * ⚠ IT SAVES ON TOGGLE AND DOES NOT GO THROUGH `useSettings`' `update`/`isDirty`.
 * That hook is a FORM hook built for a Save button; routing a consent flag
 * through its dirty tracking would let an unrelated Save elsewhere carry this
 * one. A consent flag is written by the tap that granted it and by nothing else.
 * Transcribed property for property from the storefront's date-check switch
 * (`storefront/screen.tsx:337`), which is the estate's only other consent
 * toggle and is where that reasoning was first paid for.
 *
 * ⚠ WITHOUT ITS PUBLIC-CACHE REBUILD, and that is a derivation rather than an
 * omission. The date switch rebuilds `/v/<code>` because a 300s cache would keep
 * serving the old value for five minutes. NOTHING is cached behind this one: the
 * peer search is a vendor-auth door read live on every keystroke, so a rebuild
 * would be a call with no page to rebuild.
 *
 * ⚠ AND IT LIVES IN THIS FILE RATHER THAN IN `SettingsScreen`. This page already
 * renders a settings row of its own — the `Profile layout` link above — so a row
 * here is the established shape and not a second home. `SettingsScreen` is
 * shared with the legacy surface through its `chrome` prop, and a consent switch
 * that appeared on two surfaces would be one control with two homes.
 */
function PeerDiscoverySwitch() {
  const { current, loading } = useSettings();
  const [on, setOn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  // Seeded from the hook's single `/me` read — never a second fetch. The hook
  // defaults this field TRUE where absent (the opposite of its neighbour),
  // because the column's own default is true and reading a listed vendor as
  // hidden would draw her switch OFF while the search still finds her.
  const live = on ?? current.peer_discoverable;

  async function toggle() {
    if (busy) return;
    const next = !live;
    setOn(next);                    // optimistic
    setBusy(true);
    try {
      const r = await updateMe({ peer_discoverable: next });
      // ⚠ REVERT ON REFUSAL, and settle on the DOOR'S OWN ECHO rather than on
      // the value we hoped for. If the door said no — or said yes to something
      // else — the row goes back to the truth.
      if (!('ok' in r) || !r.ok) { setOn(!next); return; }
      setOn(r.vendor.peer_discoverable !== false);
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  }

  // ⚠ NOTHING UNTIL THE DOOR HAS ANSWERED. A switch drawn from a default is a
  // control asserting a fact it has not read (F-40.209), and here the wrong
  // guess is a vendor told she is hidden while the search still lists her.
  if (loading) return null;

  return (
    <div className="wl-set">
      <div
        role="switch"
        aria-checked={live}
        aria-label={RF.peerSwitchLabel}
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        className="wl-swrow"
        style={{ opacity: busy ? 0.6 : 1 }}
      >
        <span className="wl-swtext">
          <span className="wl-swlabel">{RF.peerSwitchLabel}</span>
          {/* The line does TWO jobs: it tells her she is already listed (the
              switch is on by default), and its middle clause states the door's
              third predicate plainly — paused storefront, no peer search,
              whatever this switch says. */}
          <span className="wl-swline">{RF.peerSwitchLine}</span>
        </span>
        <span className={`wl-sw${live ? ' on' : ''}`} aria-hidden><span /></span>
      </div>
    </div>
  );
}

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
      <PeerDiscoverySwitch />
      <SettingsScreen chrome={false} ToastView={WlToast} />
      <style>{`
.wl-set{padding-top:16px}
.wl-setrow{display:flex;align-items:center;gap:12px;width:100%;min-height:var(--wl-row);padding:0 16px;background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;text-decoration:none;touch-action:manipulation}
.wl-setrowlabel{flex:1;font:var(--wl-t3);color:var(--atelier-ink)}
.wl-setrowchev{color:var(--atelier-ink-dim);font-size:14px;line-height:1;flex-shrink:0}
.wl-setrow:active{background:var(--atelier-row-hover)}
.wl-setrow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-swrow{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:14px 16px;cursor:pointer;touch-action:manipulation}
.wl-swrow:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px;border-radius:3px}
.wl-swtext{display:flex;flex-direction:column;gap:5px;min-width:0}
.wl-swlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.wl-swline{font:var(--wl-t5);color:var(--atelier-ink-mute);line-height:1.5;max-width:38ch}
.wl-sw{flex:0 0 auto;width:46px;height:27px;border-radius:14px;position:relative;margin-top:2px;background:var(--atelier-input-bg);border:.5px solid var(--atelier-card-border);transition:background 140ms ease}
.wl-sw.on{background:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}
.wl-sw>span{position:absolute;top:2px;left:2px;width:21px;height:21px;border-radius:50%;background:var(--atelier-ink-fade)}
.wl-sw.on>span{left:auto;right:2px;background:var(--role-ink-deep)}
      `}</style>
    </WorklistShell>
  );
}
