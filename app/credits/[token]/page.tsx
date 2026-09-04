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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

/** The founder's 2026-07-22 byte, carried from `app/crew/[token]/page.tsx`.
 *  One home would be better and this is the second; it is NOT hoisted in this
 *  sitting because that file is another arc's and R-G11.15 hoisted exactly two
 *  named strings. Filed, not fixed — and named here so it is not mistaken for a
 *  fresh authoring. */
// ⚠ THE APOSTROPHE IS TYPOGRAPHIC (U+2019), NOT ASCII, AND THAT IS THE BYTE.
// The first cut of this line copied the crew page's COMMENT, which spells it
// with an ascii quote, instead of the JSX it actually renders:
// `This link isn&rsquo;t active.` (app/crew/[token]/page.tsx:107, :109).
// R-40.19 put typographic apostrophes across the ratified set, and a reused byte
// that differs by one character is a re-authoring nobody vetoed. READ PAST THE
// CITE: a comment describing a string is not the string.
const DEAD_LINK = 'This link isn\u2019t active.';

type Credit = { role: string; label: string | null; status: string; wedding: string; owner: string | null };

export default function ClaimPage() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token ?? '');
  const [credit, setCredit] = useState<Credit | null>(null);
  const [dead, setDead] = useState(false);
  const [busy, setBusy] = useState(false);

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
    setBusy(true);
    try {
      const r = await fetch(`${API_BASE}/api/v2/credits/${encodeURIComponent(token)}/${action}`, { method: 'POST' });
      const j = await r.json().catch(() => null);
      // NEVER A FALSE DONE. The state changes only on a result in hand; a failed
      // POST leaves the buttons exactly as they were.
      if (j && j.ok && j.status) setCredit((c) => (c ? { ...c, status: j.status } : c));
    } catch { /* the buttons stay live; nothing is claimed that was not confirmed */ }
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
            <button type="button" className="cl-cta" disabled={busy} onClick={() => settle('claim')}>Add my name</button>
            <button type="button" className="cl-decline" disabled={busy} onClick={() => settle('decline')}>No thanks</button>
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
    `}</style>
  );
}
