'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { selectStyle } from '@/lib/vendor/controls';
import { useParams } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { formatRs } from '@/lib/vendor/format'; // TDW_09 R-U25: the one money home

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',brassLine:'rgba(201,168,76,0.18)',green:'var(--role-positive)',red:'var(--role-critical)'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
const EASE='cubic-bezier(0.22,1,0.36,1)';
const REQUIREMENT_TYPES=['photography','videography','makeup','mehendi','decor','catering','venue','music_dj','music_live','choreography','planning','transport','invitations','jewellery','attire','other'];
const EVENT_TYPES=['wedding','pre_wedding','engagement','editorial','brand_shoot','portrait','other'];
const PAYMENT_PERIODS=['per_day','per_shoot','total','tbd'];
const CITIES=['Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Kolkata','Jaipur','Pune','Udaipur','Goa','Other'];
const inputStyle:React.CSSProperties={width:'100%',padding:'12px 14px',boxSizing:'border-box' as const,background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:2,color:A.ink,fontFamily:'var(--font-dm-sans),system-ui,sans-serif',fontSize:14,fontWeight:300,outline:'none',caretColor:A.brass};
type Tab='opportunities'|'my_posts';
interface Post{id:string;requirement_type:string;event_date:string;city:string;budget_inr?:number;payment_period?:string;details?:string;poster_category:string;state:string;interested_count:number;}
const DEMO_FEED:Post[]=[
  {id:'p1',requirement_type:'videography',event_date:'2026-10-15',city:'Delhi NCR',budget_inr:50000,payment_period:'per_shoot',details:'Looking for a wedding videographer for palace wedding in Delhi. Full day shoot.',poster_category:'photography',state:'open',interested_count:3},
  {id:'p2',requirement_type:'mehendi',event_date:'2026-09-20',city:'Mumbai',budget_inr:15000,payment_period:'total',details:'Need an experienced mehendi artist for an intimate wedding.',poster_category:'makeup',state:'open',interested_count:1},
];
function fmtBudget(amount?:number,period?:string){if(!amount)return'Budget TBD';const f=formatRs(amount);/* TDW_09 R-U28: the demo mirror follows its live twin */if(period==='per_day')return`${f}/day`;if(period==='per_shoot')return`${f}/shoot`;return f;}
function fmtType(t:string){return t.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
function fmtDate(iso:string){try{return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});}catch{return iso;}}
function Label({children}:{children:React.ReactNode}){return<div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.42em',textTransform:'uppercase',color:A.inkMute,marginBottom:10}}>{children}</div>;}
function Pill({children,active,onClick}:{children:string;active:boolean;onClick:()=>void}){return<button type="button" onClick={onClick} style={{padding:'7px 13px',borderRadius:2,cursor:'pointer',background:active?'rgba(201,168,76,0.18)':'transparent',border:`0.5px solid ${active?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.22)'}`,fontFamily:F.label,fontWeight:300,fontSize:9,color:active?A.brassWarm:A.inkMute,letterSpacing:'0.28em',textTransform:'uppercase',transition:`all 180ms ${EASE}`,WebkitTapHighlightColor:'transparent'}}>{children}</button>;}
export default function DemoCollabPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const{vendorName}=useDemoContext(handle);
  const[tab,setTab]=useState<Tab>('opportunities');const[feed,setFeed]=useState<Post[]>(DEMO_FEED);const[myPosts,setMyPosts]=useState<Post[]>([]);const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({requirement_type:'',event_date:'',city:'',budget_inr:'',payment_period:'per_shoot',event_type:'',details:'',open_to_other_cities:false});
  function set<K extends keyof typeof form>(key:K,value:typeof form[K]){setForm(f=>({...f,[key]:value}));}
  function respond(postId:string,action:'interested'|'passed'){setFeed(prev=>prev.filter(p=>p.id!==postId));}
  function handleSubmit(){if(!form.requirement_type||!form.event_date||!form.city)return;const p:Post={id:`p${Date.now()}`,requirement_type:form.requirement_type,event_date:form.event_date,city:form.city,budget_inr:form.budget_inr?parseInt(form.budget_inr):undefined,payment_period:form.payment_period,details:form.details,poster_category:'makeup',state:'open',interested_count:0};setMyPosts(prev=>[p,...prev]);setShowForm(false);setTab('my_posts');setForm({requirement_type:'',event_date:'',city:'',budget_inr:'',payment_period:'per_shoot',event_type:'',details:'',open_to_other_cities:false});}
  return(<div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
    <DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{padding:'20px 22px 10px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:14}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:A.brass,marginBottom:8}}>Discover · Collab</div><div style={{fontFamily:F.display,fontWeight:400,fontSize:30,color:'var(--atelier-ink)',lineHeight:1.1}}>Your industry,<br/>your people.</div></div>
        <button type="button" onClick={()=>setShowForm(true)} className="atelier-fab" style={{padding:'8px 14px',borderRadius:2,cursor:'pointer',border:'0.5px solid var(--atelier-label)',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.32em',textTransform:'uppercase',flexShrink:0,marginTop:8}}>+ Post</button>
      </div>
    </div>
    <div style={{display:'flex',padding:'0 22px',marginBottom:4}}>{(['opportunities','my_posts'] as Tab[]).map(t=>(<button key={t} type="button" onClick={()=>setTab(t)} style={{flex:1,padding:'12px 0',background:'none',border:'none',cursor:'pointer',fontFamily:F.label,fontWeight:tab===t?400:300,fontSize:9,color:tab===t?A.brassWarm:A.inkMute,letterSpacing:'0.42em',textTransform:'uppercase',borderBottom:tab===t?`0.5px solid ${A.brass}`:'0.5px solid rgba(201,168,76,0.10)',transition:`all 200ms ${EASE}`}}>{t==='opportunities'?'Opportunities':'My Posts'}</button>))}</div>
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'18px 22px 100px'}}>
      {tab==='opportunities'?(feed.length===0?(<div style={{padding:'60px 32px',textAlign:'center'}}><div style={{fontFamily:F.display,fontSize:28,color:'var(--atelier-accent-text)',marginBottom:16}}>✦</div><div style={{fontFamily:F.display,fontWeight:400,fontSize:24,color:'var(--atelier-ink)',lineHeight:1.2,marginBottom:8}}>Quiet for now.</div><div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:14,color:A.inkMute,lineHeight:1.55}}>No collab opportunities today.<br/>Post your own to put it out there.</div></div>):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>{feed.map(post=>(<div key={post.id} className="atelier-card" style={{padding:'18px 20px'}}>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,marginBottom:6}}>Requirement</div>
          <div style={{fontFamily:F.display,fontWeight:400,fontSize:24,color:'var(--atelier-ink)',lineHeight:1.15,marginBottom:6}}>{fmtType(post.requirement_type)} needed</div>
          <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:14,color:A.inkSoft,marginBottom:12,lineHeight:1.4}}>{post.city} · {fmtDate(post.event_date)} · {fmtBudget(post.budget_inr,post.payment_period)}</div>
          {post.details&&<div style={{fontFamily:F.script,fontWeight:400,fontSize:14,color:A.ink,lineHeight:1.6,marginBottom:14}}>{post.details}</div>}
          <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:12,color:A.inkMute,marginBottom:16}}>Posted by a {post.poster_category}</div>
          <div style={{display:'flex',gap:8}}>
            <button type="button" onClick={()=>respond(post.id,'interested')} className="atelier-fab" style={{flex:2,padding:'11px 0',borderRadius:2,border:'0.5px solid var(--atelier-label)',cursor:'pointer',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#1A120E',letterSpacing:'0.32em',textTransform:'uppercase'}}>Interested</button>
            <button type="button" onClick={()=>respond(post.id,'passed')} style={{flex:1,padding:'11px 0',background:'transparent',border:'0.5px solid var(--atelier-sheet-border)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:10,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Pass</button>
          </div>
        </div>))}</div>
      )):(myPosts.length===0?(<div style={{padding:'60px 32px',textAlign:'center'}}><div style={{fontFamily:F.display,fontWeight:400,fontSize:24,color:'var(--atelier-ink)',lineHeight:1.2,marginBottom:8}}>Nothing posted yet.</div><div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:14,color:A.inkMute,lineHeight:1.55}}>Tap <span style={{color:A.brassWarm}}>+ Post</span> to find your collaborator.</div></div>):(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>{myPosts.map(post=>(<div key={post.id} className="atelier-card" style={{padding:'18px 20px'}}>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,marginBottom:6}}>My Post</div>
          <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.15}}>{fmtType(post.requirement_type)} needed</div>
          <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:13,color:A.inkSoft,marginTop:6}}>{post.city} · {fmtDate(post.event_date)} · {fmtBudget(post.budget_inr,post.payment_period)}</div>
        </div>))}
        </div>
      ))}
    </div>
    {showForm&&(<div style={{position:'fixed',inset:0,zIndex:100,background:'var(--atelier-overlay)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',display:'flex',alignItems:'flex-end'}}><div style={{width:'100%',maxHeight:'92dvh',overflowY:'auto',background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:'0.5px solid var(--atelier-sheet-border)',padding:'0 0 calc(32px + env(safe-area-inset-bottom))'}}>
      <div style={{display:'flex',justifyContent:'center',padding:'12px 0 8px'}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
      <div style={{padding:'0 24px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
        <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,marginBottom:6}}>New Requirement</div><div style={{fontFamily:F.display,fontWeight:400,fontSize:26,color:'var(--atelier-ink)',lineHeight:1.15}}>Post a requirement</div></div>
        <button type="button" onClick={()=>setShowForm(false)} style={{background:'none',border:'none',color:A.brassWarm,fontFamily:F.display,fontSize:24,lineHeight:1,cursor:'pointer',padding:4,flexShrink:0}}>×</button>
      </div>
      <div style={{padding:'0 24px'}}>
        <Label>What do you need?</Label>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:22}}>{REQUIREMENT_TYPES.map(type=><span key={type}><Pill active={form.requirement_type===type} onClick={()=>set('requirement_type',type)}>{type.replace(/_/g,' ')}</Pill></span>)}</div>
        <Label>Date needed</Label>
        <input type="date" value={form.event_date} onChange={e=>set('event_date',e.target.value)} style={{...inputStyle,marginBottom:22}}/>
        <Label>City</Label>
        <select value={form.city} onChange={e=>set('city',e.target.value)} style={{...selectStyle(inputStyle),marginBottom:10}}><option value="">Select city</option>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
        <label style={{display:'flex',alignItems:'center',gap:10,marginBottom:22,cursor:'pointer'}}><input type="checkbox" checked={form.open_to_other_cities} onChange={e=>set('open_to_other_cities',e.target.checked)} style={{accentColor:A.brass,width:16,height:16}}/><span style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:13,color:A.inkSoft}}>Also open to vendors who travel</span></label>
        <Label>Budget offered (optional)</Label>
        <div style={{display:'flex',gap:8,marginBottom:22}}><input type="number" placeholder="Rs" value={form.budget_inr} onChange={e=>set('budget_inr',e.target.value)} style={{...inputStyle,flex:2}}/><select value={form.payment_period} onChange={e=>set('payment_period',e.target.value)} style={{...selectStyle(inputStyle),flex:1}}>{PAYMENT_PERIODS.map(p=><option key={p} value={p}>{p.replace('_',' ')}</option>)}</select></div>
        <Label>Details (optional)</Label>
        <textarea value={form.details} onChange={e=>set('details',e.target.value.slice(0,200))} placeholder="Describe what you're looking for…" rows={3} style={{...inputStyle,resize:'none' as const,marginBottom:22}}/>
        {(!form.requirement_type||!form.event_date||!form.city)&&<div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:13,color:A.red,marginBottom:14}}>Please fill in what you need, the date, and the city.</div>}
        <button type="button" onClick={handleSubmit} disabled={!form.requirement_type||!form.event_date||!form.city} className="atelier-fab" style={{width:'100%',padding:'14px 0',borderRadius:2,border:'0.5px solid var(--atelier-label)',cursor:(!form.requirement_type||!form.event_date||!form.city)?'default':'pointer',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#1A120E',letterSpacing:'0.5em',textTransform:'uppercase',opacity:(!form.requirement_type||!form.event_date||!form.city)?0.6:1}}>Post Requirement</button>
      </div>
    </div></div>)}
  </div>);
}
