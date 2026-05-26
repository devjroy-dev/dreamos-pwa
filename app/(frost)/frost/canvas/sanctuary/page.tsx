'use client';

// Sanctuary V4 — identical to approved frost_final_two.html right columns
// Wine Night: ghost bleeds into slice zone, deep dark background
// Sky Ivory: dark near-black glass panel covers slice zone, ghost inside it

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import { EASE, FROST_COPY, daysUntil } from '../../../../../lib/frost/tokens';

const DEMO_WEDDING    = new Date('2026-11-19T00:00:00+05:30');
const DEMO_ENGAGEMENT = new Date('2026-04-11T00:00:00+05:30');

function getWeddingDate(): Date {
  try { const r = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session'); if(r){const s=JSON.parse(r);if(s?.wedding_date)return new Date(s.wedding_date);} } catch{}
  return DEMO_WEDDING;
}
function getEngagementDate(): Date {
  try { const r = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session'); if(r){const s=JSON.parse(r);if(s?.engagement_date)return new Date(s.engagement_date);} } catch{}
  return DEMO_ENGAGEMENT;
}
function getBrideName(): string {
  try { const r = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session'); if(r){const s=JSON.parse(r);const n=(s?.user_name||s?.bride_name||s?.name||'').trim().split(' ')[0];if(n)return n;} } catch{}
  return 'Priya';
}
function daysSince(d: Date): number {
  const t=new Date();t.setHours(0,0,0,0);const e=new Date(d);e.setHours(0,0,0,0);
  return Math.max(0,Math.round((t.getTime()-e.getTime())/86400000));
}

// Arc math
function arcProgress(daysLeft: number): number { return Math.max(0,Math.min(1,1-daysLeft/365)); }
function arcPoint(t: number){
  const p0={x:18,y:92},p1={x:160,y:4},p2={x:302,y:92};const u=1-t;
  return{x:u*u*p0.x+2*u*t*p1.x+t*t*p2.x,y:u*u*p0.y+2*u*t*p1.y+t*t*p2.y};
}
function arcPathTo(t: number): string {
  if(t<=0)return'M 18 92';
  const p0={x:18,y:92},p1={x:160,y:4},p2={x:302,y:92};
  const q0={x:p0.x+(p1.x-p0.x)*t,y:p0.y+(p1.y-p0.y)*t};
  const q1={x:p1.x+(p2.x-p1.x)*t,y:p1.y+(p2.y-p1.y)*t};
  const ep={x:q0.x+(q1.x-q0.x)*t,y:q0.y+(q1.y-q0.y)*t};
  return`M 18 92 Q ${q0.x.toFixed(1)} ${q0.y.toFixed(1)} ${ep.x.toFixed(1)} ${ep.y.toFixed(1)}`;
}

// Text helpers
const ONES=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const TENS=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
function toW(n:number):string{if(n<20)return ONES[n]||String(n);const t=Math.floor(n/10),o=n%10;if(!o)return TENS[t];return`${TENS[t]}-${ONES[o].toLowerCase()}`;}
function bigW(n:number):string{if(n<100)return toW(n);const h=Math.floor(n/100),r=n%100;return ONES[h]+' hundred'+(r?' and '+toW(r).toLowerCase():'');}
function dW(n:number):string{if(n<100)return toW(n);if(n<1000)return bigW(n);return String(n);}
function prose(d:number):string{if(d===0)return'Today.';const w=dW(d);return`${w.charAt(0).toUpperCase()+w.slice(1)} mornings between I will and I do.`;}
function romanDate():string{const n=new Date(),R=['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];return`${String(n.getDate()).padStart(2,'0')} · ${R[n.getMonth()+1]} · ${String(n.getFullYear()).slice(-2)}`;}
function getDailyPoetry():string{const pool=FROST_COPY.idlePool;const d=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000);return pool[d%pool.length];}

// Keyframes
const CSS=`
@keyframes gnB{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.006);}}
@keyframes numB{0%,100%{transform:scale(1);}50%{transform:scale(1.003);}}
@keyframes dC{0%,37%,100%{opacity:.42;}18%{opacity:1;}}
@keyframes dH{0%,37%,100%{opacity:.15;}18%{opacity:.58;}}
@keyframes dO{0%,37%,100%{opacity:.05;}18%{opacity:.22;}}
@keyframes cF{0%{opacity:.7}15%{opacity:1}28%{opacity:.85}45%{opacity:1}60%{opacity:.88}75%{opacity:1}88%{opacity:.72}100%{opacity:.7}}
@keyframes sIn{from{opacity:0;transform:translateY(3px);}to{opacity:1;transform:translateY(0);}}
.gn-a{animation:gnB 9s ease-in-out infinite;}
.num-a{animation:numB 7s ease-in-out infinite;}
.dc-a{animation:dC 4s ease-in-out infinite;}
.dh-a{animation:dH 4s ease-in-out infinite;}
.do-a{animation:dO 4s ease-in-out infinite;}
.cf-a{animation:cF 5s ease-in-out infinite;}
.si-a{animation:sIn 220ms cubic-bezier(0.22,1,0.36,1) forwards;}
`;

const SLICES=[
  {key:'dream',   label:'Dream Ai',  hint:'Something will go wrong…',   route:'/frost/canvas/dream'},
  {key:'circle',  label:'Circle',    hint:'Meha lit a candle · 8m ago', route:'/frost/canvas/journey/circle', candle:true},
  {key:'muse',    label:'Muse',      hint:'22 saved · 4 new',           route:'/frost/canvas/muse'},
  {key:'discover',label:'Discover',  hint:'Your curated world',          route:'/frost/canvas/discover'},
  {key:'people',  label:'My People', hint:'1 active · 1 invited',       route:'/frost/canvas/journey/people'},
  {key:'pages',   label:'Pages',     hint:'a page is waiting',           route:'/frost/canvas/journey/pages'},
  {key:'moments', label:'Moments',   hint:'Your memories',               route:'/frost/canvas/journey/moments'},
  {key:'events',  label:'Events',    hint:'Your timeline',               route:'/frost/canvas/journey/events'},
  {key:'meridian',label:'Meridian',  hint:'Skin · mind · body',          route:'/frost/canvas/journey/meridian',premium:true},
];
const JOURNEY=[
  {label:'Expenses', hint:'₹2.4L logged', route:'/frost/canvas/journey/expenses'},
  {label:'Vendors',  hint:'4 confirmed',   route:'/frost/canvas/journey/vendors'},
  {label:'Settings', hint:'',              route:'/frost/canvas/journey/settings'},
];

export default function SanctuaryPage() {
  const router = useRouter();
  const { homeMode, setHomeMode } = useFrostMode();
  const dark = homeMode === 'E1A';

  const [days,       setDays]       = useState(176);
  const [progress,   setProgress]   = useState(.38);
  const [name,       setName]       = useState('Priya');
  const [proseLine,  setProseLine]  = useState('');
  const [poetry,     setPoetry]     = useState('');
  const [sinceYes,   setSinceYes]   = useState(47);
  const [journeyOpen,setJourneyOpen]= useState(false);
  const [weekday,    setWeekday]    = useState('Wednesday morning');
  const [dateStamp,  setDateStamp]  = useState('');

  useEffect(()=>{
    if(!document.getElementById('sv4')){const s=document.createElement('style');s.id='sv4';s.textContent=CSS;document.head.appendChild(s);}
    const w=getWeddingDate(),e=getEngagementDate(),d=daysUntil(w);
    setDays(d);setProgress(arcProgress(d));setName(getBrideName());
    setProseLine(prose(d));setPoetry(getDailyPoetry());setSinceYes(daysSince(e));
    const now=new Date();
    setWeekday(now.toLocaleDateString('en-IN',{weekday:'long'})+' morning');
    const DOM=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second','Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh','Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First'];
    setDateStamp(`${DOM[now.getDate()]||now.getDate()} of ${now.toLocaleDateString('en-IN',{month:'long'})} · ${now.getFullYear()}`);
  },[]);

  const go=useCallback((p:string)=>router.push(p),[router]);
  const dot=arcPoint(progress);

  // ── EXACT token values from frost_final_two.html approved render ──────────
  const arc     = dark ? '#C4856A'         : '#2A5F82';
  const arcRail = dark ? 'rgba(196,133,106,.14)' : 'rgba(42,95,130,.20)';
  const signal  = dark ? '#6B9E8F'         : '#8B6E52';
  const accent  = dark ? '#C4856A'         : '#2A5F82';
  const ink     = dark ? '#F5E5DC'         : '#0A1628';
  const inkSoft = dark ? 'rgba(245,229,220,.85)' : 'rgba(10,22,40,1.0)';
  const inkMute = dark ? 'rgba(196,133,106,.42)'  : 'rgba(10,22,40,.60)';
  const line    = dark ? 'rgba(196,133,106,.10)'  : 'rgba(42,95,130,.14)';
  const lineStr = dark ? 'rgba(196,133,106,.18)'  : 'rgba(42,95,130,.22)';
  const pillBg  = dark ? 'rgba(20,8,12,.55)'  : 'rgba(240,238,232,.75)';
  const pillBdr = dark ? 'rgba(196,133,106,.30)' : 'rgba(42,95,130,.35)';
  const pillTxt = dark ? 'rgba(245,229,220,.85)' : 'rgba(10,22,40,.85)';
  const sliceTxt= dark ? '#F5E5DC'         : '#0A1628';
  const hintTxt = dark ? 'rgba(196,133,106,.55)' : 'rgba(10,22,40,.72)';
  const jnyBg   = dark ? 'rgba(196,133,106,.05)' : 'rgba(42,95,130,.06)';

  // ── BACKGROUND — exact from render ───────────────────────────────────────
  const bg = dark
    ? `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(196,133,106,.18) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(55,10,20,.55) 0%,transparent 55%),linear-gradient(180deg,#14080C 0%,#100608 55%,#0C0405 100%)`
    : `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(168,196,216,.32) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(170,160,145,.14) 0%,transparent 55%),linear-gradient(180deg,#F0EEE8 0%,#E8E5DE 55%,#DDD9D0 100%)`;

  // ── GHOST — exact from render ─────────────────────────────────────────────
  // Wine Night: #3A0C18 dark rose, bleeds INTO slice zone (no mask cutoff early)
  // Sky Ivory:  #7AAAC8 sky blue, sits inside the dark glass panel
  const ghostColor = dark ? '#3A0C18' : '#7AAAC8';
  const ghostOp    = dark ? 0.92      : 0.70;

  // ── UPPER FROST BAND — only at very top for chrome area ──────────────────
  const topBandBg = dark ? 'rgba(20,8,12,.62)' : 'rgba(240,238,232,.68)';

  // ── LOWER DARK PANEL — this is the key ───────────────────────────────────
  // Wine Night: continues the dark bg naturally, ghost bleeds through
  // Sky Ivory: near-BLACK glass panel — this is the dramatic dark zone in the render
  const bottomPanelBg = dark
    ? 'rgba(12,4,5,.45)'          // subtle darkening, ghost shines through
    : 'rgba(8,6,10,.82)';         // near-BLACK — this is what makes SI dramatic

  return (
    <div style={{position:'fixed',inset:0,background:bg,display:'flex',flexDirection:'column',overflow:'hidden',userSelect:'none',WebkitUserSelect:'none' as any}}>

      {/* Grain */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,backgroundSize:'160px',opacity:dark?.45:.22}}/>

      {/* ── GHOST NUMERAL ──
          z:3 — above bg, above bottom panel, BEHIND hero text (z:5) and arc (z:6)
          No mask cutoff — bleeds freely through hero AND slices, exactly like render
          Position: top:120px so it starts behind the countdown number */}
      <div className="gn-a" style={{
        position:'absolute',
        top: journeyOpen ? '60px' : '115px',
        left:'50%',
        fontFamily:"'Fraunces',serif",
        fontWeight:700,fontStyle:'normal',
        fontSize: journeyOpen ? '150px' : '320px',
        lineHeight:1,letterSpacing:'-.06em',
        whiteSpace:'nowrap',
        color:ghostColor,
        opacity:ghostOp,
        filter:'blur(8px)',
        fontFeatureSettings:'"opsz" 144',
        pointerEvents:'none',
        zIndex:3,
        transition:`top 480ms ${EASE}, font-size 480ms ${EASE}`,
        // Soft fade only at the very bottom — ghost bleeds through slices
        WebkitMaskImage:'linear-gradient(180deg,rgba(0,0,0,1) 0%,rgba(0,0,0,1) 70%,rgba(0,0,0,0.3) 88%,rgba(0,0,0,0) 100%)',
        maskImage:'linear-gradient(180deg,rgba(0,0,0,1) 0%,rgba(0,0,0,1) 70%,rgba(0,0,0,0.3) 88%,rgba(0,0,0,0) 100%)',
      }}>{days}</div>

      {/* ── UPPER FROST BAND — chrome area only ── */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,height:120,
        background:topBandBg,
        backdropFilter:'blur(22px) saturate(1.1)',
        WebkitBackdropFilter:'blur(22px) saturate(1.1)',
        WebkitMaskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',
        maskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',
        pointerEvents:'none',zIndex:2,
      }}/>

      {/* ── BOTTOM DARK PANEL — covers slice zone ──
          This is the dramatic element in the Sky Ivory render: near-black glass
          Ghost bleeds through it. Slice text sits on top, fully legible. */}
      <div style={{
        position:'absolute',
        top: journeyOpen ? '22%' : '46%',
        left:0,right:0,bottom:0,
        background:bottomPanelBg,
        backdropFilter:'blur(20px) saturate(1.2)',
        WebkitBackdropFilter:'blur(20px) saturate(1.2)',
        WebkitMaskImage:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 12%,#000 22%)',
        maskImage:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.7) 12%,#000 22%)',
        pointerEvents:'none',zIndex:4,
        transition:`top 480ms ${EASE}`,
      }}/>

      {/* ── ARC ── */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:108,zIndex:6,pointerEvents:'none'}}>
        <svg viewBox="0 0 320 108" preserveAspectRatio="none" style={{width:'100%',height:'100%',overflow:'visible'}}>
          <path d="M 18 92 Q 160 4 302 92" stroke={arcRail} strokeWidth="1" fill="none"/>
          <path d={arcPathTo(progress)} stroke={arc} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <circle cx={dot.x} cy={dot.y} r="18" fill="none" stroke={arc} strokeWidth=".5" className="do-a"/>
          <circle cx={dot.x} cy={dot.y} r="10" fill="none" stroke={arc} strokeWidth=".8" className="dh-a"/>
          <circle cx={dot.x} cy={dot.y} r="4.5" fill={arc} className="dc-a"/>
        </svg>
      </div>

      {/* I WILL / I DO */}
      <div style={{position:'absolute',top:`calc(env(safe-area-inset-top,0px) + 76px)`,left:0,right:0,display:'flex',justifyContent:'space-between',padding:'0 20px',zIndex:7,pointerEvents:'none'}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.3em',textTransform:'uppercase' as any,color:inkMute}}>I will</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.3em',textTransform:'uppercase' as any,color:inkMute}}>I do</span>
      </div>

      {/* ── CHROME ── */}
      <div style={{position:'relative',zIndex:8,display:'flex',alignItems:'center',justifyContent:'space-between',padding:`calc(env(safe-area-inset-top,0px) + 84px) 18px 0`,flexShrink:0}}>
        <button onClick={()=>go('/frost/canvas/discover')} style={{display:'flex',alignItems:'center',gap:5,height:24,padding:'0 10px',borderRadius:2,background:pillBg,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:`0.5px solid ${pillBdr}`,fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.2em',textTransform:'uppercase' as any,color:pillTxt,cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <span style={{width:4,height:4,borderRadius:'50%',background:accent,flexShrink:0}}/>
          Discover
        </button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.2em',color:inkMute}}>{romanDate()}</span>
      </div>

      {/* ── HERO — z:5, above ghost (z:3) and bottom panel (z:4) ── */}
      <div style={{position:'relative',zIndex:5,padding:journeyOpen?'8px 18px 4px':'14px 18px 10px',flexShrink:0,transition:`padding 480ms ${EASE}`}}>
        {!journeyOpen&&(
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.28em',textTransform:'uppercase' as any,color:inkMute,marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
            {weekday}
            <span style={{flex:1,maxWidth:44,height:.5,background:line}}/>
          </div>
        )}

        {/* Italianno greeting */}
        <div style={{fontFamily:"'Italianno',cursive",fontSize:journeyOpen?38:58,lineHeight:.9,letterSpacing:'-.01em',color:ink,marginBottom:journeyOpen?4:8,transition:`font-size 480ms ${EASE}`}}>
          Hello, <span style={{color:accent}}>{name}</span>.
        </div>

        {!journeyOpen&&<div style={{width:40,height:1,background:`linear-gradient(90deg,${accent},transparent)`,marginBottom:10}}/>}

        {/* Fraunces Bold countdown */}
        <div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <div className="num-a" style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontStyle:'normal',fontSize:journeyOpen?46:80,lineHeight:.88,letterSpacing:'-.04em',color:accent,fontFeatureSettings:'"opsz" 144',transition:`font-size 480ms ${EASE}`}}>
            {days}
          </div>
          <div style={{fontFamily:"'Jost',sans-serif",fontWeight:200,fontSize:8,letterSpacing:'.44em',textTransform:'uppercase' as any,color:accent,opacity:.5}}>mornings</div>
        </div>

        {!journeyOpen&&(
          <>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:14,lineHeight:1.62,color:inkSoft,marginTop:10,marginBottom:6,fontFeatureSettings:'"opsz" 9'}}>
              {proseLine.split(/(I will|I do)/g).map((p,i)=>
                p==='I will'||p==='I do'
                  ?<span key={i} style={{color:accent,fontWeight:400}}>{p}</span>
                  :<span key={i}>{p}</span>
              )}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.2em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>{dateStamp}</div>
            {sinceYes>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.16em',textTransform:'uppercase' as any,color:signal}}>↑ {sinceYes} days since you said yes</div>}
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:12,lineHeight:1.55,marginTop:8,color:inkMute,fontFeatureSettings:'"opsz" 9'}}>"{poetry}"</div>
          </>
        )}
      </div>

      {/* ── SLICES — z:5, above bottom panel (z:4), ghost (z:3) bleeds behind ── */}
      <div style={{position:'relative',zIndex:5,flex:1,display:'flex',flexDirection:'column',borderTop:`.5px solid ${lineStr}`,overflow:'hidden',minHeight:0}}>
        {SLICES.map((slice,idx)=>(
          <div key={slice.key} onClick={()=>go(slice.route)} className="si-a" style={{
            flex:1,
            minHeight:0,  /* let flex decide — no forced min */
            display:'flex',alignItems:'center',padding:'0 18px',gap:7,
            borderBottom:`.5px solid ${line}`,
            cursor:'pointer',WebkitTapHighlightColor:'transparent',
            background:'transparent',
            animationDelay:`${idx*16}ms`,
          }}>
            <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:17,lineHeight:1,flexShrink:0,
              color: dark ? sliceTxt : '#FFFFFF',
              fontFeatureSettings:'"opsz" 9',transition:`font-size 480ms ${EASE}`}}>
              {slice.label}
            </span>
            {slice.candle&&<span className="cf-a" style={{width:5,height:5,borderRadius:'50%',background:signal,boxShadow:`0 0 7px ${signal}`,flexShrink:0}}/>}
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.1em',textTransform:'uppercase' as any,
              color: dark ? hintTxt : 'rgba(255,255,255,.55)',
              marginLeft:'auto',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:150}}>
              {slice.hint}
            </span>
            {(slice.key==='discover'||slice.key==='meridian')&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:dark?inkMute:'rgba(255,255,255,.4)',flexShrink:0}}>→</span>}
          </div>
        ))}
      </div>

      {/* ── JOURNEY — z:5, anchored bottom ── */}
      <div style={{position:'relative',zIndex:5,flexShrink:0,borderTop:`.5px solid ${lineStr}`,paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 2px)',background:journeyOpen?jnyBg:'transparent',transition:`background 300ms ${EASE}`}}>
        <div onClick={()=>setJourneyOpen(o=>!o)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px',cursor:'pointer',WebkitTapHighlightColor:'transparent',minHeight:44}}>
          <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:17,
            color: dark ? accent : '#FFFFFF',
            fontFeatureSettings:'"opsz" 9'}}>Journey</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:dark?accent:'rgba(255,255,255,.6)',opacity:.55,display:'inline-block',transform:journeyOpen?'rotate(180deg)':'rotate(0deg)',transition:`transform 300ms ${EASE}`}}>∨</span>
        </div>
        {journeyOpen&&(
          <div style={{borderTop:`.5px solid ${line}`}}>
            {JOURNEY.map((link,i)=>(
              <div key={link.label} onClick={()=>go(link.route)} className="si-a" style={{display:'flex',alignItems:'center',minHeight:44,padding:'0 24px',borderBottom:`.5px solid ${line}`,cursor:'pointer',WebkitTapHighlightColor:'transparent',animationDelay:`${i*28}ms`}}>
                <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:15,flex:1,color:dark?inkSoft:'rgba(255,255,255,.85)',fontFeatureSettings:'"opsz" 9'}}>{link.label}</span>
                {link.hint&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.1em',textTransform:'uppercase' as any,color:dark?inkMute:'rgba(255,255,255,.45)'}}>{link.hint}</span>}
              </div>
            ))}
            <div onClick={()=>setHomeMode(dark?'E3':'E1A')} className="si-a" style={{display:'flex',alignItems:'center',justifyContent:'space-between',minHeight:44,padding:'0 24px',cursor:'pointer',WebkitTapHighlightColor:'transparent',animationDelay:`${JOURNEY.length*28}ms`}}>
              <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:15,color:dark?inkSoft:'rgba(255,255,255,.85)',fontFeatureSettings:'"opsz" 9'}}>Mode</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.18em',textTransform:'uppercase' as any,color:accent}}>
                {dark?'Dark':'Light'} · <span style={{opacity:.5}}>switch</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
