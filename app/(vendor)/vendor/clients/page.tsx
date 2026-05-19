'use client';

// app/(vendor)/vendor/clients/page.tsx
// CLIENTS — roster. Tap row to drill into client detail.
//
// Data:  GET /api/v2/vendor/clients/:vendorId
// Type:  VendorClientsResponse

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, ChevronRight } from 'lucide-react';
import { fetchVendorClients } from '../../../../lib/frost-api/vendor';
import type { VendorClientsResponse } from '../../../../lib/types/vendor';
import { ApiClientError } from '../../../../lib/types/common';
import { COLORS, FONTS, fmtRelative, initials } from '../../../../components/frost-vendor/tokens';
import {
  Card, Shimmer, EmptyState, PageError, PageHeader, useVendorIdGuard,
} from '../../../../components/frost-vendor/atoms';

export default function VendorClientsPage() {
  const router = useRouter();
  const vendorId = useVendorIdGuard();
  const [data, setData] = useState<VendorClientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true); setError(null);
    try {
      setData(await fetchVendorClients(vendorId));
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => { load(); }, [load]);

  if (!vendorId) return null;

  return (
    <div style={{ paddingBottom: 24 }}>
      <PageHeader
        eyebrow="Roster"
        title="Clients"
        subtitle={data ? `${data.total} ${data.total === 1 ? 'client' : 'clients'}` : undefined}
      />

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && !data && (<><Shimmer height={72} /><Shimmer height={72} /><Shimmer height={72} /></>)}
        {error && <PageError message={error} onRetry={load} />}
        {data && data.clients.length === 0 && (
          <EmptyState title="No clients yet." hint="Once a lead becomes a booking, the couple lands here." />
        )}
        {data && data.clients.map(c => (
          <Card key={c.id} onClick={() => router.push(`/vendor/clients/${c.id}`)} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: COLORS.warm, border: '0.5px solid ' + COLORS.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.jost, fontSize: 11, color: COLORS.ink,
                flexShrink: 0,
              }}>{initials(c.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.cg300, fontSize: 17, color: COLORS.dark, marginBottom: 2 }}>{c.name}</div>
                <div style={{
                  display: 'flex', gap: 12,
                  fontFamily: FONTS.dm300, fontSize: 11, color: COLORS.muted,
                }}>
                  {c.phone && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Phone size={10} strokeWidth={1.5} />{c.phone}</span>}
                  {c.email && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}><Mail size={10} strokeWidth={1.5} />{c.email}</span>}
                </div>
              </div>
              <ChevronRight size={16} strokeWidth={1.5} color={COLORS.muted} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
