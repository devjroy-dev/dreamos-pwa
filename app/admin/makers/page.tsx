'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput, BottomSheet } from '../_components/AdminUI';
import { getVendors, patchVendorTier, patchVendorDiscover, patchVendorRevoke, type AdminVendor } from '../../../lib/admin-api/index';

const TIERS = ['trial','essential','signature','prestige'];

function fmt(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); }

export default function MakersPage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [selected, setSelected] = useState<AdminVendor | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getVendors().then(d => { setVendors(d.vendors); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const setTier = async (id: string, tier: string) => {
    try { await patchVendorTier(id, tier); setVendors(v => v.map(x => x.id === id ? { ...x, tier } : x)); showToast('Tier updated.'); }
    catch { showToast('Failed to update tier.', true); }
  };

  const toggleDiscover = async (v: AdminVendor) => {
    try { await patchVendorDiscover(v.id); setVendors(vs => vs.map(x => x.id === v.id ? { ...x, discover_eligible: !v.discover_eligible } : x)); showToast(v.discover_eligible ? 'Removed from Discover.' : 'Added to Discover.'); }
    catch { showToast('Failed.', true); }
  };

  const revoke = async (id: string) => {
    try { await patchVendorRevoke(id); setVendors(v => v.map(x => x.id === id ? { ...x, status: 'paused' } : x)); showToast('Access revoked.'); setSelected(null); }
    catch { showToast('Failed.', true); }
  };

  const filtered = vendors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search || v.name?.toLowerCase().includes(q) || v.phone?.includes(search);
    const matchFilter = filter === 'all' || v.tier === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <PageHeader title="Makers" sub={`${vendors.length} total vendors`} />

      <FieldInput label="Search" value={search} onChange={setSearch} placeholder="Name or phone…" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {['all', ...TIERS].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 20, border: `0.5px solid ${filter === f ? T.gold : T.border}`, background: filter === f ? 'rgba(201,168,76,0.1)' : 'transparent', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: filter === f ? T.gold : T.soft, minHeight: 36 }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 72 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No vendors found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {filtered.map(v => (
            <div key={v.id} onClick={() => setSelected(v)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 400, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>{v.category || '—'} · {v.city || '—'} · {v.phone}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: T.gold, background: 'rgba(201,168,76,0.1)', border: `0.5px solid rgba(201,168,76,0.3)`, borderRadius: 20, padding: '3px 10px' }}>{v.tier}</span>
                {v.discover_eligible && <span style={{ fontFamily: T.ff.label, fontSize: 7, color: T.success, letterSpacing: '0.1em' }}>● Discover</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.15em', marginBottom: 20 }}>{selected.phone} · Joined {fmt(selected.created_at)}</div>

            <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Set Tier</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' as const }}>
              {TIERS.map(t => (
                <button key={t} onClick={() => setTier(selected.id, t)} style={{ padding: '10px 18px', borderRadius: 20, border: `0.5px solid ${selected.tier === t ? T.gold : T.border}`, background: selected.tier === t ? 'rgba(201,168,76,0.1)' : 'transparent', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: selected.tier === t ? T.gold : T.soft, minHeight: 44 }}>{t}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <GhostBtn label={selected.discover_eligible ? 'Remove from Discover' : 'Add to Discover'} onClick={() => { toggleDiscover(selected); setSelected(s => s ? { ...s, discover_eligible: !s.discover_eligible } : s); }} />
            </div>

            <GhostBtn label="Revoke Access" onClick={() => revoke(selected.id)} danger />
          </div>
        )}
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
