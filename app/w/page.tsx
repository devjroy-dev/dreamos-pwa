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

export default function TodayPage() {
  return (
    <WorklistShell title={COPY.navToday}>
      <div className="wl-empty">
        <p className="wl-emptyline">{COPY.todayEmptyLine1}</p>
        <p className="wl-emptyline dim">{COPY.todayEmptyLine2}</p>
      </div>
      <FirstRun />
      <style>{`
.wl-empty{padding:34px 30px 22px;display:flex;flex-direction:column;align-items:center;gap:6px}
.wl-emptyline{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--atelier-ink-soft);text-align:center;margin:0}
.wl-emptyline.dim{font-family:'DM Sans',sans-serif;font-weight:400;font-size:12.5px;color:var(--atelier-ink-mute)}
      `}</style>
    </WorklistShell>
  );
}
