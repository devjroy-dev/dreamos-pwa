'use client';
// /wedding/tds — TDS ledger · Atelier rebuild
// FY selector, summary card, entries list, CSV export, log entry FAB.

import { useEffect, useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { selectStyle } from '@/lib/vendor/controls';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchTdsEntries, fetchTdsSummary, createTdsEntry, deleteTdsEntry, exportTdsCsv } from '@/lib/vendor/api/vendor';
import type { TdsEntry, TdsSummary } from '@/lib/vendor/types/vendor';

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
  fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
  caretColor: A.interactive, 
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 8,
  color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6,
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

export default function TdsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <TdsScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function TdsScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
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
  const [dedDate, setDedDate] = useState(new Date().toISOString().slice(0,10));
  const [pan, setPan] = useState('');
  const [tan, setTan] = useState('');
  const [certNo, setCertNo] = useState('');

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

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.interactiveWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>TDS</span>
        <button type="button" onClick={doExport} style={{
          padding: '6px 12px', background: 'transparent',
          border: '0.5px solid var(--atelier-input-border)', borderRadius: 2, cursor: 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.interactiveWarm,
          letterSpacing: '0.32em', textTransform: 'uppercase',
        }}>Export CSV</button>
      </div>

      {/* FY pills */}
      <div style={{ padding: '14px 22px 6px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {fyOptions().map(f => (
          <button key={f} type="button" onClick={() => onFyChange(f)} style={{
            padding: '6px 12px', borderRadius: 2, cursor: 'pointer',
            background: fy === f ? 'rgba(201,168,76,0.18)' : 'transparent',
            border: `0.5px solid ${fy === f ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            color: fy === f ? A.interactiveWarm : A.inkMute,
            letterSpacing: '0.28em', textTransform: 'uppercase',
          }}>{f}</button>
        ))}
      </div>

      {/* Summary ledger */}
      {summary && (
        <div style={{ margin: '14px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>{fy}</span>
            <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
            <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{summary.entry_count} entries</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'stretch',
            padding: '22px 8px 18px',
            borderTop: '0.5px solid var(--atelier-card-border)',
            borderBottom: '0.5px solid var(--atelier-card-border)',
          }}>
            {[
              { label: 'Gross',        val: summary.total_gross, color: 'var(--atelier-ink)' },
              { label: 'TDS',          val: summary.total_tds,   color: A.red, divider: true },
              { label: 'Net Received', val: summary.total_net,   color: A.brassWarm, divider: true },
            ].map(item => (
              <div key={item.label} style={{ flex: 1, textAlign: 'center', padding: '0 4px', position: 'relative' }}>
                {item.divider && <span aria-hidden style={{ position: 'absolute', left: 0, top: '12%', bottom: '12%', width: '0.5px', background: 'rgba(201,168,76,0.22)' }} />}
                <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, lineHeight: 1, color: item.color, letterSpacing: '-0.005em' }}>Rs {item.val.toLocaleString('en-IN')}</div>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--atelier-label)', marginTop: 10 }}>{item.label}</div>
              </div>
            ))}
          </div>
          {summary.by_section.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              {summary.by_section.map(s => (
                <span key={s.section} style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute, letterSpacing: '0.005em' }}>
                  {s.section} · Rs {s.tds.toLocaleString('en-IN')} ({s.count})
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>Loading…</div>
        </div>
      ) : entries.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute, textAlign: 'center', lineHeight: 1.5 }}>
            No TDS entries for {fy}.<br /><span style={{ color: A.brassWarm }}>Log your first below.</span>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', marginTop: 14, paddingBottom: 110 }}>
          {entries.map(e => (
            <div key={e.id} style={{
              padding: '14px 24px',
              borderBottom: '0.5px solid var(--atelier-card-border)',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' }}>{e.client_name}</div>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, color: 'var(--atelier-label)', letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 3 }}>
                  {e.deduction_date} · {e.section || '—'} · {e.tds_rate}%
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 5, fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5 }}>
                  <span style={{ color: A.inkSoft }}>Gross Rs {e.gross_amount.toLocaleString('en-IN')}</span>
                  <span style={{ color: A.red }}>TDS Rs {e.tds_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button type="button" onClick={() => doDelete(e)} style={{
                padding: '6px 10px', background: 'transparent',
                border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.red,
                letterSpacing: '0.28em', textTransform: 'uppercase', flexShrink: 0,
              }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={() => setAddOpen(true)} aria-label="Add TDS entry" className="atelier-fab" style={{
        position: 'fixed', bottom: 'calc(82px + env(safe-area-inset-bottom))', right: 20, zIndex: 10,
        // ── TDW_09 · F-09.119 CURED · founder-acknowledged 「 ok 」 ────────────
        // 「 TDS page shows a l in place of + fab 」. The plus was set in the
        // DISPLAY serif (Italiana) at 25px. Italiana has no drawn glyph for
        // U+002B, so the founder's phone fell back and rendered a bare vertical
        // bar — the control read as a lowercase L. The character was always
        // correct; the FACE could not draw it.
        // The cure is the HOUSE IDIOM, census-derived rather than invented:
        // F.body at 20 in a 46x46 coin is what the three sibling FAB sites
        // already carry, so this stops being the odd one out. THE SIZE CHANGE
        // IS PART OF THE CURE, NOT A SIDE EFFECT — the donor idiom travels
        // whole, because half an idiom is a new fourth variant. 54 -> 46 is
        // visible on the walk and is meant to be.
        width: 46, height: 46, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.body, fontSize: 20, fontWeight: 400, lineHeight: 1,
        cursor: 'pointer', border: '0.5px solid var(--atelier-label)',
      }}>+</button>

      {addOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--atelier-overlay)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setAddOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%',
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '20px 24px calc(24px + env(safe-area-inset-bottom))',
            display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '85vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 2 }}>New Entry</div>
            <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 20, color: 'var(--atelier-ink)', lineHeight: 1.15, marginBottom: 6 }}>Log TDS</div>

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
                padding: '10px 14px',
                background: 'var(--atelier-input-bg)',
                border: '0.5px solid var(--atelier-card-border)',
                borderRadius: 2, display: 'flex', gap: 18,
                fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5,
              }}>
                <span style={{ color: A.inkSoft }}>TDS: <strong style={{ color: A.red, fontStyle: 'normal' }}>Rs {tdsAmt.toLocaleString('en-IN')}</strong></span>
                <span style={{ color: A.inkSoft }}>Net: <strong style={{ color: A.brassWarm, fontStyle: 'normal' }}>Rs {netAmt.toLocaleString('en-IN')}</strong></span>
              </div>
            )}
            <div>
              <div style={labelStyle}>Section</div>
              <select value={section} onChange={e => setSection(e.target.value)} style={selectStyle(inputStyle)}>
                <option value="194J">194J — Professional Services</option>
                <option value="194C">194C — Contractors</option>
                <option value="194I">194I — Rent</option>
                <option value="194H">194H — Commission</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><div style={labelStyle}>Deduction Date</div><input style={inputStyle} type="date" value={dedDate} onChange={e => setDedDate(e.target.value)} /></div>
            <div><div style={labelStyle}>Client PAN</div><input style={inputStyle} value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="AABCS1234X" /></div>
            <div><div style={labelStyle}>Client TAN</div><input style={inputStyle} value={tan} onChange={e => setTan(e.target.value.toUpperCase())} placeholder="DELS01234C" /></div>
            <div><div style={labelStyle}>Certificate / Form 16A No.</div><input style={inputStyle} value={certNo} onChange={e => setCertNo(e.target.value)} placeholder="Optional" /></div>

            {!canCreate && <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.red, marginTop: 2 }}>Client name and gross amount are required.</div>}

            <button type="button" onClick={doCreate} disabled={!canCreate || saving} className="atelier-fab" style={{
              padding: '14px 0', borderRadius: 2, cursor: (canCreate && !saving) ? 'pointer' : 'default',
              border: '0.5px solid var(--atelier-label)',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              opacity: (canCreate && !saving) ? 1 : 0.5, marginTop: 6,
            }}>{saving ? 'Saving…' : 'Log Entry'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
