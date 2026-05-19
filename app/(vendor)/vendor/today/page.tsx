'use client';

// app/(vendor)/vendor/today/page.tsx
// TODAY — vendor dashboard. The morning briefing.
//
// Data: GET /api/v2/vendor/today/:vendorId
// Type: VendorTodayResponse
//
// Sections, top to bottom:
//   1. Greeting + identity strip (name from session)
//   2. Needs attention — overdue invoices, new leads, events today
//   3. This week — upcoming events strip
//   4. Money snapshot — outstanding total + counts
//   5. Footer — open leads count, "ask ✦ AI" nudge

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Inbox, TrendingUp, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { fetchVendorToday } from '../../../../lib/frost-api/vendor';
import type { VendorTodayResponse } from '../../../../lib/types/vendor';
import { ApiClientError } from '../../../../lib/types/common';
import {
  COLORS, FONTS, RADIUS, BORDER_THIN,
  fmtINR, fmtINRShort, fmtDate, fmtTime,
} from '../../../../components/frost-vendor/tokens';
import {
  Card, Shimmer, EmptyState, SectionLabel, PageError, useVendorIdGuard,
} from '../../../../components/frost-vendor/atoms';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function VendorTodayPage() {
  const router = useRouter();
  const vendorId = useVendorIdGuard();

  const [data, setData] = useState<VendorTodayResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true); setError(null);
    try {
      const res = await fetchVendorToday(vendorId);
      setData(res);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => { load(); }, [load]);

  if (!vendorId) return null;

  // ── Loading skeleton ──
  if (loading && !data) {
    return (
      <div style={{ padding: '24px 20px' }}>
        <Shimmer height={32} width="60%" />
        <Shimmer height={14} width="40%" marginTop={10} />
        <Shimmer height={120} marginTop={24} />
        <Shimmer height={100} marginTop={12} />
        <Shimmer height={100} marginTop={12} />
      </div>
    );
  }

  if (error) return <PageError message={error} onRetry={load} />;
  if (!data) return null;

  const { vendor, needs_attention, this_week, money_snapshot, open_leads_count } = data;
  const attentionCount =
    needs_attention.overdue_invoices.length +
    needs_attention.new_leads.length +
    needs_attention.events_today.length;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* ── Greeting ── */}
      <div style={{ padding: '24px 20px 12px' }}>
        <div style={{
          fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: COLORS.muted, marginBottom: 8,
        }}>{getGreeting()}</div>
        <div style={{
          fontFamily: FONTS.cg300, fontSize: 32, fontWeight: 300,
          color: COLORS.dark, lineHeight: 1.15,
        }}>{vendor.name || 'Maker'}</div>
        <div style={{
          fontFamily: FONTS.dm300, fontSize: 13, fontWeight: 300,
          color: COLORS.muted, marginTop: 6,
        }}>
          {attentionCount === 0
            ? 'All clear. Quiet day ahead.'
            : `${attentionCount} ${attentionCount === 1 ? 'moment' : 'moments'} for today.`}
        </div>
      </div>

      {/* ── Needs attention ── */}
      <div style={{ padding: '12px 20px 0' }}>
        <SectionLabel>Needs attention</SectionLabel>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }}>
        {needs_attention.overdue_invoices.map(inv => (
          <Card key={inv.id} onClick={() => router.push('/vendor/money')} style={{
            borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: COLORS.danger,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <AlertCircle size={14} strokeWidth={1.5} color={COLORS.danger} />
                  <span style={{
                    fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: COLORS.danger,
                  }}>Overdue</span>
                </div>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>{inv.client_name}</div>
                <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
                  Due {fmtDate(inv.due_date)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 20, color: COLORS.dark }}>{fmtINR(inv.amount_owed)}</div>
                <ChevronRight size={16} strokeWidth={1.5} color={COLORS.muted} style={{ marginTop: 6, marginLeft: 'auto', display: 'block' }} />
              </div>
            </div>
          </Card>
        ))}

        {needs_attention.new_leads.map(lead => (
          <Card key={lead.id} onClick={() => router.push('/vendor/leads')}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Inbox size={16} strokeWidth={1.5} color={COLORS.gold} style={{ marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: COLORS.gold, marginBottom: 4,
                }}>New lead</div>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>
                  {lead.name || 'Unnamed enquiry'}
                </div>
                <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
                  {lead.wedding_date ? fmtDate(lead.wedding_date) : 'No date yet'}
                  {lead.budget_total ? ' · ' + fmtINRShort(lead.budget_total) : ''}
                </div>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} color={COLORS.muted} style={{ marginTop: 4 }} />
            </div>
          </Card>
        ))}

        {needs_attention.events_today.map(ev => (
          <Card key={ev.id} onClick={() => router.push('/vendor/today')} style={{
            background: COLORS.warm, borderColor: COLORS.gold + '44',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Calendar size={16} strokeWidth={1.5} color={COLORS.gold} style={{ marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: COLORS.gold, marginBottom: 4,
                }}>Today · {ev.kind}</div>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>{ev.title}</div>
                {ev.event_time && (
                  <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 4 }}>
                    {fmtTime(ev.event_time)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {attentionCount === 0 && (
          <EmptyState title="All quiet." hint="Nothing demanding your attention right now." />
        )}
      </div>

      {/* ── This week ── */}
      {this_week.length > 0 && (
        <>
          <div style={{ padding: '24px 20px 0' }}>
            <SectionLabel>This week</SectionLabel>
          </div>
          <div style={{
            display: 'flex', gap: 10, padding: '0 20px',
            overflowX: 'auto', scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}>
            {this_week.map(ev => (
              <div key={ev.id} style={{
                minWidth: 200, scrollSnapAlign: 'start',
                background: COLORS.card, border: BORDER_THIN, borderRadius: RADIUS.md,
                padding: 14,
              }}>
                <div style={{
                  fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: COLORS.muted, marginBottom: 6,
                }}>{ev.kind}</div>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark, marginBottom: 4 }}>
                  {ev.title}
                </div>
                <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted }}>
                  {fmtDate(ev.event_date)}{ev.event_time ? ' · ' + fmtTime(ev.event_time) : ''}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Money snapshot ── */}
      <div style={{ padding: '24px 20px 0' }}>
        <SectionLabel>Money snapshot</SectionLabel>
      </div>
      <div style={{ padding: '0 20px' }}>
        <Card onClick={() => router.push('/vendor/money')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{
                fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: COLORS.muted, marginBottom: 6,
              }}>Outstanding</div>
              <div style={{ fontFamily: FONTS.cg300, fontSize: 32, fontWeight: 300, color: COLORS.dark, lineHeight: 1 }}>
                {fmtINR(money_snapshot.total_outstanding)}
              </div>
            </div>
            <TrendingUp size={20} strokeWidth={1.5} color={COLORS.gold} />
          </div>
          <div style={{
            display: 'flex', gap: 16, marginTop: 16, paddingTop: 16,
            borderTop: BORDER_THIN,
            fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted,
          }}>
            <span>{money_snapshot.unpaid_count} unpaid</span>
            <span>·</span>
            <span>{money_snapshot.advance_paid_count} on advance</span>
          </div>
        </Card>
      </div>

      {/* ── Leads count + AI nudge ── */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          display: 'flex', gap: 10,
        }}>
          <Card onClick={() => router.push('/vendor/leads')} style={{ flex: 1, padding: 14 }}>
            <div style={{
              fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: COLORS.muted, marginBottom: 4,
            }}>Open leads</div>
            <div style={{ fontFamily: FONTS.cg300, fontSize: 24, color: COLORS.dark }}>
              {open_leads_count}
            </div>
          </Card>

          <Card onClick={() => router.push('/vendor/dreamai')} style={{
            flex: 1, padding: 14, background: COLORS.dark,
            border: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={12} strokeWidth={1.5} color={COLORS.gold} />
              <span style={{
                fontFamily: FONTS.jost, fontSize: 9, fontWeight: 400,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: COLORS.gold,
              }}>Ask ✦ AI</span>
            </div>
            <div style={{ fontFamily: FONTS.cg300, fontSize: 14, color: COLORS.bg, fontStyle: 'italic' }}>
              {`"What's on for today?"`}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
