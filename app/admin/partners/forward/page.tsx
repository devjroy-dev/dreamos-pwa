'use client';
// app/admin/partners/forward/page.tsx · CE-47 · PTN-A1 app · More > Partners > Forward a request, BY HAND only (A1):
// the vendor and what she needs, the tick "She asked for this", who it goes to; then for each person: Copy message,
// Open on Instagram, Open on Threads, and "I sent it".
// A2-4: the hand message is version A, the founder's words (8 Oct 2026), and it carries the admin's OWN first name, typed
// here and remembered on this phone (the admin session holds no name). Without a name the server makes no message. In each
// person's sheet the admin can change the text first; the CopyBox and "Open in WhatsApp" both carry the changed text.
// "Open in WhatsApp" is drawn only for a contact with a phone who has not replied STOP. After forwarding, the page shows in
// one line whether TDW told the vendor on WhatsApp.
import { useCallback, useEffect, useState } from 'react';
import { adminGet, adminPost } from '@/lib/admin-api/_base';
import { PageHead, Group, List, Sheet, SheetNote, ActionStrip, Chips, C, F } from '../../_components/Kit';
import { ContactRow, type Contact } from '../../_components/ContactRow';
import { CopyBox } from '@/v2/components/worklist/CopyBox'; // R-46.17: the message the admin sends sits in its own box

const OUT_BTN: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 14px', borderRadius: 12, font: F.t5, fontWeight: 600, border: `1px solid ${C.line}`, color: C.soft, textDecoration: 'none' };
type Recip = { id: string; contact: Contact; sent_at: string | null; link: string | null; message: string | null; instagram_url: string | null; threads_url: string | null };
const NAME_KEY = 'tdw_admin_first_name';
const readName = (): string => { try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; } };
const keepName = (v: string) => { try { if (v.trim()) localStorage.setItem(NAME_KEY, v.trim()); else localStorage.removeItem(NAME_KEY); } catch { /* private mode */ } };
const NEED_NAME = 'Write your first name before you make the messages. TDW puts it in each message.';
// A wa.me link takes the number's digits only. A contact with no phone, or who replied STOP, gets no button.
const waHref = (c: Contact, text: string) => (c.phone && !c.stopped ? `https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : null);
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
  const [first, setFirst] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  useEffect(() => { setFirst(readName()); }, []);
  useEffect(() => { void adminGet<{ contacts: Contact[] }>('/api/v2/admin/partners/contacts').then((d) => setContacts(Array.isArray(d && d.contacts) ? d.contacts : [])).catch(() => setContacts([])); }, []);
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const send = async () => {
    setErr(null);
    if (!asked) { setErr('Tick "She asked for this" first.'); return; }
    if (!first.trim()) { setErr(NEED_NAME); return; }
    try {
      const d = await adminPost<{ recipients: Recip[]; need_sender?: string | null; vendor_notice?: { sent: boolean; line: string } }>('/api/v2/admin/partners/forward', { ...f, vendor_id: f.vendor_id || undefined, asked: true,
        budget_from: Number(f.budget_from.replace(/\D/g, '')), budget_to: Number(f.budget_to.replace(/\D/g, '')), contact_ids: pick, sender: first.trim() });
      setOut(Array.isArray(d && d.recipients) ? d.recipients : []);
      setNotice(d && d.vendor_notice && d.vendor_notice.line ? d.vendor_notice.line : null);
      if (d && d.need_sender) setErr(d.need_sender);
    } catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not save the request. Please try again.'); }
  };
  const markSent = useCallback(async (r: Recip, sent: boolean) => {
    try { const d = await adminPost<{ sent_at: string | null }>(`/api/v2/admin/partners/forward/recipients/${r.id}/sent`, { sent });
      setOut((o) => (o || []).map((x) => (x.id === r.id ? { ...x, sent_at: d.sent_at } : x))); setOpen((o) => (o && o.id === r.id ? { ...o, sent_at: d.sent_at } : o)); }
    catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not save this. Please try again.'); }
  }, []);
  return (
    <div>
      <PageHead title="Forward a request" sub="Send a vendor's request to people TDW knows. You send each message yourself." />
      {!out ? (
        <>
          <Group title="You">
            <Field label="Your first name" value={first} onChange={(v) => { setFirst(v); keepName(v); }} note="TDW puts your first name in each message. This phone remembers it." />
          </Group>
          <Group title="The vendor">
            <Field label="Vendor on TDW (her vendor id from Vendors)" value={f.vendor_id} onChange={set('vendor_id')} note="If the vendor is not on TDW, write her Instagram handle and her phone number below instead." />
            <div style={{ display: 'flex' }}><Field label="Her Instagram handle" value={f.outside_handle} onChange={set('outside_handle')} /><Field label="Her phone" value={f.outside_phone} onChange={set('outside_phone')} /></div>
          </Group>
          <Group title="What she needs">
            <Field label="What" value={f.role} onChange={set('role')} note="For example, write: a model." />
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
          {notice ? <p style={{ font: F.t4, color: C.soft, padding: '8px 14px' }} data-vendor-notice="">{notice}</p> : null}
          {err ? <p style={{ font: F.t4, color: C.bad, padding: '8px 14px' }}>{err}</p> : null}
          <List>{out.map((r, i) => (
            <div key={r.id} onClick={() => { setOpen(r); setDraft(r.message || ''); }} style={{ cursor: 'pointer' }}>
              <ContactRow c={{ ...r.contact }} last={i === out.length - 1} />
              <p style={{ font: F.t5, color: r.sent_at ? C.ok : C.mute, padding: '0 14px 12px' }}>{r.sent_at ? 'This message is sent.' : 'This message is not sent yet. Tap to open it.'}</p>
            </div>))}</List>
        </Group>
      )}
      {open ? (
        <Sheet title={open.contact.name} sub="Send this message yourself from TDW's accounts." onClose={() => setOpen(null)}>
          {open.message ? (
            <div style={{ padding: '0 14px' }} data-hand-message="">
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '0 0 12px' }}>
                <span style={{ font: F.t4, color: C.soft }}>You can change the message before you send it.</span>
                <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={7} style={{ ...box, minHeight: 160, padding: 12, resize: 'vertical' }} data-hand-edit="" />
              </label>
              <CopyBox text={draft} label="Copy message" copied="Copied" />
              {waHref(open.contact, draft) ? <div style={{ display: 'flex', padding: '12px 0 0' }}><a href={waHref(open.contact, draft) as string} target="_blank" rel="noopener noreferrer" data-ext-link="" data-open-wa="" style={OUT_BTN}>Open in WhatsApp</a></div> : null}
            </div>
          ) : <SheetNote>{NEED_NAME}</SheetNote>}
          {open.instagram_url ? (
            <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px', flexWrap: 'wrap' }}>
              <a href={open.instagram_url} target="_blank" rel="noopener noreferrer" data-ext-link="" style={OUT_BTN}>Open on Instagram</a>
              {open.threads_url ? <a href={open.threads_url} target="_blank" rel="noopener noreferrer" data-ext-link="" style={OUT_BTN}>Open on Threads</a> : null}
            </div>
          ) : null}
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 18px', font: F.t3, color: C.ink }}>
            <input type="checkbox" checked={!!open.sent_at} onChange={(e) => { void markSent(open, e.target.checked); }} style={{ width: 22, height: 22 }} />I sent it</label>
          {!open.instagram_url ? <SheetNote>This contact has no Instagram handle. To send from Instagram or Threads, add the handle in Contacts.</SheetNote> : null}
        </Sheet>
      ) : null}
    </div>
  );
}
