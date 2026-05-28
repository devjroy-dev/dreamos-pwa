'use client';
// app/demo/vendor/[handle]/list/page.tsx
// Demo vendor leads list. NO auth. NO session.

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { DemoHeader } from '@/components/demo/DemoHeader';
import { DemoNav }    from '@/components/demo/DemoNav';
import { useDemoLeads, useDemoVendor } from '@/hooks/demo/useDemoData';

const T = {
  bg: '#0C0A09', card: '#111008', ink: '#F0E6D2', soft: 'rgba(240,230,210,0.60)',
  mute: 'rgba(240,230,210,0.35)', gold: '#C9A84C', border: 'rgba(240,230,210,0.08)',
  ff: { body: "'DM Sans', sans-serif", label: "'Jost', sans-serif", display: "'Cormorant Garamond', serif" },
};

const STATE_COLOR: Record<string, string> = {
  new: '#6B9E8F', contacted: '#C9A84C', quoted: '#8B7355', booked: '#4A7A4A', lost: '#6B4040',
};

export default function DemoListPage() {
  const params  = useParams();
  const handle  = typeof params.handle === 'string' ? params.handle : '';
  const { vendor }         = useDemoVendor(handle);
  const { leads, loading } = useDemoLeads(handle);

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, color: T.ink }}>
      <DemoHeader vendorName={vendor?.display_name || null} handle={handle} />
      <div style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ padding: '16px 20px 12px' }}>
          <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.22em', color: T.mute, textTransform: 'uppercase', marginBottom: 4 }}>Your Pipeline</div>
          <div style={{ fontFamily: T.ff.display, fontSize: 26, fontWeight: 300, color: T.ink }}>Leads</div>
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.mute, marginTop: 2 }}>
            {leads.length} total · {leads.filter(l => l.state === 'new').length} new · {leads.filter(l => l.state === 'booked').length} booked
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: T.mute, fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Loading…</div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: T.mute, fontFamily: T.ff.body, fontSize: 14 }}>No leads yet.</div>
        ) : (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leads.map(lead => (
              <div key={lead.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontFamily: T.ff.body, fontSize: 15, fontWeight: 400, color: T.ink }}>{lead.bride_name}</span>
                  <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: STATE_COLOR[lead.state || 'new'] || T.mute, background: `${STATE_COLOR[lead.state || 'new'] || T.mute}18`, borderRadius: 10, padding: '3px 8px' }}>
                    {lead.state || 'new'}
                  </span>
                </div>
                <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginBottom: 4 }}>
                  {[lead.bride_wedding_city, lead.bride_wedding_date].filter(Boolean).join(' · ')}
                </div>
                {lead.raw_message && (
                  <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.mute, fontStyle: 'italic', borderLeft: `2px solid ${T.border}`, paddingLeft: 10, marginTop: 8 }}>
                    "{lead.raw_message.slice(0, 120)}{lead.raw_message.length > 120 ? '…' : ''}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <DemoNav handle={handle} />
    </div>
  );
}
