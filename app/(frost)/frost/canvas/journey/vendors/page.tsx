'use client';
import React, { useState, useEffect, useCallback } from 'react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../lib/frost/tokens';
import { fetchVendors, createVendorRow, deleteVendorRow, fmtINR, type CoupleVendor } from '../../../../../../lib/frost/journey';

const PIPELINE = [
  { key: 'booked',        label: 'BOOKED' },
  { key: 'paid',          label: 'PAID' },
  { key: 'shortlisted',   label: 'SHORTLISTED' },
  { key: 'considering',   label: 'CONSIDERING' },
  { key: 'in_discussion', label: 'IN TALKS' },
  { key: 'contacted',     label: 'IN TALKS' },
  { key: 'enquired',      label: 'ENQUIRED' },
  { key: 'declined',      label: 'PASSED ON' },
];

export default function JourneyVendors() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [vendors, setVendors] = useState<CoupleVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [addSheet,  setAddSheet]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form, setForm] = useState({ name:'', category:'', status:'considering', quoted_total:'', notes:'' });

  const handleCreate = async () => {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    const created = await createVendorRow({ name: form.name, category: form.category||undefined, status: form.status, quoted_total: form.quoted_total ? parseInt(form.quoted_total) : undefined, notes: form.notes||undefined });
    if (created) {
      setVendors(prev => [created, ...prev]);
      setAddSheet(false);
      setForm({ name:'', category:'', status:'considering', quoted_total:'', notes:'' });
    }
    setSaving(false);
  };

  useEffect(() => { fetchVendors().then(v => { setVendors(v); setLoading(false); }); }, []);

  const handleDelete = useCallback(async (id: string) => {
    setVendors(prev => prev.filter(x => x.id !== id)); setConfirmId(null);
    await deleteVendorRow(id);
  }, []);

  // Group by pipeline
  const labelMap = new Map<string, CoupleVendor[]>();
  const seenLabels = new Set<string>();
  PIPELINE.forEach(p => { if (!labelMap.has(p.label)) labelMap.set(p.label, []); });
  labelMap.set('OTHER', []);
  vendors.forEach(v => {
    const status = (v.status || '').toLowerCase();
    const matched = PIPELINE.find(p => p.key === status);
    const label = matched ? matched.label : 'OTHER';
    labelMap.get(label)!.push(v);
  });
  const groups: { label: string; items: CoupleVendor[] }[] = [];
  [...PIPELINE.map(p => p.label), 'OTHER'].forEach(label => {
    if (seenLabels.has(label)) return; seenLabels.add(label);
    const items = labelMap.get(label) || [];
    if (items.length > 0) groups.push({ label, items });
  });

  return (
    <CanvasShell eyebrow="Vendors" backTo="/frost/canvas/journey">
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>
        <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:26, color:t.ink, marginBottom:SP.xl }}>My team.</div>
        {loading && <div style={{ fontFamily:FF.display, fontSize:32, color:t.brassMuted, letterSpacing:6 }}>…</div>}
        {!loading && vendors.length === 0 && <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:18, color:t.soft, textAlign:'center', paddingTop:80 }}>No one yet.</div>}
        {groups.map(g => (
          <div key={g.label} style={{ marginTop:SP.xl }}>
            <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>{g.label}</div>
            {g.items.map(v => {
              const initial = (v.category?.[0] || v.name?.[0] || '·').toUpperCase();
              const isBooked = v.status === 'booked';
              const paid = Number(v.paid_total) || 0;
              const quoted = Number(v.quoted_total) || 0;
              const moneyLine = isBooked && quoted > 0 ? `${fmtINR(paid)} of ${fmtINR(quoted)} paid` : (quoted ? fmtINR(quoted) : null);
              const meta = [v.category, v.events?.join(', '), moneyLine].filter(Boolean).join(' · ');
              return (
                <div key={v.id} onContextMenu={e => { e.preventDefault(); setConfirmId(v.id); }}
                  style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.l}px 0`, borderBottom:`0.5px solid ${t.hairline}`, cursor:'context-menu' }}>
                  <div style={{ width:36, height:36, borderRadius:18, border:`0.5px solid ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:FF.label, fontSize:11, color:t.soft }}>
                    {initial}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:FF.body, fontSize:15, color:t.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.name}</div>
                    {meta && <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.1em', color:t.soft, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{meta}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      </div>

      {/* FAB */}
      <button onClick={() => setAddSheet(true)} style={{ position:'fixed', bottom:'calc(env(safe-area-inset-bottom,0px) + 88px)', right:24, zIndex:50, width:52, height:52, borderRadius:26, background:t.brass, border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 4px 24px rgba(0,0,0,0.28)', touchAction:'manipulation' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#1B1612" strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>

      {addSheet && <>
        <div onClick={() => setAddSheet(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`28px 24px calc(28px + env(safe-area-inset-bottom))`, maxHeight:'85vh', overflowY:'auto' }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:24, color:t.ink, marginBottom:4 }}>Add a vendor</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:24 }}>Track everyone on your wedding team.</div>
          {([
            { key:'name',         label:'Name',         placeholder:'Aanya Studio, Dev Roy…', type:'text' },
            { key:'category',     label:'Category',     placeholder:'Photography, MUA…',       type:'text' },
            { key:'quoted_total', label:'Quoted (Rs)',  placeholder:'450000',                  type:'number' },
            { key:'notes',        label:'Notes',        placeholder:'Contact, requirements…',  type:'text' },
          ] as {key:string;label:string;placeholder:string;type:string}[]).map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>{f.label}</div>
              <input type={f.type} value={(form as Record<string,string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.body, fontSize:15, color:t.ink, outline:'none', boxSizing:'border-box' as const }} />
            </div>
          ))}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:t.soft, marginBottom:8 }}>Status</div>
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
              {['considering','shortlisted','in_discussion','booked'].map(s => (
                <button key={s} onClick={() => setForm(p => ({ ...p, status: s }))}
                  style={{ padding:'7px 14px', borderRadius:FR.pill, border:`0.5px solid ${form.status===s ? t.brass : t.hairline}`, background:form.status===s ? `rgba(191,160,77,0.12)` : 'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:form.status===s ? t.brass : t.soft, cursor:'pointer' }}>
                  {s.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleCreate} disabled={!form.name.trim()||saving}
            style={{ width:'100%', padding:14, background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(!form.name.trim()||saving)?0.5:1 }}>
            {saving ? 'Adding…' : 'Add Vendor'}
          </button>
        </div>
      </>}

      {confirmId && <>
        <div onClick={() => setConfirmId(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.cardFill, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:8 }}>Remove this vendor?</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:20 }}>Ask Dream Ai if you want them back.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => handleDelete(confirmId)} style={{ flex:1, padding:14, background:'rgba(184,69,62,0.15)', border:'0.5px solid rgba(184,69,62,0.4)', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#B8453E', cursor:'pointer' }}>Remove</button>
            <button onClick={() => setConfirmId(null)} style={{ flex:1, padding:14, background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, cursor:'pointer' }}>Keep</button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
