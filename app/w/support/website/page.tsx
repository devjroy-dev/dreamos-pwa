"use client";
// app/w/support/website/page.tsx — WEBSITE (spec §5).
//
// THE ADDRESS IS SHOWN BEFORE ANYTHING IS BOUGHT. Every vendor already has one on
// our domain, and THE DOOR computes it — this surface renders what it was handed
// and never builds that string itself. A vendor mid-onboarding has no handle; the
// door sends `null` and the pending sentence renders, never
// `null.thedreamwedding.in`.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS, BUTTONS } from '@/lib/solutions/copy';
import { fetchDomain } from '@/lib/solutions/client';
import type { DomainStatus } from '@/lib/solutions/types';
import type { ChipKey } from '@/lib/solutions/copy';
import { SurfaceFrame, SurfaceEmpty, StateChip, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function Page() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Screen />;
}

/**
 * `DomainStatus.status` has seven values and the chip set has seven names, but
 * they are NOT the same seven — `registering` and `wiring` are stages of one
 * purchase and both read as `Searching` to a vendor watching it happen, and
 * `none`/`error` both mean she has no domain yet. Mapped explicitly rather than
 * cast, because a cast would silently render a chip key that does not exist the
 * day the door gains a state.
 */
function chipFor(s: DomainStatus['status'] | undefined): ChipKey {
  switch (s) {
    case 'live':      return 'live';
    case 'expired':   return 'expired';
    case 'searching':
    case 'registering':
    case 'wiring':    return 'searching';
    case 'error':     return 'needs_attention';
    default:          return 'not_connected';
  }
}

function Screen() {
  const [d, setD] = useState<DomainStatus | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetchDomain().then((x) => { if (alive) setD(x); }).catch(() => { if (alive) setErr(COPY.surfaceUnavailable); });
    return () => { alive = false; };
  }, []);

  return (
    <WorklistShell title={ROWS.website}>
      <SurfaceFrame heading={ROWS.website} eyebrow={ROW_EYEBROWS.website} error={err}>
        <div className="sol-list">
          <div className="sol-item">
            <span className="sol-itemlabel">Own domain</span>
            <StateChip state={chipFor(d?.status)} />
          </div>
        </div>
        {d && d.subdomain ? <p className="sol-addr">{d.subdomain}</p> : null}
        {d && !d.subdomain ? <p className="sol-note">{COPY.subdomainPending}</p> : null}
        <SurfaceEmpty>{COPY.websiteEmpty}</SurfaceEmpty>
        {/* Spec §5's two honesty clauses. NEITHER CARRIES A FIGURE — the price is
            rendered beside them by formatRs when P2 has one, so no number is typed
            into copy and nothing here goes stale when the registrar's rate moves. */}
        <p className="sol-note">{COPY.domainOwnership}</p>
        <p className="sol-note">{COPY.costPassThrough}</p>
        <div className="sol-actions">
          <button type="button" className="sol-btn" disabled>{BUTTONS.get}</button>
        </div>
      </SurfaceFrame>
      <SolutionsStyles />
    </WorklistShell>
  );
}
