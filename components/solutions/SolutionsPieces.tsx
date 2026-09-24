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
//   t1  Cormorant  page title, at most one per surface  <- .sol-title
//                  ⚠ CORRECTED AT R-42.17 (F-42.212). This line used to say the
//                  t1 was OWNED BY WorklistShell. It was false when written: the
//                  shell renders its `title` at t5 in the header seat
//                  (WorklistShell.tsx `.wl-lbl`, since cebf47ab), and renders
//                  no t1 at all. The surface's one t1 is `.sol-title`, declared
//                  ONCE below; `bs_audit` C18 counts it.
//   t2  DM Sans    section heading                    <- our headers
//   t3  DM Sans    body, row primary
//   t4  DM Sans    row secondary, buttons
//   t5  DM Sans    captions, eyebrows                 <- our eyebrows, .sol-kicker, .sol-subhead
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
 * One row of the Business Solutions index — and, since R-42.12 amended, a door
 * on any Solutions screen (`/vendor/dates` uses it for the Storefront row).
 *
 * ⚠ EVERY ROW IS A LINK, AND `href` IS REQUIRED. R-42.12 AMENDED, S5(b).
 * This component used to render a `<div>` when there was no destination, on
 * s-G11.2's "absent, not greyed" reading of the ratified `W5-hub` frame. The
 * founder ruled the opposite shape on 2026-09-10: a vendor joining today taps
 * any row and lands on a screen that says what the capability is; nothing on
 * this surface is inert. With no row left lacking a destination, the `<div>`
 * branch retired rather than surviving as a guard — `support/page.tsx` types
 * `ROOM_HREFS` as `Record<RoomKey, string>`, so a destination-less row is now a
 * `tsc` error before it is ever a dead tap. A guard that lives in the type is a
 * guard that cannot be skipped by a caller who forgets to pass something.
 *
 * ⚠ THE CHIP TRACKS `preview`, NOT THE HREF. S4(c): a row that routes to a
 * screen whose act cannot run yet reads `Coming` (register §1a, approved), and
 * every other row reads `Open` (Arm C, founder-vetoed 2026-09-05). The set that
 * decides is `PREVIEW_KEYS` in the hub; an entry leaves when the real room
 * lands. Defaulting to `false` means a new caller gets the honest `Open` for a
 * door that works — the set has to NAME a row to call it Coming.
 *
 * The two chips differ by INK as well as word — `Open` takes the accent, the
 * ink every live control on this shell already wears; `Coming` stays dim.
 */
export function RoomRow({
  href, label, desc, preview = false,
}: { href: string; label: string; desc?: string; preview?: boolean }) {
  // CE-45 FE-1: `desc` is the row's one line (ROW_DESC, R-45.20), read from its home by the
  // caller; absent, the row draws exactly as before.
  return (
    <Link href={href} className="sol-row" data-row-href={href}>
      <span className="sol-rowtext">
        <span className="sol-rowlabel">{label}</span>
        {desc ? <span className="sol-rowdesc">{desc}</span> : null}
      </span>
      <StateChip state={preview ? 'coming' : 'open'} />
    </Link>
  );
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
   shrink (a flex item’s default min-width is auto, so it refuses to), and
   flex:0 0 auto takes the chip out of the negotiation entirely. */
/* ── F-40.42 · last-of-type COUNTS PER TAG NAME, AND THE ROWS ARE TWO TAGS ──
   This read last-of-type and the founder walked the consequence: no divider
   under Wedding pages, while every other pair had one.
   The mechanism, exactly: eight rows were div elements and the live row was an
   anchor (RoomRow rendered a Link only when there was a destination; since
   R-42.12 amended every row is one, and the rule below is still the right one).
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
/* CE-45 FE-1: the row’s one line (R-45.20). t4 and ink-mute, both already in theme.ts; no new rung, no new token. */
.sol-rowdesc{font:var(--wl-t4);color:var(--atelier-ink-mute)}
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

/* R-42.12 AMENDED · the shell screens (vetoed on the frames, 2026-09-10).
   .sol-can is the what-you-will-be-able-to-do list: a plain list with a dim mark,
   NOT .sol-item rows, because a bordered row beside a CTA reads as a door (the
   lesson of W5-hub facing the other way). .sol-aside is the line and the door beneath the
   CTA on /vendor/dates. Tokens only (R-42.6). No backticks and no straight apostrophes in this comment: it is inside a
   template literal, and b40 C102 reads that as a shipped byte. */
/* R-42.17 · THE HIERARCHY (chair mock docs/mocks/solutions-hierarchy-mock.html, amended to the tree).
   The lede, the can-do lines and the aside line were all t3 and nothing on the surface was a
   heading, so the screen read as one paragraph with a button in it. Four existing rungs now do
   the work theme.ts defines them for, and the three t3 roles keep their bytes:
   .sol-kicker is the room eyebrow, t5 uppercase at .08em in ink-dim (theme.ts: section eyebrows).
   .sol-title is the one t1 on the surface, reading the same byte the shell seat shows (A1, the
   Advisor precedent). .sol-subhead heads the can-do list, and now carries the space above the
   list, so .sol-can margin goes 16px 0 0 to 0. The hub eyebrow .sol-eyebrow stays at ink-mute,
   untouched (B1). No backticks and no straight apostrophes here: b40 C102 reads this literal. */
.sol-kicker{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-dim);margin:0 0 6px}
.sol-title{font:var(--wl-t1);color:var(--atelier-ink);margin:0 0 10px}
.sol-subhead{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-dim);margin:24px 0 10px}
.sol-can{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;max-width:46ch}
.sol-can li{position:relative;padding-left:16px;font:var(--wl-t3);color:var(--atelier-ink)}
.sol-can li::before{content:"";position:absolute;left:2px;top:.62em;width:5px;height:5px;border-radius:50%;background:var(--atelier-ink-dim)}
.sol-aside{display:flex;flex-direction:column;margin-top:28px;padding-top:16px;border-top:.5px solid var(--atelier-card-border)}
.sol-asideline{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}

@media (prefers-reduced-motion: reduce){.sol-row,.sol-btn{transition:none}}
    `}</style>
  );
}
