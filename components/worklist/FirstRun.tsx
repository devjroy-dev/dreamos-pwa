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
    // THE FIELD IS `handle`, NOT `routing_handle`. dream-os src/api/vendor/me.js:76 maps
    // `handle: vendor.routing_handle || null` on the way out. The first cut of this file read
    // the settings page's LOCAL variable name instead of the wire and hid card 1 on every
    // load — reaching for the expected shape instead of the text in front of me. Derived now.
    getJson<{ ok: boolean; vendor?: { handle?: string | null } }>('/api/v2/vendor/me', true)
      .then((d) => {
        if (!live || !d.ok) return;
        const h = d.vendor?.handle?.trim();
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
.wl-fr{padding:8px 16px 26px}
.wl-frhead{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:22px;color:var(--atelier-ink);margin:0 0 16px;text-align:center}
.wl-card{background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;padding:17px 17px 16px;margin-bottom:10px}
.wl-cardtitle{font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--atelier-accent-text);margin:0 0 9px}
.wl-cardbody{font-size:14.5px;font-weight:400;line-height:1.65;color:var(--atelier-ink-soft);margin:0}
/* R-37.73 ①: 40 was under the floor. */
.wl-cardaction{margin-top:14px;background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 18px;min-height:46px;font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-chips{display:flex;flex-wrap:wrap;gap:7px}
/* R-37.73 ①: the chips are read, not tapped, in Phase 1 — but they are chip-shaped and
   a chip-shaped thing invites a thumb, so they carry a real target rather than teaching
   that some chips are dead. ②: 11.5 → 13. */
.wl-chip{display:flex;align-items:center;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:2px;padding:10px 13px;font-size:13px;font-weight:400;color:var(--atelier-ink-dim)}
.wl-cardaction:active{background:var(--atelier-row-hover)}
.wl-cardaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
`;
