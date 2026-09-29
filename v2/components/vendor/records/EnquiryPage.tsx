"use client";
// components/vendor/records/EnquiryPage.tsx · DESIGN-1 · STAGE 5a · THE ENQUIRY AS A PAGE (lib/worklist/record.ts).
// Top to bottom: back to Enquiries; the status (the name is the page's head, with its "?"); the next action as one
// button (Reply on WhatsApp for a new one, Book for one in talks, Open the client for a booked one); Dates; Money (the
// package and its plan, or the budget); Notes; History (the conversation, the invoices and the dates, newest first, from
// the one lead-detail read); then the small jobs. Book and Attach package are small sheets, one open at a time.
import { useEffect, useMemo, useState } from 'react';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useLeadsData, useCabinetData } from '@/v2/hooks/vendor/useVendorData';
import { fetchLeadDetail, fetchLeadPackage, patchLeadState, type LeadPackage } from '@/v2/lib/vendor/api/vendor';
import type { LeadDetailResponse } from '@/lib/vendor/types/vendor';
import { invalidateSlice } from '@/lib/vendor/cache/invalidate';
import { formatRs } from '@/lib/vendor/format';
import { useToast } from '@/hooks/vendor/useToast';
import { WlToast } from '@/v2/components/worklist/WlToast';
import { BookingSheet } from '@/v2/components/vendor/packages/BookingSheet';
import { AttachSheet } from '@/v2/components/vendor/packages/LeadPackageCard';
import { planSentence, waLink } from '@/v2/lib/worklist/book';
import { RECORD, enquiryNext, historyOf, dayOf, clientHref, linkedLeadFor } from '@/v2/lib/worklist/record';
import { roomHref } from '@/v2/lib/worklist/rooms';
import { BackLink, Status, NextButton, Section, Facts, History, Jobs, RECORD_CSS } from '@/v2/components/worklist/RecordPage';

export function EnquiryPage({ vendorId, id }: { vendorId: string; id: string }) {
  const leads = useLeadsData(vendorId);
  const cab = useCabinetData(vendorId);
  const lead = useMemo(() => (leads.data ?? []).find((l) => l.id === id) ?? null, [leads.data, id]);
  const [detail, setDetail] = useState<LeadDetailResponse | null>(null);
  const [lp, setLp] = useState<LeadPackage | null | undefined>(undefined);
  const [sheet, setSheet] = useState<'book' | 'attach' | null>(null);
  const [lostAsk, setLostAsk] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    let live = true;
    void fetchLeadDetail(id).then((r) => { if (live && r && 'ok' in r && r.ok) setDetail(r as LeadDetailResponse); }).catch(() => {});
    void fetchLeadPackage(id).then((r) => { if (live) setLp(r && r.ok ? r.lead_package : null); }).catch(() => { if (live) setLp(null); });
    return () => { live = false; };
  }, [id]);

  const l = lead ?? (detail ? detail.lead : null);
  const list = roomHref('leads');
  if (!l) {
    return (
      <WorklistShell title={RECORD.enquiries}>
        <style>{RECORD_CSS}</style>
        <BackLink list={list} label={RECORD.enquiries} />
        <p className="rp-none">{leads.loading || !detail ? RECORD.reading : RECORD.notFound}</p>
      </WorklistShell>
    );
  }

  const name = l.name || l.phone || RECORD.enquiries;
  const next = enquiryNext(l.state, !!l.phone);
  // a booked enquiry's client: the one binder with its number, never a guess (linkedLeadFor's rule, either way round)
  const client = l.state === 'booked' ? linkedLeadFor(l.phone, cab.data?.clients ?? []) : null;
  const budget = l.budget_total ? formatRs(l.budget_total) : l.budget_min ? `${formatRs(l.budget_min)} or more` : null;
  const items = historyOf({ created_at: l.created_at, conversation: detail?.conversation, events: detail?.events, invoices: detail?.invoices });
  const refresh = () => { invalidateSlice('leads'); };

  async function markLost() {
    setLostAsk(false);
    const r = await patchLeadState(id, 'lost');
    if (r && 'ok' in r && r.ok) { refresh(); show(RECORD.lostDone, 'success'); } else show('Could not mark it lost.', 'error');
  }

  return (
    <WorklistShell title={name}>
      <style>{RECORD_CSS}</style>
      {/* one block inside the column, so the column's gutter holds for the whole page (buttons included) */}
      <div className="rp-page">
      <BackLink list={list} label={RECORD.enquiries} />
      <Status text={[RECORD.statusOf(l.state), l.wedding_city].filter(Boolean).join(' · ')} />
      {next && next.kind === 'reply' && <NextButton label={next.label} href={waLink(l.phone, '')} external />}
      {next && next.kind === 'book' && <NextButton label={next.label} onClick={() => setSheet('book')} />}
      {next && next.kind === 'client' && <NextButton label={next.label} href={client ? clientHref(client.id) : roomHref('clients')} />}

      <Section head={RECORD.datesHead} id="dates">
        <Facts rows={[[RECORD.weddingDate, dayOf(l.wedding_date)], [RECORD.received, dayOf(l.created_at)]]} />
      </Section>
      <Section head={RECORD.moneyHead} id="money">
        {lp ? (
          <Facts rows={[[RECORD.pkg, `${lp.snapshot.name}, ${formatRs(lp.total)}`], [RECORD.plan, planSentence(lp.schedule)]]} />
        ) : (
          <Facts rows={[[RECORD.budget, budget], [RECORD.pkg, lp === null ? RECORD.noPackage : null]]} />
        )}
      </Section>
      <Section head={RECORD.notesHead} id="notes">
        {l.notes || detail?.vendor_summary || l.raw_message
          ? <p className="rp-notes">{[l.notes, detail?.vendor_summary, l.raw_message].filter(Boolean).join('\n\n')}</p>
          : <p className="rp-none">{RECORD.none}</p>}
      </Section>
      <Section head={RECORD.historyHead} id="history"><History items={items} /></Section>

      <Jobs>
        {l.phone && <a className="rp-job" href={waLink(l.phone, '')} target="_blank" rel="noopener noreferrer">{RECORD.whatsapp}</a>}
        {l.phone && <a className="rp-job" href={`tel:${l.phone}`}>{RECORD.call}</a>}
        {l.state !== 'booked' && <button type="button" className="rp-job" onClick={() => setSheet('attach')}>{lp ? RECORD.change : RECORD.attach}</button>}
        {l.state !== 'booked' && l.state !== 'lost' && (lostAsk
          ? <button type="button" className="rp-job warn" onClick={() => { void markLost(); }}>{RECORD.markLostSure}</button>
          : <button type="button" className="rp-job warn" onClick={() => setLostAsk(true)}>{RECORD.markLost}</button>)}
      </Jobs>

      </div>

      <BookingSheet open={sheet === 'book'} leadId={id} initialKind="booking_confirmed" onClose={() => { setSheet(null); refresh(); }}
        onBooked={() => { /* the sheet stays on its Booked step until Done */ }} onToast={show}
        onNeedWeddingDate={() => show('Add the wedding date on the enquiry first.', 'error')}
        leadFacts={{ wedding_date: l.wedding_date, wedding_date_precision: l.wedding_date_precision ?? null }}
        leadName={l.name || ''} leadPhone={l.phone} />
      <AttachSheet open={sheet === 'attach'} leadId={id} current={lp || null} onClose={() => setSheet(null)}
        onAttached={(row) => { setLp(row); setSheet(null); }} onToast={show}
        onNeedWeddingDate={() => show('Add the wedding date on the enquiry first.', 'error')}
        leadFacts={{ wedding_date: l.wedding_date, wedding_date_precision: l.wedding_date_precision ?? null }} />
      <WlToast toast={toast} />
    </WorklistShell>
  );
}
