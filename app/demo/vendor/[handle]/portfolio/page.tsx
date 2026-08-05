'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DemoVendorHeader } from '@/components/demo/DemoVendorHeader';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { useDemoContext } from '@/hooks/demo/useDemoContext';
import { fetchDemoVendor } from '@/lib/demo/api';
import type { DemoPhoto } from '@/lib/demo/api';

const A={ink:'var(--atelier-ink)',inkSoft:'var(--atelier-ink-soft)',inkMute:'var(--atelier-ink-mute)',brass:'var(--atelier-accent-text)',brassWarm:'var(--atelier-label)',brassLine:'rgba(201,168,76,0.18)',red:'var(--role-critical)'} as const;
const F={display:'var(--font-italiana), "GFS Didot", Georgia, serif',script:'var(--font-cormorant), Georgia, serif',body:'var(--font-dm-sans), system-ui, sans-serif',label:'var(--font-jost), system-ui, sans-serif'} as const;
const STATE_FILTERS=['all','approved','pending','rejected'] as const;

export default function DemoPortfolioPage(){
  const params=useParams();const handle=typeof params.handle==='string'?params.handle:'';
  const router=useRouter();const{vendorName}=useDemoContext(handle);
  const{toast,show}=useToast();
  const[photos,setPhotos]=useState<DemoPhoto[]>([]);const[loading,setLoading]=useState(true);
  const[filter,setFilter]=useState('all');const[sel,setSel]=useState<DemoPhoto|null>(null);

  useEffect(()=>{if(!handle)return;fetchDemoVendor(handle).then(r=>setPhotos(r.vendor.photos??[])).finally(()=>setLoading(false));},[handle]);

  const filtered=filter==='all'?photos:filter==='approved'?photos:[];
  const stateColor=(s:string)=>s==='approved'?A.brassWarm:s==='rejected'?A.red:A.inkMute;

  return(
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <Toast toast={toast}/>
      <DemoVendorHeader vendorName={vendorName} handle={handle}/>
      <div style={{padding:'12px 22px',display:'flex',alignItems:'center',gap:12,borderBottom:'0.5px solid var(--atelier-card-border)'}}>
        <button type="button" onClick={()=>router.back()} style={{background:'none',border:'none',cursor:'pointer',padding:0,color:A.brassWarm,fontFamily:F.display,fontSize:22,lineHeight:1}}>‹</button>
        <span style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.42em',textTransform:'uppercase',color:A.brass,flex:1}}>Portfolio</span>
        <button type="button" onClick={()=>show('Upload available in your full studio after signup','success')} className="atelier-fab" style={{padding:'8px 16px',borderRadius:2,cursor:'pointer',border:'0.5px solid var(--atelier-label)',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.32em',textTransform:'uppercase'}}>+ Upload</button>
      </div>
      <div style={{display:'flex',gap:8,padding:'12px 22px',flexWrap:'wrap'}}>
        {STATE_FILTERS.map(s=>(
          <button key={s} type="button" onClick={()=>setFilter(s)} style={{padding:'6px 14px',borderRadius:2,cursor:'pointer',flexShrink:0,background:filter===s?'rgba(201,168,76,0.18)':'transparent',border:`0.5px solid ${filter===s?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.22)'}`,fontFamily:F.label,fontWeight:300,fontSize:9,color:filter===s?A.brassWarm:A.inkMute,letterSpacing:'0.28em',textTransform:'uppercase'}}>{s}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'0 16px 32px'}}>
        {loading?(<div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:15,color:A.inkMute,textAlign:'center',padding:40}}>Loading…</div>
        ):photos.length===0?(<div style={{fontFamily:F.script,fontStyle:'italic',fontWeight:300,fontSize:17,color:A.inkMute,textAlign:'center',padding:'60px 20px',lineHeight:1.5}}>No images yet.<br/><span style={{color:A.brassWarm}}>Upload after signup.</span></div>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,paddingTop:8}}>
            {(filter==='all'?photos:filter==='approved'?photos:[]).map((img,idx)=>(
              <div key={idx} role="button" tabIndex={0} onClick={()=>setSel(img)} style={{position:'relative',aspectRatio:'3/4',overflow:'hidden',border:'0.5px solid rgba(201,168,76,0.2)',cursor:'pointer',background:'none',padding:0,borderRadius:2}}>
                <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
                {img.is_hero&&<div style={{position:'absolute',top:6,left:6,padding:'3px 8px',background:'linear-gradient(180deg,var(--role-metal) 0%,var(--role-metal) 100%)',border:'0.5px solid var(--atelier-label)',fontFamily:F.label,fontWeight:400,fontSize:7,color:'#1A120E',letterSpacing:'0.28em'}}>HERO</div>}
                <div style={{position:'absolute',bottom:6,right:6,width:7,height:7,borderRadius:'50%',background:A.brassWarm,boxShadow:'0 0 6px rgba(224,188,110,0.6)'}}/>
              </div>
            ))}
          </div>
        )}
      </div>
      {sel&&(
        <>
          <div onClick={()=>setSel(null)} style={{position:'fixed',inset:0,zIndex:40,backgroundColor:'var(--atelier-overlay)'}}/>
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,background:'var(--atelier-sheet-bg)',backdropFilter:'blur(40px) saturate(1.8)',WebkitBackdropFilter:'blur(40px) saturate(1.8)',borderTop:'0.5px solid var(--atelier-sheet-border)',padding:'16px 24px calc(24px + env(safe-area-inset-bottom))'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:14}}><div style={{width:36,height:3,borderRadius:2,background:'var(--atelier-label)'}}/></div>
            <img src={sel.url} alt="" style={{width:'100%',aspectRatio:'3/4',objectFit:'cover',objectPosition:'center top',borderRadius:2,marginBottom:14,border:'0.5px solid rgba(201,168,76,0.2)'}}/>
            <div style={{fontFamily:F.label,fontWeight:300,fontSize:9,letterSpacing:'0.32em',textTransform:'uppercase',color:A.brassWarm,marginBottom:16}}>approved</div>
            <div style={{display:'flex',gap:8}}>
              {!sel.is_hero&&<button type="button" onClick={()=>{show('Set hero available in your full studio after signup','success');setSel(null);}} className="atelier-fab" style={{flex:1,padding:'13px 0',borderRadius:2,cursor:'pointer',border:'0.5px solid var(--atelier-label)',fontFamily:F.label,fontWeight:400,fontSize:9,color:'#1A120E',letterSpacing:'0.32em',textTransform:'uppercase'}}>Set Hero</button>}
              <button type="button" onClick={()=>{show('Delete available in your full studio after signup','success');setSel(null);}} style={{flex:1,padding:'13px 0',background:'transparent',border:'0.5px solid rgba(224,123,92,0.4)',borderRadius:2,cursor:'pointer',fontFamily:F.label,fontWeight:300,fontSize:9,color:A.red,letterSpacing:'0.32em',textTransform:'uppercase'}}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
