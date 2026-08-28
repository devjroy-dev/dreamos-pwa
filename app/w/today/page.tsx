"use client";
// app/w/today/page.tsx — TODAY, Phase 1.
//
// IT READS NOTHING, AND IT SAYS SO. `todayNotLive` states that the instrument is not
// running; it does NOT say the reading is zero. 「All clear」 here would assert an absence
// never checked — the same class as a control reporting a success it did not perform.
//
// ── R-38.4 · THE ONE t0 IN THE APP ──────────────────────────────────────────
// The masthead numeral is the single named exception to the five-rung scale, ruled at
// CE-38 relay #1 after this seat filed the collision: R-37.88's ratified mock — the one
// §0 hash-gates — is built on Italiana at 46px, and a bare "⊆ five rungs" cell would have
// reddened the design it was written to protect. t0 is 46/.95 Cormorant 500, one element
// per app.
//
// ⚠ AND TODAY IT DOES NOT PAINT. R-38.17 as amended at c-38.14 gates the numeral on the
// feed having answered, and no feed exists yet — so t0's RULE ships (it is this surface's
// styling and this surface's alone, which is what wl_audit's t0 cell asserts) while no
// element consumes it. The render arm's C-R17 asserts the absence on glass. Two different
// claims, deliberately in two different instruments: one about where the rung lives, one
// about whether it is being painted.
//
// ITALIANA RETIRES WITH JOST. The numeral changes family, not stature.
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { FirstRun } from '@/components/worklist/FirstRun';
import { COPY } from '@/lib/worklist/copy';
import { todayFeed } from '@/lib/worklist/feed';

// Derived at render, never a fixture. Locale pinned so the string cannot drift with the
// runtime's ICU data — the same reason the estate pins its own date formatters.
const DATE_LINE = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export default function TodayPage() {
  // ── R-38.17 as amended at c-38.14 · THE MASTHEAD REPORTS THE INSTRUMENT ────
  // Both arms are live code and neither is a placeholder: `todayFeed()` returns the true
  // answer for today, which is that nothing has read anything. When Phase 4 wires it, this
  // component does not change.
  const feed = todayFeed();
  return (
    <WorklistShell title={COPY.navToday}>
      <section className="wl-masthead">
        <div className="wl-mdate">{DATE_LINE}</div>
        {/* THE NUMERAL IS GATED, NOT DEFAULTED TO ZERO. A `0` that no instrument produced
            is 「Nothing needs you yet」 written in digits, and F-38.31 convicted the
            sentence. Rendering `feed.openItems ?? 0` would have kept the claim while
            passing every cell about the sentence — the cosmetic cure this gate refuses. */}
        {feed.responded && feed.openItems !== null && (
          <div className="wl-mcount">
            <span className="wl-mnum">{feed.openItems}</span>
            <span className="wl-mcap">{COPY.todayCountCaption}</span>
          </div>
        )}
        {/* R-38.4: ONE t1 PER SURFACE, and the status is Today's. It was a page title
            (`todayTitle`) over a masthead that already names the day — two lines where the
            surface needed one, and neither of them said what state Today was in. */}
        {/* ── ⚠ THE TRUE-EMPTY ARM IS WITHHELD WITH ITS BYTE · relay #3 item 2 ────
            This shipped as a live ternary and I argued for it: both arms live code, neither
            a placeholder, the bench able to reach both. THE CHAIR'S RULING SUPERSEDES THAT
            REASONING AND IS RIGHT — a live arm needs a live byte, a live byte ships, and
            `Nothing needs you yet.` must not reach a vendor before something has read her
            work. The arm cannot outlive the withholding of the thing it renders.

            WHEN: Phase 4's feed first answers 200 — the same edit that uncomments
                  COPY.todayNothingYet, restores the masthead trio's CSS, and drops the byte
                  from wl_audit's RETIRED set.
            DO:   replace the line below with:

                  {feed.responded ? COPY.todayNothingYet : COPY.todayNotLive}

            The numeral's markup above stays live and gated: it renders no withheld byte,
            and it is the half of F-38.31 that a later reader is most likely to "fix" back
            into a default if it is not sitting here in working code. */}
        <h1 className="wl-status">{COPY.todayNotLive}</h1>
        <div className="wl-mrule" />
      </section>

      <FirstRun />
      {/* ── ⚠ THE MASTHEAD TRIO IS WITHHELD BY RULE · relay #3 item 2 ─────────────
          The numeral's three rules shipped while its markup was gated on a feed that does
          not exist, so the audit's dead-rule sweep found three declarations with no
          consumer and reddened, correctly.

          THEY ARE PARKED IN THIS JSX COMMENT AND NOT COMMENTED INSIDE THE STYLE BLOCK, and
          the distinction is the whole of the lesson: a CSS comment inside the template
          literal SHIPS. The class names would still be in the served bytes, the sweep would
          still see three declarations, and the sweep is byte-strict with no annotation
          escape hatch. ZIP 14 (8) convicted this exact move in the other direction — a
          retirement comment naming the classes it retired. A withheld rule has to actually
          not be there.

          WHEN: Phase 4's feed first answers 200 (lib/worklist/feed.ts, the same edit that
                uncomments COPY.todayNothingYet).
          DO:   paste the three rules below back into the style block, above wl-status.

          .wl-mcount{display:flex;align-items:baseline;gap:8px;margin-top:8px}
          .wl-mnum{font:var(--wl-t0);color:var(--atelier-ink)}
          .wl-mnum{font-variant-numeric:tabular-nums}
          .wl-mcap{font:var(--wl-t5);color:var(--atelier-ink-dim)}

          The t0 note, kept with the rule it explains: font-variant-numeric is declared
          AFTER the shorthand deliberately, because the font shorthand RESETS it and
          tabular figures set before that line would be silently thrown away. R-38.5 asks
          every right-aligned figure to be tabular; the numeral is left-aligned and
          single-digit at first, and carries the setting anyway so the feed's two- and
          three-digit counts do not jump the caption sideways. */}
      <style>{`
/* R-37.82 (1): the column owns the gutter. Nothing here sets a horizontal inset. */
.wl-masthead{padding-top:20px}
.wl-mdate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
/* THE STATUS IS THE SURFACE'S t1. The four rules that carried todayTitle, todayEmpty,
   todayEmptyAction and todayNotLive-at-t5 retire with the bytes R-38.17 cut, because a
   class whose only consumer has been deleted is the wl-plink disease in CSS.
   NO BACKTICKS AND NO CODE MARKS IN THIS BLOCK: it is inside a JS template literal, and a
   backtick written around a selector while explaining that selector ends the literal. The
   estate has paid for this five times now; the sixth was this comment, caught by tsc. */
.wl-status{font:var(--wl-t1);color:var(--atelier-ink);margin:8px 0 0}
.wl-mrule{height:.5px;background:var(--role-metal);opacity:.55;margin-top:16px}
      `}</style>
    </WorklistShell>
  );
}
