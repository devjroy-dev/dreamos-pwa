'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Plus, X, Send } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, FROST_SURFACE, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchCircle, fetchCircleThreads, fetchThreadMessages, sendThreadMessage,
  inviteCircleMember, formatActivityLine, timeAgo,
  type CircleData, type CircleMember, type CircleActivity,
  type CircleThread, type CircleMessage,
} from '../../../../../../lib/frost/journey';

const ROLES = [
  { value: 'partner',      label: 'Partner / Fiancé' },
  { value: 'family',       label: 'Family' },
  { value: 'inner_circle', label: 'Inner Circle (BFF, Maid of Honour)' },
] as const;

const inp = (t: any): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)',
  border: `0.5px solid ${t.hairline}`, borderRadius: FR.md, fontFamily: FF.body,
  fontSize: 15, color: t.ink, outline: 'none', boxSizing: 'border-box' as const,
});

export default function JourneyCircle() {
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];

  const [circle, setCircle]     = useState<CircleData | null>(null);
  const [threads, setThreads]   = useState<CircleThread[]>([]);
  const [loading, setLoading]   = useState(true);

  // Thread sheet
  const [openThread, setOpenThread]   = useState<CircleThread | null>(null);
  const [messages, setMessages]       = useState<CircleMessage[]>([]);
  const [composing, setComposing]     = useState('');
  const [sending, setSending]         = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Invite sheet
  const [showInvite, setShowInvite]   = useState(false);
  const [inviteName, setInviteName]   = useState('');
  const [inviteRole, setInviteRole]   = useState<'partner'|'family'|'inner_circle'>('family');
  const [inviting, setInviting]       = useState(false);
  const [toast, setToast]             = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const load = useCallback(async () => {
    const [c, th] = await Promise.all([fetchCircle(), fetchCircleThreads()]);
    setCircle(c); setThreads(th); setLoading(false);
  }, []);

  useEffect(() => { load(); const iv = setInterval(load, 30000); return () => clearInterval(iv); }, [load]);

  const openSheet = useCallback(async (thread: CircleThread) => {
    setOpenThread(thread);
    const msgs = await fetchThreadMessages(thread.thread_id);
    setMessages(msgs);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }), 100);
  }, []);

  const handleSend = useCallback(async () => {
    if (!composing.trim() || !openThread || sending) return;
    setSending(true);
    const body = composing.trim(); setComposing('');
    const ok = await sendThreadMessage(openThread.thread_id, body);
    if (ok) {
      const msgs = await fetchThreadMessages(openThread.thread_id);
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }), 100);
    }
    setSending(false);
  }, [composing, openThread, sending]);

  const handleInvite = useCallback(async () => {
    if (!inviteName.trim()) return;
    setInviting(true);
    try {
      const result = await inviteCircleMember({ invitee_name: inviteName.trim(), role: inviteRole });
      setShowInvite(false); setInviteName(''); setInviteRole('family');
      // Share the link
      if (typeof navigator !== 'undefined' && navigator.share) {
        try { await navigator.share({ url: result.wa_me_link, title: 'Join my wedding circle' }); }
        catch { await navigator.clipboard.writeText(result.wa_me_link); showToast('Link copied.'); }
      } else {
        await navigator.clipboard.writeText(result.wa_me_link);
        showToast('Invite link copied.');
      }
      await load();
    } catch (e: any) {
      if (e?.message?.includes('circle_member_limit_reached') || e?.message?.includes('limit')) {
        showToast('Circle full — max 3 members.');
      } else {
        showToast('Could not send invite. Try again.');
      }
    }
    setInviting(false);
  }, [inviteName, inviteRole, load]);

  const members  = circle?.members  || [];
  const activity = circle?.activity || [];
  const pending  = circle?.pending_invites || [];

  // Thread label fallback: threads from frost/circle endpoint have label=null.
  // Match by conversation_id to member name.
  function threadLabel(th: CircleThread): string {
    if (th.label) return th.label;
    // thread_id is "dm:<convo_uuid>"
    const convoId = th.thread_id.replace(/^dm:/, '');
    const member = members.find(m => m.conversation_id === convoId);
    return member ? member.invitee_name : 'Thread';
  }

  return (
    <CanvasShell eyebrow="Circle" backTo="/frost/canvas/journey">
      {toast && (
        <div style={{ position:'fixed', top:'calc(env(safe-area-inset-top) + 70px)', left:'50%', transform:'translateX(-50%)', background:t.ink, color:t.pagePaper, fontFamily:FF.label, fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', padding:'8px 18px', borderRadius:20, zIndex:400, pointerEvents:'none', whiteSpace:'nowrap' }}>{toast}</div>
      )}
      <div style={{ padding:`${SP.xl}px ${SP.xxl}px ${SP.huge}px` }}>

        {/* Members */}
        <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>Your circle</div>
        {loading && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic', marginBottom:SP.m }}>Loading…</div>}

        {members.length === 0 && !loading && (
          <FrostedSurface style={{ padding:SP.xl, marginBottom:SP.xl }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink, marginBottom:6 }}>Your Circle is waiting.</div>
            <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft }}>Invite family and planners to join your wedding team — they can save to your Muse board.</div>
          </FrostedSurface>
        )}

        {members.map(m => (
          <div key={m.id} style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.m}px 0`, borderBottom:`0.5px solid ${t.hairline}` }}>
            <div style={{ width:34, height:34, borderRadius:17, background:`rgba(168,146,75,0.10)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Users size={16} color={t.brassMuted} strokeWidth={1.5} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:FF.body, fontSize:14, color:t.ink }}>{m.invitee_name}</div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.12em', color:t.soft, textTransform:'uppercase' }}>{m.role.replace(/_/g,' ')} · {m.status}</div>
            </div>
            {m.last_active && <div style={{ fontFamily:FF.label, fontSize:9, color:t.soft }}>{timeAgo(m.last_active)}</div>}
          </div>
        ))}

        {pending.length > 0 && (
          <div style={{ marginTop:SP.m }}>
            {pending.map(p => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:SP.m, padding:`${SP.m}px 0`, borderBottom:`0.5px solid ${t.hairline}`, opacity:0.6 }}>
                <div style={{ width:34, height:34, borderRadius:17, border:`0.5px dashed ${t.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <div style={{ fontFamily:FF.label, fontSize:9, color:t.soft }}>?</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FF.body, fontSize:14, color:t.soft }}>{p.invitee_name}</div>
                  <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.12em', color:t.soft, textTransform:'uppercase' }}>Invite pending</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invite button */}
        <button
          onClick={() => setShowInvite(true)}
          style={{ display:'flex', alignItems:'center', gap:6, marginTop:SP.l, padding:'8px 14px', borderRadius:FR.pill, border:`0.5px solid rgba(191,160,77,0.3)`, background:'transparent', fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.brassMuted, cursor:'pointer' }}>
          <Plus size={12} color={t.brassMuted} strokeWidth={1.5} />Invite someone
        </button>

        <div style={{ height:'0.5px', background:t.hairline, opacity:0.4, margin:`${SP.xl}px 0` }} />

        {/* Activity */}
        <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>Activity</div>
        {activity.length === 0 && !loading && (
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic', marginBottom:SP.m }}>Activity will appear here as your circle gets going.</div>
        )}
        {activity.slice(0, 10).map(a => (
          <div key={a.id} style={{ display:'flex', alignItems:'flex-start', gap:SP.m, marginBottom:SP.m }}>
            <div style={{ width:5, height:5, borderRadius:3, background:t.brassMuted, marginTop:6, flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft }}>{formatActivityLine(a)}</div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', color:t.brassMuted, marginTop:2 }}>{timeAgo(a.created_at)}</div>
            </div>
          </div>
        ))}

        <div style={{ height:'0.5px', background:t.hairline, opacity:0.4, margin:`${SP.xl}px 0` }} />

        {/* Threads */}
        <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:t.soft, marginBottom:SP.m }}>Threads</div>
        {threads.length === 0 && !loading && (
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic' }}>No threads yet. Active circle members get a thread here.</div>
        )}
        {threads.map(th => (
          <FrostedSurface key={th.thread_id} onPress={() => openSheet(th)} radius={FR.md} style={{ marginBottom:4 }}>
            <div style={{ display:'flex', alignItems:'center', padding:`${SP.m}px ${SP.l}px`, gap:SP.m }}>
              <div style={{ width:34, height:34, borderRadius:17, background:`rgba(168,146,75,0.10)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Users size={16} color={t.brassMuted} strokeWidth={1.5} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:FF.display, fontSize:15, color:t.ink }}>{threadLabel(th)}</div>
                  {th.last_active && <div style={{ fontFamily:FF.label, fontSize:9, color:t.soft }}>{timeAgo(th.last_active)}</div>}
                </div>
                <div style={{ fontFamily:FF.body, fontSize:12, color:t.soft, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {th.last_message?.content || 'No messages yet'}
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
              <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:20, color:t.ink }}>{threadLabel(openThread)}</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:SP.xl, display:'flex', flexDirection:'column', gap:SP.m }}>
            {messages.length === 0 && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic' }}>No messages yet.</div>}
            {messages.map(m => {
              const isMe = m.sender_role === 'couple' || m.sender_role === 'bride';
              const body = m.body || m.content || '';
              return (
                <div key={m.id} style={{ display:'flex', justifyContent:isMe?'flex-end':'flex-start' }}>
                  <div style={{ maxWidth:'80%', background:isMe ? t.brass : (look==='E1'?'rgba(255,253,248,0.16)':'rgba(255,253,248,0.80)'), borderRadius:FR.md, padding:SP.m }}>
                    {!isMe && m.sender_name && <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:t.soft, marginBottom:3 }}>{m.sender_name}</div>}
                    <div style={{ fontFamily:FF.body, fontSize:14, color:isMe?'#1B1612':t.ink, lineHeight:1.5 }}>{body}</div>
                    <div style={{ fontFamily:FF.label, fontSize:9, color:isMe?'rgba(255,255,255,0.5)':t.soft, marginTop:4 }}>{timeAgo(m.created_at)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding:`${SP.m}px ${SP.l}px calc(${SP.l}px + env(safe-area-inset-bottom))`, ...FROST_SURFACE.composer, borderTop:`0.5px solid rgba(168,146,75,0.30)` }}>
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

      {/* Invite sheet */}
      {showInvite && <>
        <div onClick={() => setShowInvite(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }} />
        <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:201, background:t.pagePaper, borderRadius:'20px 20px 0 0', padding:`24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:SP.l }}>
            <div style={{ fontFamily:FF.display, fontStyle:'italic', fontSize:22, color:t.ink }}>Invite someone</div>
            <button onClick={() => setShowInvite(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, marginBottom:SP.xl }}>You can invite up to 3 people. They join via WhatsApp and can save to your Muse board.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:SP.m }}>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Their name</div>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder='Mom, Priya, Anjali…' style={{ width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.06)', border:`0.5px solid ${t.hairline}`, borderRadius:FR.md, fontFamily:FF.body, fontSize:15, color:t.ink, outline:'none', boxSizing:'border-box' as const }} />
            </div>
            <div>
              <div style={{ fontFamily:FF.label, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:t.soft, marginBottom:6 }}>Relationship</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setInviteRole(r.value)}
                    style={{ padding:'10px 14px', textAlign:'left', borderRadius:FR.md, border:`0.5px solid ${inviteRole === r.value ? t.brass : t.hairline}`, background:inviteRole === r.value ? `rgba(191,160,77,0.12)` : 'transparent', fontFamily:FF.body, fontSize:14, color:inviteRole === r.value ? t.brass : t.ink, cursor:'pointer' }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleInvite} disabled={inviting || !inviteName.trim()}
              style={{ marginTop:SP.s, padding:'14px 0', background:t.brass, border:'none', borderRadius:FR.md, fontFamily:FF.label, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1B1612', cursor:'pointer', opacity: (inviting || !inviteName.trim()) ? 0.5 : 1, transition:`opacity 200ms ${EASE}` }}>
              {inviting ? 'Generating link…' : 'Generate invite link'}
            </button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
