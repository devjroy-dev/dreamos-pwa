'use client';

// sanctuary/page.tsx — V5 BLOOM ARCHITECTURE
// Every slice opens IN THIS PAGE. No router.push. No history stack.
// She taps a slice → it blooms up from position → fills screen.
// She swipes down or taps ← → contracts back to Sanctuary.
// Same URL. Same component. Sanctuary is always underneath.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import { EASE, FROST_COPY, daysUntil } from '../../../../../lib/frost/tokens';
import { Send } from 'lucide-react';
import { streamBrideChat } from '../../../../../lib/frost-api/couple';
import { fetchCircle, inviteCircleMember, timeAgo, formatActivityLine, fetchEvents, type CircleData, type CircleActivity, type CoupleEvent } from '../../../../../lib/frost/journey';

// ── Types ─────────────────────────────────────────────────────────────────────
type RoomKey = 'dream'|'circle'|'muse'|'discover'|'people'|'pages'|'moments'|'events'|'meridian'|null;

interface UIMsg {
  id: string; role:'user'|'assistant'; content:string; pending?:boolean; error?:boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const DEMO_WEDDING    = new Date('2026-11-19T00:00:00+05:30');
const DEMO_ENGAGEMENT = new Date('2026-04-11T00:00:00+05:30');

function getWeddingDate():Date{ try{const r=localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');if(r){const s=JSON.parse(r);if(s?.wedding_date)return new Date(s.wedding_date);}}catch{}return DEMO_WEDDING; }
function getEngagementDate():Date{ try{const r=localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');if(r){const s=JSON.parse(r);if(s?.engagement_date)return new Date(s.engagement_date);}}catch{}return DEMO_ENGAGEMENT; }
function getBrideName():string{ try{const r=localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');if(r){const s=JSON.parse(r);const n=(s?.user_name||s?.bride_name||s?.name||'').trim().split(' ')[0];if(n)return n;}}catch{}return 'Priya'; }
function daysSince(d:Date):number{const t=new Date();t.setHours(0,0,0,0);const e=new Date(d);e.setHours(0,0,0,0);return Math.max(0,Math.round((t.getTime()-e.getTime())/86400000));}
function arcProgress(d:number):number{return Math.max(0,Math.min(1,1-d/365));}
function arcPoint(t:number){const p0={x:18,y:92},p1={x:160,y:4},p2={x:302,y:92};const u=1-t;return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y};}
function arcPathTo(t:number):string{if(t<=0)return'M 18 92';const p0={x:18,y:92},p1={x:160,y:4},p2={x:302,y:92};const q0={x:p0.x+(p1.x-p0.x)*t,y:p0.y+(p1.y-p0.y)*t};const q1={x:p1.x+(p2.x-p1.x)*t,y:p1.y+(p2.y-p1.y)*t};const ep={x:q0.x+(q1.x-q0.x)*t,y:q0.y+(q1.y-q0.y)*t};return`M 18 92 Q ${q0.x.toFixed(1)} ${q0.y.toFixed(1)} ${ep.x.toFixed(1)} ${ep.y.toFixed(1)}`;}
const ONES=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const TENS=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
function toW(n:number):string{if(n<20)return ONES[n]||String(n);const t=Math.floor(n/10),o=n%10;if(!o)return TENS[t];return`${TENS[t]}-${ONES[o].toLowerCase()}`;}
function bigW(n:number):string{if(n<100)return toW(n);const h=Math.floor(n/100),r=n%100;return ONES[h]+' hundred'+(r?' and '+toW(r).toLowerCase():'');}
function dW(n:number):string{if(n<100)return toW(n);if(n<1000)return bigW(n);return String(n);}
function prose(d:number):string{if(d===0)return'Today.';const w=dW(d);return`${w.charAt(0).toUpperCase()+w.slice(1)} mornings between I will and I do.`;}
function romanDate():string{const n=new Date(),R=['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];return`${String(n.getDate()).padStart(2,'0')} · ${R[n.getMonth()+1]} · ${String(n.getFullYear()).slice(-2)}`;}
function getDailyPoetry():string{const pool=FROST_COPY.idlePool;const d=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000);return pool[d%pool.length];}
function uid(){return Math.random().toString(36).slice(2);}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS=`
@keyframes gnB{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.006);}}
@keyframes numB{0%,100%{transform:scale(1);}50%{transform:scale(1.003);}}
@keyframes dC{0%,37%,100%{opacity:.42;}18%{opacity:1;}}
@keyframes dH{0%,37%,100%{opacity:.15;}18%{opacity:.58;}}
@keyframes dO{0%,37%,100%{opacity:.05;}18%{opacity:.22;}}
@keyframes cF{0%{opacity:.7}15%{opacity:1}28%{opacity:.85}45%{opacity:1}60%{opacity:.88}75%{opacity:1}88%{opacity:.72}100%{opacity:.7}}
@keyframes sIn{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:translateY(0);}}
@keyframes bloomIn{from{opacity:0;transform:translateY(100%);}to{opacity:1;transform:translateY(0);}}
@keyframes bloomOut{from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(100%);}}
@keyframes dpulse{0%,80%,100%{opacity:.35}40%{opacity:1}}
@keyframes dcursor{0%,100%{opacity:1}50%{opacity:0}}
.gn-a{animation:gnB 9s ease-in-out infinite;}
.num-a{animation:numB 7s ease-in-out infinite;}
.dc-a{animation:dC 4s ease-in-out infinite;}
.dh-a{animation:dH 4s ease-in-out infinite;}
.do-a{animation:dO 4s ease-in-out infinite;}
.cf-a{animation:cF 5s ease-in-out infinite;}
.si-a{animation:sIn 220ms cubic-bezier(0.22,1,0.36,1) forwards;}
.bloom-enter{animation:bloomIn 380ms cubic-bezier(0.22,1,0.36,1) forwards;}
.bloom-exit{animation:bloomOut 300ms cubic-bezier(0.4,0,1,1) forwards;}
.d-cursor{animation:dcursor 1s ease-in-out infinite;}
.no-scroll::-webkit-scrollbar{display:none;}
.no-scroll{-ms-overflow-style:none;scrollbar-width:none;}
`;

const SLICES=[
  {key:'dream'   as RoomKey, label:'Dream Ai',  hint:'Something will go wrong…',   candle:false, premium:false},
  {key:'circle'  as RoomKey, label:'Circle',    hint:'Meha lit a candle · 8m ago', candle:true,  premium:false},
  {key:'muse'    as RoomKey, label:'Muse',      hint:'22 saved · 4 new',           candle:false, premium:false},
  {key:'discover'as RoomKey, label:'Discover',  hint:'Your curated world',          candle:false, premium:false},
  {key:'people'  as RoomKey, label:'My People', hint:'1 active · 1 invited',       candle:false, premium:false},
  {key:'pages'   as RoomKey, label:'Pages',     hint:'a page is waiting',           candle:false, premium:false},
  {key:'moments' as RoomKey, label:'Moments',   hint:'Your memories',               candle:false, premium:false},
  {key:'events'  as RoomKey, label:'Events',    hint:'Your timeline',               candle:false, premium:false},
  {key:'meridian'as RoomKey, label:'Meridian',  hint:'Skin · mind · body',          candle:false, premium:true},
];

const JOURNEY_LINKS=[
  {label:'Expenses',  hint:'₹2.4L logged'},
  {label:'Vendors',   hint:'4 confirmed'},
  {label:'Settings',  hint:''},
];

const DREAM_PROMPTS=[
  'How many days until my wedding?',
  "What's on my calendar this week?",
  "Who's in my Circle?",
  'What have I saved to Muse?',
  'How much have I spent so far?',
];

// ── Root component ────────────────────────────────────────────────────────────


// ── EVENTS ROOM ───────────────────────────────────────────────────────────────
const KIND_CHIP: Record<string,{label:string;color:string}> = {
  trial:    {label:'Trial',     color:'#D4848A'},
  fitting:  {label:'Fitting',   color:'#9B8DC4'},
  shoot:    {label:'Shoot',     color:'#6B7FA8'},
  recce:    {label:'Recce',     color:'#7A8A8A'},
  meeting:  {label:'Meeting',   color:'#C4A83A'},
  call:     {label:'Call',      color:'#5A9E7A'},
  family:   {label:'Family',    color:'#D4956A'},
  ceremony: {label:'Ceremony',  color:'#C4856A'},
  social:   {label:'Social',    color:'#D4848A'},
  reminder: {label:'Reminder',  color:'#8A9DB5'},
  task:     {label:'Task',      color:'#7A8A8A'},
  other:    {label:'Other',     color:'#B8B0C0'},
};

interface EventsRoomProps {
  dark:boolean; accent:string; signal:string;
  roomInk:string; roomInkSoft:string; roomInkMute:string; roomLine:string;
}

function EventsRoom({ dark, accent, roomInk, roomInkSoft, roomInkMute }: EventsRoomProps) {
  const [events,  setEvents]  = React.useState<CoupleEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter,  setFilter]  = React.useState<string>('all');

  const evBg = dark
    ? 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.14) 0%,transparent 52%),radial-gradient(ellipse 60% 50% at 15% 100%,rgba(80,10,25,.60) 0%,transparent 55%),linear-gradient(160deg,#1A0A0E 0%,#120608 35%,#0C0404 65%,#180610 100%)'
    : 'linear-gradient(160deg,#E8ECF4 0%,#DDE2EE 35%,#D0D6E8 65%,#C8D0E4 100%)';

  const pgInk     = dark ? '#F5E5DC' : '#0C1830';
  const pgInkSoft = dark ? 'rgba(245,229,220,.72)' : 'rgba(12,24,48,.68)';
  const pgInkMute = dark ? 'rgba(196,133,106,.48)' : 'rgba(42,80,130,.52)';
  const pgLine    = dark ? 'rgba(196,133,106,.12)' : 'rgba(42,80,130,.16)';
  const pgAccent  = dark ? '#C4856A' : '#2A5F82';

  React.useEffect(()=>{
    fetchEvents('upcoming').then(e=>{ setEvents(e); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  const filtered = filter==='all' ? events : events.filter(e=>e.kind===filter);
  const groups: Record<string, CoupleEvent[]> = {};
  filtered.forEach(e=>{
    if(!groups[e.event_date]) groups[e.event_date]=[];
    groups[e.event_date].push(e);
  });
  const sortedDates = Object.keys(groups).sort();

  function formatEventDate(iso: string): string {
    const d = new Date(iso+'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const diff = Math.round((d.getTime()-today.getTime())/86400000);
    if(diff===0) return 'Today';
    if(diff===1) return 'Tomorrow';
    if(diff>1&&diff<7) return d.toLocaleDateString('en-IN',{weekday:'long'});
    return d.toLocaleDateString('en-IN',{day:'numeric',month:'long'});
  }

  function formatTime(t:string|null):string {
    if(!t) return '';
    const [h,m]=t.split(':');
    const hr=parseInt(h);
    return `${hr>12?hr-12:hr||12}:${m} ${hr>=12?'PM':'AM'}`;
  }

  const kinds = ['all',...Array.from(new Set(events.map(e=>e.kind)))];

  return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:evBg}}>
      {/* Filter pills */}
      <div style={{padding:'12px 20px',borderBottom:`0.5px solid ${pgLine}`,flexShrink:0,overflowX:'auto' as any,display:'flex',gap:8,WebkitOverflowScrolling:'touch' as any}}>
        {kinds.map(k=>{
          const chip = k==='all' ? {label:'All',color:pgAccent} : (KIND_CHIP[k]||{label:k,color:pgAccent});
          const active = filter===k;
          return(
            <div key={k} onClick={()=>setFilter(k)}
              style={{flexShrink:0,padding:'5px 12px',borderRadius:100,cursor:'pointer',
                background:active?(dark?`${chip.color}22`:`${chip.color}18`):'transparent',
                border:`0.5px solid ${active?chip.color:pgLine}`,
                fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.16em',
                textTransform:'uppercase' as any,color:active?chip.color:pgInkMute,
                transition:'all 180ms ease',WebkitTapHighlightColor:'transparent'}}>
              {chip.label}
            </div>
          );
        })}
      </div>
      {/* Timeline */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading ? (
          <div style={{padding:32,textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>loading…</div>
        ) : filtered.length===0 ? (
          <div style={{padding:'64px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:42,color:pgAccent,lineHeight:1,textAlign:'center' as any}}>Nothing<br/>yet.</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:13,color:pgInkSoft,textAlign:'center' as any,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>Tell Dream Ai to add something<br/>to your calendar.</div>
          </div>
        ) : (
          <div style={{padding:'8px 0 32px'}}>
            {sortedDates.map(date=>(
              <div key={date}>
                <div style={{padding:'16px 20px 8px',display:'flex',alignItems:'center',gap:12}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,color:pgAccent,fontFeatureSettings:'"opsz" 9'}}>{formatEventDate(date)}</div>
                  <div style={{flex:1,height:.5,background:pgLine}}/>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.14em',color:pgInkMute}}>{new Date(date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                </div>
                {groups[date].map(ev=>{
                  const chip = KIND_CHIP[ev.kind]||{label:ev.kind,color:pgAccent};
                  return(
                    <div key={ev.id} style={{margin:'0 20px 10px',borderRadius:6,
                      background:dark?'rgba(196,133,106,.05)':'rgba(42,95,130,.05)',
                      border:`0.5px solid ${dark?'rgba(196,133,106,.12)':'rgba(42,95,130,.12)'}`,
                      padding:'12px 14px',display:'flex',gap:12}}>
                      <div style={{width:2,background:chip.color,borderRadius:1,flexShrink:0,opacity:.8}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.14em',textTransform:'uppercase' as any,color:chip.color}}>{chip.label}</span>
                          {ev.event_time&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.1em',color:pgInkMute,marginLeft:'auto'}}>{formatTime(ev.event_time)}</span>}
                        </div>
                        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,color:pgInk,lineHeight:1.4,fontFeatureSettings:'"opsz" 9',marginBottom:ev.notes?5:0}}>{ev.title}</div>
                        {ev.notes&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:12,color:pgInkSoft,lineHeight:1.5,fontFeatureSettings:'"opsz" 9'}}>{ev.notes}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ── CIRCLE ROOM ───────────────────────────────────────────────────────────────
interface CircleRoomProps {
  dark:boolean; accent:string; signal:string;
  roomInk:string; roomInkSoft:string; roomInkMute:string; roomLine:string;
}

const ROLE_LABELS: Record<string,string> = {
  partner:'Partner · Fiancé',
  family:'Family',
  inner_circle:'Inner Circle',
};

function CircleRoom({ dark, accent, signal, roomInk, roomInkSoft, roomInkMute, roomLine }: CircleRoomProps) {
  const [data,        setData]        = React.useState<CircleData|null>(null);
  const [loading,     setLoading]     = React.useState(true);
  const [view,        setView]        = React.useState<'feed'|'invite'>('feed');
  const [inviteName,  setInviteName]  = React.useState('');
  const [inviteRole,  setInviteRole]  = React.useState('family');
  const [inviting,    setInviting]    = React.useState(false);
  const [waLink,      setWaLink]      = React.useState<string|null>(null);

  const circleBg = dark
    ? 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.14) 0%,transparent 52%),radial-gradient(ellipse 60% 50% at 15% 100%,rgba(80,10,25,.60) 0%,transparent 55%),linear-gradient(160deg,#1A0A0E 0%,#120608 35%,#0C0404 65%,#180610 100%)'
    : 'linear-gradient(160deg,#E8ECF4 0%,#DDE2EE 35%,#D0D6E8 65%,#C8D0E4 100%)';

  const pgInk     = dark ? '#F5E5DC' : '#0C1830';
  const pgInkSoft = dark ? 'rgba(245,229,220,.72)' : 'rgba(12,24,48,.68)';
  const pgInkMute = dark ? 'rgba(196,133,106,.48)' : 'rgba(42,80,130,.52)';
  const pgLine    = dark ? 'rgba(196,133,106,.12)' : 'rgba(42,80,130,.16)';
  const pgAccent  = dark ? '#C4856A' : '#2A5F82';
  const candleBg  = dark ? 'rgba(196,133,106,.08)' : 'rgba(42,95,130,.06)';
  const candleBdr = dark ? 'rgba(196,133,106,.18)' : 'rgba(42,95,130,.16)';

  React.useEffect(()=>{
    fetchCircle().then(d=>{ setData(d); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  const doInvite = async () => {
    if(!inviteName.trim()||inviting) return;
    setInviting(true);
    try {
      const r = await inviteCircleMember({invitee_name:inviteName.trim(),role:inviteRole});
      setWaLink(r.wa_me_link);
    } catch(e){ console.error(e); }
    finally{ setInviting(false); }
  };

  const members  = data?.members         || [];
  const activity = data?.activity        || [];
  const pending  = data?.pending_invites || [];

  // ── INVITE VIEW ──
  if(view==='invite') return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:circleBg}}>
      <div style={{padding:'24px 24px 16px',borderBottom:`0.5px solid ${pgLine}`,flexShrink:0}}>
        <div style={{fontFamily:"'Italianno',cursive",fontSize:42,color:pgAccent,lineHeight:1,marginBottom:6}}>Invite to Circle</div>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:13,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>Up to 3 people. They can add to your Muse board.</div>
      </div>

      {waLink ? (
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32,gap:20}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:18,color:pgInk,textAlign:'center' as any,lineHeight:1.5,fontFeatureSettings:'"opsz" 9'}}>
            Invite link ready.<br/>Send it on WhatsApp.
          </div>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',justifyContent:'center',
              padding:'12px 28px',borderRadius:4,
              background:pgAccent,color:dark?'#1A0810':'#FFFFFF',
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,textDecoration:'none',cursor:'pointer'}}>
            Open WhatsApp →
          </a>
          <button onClick={()=>{setWaLink(null);setInviteName('');setView('feed');}}
            style={{background:'none',border:'none',cursor:'pointer',
              fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.18em',
              textTransform:'uppercase' as any,color:pgInkMute,padding:0}}>
            Back to Circle
          </button>
        </div>
      ) : (
        <div style={{flex:1,padding:'24px',display:'flex',flexDirection:'column',gap:20}}>
          {/* Name input */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:8}}>Their name</div>
            <input value={inviteName} onChange={e=>setInviteName(e.target.value)}
              placeholder="e.g. Mom, Priya, Anjali"
              style={{width:'100%',background:'transparent',border:`0.5px solid ${pgLine}`,borderRadius:4,
                padding:'12px 14px',color:pgInk,
                fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,
                fontFeatureSettings:'"opsz" 9',outline:'none',
                boxSizing:'border-box' as any}}/>
          </div>
          {/* Role selector */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:8}}>Relationship</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {['partner','family','inner_circle'].map(r=>(
                <div key={r} onClick={()=>setInviteRole(r)}
                  style={{padding:'10px 14px',borderRadius:4,border:`0.5px solid ${inviteRole===r?pgAccent:pgLine}`,cursor:'pointer',
                    background:inviteRole===r?(dark?'rgba(196,133,106,.08)':'rgba(42,95,130,.06)'):'transparent',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:15,
                    color:inviteRole===r?pgAccent:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>
                  {ROLE_LABELS[r]}
                </div>
              ))}
            </div>
          </div>
          {/* Send button */}
          <button onClick={doInvite} disabled={!inviteName.trim()||inviting}
            style={{padding:'13px',borderRadius:4,border:'none',cursor:inviteName.trim()&&!inviting?'pointer':'default',
              background:inviteName.trim()&&!inviting?pgAccent:'rgba(128,128,128,.15)',
              color:inviteName.trim()&&!inviting?(dark?'#1A0810':'#FFFFFF'):pgInkMute,
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,transition:'all 200ms ease'}}>
            {inviting?'Generating link…':'Generate invite link'}
          </button>
        </div>
      )}
    </div>
  );

  // ── FEED VIEW ──
  return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:circleBg}}>

      {/* Members row */}
      <div style={{padding:'16px 20px',borderBottom:`0.5px solid ${pgLine}`,flexShrink:0}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:12}}>Your Circle</div>
        <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap' as any}}>
          {loading?(
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:pgInkMute,letterSpacing:'.18em'}}>loading…</div>
          ):members.length===0&&pending.length===0?(
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:14,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>No one yet. Invite someone.</div>
          ):(
            <>
              {members.map(m=>(
                <div key={m.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  {/* Avatar circle */}
                  <div style={{width:44,height:44,borderRadius:'50%',
                    background:dark?'rgba(196,133,106,.15)':'rgba(42,95,130,.12)',
                    border:`1.5px solid ${pgAccent}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:18,color:pgAccent}}>
                    {(m.invitee_name||'?')[0]}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6,letterSpacing:'.14em',textTransform:'uppercase' as any,color:pgInkMute,textAlign:'center' as any}}>
                    {m.invitee_name?.split(' ')[0]}
                  </div>
                  {/* Active candle dot */}
                  {m.state==='active'&&(
                    <div className="cf-a" style={{width:4,height:4,borderRadius:'50%',background:signal,boxShadow:`0 0 5px ${signal}`}}/>
                  )}
                </div>
              ))}
              {/* Pending invites */}
              {pending.map(p=>(
                <div key={p.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  <div style={{width:44,height:44,borderRadius:'50%',
                    border:`1.5px dashed ${pgLine}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:pgInkMute}}>
                    ?
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6,letterSpacing:'.12em',textTransform:'uppercase' as any,color:pgInkMute,textAlign:'center' as any}}>
                    {p.invitee_name?.split(' ')[0]}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:5.5,color:pgInkMute,letterSpacing:'.1em',textTransform:'uppercase' as any}}>pending</div>
                </div>
              ))}
            </>
          )}
          {/* Add button */}
          {members.length < 3 && (
            <div onClick={()=>setView('invite')} style={{width:44,height:44,borderRadius:'50%',
              border:`1px dashed ${pgLine}`,
              display:'flex',alignItems:'center',justifyContent:'center',
              cursor:'pointer',WebkitTapHighlightColor:'transparent',color:pgInkMute,fontSize:20,fontWeight:200}}>
              +
            </div>
          )}
        </div>
      </div>

      {/* Activity feed */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading?(
          <div style={{padding:32,textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>loading…</div>
        ):activity.length===0?(
          <div style={{padding:'48px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:38,color:pgAccent,lineHeight:1,textAlign:'center' as any}}>Quiet here<br/>for now.</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:13,color:pgInkSoft,textAlign:'center' as any,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>When your Circle saves something<br/>or sends a message, it appears here.</div>
          </div>
        ):(
          <div>
            {activity.map(a=>(
              <div key={a.id} style={{padding:'14px 20px',borderBottom:`0.5px solid ${pgLine}`,display:'flex',gap:12,alignItems:'flex-start'}}>
                {/* Activity dot */}
                <div style={{width:7,height:7,borderRadius:'50%',background:pgAccent,flexShrink:0,marginTop:5,opacity:.7}}/>
                <div style={{flex:1}}>
                  {/* Save with image */}
                  {a.activity_type==='save_added'&&a.image_url&&(
                    <div style={{width:'100%',height:120,borderRadius:6,overflow:'hidden',marginBottom:8,background:dark?'rgba(196,133,106,.06)':'rgba(42,95,130,.06)'}}>
                      <img src={a.image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} loading="lazy"/>
                    </div>
                  )}
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,color:pgInk,lineHeight:1.55,fontFeatureSettings:'"opsz" 9',marginBottom:4}}>
                    {a.content || formatActivityLine(a)}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {/* Candle dot for recent activity */}
                    {Date.now()-new Date(a.created_at).getTime()<600000&&(
                      <span className="cf-a" style={{width:4,height:4,borderRadius:'50%',background:signal,boxShadow:`0 0 4px ${signal}`,flexShrink:0}}/>
                    )}
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.14em',textTransform:'uppercase' as any,color:pgInkMute}}>
                      {a.member_name||'You'} · {timeAgo(a.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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

function PagesRoom({ dark, accent, signal, roomInk, roomInkSoft, roomInkMute, roomLine }: PagesRoomProps) {
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
        const raw = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
        if(!raw) return;
        const s = JSON.parse(raw);
        const coupleId = s?.coupleId||s?.id;
        const token = s?.token||s?.access_token;
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

  const saveEntry = async () => {
    if(!selectedMood||!body.trim()||saving) return;
    setSaving(true);
    try {
      const raw = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
      if(!raw) return;
      const s = JSON.parse(raw);
      const token = s?.token||s?.access_token;
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
    ? 'linear-gradient(180deg,#14080C 0%,#0C0405 100%)'
    : 'linear-gradient(160deg,#E8ECF4 0%,#DDE2EE 35%,#D0D6E8 65%,#C8D0E4 100%)';

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
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,color:pgAccent,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>
          "Everything you love about flowers is also true of weddings."
        </div>
      </div>
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading?(
          <div style={{padding:32,textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.28em',textTransform:'uppercase' as any,color:pgInkMute}}>loading…</div>
        ):entries.length===0?(
          <div style={{padding:'64px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:42,color:pgAccent,lineHeight:1}}>Today</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.28em',textTransform:'uppercase' as any,color:pgInkMute,textAlign:'center' as any}}>Tap below to begin today's page</div>
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
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.2em',textTransform:'uppercase' as any,color:pgInkMute}}>{mood?.label||entry.mood}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,color:pgInkMute,marginLeft:'auto'}}>{dateStr}</span>
                    </div>
                    <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,color:pgInk,lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>
                      {entry.body}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{padding:'24px',textAlign:'center' as any}}>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:13,color:pgInkMute,fontFeatureSettings:'"opsz" 9'}}>another page?</div>
            </div>
          </div>
        )}
      </div>
      {/* CTA */}
      <div onClick={()=>setView('picker')} style={{flexShrink:0,borderTop:`0.5px solid ${pgLine}`,padding:'16px 24px',cursor:'pointer',WebkitTapHighlightColor:'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'Italianno',cursive",fontSize:30,color:pgAccent,lineHeight:1}}>How are you feeling?</div>
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
          <div style={{fontFamily:"'Italianno',cursive",fontSize:44,color:pgInk,lineHeight:1,marginBottom:6}}>
            How are you feeling?
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>
            {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
          </div>
        </div>

        {/* 12 dots — 4 col grid, centered, medium size matching reference */}
        <div style={{marginTop:36,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'28px 8px',justifyItems:'center'}}>
          {MOODS.map(mood=>(
            <div key={mood.key} onClick={()=>{setSelectedMood(mood);setView('writing');}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,cursor:'pointer',WebkitTapHighlightColor:'transparent',width:'100%'}}>
              {/* Dot — 40px matching reference screenshot size */}
              <div style={{
                width:40,height:40,borderRadius:'50%',
                background:mood.color,
                flexShrink:0,
              }}/>
              <div style={{
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:6.5,letterSpacing:'.14em',
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
            fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.2em',
            textTransform:'uppercase' as any,color:pgInkMute,display:'flex',alignItems:'center',gap:5}}>
          ← Discard
        </button>
        {/* Center mood indicator */}
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:selectedMood?.color,flexShrink:0}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.2em',textTransform:'uppercase' as any,color:selectedMood?.color}}>{selectedMood?.label}</span>
        </div>
        <button onClick={saveEntry} disabled={!body.trim()||saving}
          style={{background:'none',border:'none',cursor:body.trim()&&!saving?'pointer':'default',padding:0,
            fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.2em',
            textTransform:'uppercase' as any,
            color:body.trim()&&!saving?pgAccent:pgInkMute}}>
          Save →
        </button>
      </div>

      {/* Date line */}
      <div style={{padding:'16px 24px 8px',flexShrink:0}}>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>
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
            placeholder="Write here…"
            autoFocus
            style={{
              width:'100%',
              minHeight:300,
              background:'transparent',
              border:'none',outline:'none',
              color:pgInk,
              fontFamily:"'Fraunces',serif",
              fontStyle:'italic',fontWeight:300,
              fontSize:18,lineHeight:1.8,
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

// ── Root component ────────────────────────────────────────────────────────────


export default function SanctuaryPage() {
  const { homeMode, setHomeMode } = useFrostMode();
  const dark = homeMode === 'E1A';

  // Sanctuary data
  const [days,       setDays]       = useState(176);
  const [progress,   setProgress]   = useState(.38);
  const [name,       setName]       = useState('Priya');
  const [proseLine,  setProseLine]  = useState('');
  const [poetry,     setPoetry]     = useState('');
  const [sinceYes,   setSinceYes]   = useState(47);
  const [journeyOpen,setJourneyOpen]= useState(false);
  const [weekday,    setWeekday]    = useState('Wednesday morning');
  const [dateStamp,  setDateStamp]  = useState('');

  // Bloom state
  const [activeRoom, setActiveRoom]   = useState<RoomKey>(null);
  const [blooming,   setBlooming]     = useState(false);
  const [closing,    setClosing]      = useState(false);
  const touchStartY = useRef(0);

  // Dream Ai state
  const [msgs,    setMsgs]    = useState<UIMsg[]>([]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLTextAreaElement>(null);
  const cancelRef  = useRef<(()=>void)|null>(null);

  useEffect(()=>{
    if(!document.getElementById('sv5')){const s=document.createElement('style');s.id='sv5';s.textContent=CSS;document.head.appendChild(s);}
    const w=getWeddingDate(),e=getEngagementDate(),d=daysUntil(w);
    setDays(d);setProgress(arcProgress(d));setName(getBrideName());
    setProseLine(prose(d));setPoetry(getDailyPoetry());setSinceYes(daysSince(e));
    const now=new Date();
    setWeekday(now.toLocaleDateString('en-IN',{weekday:'long'})+' morning');
    const DOM=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second','Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh','Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First'];
    setDateStamp(`${DOM[now.getDate()]||now.getDate()} of ${now.toLocaleDateString('en-IN',{month:'long'})} · ${now.getFullYear()}`);
  },[]);

  // Scroll dream to bottom
  useEffect(()=>{ if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight; },[msgs]);
  useEffect(()=>{ if(!textRef.current)return;textRef.current.style.height='auto';textRef.current.style.height=Math.min(textRef.current.scrollHeight,120)+'px'; },[input]);
  useEffect(()=>()=>{cancelRef.current?.();},[]);

  // ── Bloom open / close ────────────────────────────────────────────────────
  const openRoom = useCallback((key:RoomKey)=>{
    setActiveRoom(key);
    setBlooming(true);
    setClosing(false);
  },[]);

  const closeRoom = useCallback(()=>{
    setClosing(true);
    setTimeout(()=>{
      setActiveRoom(null);
      setBlooming(false);
      setClosing(false);
    },300);
  },[]);

  // Swipe down to close
  const onTouchStart = useCallback((e:React.TouchEvent)=>{
    touchStartY.current = e.touches[0].clientY;
  },[]);
  const onTouchEnd = useCallback((e:React.TouchEvent)=>{
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if(dy > 80) closeRoom();
  },[closeRoom]);

  // ── Dream Ai send ─────────────────────────────────────────────────────────
  const sendDream = useCallback((text:string)=>{
    const msg=text.trim();
    if(!msg||loading)return;
    setInput('');
    setMsgs(prev=>[...prev,{id:uid(),role:'user',content:msg}]);
    setLoading(true);
    const aiId=uid();
    setMsgs(prev=>[...prev,{id:aiId,role:'assistant',content:'',pending:true}]);
    const cancel=streamBrideChat(msg,
      (delta)=>setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:m.content+delta,pending:false}:m)),
      ()=>{setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,pending:false}:m));setLoading(false);cancelRef.current=null;},
      (err)=>{console.error(err);setMsgs(prev=>prev.map(m=>m.id===aiId?{...m,content:'Something went wrong. Try again.',error:true,pending:false}:m));setLoading(false);cancelRef.current=null;}
    );
    cancelRef.current=cancel;
  },[loading]);

  // ── Tokens ────────────────────────────────────────────────────────────────
  const bg = dark
    ? `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(196,133,106,.18) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(55,10,20,.55) 0%,transparent 55%),linear-gradient(180deg,#14080C 0%,#100608 55%,#0C0405 100%)`
    : `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(168,196,216,.32) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(170,160,145,.14) 0%,transparent 55%),linear-gradient(180deg,#F0EEE8 0%,#E8E5DE 55%,#DDD9D0 100%)`;

  const accent    = dark ? '#C4856A' : '#2A5F82';
  const signal    = dark ? '#6B9E8F' : '#8B6E52';
  const ink       = dark ? '#F5E5DC' : '#0A1628';
  const inkSoft   = dark ? 'rgba(245,229,220,.85)' : 'rgba(10,22,40,1.0)';
  const inkMute   = dark ? 'rgba(196,133,106,.42)'  : 'rgba(10,22,40,.60)';
  const line      = dark ? 'rgba(196,133,106,.10)'  : 'rgba(42,95,130,.14)';
  const lineStr   = dark ? 'rgba(196,133,106,.18)'  : 'rgba(42,95,130,.22)';
  const pillBg    = dark ? 'rgba(20,8,12,.55)'      : 'rgba(240,238,232,.75)';
  const pillBdr   = dark ? 'rgba(196,133,106,.30)'  : 'rgba(42,95,130,.35)';
  const pillTxt   = dark ? 'rgba(245,229,220,.85)'  : 'rgba(10,22,40,.85)';
  const jnyBg     = dark ? 'rgba(196,133,106,.05)'  : 'rgba(42,95,130,.06)';
  const topBandBg = dark ? 'rgba(20,8,12,.62)'      : 'rgba(240,238,232,.68)';
  // Bottom dark panel — covers slice zone, makes text legible
  // Comes higher now so Dream Ai row is always in the dark zone
  const botPanelBg= dark ? 'rgba(12,4,5,.50)'       : 'rgba(8,6,10,.82)';
  const sliceTxt  = dark ? '#F5E5DC'                 : '#FFFFFF';
  const hintTxt   = dark ? 'rgba(196,133,106,.55)'  : 'rgba(255,255,255,.55)';
  const ghostColor= dark ? '#3A0C18'                 : '#7AAAC8';
  const ghostOp   = dark ? 0.92                      : 0.70;

  // Room backgrounds — match the mode. Same house, different rooms.
  // Exception: Discover + Muse + Moments = always dark (photo galleries)
  const isPhotoRoom = activeRoom==='discover'||activeRoom==='muse'||activeRoom==='moments';

  const roomBg = isPhotoRoom
    ? 'linear-gradient(180deg,#080608 0%,#040406 100%)'
    : dark
      // Wine Night: deep wine-black gradient with terracotta warmth bleeding top-right, dark plum pooling bottom-left
      ? `radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.16) 0%,transparent 52%),radial-gradient(ellipse 60% 50% at 15% 100%,rgba(80,10,25,.65) 0%,transparent 55%),linear-gradient(160deg,#1A0A0E 0%,#120608 35%,#0C0404 65%,#180610 100%)`
      // Sky Ivory: bone-white gradient, slate blue wash top, warm grey-blue pooling bottom
      : `radial-gradient(ellipse 90% 45% at 60% -5%,rgba(74,122,155,.22) 0%,transparent 52%),radial-gradient(ellipse 70% 50% at 10% 105%,rgba(42,95,130,.14) 0%,transparent 55%),linear-gradient(160deg,#EEF0F4 0%,#E8EAF0 30%,#DFE3EC 65%,#D8DCE8 100%)`;

  const roomTopBg   = isPhotoRoom
    ? 'rgba(8,6,10,.90)'
    : dark
      ? 'rgba(18,6,10,.85)'   // wine-black frosted
      : 'rgba(238,240,244,.88)'; // slate-tinted bone frosted

  const roomInk     = isPhotoRoom ? '#F0EDE8' : (dark ? '#F5E5DC' : '#0D1E35');
  const roomInkSoft = isPhotoRoom ? 'rgba(240,237,232,.70)' : (dark ? 'rgba(245,229,220,.78)' : 'rgba(13,30,53,.80)');
  const roomInkMute = isPhotoRoom ? 'rgba(200,180,160,.40)' : (dark ? 'rgba(196,133,106,.48)' : 'rgba(42,95,130,.55)');
  const roomLine    = isPhotoRoom ? 'rgba(196,133,106,.16)' : (dark ? 'rgba(196,133,106,.14)' : 'rgba(42,95,130,.16)');
  const aiBubbleBg  = dark ? 'rgba(196,133,106,.08)'  : 'rgba(42,95,130,.06)';
  const aiBubbleBdr = dark ? 'rgba(196,133,106,.18)'  : 'rgba(42,95,130,.16)';
  const composeBg   = dark ? 'rgba(12,4,5,.90)'       : 'rgba(240,238,232,.90)';
  const inputBg     = dark ? 'rgba(196,133,106,.06)'  : 'rgba(42,95,130,.05)';
  const inputBdr    = dark ? 'rgba(196,133,106,.22)'  : 'rgba(42,95,130,.20)';
  const chipBg      = dark ? 'rgba(196,133,106,.06)'  : 'rgba(42,95,130,.05)';
  const chipBdr     = dark ? 'rgba(196,133,106,.20)'  : 'rgba(42,95,130,.18)';

  const dot = arcPoint(progress);

  // ── SANCTUARY ─────────────────────────────────────────────────────────────
  return (
    <div style={{position:'fixed',inset:0,background:bg,display:'flex',flexDirection:'column',overflow:'hidden',userSelect:'none',WebkitUserSelect:'none' as any}}>

      {/* Grain */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,backgroundSize:'160px',opacity:dark?.45:.22}}/>

      {/* Ghost numeral */}
      <div className="gn-a" style={{position:'absolute',top:journeyOpen?'60px':'115px',left:'50%',fontFamily:"'Fraunces',serif",fontWeight:700,fontStyle:'normal',fontSize:journeyOpen?'150px':'320px',lineHeight:1,letterSpacing:'-.06em',whiteSpace:'nowrap',color:ghostColor,opacity:ghostOp,filter:'blur(8px)',fontFeatureSettings:'"opsz" 144',pointerEvents:'none',zIndex:3,transition:`top 480ms ${EASE}, font-size 480ms ${EASE}`,WebkitMaskImage:'linear-gradient(180deg,rgba(0,0,0,1) 0%,rgba(0,0,0,1) 70%,rgba(0,0,0,0.3) 88%,rgba(0,0,0,0) 100%)',maskImage:'linear-gradient(180deg,rgba(0,0,0,1) 0%,rgba(0,0,0,1) 70%,rgba(0,0,0,0.3) 88%,rgba(0,0,0,0) 100%)'}}>
        {days}
      </div>

      {/* Upper frost band */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:120,background:topBandBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',WebkitMaskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',maskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',pointerEvents:'none',zIndex:2}}/>

      {/* Bottom dark panel — raised higher so ALL slices are in dark zone */}
      <div style={{position:'absolute',top:journeyOpen?'22%':'38%',left:0,right:0,bottom:0,background:botPanelBg,backdropFilter:'blur(20px) saturate(1.2)',WebkitBackdropFilter:'blur(20px) saturate(1.2)',WebkitMaskImage:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 10%,#000 20%)',maskImage:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 10%,#000 20%)',pointerEvents:'none',zIndex:4,transition:`top 480ms ${EASE}`}}/>

      {/* Arc */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:108,zIndex:6,pointerEvents:'none'}}>
        <svg viewBox="0 0 320 108" preserveAspectRatio="none" style={{width:'100%',height:'100%',overflow:'visible'}}>
          <path d="M 18 92 Q 160 4 302 92" stroke={dark?'rgba(196,133,106,.14)':'rgba(42,95,130,.20)'} strokeWidth="1" fill="none"/>
          <path d={arcPathTo(progress)} stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <circle cx={dot.x} cy={dot.y} r="18" fill="none" stroke={accent} strokeWidth=".5" className="do-a"/>
          <circle cx={dot.x} cy={dot.y} r="10" fill="none" stroke={accent} strokeWidth=".8" className="dh-a"/>
          <circle cx={dot.x} cy={dot.y} r="4.5" fill={accent} className="dc-a"/>
        </svg>
      </div>

      {/* I WILL / I DO */}
      <div style={{position:'absolute',top:`calc(env(safe-area-inset-top,0px) + 76px)`,left:0,right:0,display:'flex',justifyContent:'space-between',padding:'0 20px',zIndex:7,pointerEvents:'none'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.3em',textTransform:'uppercase' as any,color:inkMute}}>I will</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.3em',textTransform:'uppercase' as any,color:inkMute}}>I do</span>
      </div>

      {/* Chrome */}
      <div style={{position:'relative',zIndex:8,display:'flex',alignItems:'center',justifyContent:'space-between',padding:`calc(env(safe-area-inset-top,0px) + 84px) 18px 0`,flexShrink:0}}>
        <button onClick={()=>openRoom('discover')} style={{display:'flex',alignItems:'center',gap:5,height:24,padding:'0 10px',borderRadius:2,background:pillBg,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:`0.5px solid ${pillBdr}`,fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.2em',textTransform:'uppercase' as any,color:pillTxt,cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <span style={{width:4,height:4,borderRadius:'50%',background:accent,flexShrink:0}}/>
          Discover
        </button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.2em',color:inkMute}}>{romanDate()}</span>
      </div>

      {/* Hero */}
      <div style={{position:'relative',zIndex:5,padding:journeyOpen?'8px 18px 4px':'14px 18px 10px',flexShrink:0,transition:`padding 480ms ${EASE}`}}>
        {!journeyOpen&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.28em',textTransform:'uppercase' as any,color:inkMute,marginBottom:10,display:'flex',alignItems:'center',gap:8}}>{weekday}<span style={{flex:1,maxWidth:44,height:.5,background:line}}/></div>}
        <div style={{fontFamily:"'Italianno',cursive",fontSize:journeyOpen?38:58,lineHeight:.9,letterSpacing:'-.01em',color:ink,marginBottom:journeyOpen?4:8,transition:`font-size 480ms ${EASE}`}}>
          Hello, <span style={{color:accent}}>{name}</span>.
        </div>
        {!journeyOpen&&<div style={{width:40,height:1,background:`linear-gradient(90deg,${accent},transparent)`,marginBottom:10}}/>}
        <div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <div className="num-a" style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontStyle:'normal',fontSize:journeyOpen?46:80,lineHeight:.88,letterSpacing:'-.04em',color:accent,fontFeatureSettings:'"opsz" 144',transition:`font-size 480ms ${EASE}`}}>{days}</div>
          <div style={{fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:8,letterSpacing:'.44em',textTransform:'uppercase' as any,color:accent,opacity:.5}}>mornings</div>
        </div>
        {!journeyOpen&&<>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,lineHeight:1.62,color:inkSoft,marginTop:10,marginBottom:6,fontFeatureSettings:'"opsz" 9'}}>
            {proseLine.split(/(I will|I do)/g).map((p,i)=>p==='I will'||p==='I do'?<span key={i} style={{color:accent,fontWeight:400}}>{p}</span>:<span key={i}>{p}</span>)}
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.2em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>{dateStamp}</div>
          {sinceYes>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.16em',textTransform:'uppercase' as any,color:signal}}>↑ {sinceYes} days since you said yes</div>}
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:12,lineHeight:1.55,marginTop:8,color:inkMute,fontFeatureSettings:'"opsz" 9'}}>"{poetry}"</div>
        </>}
      </div>

      {/* Slices */}
      <div style={{position:'relative',zIndex:5,flex:1,display:'flex',flexDirection:'column',borderTop:`.5px solid ${lineStr}`,overflow:'hidden',minHeight:0}}>
        {SLICES.map((slice,idx)=>(
          <div key={slice.key} onClick={()=>openRoom(slice.key)} className="si-a"
            style={{flex:1,minHeight:0,display:'flex',alignItems:'center',padding:'0 18px',gap:7,borderBottom:`.5px solid ${line}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',background:'transparent',animationDelay:`${idx*16}ms`}}>
            <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:17,lineHeight:1,flexShrink:0,color:sliceTxt,fontFeatureSettings:'"opsz" 9'}}>{slice.label}</span>
            {slice.candle&&<span className="cf-a" style={{width:5,height:5,borderRadius:'50%',background:signal,boxShadow:`0 0 7px ${signal}`,flexShrink:0}}/>}
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.1em',textTransform:'uppercase' as any,color:hintTxt,marginLeft:'auto',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:150}}>{slice.hint}</span>
            {(slice.key==='discover'||slice.key==='meridian')&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:hintTxt,flexShrink:0}}>→</span>}
          </div>
        ))}
      </div>

      {/* Journey */}
      <div style={{position:'relative',zIndex:5,flexShrink:0,borderTop:`.5px solid ${lineStr}`,paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 2px)',background:journeyOpen?jnyBg:'transparent',transition:`background 300ms ${EASE}`}}>
        <div onClick={()=>setJourneyOpen(o=>!o)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px',cursor:'pointer',WebkitTapHighlightColor:'transparent',minHeight:44}}>
          <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:17,color:accent,fontFeatureSettings:'"opsz" 9'}}>Journey</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:accent,opacity:.55,display:'inline-block',transform:journeyOpen?'rotate(180deg)':'rotate(0deg)',transition:`transform 300ms ${EASE}`}}>∨</span>
        </div>
        {journeyOpen&&<div style={{borderTop:`.5px solid ${line}`}}>
          {JOURNEY_LINKS.map((link,i)=>(
            <div key={link.label} className="si-a" style={{display:'flex',alignItems:'center',minHeight:44,padding:'0 24px',borderBottom:`.5px solid ${line}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',animationDelay:`${i*28}ms`}}>
              <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,flex:1,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>{link.label}</span>
              {link.hint&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.1em',textTransform:'uppercase' as any,color:inkMute}}>{link.hint}</span>}
            </div>
          ))}
          <div onClick={()=>setHomeMode(dark?'E3':'E1A')} className="si-a" style={{display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:44,padding:'0 24px',cursor:'pointer',WebkitTapHighlightColor:'transparent',animationDelay:`${JOURNEY_LINKS.length*28}ms`}}>
            <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:15,color:inkSoft,fontFeatureSettings:'"opsz" 9'}}>Mode</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.18em',textTransform:'uppercase' as any,color:accent}}>{dark?'Dark':'Light'} · <span style={{opacity:.5}}>switch</span></span>
          </div>
        </div>}
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOOM LAYER — renders ON TOP of Sanctuary
          Every room blooms up from the bottom, covering Sanctuary.
          Swipe down or tap ← to close.
          ════════════════════════════════════════════════════════ */}
      {activeRoom && (
        <div
          className={closing ? 'bloom-exit' : 'bloom-enter'}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{position:'absolute',inset:0,zIndex:100,display:'flex',flexDirection:'column',background:roomBg,overflow:'hidden'}}
        >
          {/* Room top bar */}
          <div style={{position:'relative',zIndex:10,background:roomTopBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',borderBottom:`0.5px solid ${roomLine}`,paddingTop:'calc(env(safe-area-inset-top,0px) + 12px)',paddingBottom:12,paddingLeft:18,paddingRight:18,display:'flex',alignItems:'center',flexShrink:0}}>
            <button onClick={closeRoom} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,padding:0,fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.22em',textTransform:'uppercase' as any,color:roomInkMute}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Sanctuary
            </button>
            <div style={{flex:1,textAlign:'center',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:17,color:accent,fontFeatureSettings:'"opsz" 9'}}>
              {SLICES.find(s=>s.key===activeRoom)?.label}
            </div>
            {activeRoom==='dream'&&<button onClick={()=>{cancelRef.current?.();setMsgs([]);setLoading(false);}} style={{background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.18em',textTransform:'uppercase' as any,color:roomInkMute}}>Clear</button>}
            {activeRoom!=='dream'&&<div style={{width:40}}/>}
          </div>

          {/* Room content */}
          <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>

            {/* ── DREAM AI ── */}
            {activeRoom==='dream'&&<>
              <div ref={scrollRef} className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,padding:'20px 18px'}}>
                {msgs.length===0?(
                  <div style={{display:'flex',flexDirection:'column',gap:24,paddingTop:8}}>
                    <div>
                      <div style={{fontFamily:"'Italianno',cursive",fontSize:48,lineHeight:.95,color:roomInk,marginBottom:8}}>Tell me what's<br/>on your mind.</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,color:roomInkSoft,lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>I know your timeline, vendors,<br/>Muse board, and Circle.</div>
                    </div>
                    <div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:'.28em',textTransform:'uppercase' as any,color:roomInkMute,marginBottom:12}}>Try asking</div>
                      <div style={{display:'flex',flexDirection:'column',gap:8}}>
                        {DREAM_PROMPTS.map(p=>(
                          <button key={p} onClick={()=>sendDream(p)} style={{textAlign:'left',background:chipBg,border:`0.5px solid ${chipBdr}`,borderRadius:8,padding:'12px 14px',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,color:roomInk,cursor:'pointer',fontFeatureSettings:'"opsz" 9'}}>"{p}"</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ):(
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {msgs.map(m=>(
                      <div key={m.id} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                        {m.role==='user'?(
                          <div style={{maxWidth:'82%',background:accent,color:dark?'#1A0810':'#FFFFFF',padding:'10px 14px',borderRadius:'20px 20px 4px 20px',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,lineHeight:1.55,fontFeatureSettings:'"opsz" 9',userSelect:'text' as any}}>{m.content}</div>
                        ):m.pending&&m.content===''?(
                          <div style={{background:aiBubbleBg,border:`0.5px solid ${aiBubbleBdr}`,padding:'10px 16px',borderRadius:'20px 20px 20px 4px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)'}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:accent,animation:'dpulse 1.4s infinite ease-in-out'}}>✦ thinking</span>
                            <style>{`@keyframes dpulse{0%,80%,100%{opacity:.35}40%{opacity:1}}`}</style>
                          </div>
                        ):(
                          <div style={{maxWidth:'90%',background:aiBubbleBg,border:`0.5px solid ${aiBubbleBdr}`,padding:'12px 16px',borderRadius:'20px 20px 20px 4px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,lineHeight:1.65,color:m.error?'#C4534A':roomInk,whiteSpace:'pre-wrap',fontFeatureSettings:'"opsz" 9',userSelect:'text' as any}}>
                            {m.content}
                            {m.pending&&<span className="d-cursor" style={{opacity:.5,color:accent}}>▌</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Compose */}
              <div style={{background:composeBg,backdropFilter:'blur(22px) saturate(1.1)',WebkitBackdropFilter:'blur(22px) saturate(1.1)',borderTop:`0.5px solid ${roomLine}`,padding:`12px 18px calc(12px + env(safe-area-inset-bottom,0px))`,flexShrink:0}}>
                <div style={{display:'flex',gap:10,alignItems:'flex-end',background:inputBg,border:`0.5px solid ${inputBdr}`,borderRadius:20,padding:'8px 10px 8px 16px'}}>
                  <textarea ref={textRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendDream(input);}}} placeholder="Tell DreamAi anything…" disabled={loading} rows={1}
                    style={{flex:1,background:'transparent',border:'none',outline:'none',color:roomInk,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,resize:'none',maxHeight:120,lineHeight:1.5,fontFeatureSettings:'"opsz" 9',userSelect:'text',WebkitUserSelect:'text' as any}}/>
                  <button onClick={()=>sendDream(input)} disabled={loading||!input.trim()}
                    style={{background:input.trim()&&!loading?accent:'rgba(128,128,128,.12)',color:input.trim()&&!loading?(dark?'#1A0810':'#FFFFFF'):roomInkMute,border:'none',borderRadius:'50%',width:34,height:34,display:'flex',alignItems:'center',justifyContent:'center',cursor:input.trim()&&!loading?'pointer':'default',transition:`background 200ms ${EASE}`,flexShrink:0}}>
                    <Send size={14} strokeWidth={1.5}/>
                  </button>
                </div>
              </div>
            </>}

            {/* ── EVENTS — timeline grouped by date ── */}
            {activeRoom==='events'&&(
              <EventsRoom
                dark={dark} accent={accent} signal={signal}
                roomInk={roomInk} roomInkSoft={roomInkSoft} roomInkMute={roomInkMute} roomLine={roomLine}
              />
            )}

            {/* ── CIRCLE — activity feed + invite ── */}
            {activeRoom==='circle'&&(
              <CircleRoom
                dark={dark} accent={accent} signal={signal}
                roomInk={roomInk} roomInkSoft={roomInkSoft} roomInkMute={roomInkMute} roomLine={roomLine}
              />
            )}

            {/* ── PAGES — diary with feeling picker ── */}
            {activeRoom==='pages'&&(
              <PagesRoom
                dark={dark} accent={accent} signal={signal}
                roomInk={roomInk} roomInkSoft={roomInkSoft} roomInkMute={roomInkMute} roomLine={roomLine}
              />
            )}

            {/* ── OTHER ROOMS — coming soon ── */}
            {activeRoom!=='dream'&&activeRoom!=='pages'&&activeRoom!=='circle'&&activeRoom!=='events'&&(
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:32}}>
                <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:accent,lineHeight:1}}>
                  {SLICES.find(s=>s.key===activeRoom)?.label}
                </div>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,color:roomInkSoft,textAlign:'center',lineHeight:1.65,fontFeatureSettings:'"opsz" 9'}}>
                  Coming soon.<br/>Swipe down to return.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
