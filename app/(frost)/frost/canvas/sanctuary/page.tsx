'use client';

// sanctuary/page.tsx — V3
// Identical to frost_final_two.html render (right column of each).
// Wine Night: #14080C dark, terracotta arc/accent, teal signal
// Sky & Ivory: #F0EEE8 light, slate blue arc/accent, cognac signal
// Ghost numeral: 300px Fraunces Bold, blurred, masked before slices
// Arc: full ghost rail + progress line + 3-ring pulsing dot
// Hero: Italianno greeting + Fraunces Bold countdown
// Journey: anchored bottom, expands up, hero collapses, slices compress

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFrostMode } from '../../../layout';
import { EASE, FROST_COPY, daysUntil } from '../../../../../lib/frost/tokens';

// ── Demo dates ────────────────────────────────────────────────────────────────
const DEMO_WEDDING    = new Date('2026-11-19T00:00:00+05:30');
const DEMO_ENGAGEMENT = new Date('2026-04-11T00:00:00+05:30');

function getWeddingDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) { const s = JSON.parse(raw); if (s?.wedding_date) return new Date(s.wedding_date); }
  } catch {}
  return DEMO_WEDDING;
}

function getEngagementDate(): Date {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) { const s = JSON.parse(raw); if (s?.engagement_date) return new Date(s.engagement_date); }
  } catch {}
  return DEMO_ENGAGEMENT;
}

function getBrideName(): string {
  try {
    const raw = localStorage.getItem('couple_session') || localStorage.getItem('couple_web_session');
    if (raw) {
      const s = JSON.parse(raw);
      const n = (s?.user_name || s?.bride_name || s?.name || '').trim().split(' ')[0];
      if (n) return n;
    }
  } catch {}
  return 'Priya';
}

function daysSince(d: Date): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const t = new Date(d); t.setHours(0,0,0,0);
  return Math.max(0, Math.round((today.getTime() - t.getTime()) / 86400000));
}

// Arc geometry: M 18 92 Q 160 4 302 92
function arcProgress(daysLeft: number): number {
  return Math.max(0, Math.min(1, 1 - daysLeft / 365));
}
function arcPoint(t: number) {
  const p0={x:18,y:92}, p1={x:160,y:4}, p2={x:302,y:92};
  const u=1-t;
  return { x: u*u*p0.x+2*u*t*p1.x+t*t*p2.x, y: u*u*p0.y+2*u*t*p1.y+t*t*p2.y };
}
function arcPathTo(t: number): string {
  if (t<=0) return 'M 18 92';
  const p0={x:18,y:92}, p1={x:160,y:4}, p2={x:302,y:92};
  const q0={x:p0.x+(p1.x-p0.x)*t, y:p0.y+(p1.y-p0.y)*t};
  const q1={x:p1.x+(p2.x-p1.x)*t, y:p1.y+(p2.y-p1.y)*t};
  const ep={x:q0.x+(q1.x-q0.x)*t, y:q0.y+(q1.y-q0.y)*t};
  return `M 18 92 Q ${q0.x.toFixed(1)} ${q0.y.toFixed(1)} ${ep.x.toFixed(1)} ${ep.y.toFixed(1)}`;
}

// Words
const ONES=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const TENS=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
function toW(n:number):string{ if(n<20) return ONES[n]||String(n); const t=Math.floor(n/10),o=n%10; if(!o) return TENS[t]; return `${TENS[t]}-${ONES[o].toLowerCase()}`; }
function bigW(n:number):string{ if(n<100) return toW(n); const h=Math.floor(n/100),r=n%100; return ONES[h]+' hundred'+(r?' and '+toW(r).toLowerCase():''); }
function dW(n:number):string{ if(n<100) return toW(n); if(n<1000) return bigW(n); return String(n); }
function prose(d:number):string{ if(d===0) return 'Today.'; const w=dW(d); return `${w.charAt(0).toUpperCase()+w.slice(1)} mornings between I will and I do.`; }

function romanDate():string{
  const n=new Date(), R=['','i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii'];
  return `${String(n.getDate()).padStart(2,'0')} · ${R[n.getMonth()+1]} · ${String(n.getFullYear()).slice(-2)}`;
}
function getDailyPoetry():string{
  const pool=FROST_COPY.idlePool;
  const d=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000);
  return pool[d%pool.length];
}

// ── Tokens — exact values from frost_final_two.html approved render ───────────
interface T { bg:string; arc:string; arcRail:string; ghost:string; ghostOp:number;
  glassBandBg:string; glassBandBgBot:string;
  ink:string; inkSoft:string; inkMute:string;
  accent:string; signal:string;
  pillBg:string; pillBorder:string; pillText:string;
  line:string; lineStrong:string; journeyBg:string;
  sliceNameColor:string; sliceHintColor:string; sliceMeridianBg:string; }

const WN:T = {
  bg: `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(196,133,106,.18) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(55,10,20,.55) 0%,transparent 55%),linear-gradient(180deg,#14080C 0%,#100608 55%,#0C0405 100%)`,
  arc: '#C4856A', arcRail: 'rgba(196,133,106,.14)',
  ghost: '#3A0C18', ghostOp: .92,
  glassBandBg: 'rgba(20,8,12,.62)', glassBandBgBot: 'rgba(16,6,8,.62)',
  ink: '#F5E5DC', inkSoft: 'rgba(245,225,215,.82)', inkMute: 'rgba(196,133,106,.42)',
  accent: '#C4856A', signal: '#6B9E8F',
  pillBg: 'rgba(20,8,12,.55)', pillBorder: 'rgba(196,133,106,.30)', pillText: 'rgba(245,225,215,.85)',
  line: 'rgba(196,133,106,.10)', lineStrong: 'rgba(196,133,106,.18)',
  journeyBg: 'rgba(196,133,106,.05)',
  sliceNameColor: '#F5E5DC', sliceHintColor: 'rgba(196,133,106,.55)', sliceMeridianBg: 'rgba(196,133,106,.04)',
};

const SI:T = {
  bg: `radial-gradient(ellipse 110% 60% at 50% -8%,rgba(168,196,216,.32) 0%,transparent 58%),radial-gradient(ellipse 70% 50% at 85% 108%,rgba(170,160,145,.14) 0%,transparent 55%),linear-gradient(180deg,#F0EEE8 0%,#E8E5DE 55%,#DDD9D0 100%)`,
  arc: '#2A5F82', arcRail: 'rgba(42,95,130,.22)',   // DARKER blue for legibility
  ghost: '#A8C4D8', ghostOp: .55,
  glassBandBg: 'rgba(240,238,232,.68)', glassBandBgBot: 'rgba(232,229,222,.75)',
  ink: '#0A1628', inkSoft: 'rgba(10,22,40,1.0)', inkMute: 'rgba(10,22,40,.65)',  // MUCH DARKER
  accent: '#2A5F82', signal: '#8B6E52',  // DARKER slate blue
  pillBg: 'rgba(240,238,232,.75)', pillBorder: 'rgba(42,95,130,.35)', pillText: 'rgba(14,30,46,.85)',
  line: 'rgba(42,95,130,.14)', lineStrong: 'rgba(42,95,130,.22)',
  journeyBg: 'rgba(42,95,130,.06)',
  sliceNameColor: '#0A1628', sliceHintColor: 'rgba(10,22,40,.75)',  // FULL LEGIBILITY
  sliceMeridianBg: 'rgba(42,95,130,.06)',
};

// ── Keyframes — injected once ─────────────────────────────────────────────────
const CSS = `
@keyframes gnBreathe{0%,100%{transform:translateX(-50%) scale(1);}50%{transform:translateX(-50%) scale(1.007);}}
@keyframes numBreathe{0%,100%{transform:scale(1);}50%{transform:scale(1.003);}}
@keyframes dotCore{0%,100%{opacity:.42;}18%,50%{opacity:1;}}
@keyframes dotHalo{0%,100%{opacity:.15;}18%,50%{opacity:.55;}}
@keyframes dotOuter{0%,100%{opacity:.05;}18%,50%{opacity:.2;}}
@keyframes candleFlicker{0%{opacity:.7}15%{opacity:1}28%{opacity:.85}45%{opacity:1}60%{opacity:.88}75%{opacity:1}88%{opacity:.72}100%{opacity:.7}}
@keyframes sliceIn{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}
.s-gn{animation:gnBreathe 9s ease-in-out infinite;}
.s-num{animation:numBreathe 7s ease-in-out infinite;}
.s-dc{animation:dotCore 4s ease-in-out infinite;}
.s-dh{animation:dotHalo 4s ease-in-out infinite;}
.s-do{animation:dotOuter 4s ease-in-out infinite;}
.s-candle{animation:candleFlicker 5s ease-in-out infinite;}
.s-in{animation:sliceIn 220ms cubic-bezier(0.22,1,0.36,1) forwards;}
`;

// ── Slices ────────────────────────────────────────────────────────────────────
const SLICES = [
  { key:'dream',    label:'Dream Ai',  hint:'Something will go wrong…',   route:'/frost/canvas/dream' },
  { key:'circle',   label:'Circle',    hint:'Meha lit a candle · 8m ago', route:'/frost/canvas/journey/circle',  candle:true },
  { key:'muse',     label:'Muse',      hint:'22 saved · 4 new',           route:'/frost/canvas/muse' },
  { key:'discover', label:'Discover',  hint:'Your curated world',          route:'/frost/canvas/discover' },
  { key:'people',   label:'My People', hint:'1 active · 1 invited',       route:'/frost/canvas/journey/people' },
  { key:'pages',    label:'Pages',     hint:'a page is waiting',           route:'/frost/canvas/journey/pages' },
  { key:'moments',  label:'Moments',   hint:'Your memories',               route:'/frost/canvas/journey/moments' },
  { key:'events',   label:'Events',    hint:'Your timeline',               route:'/frost/canvas/journey/events' },
  { key:'meridian', label:'Meridian',  hint:'Skin · mind · body',          route:'/frost/canvas/journey/meridian', premium:true },
];

const JOURNEY = [
  { label:'Expenses',  hint:'₹2.4L logged',  route:'/frost/canvas/journey/expenses' },
  { label:'Vendors',   hint:'4 confirmed',    route:'/frost/canvas/journey/vendors' },
  { label:'Settings',  hint:'',               route:'/frost/canvas/journey/settings' },
];

// ── Root ──────────────────────────────────────────────────────────────────────
export default function SanctuaryPage() {
  const router = useRouter();
  const { homeMode, setHomeMode } = useFrostMode();
  const dark = homeMode === 'E1A';
  const tk: T = dark ? WN : SI;

  const [days,        setDays]        = useState(176);
  const [progress,    setProgress]    = useState(.38);
  const [brideName,   setBrideName]   = useState('Priya');
  const [proseLine,   setProseLine]   = useState('');
  const [poetry,      setPoetry]      = useState('');
  const [sinceYes,    setSinceYes]    = useState(47);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [weekday,     setWeekday]     = useState('Wednesday morning');
  const [dateStamp,   setDateStamp]   = useState('');

  useEffect(() => {
    if (!document.getElementById('s-v3-css')) {
      const s = document.createElement('style');
      s.id = 's-v3-css'; s.textContent = CSS;
      document.head.appendChild(s);
    }
    const wDate = getWeddingDate();
    const eDate = getEngagementDate();
    const d = daysUntil(wDate);
    setDays(d);
    setProgress(arcProgress(d));
    setBrideName(getBrideName());
    setProseLine(prose(d));
    setPoetry(getDailyPoetry());
    setSinceYes(daysSince(eDate));
    const now = new Date();
    setWeekday(now.toLocaleDateString('en-IN',{weekday:'long'})+' morning');
    const DOM=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second','Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh','Twenty-Eighth','Twenty-Ninth','Thirtieth','Thirty-First'];
    setDateStamp(`${DOM[now.getDate()]||now.getDate()} of ${now.toLocaleDateString('en-IN',{month:'long'})} · ${now.getFullYear()}`);
  }, []);

  const go = useCallback((p:string) => router.push(p), [router]);
  const dot = arcPoint(progress);

  // ── Shared inline styles ──────────────────────────────────────────────────
  const ease = `transition: all 480ms ${EASE}`;

  return (
    <div style={{
      position:'fixed', inset:0,
      background: tk.bg,
      display:'flex', flexDirection:'column',
      overflow:'hidden',
      userSelect:'none', WebkitUserSelect:'none' as any,
    }}>

      {/* Grain */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:'160px', opacity: dark ? .45 : .22,
      }}/>

      {/* ── Ghost numeral — positioned from top, visible behind hero ── */}
      <div className="s-gn" style={{
        position:'absolute',
        top: journeyOpen ? '80px' : '140px',
        left:'50%',
        fontFamily:"'Fraunces', serif",
        fontWeight:700, fontStyle:'normal',
        fontSize: journeyOpen ? '160px' : '310px',
        lineHeight:1, letterSpacing:'-.06em',
        whiteSpace:'nowrap',
        color: tk.ghost,
        opacity: tk.ghostOp,
        filter:'blur(8px)',
        fontFeatureSettings:'"opsz" 144',
        pointerEvents:'none', zIndex:1,
        transition:`top 480ms ${EASE}, font-size 480ms ${EASE}`,
        /* Fade out BELOW the hero prose — not above */
        WebkitMaskImage:'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.05) 72%, rgba(0,0,0,0) 85%)',
        maskImage:'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.05) 72%, rgba(0,0,0,0) 85%)',
      }}>
        {days}
      </div>

      {/* ── Upper frost glass band ── */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:128,
        background: tk.glassBandBg,
        backdropFilter:'blur(22px) saturate(1.1)',
        WebkitBackdropFilter:'blur(22px) saturate(1.1)',
        WebkitMaskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',
        maskImage:'linear-gradient(180deg,#000 55%,transparent 100%)',
        pointerEvents:'none', zIndex:2,
      }}/>

      {/* ── Arc — I will → I do ── */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:108,zIndex:5,pointerEvents:'none'}}>
        <svg viewBox="0 0 320 108" preserveAspectRatio="none"
          style={{width:'100%',height:'100%',overflow:'visible'}}>
          {/* Ghost rail — full arc */}
          <path d="M 18 92 Q 160 4 302 92"
            stroke={tk.arcRail} strokeWidth="1" fill="none"/>
          {/* Progress arc — today's position */}
          <path d={arcPathTo(progress)}
            stroke={tk.arc} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* Three-ring pulsing dot */}
          <circle cx={dot.x} cy={dot.y} r="18" fill="none"
            stroke={tk.arc} strokeWidth=".5" className="s-do"/>
          <circle cx={dot.x} cy={dot.y} r="10" fill="none"
            stroke={tk.arc} strokeWidth=".8" className="s-dh"/>
          <circle cx={dot.x} cy={dot.y} r="4.5" fill={tk.arc}
            className="s-dc"/>
        </svg>
      </div>

      {/* I WILL / I DO labels */}
      <div style={{
        position:'absolute',
        top:`calc(env(safe-area-inset-top,0px) + 76px)`,
        left:0, right:0,
        display:'flex', justifyContent:'space-between',
        padding:'0 20px', zIndex:6, pointerEvents:'none',
      }}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.3em',textTransform:'uppercase',color:tk.inkMute}}>I will</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.3em',textTransform:'uppercase',color:tk.inkMute}}>I do</span>
      </div>

      {/* ── Top chrome ── */}
      <div style={{
        position:'relative', zIndex:7,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:`calc(env(safe-area-inset-top,0px) + 84px) 18px 0`,
        flexShrink:0,
      }}>
        <button onClick={()=>go('/frost/canvas/discover')} style={{
          display:'flex', alignItems:'center', gap:5,
          height:24, padding:'0 10px', borderRadius:2,
          background:tk.pillBg,
          backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
          border:`0.5px solid ${tk.pillBorder}`,
          fontFamily:"'JetBrains Mono',monospace", fontSize:7,
          letterSpacing:'.2em', textTransform:'uppercase',
          color:tk.pillText, cursor:'pointer',
          WebkitTapHighlightColor:'transparent',
        }}>
          <span style={{width:4,height:4,borderRadius:'50%',background:tk.accent,flexShrink:0}}/>
          Discover
        </button>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.2em',color:tk.inkMute}}>
          {romanDate()}
        </span>
      </div>

      {/* ── Hero ── */}
      <div style={{
        position:'relative', zIndex:4,
        padding: journeyOpen ? '8px 18px 4px' : '14px 18px 10px',
        flexShrink:0,
        transition:`padding 480ms ${EASE}`,
      }}>
        {/* Weekday eyebrow */}
        {!journeyOpen && (
          <div style={{
            fontFamily:"'JetBrains Mono',monospace", fontSize:7,
            letterSpacing:'.28em', textTransform:'uppercase',
            color:tk.inkMute, marginBottom:10,
            display:'flex', alignItems:'center', gap:8,
          }}>
            {weekday}
            <span style={{flex:1,maxWidth:44,height:.5,background:tk.line}}/>
          </div>
        )}

        {/* Italianno greeting — EXACTLY as in render */}
        <div style={{
          fontFamily:"'Italianno', cursive",
          fontSize: journeyOpen ? 38 : 58,
          lineHeight:.9, letterSpacing:'-.01em',
          color:tk.ink,
          marginBottom: journeyOpen ? 4 : 8,
          transition:`font-size 480ms ${EASE}`,
        }}>
          Hello, <span style={{color:tk.accent}}>{brideName}</span>.
        </div>

        {/* Accent rule */}
        {!journeyOpen && (
          <div style={{
            width:40, height:1,
            background:`linear-gradient(90deg,${tk.accent},transparent)`,
            marginBottom:10,
          }}/>
        )}

        {/* Fraunces Bold countdown — EXACTLY as in render */}
        <div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <div className="s-num" style={{
            fontFamily:"'Fraunces', serif",
            fontWeight:700, fontStyle:'normal',
            fontSize: journeyOpen ? 46 : 80,
            lineHeight:.88, letterSpacing:'-.04em',
            color:tk.accent,
            fontFeatureSettings:'"opsz" 144',
            transition:`font-size 480ms ${EASE}`,
          }}>
            {days}
          </div>
          <div style={{
            fontFamily:"'Jost', sans-serif", fontWeight:200,
            fontSize:8, letterSpacing:'.44em', textTransform:'uppercase',
            color:tk.accent, opacity:.5,
          }}>
            mornings
          </div>
        </div>

        {/* Prose + date + since + poetry */}
        {!journeyOpen && (
          <>
            <div style={{
              fontFamily:"'Fraunces', serif", fontStyle:'italic', fontWeight:300,
              fontSize:14, lineHeight:1.62, color:tk.inkSoft,
              marginTop:10, marginBottom:6,
              fontFeatureSettings:'"opsz" 9',
            }}>
              {proseLine.split(/(I will|I do)/g).map((p,i) =>
                p==='I will'||p==='I do'
                  ? <span key={i} style={{color:tk.accent,fontWeight:400}}>{p}</span>
                  : <span key={i}>{p}</span>
              )}
            </div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.2em',textTransform:'uppercase',color:tk.inkMute,marginBottom:3}}>
              {dateStamp}
            </div>
            {sinceYes > 0 && (
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.16em',textTransform:'uppercase',color:tk.signal}}>
                ↑ {sinceYes} days since you said yes
              </div>
            )}
            <div style={{
              fontFamily:"'Fraunces', serif", fontStyle:'italic', fontWeight:300,
              fontSize:12, lineHeight:1.55, marginTop:8,
              color:tk.inkMute, fontFeatureSettings:'"opsz" 9',
            }}>
              "{poetry}"
            </div>
          </>
        )}
      </div>

      {/* ── Lower frost band — dark glassy blur over slice zone ── */}
      <div style={{
        position:'absolute',
        top: journeyOpen ? '26%' : '55%',
        left:0, right:0, bottom:0,
        background: tk.glassBandBgBot,
        backdropFilter:'blur(18px) saturate(1.1)',
        WebkitBackdropFilter:'blur(18px) saturate(1.1)',
        WebkitMaskImage:'linear-gradient(180deg,transparent 0%,#000 16%)',
        maskImage:'linear-gradient(180deg,transparent 0%,#000 16%)',
        pointerEvents:'none', zIndex:2,
        transition:`top 480ms ${EASE}`,
      }}/>

      {/* ── Slices ── */}
      <div style={{
        position:'relative', zIndex:3,
        flex:1, display:'flex', flexDirection:'column',
        borderTop:`.5px solid ${tk.lineStrong}`,
        overflow:'hidden', minHeight:0,
      }}>
        {SLICES.map((slice, idx) => (
          <div key={slice.key}
            onClick={() => go(slice.route)}
            className="s-in"
            style={{
              flex:1,
              minHeight: journeyOpen ? 22 : 34,
              maxHeight: journeyOpen ? 34 : 999,
              display:'flex', alignItems:'center',
              padding:'0 18px', gap:7,
              borderBottom:`.5px solid ${tk.line}`,
              cursor:'pointer',
              WebkitTapHighlightColor:'transparent',
              background: 'transparent',
              transition:`min-height 480ms ${EASE}, max-height 480ms ${EASE}`,
              animationDelay:`${idx*16}ms`,
            }}
          >
            {/* Slice name — Fraunces italic exactly as in render */}
            <span style={{
              fontFamily:"'Fraunces', serif",
              fontStyle:'italic', fontWeight:300,
              fontSize: journeyOpen ? 13 : 17,
              lineHeight:1, flexShrink:0,
              color: slice.premium ? tk.accent : tk.sliceNameColor,
              fontFeatureSettings:'"opsz" 9',
              transition:`font-size 480ms ${EASE}`,
            }}>
              {slice.label}
            </span>

            {/* Candle dot */}
            {slice.candle && (
              <span className="s-candle" style={{
                width:5, height:5, borderRadius:'50%',
                background:tk.signal,
                boxShadow:`0 0 7px ${tk.signal}`,
                flexShrink:0,
              }}/>
            )}

            {/* Hint */}
            <span style={{
              fontFamily:"'JetBrains Mono',monospace",
              fontSize:6.5, letterSpacing:'.1em', textTransform:'uppercase',
              color: slice.premium ? tk.accent : tk.sliceHintColor,
              opacity: slice.premium ? .7 : 1,
              marginLeft:'auto',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              maxWidth:150,
            }}>
              {slice.hint}
            </span>

            {(slice.key==='discover'||slice.key==='meridian') && (
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:tk.inkMute,flexShrink:0}}>→</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Journey — always anchored to bottom ── */}
      <div style={{
        position:'relative', zIndex:4, flexShrink:0,
        borderTop:`.5px solid ${tk.lineStrong}`,
        paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 2px)',
        background: journeyOpen ? tk.journeyBg : 'transparent',
        transition:`background 300ms ${EASE}`,
      }}>
        {/* Header */}
        <div onClick={() => setJourneyOpen(o=>!o)} style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'10px 18px', cursor:'pointer',
          WebkitTapHighlightColor:'transparent', minHeight:44,
        }}>
          <span style={{
            fontFamily:"'Fraunces', serif", fontStyle:'italic', fontWeight:300,
            fontSize:17, color:tk.accent, fontFeatureSettings:'"opsz" 9',
          }}>Journey</span>
          <span style={{
            fontFamily:"'JetBrains Mono',monospace", fontSize:10,
            color:tk.accent, opacity:.55,
            display:'inline-block',
            transform: journeyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition:`transform 300ms ${EASE}`,
          }}>∨</span>
        </div>

        {/* Sub-rows */}
        {journeyOpen && (
          <div style={{borderTop:`.5px solid ${tk.line}`}}>
            {JOURNEY.map((link, i) => (
              <div key={link.label}
                onClick={() => go(link.route)}
                className="s-in"
                style={{
                  display:'flex', alignItems:'center',
                  padding:'9px 24px',
                  borderBottom:`.5px solid ${tk.line}`,
                  cursor:'pointer',
                  WebkitTapHighlightColor:'transparent',
                  animationDelay:`${i*28}ms`,
                }}
              >
                <span style={{fontFamily:"'Fraunces', serif",fontStyle:'italic',fontWeight:300,fontSize:15,flex:1,color:tk.inkSoft,fontFeatureSettings:'"opsz" 9'}}>{link.label}</span>
                {link.hint && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:6.5,letterSpacing:'.1em',textTransform:'uppercase',color:tk.inkMute}}>{link.hint}</span>}
              </div>
            ))}
            {/* Mode toggle */}
            <div
              onClick={() => setHomeMode(dark ? 'E3' : 'E1A')}
              className="s-in"
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'9px 24px', cursor:'pointer',
                WebkitTapHighlightColor:'transparent',
                animationDelay:`${JOURNEY.length*28}ms`,
              }}
            >
              <span style={{fontFamily:"'Fraunces', serif",fontStyle:'italic',fontSize:15,color:tk.inkSoft,fontFeatureSettings:'"opsz" 9'}}>Mode</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:'.18em',textTransform:'uppercase',color:tk.accent}}>
                {dark ? 'Dark' : 'Light'} · <span style={{opacity:.5}}>switch</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
