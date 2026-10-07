'use client';
// app/admin/partners/contacts/page.tsx · CE-47 · PTN-A1 app · More > Partners > Contacts: the people TDW knows, kept by the
// admin. "How we know them" is required. A Stopped contact (they replied STOP; read live from the prospects lane) shows NO
// WhatsApp and NO Call (the chair, 6 Oct 2026); its Instagram and website links stay.
import { useCallback, useEffect, useState } from 'react';
import { adminGet, adminPost, adminPatch } from '@/lib/admin-api/_base';
import { PageHead, List, Pill, Sheet, SheetNote, ActionStrip, Chips, Empty, C, F } from '../../_components/Kit';
import { CONTACT_KINDS } from '@/lib/partner/words';
import { ContactRow, type Contact } from '../../_components/ContactRow';

const box: React.CSSProperties = { width: '100%', minHeight: 44, padding: '0 12px', borderRadius: 12, border: `0.5px solid ${C.inputLine}`, background: C.input, font: F.t3, color: C.ink };
function Field({ label, value, onChange, note }: { label: string; value: string; onChange: (v: string) => void; note?: string }) {
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 18px' }}><span style={{ font: F.t4, color: C.soft }}>{label}</span>
    <input style={box} value={value} onChange={(e) => onChange(e.target.value)} />{note ? <span style={{ font: F.t5, color: C.mute }}>{note}</span> : null}</label>;
}

export default function ContactsAdmin() {
  const [list, setList] = useState<Contact[] | null>(null);
  const [edit, setEdit] = useState<Partial<Contact> & { website?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => { try { setList((await adminGet<{ contacts: Contact[] }>('/api/v2/admin/partners/contacts')).contacts); } catch (e) { setErr(e instanceof Error ? e.message : 'Could not read contacts.'); setList([]); } }, []);
  useEffect(() => { void load(); }, [load]);
  const save = async () => {
    if (!edit) return; setErr(null);
    const body = { name: edit.name || '', kind: edit.kind || '', how_we_know: edit.how_we_know || '', instagram_handle: edit.instagram_handle || null, website: edit.website || null, phone: edit.phone || null, knows_tdw: !!edit.knows_tdw };
    try { if (edit.id) await adminPatch(`/api/v2/admin/partners/contacts/${edit.id}`, body); else await adminPost('/api/v2/admin/partners/contacts', body); setEdit(null); await load(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Could not save.'); }
  };
  return (
    <div>
      <PageHead title="Contacts" sub="People and organisations TDW knows" action={<Pill onClick={() => { setErr(null); setEdit({ kind: '' }); }}>+ Add contact</Pill>} />
      {list === null ? null : list.length === 0 ? <Empty>No contacts yet.</Empty> : (
        <List>{list.map((c, i) => <ContactRow key={c.id} c={c} last={i === list.length - 1} onOpen={() => { setErr(null); setEdit({ ...c, website: c.website_url || '' }); }} />)}</List>
      )}
      {list && list.some((c) => c.stopped) ? <p style={{ font: F.t5, color: C.mute, padding: '12px 14px' }}>Stopped means they replied STOP. TDW never sends them WhatsApp again, and no one at TDW is one tap from messaging them.</p> : null}
      {edit ? (
        <Sheet title={edit.id ? 'Edit contact' : 'Add contact'} onClose={() => setEdit(null)}>
          <Field label="Name" value={edit.name || ''} onChange={(v) => setEdit({ ...edit, name: v })} />
          <div style={{ padding: '8px 18px' }}><span style={{ font: F.t4, color: C.soft }}>Kind</span><div style={{ marginTop: 6 }}><Chips items={CONTACT_KINDS} value={edit.kind || ''} onChange={(k) => setEdit({ ...edit, kind: k })} /></div></div>
          <Field label="Instagram handle" value={edit.instagram_handle || ''} onChange={(v) => setEdit({ ...edit, instagram_handle: v })} note="The handle only, for example houseofvyas" />
          <Field label="Website (optional)" value={edit.website || ''} onChange={(v) => setEdit({ ...edit, website: v })} note="For example https://houseofvyas.com" />
          <Field label="Phone (optional)" value={edit.phone || ''} onChange={(v) => setEdit({ ...edit, phone: v })} note="With the country code, for example +91 98111 00031" />
          <Field label="How we know them" value={edit.how_we_know || ''} onChange={(v) => setEdit({ ...edit, how_we_know: v })} note="Required." />
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 18px', font: F.t3, color: C.ink }}>
            <input type="checkbox" checked={!!edit.knows_tdw} onChange={(e) => setEdit({ ...edit, knows_tdw: e.target.checked })} style={{ width: 22, height: 22 }} />They know TDW (WhatsApp may be used)</label>
          {err ? <SheetNote tone={C.bad}>{err}</SheetNote> : null}
          <ActionStrip items={[{ label: 'Save contact', primary: true, onClick: () => { void save(); } }]} />
        </Sheet>
      ) : null}
    </div>
  );
}
