'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import CanvasShell from '../../../../../../../components/frost/CanvasShell';
import { useFrostMode } from '../../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../../lib/frost/tokens';
import { fetchMemberFeed, timeAgo, type CircleActivity, type MemberFeedData } from '../../../../../../../lib/frost/journey';

// Reuse ActivityCard logic inline (can't import from parent page)
function ActivityCard({ a, t, look }: { a: any; t: any; look: string }) {
  const actor = a.actor_role === 'bride' ? 'You' : (a.member_name || 'Someone');

  if (a.activity_type === 'save_added' && a.image_url) {
    return (
      <div style={{ marginBottom: SP.xl }}>
        <div style={{ width: '100%', borderRadius: FR.box, overflow: 'hidden', marginBottom: SP.s, background: t.cardFill }}>
          <img src={a.image_url} alt={a.caption || 'Save'} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 300 }} loading="lazy" />
        </div>
        {a.caption && (
          <div style={{ fontFamily: FF.body, fontSize: 14, color: t.ink, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 4 }}>"{a.caption}"</div>
        )}
        <div style={{ display: 'flex', gap: SP.m, flexWrap: 'wrap' as const, alignItems: 'center' }}>
          <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', color: t.soft }}>{timeAgo(a.created_at)}</div>
          {(a.aesthetic_tags || []).slice(0, 3).map((tag: string) => (
            <span key={tag} style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.12em', color: t.brassMuted, padding: '2px 6px', border: `0.5px solid rgba(191,160,77,0.25)`, borderRadius: FR.pill }}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (a.activity_type === 'comment' && a.content) {
    return (
      <div style={{ marginBottom: SP.l, paddingLeft: SP.l, borderLeft: `2px solid ${t.brass}` }}>
        <div style={{ fontFamily: FF.body, fontSize: 14, color: t.ink, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 4 }}>"{a.content}"</div>
        <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', color: t.soft }}>{timeAgo(a.created_at)}</div>
      </div>
    );
  }

  if (a.activity_type === 'joined') {
    return (
      <div style={{ marginBottom: SP.l, fontFamily: FF.body, fontSize: 13, color: t.soft, fontStyle: 'italic' }}>
        Joined your circle · <span style={{ fontFamily: FF.label, fontSize: 9 }}>{timeAgo(a.created_at)}</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: SP.m, display: 'flex', gap: SP.m }}>
      <div style={{ width: 5, height: 5, borderRadius: 3, background: t.hairline, marginTop: 6, flexShrink: 0 }} />
      <div style={{ fontFamily: FF.body, fontSize: 13, color: t.soft }}>{actor} · {a.activity_type.replace(/_/g, ' ')} · {timeAgo(a.created_at)}</div>
    </div>
  );
}

export default function MemberPage() {
  const params = useParams();
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [data, setData]       = useState<MemberFeedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberFeed(params.memberId as string).then(d => { setData(d); setLoading(false); });
  }, [params.memberId as string]);

  const member   = data?.member;
  const activity = data?.activity || [];
  const phone    = member?.invitee_phone || null;

  return (
    <CanvasShell eyebrow={member?.invitee_name || '…'} backTo="/frost/canvas/journey/circle">
      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.huge}px`, userSelect: 'none' as const }}>

        {loading && <div style={{ fontFamily: FF.display, fontSize: 32, color: t.brassMuted, letterSpacing: 6 }}>…</div>}

        {!loading && member && (
          <>
            {/* Member header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SP.xl }}>
              <div>
                <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 28, color: t.ink, lineHeight: 1.2 }}>{member.invitee_name}</div>
                <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: t.soft, marginTop: 4 }}>
                  {member.role.replace(/_/g, ' ')} · {member.status}
                </div>
              </div>

              {/* WhatsApp + Call buttons — only if phone known */}
              {phone && (
                <div style={{ display: 'flex', gap: SP.m }}>
                  <a href={`https://wa.me/${phone.replace(/\+/g,'')}`} target="_blank" rel="noopener noreferrer"
                    style={{ width: 40, height: 40, borderRadius: 20, background: `rgba(37,211,102,0.12)`, border: `0.5px solid rgba(37,211,102,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <MessageCircle size={18} color="#25D366" strokeWidth={1.5} />
                  </a>
                  <a href={`tel:${phone}`}
                    style={{ width: 40, height: 40, borderRadius: 20, background: `rgba(191,160,77,0.12)`, border: `0.5px solid rgba(191,160,77,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <Phone size={18} color={t.brassMuted} strokeWidth={1.5} />
                  </a>
                </div>
              )}
            </div>

            <div style={{ height: '0.5px', background: t.hairline, opacity: 0.4, marginBottom: SP.xl }} />

            {/* Their story */}
            <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.xl }}>
              {member.invitee_name}&apos;s contribution
            </div>

            {activity.length === 0 && (
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: t.soft, textAlign: 'center', paddingTop: 60 }}>
                Nothing yet. They'll leave their mark soon.
              </div>
            )}

            {activity.map(a => <div key={a.id}><ActivityCard a={a} t={t} look={look as string} /></div>)}
          </>
        )}

        {!loading && !member && (
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: t.soft, textAlign: 'center', paddingTop: 80 }}>
            Member not found.
          </div>
        )}
      </div>
    </CanvasShell>
  );
}
