"use client";
// app/w/support/marketing/page.tsx — MARKETING (spec §7, P4).
//
// TDW NEVER PUBLISHES. The three tools author a draft; the vendor sends it. That
// is P4 behaviour, but the empty state is already consistent with it — there is
// nothing here that went out on her behalf, and the copy says so rather than
// implying a queue she has not seen.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS, BUTTONS } from '@/lib/solutions/copy';
import { fetchGateLive } from '@/lib/solutions/client';
import { fetchMarketing } from '@/lib/solutions/client';
import type { MarketingDraft } from '@/lib/solutions/types';
import { SurfaceFrame, SurfaceEmpty, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function Page() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Screen />;
}

const TOOLS: ReadonlyArray<[MarketingDraft['kind'], string]> = [
  ['post',     'Post'],
  ['referral', 'Referral message'],
  ['ad_brief', 'Ad brief'],
];

function Screen() {
  const [d, setD] = useState<MarketingDraft[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // F-19.20 — false until proven open. A surface that cannot confirm its
  // gate treats it as closed: an enabled button over a withheld door is the
  // defect; a disabled one over a working door is an inconvenience.
  const [live, setLive] = useState(false);
  useEffect(() => {
    let alive = true;
    fetchMarketing().then((x) => { if (alive) setD(x); }).catch(() => { if (alive) setErr(COPY.surfaceUnavailable); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let on = true;
    fetchGateLive('marketing').then((v) => { if (on) setLive(v); });
    return () => { on = false; };
  }, []);

  return (
    <WorklistShell title={ROWS.marketing}>
      <SurfaceFrame heading={ROWS.marketing} eyebrow={ROW_EYEBROWS.marketing} error={err}>
        <SurfaceEmpty>{COPY.marketingEmpty}</SurfaceEmpty>
        <div className="sol-list">
          {TOOLS.map(([kind, label]) => {
            const made = d?.filter((x) => x.kind === kind).length ?? 0;
            return (
              <div className="sol-item" key={kind}>
                <span className="sol-itemlabel">{label}</span>
                <span className="sol-itemnote">{d ? (made > 0 ? String(made) : COPY.noneYet) : '\u2014'}</span>
              </div>
            );
          })}
        </div>
        {!live ? <p className="sol-note">{COPY.withheldNote}</p> : null}
        <div className="sol-actions">
          <button type="button" className="sol-btn" disabled={!live}>{BUTTONS.make}</button>
        </div>
      </SurfaceFrame>
      <SolutionsStyles />
    </WorklistShell>
  );
}
