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
import { useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor, supportWaNumber } from '@/lib/waNumbers';
import { useVendorHandle } from '@/hooks/vendor/useVendorHandle';

function openWa(number: string, text: string) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

export function FirstRun() {
  const router = useRouter();
  // Card 1 is HIDDEN ENTIRELY when no handle is set (R-37.68 \u2463). The settings surface
  // already guards this the same way; a share action with nothing behind it is the
  // never-404 failure wearing a different coat.
  const handle = useVendorHandle();

  const tdwLink = handle ? `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + handle)}` : null;

  return (
    <div className="wl-fr">
      {/* R-37.68-B: the forward promise sits above everything. Naming what Today becomes is
          the honest cure for the feed being absent — and it is the one line here that stays
          true after the rest of the manual retires at first data. */}
      <h2 className="wl-frhead">{COPY.firstRunHeader}</h2>

      {/* 1 · work reaches him */}
      <article className="wl-card wl-card-lead">
        <h3 className="wl-cardtitle">{COPY.cardDeskTitle}</h3>
        <p className="wl-cardbody">{COPY.cardDeskBody}</p>
        <button type="button" className="wl-cardaction"
                onClick={() => openWa(waNumberFor('vendor'), 'Hi')}>{COPY.cardDeskAction}</button>
      </article>

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

      {/* 2 · work gets run */}
      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardAskTitle}</h3>
        <p className="wl-cardbody">{COPY.cardAskBody}</p>
        <div className="wl-chips">
          {COPY.cardAskChips.map((c) => <span className="wl-chip" key={c}>{c}</span>)}
        </div>
      </article>

      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardRoomsTitle}</h3>
        <p className="wl-cardbody">{COPY.cardRoomsBody}</p>
        <button type="button" className="wl-cardaction"
                onClick={() => router.push('/w/rooms')}>{COPY.cardRoomsAction}</button>
      </article>

      {/* 3 · and if something is missing, he asks */}
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
/* retired: the promise is the page's hero now, set in app/w/today. */
.wl-frpromise-retired{font-size:14.5px;font-weight:400;line-height:1.65;color:var(--atelier-ink-dim);text-align:center;margin:0 0 20px;padding:0 4px}
.wl-frhead{font-family:var(--wl-label);font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:26px 0 12px;text-align:center}
/* R-37.73 ①: 40 was under the floor. */
.wl-chips{display:flex;flex-wrap:wrap;gap:7px}
/* R-37.73 ①: the chips are read, not tapped, in Phase 1 — but they are chip-shaped and
   a chip-shaped thing invites a thumb, so they carry a real target rather than teaching
   that some chips are dead. ②: 11.5 → 13. */
.wl-chip{display:flex;align-items:center;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:2px;padding:10px 13px;font-size:13px;font-weight:400;color:var(--atelier-ink-dim)}
`;
