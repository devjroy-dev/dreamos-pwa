'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, X, Phone, MessageCircle } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR, EASE } from '../../../../../../lib/frost/tokens';
import {
  fetchCircle, inviteCircleMember, timeAgo,
  type CircleData, type CircleActivity,
} from '../../../../../../lib/frost/journey';

const ROLES = [
  { value: 'partner',      label: 'Partner / Fiancé' },
  { value: 'family',       label: 'Family' },
  { value: 'inner_circle', label: 'Inner Circle (BFF, Maid of Honour)' },
] as const;

// ── Activity card renderer ────────────────────────────────────────────────────
function ActivityCard({ a, t, look, onNavigate }: { a: any; t: any; look: string; onNavigate: (path: string) => void }) {
  const actor = a.actor_role === 'bride' ? 'You' : (a.member_name || 'Someone');

  if (a.activity_type === 'save_added' && a.image_url) {
    return (
      <div style={{ marginBottom: SP.l, display: 'flex', gap: SP.m, alignItems: 'flex-start' }}>
        {/* Thumbnail — tappable, navigates to Muse */}
        <div
          onClick={() => onNavigate('/frost/canvas/muse')}
          style={{ width: 72, height: 72, flexShrink: 0, borderRadius: FR.md, overflow: 'hidden', background: t.cardFill, cursor: 'pointer' }}
        >
          <img
            src={a.image_url}
            alt={a.caption || 'Muse save'}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        {/* Text */}
        <div style={{ flex: 1, paddingTop: 2 }}>
          {a.caption && (
            <div style={{ fontFamily: FF.body, fontSize: 13, color: t.ink, lineHeight: 1.5, marginBottom: 4, fontStyle: 'italic' }}>
              "{a.caption}"
            </div>
          )}
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', color: t.soft, marginBottom: a.aesthetic_tags?.length ? 4 : 0 }}>
            {actor} · {timeAgo(a.created_at)}
          </div>
          {a.aesthetic_tags && a.aesthetic_tags.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
              {a.aesthetic_tags.slice(0, 3).map((tag: string) => (
                <span key={tag} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.12em', color: t.brassMuted, padding: '2px 6px', border: `0.5px solid rgba(191,160,77,0.25)`, borderRadius: FR.pill }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (a.activity_type === 'comment' && a.content) {
    return (
      <div style={{ marginBottom: SP.l, paddingLeft: SP.l, borderLeft: `2px solid ${t.brass}` }}>
        <div style={{ fontFamily: FF.body, fontSize: 14, color: t.ink, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 4 }}>
          "{a.content}"
        </div>
        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', color: t.soft }}>
          {actor} · {timeAgo(a.created_at)}
        </div>
      </div>
    );
  }

  if (a.activity_type === 'joined') {
    return (
      <div style={{ marginBottom: SP.l, display: 'flex', alignItems: 'center', gap: SP.m }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: `rgba(191,160,77,0.12)`, border: `0.5px solid rgba(191,160,77,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={12} color={t.brassMuted} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: t.soft }}>
          {a.member_name} joined your circle · <span style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.1em' }}>{timeAgo(a.created_at)}</span>
        </div>
      </div>
    );
  }

  // Generic activity
  return (
    <div style={{ marginBottom: SP.m, display: 'flex', alignItems: 'flex-start', gap: SP.m }}>
      <div style={{ width: 5, height: 5, borderRadius: 3, background: t.hairline, marginTop: 6, flexShrink: 0 }} />
      <div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: t.soft }}>{actor} · {a.activity_type.replace(/_/g, ' ')}</div>
        <div style={{ fontFamily: FF.label, fontSize: 9, color: t.brassMuted, marginTop: 2 }}>{timeAgo(a.created_at)}</div>
      </div>
    </div>
  );
}

export default function JourneyCircle() {
  const router = useRouter();
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [circle, setCircle]   = useState<CircleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'partner'|'family'|'inner_circle'>('family');
  const [inviting, setInviting]     = useState(false);
  const [toast, setToast]           = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const load = useCallback(async () => {
    const c = await fetchCircle();
    setCircle(c); setLoading(false);
    // Scroll to bottom so newest is visible
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
      if (e?.message?.includes('limit') || e?.message?.includes('full')) {
        showToast('Circle full — max 3 members.');
      } else {
        showToast('Could not generate invite. Try again.');
      }
    }
    setInviting(false);
  }, [inviteName, inviteRole, load]);

  const members  = circle?.members  || [];
  const activity = circle?.activity || [];
  const pending  = circle?.pending_invites || [];

  return (
    <CanvasShell eyebrow="Circle" backTo="/frost/canvas/sanctuary">
      {toast && (
        <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top) + 70px)', left: '50%', transform: 'translateX(-50%)', background: t.ink, color: t.pagePaper, fontFamily: FF.label, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '8px 18px', borderRadius: 20, zIndex: 400, pointerEvents: 'none', whiteSpace: 'nowrap' }}>{toast}</div>
      )}

      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.huge}px`, userSelect: 'none' as const }}>

        {/* My People row — tappable chips */}
        {members.length > 0 && (
          <div style={{ marginBottom: SP.xl }}>
            <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.m }}>Your people</div>
            <div style={{ display: 'flex', gap: SP.m, flexWrap: 'wrap' as const }}>
              {members.map(m => (
                <button key={m.id} onClick={() => router.push(`/frost/canvas/journey/circle/${m.id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: FR.pill, border: `0.5px solid ${t.hairline}`, background: 'transparent', fontFamily: FF.body, fontSize: 13, color: t.ink, cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: `rgba(191,160,77,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: FF.label, fontSize: 8, color: t.brassMuted }}>{(m.invitee_name[0] || '·').toUpperCase()}</span>
                  </div>
                  {m.invitee_name}
                </button>
              ))}
              {pending.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: FR.pill, border: `0.5px dashed ${t.hairline}`, fontFamily: FF.body, fontSize: 13, color: t.soft, opacity: 0.6 }}>
                  {p.invitee_name} <span style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.1em', color: t.soft }}>invited</span>
                </div>
              ))}
              <button onClick={() => setShowInvite(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: FR.pill, border: `0.5px solid rgba(191,160,77,0.3)`, background: 'transparent', fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.brassMuted, cursor: 'pointer' }}>
                <Plus size={11} color={t.brassMuted} strokeWidth={1.5} />Add
              </button>
            </div>
          </div>
        )}

        <div style={{ height: '0.5px', background: t.hairline, opacity: 0.4, marginBottom: SP.xl }} />

        {/* The scrapbook feed */}
        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.xl }}>The journey</div>

        {loading && (
          <div style={{ fontFamily: FF.display, fontSize: 32, color: t.brassMuted, letterSpacing: 6 }}>…</div>
        )}

        {!loading && activity.length === 0 && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 22, color: t.ink, marginBottom: SP.m }}>
              Your circle is just beginning.
            </div>
            <div style={{ fontFamily: FF.body, fontSize: 14, color: t.soft, lineHeight: 1.6 }}>
              When your people save to Muse, leave notes, or you add bookings and events — it all appears here. The story of your wedding, told in the moments that made it.
            </div>
          </div>
        )}

        {activity.map(a => (
          <div key={a.id}><ActivityCard a={a} t={t} look={look as string} onNavigate={(path) => router.push(path)} /></div>
        ))}

        <div ref={bottomRef} />

        {/* Invite first person prompt */}
        {!loading && members.length === 0 && activity.length === 0 && (
          <div style={{ marginTop: SP.xl, textAlign: 'center' }}>
            <button onClick={() => setShowInvite(true)}
              style={{ padding: '12px 24px', background: t.brass, border: 'none', borderRadius: FR.pill, fontFamily: FF.label, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B1612', cursor: 'pointer' }}>
              Invite your first person
            </button>
          </div>
        )}
      </div>

      {/* Invite sheet */}
      {showInvite && <>
        <div onClick={() => setShowInvite(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201, background: t.pagePaper, borderRadius: '20px 20px 0 0', padding: `24px 24px calc(24px + env(safe-area-inset-bottom))` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SP.l }}>
            <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 22, color: t.ink }}>Add to your circle</div>
            <button onClick={() => setShowInvite(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={t.soft} strokeWidth={1.5} /></button>
          </div>
          <div style={{ fontFamily: FF.body, fontSize: 13, color: t.soft, marginBottom: SP.xl }}>
            They join via WhatsApp and become part of your journey — their saves, notes, and moments all flow into your circle.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.m }}>
            <div>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.soft, marginBottom: 6 }}>Their name</div>
              <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder='Mom, Priya, Anjali…'
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: `0.5px solid ${t.hairline}`, borderRadius: FR.md, fontFamily: FF.body, fontSize: 15, color: t.ink, outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.soft, marginBottom: 6 }}>Relationship</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setInviteRole(r.value)}
                    style={{ padding: '10px 14px', textAlign: 'left', borderRadius: FR.md, border: `0.5px solid ${inviteRole === r.value ? t.brass : t.hairline}`, background: inviteRole === r.value ? `rgba(191,160,77,0.12)` : 'transparent', fontFamily: FF.body, fontSize: 14, color: inviteRole === r.value ? t.brass : t.ink, cursor: 'pointer' }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleInvite} disabled={inviting || !inviteName.trim()}
              style={{ marginTop: SP.s, padding: '14px 0', background: t.brass, border: 'none', borderRadius: FR.md, fontFamily: FF.label, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#1B1612', cursor: 'pointer', opacity: (inviting || !inviteName.trim()) ? 0.5 : 1, transition: `opacity 200ms ${EASE}` }}>
              {inviting ? 'Generating link…' : 'Generate invite link'}
            </button>
          </div>
        </div>
      </>}
    </CanvasShell>
  );
}
