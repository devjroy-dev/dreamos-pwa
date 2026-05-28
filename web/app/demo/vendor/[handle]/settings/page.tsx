'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { useDemoContext } from '@/hooks/demo/useDemoContext';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'#C9A84C',brassWarm:'var(--atelier-label)',red:'#E07B5C'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;

function SCard({title,children}:{title:string;children:React.ReactNode}){return(<div style={{marginBottom:22}}><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}><span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:A.brass}}>{title}</span><span style={{flex:1,height:'0.5px',background:'rgba(201,168,76,0.22)'}}/></div><div style={{display:'flex',flexDirection:'column',gap:12}}>{children}</div></div>);}
function SField({label,value,onChange,multiline,placeholder,inputMode}:{label:string;value:string;onChange:(v:string)=>void;multiline?:boolean;placeholder?:string;inputMode?:React.HTMLAttributes<HTMLInputElement>['inputMode']}){
  const base:React.CSSProperties={width:'100%',padding:'11px 14px',boxSizing:'border-box' as const,background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-card-border)',borderRadius:2,fontFamily:F.body,fontWeight:300,fontSize:14,color:A.ink,outline:'none',caretColor:A.brass,resize:'none' as const,colorScheme:'dark'};
  return(<div><label style={{display:'block',fontFamily:F.label,fontWeight:300,fontSize:8,color:A.inkMute,letterSpacing:'0.32em',textTransform:'uppercase',marginBottom:6}}>{label}</label>{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={2} style={base} placeholder={placeholder}/>:<input value={value} onChange={e=>onChange(e.target.value)} style={base} placeholder={placeholder} inputMode={inputMode}/>}</div>);
}
function SToggle({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void}){return(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontFamily:F.script,fontWeight:400,fontSize:15,color:A.ink,letterSpacing:'0.005em'}}>{label}</span><button type="button" onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:999,border:'0.5px solid var(--atelier-input-border)',cursor:'pointer',flexShrink:0,background:value?'linear-gradient(180deg,#D4B86A 0%,#B59548 100%)':'var(--atelier-input-bg)',position:'relative',transition:'background 200ms'}}><span style={{position:'absolute',top:2,left:value?22:2,width:18,height:18,borderRadius:'50%',background:value?'var(--atelier-ink)':'var(--atelier-ink-mute)',transition:'left 200ms',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/></button></div>);}
function SReadRow({label,value}:{label:string;value:string}){return(<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0'}}><span style={{fontFamily:F.label,fontWeight:300,fontSize:8,color:A.inkMute,letterSpacing:'0.32em',textTransform:'uppercase'}}>{label}</span><span style={{fontFamily:F.script,fontWeight:500,fontSize:14,color:A.ink,letterSpacing:'0.005em'}}>{value}</span></div>);}

export default function DemoSettingsPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName,vendor}=useDemoContext(handle);const{toast,show}=useToast();
  const[name,setName]=useState(vendorName??'');const[businessName,setBusinessName]=useState('');const[city,setCity]=useState(vendor?.city??'');
  const[styleNotes,setStyleNotes]=useState('');const[openToTravel,setOpenToTravel]=useState(false);const[travelNotes,setTravelNotes]=useState('');
  const[instagram,setInstagram]=useState(handle?`@${handle}`:'');const[upi,setUpi]=useState('');const[gstin,setGstin]=useState('');
  const[rateMin,setRateMin]=useState('');const[rateMax,setRateMax]=useState('');const[tags,setTags]=useState('');const[briefingEnabled,setBriefingEnabled]=useState(false);
  const saving=false;
  function save(){show('Settings saved — sign up to persist changes','success');}
  return(<div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
    <Toast toast={toast}/><DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{padding:'12px 22px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
      <button type="button" onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:A.brassWarm,fontFamily:F.display,fontSize:22,lineHeight:1}}>‹</button>
      <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass}}>Settings</span>
    </div>
    <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'8px 22px calc(40px + env(safe-area-inset-bottom))'}}>
      <SCard title="Business">
        <SField label="Your Name" value={name} onChange={setName} placeholder="Dev Roy"/>
        <SField label="Business name" value={businessName} onChange={setBusinessName}/>
        <SField label="City" value={city} onChange={setCity}/>
        <SField label="Style notes" value={styleNotes} onChange={setStyleNotes} multiline/>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Travel">
        <SToggle label="Open to travel" value={openToTravel} onChange={setOpenToTravel}/>
        <SField label="Travel notes" value={travelNotes} onChange={setTravelNotes} multiline/>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Contact">
        <SField label="Instagram handle" value={instagram} onChange={setInstagram} placeholder="@yourhandle"/>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Payments">
        <SField label="UPI ID" value={upi} onChange={setUpi} placeholder="name@bank"/>
        <SField label="GSTIN" value={gstin} onChange={setGstin} placeholder="22AAAAA0000A1Z5"/>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Rate Range">
        <div style={{display:'flex',gap:12}}><div style={{flex:1}}><SField label="Min (Rs)" value={rateMin} onChange={setRateMin} inputMode="numeric"/></div><div style={{flex:1}}><SField label="Max (Rs)" value={rateMax} onChange={setRateMax} inputMode="numeric"/></div></div>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Aesthetic Tags">
        <SField label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="moody, editorial, film"/>
        <div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:12,color:A.inkMute,marginTop:4}}>Used in Discover recommendations.</div>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Morning Briefing">
        <SToggle label="Enable WhatsApp briefing" value={briefingEnabled} onChange={setBriefingEnabled}/>
        <button type="button" onClick={save} className="atelier-fab" style={{alignSelf:'flex-end',padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.36em',textTransform:'uppercase'}}>Save</button>
      </SCard>
      <SCard title="Account">
        <SReadRow label="Tier" value="Signature"/>
        <SReadRow label="Status" value="Demo"/>
      </SCard>
      <button type="button" onClick={()=>router.push(`/demo/vendor/${handle}`)} style={{width:'100%',padding:'14px 0',marginTop:24,background:'transparent',border:'0.5px solid rgba(224,123,92,0.4)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:10,color:A.red,letterSpacing:'0.42em',textTransform:'uppercase'}}>Back to Demo</button>
    </div>
  </div>);
}
