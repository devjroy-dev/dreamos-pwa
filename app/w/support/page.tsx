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
.wl-support{padding:28px 20px;display:flex;flex-direction:column;align-items:flex-start;gap:18px}
.wl-supportbody{font-size:14.5px;font-weight:400;line-height:1.65;color:var(--atelier-ink-soft);margin:0;max-width:46ch}
.wl-supportaction{background:transparent;border:.5px solid var(--atelier-input-border);border-radius:2px;cursor:pointer;padding:13px 20px;min-height:48px;font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--atelier-accent-text)}
.wl-supportaction:active{background:var(--atelier-row-hover)}
.wl-supportaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
      `}</style>
    </WorklistShell>
  );
}
