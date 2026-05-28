'use client';
// app/demo/vendor/[handle]/page.tsx
// Demo vendor landing. Uses real app fonts/tokens. No session. Handle = identity.
// Two CTAs: Enter Your Studio | Explore Discover

export const dynamic = 'force-dynamic';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoVendor, DemoPhoto } from '@/lib/demo/api';

const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
};

export default function DemoLandingPage() {
  const params  = useParams();
  const handle  = typeof params.handle === 'string' ? params.handle : '';
  const router  = useRouter();
  const [vendor,  setVendor]  = useState<DemoVendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [imgIdx,  setImgIdx]  = useState(0);

  useEffect(() => {
    if (!handle) return;
    fetchDemoVendor(handle)
      .then(res => setVendor(res.vendor))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: '#160C08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 18, color: 'rgba(245,235,212,0.4)' }}>One moment…</div>
    </div>
  );

  if (error || !vendor) return (
    <div style={{ minHeight: '100dvh', background: '#160C08', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontFamily: F.display, fontSize: 28, color: 'rgba(245,235,212,0.9)' }}>Profile not found</div>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, color: 'rgba(245,235,212,0.4)' }}>This demo link may have expired.</div>
    </div>
  );

  const photos: DemoPhoto[] = vendor.photos || [];
  const galleryUrls = photos.map(p => p.url).filter(Boolean) as string[];
  const heroUrl     = photos.find(p => p.is_hero)?.url || galleryUrls[0] || null;
  const displayUrl  = galleryUrls[imgIdx] || heroUrl;

  return (
    <div style={{ minHeight: '100dvh', background: '#160C08', color: 'rgba(245,235,212,0.95)' }}>

      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 56, background: 'rgba(22,12,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <span style={{ fontFamily: F.display, fontSize: 18, fontWeight: 400, letterSpacing: '0.04em', color: 'rgba(245,235,212,0.95)' }}>The Dream Wedding</span>
        <div style={{ background: 'rgba(201,168,76,0.12)', border: '0.5px solid rgba(201,168,76,0.4)', borderRadius: 999, padding: '4px 12px' }}>
          <span style={{ fontFamily: F.label, fontSize: 8, letterSpacing: '0.28em', color: '#C9A84C', textTransform: 'uppercase' }}>Preview</span>
        </div>
      </div>

      {/* Hero image */}
      {displayUrl && (
        <div style={{ position: 'relative', height: '58dvh', marginTop: 56, overflow: 'hidden' }}>
          <img src={displayUrl} alt={vendor.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 45%, rgba(22,12,8,0.97) 100%)' }} />
          {galleryUrls.length > 1 && (
            <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {galleryUrls.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? '#C9A84C' : 'rgba(245,235,212,0.3)', border: 'none', cursor: 'pointer', transition: 'width 0.25s' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      <div style={{ padding: '24px 24px 0' }}>
        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.85)', marginBottom: 8 }}>
          {vendor.category} · {vendor.city}
        </div>
        <h1 style={{ fontFamily: F.display, fontWeight: 400, fontSize: 42, margin: '0 0 4px', lineHeight: 1, letterSpacing: '0.01em', color: 'rgba(245,235,212,0.97)' }}>
          {vendor.display_name}
        </h1>
        {vendor.rate_display && (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: 'rgba(201,168,76,0.75)', marginBottom: 12 }}>
            {vendor.rate_display}
          </div>
        )}
        {vendor.about && (
          <p style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.7, color: 'rgba(245,235,212,0.55)', margin: '0 0 24px', letterSpacing: '0.01em' }}>
            {vendor.about}
          </p>
        )}

        {/* Gallery strip */}
        {galleryUrls.length > 1 && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 32, paddingBottom: 4 }}>
            {galleryUrls.map((url, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ flexShrink: 0, width: 76, height: 76, borderRadius: 2, overflow: 'hidden', border: i === imgIdx ? '1.5px solid #C9A84C' : '0.5px solid rgba(201,168,76,0.22)', cursor: 'pointer' }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {/* Brass divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.25)' }} />
          <span style={{ fontFamily: F.display, fontSize: 10, color: '#C9A84C', letterSpacing: '0.3em' }}>◆</span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.25)' }} />
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 56 }}>
          <button
            onClick={() => router.push(`/demo/vendor/${handle}/studio`)}
            className="atelier-fab"
            style={{ width: '100%', padding: '16px 24px', border: '0.5px solid #E0BC6E', borderRadius: 2, cursor: 'pointer', fontFamily: F.label, fontSize: 10, fontWeight: 400, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#1A120E' }}
          >
            Enter Your Studio
          </button>
          <button
            onClick={() => router.push(`/demo/vendor/${handle}/discover`)}
            style={{ width: '100%', padding: '15px 24px', background: 'transparent', border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 2, cursor: 'pointer', fontFamily: F.label, fontSize: 10, fontWeight: 300, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.8)' }}
          >
            Explore Discover
          </button>
        </div>
      </div>
    </div>
  );
}
