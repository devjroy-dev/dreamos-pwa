'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Check, Plus, X } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../../lib/frost/tokens';
import { fetchEvents, createEvent, updateEvent, deleteEvent, type CoupleEvent } from '../../../../../../lib/frost/journey';

function formatDue(due: string | null | undefined): string | null {
  if (!due) return null;
  const d = new Date(due + 'T00:00:00'); if (isNaN(d.getTime())) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const dc = new Date(d); dc.setHours(0,0,0,0);
  const diff = Math.round((dc.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'TODAY';
  if (diff === 1) return 'TOMORROW';
  if (diff < 0) return 'OVERDUE · ' + d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }).toUpperCase();
  if (diff <= 7) return d.toLocaleDateString('en-IN', { weekday:'long' }).toUpperCase();
  return d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }).toUpperCase();
}

const inp = (t: any): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
  border: `0.5px solid ${t.hairline}`, borderRadius: FR.md, fontFamily: FF.body,
  fontSize:16, color: t.ink, outline: 'none', boxSizing: 'border-box' as const,
  userSelect: 'text' as const,
});

export default function JourneyReminders() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [items, setItems]       = useState<CoupleEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [action, setAction]     = useState<CoupleEvent | null>(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast]       = useState('');

  // Add form
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate]   = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit form
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate]   = useState('');
  const [editNotes, setEditNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  // Load only reminder-kind events
  const load = useCallback(async () => {
    const all = await fetchEvents('upcoming');
    // Show reminders + tasks. Also fetch done ones for the done section.
    const done = await fetchEvents('done');
    const isReminder = (e: CoupleEvent) => e.kind === 'reminder' || e.kind === 'task';
    const pending = all.filter(isReminder).sort((a, b) =>
      (!a.event_date ? 1 : !b.event_date ? -1 : a.event_date.localeCompare(b.event_date))
    );
    const completed = done.filter(isReminder);
    setItems([...pending, ...completed]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = useCallback((ev: CoupleEvent) => {
    setEditTitle(ev.title);
    setEditDate(ev.event_date || '');
    setEditNotes(ev.notes || '');
    setAction(ev);
    setShowEdit(true);
  }, []);

  const handleAdd = useCallback(async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const body: any = { title: newTitle.trim(), event_date: newDate || today, kind: 'reminder' };
      if (newNotes.trim()) body.notes = newNotes.trim();
      const ev = await createEvent(body);
      setItems(prev => [ev, ...prev.filter(x => x.state !== 'done')].concat(prev.filter(x => x.state === 'done')));
      setShowAdd(false); setNewTitle(''); setNewDate(''); setNewNotes('');
      showToast('Reminder added.');
    } catch { showToast('Could not add. Try again.'); }
    setSaving(false);
  }, [newTitle, newDate, newNotes]);

  const handleEdit = useCallback(async () => {
    if (!action || !editTitle.trim()) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const updated = await updateEvent(action.id, {
        title: editTitle.trim(),
        event_date: editDate || today,
        notes: editNotes.trim() || null,
      });
      setItems(prev => prev.map(x => x.id === updated.id ? updated : x));
      setShowEdit(false); setAction(null);
      showToast('Updated.');
    } catch { showToast('Could not update. Try again.'); }
    setSaving(false);
  }, [action, editTitle, editDate, editNotes]);

  const handleToggle = useCallback(async (ev: CoupleEvent) => {
    const newState = ev.state === 'done' ? 'upcoming' : 'done';
    setItems(prev => prev.map(x => x.id === ev.id ? { ...x, state: newState } : x));
    try {
      await updateEvent(ev.id, { state: newState });
    } catch {
      setItems(prev => prev.map(x => x.id === ev.id ? { ...x, state: ev.state } : x));
    }
  }, []);

  const handleDelete = useCallback(async (ev: CoupleEvent) => {
    setAction(null);
    setItems(prev => prev.filter(x => x.id !== ev.id));
    await deleteEvent(ev.id);
    showToast('Removed.');
  }, []);

  const pending   = items.filter(r => r.state !== 'done');
  const done      = items.filter(r => r.state === 'done');

  return (
    <CanvasShell eyebrow="Reminders" backTo="/frost/canvas/journey">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top) + 70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px`, userSelect:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:SP.xl }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>What I remember.</div>
          <button onClick={() => setShowAdd(true)} style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
            <Plus size={12} color={t.brassMuted} strokeWidth={1.5} />Add
          </button>
        </div>

        {loading && <div style={{ fontFamily:FF.display, fontSize:22, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && items.length === 0 && <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:19, color:t.soft, textAlign:'center', paddingTop:80 }}>Your list is clear.</div>}

        {pending.map(r => (
          <div key={r.id}><Row r={r} t={t}
            onTap={() => handleToggle(r)}
            onHold={() => setAction(r)} /></div>
        ))}

        {done.length > 0 && <>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginTop:SP.xl, marginBottom:SP.m }}>DONE</div>
          {done.map(r => (
            <div key={r.id}><Row r={r} t={t} muted
              onTap={() => handleToggle(r)}
              onHold={() => setAction(r)} /></div>
          ))}
        </>}

        <div style={{ marginTop:SP.xl, fontFamily:FF.display, fontStyle:'italic', fontSize:16, color:t.soft, textAlign:'center' }}>
          ✦  Tell Dream Ai anything you need to remember.
        </div>
      </div>

      {/* Add sheet */}
      {showAdd && <>
        <div onClick={() => setShowAdd(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Add a reminder</div>
            <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>What to remember</div>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder='Call the venue about parking' style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Due date (optional)</div>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Notes (optional)</div>
              <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder='Any extra context…' style={inp(t)} /></div>
            <button onClick={handleAdd} disabled={saving || !newTitle.trim()}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(saving || !newTitle.trim()) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {saving ? 'Adding…' : 'Add reminder'}
            </button>
          </div>
        </div>
      </>}

      {/* Action sheet */}
      {action && !showEdit && <>
        <div onClick={() => setAction(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:19, color:t.ink, marginBottom:4 }}>{action.title}</div>
          {action.event_date && <div style={{ fontFamily:FF.label, fontSize:16, letterSpacing:'0.15em', color:t.soft, marginBottom:SP.xl }}>{formatDue(action.event_date) || action.event_date}</div>}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={() => { handleToggle(action); setAction(null); }}
              style={{ padding:14, background:`rgba(191,160,77,0.12)`, border:`0.5px solid rgba(191,160,77,0.3)`, borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:t.brass, cursor:'pointer' }}>
              {action.state === 'done' ? 'Mark pending' : 'Mark done'}
            </button>
            <button onClick={() => openEdit(action)}
              style={{ padding:14, background:'rgba(255,255,255,0.04)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:t.ink, cursor:'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(action)}
              style={{ padding:14, background:'rgba(184,69,62,0.12)', border:'0.5px solid rgba(184,69,62,0.3)', borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
            <button onClick={() => setAction(null)}
              style={{ padding:14, background:'rgba(255,255,255,0.02)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      </>}

      {/* Edit sheet */}
      {showEdit && action && <>
        <div onClick={() => { setShowEdit(false); setAction(null); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:202 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:203, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Edit reminder</div>
            <button onClick={() => { setShowEdit(false); setAction(null); }} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>What to remember</div>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Due date</div>
              <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={inp(t)} /></div>
            <div><div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Notes</div>
              <input value={editNotes} onChange={e => setEditNotes(e.target.value)} style={inp(t)} /></div>
            <button onClick={handleEdit} disabled={saving || !editTitle.trim()}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(saving || !editTitle.trim()) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}

function Row({ r, t, onTap, onHold, muted=false }: { r: CoupleEvent; t: any; onTap: () => void; onHold: () => void; muted?: boolean }) {
  const due = formatDue(r.event_date);
  const isDone = r.state === 'done';
  return (
    <div onClick={onTap} onContextMenu={e => { e.preventDefault(); onHold(); }}
      style={{ display:'flex', alignItems:'flex-start', gap:SP.m, padding:`${SP.l}px 0`, cursor:'pointer', opacity:muted?0.4:1, borderBottom:`0.5px solid ${t.hairline}`, userSelect:'none' }}>
      <div style={{ width:18, height:18, borderRadius:9, border:`1px solid ${isDone ? t.brass : t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:4, background:isDone?'rgba(191,160,77,0.12)':'transparent' }}>
        {isDone && <Check size={10} color={t.brass} strokeWidth={2.5} />}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:FF.body, fontSize:16, lineHeight:1.5, color:isDone?t.soft:t.ink, textDecoration:isDone?'line-through':'none' }}>{r.title}</div>
        {due && <div style={{ fontFamily:FF.label, fontSize:16, letterSpacing:'0.14em', color:due.startsWith('OVERDUE')?'#B8453E':t.brassMuted, marginTop:4 }}>{due}</div>}
        {r.notes && <div style={{ fontFamily:FF.body, fontSize:16, color:t.soft, marginTop:2 }}>{r.notes}</div>}
      </div>
    </div>
  );
}
