'use client';
// app/demo/vendor/[handle]/page.tsx
// Vendor demo landing — fetches real vendor session, redirects to full DreamAi app
// No auth required. Session handed off via encoded URL param.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const BACKEND = 'https://dream-os-production.up.railway.app';
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');`;

interface VendorPhoto { id: string; image_url: string; is_hero: boolean; }
interface VendorData {
  id: string; name: string; handle: string; instagram: string;
  category: string; city: string; expires_at: string; photos: VendorPhoto[];
}
interface SessionData {
  id: string; user_id: string; name: string | null; phone: string | null;
  tier: string; routing_handle: string | null; access_token: string; refresh_token: string;
}

export default function VendorDemoPage() {
  const params = useParams<{ handle: string }>();
  const handle = params?.handle ?? '';
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (handle) { fetchSession(); logEvent('landing_viewed'); }
  }, [handle]);

  async function fetchSession() {
    try {
      const res  = await fetch(`${BACKEND}/api/v2/demo/session/${handle}`);
      const data = await res.json();
      if (!data.ok) { setExpired(true); setLoading(false); return; }
      setVendor(data.vendor);
      setSession(data.session);
    } catch { setExpired(true); }
    finally   { setLoading(false); }
  }

  async function logEvent(event: string) {
    try {
      await fetch(`${BACKEND}/api/v2/demo/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, event, user_agent: navigator.userAgent, referrer: document.referrer })
      });
    } catch { /* silent */ }
  }

  function handleEnterStudio() {
    if (!session) return;
    setEntering(true);
    logEvent('studio_entered');

    // Encode the full vendor session — DreamAi decodes and writes to localStorage
    // giving the vendor a real authenticated session in the full app
    const sessionPayload = {
      vendor_session: session,
      demo: true,
      demo_handle: handle,
      vendor_photos: vendor?.photos?.map(p => p.image_url) || [],
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(sessionPayload)));
    window.location.href = `https://thedreamai.in/wedding?demo=true&handle=${handle}&ds=${encoded}`;
  }

  // ── EXPIRED ───────────────────────────────────────────────────────────────
  if (expired) return (
    <div style={{ minHeight: '100dvh', background: '#0C0A09', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <style>{FONTS}</style>
      <p style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontStyle: 'italic', fontSize: 28, color: '#F5F0E8', textAlign: 'center', marginBottom: 16 }}>
        This profile is no longer available.
      </p>
      <p style={{ color: '#888580', fontSize: 13, textAlign: 'center', marginBottom: 32, fontFamily: '"DM Sans", sans-serif' }}>The Dream Wedding</p>
      <a href="https://thedreamwedding.in" style={{ background: 'rgba(201,168,76,0.15)', border: '0.5px solid rgba(201,168,76,0.4)', color: '#C9A84C', padding: '14px 28px', fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 40 }}>
        Learn More →
      </a>
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) return <div style={{ minHeight: '100dvh', background: '#0C0A09' }} />;

  const heroPhoto = vendor?.photos.find(p => p.is_hero) ?? vendor?.photos[0];

  // ── MAIN LANDING ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <style>{FONTS}</style>

      {/* Full-bleed hero — vendor's own photo */}
      {heroPhoto ? (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `url(${heroPhoto.image_url})`,
          backgroundSize: 'cover', backgroundPosition: 'center top'
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 140% 90% at 50% 0%, #2C1810 0%, #1A120C 45%, #0C0A09 100%)'
        }} />
      )}

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(12,8,6,0.82) 55%, #0C0A09 100%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 24px 52px' }}>

        {/* TDW watermark top right */}
        <div style={{ position: 'absolute', top: 24, right: 20, textAlign: 'right' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 14, color: 'rgba(245,240,232,0.92)', letterSpacing: '0.04em', margin: 0 }}>
            The Dream Wedding
          </p>
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', margin: '3px 0 0' }}>
            India&apos;s First Wedding OS
          </p>
        </div>

        {/* Demo pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '5px 12px', marginBottom: 24, alignSelf: 'flex-start' }}>
          <span style={{ color: '#C9A84C', fontSize: 8 }}>✦</span>
          <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase' }}>
            Your Profile Preview
          </span>
        </div>

        {/* Vendor name */}
        {vendor?.name && (
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 11, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', marginBottom: 8 }}>
            {vendor.name} · {vendor.city}
          </p>
        )}

        {/* Headline */}
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 40, lineHeight: 1.12, color: '#F5F0E8', marginBottom: 14 }}>
          Not just happily married.<br />
          <em style={{ color: '#C9A84C' }}>Getting married happily.</em>
        </h1>

        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 13, lineHeight: 1.65, color: 'rgba(245,240,232,0.5)', marginBottom: 36, maxWidth: 300 }}>
          Every Maker on TDW is personally curated. This is what your profile looks like to brides.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleEnterStudio}
          disabled={entering}
          style={{
            width: '100%', padding: '17px 24px',
            background: entering ? 'rgba(201,168,76,0.6)' : '#C9A84C',
            border: 'none', borderRadius: 40,
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 11,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#0C0A09', cursor: entering ? 'default' : 'pointer',
            marginBottom: 12, transition: 'background 200ms'
          }}
        >
          {entering ? 'Opening Your Studio…' : 'Enter Your Studio →'}
        </button>

        {/* Secondary — bride demo */}
        <a
          href="https://demo.thedreamwedding.in/bride"
          style={{
            display: 'block', width: '100%', padding: '15px 24px',
            background: 'transparent', border: '0.5px solid rgba(245,240,232,0.18)',
            borderRadius: 40, fontFamily: '"Jost", sans-serif', fontWeight: 300,
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.55)', textAlign: 'center', textDecoration: 'none'
          }}
        >
          ← See What Your Brides See
        </a>
      </div>
    </div>
  );
}
