'use client';

// app/(bride)/couple/today/page.tsx
// BRIDE TODAY — countdown, events, muse preview, circle activity.
// Data: GET /api/v2/couple/today/:coupleId

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Heart, Users, Sparkles, ChevronRight } from 'lucide-react';
import { fetchCoupleToday } from '../../../../lib/frost-api/couple';
import type { CoupleTodayResponse } from '../../../../lib/types/bride';
import { ApiClientError } from '../../../../lib/types/common';
import { COLORS, FONTS, RADIUS, BORDER_THIN, EASE, fmtDate, fmtTime, fmtRelative, daysLabel } from '../../../../components/frost-bride/tokens';
import { Card, Shimmer, EmptyState, SectionLabel, PageError, useCoupleIdGuard } from '../../../../components/frost-bride/atoms';

export default function CoupleTodayPage() {
  const router = useRouter();
  const coupleId = useCoupleIdGuard();
  const [data, setData] = useState<CoupleTodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!coupleId) return;
    setLoading(true); setError(null);
    try { setData(await fetchCoupleToday(coupleId)); }
    catch (e) { setError(e instanceof ApiClientError ? e.message : 'Failed to load.'); }
    finally { setLoading(false); }
  }, [coupleId]);

  useEffect(() => { load(); }, [load]);

  if (!coupleId) return null;
  if (loading && !data) return (
    <div style={{ padding: '24px 20px' }}>
      <Shimmer height={80} width="70%" />
      <Shimmer height={120} marginTop={24} />
      <Shimmer height={100} marginTop={12} />
    </div>
  );
  if (error) return <PageError message={error} onRetry={load} />;
  if (!data) return null;

  const { couple, upcoming_events, recent_muse, circle_activity, bookings_count, muse_count } = data;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* ── Greeting + countdown ── */}
      <div style={{ padding: '28px 20px 16px' }}>
        <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8 }}>
          Your day is coming
        </div>
        <div style={{ fontFamily: FONTS.cg300, fontSize: 36, color: COLORS.dark, lineHeight: 1.1 }}>
          {couple.name || 'Dreamer'}
        </div>

        {couple.days_to_wedding !== null && (
          <div style={{
            marginTop: 16, display: 'inline-flex', alignItems: 'baseline', gap: 8,
            background: couple.days_to_wedding <= 7 ? COLORS.gold : COLORS.warm,
            padding: '8px 16px', borderRadius: RADIUS.pill,
            border: couple.days_to_wedding <= 7 ? 'none' : BORDER_THIN,
          }}>
            <span style={{
              fontFamily: FONTS.cg300, fontSize: 36,
              color: couple.days_to_wedding <= 7 ? COLORS.ink : COLORS.dark,
              lineHeight: 1,
            }}>{couple.days_to_wedding}</span>
            <span style={{
              fontFamily: FONTS.jost, fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: couple.days_to_wedding <= 7 ? COLORS.ink : COLORS.muted,
            }}>days</span>
            {couple.wedding_date && (
              <span style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted }}>
                · {fmtDate(couple.wedding_date)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Upcoming events ── */}
      {upcoming_events.length > 0 && (
        <>
          <div style={{ padding: '8px 20px 0' }}><SectionLabel>Upcoming</SectionLabel></div>
          <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {upcoming_events.map(ev => (
              <div key={ev.id} style={{ minWidth: 180, scrollSnapAlign: 'start', background: COLORS.card, border: BORDER_THIN, borderRadius: RADIUS.md, padding: 14, flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>{ev.kind}</div>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark, marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted }}>
                  {fmtDate(ev.event_date)}{ev.event_time ? ' · ' + fmtTime(ev.event_time) : ''}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Stats row ── */}
      <div style={{ padding: '24px 20px 0', display: 'flex', gap: 10 }}>
        <Card onClick={() => router.push('/couple/plan')} style={{ flex: 1, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Calendar size={14} strokeWidth={1.5} color={COLORS.gold} />
            <span style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted }}>Bookings</span>
          </div>
          <div style={{ fontFamily: FONTS.cg300, fontSize: 24, color: COLORS.dark }}>{bookings_count}</div>
        </Card>
        <Card onClick={() => router.push('/couple/muse')} style={{ flex: 1, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Heart size={14} strokeWidth={1.5} color={COLORS.gold} />
            <span style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted }}>Muse saves</span>
          </div>
          <div style={{ fontFamily: FONTS.cg300, fontSize: 24, color: COLORS.dark }}>{muse_count}</div>
        </Card>
      </div>

      {/* ── Recent muse ── */}
      {recent_muse.length > 0 && (
        <>
          <div style={{ padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <SectionLabel>Recent saves</SectionLabel>
            <button onClick={() => router.push('/couple/muse')} style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.gold, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px' }}>
              See all
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {recent_muse.map(m => (
              <div key={m.id} onClick={() => router.push('/couple/muse')} style={{ width: 100, height: 100, borderRadius: RADIUS.md, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', background: COLORS.warm, border: BORDER_THIN, position: 'relative' }}>
                <img src={m.image_url} alt={m.tags[0] || 'muse'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Circle activity ── */}
      {circle_activity.length > 0 && (
        <>
          <div style={{ padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <SectionLabel>Circle</SectionLabel>
            <button onClick={() => router.push('/couple/circle')} style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.gold, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px' }}>
              View
            </button>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {circle_activity.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: COLORS.card, border: BORDER_THIN, borderRadius: RADIUS.md }}>
                <Users size={14} strokeWidth={1.5} color={COLORS.muted} style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.dark }}>{a.member_name} </span>
                  <span style={{ fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.muted }}>{a.action}</span>
                  <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{fmtRelative(a.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── DreamAi nudge ── */}
      <div style={{ padding: '24px 20px 0' }}>
        <Card onClick={() => router.push('/couple/dreamai')} style={{ background: COLORS.dark, border: 'none', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Sparkles size={13} strokeWidth={1.5} color={COLORS.gold} />
            <span style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.gold }}>Ask ✦ AI</span>
          </div>
          <div style={{ fontFamily: FONTS.cg300, fontSize: 14, color: COLORS.bg, fontStyle: 'italic' }}>
            {`"How many days until my wedding?"`}
          </div>
        </Card>
      </div>
    </div>
  );
}
