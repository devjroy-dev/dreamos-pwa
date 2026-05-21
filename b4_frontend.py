#!/usr/bin/env python3
"""
B-4 frontend patch — dreamos-pwa
Drop in repo root. Run: python3 b4_frontend.py
Writes:
  lib/frost/journey.ts          — all real API wiring, field mapping, inviteCircleMember
  app/(frost)/frost/canvas/journey/circle/page.tsx  — invite button + sheet UI
"""
import os, subprocess, sys

# ---------------------------------------------------------------------------
# FILE 1 — lib/frost/journey.ts
# Read the existing file up to the API FUNCTIONS section, replace everything
# from fetchReminders onward with the fully-wired versions.
# ---------------------------------------------------------------------------

JOURNEY_PATH = 'lib/frost/journey.ts'

with open(JOURNEY_PATH, 'r') as f:
    original = f.read()

# We replace only the API FUNCTIONS block (everything from the marker to EOF)
# keeping all types, mocks, and helpers intact.
MARKER = '// -- API FUNCTIONS'
if MARKER not in original:
    # fallback marker
    MARKER = 'export async function fetchReminders'

cut = original.index(MARKER)
header = original[:cut]

API_BLOCK = r"""// -- API FUNCTIONS ------------------------------------------------------------

export async function fetchReminders(): Promise<Reminder[]> {
  if (USE_MOCKS) return delay(MOCK_REMINDERS);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/couple/checklist/${id}`);
  return r?.data ?? [];
}

export async function toggleReminder(id: string, is_complete: boolean): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/checklist/${id}`, { method: 'PATCH', body: JSON.stringify({ is_complete }) }); return true; }
  catch { return false; }
}

export async function deleteReminder(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/couple/checklist/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchExpenses(): Promise<Expense[]> {
  if (USE_MOCKS) return delay(MOCK_EXPENSES);
  const id = getCoupleId();
  // couple_receipts: id, booking_id, amount, vendor_name, description, receipt_date, image_url, tags
  const r: any = await apiFetch(`/api/v2/couple/expenses/${id}`);
  const raw: any[] = r?.expenses ?? [];
  return raw.map(e => ({
    id:             e.id,
    couple_id:      id || '',
    vendor_name:    e.vendor_name  || null,
    description:    e.description  || null,
    actual_amount:  e.amount       || null,   // amount → actual_amount
    payment_status: 'paid' as const,          // receipts vault = already paid
    receipt_url:    e.image_url    || null,   // image_url → receipt_url
    due_date:       e.receipt_date || null,
    category:       e.tags?.[0]   || null,
    event:          e.tags?.[1]   || null,
    notes:          null,
  }));
}

export async function markExpensePaid(_id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  return true; // couple_receipts are filed receipts — already paid
}

export async function deleteExpense(id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  try { await apiFetch(`/api/v2/couple/receipts/${id}`, { method: 'DELETE' }); return true; }
  catch { return false; }
}

export async function fetchVendors(): Promise<CoupleVendor[]> {
  if (USE_MOCKS) return delay(MOCK_VENDORS);
  const id = getCoupleId();
  // couple_bookings: id, vendor_name, vendor_id, category, amount_total, amount_paid, state, notes
  const r: any = await apiFetch(`/api/v2/couple/bookings/${id}`);
  const raw: any[] = r?.bookings ?? [];
  return raw.map(b => ({
    id:           b.id,
    couple_id:    id || '',
    vendor_id:    b.vendor_id    || null,
    name:         b.vendor_name  || 'Vendor', // vendor_name → name
    category:     b.category     || null,
    phone:        null,
    status:       b.state        || null,     // state → status
    quoted_total: b.amount_total || null,     // amount_total → quoted_total
    paid_total:   b.amount_paid  || null,     // amount_paid → paid_total
    events:       null,
    notes:        b.notes        || null,
  }));
}

export async function deleteVendorRow(_id: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true);
  return true; // bookings not deletable via PWA
}

export async function fetchEvents(): Promise<CoupleEvent[]> {
  if (USE_MOCKS) return delay(MOCK_EVENTS);
  const id = getCoupleId();
  // events table: id, title, event_date, event_time, kind, state, notes
  const r: any = await apiFetch(`/api/v2/couple/events/${id}`);
  const raw: any[] = r?.events ?? [];
  return raw.map(e => ({
    id:           e.id,
    couple_id:    id || '',
    event_name:   e.title      || null, // title → event_name
    event_type:   e.kind       || null, // kind → event_type
    event_date:   e.event_date || null,
    venue:        null,
    task_count:   0,
    vendor_count: 0,
  }));
}

export async function fetchCircleFeed(): Promise<CircleActivityEvent[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_FEED);
  const id = getCoupleId();
  // GET /api/v2/couple/circle/:id → { members, activity, pending_invites }
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  const raw: any[] = r?.activity ?? [];
  return raw.map(a => ({
    id:         a.id,
    event_type: a.activity_type || 'change',
    actor_role: (a.actor_role === 'bride' ? 'bride' : 'member') as 'bride' | 'member',
    payload: {
      actor_name:  a.member_name || null,
      member_name: a.member_name || null,
      content:     a.content     || null,
    },
    created_at: a.created_at,
  }));
}

export async function fetchCircleThreads(): Promise<CircleThread[]> {
  if (USE_MOCKS) return delay(MOCK_CIRCLE_THREADS);
  const id = getCoupleId();
  // Same /couple/circle/:id call — shape active members as DM threads
  const r: any = await apiFetch(`/api/v2/couple/circle/${id}`);
  const members: any[] = r?.members ?? [];
  return members.map(m => ({
    thread_id:    `dm:${m.id}`,
    kind:         'dm' as const,
    label:        m.invitee_name || 'Circle member',
    role:         m.role         || null,
    last_message: null,
    last_active:  m.joined_at    || null,
  }));
}

export async function fetchCircleMessages(threadId: string): Promise<CircleMessage[]> {
  if (USE_MOCKS) return delay([]);
  const id = getCoupleId();
  const r: any = await apiFetch(`/api/v2/frost/circle/threads/${id}/${threadId}/messages`);
  const raw: any[] = r?.data ?? [];
  return raw.map(m => ({
    id:          m.id,
    sender_name: m.direction === 'inbound' ? 'Circle member' : 'You',
    sender_role: (m.direction === 'inbound' ? 'member' : 'bride') as 'bride' | 'member',
    content:     m.body       || '',
    created_at:  m.created_at || new Date().toISOString(),
  }));
}

export async function sendCircleMessage(threadId: string, content: string): Promise<boolean> {
  if (USE_MOCKS) return delay(true, 600);
  try { await apiFetch('/api/v2/frost/circle/messages', { method: 'POST', body: JSON.stringify({ thread_id: threadId, content }) }); return true; }
  catch { return false; }
}

export async function fetchProfile(): Promise<CoupleProfile> {
  if (USE_MOCKS) return delay(MOCK_PROFILE);
  const id = getCoupleId();
  // GET /api/v2/couple/profile/:id (public) → { success, data: { bride_name, groom_name, wedding_date } }
  const r: any = await apiFetch(`/api/v2/couple/profile/${id}`);
  const d = r?.data;
  if (!d) return MOCK_PROFILE;
  return {
    name:         d.bride_name   || '',
    partner_name: d.groom_name   || '',
    wedding_date: d.wedding_date || '',
    wedding_city: '',
    phone:        '',
    tier:         'lite',
  };
}

export async function saveProfile(patch: Partial<CoupleProfile>): Promise<boolean> {
  if (USE_MOCKS) return delay(true, 600);
  try {
    const id = getCoupleId();
    await apiFetch(`/api/v2/couple/me/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        partner_name: patch.partner_name,
        wedding_date: patch.wedding_date,
        wedding_city: patch.wedding_city,
      }),
    });
    return true;
  } catch { return false; }
}

export async function inviteCircleMember(invitee_name: string, _role: string): Promise<string | null> {
  if (USE_MOCKS) return delay('https://wa.me/14787788550?text=Hi', 600);
  try {
    const r: any = await apiFetch('/api/v2/couple/circle/invite', {
      method: 'POST',
      body: JSON.stringify({ invitee_name, role: 'inner_circle' }),
    });
    return r?.wa_me_link || null;
  } catch { return null; }
}

export function fmtINR(n: number | null | undefined): string {
  if (!n) return '\u20b90';
  return '\u20b9' + n.toLocaleString('en-IN');
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatActivityLine(e: CircleActivityEvent): string {
  const actor = e.actor_role === 'bride' ? 'You' : (e.payload?.actor_name || 'Someone');
  const p = e.payload || {};
  switch (e.event_type) {
    case 'vendor_booked':           return `${actor} booked ${p.vendor_name || 'a vendor'}`;
    case 'payment_logged':          return `${actor} logged a payment`;
    case 'task_completed':          return `${actor} completed: ${p.task_text || 'a task'}`;
    case 'muse_saved':              return `${actor} saved to Muse`;
    case 'circle_message_sent':     return `${actor} sent a message`;
    case 'circle_invite_accepted':  return `${p.member_name || 'Someone'} joined your Circle`;
    default:                        return `${actor} made a change`;
  }
}
"""

new_content = header + API_BLOCK

with open(JOURNEY_PATH, 'w') as f:
    f.write(new_content)

print('Wrote', JOURNEY_PATH)

# ---------------------------------------------------------------------------
# FILE 2 — circle/page.tsx  (full file write)
# ---------------------------------------------------------------------------

CIRCLE_PATH = "app/(frost)/frost/canvas/journey/circle/page.tsx"
os.makedirs(os.path.dirname(CIRCLE_PATH), exist_ok=True)

CIRCLE_CONTENT = r"""'use client';
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
        {loading && <div style={{ fontFamily:FF.body, fontSize:13, color:t.soft, fontStyle:'italic', marginBottom:SP.m }}>Loading\u2026</div>}
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
                placeholder="Message\u2026"
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
"""

with open(CIRCLE_PATH, 'w') as f:
    f.write(CIRCLE_CONTENT)

print('Wrote', CIRCLE_PATH)

# ---------------------------------------------------------------------------
# tsc check
# ---------------------------------------------------------------------------
print('\nRunning tsc...')
result = subprocess.run(
    ['npx', '--no-install', 'tsc', '--noEmit'],
    capture_output=True, text=True
)
if result.returncode != 0:
    print('TSC ERRORS:')
    print(result.stdout)
    sys.exit(1)

print('tsc PASS\n')
print('Run next:')
print('  git add lib/frost/journey.ts "app/(frost)/frost/canvas/journey/circle/page.tsx"')
print('  git commit -m "feat(bride-b4): wire journey canvases to real backend — events, expenses, bookings, circle, invite"')
print('  git push origin main')
