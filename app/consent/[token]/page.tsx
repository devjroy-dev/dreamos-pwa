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

type Consent = { wedding: string; owner: string | null; published: boolean; page_url: string | null };

export default function ConsentPage() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token ?? '');
  const [data, setData] = useState<Consent | null>(null);
  const [dead, setDead] = useState(false);
  const [busy, setBusy] = useState(false);
  // R-40.29's law, carried across: the failure is HELD, not swallowed, and
  // cleared on the next tap so a retry does not argue with a stale sentence.
  const [failed, setFailed] = useState(false);
  // ── R-G12.18.4 · THE PASS, NOT A BOOLEAN ──────────────────────────────────
  // The check is enforced by the SERVER: `verify` returns a signed pass bound to
  // this wedding and both writing doors refuse without it. Holding a `verified`
  // flag here instead would be theatre — anyone who opens a console sets it.
  // The pass lives in memory for the life of the tab and is never persisted,
  // exactly like everything else in this lane.
  const [pass, setPass] = useState<string | null>(null);
  const [last4, setLast4] = useState('');
  const [checkFailed, setCheckFailed] = useState(false);
  // Only set when the device had no share sheet and the address went to the
  // clipboard instead. A different outcome gets a different sentence.
  const [copied, setCopied] = useState(false);

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

  /**
   * THE CHECK. One answer for every failure — a wrong guess, a spent token and
   * an absent page all return the same 404, so this leaf cannot tell her how
   * close she was or how many tries remain. It does not need to.
   */
  async function verify() {
    if (busy || last4.trim().length < 4) return;
    setBusy(true);
    setCheckFailed(false);
    const r = await actToken(
      `${API_BASE}/api/v2/consent/${encodeURIComponent(token)}/verify`,
      { last4: last4.trim() },
    );
    if (r.kind === 'ok' && typeof r.json.pass === 'string') setPass(r.json.pass);
    else setCheckFailed(true);
    setBusy(false);
  }

  /**
   * SHARE — the founder's ask, 2026-09-05.
   *
   * ⚠ THE NATIVE SHEET FIRST, AND A CLIPBOARD ONLY AS FALLBACK. On the phone
   * this page is opened on, `navigator.share` gives her WhatsApp, Messages and
   * everything else she already uses; anything we built instead would be a worse
   * copy of a thing her device does better.
   *
   * A CANCELLED SHARE IS NOT A FAILURE. Dismissing the sheet rejects the promise,
   * and treating that as an error would tell her something went wrong when she
   * simply changed her mind — so the catch says nothing unless we actually fell
   * back to the clipboard.
   */
  async function share() {
    const url = data && data.page_url;
    if (!url) return;
    const nav = navigator as Navigator & { share?: (d: { url: string; title?: string }) => Promise<void> };
    if (typeof nav.share === 'function') {
      try { await nav.share({ url, title: data.wedding }); return; } catch { return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch { /* no sheet and no clipboard: the address is on screen to select */ }
  }

  async function settle(next: boolean) {
    if (busy || !pass) return;
    // The tap is acknowledged BEFORE anything else: both controls dim and carry
    // aria-busy, so a person on a slow line sees the tap register rather than
    // tapping again into silence.
    setBusy(true);
    setFailed(false);
    const r = await actToken(
      `${API_BASE}/api/v2/consent/${encodeURIComponent(token)}/${next ? 'publish' : 'withdraw'}`,
      { pass },
    );
    if (r.kind === 'dead')  { setDead(true); setBusy(false); return; }
    if (r.kind === 'failed') { setFailed(true); setBusy(false); return; }
    // NEVER A FALSE DONE. The state moves only on a result in hand, and it moves
    // to what the SERVER said, not to what was asked for.
    setData((c) => (c ? {
      ...c,
      published: r.json.published === true,
      // The door returns the page's own address on every settle, so the link she
      // is shown after a yes is the server's answer and not this leaf's guess.
      page_url: typeof r.json.page_url === 'string' ? r.json.page_url : c.page_url,
    } : c));
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

        {/* ── THE CHECK STANDS IN FRONT OF THE SWITCH — R-G12.18.4 ──────────
            Until it passes there is no control on this page at all. Not a
            greyed one: a refusal drawn as something tappable is worse than no
            control, and s-G11.2 has ruled that four times in this arc. */}
        {!pass ? (
          <>
            <p className="cs-l cs-ask">{CONSENT_COPY.checkAsk}</p>
            <input className="cs-fi" value={last4} inputMode="numeric" maxLength={4}
                   autoComplete="off" onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))} />
            <button type="button" className="cs-cta" disabled={busy || last4.length < 4}
                    aria-busy={busy} onClick={() => void verify()}>{CONSENT_COPY.publish}</button>
            {/* The check's own failure. It says nothing about WHY — a wrong
                guess, a spent token and a dead link read alike here because they
                read alike at the door. */}
            {checkFailed ? <p className="cs-failed" role="status">{CONSENT_COPY.failed}</p> : null}
          </>
        ) : data.published ? (
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

        {/* ── THE PAGE SHE JUST PUBLISHED — the founder's ask ────────────────
            Only after a yes, and only if the door gave us an address. She has
            agreed to something being published; she should be able to see it. */}
        {pass && data.published && data.page_url ? (
          <>
            {/* Both are CONTROLS, not a link and a hint — the founder's ask. They
                take the outline shape `Take it down` already uses on this page,
                so the three things she can do here look like three things she
                can do. The gold stays spent on the one affirmative above. */}
            <a className="cs-alt" href={data.page_url} rel="noopener noreferrer">
              {CONSENT_COPY.seePage}
            </a>
            <button type="button" className="cs-alt" onClick={() => void share()}>
              {CONSENT_COPY.share}
            </button>
            {/* Only after a clipboard fallback. A native share says nothing,
                because her own share sheet already told her what it did. */}
            {copied ? <p className="cs-copied" role="status">{CONSENT_COPY.shared}</p> : null}
          </>
        ) : null}

        {/* ── THE DISCLAIMER, BENEATH THE SWITCH — R-40.48.5 ─────────────────
            Beneath and not above: above, it reads as a warning she must clear
            before she may answer; beneath, it is what she is agreeing to as she
            answers. Shown from the check onward, because the check is where the
            answering begins. */}
        <p className="cs-fine">{CONSENT_COPY.disclaimer}</p>
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
/* ── THE CHECK AND THE DISCLAIMER (R-40.48) ────────────────────────────────
   NO BACKTICKS IN THIS BLOCK — it lives inside a template literal (e-7/e-8). */
.cs-ask{margin-top:30px}
.cs-fi{width:100%;min-height:48px;margin-top:10px;padding:0 14px;border:.5px solid rgba(12,10,9,.26);
       border-radius:2px;background:#FFFDFB;font-size:20px;letter-spacing:.32em;color:#0C0A09;
       font-family:inherit}
.cs-alt{margin-top:12px;display:block;width:100%;min-height:48px;padding:14px 0;background:transparent;
        border:.5px solid rgba(12,10,9,.26);color:#0C0A09;border-radius:2px;
        font-weight:300;font-size:11px;letter-spacing:.20em;text-transform:uppercase;
        text-align:center;text-decoration:none;cursor:pointer;font-family:inherit}
.cs-copied{margin-top:10px;font-size:13px;color:rgba(12,10,9,.62);text-align:center}
/* Quiet, and it does not shout: it is a condition of answering, not a threat. */
.cs-fine{margin-top:34px;font-size:11px;line-height:1.55;color:rgba(12,10,9,.50)}
    `}</style>
  );
}
