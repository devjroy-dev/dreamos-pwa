"use client";
// components/solutions/SolutionsPieces.tsx — TDW_19 P0-B · THE SHARED CHROME.
//
// ═══════════════════════════════════════════════════════════════════════════
// R-38.2 IS THE LAW HERE, AND BILLING PAID FOR IT
// ═══════════════════════════════════════════════════════════════════════════
// `app/w/billing/page.tsx` carries the lesson in its own comments: a surface
// that flashes a loading word and then a card is two paints where one will do.
// **The FRAME renders immediately; the VALUES arrive with the fetch.** And the
// frame renders on the ERROR path too — a vendor whose call failed sees her own
// page with the reading missing and a sentence saying so, not a bare red line on
// an empty screen. The chrome is a fact about the product; the values are a fact
// about the fetch, and only the second one failed.
//
// That was found by the render arm, not by reading — Billing's first cut gated
// the whole surface on `!loading` and the instrument had nothing to hold a ruler
// against. `SurfaceFrame` below exists so these six surfaces inherit the cure
// rather than rediscover it six times.
//
// ── THE RUNGS, RE-DERIVED AT `7142cbf` (lib/worklist/theme.ts:46-51) ───────
//   t0  Cormorant  ONE ELEMENT PER APP — the Today masthead numeral.
//                  ⚠ NO SURFACE IN THIS FILE MAY TOUCH IT.
//   t1  Cormorant  page title, at most one per surface — owned by WorklistShell.
//   t2  DM Sans    section heading                    <- our headers
//   t3  DM Sans    body, row primary
//   t4  DM Sans    row secondary, buttons
//   t5  DM Sans    captions, eyebrows                 <- our eyebrows
// Letter-spaced uppercase in TWO PLACES ONLY: nav seats (t4) and section
// eyebrows (t5). Nothing here spends it anywhere else.

import Link from 'next/link';
import { CHIPS, type ChipKey } from '@/lib/solutions/copy';

/**
 * The state chip. Its text comes from `CHIPS` and nowhere else — a chip that
 * built its own string would be a second copy home the founder's one pass never
 * sees.
 *
 * `coming` is the one chip beyond spec §9's approved six (R-19.5 needs a word
 * for a row whose env gate is closed, and `Not connected` would tell a vendor
 * she can connect something she cannot). It is styled DIMMER than the others on
 * purpose: it is the only chip that describes us rather than her.
 */
export function StateChip({ state }: { state: ChipKey }) {
  return (
    <span className={`sol-chip sol-chip--${state}`} data-state={state}>
      {CHIPS[state]}
    </span>
  );
}

// ── SurfaceRow · RETIRED WITH ITS READERS (R-40.23) ────────────────────────
// It took an `eyebrow` and a `state` and was always a Link. The nine R-40.1
// rows carry no eyebrow, and eight of them have nowhere to go — so a component
// whose every prop was mandatory could not describe them without lying.
// `RoomRow` below replaces it. Retire with the reader; no commented corpse.

/**
 * One row of the Business Solutions index (R-40.1's nine).
 *
 * ⚠ A ROW WITH NO DESTINATION RENDERS AS A ROW, NEVER AS A DISABLED LINK.
 * Eight of the nine are not built yet. A `<Link>` to nowhere, or an `<a>` with
 * `aria-disabled`, both put a control under the thumb that answers nothing —
 * the s-G11.2 correction in the mock sitting made exactly this call about the
 * publish button, and the ruling was ABSENT, NOT GREYED. The ratified `W5-hub`
 * frame draws these eight as plain rows with a `Coming` chip, so a `<div>` is
 * what they are.
 *
 * ⚠ THE LIVE ROW CARRIES `Open`, AND THAT REVERSES THE MOCK — founder-ruled on
 * his walk, 2026-09-05. The frame drew it bare and the reasoning was sound on a
 * screenshot: a chip that says nothing is chrome. On glass it failed, because
 * beside eight `Coming` rows the one working row was the only one with nothing
 * on its right and read as a heading. The walk outranks the frame (R-39.15).
 *
 * The two chips differ by INK as well as word — `Open` takes the accent, the
 * ink every live control on this shell already wears; `Coming` stays dim. A
 * reader scanning the column sees one bright chip among eight quiet ones before
 * reading a single word.
 */
export function RoomRow({
  href, label,
}: { href?: string; label: string }) {
  const body = (
    <>
      <span className="sol-rowtext">
        <span className="sol-rowlabel">{label}</span>
      </span>
      <StateChip state={href ? 'open' : 'coming'} />
    </>
  );
  return href
    ? <Link href={href} className="sol-row">{body}</Link>
    : <div className="sol-row">{body}</div>;
}

/**
 * The frame every surface is built in.
 *
 * `error` renders as a fact beside the content, never instead of it — see the
 * header. There is deliberately NO `loading` branch that replaces children:
 * callers pass their frame as children unconditionally and let individual values
 * be null until they arrive.
 */
export function SurfaceFrame({
  heading, eyebrow, error, children,
}: { heading: string; eyebrow: string; error?: string | null; children: React.ReactNode }) {
  return (
    <section className="sol-surface">
      <p className="sol-eyebrow">{eyebrow}</p>
      <h2 className="sol-heading">{heading}</h2>
      {error ? <p className="sol-err">{error}</p> : null}
      {children}
    </section>
  );
}

/** The empty-state sentence. R-19.2: this is the product's real first state. */
export function SurfaceEmpty({ children }: { children: React.ReactNode }) {
  return <p className="sol-empty">{children}</p>;
}

/** A labelled figure. `value` is a STRING — money is formatted before it arrives. */
export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="sol-stat">
      <span className="sol-statvalue">{value}</span>
      <span className="sol-statlabel">{label}</span>
    </span>
  );
}

/**
 * The one stylesheet for all seven surfaces, mounted once per page.
 *
 * Every colour is an existing token, derived from the tree at `7142cbf` rather
 * than invented: a new literal here would bypass the variable layer exactly as
 * the hard-coded brass literals in `globals.css` did, which is the root cause
 * the worklist branch already paid to find once.
 */
export function SolutionsStyles() {
  return (
    <style>{`
.sol-rows{display:flex;flex-direction:column;padding-top:8px}
.sol-row{display:flex;align-items:center;justify-content:space-between;gap:12px;
  min-height:56px;padding:12px 0;text-decoration:none;
  border-bottom:.5px solid var(--atelier-card-border);touch-action:manipulation}
/* Founder walk: the Benchmarks chip clipped at the row edge. Two causes, both
   fixed here rather than by shortening the word. The label column could grow
   past its share, and the chip — being the flex item with the longest single
   token — was the one that lost. min-width:0 lets the text column actually
   shrink (a flex item's default min-width is auto, so it refuses to), and
   flex:0 0 auto takes the chip out of the negotiation entirely. */
/* ── F-40.42 · last-of-type COUNTS PER TAG NAME, AND THE ROWS ARE TWO TAGS ──
   This read last-of-type and the founder walked the consequence: no divider
   under Wedding pages, while every other pair had one.
   The mechanism, exactly: eight rows are div elements and the live row is an
   anchor (RoomRow renders a Link only when there is a destination).
   last-of-type matches the last sibling OF EACH ELEMENT TYPE, so the single
   anchor is both the first AND the last of its type and lost its border. The
   rule was correct for as long as all nine were Links; the div/Link split that
   made the eight non-tappable broke it silently, and no bench could see it
   because the CSS was still present and still valid.
   last-child asks the question actually intended: is this the last row.
   (No backticks in this comment: it lives inside a JS template literal. Third
   time this seat has made that mistake — e-5 owns the first.) */
.sol-row:last-child{border-bottom:none}
.sol-row:active{background:var(--atelier-row-hover)}
.sol-row:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.sol-rowtext{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1 1 auto}
.sol-rowlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.sol-roweyebrow{font:var(--wl-t5);color:var(--atelier-ink-mute);
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.sol-chip{font:var(--wl-t5);letter-spacing:.06em;text-transform:uppercase;
  white-space:nowrap;color:var(--atelier-ink-soft);flex:0 0 auto;
  border:.5px solid var(--atelier-input-border);border-radius:2px;padding:3px 7px}
.sol-chip--connected{color:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}
.sol-chip--live{color:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}
.sol-chip--needs_attention{color:var(--role-caution);border-color:var(--role-caution)}
.sol-chip--expired{color:var(--role-critical);border-color:var(--role-critical)}
/* The only chip that describes us rather than her — quietest of the seven. */
.sol-chip--coming{color:var(--atelier-ink-dim);border-color:var(--atelier-card-border)}
/* Founder-vetoed 2026-09-05. The accent, because this is the one row that goes
   somewhere; the dim chip beside it is the contrast that makes it read. */
.sol-chip--open{color:var(--atelier-accent-text);border-color:var(--atelier-accent-text)}

.sol-surface{display:flex;flex-direction:column;padding-top:16px;padding-bottom:28px}
.sol-eyebrow{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;
  color:var(--atelier-ink-mute);margin:0 0 6px}
.sol-heading{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 12px}
.sol-err{font:var(--wl-t3);color:var(--role-critical);margin:0 0 12px}
.sol-empty{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}

.sol-stats{display:flex;flex-wrap:wrap;gap:24px;margin:16px 0 0}
.sol-stat{display:flex;flex-direction:column;gap:2px}
.sol-statvalue{font:var(--wl-t2);color:var(--atelier-ink)}
.sol-statlabel{font:var(--wl-t5);letter-spacing:.06em;text-transform:uppercase;color:var(--atelier-ink-mute)}

.sol-list{display:flex;flex-direction:column;margin:16px 0 0}
.sol-item{display:flex;align-items:center;justify-content:space-between;gap:12px;
  min-height:48px;padding:10px 0;border-bottom:.5px solid var(--atelier-card-border)}
.sol-item:last-child{border-bottom:none}
.sol-itemlabel{font:var(--wl-t3);color:var(--atelier-ink)}
.sol-itemnote{font:var(--wl-t5);color:var(--atelier-ink-mute)}

.sol-actions{display:flex;gap:10px;margin:20px 0 0;flex-wrap:wrap}
.sol-btn{background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;
  cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);
  color:var(--atelier-accent-text);touch-action:manipulation}
.sol-btn:active{background:var(--atelier-row-hover)}
.sol-btn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
 /* F-19.20: the founder pressed a disabled button and nothing happened, so it
    did not read as disabled. Dimmed further and given not-allowed, and the
    surface prints COPY.withheldNote beside it — a withheld door must LOOK
    withheld, not merely behave that way. */
.sol-btn[disabled]{color:var(--atelier-ink-dim);border-color:var(--atelier-card-border);
  cursor:not-allowed;opacity:.55}
.sol-btn[disabled]:active{background:transparent}

.sol-addr{font:var(--wl-t3);color:var(--atelier-ink);margin:16px 0 0;word-break:break-all}
/* F-19.21: a RESERVED name, not a live address. Muted and not link-coloured, so
   nothing about it invites a tap that would land on DEPLOYMENT_NOT_FOUND. */
.sol-reserved{font:var(--wl-t3);color:var(--atelier-ink-mute);margin:14px 0 0;word-break:break-all}
.sol-note{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:8px 0 0;max-width:52ch}

.sol-footer{margin-top:28px;padding-top:20px;border-top:.5px solid var(--atelier-card-border);
  display:flex;flex-direction:column;align-items:flex-start;gap:12px}
.sol-footerbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}

@media (prefers-reduced-motion: reduce){.sol-row,.sol-btn{transition:none}}
    `}</style>
  );
}
