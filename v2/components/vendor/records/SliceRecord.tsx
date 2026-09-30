"use client";
// components/vendor/records/SliceRecord.tsx · DESIGN-1 · STAGE 5b · THE INVOICE AND THE EVENT AS PAGES
// (lib/worklist/record.ts). The same shape as the enquiry and the client, top to bottom: back to the list; the status
// (the name is the page's head, with its "?"); the next action as one button; Dates; Money; Notes (the event's; an
// invoice carries none on its wire, so it draws no Notes); History; then the small jobs.
//
// ONE HOME FOR EVERY ACT. The page is drawn by SliceScreen in its record mode (SliceShell.tsx, `recordId`), so every act
// here is the list's own handler, handed in: Mark paid is the row's Mark paid, Done is the swipe's Done, Edit opens the
// same edit sheet, the schedule panel (Add, Remove schedule, Remind, Edit, Paid) and its sheets are the ones the old
// invoice sheet drew. Nothing is re-authored here, and at most one sheet is open at a time.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLeadsData, useCabinetData } from '@/v2/hooks/vendor/useVendorData';
import { fetchLeadDetail } from '@/v2/lib/vendor/api/vendor';
import type { Invoice, VendorEvent, LeadDetailResponse, ScheduleMilestone } from '@/lib/vendor/types/vendor';
import type { Row } from '@/v2/components/vendor/slices/SliceRow';
import { formatRs } from '@/lib/vendor/format';
import { istTodayISO } from '@/lib/vendor/istDay';
import { useAsk } from '@/lib/worklist/askContext';
import { useCrew, crewWords, CREW_WORDS } from '@/v2/lib/worklist/crew';
import {
  RECORD, invoiceNext, eventNext, invoiceHistory, historyOf, dayOf, enquiryHref, clientHref, linkedLeadFor,
} from '@/v2/lib/worklist/record';
import { roomHref } from '@/v2/lib/worklist/rooms';
import { COPY } from '@/v2/lib/worklist/copy';
import { BackLink, Status, NextButton, Section, Facts, History, Jobs, RECORD_CSS } from '@/v2/components/worklist/RecordPage';

export interface SliceRecordProps {
  slice: 'invoices' | 'events';
  vendorId: string;
  /** the page's row, with any pending state (paid, done, cancelled) already on it */
  row: Row | null;
  raw: Invoice | VendorEvent | null;
  loading: boolean;
  /** the invoice's schedule panel, as the list draws it */
  schedulePanel?: ReactNode;
  schedule?: ScheduleMilestone[] | null;
  pdfBusy?: boolean;
  onSend?: () => void;
  onPdf?: () => void;
  /** present only when the row can take it now (an owed invoice not already being paid; an upcoming event) */
  onMarkPaid?: () => void;
  onDone?: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

function AskButton({ text }: { text: string }) {
  const { openAsk } = useAsk();
  return <button type="button" className="rp-job" onClick={() => openAsk(text)}>{RECORD.askChat}</button>;
}

export function SliceRecord(p: SliceRecordProps) {
  const isInv = p.slice === 'invoices';
  const inv = isInv ? (p.raw as Invoice | null) : null;
  const ev = !isInv ? (p.raw as VendorEvent | null) : null;
  const leads = useLeadsData(isInv ? p.vendorId : null);
  const cab = useCabinetData(p.vendorId);
  const evDate = ev ? String(ev.event_date).slice(0, 10) : '';
  const crew = useCrew(ev ? p.vendorId : null, evDate, evDate);
  const [cancelAsk, setCancelAsk] = useState(false);

  // the event's booking history: the one lead-detail read, when the calendar row names its enquiry
  const leadId = ev && ev.lead_id ? ev.lead_id : null;
  const [detail, setDetail] = useState<LeadDetailResponse | null>(null);
  useEffect(() => {
    if (!leadId) return;
    let live = true;
    void fetchLeadDetail(leadId).then((r) => { if (live && r && 'ok' in r && r.ok) setDetail(r as LeadDetailResponse); }).catch(() => {});
    return () => { live = false; };
  }, [leadId]);

  // the invoice's enquiry and client: by the estate's phone fold, linked only when exactly one matches (the founder's rule)
  const invLead = useMemo(() => (inv ? linkedLeadFor(inv.client_phone, leads.data ?? []) : null), [inv, leads.data]);
  const invClient = useMemo(() => (inv ? linkedLeadFor(inv.client_phone, cab.data?.clients ?? []) : null), [inv, cab.data]);
  // the event's client: the calendar row names its binder directly
  const evClient = useMemo(() => (ev && ev.linked_binder_id ? (cab.data?.clients ?? []).find((b) => b.id === ev.linked_binder_id) ?? null : null), [ev, cab.data]);

  const list = roomHref(p.slice);
  const listLabel = isInv ? RECORD.invoices : RECORD.events;
  if (!p.row || !p.raw) {
    return (
      <div className="rp-page">
        <style>{RECORD_CSS}</style>
        <BackLink list={list} label={listLabel} />
        <p className="rp-none">{p.loading ? RECORD.reading : RECORD.notFound}</p>
      </div>
    );
  }

  const state = String(p.row.badge || '').toLowerCase().replace(' ', '_');
  const cancelled = state === 'cancelled';

  if (inv) {
    const next = invoiceNext(state, !!inv.client_phone);
    const status = [RECORD.statusOf(p.row.badge || inv.state), p.row.badgeAlert ? RECORD.overdue : '', inv.invoice_number].filter(Boolean).join(' · ');
    const items = invoiceHistory({ created_at: inv.created_at, schedule: p.schedule });
    return (
      <div className="rp-page" data-record="invoice">
        <style>{RECORD_CSS}</style>
        <BackLink list={list} label={listLabel} />
        <Status text={status} />
        {next && next.kind === 'send' && <NextButton label={next.label} onClick={p.onSend} />}
        {next && next.kind === 'pdf' && <NextButton label={p.pdfBusy ? RECORD.pdfBusy : next.label} onClick={p.onPdf} />}

        <Section head={RECORD.datesHead} id="dates">
          <Facts rows={[[RECORD.made, dayOf(inv.created_at)], [RECORD.dueOn, dayOf(inv.due_date)]]} />
        </Section>
        <Section head={RECORD.moneyHead} id="money">
          <Facts rows={[[RECORD.total, formatRs(inv.amount_total)], [RECORD.received$, formatRs(inv.amount_paid)], [RECORD.due, formatRs(inv.amount_owed)]]} />
          {!cancelled && p.schedulePanel ? <div className="rp-sched" data-record-schedule="">{p.schedulePanel}</div> : null}
        </Section>
        <Section head={RECORD.historyHead} id="history"><History items={items} /></Section>

        <Jobs>
          {next && next.kind === 'send' && <button type="button" className="rp-job" onClick={p.onPdf} disabled={p.pdfBusy}>{p.pdfBusy ? RECORD.pdfBusy : RECORD.pdf}</button>}
          {!cancelled && state !== 'paid' && p.onMarkPaid && <button type="button" className="rp-job" data-record-paid="" onClick={p.onMarkPaid}>{COPY.studioMarkPaid}</button>}
          {invLead && <a className="rp-job" href={enquiryHref(invLead.id)} data-record-lead={invLead.id}>{RECORD.enquiry}</a>}
          {invClient && <a className="rp-job" href={clientHref(invClient.id)} data-record-client={invClient.id}>{RECORD.client}</a>}
          <AskButton text={`About the invoice for ${inv.client_name}: `} />
          {!cancelled && <button type="button" className="rp-job" onClick={p.onEdit}>{RECORD.edit}</button>}
          {!cancelled && (cancelAsk
            ? <button type="button" className="rp-job warn" data-record-cancel="" onClick={() => { setCancelAsk(false); p.onCancel(); }}>{RECORD.cancelInvoiceSure}</button>
            : <button type="button" className="rp-job warn" data-record-cancel="" onClick={() => setCancelAsk(true)}>{RECORD.cancelInvoice}</button>)}
        </Jobs>
      </div>
    );
  }

  const e = ev as VendorEvent;
  const next = eventNext(state, e.event_date, istTodayISO(), !!evClient);
  const time = e.event_time ? e.event_time.slice(0, 5) : '';
  const onCrew = crew.byEvent.has(e.id) ? (crewWords(crew.byEvent.get(e.id)) ?? CREW_WORDS.none) : null;
  const items = historyOf({ conversation: detail?.conversation, invoices: detail?.invoices, events: detail?.events?.filter((x) => x.id !== e.id) });
  const recv = evClient ? Number(evClient.amount_received || 0) : 0;
  const pend = evClient ? Number(evClient.amount_pending || 0) : 0;
  return (
    <div className="rp-page" data-record="event">
      <style>{RECORD_CSS}</style>
      <BackLink list={list} label={listLabel} />
      <Status text={[RECORD.statusOf(state), e.kind, time].filter(Boolean).join(' · ')} />
      {next && next.kind === 'done' && <NextButton label={next.label} onClick={p.onDone} />}
      {next && next.kind === 'client' && evClient && <NextButton label={next.label} href={clientHref(evClient.id)} />}

      <Section head={RECORD.datesHead} id="dates">
        <Facts rows={[[RECORD.date, dayOf(e.event_date)], [RECORD.time, time], [RECORD.crew, onCrew]]} />
      </Section>
      <Section head={RECORD.moneyHead} id="money">
        {evClient
          ? <Facts rows={[[RECORD.client, evClient.client || null], [RECORD.received$, formatRs(recv)], [RECORD.due, formatRs(pend)]]} />
          : <p className="rp-none">{RECORD.none}</p>}
      </Section>
      <Section head={RECORD.notesHead} id="notes">
        {e.notes ? <p className="rp-notes">{e.notes}</p> : <p className="rp-none">{RECORD.none}</p>}
      </Section>
      <Section head={RECORD.historyHead} id="history"><History items={items} /></Section>

      <Jobs>
        {next?.kind !== 'done' && !cancelled && state !== 'done' && p.onDone && <button type="button" className="rp-job" onClick={p.onDone}>{RECORD.markDone}</button>}
        {e.lead_id && <a className="rp-job" href={enquiryHref(e.lead_id)} data-record-lead={e.lead_id}>{RECORD.enquiry}</a>}
        {evClient && next?.kind !== 'client' && <a className="rp-job" href={clientHref(evClient.id)} data-record-client={evClient.id}>{RECORD.client}</a>}
        <AskButton text={`About ${e.title} on ${dayOf(e.event_date)}: `} />
        {!cancelled && <button type="button" className="rp-job" onClick={p.onEdit}>{RECORD.edit}</button>}
        {!cancelled && state !== 'done' && (cancelAsk
          ? <button type="button" className="rp-job warn" data-record-cancel="" onClick={() => { setCancelAsk(false); p.onCancel(); }}>{RECORD.cancelEventSure}</button>
          : <button type="button" className="rp-job warn" data-record-cancel="" onClick={() => setCancelAsk(true)}>{RECORD.cancelEvent}</button>)}
      </Jobs>
    </div>
  );
}
