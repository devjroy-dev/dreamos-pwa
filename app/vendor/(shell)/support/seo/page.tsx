"use client";
// app/w/support/seo/page.tsx — SEO (spec §6).
//
// ⚠ NO SCORE, AND THE REFUSAL IS STRUCTURAL. Spec §6 rejects "SEO score out of
// 100" by name, and `SeoReport` has nowhere to put one — so this surface could
// not render a score even if someone decided it should. What it shows instead is
// what is actually true: four counts, the queries couples really typed, and a
// checklist of what is live. A number out of 100 would be a made-up summary of
// those facts wearing more authority than any of them.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, ROWS, ROW_EYEBROWS } from '@/lib/solutions/copy';
import { fetchSeo } from '@/lib/solutions/client';
import type { SeoReport } from '@/lib/solutions/types';
import { SurfaceFrame, SurfaceEmpty, Stat, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function Page() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <Screen />;
}

const CHECKS: ReadonlyArray<[keyof SeoReport['checklist'], string]> = [
  ['structuredData', 'Structured data'],
  ['sitemap',        'Sitemap'],
  ['canonical',      'Canonical link'],
  ['ownDomain',      'Own domain'],
  ['searchConsole',  'Search Console'],
];

function Screen() {
  const [d, setD] = useState<SeoReport | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetchSeo().then((x) => { if (alive) setD(x); }).catch(() => { if (alive) setErr(COPY.surfaceUnavailable); });
    return () => { alive = false; };
  }, []);

  const n = (v: number | undefined) => (d ? String(v ?? 0) : '\u2014');
  return (
    <WorklistShell title={ROWS.seo}>
      <SurfaceFrame heading={ROWS.seo} eyebrow={ROW_EYEBROWS.seo} error={err}>
        <div className="sol-stats">
          <Stat label="Shown, this month" value={n(d?.impressionsThisMonth)} />
          <Stat label="Shown, last month" value={n(d?.impressionsLastMonth)} />
          <Stat label="Opened, this month" value={n(d?.clicksThisMonth)} />
          <Stat label="Opened, last month" value={n(d?.clicksLastMonth)} />
        </div>
        <SurfaceEmpty>{COPY.seoEmpty}</SurfaceEmpty>
        <div className="sol-list">
          {CHECKS.map(([key, label]) => (
            <div className="sol-item" key={key}>
              <span className="sol-itemlabel">{label}</span>
              {/* A plain word, not a tick or a cross. `Live`/`Not yet` says which
                  of two states this is; a green tick beside a red cross reads as
                  a report card, and spec §6 is explicit that this row is not one. */}
              <span className="sol-itemnote">
                {d ? (d.checklist[key] ? COPY.checkLive : COPY.checkPending) : '\u2014'}
              </span>
            </div>
          ))}
        </div>
        {d && d.topQueries.length > 0 ? (
          <div className="sol-list">
            {d.topQueries.slice(0, 5).map((q) => (
              <div className="sol-item" key={q.query}>
                <span className="sol-itemlabel">{q.query}</span>
                <span className="sol-itemnote">{q.clicks} / {q.impressions}</span>
              </div>
            ))}
          </div>
        ) : null}
      </SurfaceFrame>
      <SolutionsStyles />
    </WorklistShell>
  );
}
