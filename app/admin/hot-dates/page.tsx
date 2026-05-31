'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput, SectionDivider } from '../_components/AdminUI';
import { getHotDates, addHotDate, deleteHotDate, type HotDate } from '../../../lib/admin-api/index';

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HotDatesPage() {
  const [dates, setDates]     = useState<HotDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate]       = useState('');
  const [note, setNote]       = useState('');
  const [region, setRegion]   = useState('All India');
  const [adding, setAdding]   = useState(false);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getHotDates().then(d => { setDates(d.dates); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!date) return;
    setAdding(true);
    try {
      await addHotDate({ date, note: note || undefined, region: region || 'All India' });
      showToast('Date added.');
      setShowAdd(false); setDate(''); setNote(''); setRegion('All India');
      load();
    } catch { showToast('Failed.', true); }
    finally { setAdding(false); }
  };

  const remove = async (id: string) => {
    try { await deleteHotDate(id); setDates(d => d.filter(x => x.id !== id)); showToast('Deleted.'); setConfirmId(null); }
    catch { showToast('Failed.', true); }
  };

  const DelBtn = ({ id }: { id: string }) => (
    <button onClick={() => confirmId === id ? remove(id) : setConfirmId(id)} style={{ background: confirmId === id ? T.dangerSoft : 'transparent', border: confirmId === id ? `0.5px solid ${T.danger}` : 'none', borderRadius: 8, color: T.danger, fontFamily: T.ff.label, fontWeight: 600, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '8px 12px', minHeight: 44, cursor: 'pointer' }}>{confirmId === id ? 'Confirm?' : 'Del'}</button>
  );

  const upcoming = dates.filter(d => new Date(d.date) >= new Date());
  const past     = dates.filter(d => new Date(d.date) < new Date());

  return (
    <div>
      <PageHeader title="Hot Dates" sub="Vivah Muhurat & auspicious wedding dates" action={<GoldBtn label={showAdd ? 'Close' : 'Add Date'} onClick={() => setShowAdd(s => !s)} />} />

      {/* Add form — inline, no sheet */}
      {showAdd && (
        <div style={{ background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Add Hot Date</p>
          <FieldInput label="Date (YYYY-MM-DD)" value={date} onChange={setDate} type="date" />
          <FieldInput label="Label (optional)" value={note} onChange={setNote} placeholder="Akshaya Tritiya, Dev Uthani Ekadashi…" />
          <FieldInput label="Region" value={region} onChange={setRegion} placeholder="All India" />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <GhostBtn label="Cancel" onClick={() => setShowAdd(false)} />
            <GoldBtn label={adding ? 'Adding…' : 'Add'} onClick={add} disabled={adding || !date} />
          </div>
        </div>
      )}

      <SectionDivider label={`${upcoming.length} upcoming`} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 10, height: 56 }} />)}
        </div>
      ) : upcoming.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 16 }}>No upcoming dates</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {upcoming.map(d => (
            <div key={d.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.gold, marginBottom: 2 }}>{fmtDate(d.date)}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>{d.label || 'Muhurat'} · {d.region}</div>
              </div>
              <DelBtn id={d.id} />
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <SectionDivider label={`${past.length} past`} />
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6, opacity: 0.45 }}>
            {past.slice(-5).reverse().map(d => (
              <div key={d.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, marginBottom: 2 }}>{fmtDate(d.date)}</div>
                  <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted }}>{d.label || 'Muhurat'}</div>
                </div>
                <DelBtn id={d.id} />
              </div>
            ))}
          </div>
        </>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
