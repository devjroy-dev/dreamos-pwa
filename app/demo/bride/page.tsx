'use client';
// app/demo/bride/page.tsx
// Shared bride demo — seeds Frost couple session and redirects to Discover
// No auth required.

import { useEffect } from 'react';

const BACKEND = 'https://dream-os-production.up.railway.app';

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

export default function BrideDemoPage() {
  useEffect(() => {
    seedBrideDemoSession();
    logBrideDemoView();
  }, []);

  function seedBrideDemoSession() {
    const brideDemo = {
      demo: true,
      demo_type: 'bride',
      couple: {
        id: 'demo-couple-1',
        bride_name: 'Priya',
        wedding_date: getDateMonthsFromNow(6),
        wedding_city: 'Delhi',
        budget_total: 5000000,
        events_planned: ['mehndi', 'sangeet', 'wedding', 'reception'],
        planning_state: 'shortlisting',
        tier: 'gold'
      },
      events: [
        {
          id: 'demo-bride-evt-1',
          title: 'Trial with Nidhi Gupta',
          event_date: getDateDaysFromNow(7),
          kind: 'trial',
          state: 'upcoming'
        },
        {
          id: 'demo-bride-evt-2',
          title: 'Lehenga at Sabyasachi',
          event_date: getDateDaysFromNow(14),
          kind: 'shopping',
          state: 'upcoming'
        },
        {
          id: 'demo-bride-evt-3',
          title: 'Mehendi Ceremony',
          event_date: getDateMonthsFromNow(6),
          kind: 'ceremony',
          state: 'upcoming'
        }
      ],
      expenses: [
        {
          id: 'demo-exp-1',
          description: 'Venue booking advance',
          amount: 150000,
          category: 'venue',
          created_at: getDaysAgo(5)
        },
        {
          id: 'demo-exp-2',
          description: 'Lehenga advance',
          amount: 75000,
          category: 'attire',
          created_at: getDaysAgo(2)
        }
      ],
      circle: [
        { name: 'Mom', role: 'family', status: 'active' },
        { name: 'Meha', role: 'inner_circle', status: 'active' }
      ],
      seeded_at: new Date().toISOString()
    };

    try {
      localStorage.setItem('tdw_bride_demo_session', JSON.stringify(brideDemo));
      localStorage.setItem('couple_session', JSON.stringify({
        demo: true,
        couple_id: 'demo-couple-1',
        bride_name: 'Priya',
        access_token: 'demo_token'
      }));
    } catch {
      console.warn('localStorage unavailable');
    }
  }

  async function logBrideDemoView() {
    try {
      await fetch(`${BACKEND}/api/v2/demo/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: 'bride',
          event: 'bride_demo_viewed',
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    } catch { /* silent */ }
  }

  function handleEnterFrost() {
    window.location.href = 'https://thedreamwedding.in/frost/canvas/discover?demo=true';
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0C0A09', position: 'relative' }}>
      {/* Hero background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://res.cloudinary.com/dccso5ljv/image/upload/bride-demo-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(12,8,6,0.9) 65%, #0C0A09 100%)'
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 24px 48px'
      }}>
        {/* Watermark */}
        <div style={{ position: 'absolute', top: 24, right: 20, textAlign: 'right' }}>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: 13,
            color: 'rgba(245,240,232,0.9)'
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
            The Curated Wedding OS
          </p>
        </div>

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
          Every Maker on TDW is personally curated. Browse. Save. Enquire. All in one place.
        </p>

        <button
          onClick={handleEnterFrost}
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
            cursor: 'pointer'
          }}
        >
          Start Exploring →
        </button>
      </div>
    </div>
  );
}
