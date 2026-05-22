'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, BottomSheet } from '../../_components/AdminUI';
import { getDiscoverQueue, grantDiscover, denyDiscover, revokeDiscover, type DiscoverRequest } from '../../../../lib/admin-api/index';

const STATE_COLORS: Record<string, string> = {
  under_review: '#C9A84C', approved: '#5CE0A0', denied: '#E05C5C', revoked: '#888', not_requested: '#444',
};

export default function DiscoverApprovalsPage() {
  const [requests, setRequests] = useState<DiscoverRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<DiscoverRequest | null>(null);
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getDiscoverQueue().then(d => { setRequests((d as any).requests || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const grant = async (id: string) => {
    try { await grantDiscover(id); showToast('Approved for Discover.'); load(); setSelected(null); }
    catch { showToast('Failed.', true); }
  };
  const deny = async (id: string) => {
    try { await denyDiscover(id); showToast('Denied.'); load(); setSelected(null); }
    catch { showToast('Failed.', true); }
  };
  const revoke = async (id: string) => {
    try { await revokeDiscover(id); showToast('Revoked.'); load(); setSelected(null); }
    catch { showToast('Failed.', true); }
  };

  const pending = requests.filter(r => r.discover_request_state === 'under_review');
  const rest    = requests.filter(r => r.discover_request_state !== 'under_review');

  return (
    <div>
      <PageHeader title="Discover Queue" sub={`${pending.length} pending review`} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 72 }} />)}
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No requests</div>
      ) : (
        <>
          {[...pending, ...rest].map(r => (
            <div key={r.vendor_id} onClick={() => setSelected(r)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, cursor: 'pointer', minHeight: 72 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink, marginBottom: 2 }}>{r.vendor_name}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em' }}>{r.vendor_category} · {r.vendor_city} · {r.portfolio_count} photos</div>
              </div>
              <span style={{ fontFamily: T.ff.label, fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: STATE_COLORS[r.discover_request_state] || T.soft, border: `0.5px solid ${STATE_COLORS[r.discover_request_state] || T.border}`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>
                {r.discover_request_state.replace('_', ' ')}
              </span>
            </div>
          ))}
        </>
      )}

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.vendor_name || ''}>
        {selected && (
          <div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, marginBottom: 20, letterSpacing: '0.1em' }}>{selected.vendor_category} · {selected.vendor_city} · {selected.portfolio_count} portfolio photos</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' as const }}>
              {selected.discover_request_state === 'under_review' && (
                <>
                  <GoldBtn label="Approve" onClick={() => grant(selected.vendor_id)} />
                  <GhostBtn label="Deny" onClick={() => deny(selected.vendor_id)} danger />
                </>
              )}
              {selected.discover_request_state === 'approved' && (
                <GhostBtn label="Revoke Access" onClick={() => revoke(selected.vendor_id)} danger />
              )}
              {selected.discover_request_state === 'denied' && (
                <GoldBtn label="Approve Anyway" onClick={() => grant(selected.vendor_id)} />
              )}
            </div>
          </div>
        )}
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
