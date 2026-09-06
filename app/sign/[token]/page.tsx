"use client";
// app/sign/[token]/page.tsx
// BLOCK 19 · G3.2 — THE COUPLE SIGNS. `/sign/<token>`.
//
// ═══════════════════════════════════════════════════════════════════════════
// FOUR LEAVES, ONE CONSTITUTION — R-G12.9
// ═══════════════════════════════════════════════════════════════════════════
// `app/crew/[token]`, `app/credits/[token]`, `app/consent/[token]` and this one.
// The shared law lives in `lib/public/token.ts` and is not re-decided here: the
// token is the whole credential, nothing is persisted, the HTTP STATUS is the
// verdict, and a dead token reads identically to one that never existed.
//
// ⚠ THREE DECLARED DEPARTURES FROM THE CONSENT LANE, EACH A DIFFERENCE IN POWER.
//
//   1. IT IS **TERMINAL**. `/consent/` keeps `Take it down` alive after a yes,
//      and is right to: a couple who can say yes and never no has been given a
//      trapdoor rather than a switch. A SIGNATURE IS NOT A SWITCH. Clause 5 is
//      how this agreement is undone — in writing, with a slab — and a control
//      here that un-signed it would invent a remedy the instrument does not have.
//
//   2. IT CARRIES A **REAL ONE-TIME PASSWORD**, not the last-four friction check
//      (R-G32.2). Clause 12's bytes are frozen and lawyer-passed (R-40.46) and
//      they say a password is SENT to her number and ENTERED. `/consent/`'s own
//      header says its check is *a friction check, not an OTP — nothing is sent,
//      nothing is stored*, which is right for a switch and false for a signature.
//      The last-four check is NOT layered on top: the OTP subsumes it, and asking
//      for both would be two frictions for one act.
//
//   3. THE DOCUMENT IS **RENDERED FRESH, NEVER SERVED FROM STORAGE**. She is
//      agreeing to bytes; a stored draft PDF could have been rendered before the
//      vendor's last edit, and then she would have agreed to a page the record no
//      longer says. `GET /:token/document` goes through the one renderer.
//
// ⚠ THE ORDER OF THE TWO SCREENS IS CLAUSE 12'S, NOT A UI PREFERENCE.
// She reads, taps I agree, and THEN the code reaches her. Minting it at send
// would put a live code on her number before she had opened anything, and expire
// it while she was still reading. `S3-sign-read` then `S3-sign-code` is that
// order drawn, and the door mints nothing until `POST /code`.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SIGN_COPY } from '@/lib/public/signCopy';
import { TOKEN_DEAD_LINK, readToken, actToken } from '@/lib/public/token';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://dream-os-production.up.railway.app';

type Sign = { owner: string | null; signed: boolean; code_sent: boolean };

export default function SignPage() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token ?? '');
  const [data, setData] = useState<Sign | null>(null);
  const [dead, setDead] = useState(false);
  const [busy, setBusy] = useState(false);
  // R-40.29's law, carried across: a failure is HELD, not swallowed, and cleared
  // on the next tap so a retry does not argue with a stale sentence.
  const [failed, setFailed] = useState(false);
  // ── STAGE, NOT A PILE OF BOOLEANS ────────────────────────────────────────
  // Three states, named, so the leaf cannot render two at once: `read` (she has
  // the document), `code` (she has agreed and a code is out), `done` (terminal).
  // The credits leaf's `dead` boolean beside a `credit` object is the shape
  // `token.ts` retired for its reads, and the same reasoning applies to a page's
  // own progress.
  const [stage, setStage] = useState<'read' | 'code' | 'done'>('read');
  const [code, setCode] = useState('');
  const [codeFailed, setCodeFailed] = useState(false);

  useEffect(() => {
    if (!token) { setDead(true); return; }
    let live = true;
    void (async () => {
      const r = await readToken<{ sign: Sign }>(`${API_BASE}/api/v2/sign/${token}`);
      if (!live) return;
      if (r.kind === 'dead') { setDead(true); return; }
      // ⚠ `offline` IS NOT `dead`, and F-40.53 is what the distinction costs when
      // it is lost. A 500 or a stale service worker's 503 is US failing, not her
      // token expiring, and telling her the link is dead would make her chase a
      // vendor over our outage. The page simply stays quiet and she can retry.
      if (r.kind === 'offline') return;
      setData(r.data.sign);
      // A token that has already been signed opens on the terminal screen. It
      // will 404 on the next request anyway — the token is spent at verify — but
      // a tab left open through the signing should not offer the button again.
      if (r.data.sign.signed) setStage('done');
      else if (r.data.sign.code_sent) setStage('code');
    })();
    return () => { live = false; };
  }, [token]);

  /** The document. Opened, never fetched — the browser's own viewer is the
   *  preview, and a fetch would buy a blob URL to hand straight back to it. */
  const docUrl = `${API_BASE}/api/v2/sign/${token}/document`;

  /** She tapped I agree. The door mints the code and sends it. */
  async function agree() {
    setBusy(true); setFailed(false);
    const r = await actToken(`${API_BASE}/api/v2/sign/${token}/code`);
    setBusy(false);
    if (r.kind === 'dead') { setDead(true); return; }
    // ⚠ A DARK SEND IS A FAILURE HERE, AND IT SAYS SO. `CONTRACT_SIGN_SEND_ENABLED`
    // is unset in every environment, so the door returns 503 with a reason and
    // this leaf shows the failure line rather than advancing to a code screen for
    // a code that is not coming. NEVER A FALSE DONE — the estate's own law, and
    // the reason the walk is run by the founder pasting the code by hand.
    if (r.kind === 'failed') { setFailed(true); return; }
    setStage('code');
  }

  /** The code. */
  async function sign() {
    setBusy(true); setFailed(false); setCodeFailed(false);
    const r = await actToken(`${API_BASE}/api/v2/sign/${token}/sign`, { code });
    setBusy(false);
    if (r.kind === 'dead') { setDead(true); return; }
    // ⚠ THE DOOR RETURNS 422 FOR A WRONG CODE AND 404 FOR EVERYTHING ELSE, and
    // `actToken` maps a non-404 non-2xx to `failed`. So a wrong code and an
    // outage arrive here identically, and this leaf must not conflate them: it
    // shows the CODE line, because she is standing at a code field and a generic
    // failure there reads as "the button is broken". The one thing that cannot
    // happen is her being told the link is dead when it is not.
    if (r.kind === 'failed') { setCodeFailed(true); return; }
    setStage('done');
  }

  if (dead) {
    return (
      <main className="sg">
        <header className="sg-top"><span className="sg-top-name">The Dream Wedding</span></header>
        <div className="sg-body"><p className="sg-dead">{TOKEN_DEAD_LINK}</p></div>
        <SignStyles />
      </main>
    );
  }

  // Nothing renders until the read resolves. A document frame drawn before we
  // know whether there IS a document is a page that flickers a promise.
  if (!data) return <main className="sg"><SignStyles /></main>;

  return (
    <main className="sg">
      <header className="sg-top"><span className="sg-top-name">The Dream Wedding</span></header>
      <div className="sg-body">
        {stage === 'done' ? (
          <>
            <p className="sg-mark" aria-hidden="true">&#10003;</p>
            <h1 className="sg-h">{SIGN_COPY.done}</h1>
            <p className="sg-l">{SIGN_COPY.doneLead}</p>
            <a className="sg-alt" href={docUrl} rel="noopener noreferrer">{SIGN_COPY.save}</a>
          </>
        ) : stage === 'code' ? (
          <>
            <h1 className="sg-h">{SIGN_COPY.codeHead}</h1>
            <p className="sg-l sg-ask">{SIGN_COPY.codeAsk}</p>
            <input className="sg-fi" value={code} inputMode="numeric" maxLength={6}
                   autoComplete="one-time-code"
                   onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setCodeFailed(false); }} />
            <button type="button" className="sg-cta" disabled={busy || code.length < 6}
                    aria-busy={busy} onClick={() => void sign()}>{SIGN_COPY.agree}</button>
            {codeFailed ? <p className="sg-failed" role="status">{SIGN_COPY.codeFailed}</p> : null}
          </>
        ) : (
          <>
            <h1 className="sg-h">{SIGN_COPY.head(data.owner)}</h1>
            <p className="sg-l">{SIGN_COPY.lead}</p>
            {/* THE DOCUMENT ITSELF, in the browser's viewer. A `<object>` rather
                than an `<iframe>`: it degrades to its own children when the
                device cannot render a PDF inline, which on older Android is
                often, and the child here is the control she needs instead. */}
            <object className="sg-doc" data={docUrl} type="application/pdf" aria-label="Agreement">
              <a className="sg-alt" href={docUrl} rel="noopener noreferrer">{SIGN_COPY.save}</a>
            </object>
            <a className="sg-alt" href={docUrl} rel="noopener noreferrer">{SIGN_COPY.save}</a>
            <button type="button" className="sg-cta" disabled={busy} aria-busy={busy}
                    onClick={() => void agree()}>{SIGN_COPY.agree}</button>
            {failed ? <p className="sg-failed" role="status">{SIGN_COPY.codeFailed}</p> : null}
          </>
        )}
      </div>
      <SignStyles />
    </main>
  );
}

/** The consent leaf's own values, class-for-class. One ground for the whole
 *  capability lane; a second palette here would make one constitution look like
 *  two products. */
function SignStyles() {
  return (
    <style>{`
:root{color-scheme:light}
.sg{min-height:100vh;background:#F8F7F5;color:#0C0A09;display:flex;flex-direction:column;
    font:400 15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
    -webkit-font-smoothing:antialiased;max-width:520px;margin:0 auto}
.sg *{box-sizing:border-box;margin:0;padding:0}
.sg-top{height:40px;display:flex;align-items:center;padding:0 20px;border-bottom:.5px solid rgba(12,10,9,.10)}
.sg-top-name{font-weight:300;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:rgba(12,10,9,.72)}
.sg-body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:26px 26px 60px}
.sg-dead{font-size:15px;color:rgba(12,10,9,.78)}
.sg-h{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-style:italic;font-size:30px;line-height:1.12}
.sg-l{font-size:15px;line-height:1.6;color:rgba(12,10,9,.78);margin-top:14px}
.sg-ask{margin-top:30px}
.sg-doc{width:100%;flex:1;min-height:280px;margin-top:20px;border:.5px solid rgba(12,10,9,.16);
        border-radius:2px;background:#FFFDFB}
.sg-cta{margin-top:20px;width:100%;min-height:48px;padding:15px 0;background:#C9A84C;color:#0C0A09;border:none;border-radius:2px;
        font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;cursor:pointer}
.sg-cta[disabled]{opacity:.55}
.sg-alt{margin-top:12px;display:block;width:100%;min-height:48px;padding:14px 0;background:transparent;
        border:.5px solid rgba(12,10,9,.26);color:#0C0A09;border-radius:2px;
        font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;
        text-align:center;text-decoration:none;cursor:pointer;font-family:inherit}
.sg-fi{width:100%;min-height:48px;margin-top:10px;padding:0 14px;border:.5px solid rgba(12,10,9,.26);
       border-radius:2px;background:#FFFDFB;font-size:20px;letter-spacing:.32em;color:#0C0A09;
       font-family:inherit}
/* Terracotta, the estate’s own refusal ink. Not red. */
.sg-failed{margin-top:14px;font-size:14px;line-height:1.5;color:#B4573A}
.sg-mark{font-size:34px;line-height:1;color:#2C7343}
    `}</style>
  );
}
