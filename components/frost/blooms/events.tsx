'use client';
// EventsRoom — the journey timeline bloom.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { fetchEvents, type CoupleEvent } from '@/lib/frost/journey';
import { usePress } from '@/components/frost/_shared/usePress';

// ── EVENTS ROOM — ornament on a string ────────────────────────────────────────
// Vertical line. Date bubble. Beautiful moments hanging off it.
// Same layout as the original events page the bride loved.

interface EventsRoomProps {
  dark:boolean; accent:string; signal:string;
  roomInk:string; roomInkSoft:string; roomInkMute:string; roomLine:string;
}

export function EventsRoom({ dark, accent, roomInk, roomInkSoft, roomInkMute }: EventsRoomProps) {
  const { press, pressed } = usePress();
  const [events,  setEvents]  = React.useState<CoupleEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<CoupleEvent|null>(null);

  // Gradient — same family as the rest of the mode
  // Events inherits exact same gradient as Sanctuary — same DNA, same house
  const evBg = dark
    ? 'radial-gradient(ellipse 110% 55% at 50% -5%,rgba(196,133,106,.18) 0%,transparent 52%),radial-gradient(ellipse 70% 60% at 90% 110%,rgba(40,5,12,.80) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 5% 100%,rgba(60,8,20,.70) 0%,transparent 50%),linear-gradient(180deg,#1A0A0E 0%,#0E0506 40%,#080204 70%,#0C0408 100%)'
    : 'radial-gradient(ellipse 110% 50% at 60% -5%,rgba(74,122,155,.24) 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 10% 110%,rgba(42,95,130,.16) 0%,transparent 55%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 30%,#D8DEEC 60%,#CDD4E8 100%)';

  const pgInk     = dark ? '#F5E5DC' : '#0C1830';
  const pgInkSoft = dark ? 'rgba(245,229,220,.70)' : 'rgba(12,24,48,.65)';
  const pgInkMute = dark ? 'rgba(196,133,106,.50)' : 'rgba(42,80,130,.52)';
  const pgLine    = dark ? 'rgba(196,133,106,.14)' : 'rgba(42,80,130,.18)';
  const pgAccent  = dark ? '#C4856A' : '#2A5F82';
  const pgBubbleBg= dark ? 'rgba(196,133,106,.10)' : 'rgba(42,95,130,.10)';
  const pgBubbleBdr=dark ? 'rgba(196,133,106,.35)' : 'rgba(42,95,130,.35)';

  React.useEffect(()=>{
    fetchEvents('upcoming')
      .then(e=>{ setEvents(e); setLoading(false); })
      .catch(()=>setLoading(false));
  },[]);

  function fmtDate(d:string):{month:string;day:string} {
    const dt = new Date(d+'T00:00:00');
    if(isNaN(dt.getTime())) return {month:'',day:'—'};
    return {
      month: dt.toLocaleDateString('en-IN',{month:'short'}).toUpperCase(),
      day:   String(dt.getDate()),
    };
  }

  function fmtTime(t:string|null):string {
    if(!t) return '';
    const [h,m]=t.split(':').map(Number);
    return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'pm':'am'}`;
  }

  function daysUntilEvent(d:string):string {
    const today=new Date();today.setHours(0,0,0,0);
    const ev=new Date(d+'T00:00:00');ev.setHours(0,0,0,0);
    const diff=Math.round((ev.getTime()-today.getTime())/86400000);
    if(diff===0) return 'Today';
    if(diff===1) return 'Tomorrow';
    if(diff<0)   return `${Math.abs(diff)}d ago`;
    return `in ${diff} days`;
  }

  // Soonest upcoming event gets accent highlight
  const now=new Date();now.setHours(0,0,0,0);
  const soonestIdx=events.findIndex(ev=>{
    const d=new Date(ev.event_date+'T00:00:00');d.setHours(0,0,0,0);
    return d.getTime()>=now.getTime();
  });

  return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column',background:evBg}}>

      {/* Header */}
      <div style={{padding:'20px 24px 12px',borderBottom:`0.5px solid ${pgLine}`,flexShrink:0,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgAccent,lineHeight:1}}>
            The days.
          </div>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,marginTop:4,fontFeatureSettings:'"opsz" 9'}}>
            {events.length>0 ? `${events.length} beautiful moment${events.length!==1?'s':''} ahead.` : 'Your days will appear here.'}
          </div>
        </div>
        <button onClick={()=>{
          // Signal parent to open Dream Ai with prefill — bubble up via custom event
          window.dispatchEvent(new CustomEvent('frost:open-dream',{detail:{prompt:'Add an event to my calendar'}}));
        }} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:100,
          border:`0.5px solid ${pgAccent}44`,background:`${pgAccent}12`,
          fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
          textTransform:'uppercase' as any,color:pgAccent,cursor:'pointer',flexShrink:0}}>
          + Ask DreamAi
        </button>
      </div>

      {/* Timeline scroll */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,padding:'24px 24px 48px',position:'relative'}}>

        {loading&&(
          <div style={{textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,paddingTop:32}}>loading…</div>
        )}

        {!loading&&events.length===0&&(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,paddingTop:64}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgAccent,lineHeight:1,textAlign:'center' as any}}>Nothing<br/>yet.</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,textAlign:'center' as any,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>
              Tell Dream Ai about an event<br/>and it will appear here.
            </div>
          </div>
        )}

        {!loading&&events.length>0&&(
          <div style={{position:'relative'}}>
            {/* THE VERTICAL LINE — the string that holds the ornaments */}
            <div style={{
              position:'absolute',
              left:22,
              top:22,
              bottom:22,
              width:'0.5px',
              background:`linear-gradient(180deg, ${pgAccent}00 0%, ${pgAccent}60 8%, ${pgAccent}60 92%, ${pgAccent}00 100%)`,
            }}/>

            {/* Events — ornaments on the string */}
            {events.map((ev,i)=>{
              const {month,day}=fmtDate(ev.event_date);
              const timeStr=fmtTime(ev.event_time);
              const highlight=i===soonestIdx;
              const until=daysUntilEvent(ev.event_date);

              return(
                <div key={ev.id} {...press(`event:${ev.id}`)}
                  onClick={()=>setSelected(selected?.id===ev.id?null:ev)}
                  style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:28,cursor:'pointer',WebkitTapHighlightColor:'transparent',...pressed(`event:${ev.id}`)}}>

                  {/* Date bubble — the ornament head */}
                  <div style={{
                    width:44,height:44,borderRadius:'50%',flexShrink:0,
                    background: highlight ? pgAccent : pgBubbleBg,
                    border:`${highlight?1.5:.5}px solid ${highlight?pgAccent:pgBubbleBdr}`,
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                    zIndex:1,position:'relative',
                    boxShadow: highlight ? `0 0 16px ${pgAccent}40` : 'none',
                    transition:'all 200ms ease',
                  }}>
                    <div style={{
                      fontFamily:"'JetBrains Mono',monospace",
                      fontSize:9,letterSpacing:'.22em',
                      color: highlight ? (dark?'#1A0810':'#FFFFFF') : pgInkMute,
                      lineHeight:1.1,
                    }}>{month}</div>
                    <div style={{
                      fontFamily:"'Fraunces',serif",fontWeight:700,fontStyle:'normal',
                      fontSize:19,
                      color: highlight ? (dark?'#1A0810':'#FFFFFF') : pgInk,
                      lineHeight:1.1,
                      fontFeatureSettings:'"opsz" 144',
                    }}>{day}</div>
                  </div>

                  {/* Event content */}
                  <div style={{flex:1,paddingTop:6,minWidth:0}}>
                    {/* Title */}
                    <div style={{
                      fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
                      fontSize:19,lineHeight:1.2,
                      color: highlight ? pgAccent : pgInk,
                      fontFeatureSettings:'"opsz" 9',
                      marginBottom:4,
                    }}>{ev.title}</div>

                    {/* Meta row */}
                    <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' as any}}>
                      {timeStr&&(
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:pgInkMute}}>{timeStr}</span>
                      )}
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>{ev.kind}</span>
                      {/* Countdown — accent color for soonest */}
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:highlight?pgAccent:pgInkMute,marginLeft:'auto'}}>
                        {until}
                      </span>
                    </div>

                    {/* Notes — expand on tap */}
                    {selected?.id===ev.id&&ev.notes&&(
                      <div style={{
                        fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,
                        fontSize:16,color:pgInkSoft,lineHeight:1.6,
                        fontFeatureSettings:'"opsz" 9',
                        marginTop:8,
                        padding:'10px 12px',
                        borderLeft:`1.5px solid ${pgAccent}50`,
                        borderRadius:'0 4px 4px 0',
                        background: dark ? 'rgba(196,133,106,.05)' : 'rgba(42,95,130,.05)',
                      }}>
                        {ev.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
