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
// per app, and the arm asserts it appears exactly here.
//
// ITALIANA RETIRES WITH JOST. The numeral changes family, not stature.
import Link from 'next/link';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { FirstRun } from '@/components/worklist/FirstRun';
import { COPY } from '@/lib/worklist/copy';

// Derived at render, never a fixture. Locale pinned so the string cannot drift with the
// runtime's ICU data — the same reason the estate pins its own date formatters.
const DATE_LINE = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export default function TodayPage() {
  return (
    <WorklistShell title={COPY.navToday}>
      <section className="wl-masthead">
        <div className="wl-mdate">{DATE_LINE}</div>
        <div className="wl-mcount">
          <span className="wl-mnum">0</span>
          <span className="wl-mcap">{COPY.todayCountCaption}</span>
        </div>
        <div className="wl-mrule" />
      </section>

      {/* R-38.4: ONE t1 PER SURFACE, and this is Today's. It was a two-clause paragraph
          (`todayPromise`) standing where a page title goes — the surface had no stature
          because its loudest line was an explanation. */}
      <h1 className="wl-title">{COPY.todayTitle}</h1>

      {/* R-38.6: an empty state is one sentence naming what will appear here, and one
          action. The honest line about the instrument keeps its own row beneath, at t5,
          because it is metadata about the reading rather than a promise about the feed. */}
      <p className="wl-empty">{COPY.todayEmpty}</p>
      <Link href="/w/rooms" className="wl-emptyaction">{COPY.todayEmptyAction}</Link>
      <p className="wl-notlive">{COPY.todayNotLive}</p>

      <FirstRun />
      <style>{`
/* R-37.82 (1): the column owns the gutter. Nothing here sets a horizontal inset. */
.wl-masthead{padding-top:20px}
.wl-mdate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-mcount{display:flex;align-items:baseline;gap:8px;margin-top:8px}
/* THE t0 SITE. font-variant-numeric is declared AFTER the shorthand deliberately: the
   \`font\` shorthand RESETS it, so tabular figures set before this line would be silently
   thrown away. R-38.5 asks every right-aligned figure to be tabular; this one is
   left-aligned and single-digit today, and it carries the setting anyway so the Phase 4
   feed's two- and three-digit counts do not jump the caption sideways. */
.wl-mnum{font:var(--wl-t0);color:var(--atelier-ink)}
.wl-mnum{font-variant-numeric:tabular-nums}
.wl-mcap{font:var(--wl-t5);color:var(--atelier-ink-dim)}
.wl-mrule{height:.5px;background:var(--role-metal);opacity:.55;margin-top:16px}
.wl-title{font:var(--wl-t1);color:var(--atelier-ink);margin:16px 0 0}
.wl-empty{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:8px 0 0}
.wl-emptyaction{display:inline-flex;align-items:center;min-height:44px;margin-top:12px;padding:12px 16px;border:.5px solid var(--atelier-input-border);border-radius:2px;font:var(--wl-t4);color:var(--atelier-accent-text);text-decoration:none;touch-action:manipulation}
.wl-emptyaction:active{background:var(--atelier-row-hover)}
.wl-emptyaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-notlive{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:12px 0 0}
      `}</style>
    </WorklistShell>
  );
}
