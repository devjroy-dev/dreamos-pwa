'use client';
export const dynamic = 'force-dynamic';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { useDemoLeadsData } from '@/hooks/demo/useDemoVendorData';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',red:'#E07B5C',green:'#7FBE85'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
function fmtDate(iso:string|null){if(!iso)return'—';try{return new Date(iso).toLocaleDateString('en-IN',{month:'short',year:'numeric'});}catch{return iso;}}
function stateLabel(s:string):{text:string;color:string}{switch(s){case'booked':return{text:'Booked',color:A.brassWarm};case'quoted':return{text:'Quoted',color:'#9DBCC8'};case'contacted':return{text:'Contacted',color:A.inkMute};case'lost':return{text:'Lost',color:A.red};default:return{text:'New',color:A.green};}}
export default function DemoDiscoverLeadsPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName}=useDemoContext(handle);const{data:leads,loading}=useDemoLeadsData(handle);
  const tdwLeads=leads??[];const enquiries=tdwLeads.length;const actioned=tdwLeads.filter(l=>l.state!=='new').length;
  const cutoff=new Date(Date.now()-30*24*60*60*1000).toISOString();const recent=tdwLeads.filter(l=>l.created_at>=cutoff);
  const bookedRecent=recent.filter(l=>l.state==='booked').length;
  function insightText(){if(recent.length===0)return'No TDW enquiries in the last thirty days yet.';if(bookedRecent>0)return`${recent.length} enquir${recent.length===1?'y':'ies'} from TDW in thirty days. ${bookedRecent} booked.`;return`${recent.length} enquir${recent.length===1?'y':'ies'} from TDW in the last thirty days.`;}
  return(<div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
    <DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{padding:'12px 22px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
      <button type="button" onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:A.brassWarm,fontFamily:F.display,fontSize:22,lineHeight:1}}>‹</button>
      <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,flex:1}}>TDW Returns</span>
    </div>
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden',paddingBottom:32}}>
      <div style={{padding:'20px 22px 0'}}>
        <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:A.brass,marginBottom:8}}>Discover · Returns</div>
        <div style={{fontFamily:F.display,fontWeight:400,fontSize:30,color:'var(--atelier-ink)',lineHeight:1.1,marginBottom:16}}>What TDW<br/>has brought you.</div>
        <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:15,color:A.inkSoft,lineHeight:1.55,marginBottom:20}}>{insightText()}</div>
        <div style={{display:'flex',alignItems:'stretch',padding:'18px 8px 14px',borderTop:'0.5px solid var(--atelier-card-border)',borderBottom:'0.5px solid var(--atelier-card-border)',marginBottom:24}}>
          {[{big:String(enquiries),label:'Enquiries',sub:'from TDW',accent:enquiries>0},{big:String(actioned),label:'Actioned',sub:'replied or quoted',accent:actioned>0,divider:true},{big:'—',label:'Saves',sub:'from discover',accent:false,divider:true}].map((cell,i)=>(<div key={i} style={{flex:1,textAlign:'center',padding:'0 4px',position:'relative'}}>
            {cell.divider&&<span aria-hidden style={{position:'absolute',left:0,top:'12%',bottom:'12%',width:'0.5px',background:'rgba(201,168,76,0.22)'}}/>}
            <div style={{fontFamily:F.display,fontWeight:400,fontSize:32,lineHeight:1,color:cell.accent?'var(--atelier-ink)':'var(--atelier-ink-dim)',letterSpacing:'-0.01em'}}>{cell.big}</div>
            <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,letterSpacing:'0.34em',textTransform:'uppercase',color:'rgba(201,168,76,0.75)',marginTop:6}}>{cell.label}</div>
            <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:10,color:'var(--atelier-ink-dim)',marginTop:2}}>{cell.sub}</div>
          </div>))}
        </div>
      </div>
      {loading?<div style={{padding:'40px 22px',textAlign:'center',fontFamily:F.script,fontStyle:'italic',fontSize:15,color:A.inkMute}}>Loading…</div>:tdwLeads.length===0?<div style={{padding:'40px 22px',textAlign:'center'}}><div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.2,marginBottom:8}}>No enquiries yet.</div><div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:14,color:A.inkMute,lineHeight:1.55}}>Leads from your Discover profile appear here.</div></div>:(
        <div style={{padding:'0 22px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}><span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:A.brass}}>All Enquiries</span><span style={{flex:1,height:'0.5px',background:'var(--atelier-ink-dim)'}}/><span style={{fontFamily:F.display,fontSize:18,color:A.brassWarm}}>{tdwLeads.length}</span></div>
          {tdwLeads.map(lead=>{const sl=stateLabel(lead.state);return(<div key={lead.id} style={{display:'flex',alignItems:'center',padding:'14px 0',borderBottom:'0.5px solid var(--atelier-card-border)',gap:12}}>
            <div style={{flex:1,minWidth:0}}><div style={{fontFamily:F.display,fontWeight:400,fontSize:20,color:'var(--atelier-ink)',lineHeight:1.15,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.name??'Unnamed'}</div><div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:13,color:A.inkMute,marginTop:3}}>{[lead.wedding_city,fmtDate(lead.wedding_date)].filter(Boolean).join(' · ')}</div></div>
            <span style={{fontFamily:F.label,fontWeight:400,fontSize:8,color:sl.color,letterSpacing:'0.28em',textTransform:'uppercase',border:`0.5px solid ${sl.color}`,borderRadius:2,padding:'4px 9px',flexShrink:0}}>{sl.text}</span>
          </div>);})}
        </div>
      )}
    </div>
  </div>);
}
