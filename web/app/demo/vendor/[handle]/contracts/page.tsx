'use client';
export const dynamic = 'force-dynamic';
import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { useDemoContext } from '@/hooks/demo/useDemoContext';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'#C9A84C',brassWarm:'var(--atelier-label)',green:'#7FBE85',red:'#E07B5C'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
const STATE_COLOR:Record<string,string>={draft:A.inkMute,sent:A.brassWarm,signed:A.green,cancelled:A.red};
const inputStyle:React.CSSProperties={width:'100%',padding:'12px 14px',boxSizing:'border-box' as const,background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:2,fontFamily:F.body,fontWeight:300,fontSize:14,color:A.ink,outline:'none',caretColor:A.brass};
const labelStyle:React.CSSProperties={fontFamily:F.label,fontWeight:300,fontSize:8,color:A.inkMute,letterSpacing:'0.32em',textTransform:'uppercase' as const,marginBottom:6};

interface DemoContract{id:string;title:string;state:string;created_at:string;file_size?:number|null;sent_at?:string|null;signed_at?:string|null;notes?:string|null;}
const DEMO_CONTRACTS:DemoContract[]=[
  {id:'c1',title:'Booking Contract — Priya Sharma',state:'signed',created_at:'2026-03-15',signed_at:'2026-03-18'},
  {id:'c2',title:'Booking Contract — Riya & Dev',state:'sent',created_at:'2026-04-10',sent_at:'2026-04-11'},
  {id:'c3',title:'Pre-wedding Shoot — Ananya Sharma',state:'draft',created_at:'2026-05-01'},
];

export default function DemoContractsPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName}=useDemoContext(handle);const{toast,show}=useToast();
  const[contracts,setContracts]=useState<DemoContract[]>(DEMO_CONTRACTS);
  const[selected,setSelected]=useState<DemoContract|null>(null);
  const[uploadOpen,setUploadOpen]=useState(false);
  const[title,setTitle]=useState('');const[file,setFile]=useState<File|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  const canUpload=title.trim().length>0&&file!==null;
  function doUpload(){if(!canUpload)return;const newC:DemoContract={id:`c${Date.now()}`,title:title.trim(),state:'draft',created_at:new Date().toISOString().slice(0,10)};setContracts(prev=>[newC,...prev]);show('Contract saved','success');setUploadOpen(false);setTitle('');setFile(null);}
  function doSend(c:DemoContract){setContracts(prev=>prev.map(x=>x.id===c.id?{...x,state:'sent',sent_at:new Date().toISOString()}:x));setSelected(null);show('Marked as sent','success');}
  function doSign(c:DemoContract){setContracts(prev=>prev.map(x=>x.id===c.id?{...x,state:'signed',signed_at:new Date().toISOString()}:x));setSelected(null);show('Marked as signed','success');}
  function doCancel(c:DemoContract){setContracts(prev=>prev.filter(x=>x.id!==c.id));setSelected(null);show('Contract cancelled','success');}
  return(<div style={{flex:1,display:'flex',flexDirection:'column',position:'relative'}}>
    <Toast toast={toast}/><DemoVendorHeader vendorName={vendorName} handle={handle}/>
    <div style={{padding:'12px 22px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
      <button type="button" onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:A.brassWarm,fontFamily:F.display,fontSize:22,lineHeight:1}}>‹</button>
      <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,flex:1}}>Contracts</span>
    </div>
    {contracts.length===0?(<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:40,textAlign:'center',gap:6}}><div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.2}}>No contracts yet.</div><div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:14,color:A.inkMute}}>Tap the + to upload your first.</div></div>
    ):(<div style={{flex:1,overflowY:'auto',overflowX:'hidden',paddingBottom:110}}>
      {contracts.map(c=>(<div key={c.id} onClick={()=>setSelected(c)} style={{padding:'16px 24px',cursor:'pointer',display:'flex',alignItems:'center',gap:16,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
        <span style={{flexShrink:0,width:32,textAlign:'center',fontFamily:F.display,fontWeight:400,fontSize:22,color:A.brassWarm,lineHeight:1}}>§</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:F.script,fontWeight:500,fontSize:17,color:A.ink,letterSpacing:'0.005em',lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</div>
          <div style={{fontFamily:F.label,fontWeight:300,fontSize:8,color:'var(--atelier-label)',letterSpacing:'0.28em',textTransform:'uppercase',marginTop:4}}>{new Date(c.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
        </div>
        <span style={{fontFamily:F.label,fontWeight:400,fontSize:8,color:STATE_COLOR[c.state],letterSpacing:'0.28em',textTransform:'uppercase',border:`0.5px solid ${STATE_COLOR[c.state]}`,borderRadius:2,padding:'4px 9px',flexShrink:0}}>{c.state}</span>
      </div>))}
    </div>)}
    <button type="button" onClick={()=>{setUploadOpen(true);setTitle('');setFile(null);}} aria-label="Upload contract" className="atelier-fab" style={{position:'fixed',bottom:'calc(82px + env(safe-area-inset-bottom))',right:20,zIndex:10,width:46,height:46,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.body,fontSize:22,fontWeight:400,lineHeight:1,cursor:'pointer',border:'0.5px solid #E0BC6E'}}>+</button>
    {uploadOpen&&(<div style={{position:'fixed',inset:0,background:'var(--atelier-overlay)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setUploadOpen(false)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:'0.5px solid var(--atelier-sheet-border)',padding:'20px 24px calc(24px + env(safe-area-inset-bottom))',display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'center',marginBottom:4}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
      <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass}}>New Contract</div>
      <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.15,marginBottom:4}}>Upload PDF</div>
      <div><div style={labelStyle}>Title *</div><input style={inputStyle} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Booking contract — Priya Sharma"/></div>
      <div>
        <div style={labelStyle}>PDF File *</div>
        <input ref={fileRef} type="file" accept="application/pdf" style={{display:'none'}} onChange={e=>setFile(e.target.files?.[0]||null)}/>
        <button type="button" onClick={()=>fileRef.current?.click()} style={{width:'100%',padding:'12px 14px',background:'var(--atelier-input-bg)',border:'0.5px solid var(--atelier-input-border)',borderRadius:2,cursor:'pointer',fontFamily:F.script,fontStyle:file?'normal':'italic',fontWeight:300,fontSize:14,color:file?A.ink:A.inkMute,textAlign:'left' as const}}>{file?file.name:'Choose a PDF…'}</button>
      </div>
      {!canUpload&&<div style={{fontFamily:F.script,fontStyle:'italic',fontSize:12,color:A.red,marginTop:2}}>Title and PDF are required.</div>}
      <button type="button" onClick={doUpload} disabled={!canUpload} className="atelier-fab" style={{padding:'14px 0',borderRadius:2,cursor:canUpload?'pointer':'default',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#1A120E',letterSpacing:'0.42em',textTransform:'uppercase',opacity:canUpload?1:0.5,marginTop:6}}>Upload</button>
    </div></div>)}
    {selected&&(<div style={{position:'fixed',inset:0,background:'var(--atelier-overlay)',zIndex:20,display:'flex',alignItems:'flex-end'}} onClick={()=>setSelected(null)}><div onClick={e=>e.stopPropagation()} style={{width:'100%',background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:'0.5px solid var(--atelier-sheet-border)',padding:'20px 24px calc(24px + env(safe-area-inset-bottom))',display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'flex',justifyContent:'center',marginBottom:4}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
      <div style={{fontFamily:F.display,fontWeight:400,fontSize:22,color:'var(--atelier-ink)',lineHeight:1.2}}>{selected.title}</div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{fontFamily:F.label,fontWeight:400,fontSize:8,color:STATE_COLOR[selected.state],letterSpacing:'0.28em',textTransform:'uppercase',border:`0.5px solid ${STATE_COLOR[selected.state]}`,borderRadius:2,padding:'4px 9px'}}>{selected.state}</span>
        {selected.sent_at&&<span style={{fontFamily:F.script,fontStyle:'italic',fontSize:12,color:A.inkMute}}>Sent {new Date(selected.sent_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>}
        {selected.signed_at&&<span style={{fontFamily:F.script,fontStyle:'italic',fontSize:12,color:A.green}}>Signed {new Date(selected.signed_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>}
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>
        <button type="button" onClick={()=>{show('Download available in full studio after signup','success');}} className="atelier-fab" style={{flex:'1 1 100%',padding:'13px 0',borderRadius:2,cursor:'pointer',border:'0.5px solid #E0BC6E',fontFamily:F.label,fontWeight:400,fontSize:10,color:'#1A120E',letterSpacing:'0.42em',textTransform:'uppercase'}}>Download</button>
        {selected.state==='draft'&&<button type="button" onClick={()=>doSend(selected)} style={{flex:1,padding:'12px 0',background:'transparent',border:'0.5px solid rgba(201,168,76,0.5)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.brassWarm,letterSpacing:'0.32em',textTransform:'uppercase'}}>Mark Sent</button>}
        {selected.state==='sent'&&<button type="button" onClick={()=>doSign(selected)} style={{flex:1,padding:'12px 0',background:'transparent',border:`0.5px solid ${A.green}`,borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.green,letterSpacing:'0.32em',textTransform:'uppercase'}}>Mark Signed</button>}
        {selected.state!=='cancelled'&&<button type="button" onClick={()=>doCancel(selected)} style={{flex:1,padding:'12px 0',background:'transparent',border:'0.5px solid rgba(224,123,92,0.4)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.red,letterSpacing:'0.32em',textTransform:'uppercase'}}>Cancel</button>}
      </div>
    </div></div>)}
  </div>);
}
