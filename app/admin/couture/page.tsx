'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, BottomSheet } from '../_components/AdminUI';
import { getCoutureVendors, setCoutureEligible, type AdminVendor } from '../../../lib/admin-api/index';

export default function CouturePage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminVendor | null>(null);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getCoutureVendors().then(d => { setVendors(d.vendors); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (v: AdminVendor) => {
    try {
      await setCoutureEligible(v.id, !(v as any).couture_eligible);
      setVendors(vs => vs.map(x => x.id === v.id ? { ...x, couture_eligible: !(x as any).couture_eligible } as any : x));
      showToast((v as any).couture_eligible ? 'Removed from Couture.' : 'Added to Couture.');
      setSelected(null);
    } catch { showToast('Failed.', true); }
  };

  return (
    <div>
      <PageHeader title="Couture" sub="Invite-only programme vendors" />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 68 }} />)}
        </div>
      ) : vendors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No vendors yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {vendors.map(v => (
            <div key={v.id} onClick={() => setSelected(v)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 68 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink, marginBottom: 2 }}>{v.name}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>{v.category} · {v.city}</div>
              </div>
              {(v as any).couture_eligible && <span style={{ fontFamily: T.ff.label, fontSize: 7, color: T.gold, border: `0.5px solid ${T.borderStrong}`, borderRadius: 20, padding: '3px 10px', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Couture</span>}
            </div>
          ))}
        </div>
      )}

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, marginBottom: 24 }}>{selected.category} · {selected.city} · {selected.tier}</div>
            <GhostBtn label={(selected as any).couture_eligible ? 'Remove from Couture' : 'Add to Couture'} onClick={() => toggle(selected)} danger={(selected as any).couture_eligible} />
          </div>
        )}
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
