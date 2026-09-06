"use client";
// app/credits/[token]/page.tsx
// BLOCK 19 · G1.1 — THE CLAIM PAGE. `/credits/<token>`.
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS INHERITS `app/crew/[token]/page.tsx`'s CONSTITUTION WHOLE
// ═══════════════════════════════════════════════════════════════════════════
// It is the estate's one public capability-token posture and none of it is
// re-decided here:
//   · THE TOKEN IN THE URL IS THE WHOLE CREDENTIAL. No session, no cookie, no
//     header — nothing to remember and nothing to leave behind on a borrowed
//     phone.
//   · NO localStorage, NO sessionStorage. Every piece of state is in memory for
//     the life of the tab. A capability page that persists anything turns a
//     forwarded link into a lasting grant.
//   · A DEAD TOKEN RENDERS 「This link isn't active.」 — the founder's byte of
//     2026-07-22, REUSED and never re-authored. The chair's correction to the
//     proposed 「…isn't active anymore.」 stands: "anymore" leaks that the token
//     once existed, and NEVER-EXISTED ≡ SETTLED ≡ ROTATED must read identically.
//   · ONE GOLD, spent on the affirmative. The decline is terracotta.
//
// ⚠ ONE ACTION, THEN TERMINAL — R-G11.14, amending the charter's "single use".
// The door's UPDATE carries `.eq('status','tagged')`, so two taps arriving
// together cannot both settle. A re-open shows the terminal state and offers no
// toggle this sitting: a vendor who declined and changed her mind is a real
// case, and it needs a surface and a ruling rather than a quiet second button.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CLAIM_FAILED } from '@/lib/public/copy';
import { TOKEN_DEAD_LINK } from '@/lib/public/token';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

/** F-40.40 CLOSED. This file's own comment said "one home would be better and
 *  this is the second", filed rather than fixed because the crew page belonged
 *  to another arc. G1.2's `/consent/` leaf would have made it a THIRD, so the
 *  byte moved to `lib/public/token.ts` — the constitution all three leaves share
 *  — and this line is now a reader of it rather than a second declaration.
 *  The bytes are IDENTICAL; the hoist edits nothing it carries. */
const DEAD_LINK = TOKEN_DEAD_LINK;

type Credit = { role: string; label: string | null; status: string; wedding: string; owner: string | null };

export default function ClaimPage() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token ?? '');
  const [credit, setCredit] = useState<Credit | null>(null);
  const [dead, setDead] = useState(false);
  const [busy, setBusy] = useState(false);
  // R-40.29 (b): the failure is HELD, not swallowed. Cleared on the next tap so
  // a retry does not argue with a stale sentence.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/v2/credits/${encodeURIComponent(token)}`);
        // ⚠ ONLY A 404 IS A DEAD LINK. A 500 or a dropped connection is US
        // failing, not her token expiring — telling her the link is dead would
        // make her chase a vendor over our outage. The crew page reasons the
        // same way at its own load.
        if (r.status === 404) { if (alive) setDead(true); return; }
        if (!r.ok) return;
        const j = await r.json();
        if (alive && j && j.ok) setCredit(j.credit as Credit);
      } catch { /* leave the page quiet rather than accusing the token */ }
    })();
    return () => { alive = false; };
  }, [token]);

  async function settle(action: 'claim' | 'decline') {
    if (busy) return;
    // R-40.29 (b) · THE TAP IS ACKNOWLEDGED BEFORE ANYTHING ELSE. `busy` dims
    // both controls and sets aria-busy, so a person on a slow line sees that
    // the tap registered rather than tapping again into silence.
    setBusy(true);
    setFailed(false);
    try {
      const r = await fetch(`${API_BASE}/api/v2/credits/${encodeURIComponent(token)}/${action}`, { method: 'POST' });
      // ⚠ THE HTTP STATUS IS THE VERDICT, NOT THE BODY'S SHAPE. F-40.53's walk
      // was a 503 from a stale service worker: no JSON, nothing to parse, and a
      // check keyed only on `j.ok` read that as "not settled" and said nothing.
      if (!r.ok) { setFailed(true); setBusy(false); return; }
      const j = await r.json().catch(() => null);
      // NEVER A FALSE DONE. The state changes only on a result in hand.
      if (j && j.ok && j.status) setCredit((c) => (c ? { ...c, status: j.status } : c));
      else setFailed(true);
    } catch {
      // A dropped connection is a failure the person can act on, and it says so.
      setFailed(true);
    }
    setBusy(false);
  }

  if (dead) {
    return (
      <main className="cl"><div className="cl-body"><p className="cl-dead">{DEAD_LINK}</p></div><ClaimStyles /></main>
    );
  }
  if (!credit) return <main className="cl"><ClaimStyles /></main>;

  const settled = credit.status !== 'tagged';

  return (
    <main className="cl">
      <header className="cl-top"><span className="cl-top-name">The Dream Wedding</span></header>
      <div className="cl-body">
        <h1 className="cl-h">You&rsquo;ve been credited</h1>
        <p className="cl-l">
          {credit.owner} credited you as {credit.label} on {credit.wedding}&rsquo;s wedding page.
        </p>

        {/* THE TERMINAL STATE REPLACES THE CONTROLS, NEVER GREYS THEM.
            s-G11.2's ruling, applied a third time in this arc: a refusal drawn
            as a control that looks tappable is worse than no control. */}
        {settled ? (
          <p className="cl-state">
            {credit.status === 'claimed' ? 'Your name is on the page.' : 'You declined this credit.'}
          </p>
        ) : (
          <>
            <button type="button" className="cl-cta" disabled={busy} aria-busy={busy}
                    onClick={() => settle('claim')}>Add my name</button>
            <button type="button" className="cl-decline" disabled={busy} aria-busy={busy}
                    onClick={() => settle('decline')}>No thanks</button>
            {/* R-40.29 (a) · UNDER the buttons, only on a non-2xx, and only after
                the pending state above. The controls stay live so the sentence
                is a retry prompt rather than a dead end. */}
            {failed ? <p className="cl-failed" role="status">{CLAIM_FAILED}</p> : null}
          </>
        )}
      </div>
      <ClaimStyles />
    </main>
  );
}

function ClaimStyles() {
  return (
    <style>{`
:root{color-scheme:light}
.cl{min-height:100vh;background:#F8F7F5;color:#0C0A09;display:flex;flex-direction:column;
    font:400 15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;max-width:520px;margin:0 auto}
.cl *{box-sizing:border-box;margin:0;padding:0}
.cl-top{height:40px;display:flex;align-items:center;padding:0 20px;border-bottom:.5px solid rgba(12,10,9,.10)}
.cl-top-name{font-weight:300;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(12,10,9,.72)}
.cl-body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 26px 60px}
.cl-dead{font-size:15px;color:rgba(12,10,9,.78)}
.cl-h{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;font-size:30px;line-height:1.12}
.cl-l{font-size:15px;line-height:1.6;color:rgba(12,10,9,.78);margin-top:14px}
.cl-state{font-size:15px;line-height:1.6;color:rgba(12,10,9,.78);margin-top:30px}
.cl-cta{margin-top:30px;width:100%;min-height:48px;padding:15px 0;background:#C9A84C;color:#0C0A09;border:none;border-radius:2px;
        font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;cursor:pointer}
.cl-decline{margin-top:12px;width:100%;min-height:48px;padding:14px 0;background:transparent;border:.5px solid #E07B5C;color:#B4573A;
            border-radius:2px;font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;cursor:pointer}
.cl-cta[disabled],.cl-decline[disabled]{opacity:.55}
/* Terracotta, the estate’s own refusal ink — the same value the decline button
   carries and the one CalendarBands paints a declined ring in. Not red. */
.cl-failed{margin-top:14px;font-size:14px;line-height:1.5;color:#B4573A}
    `}</style>
  );
}
