'use client';

// People — Aubade-Nocturne skin. Logic unchanged.

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { AUBADE, FF } from '../../../../../../lib/frost/tokens';
import { fetchCircle, timeAgo, type CircleMember } from '../../../../../../lib/frost/journey';

function roleLabel(r: string) { return r.replace(/_/g, ' '); }

export default function MyPeople() {
  const router = useRouter();
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCircle().then(c => { setMembers(c.members); setPending(c.pending_invites); setLoading(false); });
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: `linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>

      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas/sanctuary')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> Sanctuary
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>People</div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 22px 40px' }}>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: AUBADE.ink, marginBottom: 8, letterSpacing: '-0.02em', fontFeatureSettings: '"opsz" 9' }}>Your circle.</div>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, marginBottom: 32, lineHeight: 1.6, fontFeatureSettings: '"opsz" 9' }}>The people sharing this journey with you.</div>

        {loading && <div style={{ fontFamily: FF.mono, fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: AUBADE.inkMute }}>Loading…</div>}

        {!loading && members.length === 0 && pending.length === 0 && (
          <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: AUBADE.inkMute, textAlign: 'center', paddingTop: 80, fontFeatureSettings: '"opsz" 9' }}>
            No one in your circle yet.<br />Invite someone from Circle.
          </div>
        )}

        {members.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 16 }}>Active</div>
            {members.map(m => {
              const phone = (m as any).invitee_phone || null;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: `1px solid ${AUBADE.line}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, flexShrink: 0, background: 'rgba(216,152,84,0.12)', border: '1px solid rgba(216,152,84,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: FF.aubade, fontSize: 18, color: AUBADE.aubade }}>{(m.invitee_name[0] || '·').toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => router.push(`/frost/canvas/journey/circle/${m.id}`)}>
                    <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: AUBADE.ink, marginBottom: 3, fontFeatureSettings: '"opsz" 9' }}>{m.invitee_name}</div>
                    <div style={{ fontFamily: FF.mono, fontSize: 8.5, fontWeight: 300, letterSpacing: '0.16em', textTransform: 'uppercase', color: AUBADE.inkMute }}>
                      {roleLabel(m.role)}{m.last_active && <span style={{ color: AUBADE.inkSoft }}> · {timeAgo(m.last_active)}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {phone ? (
                      <>
                        <a href={`https://wa.me/${phone.replace(/\+/g,'')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ width: 32, height: 32, borderRadius: 2, background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                          <MessageCircle size={14} color="#25D366" strokeWidth={1.5} />
                        </a>
                        <a href={`tel:${phone}`} onClick={e => e.stopPropagation()} style={{ width: 32, height: 32, borderRadius: 2, background: 'rgba(216,152,84,0.10)', border: '1px solid rgba(216,152,84,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                          <Phone size={14} color={AUBADE.aubade} strokeWidth={1.5} />
                        </a>
                      </>
                    ) : <div style={{ fontFamily: FF.mono, fontSize: 8, color: AUBADE.inkMute }}>no phone</div>}
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push(`/frost/canvas/journey/circle/${m.id}`)}>
                      <ChevronRight size={14} color={AUBADE.inkMute} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pending.length > 0 && (
          <div>
            <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 16 }}>Invited — waiting</div>
            {pending.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: `1px solid ${AUBADE.line}`, opacity: 0.55 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, flexShrink: 0, border: `1px dashed ${AUBADE.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: FF.mono, fontSize: 10, color: AUBADE.inkMute }}>?</span>
                </div>
                <div>
                  <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: AUBADE.inkSoft, fontFeatureSettings: '"opsz" 9' }}>{p.invitee_name}</div>
                  <div style={{ fontFamily: FF.mono, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AUBADE.inkMute, marginTop: 3 }}>{roleLabel(p.role)} · pending</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
