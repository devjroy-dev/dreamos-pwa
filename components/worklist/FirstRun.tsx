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
  // ── ⚠ RE-WITHHELD · CE-38 S3 · c-38.28 ───────────────────────────────────
  //
  // AT a22e391 THIS WAS `pathAddressFor(handle)` AND BOTH ACTIONS CARRIED IT. It is back
  // to the wa.me deep link, and the reversal is not a change of mind about the design —
  // R-38.17 still rules the card's body to be the address. It is a change of mind about
  // whether the CONDITION had arrived.
  //
  // WHAT THE SEAT GOT WRONG, WRITTEN HERE SO THE NEXT ONE DOES NOT REPEAT IT: the trigger
  // said 「/v/<code> lands as a 200」. The seat ran `git ls-tree origin/worklist app/v`,
  // found the route, and called it fired. That answers 「is the route in this branch」.
  // The address is the PRODUCTION apex — it has to be, a vendor pastes it into a bio —
  // so the only branch that can discharge it is the one production serves, which is
  // `main`, which has never carried `app/v`. Derived by command, not recalled:
  // `git ls-tree --name-only -r origin/main app/v` returns nothing.
  //
  // The founder tapped Copy, opened what it gave him, and got a 404 off his own first-run
  // card — never-404 breached by the very commit that discharged a withholding written to
  // prevent it.
  //
  // Until the condition truly arrives, Copy and Share carry the wa.me link, which routes.
  // A working affordance with no visible address is the founder's original F-38.40
  // complaint and it is the RULED trade: a control that works beats an address that does
  // not.
  const tdwLink = handle ? `https://wa.me/${waNumberFor('vendor')}?text=${encodeURIComponent('TDW-' + handle)}` : null;

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
      {tdwLink && (
        <article className="wl-card">
          <h3 className="wl-cardtitle">{COPY.cardLinkTitle}</h3>

          {/* ── ⚠ RE-WITHHELD BY RULE · CE-38 S3 · c-38.28 ───────────────────────────
              R-38.17 rules this card's body to be THE ADDRESS. The row below is the ruled
              markup and it is commented out again, because `/v/` IS STILL A 404 IN
              PRODUCTION — see the note at `tdwLink` above for how the first discharge
              answered the wrong question.

              THE CONDITION IS A COMMAND NOW, NOT A SENTENCE. A sentence about a milestone
              can be read as satisfied by anything that resembles it; a command has one
              output and no interpretation:

                curl -sS -o /dev/null -w '%{http_code}\n' https://thedreamwedding.in/v/DEV440

              DISCHARGE ONLY ON 200. Not on the route existing in a branch, not on a
              preview deploy answering, not on a merge being scheduled.

              DO, in one commit: delete this comment block and the markers around the div;
              uncomment the `.wl-cardaddr` rule in FR_CSS; change `tdwLink` to
              `pathAddressFor(handle)` and prefix it with `https://` for the two actions;
              gate the card on `handle`. `pathAddressFor` is imported from
              '@/lib/solutions/types' and is the ONE home for a vendor's address (F-38.49)
              — no address literal returns to this file or to copy.ts.

          <div className="wl-cardaddr">{pathAddressFor(handle)}</div>

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
// ── ⚠ THE ADDRESS ROW'S RULE IS PARKED AGAIN · CE-38 S3 · c-38.28 ──────────
// It rode home with its markup at a22e391 and goes back with it. Parked HERE, in JS
// comment space, and never inside the literal below: a CSS comment inside a template
// literal SHIPS, so the class would still be declared and the audit's byte-strict
// dead-rule sweep would fire on a rule with no consumer.
//
// ⚠ AND NO BACKTICKS IN THIS FILE'S CSS COMMENTS. One around a property name closed
// FR_CSS mid-comment when the rule was last uncommented, and tsc reported the damage four
// lines later. Cost an edit; recorded so it costs nobody else one.
//
//   WHEN:  curl -sS -o /dev/null -w '%{http_code}\n' https://thedreamwedding.in/v/DEV440
//   ONLY ON 200. DO: paste the rule back below and re-open the address row above — two
//   uncomments and one retarget, one commit. The address comes from `pathAddressFor`
//   (F-38.49's one home), never from a literal here or in copy.ts.
//
//   .wl-cardaddr{font:var(--wl-t3);font-variant-numeric:tabular-nums;color:var(--atelier-ink);word-break:break-all;margin:0 0 4px}
//
// t3 with tabular figures: an address is read character by character, not scanned.
const FR_CSS = `
/* ── F-38.58 · THIS RULE TOOK BACK THE SHELL’S GUTTER FOR THE WHOLE ARC ──────
   It read \`padding:0 0 24px\`. The shorthand sets padding-left and padding-right to ZERO,
   and \`.wl-main > *{padding-left:var(--wl-gutter)}\` has the SAME specificity (0,1,0) — so
   source order decided it, this stylesheet mounts after the shell’s, and the first-run
   region painted at x=0 on every device since the gutter law landed at ZIP9.

   THE CARDS HID IT. \`.wl-card\` carries its own 16px padding, so a card sitting at x=0
   puts its title at 16.5 — half a pixel off the house edge, which reads as correct to the
   eye and to any cell measuring card INTERIORS. Only the eyebrow, which has no padding of
   its own, sat where the container actually was. C-R7a gained the eyebrow at H-1(b) and
   named it in one run.

   \`padding-bottom\` alone now, so the region inherits the column’s gutter like every other
   direct child. The eyebrow lands at the house edge (16) per the standing ruling, and the
   cards move to 16 with their interiors at 32.5 — which is where every OTHER card in the
   shell already sits (\`.wl-billcard\` measures at the house edge in C-R7a today). */
.wl-fr{padding-bottom:24px}
/* R-38.4: a section eyebrow at t5, .08em. Was 11px Jost at .2em. */
.wl-frhead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:24px 0 8px}
/* R-38.17: the chip eyebrow. Same rung and tracking as every other section eyebrow in the
   shell — the two permitted homes for letter-spaced uppercase are the nav seats and
   section eyebrows, and this is the second kind. */
.wl-chipeyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px}
.wl-cardactions{display:flex;gap:8px}
.wl-chips{display:flex;flex-wrap:wrap;gap:8px}
/* R-37.73 ①: the chips are read, not tapped, in Phase 1 — but they are chip-shaped and a
   chip-shaped thing invites a thumb, so they carry a real target rather than teaching that
   some chips are dead. */
.wl-chip{display:flex;align-items:center;min-height:44px;border:.5px solid var(--atelier-card-border);border-radius:2px;padding:10px 12px;font:var(--wl-t4);color:var(--atelier-ink-dim)}
`;
