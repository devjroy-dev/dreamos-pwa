"use client";
// components/vendor/records/ClientPage.tsx · DESIGN-1 · STAGE 5a · THE CLIENT AS A PAGE (lib/worklist/record.ts).
// Top to bottom: back to Clients; the status (the name is the page's head, with its "?"); the next action as one button
// (Open the invoice while money is due, else Message on WhatsApp); Dates (the wedding date and each date on the calendar
// for this client); Money (total, received, still due); Notes (the client's story); History (the linked enquiry's
// conversation and invoices, the calendar dates and the notes, newest first); then the small jobs: Ask in chat, Edit,
// and Cancel booking on a booked client. The client's enquiry is linked ONLY when exactly one enquiry has her number
// (linkedLeadFor, the founder's rule); with none or several, the page shows no linked enquiry rather than guess.
import { useEffect, useMemo, useState } from 'react';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useLeadsData, useCabinetData, useEventsData } from '@/v2/hooks/vendor/useVendorData';
import { fetchLeadDetail } from '@/v2/lib/vendor/api/vendor';
import type { LeadDetailResponse } from '@/lib/vendor/types/vendor';
import { formatRs } from '@/lib/vendor/format';
import { useToast } from '@/hooks/vendor/useToast';
import { useAsk } from '@/lib/worklist/askContext';
import { WlToast } from '@/v2/components/worklist/WlToast';
import { EditSheet } from '@/v2/components/vendor/slices/BinderCard';
import { CancelBookingSheet } from '@/v2/components/vendor/packages/CancelBookingSheet';
import { noteTimeline } from '@/v2/lib/vendor/cabinet';
import { waLink, BOOK } from '@/v2/lib/worklist/book';
import { RECORD, clientNext, historyOf, dayOf, enquiryHref, linkedLeadFor } from '@/v2/lib/worklist/record';
import { roomHref } from '@/v2/lib/worklist/rooms';
import { BackLink, Status, NextButton, Section, Facts, History, Jobs, RECORD_CSS } from '@/v2/components/worklist/RecordPage';
import { useRouter } from 'next/navigation';
import { hideBinder, unarchiveBinder } from '@/v2/lib/vendor/api/vendor';

function AskButton({ name }: { name: string }) {
  const { openAsk } = useAsk();
  return <button type="button" className="rp-job" onClick={() => openAsk(`About ${name}: `)}>{RECORD.askChat}</button>;
}

export function ClientPage({ vendorId, id }: { vendorId: string; id: string }) {
  const cab = useCabinetData(vendorId);
  const leads = useLeadsData(vendorId);
  const events = useEventsData(vendorId);
  const binder = useMemo(() => (cab.data?.clients ?? []).find((b) => b.id === id) ?? null, [cab.data, id]);
  const lead = useMemo(() => (binder ? linkedLeadFor(binder.phone, leads.data ?? []) : null), [binder, leads.data]);
  const [detail, setDetail] = useState<LeadDetailResponse | null>(null);
  const [sheet, setSheet] = useState<'edit' | 'cancel' | null>(null);
  const [hideAsk, setHideAsk] = useState(false);
  const router = useRouter();
  const { toast, show } = useToast();

  const leadId = lead ? lead.id : null;
  useEffect(() => {
    if (!leadId) return;
    let live = true;
    void fetchLeadDetail(leadId).then((r) => { if (live && r && 'ok' in r && r.ok) setDetail(r as LeadDetailResponse); }).catch(() => {});
    return () => { live = false; };
  }, [leadId]);

  const list = roomHref('clients');
  if (!binder) {
    return (
      <WorklistShell title={RECORD.clients}>
        <style>{RECORD_CSS}</style>
        <BackLink list={list} label={RECORD.clients} />
        <p className="rp-none">{cab.loading ? RECORD.reading : RECORD.notFound}</p>
      </WorklistShell>
    );
  }

  const name = binder.client || binder.phone || RECORD.clients;
  const recv = Number(binder.amount_received || 0), pend = Number(binder.amount_pending || 0);
  const total = binder.amount != null ? Number(binder.amount) : recv + pend;
  const next = clientNext(pend, !!binder.phone);
  // Hide, as the card had it: the same door, the same 30-second Undo; the page goes back to the list
  async function hide() {
    if (!binder) return;
    setHideAsk(false);
    const res = await hideBinder(binder.id);
    if (!res.ok) { show(res.error || 'Could not hide.', 'error'); return; }
    cab.refresh();
    show(RECORD.hidden(name), 'success', { action: { label: 'Undo', onAction: async () => { const r = await unarchiveBinder(binder.id); if (r.ok) { cab.refresh(); show(RECORD.restored, 'success'); } } }, durationMs: 30000 });
    router.push(list);
  }
  const mine = (events.data ?? []).filter((e) => e.linked_binder_id === binder.id && e.state !== 'cancelled');
  const items = historyOf({
    conversation: detail?.conversation, invoices: detail?.invoices,
    events: mine.map((e) => ({ title: e.title, event_date: e.event_date })), notes: noteTimeline(binder.note),
  });

  return (
    <WorklistShell title={name}>
      <style>{RECORD_CSS}</style>
      {/* one block inside the column, so the column's gutter holds for the whole page (buttons included) */}
      <div className="rp-page">
      <BackLink list={list} label={RECORD.clients} />
      <Status text={binder.stage ? RECORD.statusOf(binder.stage) : ''} />
      {next && next.kind === 'invoice' && <NextButton label={next.label} href={`${roomHref('invoices')}?invoice=${encodeURIComponent(binder.id)}`} />}
      {next && next.kind === 'message' && <NextButton label={next.label} href={waLink(binder.phone, '')} external />}

      <Section head={RECORD.datesHead} id="dates">
        <Facts rows={[[RECORD.weddingDate, dayOf(binder.date)], ...mine.map((e) => [e.title, dayOf(e.event_date)] as [string, string])]} />
      </Section>
      <Section head={RECORD.moneyHead} id="money">
        <Facts rows={[[RECORD.total, total ? formatRs(total) : null], [RECORD.received$, formatRs(recv)], [RECORD.due, formatRs(pend)]]} />
      </Section>
      <Section head={RECORD.notesHead} id="notes">
        {binder.note ? <p className="rp-notes">{binder.note}</p> : <p className="rp-none">{RECORD.none}</p>}
      </Section>
      <Section head={RECORD.historyHead} id="history"><History items={items} /></Section>

      <Jobs>
        {lead && <a className="rp-job" href={enquiryHref(lead.id)} data-record-lead={lead.id}>{RECORD.enquiries}</a>}
        <AskButton name={name} />
        <button type="button" className="rp-job" onClick={() => setSheet('edit')}>{RECORD.edit}</button>
        {hideAsk
          ? <button type="button" className="rp-job warn" onClick={() => { void hide(); }}>{RECORD.hideSure}</button>
          : <button type="button" className="rp-job" onClick={() => setHideAsk(true)}>{RECORD.hide}</button>}
        {binder.booked_lead && <button type="button" className="rp-job warn" data-cancel-booking="" onClick={() => setSheet('cancel')}>{BOOK.cancel}</button>}
      </Jobs>

      </div>

      {sheet === 'edit' && (
        <EditSheet binder={binder} onClose={() => setSheet(null)}
          onSaved={(msg) => { show(msg ?? 'Saved.', 'success'); cab.refresh(); }} onFail={(err) => show(err, 'error')} />
      )}
      {sheet === 'cancel' && (
        <CancelBookingSheet open binderId={binder.id} name={name} onClose={() => setSheet(null)} onDone={cab.refresh} onToast={show} />
      )}
      <WlToast toast={toast} />
    </WorklistShell>
  );
}
