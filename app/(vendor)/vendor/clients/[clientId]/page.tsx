'use client';

// app/(vendor)/vendor/clients/[clientId]/page.tsx
// CLIENT DETAIL — single client view with linked leads and invoices.
//
// Data: GET /api/v2/vendor/clients/:vendorId/:clientId
// Type: VendorClientDetailResponse

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import { fetchVendorClient } from '../../../../../lib/frost-api/vendor';
import type { VendorClientDetailResponse } from '../../../../../lib/types/vendor';
import { ApiClientError } from '../../../../../lib/types/common';
import {
  COLORS, FONTS, RADIUS, BORDER_THIN,
  fmtINR, fmtINRShort, fmtDate, initials,
} from '../../../../../components/frost-vendor/tokens';
import {
  Card, Shimmer, StateBadge, SectionLabel, PageError, useVendorIdGuard,
} from '../../../../../components/frost-vendor/atoms';

export default function VendorClientDetailPage() {
  const router = useRouter();
  const params = useParams<{ clientId: string }>();
  const clientId = params?.clientId as string;
  const vendorId = useVendorIdGuard();

  const [data, setData] = useState<VendorClientDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!vendorId || !clientId) return;
    setLoading(true); setError(null);
    try {
      setData(await fetchVendorClient(vendorId, clientId));
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [vendorId, clientId]);

  useEffect(() => { load(); }, [load]);

  if (!vendorId) return null;

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Back */}
      <div style={{ padding: '16px 20px 0' }}>
        <button
          onClick={() => router.push('/vendor/clients')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: FONTS.jost, fontSize: 10, fontWeight: 300,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: COLORS.muted, padding: 0,
          }}
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Clients
        </button>
      </div>

      {loading && !data && (
        <div style={{ padding: '20px' }}>
          <Shimmer height={120} />
          <Shimmer height={80} marginTop={12} />
        </div>
      )}
      {error && <PageError message={error} onRetry={load} />}

      {data && (
        <>
          {/* Header */}
          <div style={{ padding: '16px 20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: COLORS.warm, border: '0.5px solid ' + COLORS.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.jost, fontSize: 14, color: COLORS.ink,
              }}>{initials(data.client.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 28, fontWeight: 300, color: COLORS.dark, lineHeight: 1.2 }}>
                  {data.client.name}
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6,
                  fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted,
                }}>
                  {data.client.phone && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Phone size={11} strokeWidth={1.5} />{data.client.phone}</span>
                  )}
                  {data.client.email && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Mail size={11} strokeWidth={1.5} />{data.client.email}</span>
                  )}
                </div>
              </div>
            </div>
            {data.client.notes && (
              <div style={{
                marginTop: 16, padding: 12,
                background: COLORS.warm, border: BORDER_THIN, borderRadius: RADIUS.sm,
                fontFamily: FONTS.dm300, fontSize: 13, color: COLORS.dark,
                fontStyle: 'italic', lineHeight: 1.6,
              }}>{data.client.notes}</div>
            )}
          </div>

          {/* Linked leads */}
          {data.leads.length > 0 && (
            <>
              <div style={{ padding: '0 20px' }}><SectionLabel>Leads</SectionLabel></div>
              <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.leads.map(l => (
                  <Card key={l.id} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <div>
                        <StateBadge state={l.state} />
                        <div style={{ fontFamily: FONTS.dm300, fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                          {l.wedding_date ? fmtDate(l.wedding_date) : 'No date'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: FONTS.cg300, fontSize: 16, color: COLORS.dark }}>
                          {l.budget_total ? fmtINRShort(l.budget_total) : '—'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Linked invoices */}
          {data.invoices.length > 0 && (
            <>
              <div style={{ padding: '24px 20px 0' }}><SectionLabel>Invoices</SectionLabel></div>
              <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.invoices.map(inv => {
                  const owed = inv.amount_total - inv.amount_paid;
                  return (
                    <Card key={inv.id} style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                          <StateBadge state={inv.state} />
                          <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted, marginTop: 6 }}>
                            Due {inv.due_date ? fmtDate(inv.due_date) : '—'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.dark }}>{fmtINR(inv.amount_total)}</div>
                          <div style={{ fontFamily: FONTS.dm300, fontSize: 11, color: owed > 0 ? COLORS.danger : COLORS.success, marginTop: 2 }}>
                            {owed > 0 ? fmtINR(owed) + ' owed' : 'Settled'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
