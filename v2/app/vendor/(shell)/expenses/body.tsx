'use client';
// CE-47 L4b (FE-7): Expenses as FE-6's approved frame (board 9): the pill, "This month · Rs X" with "N filed in <Month
// Year>", one month picker, rows with the amount at the right, an expense as a page (Edit, then Delete last and asked).
// It draws what the room did through SliceScreen and nothing more: the same data (useExpensesData), the same add and
// edit form (AddSheet, slice 'expenses', whose date field already carries the date in words), the same delete door.
// No category filter (SPEC item 10).
import { useMemo, useState } from 'react';
import { useExpensesData } from '@/v2/hooks/vendor/useVendorData';
import { AddSheet } from '@/v2/components/vendor/AddSheet';
import { deleteExpense } from '@/v2/lib/vendor/api/vendor';
import { Body, Group, Row, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';   // FE-5's pill, in the room head (FE-8)
import { RECORD_CSS, Facts } from '@/v2/components/worklist/RecordPage';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { Toast } from '@/v2/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import type { Expense } from '@/lib/vendor/types/vendor';

const EXW = {
  addPill: '+ New expense', thisMonth: 'This month', filed: (n: number, month: string) => `${n} filed in ${month}`,
  empty: (month: string) => `No expenses in ${month}.`, back: 'Back to Expenses', edit: 'Edit',
  amount: 'Amount', category: 'Category', date: 'Date', client: 'Client', whatFor: 'What for',
  delete: 'Delete', deleteAsk: 'Delete this expense?', keepIt: 'Keep it', removed: 'Expense removed.',
} as const;
const Rs = (n: number | null | undefined) => `Rs ${Number(n ?? 0).toLocaleString('en-IN')}`;
const monthKeyOf = (iso?: string | null) => String(iso ?? '').slice(0, 7);
const monthWords = (key: string) => dayInWords(`${key}-01`).replace(/^1 /, '');
const cap = (s?: string | null) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const istMonthNow = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 7);

export default function ExpensesSlice({ vendorId }: { vendorId: string }) {
  const { data, loading, refresh } = useExpensesData(vendorId);
  const { toast, show } = useToast();
  const rows = useMemo(() => (data ?? []).slice().sort((a, b) => String(b.expense_date).localeCompare(String(a.expense_date))), [data]);
  const months = useMemo(() => { const ks = new Set([istMonthNow(), ...rows.map((r) => monthKeyOf(r.expense_date)).filter(Boolean)]); return [...ks].sort().reverse().slice(0, 6); }, [rows]);
  // It opens on this month when this month has expenses, otherwise on the latest month that does (never an empty
  // page while older costs exist); the headline says "This month" only when it is.
  const [picked, setPicked] = useState<string | null>(null);
  const latest = rows.length ? monthKeyOf(rows[0].expense_date) : istMonthNow();
  const month = picked ?? (rows.some((r) => monthKeyOf(r.expense_date) === istMonthNow()) ? istMonthNow() : latest);
  const setMonth = (k: string) => setPicked(k);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const inMonth = rows.filter((r) => monthKeyOf(r.expense_date) === month);
  const total = inMonth.reduce((s, r) => s + Number(r.amount || 0), 0);
  const open = openId ? rows.find((r) => r.id === openId) ?? null : null;

  async function remove(e: Expense) {
    const r = await deleteExpense(e.id);
    if (!r.ok) { show((r as { error?: string }).error ?? 'Failed', 'error'); return; }
    show(EXW.removed, 'success'); setOpenId(null); refresh();
  }
  const sheet = (
    <AddSheet open={addOpen || !!editing} slice="expenses" onClose={() => { setAddOpen(false); setEditing(null); refresh(); }} onToast={show}
      existing={editing as unknown as Record<string, unknown> | null} existingId={editing?.id} />
  );
  if (open) return (
    <>
      <Body>
        <button type="button" className="rp-back" onClick={() => { setOpenId(null); setAsking(false); }}>{'\u2039'} {EXW.back}</button>
        <h2 className="fr-h" style={{ marginTop: 8 }}>{open.description || '\u2014'}</h2>
        <Facts rows={[[EXW.amount, Rs(open.amount)], [EXW.category, cap(open.category) || '\u2014'], [EXW.date, dayInWords(open.expense_date)], [EXW.client, open.client_name || '\u2014']]} />
        <button type="button" className="rp-next" onClick={() => setEditing(open)}>{EXW.edit}</button>
        {asking ? (
          <div className="ex-ask"><p className="ex-askline">{EXW.deleteAsk}</p><div className="ex-askrow">
            <button type="button" className="rp-job warn" onClick={() => { setAsking(false); void remove(open); }}>{EXW.delete}</button>
            <button type="button" className="rp-job" onClick={() => setAsking(false)}>{EXW.keepIt}</button></div></div>
        ) : <button type="button" className="fr-quiet" onClick={() => setAsking(true)}>{EXW.delete}</button>}
      </Body>
      {sheet}<Toast toast={toast} /><style>{FR_CSS + RECORD_CSS + EX_CSS}</style>
    </>
  );
  return (
    <>
      <Body>
        <RoomHeadAdd addKey="expense" label={EXW.addPill} onAdd={() => setAddOpen(true)} />
        <h2 className="fr-h" style={{ marginTop: 0 }}>{month === istMonthNow() ? EXW.thisMonth : monthWords(month)} {'\u00b7'} {Rs(total)}</h2>
        <p className="fr-lede" style={{ margin: '0 0 12px' }}>{EXW.filed(inMonth.length, monthWords(month))}</p>
        <label className="ex-month"><select aria-label={monthWords(month)} value={month} onChange={(e) => setMonth(e.target.value)}>
          {months.map((k) => <option key={k} value={k}>{monthWords(k)}</option>)}</select><span aria-hidden="true">{monthWords(month)} {'\u2304'}</span></label>
        {!loading && inMonth.length === 0 ? <p className="fr-empty">{EXW.empty(monthWords(month))}</p> : (
          <Group>{inMonth.map((r) => (
            <Row key={r.id} title={r.description || '\u2014'} facts={[cap(r.category), dayInWords(r.expense_date)].filter(Boolean).join(' \u00b7 ')}
              value={Rs(r.amount)} chevron onClick={() => setOpenId(r.id)} />))}</Group>
        )}
      </Body>
      {sheet}<Toast toast={toast} /><style>{FR_CSS + RECORD_CSS + EX_CSS}</style>
    </>
  );
}
const EX_CSS = `.ex-month{position:relative;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;margin:0 0 16px;border:1px solid var(--atelier-accent-text);border-radius:999px;color:var(--atelier-accent-text);font:var(--wl-tb);align-self:flex-start}
.ex-month select{position:absolute;inset:0;opacity:0;width:100%;min-height:44px}
.ex-ask{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;margin:8px 0 32px}.ex-askline{margin:0 0 12px;font:var(--wl-tb);color:var(--atelier-ink)}.ex-askrow{display:flex;gap:8px}`;
