"use client";
// app/w/support/page.tsx — Contact Support (R-37.66 as amended: a ROOM, not a nav seat;
// R-37.67 arm (c\u2032): the coming-soon sheet with a direct line to a person).
//
// THE LABEL DOES NOT OUTRUN THE DESTINATION. The tile promises support and the button reaches
// a human on WhatsApp — the concern is dissolved by the destination rather than argued away.
//
// THE NUMBER IS NEVER INLINE. supportWaNumber() is the declared home, env-overridable, so
// "we wire that later" is a dashboard change and not a deploy. F-09.190 is the finding this
// obeys at birth: that number already has six homes elsewhere in the estate, and this makes
// no seventh.
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { COPY } from '@/lib/worklist/copy';
import { supportWaNumber } from '@/lib/waNumbers';

export default function SupportPage() {
  return (
    <WorklistShell title={COPY.supportTitle}>
      <div className="wl-support">
        <p className="wl-supportbody">{COPY.supportBody}</p>
        <button type="button" className="wl-supportaction"
                onClick={() => window.open(`https://wa.me/${supportWaNumber()}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener')}>
          {COPY.supportAction}
        </button>
      </div>
      <style>{`
/* R-38.5: the column owns the gutter. This block set its own 20px inset and was one of the
   sites the founder's misalignment came from — a component taking back the freedom
   R-37.82 (1) removed. Vertical only now. */
.wl-support{padding-top:20px;padding-bottom:24px;display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.wl-supportbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}
.wl-supportaction{background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.wl-supportaction:active{background:var(--atelier-row-hover)}
.wl-supportaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
      `}</style>
    </WorklistShell>
  );
}
