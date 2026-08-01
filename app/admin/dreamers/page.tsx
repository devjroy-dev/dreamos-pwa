'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, FieldInput, ActionChip } from '../_components/AdminUI';
import { getCouples, patchCoupleTier, type AdminCouple } from '../../../lib/admin-api/index';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';
const TIERS = ['basic','gold','platinum'];
function fmt(d: string | null) { return d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'; }

export default function DreamersPage() {
  const [couples, setCouples] = useState<AdminCouple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [openId, setOpenId]   = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };
  const toggleOpen = (id: string) => { setConfirmDel(null); setOpenId(o => o === id ? null : id); };

  const deleteCouple = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v2/admin/couples/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(),
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) throw new Error('Failed');
      setCouples(c => c.filter(x => x.id !== id));
      showToast('Couple deleted.');
      setOpenId(null); setConfirmDel(null);
    } catch { showToast('Failed to delete.', true); }
  };

  const load = useCallback(() => {
    setLoading(true);
    getCouples().then(d => { setCouples(d.couples); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

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
          {filtered.map(c => {
            const open = openId === c.id;
            return (
              <div key={c.id} style={{ background: T.card, border: `0.5px solid ${open ? T.borderStrong : T.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 150ms' }}>
                <div onClick={() => toggleOpen(c.id)} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 72 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.08em' }}>{c.phone} · {c.wedding_city || 'City TBD'} · {fmt(c.wedding_date)}</div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, marginTop: 3 }}>{c.muse_saves} saves · {c.circle_members} circle</div>
                  </div>
                  <span style={{ fontFamily: T.ff.label, fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: T.gold, background: T.goldSoft, border: `0.5px solid ${T.gold}`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>{c.tier}</span>
                  <span style={{ color: T.soft, fontSize: 13, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 180ms', flexShrink: 0 }}>›</span>
                </div>

                {open && (
                  <div style={{ padding: '4px 16px 18px', borderTop: `0.5px solid ${T.border}` }}>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.12em', margin: '14px 0 12px' }}>Joined {fmt(c.created_at)}</div>

                    <div style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 9, color: T.soft, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Tier</div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                      {TIERS.map(t => (
                        <button key={t} onClick={() => setTier(c.id, t)} style={{ flex: 1, padding: '12px 0', borderRadius: 9, border: `0.5px solid ${c.tier === t ? T.gold : T.border}`, background: c.tier === t ? T.goldSoft : 'transparent', fontFamily: T.ff.label, fontWeight: c.tier === t ? 600 : 400, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: c.tier === t ? T.gold : T.soft, minHeight: 44, cursor: 'pointer' }}>{t}</button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {confirmDel === c.id
                        ? <ActionChip label="Tap again to delete permanently" tone="no" onClick={() => deleteCouple(c.id)} />
                        : <ActionChip label="Delete" tone="no" onClick={() => setConfirmDel(c.id)} />}
                    </div>
                    {confirmDel === c.id && <p style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.08em', marginTop: 8 }}>Deletes all couple data — muse saves, circle, conversations. Cannot be undone.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
