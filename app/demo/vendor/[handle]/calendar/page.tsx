'use client';
// app/demo/vendor/[handle]/calendar/page.tsx
// Demo calendar — exact real UI with mock events. NO session. NO auth.

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Header } from '@/components/vendor/Header';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoEventsData } from '@/hooks/demo/useDemoVendorData';
import type { VendorEvent } from '@/lib/vendor/types/vendor';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--atelier-accent-text)', brassWarm: 'var(--atelier-label)', brassDeep: '#B59548',
  brassLine: 'rgba(201,168,76,0.18)', brassSoft: 'rgba(201,168,76,0.28)', terracotta: '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['S','M','T','W','T','F','S'];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function fmtShort(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) return s;
  return `${parseInt(m[3])} ${MONTHS_SHORT[parseInt(m[2])-1]}`;
}
function splitDay(s: string): { day: string; month: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) return { day: s, month: '' };
  return { day: String(parseInt(m[3])), month: MONTHS_SHORT[parseInt(m[2])-1] };
}

export default function DemoCalendarPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const { vendorName } = useDemoContext(handle);
  const today  = useMemo(() => new Date(), []);
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [sel,   setSel]   = useState<string | null>(null);
  const { data: events } = useDemoEventsData();

  const todayIso     = iso(today.getFullYear(), today.getMonth(), today.getDate());
  const firstDow     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month+1, 0).getDate();
  const prevDays     = new Date(year, month, 0).getDate();

  const byDate = useMemo(() => {
    const map = new Map<string, VendorEvent[]>();
    for (const ev of events ?? []) {
      const list = map.get(ev.event_date) ?? [];
      list.push(ev);
      map.set(ev.event_date, list);
    }
    return map;
  }, [events]);

  const nextThree = useMemo(() =>
    (events ?? []).filter(e => e.event_date >= todayIso && e.state === 'upcoming')
      .sort((a,b) => a.event_date < b.event_date ? -1 : 1).slice(0, 3),
  [events, todayIso]);

  const selEvents = sel ? (byDate.get(sel) ?? []) : [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      <Header vendorName={vendorName} />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 110 }}>

        {/* Month header */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '20px 22px 12px' }}>
          <button type="button" onClick={() => month === 0 ? (setYear(y=>y-1), setMonth(11)) : setMonth(m=>m-1)} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-30%)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: A.brassWarm, fontFamily: F.display, fontSize: 26, lineHeight: 1 }}>‹</button>
          <div style={{ fontFamily: F.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brassWarm, marginBottom: 6 }}>Anno · {year}</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 46, color: A.ink, lineHeight: 1, letterSpacing: '0.02em' }}>{MONTHS[month]}</div>
          <button type="button" onClick={() => month === 11 ? (setYear(y=>y+1), setMonth(0)) : setMonth(m=>m+1)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-30%)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: A.brassWarm, fontFamily: F.display, fontSize: 26, lineHeight: 1 }}>›</button>
        </div>

        {/* Weekday labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 18px 8px', borderBottom: '0.5px solid var(--atelier-card-border)' }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '2px 0', fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: A.brassWarm }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '6px 18px 12px' }}>
          {Array.from({ length: firstDow }).map((_,i) => (
            <div key={`p${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 16, color: 'rgba(240,230,210,0.18)' }}>{prevDays - firstDow + i + 1}</div>
          ))}
          {Array.from({ length: daysInMonth }).map((_,i) => {
            const d       = i + 1;
            const dateIso = iso(year, month, d);
            const isToday = dateIso === todayIso;
            const isSel   = dateIso === sel;
            const evCount = (byDate.get(dateIso) ?? []).length;
            return (
              <button key={d} type="button" onClick={() => setSel(prev => prev === dateIso ? null : dateIso)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.display, fontWeight: 400, fontSize: 22, color: isToday ? '#1A120E' : isSel ? '#1A120E' : A.ink }}>
                {isToday && <span className="atelier-today-coin" style={{ position: 'absolute', inset: '20%', borderRadius: '50%', zIndex: 0 }} />}
                {isSel && !isToday && <span style={{ position: 'absolute', inset: '18%', borderRadius: '50%', background: 'rgba(245,235,212,0.92)', zIndex: 0 }} />}
                <span style={{ position: 'relative', zIndex: 1 }}>{d}</span>
                {evCount > 0 && !isToday && !isSel && <span style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: A.brass, zIndex: 1 }} />}
              </button>
            );
          })}
        </div>

        {/* Next engagements */}
        <div style={{ padding: '0 22px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 12px' }}>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass }}>Next Engagements</div>
            <div style={{ flex: 1, height: '0.5px', background: 'var(--atelier-ink-dim)' }} />
            {nextThree.length > 0 && <div style={{ fontFamily: F.display, fontSize: 18, color: A.brassWarm }}>{nextThree.length}</div>}
          </div>
          {nextThree.length === 0 ? (
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: A.inkMute, padding: '4px 0 8px' }}>Nothing on the horizon.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {nextThree.map((ev, idx) => {
                const { day, month: mm } = splitDay(ev.event_date);
                return (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 0', borderBottom: idx < nextThree.length - 1 ? '0.5px solid rgba(201,168,76,0.12)' : 'none' }}>
                    <div style={{ flexShrink: 0, width: 56, textAlign: 'center' }}>
                      <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.36em', textTransform: 'uppercase', color: A.brassWarm, marginBottom: 4 }}>{mm}</div>
                      <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 44, color: A.ink, lineHeight: 0.95, letterSpacing: '-0.01em' }}>{day}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingLeft: 18, borderLeft: '0.5px solid var(--atelier-card-border)' }}>
                      <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.34em', textTransform: 'uppercase', color: A.brassWarm, marginBottom: 5 }}>{ev.kind}{ev.event_time ? ` · ${ev.event_time.slice(0,5)}` : ''}</div>
                      <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 19, color: A.ink, lineHeight: 1.2 }}>{ev.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Date popup */}
      {sel && (
        <>
          <div onClick={() => setSel(null)} style={{ position: 'fixed', inset: 0, zIndex: 30, backgroundColor: 'var(--atelier-overlay)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'var(--atelier-sheet-bg)', backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)', borderTop: `0.5px solid ${A.brassLine}`, padding: '16px 24px calc(24px + env(safe-area-inset-bottom))' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} /></div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 12 }}>{fmtShort(sel)}</div>
            {selEvents.length === 0 ? (
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: A.inkMute }}>Nothing scheduled.</div>
            ) : selEvents.map(ev => (
              <div key={ev.id} className="atelier-card" style={{ padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: A.brassWarm, marginBottom: 3 }}>{ev.kind}{ev.event_time ? ` · ${ev.event_time.slice(0,5)}` : ''}</div>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 17, color: A.ink }}>{ev.title}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
