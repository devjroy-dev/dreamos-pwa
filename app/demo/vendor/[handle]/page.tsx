'use client';
// app/demo/vendor/[handle]/page.tsx
// Demo vendor landing page.
// NO auth. NO session. Handle from URL = identity.
// Two CTAs: Enter Your Studio | Explore Discover

export const dynamic = 'force-dynamic';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoVendor, DemoPhoto } from '@/lib/demo/api';

const T = {
  bg: '#0C0A09', card: '#141210', ink: '#F0E6D2',
  soft: 'rgba(240,230,210,0.60)', mute: 'rgba(240,230,210,0.35)',
  gold: '#C9A84C', border: 'rgba(240,230,210,0.08)',
  ff: { display: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif", label: "'Jost', sans-serif" },
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
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.2em', color: T.mute, textTransform: 'uppercase' }}>Loading…</span>
    </div>
  );

  if (error || !vendor) return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <span style={{ fontFamily: T.ff.display, fontSize: 22, color: T.ink }}>Profile not found</span>
      <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>This demo link may have expired.</span>
    </div>
  );

  const photos: DemoPhoto[] = vendor.photos || [];
  const galleryUrls = photos.map(p => p.url).filter(Boolean);
  const heroUrl     = photos.find(p => p.is_hero)?.url || galleryUrls[0] || null;
  const displayUrl  = galleryUrls[imgIdx] || heroUrl;

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, color: T.ink }}>
      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 52, background: 'rgba(12,10,9,0.85)', backdropFilter: 'blur(12px)', borderBottom: `0.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <span style={{ fontFamily: T.ff.display, fontSize: 16, fontWeight: 300, letterSpacing: '0.06em', color: T.ink }}>The Dream Wedding</span>
        <div style={{ background: 'rgba(201,168,76,0.12)', border: `0.5px solid ${T.gold}`, borderRadius: 20, padding: '3px 10px' }}>
          <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.2em', color: T.gold, textTransform: 'uppercase' }}>Preview</span>
        </div>
      </div>

      {/* Hero */}
      {displayUrl && (
        <div style={{ position: 'relative', height: '55dvh', marginTop: 52, overflow: 'hidden' }}>
          <img src={displayUrl} alt={vendor.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(12,10,9,0.95) 100%)' }} />
          {galleryUrls.length > 1 && (
            <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {galleryUrls.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? T.gold : 'rgba(240,230,210,0.35)', border: 'none', cursor: 'pointer', transition: 'width 0.2s' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile info */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.22em', color: T.gold, textTransform: 'uppercase', marginBottom: 8 }}>
          {vendor.category} · {vendor.city}
        </div>
        <h1 style={{ fontFamily: T.ff.display, fontSize: 34, fontWeight: 300, margin: '0 0 4px', letterSpacing: '0.02em', color: T.ink }}>
          {vendor.display_name}
        </h1>
        {vendor.rate_display && (
          <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, marginBottom: 16 }}>{vendor.rate_display}</div>
        )}
        {vendor.about && (
          <p style={{ fontFamily: T.ff.body, fontSize: 14, lineHeight: 1.65, color: T.soft, margin: '0 0 24px' }}>{vendor.about}</p>
        )}

        {/* Gallery strip */}
        {galleryUrls.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 32, paddingBottom: 4 }}>
            {galleryUrls.map((url, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: i === imgIdx ? `1.5px solid ${T.gold}` : `0.5px solid ${T.border}`, cursor: 'pointer' }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 48 }}>
          <button onClick={() => router.push(`/demo/vendor/${handle}/studio`)} style={{ width: '100%', padding: '16px 24px', background: T.gold, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: T.ff.label, fontSize: 11, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0C0A09' }}>
            Enter Your Studio
          </button>
          <button onClick={() => router.push(`/demo/vendor/${handle}/discover`)} style={{ width: '100%', padding: '15px 24px', background: 'transparent', border: `0.5px solid rgba(201,168,76,0.4)`, borderRadius: 12, cursor: 'pointer', fontFamily: T.ff.label, fontSize: 11, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold }}>
            Explore Discover
          </button>
        </div>
      </div>
    </div>
  );
}
