'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, Toast, UploadZone, ImageGrid, LoadingGrid, SectionDivider, BottomSheet, FieldInput, type ImageGridItem } from '../../_components/AdminUI';
import { spotlightApi, getVendors, type SpotlightItem, type AdminVendor } from '../../../../lib/admin-api/index';
import { adminUploadFile } from '../../../../lib/admin-api/_base';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';
const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

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
      await fetch(`${API_BASE}/api/v2/admin/spotlight`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD }, body: JSON.stringify({ image_url, cloudinary_public_id, vendor_id: vendorId || null, caption: caption || null, week_label: weekLabel || null }) });
      showToast('Added to Spotlight.');
      setShowAdd(false); setCaption(''); setWeekLabel(''); setVendorId(''); setPendingFile(null); setPendingUrl('');
      load();
    } catch { showToast('Failed.', true); }
    finally { setUploading(false); }
  };

  const toggle = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/spotlight/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD }, body: JSON.stringify({ active: !currentActive }) });
      setItems(prev => prev.map(i => i.id === id ? { ...i, active: !currentActive } : i));
    } catch { showToast('Failed.', true); }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/spotlight/${id}`, { method: 'DELETE', headers: { 'x-admin-password': ADMIN_PWD } });
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
      <PageHeader title="Spotlight" sub="Vendors of the week — shown in EXPLORE grid on discover landing" action={<GoldBtn label="Add" onClick={() => setShowAdd(true)} />} />

      <SectionDivider label={`${items.length} spotlight card${items.length !== 1 ? 's' : ''}`} />
      {loading ? <LoadingGrid /> : <ImageGrid items={gridItems} onToggle={toggle} onDelete={remove} />}

      <BottomSheet visible={showAdd} onClose={() => setShowAdd(false)} title="Add to Spotlight">
        <UploadZone
          onFile={async (file) => { setPendingFile(file); setPendingUrl(''); }}
          onUrl={async (url) => { setPendingUrl(url); setPendingFile(null); }}
          loading={false}
        />
        {(pendingFile || pendingUrl) && (
          <div style={{ background: 'rgba(201,168,76,0.08)', border: `0.5px solid ${T.borderStrong}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontFamily: T.ff.label, fontSize: 9, color: T.gold, letterSpacing: '0.1em' }}>
            {pendingFile ? pendingFile.name : '🔗 URL ready'}
          </div>
        )}
        <FieldInput label="Caption (optional)" value={caption} onChange={setCaption} placeholder="India's finest this week" />
        <FieldInput label="Week label (optional)" value={weekLabel} onChange={setWeekLabel} placeholder="May 2026" />
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, color: T.soft, letterSpacing: '0.22em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Link to Vendor (optional)</div>
          <select value={vendorId} onChange={e => setVendorId(e.target.value)} style={{ width: '100%', background: '#141210', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, outline: 'none', minHeight: 44, appearance: 'none' as const }}>
            <option value="">No vendor link</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.name} — {v.category}</option>)}
          </select>
        </div>
        <div style={{ paddingBottom: 12 }}>
          <GoldBtn label={uploading ? 'Adding…' : 'Add to Spotlight'} onClick={submit} disabled={uploading || (!pendingFile && !pendingUrl)} />
        </div>
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
