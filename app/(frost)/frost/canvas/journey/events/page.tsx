'use client';
import React, { useState, useEffect } from 'react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../lib/frost/tokens';
import { fetchEvents, createEvent, deleteEvent, type CoupleEvent } from '../../../../../../lib/frost/journey';

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

  const [addSheet,   setAddSheet]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [confirmId,  setConfirmId]  = useState<string | null>(null);
  const [form, setForm] = useState({ event_name: '', event_date: '', venue: '' });

  const handleCreate = async () => {
    if (!form.event_name.trim() || !form.event_date || saving) return;
    setSaving(true);
    const created = await createEvent(form);
    if (created) {
      setEvents(prev => [...prev, created].sort((a,b) => (a.event_date||'') < (b.event_date||'') ? -1 : 1));
      setAddSheet(false);
      setForm({ event_name: '', event_date: '', venue: '' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setConfirmId(null);
    await deleteEvent(id);
  };

  return (
    <>
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
              <div key={ev.id} onContextMenu={e => { e.preventDefault(); setConfirmId(ev.id); }} style={{ display:'flex', alignItems:'flex-start', gap:SP.l, marginBottom:SP.xl, cursor:'context-menu' }}>
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

    {/* FAB */}
    <button onClick={() => setAddSheet(true)} style={{ position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 88px)', right:24, zIndex:50, width:52, height:52, borderRadius:26, background:t.brass, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 24px rgba(0,0,0,0.28)', touchAction:'manipulation' }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#1B1612" strokeWidth="1.8" strokeLinecap="round"/></svg>
    </button>

    {addSheet && <>
      <div onClick={() => setAddSheet(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`28px 24px calc(28px + env(safe-area-inset-bottom))` }}>
        <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:24, color:t.ink, marginBottom:4 }}>Add a day</div>
        <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:24 }}>A ceremony, a fitting, a moment worth marking.</div>
        {([
          { key:'event_name', label:'What is it', placeholder:'Mehendi, Haldi, Reception…', type:'text' },
          { key:'event_date', label:'When', placeholder:'', type:'date' },
          { key:'venue',      label:'Where', placeholder:'ITC Maurya, Home, Hotel…', type:'text' },
        ] as {key:string;label:string;placeholder:string;type:string}[]).map(f => (
          <div key={f.key} style={{ marginBottom:16 }}>
            <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>{f.label}</div>
            <input type={f.type} value={(form as Record<string,string>)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.body, fontSize:15, color:t.ink, outline:'none', boxSizing:'border-box' as const, colorScheme:'dark' }} />
          </div>
        ))}
        <button onClick={handleCreate} disabled={!form.event_name.trim() || !form.event_date || saving}
          style={{ width:'100%', padding:14, background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(!form.event_name.trim()||!form.event_date||saving)?0.5:1, marginTop:4 }}>
          {saving ? 'Adding…' : 'Add to Calendar'}
        </button>
      </div>
    </>}

    {confirmId && <>
      <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
        <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:20 }}>Remove this event?</div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => handleDelete(confirmId!)} style={{ flex:1, padding:14, background:'rgba(184,69,62,0.15)', border:'0.5px solid rgba(184,69,62,0.4)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
          <button onClick={() => setConfirmId(null)} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Keep</button>
        </div>
      </div>
    </>}
    </>
  );
}
