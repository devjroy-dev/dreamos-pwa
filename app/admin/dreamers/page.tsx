'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GhostBtn, Toast, FieldInput, BottomSheet } from '../_components/AdminUI';
import { getCouples, patchCoupleTier, type AdminCouple } from '../../../lib/admin-api/index';

const TIERS = ['basic','gold','platinum'];
function fmt(d: string | null) { return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'; }

export default function DreamersPage() {
  const [couples, setCouples] = useState<AdminCouple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState<AdminCouple | null>(null);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getCouples().then(d => { setCouples(d.couples); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const setTier = async (id: string, tier: string) => {
    try { await patchCoupleTier(id, tier); setCouples(v => v.map(x => x.id === id ? { ...x, tier } : x)); showToast('Tier updated.'); }
    catch { showToast('Failed.', true); }
  };

  const filtered = couples.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search));

  return (
    <div>
      <PageHeader title="Dreamers" sub={`${couples.length} total couples`} />
      <FieldInput label="Search" value={search} onChange={setSearch} placeholder="Name or phone…" />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 72 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No dreamers found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 400, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>{c.phone} · {c.wedding_city || 'City TBD'} · {fmt(c.wedding_date)}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, marginTop: 2 }}>{c.muse_saves} saves · {c.circle_members} circle</div>
              </div>
              <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: T.gold, background: 'rgba(201,168,76,0.1)', border: `0.5px solid rgba(201,168,76,0.3)`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>{c.tier}</span>
            </div>
          ))}
        </div>
      )}

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.15em', marginBottom: 20 }}>{selected.phone} · {fmt(selected.created_at)}</div>
            <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Set Tier</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {TIERS.map(t => (
                <button key={t} onClick={() => { setTier(selected.id, t); setSelected(s => s ? { ...s, tier: t } : s); }} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `0.5px solid ${selected.tier === t ? T.gold : T.border}`, background: selected.tier === t ? 'rgba(201,168,76,0.1)' : 'transparent', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: selected.tier === t ? T.gold : T.soft, minHeight: 44 }}>{t}</button>
              ))}
            </div>
          </div>
        )}
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
