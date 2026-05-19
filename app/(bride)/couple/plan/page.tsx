'use client';

// app/(bride)/couple/plan/page.tsx
// PLAN — Events | Bookings | Receipts
// Replaces the 3847-line legacy couple/plan/page.tsx with a clean typed surface.
// Data:
//   GET /api/v2/couple/events/:coupleId
//   GET /api/v2/couple/bookings/:coupleId
//   GET /api/v2/couple/receipts/:coupleId

import React, { useEffect, useState, useCallback } from 'react';
import { fetchCoupleEvents, fetchCoupleBookings, fetchCoupleReceipts } from '../../../../lib/frost-api/couple';
import type { CoupleEventsResponse, CoupleBookingsResponse, CoupleReceiptsResponse } from '../../../../lib/types/bride';
import { ApiClientError } from '../../../../lib/types/common';
import { COLORS, FONTS, RADIUS, BORDER_THIN, fmtINR, fmtINRShort, fmtDate, fmtTime } from '../../../../components/frost-bride/tokens';
import { Card, Shimmer, StateBadge, EmptyState, PageError, PageHeader, SectionLabel, useCoupleIdGuard } from '../../../../components/frost-bride/atoms';

type Tab = 'events' | 'bookings' | 'receipts';

export default function CouplePlanPage() {
  const coupleId = useCoupleIdGuard();
  const [tab, setTab] = useState<Tab>('events');
  const [events, setEvents] = useState<CoupleEventsResponse | null>(null);
  const [bookings, setBookings] = useState<CoupleBookingsResponse | null>(null);
  const [receipts, setReceipts] = useState<CoupleReceiptsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!coupleId) return;
    setLoading(true); setError(null);
    try {
      if (tab === 'events')   setEvents(await fetchCoupleEvents(coupleId));
      if (tab === 'bookings') setBookings(await fetchCoupleBookings(coupleId));
      if (tab === 'receipts') setReceipts(await fetchCoupleReceipts(coupleId));
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Failed to load.');
    } finally { setLoading(false); }
  }, [coupleId, tab]);

  useEffect(() => { load(); }, [load]);

  if (!coupleId) return null;

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader eyebrow="Journey" title="Plan" />

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: BORDER_THIN, margin: '0 20px', marginBottom: 16 }}>
        {(['events', 'bookings', 'receipts'] as Tab[]).map(t => {
          const active = tab === t;
          const label = t === 'events' ? 'Events' : t === 'bookings' ? 'Bookings' : 'Receipts';
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 0', position: 'relative',
                fontFamily: FONTS.jost, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: active ? COLORS.dark : COLORS.muted,
              }}
            >
              {label}
              {active && <span style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: COLORS.gold }} />}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && <><Shimmer height={80} /><Shimmer height={80} /><Shimmer height={80} /></>}
        {error && <PageError message={error} onRetry={load} />}

        {/* ── Events ── */}
        {tab === 'events' && events && (
          events.events.length === 0
            ? <EmptyState title="No events yet." hint="Your fittings, ceremonies, and reminders appear here." />
            : events.events.map(ev => (
              <Card key={ev.id} style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <StateBadge state={ev.state} />
                      <span style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted }}>{ev.kind}</span>
                    </div>
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 17, color: COLORS.dark }}>{ev.title}</div>
                    {ev.notes && <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 4, fontStyle: 'italic' }}>{ev.notes}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.dark }}>{fmtDate(ev.event_date)}</div>
                    {ev.event_time && <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{fmtTime(ev.event_time)}</div>}
                  </div>
                </div>
              </Card>
            ))
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && bookings && (
          <>
            <Card style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Total committed</div>
                  <div style={{ fontFamily: FONTS.cg300, fontSize: 28, color: COLORS.dark, lineHeight: 1 }}>{fmtINR(bookings.total_committed)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Paid</div>
                  <div style={{ fontFamily: FONTS.cg300, fontSize: 20, color: COLORS.success, lineHeight: 1 }}>{fmtINR(bookings.total_paid)}</div>
                </div>
              </div>
            </Card>
            {bookings.bookings.length === 0
              ? <EmptyState title="No vendors booked yet." />
              : bookings.bookings.map(b => (
                <Card key={b.id} style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <StateBadge state={b.state} />
                        {b.category && <span style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted }}>{b.category}</span>}
                      </div>
                      <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{b.vendor_name}</div>
                      {b.notes && <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{b.notes}</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{b.amount_total ? fmtINRShort(b.amount_total) : '—'}</div>
                      {b.amount_paid != null && b.amount_total != null && b.amount_paid < b.amount_total && (
                        <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.warn, marginTop: 2 }}>
                          {fmtINRShort(b.amount_total - b.amount_paid)} due
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            }
          </>
        )}

        {/* ── Receipts ── */}
        {tab === 'receipts' && receipts && (
          receipts.receipts.length === 0
            ? <EmptyState title="No receipts yet." hint="Scan receipts via WhatsApp to build your vault." />
            : receipts.receipts.map(r => (
              <Card key={r.id} style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>{r.label || 'Receipt'}</div>
                    {r.vendor_name && <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{r.vendor_name}</div>}
                    {r.receipt_date && <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{fmtDate(r.receipt_date)}</div>}
                  </div>
                  <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>{r.amount ? fmtINR(r.amount) : '—'}</div>
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
