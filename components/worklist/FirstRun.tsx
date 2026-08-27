"use client";
// components/worklist/FirstRun.tsx — the manual that deletes itself (R-37.68 / R-37.68-A).
//
// PHASE 1 SHIPS IT STATICALLY. No state logic exists yet, and the install walk should not
// open onto a blank room. Phase 4 makes it the true first-run state, shown when the
// endpoint reports no-data-ever, while quiet days get the resting state instead.
//
// THE DIVISION FROM THE TOUR (§8.10), stated so Phase 4 can retire the right thing: the
// tour points at chrome ONCE and is dismissed. This feed explains CAPABILITY every time
// until data arrives, then never again.
//
// ── R-38.6 · FIVE CARDS BECOME THREE, AND EACH BODY BECOMES ONE SENTENCE ────
//
// TWO CARDS DID NOT SHRINK — THEY WENT, and each for a reason of its own:
//
//   THE ROOMS CARD explained that every part of the business has a room, in a paragraph,
//   directly above a screen that IS eighteen rooms. A directory does not need a caption
//   telling the reader it is a directory; the tile grid explains the rooms by being them.
//
//   THE 「customised solutions」 CARD was a second door to Business Solutions, which has
//   been a ROOM with its own tile and its own surface since R-37.66. Two doors to one room
//   is the disease the tile grid was ruled to end (R-37.87's own words about the Collab
//   pill), and the card was the older of the two.
//
// The three that remain follow the vendor's timeline rather than a feature list: work
// reaches him (the desk, the link), then he runs it from where he already is.
//
// EVERY DESTINATION IS REAL. Never-404 binds, and every number resolves through its
// declared home in lib/waNumbers.ts — no literal enters this file (cell C3).
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor } from '@/lib/waNumbers';
import { useVendorHandle } from '@/hooks/vendor/useVendorHandle';

function openWa(number: string, text: string) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

export function FirstRun() {
  // Card 2 is HIDDEN ENTIRELY when no handle is set (R-37.68 ④). A share action with
  // nothing behind it is the never-404 failure wearing a different coat.
  const handle = useVendorHandle();
  const tdwLink = handle ? `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + handle)}` : null;

  return (
    <div className="wl-fr">
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

      {/* 2 · and he runs it from where he already is */}
      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardAskTitle}</h3>
        <p className="wl-cardbody">{COPY.cardAskBody}</p>
        <div className="wl-chips">
          {COPY.cardAskChips.map((c) => <span className="wl-chip" key={c}>{c}</span>)}
        </div>
      </article>

      <style>{FR_CSS}</style>
    </div>
  );
}

// NO HIDDEN PREFETCH LINK REPLACES THE RETIRED ROOMS CARD, and the note is here so the
// next reader does not add one as a kindness: the nav's Rooms seat is an anchor and
// already announces that route. A second, invisible announcement would be a second home
// for one decision, and invisible things are the ones that survive every later sweep.
const FR_CSS = `
.wl-fr{padding:0 0 24px}
/* R-38.4: a section eyebrow at t5, .08em. Was 11px Jost at .2em. */
.wl-frhead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:24px 0 8px}
.wl-chips{display:flex;flex-wrap:wrap;gap:8px}
/* R-37.73 ①: the chips are read, not tapped, in Phase 1 — but they are chip-shaped and a
   chip-shaped thing invites a thumb, so they carry a real target rather than teaching that
   some chips are dead. */
.wl-chip{display:flex;align-items:center;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:2px;padding:10px 12px;font:var(--wl-t4);color:var(--atelier-ink-dim)}
`;
