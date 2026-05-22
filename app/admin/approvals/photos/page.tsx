'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, FieldSelect, BottomSheet, SectionDivider } from '../../_components/AdminUI';
import { getPhotoQueue, approvePhoto, rejectPhoto, type PhotoQueueItem } from '../../../../lib/admin-api/index';

const CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'videographer', label: 'Videographer' },
  { value: 'mua', label: 'MUA' },
  { value: 'decor', label: 'Decor' },
  { value: 'venue', label: 'Venue' },
  { value: 'caterer', label: 'Caterer' },
];
const STATES = [
  { value: 'pending',  label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all',      label: 'All' },
];

export default function PhotosPage() {
  const [photos, setPhotos]   = useState<PhotoQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [state, setState]     = useState('pending');
  const [selected, setSelected] = useState<PhotoQueueItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getPhotoQueue({ state, ...(category ? { category } : {}) })
      .then(d => { setPhotos(d.photos); setLoading(false); })
      .catch(() => setLoading(false));
  }, [state, category]);
  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    try { await approvePhoto(id); setPhotos(p => p.filter(x => x.id !== id)); showToast('Approved.'); setSelected(null); }
    catch { showToast('Failed.', true); }
  };

  const reject = async (id: string) => {
    try { await rejectPhoto(id, rejectReason || undefined); setPhotos(p => p.filter(x => x.id !== id)); showToast('Rejected.'); setSelected(null); setRejectReason(''); }
    catch { showToast('Failed.', true); }
  };

  return (
    <div>
      <PageHeader title="Photo Approvals" sub="Vendor portfolio photo queue" />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <FieldSelect label="State" value={state} onChange={setState} options={STATES} />
        </div>
        <div style={{ flex: 1 }}>
          <FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
        </div>
      </div>

      <SectionDivider label={`${photos.length} photo${photos.length !== 1 ? 's' : ''}`} />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, aspectRatio: '3/4' }} />)}
        </div>
      ) : photos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>Queue is clear</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {photos.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ aspectRatio: '3/4', background: '#1A1614', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.vendor?.business_name || 'Unknown'}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em' }}>{p.vendor?.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet visible={!!selected} onClose={() => { setSelected(null); setRejectReason(''); }} title="Review Photo">
        {selected && (
          <div>
            <div style={{ aspectRatio: '4/3', background: '#1A1614', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink, marginBottom: 4 }}>{selected.vendor?.business_name}</div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, letterSpacing: '0.1em', marginBottom: 20 }}>{selected.vendor?.category} · {selected.vendor?.routing_handle}</div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Reject reason (optional)</div>
              <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Not on-brand, low quality…" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, outline: 'none', minHeight: 44 }} />
            </div>

            <div style={{ display: 'flex', gap: 10, paddingBottom: 12 }}>
              <GhostBtn label="Reject" onClick={() => reject(selected.id)} danger />
              <GoldBtn label="Approve" onClick={() => approve(selected.id)} />
            </div>
          </div>
        )}
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
