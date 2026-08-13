'use client';
// CircleRoom — the circle feed and its composer.
//
// TDW_13 · D-5 · VERBATIM RELOCATION, the same law D-4 ran under. This body is
// byte-identical to the lines it occupied in sanctuary/page.tsx at 66ea400.
// Only the import mechanism changed. No token conversion, no hygiene, no
// feature — those are P3 and P5 and they do not ride a relocation commit (F-1).

import React, { useState, useEffect } from 'react';
import { FT, FS, FI, getCoupleIdForFrost } from '@/lib/frost/tokens';
import { fetchCircle, inviteCircleMember, removeCircleMember, formatActivityLine, timeAgo,
         fetchCirclePolls, castCirclePollVote, createCirclePoll, deleteCirclePoll,
         type CircleData, type CircleActivity, type CircleMember, type CirclePoll } from '@/lib/frost/journey';
// TDW_14 D-3b — THE FROZEN BYTES COME FROM THE ONE HOME, the same module the
// member's coplanner strip imports. Two renderers, one vocabulary: the surfaces
// share no token system, but the founder's vetoed copy must not fork, and a
// bench cell reds if either surface grows a literal of its own.
import { POLL_ASK, POLL_TAP_TO_CHOOSE, POLL_YOUR_CHOICE, POLL_EMPTY,
         POLL_SHEET_HEAD, POLL_QUESTION_LABEL, POLL_CHOICES_LABEL, POLL_ADD_CHOICE,
         POLL_SUBMIT, POLL_SUBMITTING, POLL_CANCEL, POLL_ADD_CLOSING,
         POLL_DELETE, POLL_DELETE_CONFIRM, POLL_DELETE_BODY, POLL_DELETING, POLL_KEEP,
         pollTally, pollCloses, pollWinner, pollTie } from '@/lib/circle/pollCopy';
import { usePress } from '@/components/frost/_shared/usePress';
import { coupleAccessToken } from '@/components/frost/_shared/coupleAccessToken';

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

export function CircleRoom({ dark, accent, signal, roomInk, roomInkSoft, roomInkMute, roomLine }: CircleRoomProps) {
  const { press, pressed } = usePress();
  const [data,        setData]        = React.useState<CircleData|null>(null);
  const [loading,     setLoading]     = React.useState(true);
  const [view,        setView]        = React.useState<'feed'|'invite'>('feed');
  const [inviteName,  setInviteName]  = React.useState('');
  const [invitePhone, setInvitePhone] = React.useState('');
  const [inviteRole,  setInviteRole]  = React.useState('family');
  const [inviting,    setInviting]    = React.useState(false);
  const [waLink,      setWaLink]      = React.useState<string|null>(null);
  const [contactsSupported] = React.useState<boolean>(()=>{
    if(typeof navigator==='undefined') return false;
    return !!((navigator as any).contacts && (navigator as any).contacts.select);
  });

  const pickContact = async () => {
    try {
      const nav:any = navigator;
      if(!nav.contacts?.select) return;
      const props = ['name','tel'];
      const result = await nav.contacts.select(props, {multiple:false});
      if(result && result.length){
        const c = result[0];
        const nm = Array.isArray(c.name) ? c.name[0] : c.name;
        const tel = Array.isArray(c.tel) ? c.tel[0] : c.tel;
        if(nm)  setInviteName(String(nm));
        if(tel) setInvitePhone(String(tel).replace(/[^\d+]/g,''));
      }
    } catch { /* user cancelled or unsupported — silently ignore */ }
  };

  const circleBg = dark
    ? 'radial-gradient(ellipse 110% 55% at 50% -5%,rgba(196,133,106,.18) 0%,transparent 52%),radial-gradient(ellipse 70% 60% at 90% 110%,rgba(40,5,12,.80) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 5% 100%,rgba(60,8,20,.70) 0%,transparent 50%),linear-gradient(180deg,#1A0A0E 0%,#0E0506 40%,#080204 70%,#0C0408 100%)'
    : 'radial-gradient(ellipse 110% 50% at 60% -5%,rgba(74,122,155,.24) 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 10% 110%,rgba(42,95,130,.16) 0%,transparent 55%),linear-gradient(160deg,#EEF0F6 0%,#E4E8F2 30%,#D8DEEC 60%,#CDD4E8 100%)';

  const pgInk     = dark ? '#F5E5DC' : '#0C1830';
  const pgInkSoft = dark ? 'rgba(245,229,220,.72)' : 'rgba(12,24,48,.68)';
  const pgInkMute = dark ? 'rgba(196,133,106,.48)' : 'rgba(42,80,130,.52)';
  const pgLine    = dark ? 'rgba(196,133,106,.12)' : 'rgba(42,80,130,.16)';
  const pgAccent  = dark ? '#C4856A' : '#2A5F82';
  const candleBg  = dark ? 'rgba(196,133,106,.08)' : 'rgba(42,95,130,.06)';
  const candleBdr = dark ? 'rgba(196,133,106,.18)' : 'rgba(42,95,130,.16)';

  const [chatMsgs, setChatMsgs] = React.useState<any[]>([]);
  // ── F-07.72 ZIP 2 · FORK A(c) · THE BRIDE'S LANDING ────────────────────────
  // This state exists because ZIP 2 can refuse HER. She is not a
  // `circle_members` row; the circle doors are dual-lane and take a resolver,
  // and that resolver admits her only while her couple credential resolves. A
  // stale JWT, an ITP wipe, a signed-out browser — all three worked before this
  // delivery, because the server ignored her header and served the couple id in
  // the path. All three are 401 now.
  //
  // AND HER REFUSAL IS THE INVISIBLE KIND, which is why a banner and not a
  // silence: this poll's `d?.ok` guard means a refusal simply never calls
  // `setChatMsgs`, so the last messages she loaded stay on screen, refreshing
  // every ten seconds, looking live. Enforcement without a landing is a security
  // fix that breaks a real person's screen and does not tell her.
  const [chatLocked, setChatLocked] = React.useState(false);
  const [polls,  setPolls]  = React.useState<CirclePoll[]>([]);
  const [voting, setVoting] = React.useState<string|null>(null);
  // ── THE CREATE SHEET (D-3c) · BRIDE-ONLY BY FOUNDER RULING ────────────────
  // A member votes in the circle; she does not convene it. The co-planner strip
  // imports none of this and its proof asserts that absence.
  const [askOpen,   setAskOpen]   = React.useState(false);
  const [askQ,      setAskQ]      = React.useState('');
  // Two empty slots at rest: the minimum a poll can carry, so the shape of the
  // thing she is making is visible before she types.
  const [askOpts,   setAskOpts]   = React.useState<string[]>(['','']);
  const [askClose,  setAskClose]  = React.useState('');
  const [asking,    setAsking]    = React.useState(false);
  const MAX_CHOICES = 4;
  // D-3e — unmaking. `delTarget` holds the poll awaiting confirmation, mirroring
  // `people.tsx`'s `removeTarget`: the destructive act is never one tap.
  const [delTarget, setDelTarget] = React.useState<CirclePoll|null>(null);
  const [deleting,  setDeleting]  = React.useState(false);

  const confirmDelete = async () => {
    if(!delTarget || deleting) return;
    setDeleting(true);
    try {
      // RE-READ rather than filtering the card out locally — the list is the
      // server's, and a screen that removes its own row is guessing at an
      // outcome it was not told.
      if(await deleteCirclePoll(delTarget.id)){ setDelTarget(null); await loadPolls(); }
    } finally { setDeleting(false); }
  };

  // E's expected-zero, mechanised: submit is GATED, never refused with a byte.
  // ② stays the server's contract for a caller that bypasses this form.
  const askReady = askQ.trim().length > 0 && askOpts.filter(o=>o.trim()).length >= 2;

  const resetAsk = () => { setAskQ(''); setAskOpts(['','']); setAskClose(''); setAskOpen(false); };

  const submitAsk = async () => {
    if(!askReady || asking) return;
    setAsking(true);
    try {
      // LABELS ONLY — option ids are minted server-side so two can never collide
      // and silently merge a tally. Blank slots are dropped rather than sent.
      const created = await createCirclePoll(
        askQ.trim(),
        askOpts.map(o=>o.trim()).filter(Boolean),
        askClose ? { closes_at: new Date(askClose).toISOString() } : undefined,
      );
      // RE-READ rather than pushing the returned poll onto local state: the list
      // is the server's, and a screen that appends its own row is a second
      // source of truth the moment two people ask at once.
      if(created){ resetAsk(); await loadPolls(); }
    } finally { setAsking(false); }
  };
  const API_CIRCLE = process.env.NEXT_PUBLIC_API_BASE||'https://dream-os-production.up.railway.app';

  React.useEffect(()=>{
    fetchCircle().then(d=>{ setData(d); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  // R-D3.5: NO SECOND TIMER. The poll read rides the message poll's existing 10s
  // interval below — `loadPolls` is called from inside it, not from an interval
  // of its own. One home applies to timers as much as to constants: two intervals
  // on one screen drift apart, double the request rate, and give a reader two
  // places to look for "how often does this refresh".
  const loadPolls = React.useCallback(async ()=>{
    try { setPolls(await fetchCirclePolls()); }
    catch { /* keep last known — a dropped packet is not a reason to blank her polls */ }
  },[]);

  // A cast vote RE-READS. The server owns the tally and resolves `my_vote` per
  // viewer; a screen that moved a count it was not told about would be
  // confidently wrong the moment two people voted at once.
  const votePoll = async (pollId:string, optionId:string) => {
    if(voting) return;
    setVoting(pollId);
    try { if(await castCirclePollVote(pollId, optionId)) await loadPolls(); }
    finally { setVoting(null); }
  };

  // Fetch circle thread messages + poll every 10s so members' messages appear live.
  React.useEffect(()=>{
    let alive = true;
    const loadMessages = async () => {
      try {
        const coupleId = getCoupleIdForFrost();
        const token = coupleAccessToken();
        if(!coupleId) return;
        const res = await fetch(`${API_CIRCLE}/api/v2/frost/circle/messages/${coupleId}`,{
          headers: token?{Authorization:`Bearer ${token}`}:undefined,
        });
        // ONLY 401 LOCKS. A 500, a timeout, an offline phone keep the last known
        // messages exactly as this poll has always behaved — telling her to sign
        // in again over a dropped packet would be its own defect.
        if(res.status===401){ if(alive) setChatLocked(true); return; }
        if(alive) setChatLocked(false);
        const d = await res.json();
        if(alive && d?.ok && Array.isArray(d.messages)) setChatMsgs(d.messages);
      } catch { /* keep last known */ }
    };
    // R-D3.5 — THE POLL READ RIDES THIS INTERVAL. One tick, two reads, one home
    // for "how often does this screen refresh". A second setInterval would drift
    // from this one, double the request rate, and give the next reader two
    // answers to the same question.
    const tick = async () => { await loadMessages(); await loadPolls(); };
    tick();
    const iv = setInterval(tick, 10000);
    return ()=>{ alive=false; clearInterval(iv); };
  },[loadPolls]);

  const doInvite = async () => {
    if(!inviteName.trim()||inviting) return;
    setInviting(true);
    try {
      const r = await inviteCircleMember({invitee_name:inviteName.trim(),role:inviteRole,invitee_phone:invitePhone.trim()||undefined});
      if(r.wa_me_link) {
        setWaLink(r.wa_me_link);
      } else if(r.join_url) {
        setWaLink(`https://wa.me/?text=${encodeURIComponent('Join my wedding circle: '+r.join_url)}`);
      } else {
        setWaLink('ERROR:Could not generate link. Try again.');
      }
    } catch(e:any) {
      console.error('[doInvite]', e);
      setWaLink('ERROR:' + (e?.message || 'Could not generate link. Try again.'));
    }
    finally{ setInviting(false); }
  };

  const members  = data?.members         || [];
  const baseActivity = data?.activity     || [];
  const pending  = data?.pending_invites || [];

  // Merge real chat messages into the activity stream so the group chat is visible
  // alongside saves/joins. Messages render as activity_type='message'.
  const msgItems = (chatMsgs||[]).map((m:any)=>({
    id:            'msg-'+m.id,
    activity_type: 'message',
    member_name:   m.sender_role==='bride' ? 'You' : (m.sender_name||'Circle'),
    actor_role:    m.sender_role||'circle_member',
    content:       m.content||m.body||'',
    created_at:    m.created_at,
    image_url:     null, caption:null, aesthetic_tags:null, save_number:null, source_type:null,
  }));
  const activity = [...baseActivity, ...msgItems]
    .sort((a:any,b:any)=> new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // ── INVITE VIEW ──
  if(view==='invite') return (
    <div style={{flex:1,display:'flex',flexDirection:'column',background:circleBg}}>
      <div style={{padding:'24px 24px 16px',borderBottom:`0.5px solid ${pgLine}`,flexShrink:0}}>
        <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgAccent,lineHeight:1,marginBottom:6}}>Invite to Circle</div>
        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>Up to 3 people. They can add to your Muse board.</div>
      </div>

      {waLink ? (
        waLink.startsWith('ERROR:') ? (
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32,gap:16}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:19,color:'#C4534A',textAlign:'center' as any,lineHeight:1.5,fontFeatureSettings:'"opsz" 9'}}>
              {waLink.replace('ERROR:', '')}
            </div>
            <button onClick={()=>{setWaLink(null);setInviting(false);}}
              style={{background:'none',border:`0.5px solid ${pgAccent}`,borderRadius:4,padding:'10px 20px',cursor:'pointer',
                fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                textTransform:'uppercase' as any,color:pgAccent}}>
              Try again
            </button>
          </div>
        ) : (
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:32,gap:20}}>
          <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:19,color:pgInk,textAlign:'center' as any,lineHeight:1.5,fontFeatureSettings:'"opsz" 9'}}>
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
          <button onClick={()=>{setWaLink(null);setInviteName('');setInvitePhone('');setView('feed');}}
            style={{background:'none',border:'none',cursor:'pointer',
              fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
              textTransform:'uppercase' as any,color:pgInkMute,padding:0}}>
            Back to Circle
          </button>
        </div>
        )
      ) : (
        <div style={{flex:1,padding:'24px',display:'flex',flexDirection:'column',gap:20}}>
          {/* Invite from contacts — Android only (Contact Picker API) */}
          {contactsSupported&&(
            <button onClick={pickContact} {...press('circle:contacts')}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'12px',
                borderRadius:4,border:`0.5px solid ${pgAccent}`,background:'transparent',cursor:'pointer',
                fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',
                textTransform:'uppercase' as any,color:pgAccent,WebkitTapHighlightColor:'transparent',
                ...pressed('circle:contacts')}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" stroke={pgAccent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Invite from contacts
            </button>
          )}
          {/* Name input */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:8}}>Their name</div>
            <input value={inviteName} onChange={e=>setInviteName(e.target.value)}
              placeholder="e.g. Mom, Priya, Anjali"
              style={{width:'100%',background:'transparent',border:`0.5px solid ${pgLine}`,borderRadius:4,
                padding:'12px 14px',color:pgInk,
                fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,
                fontFeatureSettings:'"opsz" 9',outline:'none',
                boxSizing:'border-box' as any}}/>
          </div>
          {/* Phone input (optional) — enables direct WhatsApp deep-link */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:8}}>Their WhatsApp number <span style={{opacity:.6}}>· optional</span></div>
            <input value={invitePhone} onChange={e=>setInvitePhone(e.target.value.replace(/[^\d+ ]/g,''))}
              type="tel" inputMode="tel"
              placeholder="e.g. 98765 43210"
              style={{width:'100%',background:'transparent',border:`0.5px solid ${pgLine}`,borderRadius:4,
                padding:'12px 14px',color:pgInk,
                fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,
                fontFeatureSettings:'"opsz" 9',outline:'none',
                boxSizing:'border-box' as any}}/>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkMute,marginTop:6,fontFeatureSettings:'"opsz" 9'}}>Add a number to send the invite straight to their chat.</div>
          </div>
          {/* Role selector */}
          <div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:8}}>Relationship</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {['partner','family','inner_circle'].map(r=>(
                <div key={r} onClick={()=>setInviteRole(r)}
                  style={{padding:'10px 14px',borderRadius:4,border:`0.5px solid ${inviteRole===r?pgAccent:pgLine}`,cursor:'pointer',
                    background:inviteRole===r?(dark?'rgba(196,133,106,.08)':'rgba(42,95,130,.06)'):'transparent',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,
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
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,marginBottom:12}}>Your Circle</div>
        <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap' as any}}>
          {loading?(
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:pgInkMute,letterSpacing:'.22em'}}>loading…</div>
          ):members.length===0&&pending.length===0?(
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:16,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>No one yet. Invite someone.</div>
          ):(
            <>
              {members.map(m=>(
                <div key={m.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  {/* Avatar circle */}
                  <div style={{width:44,height:44,borderRadius:'50%',
                    background:dark?'rgba(196,133,106,.15)':'rgba(42,95,130,.12)',
                    border:`1.5px solid ${pgAccent}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:"'Fraunces',serif",fontStyle:'italic',fontSize:19,color:pgAccent}}>
                    {(m.invitee_name||'?')[0]}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,textAlign:'center' as any}}>
                    {m.invitee_name?.split(' ')[0]}
                  </div>
                  {/* Active candle dot */}
                  {m.status==='active'&&(
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
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute,textAlign:'center' as any}}>
                    {p.invitee_name?.split(' ')[0]}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:pgInkMute,letterSpacing:'.22em',textTransform:'uppercase' as any}}>pending</div>
                </div>
              ))}
            </>
          )}
          {/* Add button */}
          {members.length < 3 && (
            <div onClick={()=>setView('invite')} {...press('circle:add')} style={{width:44,height:44,borderRadius:'50%',
              border:`1px dashed ${pgLine}`,
              display:'flex',alignItems:'center',justifyContent:'center',
              cursor:'pointer',WebkitTapHighlightColor:'transparent',color:pgInkMute,fontSize:20,fontWeight:200,
              ...pressed('circle:add')}}>
              +
            </div>
          )}
        </div>
      </div>

      {/* ── POLLS ────────────────────────────────────────────────────────────
          Above the feed, because a poll is a thing WAITING ON SOMEONE and the
          feed is a record of things that already happened. The bride votes here
          like anyone else — R-D3.2's whole point — so there is no read-only
          variant of this block. */}
      {/* ── THE AFFORDANCE IS NOT GATED ON POLLS EXISTING ────────────────────
          D-3b gated this whole block on `polls.length>0`, which was right when
          the block was read-only. With ① now tappable, that gate would have hidden
          the ONLY way to ask a question at exactly the moment there are no
          questions — the empty state would say "No polls yet." beside no means of
          fixing it. So ① renders whenever the bloom has loaded, and the list or
          ⑨ renders beneath it. */}
      {!loading && (
        <div style={{padding:`0 ${FS.gutter}px ${FS.s3}px`}}>
          {/* ① FINALLY BECOMES WHAT IT WAS VETOED AS. It was approved as "the
              affordance that opens a poll" and D-3b rendered it as a dead
              eyebrow because no affordance existed yet. The byte does not move;
              it becomes tappable. That is why D-3c's sheet cost no line for the
              opening control. */}
          {/* ── ① READS AS A CTA, AND THE RUNG SAYS WHICH ONE ────────────────
              It shipped at `engravedSm` (9) with no border — the estate's
              "one permitted sub-floor rung", which the language reserves for
              timestamps and captions, and nothing about it said "press me".
              `FT.engraved` (11) is declared in `lib/frost/tokens.ts` as
              "JetBrains Mono · ACTIONS, PRIMARY LABELS" — ① is an action, so it
              belongs on the rung named for actions rather than the one below it.
              The pressable chrome is this file's own: a hairline in the accent
              at `FI.chrome`, the same shape every option button and every sheet
              field already wears, so a CTA appears without a new vocabulary.
              STYLING ONLY — the byte is frozen and does not move. */}
          <button onClick={()=>setAskOpen(true)}
            style={{background:'transparent',border:`${FS.hair} solid ${pgAccent}`,
                    borderRadius:FI.chrome,padding:'8px 14px',cursor:'pointer',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:FT.engraved,letterSpacing:FS.track,
                    textTransform:'uppercase' as any,color:pgAccent,marginBottom:14}}>{POLL_ASK}</button>
          {polls.map(p=>{
            // WHO WON, OR WHETHER ANYBODY DID. A tie is not an edge case: four
            // options can all hold an equal count, which is why ⑧'s byte takes a
            // list. A closed poll with zero votes has neither line.
            const top      = p.total_votes>0 ? Math.max(...p.options.map(o=>o.votes)) : -1;
            const leaders  = p.options.filter(o=>o.votes===top);
            const result   = (!p.closed || p.total_votes===0) ? null
                           : leaders.length===1 ? pollWinner(leaders[0].label)
                           : pollTie(leaders.map(o=>o.label));
            const closesAt = p.closes_at ? new Date(p.closes_at) : null;
            // ── F-14.8 DEFUSED · A DETERMINISTIC FORMAT, NOT A LOCALE ONE ──
            // This read `toLocaleString(undefined, …)`. `undefined` means "the
            // runtime's own locale AND time zone", which differ between the
            // server that renders the HTML and the browser that hydrates it —
            // React's cause #3, verbatim, in its own error text.
            //
            // It was LANDMINE-CLASS, never live: the whole poll subtree is gated
            // on `!loading && polls.length>0`, and `loading` starts true, so this
            // never ran during the hydration comparison. The founder's walk armed
            // it for the first time in production by setting a closes_at, and the
            // console stayed unchanged — the gate held exactly as derived.
            //
            // Cleared anyway, because a landmine cleared cheap is a landmine
            // cleared, and the gate is one refactor away from moving. `en-GB` and
            // an explicit `Asia/Kolkata` are the same string on every machine, so
            // the value can no longer depend on where it is computed. The estate
            // is one wedding business in one time zone; a date rendered in the
            // server's zone and a date rendered in hers must be the same date.
            const closes   = closesAt && !Number.isNaN(closesAt.getTime()) && !p.closed
                           ? pollCloses(closesAt.toLocaleString('en-GB',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit',timeZone:'Asia/Kolkata'}))
                           : null;
            return (
              <div key={p.id} style={{borderBottom:`${FS.hair} solid ${pgLine}`,paddingBottom:FS.s2,marginBottom:FS.s2}}>
                <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.lead,color:pgInk,lineHeight:1.35,marginBottom:10}}>{p.question}</div>
                {p.options.map(o=>{
                  const mine = p.my_vote===o.id;
                  return (
                    <button key={o.id} disabled={p.closed||voting===p.id} onClick={()=>votePoll(p.id,o.id)}
                      style={{width:'100%',textAlign:'left' as any,background:mine?'rgba(255,255,255,.06)':'transparent',
                              border:`${FS.hair} solid ${mine?pgAccent:pgLine}`,borderRadius:FI.chrome,
                              padding:'10px 12px',marginBottom:6,cursor:p.closed?'default':'pointer',
                              display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
                      <span style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,color:pgInk,flex:1,fontFeatureSettings:'"opsz" 9'}}>{o.label}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,textTransform:'uppercase' as any,color:mine?pgAccent:pgInkMute,flexShrink:0}}>
                        {/* Live tallies are the spec's own word, and a poll is
                            shared by creation — the count is never withheld. */}
                        {mine?POLL_YOUR_CHOICE:(p.closed?'':POLL_TAP_TO_CHOOSE)}{o.votes>0?` · ${o.votes}`:''}
                      </span>
                    </button>
                  );
                })}
                {/* ── F-14.9 · THE LINKED EVENT REACHES A SCREEN ──────────
                    D-3a served `linked_event` and D-3b rendered it nowhere, so
                    the vendor gate was payload-true and screen-false and the
                    founder's ratified sheet line (b) — "a member without the
                    flag sees the event's name and date but not its vendor" —
                    described a screen that did not exist. The walk caught it.
                    Rendered LABEL-FREE: the event's own name and date, no
                    connective word of ours, so this is ⑫-class — her data — and
                    needed no byte on the sheet.
                    THE VENDOR IS NOT RENDERED HERE AT ALL, on either surface.
                    The gate is the SERVER's: `vendor_id` simply is not in a
                    flagless member's payload, so the absence is payload-level
                    truth rather than a CSS opinion — the 08 blur standard. ⑪
                    holds: nothing announces that anything is missing. */}
                {p.linked_event && (
                  <div style={{marginTop:8,fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,color:pgInkSoft,fontFeatureSettings:'"opsz" 9'}}>
                    {p.linked_event.title} · {new Date(p.linked_event.event_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'Asia/Kolkata'})}
                  </div>
                )}
                <div style={{display:'flex',gap:12,flexWrap:'wrap' as any,alignItems:'center',marginTop:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,textTransform:'uppercase' as any}}>
                  <span style={{color:pgInkMute}}>{pollTally(p.total_votes,p.eligible_count)}</span>
                  {closes && <span style={{color:pgInkMute}}>{closes}</span>}
                  {result && <span style={{color:pgAccent}}>{result}</span>}
                  {/* J · the WORD, not a bin glyph — `people.tsx` uses words for
                      destructive acts, and an icon-only control on a card that is
                      otherwise all text would be a new vocabulary. It sits last
                      and quiet: unmaking is available, never invited. */}
                  <button onClick={()=>setDelTarget(p)}
                    style={{marginLeft:'auto',background:'transparent',border:'none',padding:0,
                            cursor:'pointer',fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                            letterSpacing:FS.track,textTransform:'uppercase' as any,color:pgInkMute}}>{POLL_DELETE}</button>
                </div>
              </div>
            );
          })}

          {/* ⑨ · THE BYTE IS FROZEN; ITS DRESS WAS THE DEFECT (founder,
              2026-08-14). It rendered at JetBrains Mono 9px uppercase inkMute —
              the treatment this estate reserves for timestamps and `loading…` —
              while the activity feed's own empty state, further down this same
              file, speaks at Italianno 46 in the accent. A statement was dressed
              as a footnote. Same words, same character as its sibling: styling
              is not copy, so the byte does not move and only its presence does.
              It stays ONE line — the sibling's second, explanatory line would be
              a NEW byte and does not ride a styling fix. It now sits BENEATH the
              affordance, so the sentence and the remedy are on screen together. */}
          {polls.length===0 && (
            <div style={{padding:`${FS.s2}px 0 0`,display:'flex',flexDirection:'column',alignItems:'center'}}>
              {/* ⑨'s FIRST CORRECTION OVERSHOT, and the token file says exactly
                how far. It went from 9px mono — a footnote — to Italianno 46,
                which is `FT.greeting`: the masthead's rung, declared "ONE per
                screen", and the masthead already spends it. So the fix made the
                empty state a SECOND hero on a page whose hero is the circle
                itself, and borrowed a rung that was already taken.
                POLLS ARE A SECTION, NOT THE SUBJECT OF THIS PAGE. `FT.body`
                (16) is the rung the language calls "ALL body prose, THE FLOOR",
                and it is what the activity feed's own empty state uses for its
                sentence — the Italianno line above it is that surface's head
                because the FEED is that surface's subject. ⑨ takes the sentence
                treatment, not the head's.
                STYLING ONLY — the byte is frozen, still one line. */}
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,color:pgInkSoft,lineHeight:1.6,textAlign:'center' as any,fontFeatureSettings:'"opsz" 9'}}>{POLL_EMPTY}</div>
            </div>
          )}
        </div>
      )}

      {/* ⑨ — the empty state lives HERE and not on the member's strip, because
          this is the surface whose subject is polls. */}

      {/* ── D-3e · THE CONFIRM, MIRRORING A SHIPPED VETOED PATTERN ───────────
          `people.tsx` asks "Remove {name}?", names the consequence, and offers
          Remove / Keep with the destructive button in a muted red. This is that
          shape, not a second one: matching copy the founder has already approved
          beats inventing a new voice for the same act.
          THE CONSEQUENCE LINE IS NOT DECORATION. 0124 cascades every vote with
          the poll, so the loss is real and invisible — she should know before,
          not discover after. */}
      {delTarget && (
        <>
          <div onClick={()=>{ if(!deleting) setDelTarget(null); }}
               style={{position:'fixed',inset:0,background:'rgba(0,0,0,.55)',zIndex:300}}/>
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:301,background:dark?'#1A0A0E':'#EEF0F6',
                       borderRadius:'20px 20px 0 0',
                       padding:`24px 24px calc(24px + env(safe-area-inset-bottom,0px))`}}>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.lead,color:pgInk,marginBottom:6,fontFeatureSettings:'"opsz" 9'}}>{POLL_DELETE_CONFIRM}</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,color:pgInkSoft,marginBottom:24,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>{POLL_DELETE_BODY}</div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={confirmDelete} disabled={deleting}
                style={{flex:1,padding:14,background:'rgba(184,69,62,.15)',border:'0.5px solid rgba(184,69,62,.4)',
                        borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,
                        textTransform:'uppercase' as any,color:'#B8453E',cursor:'pointer',opacity:deleting?.5:1}}>
                {deleting?POLL_DELETING:POLL_DELETE}
              </button>
              <button onClick={()=>setDelTarget(null)} disabled={deleting}
                style={{flex:1,padding:14,background:'rgba(255,255,255,.04)',border:`${FS.hair} solid ${pgLine}`,
                        borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,
                        textTransform:'uppercase' as any,color:pgInkMute,cursor:'pointer'}}>{POLL_KEEP}</button>
            </div>
          </div>
        </>
      )}

      {/* ── THE CREATE SHEET (D-3c) · BRIDE-ONLY ─────────────────────────────
          Every byte below comes from `lib/circle/pollCopy.ts`; this file carries
          no poll literal of its own, so the founder's veto is enforced by one
          module rather than by two files agreeing.

          ⑫ BINDS THE WHOLE SHEET: every field has a LABEL ABOVE IT and NO
          placeholder inside it. A placeholder is example words sitting in her
          question until she overwrites them, which is exactly what ⑫ refused.
          The invite panel's `e.g. Mom, Priya, Anjali` is a different,
          separately-vetoed surface and is not precedent here. */}
      {askOpen && (
        <div style={{position:'fixed',inset:0,zIndex:60,background:'rgba(0,0,0,.72)',
                     display:'flex',alignItems:'flex-end'}}
             onClick={()=>{ if(!asking) resetAsk(); }}>
          <div onClick={e=>e.stopPropagation()}
               style={{width:'100%',maxHeight:'88vh',overflowY:'auto',background:circleBg,
                       borderTopLeftRadius:FI.sheet,borderTopRightRadius:FI.sheet,
                       padding:`${FS.s3}px ${FS.gutter}px calc(env(safe-area-inset-bottom,0px) + ${FS.s3}px)`}}>

            {/* A · reuses ① — the sheet IS what the label promised */}
            <div style={{fontFamily:"'Italianno',cursive",fontSize:52,color:pgAccent,lineHeight:1,marginBottom:FS.s2}}>{POLL_SHEET_HEAD}</div>

            {/* B */}
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,textTransform:'uppercase' as any,color:pgInkMute,marginBottom:6}}>{POLL_QUESTION_LABEL}</div>
            <input value={askQ} onChange={e=>setAskQ(e.target.value)} disabled={asking}
              style={{width:'100%',background:'transparent',border:`${FS.hair} solid ${pgLine}`,
                      borderRadius:FI.chrome,padding:'10px 12px',color:pgInk,
                      fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,
                      marginBottom:FS.s2,fontFeatureSettings:'"opsz" 9'}}/>

            {/* C */}
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,textTransform:'uppercase' as any,color:pgInkMute,marginBottom:6}}>{POLL_CHOICES_LABEL}</div>
            {askOpts.map((o,i)=>(
              <input key={i} value={o} disabled={asking}
                onChange={e=>setAskOpts(prev=>prev.map((v,j)=>j===i?e.target.value:v))}
                style={{width:'100%',background:'transparent',border:`${FS.hair} solid ${pgLine}`,
                        borderRadius:FI.chrome,padding:'10px 12px',color:pgInk,
                        fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,
                        marginBottom:6,fontFeatureSettings:'"opsz" 9'}}/>
            ))}

            {/* D, and E's expected-zero: at four the control simply GREYS. ②
                already speaks the bound at the server; repeating it on a disabled
                button explains a wall she has just hit instead of one she is
                approaching. */}
            <button onClick={()=>setAskOpts(prev=>prev.length<MAX_CHOICES?[...prev,'']:prev)}
              disabled={asking||askOpts.length>=MAX_CHOICES}
              style={{background:'transparent',border:'none',padding:'6px 0',
                      cursor:askOpts.length>=MAX_CHOICES?'default':'pointer',
                      opacity:askOpts.length>=MAX_CHOICES?.35:1,
                      fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,
                      textTransform:'uppercase' as any,color:pgAccent}}>{POLL_ADD_CHOICE}</button>

            {/* I · optional, off at rest. ⑥ owns the DISPLAY byte on the card. */}
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,textTransform:'uppercase' as any,color:pgInkMute,margin:`${FS.s2}px 0 6px`}}>{POLL_ADD_CLOSING}</div>
            <input type="datetime-local" value={askClose} disabled={asking}
              onChange={e=>setAskClose(e.target.value)}
              style={{width:'100%',background:'transparent',border:`${FS.hair} solid ${pgLine}`,
                      borderRadius:FI.chrome,padding:'10px 12px',color:pgInk,
                      fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:FT.body,
                      marginBottom:FS.s3,fontFeatureSettings:'"opsz" 9'}}/>

            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              {/* F/G · gated, never refused with a byte. A form that greys its
                  own button never has to say no. */}
              <button onClick={submitAsk} disabled={!askReady||asking}
                style={{flex:1,background:askReady&&!asking?pgAccent:'transparent',
                        color:askReady&&!asking?'#0C0A09':pgInkMute,
                        border:`${FS.hair} solid ${askReady&&!asking?pgAccent:pgLine}`,
                        borderRadius:FI.chrome,padding:'12px 0',
                        cursor:askReady&&!asking?'pointer':'default',
                        fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,
                        textTransform:'uppercase' as any}}>{asking?POLL_SUBMITTING:POLL_SUBMIT}</button>
              {/* H · plain: she may be abandoning a typo, not a thought. */}
              <button onClick={resetAsk} disabled={asking}
                style={{background:'transparent',border:'none',padding:'12px',
                        cursor:asking?'default':'pointer',
                        fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:FS.track,
                        textTransform:'uppercase' as any,color:pgInkMute}}>{POLL_CANCEL}</button>
            </div>
          </div>
        </div>
      )}

      {/* Activity feed */}
      <div className="no-scroll" style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch' as any}}>
        {loading?(
          <div style={{padding:32,textAlign:'center' as any,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>loading…</div>
        ):activity.length===0?(
          <div style={{padding:`${FS.s5}px ${FS.gutter}px`,display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
            <div style={{fontFamily:"'Italianno',cursive",fontSize:46,color:pgAccent,lineHeight:1,textAlign:'center' as any}}>Quiet here<br/>for now.</div>
            <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInkSoft,textAlign:'center' as any,lineHeight:1.6,fontFeatureSettings:'"opsz" 9'}}>When your Circle saves something<br/>or sends a message, it appears here.</div>
          </div>
        ):(
          <div>
            {activity.map(a=>(
              <div key={a.id} style={{padding:'14px 20px',borderBottom:`0.5px solid ${pgLine}`,display:'flex',gap:12,alignItems:'flex-start'}}>
                {/* Activity dot */}
                <div style={{width:7,height:7,borderRadius:'50%',background:pgAccent,flexShrink:0,marginTop:5,opacity:.7}}/>
                <div style={{flex:1}}>
                  {/* Save with image — portrait thumbnail + caption beside, full image visible */}
                  {a.activity_type==='save_added'&&a.image_url?(
                    <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                      {/* Portrait thumbnail — fixed width, natural height, no cropping */}
                      <div style={{flexShrink:0,width:64,borderRadius:6,overflow:'hidden',background:dark?'rgba(196,133,106,.06)':'rgba(42,95,130,.06)'}}>
                        <img src={a.image_url} alt="" style={{width:'100%',display:'block',objectFit:'contain'}} loading="lazy"/>
                      </div>
                      {/* Caption + meta beside */}
                      <div style={{flex:1,paddingTop:2}}>
                        <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInk,lineHeight:1.5,fontFeatureSettings:'"opsz" 9',marginBottom:6}}>
                          {a.content || formatActivityLine(a)}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          {Date.now()-new Date(a.created_at).getTime()<600000&&(
                            <span className="cf-a" style={{width:4,height:4,borderRadius:'50%',background:signal,boxShadow:`0 0 4px ${signal}`,flexShrink:0}}/>
                          )}
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>
                            {a.member_name||'You'} · {timeAgo(a.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ):(
                    <>
                  <div style={{fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,color:pgInk,lineHeight:1.55,fontFeatureSettings:'"opsz" 9',marginBottom:4}}>
                    {a.content || formatActivityLine(a)}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {Date.now()-new Date(a.created_at).getTime()<600000&&(
                      <span className="cf-a" style={{width:4,height:4,borderRadius:'50%',background:signal,boxShadow:`0 0 4px ${signal}`,flexShrink:0}}/>
                    )}
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase' as any,color:pgInkMute}}>
                      {a.member_name||'You'} · {timeAgo(a.created_at)}
                    </span>
                  </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Circle compose — minimal, sends to group thread */}
      <div style={{flexShrink:0,background:dark?'rgba(12,4,5,.88)':'rgba(230,232,240,.88)',
        backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
        borderTop:`0.5px solid ${pgLine}`,
        padding:`10px 16px calc(10px + env(safe-area-inset-bottom,0px))`}}>
        {chatLocked ? (
          /* F-07.72 ZIP 2 · FORK A(c) — THE LANDING. It replaces the composer
             rather than sitting above it: a box she can type into that cannot
             send is the vanishing-message failure with extra steps. */
          <div style={{padding:'6px 2px',textAlign:'center' as any,
            fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,
            color:pgInkSoft,lineHeight:1.5,fontFeatureSettings:'"opsz" 9'}}>
            Sign in again to see and send Circle messages.
          </div>
        ) : (
        <CircleCompose dark={dark} accent={pgAccent} line={pgLine} ink={pgInk} signal={signal}
          onRefused={()=>setChatLocked(true)}
          onSent={(msg)=>{
            // Optimistic — append to chatMsgs; next 10s poll reconciles with server truth.
            setChatMsgs(prev=>[...prev,{id:'local-'+Date.now(),content:msg,body:msg,sender_role:'bride',sender_name:'You',created_at:new Date().toISOString()}]);
          }}/>
        )}
      </div>
    </div>
  );
}

// ── CIRCLE COMPOSE ─────────────────────────────────────────────────────────────
interface CircleComposeProps {dark:boolean;accent:string;line:string;ink:string;signal:string;onSent:(msg:string)=>void;onRefused:()=>void;}
function CircleCompose({dark,accent,line,ink,onSent,onRefused}:CircleComposeProps){
  const [text,   setText]   = React.useState('');
  const [sending,setSending]= React.useState(false);
  const API = process.env.NEXT_PUBLIC_API_BASE||'https://dream-os-production.up.railway.app';

  const send = async () => {
    if(!text.trim()||sending) return;
    const msg = text.trim();
    setText('');
    setSending(true);
    try {
      const coupleId = getCoupleIdForFrost();
      if(coupleId) {
        // No thread_id → backend resolves the canonical per-couple circle thread.
        // F-07.72 — the bride's Bearer joins the POST. Her GET sibling at the
        // thread poll has always sent one (ignored until this delivery); this
        // send never did. The circle doors are dual-lane and take a resolver,
        // never a circle-member guard: without this header the enforcement
        // delivery would refuse the bride her own circle chat.
        const circleToken = coupleAccessToken();
        const res = await fetch(`${API}/api/v2/frost/circle/messages`,{
          method:'POST',
          headers: circleToken
            ? {'Content-Type':'application/json', Authorization:`Bearer ${circleToken}`}
            : {'Content-Type':'application/json'},
          // F-07.107 — `sender_name:'Bride'` was here. The server no longer accepts
          // the parameter: her ACTUAL name is hydrated from couples.user_id ->
          // users.name and persisted to 0105's column, so the literal that used to
          // travel from this line and die at the insert is gone at both ends.
          // `sender_role` STAYS — it is a role, it is stored as one in sent_by, and
          // :2625 below reads it to say 「 You 」 on her own bubbles.
          body:JSON.stringify({userId:coupleId,body:msg,sender_role:'bride'}),
        });
        // F-07.72 ZIP 2 — this response was DISCARDED, which was harmless while
        // nothing refused. Under enforcement a discarded 401 is her message
        // disappearing with no error anywhere. Her text goes back in the box and
        // the landing takes the composer's place.
        if(res.status===401){ setText(msg); onRefused(); setSending(false); return; }
      }
      onSent(msg);
    } catch {}
    setSending(false);
  };

  const inputBg  = dark?'rgba(196,133,106,.05)':'rgba(42,95,130,.05)';
  const inputBdr = dark?'rgba(196,133,106,.18)':'rgba(42,95,130,.18)';

  return(
    <div style={{display:'flex',gap:8,alignItems:'center',background:inputBg,border:`0.5px solid ${inputBdr}`,borderRadius:20,padding:'7px 8px 7px 14px'}}>
      <input value={text} onChange={e=>setText(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();send();}}}
        placeholder="Say something to your circle…"
        disabled={sending}
        style={{flex:1,background:'transparent',border:'none',outline:'none',
          fontFamily:"'Fraunces',serif",fontStyle:'italic',fontWeight:300,fontSize:16,
          color:ink,fontFeatureSettings:'"opsz" 9',userSelect:'text',WebkitUserSelect:'text'}}/>
      <button onClick={send} disabled={!text.trim()||sending}
        style={{width:30,height:30,borderRadius:'50%',background:text.trim()&&!sending?accent:'rgba(128,128,128,.12)',
          color:text.trim()&&!sending?(dark?'#1A0810':'#FFFFFF'):'rgba(128,128,128,.4)',
          border:'none',display:'flex',alignItems:'center',justifyContent:'center',cursor:text.trim()&&!sending?'pointer':'default',flexShrink:0}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
