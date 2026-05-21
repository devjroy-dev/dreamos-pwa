'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, ChevronRight } from 'lucide-react';
import CanvasShell from '../../../../../../components/frost/CanvasShell';
import FrostedSurface from '../../../../../../components/frost/FrostedSurface';
import { useFrostMode } from '../../../../layout';
import { MUSE_LOOKS, FF, SP, FR } from '../../../../../../lib/frost/tokens';
import { fetchCircle, timeAgo, type CircleMember } from '../../../../../../lib/frost/journey';

function roleLabel(role: string): string {
  return role.replace(/_/g, ' ');
}

export default function MyPeople() {
  const router = useRouter();
  const { look } = useFrostMode(); const t = MUSE_LOOKS[look];
  const [members, setMembers]   = useState<CircleMember[]>([]);
  const [pending, setPending]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchCircle().then(c => {
      setMembers(c.members);
      setPending(c.pending_invites);
      setLoading(false);
    });
  }, []);

  return (
    <CanvasShell eyebrow="My People" backTo="/frost/canvas/journey">
      <div style={{ padding: `${SP.xl}px ${SP.xxl}px ${SP.huge}px`, userSelect: 'none' as const }}>
        <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 26, color: t.ink, marginBottom: SP.s }}>Your circle.</div>
        <div style={{ fontFamily: FF.body, fontSize: 13, color: t.soft, marginBottom: SP.xl, lineHeight: 1.6 }}>
          The people sharing this journey with you. Tap to see what they've contributed.
        </div>

        {loading && <div style={{ fontFamily: FF.display, fontSize: 32, color: t.brassMuted, letterSpacing: 6 }}>…</div>}

        {!loading && members.length === 0 && pending.length === 0 && (
          <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 18, color: t.soft, textAlign: 'center', paddingTop: 80 }}>
            No one in your circle yet. Invite someone from the Circle tab.
          </div>
        )}

        {/* Active members */}
        {members.length > 0 && (
          <div style={{ marginBottom: SP.xl }}>
            <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.m }}>Active</div>
            {members.map(m => {
              const phone = (m as any).invitee_phone || null;
              return (
                <div key={m.id}><FrostedSurface radius={FR.md} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: `${SP.l}px`, gap: SP.m }}>
                    {/* Avatar */}
                    <div style={{ width: 42, height: 42, borderRadius: 21, background: `rgba(191,160,77,0.12)`, border: `0.5px solid rgba(191,160,77,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: FF.display, fontSize: 18, color: t.brass }}>{(m.invitee_name[0] || '·').toUpperCase()}</span>
                    </div>

                    {/* Name + role — tappable */}
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push(`/frost/canvas/journey/circle/${m.id}`)}>
                      <div style={{ fontFamily: FF.body, fontSize: 15, color: t.ink }}>{m.invitee_name}</div>
                      <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.soft, marginTop: 2 }}>
                        {roleLabel(m.role)}
                        {m.last_active && <span style={{ color: t.brassMuted }}> · {timeAgo(m.last_active)}</span>}
                      </div>
                    </div>

                    {/* Action buttons — right side */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {phone ? (
                        <>
                          <a href={`https://wa.me/${phone.replace(/\+/g,'')}`} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ width: 34, height: 34, borderRadius: 17, background: `rgba(37,211,102,0.10)`, border: `0.5px solid rgba(37,211,102,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                            <MessageCircle size={15} color="#25D366" strokeWidth={1.5} />
                          </a>
                          <a href={`tel:${phone}`}
                            onClick={e => e.stopPropagation()}
                            style={{ width: 34, height: 34, borderRadius: 17, background: `rgba(191,160,77,0.10)`, border: `0.5px solid rgba(191,160,77,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                            <Phone size={15} color={t.brassMuted} strokeWidth={1.5} />
                          </a>
                        </>
                      ) : (
                        <div style={{ fontFamily: FF.label, fontSize: 8, letterSpacing: '0.1em', color: t.soft, alignSelf: 'center' }}>no phone yet</div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => router.push(`/frost/canvas/journey/circle/${m.id}`)}>
                        <ChevronRight size={16} color={t.hairline} strokeWidth={1.5} style={{ cursor: 'pointer' }} />
                      </div>
                    </div>
                  </div>
                </FrostedSurface></div>
              );
            })}
          </div>
        )}

        {/* Pending invites */}
        {pending.length > 0 && (
          <div>
            <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: t.soft, marginBottom: SP.m }}>Invited — waiting to join</div>
            {pending.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: SP.m, padding: `${SP.l}px 0`, borderBottom: `0.5px solid ${t.hairline}`, opacity: 0.6 }}>
                <div style={{ width: 42, height: 42, borderRadius: 21, border: `0.5px dashed ${t.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: FF.label, fontSize: 10, color: t.soft }}>?</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FF.body, fontSize: 15, color: t.soft }}>{p.invitee_name}</div>
                  <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.soft, marginTop: 2 }}>{roleLabel(p.role)} · invite pending</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CanvasShell>
  );
}
