'use client';
export const dynamic = 'force-dynamic';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoEventsData } from '@/hooks/demo/useDemoVendorData';
import type { VendorEvent } from '@/lib/vendor/types/vendor';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',brassDeep:'var(--role-metal)',brassLine:'rgba(201,168,76,0.18)',brassSoft:'rgba(201,168,76,0.28)',terracotta:'var(--role-critical)'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS=['S','M','T','W','T','F','S'];
function iso(y:number,m:number,d:number){return`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;}
function fmtShort(s:string){const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s);if(!m)return s;return`${parseInt(m[3])} ${MONTHS_SHORT[parseInt(m[2])-1]}`;}
function splitDay(s:string):{day:string;month:string}{const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s);if(!m)return{day:s,month:''};return{day:String(parseInt(m[3])),month:MONTHS_SHORT[parseInt(m[2])-1]};}

// Demo hot dates — 5 auspicious dates seeded for demo
const DEMO_HOT_DATES=new Set([
  // June
  '2026-06-15','2026-06-22',
  // July
  '2026-07-04','2026-07-11',
  // October — Navratri & Dussehra season
  '2026-10-02','2026-10-09','2026-10-16','2026-10-23','2026-10-30',
  // November — peak wedding season
  '2026-11-06','2026-11-13','2026-11-20','2026-11-27',
  // December — winter weddings
  '2026-12-03','2026-12-10','2026-12-17','2026-12-27',
]);

// Demo availability blocks
interface Block{blocked_date:string;note?:string;}
const DEMO_BLOCKS_INIT:Block[]=[{blocked_date:'2026-06-18',note:'Personal leave'},{blocked_date:'2026-06-25',note:''}];

function BlockSheet({open,dateIso,existing,onClose,onToast,onBlock,onUnblock}:{open:boolean;dateIso:string|null;existing:Block|null;onClose:()=>void;onToast:(msg:string,kind:'success'|'error')=>void;onBlock:(date:string,note:string)=>void;onUnblock:(date:string)=>void;}){
  const[note,setNote]=useState('');
  if(!open||!dateIso)return null;
  return(<><div onClick={onClose} style={{position:'fixed',inset:0,zIndex:40,background:'var(--atelier-overlay)'}}/><div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:`0.5px solid ${A.brassLine}`,padding:'16px 24px calc(24px + env(safe-area-inset-bottom))'}}>
    <div style={{display:'flex',justifyContent:'center',marginBottom:14}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
    <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,marginBottom:4}}>{fmtShort(dateIso)}</div>
    <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.2,marginBottom:16}}>{existing?'Unblock date':'Block date'}</div>
    {!existing&&(<><label style={{display:'block',fontFamily:F.label,fontWeight:300,fontSize:8,color:A.inkMute,letterSpacing:'0.32em',textTransform:'uppercase',marginBottom:6}}>Note (optional)</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Away, personal, booked elsewhere…" style={{width:'100%',padding:'12px 14px',boxSizing:'border-box' as const,background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:2,fontFamily:F.body,fontWeight:300,fontSize:14,color:A.ink,outline:'none',caretColor:A.brass,marginBottom:16}}/></>)}
    {existing?(<div style={{display:'flex',gap:8}}><button type="button" onClick={onClose} style={{flex:1,padding:'12px 0',background:'transparent',border:'0.5px solid var(--atelier-sheet-border)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Cancel</button><button type="button" onClick={()=>{onUnblock(dateIso);onToast('Date unblocked','success');onClose();}} style={{flex:1,padding:'12px 0',background:'transparent',border:`0.5px solid ${A.terracotta}`,borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.terracotta,letterSpacing:'0.32em',textTransform:'uppercase'}}>Unblock</button></div>
    ):(<button type="button" onClick={()=>{onBlock(dateIso,note);onToast('Date blocked','success');onClose();setNote('');}} className="atelier-fab" style={{width:'100%',padding:'14px 0',borderRadius:2,border:'0.5px solid var(--atelier-label)',cursor:'pointer',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#1A120E',letterSpacing:'0.42em',textTransform:'uppercase'}}>Block Date</button>)}
  </div></>);
}

export default function DemoCalendarPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName}=useDemoContext(handle);const{toast,show:showToast}=useToast();
  const today=useMemo(()=>new Date(),[]);
  const[year,setYear]=useState(today.getFullYear());const[month,setMonth]=useState(today.getMonth());
  const[sel,setSel]=useState<string|null>(null);const[hotOn,setHotOn]=useState(true);
  const[blocks,setBlocks]=useState<Block[]>(DEMO_BLOCKS_INIT);const[blockSel,setBlockSel]=useState<string|null>(null);
  const{data:rawEvents}=useDemoEventsData();

  // Merge events with demo-only entries so calendar has visible dots
  const EXTRA_EVENTS:VendorEvent[]=[
    {id:'de1',title:'Priya Sharma Wedding',event_date:'2026-06-28',event_time:'10:00:00',kind:'wedding',state:'upcoming',notes:null,lead_id:null},
    {id:'de2',title:'Riya & Dev Engagement',event_date:'2026-07-12',event_time:'11:00:00',kind:'engagement',state:'upcoming',notes:null,lead_id:null},
    {id:'de3',title:'Ananya Pre-Wedding',event_date:iso(today.getFullYear(),today.getMonth(),today.getDate()+3),event_time:'09:00:00',kind:'pre_wedding',state:'upcoming',notes:null,lead_id:null},
  ];
  const events=useMemo(()=>[...(rawEvents??[]),...EXTRA_EVENTS],[rawEvents]);
  const byDate=useMemo(()=>{const m=new Map<string,VendorEvent[]>();for(const ev of events){const l=m.get(ev.event_date)??[];l.push(ev);m.set(ev.event_date,l);}return m;},[events]);
  const todayIso=iso(today.getFullYear(),today.getMonth(),today.getDate());
  const blockMap=useMemo(()=>{const m=new Map<string,Block>();for(const b of blocks)m.set(b.blocked_date,b);return m;},[blocks]);
  const nextThree=useMemo(()=>(events??[]).filter(e=>e.event_date>=todayIso&&e.state==='upcoming').sort((a,b)=>a.event_date<b.event_date?-1:1).slice(0,3),[events,todayIso]);
  const hotThisMonth=useMemo(()=>{const prefix=`${year}-${String(month+1).padStart(2,'0')}`;return[...DEMO_HOT_DATES].filter(d=>d.startsWith(prefix)).length;},[year,month]);

  const firstDow=new Date(year,month,1).getDay();const daysInMonth=new Date(year,month+1,0).getDate();const prevDays=new Date(year,month,0).getDate();
  const selEvents=sel?(byDate.get(sel)??[]):[];

  function onAdd(){const primer=sel?`What would you like me to add for ${fmtShort(sel)}?`:`What would you like me to add to the calendar?`;router.push(`/demo/vendor/${handle}/studio`);}
  function handleCancelEvent(eventId:string){showToast('Event cancellation available after signup','success');setSel(null);}

  return(<div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0,overflow:'hidden',position:'relative'}}>
    <Toast toast={toast}/>
    <DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden',paddingBottom:110}}>
      {/* Month header */}
      <div style={{position:'relative',textAlign:'center',padding:'20px 22px 12px'}}>
        <button type="button" onClick={()=>month===0?(setYear(y=>y-1),setMonth(11)):setMonth(m=>m-1)} aria-label="Previous month" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-30%)',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'var(--atelier-label)',fontFamily:F.display,fontSize:26,lineHeight:1}}>‹</button>
        <div style={{fontFamily:F.label,fontWeight:200,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:'var(--atelier-label)',marginBottom:6}}>Anno · {year}</div>
        <div style={{fontFamily:F.display,fontWeight:400,fontSize:46,color:'var(--atelier-ink)',lineHeight:1,letterSpacing:'0.02em'}}>{MONTHS[month]}</div>
        <button type="button" onClick={()=>month===11?(setYear(y=>y+1),setMonth(0)):setMonth(m=>m+1)} aria-label="Next month" style={{position:'absolute',right:14,top:'50%',transform:'translateY(-30%)',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'var(--atelier-label)',fontFamily:F.display,fontSize:26,lineHeight:1}}>›</button>
      </div>
      {/* Hot dates toggle */}
      <div style={{padding:'0 22px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <div style={{width:34,height:'0.5px',background:A.brass,opacity:0.9}}/>
        <button type="button" onClick={()=>setHotOn(h=>!h)} style={{display:'flex',alignItems:'center',gap:7,background:'none',border:`0.5px solid ${hotOn?'rgba(201,168,76,0.4)':'rgba(201,168,76,0.18)'}`,borderRadius:999,padding:'5px 11px',cursor:'pointer'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:hotOn?A.terracotta:'rgba(240,230,210,0.2)',boxShadow:hotOn?'0 0 6px rgba(224,123,92,0.6)':'none'}}/>
          <span style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.32em',textTransform:'uppercase',color:hotOn?A.brassWarm:A.inkMute}}>Hot Dates</span>
        </button>
      </div>
      {/* Hot dates ribbon */}
      {hotOn&&hotThisMonth>0&&(<div className="atelier-hot-ribbon" style={{margin:'0 18px 14px',padding:'10px 14px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:6,height:6,borderRadius:'50%',background:A.terracotta,boxShadow:'0 0 8px rgba(224,123,92,0.6)',flexShrink:0}}/>
        <div style={{flex:1,fontFamily:F.script,fontStyle:'italic',fontSize:13,fontWeight:400,color:'var(--atelier-ink-soft)',letterSpacing:'0.01em'}}>{hotThisMonth===1?'One auspicious date this month — peak season approaches':`${hotThisMonth} auspicious dates this month — peak season approaches`}</div>
        <div style={{fontFamily:F.display,fontSize:18,color:A.brassWarm}}>{hotThisMonth}</div>
      </div>)}
      {/* Weekday labels */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',padding:'0 18px 8px',borderBottom:'0.5px solid var(--atelier-card-border)'}}>{DAYS.map((d,i)=>(<div key={i} style={{textAlign:'center',padding:'2px 0',fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.32em',textTransform:'uppercase',color:'var(--atelier-label)'}}>{d}</div>))}</div>
      {/* Calendar grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',padding:'6px 18px 12px'}}>
        {Array.from({length:firstDow}).map((_,i)=>(<div key={`p${i}`} style={{display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:16,color:'rgba(240,230,210,0.18)'}}>{prevDays-firstDow+i+1}</div>))}
        {Array.from({length:daysInMonth}).map((_,i)=>{
          const d=i+1;const dateIso=iso(year,month,d);const isToday=dateIso===todayIso;const isSel=dateIso===sel;const evCount=(byDate.get(dateIso)??[]).length;const isHot=DEMO_HOT_DATES.has(dateIso)&&hotOn;const isBlocked=blockMap.has(dateIso);
          return(<button key={d} type="button" onClick={()=>{if(isBlocked||(!byDate.has(dateIso)&&!isSel)){setSel(null);setBlockSel(prev=>prev===dateIso?null:dateIso);}else{setBlockSel(null);setSel(prev=>prev===dateIso?null:dateIso);}}} style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',aspectRatio:'1',background:'none',border:'none',cursor:'pointer',fontFamily:F.display,fontWeight:400,fontSize:22,color:isToday?'#1A120E':(isSel?'#1A120E':A.ink),opacity:isBlocked?0.45:1}}>
            {isToday&&<span className="atelier-today-coin" style={{position:'absolute',inset:'20%',borderRadius:'50%',zIndex:0}}/>}
            {isSel&&!isToday&&<span style={{position:'absolute',inset:'18%',borderRadius:'50%',background:'rgba(245,235,212,0.92)',zIndex:0}}/>}
            {isBlocked&&<span style={{position:'absolute',inset:'14%',borderRadius:'50%',background:'rgba(201,168,76,0.10)',border:'0.5px dashed rgba(201,168,76,0.35)',zIndex:0}}/>}
            <span style={{position:'relative',zIndex:1}}>{d}</span>
            {evCount>0&&!isToday&&!isSel&&<span style={{position:'absolute',bottom:'14%',left:'50%',transform:'translateX(-50%)',width:4,height:4,borderRadius:'50%',background:A.brass,zIndex:1}}/>}
            {isHot&&!isToday&&!isSel&&<span style={{position:'absolute',top:'14%',right:'22%',width:4,height:4,borderRadius:'50%',background:A.terracotta,boxShadow:'0 0 4px rgba(224,123,92,0.5)',zIndex:1}}/>}
          </button>);
        })}
      </div>
      {/* Next Engagements */}
      <div style={{padding:'0 22px 12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 0 12px'}}>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:A.brass}}>Next Engagements</div>
          <div style={{flex:1,height:'0.5px',background:'var(--atelier-ink-dim)'}}/>
          {nextThree.length>0&&<div style={{fontFamily:F.display,fontSize:18,color:A.brassWarm}}>{nextThree.length}</div>}
        </div>
        {nextThree.length===0?(<div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:15,color:A.inkMute,padding:'4px 0 8px'}}>Nothing on the horizon.</div>
        ):(<div style={{display:'flex',flexDirection:'column'}}>{nextThree.map((ev,idx)=>{const{day,month:mm}=splitDay(ev.event_date);return(<div key={ev.id} style={{display:'flex',alignItems:'center',gap:18,padding:'14px 0',borderBottom:idx<nextThree.length-1?'0.5px solid rgba(201,168,76,0.12)':'none'}}>
          <div style={{flexShrink:0,width:56,textAlign:'center'}}>
            <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.36em',textTransform:'uppercase',color:'var(--atelier-label)',marginBottom:4}}>{mm}</div>
            <div style={{fontFamily:F.display,fontWeight:400,fontSize:44,color:'var(--atelier-ink)',lineHeight:0.95,letterSpacing:'-0.01em'}}>{day}</div>
          </div>
          <div style={{flex:1,minWidth:0,paddingLeft:18,borderLeft:'0.5px solid var(--atelier-card-border)'}}>
            <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.34em',textTransform:'uppercase',color:'var(--atelier-label)',marginBottom:5}}>{ev.kind}{ev.event_time?` · ${ev.event_time.slice(0,5)}`:''}</div>
            <div style={{fontFamily:F.display,fontWeight:400,fontSize:19,color:'var(--atelier-ink)',lineHeight:1.2,letterSpacing:'0.005em'}}>{ev.title}</div>
          </div>
        </div>);})}</div>)}
      </div>
    </div>
    {/* FAB */}
    <button type="button" onClick={onAdd} aria-label="Add event" className="atelier-fab" style={{position:'fixed',bottom:'calc(82px + env(safe-area-inset-bottom))',right:20,zIndex:30,width:46,height:46,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.body,fontSize:22,fontWeight:400,lineHeight:1,cursor:'pointer',border:'0.5px solid var(--atelier-label)'}}>+</button>
    {/* Date popup */}
    {sel&&(<><div onClick={()=>setSel(null)} style={{position:'fixed',inset:0,zIndex:30,backgroundColor:'var(--atelier-overlay)'}}/><div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:40,background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',boxShadow:'0 -4px 24px rgba(0,0,0,0.12)',borderTopLeftRadius:4,borderTopRightRadius:4,borderTop:`0.5px solid ${A.brassLine}`,padding:'16px 24px calc(24px + env(safe-area-inset-bottom))'}}>
      <div style={{display:'flex',justifyContent:'center',marginBottom:14}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass}}>{fmtShort(sel)}</div>
          {DEMO_HOT_DATES.has(sel)&&hotOn&&(<span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:5,height:5,borderRadius:'50%',background:A.terracotta}}/><span style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.32em',textTransform:'uppercase',color:A.terracotta}}>Hot Date</span></span>)}
        </div>
        <button type="button" onClick={onAdd} className="atelier-fab" style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.body,fontSize:18,lineHeight:1,fontWeight:400,cursor:'pointer',border:'0.5px solid var(--atelier-label)'}}>+</button>
      </div>
      {selEvents.length===0?(<div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:18,color:A.inkMute}}>Nothing scheduled.</div>
      ):(<div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)'}}>{selEvents.length} {selEvents.length>1?'engagements':'engagement'}</div>
        {selEvents.map(ev=>(<div key={ev.id} className="atelier-card" style={{padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.32em',textTransform:'uppercase',color:'var(--atelier-label)',marginBottom:3}}>{ev.kind}{ev.event_time?` · ${ev.event_time.slice(0,5)}`:''}</div>
            <div style={{fontFamily:F.script,fontWeight:500,fontSize:17,color:A.ink,letterSpacing:'0.005em'}}>{ev.title}</div>
          </div>
          <div style={{display:'flex',gap:6}}>
            <button type="button" onClick={()=>{setSel(null);router.push(`/demo/vendor/${handle}/studio`);}} style={{background:'none',border:`0.5px solid rgba(201,168,76,0.28)`,borderRadius:999,padding:'5px 10px',cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.28em',textTransform:'uppercase',color:A.brassWarm}}>Edit</button>
            <button type="button" onClick={()=>handleCancelEvent(ev.id)} style={{background:'none',border:'0.5px solid rgba(224,123,92,0.4)',borderRadius:999,padding:'5px 10px',cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.28em',textTransform:'uppercase',color:A.terracotta}}>Cancel</button>
          </div>
        </div>))}
      </div>)}
    </div></>)}
    {/* Block sheet */}
    <BlockSheet open={!!blockSel} dateIso={blockSel} existing={blockSel?blockMap.get(blockSel)??null:null} onClose={()=>setBlockSel(null)} onToast={showToast} onBlock={(date,note)=>setBlocks(prev=>[...prev,{blocked_date:date,note}])} onUnblock={(date)=>setBlocks(prev=>prev.filter(b=>b.blocked_date!==date))}/>
  </div>);
}
