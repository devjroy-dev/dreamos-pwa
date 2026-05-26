'use client';

// Circle — Aubade-Nocturne skin. All data logic unchanged.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, X, Phone, MessageCircle } from 'lucide-react';
import { AUBADE, FF, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchCircle, inviteCircleMember, timeAgo,
  type CircleData, type CircleActivity,
} from '../../../../../../lib/frost/journey';

const ROLES = [
  { value: 'partner',      label: 'Partner / Fiancé' },
  { value: 'family',       label: 'Family' },
  { value: 'inner_circle', label: 'Inner Circle (BFF, Maid of Honour)' },
] as const;

function ActivityCard({ a, onNavigate }: { a: CircleActivity & { [k: string]: any }; onNavigate: (path: string) => void }) {
  const actor = a.actor_role === 'bride' ? 'You' : (a.member_name || 'Someone');

  if (a.activity_type === 'save_added' && a.image_url) {
    return (
      <div style={{ marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div onClick={() => onNavigate('/frost/canvas/muse')} style={{ width: 68, height: 68, flexShrink: 0, borderRadius: 2, overflow: 'hidden', background: 'rgba(239,233,221,0.05)', border: `1px solid ${AUBADE.line}`, cursor: 'pointer' }}>
          <img src={a.image_url} alt={a.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
        </div>
        <div style={{ flex: 1, paddingTop: 2 }}>
          {a.caption && <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.5, marginBottom: 4, fontFeatureSettings: '"opsz" 9' }}>"{a.caption}"</div>}
          <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{actor} · {timeAgo(a.created_at)}</div>
          {a.aesthetic_tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 5 }}>
              {a.aesthetic_tags.slice(0, 3).map((tag: string) => (
                <span key={tag} style={{ fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.12em', color: AUBADE.inkMute, padding: '2px 6px', border: `1px solid ${AUBADE.line}`, borderRadius: 2 }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (a.activity_type === 'comment' && a.content) {
    return (
      <div style={{ marginBottom: 20, paddingLeft: 14, borderLeft: `2px solid rgba(216,152,84,0.4)` }}>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.6, marginBottom: 4, fontFeatureSettings: '"opsz" 9' }}>"{a.content}"</div>
        <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{actor} · {timeAgo(a.created_at)}</div>
      </div>
    );
  }

  if (a.activity_type === 'joined') {
    return (
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 2, background: 'rgba(216,152,84,0.10)', border: `1px solid rgba(216,152,84,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={12} color={AUBADE.aubade} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{a.member_name} joined · {timeAgo(a.created_at)}</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ width: 4, height: 4, borderRadius: 2, background: AUBADE.line, marginTop: 7, flexShrink: 0 }} />
      <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{actor} · {a.activity_type.replace(/_/g, ' ')} · {timeAgo(a.created_at)}</div>
    </div>
  );
}

export default function JourneyCircle() {
  const router = useRouter();
  const [circle,      setCircle]      = useState<CircleData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [showInvite,  setShowInvite]  = useState(false);
  const [inviteName,  setInviteName]  = useState('');
  const [inviteRole,  setInviteRole]  = useState<'partner'|'family'|'inner_circle'>('family');
  const [inviting,    setInviting]    = useState(false);
  const [toast,       setToast]       = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const load = useCallback(async () => {
    const c = await fetchCircle();
    setCircle(c); setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleInvite = useCallback(async () => {
    if (!inviteName.trim()) return;
    setInviting(true);
    try {
      const result = await inviteCircleMember({ invitee_name: inviteName.trim(), role: inviteRole });
      setShowInvite(false); setInviteName(''); setInviteRole('family');
      if (typeof navigator !== 'undefined' && navigator.share) {
        try { await navigator.share({ url: result.wa_me_link, title: `Join ${inviteName.trim()}'s wedding circle` }); }
        catch { await navigator.clipboard.writeText(result.wa_me_link); showToast('Invite link copied.'); }
      } else {
        await navigator.clipboard.writeText(result.wa_me_link);
        showToast('Invite link copied.');
      }
      await load();
    } catch (e: any) {
      if (e?.message?.includes('limit') || e?.message?.includes('full')) showToast('Circle full — max 3 members.');
      else showToast('Could not generate invite. Try again.');
    }
    setInviting(false);
  }, [inviteName, inviteRole, load]);

  const members  = circle?.members           || [];
  const activity = circle?.activity          || [];
  const pending  = circle?.pending_invites   || [];

  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top) + 70px)', left: '50%', transform: 'translateX(-50%)', background: AUBADE.ink, color: AUBADE.paper, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: 2, zIndex: 400, pointerEvents: 'none', whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      {/* Top bar */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas/sanctuary')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> Sanctuary
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>Circle</div>
        <button onClick={() => setShowInvite(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.aubade, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <Plus size={12} strokeWidth={1.5} /> Invite
        </button>
      </div>

      {/* Scroll area */}
      <div className="frost-scroll" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 22px 40px' }}>

        {/* Members */}
        {members.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 14 }}>Your people</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {members.map(m => (
                <button key={m.id} onClick={() => router.push(`/frost/canvas/journey/circle/${m.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 2, border: `1px solid ${AUBADE.line}`, background: 'transparent', fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkSoft, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', fontFeatureSettings: '"opsz" 9' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 1, background: 'rgba(216,152,84,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: FF.mono, fontSize: 8, color: AUBADE.aubade }}>{(m.invitee_name[0] || '·').toUpperCase()}</span>
                  </div>
                  {m.invitee_name}
                </button>
              ))}
              {pending.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 2, border: `1px dashed ${AUBADE.line}`, fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkMute, opacity: 0.6, fontFeatureSettings: '"opsz" 9' }}>
                  {p.invitee_name} <span style={{ fontFamily: FF.mono, fontSize: 7.5, letterSpacing: '0.12em' }}>invited</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 1, background: AUBADE.line, marginBottom: 28 }} />

        {/* Activity feed */}
        <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 20 }}>The journey</div>

        {loading && <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: AUBADE.inkMute }}>Loading…</div>}

        {!loading && activity.length === 0 && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: AUBADE.ink, marginBottom: 12, fontFeatureSettings: '"opsz" 9' }}>Your circle is just beginning.</div>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.6, fontFeatureSettings: '"opsz" 9' }}>When your people save to Muse, leave notes, or you add events — it all appears here.</div>
          </div>
        )}

        {activity.map(a => <ActivityCard key={(a as any).id} a={a as any} onNavigate={(path) => router.push(path)} />)}

        {!loading && members.length === 0 && activity.length === 0 && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button onClick={() => setShowInvite(true)} style={{ padding: '12px 24px', background: 'rgba(216,152,84,0.18)', border: `1px solid rgba(216,152,84,0.45)`, borderRadius: 2, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.aubade, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              Invite your first person
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Invite sheet */}
      {showInvite && <>
        <div onClick={() => setShowInvite(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(3,3,5,0.65)', zIndex: 200 }} />
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: AUBADE.paper2, borderTop: `1px solid ${AUBADE.lineStrong}`, padding: `24px 22px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>Add to your circle</div>
            <button onClick={() => setShowInvite(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: AUBADE.inkMute, fontSize: 18 }}>×</button>
          </div>
          <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: AUBADE.inkSoft, marginBottom: 24, lineHeight: 1.6, fontFeatureSettings: '"opsz" 9' }}>They join via WhatsApp and become part of your journey.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 8 }}>Their name</div>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Mom, Priya, Anjali…"
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(239,233,221,0.05)', border: `1px solid ${AUBADE.line}`, borderRadius: 2, fontFamily: FF.aubade, fontStyle: 'italic', fontSize: 16, color: AUBADE.ink, outline: 'none', boxSizing: 'border-box', caretColor: AUBADE.aubade, fontFeatureSettings: '"opsz" 9' } as React.CSSProperties} />
            </div>
            <div>
              <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 8 }}>Relationship</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setInviteRole(r.value)}
                    style={{ padding: '11px 14px', textAlign: 'left', borderRadius: 2, border: `1px solid ${inviteRole === r.value ? 'rgba(216,152,84,0.55)' : AUBADE.line}`, background: inviteRole === r.value ? 'rgba(216,152,84,0.12)' : 'transparent', fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: inviteRole === r.value ? AUBADE.aubade : AUBADE.inkSoft, cursor: 'pointer', fontFeatureSettings: '"opsz" 9' }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleInvite} disabled={inviting || !inviteName.trim()}
              style={{ marginTop: 4, padding: '14px 0', background: 'rgba(216,152,84,0.18)', border: `1px solid rgba(216,152,84,0.45)`, borderRadius: 2, fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.aubade, cursor: 'pointer', opacity: (inviting || !inviteName.trim()) ? 0.45 : 1, transition: `opacity 200ms ${EASE}`, WebkitTapHighlightColor: 'transparent' }}>
              {inviting ? 'Generating link…' : 'Generate invite link'}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
