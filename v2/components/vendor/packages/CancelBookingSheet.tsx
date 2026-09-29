'use client';
import { RUNG_FONT as RUNG } from '@/v2/lib/worklist/theme';
// components/vendor/packages/CancelBookingSheet.tsx · DESIGN-1 · STAGE 4 · CANCEL BOOKING, from the client's page (the
// founder: "asking before removing events and any unpaid invoice"). One sheet: it first asks the server what the booking
// holds (a dry run of dream-os POST /leads/unbook), then asks her, one line each, whether to remove the booking's dates
// from her calendar and its invoice when nothing has been paid on it. Both start unticked: nothing goes unless she says
// so. An invoice with payments is never offered for removal; the sheet says it stays. Words: lib/worklist/book.ts.
import { useEffect, useState } from 'react';
import { unbookBooking, type UnbookPlan } from '@/v2/lib/vendor/api/vendor';
import { BOOK } from '@/v2/lib/worklist/book';
import { packageDate } from '@/v2/lib/worklist/packages';
import type { ToastKind } from '@/hooks/vendor/useToast';
import { Sheet, actionButton, T } from './PackageFields';
import { refreshAfterBooking } from './BookingSheet';
import { HelpButton } from '@/v2/components/worklist/PageHelp'; // DESIGN-1: the sheet's "?"
import { SHEET_HELP } from '@/v2/lib/worklist/pageHelp';

export function CancelBookingSheet({ open, binderId, name, onClose, onDone, onToast }: {
  open: boolean; binderId: string; name: string;
  onClose: () => void; onDone: () => void;
  onToast: (msg: string, kind?: ToastKind) => void;
}) {
  const [plan, setPlan] = useState<UnbookPlan | null | undefined>(undefined);
  const [rmEvents, setRmEvents] = useState(false);
  const [rmInvoice, setRmInvoice] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    unbookBooking({ binder_id: binderId, dry_run: true })
      .then((r) => { if (alive) { setPlan(r && r.ok && r.plan ? r.plan : null); setRmEvents(false); setRmInvoice(false); } })
      .catch(() => { if (alive) setPlan(null); });
    return () => { alive = false; };
  }, [open, binderId]);

  async function cancel() {
    if (!plan || busy) return;
    setBusy(true);
    try {
      const r = await unbookBooking({ binder_id: binderId, remove_events: rmEvents, remove_invoice: rmInvoice });
      if (r && r.ok) { refreshAfterBooking(); onToast(BOOK.cancelled, 'success'); onDone(); onClose(); return; }
      onToast(BOOK.cancelFailed, 'error');
    } catch {
      onToast(BOOK.cancelFailed, 'error');
    } finally {
      setBusy(false);
    }
  }

  const tick = (checked: boolean, set: (v: boolean) => void, text: string, key: string) => (
    <label data-cancel-ask={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minHeight: 44, font: RUNG.t3, color: T.ink }}>
      <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} style={{ marginTop: 4 }} />
      <span>{text}</span>
    </label>
  );

  return (
    <Sheet open={open} testId="cancel-booking-sheet" title={BOOK.cancelTitle(name)} onClose={onClose}
      aside={<HelpButton id="sheet:cancel-booking" title={SHEET_HELP.cancelBooking.title} help={SHEET_HELP.cancelBooking.help} layered />}
      footer={(
        <>
          <button type="button" style={actionButton('mute')} onClick={onClose}>{BOOK.keep}</button>
          <button type="button" data-cancel-confirm="" disabled={!plan || busy} aria-busy={busy}
            style={{ ...actionButton('accent'), flex: 1, borderColor: 'var(--role-critical)', color: 'var(--role-critical)' }}
            onClick={() => { void cancel(); }}>{BOOK.cancel}</button>
        </>
      )}>
      {plan === undefined ? <p style={{ font: RUNG.t4, color: T.mute, margin: 0 }}>{BOOK.reading}</p>
        : plan === null ? <p role="alert" style={{ font: RUNG.t3, color: T.accent, margin: 0 }}>{BOOK.cancelFailed}</p> : (
        <>
          <p style={{ font: RUNG.t3, color: T.ink, margin: 0 }}>{BOOK.cancelLine}</p>
          {plan.events.length > 0 && (
            <div>
              {tick(rmEvents, setRmEvents, BOOK.removeEvents(plan.events.length), 'events')}
              <ul style={{ margin: '0 0 0 36px', padding: 0, font: RUNG.t4, color: T.soft }}>
                {plan.events.map((e) => <li key={e.id}>{`${packageDate(e.date)}${e.title ? ` · ${e.title}` : ''}`}</li>)}
              </ul>
            </div>
          )}
          {plan.invoice && (plan.invoice.paid
            ? <p data-cancel-kept="" style={{ font: RUNG.t4, color: T.soft, margin: 0 }}>{BOOK.invoiceKept(plan.invoice.number)}</p>
            : tick(rmInvoice, setRmInvoice, BOOK.removeInvoice(plan.invoice.number), 'invoice'))}
        </>
      )}
    </Sheet>
  );
}
