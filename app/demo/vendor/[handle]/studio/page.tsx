'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
import { PeekNav } from '@/components/vendor/PeekNav';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoChat } from '@/hooks/demo/useDemoChat';
import { useDemoLeadsData, useDemoEventsData } from '@/hooks/demo/useDemoVendorData';
import { useT } from '@/lib/vendor/ThemeContext';

const A={brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',brassSoft:'rgba(201,168,76,0.28)'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
function spell(n:number){const w=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'];return n>=0&&n<=10?w[n]:String(n);}
function timeOfDayGreeting(){const h=new Date().getHours();if(h<5)return'Good Evening';if(h<12)return'Good Morning';if(h<17)return'Good Afternoon';return'Good Evening';}
function fmtEventDate(iso:string){try{const d=new Date(iso);const today=new Date();const diff=Math.round((d.getTime()-today.setHours(0,0,0,0))/86400000);if(diff===0)return'today';if(diff===1)return'tomorrow';if(diff<=6)return d.toLocaleDateString('en-IN',{weekday:'long'}).toLowerCase();return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});}catch{return iso;}}

function GreetingLine({vendorName,newLeads,nextDate}:{vendorName:string|null;newLeads:number;nextDate:string|null}){
  const T=useT();const greeting=timeOfDayGreeting();const tod=greeting.toLowerCase().includes('evening')?'evening':greeting.toLowerCase().includes('afternoon')?'afternoon':'morning';
  let line='';
  if(newLeads===0)line='A quiet day. Everything in order.';
  else line=newLeads===1?`One letter awaits you this ${tod}.`:`${spell(newLeads)} letters await you this ${tod}.`;
  return(<div style={{textAlign:'center',padding:'16px 24px 4px'}}>
    <div style={{fontFamily:F.label,fontWeight:200,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:T.isLight?T.inkMute:'rgba(201,168,76,0.7)',marginBottom:10}}>{greeting}</div>
    <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:19,color:T.inkSoft,lineHeight:1.4,letterSpacing:'0.01em',maxWidth:320,margin:'0 auto'}}>{line}</div>
  </div>);
}
function Ledger({newLeads,nextEvent}:{newLeads:number;nextEvent:{title:string;event_date:string}|null}){
  const T=useT();const brass='rgba(201,168,76,0.18)';
  const cells=[
    {big:String(newLeads),bigSize:32,label:'Letters',sub:newLeads===0?'all replied':'awaiting reply',accent:newLeads>0},
    {big:'—',bigSize:32,label:'Owed',sub:'nothing pending',accent:false,divider:true},
    {big:nextEvent?fmtEventDate(nextEvent.event_date):'—',bigSize:nextEvent?18:32,bigFamily:nextEvent?F.script:undefined,bigItalic:!!nextEvent,label:'Next',sub:nextEvent?nextEvent.title:'no engagements',accent:!!nextEvent,divider:true},
  ];
  return(<div style={{display:'flex',alignItems:'stretch',padding:'14px 8px 12px',margin:'10px 22px 0',borderTop:`0.5px solid ${T.isLight?'rgba(122,56,40,0.22)':brass}`,borderBottom:`0.5px solid ${T.isLight?'rgba(122,56,40,0.22)':brass}`,position:'relative'}}>
    <div style={{position:'absolute',top:-7,left:'50%',transform:'translateX(-50%)',background:`linear-gradient(180deg,${T.pageBg} 0%,${T.pageBg} 60%,transparent 100%)`,padding:'0 14px',height:14,display:'flex',alignItems:'center',color:T.isLight?T.accent:A.brass,fontSize:9,letterSpacing:'0.3em'}}>◆</div>
    {cells.map((c,i)=>(<div key={i} style={{flex:1,textAlign:'center',padding:'0 4px',position:'relative'}}>
      {c.divider&&<span aria-hidden style={{position:'absolute',left:0,top:'12%',bottom:'12%',width:'0.5px',background:T.isLight?'rgba(122,56,40,0.18)':'rgba(201,168,76,0.22)'}}/>}
      <div style={{fontFamily:c.bigFamily??F.display,fontWeight:400,fontStyle:c.bigItalic?'italic':'normal',fontSize:c.bigSize,lineHeight:1,color:c.accent?'var(--atelier-ink)':'var(--atelier-ink-dim)',letterSpacing:'-0.01em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.big}</div>
      <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.34em',textTransform:'uppercase',color:T.isLight?T.inkMute:'rgba(201,168,76,0.75)',marginTop:6}}>{c.label}</div>
      <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:10,color:T.inkDim,marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.sub}</div>
    </div>))}
  </div>);
}
function EnquiryCard({leads,onInject}:{leads:{name:string|null;wedding_date:string|null}[];onInject:(t:string)=>void}){
  const T=useT();const[dismissed,setDismissed]=useState(false);const[expanded,setExpanded]=useState(false);
  if(dismissed||leads.length===0)return null;
  const count=leads.length;const accentC=T.isLight?T.accent:A.brass;const borderC=T.isLight?'rgba(122,56,40,0.18)':'rgba(201,168,76,0.18)';
  return(<div style={{margin:'8px 22px 0',position:'relative'}}>
    <button type="button" onClick={()=>setExpanded(e=>!e)} style={{width:'100%',display:'flex',alignItems:'center',padding:'9px 14px',background:T.isLight?'rgba(122,56,40,0.05)':'rgba(201,168,76,0.06)',border:`0.5px solid ${borderC}`,borderRadius:expanded?'6px 6px 0 0':6,cursor:'pointer',textAlign:'left' as const}}>
      <span style={{width:6,height:6,borderRadius:'50%',flexShrink:0,background:accentC,marginRight:10,boxShadow:`0 0 6px ${accentC}88`}}/>
      <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.28em',textTransform:'uppercase' as const,color:accentC,flex:1}}>{count===1?'1 New Enquiry':`${count} New Enquiries`}</span>
      <span style={{fontFamily:F.label,fontSize:10,color:accentC,transform:expanded?'rotate(180deg)':'none',display:'inline-block'}}>▾</span>
      <span role="button" onClick={e=>{e.stopPropagation();setDismissed(true);}} style={{marginLeft:10,width:16,height:16,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:T.inkDim,fontSize:11,cursor:'pointer',flexShrink:0}}>×</span>
    </button>
    {expanded&&(<div style={{border:`0.5px solid ${borderC}`,borderTop:'none',borderRadius:'0 0 6px 6px',overflow:'hidden'}}>
      {leads.map((l,i)=>(<div key={i} style={{display:'flex',alignItems:'center',padding:'8px 14px',borderTop:i===0?'none':`0.5px solid ${T.isLight?'rgba(122,56,40,0.08)':'rgba(201,168,76,0.08)'}`,background:T.isLight?'rgba(122,56,40,0.02)':'rgba(201,168,76,0.03)'}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F.display,fontWeight:400,fontSize:16,color:'var(--atelier-ink)',lineHeight:1.1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.name??'Unnamed'}</div>
          {l.wedding_date&&<div style={{fontFamily:F.script,fontStyle:'italic',fontSize:10,color:'var(--atelier-ink-mute)',marginTop:1}}>{l.wedding_date}</div>}
        </div>
        <button type="button" onClick={()=>{onInject(`I'd like to reply to ${l.name??'this enquiry'}. Draft something warm but not pushy.`);setDismissed(true);}} style={{flexShrink:0,marginLeft:10,padding:'4px 10px',background:'none',border:`0.5px solid ${borderC}`,borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:400,fontSize:8,letterSpacing:'0.22em',textTransform:'uppercase' as const,color:T.isLight?T.ink:A.brassWarm}}>Reply →</button>
      </div>))}
    </div>)}
  </div>);
}

export default function DemoStudioPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const{vendor,loading,vendorName}=useDemoContext(handle);
  if(loading)return<div style={{flex:1}} aria-busy="true"/>;
  return<Suspense fallback={<div style={{flex:1}} aria-busy="true"/>}><ChatScreen handle={handle} vendorName={vendorName} category={vendor?.category??null} city={vendor?.city??null}/></Suspense>;
}
function ChatScreen({handle,vendorName,category,city}:{handle:string;vendorName:string|null;category:string|null;city:string|null}){
  const{messages,loading,send}=useDemoChat({handle});
  const{data:leads}=useDemoLeadsData(handle);const{data:events}=useDemoEventsData();
  const chatScrollRef=useRef<HTMLDivElement>(null);
  const today=new Date().toISOString().slice(0,10);
  const newLeads=(leads??[]).filter(l=>l.state==='new');
  const nextEvent=(events??[]).filter(e=>e.event_date>=today&&e.state==='upcoming').sort((a,b)=>a.event_date<b.event_date?-1:1)[0]??null;
  return(<div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0,position:'relative'}}>
    <DemoVendorHeader vendorName={vendorName} handle={handle} category={category} city={city}/>
    <GreetingLine vendorName={vendorName} newLeads={newLeads.length} nextDate={nextEvent?.event_date??null}/>
    <Ledger newLeads={newLeads.length} nextEvent={nextEvent}/>
    <EnquiryCard leads={newLeads.map(l=>({name:l.name,wedding_date:l.wedding_date}))} onInject={send}/>
    <ChatThread messages={messages} loading={loading} onConfirm={()=>{}} onCancel={()=>{}} onChipTap={send} scrollRef={chatScrollRef}/>
    <InputBar onSend={send} disabled={loading}/>
    <PeekNav scrollRef={chatScrollRef} context={null} onSend={send}/>
  </div>);
}
