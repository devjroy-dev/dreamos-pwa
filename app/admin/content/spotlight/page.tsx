'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, UploadZone, ImageGrid, LoadingGrid, SectionDivider, FieldInput, type ImageGridItem } from '../../_components/AdminUI';
import { spotlightApi, getVendors, type SpotlightItem, type AdminVendor } from '../../../../lib/admin-api/index';
import { adminUploadFile } from '../../../../lib/admin-api/_base';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';

export default function SpotlightPage() {
  const [items, setItems]       = useState<SpotlightItem[]>([]);
  const [vendors, setVendors]   = useState<AdminVendor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAdd, setShowAdd]   = useState(false);
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState(false);

  // Add form
  const [caption, setCaption]     = useState('');
  const [weekLabel, setWeekLabel] = useState('');
  const [vendorId, setVendorId]   = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingUrl, setPendingUrl]   = useState('');

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([spotlightApi.list(), getVendors()]).then(([s, v]) => {
      setItems(s.spotlight);
      setVendors(v.vendors);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setCaption(''); setWeekLabel(''); setVendorId(''); setPendingFile(null); setPendingUrl(''); };

  const submit = async () => {
    if (!pendingFile && !pendingUrl) return;
    setUploading(true);
    try {
      let image_url = pendingUrl;
      let cloudinary_public_id: string | undefined;
      if (pendingFile) {
        const r = await adminUploadFile('/api/v2/admin/spotlight/upload-url', pendingFile);
        image_url = r.image_url; cloudinary_public_id = r.cloudinary_public_id;
      }
      await fetch(`${API_BASE}/api/v2/admin/spotlight`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify({ image_url, cloudinary_public_id, vendor_id: vendorId || null, caption: caption || null, week_label: weekLabel || null }) });
      showToast('Added to Spotlight.');
      setShowAdd(false); resetForm();
      load();
    } catch { showToast('Failed.', true); }
    finally { setUploading(false); }
  };

  const toggle = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/spotlight/${id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ active: !currentActive }) });
      setItems(prev => prev.map(i => i.id === id ? { ...i, active: !currentActive } : i));
    } catch { showToast('Failed.', true); }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/spotlight/${id}`, { method: 'DELETE', headers: adminHeaders() });
      setItems(prev => prev.filter(i => i.id !== id));
      showToast('Deleted.');
    } catch { showToast('Failed.', true); }
  };

  const gridItems: ImageGridItem[] = items.map(i => ({
    id: i.id, image_url: i.image_url, caption: i.caption, active: i.active,
    extra: i.vendor_name ? <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.gold, padding: '2px 0 6px', letterSpacing: '0.1em' }}>{i.vendor_name} · {i.week_label || ''}</div> : undefined,
  }));

  return (
    <div>
      <PageHeader title="Spotlight" sub="Vendors of the week — shown in EXPLORE grid on discover landing" action={<GoldBtn label={showAdd ? 'Close' : 'Add'} onClick={() => { if (showAdd) { setShowAdd(false); resetForm(); } else { setShowAdd(true); } }} />} />

      {/* Add form — inline, no sheet */}
      {showAdd && (
        <div style={{ background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Add to Spotlight</p>
          <UploadZone
            onFile={async (file) => { setPendingFile(file); setPendingUrl(''); }}
            onUrl={async (url) => { setPendingUrl(url); setPendingFile(null); }}
            loading={false}
          />
          {(pendingFile || pendingUrl) && (
            <div style={{ background: T.goldSoft, border: `0.5px solid ${T.borderStrong}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontFamily: T.ff.label, fontSize: 9, color: T.gold, letterSpacing: '0.1em' }}>
              {pendingFile ? pendingFile.name : '🔗 URL ready'}
            </div>
          )}
          <FieldInput label="Caption (optional)" value={caption} onChange={setCaption} placeholder="India's finest this week" />
          <FieldInput label="Week label (optional)" value={weekLabel} onChange={setWeekLabel} placeholder="May 2026" />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 9, color: T.soft, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Link to Vendor (optional)</div>
            <select value={vendorId} onChange={e => setVendorId(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, outline: 'none', minHeight: 44, appearance: 'none' as const }}>
              <option value="">No vendor link</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name} — {v.category}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <GhostBtn label="Cancel" onClick={() => { setShowAdd(false); resetForm(); }} />
            <GoldBtn label={uploading ? 'Adding…' : 'Add to Spotlight'} onClick={submit} disabled={uploading || (!pendingFile && !pendingUrl)} />
          </div>
        </div>
      )}

      <SectionDivider label={`${items.length} spotlight card${items.length !== 1 ? 's' : ''}`} />
      {loading ? <LoadingGrid /> : <ImageGrid items={gridItems} onToggle={toggle} onDelete={remove} />}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
