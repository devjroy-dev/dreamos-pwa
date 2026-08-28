"use client";
// app/w/support/benchmarks/page.tsx — BENCHMARKS (spec §7, P6).
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS IS THE SURFACE THAT COULD LEAK, SO IT IS THE ONE BUILT MOST NARROWLY
// ═══════════════════════════════════════════════════════════════════════════
// It shows a vendor her own number beside a median for her city and category.
// It NEVER shows another vendor's number, and it cannot: the door sends `mine`,
// `median` and `cohort`, and nothing else. There is no field on the wire that
// could identify anyone.
//
// BELOW THE COHORT FLOOR OF FIVE, NO MEDIAN IS COMPUTED AND NONE IS SENT. With
// four vendors in a category, a median plus a vendor's own number is close to
// naming the other three. So the surface renders the below-cohort sentence and
// no figures at all — not "—" beside a real median, which would still be a
// number she could reason backwards from.
//
// AND THE SENTENCE HAS TWO FORMS ON PURPOSE. Spec §7's byte names the city; when
// the city is unknown, `Not enough vendors in null yet` is what ships if nobody
// writes the second one, so `benchmarksNoCity` exists for exactly that case.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS } from '@/lib/solutions/copy';
import { fetchBenchmarks } from '@/lib/solutions/client';
import type { BenchmarksReport, Benchmark } from '@/lib/solutions/types';
import { SurfaceFrame, SurfaceEmpty, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function Page() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Screen />;
}

/** Spec §7's cohort floor. Named here so the number is legible, not buried in a test. */
const COHORT_FLOOR = 5;

const LABELS: Record<Benchmark['metric'], string> = {
  first_reply_minutes: 'First reply',
  reply_rate:          'Replies sent',
  enquiries_per_month: 'Enquiries a month',
  conversion_rate:     'Enquiries booked',
};

function Screen() {
  const [d, setD] = useState<BenchmarksReport | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetchBenchmarks().then((x) => { if (alive) setD(x); }).catch(() => { if (alive) setErr(COPY.surfaceUnavailable); });
    return () => { alive = false; };
  }, []);

  const belowCohort = !d || d.cohort < COHORT_FLOOR;
  const shortfall = d?.city
    ? COPY.benchmarksBelowCohort.replace('{city}', d.city)
    : COPY.benchmarksNoCity;

  return (
    <WorklistShell title={ROWS.benchmarks}>
      <SurfaceFrame heading={ROWS.benchmarks} eyebrow={ROW_EYEBROWS.benchmarks} error={err}>
        <SurfaceEmpty>{COPY.benchmarksEmpty}</SurfaceEmpty>
        {/* NO FIGURES AT ALL below the floor — not even a dash beside a median.
            A dash next to a real number is still a number to reason from. */}
        {belowCohort ? (
          <p className="sol-note">{d ? shortfall : '\u00a0'}</p>
        ) : (
          <div className="sol-list">
            {d.metrics.map((m) => (
              <div className="sol-item" key={m.metric}>
                <span className="sol-itemlabel">{LABELS[m.metric]}</span>
                <span className="sol-itemnote">
                  {m.mine ?? '\u2014'} &middot; {COPY.medianLabel} {m.median ?? '\u2014'}
                </span>
              </div>
            ))}
          </div>
        )}
      </SurfaceFrame>
      <SolutionsStyles />
    </WorklistShell>
  );
}
