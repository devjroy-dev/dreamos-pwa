'use client';
// app/admin/partners/forward/page.tsx · CE-47 · PTN-A1 app · More > Partners > Forward a request, BY HAND only (A1):
// the vendor and what she needs, the tick "She asked for this", who it goes to; then for each person: Copy message,
// Open on Instagram, Open on Threads, and "I sent it". The WhatsApp route is PTN-A2 and is not drawn here.
import { useCallback, useEffect, useState } from 'react';
import { adminGet, adminPost } from '@/lib/admin-api/_base';
import { PageHead, Group, List, Sheet, SheetNote, ActionStrip, Chips, C, F } from '../../_components/Kit';
import { ContactRow, type Contact } from '../../_components/ContactRow';
import { CopyBox } from '@/v2/components/worklist/CopyBox'; // R-46.17: the message the admin sends sits in its own box

const OUT_BTN: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 14px', borderRadius: 12, font: F.t5, fontWeight: 600, border: `1px solid ${C.line}`, color: C.soft, textDecoration: 'none' };
type Recip = { id: string; contact: Contact; sent_at: string | null; link: string | null; message: string | null; instagram_url: string | null; threads_url: string | null };
const box: React.CSSProperties = { width: '100%', minHeight: 44, padding: '0 12px', borderRadius: 12, border: `0.5px solid ${C.inputLine}`, background: C.input, font: F.t3, color: C.ink };
const Field = ({ label, value, onChange, note, type }: { label: string; value: string; onChange: (v: string) => void; note?: string; type?: string }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 14px', flex: 1, minWidth: 0 }}><span style={{ font: F.t4, color: C.soft }}>{label}</span>
    <input type={type || 'text'} style={box} value={value} onChange={(e) => onChange(e.target.value)} />{note ? <span style={{ font: F.t5, color: C.mute }}>{note}</span> : null}</label>);

export default function ForwardAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [f, setF] = useState({ vendor_id: '', outside_handle: '', outside_phone: '', role: '', city: 'Delhi NCR', event_date: '', budget_from: '', budget_to: '', pay_kind: 'paid', note: '' });
  const [asked, setAsked] = useState(false);
  const [pick, setPick] = useState<string[]>([]);
  const [out, setOut] = useState<Recip[] | null>(null);
  const [open, setOpen] = useState<Recip | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { void adminGet<{ contacts: Contact[] }>('/api/v2/admin/partners/contacts').then((d) => setContacts(Array.isArray(d && d.contacts) ? d.contacts : [])).catch(() => setContacts([])); }, []);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const send = async () => {
    setErr(null);
    if (!asked) { setErr('Tick "She asked for this" first.'); return; }
    try {
      const d = await adminPost<{ recipients: Recip[] }>('/api/v2/admin/partners/forward', { ...f, vendor_id: f.vendor_id || undefined, asked: true,
        budget_from: Number(f.budget_from.replace(/\D/g, '')), budget_to: Number(f.budget_to.replace(/\D/g, '')), contact_ids: pick });
      setOut(Array.isArray(d && d.recipients) ? d.recipients : []);
    } catch (e) { setErr(e instanceof Error ? e.message : 'Could not save the request.'); }
  };
  const markSent = useCallback(async (r: Recip, sent: boolean) => {
    try { const d = await adminPost<{ sent_at: string | null }>(`/api/v2/admin/partners/forward/recipients/${r.id}/sent`, { sent });
      setOut((o) => (o || []).map((x) => (x.id === r.id ? { ...x, sent_at: d.sent_at } : x))); setOpen((o) => (o && o.id === r.id ? { ...o, sent_at: d.sent_at } : o)); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Could not save.'); }
  }, []);
  return (
    <div>
      <PageHead title="Forward a request" sub="Send a vendor's request to people TDW knows. You send each message yourself." />
      {!out ? (
        <>
          <Group title="The vendor">
            <Field label="Vendor on TDW (her vendor id from Vendors)" value={f.vendor_id} onChange={set('vendor_id')} note="Or, for a vendor not on TDW, her Instagram handle and her phone below." />
            <div style={{ display: 'flex' }}><Field label="Her Instagram handle" value={f.outside_handle} onChange={set('outside_handle')} /><Field label="Her phone" value={f.outside_phone} onChange={set('outside_phone')} /></div>
          </Group>
          <Group title="What she needs">
            <Field label="What" value={f.role} onChange={set('role')} note="For example a model" />
            <div style={{ display: 'flex' }}><Field label="City" value={f.city} onChange={set('city')} /><Field label="Date" type="date" value={f.event_date} onChange={set('event_date')} /></div>
            <div style={{ display: 'flex' }}><Field label="Budget from Rs" value={f.budget_from} onChange={set('budget_from')} /><Field label="Budget to Rs" value={f.budget_to} onChange={set('budget_to')} /></div>
            <div style={{ padding: '8px 14px' }}><Chips items={[{ key: 'paid', label: 'Paid' }, { key: 'credit_only', label: 'Credit only' }]} value={f.pay_kind} onChange={set('pay_kind')} /></div>
            <Field label="Note (optional)" value={f.note} onChange={set('note')} />
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', font: F.t3, color: C.ink }} data-asked="">
              <input type="checkbox" checked={asked} onChange={(e) => setAsked(e.target.checked)} style={{ width: 22, height: 22 }} />She asked for this</label>
          </Group>
          <Group title={`Send to (${pick.length} chosen)`}>
            <List>{contacts.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <input type="checkbox" aria-label={`Send to ${c.name}`} checked={pick.includes(c.id)} onChange={(e) => setPick((p) => (e.target.checked ? [...p, c.id] : p.filter((x) => x !== c.id)))} style={{ width: 22, height: 22, margin: '22px 0 0 14px' }} />
                <div style={{ flex: 1, minWidth: 0 }}><ContactRow c={c} last={i === contacts.length - 1} /></div>
              </div>))}</List>
          </Group>
          {err ? <p style={{ font: F.t4, color: C.bad, padding: '8px 14px' }}>{err}</p> : null}
          <div style={{ padding: '16px 0' }}><ActionStrip items={[{ label: `Make the messages for ${pick.length} ${pick.length === 1 ? 'person' : 'people'}`, primary: true, onClick: () => { void send(); } }]} /></div>
        </>
      ) : (
        <Group title="Send each one yourself">
          <List>{out.map((r, i) => (
            <div key={r.id} onClick={() => { setOpen(r); }} style={{ cursor: 'pointer' }}>
              <ContactRow c={{ ...r.contact }} last={i === out.length - 1} />
              <p style={{ font: F.t5, color: r.sent_at ? C.ok : C.mute, padding: '0 14px 12px' }}>{r.sent_at ? 'Sent' : 'Not sent yet. Tap to open.'}</p>
            </div>))}</List>
        </Group>
      )}
      {open ? (
        <Sheet title={open.contact.name} sub="Send it yourself from TDW's accounts" onClose={() => setOpen(null)}>
          {open.message ? <div style={{ padding: '0 14px' }}><CopyBox text={open.message} label="Copy message" copied="Copied" /></div> : null}
          {open.instagram_url ? (
            <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px', flexWrap: 'wrap' }}>
              <a href={open.instagram_url} target="_blank" rel="noopener noreferrer" data-ext-link="" style={OUT_BTN}>Open on Instagram</a>
              {open.threads_url ? <a href={open.threads_url} target="_blank" rel="noopener noreferrer" data-ext-link="" style={OUT_BTN}>Open on Threads</a> : null}
            </div>
          ) : null}
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 18px', font: F.t3, color: C.ink }}>
            <input type="checkbox" checked={!!open.sent_at} onChange={(e) => { void markSent(open, e.target.checked); }} style={{ width: 22, height: 22 }} />I sent it</label>
          {!open.instagram_url ? <SheetNote>This contact has no Instagram handle. Add it in Contacts to send from Instagram or Threads.</SheetNote> : null}
        </Sheet>
      ) : null}
    </div>
  );
}
