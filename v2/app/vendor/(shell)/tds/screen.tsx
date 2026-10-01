// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock's screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/tds/screen.tsx — THE TDS LEDGER'S BODY, NO CHROME.
//
// ── §4-4 · TDS CROSSES · R-38.11 · R-38.12 ─────────────────────────────────
// Two routes render this module and neither owns it: `app/w/tds/page.tsx` mounts it inside
// `WorklistShell`, and `app/vendor/tds/page.tsx` survives as the untouched fallback and
// supplies the old `<Header/>` itself. IMPORTED by both, copied by neither — and a ledger
// is the last surface in the estate that should exist twice.
//
// ── THE `Header` IMPORT IS GONE FROM THIS FILE AND ITS ABSENCE IS ASSERTED ──
// S2's `SliceShell` finding: a conditional does not remove a module from a bundle; only not
// importing it does. The mount lives at the fallback ROUTE.
//
// ── THE MASTHEAD ROW KEEPS ITS RIGHT HALF ──────────────────────────────────
// The chevron and the word 「TDS」 are the old layout's chrome and retire inside the shell;
// the FY selector and the CSV export are controls and stay in both trees. A spacer takes
// over the label's `flex: 1` so nothing moves under the thumb.
//
// ── MONEY REGISTER ─────────────────────────────────────────────────────────
// Every figure on this surface is `Rs X,XX,XXX` — no glyph, no k/L/Cr — and this crossing
// authors no new figure and reformats none. Stated because a ledger crossing is exactly
// where a helpful reformat would look like tidying.
//
// ── THE DECLARED GAPS ──────────────────────────────────────────────────────
// The body carries the rooms' older type register and F-38.22's colour literals (R-38.12).
// Its add sheet is full-cover `position:fixed` with a live catcher (R-38.22). The FAB reads
// the tree (F-38.59).

import { useEffect, useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { selectStyle } from '@/lib/vendor/controls';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Toast } from '@/v2/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';   // FE-5's pill, in the room head (FE-8)
import { RECORD_CSS, Facts } from '@/v2/components/worklist/RecordPage';
import { dayInWords } from '@/v2/lib/worklist/dayInWords';
import { fetchTdsEntries, fetchTdsSummary, createTdsEntry, deleteTdsEntry, exportTdsCsv } from '@/v2/lib/vendor/api/vendor';
import type { TdsEntry, TdsSummary } from '@/lib/vendor/types/vendor';

import { istTodayISO } from '@/lib/vendor/istDay';
const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--atelier-ink)' /* DESIGN-1 · P5 */, brassWarm: 'var(--atelier-label)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', boxSizing: 'border-box',
  background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 12,
  fontFamily: F.body, fontWeight: 300, fontSize: '1rem', lineHeight: 1.5, color: A.ink, outline: 'none',
  caretColor: A.interactive, 
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: '0.8125rem',
  color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 8,
};

function currentFY(): string {
  const now = new Date(); const m = now.getMonth() + 1; const y = now.getFullYear();
  if (m >= 4) return `FY${y}-${String(y+1).slice(2)}`;
  return `FY${y-1}-${String(y).slice(2)}`;
}
function fyOptions(): string[] {
  const cur = currentFY(); const year = parseInt(cur.slice(2,6));
  return [cur, `FY${year-1}-${String(year).slice(2)}`, `FY${year-2}-${String(year-1).slice(2)}`];
}


// CE-47 L4b (FE-7): TDS's words (V10 approved; the rest carried from the room) and the year in words ("FY 2026-27").
const TDSW = {
  addPill: '+ New TDS entry', headline: (fy: string) => `TDS \u00b7 ${fy}`, entries: 'Entries',
  gross: 'Gross', deducted: 'TDS deducted', net: 'Net received', section: 'Section', rate: 'Rate', date: 'Date',
  pan: 'Client PAN', tan: 'Client TAN', cert: 'Certificate / Form 16A No.', exportCsv: 'Export CSV',
  empty: (fy: string) => `No TDS entries for ${fy}.`, back: 'Back to TDS', delete: 'Delete', deleteAsk: 'Delete this entry?', keepIt: 'Keep it',
} as const;
const fyWords = (fy: string) => fy.replace(/^FY(\d{4})-(\d{2})$/, 'FY $1-$2');
const TDS_CSS = `.tds-seg{display:flex;border:1px solid var(--atelier-card-border);border-radius:12px;overflow:hidden;margin:4px 0 16px}
.tds-segb{flex:1;min-height:44px;background:transparent;border:0;border-right:1px solid var(--atelier-card-border);color:var(--atelier-ink-mute);font:var(--wl-t4)}
.tds-segb:last-child{border-right:0}.tds-segb.on{color:var(--atelier-ink);font:var(--wl-tb);box-shadow:inset 0 -2px 0 var(--atelier-accent-text)}
.tds-export{margin:16px 0 32px;align-self:flex-start}.tds-dw{margin:6px 0 0;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.fx-ask{border:1px solid var(--atelier-card-border);border-radius:12px;background:var(--atelier-card-bg);padding:16px;margin:8px 0 32px}.fx-askline{margin:0 0 12px;font:var(--wl-tb);color:var(--atelier-ink)}.fx-askrow{display:flex;gap:8px}`;

export function TdsScreen({ vendorId }: { vendorId: string }) {
  const { toast, show } = useToast();
  const [fy, setFy] = useState(currentFY());
  const [entries, setEntries] = useState<TdsEntry[]>([]);
  const [summary, setSummary] = useState<TdsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientName, setClientName] = useState('');
  const [grossAmt, setGrossAmt] = useState('');
  const [tdsRate, setTdsRate] = useState('10');
  const [section, setSection] = useState('194J');
  const [dedDate, setDedDate] = useState(istTodayISO());
  const [pan, setPan] = useState('');
  const [tan, setTan] = useState('');
  const [certNo, setCertNo] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);   // CE-47 L4b: an entry opens as a page
  const [asking, setAsking] = useState(false);                 // CE-47 L4b: Delete asks first

  function reload(selectedFy = fy) {
    setLoading(true);
    Promise.all([
      fetchTdsEntries(vendorId, { financial_year: selectedFy }),
      fetchTdsSummary(vendorId, selectedFy),
    ]).then(([er, sr]) => {
      if (er.ok) setEntries((er as { entries: TdsEntry[] }).entries);
      if (sr.ok) setSummary(sr as TdsSummary);
    }).finally(() => setLoading(false));
  }
  useEffect(() => { reload(); }, []);
  function onFyChange(newFy: string) { setFy(newFy); reload(newFy); }

  async function doCreate() {
    if (!clientName.trim() || !grossAmt || Number(grossAmt) <= 0 || saving) return;
    setSaving(true);
    const res = await createTdsEntry({
      client_name: clientName.trim(), gross_amount: Number(grossAmt),
      tds_rate: Number(tdsRate), section: section || undefined,
      deduction_date: dedDate, financial_year: fy,
      client_pan: pan || undefined, client_tan: tan || undefined,
      certificate_no: certNo || undefined,
    });
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed', 'error');
    else { show('TDS entry logged', 'success'); setAddOpen(false); setClientName(''); setGrossAmt(''); setPan(''); setTan(''); setCertNo(''); reload(); }
    setSaving(false);
  }

  async function doDelete(entry: TdsEntry) {
    const res = await deleteTdsEntry(entry.id);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); return; }
    show('Deleted', 'success');
    setEntries(prev => prev.filter(e => e.id !== entry.id));
    reload();
  }
  async function doExport() {
    try { await exportTdsCsv(vendorId, fy); show('CSV downloaded', 'success'); }
    catch { show('Export failed', 'error'); }
  }

  const canCreate = clientName.trim().length > 0 && Number(grossAmt) > 0;
  const tdsAmt = grossAmt ? Math.round(Number(grossAmt) * Number(tdsRate) / 100) : 0;
  const netAmt = grossAmt ? Number(grossAmt) - tdsAmt : 0;

  // CE-47 L4b (FE-7): the room as FE-6's approved frame (board 9), in RoomRows; every handler above is unchanged.
  const Rs = (n: number | null | undefined) => `Rs ${Number(n ?? 0).toLocaleString('en-IN')}`;
  const open = openId ? entries.find((e) => e.id === openId) ?? null : null;
  if (open) return (
    <div>
      <Body>
        <button type="button" className="rp-back" onClick={() => { setOpenId(null); setAsking(false); }}>{'\u2039'} {TDSW.back}</button>
        <h2 className="fr-h" style={{ marginTop: 8 }}>{open.client_name}</h2>
        <Facts rows={[[TDSW.gross, Rs(open.gross_amount)], [TDSW.deducted, Rs(open.tds_amount)], [TDSW.net, Rs(open.net_received)],
          [TDSW.section, open.section ?? '\u2014'], [TDSW.rate, `${open.tds_rate}%`], [TDSW.date, dayInWords(open.deduction_date)],
          [TDSW.pan, open.client_pan ?? '\u2014'], [TDSW.tan, open.client_tan ?? '\u2014'], [TDSW.cert, open.certificate_no ?? '\u2014']]} />
        {asking ? (
          <div className="fx-ask"><p className="fx-askline">{TDSW.deleteAsk}</p><div className="fx-askrow">
            <button type="button" className="rp-job warn" onClick={() => { setAsking(false); setOpenId(null); void doDelete(open); }}>{TDSW.delete}</button>
            <button type="button" className="rp-job" onClick={() => setAsking(false)}>{TDSW.keepIt}</button></div></div>
        ) : <button type="button" className="fr-quiet" onClick={() => setAsking(true)}>{TDSW.delete}</button>}
      </Body>
      <Toast toast={toast} /><style>{FR_CSS + RECORD_CSS + TDS_CSS}</style>
    </div>
  );
  return (
    <div>
      <Body>
        <RoomHeadAdd addKey="tds" label={TDSW.addPill} onAdd={() => setAddOpen(true)} />
        <h2 className="fr-h" style={{ marginTop: 0 }}>{TDSW.headline(fyWords(fy))}</h2>
        <div className="tds-seg" role="tablist">{fyOptions().map((f) => (
          <button key={f} type="button" role="tab" aria-selected={f === fy} className={'tds-segb' + (f === fy ? ' on' : '')} onClick={() => onFyChange(f)}>{fyWords(f)}</button>))}</div>
        {summary ? <Facts rows={[[TDSW.gross, Rs(summary.total_gross)], [TDSW.deducted, Rs(summary.total_tds)], [TDSW.net, Rs(summary.total_net)]]} /> : null}
        <Head text={TDSW.entries} count={entries.length || undefined} />
        {!loading && entries.length === 0 ? <p className="fr-empty">{TDSW.empty(fyWords(fy))}</p> : (
          <Group>{entries.map((e) => (
            <Row key={e.id} title={e.client_name} facts={[e.section ? `${TDSW.section} ${e.section}` : '', dayInWords(e.deduction_date)].filter(Boolean).join(' \u00b7 ')}
              value={Rs(e.tds_amount)} chevron onClick={() => setOpenId(e.id)} />))}</Group>
        )}
        <button type="button" className="rp-job tds-export" onClick={() => void doExport()}>{TDSW.exportCsv}</button>
      </Body>
      {addOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setAddOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '24px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ width: 36, height: 3, borderRadius: 12, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: '0.8125rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 4 }}>New entry</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: '1.375rem', color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 8 }}>Log TDS</div>

            <div><div style={labelStyle}>Client / Company *</div><input style={inputStyle} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="ABC Corp Pvt Ltd" /></div>
            <div><div style={labelStyle}>Gross Amount (Rs) *</div><input style={inputStyle} type="number" value={grossAmt} onChange={e => setGrossAmt(e.target.value)} placeholder="100000" /></div>
            <div>
              <div style={labelStyle}>TDS Rate (%)</div>
              <select value={tdsRate} onChange={e => setTdsRate(e.target.value)} style={selectStyle(inputStyle)}>
                <option value="1">1%</option><option value="2">2%</option><option value="5">5%</option>
                <option value="10">10%</option><option value="20">20%</option>
              </select>
            </div>
            {grossAmt && Number(grossAmt) > 0 && (
              <div style={{
                padding: '12px 16px',
                background: 'var(--atelier-input-bg)',
                border: '0.5px solid var(--atelier-card-border)',
                borderRadius: 12, display: 'flex', gap: 16,
                fontFamily: F.script, fontSize: '1rem', lineHeight: 1.5,
              }}>
                <span style={{ color: A.inkSoft }}>TDS: <strong style={{ color: A.red, fontStyle: 'normal' }}>Rs {tdsAmt.toLocaleString('en-IN')}</strong></span>
                <span style={{ color: A.inkSoft }}>Net: <strong style={{ color: A.brassWarm, fontStyle: 'normal' }}>Rs {netAmt.toLocaleString('en-IN')}</strong></span>
              </div>
            )}
            <div>
              <div style={labelStyle}>Section</div>
              <select value={section} onChange={e => setSection(e.target.value)} style={selectStyle(inputStyle)}>
                <option value="194J">194J: Professional services</option>
                <option value="194C">194C: Contractors</option>
                <option value="194I">194I: Rent</option>
                <option value="194H">194H: Commission</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><div style={labelStyle}>Deduction date</div><input style={inputStyle} type="date" value={dedDate} onChange={e => setDedDate(e.target.value)} />{dedDate ? <p data-date-words="" className="tds-dw">{dayInWords(dedDate)}</p> : null}</div>
            <div><div style={labelStyle}>Client PAN</div><input style={inputStyle} value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="AABCS1234X" /></div>
            <div><div style={labelStyle}>Client TAN</div><input style={inputStyle} value={tan} onChange={e => setTan(e.target.value.toUpperCase())} placeholder="DELS01234C" /></div>
            <div><div style={labelStyle}>Certificate / Form 16A No.</div><input style={inputStyle} value={certNo} onChange={e => setCertNo(e.target.value)} placeholder="Optional" /></div>

            {!canCreate && <div style={{ fontFamily: F.script, fontSize: '1rem', lineHeight: 1.5, color: A.red, marginTop: 4 }}>Client name and gross amount are required.</div>}

            <button type="button" onClick={doCreate} disabled={!canCreate || saving} className="atelier-fab" style={{
              padding: '16px 0', borderRadius: 12, cursor: (canCreate && !saving) ? 'pointer' : 'default',
              border: '0.5px solid var(--atelier-label)',
              fontFamily: F.label, fontWeight: 400, fontSize: '0.8125rem', color: INK_DEEP,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              opacity: (canCreate && !saving) ? 1 : 0.5, marginTop: 8,
            }}>{saving ? 'Saving…' : 'Log entry'}</button>
          </div>
        </div>
      )}
      <Toast toast={toast} /><style>{FR_CSS + RECORD_CSS + TDS_CSS}</style>
    </div>
  );
}
