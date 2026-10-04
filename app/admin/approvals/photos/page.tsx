'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, FieldSelect, SectionDivider, ActionChip } from '../../_components/AdminUI';
import { getPhotoQueue, approvePhoto, rejectPhoto, type PhotoQueueItem, type PhotoKind } from '../../../../lib/admin-api/index';

// CE-47 · WEB-6 · b172: two tabs over one queue. Portfolio is today's queue unchanged; Looks is vendors' look photos
// (the website's catalogue). A look photo's reason reaches the vendor's room, so it is asked for plainly.
const KINDS: Array<{ value: PhotoKind; label: string }> = [{ value: 'portfolio', label: 'Portfolio' }, { value: 'look', label: 'Looks' }];

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
  const [kind, setKind]       = useState<PhotoKind>('portfolio');
  const [photos, setPhotos]   = useState<PhotoQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [state, setState]     = useState('pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getPhotoQueue({ state, kind, ...(category && kind === 'portfolio' ? { category } : {}) })
      .then(d => { setPhotos(d.photos); setLoading(false); })
      .catch(() => setLoading(false));
  }, [state, category, kind]);
  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    try { await approvePhoto(id, kind); setPhotos(p => p.filter(x => x.id !== id)); showToast('Approved.'); }
    catch { showToast('Failed.', true); }
  };

  const reject = async (id: string) => {
    try { await rejectPhoto(id, rejectReason.trim().slice(0, 200) || undefined, kind); setPhotos(p => p.filter(x => x.id !== id)); showToast('Rejected.'); setRejectingId(null); setRejectReason(''); }
    catch { showToast('Failed.', true); }
  };

  return (
    <div>
      {/* WEB-8 (MERGED): ADM-1's title stands; WEB-6's Looks tab and its sub line lie on top */}
      <PageHeader title="Photos to check" sub={kind === 'look' ? 'Photos vendors added to looks on their websites' : 'Vendor portfolio photo queue'} />

      <div role="tablist" style={{ display: 'flex', gap: 6, marginBottom: 14 }} data-photo-kinds="">
        {KINDS.map(k => (
          <button key={k.value} role="tab" aria-selected={kind === k.value} onClick={() => { setKind(k.value); setRejectingId(null); }}
            style={{ flex: 1, minHeight: 40, borderRadius: 8, fontFamily: T.ff.body, fontSize: 13, border: `0.5px solid ${kind === k.value ? 'var(--role-metal)' : T.border}`, background: kind === k.value ? 'var(--atelier-row-hover)' : 'transparent', color: kind === k.value ? T.ink : T.muted }}>
            {k.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1 }}><FieldSelect label="State" value={state} onChange={setState} options={STATES} /></div>
        {kind === 'portfolio' && <div style={{ flex: 1 }}><FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} /></div>}
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
          {photos.map(p => {
            const rejecting = rejectingId === p.id;
            return (
              <div key={p.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '3/4', background: 'var(--atelier-section-bg)', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
                <div style={{ padding: '10px 10px 12px' }}>
                  <div style={{ fontFamily: T.ff.body, fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.vendor?.business_name || 'Unknown'}</div>
                  <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em', marginBottom: 10 }}>{kind === 'look' ? `Look photo · ${p.vendor?.category || ''}` : p.vendor?.category}</div>
                  {kind === 'look' && p.approval_state === 'rejected' && p.rejection_reason && <div style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, marginBottom: 8 }}>{p.rejection_reason}</div>}

                  {!rejecting ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ActionChip label="Reject" tone="no" onClick={() => { setRejectingId(p.id); setRejectReason(''); }} />
                      <ActionChip label="Approve" tone="ok" onClick={() => approve(p.id)} />
                    </div>
                  ) : (
                    <div>
                      <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder={kind === 'look' ? 'Reason the vendor will see (up to 200 letters)' : 'Reason (optional)…'} maxLength={200} autoFocus style={{ width: '100%', background: 'var(--atelier-input-bg)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '9px 11px', fontFamily: T.ff.body, fontSize: 12, color: T.ink, outline: 'none', minHeight: 40, marginBottom: 6 }} />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <ActionChip label="Cancel" tone="neutral" onClick={() => { setRejectingId(null); setRejectReason(''); }} />
                        <ActionChip label="Confirm" tone="no" onClick={() => reject(p.id)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
