'use client';
// v2/components/start/FirstBuildCard.tsx · CE-47 · FE-9 · S11, THE HOME CARD (the chair's correction A, 6 Oct 2026).
// One request (GET /api/v2/vendor/first-build/latest). Shown only when her latest build has ENDED (done or failed) and she
// has not yet reached its last screen on this phone; "Check it" opens the flow at /vendor/onboarding. No build, a running
// build, or a failed read: nothing is drawn (a card never claims what it does not know).
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { latestFirstBuild, buildChecked } from '@/v2/lib/vendor/api/firstBuild';
import { START } from '@/v2/lib/vendor/startCopy';

export default function FirstBuildCard() {
  const [show, setShow] = useState(false);
  // ONE read per mount, as T1 asks once per row: the ask is remembered, and its answer is kept whenever it arrives
  // while the card is mounted (React's development double-run of effects does not ask twice).
  const asked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    latestFirstBuild().then((b) => { if (mounted.current && b && b.state !== 'running' && !buildChecked(b.build_id)) setShow(true); }).catch(() => {});
  }, []);
  if (!show) return null;
  return (
    <section className="wl-home-sec" aria-labelledby="wl-home-build" data-first-build-card="">
      <div style={{ border: '1px solid var(--role-primary)', borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 id="wl-home-build" className="wl-home-h" style={{ margin: 0 }}>{START.cardHead}</h2>
        <p className="wl-home-line" style={{ margin: 0 }}>{START.cardLine}</p>
        {/* Today's own filled button (TodayHome's Check): RECORD_CSS's rp-next is not on Today, and an unstyled link was
            what the built screens' pictures showed (7 Oct 2026) */}
        <Link className="wl-btn pri" style={{ flex: 'none', textDecoration: 'none' }} href="/vendor/onboarding" data-card-go="">{START.cardGo}</Link>
      </div>
    </section>
  );
}
