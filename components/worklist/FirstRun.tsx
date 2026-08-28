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
import { useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { waNumberFor } from '@/lib/waNumbers';
import { useVendorHandle } from '@/hooks/vendor/useVendorHandle';

function openWa(number: string, text: string) {
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
}

export function FirstRun() {
  // `Copy` reports itself. A copy button that does nothing visible is a control the vendor
  // taps twice, which is how a link ends up in a bio with the tail pasted on.
  const [copied, setCopied] = useState(false);
  // The handle seeds from a named cache and is corrected by the wire (F-38.21). On a
  // device's first load it is still unknown until that read lands, which is why the card it
  // gates is LAST — see the ordering note below.
  const handle = useVendorHandle();
  const tdwLink = handle ? `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + handle)}` : null;

  return (
    <div className="wl-fr">
      <h2 className="wl-frhead">{COPY.firstRunHeader}</h2>

      {/* ── CE-38 SEAL ② · R-37.68-B AMENDED BY LABEL · ORDER IS DESK · ASK · LINK ──
          THE CONDITIONAL CARD IS LAST, AND THE REASON IS F-38.21. The link card renders
          only when a handle exists, and the handle is not in the session — so on a device's
          FIRST load it cannot be known until the wire answers. Sitting between two
          unconditional cards, its arrival INSERTED itself and pushed everything below it
          down; the founder watched the feed jump. Last, its arrival APPENDS, and nothing
          moves.

          THE RULED SEQUENCE SURVIVES THE MOVE, which is why the amendment is by label
          rather than a re-ruling: R-37.68-B orders the set by the vendor's own timeline —
          work reaches him, then he runs it. The desk is still first because it is how work
          arrives. The ask is how he runs it. The link is the one card whose EXISTENCE is
          conditional, and a conditional member of an ordered set belongs at its end for the
          same reason a nullable column goes last in a wire shape: everything before it can
          be laid out without knowing the answer. */}

      {/* 1 · work reaches him */}
      <article className="wl-card wl-card-lead">
        <h3 className="wl-cardtitle">{COPY.cardDeskTitle}</h3>
        <p className="wl-cardbody">{COPY.cardDeskBody}</p>
        <button type="button" className="wl-cardaction"
                onClick={() => openWa(waNumberFor('vendor'), 'Hi')}>{COPY.cardDeskAction}</button>
      </article>

      {/* 2 · and he runs it from where he already is. R-38.17: NO BODY. The chips are the
          demonstration and the eyebrow says what they are for. */}
      <article className="wl-card">
        <h3 className="wl-cardtitle">{COPY.cardAskTitle}</h3>
        <div className="wl-chipeyebrow">{COPY.cardAskChipsEyebrow}</div>
        <div className="wl-chips">
          {COPY.cardAskChips.map((c) => <span className="wl-chip" key={c}>{c}</span>)}
        </div>
      </article>

      {/* 3 · the conditional one, last by ruling. Hidden ENTIRELY when no handle is set
          (R-37.68 ④): a share action with nothing behind it is the never-404 failure
          wearing a different coat. */}
      {tdwLink && (
        <article className="wl-card">
          <h3 className="wl-cardtitle">{COPY.cardLinkTitle}</h3>

          {/* ── ⚠ WITHHELD BY RULE · CE-38 S2/2 RELAY #2, ARM (a) ────────────────────
              R-38.17 rules this card's body to be THE ADDRESS: `thedreamwedding.in/v/<handle>`
              at t3, tabular. The row below is the ruled markup and it is commented out,
              because `/v/` IS A 404 TODAY.

              F-38.30, and the P0-B seat filed the same fact independently as F-19.14: no
              per-vendor public URL exists anywhere in the estate, `middleware.ts` rewrites
              on demo hosts only with no wildcard handle map, and `tdw_referral_invite` is
              APPROVED at Meta pointing at `/v/`. Shipping the address would put a dead
              address on the vendor's own first-run card and replace a working affordance
              with one that never-404 forbids.

              THE UNCOMMENT STEP, DATED AND EXACT — nothing to infer:
                WHEN: TDW_19 P0-B step 4 lands `/v/<code>` as a 200 holding page.
                DO:   delete this comment block and the two markers around the div below;
                      change `SHARE_URL` to `'https://' + COPY.cardLinkAddressBase + handle`.
                      Nothing else in this file moves.

              Until then Copy and Share carry the wa.me link the card has always carried,
              which routes and which the vendor is already using.

          <div className="wl-cardaddr">{COPY.cardLinkAddressBase}{handle}</div>

              ── end withheld row ────────────────────────────────────────────────── */}

          <div className="wl-cardactions">
            <button type="button" className="wl-cardaction" onClick={() => {
              navigator.clipboard?.writeText(tdwLink);
              setCopied(true);
            }}>{copied ? COPY.cardLinkCopied : COPY.cardLinkAction}</button>
            <button type="button" className="wl-cardaction" onClick={() => {
              // `navigator.share` is absent on desktop and on some in-app browsers. Falling
              // back to the clipboard means the control always does something rather than
              // being a button that works on the founder's phone and nowhere else.
              if (navigator.share) navigator.share({ url: tdwLink }).catch(() => { /* dismissed */ });
              else { navigator.clipboard?.writeText(tdwLink); setCopied(true); }
            }}>{COPY.cardLinkShare}</button>
          </div>
        </article>
      )}

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
/* R-38.17: the chip eyebrow. Same rung and tracking as every other section eyebrow in the
   shell — the two permitted homes for letter-spaced uppercase are the nav seats and
   section eyebrows, and this is the second kind. */
.wl-chipeyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
/* THE ADDRESS ROW's rule ships while its markup is withheld, and that is deliberate: the
   uncomment step is one comment block, not a comment block plus a stylesheet edit nobody
   wrote down. t3, tabular figures — an address is read character by character. */
.wl-cardaddr{font:var(--wl-t3);font-variant-numeric:tabular-nums;color:var(--atelier-ink);word-break:break-all;margin:0 0 4px}
.wl-cardactions{display:flex;gap:8px}
.wl-chips{display:flex;flex-wrap:wrap;gap:8px}
/* R-37.73 ①: the chips are read, not tapped, in Phase 1 — but they are chip-shaped and a
   chip-shaped thing invites a thumb, so they carry a real target rather than teaching that
   some chips are dead. */
.wl-chip{display:flex;align-items:center;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:2px;padding:10px 12px;font:var(--wl-t4);color:var(--atelier-ink-dim)}
`;
