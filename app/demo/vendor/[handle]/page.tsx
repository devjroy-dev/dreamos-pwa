'use client';
// app/demo/vendor/[handle]/page.tsx
// Vendor demo landing — shows TDW landing with vendor's data pre-loaded
// No auth required. Session stored in localStorage only.

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const BACKEND = 'https://dream-os-production.up.railway.app';

interface VendorPhoto {
  id: string;
  image_url: string;
  is_hero: boolean;
  caption?: string;
}

interface VendorData {
  id: string;
  name: string;
  handle: string;
  instagram: string;
  category: string;
  city: string;
  expires_at: string;
  photos: VendorPhoto[];
}

function getDateMonthsFromNow(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

function getDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export default function VendorDemoPage() {
  const params = useParams<{ handle: string }>();
  const handle = params?.handle ?? '';
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (handle) {
      fetchVendorData();
      logDemoEvent('landing_viewed');
    }
  }, [handle]);

  async function fetchVendorData() {
    try {
      const res = await fetch(`${BACKEND}/api/v2/public/vendor/${handle}`);
      const data = await res.json();
      if (!data.ok) {
        setExpired(true);
        setLoading(false);
        return;
      }
      setVendor(data.vendor);
      seedDemoSession(data.vendor);
    } catch {
      setExpired(true);
    } finally {
      setLoading(false);
    }
  }

  function seedDemoSession(v: VendorData) {
    const demoSession = {
      demo: true,
      demo_type: 'vendor',
      vendor: {
        id: v.id,
        name: v.name,
        handle: v.handle,
        category: v.category,
        city: v.city,
        instagram: v.instagram,
        photos: v.photos,
        tier: 'signature',
        discover_eligible: true,
      },
      leads: [
        {
          id: 'demo-lead-1',
          bride_name: 'Priya Sharma',
          wedding_date: getDateMonthsFromNow(6),
          city: v.city,
          budget_range: 'Rs 2L–3L',
          status: 'new',
          created_at: getDaysAgo(1),
          source: 'discover',
          notes: 'Interested in candid + cinematic package'
        },
        {
          id: 'demo-lead-2',
          bride_name: 'Meera Kapoor',
          wedding_date: getDateMonthsFromNow(9),
          city: 'Jaipur',
          budget_range: 'Rs 3L–5L',
          status: 'quoted',
          created_at: getDaysAgo(3),
          source: 'discover',
          notes: 'Destination wedding — Jaipur palace'
        }
      ],
      invoices: [
        {
          id: 'demo-inv-1',
          client_name: 'Priya Sharma',
          amount_total: 250000,
          amount_paid: 75000,
          state: 'advance_paid',
          created_at: getDaysAgo(2)
        }
      ],
      events: [
        {
          id: 'demo-evt-1',
          title: 'Sharma Pre-Wedding Shoot',
          event_date: getDateDaysFromNow(22),
          kind: 'shoot',
          state: 'upcoming'
        },
        {
          id: 'demo-evt-2',
          title: 'Kapoor Wedding',
          event_date: getDateMonthsFromNow(9),
          kind: 'wedding',
          state: 'upcoming'
        }
      ],
      seeded_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('tdw_demo_session', JSON.stringify(demoSession));
    } catch {
      console.warn('localStorage unavailable — demo session not seeded');
    }
  }

  function handleEnterStudio() {
    logDemoEvent('studio_entered');
    window.location.href = `https://thedreamai.in/wedding?demo=true&handle=${handle}`;
  }

  async function logDemoEvent(event: string) {
    try {
      await fetch(`${BACKEND}/api/v2/demo/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle,
          event,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    } catch { /* silent */ }
  }

  if (expired) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: '#0C0A09',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        fontFamily: '"DM Sans", sans-serif'
      }}>
        <p style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 28,
          color: '#F5F0E8',
          textAlign: 'center',
          marginBottom: 16
        }}>
          This profile is no longer available.
        </p>
        <p style={{ color: '#888580', fontSize: 13, textAlign: 'center', marginBottom: 32 }}>
          The Dream Wedding
        </p>
        <a
          href="https://thedreamwedding.in"
          style={{
            background: 'rgba(201,168,76,0.15)',
            border: '0.5px solid rgba(201,168,76,0.4)',
            color: '#C9A84C',
            padding: '14px 28px',
            fontFamily: '"Jost", sans-serif',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            borderRadius: 40
          }}
        >
          Learn More →
        </a>
      </div>
    );
  }

  if (loading) {
    return <div style={{ minHeight: '100dvh', background: '#0C0A09' }} />;
  }

  const heroPhoto = vendor?.photos.find(p => p.is_hero) ?? vendor?.photos[0];

  return (
    <div style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      {/* Full-bleed hero photo */}
      {heroPhoto && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroPhoto.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(12,8,6,0.85) 60%, #0C0A09 100%)'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 24px 48px'
      }}>
        {/* TDW watermark */}
        <div style={{ position: 'absolute', top: 24, right: 20, textAlign: 'right' }}>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 13,
            color: 'rgba(245,240,232,0.9)',
            letterSpacing: '0.04em'
          }}>
            The Dream Wedding
          </p>
          <p style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 200,
            fontSize: 8,
            letterSpacing: '0.18em',
            color: 'rgba(201,168,76,0.7)',
            textTransform: 'uppercase',
            marginTop: 2
          }}>
            India&apos;s First Wedding OS
          </p>
        </div>

        {/* Demo pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(201,168,76,0.12)',
          border: '0.5px solid rgba(201,168,76,0.3)',
          borderRadius: 20,
          padding: '5px 12px',
          marginBottom: 20,
          alignSelf: 'flex-start'
        }}>
          <span style={{ color: '#C9A84C', fontSize: 8 }}>✦</span>
          <span style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 200,
            fontSize: 9,
            letterSpacing: '0.18em',
            color: '#C9A84C',
            textTransform: 'uppercase'
          }}>
            Demo
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontSize: 38,
          lineHeight: 1.15,
          color: '#F5F0E8',
          marginBottom: 12
        }}>
          Not just happily married.<br />
          <em style={{ color: '#C9A84C' }}>Getting married happily.</em>
        </h1>

        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 300,
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(245,240,232,0.55)',
          marginBottom: 32,
          maxWidth: 320
        }}>
          Every Maker on TDW is personally curated. This is what your profile looks like to brides.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleEnterStudio}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#C9A84C',
            border: 'none',
            borderRadius: 40,
            fontFamily: '"Jost", sans-serif',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#0C0A09',
            cursor: 'pointer',
            marginBottom: 12
          }}
        >
          Enter Your Studio →
        </button>

        {/* Secondary — bride demo */}
        <a
          href="https://demo.thedreamwedding.in/bride"
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 24px',
            background: 'transparent',
            border: '0.5px solid rgba(245,240,232,0.2)',
            borderRadius: 40,
            fontFamily: '"Jost", sans-serif',
            fontWeight: 300,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.6)',
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'none'
          }}
        >
          ← See What Your Brides See
        </a>
      </div>
    </div>
  );
}
