'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { PageHeader, GoldBtn, GhostBtn, Toast, T } from '../../_components/AdminUI';
import { API_BASE } from '../../../../lib/admin-api';

export interface WaitlistSignup {
  id: string;
  kind: 'dreamer' | 'maker';
  name: string | null;
  phone: string;
  instagram_handle: string | null;
  category: string | null;
  category_other: string | null;
  wedding_date: string | null;
  wedding_date_status: 'exact' | 'season' | 'browsing' | null;
  wedding_date_season: string | null;
  status: 'new' | 'contacted' | 'onboarded' | 'rejected';
  notes: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string,string> = {
  new: T.gold, contacted: '#6B9E8F', onboarded: '#5CE0A0', rejected: T.danger,
};
const STATUS_LABELS: Record<string,string> = {
  new:'NEW', contacted:'CONTACTED', onboarded:'ONBOARDED', rejected:'REJECTED',
};

const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';
const h = () => ({ 'Content-Type':'application/json','x-admin-password':ADMIN_PWD });

async function fetchSignups(kind: string): Promise<WaitlistSignup[]> {
  const res = await fetch(`${API_BASE}/api/v2/admin/waitlist?kind=${kind}`,{headers:h()});
  if(!res.ok) throw new Error('Failed');
  return (await res.json()).signups || [];
}
async function patchSignup(id:string, patch:{status?:string;notes?:string}) {
  const res = await fetch(`${API_BASE}/api/v2/admin/waitlist/${id}`,{method:'PATCH',headers:h(),body:JSON.stringify(patch)});
  if(!res.ok) throw new Error('Failed');
  return res.json();
}
async function deleteSignup(id:string) {
  const res = await fetch(`${API_BASE}/api/v2/admin/waitlist/${id}`,{method:'DELETE',headers:h()});
  if(!res.ok) throw new Error('Failed');
}

function StatusBadge({status}:{status:string}){
  const c=STATUS_COLORS[status]||T.soft;
  return <span style={{fontFamily:T.ff.label,fontWeight:300,fontSize:8,letterSpacing:'0.22em',textTransform:'uppercase',color:c,background:`${c}18`,border:`0.5px solid ${c}44`,padding:'3px 8px',borderRadius:100}}>{STATUS_LABELS[status]||status}</span>;
}

function Row({label,value}:{label:string;value:string}){
  return(
    <div style={{display:'flex',gap:12,alignItems:'baseline'}}>
      <div style={{fontFamily:T.ff.label,fontWeight:200,fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',color:T.soft,minWidth:110}}>{label}</div>
      <div style={{fontFamily:T.ff.body,fontWeight:300,fontSize:13,color:T.ink}}>{value}</div>
    </div>
  );
}

function DetailDrawer({signup,onClose,onUpdate,onDelete}:{signup:WaitlistSignup;onClose:()=>void;onUpdate:(u:WaitlistSignup)=>void;onDelete:(id:string)=>void}){
  const [status,setStatus]=useState(signup.status);
  const [notes,setNotes]=useState(signup.notes||'');
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState('');
  const [toastErr,setToastErr]=useState(false);
  const fmtDate=(iso:string)=>new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  const inp:React.CSSProperties={width:'100%',background:'rgba(255,255,255,0.05)',border:`0.5px solid ${T.border}`,borderRadius:8,padding:'10px 12px',color:T.ink,fontSize:13,fontFamily:T.ff.body,fontWeight:300,outline:'none'};
  const waLink=`https://wa.me/${signup.phone.replace(/\+/g,'')}?text=Hi%20${encodeURIComponent(signup.name||'')}%2C%20this%20is%20Dev%20from%20The%20Dream%20Wedding.`;

  const save=async()=>{
    setSaving(true);
    try{await patchSignup(signup.id,{status,notes:notes||undefined});onUpdate({...signup,status:status as any,notes:notes||null});setToast('Saved.');setToastErr(false);}
    catch{setToast('Could not save.');setToastErr(true);}
    setSaving(false);
  };
  const remove=async()=>{
    if(!confirm(`Remove ${signup.name||signup.phone}?`))return;
    await deleteSignup(signup.id);onDelete(signup.id);onClose();
  };

  return(
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:100}}/>
      <div style={{position:'fixed',top:0,right:0,bottom:0,width:420,maxWidth:'92vw',background:'#0F0D0B',borderLeft:`0.5px solid ${T.border}`,zIndex:101,overflowY:'auto',padding:28,display:'flex',flexDirection:'column',gap:20}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:T.ff.label,fontWeight:200,fontSize:8,color:T.soft,letterSpacing:'0.25em',textTransform:'uppercase',marginBottom:4}}>
              {signup.kind==='dreamer'?'Dreamer':'Maker'} · {fmtDate(signup.created_at)}
            </div>
            <div style={{fontFamily:T.ff.display,fontStyle:'italic',fontWeight:300,fontSize:24,color:T.ink}}>{signup.name||signup.phone}</div>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:T.soft,fontSize:22,cursor:'pointer'}}>✕</button>
        </div>

        <div style={{height:'0.5px',background:T.border}}/>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Row label="Phone" value={signup.phone}/>
          {signup.instagram_handle&&<Row label="Instagram" value={`@${signup.instagram_handle}`}/>}
          {signup.kind==='maker'&&signup.category&&<Row label="Category" value={signup.category_other||signup.category}/>}
          {signup.kind==='dreamer'&&(
            signup.wedding_date_status==='exact'?<Row label="Wedding date" value={fmtDate(signup.wedding_date!)}/>:
            signup.wedding_date_status==='season'?<Row label="Season" value={signup.wedding_date_season||'—'}/>:
            <Row label="Planning" value="Just browsing"/>
          )}
          {signup.notes&&<Row label="Notes" value={signup.notes}/>}
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'rgba(37,211,102,0.08)',border:'0.5px solid rgba(37,211,102,0.25)',borderRadius:10,textDecoration:'none',color:'#25D366',fontFamily:T.ff.label,fontSize:11,fontWeight:300,letterSpacing:'0.1em'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" fill="#25D366"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.118 1.528 5.845L0 24l6.335-1.652A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.273-1.535l-.378-.224-3.927 1.025 1.046-3.82-.247-.393A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" fill="#25D366"/></svg>
          Message on WhatsApp
        </a>

        <div style={{height:'0.5px',background:T.border}}/>

        <div>
          <div style={{fontFamily:T.ff.label,fontWeight:200,fontSize:8,color:T.soft,letterSpacing:'0.22em',textTransform:'uppercase',marginBottom:8}}>Status</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {(['new','contacted','onboarded','rejected'] as const).map(s=>(
              <button key={s} onClick={()=>setStatus(s)} style={{padding:'8px 14px',borderRadius:100,cursor:'pointer',border:`0.5px solid ${STATUS_COLORS[s]}44`,background:status===s?`${STATUS_COLORS[s]}22`:'transparent',color:status===s?STATUS_COLORS[s]:T.muted,fontFamily:T.ff.label,fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase',outline:status===s?`1px solid ${STATUS_COLORS[s]}`:'none'}}>{STATUS_LABELS[s]}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{fontFamily:T.ff.label,fontWeight:200,fontSize:8,color:T.soft,letterSpacing:'0.22em',textTransform:'uppercase',marginBottom:8}}>Notes</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} placeholder="Add a note…" style={{...inp,resize:'none'}}/>
        </div>

        <div style={{display:'flex',gap:10}}>
          <GoldBtn label={saving?'Saving…':'Save'} onClick={save} disabled={saving}/>
          <GhostBtn label="Delete" danger onClick={remove}/>
        </div>

        {toast&&<Toast msg={toast} error={toastErr} onDone={()=>setToast('')}/>}
      </div>
    </>
  );
}

function SignupCard({signup,onClick}:{signup:WaitlistSignup;onClick:()=>void}){
  const fmtDate=(iso:string)=>new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
  const weddingInfo=signup.kind==='dreamer'
    ?signup.wedding_date_status==='exact'?fmtDate(signup.wedding_date!)
    :signup.wedding_date_status==='season'?signup.wedding_date_season||'—'
    :'Browsing':null;

  return(
    <div onClick={onClick} style={{background:T.card,border:`0.5px solid ${T.border}`,borderRadius:12,padding:'16px 18px',cursor:'pointer',display:'flex',alignItems:'center',gap:14,transition:'border-color 0.15s'}}
      onMouseEnter={e=>(e.currentTarget.style.borderColor=T.borderStrong)}
      onMouseLeave={e=>(e.currentTarget.style.borderColor=T.border)}>
      <div style={{width:40,height:40,borderRadius:20,flexShrink:0,background:`${T.gold}18`,border:`0.5px solid ${T.gold}33`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:T.ff.display,fontStyle:'italic',fontSize:18,color:T.gold}}>
        {(signup.name?.[0]||'?').toUpperCase()}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
          <span style={{fontFamily:T.ff.display,fontStyle:'italic',fontWeight:300,fontSize:16,color:T.ink,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{signup.name||'—'}</span>
          <StatusBadge status={signup.status}/>
        </div>
        <div style={{fontFamily:T.ff.label,fontWeight:200,fontSize:9,color:T.soft,letterSpacing:'0.12em',display:'flex',gap:10,flexWrap:'wrap'}}>
          <span>{signup.phone}</span>
          {signup.instagram_handle&&<span>@{signup.instagram_handle}</span>}
          {signup.kind==='maker'&&signup.category&&<span>{signup.category_other||signup.category}</span>}
          {weddingInfo&&<span>{weddingInfo}</span>}
        </div>
        {signup.notes&&<div style={{fontFamily:T.ff.body,fontWeight:300,fontSize:11,color:T.muted,marginTop:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{signup.notes}</div>}
      </div>
      <div style={{fontFamily:T.ff.label,fontWeight:200,fontSize:8,color:T.muted,flexShrink:0}}>{fmtDate(signup.created_at)}</div>
    </div>
  );
}

export function InviteRequestsList({kind,title}:{kind:'dreamer'|'maker';title:string}){
  const [all,setAll]=useState<WaitlistSignup[]>([]);
  const [loading,setLoading]=useState(true);
  const [statusF,setStatusF]=useState('all');
  const [selected,setSelected]=useState<WaitlistSignup|null>(null);
  const [toast,setToast]=useState('');

  const load=useCallback(async()=>{
    setLoading(true);
    try{setAll(await fetchSignups(kind));}
    catch{setToast('Could not load.');}
    setLoading(false);
  },[kind]);

  useEffect(()=>{load();},[load]);

  const visible=all.filter(s=>statusF==='all'||s.status===statusF);
  const newCount=all.filter(s=>s.status==='new').length;

  const statuses=['all','new','contacted','onboarded','rejected'];

  return(
    <div className="fade-up">
      <PageHeader title={title} sub={`${newCount} new · ${all.length} total`} action={<GoldBtn label="Refresh" onClick={load} small/>}/>

      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {statuses.map(s=>{
          const color=s==='all'?T.gold:STATUS_COLORS[s];
          const active=statusF===s;
          const count=s==='all'?all.length:all.filter(x=>x.status===s).length;
          return(
            <button key={s} onClick={()=>setStatusF(s)} style={{padding:'6px 14px',borderRadius:100,cursor:'pointer',border:`0.5px solid ${active?color:T.border}`,background:active?`${color}18`:'transparent',color:active?color:T.muted,fontFamily:T.ff.label,fontSize:8,letterSpacing:'0.2em',textTransform:'uppercase'}}>
              {(s==='all'?'All':STATUS_LABELS[s])+` (${count})`}
            </button>
          );
        })}
      </div>

      {loading?(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[1,2,3,4].map(i=><div key={i} className="shimmer" style={{background:T.card,borderRadius:12,height:72}}/>)}
        </div>
      ):visible.length===0?(
        <div style={{padding:'48px 0',textAlign:'center',fontFamily:T.ff.display,fontStyle:'italic',fontSize:18,color:T.muted}}>No {kind}s with status "{statusF}".</div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {visible.map(s=><div key={s.id}><SignupCard signup={s} onClick={()=>setSelected(s)}/></div>)}
        </div>
      )}

      {selected&&<DetailDrawer signup={selected} onClose={()=>setSelected(null)} onUpdate={u=>{setAll(p=>p.map(x=>x.id===u.id?u:x));setSelected(u);}} onDelete={id=>{setAll(p=>p.filter(x=>x.id!==id));setSelected(null);}}/>}
      {toast&&<Toast msg={toast} onDone={()=>setToast('')} error/>}
    </div>
  );
}
