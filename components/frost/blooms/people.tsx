'use client';
// PeopleRoom — the circle roster bloom.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { FS } from '@/lib/frost/tokens';
import { fetchCircle, removeCircleMember, fetchMemberFeed, timeAgo,
         type CircleActivity, type CircleMember } from '@/lib/frost/journey';
import { usePress } from '@/components/frost/_shared/usePress';



// ── PEOPLE ROOM ────────────────────────────────────────────────────────────────
// List view → tap member → inline detail view with their activity feed.
// No router.push — pure state machine inside the bloom.

interface PeopleRoomProps { dark:boolean; accent:string; signal:string; }

export function PeopleRoom({ dark, accent, signal }: PeopleRoomProps) {
  const { press, pressed } = usePress();
  const bg      = dark
    ? 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.12) 0%,transparent 52%),linear-gradient(160deg,#1A0A0E 0%,#120608 40%,#0C0404 100%)'
    : 'radial-gradient(ellipse 80% 45% at 20% 0%,rgba(42,95,130,.16) 0%,transparent 52%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 40%,#D8DEEC 100%)';
  const ink     = dark ? '#F5E5DC'               : '#0C1830';
  const inkSoft = dark ? 'rgba(245,229,220,.72)' : 'rgba(12,24,48,.72)';
  const inkMute = dark ? 'rgba(196,133,106,.50)' : 'rgba(42,80,130,.55)';
  const line    = dark ? 'rgba(196,133,106,.14)' : 'rgba(42,95,130,.14)';
  const cardBg  = dark ? 'rgba(196,133,106,.06)' : 'rgba(42,95,130,.06)';
  const cardBdr = dark ? 'rgba(196,133,106,.14)' : 'rgba(42,95,130,.14)';
  const ac      = dark ? '#C4856A'               : '#2A5F82';

  const [members,      setMembers]      = React.useState<CircleMember[]>([]);
  const [pending,      setPending]      = React.useState<any[]>([]);
  const [loading,      setLoading]      = React.useState(true);
  const [selected,     setSelected]     = React.useState<CircleMember|null>(null);
  const [memberFeed,   setMemberFeed]   = React.useState<CircleActivity[]>([]);
  const [feedLoading,  setFeedLoading]  = React.useState(false);
  const [removeTarget, setRemoveTarget] = React.useState<CircleMember|null>(null);
  const [removing,     setRemoving]     = React.useState(false);
  const [toast,        setToast]        = React.useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),2500); };

  React.useEffect(()=>{
    fetchCircle().then(c=>{
      setMembers(c.members);
      setPending(c.pending_invites);
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[]);

  const handleRemove = async (m: CircleMember) => {
    setRemoving(true);
    const ok = await removeCircleMember(m.id);
    if(ok) {
      setMembers(prev=>prev.filter(x=>x.id!==m.id));
      setPending(prev=>prev.filter((x:any)=>x.id!==m.id));
      showToast(`${m.invitee_name} removed from Circle.`);
    } else {
      showToast('Could not remove. Try again.');
    }
    setRemoving(false);
    setRemoveTarget(null);
    setSelected(null);
  };

  const openMember = (m: CircleMember) => {
    setSelected(m);
    setMemberFeed([]);
    setFeedLoading(true);
    fetchMemberFeed(m.id).then(d=>{
      setMemberFeed(d?.activity||[]);
      setFeedLoading(false);
    }).catch(()=>setFeedLoading(false));
  };

  const roleLabel = (r:string) => r.replace(/_/g,' ');

  // ── MEMBER DETAIL VIEW ──────────────────────────────────────────────────
  if(selected) {
    const phone = (selected as any).invitee_phone || null;
    return (
      <div style={{flex:1,display:'flex',flexDirection:'column',background:bg,overflow:'hidden',position:'relative'}}>
        {toast&&<div style={{position:'absolute',top:'calc(env(safe-area-inset-top,0px)+12px)',left:'50%',transform:'translateX(-50%)',background:ink,color:bg,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'7px 16px',borderRadius:20,zIndex:400,pointerEvents:'none',whiteSpace:'nowrap'}}>{toast}</div>}
        {/* Detail top bar */}
        <div style={{padding:'14px 20px',borderBottom:`0.5px solid ${line}`,display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
          <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,color:inkMute,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:0}}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <div style={{flex:1,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ac,fontFeatureSettings:'"opsz" 9'}}>{selected.invitee_name}</div>
          <button onClick={()=>setRemoveTarget(selected)} style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(184,69,62,.8)',padding:0}}>Remove</button>
        </div>

        <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
          {/* Member header */}
          <div style={{padding:'20px 20px 16px',borderBottom:`0.5px solid ${line}`,display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:56,height:56,borderRadius:28,background:`${ac}18`,border:`2px solid ${ac}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:22,color:ac}}>{(selected.invitee_name[0]||'·').toUpperCase()}</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,fontFeatureSettings:'"opsz" 9',marginBottom:3}}>{selected.invitee_name}</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>
                {roleLabel(selected.role)}
                {selected.last_active&&<span style={{color:signal}}> · {timeAgo(selected.last_active)}</span>}
              </div>
            </div>
            {/* Contact buttons */}
            {phone&&<div style={{display:'flex',gap:8,flexShrink:0}}>
              <a href={`https://wa.me/${phone.replace(/\+/g,'')}`} target="_blank" rel="noopener noreferrer"
                style={{width:36,height:36,borderRadius:18,background:'rgba(37,211,102,.10)',border:'0.5px solid rgba(37,211,102,.25)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" fill="#25D366"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.118 1.528 5.845L0 24l6.335-1.652A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.273-1.535l-.378-.224-3.927 1.025 1.046-3.82-.247-.393A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" fill="#25D366"/></svg>
              </a>
              <a href={`tel:${phone}`}
                style={{width:36,height:36,borderRadius:18,background:`${ac}12`,border:`0.5px solid ${ac}33`,display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C9.61 22 2 14.39 2 5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" stroke={ac} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>}
          </div>

          {/* Activity feed */}
          <div style={{padding:'16px 20px'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:16}}>What they've shared</div>
            {feedLoading&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>loading…</div>}
            {!feedLoading&&memberFeed.length===0&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>Nothing shared yet.</div>}
            {memberFeed.map(a=>{
              if(a.activity_type==='save_added'&&a.image_url) return(
                <div key={a.id} style={{marginBottom:20}}>
                  <div style={{borderRadius:8,overflow:'hidden',marginBottom:8,background:cardBg}}>
                    <img src={a.image_url} alt={a.caption||'Save'} style={{width:'100%',display:'block',objectFit:'cover',maxHeight:280}} loading="lazy"/>
                  </div>
                  {a.caption&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,lineHeight:1.5,marginBottom:4,fontFeatureSettings:'"opsz" 9'}}>"{a.caption}"</div>}
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>{timeAgo(a.created_at)}</div>
                </div>
              );
              if(a.activity_type==='comment'&&a.content) return(
                <div key={a.id} style={{marginBottom:14,paddingLeft:12,borderLeft:`2px solid ${ac}`}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,lineHeight:1.6,marginBottom:3,fontFeatureSettings:'"opsz" 9'}}>"{a.content}"</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>{timeAgo(a.created_at)}</div>
                </div>
              );
              return(
                <div key={a.id} style={{display:'flex',gap:10,marginBottom:10,alignItems:'flex-start'}}>
                  <div style={{width:5,height:5,borderRadius:3,background:inkMute,marginTop:5,flexShrink:0}}/>
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>{a.activity_type.replace(/_/g,' ')} · <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em'}}>{timeAgo(a.created_at)}</span></div>
                </div>
              );
            })}
          </div>
          <div style={{height:40}}/>
        </div>
      {/* Confirm remove sheet */}
      {removeTarget&&<>
        <div onClick={()=>setRemoveTarget(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:300}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:301,background:dark?'#1A0A0E':'#EEF0F6',borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,marginBottom:6,fontFeatureSettings:'"opsz" 9'}}>Remove {removeTarget.invitee_name}?</div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginBottom:24,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>They'll lose access to your Circle, Muse board, and DreamAi.</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>handleRemove(removeTarget)} disabled={removing}
              style={{flex:1,padding:14,background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.4)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'#B8453E',cursor:'pointer',opacity:removing?.5:1}}>
              {removing?'Removing…':'Remove'}
            </button>
            <button onClick={()=>setRemoveTarget(null)}
              style={{flex:1,padding:14,background:`rgba(255,255,255,.04)`,border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,cursor:'pointer'}}>
              Keep
            </button>
          </div>
        </div>
      </>}
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:bg,overflow:'hidden',position:'relative'}}>
      {toast&&<div style={{position:'absolute',top:'calc(env(safe-area-inset-top,0px)+12px)',left:'50%',transform:'translateX(-50%)',background:ink,color:dark?'#1A0A0E':'#F0EEE8',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,padding:'7px 16px',borderRadius:20,zIndex:400,pointerEvents:'none',whiteSpace:'nowrap'}}>{toast}</div>}
      {/* Confirm remove sheet (from list) */}
      {removeTarget&&<>
        <div onClick={()=>setRemoveTarget(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:300}}/>
        <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:301,background:dark?'#1A0A0E':'#EEF0F6',borderRadius:'20px 20px 0 0',padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,marginBottom:6,fontFeatureSettings:'"opsz" 9'}}>Remove {removeTarget.invitee_name}?</div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,marginBottom:24,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>They'll lose access to your Circle, Muse board, and DreamAi.</div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>handleRemove(removeTarget)} disabled={removing}
              style={{flex:1,padding:14,background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.4)',borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'#B8453E',cursor:'pointer',opacity:removing?.5:1}}>
              {removing?'Removing…':'Remove'}
            </button>
            <button onClick={()=>setRemoveTarget(null)}
              style={{flex:1,padding:14,background:`rgba(255,255,255,.04)`,border:`0.5px solid ${line}`,borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,cursor:'pointer'}}>
              Keep
            </button>
          </div>
        </div>
      </>}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        <div style={{padding:'20px 20px 8px'}}>
          <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:ac,lineHeight:1,marginBottom:4}}>Your circle.</div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>The people sharing this journey with you.</div>
        </div>

        {loading&&<div style={{padding:32,textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>loading…</div>}
        {!loading&&members.length===0&&pending.length===0&&(
          <div style={{padding:`${FS.s5}px ${FS.gutter}px`,textAlign:'center' as any,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>No one yet. Invite someone from Circle.</div>
        )}

        {members.length>0&&(
          <div style={{padding:'16px 20px 8px'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:12}}>Active</div>
            {members.map(m=>{
              const phone=(m as any).invitee_phone||null;
              return(
                <div key={m.id} {...press(`member:${m.id}`)} onClick={()=>openMember(m)} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',marginBottom:8,borderRadius:10,background:cardBg,border:`0.5px solid ${cardBdr}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',...pressed(`member:${m.id}`)}}>
                  <div style={{width:44,height:44,borderRadius:22,background:`${ac}18`,border:`1.5px solid ${ac}55`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:19,color:ac}}>{(m.invitee_name[0]||'·').toUpperCase()}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',marginBottom:2}}>{m.invitee_name}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>
                      {roleLabel(m.role)}{m.last_active&&<span style={{color:signal}}> · {timeAgo(m.last_active)}</span>}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                    {phone&&<>
                      <a href={`https://wa.me/${phone.replace(/\+/g,'')}`} target="_blank" rel="noopener noreferrer"
                        style={{width:34,height:34,borderRadius:17,background:'rgba(37,211,102,.10)',border:'0.5px solid rgba(37,211,102,.25)',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" fill="#25D366"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.118 1.528 5.845L0 24l6.335-1.652A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.273-1.535l-.378-.224-3.927 1.025 1.046-3.82-.247-.393A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" fill="#25D366"/></svg>
                      </a>
                      <a href={`tel:${phone}`}
                        style={{width:34,height:34,borderRadius:17,background:`${ac}12`,border:`0.5px solid ${ac}33`,display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C9.61 22 2 14.39 2 5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" stroke={ac} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </a>
                    </>}
                    <button onClick={()=>setRemoveTarget(m)}
                      style={{width:34,height:34,borderRadius:17,background:'rgba(184,69,62,.08)',border:'0.5px solid rgba(184,69,62,.25)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(184,69,62,.9)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={inkMute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pending.length>0&&(
          <div style={{padding:'8px 20px 16px'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:12}}>Invited · waiting to join</div>
            {pending.map(p=>(
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:14,padding:'10px 0',borderBottom:`0.5px solid ${line}`}}>
                <div style={{width:44,height:44,borderRadius:22,border:`0.5px dashed ${line}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:inkMute}}>?</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>{p.invitee_name}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginTop:2}}>{roleLabel(p.role)} · pending</div>
                </div>
                <button onClick={()=>setRemoveTarget(p as any)}
                  style={{width:30,height:30,borderRadius:15,background:'rgba(184,69,62,.08)',border:'0.5px solid rgba(184,69,62,.25)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="rgba(184,69,62,.9)" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{height:40}}/>
      </div>
    </div>
  );
}
