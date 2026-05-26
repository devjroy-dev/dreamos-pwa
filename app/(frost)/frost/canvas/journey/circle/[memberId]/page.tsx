'use client';

// circle/[memberId]/page.tsx — Aubade-Nocturne skin. Logic unchanged.

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { AUBADE, FF } from '../../../../../../../lib/frost/tokens';
import { fetchMemberFeed, timeAgo } from '../../../../../../../lib/frost/journey';

function ActivityCard({ a }: { a: any }) {
  const actor = a.actor_role === 'bride' ? 'You' : (a.member_name || 'Someone');

  if (a.activity_type === 'save_added' && a.image_url) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ width: '100%', borderRadius: 2, overflow: 'hidden', marginBottom: 10, border: `1px solid ${AUBADE.line}` }}>
          <img src={a.image_url} alt={a.caption || 'Save'} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 320 }} loading="lazy" />
        </div>
        {a.caption && (
          <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.5, marginBottom: 5, fontFeatureSettings: '"opsz" 9' }}>"{a.caption}"</div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{timeAgo(a.created_at)}</div>
          {(a.aesthetic_tags || []).slice(0, 3).map((tag: string) => (
            <span key={tag} style={{ fontFamily: FF.mono, fontSize: 8, letterSpacing: '0.12em', color: AUBADE.inkMute, padding: '2px 7px', border: `1px solid ${AUBADE.line}`, borderRadius: 2 }}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (a.activity_type === 'comment' && a.content) {
    return (
      <div style={{ marginBottom: 20, paddingLeft: 14, borderLeft: `2px solid rgba(216,152,84,0.35)` }}>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.6, marginBottom: 4, fontFeatureSettings: '"opsz" 9' }}>"{a.content}"</div>
        <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{actor} · {timeAgo(a.created_at)}</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 14, fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute }}>
      {actor} · {a.activity_type?.replace(/_/g, ' ')} · {timeAgo(a.created_at)}
    </div>
  );
}

export default function MemberDetail() {
  const { memberId } = useParams<{ memberId: string }>();
  const router       = useRouter();
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    fetchMemberFeed(memberId)
      .then(r => { setData(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, [memberId]);

  const member   = data?.member;
  const activity = data?.activity || [];
  const phone    = member?.invitee_phone || null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>

      {/* Top bar */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas/journey/circle')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> {member?.invitee_name || 'Circle'}
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>
          {loading ? '…' : (member?.invitee_name || 'Member')}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 22px 48px' }}>

        {loading && (
          <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: AUBADE.inkMute }}>Loading…</div>
        )}

        {!loading && member && (
          <>
            {/* Member header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: AUBADE.ink, letterSpacing: '-0.02em', marginBottom: 4, fontFeatureSettings: '"opsz" 9' }}>{member.invitee_name}</div>
                <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.inkMute }}>{member.role?.replace(/_/g, ' ')} · {member.status || 'active'}</div>
              </div>
              {phone && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`https://wa.me/${phone.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <MessageCircle size={15} color="#25D366" strokeWidth={1.5} />
                  </a>
                  <a href={`tel:${phone}`} style={{ width: 36, height: 36, borderRadius: 2, background: 'rgba(216,152,84,0.10)', border: '1px solid rgba(216,152,84,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <Phone size={15} color={AUBADE.aubade} strokeWidth={1.5} />
                  </a>
                </div>
              )}
            </div>

            <div style={{ height: 1, background: AUBADE.line, marginBottom: 28 }} />

            {/* Contribution section */}
            <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 20 }}>
              {member.invitee_name}'s Contribution
            </div>

            {activity.length === 0 && (
              <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: AUBADE.inkMute, textAlign: 'center', paddingTop: 40, fontFeatureSettings: '"opsz" 9' }}>
                Nothing yet — they've just joined.
              </div>
            )}

            {activity.map((a: any, i: number) => <React.Fragment key={i}><ActivityCard a={a} /></React.Fragment>)}
          </>
        )}
      </div>
    </div>
  );
}
