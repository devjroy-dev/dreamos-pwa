'use client';
// PagesRoom — the diary.
//
// TDW_13 · D-5 · VERBATIM RELOCATION, the same law D-4 ran under. This body is
// byte-identical to the lines it occupied in sanctuary/page.tsx at 66ea400.
// Only the import mechanism changed. No token conversion, no hygiene, no
// feature — those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { FT, FS, FI, getCoupleIdForFrost } from '@/lib/frost/tokens';
import { usePress } from '@/components/frost/_shared/usePress';
import { coupleAccessToken } from '@/components/frost/_shared/coupleAccessToken';

// ── MOOD DATA ─────────────────────────────────────────────────────────────────
const MOODS = [
  { key:'hopeful',         label:'Hopeful',        color:'#D4956A' },
  { key:'heavy',           label:'Heavy',           color:'#6B7FA8' },
  { key:'tender',          label:'Tender',          color:'#D4848A' },
  { key:'tired',           label:'Tired',           color:'#8A9DB5' },
  { key:'angry',           label:'Angry',           color:'#C45A4A' },
  { key:'still',           label:'Still',           color:'#E8E0D0' },
  { key:'missing-someone', label:'Missing Someone', color:'#9B8DC4' },
  { key:'proud',           label:'Proud',           color:'#C4A83A' },
  { key:'doubting',        label:'Doubting',        color:'#7A8A8A' },
  { key:'peaceful',        label:'Peaceful',        color:'#5A9E7A' },
  { key:'overwhelmed',     label:'Overwhelmed',     color:'#C4784A' },
  { key:'in-between',      label:'Inbetween',       color:'#B8B0C0' },
];

interface PageEntry { id:string; entry_date:string; mood:string; mood_color:string; body:string; created_at:string; }

interface PagesRoomProps {
  dark:boolean; accent:string; signal:string;
  roomInk:string; roomInkSoft:string; roomInkMute:string; roomLine:string;
}

type PagesView = 'list' | 'picker' | 'writing';

export function PagesRoom({ dark, accent, signal, roomInk, roomInkSoft, roomInkMute, roomLine }: PagesRoomProps) {
  const { press, pressed } = usePress();
  const [view,         setView]         = React.useState<PagesView>('list');
  const [entries,      setEntries]      = React.useState<PageEntry[]>([]);
  const [loading,      setLoading]      = React.useState(true);
  const [selectedMood, setSelectedMood] = React.useState<typeof MOODS[0]|null>(null);
  const [body,         setBody]         = React.useState('');
  const [saving,       setSaving]       = React.useState(false);
  const textRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(()=>{
    const load = async () => {
      try {
        // F-07.70: the `if(!raw) return` guard that stood here is subsumed by the
        // `!coupleId||!token` guard below — getCoupleIdForFrost() returns null with
        // no blob, so the same brides are turned away by the same line.
        const coupleId = getCoupleIdForFrost();
        const token = coupleAccessToken();
        if(!coupleId||!token) return;
        const API = process.env.NEXT_PUBLIC_API_BASE||'https://dream-os-production.up.railway.app';
        const res = await fetch(`${API}/api/v2/couple/pages/${coupleId}?limit=50`,{headers:{Authorization:`Bearer ${token}`}});
        if(!res.ok) return;
        const data = await res.json();
        setEntries(data.entries||[]);
      } catch(e){ console.error(e); }
      finally{ setLoading(false); }
    };
    load();
  },[]);

  React.useEffect(()=>{
    if(!textRef.current) return;
    textRef.current.style.height='auto';
    textRef.current.style.height=textRef.current.scrollHeight+'px';
  },[body]);

  // Focus textarea when entering writing view.
  // MUST live here (before any conditional return) — Rules of Hooks.
  React.useEffect(()=>{
    if(view==='writing'&&textRef.current){
      const t = setTimeout(()=>{textRef.current?.focus();},180);
      return ()=>clearTimeout(t);
    }
  },[view]);

  const saveEntry = async () => {
    if(!selectedMood||!body.trim()||saving) return;
    setSaving(true);
    try {
      // F-07.70: the blob guard is KEPT byte-for-behaviour — it is this caller's
      // only "is she signed in" test, and the token check below cannot replace it
      // now that the token may arrive from the authority without a blob present.
      const raw = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
      if(!raw) return;
      const token = coupleAccessToken();
      if(!token) return;
      const API = process.env.NEXT_PUBLIC_API_BASE||'https://dream-os-production.up.railway.app';
      const res = await fetch(`${API}/api/v2/couple/pages`,{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({mood:selectedMood.key,mood_color:selectedMood.color,body:body.trim()}),
      });
      if(!res.ok) throw new Error('save failed');
      const data = await res.json();
      setEntries(prev=>[data.entry,...prev]);
      setView('list');
      setSelectedMood(null);
      setBody('');
    } catch(e){ console.error(e); }
    finally{ setSaving(false); }
  };

  // Background — light mode gets the blue-grey gradient, dark gets wine-black
  const pageBg = dark
    ? 'radial-gradient(ellipse 110% 55% at 50% -5%,rgba(196,133,106,.16) 0%,transparent 52%),radial-gradient(ellipse 70% 60% at 90% 110%,rgba(40,5,12,.80) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 5% 100%,rgba(60,8,20,.70) 0%,transparent 50%),linear-gradient(180deg,#1A0A0E 0%,#0E0506 40%,#080204 70%,#0C0408 100%)'
    : 'radial-gradient(ellipse 110% 50% at 60% -5%,rgba(74,122,155,.24) 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 10% 110%,rgba(42,95,130,.16) 0%,transparent 55%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 30%,#D8DEEC 60%,#CDD4E8 100%)';

  // Ink in light mode — deep navy on the blue-grey surface
  const pgInk     = dark ? '#F5E5DC' : '#0C1830';
  const pgInkSoft = dark ? 'rgba(245,229,220,.70)' : 'rgba(12,24,48,.65)';
  const pgInkMute = dark ? 'rgba(196,133,106,.45)' : 'rgba(42,80,130,.50)';
  const pgLine    = dark ? 'rgba(196,133,106,.14)' : 'rgba(42,80,130,.18)';
  const pgAccent  = dark ? '#C4856A' : '#2A5F82';

  // ── LIST VIEW ──
  if(view==='list') return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:pageBg}}>
      {/* Poetry line */}
      <div style={{padding:'20px 24px 14px',borderBottom:`0.5px solid ${pgLine}`,flexShrink:0}}>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgAccent,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>
          "Everything you love about flowers is also true of weddings."
        </div>
      </div>
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading?(
          <div style={{padding:32,textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>loading…</div>
        ):entries.length===0?(
          <div style={{padding:`${FS.s5}px ${FS.gutter}px`,display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgAccent,lineHeight:1}}>Today</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,textAlign:'center' as any}}>Tap below to begin today's page</div>
          </div>
        ):(
          <div>
            {entries.map((entry)=>{
              const mood = MOODS.find(m=>m.key===entry.mood);
              const d = new Date(entry.created_at);
              const dateStr = d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});
              return(
                <div key={entry.id} style={{padding:'16px 24px',borderBottom:`0.5px solid ${pgLine}`,display:'flex',gap:0}}>
                  {/* Journal margin rule — mood color */}
                  <div style={{width:1.5,background:`${mood?.color||entry.mood_color}`,opacity:.6,flexShrink:0,marginRight:16,borderRadius:1}}/>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{width:6,height:6,borderRadius:'50%',background:mood?.color||entry.mood_color,flexShrink:0}}/>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>{mood?.label||entry.mood}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:pgInkMute,marginLeft:'auto'}}>{dateStr}</span>
                    </div>
                    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInk,lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>
                      {entry.body}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{padding:'24px',textAlign:'center' as any}}>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkMute,fontFeatureSettings:'"opsz" 9'}}>another page?</div>
            </div>
          </div>
        )}
      </div>
      {/* CTA */}
      <div onClick={()=>setView('picker')} {...press('pages:cta')} style={{flexShrink:0,borderTop:`0.5px solid ${pgLine}`,padding:'16px 24px',cursor:'pointer',WebkitTapHighlightColor:'transparent',display:'flex',alignItems:'center',justifyContent:'center',...pressed('pages:cta')}}>
        <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:pgAccent,lineHeight:1}}>How are you feeling?</div>
      </div>
    </div>
  );

  // ── MOOD PICKER VIEW ──
  // Exact reference: "How are you feeling?" large Italianno at top, date, then 12 dots centered
  if(view==='picker') return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:pageBg}}>
      {/* Centered content — vertically centered in available space */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,
        display:'flex',flexDirection:'column',justifyContent:'center',padding:'32px 24px'}}>
        {/* "How are you feeling?" — Italianno, large, exactly as reference */}
        <div style={{marginBottom:6}}>
          <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgInk,lineHeight:1,marginBottom:6}}>
            How are you feeling?
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>
            {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
          </div>
        </div>

        {/* 12 dots — 4 col grid, centered, medium size matching reference */}
        <div style={{marginTop:36,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'28px 8px',justifyItems:'center'}}>
          {MOODS.map(mood=>(
            <div key={mood.key} {...press(`mood:${mood.key}`)} onClick={()=>{setSelectedMood(mood);setView('writing');}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,cursor:'pointer',WebkitTapHighlightColor:'transparent',width:'100%',...pressed(`mood:${mood.key}`)}}>
              {/* Dot — 40px matching reference screenshot size */}
              <div style={{
                width:40,height:40,borderRadius:'50%',
                background:mood.color,
                flexShrink:0,
              }}/>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:9,letterSpacing:'.22em',
                textTransform:'uppercase' as any,
                color:pgInkMute,
                textAlign:'center' as any,
                lineHeight:1.3,
              }}>
                {mood.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── WRITING VIEW ──
  // Exact reference: top bar DISCARD · ● MOOD · SAVE, date, left journal rule, large text
  return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:pageBg}}>
      {/* Top action bar — exactly as reference */}
      <div style={{padding:'14px 20px',borderBottom:`0.5px solid ${pgLine}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <button onClick={()=>{setSelectedMood(null);setView('picker');}}
          style={{background:'none',border:'none',cursor:'pointer',padding:0,
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
            textTransform:'uppercase' as any,color:pgInkMute,display:'flex',alignItems:'center',gap:5}}>
          ← Discard
        </button>
        {/* Center mood indicator */}
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:selectedMood?.color,flexShrink:0}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:selectedMood?.color}}>{selectedMood?.label}</span>
        </div>
        <button onClick={saveEntry} disabled={!body.trim()||saving}
          style={{background:'none',border:'none',cursor:body.trim()&&!saving?'pointer':'default',padding:0,
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
            textTransform:'uppercase' as any,
            color:body.trim()&&!saving?pgAccent:pgInkMute}}>
          Save →
        </button>
      </div>

      {/* Date line */}
      <div style={{padding:'16px 24px 8px',flexShrink:0}}>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>
          {new Date().toLocaleDateString('en-IN',{weekday:'long',day:undefined as any,month:'long',year:'numeric'})}
        </div>
      </div>

      {/* Journal area — left rule + writing surface */}
      <div style={{flex:1,display:'flex',overflowY:'auto'}} className="no-scroll">
        {/* Left journal rule — thin vertical line, mood color */}
        <div style={{
          width:1,
          background:selectedMood?.color||pgAccent,
          opacity:.55,
          flexShrink:0,
          marginLeft:24,
          marginTop:4,
          marginBottom:24,
          borderRadius:1,
        }}/>
        {/* Writing surface */}
        <div style={{flex:1,padding:'4px 20px 48px 14px'}}>
          <textarea
            ref={textRef}
            value={body}
            onChange={e=>setBody(e.target.value)}
            onFocus={e=>{const el=e.target;setTimeout(()=>{el.scrollIntoView({block:'nearest'});el.style.height='auto';el.style.height=el.scrollHeight+'px';},150);}}
            placeholder="Write here…"
            style={{
              width:'100%',
              minHeight:300,
              background:'transparent',
              border:'none',outline:'none',
              color:pgInk,
              fontFamily:"'Fraunces',serif",
              fontStyle:'italic',fontWeight:300,
              fontSize:19,lineHeight:1.8,
              resize:'none',
              fontFeatureSettings:'"opsz" 9',
              userSelect:'text',WebkitUserSelect:'text' as any,
            }}
          />
        </div>
      </div>
    </div>
  );
}
