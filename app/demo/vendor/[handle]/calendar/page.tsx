'use client';
// app/demo/vendor/[handle]/calendar/page.tsx
// Demo calendar with mock events. NO auth. NO session.

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { DemoHeader } from '@/components/demo/DemoHeader';
import { DemoNav }    from '@/components/demo/DemoNav';
import { useDemoVendor } from '@/hooks/demo/useDemoData';

const T = {
  bg: '#0C0A09', card: '#111008', ink: '#F0E6D2', soft: 'rgba(240,230,210,0.60)',
  mute: 'rgba(240,230,210,0.35)', gold: '#C9A84C', border: 'rgba(240,230,210,0.08)',
  ff: { body: "'DM Sans', sans-serif", label: "'Jost', sans-serif", display: "'Cormorant Garamond', serif" },
};

const MOCK_EVENTS = [
  { title: 'Bridal Trial — Meera Kapoor',       date: 'Tomorrow',   time: '11:00 AM', kind: 'trial'    },
  { title: 'Shoot — Riya & Dev (Palace Wedding)', date: 'Sat, 7 Jun', time: '6:00 AM',  kind: 'shoot'    },
  { title: 'Consultation — Ananya Sharma',        date: 'Mon, 9 Jun', time: '3:00 PM',  kind: 'call'     },
  { title: 'Wedding Day — Mansi Gupta',           date: 'Sat, 14 Jun',time: '5:00 AM',  kind: 'ceremony' },
];

export default function DemoCalendarPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendor } = useDemoVendor(handle);

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, color: T.ink }}>
      <DemoHeader vendorName={vendor?.display_name || null} handle={handle} />
      <div style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ padding: '16px 20px 20px' }}>
          <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.22em', color: T.mute, textTransform: 'uppercase', marginBottom: 4 }}>Upcoming</div>
          <div style={{ fontFamily: T.ff.display, fontSize: 26, fontWeight: 300, color: T.ink }}>Calendar</div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOCK_EVENTS.map((ev, i) => (
            <div key={i} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 10, background: 'rgba(201,168,76,0.08)', border: `0.5px solid rgba(201,168,76,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.1em', color: T.gold, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.3 }}>{ev.kind}</span>
              </div>
              <div>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink, marginBottom: 3 }}>{ev.title}</div>
                <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>{ev.date} · {ev.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '24px 20px', textAlign: 'center' }}>
          <span style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', color: T.mute, textTransform: 'uppercase' }}>
            In your real studio, DreamAi manages all of this for you
          </span>
        </div>
      </div>
      <DemoNav handle={handle} />
    </div>
  );
}
