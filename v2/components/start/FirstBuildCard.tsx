'use client';
// v2/components/start/FirstBuildCard.tsx · CE-47 · FE-9 · S11, THE HOME CARD (the chair's correction A, 6 Oct 2026).
// One request (GET /api/v2/vendor/first-build/latest). Shown only when her latest build has ENDED (done or failed) and she
// has not yet reached its last screen on this phone; "Check it" opens the flow at /vendor/onboarding. No build, a running
// build, or a failed read: nothing is drawn (a card never claims what it does not know).
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { latestFirstBuild, buildChecked, fillWebsite } from '@/v2/lib/vendor/api/firstBuild';
import { START } from '@/v2/lib/vendor/startCopy';

export default function FirstBuildCard() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  // the chair, 8 Oct 2026 (WEB-4's contract): the card ALSO shows whenever website_can_fill is true, checked or not, so a
  // vendor who adds her photos a week later is offered them on Home. A build still running never shows it.
  const [canFill, setCanFill] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // ONE read per mount, as T1 asks once per row: the ask is remembered, and its answer is kept whenever it arrives
  // while the card is mounted (React's development double-run of effects does not ask twice).
  const asked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    latestFirstBuild().then((b) => {
      if (!mounted.current || !b || b.state === 'running') return;
      const seen = buildChecked(b.build_id); const fill = b.website_can_fill === true;
      if (!seen || fill) { setChecked(seen); setCanFill(fill); setShow(true); }
    }).catch(() => {});
  }, []);
  async function fillMine() {
    if (busy) return; setBusy(true); setErr('');
    try {
      const r = await fillWebsite();
      if (r && r.ok) { router.push('/vendor/onboarding'); return; }   // S4 follows the build there, as after any start
      setErr((r && 'error' in r && r.error) || START.noConnect);
    } catch { setErr(START.noConnect); }
    setBusy(false);
  }
  if (!show) return null;
  return (
    <section className="wl-home-sec" aria-labelledby="wl-home-build" data-first-build-card="">
      <div style={{ border: '1px solid var(--role-primary)', borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!checked ? (<>
          <h2 id="wl-home-build" className="wl-home-h" style={{ margin: 0 }}>{START.cardHead}</h2>
          <p className="wl-home-line" style={{ margin: 0 }}>{START.cardLine}</p>
          {/* Today's own filled button (TodayHome's Check): RECORD_CSS's rp-next is not on Today, and an unstyled link was
              what the built screens' pictures showed (7 Oct 2026) */}
          <Link className="wl-btn pri" style={{ flex: 'none', textDecoration: 'none' }} href="/vendor/onboarding" data-card-go="">{START.cardGo}</Link>
        </>) : null}
        {canFill ? (<div data-card-fill="">
          <p id={checked ? 'wl-home-build' : undefined} className="wl-home-line" style={{ margin: '0 0 8px' }}>{START.fillLine}</p>
          <button type="button" className="wl-cardaction" style={{ marginTop: 0 }} disabled={busy} onClick={() => void fillMine()}>{START.fillGo}</button>
          {err ? <p className="wl-home-line" role="alert" style={{ margin: '8px 0 0' }}>{err}</p> : null}
        </div>) : null}
      </div>
    </section>
  );
}
