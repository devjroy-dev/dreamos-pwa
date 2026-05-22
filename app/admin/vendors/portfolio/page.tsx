'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, UploadZone, ImageGrid, LoadingGrid, SectionDivider, BottomSheet, FieldInput, type ImageGridItem } from '../../_components/AdminUI';
import { getVendors, type AdminVendor } from '../../../../lib/admin-api/index';
import { adminUploadFile } from '../../../../lib/admin-api/_base';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';
const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

type PortfolioPhoto = {
  id: string; image_url: string; caption: string | null;
  aesthetic_tags: string[]; is_hero: boolean; in_carousel: boolean;
  approval_state: string; created_at: string;
};

export default function VendorPortfolioPage() {
  const [vendors, setVendors]       = useState<AdminVendor[]>([]);
  const [vendorId, setVendorId]     = useState('');
  const [photos, setPhotos]         = useState<PortfolioPhoto[]>([]);
  const [loading, setLoading]       = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState('');
  const [toastErr, setToastErr]     = useState(false);
  const [caption, setCaption]       = useState('');
  const [showCaption, setShowCaption] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{ type: 'file'; file: File } | { type: 'url'; url: string } | null>(null);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  // Load vendor list once
  useEffect(() => {
    getVendors().then(d => setVendors(d.vendors)).catch(() => {});
  }, []);

  const selectedVendor = vendors.find(v => v.id === vendorId);

  const loadPhotos = useCallback(async (vid: string) => {
    if (!vid) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v2/admin/vendors/${vid}/portfolio`, {
        headers: { 'x-admin-password': ADMIN_PWD },
      });
      const d = await res.json();
      setPhotos(d.photos || []);
    } catch { showToast('Failed to load photos.', true); }
    finally { setLoading(false); }
  }, []);

  const handleVendorChange = (vid: string) => {
    setVendorId(vid);
    setPhotos([]);
    if (vid) loadPhotos(vid);
  };

  // When user picks a file or URL — show caption sheet before uploading
  const handleFile = async (file: File) => {
    setPendingUpload({ type: 'file', file });
    setCaption('');
    setShowCaption(true);
  };

  const handleUrl = async (url: string) => {
    setPendingUpload({ type: 'url', url });
    setCaption('');
    setShowCaption(true);
  };

  const submitUpload = async () => {
    if (!pendingUpload || !vendorId) return;
    setUploading(true);
    setShowCaption(false);
    try {
      let image_url = '';
      if (pendingUpload.type === 'file') {
        const r = await adminUploadFile(`/api/v2/admin/vendors/${vendorId}/portfolio/upload-url`, pendingUpload.file);
        image_url = r.image_url;
      } else {
        image_url = pendingUpload.url;
      }
      await fetch(`${API_BASE}/api/v2/admin/vendors/${vendorId}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD },
        body: JSON.stringify({ image_url, caption: caption.trim() || null }),
      });
      showToast('Photo added.');
      setPendingUpload(null);
      setCaption('');
      loadPhotos(vendorId);
    } catch { showToast('Upload failed.', true); }
    finally { setUploading(false); }
  };

  const deletePhoto = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/vendors/${vendorId}/portfolio/${id}`, {
        method: 'DELETE', headers: { 'x-admin-password': ADMIN_PWD },
      });
      setPhotos(prev => prev.filter(p => p.id !== id));
      showToast('Deleted.');
    } catch { showToast('Failed to delete.', true); }
  };

  // Toggle is_hero
  const toggleHero = async (id: string, currentHero: boolean) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/vendors/${vendorId}/portfolio/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD },
        body: JSON.stringify({ is_hero: !currentHero }),
      });
      setPhotos(prev => prev.map(p => ({ ...p, is_hero: p.id === id ? !currentHero : (currentHero ? false : p.is_hero) })));
      showToast(!currentHero ? 'Set as hero.' : 'Hero removed.');
    } catch { showToast('Failed.', true); }
  };

  // Map to ImageGrid format — active = in_carousel, extra shows hero badge + tags
  const gridItems: ImageGridItem[] = photos.map(p => ({
    id: p.id,
    image_url: p.image_url,
    caption: p.caption,
    active: p.in_carousel,
    extra: (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, padding: '4px 0 8px' }}>
        {p.is_hero && (
          <span style={{ fontFamily: T.ff.label, fontSize: 7, color: T.gold, border: `0.5px solid ${T.borderStrong}`, borderRadius: 20, padding: '2px 8px', letterSpacing: '0.1em' }}>HERO</span>
        )}
        {(p.aesthetic_tags || []).slice(0, 2).map((tag: string) => (
          <span key={tag} style={{ fontFamily: T.ff.label, fontSize: 7, color: T.muted, border: `0.5px solid ${T.border}`, borderRadius: 20, padding: '2px 8px' }}>{tag}</span>
        ))}
      </div>
    ),
  }));

  return (
    <div>
      <PageHeader title="Vendor Portfolio" sub="Upload photos on behalf of any vendor — auto-approved, feeds the discover grid" />

      {/* Vendor picker */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Select Vendor</div>
        <select
          value={vendorId}
          onChange={e => handleVendorChange(e.target.value)}
          style={{ width: '100%', background: '#141210', border: `0.5px solid ${vendorId ? T.gold : T.border}`, borderRadius: 10, padding: '14px 16px', fontFamily: T.ff.body, fontSize: 14, color: vendorId ? T.ink : T.soft, outline: 'none', minHeight: 52, appearance: 'none' as const }}
        >
          <option value="">— Choose a vendor —</option>
          {vendors.map(v => (
            <option key={v.id} value={v.id}>{v.name} {v.category ? `· ${v.category}` : ''} {v.city ? `· ${v.city}` : ''}</option>
          ))}
        </select>
      </div>

      {/* Selected vendor pill */}
      {selectedVendor && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(201,168,76,0.06)', border: `0.5px solid ${T.borderStrong}`, borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 14, color: T.gold }}>{selectedVendor.name[0]}</span>
          </div>
          <div>
            <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink }}>{selectedVendor.name}</div>
            <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em' }}>{selectedVendor.category || '—'} · {selectedVendor.city || '—'} · {selectedVendor.tier}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: T.ff.label, fontSize: 8, color: T.soft }}>
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {vendorId && (
        <>
          <UploadZone onFile={handleFile} onUrl={handleUrl} loading={uploading} />
          <SectionDivider label={`${photos.length} photo${photos.length !== 1 ? 's' : ''} in portfolio`} />
          {loading ? <LoadingGrid /> : (
            <>
              {photos.length > 0 && (
                <p style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.12em', marginBottom: 16 }}>
                  Tap Activate/Deactivate to toggle carousel. All photos are auto-approved.
                </p>
              )}
              <ImageGrid
                items={gridItems}
                onToggle={async (id, active) => {
                  try {
                    await fetch(`${API_BASE}/api/v2/admin/vendors/${vendorId}/portfolio/${id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD },
                      body: JSON.stringify({ in_carousel: !active }),
                    });
                    setPhotos(prev => prev.map(p => p.id === id ? { ...p, in_carousel: !active } : p));
                  } catch { showToast('Failed.', true); }
                }}
                onDelete={deletePhoto}
              />
            </>
          )}
        </>
      )}

      {!vendorId && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 22, color: T.muted, marginBottom: 8 }}>Select a vendor above</div>
          <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.muted, letterSpacing: '0.18em' }}>to upload or manage their portfolio</div>
        </div>
      )}

      {/* Caption sheet — shown before upload */}
      <BottomSheet visible={showCaption} onClose={() => { setShowCaption(false); setPendingUpload(null); }} title="Add Caption">
        <div style={{ marginBottom: 8 }}>
          {pendingUpload?.type === 'file' && (
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, marginBottom: 16 }}>📎 {(pendingUpload as any).file.name}</div>
          )}
          {pendingUpload?.type === 'url' && (
            <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.gold, marginBottom: 16, wordBreak: 'break-all' }}>🔗 URL ready</div>
          )}
          <FieldInput label="Caption (optional)" value={caption} onChange={setCaption} placeholder="Bridal lehenga shoot, Delhi 2025…" />
          <div style={{ paddingBottom: 12 }}>
            <GoldBtn label={uploading ? 'Uploading…' : 'Upload Photo'} onClick={submitUpload} disabled={uploading} />
          </div>
        </div>
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
