'use client';
// app/demo/vendor/[handle]/discover/page.tsx
// Explore Discover — bride-side swipe feed of all active demo vendors.
// Frost swipe mechanics. NO auth. NO session.

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDemoDiscoverFeed } from '@/lib/demo/api';
import type { DiscoverVendor } from '@/lib/demo/api';
import { DemoHeader } from '@/components/demo/DemoHeader';
import { DemoNav }    from '@/components/demo/DemoNav';
import { useDemoVendor } from '@/hooks/demo/useDemoData';

const SWIPE_THRESHOLD = 45;
const SWIPE_VELOCITY  = 0.3;
const TAP_MAX_MOVE    = 10;
const TAP_MAX_TIME    = 250;

const T = {
  bg: '#0C0A09', ink: '#F0E6D2', soft: 'rgba(240,230,210,0.70)',
  mute: 'rgba(240,230,210,0.40)', gold: '#C9A84C',
  glassBg: 'rgba(12,10,9,0.50)', glassBorder: 'rgba(240,230,210,0.08)',
  ff: { body: "'DM Sans', sans-serif", label: "'Jost', sans-serif", display: "'Cormorant Garamond', serif" },
};

const haptic = (ms: number) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(ms); } catch {} }
};

export default function DemoDiscoverPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendor }                        = useDemoVendor(handle);
  const [vendors,  setVendors]            = useState<DiscoverVendor[]>([]);
  const [idx,      setIdx]                = useState(0);
  const [imgIdx,   setImgIdx]             = useState(0);
  const [loading,  setLoading]            = useState(true);
  const [expanded, setExpanded]           = useState(false);
  const touchRef  = useRef<{ x: number; y: number; t: number } | null>(null);
  const deltaRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetchDemoDiscoverFeed()
      .then(res => setVendors(res.vendors))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setImgIdx(0); setExpanded(false); }, [idx]);

  const goNext  = useCallback(() => { haptic(8); setIdx(i => Math.min(i + 1, vendors.length - 1)); }, [vendors.length]);
  const goPrev  = useCallback(() => { haptic(8); setIdx(i => Math.max(i - 1, 0)); }, []);
  const nextImg = useCallback(() => { const v = vendors[idx]; if (!v) return; setImgIdx(i => Math.min(i + 1, v.photos.length - 1)); }, [vendors, idx]);
  const prevImg = useCallback(() => { setImgIdx(i => Math.max(i - 1, 0)); }, []);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    deltaRef.current = { x: 0, y: 0 };
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const t = e.touches[0];
    deltaRef.current = { x: t.clientX - touchRef.current.x, y: t.clientY - touchRef.current.y };
  }
  function onTouchEnd() {
    if (!touchRef.current) return;
    const dt = Date.now() - touchRef.current.t;
    const { x: dx, y: dy } = deltaRef.current;
    const absX = Math.abs(dx), absY = Math.abs(dy);
    const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
    touchRef.current = null;
    if (absX < TAP_MAX_MOVE && absY < TAP_MAX_MOVE && dt < TAP_MAX_TIME) { setExpanded(e => !e); return; }
    if (Math.max(absX, absY) <= SWIPE_THRESHOLD && velocity <= SWIPE_VELOCITY) return;
    if (absY > absX) { if (dy < -SWIPE_THRESHOLD) goNext(); else if (dy > SWIPE_THRESHOLD) goPrev(); }
    else             { if (dx < -SWIPE_THRESHOLD) nextImg(); else if (dx > SWIPE_THRESHOLD) prevImg(); }
  }

  const current = vendors[idx];

  if (loading) return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.2em', color: T.mute, textTransform: 'uppercase' }}>Loading Discover…</span>
    </div>
  );

  if (!vendors.length) return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <DemoHeader vendorName={vendor?.display_name || null} handle={handle} />
      <span style={{ fontFamily: T.ff.display, fontSize: 22, color: T.ink }}>No profiles yet</span>
      <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>Demo vendor profiles will appear here.</span>
      <DemoNav handle={handle} />
    </div>
  );

  const photoUrl = current?.photos?.[imgIdx] || current?.photos?.[0] || null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: T.bg, overflow: 'hidden', userSelect: 'none' }}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

      {photoUrl && (
        <img src={photoUrl} alt={current?.name || ''} draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,10,9,0.2) 0%, transparent 35%, transparent 55%, rgba(12,10,9,0.88) 100%)' }} />

      {/* Top chrome */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
        <DemoHeader vendorName={vendor?.display_name || null} handle={handle} />
        <div style={{ marginTop: 56, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.22em', color: T.gold, textTransform: 'uppercase' }}>Discover</span>
          <span style={{ fontFamily: T.ff.label, fontSize: 9, color: T.mute }}>· {idx + 1} of {vendors.length}</span>
        </div>
      </div>

      {/* Image dots */}
      {(current?.photos?.length || 0) > 1 && (
        <div style={{ position: 'absolute', top: 112, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5, zIndex: 20 }}>
          {current!.photos.map((_, i) => (
            <div key={i} style={{ width: i === imgIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === imgIdx ? T.gold : 'rgba(240,230,210,0.4)', transition: 'width 0.2s' }} />
          ))}
        </div>
      )}

      {/* Bottom glass overlay */}
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, zIndex: 20, padding: '20px 20px 16px', background: T.glassBg, backdropFilter: 'blur(28px)', borderTop: `0.5px solid ${T.glassBorder}` }}>
        <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.2em', color: T.gold, textTransform: 'uppercase', marginBottom: 6 }}>
          {current?.category} · {current?.city}
        </div>
        <div style={{ fontFamily: T.ff.display, fontSize: 28, fontWeight: 300, color: T.ink, letterSpacing: '0.02em', marginBottom: 6 }}>
          {current?.name}
        </div>
        {current?.about && (
          <p style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, margin: '0 0 10px', lineHeight: 1.55 }}>
            {expanded ? current.about : `${current.about.slice(0, 110)}${current.about.length > 110 ? '…' : ''}`}
          </p>
        )}
        <div style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.12em', color: T.mute, textTransform: 'uppercase' }}>
          Swipe ↑↓ for next · ←→ for photos · tap for more
        </div>
      </div>

      <DemoNav handle={handle} />
    </div>
  );
}
