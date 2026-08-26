"use client";
// components/worklist/FirstRun.tsx — the manual that deletes itself (R-37.68 / R-37.68-A).
//
// PHASE 1 SHIPS IT STATICALLY. No state logic exists yet, and the install walk should not
// open onto a blank room. Phase 4 makes it the true first-run state, shown when the endpoint
// reports no-data-ever, while quiet days get the resting state instead.
//
// THE DIVISION FROM THE TOUR (\u00a78.10), stated so Phase 4 can retire the right thing:
// the tour points at chrome ONCE and is dismissed. This feed explains CAPABILITY every time
// until data arrives, then never again. First real data is the app explaining itself by
// working, so the manual's retirement condition is the vendor no longer needing it.
//
// EVERY DESTINATION IS REAL. Never-404 binds, and every number resolves through its declared
// home — F-09.190's law applied at birth rather than after.
import { useEffect, useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor, supportWaNumber } from '@/lib/waNumbers';
import { getVendorSession } from '@/lib/vendor/session';
import { getJson } from '@/lib/vendor/api/_base';

function openWa(number: string, text: string) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

export function FirstRun() {
  // Card 1 is HIDDEN ENTIRELY when no handle is set (R-37.68 \u2463). The settings surface
  // already guards this the same way; a share action with nothing behind it is the
  // never-404 failure wearing a different coat.
  const [handle, setHandle] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getVendorSession()?.access_token) return;
    let live = true;
    getJson<{ ok: boolean; vendor?: { routing_handle?: string } }>('/api/v2/vendor/me', true)
      .then((d) => {
        if (!live || !d.ok) return;
        const h = d.vendor?.routing_handle?.trim();
        setHandle(h ? h.toUpperCase() : null);
      })
      .catch(() => { /* fail closed: no handle, no card */ });
    return () => { live = false; };
  }, []);

  const tdwLink = handle ? `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + handle)}` : null;

  return (
    <div className="wl-fr">
      <h2 className="wl-frhead">{COPY.firstRunHeader}</h2>

      {tdwLink && (
        <article className="wl-card">
          <h3 className="wl-cardtitle">{COPY.cardLinkTitle}</h3>
          <p className="wl-cardbody">{COPY.cardLinkBody}</p>
          <button type="button" className="wl-cardaction" onClick={() => {
            if (navigator.share) navigator.share({ url: tdwLink }).catch(() => { /* dismissed */ });
            else navigator.clipboard?.writeText(tdwLink);
          }}>{COPY.cardLinkAction}</button>
        </article>
      )}

      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardAiTitle}</h3>
        <p className="wl-cardbody">{COPY.cardAiBody}</p>
        <button type="button" className="wl-cardaction"
                onClick={() => openWa(waNumberFor('vendor'), 'Hi')}>{COPY.cardAiAction}</button>
      </article>

      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardAskTitle}</h3>
        <div className="wl-chips">
          {COPY.cardAskChips.map((c) => <span className="wl-chip" key={c}>{c}</span>)}
        </div>
      </article>

      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardMoreTitle}</h3>
        <p className="wl-cardbody">{COPY.cardMoreBody}</p>
        <button type="button" className="wl-cardaction"
                onClick={() => openWa(supportWaNumber(), 'Hi')}>{COPY.supportAction}</button>
      </article>

      <style>{FR_CSS}</style>
    </div>
  );
}

const FR_CSS = `
.wl-fr{padding:6px 16px 24px}
.wl-frhead{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:20px;color:var(--atelier-ink);margin:0 0 14px;text-align:center}
.wl-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:16px 16px 14px;margin-bottom:10px}
.wl-cardtitle{font-family:'Jost',sans-serif;font-weight:500;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text);margin:0 0 8px}
.wl-cardbody{font-size:13.5px;font-weight:400;line-height:1.6;color:var(--atelier-ink-soft);margin:0}
.wl-cardaction{margin-top:12px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:9px 14px;min-height:40px;font-family:'Jost',sans-serif;font-weight:500;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-chips{display:flex;flex-wrap:wrap;gap:6px}
.wl-chip{border:.5px solid var(--atelier-card-border);border-radius:2px;padding:7px 10px;font-size:11.5px;font-weight:400;color:var(--atelier-ink-dim)}
.wl-cardaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
