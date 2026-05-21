'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Plus, X, Send } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, FROST_SURFACE, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchCircleFeed, fetchCircleThreads, fetchCircleMessages, sendCircleMessage,
  inviteCircleMember, formatActivityLine, timeAgo,
  type CircleActivityEvent, type CircleThread, type CircleMessage,
} from '../../../../../../lib/frost/journey';

export default function JourneyCircle() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [feed, setFeed] = useState<CircleActivityEvent[]>([]);
  const [threads, setThreads] = useState<CircleThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [openThread, setOpenThread] = useState<CircleThread | null>(null);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [composing, setComposing] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteSheet, setInviteSheet] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteToast, setInviteToast] = useState('');

  const load = useCallback(async () => {
    const [f, th] = await Promise.all([fetchCircleFeed(), fetchCircleThreads()]);
    setFeed(f); setThreads(th); setLoading(false);
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 30000); return () => clearInterval(iv); }, [load]);

  const openSheet = useCallback(async (thread: CircleThread) => {
    setOpenThread(thread);
    const msgs = await fetchCircleMessages(thread.thread_id);
    setMessages(msgs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  const handleSend = useCallback(async () => {
    if (!composing.trim() || !openThread || sending) return;
    setSending(true);
    const body = composing.trim(); setComposing('');
    const ok = await sendCircleMessage(openThread.thread_id, body);
    if (ok) {
      const msgs = await fetchCircleMessages(openThread.thread_id);
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    setSending(false);
  }, [composing, openThread, sending]);

  const handleInvite = useCallback(async () => {
    if (!inviteName.trim() || inviting) return;
    setInviting(true);
    const link = await inviteCircleMember(inviteName.trim(), 'inner_circle');
    setInviting(false);
    if (link) {
      setInviteSheet(false); setInviteName('');
      if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ url: link, title: 'Join my Circle' }).catch(() => {});
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(link).catch(() => {});
        setInviteToast('Invite link copied');
        setTimeout(() => setInviteToast(''), 2800);
      }
    } else {
      setInviteToast('Could not generate invite. Try again.');
      setTimeout(() => setInviteToast(''), 2800);
    }
  }, [inviteName, inviting]);

  const groupThreads = threads.filter(th => th.kind === 'group');
  const dmThreads    = threads.filter(th => th.kind === 'dm');

  return (
    <>
    <CanvasShell eyebrow="Circle" backTo="/frost/canvas/journey">
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>

        {/* Zone 1 — Timeline */}
        <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>Timeline</div>
        <FrostedSurface style={{ padding:SP.xl, marginBottom:SP.xl }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:6 }}>Your Circle is live.</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft }}>Invite family and planners to join your wedding team.</div>
        </FrostedSurface>

        <div style={{ height:'0.5px', background:t.hairline, opacity:0.4, marginBottom:SP.xl }} />

        {/* Zone 2 — Activity */}
        <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>Activity</div>
        {loading && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic', marginBottom:SP.m }}>Loading…</div>}
        {!loading && feed.length === 0 && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic', marginBottom:SP.m }}>Activity will appear here as things happen.</div>}
        {feed.map(e => (
          <div key={e.id} style={{ display:'flex', alignItems:'flex-start', gap:SP.m, marginBottom:SP.m }}>
            <div style={{ width:5, height:5, borderRadius:3, background:t.brassMuted, marginTop:6, flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft }}>{formatActivityLine(e)}</div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', color:t.brassMuted, marginTop:2 }}>{timeAgo(e.created_at)}</div>
            </div>
          </div>
        ))}

        <div style={{ height:'0.5px', background:t.hairline, opacity:0.4, marginTop:SP.m, marginBottom:SP.xl }} />

        {/* Zone 3 — Threads */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.m }}>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft }}>Threads</div>
          <button onClick={() => setInviteSheet(true)} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
            <Plus size={12} color={t.brassMuted} strokeWidth={1.5} />Invite
          </button>
        </div>
        {threads.length === 0 && !loading && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic' }}>No Circle members yet.</div>}
        {[...groupThreads, ...dmThreads].map(th => (
          <FrostedSurface key={th.thread_id} onPress={() => openSheet(th)} radius={FR.md} style={{ marginBottom:4 }}>
            <div style={{ display:'flex', alignItems:'center', padding:`${SP.m}px ${SP.l}px`, gap:SP.m }}>
              <div style={{ width:34, height:34, borderRadius:17, background:`rgba(168,146,75,0.10)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Users size={16} color={t.brassMuted} strokeWidth={1.5} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:FF.display, fontSize:15, color:t.ink }}>{th.label}</div>
                  {th.last_active && <div style={{ fontFamily:FF.label, fontSize:9, color:t.soft }}>{timeAgo(th.last_active)}</div>}
                </div>
                <div style={{ fontFamily:FF.body, fontSize:12, color:t.soft, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {th.last_message?.content || (th.kind === 'group' ? 'Group thread' : 'No messages yet')}
                </div>
              </div>
            </div>
          </FrostedSurface>
        ))}
      </div>

      {/* Message sheet */}
      {openThread && <>
        <div onClick={() => setOpenThread(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, top:'15%', zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', padding:`${SP.l}px ${SP.xl}px`, borderBottom:`0.5px solid ${t.hairline}`, gap:SP.m }}>
            <button onClick={() => setOpenThread(null)} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink }}>{openThread.label}</div>
              {openThread.role && <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.soft }}>{openThread.role}</div>}
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:SP.xl, display:'flex', flexDirection:'column', gap:SP.m }}>
            {messages.length === 0 && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic' }}>No messages yet. Say something.</div>}
            {messages.map(m => {
              const isMe = m.sender_role === 'bride';
              return (
                <div key={m.id} style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start' }}>
                  <div style={{ maxWidth:'80%', background:isMe ? t.brass : (look==='E1'?'rgba(255,253,248,0.16)':'rgba(255,253,248,0.80)'), borderRadius:FR.md, padding:SP.m }}>
                    {!isMe && <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.soft, marginBottom:3 }}>{m.sender_name}</div>}
                    <div style={{ fontFamily:FF.body, fontSize:14, color:isMe?'#1B1612':t.ink, lineHeight:1.5 }}>{m.content}</div>
                    <div style={{ fontFamily:FF.label, fontSize:9, color:isMe?'rgba(255,255,255,0.5)':t.soft, marginTop:4 }}>{timeAgo(m.created_at)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding:`${SP.m}px ${SP.l}px calc(${SP.l}px + env(safe-area-inset-bottom))`, ...FROST_SURFACE.composer, borderTop:`0.5px solid ${t.hairlineStrong}` }}>
            <div style={{ display:'flex', alignItems:'flex-end', gap:SP.m }}>
              <input
                value={composing}
                onChange={e => setComposing(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Message…"
                style={{ flex:1, background:'transparent', border:'none', outline:'none', fontFamily:FF.body, fontSize:15, color:t.ink, padding:'4px 0' }}
              />
              <button onClick={handleSend} disabled={!composing.trim() || sending} style={{ background:'none', border:'none', cursor:'pointer', opacity:composing.trim()?1:0.4 }}>
                <Send size={18} color={composing.trim() ? t.brass : t.soft} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </>}
    </CanvasShell>

      {inviteToast && (
        <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{inviteToast}</div>
      )}

      {inviteSheet && <>
        <div onClick={() => setInviteSheet(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:300 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:301, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink, marginBottom:6 }}>Add to Circle</div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:20 }}>They'll get a WhatsApp invite link.</div>
          <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Their name</div>
          <input
            value={inviteName}
            onChange={e => setInviteName(e.target.value)}
            placeholder="Ananya, Mom, Planner\u2026"
            autoFocus
            style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.body, fontSize:15, color:t.ink, outline:'none', boxSizing:'border-box' as const, marginBottom:16 }}
          />
          <button
            onClick={handleInvite}
            disabled={!inviteName.trim() || inviting}
            style={{ width:'100%', padding:14, background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity:(!inviteName.trim() || inviting) ? 0.5 : 1 }}
          >{inviting ? 'Generating\u2026' : 'Send Invite'}</button>
        </div>
      </>}
    </>
  );
}
