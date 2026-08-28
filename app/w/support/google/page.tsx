"use client";
// app/w/support/google/page.tsx — GOOGLE PAGE (spec §4).
//
// R-19.2: built COMPLETE, against the contract's not-connected state. The
// `Connect` button does exactly what P1 will make it do, minus the OAuth hop —
// disabled while the P1 gate is closed. Nothing here is a placeholder standing in
// for a real answer: `Not connected` IS the real answer today.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS, BUTTONS } from '@/lib/solutions/copy';
import { fetchGateLive } from '@/lib/solutions/client';
import { fetchGoogle } from '@/lib/solutions/client';
import type { GoogleStatus } from '@/lib/solutions/types';
import { SurfaceFrame, SurfaceEmpty, StateChip, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function Page() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Screen />;
}

function Screen() {
  const [d, setD] = useState<GoogleStatus | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // F-19.20 — false until proven open. A surface that cannot confirm its
  // gate treats it as closed: an enabled button over a withheld door is the
  // defect; a disabled one over a working door is an inconvenience.
  const [live, setLive] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchGoogle().then((x) => { if (alive) setD(x); }).catch(() => { if (alive) setErr(COPY.surfaceUnavailable); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let on = true;
    fetchGateLive('google').then((v) => { if (on) setLive(v); });
    return () => { on = false; };
  }, []);

  const connected = d?.status === 'connected';
  return (
    <WorklistShell title={ROWS.google}>
      <SurfaceFrame heading={ROWS.google} eyebrow={ROW_EYEBROWS.google} error={err}>
        <div className="sol-list">
          <div className="sol-item">
            <span className="sol-itemlabel">Listing</span>
            <StateChip state={d?.status ?? 'not_connected'} />
          </div>
          <div className="sol-item">
            <span className="sol-itemlabel">Review requests sent</span>
            <span className="sol-itemnote">{d ? String(d.reviewRequestsSent) : '\u2014'}</span>
          </div>
          <div className="sol-item">
            <span className="sol-itemlabel">Last checked</span>
            <span className="sol-itemnote">{d?.lastSyncedAt ?? '\u2014'}</span>
          </div>
        </div>
        <SurfaceEmpty>{COPY.googleEmpty}</SurfaceEmpty>
        {/* ⚠ TWO GATES, NOT ONE (spec §8). The grant waits on the OAuth keys; the
            SYNC waits additionally on GBP_QUOTA_APPROVED. Telling a vendor the row
            is dead because Google has not yet answered a quota application would be
            the wrong fact about her own product, so the two are shown apart. */}
        {d && !d.gbpQuotaApproved ? <p className="sol-note">{COPY.googleQuotaPending}</p> : null}
        {!live ? <p className="sol-note">{COPY.withheldNote}</p> : null}
        <div className="sol-actions">
          <button type="button" className="sol-btn" disabled={!live}>
            {connected ? BUTTONS.disconnect : BUTTONS.connect}
          </button>
        </div>
      </SurfaceFrame>
      <SolutionsStyles />
    </WorklistShell>
  );
}
