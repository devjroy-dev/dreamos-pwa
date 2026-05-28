'use client';
// /wedding/portfolio — Portfolio · Atelier rebuild
// Photo library management. Upload, filter, hero, delete. All logic preserved.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchPortfolio, fetchUploadUrl, registerPortfolioImage, setHeroImage, deletePortfolioImage } from '@/lib/vendor/api/vendor';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  brassLine: 'rgba(201,168,76,0.18)',
  red:       '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

const STATE_FILTERS = ['all', 'approved', 'pending', 'rejected'] as const;

export default function PortfolioPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <PortfolioScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function PortfolioScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [images, setImages]       = useState<PortfolioImage[]>([]);
  const [filter, setFilter]       = useState<string>('all');
  const [loading, setLoading]     = useState(true);
  const [sel, setSel]             = useState<PortfolioImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchPortfolio(vendorId, filter).then(res => {
      if (res.ok) setImages(res.images);
      else show((res as {error?:string}).error ?? 'Failed to load portfolio.', 'error');
    }).catch((e: unknown) => show(String(e), 'error')).finally(() => setLoading(false));
  }, [vendorId, filter, show]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const urlRes = await fetchUploadUrl(file.name);
      if (!urlRes.ok) { show((urlRes as { error?: string }).error ?? 'Failed to get upload URL.', 'error'); return; }
      const { upload_url, params } = urlRes;
      const form = new FormData();
      Object.entries(params).forEach(([k, v]) => form.append(k, String(v)));
      form.append('file', file);
      const cloudRes = await fetch(upload_url, { method: 'POST', body: form });
      if (!cloudRes.ok) { show('Upload to Cloudinary failed.', 'error'); return; }
      const cloudData = await cloudRes.json();
      const regRes = await registerPortfolioImage({ image_url: cloudData.secure_url });
      if (!regRes.ok) { show((regRes as { error?: string }).error ?? 'Registration failed.', 'error'); return; }
      show('Image uploaded — pending approval', 'success');
      load();
    } catch { show('Upload failed.', 'error'); }
    finally { setUploading(false); }
  }

  async function doSetHero(imageId: string) {
    const res = await setHeroImage(imageId);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
    show('Hero image set', 'success');
    setSel(null); load();
  }

  async function doDelete(imageId: string) {
    const res = await deletePortfolioImage(imageId);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
    show('Image deleted', 'success');
    setSel(null); load();
  }

  const stateColor = (s: string) => s === 'approved' ? A.brassWarm : s === 'rejected' ? A.red : A.inkMute;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      {/* Breadcrumb */}
      <div style={{
        padding: '12px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '0.5px solid var(--atelier-card-border)',
      }}>
        <button type="button" onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1,
          }}>‹</button>
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.42em', textTransform: 'uppercase',
          color: A.brass, flex: 1,
        }}>Portfolio</span>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="atelier-fab"
          style={{
            padding: '8px 16px',
            borderRadius: 2, cursor: uploading ? 'default' : 'pointer',
            border: '0.5px solid #E0BC6E',
            fontFamily: F.label, fontWeight: 400, fontSize: 9,
            color: '#1A120E', letterSpacing: '0.32em', textTransform: 'uppercase',
            opacity: uploading ? 0.5 : 1,
          }}>
          {uploading ? 'Uploading…' : '+ Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 22px', flexWrap: 'wrap' }}>
        {STATE_FILTERS.map(s => (
          <button key={s} type="button" onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: 2, cursor: 'pointer', flexShrink: 0,
            background: filter === s ? 'rgba(201,168,76,0.18)' : 'transparent',
            border: `0.5px solid ${filter === s ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            color: filter === s ? A.brassWarm : A.inkMute,
            letterSpacing: '0.28em', textTransform: 'uppercase',
          }}>
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 16px 32px' }}>
        {loading ? (
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 15, color: A.inkMute, textAlign: 'center', padding: 40,
          }}>Loading…</div>
        ) : images.length === 0 ? (
          <div style={{
            fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
            fontSize: 17, color: A.inkMute, textAlign: 'center', padding: '60px 20px',
            lineHeight: 1.5,
          }}>
            No images yet. <br />
            <span style={{ color: A.brassWarm }}>Tap upload to add your first.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, paddingTop: 8 }}>
            {images.map(img => (
              <div key={img.id} role="button" tabIndex={0} onClick={() => setSel(img)}
                onKeyDown={e => e.key === 'Enter' && setSel(img)}
                style={{
                position: 'relative', aspectRatio: '3/4',
                overflow: 'hidden',
                border: '0.5px solid rgba(201,168,76,0.2)',
                cursor: 'pointer', background: 'none', padding: 0,
                borderRadius: 2,
              }}>
                <img src={img.image_url} alt={img.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                {img.is_hero && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6,
                    padding: '3px 8px',
                    background: 'linear-gradient(180deg, #D4B86A 0%, #B59548 100%)',
                    border: '0.5px solid #E0BC6E',
                    fontFamily: F.label, fontWeight: 400, fontSize: 7,
                    color: '#1A120E', letterSpacing: '0.28em',
                  }}>HERO</div>
                )}
                <div style={{
                  position: 'absolute', bottom: 6, right: 6,
                  width: 7, height: 7, borderRadius: '50%',
                  background: stateColor(img.approval_state),
                  boxShadow: img.approval_state === 'approved' ? '0 0 6px rgba(224,188,110,0.6)' : 'none',
                }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image action sheet */}
      {sel && (
        <>
          <div onClick={() => setSel(null)} style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'var(--atelier-overlay)' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '16px 24px calc(24px + env(safe-area-inset-bottom))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <img src={sel.image_url} alt="" style={{
              width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'center top',
              borderRadius: 2, marginBottom: 14,
              border: '0.5px solid rgba(201,168,76,0.2)',
            }} />
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: stateColor(sel.approval_state), marginBottom: 6,
            }}>{sel.approval_state}</div>
            {sel.caption && (
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 14, color: A.inkSoft, marginBottom: 16, lineHeight: 1.4,
              }}>{sel.caption}</div>
            )}
            {sel.rejection_reason && (
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 13, color: A.red, marginBottom: 16, lineHeight: 1.4,
              }}>{sel.rejection_reason}</div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              {!sel.is_hero && (
                <button type="button" onClick={() => doSetHero(sel.id)}
                  className="atelier-fab"
                  style={{
                    flex: 1, padding: '13px 0',
                    borderRadius: 2, cursor: 'pointer',
                    border: '0.5px solid #E0BC6E',
                    fontFamily: F.label, fontWeight: 400, fontSize: 9,
                    color: '#1A120E', letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>
                  Set Hero
                </button>
              )}
              <button type="button" onClick={() => doDelete(sel.id)} style={{
                flex: 1, padding: '13px 0',
                background: 'transparent',
                border: `0.5px solid rgba(224,123,92,0.4)`,
                borderRadius: 2, cursor: 'pointer',
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                color: A.red, letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
