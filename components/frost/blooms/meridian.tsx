'use client';
// MeridianRoom — the concierge.
//
// TDW_13 · D-5 · VERBATIM RELOCATION, the same law D-4 ran under. This body is
// byte-identical to the lines it occupied in sanctuary/page.tsx at 66ea400.
// Only the import mechanism changed. No token conversion, no hygiene, no
// feature — those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FT, FS, FI } from '@/lib/frost/tokens';
import { Send } from 'lucide-react';
import { usePress } from '@/components/frost/_shared/usePress';
import { coupleAccessToken } from '@/components/frost/_shared/coupleAccessToken';

// ── MERIDIAN CONCIERGE CARD — FOLDED (Block 20 s1, R-41.19/.24, CE-41 seat A) ──
// WHAT THIS WAS: `MeridianConciergeBtn` fired `POST /couple/concierge/request`
// with `body:'{}'` and, on `ok`, showed a sentence claiming a concierge would
// reach her. The door is now a 308 to /api/v2/couple/assistance (dream-os
// 1feb1cc), the row it wrote is gone, and the sentence was STRUCK at the A1 veto.
// WHAT THIS IS: a card that NAVIGATES to the sheet. No POST remains in this file.
// Strings #36–#38 as vetoed 2026-09-08 (#38 is the founder's own phrase, kept by
// his word). The compact form (chat view) keeps its one existing word and
// navigates too. Control inventory (CE-115): the POST tap REMOVED-BY-RULING;
// chat input, send, history, Clear all KEPT byte-untouched below.

export const MERIDIAN_ASSIST_STRINGS = {
  title: 'Want a personal concierge?',                                                                  // #36 (ruled)
  body:  'The Dream Wedding finds and books your vendors — photography, makeup, décor, planning, all of it. One sheet.', // #37 (ruled)
  link:  'Ask a Personal Concierge →',                                                              // #38 (ruled, the founder's phrase)
  compact: 'Concierge',                                                                                 // existing byte, KEPT
} as const;

export const ASSIST_SHEET_PATH = '/frost/canvas/assistance';

interface MeridianConciergeCardProps { accent:string; dark:boolean; compact?:boolean; }

function MeridianConciergeCard({ accent, dark, compact=false }: MeridianConciergeCardProps) {
  const router = useRouter();
  const { press, pressed } = usePress();
  void dark;
  const go = () => router.push(ASSIST_SHEET_PATH);

  const ink     = '#F0EDE8';
  const inkSoft = 'rgba(240,237,232,.62)';
  const cardBg  = 'rgba(240,237,232,.04)';
  const cardBdr = 'rgba(240,237,232,.10)';

  if (compact) {
    return (
      <div onClick={go} {...press('concierge:compact')} style={{cursor:'pointer',WebkitTapHighlightColor:'transparent',display:'flex',alignItems:'center',gap:8,...pressed('concierge:compact')}}>
        <div style={{width:32,height:2,borderRadius:1,background:`linear-gradient(90deg,transparent,${accent},transparent)`}}/>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent}}>
          {MERIDIAN_ASSIST_STRINGS.compact}
        </span>
      </div>
    );
  }

  return (
    <div style={{padding:'0 16px 4px'}}>
      <div onClick={go} {...press('concierge:full')} style={{cursor:'pointer',WebkitTapHighlightColor:'transparent',padding:'16px 18px',borderRadius:10,background:cardBg,border:`0.5px solid ${cardBdr}`,...pressed('concierge:full')}}>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,lineHeight:1.25,fontFeatureSettings:'"opsz" 9'}}>{MERIDIAN_ASSIST_STRINGS.title}</div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:inkSoft,marginTop:6,lineHeight:1.5}}>{MERIDIAN_ASSIST_STRINGS.body}</div>
        <div style={{marginTop:12,fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase' as any,color:accent}}>{MERIDIAN_ASSIST_STRINGS.link}</div>
      </div>
    </div>
  );
}

// ── MERIDIAN ROOM ─────────────────────────────────────────────────────────────
// Personal concierge — skin, mind, body, decisions.
// Always dark. Separate from DreamAi — different context, different persona.
// V1: AI only (Haiku). V2: AI + human escalation (Platinum tier).

interface MeridianMsg { id:string; role:'user'|'assistant'; content:string; pending?:boolean; error?:boolean; }

// Editorial cards — static content keyed to days remaining
function getMeridianCards(days:number|null): {title:string;body:string;tag:string}[] {
  if(days===null||days>180) return [
    { title:'The 180-day window.',       tag:'skin',  body:'This is the time to audit. See your dermatologist. Start with basics — SPF, Vitamin C, retinol at night. The work you do now shows on your wedding day.' },
    { title:'Ubtan. Every week.',        tag:'ritual',body:'Rice flour, turmeric, raw milk. Apply and leave for 20 minutes. Your skin has time to adapt and reward you. Make it a ritual, not a task.' },
    { title:'Water before everything.', tag:'body',  body:'Three litres a day. Not juice. Not chai. Water. The simplest thing nobody does consistently. Start now when the stakes are low.' },
  ];
  if(days>90) return [
    { title:'The glow is built now.',   tag:'skin',  body:'If you have not started hair oiling, start this week. Coconut or Bhringraj, overnight, twice a week. The difference by the wedding day is real.' },
    { title:'Skin cycle locked.',       tag:'skin',  body:'Stop experimenting with new products. You should know what works for your skin by now. Maintain, don’t explore.' },
    { title:'The sleep question.',      tag:'mind',  body:'Seven hours is not negotiable. Cortisol from poor sleep undoes every facial. Your skin repairs at night. Protect that window.' },
  ];
  if(days>60) return [
    { title:'No new treatments.',       tag:'skin',  body:'This is not the time for a new peel or a new serum. What you have been doing is working. Protect the progress.' },
    { title:'Trial week ritual.',       tag:'ritual',body:'The week before your mehendi trial — no facials, no threading, nothing that causes redness. Let your skin rest and show up calm.' },
    { title:'Breathe before deciding.', tag:'mind',  body:'Every decision feels enormous right now. Most are not. When you feel overwhelmed, give it 24 hours before acting.' },
  ];
  if(days>30) return [
    { title:'Final stretch.',           tag:'skin',  body:'Hydration, sleep, and your existing routine. That is the entire protocol. Nothing new touches your face this month.' },
    { title:'The anxiety is normal.',   tag:'mind',  body:'Every bride feels it. The chaos is not a sign things are going wrong. It is the sign that something beautiful is coming.' },
    { title:'Eat properly.',            tag:'body',  body:'Not a diet. Not a restriction. Eat for energy — protein, good fats, vegetables. You need strength for the days ahead.' },
  ];
  return [
    { title:'You are almost there.',    tag:'mind',  body:'This week — sleep. Hydrate. Do not start anything new. Let the people who love you carry things. Your job is to arrive glowing.' },
    { title:'The morning ritual.',      tag:'skin',  body:'Gentle cleanser, Vitamin C, SPF. That is it. No masks, no peels, no experiments. Simple, consistent, protected.' },
    { title:'One thing at a time.',     tag:'mind',  body:'Whatever feels urgent right now — give it one decision at a time. You have handled everything so far. You will handle this too.' },
  ];
}

interface MeridianRoomProps { dark:boolean; accent:string; }

export function MeridianRoom({ accent, dark }: MeridianRoomProps) {
  const [msgs,    setMsgs]    = React.useState<MeridianMsg[]>([]);
  const [input,   setInput]   = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [days,    setDays]    = React.useState<number|null>(null);
  const scrollRef  = React.useRef<HTMLDivElement>(null);
  const textRef    = React.useRef<HTMLTextAreaElement>(null);
  const cancelRef  = React.useRef<(()=>void)|null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE||'https://dream-os-production.up.railway.app';
  const cards = getMeridianCards(days);

  React.useEffect(()=>{
    try {
      const raw = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
      if(raw){const s=JSON.parse(raw);if(s?.wedding_date){const d=Math.max(0,Math.round((new Date(s.wedding_date).getTime()-Date.now())/86400000));setDays(d);}}
    } catch{}
  },[]);

  React.useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },[msgs]);
  React.useEffect(()=>{ if(!textRef.current)return;textRef.current.style.height='auto';textRef.current.style.height=Math.min(textRef.current.scrollHeight,100)+'px'; },[input]);
  React.useEffect(()=>()=>{cancelRef.current?.();},[]);

  function uid(){return Math.random().toString(36).slice(2);}

  const send = React.useCallback((text:string)=>{
    const msg = text.trim();
    if(!msg||loading)return;
    setInput('');
    const userMsg:MeridianMsg = {id:uid(),role:'user',content:msg};
    setMsgs(prev=>[...prev,userMsg]);
    setLoading(true);
    const aiId = uid();
    setMsgs(prev=>[...prev,{id:aiId,role:'assistant',content:'',pending:true}]);

    // F-07.70 · DISCLOSED DEVIATION-BY-INCLUSION. The ruling named SIX fallback
    // sites carrying `bare || s?.token || s?.access_token`. This is a SEVENTH,
    // spelled differently (`bare || raw.access_token`) and therefore missed by the
    // read-first's shape-match. It is the same class — the same demo-lane blob
    // fallback, strictly narrower — so it adopts the same helper rather than being
    // left as the one direct read the boundary cell would then have to excuse.
    const token = coupleAccessToken();

    const ctrl = new AbortController();
    cancelRef.current = ()=>ctrl.abort();

    fetch(`${API}/api/v2/couple/meridian/chat`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${token||''}`},
      body:JSON.stringify({message:msg}),
      signal:ctrl.signal,
    }).then(res=>{
      if(!res.body)throw new Error('no body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      const pump = async () => {
        while(true){
          const {done,value} = await reader.read();
          if(done)break;
          buf += decoder.decode(value,{stream:true});
          const lines = buf.split('\n');
          buf = lines.pop()||'';
          for(const line of lines){
            if(!line.startsWith('data:'))continue;
            const raw2 = line.slice(5).trim();
            if(raw2==='[DONE]')break;
            try{
              const ev = JSON.parse(raw2);
              if(ev.type==='text_delta'){
                setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:m.content+ev.text,pending:false}:m));
              } else if(ev.type==='done'||ev.type==='error'){
                if(ev.type==='error') setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:ev.text||'Something went wrong.',error:true,pending:false}:m));
              }
            }catch{}
          }
        }
      };
      return pump();
    }).catch(err=>{
      if(err.name!=='AbortError') setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:'Something went wrong. Try again.',error:true,pending:false}:m));
    }).finally(()=>{
      setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,pending:false}:m));
      setLoading(false);
      cancelRef.current=null;
    });
  },[loading,API]);

  const ink      = '#F0EDE8';
  const inkSoft  = 'rgba(240,237,232,.70)';
  const inkMute  = 'rgba(240,237,232,.35)';
  const line     = 'rgba(240,237,232,.08)';
  const cardBg   = 'rgba(240,237,232,.04)';
  const cardBdr  = 'rgba(240,237,232,.10)';
  const inputBg  = 'rgba(240,237,232,.05)';
  const inputBdr = 'rgba(240,237,232,.16)';
  const compBg   = 'rgba(8,6,8,.90)';
  const aiBubble = 'rgba(240,237,232,.05)';
  const aiBubBdr = 'rgba(240,237,232,.10)';

  const tagColors:{[k:string]:string} = {skin:'#C4856A',ritual:'#C9A84C',body:'#6B9E8F',mind:'#8B7EC4'};

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:'linear-gradient(180deg,#0E0608 0%,#080608 100%)',overflow:'hidden'}}>

      {/* Editorial cards */}
      {msgs.length===0&&(
        <>
          {/* Header */}
          <div style={{padding:'20px 20px 14px',borderBottom:`0.5px solid ${line}`,flexShrink:0}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:ink,lineHeight:1,marginBottom:4}}>Meridian</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>
              Your personal concierge. Skin, mind, body, decisions.
            </div>
            {days!==null&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent,marginTop:6}}>
              {days} days to go
            </div>}
          </div>

          {/* Scrollable cards */}
          <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,padding:'16px 0'}}>
            {cards.map((card,i)=>(
              <div key={i} style={{margin:'0 16px 12px',padding:'16px 18px',borderRadius:10,background:cardBg,border:`0.5px solid ${cardBdr}`}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:tagColors[card.tag]||accent,border:`0.5px solid ${(tagColors[card.tag]||accent)}44`,borderRadius:4,padding:'2px 7px'}}>
                    {card.tag}
                  </span>
                </div>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:ink,lineHeight:1.2,marginBottom:8,fontFeatureSettings:'"opsz" 9'}}>{card.title}</div>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkSoft,lineHeight:1.7,fontFeatureSettings:'"opsz" 9'}}>{card.body}</div>
              </div>
            ))}

            {/* Prompt to start */}
            <div style={{padding:'20px 20px 8px',textAlign:'center' as any}}>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:inkMute,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>
                Tell me what’s on your mind.
              </div>
            </div>

            {/* Concierge heartbeat button */}
            <MeridianConciergeCard accent={accent} dark={dark}/>

            <div style={{height:80}}/>
          </div>
        </>
      )}

      {/* Chat history */}
      {msgs.length>0&&(
        <div ref={scrollRef} className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,padding:'16px 16px 8px'}}>
          {msgs.map(m=>(
            <div key={m.id} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start',marginBottom:10}}>
              {m.role==='user'?(
                <div style={{maxWidth:'82%',background:accent,color:'#0C0A09',padding:'10px 14px',borderRadius:'20px 20px 4px 20px',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1.55,fontFeatureSettings:'"opsz" 9',userSelect:'text' as any}}>
                  {m.content}
                </div>
              ):m.pending&&m.content===''?(
                <div style={{background:aiBubble,border:`0.5px solid ${aiBubBdr}`,padding:'10px 16px',borderRadius:'20px 20px 20px 4px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)'}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent,animation:'dpulse 1.4s infinite ease-in-out'}}>✦</span>
                </div>
              ):(
                <div style={{maxWidth:'90%',background:aiBubble,border:`0.5px solid ${aiBubBdr}`,padding:'12px 16px',borderRadius:'20px 20px 20px 4px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1.65,color:m.error?'#C4534A':ink,whiteSpace:'pre-wrap',fontFeatureSettings:'"opsz" 9',userSelect:'text' as any}}>
                  {m.content}
                  {m.pending&&<span style={{opacity:.5,color:accent}}>▌</span>}
                </div>
              )}
            </div>
          ))}
          <div style={{height:10}}/>
        </div>
      )}

      {/* Compose */}
      <div style={{background:compBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',borderTop:`0.5px solid ${line}`,padding:`12px 16px calc(12px + env(safe-area-inset-bottom,0px))`,flexShrink:0}}>
        <div style={{display:'flex',gap:10,alignItems:'flex-end',background:inputBg,border:`0.5px solid ${inputBdr}`,borderRadius:20,padding:'8px 10px 8px 16px'}}>
          <textarea ref={textRef} value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input);}}}
            placeholder="Tell me what’s troubling you, or what you need…"
            disabled={loading} rows={1}
            style={{flex:1,background:'transparent',border:'none',outline:'none',color:ink,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,resize:'none',maxHeight:100,lineHeight:1.5,fontFeatureSettings:'"opsz" 9',userSelect:'text',WebkitUserSelect:'text' as any}}/>
          <button onClick={()=>send(input)} disabled={loading||!input.trim()}
            style={{background:input.trim()&&!loading?accent:'rgba(240,237,232,.08)',color:input.trim()&&!loading?'#0C0A09':'rgba(240,237,232,.3)',border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!loading?'pointer':'default',transition:'background 200ms ease',flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        {msgs.length>0&&<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:6,padding:'0 2px'}}>
          <button onClick={()=>{cancelRef.current?.();setMsgs([]);setLoading(false);}} style={{background:'none',border:'none',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,padding:0}}>
            Clear
          </button>
          <MeridianConciergeCard accent={accent} dark={dark} compact/>
        </div>}
      </div>
    </div>
  );
}
