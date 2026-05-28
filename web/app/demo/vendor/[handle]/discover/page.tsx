'use client';
// app/demo/vendor/[handle]/discover/page.tsx
// Demo discover — shows demo vendor's portfolio + discover status.
// Uses exact real vendor discover UI. NO session. NO auth.

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoVendor } from '@/lib/demo/api';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--atelier-accent-text)', brassWarm: 'var(--atelier-label)', brassLine: 'rgba(201,168,76,0.18)', red: '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

const FALLBACK_HERO_GRADIENT = `radial-gradient(ellipse 60% 50% at 30% 30%, rgba(184,108,60,0.55) 0%, transparent 60%),radial-gradient(ellipse 50% 40% at 70% 70%, rgba(201,168,76,0.4) 0%, transparent 60%),linear-gradient(180deg, #2A1A12 0%, #160C08 100%)`;

export default function DemoDiscoverPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendorName } = useDemoContext(handle);
  const [vendor, setVendor] = useState<DemoVendor | null>(null);

  useEffect(() => {
    if (!handle) return;
    fetchDemoVendor(handle).then(res => setVendor(res.vendor)).catch(() => {});
  }, [handle]);

  const photos  = vendor?.photos ?? [];
  const hero    = photos.find(p => p.is_hero) ?? photos[0] ?? null;
  const heroUrl = hero?.url ?? null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <DemoVendorHeader vendorName={vendorName} handle={handle} />

      {/* Hero */}
      <div style={{ position: 'relative', height: 260, background: heroUrl ? undefined : FALLBACK_HERO_GRADIENT, flexShrink: 0 }}>
        {heroUrl && <img src={heroUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,10,9,0.3) 0%, transparent 40%, rgba(12,10,9,0.85) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.85)', marginBottom: 6 }}>
            {vendor?.category} · {vendor?.city}
          </div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 36, color: 'rgba(245,235,212,0.95)', lineHeight: 1, letterSpacing: '0.02em' }}>
            {vendorName ?? 'Your Studio'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>

        {/* Discover status ledger */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, padding: '20px 22px 16px', borderBottom: '0.5px solid var(--atelier-card-border)' }}>
          {[
            { big: String(photos.length), label: 'Pieces', sub: 'in portfolio' },
            { big: String(photos.filter(p => p.is_hero).length > 0 ? photos.length : 0), label: 'Approved', sub: 'live on discover' },
            { big: '0', label: 'Pending', sub: 'under review' },
            { big: '0', label: 'Held', sub: 'needs attention' },
          ].map((cell, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 4px', position: 'relative' }}>
              {i > 0 && <span style={{ position: 'absolute', left: 0, top: '10%', bottom: '10%', width: '0.5px', background: 'rgba(201,168,76,0.18)' }} />}
              <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 28, color: 'var(--atelier-ink)', lineHeight: 1 }}>{cell.big}</div>
              <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 7, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.75)', marginTop: 5 }}>{cell.label}</div>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 10, color: 'var(--atelier-ink-dim)', marginTop: 2 }}>{cell.sub}</div>
            </div>
          ))}
        </div>

        {/* Discover status */}
        <div style={{ padding: '20px 22px', borderBottom: '0.5px solid var(--atelier-card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>Discover Status</span>
            <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7FBE85', boxShadow: '0 0 6px rgba(127,190,133,0.5)', flexShrink: 0 }} />
            <span style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: 'var(--atelier-ink)' }}>Live on Discover</span>
          </div>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute, marginTop: 6, lineHeight: 1.5 }}>
            Your profile is visible to brides browsing TDW's discover feed.
          </div>
        </div>

        {/* Portfolio grid */}
        <div style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass }}>The Collection</span>
            <span style={{ flex: 1, height: '0.5px', background: 'rgba(201,168,76,0.22)' }} />
            <span style={{ fontFamily: F.display, fontSize: 18, color: A.brassWarm }}>{photos.length}</span>
          </div>
          {photos.length === 0 ? (
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: A.inkMute }}>No portfolio images yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {p.is_hero && (
                    <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(201,168,76,0.9)', borderRadius: 2, padding: '2px 6px', fontFamily: F.label, fontSize: 7, letterSpacing: '0.15em', color: '#0A0908', textTransform: 'uppercase' }}>Hero</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
