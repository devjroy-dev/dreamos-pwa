"use client";
// app/consent/[token]/page.tsx
// BLOCK 19 · G1.2 — THE OFF-PLATFORM COUPLE'S CONSENT. `/consent/<token>`.
//
// ═══════════════════════════════════════════════════════════════════════════
// TWO LEAVES, ONE CONSTITUTION — R-G12.9
// ═══════════════════════════════════════════════════════════════════════════
// The shared law now lives in `lib/public/token.ts` and is not re-decided here:
// the token is the whole credential, nothing is persisted, the HTTP STATUS is
// the verdict, and a dead token reads identically to one that never existed.
// F-40.40's third occurrence of the dead-link byte is what forced that hoist,
// and this leaf is why it could not be deferred again.
//
// ⚠ ONE DECLARED DEPARTURE FROM THE CREDIT LANE, AND IT IS A DIFFERENCE IN
// POWER — R-G12.4. A credit token claims ONE name on ONE page and is ONE ACTION
// THEN TERMINAL (R-G11.14). This token flips `couple_consent` on published
// material and can be used again to flip it back: a standing grant. So:
//
//   · IT EXPIRES at 30 days, enforced twice — the read, so this page shows the
//     same dead sentence, and `wedding_set_consent` (0133) INSIDE its own UPDATE,
//     so a caller that skipped the read still cannot write.
//   · IT IS NOT TERMINAL. `Take it down` stands after a yes. A couple who can
//     say yes and never no has not been given a switch, she has been given a
//     trapdoor — which is the whole reason the column exists.
//
// ── WHY THE COUPLE, AND NOT HER VENDOR, ANSWERS ────────────────────────────
// F-40.49: a page whose couple has no TDW account cannot be published under
// R-G11c.2, and that is most of a photographer's back catalogue. Her vendor
// cannot consent on her behalf — `master §2.4`: silence never means yes, and
// neither does the counterparty.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CONSENT_COPY } from '@/lib/public/consentCopy';
import { TOKEN_DEAD_LINK, readToken, actToken } from '@/lib/public/token';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

type Consent = { wedding: string; owner: string | null; published: boolean };

export default function ConsentPage() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token ?? '');
  const [data, setData] = useState<Consent | null>(null);
  const [dead, setDead] = useState(false);
  const [busy, setBusy] = useState(false);
  // R-40.29's law, carried across: the failure is HELD, not swallowed, and
  // cleared on the next tap so a retry does not argue with a stale sentence.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await readToken<{ consent: Consent }>(
        `${API_BASE}/api/v2/consent/${encodeURIComponent(token)}`,
      );
      if (!alive) return;
      if (r.kind === 'dead') { setDead(true); return; }
      // `offline` leaves the page quiet rather than accusing her token — a 500 or
      // a stale worker is us failing, not her link expiring.
      if (r.kind === 'ok') setData(r.data.consent);
    })();
    return () => { alive = false; };
  }, [token]);

  async function settle(next: boolean) {
    if (busy) return;
    // The tap is acknowledged BEFORE anything else: both controls dim and carry
    // aria-busy, so a person on a slow line sees the tap register rather than
    // tapping again into silence.
    setBusy(true);
    setFailed(false);
    const r = await actToken(
      `${API_BASE}/api/v2/consent/${encodeURIComponent(token)}/${next ? 'publish' : 'withdraw'}`,
    );
    if (r.kind === 'dead')  { setDead(true); setBusy(false); return; }
    if (r.kind === 'failed') { setFailed(true); setBusy(false); return; }
    // NEVER A FALSE DONE. The state moves only on a result in hand, and it moves
    // to what the SERVER said, not to what was asked for.
    setData((c) => (c ? { ...c, published: r.json.published === true } : c));
    setBusy(false);
  }

  if (dead) {
    return <main className="cs"><div className="cs-body"><p className="cs-dead">{TOKEN_DEAD_LINK}</p></div><ConsentStyles /></main>;
  }
  // A track painted for an unknown answer is a lying control, so nothing renders
  // until the read resolves — one round trip on a page she has just opened.
  if (!data) return <main className="cs"><ConsentStyles /></main>;

  return (
    <main className="cs">
      <header className="cs-top"><span className="cs-top-name">The Dream Wedding</span></header>
      <div className="cs-body">
        <h1 className="cs-h">{CONSENT_COPY.head}</h1>
        <p className="cs-l">{CONSENT_COPY.lead(data.owner)}</p>

        {data.published ? (
          <>
            <p className="cs-state">{CONSENT_COPY.stateLive}</p>
            {/* THE WITHDRAWAL IS A CONTROL, NOT A GREYED ONE. s-G11.2's shape for
                the fourth time in this arc: a refusal drawn as something tappable
                is worse than no control — and here there is no refusal at all. */}
            <button type="button" className="cs-decline" disabled={busy} aria-busy={busy}
                    onClick={() => settle(false)}>{CONSENT_COPY.takeDown}</button>
          </>
        ) : (
          <>
            <button type="button" className="cs-cta" disabled={busy} aria-busy={busy}
                    onClick={() => settle(true)}>{CONSENT_COPY.publish}</button>
            <button type="button" className="cs-decline" disabled={busy} aria-busy={busy}
                    onClick={() => settle(false)}>{CONSENT_COPY.notNow}</button>
          </>
        )}
        {/* Under the controls, only on a non-2xx, and only after the pending
            state above. A line that appeared without it would read as a refusal
            rather than a failure. */}
        {failed ? <p className="cs-failed" role="status">{CONSENT_COPY.failed}</p> : null}
      </div>
      <ConsentStyles />
    </main>
  );
}

/** The claim leaf's own values, class-for-class. One ground for the whole
 *  capability lane; a second palette here would make two constitutions look like
 *  two products. */
function ConsentStyles() {
  return (
    <style>{`
:root{color-scheme:light}
.cs{min-height:100vh;background:#F8F7F5;color:#0C0A09;display:flex;flex-direction:column;
    font:400 15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;max-width:520px;margin:0 auto}
.cs *{box-sizing:border-box;margin:0;padding:0}
.cs-top{height:40px;display:flex;align-items:center;padding:0 20px;border-bottom:.5px solid rgba(12,10,9,.10)}
.cs-top-name{font-weight:300;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(12,10,9,.72)}
.cs-body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 26px 60px}
.cs-dead{font-size:15px;color:rgba(12,10,9,.78)}
.cs-h{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;font-size:30px;line-height:1.12}
.cs-l{font-size:15px;line-height:1.6;color:rgba(12,10,9,.78);margin-top:14px}
.cs-state{font-size:15px;line-height:1.6;color:#0C0A09;margin-top:30px}
.cs-cta{margin-top:30px;width:100%;min-height:48px;padding:15px 0;background:#C9A84C;color:#0C0A09;border:none;border-radius:2px;
        font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;cursor:pointer}
.cs-decline{margin-top:12px;width:100%;min-height:48px;padding:14px 0;background:transparent;border:.5px solid #E07B5C;color:#B4573A;
            border-radius:2px;font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;cursor:pointer}
.cs-cta[disabled],.cs-decline[disabled]{opacity:.55}
/* Terracotta, the estate's own refusal ink — the value the decline button
   carries and the one CalendarBands paints a declined ring in. Not red. */
.cs-failed{margin-top:14px;font-size:14px;line-height:1.5;color:#B4573A}
    `}</style>
  );
}
