'use client';
// EventsRoom — the journey timeline bloom.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent, setEventState,
         fetchCircle, type CoupleEvent, type CircleMember } from '@/lib/frost/journey';
import { ASSIGN_ASK, ASSIGN_PICKER_HEAD, ASSIGN_NO_ONE } from '@/lib/circle/assignCopy';
import {
  EVENT_ADD, EVENT_ASK_TITLE, EVENT_ASK_WHEN, EVENT_ASK_NOTES,
  EVENT_SAVE, EVENT_CANCEL, EVENT_ADDED, EVENT_UPDATED,
  EVENT_NEEDS_TITLE, EVENT_SAVE_FAILED, EVENT_REMOVE_ASK, EVENT_REMOVED,
  EVENT_DONE_HEAD, EVENT_EMPTY, EVENT_EDIT, EVENT_REMOVE, EVENT_KINDS,
} from '@/lib/frost/eventCopy';
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

// ── TDW_15 · P1 · P1.3 — G-1's REMAINING THREE CLOSE HERE ─────────────────────
//
// D-4b made this bloom write ONE column. This delivery makes it a room she can
// actually keep: create, edit, mark done, remove. `docs/BRIDE_PARITY_MATRIX.md`
// rows 3, 6 and 7 tick in the same delivery — the document is the contract and a
// row closed in code but not in ink is a silently skipped row, which the spec
// itself calls a failed session.
//
// ── THE ASSIGN'S BOUNDEDNESS SURVIVES, AND IT IS NOW A CLAIM ABOUT BODIES ────
// `tdw13_d6_parity_matrix` cell 4a2 asserted `updateEvent` appears here EXACTLY
// ONCE, because at D-4b one call site and one PATCH body were the same fact.
// They are not the same fact any more: the edit sheet writes through the same
// door, correctly, because a second client function calling one endpoint is the
// `assignEvent` anti-pattern D-4b refused on sight. So the cell is re-authored
// to the thing that is still true and still load-bearing — the assign writes
// `assigned_circle_member_id` AND NOTHING ELSE, and the edit sheet writes
// content fields and NEVER touches the delegation column. Two call sites, two
// disjoint bodies, asserted per body rather than per name. R-33.2: the cell
// follows the ruling, and the ruling moved because this delivery moved it.
//
// ── WHY THE STATE TOGGLE DOES NOT RIDE `updateEvent` ────────────────────────
// It rides `setEventState` → `PATCH /:eventId/state`, the estate's own narrow
// door (R-34.8). A third `updateEvent` site would make the boundedness above a
// thing maintained by care. The narrow door makes it structural.
//
// ── AND WHY THE ROOM NOW READS 'all' ───────────────────────────────────────
// It read `'upcoming'` and the server filters on exactly that (events.js:33), so
// marking a day done would have REMOVED IT FROM THE ONLY LIST THIS ROOM
// RENDERS — a done button that behaves like a delete. The read and the toggle
// are one ruling and shipped together; neither is severable from the other.
//
// `'cancelled'` rows stay invisible here, exactly as they are today: R-34.8
// refused the affordance, and this delivery makes no new claim about the read.

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

  // ── THE WRITE STATE ───────────────────────────────────────────────────────
  // `sheet` is null, 'create', or the event being edited. One variable rather
  // than an open flag beside a subject, because two variables can disagree and
  // the disagreement renders as an edit sheet with nothing in it.
  const [sheet,   setSheet]   = React.useState<'create'|CoupleEvent|null>(null);
  const [fTitle,  setFTitle]  = React.useState('');
  const [fDate,   setFDate]   = React.useState('');
  const [fTime,   setFTime]   = React.useState('');
  const [fKind,   setFKind]   = React.useState('ceremony');
  const [fNotes,  setFNotes]  = React.useState('');
  const [confirm, setConfirm] = React.useState<CoupleEvent|null>(null);
  const [toast,   setToast]   = React.useState<string|null>(null);

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(null), 2200); };

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

  // ONE INPUT STYLE FOR THE SHEET, lifted in shape from `vendors.tsx`'s and
  // `expenses.tsx`'s `inpStyle` so the three money-and-days sheets feel like one
  // hand. Every colour here is this file's own — no literal is invented, which
  // `tdw13_d4_extraction` cell 6a reads raw source to enforce.
  const sheetInput:React.CSSProperties = {
    width:'100%',padding:'12px 14px',
    background: dark ? 'rgba(196,133,106,.06)' : 'rgba(42,95,130,.06)',
    border:`0.5px solid ${pgLine}`,borderRadius:8,
    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:pgInk,
    outline:'none',boxSizing:'border-box',userSelect:'text',
  };

  // 'all', NOT 'upcoming' — see the header. A done day must settle, not vanish.
  React.useEffect(()=>{
    fetchEvents('all')
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
  // an active member also reads as nobody.
  //
  // ── F-14.13 · WHAT THIS COMMENT USED TO CLAIM, AND WHY IT WAS WRONG ───────
  // It said the column is `ON DELETE SET NULL` server-side, "so a removed
  // member's task returns to the pool". THE CONSTRAINT IS REAL AND IT HAS NEVER
  // FIRED. Nothing in the estate hard-deletes a `circle_members` row — removal
  // is a status flip — so at the time this was written the column still held the
  // removed seat's uuid and THIS FALLBACK WAS THE ONLY THING CLEARING THE NAME
  // OFF THE GLASS. The screen was right for a reason the comment did not name,
  // which is the worst shape a comment can take: it reads as an explanation and
  // is actually a second, wrong claim about the wire. Found on a walk, by one
  // SELECT behind the screen. F-14.12 is the defect; this is its comment.
  //
  // ── WHAT ACTUALLY RUNS, AS OF D-4c ────────────────────────────────────────
  //   · THE REMOVAL HANDLER CLEARS THE PLANE ITSELF — `DELETE
  //     /couple/circle/member/:memberId` nulls `assigned_circle_member_id` on
  //     this couple's events BEFORE it flips the status, and refuses the whole
  //     removal if that clear fails. That is the mechanism.
  //   · THE FK IS BELT-AND-BRACES. `ON DELETE SET NULL` stays on the column for
  //     a genuine hard delete, which no code path performs today.
  //   · SO THIS FALLBACK RENDERS THE POOL TRUTHFULLY BECAUSE THE COLUMN IS
  //     ACTUALLY NULL — it is no longer covering for the server. It still earns
  //     its place for the window between a removal and this screen's next read,
  //     where the roster has moved and the events list has not.
  const holderName = (ev:CoupleEvent):string|null => {
    if(!ev.assigned_circle_member_id) return null;
    const m = members.find(x=>x.id===ev.assigned_circle_member_id);
    return m ? m.invitee_name : null;
  };

  // ── THE WRITE HANDLERS ────────────────────────────────────────────────────
  // Every one of them patches from the SERVER'S returned row, never from the
  // form's own values. The server trims, zero-pads `event_time` and can refuse
  // a field; echoing the form would show her what she typed while the database
  // holds something else, and the next reload would silently correct her screen.

  const openCreate = () => {
    setFTitle(''); setFDate(''); setFTime(''); setFKind('ceremony'); setFNotes('');
    setSheet('create');
  };

  const openEdit = (ev:CoupleEvent) => {
    setFTitle(ev.title || ''); setFDate(ev.event_date || '');
    setFTime(ev.event_time ? ev.event_time.slice(0,5) : '');
    setFKind(ev.kind || 'other'); setFNotes(ev.notes || '');
    setSheet(ev);
  };

  const save = async () => {
    if(saving) return;
    if(!fTitle.trim()){ showToast(EVENT_NEEDS_TITLE); return; }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(fDate)){ showToast(EVENT_ASK_WHEN); return; }
    setSaving(true);
    try {
      if(sheet === 'create'){
        // `kind` comes from EVENT_KINDS and therefore can only be one the server
        // knows. F-15.5: this door SILENTLY rewrites an unrecognised kind to
        // 'other' while the PATCH door refuses it — so a sheet that could send a
        // thirteenth value would lose her choice with no error anywhere.
        const made = await createEvent({
          title: fTitle.trim(), event_date: fDate, kind: fKind,
          ...(fTime  ? { event_time: fTime } : {}),
          ...(fNotes.trim() ? { notes: fNotes.trim() } : {}),
        });
        setEvents(prev=>[...prev, made]);
        showToast(EVENT_ADDED);
      } else if(sheet){
        // THE DELEGATION COLUMN IS ABSENT FROM THIS BODY, DELIBERATELY. The
        // server reads `undefined` as "not mentioned" (events.js:153) so an
        // absent key preserves whoever holds the day. Sending it here — even as
        // the value already on the row — would make the edit sheet a second
        // writer of the assign's column and collapse the boundedness the matrix
        // bench asserts.
        const patched = await updateEvent(sheet.id, {
          title: fTitle.trim(), event_date: fDate, kind: fKind,
          event_time: fTime || null,
          notes: fNotes.trim() || null,
        });
        setEvents(prev=>prev.map(e=>e.id===patched.id?{...e, ...patched}:e));
        setSelected(s=>s&&s.id===patched.id?{...s, ...patched}:s);
        showToast(EVENT_UPDATED);
      }
      setSheet(null);
    } catch { showToast(EVENT_SAVE_FAILED); }
    setSaving(false);
  };

  // ⓵ NO LABEL — the control is a ring that fills (CE-34, veto line 11). The
  // member's side has spoken this verb without a word since D-4b.
  const toggleDone = async (ev:CoupleEvent) => {
    if(saving) return;
    const next = ev.state === 'done' ? 'upcoming' : 'done';
    setSaving(true);
    try {
      const r = await setEventState(ev.id, next);
      setEvents(prev=>prev.map(e=>e.id===ev.id?{...e, state:r.state}:e));
    } catch { /* keep last known — a dropped packet must not re-open her day */ }
    setSaving(false);
  };

  // THE REMOVAL IS A HARD DELETE AND THERE IS NO UNDO (R-34.9). That is why the
  // confirm is mandatory rather than a swipe, and why the optimistic drop keeps
  // the previous list to restore from: the estate's own shape at
  // `vendors.tsx` handleDelete and `expenses.tsx` handleDeleteReceipt.
  const remove = async (ev:CoupleEvent) => {
    const prevEvents = events;
    setConfirm(null); setSelected(null);
    setEvents(prev=>prev.filter(e=>e.id!==ev.id));
    const ok = await deleteEvent(ev.id);
    if(ok) showToast(EVENT_REMOVED);
    else { setEvents(prevEvents); showToast(EVENT_SAVE_FAILED); }
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

  // ── THE TWO GROUPS ────────────────────────────────────────────────────────
  // `upcoming` is the room. `done` settles beneath it. `cancelled` renders in
  // neither, which is exactly what she sees today — the old `?state=upcoming`
  // read excluded it and this delivery makes no new claim about it.
  const upcoming = events.filter(e=>e.state==='upcoming');
  const done     = events.filter(e=>e.state==='done');

  // Soonest upcoming event gets accent highlight
  const now=new Date();now.setHours(0,0,0,0);
  const soonestIdx=upcoming.findIndex(ev=>{
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
            {upcoming.length>0 ? `${upcoming.length} beautiful moment${upcoming.length!==1?'s':''} ahead.` : 'Your days will appear here.'}
          </div>
        </div>
        {/* TWO AFFORDANCES, AND THEY ARE DIFFERENT VERBS. `Add a day` is hers;
            `Ask Mira` hands the same intention to the agent. The chair ruled the
            ask KEPT (R-34.13) and the founder overrode only its NAME —
            「 all approved except ask dreamai. change it to ask Mira 」, radius A:
            this button alone. The other eight sites where the bride meets
            `Dream Ai` are named in the handover and stand untouched. */}
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <button onClick={openCreate}
            style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:100,
              border:`0.5px solid ${pgAccent}`,background:`${pgAccent}22`,
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,color:pgAccent,cursor:'pointer'}}>
            {EVENT_ADD}
          </button>
          <button onClick={()=>{
            // Signal parent to open Dream Ai with prefill — bubble up via custom event
            window.dispatchEvent(new CustomEvent('frost:open-dream',{detail:{prompt:'Add an event to my calendar'}}));
          }} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:100,
            border:`0.5px solid ${pgAccent}44`,background:`${pgAccent}12`,
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
            textTransform:'uppercase' as any,color:pgAccent,cursor:'pointer',flexShrink:0}}>
            + Ask Mira
          </button>
        </div>
      </div>

      {/* Timeline scroll */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any,padding:'24px 24px 48px',position:'relative'}}>

        {loading&&(
          <div style={{textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,paddingTop:32}}>loading…</div>
        )}

        {!loading&&events.length===0&&(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,paddingTop:64}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgAccent,lineHeight:1,textAlign:'center' as any}}>Nothing<br/>yet.</div>
            {/* VETO LINE 1. The byte that stood here — "Tell Dream Ai about an
                event and it will appear here." — became FALSE the moment this
                room grew its own Add. It told her to leave the room to do a
                thing the room now does. Approved 2026-08-15. */}
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,textAlign:'center' as any,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>
              {EVENT_EMPTY}
            </div>
          </div>
        )}

        {!loading&&upcoming.length>0&&(
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
            {upcoming.map((ev,i)=>{
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
                      {/* ⓵ THE DONE RING — NO LABEL (CE-34, veto line 11 STRUCK).
                          An 18px ring that fills, which is the byte-for-byte
                          shape the member's tray has spoken since D-4b
                          (`app/coplanner/page.tsx:363`). Ⓖ's expected-zero
                          extended to the bride: one verb, one vocabulary.
                          `stopPropagation` because the row itself expands on
                          tap and marking a day done is not asking to read it. */}
                      <button aria-label={undefined} disabled={saving}
                        onClick={(e)=>{e.stopPropagation();toggleDone(ev);}}
                        style={{width:18,height:18,flexShrink:0,borderRadius:'50%',padding:0,
                          border:`1px solid ${pgBubbleBdr}`,background:'transparent',
                          cursor:saving?'default':'pointer',opacity:saving?.5:1}}/>
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

                    {/* ── EDIT AND REMOVE, INSIDE THE EXPANSION ──────────────
                        They appear only on the row she has opened. Two reasons,
                        and the second is the load-bearing one:

                        · a destructive control on every row of a timeline is a
                          mis-tap waiting for a crowded thumb, and

                        · THE DELETE IS A HARD ROW DELETE WITH NO UNDO (R-34.9,
                          which refused adopting `events.deleted_at` — that
                          column is vendor-plane machinery and half-adopting a
                          convention is worse than not adopting it). So the
                          affordance sits one deliberate tap in, and the confirm
                          below it is mandatory rather than a swipe.

                        Both labels are DISCLOSED AS UNVETOED — the copy sheet
                        carried the confirm question and the toast but not the
                        words on the controls that raise them. That omission is
                        this seat's, owned in the handover; one constant each. */}
                    {selected?.id===ev.id&&(
                      <div style={{display:'flex',gap:14,marginTop:10}}>
                        <button onClick={(e)=>{e.stopPropagation();openEdit(ev);}}
                          style={{padding:0,background:'transparent',border:'none',
                            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                            textTransform:'uppercase' as any,color:pgInkMute,cursor:'pointer'}}>
                          {EVENT_EDIT}
                        </button>
                        <button onClick={(e)=>{e.stopPropagation();setConfirm(ev);}}
                          style={{padding:0,background:'transparent',border:'none',
                            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                            textTransform:'uppercase' as any,color:pgInkMute,cursor:'pointer'}}>
                          {EVENT_REMOVE}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ⓶ THE DONE SECTION ────────────────────────────────────────────
            The head renders ONLY over a non-empty group (CE-34, veto line 12
            STRUCK conditionally). Fixture 1 is why that was ruled rather than
            assumed: the canonical bride stands at `done = 0`, so an
            unconditional head would have shipped a heading over nothing on day
            one. Ⓕ's shape, one file over, for the same reason.

            A SETTLED DAY IS RENDERED QUIETLY, not as a struck-through ornament.
            It keeps its date and its name and loses the countdown, the
            delegation row and the string it hung from — the timeline is about
            what is coming, and a finished day has stopped competing for that
            attention. Tapping the filled ring returns it. */}
        {!loading&&done.length>0&&(
          <div style={{marginTop:upcoming.length>0?36:0}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,color:pgInkMute,marginBottom:14,
              paddingBottom:8,borderBottom:`0.5px solid ${pgLine}`}}>
              {EVENT_DONE_HEAD}
            </div>
            {done.map(ev=>{
              const {month,day}=fmtDate(ev.event_date);
              return(
                <div key={ev.id} style={{display:'flex',alignItems:'center',gap:14,marginBottom:14,opacity:.55}}>
                  <button disabled={saving} onClick={()=>toggleDone(ev)}
                    style={{width:18,height:18,flexShrink:0,borderRadius:'50%',padding:0,
                      border:`1px solid ${pgAccent}`,background:pgAccent,
                      cursor:saving?'default':'pointer',opacity:saving?.5:1}}/>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',color:pgInkMute,flexShrink:0}}>
                    {month} {day}
                  </span>
                  <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,
                    color:pgInkSoft,fontFeatureSettings:'"opsz" 9',minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as any}}>
                    {ev.title}
                  </span>
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
      {/* ── THE CREATE / EDIT SHEET ───────────────────────────────────────────
          The picker's geometry EXACTLY — fixed, sibling scrim, same inset, same
          radius, same panel colours. Three sheets on one surface that each
          invented their own shape would read as three features bolted on; one
          shape reads as a room. The panel reuses this file's own dark/light
          pair rather than inventing a hex, because `tdw13_d4_extraction` cell
          6a reads raw source and reddens on any literal that was not already
          here — the trap D-4b fell into and documented one screen down. */}
      {sheet&&(
        <>
          <div onClick={()=>setSheet(null)} style={{position:'fixed',inset:0,background:dark?'rgba(8,2,4,.72)':'rgba(12,24,48,.42)',zIndex:20}}/>
          <div style={{position:'fixed',left:16,right:16,bottom:16,zIndex:21,
            borderRadius:14,padding:'18px 18px 14px',
            border:`0.5px solid ${pgBubbleBdr}`,
            background:dark?'#1A0A0E':'#EEF0F6',
            boxShadow:'0 12px 40px rgba(0,0,0,.35)',
            maxHeight:'82%',overflowY:'auto'}}>

            <input value={fTitle} onChange={e=>setFTitle(e.target.value)}
              placeholder={EVENT_ASK_TITLE} style={sheetInput}/>

            <div style={{display:'flex',gap:10,marginTop:10}}>
              <input type="date" value={fDate} onChange={e=>setFDate(e.target.value)}
                placeholder={EVENT_ASK_WHEN} style={{...sheetInput,flex:1}}/>
              <input type="time" value={fTime} onChange={e=>setFTime(e.target.value)}
                style={{...sheetInput,width:118,flexShrink:0}}/>
            </div>

            {/* THE KIND LIST IS THE SERVER'S OWN TWELVE (see eventCopy.ts). A
                thirteenth value would be SILENTLY rewritten to 'other' by the
                create door while the edit door refuses it 400 — F-15.5, filed
                at CE-34 and not this delivery's to cure. A closed list is the
                only defence a client has against a door that eats in silence. */}
            <select value={fKind} onChange={e=>setFKind(e.target.value)}
              style={{...sheetInput,marginTop:10,appearance:'none' as any}}>
              {EVENT_KINDS.map(k=>(<option key={k.value} value={k.value}>{k.label}</option>))}
            </select>

            <textarea value={fNotes} onChange={e=>setFNotes(e.target.value)}
              placeholder={EVENT_ASK_NOTES} rows={3}
              style={{...sheetInput,marginTop:10,resize:'none' as any}}/>

            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button disabled={saving} onClick={()=>setSheet(null)}
                style={{flex:1,padding:'11px 0',borderRadius:8,background:'transparent',
                  border:`0.5px solid ${pgLine}`,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                  textTransform:'uppercase' as any,color:pgInkMute,
                  cursor:saving?'default':'pointer',opacity:saving?.5:1}}>
                {EVENT_CANCEL}
              </button>
              <button disabled={saving} onClick={save}
                style={{flex:1,padding:'11px 0',borderRadius:8,
                  border:`0.5px solid ${pgAccent}`,background:`${pgAccent}22`,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                  textTransform:'uppercase' as any,color:pgAccent,
                  cursor:saving?'default':'pointer',opacity:saving?.5:1}}>
                {EVENT_SAVE}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── THE REMOVE CONFIRM — MANDATORY, NEVER A SWIPE ─────────────────────
          `deleteCoupleEvent` is a hard `.delete()` (R-34.9 refused adopting the
          soft-delete column), so there is no undo to offer and the question is
          the only thing standing between a mis-tap and a lost day. It ships as
          a full sheet for that reason, not as a toast with an action. */}
      {confirm&&(
        <>
          <div onClick={()=>setConfirm(null)} style={{position:'fixed',inset:0,background:dark?'rgba(8,2,4,.72)':'rgba(12,24,48,.42)',zIndex:22}}/>
          <div style={{position:'fixed',left:16,right:16,bottom:16,zIndex:23,
            borderRadius:14,padding:'18px 18px 14px',
            border:`0.5px solid ${pgBubbleBdr}`,
            background:dark?'#1A0A0E':'#EEF0F6',
            boxShadow:'0 12px 40px rgba(0,0,0,.35)'}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:19,color:pgInk,fontFeatureSettings:'"opsz" 9'}}>
              {EVENT_REMOVE_ASK}
            </div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,fontFeatureSettings:'"opsz" 9',marginTop:6}}>
              {confirm.title}
            </div>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button onClick={()=>setConfirm(null)}
                style={{flex:1,padding:'11px 0',borderRadius:8,background:'transparent',
                  border:`0.5px solid ${pgLine}`,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                  textTransform:'uppercase' as any,color:pgInkMute,cursor:'pointer'}}>
                {EVENT_CANCEL}
              </button>
              <button onClick={()=>remove(confirm)}
                style={{flex:1,padding:'11px 0',borderRadius:8,background:'transparent',
                  border:`0.5px solid ${pgAccent}`,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                  textTransform:'uppercase' as any,color:pgAccent,cursor:'pointer'}}>
                {EVENT_REMOVE}
              </button>
            </div>
          </div>
        </>
      )}

      {/* The toast sits above every sheet: a failure that renders BEHIND the
          sheet that caused it is a failure she never sees. */}
      {toast&&(
        <div style={{position:'fixed',top:'calc(env(safe-area-inset-top,0px) + 16px)',left:'50%',
          transform:'translateX(-50%)',background:pgInk,color:dark?'#1A0810':'#FFFFFF',
          fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
          textTransform:'uppercase' as any,padding:'8px 18px',borderRadius:20,zIndex:400,
          pointerEvents:'none',whiteSpace:'nowrap' as any}}>
          {toast}
        </div>
      )}
    </div>
  );
}
