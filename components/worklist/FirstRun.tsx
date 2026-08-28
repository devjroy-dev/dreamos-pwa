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
  const { handle, settled } = useVendorHandle();
  // ── CE-38 S3 · BOTH ACTIONS ACT ON THE ADDRESS THE CARD SHOWS ─────────────
  //
  // Until the withholding was discharged, Copy and Share carried a `wa.me` deep link while
  // the card showed no address at all — which is the founder's walk finding in one
  // sentence: two buttons and nothing to read. A control that copies something the surface
  // never displayed is a control the vendor cannot check, and he finds out what it did
  // after it is already in his bio.
  //
  // THE SCHEME IS ADDED HERE AND NOWHERE ELSE. `cardLinkAddressBase` is the displayed
  // bytes; `https://` is what a clipboard needs and an eye does not. One derivation, so the
  // address on screen and the address on the clipboard cannot drift apart.
  //
  // THE GATE BELOW IS `handle`, NOT A DERIVED URL. It used to be this binding, which meant
  // a `wa.me` string was computed for the sole purpose of deciding whether to render a card
  // about a DIFFERENT address. The card's real precondition has always been R-37.68 ④ — no
  // handle, no card, because a share action with nothing behind it is never-404's failure
  // in another coat — and the gate now says that in its own words.
  const shareUrl = handle ? 'https://' + COPY.cardLinkAddressBase + handle : null;

  // ── THE SET PAINTS ATOMICALLY · CE-38 S2/2 RELAY #3 ITEM 3 ─────────────────
  //
  // NOTHING HERE RENDERS UNTIL THE SHELL'S ONE /me HAS RESOLVED. Not the eyebrow, not the
  // two unconditional cards, nothing.
  //
  // WHY THE ORDERING CURE WAS NOT ENOUGH. CE-38 SEAL (2) put the conditional card LAST so
  // its arrival would append instead of insert, and F-38.21's cache made the second load
  // paint it immediately. Both were re-timings. On the real deploy, with the seeded cache
  // deleted, the handle now arrives WITH /me — and dark's first paint lost that race while
  // light won it. The same tree painted two different feeds in one run, which is the thing
  // a re-timing can always still do.
  //
  // SO THE RACE IS RETIRED RATHER THAN RE-TIMED. The question is already in flight — it is
  // the one read C-R16 asserts — so waiting for it costs no round trip and buys the
  // property R-37.68-B actually wanted: the vendor sees a feed once, whole, in ruled order.
  // An empty region for one wire read is a surface that has not started; a region that
  // paints twice is a surface arguing with itself.
  if (!settled) return null;

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
      {shareUrl && (
        <article className="wl-card">
          <h3 className="wl-cardtitle">{COPY.cardLinkTitle}</h3>

          {/* R-38.17: THE BODY IS THE ADDRESS. No sentence explains it — a sentence
              explaining an address the vendor can read is the product narrating itself.
              t3 with tabular figures, because an address is read character by character
              rather than scanned. */}
          <div className="wl-cardaddr">{COPY.cardLinkAddressBase}{handle}</div>

          <div className="wl-cardactions">
            <button type="button" className="wl-cardaction" onClick={() => {
              navigator.clipboard?.writeText(shareUrl);
              setCopied(true);
            }}>{copied ? COPY.cardLinkCopied : COPY.cardLinkAction}</button>
            <button type="button" className="wl-cardaction" onClick={() => {
              // `navigator.share` is absent on desktop and on some in-app browsers. Falling
              // back to the clipboard means the control always does something rather than
              // being a button that works on the founder's phone and nowhere else.
              if (navigator.share) navigator.share({ url: shareUrl }).catch(() => { /* dismissed */ });
              else { navigator.clipboard?.writeText(shareUrl); setCopied(true); }
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
// THE ADDRESS ROW'S RULE CAME HOME WITH ITS MARKUP AT CE-38 S3. It was parked in JS
// comment space rather than inside the literal below, because a CSS comment inside a
// template literal SHIPS — the class would still have been declared and the audit's
// byte-strict dead-rule sweep would still have fired on a rule with no consumer. That
// parking is discharged: the rule is live in FR_CSS and its consumer is the row above.
const FR_CSS = `
.wl-fr{padding:0 0 24px}
/* R-38.4: a section eyebrow at t5, .08em. Was 11px Jost at .2em. */
.wl-frhead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:24px 0 8px}
/* R-38.17: the chip eyebrow. Same rung and tracking as every other section eyebrow in the
   shell — the two permitted homes for letter-spaced uppercase are the nav seats and
   section eyebrows, and this is the second kind. */
.wl-chipeyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
/* R-38.17: t3 with tabular figures. An address is read character by character rather
   than scanned, and the break rule keeps a long handle inside the card instead of pushing
   the card wider than the gutter. NO BACKTICKS IN THIS LITERAL — one around a property
   name closed FR_CSS mid-comment on the first cut and tsc reported it four lines later. */
.wl-cardaddr{font:var(--wl-t3);font-variant-numeric:tabular-nums;color:var(--atelier-ink);word-break:break-all;margin:0 0 4px}
.wl-cardactions{display:flex;gap:8px}
.wl-chips{display:flex;flex-wrap:wrap;gap:8px}
/* R-37.73 ①: the chips are read, not tapped, in Phase 1 — but they are chip-shaped and a
   chip-shaped thing invites a thumb, so they carry a real target rather than teaching that
   some chips are dead. */
.wl-chip{display:flex;align-items:center;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:2px;padding:10px 12px;font:var(--wl-t4);color:var(--atelier-ink-dim)}
`;
