'use client';
// SettingsRoom — profile, mode and the WhatsApp shortcut.
//
// TDW_13 · D-4 · VERBATIM RELOCATION. This component's body is byte-identical to
// the lines it occupied in sanctuary/page.tsx at b1448c4. Only the import
// mechanism changed: the symbols it used to reach at module scope it now names
// at the top of its own file. No token conversion, no hygiene, no feature —
// those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { FT, FS, FI } from '@/lib/frost/tokens';
import { fetchProfile, saveProfile, type CoupleProfile } from '@/lib/frost/journey';
// G1.1c · R-40.30's five bytes, frozen at the character, one home, hash-carried.
// The room speaks no word of this subject that is not one of these five.
import {
  SWITCH_LABEL, SWITCH_VALUE_OFF, SWITCH_VALUE_ON,
  SWITCH_SUB_HAS_PAGE, SWITCH_SUB_NO_PAGE,
} from '@/lib/frost/coupleSwitch';
import { formatRs } from '@/lib/vendor/format';
import { waNumberFor } from '@/lib/waNumbers';
import { usePress } from '@/components/frost/_shared/usePress';

const DREAMAI_WA_LINK   = `https://wa.me/${waNumberFor('bride')}?text=Hi`;


// ── SETTINGS ROOM ──────────────────────────────────────────────────────────────
// Profile info + mode toggle + WA DreamAI shortcut. Sanctuary bg.

interface SettingsRoomProps { dark:boolean; accent:string; signal:string; }

export function SettingsRoom({ dark, accent, signal }: SettingsRoomProps) {
  const { press, pressed } = usePress();
  const bg      = dark
    ? 'radial-gradient(ellipse 80% 45% at 80% 0%,rgba(196,133,106,.12) 0%,transparent 52%),linear-gradient(160deg,#1A0A0E 0%,#120608 40%,#0C0404 100%)'
    : 'radial-gradient(ellipse 80% 45% at 20% 0%,rgba(42,95,130,.16) 0%,transparent 52%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 40%,#D8DEEC 100%)';
  const ink     = dark ? '#F5E5DC'                : '#0C1830';
  const inkSoft = dark ? 'rgba(245,229,220,.72)'  : 'rgba(12,24,48,.72)';
  const inkMute = dark ? 'rgba(196,133,106,.50)'  : 'rgba(42,80,130,.55)';
  const line    = dark ? 'rgba(196,133,106,.14)'  : 'rgba(42,95,130,.14)';
  const rowBg   = dark ? 'rgba(196,133,106,.05)'  : 'rgba(42,95,130,.05)';
  const rowBdr  = dark ? 'rgba(196,133,106,.12)'  : 'rgba(42,95,130,.12)';
  const ac      = dark ? '#C4856A'                : '#2A5F82';
  const sig     = dark ? '#6B9E8F'                : '#8B6E52';
  // G1.1c. The mock's `--knob-on` (couple-switch-mock.html, both mode blocks):
  // the ink that sits ON the accent, used by the switch's knob when the answer
  // is yes. NOT hoisted from the Save button's `color` at the edit sheet below,
  // which happens to be the same two bytes on a different property: same VALUE
  // is not the same FACT, and reaching into a control this mock does not cover
  // to share a constant would be a byte nobody ratified.
  const knobOn  = dark ? '#1A0810'                : '#FFFFFF';

  const [profile, setProfile] = React.useState<CoupleProfile|null>(null);

  // ── ATELIER RIDER 1 · THE PROFILE EDIT SHEET (founder-chartered 2026-08-07) ──
  // The bride could change her wedding date by telling Dream Ai on WhatsApp
  // (src/agent/brideTools.js save_wedding_detail) and by no other means. The door
  // in the app was already built and never opened: PATCH /api/v2/couple/me/:id
  // accepts wedding_date at dream-os src/api/couple/me.js, and lib/frost/journey.ts
  // saveProfile() has wrapped it since the client was written — with ZERO callers.
  // This is the caller.
  //
  // BUDGET IS DELIBERATELY READ-ONLY HERE, and this comment is why: that same PATCH
  // destructures name / partner_name / wedding_date / wedding_city and NOT
  // budget_total. Shipping a budget field that silently discards its input would be
  // a lying control. The row now always renders (it used to vanish entirely when
  // unset, so a bride with no budget could not learn the field existed) and says
  // where the one working door is. It becomes editable when dream-os opens its
  // half — see the handover's rider note.
  const [editOpen, setEditOpen]   = React.useState<null|'date'|'budget'>(null);
  const [editDate, setEditDate]   = React.useState('');
  const [editBudget, setEditBudget] = React.useState('');
  const [savingP,  setSavingP]    = React.useState(false);
  const [saveErr,  setSaveErr]    = React.useState(false);
  // F-09.165 walk: the founder hit the 409 floor and read "That didn't save. Check
  // your connection and try again." — his connection was fine and the server had
  // sent him Dream Ai's question. The sheet now shows the SERVER'S OWN SENTENCE
  // when it has one, and only falls back to the generic line when it does not.
  const [saveMsg,  setSaveMsg]    = React.useState<string|null>(null);
  const [asking,   setAsking]     = React.useState(false);

  React.useEffect(()=>{
    fetchProfile().then(p=>setProfile(p)).catch(()=>{});
  },[]);

  function openEditDate(){
    setSaveErr(false);
    setEditDate(profile?.wedding_date||'');
    setEditOpen('date');
  }

  function openEditBudget(){
    setSaveErr(false);
    setEditBudget(profile?.budget_total?String(profile.budget_total):'');
    setSaveMsg(null); setAsking(false);
    setEditOpen('budget');
  }

  // CE R-26.5 §C — THE FIELD LEARNS NO VOCABULARY. Rider 2 filtered to digits as a
  // defence while both writers still truncated; F-09.165's cure removed the reason.
  // The raw string goes to the server, ONE seat coerces it (src/lib/coerceBudget.js),
  // and the echo comes back. A client-side parser here would be a second opinion
  // about what a budget is, and a second opinion is how the two doors drift apart.
  // She can type 4.5L in the sheet now because the server understands it.
  const budgetRaw   = editBudget.trim();
  const budgetValid = budgetRaw.length>0;
  // The live register is shown ONLY when the app can be certain — a plain figure.
  // For anything else the app says nothing, because it genuinely does not know.
  const budgetPreview = /^[0-9]+$/.test(budgetRaw) && Number(budgetRaw)>0
    ? formatRs(Number(budgetRaw)) : null;

  async function commitProfile(){
    // Captured BEFORE the resets below. `asking` would still read true here by
    // closure timing, but a reader tidying these three setters into a different
    // order would silently turn every confirmation back into a fresh question —
    // and the loop the founder hit would come straight back. Explicit instead.
    const confirming = asking;
    setSavingP(true); setSaveErr(false); setSaveMsg(null); setAsking(false);
    // THE SECOND SAVE IS THE YES (founder-ruled). `asking` is true only after the
    // server has asked about THIS figure — any keystroke clears it below, so a
    // changed figure is a fresh question rather than a pre-answered one.
    const r = editOpen==='budget'
      ? await saveProfile({ budget_total: budgetRaw, budget_confirmed: confirming })
      : await saveProfile({ wedding_date: editDate });
    setSavingP(false);
    if(!r.ok){
      // A QUESTION IS NOT A FAILURE. The sheet stays open either way, but a 409
      // shows the server's sentence — which is Dream Ai's question, verbatim —
      // and never the connection line.
      setAsking(!!r.needsConfirmation);
      setSaveMsg(r.message||null);
      setSaveErr(true);
      return;
    }
    // Re-read rather than assume: the server owns the stored shape, and a date it
    // normalises differently would otherwise show stale until the next mount.
    try { const p = await fetchProfile(); setProfile(p); } catch {}
    setEditOpen(null);
  }

  function fmtWeddingDate(iso:string|null):string {
    if(!iso) return '—';
    return new Date(iso+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  }

  // ── G1.1c · THE COUPLE'S SWITCH (R-40.9 · R-G11c.8 · R-G11c.10) ────────────
  // THERE IS NO `const [publish, setPublish]` IN THIS FILE, AND THAT ABSENCE IS
  // THE FEATURE. The track is drawn from `profile.publish_weddings` — the byte
  // the door read off her row — on every render, including the one after this
  // handler runs. A local mirror would be a second opinion about her consent,
  // and a second opinion is exactly what she cannot be given here: the estate's
  // sole writer is `couple_set_publish()` and the only honest thing this surface
  // can do is show what that writer stored.
  //
  // NO OPTIMISTIC PAINT, for the same reason. A switch that moves before the
  // write lands is telling her the answer is recorded when it is not — the
  // never-a-false-done law at a control instead of at a sentence. It moves when
  // the re-read comes back, and if the write failed it does not move at all.
  //
  // THE RE-READ, NOT THE ECHO. `commitProfile` above already re-reads for the
  // date and the budget, with its own reason on the record: the server owns the
  // stored shape. Two patterns in one room for one job is how they drift, so
  // this takes the room's existing one.
  const [savingSwitch, setSavingSwitch] = React.useState(false);

  async function togglePublish(){
    // NOT `disabled`, NOT greyed, NOT dimmed — R-G11c.8 forbids all three, and
    // the mock draws a live track in every frame. This is only a guard against
    // a second write racing the first while one is in flight; nothing about the
    // control's appearance changes, and a tap during the flight is dropped
    // rather than queued. A queued second tap would send an answer she had
    // already reversed.
    if(savingSwitch||!profile) return;
    setSavingSwitch(true);
    const r = await saveProfile({ publish_weddings: !profile.publish_weddings });
    // RE-READ ON BOTH PATHS, and that is deliberate rather than lazy. On success
    // it is how the switch learns what was stored; on failure it is how the room
    // proves it is still showing the truth rather than a stale optimism. If the
    // write failed the row is unchanged, so the track does not move — which is
    // the honest report, and it is an UNLABELLED one. That gap is filed rather
    // than papered over with a sixth string this file has no veto for.
    try { const p = await fetchProfile(); setProfile(p); } catch {}
    void r;
    setSavingSwitch(false);
  }

  const Row = ({label,value,onTap,isLink,arrow}:{label:string;value?:string;onTap?:()=>void;isLink?:boolean;arrow?:boolean}) => (
    <div onClick={onTap} style={{padding:'14px 20px',borderBottom:`0.5px solid ${line}`,display:'flex',alignItems:'center',cursor:onTap?'pointer':'default',WebkitTapHighlightColor:'transparent',background:onTap?undefined:rowBg}}>
      <div style={{flex:1}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>{label}</div>
        {value&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:isLink?ac:ink,fontFeatureSettings:'"opsz" 9'}}>{value}</div>}
      </div>
      {arrow&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:inkMute}}>›</span>}
    </div>
  );

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:bg,overflow:'hidden'}}>
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>

        {/* Profile section */}
        <div style={{padding:'20px 20px 10px'}}>
          <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:ac,lineHeight:1,marginBottom:4}}>
            {profile?.bride_name||'Your'} & {profile?.partner_name||'Partner'}
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>{profile?.wedding_city||'Your city'}</div>
        </div>

        <div style={{height:.5,background:line,margin:'0 20px'}}/>

        {/* Info rows */}
        <Row label="Wedding date" value={fmtWeddingDate(profile?.wedding_date||null)} onTap={openEditDate} arrow/>
        {/* RIDER 2. The line that stood here — "Ask Dream Ai on WhatsApp to change
            your budget" — was FALSE and is deleted, not reworded. src/api/couple/
            chat.js runs the same runBrideAgenticTurn as WhatsApp over one shared
            couple_self conversation, so the in-app Dream room could always do it;
            the line sent her out of the product for something the product does.
            It also shipped without passing the founder's copy veto. Both owned.
            The row is simply editable now. */}
        <Row label="Total budget" value={profile?.budget_total?formatRs(profile.budget_total):'Not set yet'} onTap={openEditBudget} arrow/>

        {/* ── THE COUPLE'S SWITCH · the ratified mock's C1–C4, made real ──────
            Geometry, type and colour are TRANSCRIBED from
            docs/mocks/couple-switch-mock.html (.fr-sw / .fr-track / .fr-knob /
            .fr-sub), which itself transcribed them out of this file. Nothing
            here is renegotiated: 46x27 track, 21px knob at 2.5/22, the sub-line
            on FT.body in Fraunces because it is a SENTENCE and the engraved rung
            is for labels.

            IT RENDERS ONLY ONCE THE ROW IS IN HAND. Before `fetchProfile`
            resolves there is no answer to draw, and a track painted OFF for an
            unknown answer is a lying control — the same defect as a greyed one,
            wearing the opposite costume. The rows above legitimately show
            fallbacks ('—', 'Not set yet') because a missing date IS "not set";
            a missing consent answer is not "no". So this row waits, and the
            wait is one network round trip on a room she has just opened.

            NO PRESS KEY. The mock draws a track and a knob and nothing else;
            adding a press acknowledgment would be an affordance no frame
            carries, and this room's Row has never had one (F-09.107's hold on
            the sibling component is the same question, ruled the same way). */}
        {profile&&(
          <div onClick={togglePublish} style={{padding:'14px 20px',borderBottom:`0.5px solid ${line}`,
            display:'flex',alignItems:'flex-start',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
            <div style={{flex:1,minWidth:0,paddingRight:14}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,marginBottom:3}}>
                {SWITCH_LABEL}
              </div>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1.35,color:ink,fontFeatureSettings:'"opsz" 9'}}>
                {profile.publish_weddings?SWITCH_VALUE_ON:SWITCH_VALUE_OFF}
              </div>
              {/* THE SUB-LINE IS KEYED TO THE PAGE, NEVER TO THE SWITCH.
                  `has_wedding_page`, not `publish_weddings` — C1/C2 both draw
                  string 4, C3/C4 both draw string 5. Keying it to the track
                  would tell a couple with no page that turning it off removes
                  one, and tell a couple looking at hers that none exists. */}
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,lineHeight:1.5,color:inkSoft,fontFeatureSettings:'"opsz" 9',marginTop:8}}>
                {profile.has_wedding_page?SWITCH_SUB_HAS_PAGE:SWITCH_SUB_NO_PAGE}
              </div>
            </div>
            <div style={{width:46,minWidth:46,height:27,borderRadius:100,position:'relative',marginTop:2,
              background:profile.publish_weddings?ac:rowBg,
              border:`0.5px solid ${profile.publish_weddings?ac:rowBdr}`}}>
              <div style={{position:'absolute',top:2.5,width:21,height:21,borderRadius:'50%',
                left:profile.publish_weddings?22:2.5,
                background:profile.publish_weddings?knobOn:inkMute}}/>
            </div>
          </div>
        )}

        {/* Mode toggle — REMOVED BY FOUNDER RULING (2026-08-07, the chair's own
            hand): SINGLE THEME, Wine Night always. The Appearance control and its
            two swatches (press keys mode:E1A / mode:E3) retired whole — a switch
            wired to a pinned reader is a lying control (honest-controls law).
            Mechanism: lib/frost/tokens.ts getFrostMode() is the pin; the swatches
            return only if a second theme returns by ruling. tdw09_p2c's map
            roster amended LABELLED in the same delivery. */}

        {/* ── THE EDIT SHEET · surface class 4, as approved at Gate 1 ──────────
            Geometry is the mock's and the estate's: bottom-anchored, FI.sheet top
            corners, scrim at rgba(0,0,0,.55), safe-area padding, tap-the-scrim to
            dismiss. Type on the rungs. It is the same sheet as Add-a-booking so the
            bride learns one pattern, not two. */}
        {editOpen&&<>
          <div onClick={()=>!savingP&&setEditOpen(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:200}}/>
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:201,background:dark?'#180608':'#EEF0F6',
            borderRadius:`${FI.sheet}px ${FI.sheet}px 0 0`,padding:`${FS.s3}px ${FS.gutter}px calc(${FS.s3}px + env(safe-area-inset-bottom,0px))`,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:FS.s3}}>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.room,color:ink,fontFeatureSettings:'"opsz" 9'}}>{editOpen==='budget'?'Total budget':'Wedding date'}</div>
              <button onClick={()=>!savingP&&setEditOpen(null)} style={{background:'none',border:'none',cursor:'pointer',color:inkMute,fontSize:20}}>✕</button>
            </div>
            {editOpen==='date'&&<div style={{marginBottom:FS.s2}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engravedSm,letterSpacing:FS.track,textTransform:'uppercase' as any,color:inkMute,marginBottom:FS.s1}}>The day</div>
              <input type="date" value={editDate} onChange={e=>{setEditDate(e.target.value);setSaveErr(false);}}
                style={{width:'100%',padding:'12px 14px',background:dark?'rgba(245,229,220,.06)':'rgba(12,24,48,.05)',
                  border:`0.5px solid ${line}`,borderRadius:FI.chrome,fontFamily:"'Fraunces',serif",fontStyle:'italic',
                  fontSize:FT.body,color:ink,outline:'none',boxSizing:'border-box',userSelect:'text'}}/>
            </div>}
            {editOpen==='budget'&&<div style={{marginBottom:FS.s2}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engravedSm,letterSpacing:FS.track,textTransform:'uppercase' as any,color:inkMute,marginBottom:FS.s1}}>Rupees</div>
              <input value={editBudget} placeholder="450000"
                onChange={e=>{setEditBudget(e.target.value);setSaveErr(false);setSaveMsg(null);setAsking(false);}}
                style={{width:'100%',padding:'12px 14px',background:dark?'rgba(245,229,220,.06)':'rgba(12,24,48,.05)',
                  border:`0.5px solid ${line}`,borderRadius:FI.chrome,fontFamily:"'Fraunces',serif",fontStyle:'italic',
                  fontSize:FT.body,color:ink,outline:'none',boxSizing:'border-box',userSelect:'text'}}/>
              {/* The register, shown back to her as she types — Rs X,XX,XXX, whole,
                  no shorthand. formatRs is the estate's one money home. */}
              {budgetPreview&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engravedSm,letterSpacing:FS.track,textTransform:'uppercase' as any,color:ac,marginTop:FS.s1}}>
                {budgetPreview}
              </div>}
            </div>}
            {/* Errors say what happened and how to fix it — never a mood. */}
            {saveErr&&<div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,color:asking?ink:'#C4534A',lineHeight:1.6,marginBottom:FS.s2}}>
              {saveMsg||"That didn’t save. Check your connection and try again."}
            </div>}
            <button onClick={commitProfile} disabled={savingP||(editOpen==='budget'?!budgetValid:!editDate)}
              style={{width:'100%',padding:'15px 0',background:ac,border:'none',borderRadius:FI.chrome,
                fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engraved,letterSpacing:FS.track,
                textTransform:'uppercase' as any,color:dark?'#1A0810':'#FFFFFF',cursor:'pointer',
                opacity:(savingP||(editOpen==='budget'?!budgetValid:!editDate))?.5:1}}>
              {savingP?'Saving…':(editOpen==='budget'?'Save budget':'Save date')}
            </button>
          </div>
        </>}

        {/* DreamAI on WhatsApp */}
        <div style={{padding:'10px 0 4px',marginTop:8}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute,padding:'0 20px 8px'}}>DreamAi</div>
          <a href={DREAMAI_WA_LINK} target="_blank" rel="noopener noreferrer" {...press('settings:wa')}
            style={{display:'flex',alignItems:'center',padding:'14px 20px',margin:'0 16px',borderRadius:8,
              background:dark?'rgba(196,133,106,.07)':'rgba(42,95,130,.07)',
              border:`0.5px solid ${dark?'rgba(196,133,106,.18)':'rgba(42,95,130,.18)'}`,
              textDecoration:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent',
              ...pressed('settings:wa')}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:ink,fontFeatureSettings:'"opsz" 9',marginBottom:3}}>Open on WhatsApp</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:inkMute}}>Chat with Dream Ai anywhere</div>
            </div>
            <div style={{width:36,height:36,borderRadius:'50%',background:ac,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
              </svg>
            </div>
          </a>
        </div>

        {/* Sign out */}
        <div style={{padding:'24px 16px 0'}}>
          <div onClick={()=>{
            try{
              ['access_token','refresh_token','couple_session','couple_web_session',
               'couple_last_path','couple_app_mode']
               .forEach(k=>localStorage.removeItem(k));
            }catch{}
            window.location.replace('/');
          }} {...press('settings:signout')} style={{padding:'14px',borderRadius:8,border:`0.5px solid rgba(184,69,62,.25)`,background:'rgba(184,69,62,.06)',textAlign:'center' as any,cursor:'pointer',
            fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:'rgba(184,69,62,.8)',
            WebkitTapHighlightColor:'transparent',...pressed('settings:signout')}}>
            Sign out
          </div>
        </div>

        <div style={{height:40}}/>
      </div>
    </div>
  );
}
