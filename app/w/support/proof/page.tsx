"use client";
// app/w/support/proof/page.tsx — PROOF (spec §7, P5).
//
// THE THREE DOCUMENTS ARE ENUMERATED, NOT LISTED FROM DATA. The door returns all
// three with `status:'none'` rather than an empty array, precisely so this surface
// can show WHICH three she will get. An empty list would render an empty room and
// tell her nothing about what the row is for.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS, BUTTONS } from '@/lib/solutions/copy';
import { fetchProof } from '@/lib/solutions/client';
import type { ProofDoc } from '@/lib/solutions/types';
import { SurfaceFrame, SurfaceEmpty, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function Page() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Screen />;
}

const LABELS: Record<ProofDoc['kind'], string> = {
  rate_card: 'Rate card',
  one_pager: 'One-page profile',
  qa:        'Common questions',
};

function Screen() {
  const [d, setD] = useState<ProofDoc[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetchProof().then((x) => { if (alive) setD(x); }).catch(() => { if (alive) setErr(COPY.surfaceUnavailable); });
    return () => { alive = false; };
  }, []);

  const KINDS: ProofDoc['kind'][] = ['rate_card', 'one_pager', 'qa'];
  return (
    <WorklistShell title={ROWS.proof}>
      <SurfaceFrame heading={ROWS.proof} eyebrow={ROW_EYEBROWS.proof} error={err}>
        <SurfaceEmpty>{COPY.proofEmpty}</SurfaceEmpty>
        <div className="sol-list">
          {KINDS.map((kind) => {
            const doc = d?.find((x) => x.kind === kind);
            return (
              <div className="sol-item" key={kind}>
                <span className="sol-itemlabel">{LABELS[kind]}</span>
                <span className="sol-itemnote">
                  {!d ? '\u2014' : doc && doc.status === 'ready' ? COPY.docReady
                     : doc && doc.status === 'stale' ? COPY.docStale : COPY.noneYet}
                </span>
              </div>
            );
          })}
        </div>
        <div className="sol-actions">
          <button type="button" className="sol-btn" disabled>{BUTTONS.make}</button>
          <button type="button" className="sol-btn" disabled>{BUTTONS.share}</button>
        </div>
      </SurfaceFrame>
      <SolutionsStyles />
    </WorklistShell>
  );
}
