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
import { TodayCards, TodayResting, TodayDone } from '@/components/worklist/TodayCards';
import { COPY } from '@/lib/worklist/copy';
import { useTodayFeed } from '@/lib/worklist/feed';

// Derived at render, never a fixture. Locale pinned so the string cannot drift with the
// runtime's ICU data — the same reason the estate pins its own date formatters.
const DATE_LINE = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export default function TodayPage() {
  // ── R-38.17 as amended at c-38.14 · THE MASTHEAD REPORTS THE INSTRUMENT ────
  // The reader landed at Phase 4 and this component did not change shape, exactly as the
  // Phase 1 comment promised: same gate, same two bytes, same one home for the fact.
  const feed = useTodayFeed();
  const today = feed.today;
  // NO `?? 0` ON THIS SURFACE, and C34 is the cell that holds the line. A fallback zero
  // reads as harmless — it feeds a predicate, not the numeral — but the whole of F-38.31
  // is that an unmeasured 0 is a claim in digits, and a file that spells one anywhere
  // invites the next reader to spell it in the render. The predicates read the nullable.

  // THE THREE STATES, AND WHY THERE ARE THREE RATHER THAN THE TWO THE PARKED STEP NAMED.
  // The withheld instruction at Phase 1 read `{feed.responded ? todayNothingYet :
  // todayNotLive}` — written when the only two states were 「no reading」 and 「a reading」,
  // because no reading had ever come back and an empty one was the only kind imagined.
  // A live feed has three: no reading, a reading with nothing in it, and a reading with
  // work in it. Printing 「Nothing needs you yet.」 above eleven cards is the F-38.31 lie
  // with the sign flipped, so the third arm carries NO STATUS LINE and the numeral is the
  // status — which keeps the delivery at zero new bytes, per the copy ruling.
  // DISCLOSED as a correction rather than executed quietly: the parked step's two-arm
  // ternary is not what shipped.
  const firstRun = feed.responded && today !== null && today.has_any === false;
  const resting  = feed.responded && today !== null && today.has_any === true && feed.openItems === 0;
  const working  = feed.responded && today !== null && feed.openItems !== null && feed.openItems > 0;

  return (
    <WorklistShell title={COPY.navToday}>
      <section className="wl-masthead">
        <div className="wl-mdate">{DATE_LINE}</div>
        {/* THE NUMERAL IS GATED, NOT DEFAULTED TO ZERO. A `0` that no instrument produced
            is 「Nothing needs you yet」 written in digits, and F-38.31 convicted the
            sentence. The gate is the same expression Phase 1 shipped; what changed is
            that `openItems` can now be a real number. */}
        {feed.responded && feed.openItems !== null && (
          <div className="wl-mcount">
            <span className="wl-mnum">{feed.openItems}</span>
            <span className="wl-mcap">{COPY.todayCountCaption}</span>
          </div>
        )}
        {/* R-38.4: ONE t1 PER SURFACE, and the status is Today's — on the two states that
            have something to say about the instrument. On the working state the cards say
            it, and a heading over them would be a third claim about the same fact. */}
        {!feed.responded && <h1 className="wl-status">{COPY.todayNotLive}</h1>}
        {resting && <h1 className="wl-status">{COPY.todayNothingYet}</h1>}
        <div className="wl-mrule" />
      </section>

      {/* §3 property 6 · `has_any` answers 「has this vendor ever had anything」, not
          「is today busy」. The manual on a quiet day is the thing that ruling exists to
          prevent, so FirstRun is gated on the FALSE and never on an empty list. Before the
          reading settles it renders nothing: we do not yet know which state this is, and
          guessing would put the manual in front of a vendor with eleven leads. */}
      {firstRun && <FirstRun />}
      {resting && today && <TodayResting today={today} />}
      {working && today && <TodayCards today={today} />}
      {/* F-39.18 (3), RULED. `done_today` was on the wire in both states and read in one,
          so a vendor with eleven leads saw only what she owed and no evidence of anything
          she finished — a queue, not a morning brief. Same three keys, same summary form,
          beneath the attention sections. No status byte over it: 「All clear.」 above the
          cards that disprove it is F-38.31 with the sign flipped. */}
      {working && today && <TodayDone today={today} />}
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
/* ✔ THE MASTHEAD TRIO IS RESTORED AT PHASE 4. It was parked in a JSX comment rather
   than commented inside this literal, because a CSS comment inside the template SHIPS
   and the audit's dead-rule sweep is byte-strict with no annotation escape hatch.
   font-variant-numeric is declared AFTER the shorthand deliberately: the font shorthand
   RESETS it, and figures set before that line are silently thrown away.

   ── F-39.15 · lining-nums IS THE HALF THAT WAS MISSING, AND IT WAS THE LOUD HALF ──
   NO BACKTICKS IN THIS BLOCK. It is inside a JS template literal and a backtick written
   around a token while explaining that token ends the literal. This comment was written
   with three of them, tsc caught it, and it is the EIGHTH instance in this estate — the
   seventh was in RoomsGrid, in this same delivery, four hours ago. Disclosed as s-39.7:
   the habit is quoting an identifier by reflex while writing prose about CSS.

   This rung resolves to the feature family, which is Cormorant Garamond, and CORMORANT
   SHIPS OLDSTYLE FIGURES BY DEFAULT. Its oldstyle one is a bare stem with no flag and no
   foot, so at 46px the founder's eleven leads painted as two capital I's. Tabular alone
   fixes column drift and says nothing about figure STYLE; the numeral needs both.

   WHY TWO PHASES OF REVIEW COULD NOT SEE IT, kept because the next ratified mock will have
   the same blind spot: the mock's numeral is 0, and zero is the one digit that is
   identical in oldstyle and lining. Then R-38.17 withheld the numeral, so it never
   painted. The first time this rung rendered a digit other than zero was on the founder's
   screen, and it was unreadable. A mock cannot prove a glyph set with a zero in it. */
.wl-mcount{display:flex;align-items:baseline;gap:8px;margin-top:8px}
.wl-mnum{font:var(--wl-t0);color:var(--atelier-ink)}
.wl-mnum{font-variant-numeric:lining-nums tabular-nums}
.wl-mcap{font:var(--wl-t5);color:var(--atelier-ink-dim)}
.wl-status{font:var(--wl-t1);color:var(--atelier-ink);margin:8px 0 0}
.wl-mrule{height:.5px;background:var(--role-metal);opacity:.55;margin-top:16px}
      `}</style>
    </WorklistShell>
  );
}
