"use client";
// v2/app/vendor/(shell)/supplies/bills.tsx · CE-47 · PRO · P2 app · BILLS INTO EXPENSES, inside Supplies.
// She adds a photo or a PDF of a purchase bill; it goes straight to her private folder; TDW reads it (the calendar
// import's reader, the founder's decision D) and fills the form. She corrects what is wrong, picks a category and adds
// it: TDW checks that the figures hold before anything is written to Expenses. A bill not added is deleted after 7 days.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { EXPENSE_CATEGORIES } from '@/lib/vendor/types/common';
import { fetchBills, addBill, confirmBill, discardBill, BILL_MIME, type BillDraft, type BillFields } from '@/v2/lib/vendor/api/bills';
import { errOf } from '@/v2/lib/vendor/api/papers';
import { SP_CSS } from './style';

const rs = (n: number | null | undefined) => (n == null ? '' : 'Rs ' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }));
const CATS = EXPENSE_CATEGORIES.map((v) => ({ v, label: v.charAt(0).toUpperCase() + v.slice(1) }));   // AddSheet's derivation, one list
type ShowFn = (msg: string, kind?: 'success' | 'error') => void;

export function BillsView({ vendorId, onBack }: { vendorId: string; onBack: () => void }) {
  // No toast here: the shared toast sits at the middle of the screen and would cover a WhatsApp number or a button at
  // 374 wide (the chair's rule). What happened is said in one line under the view's heading instead.
  const [note, setNote] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const show = useCallback((text: string, kind: 'success' | 'error' = 'success') => setNote({ text, kind }), []);
  const [drafts, setDrafts] = useState<BillDraft[] | null>(null);
  const [open, setOpen] = useState<BillDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const pick = useRef<HTMLInputElement | null>(null);
  const load = useCallback(async () => { const r = await fetchBills(vendorId); setDrafts(r.ok ? ((r as { drafts?: BillDraft[] }).drafts || []) : []); if (!r.ok) show(errOf(r), 'error'); }, [vendorId, show]);
  useEffect(() => { void load(); }, [load]);
  const onFile = async (f: File | undefined) => {
    if (!f) return; setBusy(true);
    const r = await addBill(vendorId, f); setBusy(false); if (pick.current) pick.current.value = '';
    if (!r.ok) { show(errOf(r), 'error'); void load(); return; }
    setOpen((r as { draft: BillDraft }).draft); void load();
  };
  if (open) return <BillForm vendorId={vendorId} draft={open} onBack={() => { setOpen(null); void load(); }} show={show} />;
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'‹'} Back to Supplies</button>
    <Head text="Bills" />
    {note ? <p className={`sp-status ${note.kind}`} role={note.kind === 'error' ? 'alert' : 'status'} data-sp-status="">{note.text}</p> : null}
    <p className="sp-lede">Add a photo or a PDF of a purchase bill. TDW reads it and fills in the figures; you check them and add it to Expenses with its GST.</p>
    <div className="sp-btns"><button type="button" className="sp-btn solid" data-bl-add="" disabled={busy} onClick={() => pick.current && pick.current.click()}>{busy ? 'Reading the bill…' : 'Add a bill'}</button></div>
    <input ref={pick} type="file" accept={BILL_MIME.join(',')} hidden data-bl-file="" onChange={(e) => void onFile(e.target.files ? e.target.files[0] : undefined)} />
    <p className="sp-mute">The bill is kept privately in your TDW account. Only you can open it.</p>
    {drafts && drafts.length ? (<><Head text="Not added yet" count={drafts.length} />
      <Group>{drafts.map((d) => (<div key={d.id} data-bl-draft={d.id}><Row title={d.fields.supplier_name || 'Bill'} facts={[rs(d.fields.amount), d.keep_line].filter(Boolean).join(' · ')} chevron onClick={() => setOpen(d)} /></div>))}</Group></>) : null}
    {drafts && !drafts.length ? <p className="sp-mute" data-bl-none="">No bills waiting. Bills you add go to Expenses once you check them.</p> : null}
    <style>{FR_CSS + SP_CSS + BL_CSS}</style>
  </Body>);
}

const FIELDS: { k: keyof BillFields; label: string; money?: boolean; date?: boolean; ph?: string }[] = [
  { k: 'supplier_name', label: 'Seller', ph: 'Glamour Beauty Supplies' },
  { k: 'supplier_gstin', label: 'Seller’s GSTIN', ph: '27AAPFU0939F1ZV' },
  { k: 'bill_number', label: 'Bill number', ph: 'GB/2026/0412' },
  { k: 'expense_date', label: 'Bill date', date: true },
  { k: 'taxable_value', label: 'Value before GST (Rs)', money: true, ph: '3,600' },
  { k: 'cgst', label: 'CGST (Rs)', money: true }, { k: 'sgst', label: 'SGST (Rs)', money: true }, { k: 'igst', label: 'IGST (Rs)', money: true },
  { k: 'amount', label: 'Total (Rs)', money: true, ph: '4,248' },
];
const toNum = (s: string) => { const t = s.replace(/[,\s]/g, ''); if (!t) return null; const n = Number(t); return Number.isFinite(n) ? n : NaN; };

function BillForm({ vendorId, draft, onBack, show }: { vendorId: string; draft: BillDraft; onBack: () => void; show: ShowFn }) {
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(FIELDS.map((f) => [f.k, draft.fields[f.k] == null ? '' : String(draft.fields[f.k])])));
  const [cat, setCat] = useState<string>('');
  const [problems, setProblems] = useState<string[]>(draft.problems || []);
  const [busy, setBusy] = useState(false); const [confirmGone, setConfirmGone] = useState(false);
  const add = async () => {
    if (!cat) { setProblems(['Choose a category.']); return; }
    const body: Record<string, unknown> = { category: cat };
    for (const f of FIELDS) { const s = (v[f.k] || '').trim(); if (!s) continue; if (f.money) { const n = toNum(s); if (Number.isNaN(n)) { setProblems([`${f.label}: type a number.`]); return; } body[f.k] = n; } else body[f.k] = s; }
    if (draft.fields.printed_rate != null) body.printed_rate = draft.fields.printed_rate;
    setBusy(true); const r = await confirmBill(vendorId, draft.id, body as BillFields & { category: string }); setBusy(false);
    if (!r.ok) { setProblems([errOf(r)]); return; }
    show('Bill added to Expenses', 'success'); onBack();
  };
  const gone = async () => { setBusy(true); const r = await discardBill(vendorId, draft.id); setBusy(false); if (!r.ok) { setProblems([errOf(r)]); return; } show('Bill deleted', 'success'); onBack(); };
  return (<Body>
    <button type="button" className="sp-back" onClick={onBack}>{'‹'} Back to Bills</button>
    <Head text="Check the bill" />
    <div className="sp-card" data-bl-form={draft.id}>
      <p className="sp-mute">TDW read these from the bill. Correct anything that is wrong, then add it.</p>
      {FIELDS.map((f) => (<div key={f.k}><div className="sp-label">{f.label}</div>
        <input className="sp-in" data-bl-field={f.k} type={f.date ? 'date' : 'text'} inputMode={f.money ? 'decimal' : undefined} value={v[f.k] || ''} placeholder={f.ph}
          onChange={(e) => setV((x) => ({ ...x, [f.k]: e.target.value }))} />
        {f.date && v[f.k] ? <p className="sp-dw">{dayInWords(v[f.k])}</p> : null}</div>))}
      <div><div className="sp-label">Category</div><div className="bl-chips">{CATS.map((c) => (
        <button key={c.v} type="button" data-bl-cat={c.v} className={`bl-chip${cat === c.v ? ' on' : ''}`} aria-pressed={cat === c.v} onClick={() => setCat(c.v)}>{c.label}</button>))}</div></div>
      {problems.length ? <div className="bl-problems" role="alert" data-bl-problems="">{problems.map((p) => <p key={p}>{p}</p>)}</div> : null}
      <div className="sp-btns"><button type="button" className="sp-btn solid" data-bl-confirm="" disabled={busy} onClick={add}>{busy ? 'Adding…' : 'Add to Expenses'}</button>
        {confirmGone ? <button type="button" className="sp-btn" data-bl-gone="" disabled={busy} onClick={gone}>Delete the bill</button>
          : <button type="button" className="sp-btn" data-bl-throw="" onClick={() => setConfirmGone(true)}>Throw away</button>}</div>
      {confirmGone ? <p className="sp-mute">The bill and what TDW read from it are deleted now. This cannot be undone.</p> : <p className="sp-mute">{draft.keep_line}</p>}
    </div>
    <style>{FR_CSS + SP_CSS + BL_CSS}</style>
  </Body>);
}

const BL_CSS = `
.bl-chips{display:flex;flex-wrap:wrap;gap:8px}
.bl-chip{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-ink);font:var(--wl-t4);touch-action:manipulation}
.bl-chip.on{background:var(--atelier-accent-text);border-color:var(--atelier-accent-text);color:var(--atelier-card-bg)}
.bl-problems{border:1px solid var(--role-critical);border-radius:10px;padding:10px 12px;font:var(--wl-t4);color:var(--atelier-ink)}
.bl-problems p{margin:0}
.bl-problems p + p{margin-top:6px}
`;
