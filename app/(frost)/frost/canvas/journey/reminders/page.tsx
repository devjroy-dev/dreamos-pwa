'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../lib/frost/tokens';
import { fetchReminders, createReminder, toggleReminder, deleteReminder, type Reminder } from '../../../../../../lib/frost/journey';

function formatDue(due: string | null | undefined): string | null {
  if (!due) return null;
  const d = new Date(due); if (isNaN(d.getTime())) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const dc = new Date(d); dc.setHours(0,0,0,0);
  const diff = Math.round((dc.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'TODAY';
  if (diff === 1) return 'TOMORROW';
  if (diff < 0) return 'OVERDUE · ' + d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }).toUpperCase();
  if (diff <= 7) return d.toLocaleDateString('en-IN', { weekday:'long' }).toUpperCase();
  return d.toLocaleDateString('en-IN', { month:'short', day:'numeric' }).toUpperCase();
}

export default function JourneyReminders() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => { fetchReminders().then(r => { setItems(r); setLoading(false); }); }, []);

  const toggle = useCallback(async (r: Reminder) => {
    const next = !r.is_complete;
    setItems(prev => prev.map(x => x.id === r.id ? {...x, is_complete: next} : x));
    const ok = await toggleReminder(r.id, next);
    if (!ok) setItems(prev => prev.map(x => x.id === r.id ? {...x, is_complete: !next} : x));
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems(prev => prev.filter(x => x.id !== id)); setConfirmId(null);
    await deleteReminder(id);
  }, []);

  const [addSheet, setAddSheet] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({ text: '', due_date: '', event: '' });

  const handleCreate = async () => {
    if (!form.text.trim() || saving) return;
    setSaving(true);
    const created = await createReminder({ text: form.text.trim(), due_date: form.due_date || undefined, event: form.event || undefined });
    if (created) {
      setItems(prev => [created, ...prev]);
      setAddSheet(false);
      setForm({ text: '', due_date: '', event: '' });
    }
    setSaving(false);
  };

  const pending = items.filter(r => !r.is_complete).sort((a,b) => (!a.due_date ? 1 : !b.due_date ? -1 : a.due_date.localeCompare(b.due_date)));
  const done = items.filter(r => r.is_complete);

  return (
    <CanvasShell eyebrow="Reminders" backTo="/frost/canvas/journey">
      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>
        <div style={{ fontFamily: FF.display, fontStyle:'italic', fontSize:26, color:t.ink, marginBottom:SP.xl }}>What I remember.</div>
        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && items.length === 0 && <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:18, color:t.soft, textAlign:'center', paddingTop:80 }}>Your list is clear.</div>}
        {pending.map(r => <Row key={r.id} r={r} t={t} onTap={() => toggle(r)} onHold={() => setConfirmId(r.id)} />)}
        {done.length > 0 && <>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginTop:SP.xl, marginBottom:SP.m }}>DONE</div>
          {done.map(r => <Row key={r.id} r={r} t={t} onTap={() => toggle(r)} onHold={() => setConfirmId(r.id)} muted />)}
        </>}
      </div>
      {/* FAB */}
      <button onClick={() => setAddSheet(true)} style={{ position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 88px)', right:24, zIndex:50, width:52, height:52, borderRadius:26, background:t.brass, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 24px rgba(0,0,0,0.28)', touchAction:'manipulation' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#1B1612" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>

      {addSheet && <>
        <div onClick={() => setAddSheet(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`28px 24px calc(28px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:24, color:t.ink, marginBottom:4 }}>Add a reminder</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:24 }}>What needs to happen.</div>
          {([
            { key:'text',     label:'Reminder',  placeholder:'Call florist, confirm fitting…', type:'text' },
            { key:'event',    label:'For event',  placeholder:'Wedding, Mehendi…',               type:'text' },
            { key:'due_date', label:'Due date',   placeholder:'',                                type:'date' },
          ] as {key:string;label:string;placeholder:string;type:string}[]).map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>{f.label}</div>
              <input type={f.type} value={(form as Record<string,string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.body, fontSize:15, color:t.ink, outline:'none', boxSizing:'border-box' as const, colorScheme:'dark' }} />
            </div>
          ))}
          <button onClick={handleCreate} disabled={!form.text.trim() || saving}
            style={{ width:'100%', padding:14, background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(!form.text.trim()||saving)?0.5:1, marginTop:4 }}>
            {saving ? 'Adding…' : 'Add Reminder'}
          </button>
        </div>
      </>}

      {confirmId && <>
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.cardFill, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:8 }}>Forget this?</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:20 }}>Ask Dream Ai if you want it back.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => remove(confirmId)} style={{ flex:1, padding:14, background:'rgba(184,69,62,0.15)', border:'0.5px solid rgba(184,69,62,0.4)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Forget it</button>
            <button onClick={() => setConfirmId(null)} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Keep</button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}

function Row({ r, t, onTap, onHold, muted=false }: { r:Reminder; t:any; onTap:()=>void; onHold:()=>void; muted?:boolean }) {
  const due = formatDue(r.due_date);
  return (
    <div onClick={onTap} onContextMenu={e => { e.preventDefault(); onHold(); }} style={{ display:'flex', alignItems:'flex-start', gap:SP.m, padding:`${SP.l}px 0`, cursor:'pointer', opacity:muted?0.4:1, borderBottom:`0.5px solid ${t.hairline}` }}>
      <div style={{ width:18, height:18, borderRadius:9, border:`1px solid ${r.is_complete ? t.brass : t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:4, background:r.is_complete?'rgba(191,160,77,0.12)':'transparent' }}>
        {r.is_complete && <Check size={10} color={t.brass} strokeWidth={2.5} />}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:FF.body, fontSize:15, lineHeight:1.5, color:r.is_complete?t.soft:t.ink, textDecoration:r.is_complete?'line-through':'none' }}>{r.text}</div>
        {due && <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.14em', color:due.startsWith('OVERDUE')?'#B8453E':t.brassMuted, marginTop:4 }}>{due}</div>}
      </div>
    </div>
  );
}
