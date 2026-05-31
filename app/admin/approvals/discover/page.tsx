'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, ActionChip } from '../../_components/AdminUI';
import { getDiscoverQueue, grantDiscover, denyDiscover, revokeDiscover, type DiscoverRequest } from '../../../../lib/admin-api/index';

const STATE_COLORS: Record<string, string> = {
  under_review: '#C44058', approved: '#4EC994', denied: '#E0574E', revoked: '#888', not_requested: '#555',
};

export default function DiscoverApprovalsPage() {
  const [requests, setRequests] = useState<DiscoverRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getDiscoverQueue().then(d => { setRequests((d as any).requests || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const grant  = async (id: string) => { try { await grantDiscover(id);  showToast('Approved for Discover.'); load(); } catch { showToast('Failed.', true); } };
  const deny   = async (id: string) => { try { await denyDiscover(id);   showToast('Denied.');               load(); } catch { showToast('Failed.', true); } };
  const revoke = async (id: string) => { try { await revokeDiscover(id); showToast('Revoked.');              load(); } catch { showToast('Failed.', true); } };

  const pending = requests.filter(r => r.discover_request_state === 'under_review');
  const rest    = requests.filter(r => r.discover_request_state !== 'under_review');

  return (
    <div>
      <PageHeader title="Discover Queue" sub={`${pending.length} pending review`} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 100 }} />)}
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No requests</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[...pending, ...rest].map(r => {
            const st = r.discover_request_state;
            return (
              <div key={r.vendor_id} style={{ background: T.card, border: `0.5px solid ${st === 'under_review' ? T.borderStrong : T.border}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: (st === 'under_review' || st === 'approved' || st === 'denied') ? 14 : 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 3 }}>{r.vendor_name}</div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.08em' }}>{r.vendor_category} · {r.vendor_city} · {r.portfolio_count} photos</div>
                  </div>
                  <span style={{ fontFamily: T.ff.label, fontSize: 7, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: STATE_COLORS[st] || T.soft, border: `0.5px solid ${STATE_COLORS[st] || T.border}`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>
                    {st.replace('_', ' ')}
                  </span>
                </div>

                {st === 'under_review' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ActionChip label="Deny" tone="no" onClick={() => deny(r.vendor_id)} />
                    <ActionChip label="Approve" tone="ok" onClick={() => grant(r.vendor_id)} />
                  </div>
                )}
                {st === 'approved' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ActionChip label="Revoke Access" tone="no" onClick={() => revoke(r.vendor_id)} />
                  </div>
                )}
                {st === 'denied' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ActionChip label="Approve Anyway" tone="ok" onClick={() => grant(r.vendor_id)} />
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
