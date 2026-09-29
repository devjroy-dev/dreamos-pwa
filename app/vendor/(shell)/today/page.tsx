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
import { TodayHome } from '@/components/worklist/TodayHome';
import { COPY } from '@/lib/worklist/copy';
import { useTodayFeed } from '@/lib/worklist/feed';
import { RoomHeadTitle } from '@/components/worklist/PageHelp';
import { todayLine } from '@/lib/worklist/home';
import { istTodayISO } from '@/lib/vendor/istDay';

// Derived at render, never a fixture. Locale pinned so the string cannot drift with the
// runtime's ICU data — the same reason the estate pins its own date formatters.

export default function TodayPage() {
  const feed = useTodayFeed();
  const today = feed.today;
  const firstRun = feed.responded && today !== null && today.has_any === false;
  return (
    <WorklistShell title={COPY.navToday}>
      {/* ── DESIGN-1 · STAGE 2 · HOME IS THE DAY'S WORK (docs/review/REPORT.md §3) ──────────────────
          The head's t1 is the day itself, "Monday 28 September" (F-44.219: Today sets its head's line, so the
          page keeps one t1 with the "?" on it), save the two states that are claims about the reading: a settled
          failure says it is not reading (F-39.72), and has_any === false says nothing has ever needed the vendor. Below it the four sections of TodayHome, in the order a vendor
          acts on them: Check a date, Reply to, Today (and This week), Money due. The pinned rooms moved to More
          (kept, not deleted); the open-items numeral, the kind line and the Done today table retired, each
          repeating what a list already showed. FirstRun still answers has_any === false, the one reading that
          means this vendor has never had anything (§3 property 6). */}
      <RoomHeadTitle line={!feed.responded && !feed.pending ? COPY.todayNotLive : firstRun ? COPY.todayNothingYet : todayLine(today?.today || istTodayISO())} />
      <TodayHome />
      {firstRun && <FirstRun />}
    </WorklistShell>
  );
}
