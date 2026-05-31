'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, ActionChip } from '../_components/AdminUI';
import { getCoutureVendors, setCoutureEligible, type AdminVendor } from '../../../lib/admin-api/index';

export default function CouturePage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getCoutureVendors().then(d => { setVendors(d.vendors); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (v: AdminVendor) => {
    const next = !(v as any).couture_eligible;
    try {
      await setCoutureEligible(v.id, next);
      setVendors(vs => vs.map(x => x.id === v.id ? { ...x, couture_eligible: next } as any : x));
      showToast(next ? 'Added to Couture.' : 'Removed from Couture.');
    } catch { showToast('Failed.', true); }
  };

  return (
    <div>
      <PageHeader title="Couture" sub="Invite-only programme vendors" />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 92 }} />)}
        </div>
      ) : vendors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No vendors yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {vendors.map(v => {
            const eligible = !!(v as any).couture_eligible;
            return (
              <div key={v.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 3 }}>{v.name}</div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.08em' }}>{v.category} · {v.city}</div>
                  </div>
                  {eligible && <span style={{ fontFamily: T.ff.label, fontSize: 7, fontWeight: 600, color: T.gold, background: T.goldSoft, border: `0.5px solid ${T.gold}`, borderRadius: 20, padding: '3px 10px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, flexShrink: 0 }}>Couture</span>}
                </div>
                <ActionChip label={eligible ? 'Remove from Couture' : 'Add to Couture'} tone={eligible ? 'no' : 'neutral'} onClick={() => toggle(v)} />
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
