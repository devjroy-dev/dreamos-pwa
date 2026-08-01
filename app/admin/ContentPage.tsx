'use client';
// Shared content page component — used by landing, exploring, heroes, muse-pool, surprise-me
// Import and render with the appropriate API module.

import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, UploadZone, ImageGrid, LoadingGrid, Counter, SectionDivider, type ImageGridItem } from './_components/AdminUI';
import { adminUploadFile } from '../../lib/admin-api/_base';
import { adminHeaders, API_BASE as _AB } from '@/lib/admin-api/_base';

export type ContentPageConfig = {
  title:       string;
  sub?:        string;
  adminBase:   string;          // e.g. '/api/v2/admin/landing-photos'
  listKey:     string;          // e.g. 'photos' or 'images' or 'heroes'
  max?:        number;          // if set, shows counter
  folder:      string;          // Cloudinary folder label for display
};

export default function ContentPage({ cfg }: { cfg: ContentPageConfig }) {
  const [items, setItems]     = useState<ImageGridItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]     = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://dream-os-production.up.railway.app';

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${cfg.adminBase}`, { headers: adminHeaders() });
      const d = await res.json();
      const raw = d[cfg.listKey] || d.images || d.photos || d.heroes || [];
      const mapped: ImageGridItem[] = raw.map((r: any) => ({
        id: r.id, image_url: r.image_url, caption: r.caption,
        active: r.active, display_order: r.display_order, sort_order: r.sort_order,
      }));
      setItems(mapped);
      setActiveCount(d.active_count ?? mapped.filter((i: ImageGridItem) => i.active).length);
    } catch { showToast('Failed to load.', true); }
    finally { setLoading(false); }
  }, [cfg.adminBase, cfg.listKey, API_BASE]);

  useEffect(() => { load(); }, [load]);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const { image_url, cloudinary_public_id } = await adminUploadFile(`${cfg.adminBase}/upload-url`, file);
      await fetch(`${API_BASE}${cfg.adminBase}`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify({ image_url, cloudinary_public_id }) });
      showToast('Uploaded.');
      load();
    } catch { showToast('Upload failed.', true); }
    finally { setUploading(false); }
  };

  const handleUrl = async (url: string) => {
    setUploading(true);
    try {
      await fetch(`${API_BASE}${cfg.adminBase}`, { method: 'POST', headers: adminHeaders(), body: JSON.stringify({ image_url: url }) });
      showToast('Added.');
      load();
    } catch { showToast('Failed to add URL.', true); }
    finally { setUploading(false); }
  };

  const toggle = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`${API_BASE}${cfg.adminBase}/${id}`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ active: !currentActive }) });
      setItems(prev => prev.map(i => i.id === id ? { ...i, active: !currentActive } : i));
      setActiveCount(prev => currentActive ? prev - 1 : prev + 1);
    } catch { showToast('Failed.', true); }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${API_BASE}${cfg.adminBase}/${id}`, { method: 'DELETE', headers: adminHeaders() });
      setItems(prev => { const updated = prev.filter(i => i.id !== id); setActiveCount(updated.filter(i => i.active).length); return updated; });
      showToast('Deleted.');
    } catch { showToast('Failed to delete.', true); }
  };

  return (
    <div>
      <PageHeader title={cfg.title} sub={cfg.sub} />

      {cfg.max && <Counter current={activeCount} max={cfg.max} />}

      <UploadZone
        onFile={handleFile}
        onUrl={handleUrl}
        loading={uploading}
      />

      <SectionDivider label={`${items.length} image${items.length !== 1 ? 's' : ''}`} />

      {loading ? <LoadingGrid /> : (
        <ImageGrid items={items} onToggle={toggle} onDelete={remove} />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
