'use client';
// EventsRoom — the journey timeline bloom.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { fetchEvents, updateEvent, fetchCircle, type CoupleEvent, type CircleMember } from '@/lib/frost/journey';
import { ASSIGN_ASK, ASSIGN_PICKER_HEAD, ASSIGN_NO_ONE } from '@/lib/circle/assignCopy';
import { usePress } from '@/components/frost/_shared/usePress';

// ── TDW_14 · D-4b ② · THE BRIDE DELEGATES A DAY ───────────────────────────────
//
// THIS BLOOM NOW WRITES, AND THAT IS A DECLARED MOVEMENT, NOT A SIDE EFFECT.
// `docs/BRIDE_PARITY_MATRIX.md` G-1 has said since Row 13 that this surface is
// READ-ONLY — "two call sites, zero writers" — and it was TDW_15's contract on
// that sentence. `scripts/tdw13_d6_parity_matrix.proof.mjs` cell 4a enforced it
// by grepping this file for `updateEvent`.
//
// The assign is a WRITE, so that claim moves. It moves by charter (R-D4b.1,
// CE-33, 2026-08-14) with the matrix amended in place and the cell re-authored
// to assert the NEW ruling: `updateEvent` appears here at the assign call site
// and NOWHERE ELSE, and `createEvent`/`deleteEvent` remain absent. G-1 is
// PARTIALLY closed — the assign is a FIFTH writer, not one of the four tabled;
// create, delete and edit are still open exactly as tabled.
//
// THE ROUTE NOT TAKEN, NAMED SO IT IS NOT RE-PROPOSED: a client function called
// `assignEvent` would have kept 4a's grep green while G-1's ruling went false
// underneath it. The cell would pass, the document would lie, and the next block
// would plan against a surface that no longer exists. A cell asserts the ruling,
// not the implementation (R-33.2) — and the inverse of that law is that you do
// not rename code to satisfy a cell.

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
  const [members, setMembers]   = React.useState<CircleMember[]>([]);
  const [picking, setPicking]   = React.useState<CoupleEvent|null>(null);
  const [saving,  setSaving]    = React.useState(false);

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

  // THE ROSTER, read once. Only ACTIVE seats may hold a task: `status` is
  // 'active'|'pending'|'removed', and D-4a's door refuses a non-active seat
  // server-side anyway (assigned.js `seatFor`, .eq('status','active')). Offering
  // a pending invitee here would show the bride a choice the wire would refuse.
  // A failed read leaves the roster empty, which hides the affordance rather
  // than showing a picker with nothing in it.
  React.useEffect(()=>{
    fetchCircle()
      .then(d=>setMembers((d?.members||[]).filter(m=>m.status==='active')))
      .catch(()=>{ /* keep empty — the affordance simply does not appear */ });
  },[]);

  // Ⓓ THE NAME ALONE. Null means nobody holds it. A seat id we cannot resolve to
  // an active member also reads as nobody — which is the REMOVAL CASE arriving
  // on screen: the column is ON DELETE SET NULL server-side, so a removed
  // member's task returns to the pool, and until the next read this fallback
  // shows the same truth rather than a stale name.
  const holderName = (ev:CoupleEvent):string|null => {
    if(!ev.assigned_circle_member_id) return null;
    const m = members.find(x=>x.id===ev.assigned_circle_member_id);
    return m ? m.invitee_name : null;
  };

  // AN ASSIGNMENT DOES NOT NOTIFY (R-D4.3). No send, no nudge, no toast — the
  // name appearing under the day is the whole of the feedback, by ruling.
  const assign = async (ev:CoupleEvent, memberId:string|null) => {
    if(saving) return;
    setSaving(true);
    try {
      await updateEvent(ev.id, { assigned_circle_member_id: memberId });
      setEvents(prev=>prev.map(e=>e.id===ev.id?{...e, assigned_circle_member_id: memberId}:e));
    } catch { /* keep last known — a dropped packet must not blank her day */ }
    finally { setSaving(false); setPicking(null); }
  };

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

                    {/* ── DELEGATION ROW ────────────────────────────────────
                        Ⓓ THE NAME ALONE when someone holds it — no "Assigned
                        to", no owner label, no chip. The bride chose that name;
                        a label in front of it explains a relationship the screen
                        has already made obvious.

                        Ⓐ THE AFFORDANCE when nobody does. Rendered only when the
                        roster has an active seat in it: an invitation to delegate
                        to a circle of nobody is an invitation to a dead end. */}
                    {holderName(ev)?(
                      <div style={{marginTop:6,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgAccent}}>
                        {holderName(ev)}
                      </div>
                    ):members.length>0?(
                      <button onClick={(e)=>{e.stopPropagation();setPicking(ev);}}
                        style={{marginTop:6,padding:'4px 10px',borderRadius:100,
                          border:`0.5px solid ${pgAccent}33`,background:'transparent',
                          fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                          textTransform:'uppercase' as any,color:pgInkMute,cursor:'pointer'}}>
                        {ASSIGN_ASK}
                      </button>
                    ):null}

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

      {/* ── THE PICKER ────────────────────────────────────────────────────────
          TWO CORRECTIONS RIDE THIS BLOCK, both caught by benches this delivery
          did not write, and both worth the reader's eye:

          1. IT IS `fixed`, NOT `absolute`. The first cut added
             `position:'relative'` to the bloom's outer div to anchor an absolute
             overlay — and `tdw13_d4_extraction` cell 2a went red, because that
             line is a VERBATIM RELOCATION from sanctuary/page.tsx and D-4's
             whole claim is that the extraction moved bytes without changing
             them. A feature does not get to edit a line whose byte-identity is
             another delivery's proof. The line went back untouched and the
             overlay anchors to the viewport, which is where a modal belongs
             anyway.

          2. THE PANEL'S COLOURS ARE THE BLOOM'S OWN. The first cut invented two
             hex literals for the panel background; cell 6a of
             `tdw13_d4_extraction` reddened — "no colour literal was invented or
             converted, P3 owns tokens". The panel now reuses the dark and light
             values already carried by this file's own gradients.

             AND THE FIRST CURE STILL REDDENED, which is the part worth keeping:
             this note originally QUOTED the two retired hexes, and 6a reads raw
             source. It convicted on the explanation of its own cure. That cell
             is comment-blind — any future note naming a colour it retired will
             red the same way. Reported to the chair, not cured here: widening an
             invention-cell's reader is not this delivery's to do.

          THE SCRIM IS A SIBLING OF THE PANEL, NOT ITS PARENT, and that is
          deliberate: nesting the panel inside the dismisser forces a
          stopPropagation tap handler on the panel itself, which is a SECOND
          interactive element the control census would have to count for a thing
          no thumb is meant to press. Two siblings and a z-index cost nothing and
          keep the inventory honest.

          Ⓒ SITS IN THE SAME LIST AS THE NAMES, not off in a destructive corner.
          Taking a task back is a choice among the same choices, not an undo. */}
      {picking&&(
        <>
          <div onClick={()=>setPicking(null)} style={{position:'fixed',inset:0,background:dark?'rgba(8,2,4,.72)':'rgba(12,24,48,.42)',zIndex:20}}/>
          <div style={{position:'fixed',left:16,right:16,bottom:16,zIndex:21,
            borderRadius:14,padding:'18px 18px 12px',
            border:`0.5px solid ${pgBubbleBdr}`,
            background:dark?'#1A0A0E':'#EEF0F6',
            boxShadow:'0 12px 40px rgba(0,0,0,.35)',
            maxHeight:'60%',overflowY:'auto'}}>

            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:pgInk,fontFeatureSettings:'"opsz" 9',marginBottom:14}}>
              {ASSIGN_PICKER_HEAD}
            </div>

            {members.map(m=>(
              <button key={m.id} disabled={saving} onClick={()=>assign(picking,m.id)}
                style={{display:'block',width:'100%',textAlign:'left' as any,
                  padding:'11px 2px',background:'transparent',border:'none',
                  borderBottom:`0.5px solid ${pgLine}`,
                  fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,
                  color:m.id===picking.assigned_circle_member_id?pgAccent:pgInk,
                  fontFeatureSettings:'"opsz" 9',cursor:saving?'default':'pointer',
                  opacity:saving?.5:1}}>
                {m.invitee_name}
              </button>
            ))}

            <button disabled={saving} onClick={()=>assign(picking,null)}
              style={{display:'block',width:'100%',textAlign:'left' as any,
                padding:'11px 2px',background:'transparent',border:'none',
                fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                textTransform:'uppercase' as any,
                color:picking.assigned_circle_member_id?pgInkMute:pgAccent,
                cursor:saving?'default':'pointer',opacity:saving?.5:1}}>
              {ASSIGN_NO_ONE}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
