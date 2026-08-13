'use client';
// MuseRoom — the inspiration board.
//
// TDW_13 · D-5 · VERBATIM RELOCATION, the same law D-4 ran under. This body is
// byte-identical to the lines it occupied in sanctuary/page.tsx at 66ea400.
// Only the import mechanism changed. No token conversion, no hygiene, no
// feature — those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useRef, useEffect } from 'react';
import { FT, FS, FI, getCoupleIdForFrost } from '@/lib/frost/tokens';
import { fetchMuseSaves, deleteMuseSave, uploadMuseImage, createMuseSaveFromUrl, fetchSaveActivity } from '@/lib/frost-api/muse';
import type { MuseSave, MuseActivity } from '@/lib/types/discover';
import { imgUrl, lqipUrl } from '@/lib/frost-api/img';
import ImageDots from '@/components/shared/ImageDots';
import { formatRs } from '@/lib/vendor/format';
import { getAccessToken } from '@/lib/frost-api/_base';
import { usePress } from '@/components/frost/_shared/usePress';
import { coupleAccessToken } from '@/components/frost/_shared/coupleAccessToken';

// ── MUSE ROOM ─────────────────────────────────────────────────────────────────
// Always dark #080608 — photo gallery, both modes.
// Pills and filters use Wine Night / Sky Ivory DNA (terracotta / slate blue).
// Ported from the existing 544-line muse/page.tsx — same logic, bloom shell.

type MuseCeremony = 'all'|'haldi'|'mehendi'|'sangeet'|'reception'|'wedding';
type MuseSourceFilter = 'all'|'bride'|'circle_member';

const MUSE_CEREMONY_FILTERS: {label:string;value:MuseCeremony}[] = [
  {label:'All',value:'all'},{label:'Haldi',value:'haldi'},
  {label:'Mehendi',value:'mehendi'},{label:'Sangeet',value:'sangeet'},
  {label:'Reception',value:'reception'},{label:'Wedding',value:'wedding'},
];
const MUSE_SOURCE_FILTERS: {label:string;value:MuseSourceFilter}[] = [
  {label:'All',value:'all'},{label:'Mine',value:'bride'},{label:'Circle',value:'circle_member'},
];

const MUSE_TAGS_LIST: [string,string][] = [
  ['moody','Moody'],['editorial','Editorial'],['cinematic','Cinematic'],
  ['film','Film'],['candid','Candid'],['intimate','Intimate'],
  ['grand','Grand'],['ott','OTT'],['destination','Destination'],
  ['pastel','Pastel'],['minimal','Minimal'],['festive','Festive'],
  ['vibrant','Vibrant'],['warm','Warm'],['rustic','Rustic'],
];

function MuseOverlay({save,activity,onClose,onRemove,accent,dark}:{
  save:MuseSave; activity:MuseActivity[]; onClose:()=>void;
  onRemove:(id:string)=>void; accent:string; dark:boolean;
}) {
  const [expanded,   setExpanded]   = React.useState(false);
  const [vendorOpen, setVendorOpen] = React.useState(false);
  const [copyToast,  setCopyToast]  = React.useState(false);
  const isVendor = save.source_type==='vendor';
  const pillActiveTxt = dark ? '#1A0810' : '#FFFFFF';

  const handleEnquire = () => { if(save.enquire_link) window.open(save.enquire_link,'_blank'); };
  const handleShare = async () => {
    if(!save.enquire_link) return;
    if(navigator.share){ try{ await navigator.share({title:`${save.vendor_name||'Vendor'} — The Dream Wedding`,url:save.enquire_link}); }catch{} }
    else { try{ await navigator.clipboard.writeText(save.enquire_link);setCopyToast(true);setTimeout(()=>setCopyToast(false),2000); }catch{} }
  };

  return (
    <div style={{position:'absolute',inset:0,zIndex:150,background:'#080608',display:'flex',flexDirection:'column'}}>
      <div style={{flex:1,position:'relative'}} onClick={()=>isVendor&&setVendorOpen(v=>!v)}>
        {save.image_url
          ? <img src={save.image_url} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',pointerEvents:'none'}}/>
          : <div style={{position:'absolute',inset:0,background:'#1a1714',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:'rgba(248,247,245,.2)'}}>No image</span></div>
        }
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(0,0,0,.3) 0%,transparent 30%,transparent 60%,rgba(0,0,0,.6) 100%)',pointerEvents:'none'}}/>
        <button onClick={e=>{e.stopPropagation();onClose();}} style={{position:'absolute',top:'calc(env(safe-area-inset-top,0px) + 14px)',left:16,zIndex:155,width:36,height:36,borderRadius:'50%',background:'rgba(0,0,0,.35)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'0.5px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(255,255,255,.9)'}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {isVendor&&!vendorOpen&&<div style={{position:'absolute',bottom:80,left:0,right:0,display:'flex',justifyContent:'center',pointerEvents:'none'}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(255,255,255,.45)'}}>Tap to see vendor</span></div>}
        {copyToast&&<div style={{position:'absolute',top:'calc(env(safe-area-inset-top,0px) + 60px)',left:'50%',transform:'translateX(-50%)',background:'rgba(12,10,9,.8)',backdropFilter:'blur(12px)',borderRadius:20,padding:'6px 16px',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.9)',whiteSpace:'nowrap'}}>Link copied</div>}
      </div>
      {isVendor&&(
        <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:160,transform:vendorOpen?'translateY(0)':'translateY(100%)',transition:'transform 340ms cubic-bezier(0.22,1,0.36,1)',background:'rgba(8,6,8,.92)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderTop:'0.5px solid rgba(255,255,255,.08)',borderRadius:'20px 20px 0 0',paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 24px)'}}>
          <div style={{display:'flex',justifyContent:'center',padding:'12px 0 16px'}}><div style={{width:36,height:4,borderRadius:2,background:'rgba(255,255,255,.2)'}}/></div>
          <div style={{padding:'0 24px'}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.5)',margin:'0 0 8px'}}>{save.vendor_category}&nbsp;·&nbsp;{save.vendor_city}</p>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:300,color:'#F8F7F5',margin:'0 0 4px',lineHeight:1.1}}>{save.vendor_name}</h2>
            {save.vendor_starting_price&&<p style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:300,color:'rgba(248,247,245,.5)',margin:'0 0 8px'}}>Starting at {formatRs(save.vendor_starting_price)}</p>}
            {save.vendor_vibe_tags.length>0&&<p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(248,247,245,.45)',letterSpacing:'.22em',margin:'0 0 20px'}}>{save.vendor_vibe_tags.join(' · ')}</p>}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <button onClick={handleEnquire} style={{width:'100%',padding:'14px 0',background:'rgba(248,247,245,.9)',border:'none',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'#111',cursor:'pointer'}}>Enquire ↗</button>
              <div style={{display:'flex',gap:8}}>
                <button onClick={handleShare} style={{flex:1,padding:'12px 0',background:'rgba(255,255,255,.12)',border:'0.5px solid rgba(255,255,255,.18)',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.7)',cursor:'pointer'}}>Share ↗</button>
                <button onClick={()=>onRemove(save.id)} style={{flex:1,padding:'12px 0',background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.3)',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(220,100,90,.9)',cursor:'pointer'}}>Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isVendor&&(
        <div style={{background:'rgba(8,6,8,.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderTop:'0.5px solid rgba(255,255,255,.08)',padding:'16px 20px calc(env(safe-area-inset-bottom,0px) + 16px)'}}>
          <div style={{display:'flex',gap:8}}>
            <button onClick={handleShare} style={{flex:1,padding:'12px 0',background:'rgba(255,255,255,.12)',border:'0.5px solid rgba(255,255,255,.18)',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.7)',cursor:'pointer'}}>Share ↗</button>
            <button onClick={()=>onRemove(save.id)} style={{flex:1,padding:'12px 0',background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.3)',borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(220,100,90,.9)',cursor:'pointer'}}>Remove</button>
          </div>
        </div>
      )}
      {activity.length>0&&(
        <div onClick={()=>setExpanded(e=>!e)} style={{background:'rgba(8,6,8,.85)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderTop:'0.5px solid rgba(255,255,255,.08)',padding:expanded?'20px 20px calc(env(safe-area-inset-bottom,0px) + 20px)':'14px 20px calc(env(safe-area-inset-bottom,0px) + 14px)',cursor:'pointer',transition:'padding 240ms ease'}}>
          {!expanded
            ? <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:4,height:4,borderRadius:'50%',background:accent}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.6)'}}>{activity.length} circle interaction{activity.length!==1?'s':''} · tap to see</span></div>
            : <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(248,247,245,.4)',marginBottom:4}}>Circle Activity</span>
                {activity.map(a=>(<div key={a.id}><span style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:400,color:'rgba(248,247,245,.8)'}}>{a.member_name}</span><span style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:300,color:'rgba(248,247,245,.5)'}}>{a.activity_type==='comment'&&a.content?`: "${a.content}"`:` ${a.activity_type.replace(/_/g,' ')}`}</span></div>))}
              </div>
          }
        </div>
      )}
    </div>
  );
}

interface MuseRoomProps { dark:boolean; accent:string; }

export function MuseRoom({ dark, accent }: MuseRoomProps) {
  const { press, pressed } = usePress();
  // Pills use mode DNA — terracotta (WN) / slate blue (SI)
  const pillActive    = accent;
  const pillActiveTxt = dark ? '#1A0810' : '#FFFFFF';
  const pillIdle      = dark ? 'rgba(196,133,106,.10)' : 'rgba(42,95,130,.10)';
  const pillIdleTxt   = dark ? 'rgba(196,133,106,.75)' : 'rgba(42,95,130,.80)';
  const pillIdleBdr   = dark ? 'rgba(196,133,106,.22)' : 'rgba(42,95,130,.25)';
  const divider       = dark ? 'rgba(196,133,106,.18)' : 'rgba(42,95,130,.18)';

  const [ceremonyFilter, setCeremonyFilter] = React.useState<MuseCeremony>('all');
  const [sourceFilter,   setSourceFilter]   = React.useState<MuseSourceFilter>('all');
  const [saves,          setSaves]          = React.useState<MuseSave[]>([]);
  const [total,          setTotal]          = React.useState(0);
  const [loading,        setLoading]        = React.useState(true);
  const [selectedSave,   setSelectedSave]   = React.useState<MuseSave|null>(null);
  const [saveActivity,   setSaveActivity]   = React.useState<MuseActivity[]>([]);
  const [addSheet,       setAddSheet]       = React.useState(false);
  const [saving,         setSaving]         = React.useState(false);
  const [urlInput,       setUrlInput]       = React.useState('');
  const [addToast,       setAddToast]       = React.useState('');
  const [showTagOverlay, setShowTagOverlay] = React.useState(false);
  const [selectedTags,   setSelectedTags]   = React.useState<string[]>([]);
  const [savingTags,     setSavingTags]     = React.useState(false);
  const [tagsSaved,      setTagsSaved]      = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{current:number;total:number}|null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(()=>{
    const token=getAccessToken();
    if(token){ fetch('https://dream-os-production.up.railway.app/api/v2/couple/taste/profile',{headers:{'Authorization':`Bearer ${token}`}}).then(r=>r.json()).then(d=>{if(!d.taste_quiz_done)setShowTagOverlay(true);}).catch(()=>{}); }
  },[]);

  React.useEffect(()=>{
    setLoading(true);
    fetchMuseSaves({saved_by:sourceFilter}).then(({saves:s,total:t})=>{setSaves(s);setTotal(t);}).catch(()=>{}).finally(()=>setLoading(false));
  },[sourceFilter]);

  const filtered = ceremonyFilter==='all'?saves:saves.filter(s=>s.aesthetic_tags.includes(ceremonyFilter));

  const openSave = async (save:MuseSave) => {
    setSelectedSave(save); setSaveActivity([]);
    if(save.circle_comment_count>0){ const res=await fetchSaveActivity(save.id); if(res)setSaveActivity(res.activity); }
  };

  const handleRemove = async (saveId:string) => {
    const ok=await deleteMuseSave(saveId);
    if(ok){ setSaves(prev=>prev.filter(s=>s.id!==saveId)); setSelectedSave(null); setSaveActivity([]); }
  };

  const handleAddFromUrl = async () => {
    if(!urlInput.trim()||saving) return;
    setSaving(true);
    const res=await createMuseSaveFromUrl(urlInput.trim());
    setSaving(false); setUrlInput(''); setAddSheet(false);
    setAddToast(res.ok?'Saved to Muse':'Could not save that link');
    setTimeout(()=>setAddToast(''),2400);
    fetchMuseSaves({saved_by:sourceFilter}).then(({saves:s,total:tt})=>{setSaves(s);setTotal(tt);});
  };

  const handleFilesSelected = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const files=(Array.from(e.target.files||[]) as File[]).filter(f=>f.type.startsWith('image/'));
    if(!files.length) return;
    setAddSheet(false); setSaving(true);
    let ok=0,fail=0;
    for(let i=0;i<files.length;i++){
      setUploadProgress({current:i+1,total:files.length});
      try{ const r=await uploadMuseImage(files[i]); if(r.ok)ok++; else fail++; }catch{ fail++; }
    }
    setUploadProgress(null); setSaving(false);
    if(fileInputRef.current) fileInputRef.current.value='';
    setAddToast(fail===0?(ok===1?'Saved to Muse':`Saved ${ok} to Muse`):ok===0?'Could not save any images':`Saved ${ok}, ${fail} failed`);
    setTimeout(()=>setAddToast(''),2800);
    fetchMuseSaves({saved_by:sourceFilter}).then(({saves:s,total:tt})=>{setSaves(s);setTotal(tt);});
  };

  const toggleTag=(tag:string)=>setSelectedTags(prev=>prev.includes(tag)?prev.filter(x=>x!==tag):[...prev,tag]);

  const saveTags=async()=>{
    if(!selectedTags.length) return; setSavingTags(true);
    try{ const token=getAccessToken(); if(token){ await fetch('https://dream-os-production.up.railway.app/api/v2/couple/taste',{method:'POST',headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({tags:selectedTags})}); } setTagsSaved(true); setTimeout(()=>setShowTagOverlay(false),3000); }catch{}
    setSavingTags(false);
  };

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:'#080608',position:'relative',overflow:'hidden'}}>

      {/* Taste quiz overlay */}
      {showTagOverlay&&(
        <>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.85)',backdropFilter:'blur(8px)',WebkitBackdropFilter:'blur(8px)',zIndex:200}}/>
          <div style={{position:'absolute',inset:0,zIndex:201,display:'flex',flexDirection:'column',padding:'48px 24px calc(env(safe-area-inset-bottom,0px) + 24px)',overflowY:'auto'}}>
            {tagsSaved
              ? <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}><div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:'rgba(245,240,232,.95)',marginBottom:12,lineHeight:1}}>Give us 5 minutes.</div><div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:'rgba(245,240,232,.55)',lineHeight:1.7,maxWidth:280,fontFeatureSettings:'"opsz" 9'}}>We're curating your Surprise Me with images that match your aesthetic. Come back soon.</div></div>
              : <>
                  <div style={{marginBottom:24}}><div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:'rgba(245,240,232,.95)',lineHeight:1,marginBottom:10}}>What moves you?</div><div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:'rgba(245,240,232,.5)',lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>Pick everything that feels like you. We'll curate your Surprise Me.</div></div>
                  <div style={{display:'flex',flexWrap:'wrap' as any,gap:10,marginBottom:24}}>
                    {MUSE_TAGS_LIST.map(([value,label])=>{const sel=selectedTags.includes(value);return <button key={value} onClick={()=>toggleTag(value)} style={{padding:'10px 18px',borderRadius:100,border:`1px solid ${sel?accent:'rgba(255,255,255,.2)'}`,background:sel?`${accent}22`:'rgba(255,255,255,.05)',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:sel?accent:'rgba(245,240,232,.7)',cursor:'pointer',fontFeatureSettings:'"opsz" 9'}}>{label}</button>;})}
                  </div>
                  <div style={{display:'flex',gap:12}}>
                    <button onClick={()=>setShowTagOverlay(false)} style={{flex:1,padding:'13px 0',background:'rgba(255,255,255,.06)',border:'0.5px solid rgba(255,255,255,.15)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(245,240,232,.4)',cursor:'pointer'}}>Skip</button>
                    <button onClick={saveTags} disabled={savingTags||!selectedTags.length} style={{flex:2,padding:'13px 0',background:selectedTags.length?accent:'rgba(255,255,255,.08)',border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:selectedTags.length?pillActiveTxt:'rgba(245,240,232,.25)',cursor:selectedTags.length?'pointer':'default',opacity:savingTags?.6:1}}>{savingTags?'Saving…':`Save${selectedTags.length>0?` (${selectedTags.length})`:''}`}</button>
                  </div>
                </>
            }
          </div>
        </>
      )}

      {/* Full-bleed overlay */}
      {selectedSave&&<MuseOverlay save={selectedSave} activity={saveActivity} accent={accent} dark={dark} onClose={()=>{setSelectedSave(null);setSaveActivity([]);}} onRemove={handleRemove}/>}

      {/* Header */}
      <div style={{padding:'18px 20px 10px',flexShrink:0,display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:'#F0EDE8',lineHeight:1,marginBottom:3}}>Muse</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'rgba(196,133,106,.55)':'rgba(42,95,130,.65)'}}>{loading?'loading…':`${total} saved`}</div>
        </div>
        {/* Surprise Me pill */}
        <a href="/frost/canvas/surprise"
          style={{display:'flex',alignItems:'center',gap:5,height:28,padding:'0 12px 0 10px',borderRadius:100,
            background:`${accent}1A`,border:`0.5px solid ${accent}55`,
            cursor:'pointer',touchAction:'manipulation',textDecoration:'none',flexShrink:0,marginTop:4}}>
          <span style={{fontSize:16,color:accent,lineHeight:1}}>✦</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent,whiteSpace:'nowrap'}}>Surprise Me</span>
        </a>
      </div>

      {/* Pills — Source | Ceremony — all using mode DNA */}
      <div className="no-scroll" style={{display:'flex',gap:7,padding:'0 20px 10px',overflowX:'auto',flexShrink:0,WebkitOverflowScrolling:'touch' as any}}>
        {MUSE_SOURCE_FILTERS.map(f=>{const active=sourceFilter===f.value;return <button key={f.value} {...press(`muse:src:${f.value}`)} onClick={()=>setSourceFilter(f.value)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'7px 14px',borderRadius:100,flexShrink:0,background:active?pillActive:pillIdle,color:active?pillActiveTxt:pillIdleTxt,border:`0.5px solid ${active?'transparent':pillIdleBdr}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',...pressed(`muse:src:${f.value}`)}}>{f.label}</button>;})}
        <div style={{width:.5,background:divider,alignSelf:'center',flexShrink:0,margin:'0 3px',height:16}}/>
        {MUSE_CEREMONY_FILTERS.map(f=>{const active=ceremonyFilter===f.value;return <button key={f.value} {...press(`muse:cer:${f.value}`)} onClick={()=>setCeremonyFilter(f.value)} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'7px 14px',borderRadius:100,flexShrink:0,background:active?pillActive:pillIdle,color:active?pillActiveTxt:pillIdleTxt,border:`0.5px solid ${active?'transparent':pillIdleBdr}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',...pressed(`muse:cer:${f.value}`)}}>{f.label}</button>;})}
      </div>

      {/* Masonry grid — natural image heights, no cropping */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,paddingBottom:88}}>
        {!loading&&filtered.length===0&&<div style={{textAlign:'center' as any,padding:'64px 0',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:19,color:'rgba(240,237,232,.3)',fontFeatureSettings:'"opsz" 9'}}>No saves here yet.</div>}
        <div style={{columns:'2 auto',columnGap:6,padding:'0 12px'}}>
          {filtered.map((save)=>(
            <div key={save.id} onClick={()=>openSave(save)}
              style={{position:'relative',marginBottom:6,borderRadius:8,overflow:'hidden',breakInside:'avoid',cursor:'pointer',background:'#1a1714'}}>
              {save.image_url
                ? <img src={save.image_url} alt={save.vendor_name||'muse'} style={{width:'100%',display:'block',objectFit:'cover'}} loading="lazy"/>
                : <div style={{width:'100%',aspectRatio:'3/4',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:'rgba(248,247,245,.2)'}}>{save.vendor_name||'—'}</span></div>
              }
              {save.vendor_name&&<div style={{position:'absolute',bottom:6,left:6,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,background:'rgba(8,6,8,.6)',color:'rgba(245,240,232,.9)',padding:'3px 7px',borderRadius:100,backdropFilter:'blur(4px)'}}>{save.vendor_name}</div>}
              {save.circle_comment_count>0&&<div style={{position:'absolute',top:6,right:6,background:`${accent}DD`,borderRadius:100,padding:'2px 6px',fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:pillActiveTxt,letterSpacing:'.22em'}}>{save.circle_comment_count}</div>}
              {save.saved_by_role==='circle_member'&&<div style={{position:'absolute',top:6,left:6,background:'rgba(8,6,8,.55)',backdropFilter:'blur(4px)',borderRadius:100,padding:'3px 7px',fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(248,247,245,.7)',letterSpacing:'.22em',textTransform:'uppercase' as any}}>Circle</div>}
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button onClick={()=>setAddSheet(true)} style={{position:'absolute',bottom:'calc(env(safe-area-inset-bottom,0px) + 24px)',right:24,zIndex:50,width:52,height:52,borderRadius:26,background:accent,border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:'0 4px 24px rgba(0,0,0,.45)',touchAction:'manipulation'}}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke={pillActiveTxt} strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>

      {/* Add sheet */}
      {addSheet&&(
        <>
          <div onClick={()=>setAddSheet(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.6)',zIndex:300}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:301,background:'#141010',borderRadius:'20px 20px 0 0',border:`0.5px solid ${divider}`,padding:'28px 24px calc(28px + env(safe-area-inset-bottom))'}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:'#F0EDE8',marginBottom:4}}>Add to Muse</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:'rgba(240,237,232,.5)',marginBottom:24,fontFeatureSettings:'"opsz" 9'}}>Upload from your phone or paste a link.</div>
            <button onClick={()=>fileInputRef.current?.click()} disabled={saving} style={{width:'100%',padding:14,background:accent,border:'none',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pillActiveTxt,cursor:'pointer',opacity:saving?.5:1,marginBottom:14}}>Upload from phone</button>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14,color:'rgba(240,237,232,.3)',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any}}><div style={{flex:1,height:.5,background:divider}}/><span>or</span><div style={{flex:1,height:.5,background:divider}}/></div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:dark?'rgba(196,133,106,.55)':'rgba(42,95,130,.55)',marginBottom:8}}>Paste a link</div>
            <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="https://i.pinimg.com/…" style={{width:'100%',padding:'12px 14px',background:'rgba(255,255,255,.05)',border:`0.5px solid ${divider}`,borderRadius:8,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:'#F0EDE8',outline:'none',boxSizing:'border-box' as any,marginBottom:12,fontFeatureSettings:'"opsz" 9',userSelect:'text'}}/>
            <button onClick={handleAddFromUrl} disabled={!urlInput.trim()||saving} style={{width:'100%',padding:12,background:'transparent',border:`0.5px solid ${divider}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(240,237,232,.7)',cursor:'pointer',opacity:(!urlInput.trim()||saving)?.5:1}}>{saving?'Saving…':'Save link'}</button>
          </div>
        </>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelected} style={{display:'none'}}/>
      {uploadProgress&&<div style={{position:'absolute',top:24,left:'50%',transform:'translateX(-50%)',background:'rgba(240,237,232,.95)',color:'#080608',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'10px 20px',borderRadius:20,zIndex:400,pointerEvents:'none',whiteSpace:'nowrap'}}>Uploading {uploadProgress.current} of {uploadProgress.total}…</div>}
      {addToast&&<div style={{position:'absolute',top:24,left:'50%',transform:'translateX(-50%)',background:'rgba(240,237,232,.95)',color:'#080608',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'8px 18px',borderRadius:20,zIndex:400,pointerEvents:'none',whiteSpace:'nowrap'}}>{addToast}</div>}
    </div>
  );
}
