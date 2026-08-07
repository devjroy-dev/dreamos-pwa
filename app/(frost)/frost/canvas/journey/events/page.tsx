'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchEvents, createEvent, updateEvent, deleteEvent,
  type CoupleEvent,
} from '../../../../../../lib/frost/journey';

const KINDS = ['shoot','call','fitting','trial','meeting','recce','family','ceremony','social','reminder','task','other'] as const;
type EventKind = typeof KINDS[number];

function fmtDate(d: string | null | undefined): { month: string; day: string } {
  if (!d) return { month: '', day: '—' };
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt.getTime())) return { month: '', day: '—' };
  return {
    month: dt.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    day: String(dt.getDate()),
  };
}

function fmtTime(t: string | null | undefined): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

const inp = (t: any): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
  border: `0.5px solid ${t.hairline}`, borderRadius: FR.md, fontFamily: FF.body,
  fontSize:16, color: t.ink, outline: 'none', boxSizing: 'border-box' as const,
  userSelect: 'text' as const,
});

export default function JourneyEvents() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [events, setEvents] = useState<CoupleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionEvent, setActionEvent] = useState<CoupleEvent | null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast]       = useState('');

  // Add form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate]   = useState('');
  const [newTime, setNewTime]   = useState('');
  const [newKind, setNewKind]   = useState<EventKind>('other');
  const [newNotes, setNewNotes] = useState('');

  // Edit form — pre-filled from actionEvent
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate]   = useState('');
  const [editTime, setEditTime]   = useState('');
  const [editKind, setEditKind]   = useState<EventKind>('other');
  const [editNotes, setEditNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const load = useCallback(async () => {
    const data = await fetchEvents('upcoming');
    setEvents(data); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = useCallback((ev: CoupleEvent) => {
    setEditTitle(ev.title);
    setEditDate(ev.event_date);
    setEditTime(ev.event_time ? ev.event_time.slice(0, 5) : '');
    setEditKind((ev.kind as EventKind) || 'other');
    setEditNotes(ev.notes || '');
    setActionEvent(ev);
    setShowEdit(true);
  }, []);

  const handleAdd = useCallback(async () => {
    if (!newTitle.trim() || !newDate) return;
    setSaving(true);
    try {
      const body: any = { title: newTitle.trim(), event_date: newDate, kind: newKind };
      if (newTime) body.event_time = newTime;
      if (newNotes.trim()) body.notes = newNotes.trim();
      const ev = await createEvent(body);
      setEvents(prev => [...prev, ev].sort((a, b) => a.event_date.localeCompare(b.event_date)));
      setShowAdd(false); setNewTitle(''); setNewDate(''); setNewTime(''); setNewKind('other'); setNewNotes('');
      showToast('Event added.');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  }, [newTitle, newDate, newTime, newKind, newNotes]);

  const handleEdit = useCallback(async () => {
    if (!actionEvent || !editTitle.trim() || !editDate) return;
    setSaving(true);
    try {
      const patch: any = { title: editTitle.trim(), event_date: editDate, kind: editKind };
      patch.event_time = editTime || null;
      patch.notes = editNotes.trim() || null;
      const updated = await updateEvent(actionEvent.id, patch);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e).sort((a, b) => a.event_date.localeCompare(b.event_date)));
      setShowEdit(false); setActionEvent(null);
      showToast('Updated.');
    } catch { showToast('Could not update. Try again.'); }
    setSaving(false);
  }, [actionEvent, editTitle, editDate, editTime, editKind, editNotes]);

  const handleMarkDone = useCallback(async (ev: CoupleEvent) => {
    setActionEvent(null);
    try {
      await updateEvent(ev.id, { state: 'done' });
      setEvents(prev => prev.filter(e => e.id !== ev.id));
      showToast('Marked done.');
    } catch { showToast('Could not update.'); }
  }, []);

  const handleDelete = useCallback(async (ev: CoupleEvent) => {
    setActionEvent(null);
    setEvents(prev => prev.filter(e => e.id !== ev.id));
    await deleteEvent(ev.id);
    showToast('Removed.');
  }, []);

  const now = new Date(); now.setHours(0,0,0,0);
  const soonestIdx = events.findIndex(ev => {
    const d = new Date(ev.event_date + 'T00:00:00'); d.setHours(0,0,0,0);
    return d.getTime() >= now.getTime();
  });

  return (
    <CanvasShell eyebrow="Events" backTo="/frost/canvas/sanctuary">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top) + 70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px`, userSelect:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:SP.xl }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>The days.</div>
          <button onClick={() => setShowAdd(true)} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
            <Plus size={12} color={t.brassMuted} strokeWidth={1.5} />Add
          </button>
        </div>

        {loading && <div style={{ fontFamily:FF.display, fontSize:22, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && events.length === 0 && (
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:19, color:t.soft, textAlign:'center', paddingTop:80 }}>Your days will appear here.</div>
        )}

        <div style={{ position:'relative' }}>
          {events.length > 0 && <div style={{ position:'absolute', left:22, top:22, bottom:22, width:'0.5px', background:t.hairline }} />}
          {events.map((ev, i) => {
            const { month, day } = fmtDate(ev.event_date);
            const highlight = i === soonestIdx;
            const timeStr = fmtTime(ev.event_time);
            return (
              <div key={ev.id} onClick={() => setActionEvent(ev)}
                style={{ display:'flex', alignItems:'flex-start', gap:SP.l, marginBottom:SP.xl, cursor:'pointer' }}>
                <div style={{ width:44, height:44, borderRadius:22, flexShrink:0, background:t.cardFill, border:`${highlight ? 1 : 0.5}px solid ${highlight ? t.brass : t.hairline}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontFamily:FF.label, fontSize:16, letterSpacing:'0.12em', color:t.soft, lineHeight:1.1 }}>{month}</div>
                  <div style={{ fontFamily:FF.display, fontSize:19, color:t.ink, lineHeight:1.2 }}>{day}</div>
                </div>
                <div style={{ flex:1, paddingTop:6 }}>
                  <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:19, color:t.ink, lineHeight:1.2 }}>{ev.title}</div>
                  <div style={{ display:'flex', gap:SP.m, marginTop:2 }}>
                    {timeStr && <div style={{ fontFamily:FF.label, fontSize:16, letterSpacing:'0.12em', color:t.soft }}>{timeStr}</div>}
                    <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.12em', color:t.brassMuted, textTransform:'uppercase' }}>{ev.kind}</div>
                  </div>
                  {ev.notes && <div style={{ fontFamily:FF.body, fontSize:16, color:t.soft, marginTop:2 }}>{ev.notes}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add sheet */}
      {showAdd && <>
        <div onClick={() => setShowAdd(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))`, maxHeight:'90vh', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Add an event</div>
            <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            {[{ label:'Event name', val:newTitle, set:setNewTitle, placeholder:'Lehenga fitting at Studio Anvaya' }].map(f => (
              <div key={f.label}>
                <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>{f.label}</div>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={inp(t)} />
              </div>
            ))}
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Date</div>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Time (optional)</div>
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Kind</div>
              <select value={newKind} onChange={e => setNewKind(e.target.value as EventKind)} style={{ ...inp(t), appearance:'none' as any }}>
                {KINDS.map(k => <option key={k} value={k} style={{ background: t.pagePaper }}>{k}</option>)}
              </select></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Notes (optional)</div>
              <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder='Venue, contact…' style={inp(t)} /></div>
            <button onClick={handleAdd} disabled={saving || !newTitle.trim() || !newDate}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(saving || !newTitle.trim() || !newDate) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {saving ? 'Adding…' : 'Add event'}
            </button>
          </div>
        </div>
      </>}

      {/* Action sheet */}
      {actionEvent && !showEdit && <>
        <div onClick={() => setActionEvent(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:19, color:t.ink, marginBottom:4 }}>{actionEvent.title}</div>
          <div style={{ fontFamily:FF.label, fontSize:16, letterSpacing:'0.15em', color:t.soft, marginBottom:SP.xl }}>
            {fmtDate(actionEvent.event_date).day} {fmtDate(actionEvent.event_date).month}
            {fmtTime(actionEvent.event_time) && ` · ${fmtTime(actionEvent.event_time)}`}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={() => handleMarkDone(actionEvent)} style={{ padding:14, background:`rgba(191,160,77,0.12)`, border:`0.5px solid rgba(191,160,77,0.3)`, borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:t.brass, cursor:'pointer' }}>Mark done</button>
            <button onClick={() => openEdit(actionEvent)} style={{ padding:14, background:'rgba(255,255,255,0.04)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:t.ink, cursor:'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(actionEvent)} style={{ padding:14, background:'rgba(184,69,62,0.12)', border:'0.5px solid rgba(184,69,62,0.3)', borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
            <button onClick={() => setActionEvent(null)} style={{ padding:14, background:'rgba(255,255,255,0.02)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      </>}

      {/* Edit sheet */}
      {showEdit && actionEvent && <>
        <div onClick={() => { setShowEdit(false); setActionEvent(null); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:202 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:203, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))`, maxHeight:'90vh', overflowY:'auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Edit event</div>
            <button onClick={() => { setShowEdit(false); setActionEvent(null); }} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Event name</div>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Date</div>
              <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Time (optional)</div>
              <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Kind</div>
              <select value={editKind} onChange={e => setEditKind(e.target.value as EventKind)} style={{ ...inp(t), appearance:'none' as any }}>
                {KINDS.map(k => <option key={k} value={k} style={{ background: t.pagePaper }}>{k}</option>)}
              </select></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Notes (optional)</div>
              <input value={editNotes} onChange={e => setEditNotes(e.target.value)} style={inp(t)} /></div>
            <button onClick={handleEdit} disabled={saving || !editTitle.trim() || !editDate}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(saving || !editTitle.trim() || !editDate) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
