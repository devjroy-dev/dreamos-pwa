'use client';

// app/(bride)/couple/circle/page.tsx
// CIRCLE — members, activity feed, invite form.
// Data:
//   GET  /api/v2/couple/circle/:coupleId
//   POST /api/v2/couple/circle/invite

import React, { useEffect, useState, useCallback } from 'react';
import { UserPlus, X } from 'lucide-react';
import { fetchCoupleCircle, inviteCircleMember } from '../../../../lib/frost-api/couple';
import type { CoupleCircleResponse } from '../../../../lib/types/bride';
import { ApiClientError } from '../../../../lib/types/common';
import { COLORS, FONTS, RADIUS, BORDER_THIN, EASE, fmtRelative, initials } from '../../../../components/frost-bride/tokens';
import { Card, Shimmer, EmptyState, PageError, PageHeader, SectionLabel, useCoupleIdGuard } from '../../../../components/frost-bride/atoms';

export default function CoupleCirclePage() {
  const coupleId = useCoupleIdGuard();
  const [data, setData] = useState<CoupleCircleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');

  const load = useCallback(async () => {
    if (!coupleId) return;
    setLoading(true); setError(null);
    try { setData(await fetchCoupleCircle(coupleId)); }
    catch (e) { setError(e instanceof ApiClientError ? e.message : 'Failed to load.'); }
    finally { setLoading(false); }
  }, [coupleId]);

  useEffect(() => { load(); }, [load]);

  const handleInvite = async () => {
    if (!coupleId || !inviteName.trim() || !invitePhone.trim()) return;
    setInviting(true);
    try {
      const res = await inviteCircleMember({
        couple_id: coupleId,
        name: inviteName.trim(),
        phone: invitePhone.trim(),
        role: inviteRole.trim() || null,
      });
      setInviteSuccess(`Invite sent! Token: ${res.token}`);
      setInviteName(''); setInvitePhone(''); setInviteRole('');
      setTimeout(() => { setInviteSuccess(''); setInviteOpen(false); load(); }, 2500);
    } catch (e) {
      setInviteSuccess('Failed to send invite.');
    } finally { setInviting(false); }
  };

  if (!coupleId) return null;

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        eyebrow="Your people"
        title="Circle"
        subtitle={data ? `${data.members.length} members` : undefined}
        right={
          <button
            onClick={() => setInviteOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.dark, color: COLORS.bg, border: 'none', borderRadius: RADIUS.pill, padding: '8px 14px', fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            <UserPlus size={12} strokeWidth={1.5} /> Invite
          </button>
        }
      />

      {/* Invite sheet */}
      {inviteOpen && (
        <>
          <div onClick={() => setInviteOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: COLORS.card, borderRadius: '20px 20px 0 0', padding: '24px 20px calc(24px + env(safe-area-inset-bottom))', zIndex: 201 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: FONTS.cg300, fontSize: 22, color: COLORS.dark }}>Invite to Circle</div>
              <button onClick={() => setInviteOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} strokeWidth={1.5} color={COLORS.muted} /></button>
            </div>
            {[
              { label: 'Name', val: inviteName, set: setInviteName, placeholder: 'Ananya' },
              { label: 'Phone', val: invitePhone, set: setInvitePhone, placeholder: '+91 98765 00001' },
              { label: 'Role (optional)', val: inviteRole, set: setInviteRole, placeholder: 'sister, mom, friend…' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>{f.label}</div>
                <input
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '12px 14px', border: BORDER_THIN, borderRadius: RADIUS.md, fontFamily: FONTS.dm300, fontSize: 14, color: COLORS.dark, background: COLORS.bg, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            {inviteSuccess && <div style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.success, marginBottom: 12 }}>{inviteSuccess}</div>}
            <button
              onClick={handleInvite}
              disabled={inviting || !inviteName.trim() || !invitePhone.trim()}
              style={{ width: '100%', padding: 14, background: COLORS.dark, color: COLORS.bg, border: 'none', borderRadius: RADIUS.md, fontFamily: FONTS.jost, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', opacity: inviting ? 0.6 : 1 }}
            >{inviting ? 'Sending…' : 'Send WhatsApp invite'}</button>
          </div>
        </>
      )}

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && !data && <><Shimmer height={70} /><Shimmer height={70} /></>}
        {error && <PageError message={error} onRetry={load} />}

        {/* Members */}
        {data && (
          <>
            <SectionLabel>Members</SectionLabel>
            {data.members.length === 0
              ? <EmptyState title="No one in your Circle yet." hint="Invite the people who matter to your wedding." />
              : data.members.map(m => (
                <Card key={m.id} style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: COLORS.warm, border: BORDER_THIN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.jost, fontSize: 11, color: COLORS.ink, flexShrink: 0 }}>
                      {initials(m.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{m.name}</div>
                      <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 2 }}>
                        {m.role ? m.role + ' · ' : ''}{m.phone}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            }

            {/* Activity */}
            {data.activity.length > 0 && (
              <>
                <div style={{ marginTop: 8 }}><SectionLabel>Activity</SectionLabel></div>
                {data.activity.map(a => (
                  <div key={a.id} style={{ padding: '10px 14px', background: COLORS.card, border: BORDER_THIN, borderRadius: RADIUS.md }}>
                    <div style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.dark }}>
                      <span style={{ fontWeight: 400 }}>{a.member_name}</span> {a.action}
                    </div>
                    {a.content && <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 2, fontStyle: 'italic' }}>{a.content}</div>}
                    <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{fmtRelative(a.created_at)}</div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
