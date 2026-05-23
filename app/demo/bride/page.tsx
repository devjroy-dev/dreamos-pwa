'use client';
// app/demo/bride/page.tsx
// Bride demo — seeds real couple session, populates discover with demo vendors only
// No auth required. Full Frost experience with demo vendor pool.

import { useEffect, useState } from 'react';

const BACKEND = 'https://dream-os-production.up.railway.app';
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');`;

function getDateMonthsFromNow(months: number): string {
  const d = new Date(); d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

export default function BrideDemoPage() {
  const [vendorCount, setVendorCount] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    // Fetch demo vendor count to show social proof
    fetch(`${BACKEND}/api/v2/demo/discover`)
      .then(r => r.json())
      .then(d => { if (d.ok) setVendorCount(d.total); })
      .catch(() => {});

    // Log event
    fetch(`${BACKEND}/api/v2/demo/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: 'bride', event: 'bride_demo_viewed', user_agent: navigator.userAgent, referrer: document.referrer })
    }).catch(() => {});
  }, []);

  function handleEnterFrost() {
    setEntering(true);

    // Seed a real couple demo session into localStorage on this domain
    // Frost reads couple_session — wedding_date drives the Sanctuary countdown
    const coupleSession = {
      demo:         true,
      couple_id:    'demo-couple-1',
      bride_name:   'Priya',
      wedding_date: getDateMonthsFromNow(6),
      wedding_city: 'Delhi',
      budget_total: 5000000,
      tier:         'gold',
      access_token: 'demo_bride_token',
    };

    try {
      localStorage.setItem('couple_session',      JSON.stringify(coupleSession));
      localStorage.setItem('couple_web_session',  JSON.stringify(coupleSession));
      localStorage.setItem('tdw_bride_demo_session', JSON.stringify({ demo: true, ...coupleSession }));
      // Tell Frost discover to use the demo feed
      localStorage.setItem('tdw_demo_discover',   'true');
    } catch { /* Safari private mode — graceful degradation */ }

    // Small delay so localStorage writes commit before navigation
    setTimeout(() => {
      window.location.href = 'https://thedreamwedding.in/frost/canvas/discover?demo=true';
    }, 80);
  }

  return (
    <div style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <style>{FONTS}</style>

      {/* Rich dark gradient — no image dependency */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 140% 80% at 60% 10%, #2C1A10 0%, #1A1208 45%, #0C0A09 100%)'
      }} />

      {/* Subtle gold shimmer overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(201,168,76,0.06) 0%, transparent 70%)'
      }} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 50%, #0C0A09 100%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 24px 52px' }}>

        {/* TDW watermark */}
        <div style={{ position: 'absolute', top: 24, right: 20, textAlign: 'right' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 14, color: 'rgba(245,240,232,0.92)', margin: 0 }}>
            The Dream Wedding
          </p>
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', margin: '3px 0 0' }}>
            The Curated Wedding OS
          </p>
        </div>

        {/* Demo pill with vendor count */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '5px 12px', marginBottom: 24, alignSelf: 'flex-start' }}>
          <span style={{ color: '#C9A84C', fontSize: 8 }}>✦</span>
          <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', color: '#C9A84C', textTransform: 'uppercase' }}>
            {vendorCount !== null ? `${vendorCount} Maker${vendorCount !== 1 ? 's' : ''} · Demo` : 'Bride Demo'}
          </span>
        </div>

        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 40, lineHeight: 1.12, color: '#F5F0E8', marginBottom: 14 }}>
          Not just happily married.<br />
          <em style={{ color: '#C9A84C' }}>Getting married happily.</em>
        </h1>

        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 13, lineHeight: 1.65, color: 'rgba(245,240,232,0.5)', marginBottom: 36, maxWidth: 300 }}>
          Browse curated Makers. Save the ones you love. This is what your brides see.
        </p>

        <button
          onClick={handleEnterFrost}
          disabled={entering}
          style={{
            width: '100%', padding: '17px 24px',
            background: entering ? 'rgba(201,168,76,0.6)' : '#C9A84C',
            border: 'none', borderRadius: 40,
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 11,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#0C0A09', cursor: entering ? 'default' : 'pointer',
            transition: 'background 200ms'
          }}
        >
          {entering ? 'Opening…' : 'Start Exploring →'}
        </button>
      </div>
    </div>
  );
}
