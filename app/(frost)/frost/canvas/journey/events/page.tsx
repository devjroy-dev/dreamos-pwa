'use client';
import React, { useState, useEffect } from 'react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP } from '../../../../../../lib/frost/tokens';
import { fetchEvents, type CoupleEvent } from '../../../../../../lib/frost/journey';

function formatEventDate(d: string | null | undefined): { month: string; day: string } {
  if (!d) return { month: '', day: '—' };
  const date = new Date(d);
  if (isNaN(date.getTime())) return { month: '', day: '—' };
  return {
    month: date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
  };
}

export default function JourneyEvents() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [events, setEvents] = useState<CoupleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEvents().then(e => { setEvents(e); setLoading(false); }); }, []);

  const now = new Date(); now.setHours(0,0,0,0);
  const soonestIdx = events.findIndex(ev => {
    if (!ev.event_date) return false;
    const d = new Date(ev.event_date); d.setHours(0,0,0,0);
    return d.getTime() >= now.getTime();
  });

  return (
    <CanvasShell eyebrow="Events" backTo="/frost/canvas/journey">
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>
        <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:26, color:t.ink, marginBottom:SP.xl }}>The days.</div>
        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && events.length === 0 && <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:18, color:t.soft, textAlign:'center', paddingTop:80 }}>Your days will appear here.</div>}

        {/* Timeline */}
        <div style={{ position:'relative' }}>
          {events.length > 0 && (
            <div style={{ position:'absolute', left:22, top:22, bottom:22, width:'0.5px', background:t.hairline }} />
          )}
          {events.map((ev, i) => {
            const { month, day } = formatEventDate(ev.event_date);
            const highlight = i === soonestIdx;
            const counts: string[] = [];
            if (ev.task_count && ev.task_count > 0) counts.push(`${ev.task_count} reminder${ev.task_count === 1 ? '' : 's'}`);
            if (ev.vendor_count && ev.vendor_count > 0) counts.push(`${ev.vendor_count} vendor${ev.vendor_count === 1 ? '' : 's'}`);
            return (
              <div key={ev.id} style={{ display:'flex', alignItems:'flex-start', gap:SP.l, marginBottom:SP.xl }}>
                <div style={{
                  width:44, height:44, borderRadius:22, flexShrink:0,
                  background:t.cardFill,
                  border:`${highlight ? 1 : 0.5}px solid ${highlight ? t.brass : t.hairline}`,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                }}>
                  <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.12em', color:t.soft, lineHeight:1.1 }}>{month}</div>
                  <div style={{ fontFamily:FF.display, fontSize:18, color:t.ink, lineHeight:1.2 }}>{day}</div>
                </div>
                <div style={{ flex:1, paddingTop:6 }}>
                  <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, lineHeight:1.2 }}>{ev.event_name || ev.event_type || 'Event'}</div>
                  {ev.venue && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginTop:2 }}>{ev.venue}</div>}
                  {counts.length > 0 && <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.16em', color:t.brassMuted, marginTop:SP.s }}>{counts.join(' · ')}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CanvasShell>
  );
}
