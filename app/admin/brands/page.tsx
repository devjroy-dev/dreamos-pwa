'use client';
// app/admin/brands/page.tsx · CE-47 · PRO · P3 app · More > Brands: the brand list vendors see in Brand collaborations.
// A row leads with the Instagram handle the brand's OWN website shows (the source page is kept); an email is kept only
// when it is a role address on the brand's own domain (pr@, collab@ ...), never a person's. The server checks each rule
// and answers in one sentence. Doors: dream-os /api/v2/admin/brands (PRO P3 server).
import { useCallback, useEffect, useState } from 'react';
import { adminGet, adminPost, adminPatch } from '@/lib/admin-api/_base';
import { PageHead, Tabs, List, PersonRow, Pill, Sheet, SheetNote, ActionStrip, Empty, C, F, fullDate } from '../_components/Kit';

type Brand = { id: string; name: string; trades: string[]; looks_for: string | null; website_url: string; instagram_handle: string; role_email: string | null; form_url: string | null;
  source_url: string; followers_min: number | null; followers_max: number | null; checked_on: string; state: 'listed' | 'hidden'; pitches: number };
type Form = { name: string; trades: string[]; looks_for: string; website_url: string; instagram_handle: string; role_email: string; form_url: string; source_url: string; followers_min: string; followers_max: string; checked_on: string };
const blank = (): Form => ({ name: '', trades: [], looks_for: '', website_url: '', instagram_handle: '', role_email: '', form_url: '', source_url: '', followers_min: '', followers_max: '', checked_on: new Date(Date.now() + 19800000).toISOString().slice(0, 10) });
const toForm = (b: Brand): Form => ({ name: b.name, trades: b.trades, looks_for: b.looks_for || '', website_url: b.website_url, instagram_handle: b.instagram_handle, role_email: b.role_email || '', form_url: b.form_url || '',
  source_url: b.source_url, followers_min: b.followers_min == null ? '' : String(b.followers_min), followers_max: b.followers_max == null ? '' : String(b.followers_max), checked_on: b.checked_on });
const input = { width: '100%', minHeight: 44, padding: '0 12px', borderRadius: 12, border: `0.5px solid ${C.inputLine}`, background: C.input, font: F.t3, color: C.ink, boxSizing: 'border-box' as const };
const FIELDS: { k: keyof Form; label: string; ph?: string; type?: string }[] = [
  { k: 'name', label: 'Brand name', ph: "De'Lanci India" },
  { k: 'website_url', label: 'The brand’s own website', ph: 'de-lanci.in' },
  { k: 'instagram_handle', label: 'Instagram handle, as the brand’s own website shows it', ph: 'delanci.india' },
  { k: 'source_url', label: 'The page on its website where you found these details', ph: 'https://de-lanci.in/pages/collaboration' },
  { k: 'role_email', label: 'Collaboration email (a role address only, such as pr@ or collab@)', ph: 'pr@de-lanci.in' },
  { k: 'form_url', label: 'Collaboration form link (if the brand has one)', ph: 'https://' },
  { k: 'looks_for', label: 'What the brand looks for (from its page)', ph: 'Makeup artists with 5,000 followers or more' },
  { k: 'followers_min', label: 'Smallest follower count it works with', ph: '5,000' },
  { k: 'followers_max', label: 'Largest follower count it works with', ph: '50,000' },
  { k: 'checked_on', label: 'The day you checked these details', type: 'date' },
];

export default function BrandsAdmin() {
  const [tab, setTab] = useState<'listed' | 'hidden'>('listed');
  const [rows, setRows] = useState<Brand[] | null>(null);
  const [trades, setTrades] = useState<{ key: string; word: string }[]>([]);
  const [edit, setEdit] = useState<{ id: string | null; f: Form } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => {
    try { const d = await adminGet<{ brands: Brand[]; trades: { key: string; word: string }[] }>(`/api/v2/admin/brands/?state=${tab}`); setRows(Array.isArray(d && d.brands) ? d.brands : []); setTrades(Array.isArray(d && d.trades) ? d.trades : []); }
    catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not read the brands.'); setRows([]); }
  }, [tab]);
  useEffect(() => { void load(); }, [load]);
  const save = async () => {
    if (!edit) return; setErr(null);
    try { if (edit.id) await adminPatch(`/api/v2/admin/brands/${edit.id}`, edit.f); else await adminPost('/api/v2/admin/brands/', edit.f); setEdit(null); await load(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not save the brand.'); }
  };
  const flip = async (b: Brand) => { setErr(null); try { await adminPost(`/api/v2/admin/brands/${b.id}/state`, { state: b.state === 'listed' ? 'hidden' : 'listed' }); await load(); } catch (e) { setErr(e instanceof Error ? e.message : 'TDW could not save the brand.'); } };
  const word = (k: string) => (trades.find((t) => t.key === k) || { word: k }).word;
  return (
    <div>
      <PageHead title="Brands" sub="Brands that vendors can pitch in Brand collaborations" action={<Pill onClick={() => { setErr(null); setEdit({ id: null, f: blank() }); }}>Add a brand</Pill>} />
      <Tabs items={[{ key: 'listed', label: 'On the list' }, { key: 'hidden', label: 'Hidden' }]} value={tab} onChange={(k) => setTab(k as 'listed' | 'hidden')} />
      {err && !edit ? <p style={{ font: F.t4, color: C.bad, padding: '8px 14px' }}>{err}</p> : null}
      {rows === null ? null : rows.length === 0 ? <Empty>There are no brands here.</Empty> : (
        <List>{rows.map((b, i) => (
          <PersonRow key={b.id} name={b.name} tag={`@${b.instagram_handle}`} tagTone={C.accent}
            line={`${b.trades.map(word).join(', ')} · checked on ${fullDate(b.checked_on)} · ${b.pitches} ${b.pitches === 1 ? 'pitch' : 'pitches'}`}
            onOpen={() => { setErr(null); setEdit({ id: b.id, f: toForm(b) }); }} last={i === rows.length - 1} />))}</List>
      )}
      {edit ? (
        <Sheet title={edit.id ? 'Change the brand' : 'Add a brand'} sub="Take every detail from the brand’s own website." onClose={() => setEdit(null)}>
          <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div><div style={{ font: F.t5, color: C.mute, marginBottom: 6 }}>Trades it works with</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{trades.map((t) => { const on = edit.f.trades.includes(t.key); return (
                <button key={t.key} type="button" aria-pressed={on} onClick={() => setEdit({ ...edit, f: { ...edit.f, trades: on ? edit.f.trades.filter((x) => x !== t.key) : [...edit.f.trades, t.key] } })}
                  style={{ minHeight: 44, padding: '0 14px', borderRadius: 999, border: `1px solid ${on ? C.accent : C.line}`, background: on ? C.accent : 'transparent', color: on ? C.card : C.ink, font: F.t4 }}>{t.word}</button>); })}</div></div>
            {FIELDS.map((x) => (<label key={x.k} style={{ display: 'block' }}><div style={{ font: F.t5, color: C.mute, marginBottom: 6 }}>{x.label}</div>
              <input style={input} type={x.type || 'text'} value={String(edit.f[x.k])} placeholder={x.ph} onChange={(e) => setEdit({ ...edit, f: { ...edit.f, [x.k]: e.target.value } })} /></label>))}
          </div>
          <SheetNote>An email that belongs to a person is not kept. A brand appears to vendors whose trade it works with.</SheetNote>
          {err ? <SheetNote tone={C.bad}>{err}</SheetNote> : null}
          <ActionStrip items={[{ label: 'Save', primary: true, onClick: () => { void save(); } },
            edit.id ? { label: (rows || []).find((b) => b.id === edit.id)?.state === 'hidden' ? 'Show to vendors' : 'Hide from vendors', onClick: () => { const b = (rows || []).find((r) => r.id === edit.id); if (b) { void flip(b); setEdit(null); } } } : null]} />
        </Sheet>
      ) : null}
    </div>
  );
}
