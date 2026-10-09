"use client";
// v2/app/vendor/(shell)/payment-links/page.tsx — CE-47 · INS · PAY-A · THE PAYMENT LINKS ROOM (Business Solutions › Get paid).
// Replaces the hub cut's shell page at the same address; `payment_links` leaves PREVIEW_KEYS in the same edit.
// The founder's rulings: her OWN Razorpay account; the money goes straight to her; TDW takes no fee and no commission;
// a refund is shown here and taken off the invoice only by her tap; part payment only on a whole-invoice link, by her
// switch. Every rule is the server's; every word is v2/lib/solutions/paymentLinks.ts' PL. A THIN answer never blanks
// the room: every list is read tolerantly (the Insurance room's lesson, F-44.364 era).
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useToast } from '@/hooks/vendor/useToast';
import { WlToast } from '@/v2/components/worklist/WlToast';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { Sheet, SHEET_CSS } from '@/v2/components/worklist/StudioSheets';
import { CopyBox } from '@/v2/components/worklist/CopyBox';
import { fetchInvoices } from '@/lib/vendor/api/vendor';
import { PL, errOf, payRoom, connectStart, connectFinish, disconnect, invoiceInfo, makeLink, setPartial, takeOffRefund, answerAlreadyOn, answerAdd,
  type Room, type InvoiceInfo, type PayEvent } from '@/v2/lib/solutions/paymentLinks';

export default function PaymentLinksPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <PaymentLinksRoom vendorId={(session as { id?: string }).id || ''} />;
}

type Inv = { id: string; client_name: string; amount_owed: number; state: string };
const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function PaymentLinksRoom({ vendorId }: { vendorId: string }) {
  const { toast, show } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [open, setOpen] = useState<{ inv: Inv; info: InvoiceInfo | null } | null>(null);
  const [made, setMade] = useState<{ shortUrl: string; amount: number } | null>(null);
  const [busy, setBusy] = useState(false);

  // Razorpay sends her back to THIS room with ?code=&state= (RAZORPAY_PARTNER_REDIRECT_URI points here). The code and the
  // single-use state go to the server ONCE; the line says what happened; the address is cleaned. No token is read or shown.
  const q = useSearchParams(); const router = useRouter(); const finishing = useRef(false);
  const [backLine, setBackLine] = useState<string | null>(null);
  useEffect(() => {
    const code = q ? q.get('code') : null; const state = q ? q.get('state') : null;
    if (!code || !state || finishing.current) return;
    finishing.current = true; setBackLine(PL.connectingLine);
    void connectFinish(code, state).then((r) => { setBackLine(r.ok ? PL.connectedBack : errOf(r)); router.replace('/vendor/payment-links'); void load(); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const load = useCallback(async () => {
    const r = await payRoom();
    if (r.ok) setRoom(r as Room); else show(errOf(r), 'error');
    if (r.ok && (r as Room).configured && vendorId) {
      const iv = await fetchInvoices(vendorId, 'all').catch(() => null);
      const rows = list<Inv>(iv && (iv as { invoices?: unknown }).invoices);
      setInvoices(rows.filter((i) => Number(i.amount_owed) > 0 && i.state !== 'cancelled' && i.state !== 'paid'));
    }
  }, [show, vendorId]);
  useEffect(() => { void load(); }, [load]);

  const configured = !!(room && room.configured === true);
  const account = room && room.account ? room.account : null;
  const events = list<PayEvent>(room && room.events);
  const partialOn = !!(room && room.settings && room.settings.accept_partial === true);

  async function doConnect() {
    setBusy(true); const r = await connectStart(); setBusy(false);
    if (r.ok && typeof (r as { url?: unknown }).url === 'string') window.location.assign((r as { url: string }).url); else show(errOf(r), 'error');
  }
  async function doDisconnect() { setBusy(true); const r = await disconnect(); setBusy(false); if (r.ok) void load(); else show(errOf(r), 'error'); }
  async function openInvoice(inv: Inv) {
    setMade(null); setOpen({ inv, info: null });
    const r = await invoiceInfo(inv.id);
    if (r.ok) setOpen({ inv, info: r as InvoiceInfo }); else { setOpen(null); show(errOf(r), 'error'); }
  }
  async function doLink(invoiceId: string, milestoneId?: string) {
    setBusy(true); const r = await makeLink(invoiceId, milestoneId); setBusy(false);
    const l = r.ok ? (r as { link?: { shortUrl?: unknown; amount?: unknown } }).link : null;
    if (l && typeof l.shortUrl === 'string') setMade({ shortUrl: l.shortUrl, amount: Number(l.amount) || 0 }); else show(errOf(r), 'error');
  }
  async function flipPartial() { const r = await setPartial(!partialOn); if (r.ok) void load(); else show(errOf(r), 'error'); }
  async function doTakeOff(e: PayEvent) { setBusy(true); const r = await takeOffRefund(String(e.provider_payment_id || '')) /* the server keys a refund by Razorpay's refund id */; setBusy(false); if (r.ok) { show(PL.refundDone); void load(); } else show(errOf(r, PL.fail), 'error'); }
  async function answer(e: PayEvent, which: 'one' | 'two') {
    setBusy(true); const r = which === 'one' ? await answerAlreadyOn(e.id) : await answerAdd(e.id); setBusy(false);
    if (r.ok) void load(); else show(errOf(r, PL.fail), 'error');
  }

  const info = open && open.info;
  return (
    <WorklistShell title={PL.title}>
      <Body>
        <div data-pl-view="home">
          <p className="fr-lede">{PL.lede}</p>
          {backLine ? <p className="pl-note" data-pl-back="">{backLine}</p> : null}
          {!configured ? (
            <Group><Row title={PL.title} facts={PL.comingLine} pill={{ text: PL.comingTag, tone: 'soon' }} /></Group>
          ) : (<>
            <Head text={PL.accountHead} />
            <Group>{account
              ? <Row title={PL.connectedLine(account.accountId)} pill={{ text: PL.disconnect, tone: 'soon' }} onClick={() => { if (!busy) void doDisconnect(); }} />
              : <Row title={PL.notConnected} pill={{ text: PL.connect, tone: 'ok' }} onClick={() => { if (!busy) void doConnect(); }} />}</Group>
            <Head text={PL.invoicesHead} count={invoices.length} />
            {invoices.length ? <Group>{invoices.map((i) => <Row key={i.id} title={i.client_name || i.id} facts={PL.owedLine(`Rs ${Number(i.amount_owed).toLocaleString('en-IN')}`)} chevron onClick={() => void openInvoice(i)} />)}</Group>
              : <p className="pl-note">{PL.noInvoices}</p>}
            <Group><Row title={PL.partialRow} facts={PL.partialFacts} pill={{ text: partialOn ? PL.on : PL.off, tone: partialOn ? 'ok' : 'soon' }} onClick={flipPartial} /></Group>
            {events.length ? (<>
              <Head text={PL.paymentsHead} count={events.length} />
              <Group>{events.map((e) => <EventRow key={e.id} e={e} busy={busy} onTakeOff={doTakeOff} onAnswer={answer} />)}</Group>
            </>) : null}
          </>)}
        </div>
      </Body>
      {open ? (
        <Sheet title={open.inv.client_name || PL.title} onClose={() => { setOpen(null); setMade(null); }}>
          {!info ? <p className="wl-shnote" aria-busy="true" /> : (<>
            <p className="wl-shnote">{PL.owedLine(info.owed_text)}</p>
            {made ? (<>
              <p className="wl-shnote">{PL.linkMade}</p>
              <CopyBox text={made.shortUrl} label={PL.copy} copied="Copied" />
              <div className="wl-brow"><button type="button" className="wl-btn gho" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(made.shortUrl)}`, '_blank', 'noopener')}>{PL.sendWa}</button></div>
            </>) : (<>
              <button type="button" className="wl-btn pri" disabled={busy} onClick={() => void doLink(open.inv.id)}>{PL.wholeLink}</button>
              {info.kind === 'package' ? list<{ id: string; label: string; owed_text: string }>(info.lines).map((l) => (
                <div key={l.id} className="wl-fld"><span className="wl-fl">{l.label}: {l.owed_text}</span>
                  <button type="button" className="wl-btn gho" disabled={busy} onClick={() => void doLink(info.invoice_id, l.id)}>{PL.lineLink}</button></div>
              )) : null}
            </>)}
          </>)}
        </Sheet>
      ) : null}
      <WlToast toast={toast} />
      <style>{FR_CSS}</style>
      <style>{SHEET_CSS}</style>
      <style>{`.pl-note{margin:12px 0 16px;font:var(--wl-t5);color:var(--atelier-ink-mute);line-height:1.5}`}</style>
    </WorklistShell>
  );
}

function EventRow({ e, busy, onTakeOff, onAnswer }: { e: PayEvent; busy: boolean; onTakeOff: (e: PayEvent) => void; onAnswer: (e: PayEvent, w: 'one' | 'two') => void }) {
  const t = e.amount_text || `Rs ${Number(e.amount).toLocaleString('en-IN')}`;
  if (e.question && typeof e.question.line === 'string') {
    return (
      <div data-pl-question="" className="wl-fld">
        <p className="wl-shnote">{e.question.line}</p>
        <div className="wl-brow">
          <button type="button" className="wl-btn gho" disabled={busy} onClick={() => onAnswer(e, 'one')}>{PL.one}</button>
          <button type="button" className="wl-btn pri" disabled={busy} onClick={() => onAnswer(e, 'two')}>{PL.two}</button>
        </div>
      </div>
    );
  }
  if (e.kind === 'refunded') {
    return e.applied ? <Row title={PL.refunded(t)} facts={PL.refundDone} />
      : <Row title={PL.refunded(t)} facts={PL.refundLine} pill={{ text: PL.takeOff, tone: 'warn' }} onClick={() => { if (!busy) onTakeOff(e); }} />;
  }
  if (e.kind === 'failed') return <Row title={PL.failed(t)} />;
  if (!e.applied && e.not_applied_reason === 'BINDER_PENDING') return <Row title={PL.pendingLine(t)} />;
  return <Row title={PL.paid(t)} />;
}
