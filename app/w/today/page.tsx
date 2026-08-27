"use client";
// app/w/page.tsx — TODAY, Phase 1.
//
// IT READS NOTHING, AND IT SAYS SO. Byte 5 states that the instrument is not running; it does
// NOT say the reading is zero. "All clear" here would assert an absence never checked — the
// same class as a control that reports a success it did not perform, and the reason bytes 6
// and 7 exist but are not rendered until Phase 4 can prove the claim.
//
// Beneath it, the first-run manual (R-37.68), static in this phase so the install walk does
// not open onto a blank room.
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { FirstRun } from '@/components/worklist/FirstRun';
import { COPY } from '@/lib/worklist/copy';

// Derived at render, never a fixture. Locale pinned so the string cannot drift with the
// runtime's ICU data \u2014 the same reason the estate pins its own date formatters.
const DATE_LINE = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export default function TodayPage() {
  return (
    <WorklistShell title={COPY.navToday}>
      {/* R-37.76 \u2467 \u00b7 THE MASTHEAD. Today opens on a moment, not on body copy. The numeral
          is 0 in Phase 1 and comes from the live feed in Phase 4 \u2014 the treatment does not move,
          only the number does, which is why Phase 4 inherits this as spec rather than redesigning. */}
      <section className="wl-masthead">
        <div className="wl-mdate">{DATE_LINE}</div>
        <div className="wl-mcount"><span className="wl-mnum">0</span><span className="wl-mcap">{COPY.todayMastheadCaption}</span></div>
        <div className="wl-mrule" />
      </section>

      {/* THE PROMISE IS THE HEADLINE. Byte 5 stays, verbatim, but drops beneath it \u2014 the honest
          statement survives; it just stops being the loudest sentence on the page. Today had no
          stature because its first line was an apology. */}
      <p className="wl-hero">{COPY.todayPromise}</p>
      <p className="wl-stillbuilt">{COPY.todayEmptyLine1} {COPY.todayEmptyLine2}</p>
      <FirstRun />
      <style>{`
.wl-masthead{padding:22px 18px 0}
.wl-mdate{font-family:var(--wl-label);font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-mcount{display:flex;align-items:baseline;gap:9px;margin-top:9px}
.wl-mnum{font-family:var(--wl-display);font-size:46px;line-height:.95;color:var(--atelier-ink)}
.wl-mcap{font-family:var(--wl-body);font-weight:400;font-size:14px;color:var(--atelier-ink-dim)}
.wl-mrule{height:.5px;background:var(--role-metal);opacity:.55;margin-top:16px}
.wl-hero{font-family:var(--wl-feature);font-weight:400;font-size:24px;line-height:1.34;color:var(--atelier-ink);margin:20px 18px 0;letter-spacing:-.005em}
.wl-stillbuilt{font-family:var(--wl-body);font-weight:400;font-size:13px;color:var(--atelier-ink-mute);margin:10px 18px 0}
      `}</style>
    </WorklistShell>
  );
}
