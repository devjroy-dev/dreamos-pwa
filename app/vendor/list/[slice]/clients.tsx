'use client';
// app/vendor/list/[slice]/clients.tsx — TDW_03 P2 · binder cards
// The Clients slice reads the records plane raw: cabinet.clients, the same
// population the P1 adapter flattened — presentation upgraded to the story.
// Chrome stays SliceShell (Door + search + FAB); the list is BinderCards via
// renderList. AddSheet behavior unchanged until P5. No DetailSheet here —
// the card expands in place.

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCabinetData, useLeadsData } from '@/hooks/vendor/useVendorData';
import { phoneKey } from '@/lib/vendor/cabinet';
import { SliceShell } from '@/components/vendor/slices/SliceShell';
import { BinderCard } from '@/components/vendor/slices/BinderCard';
import { Masthead } from '@/components/vendor/slices/Masthead'; // TDW_04 A3
import { deriveClients } from '@/lib/vendor/derive'; // TDW_04 A3: THE derivation
import { A, F } from '@/components/vendor/slices/SliceRow';
import { AddSheet } from '@/components/vendor/AddSheet';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import type { ToastKind } from '@/hooks/vendor/useToast';

export default function ClientsSlice({ vendorId }: { vendorId: string }) {
  const router = useRouter();
  const cab = useCabinetData(vendorId);
  const typedLeads = useLeadsData(vendorId); // R1(b): the typed plane, for the cross-chip
  const leadByPhone = useMemo(() => {
    const m = new Map<string, { state: string }>();
    for (const l of typedLeads.data ?? []) {
      const k = phoneKey(l.phone);
      if (k && !m.has(k)) m.set(k, { state: l.state });
    }
    return m;
  }, [typedLeads.data]);
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const { toast, show: showToast } = useToast();

  const binders = useMemo(() => {
    const all = cab.data?.clients ?? [];
    if (!query.trim()) return all;
    const q = query.trim().toLowerCase();
    return all.filter(b =>
      (b.client ?? '').toLowerCase().includes(q) ||
      (b.stage ?? '').toLowerCase().includes(q) ||
      (b.note ?? '').toLowerCase().includes(q));
  }, [cab.data, query]);

  const empty = !cab.loading && !cab.error && binders.length === 0;

  return (
    <SliceShell
      slice="clients"
      vendorName={cab.data?.vendor?.name ?? null}
      onBack={() => router.back()}
      query={query}
      setQuery={setQuery}
      loading={cab.loading}
      error={cab.error}
      rows={[]}
      onSelect={() => {}}
      onAdd={() => setAddOpen(true)}
      // TDW_04 A3 (P5/ST-4): this slice drives SliceShell directly (binder cards,
      // not rows), so it composes its own masthead — from the SAME derivation the
      // hub and the other mastheads read.
      masthead={<Masthead eyebrow="Active engagements" value={deriveClients(cab.data).count}
        sub={deriveClients(cab.data).count === 1 ? 'from your binders · 1 client' : 'from your binders · client-stage binders'} />}
      renderList={
        <>
          {empty && (
            <div style={{
              padding: '40px 24px', textAlign: 'center',
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16,
              color: A.inkMute, lineHeight: 1.6,
            }}>
              {query
                ? <>Nothing matching <span style={{ color: A.brassWarm }}>&ldquo;{query}&rdquo;</span></>
                : <>Your client stories live here.<br/>
                    <span style={{ color: A.brassWarm }}>Tell your assistant about a client — even just a name — and a binder opens.</span></>}
            </div>
          )}
          {binders.map(b => (
            <BinderCard
              key={b.id}
              binder={b}
              onChanged={cab.refresh}
              onToast={(msg, kind, opts) => showToast(msg, kind, opts)}
              crossLead={(() => { const k = phoneKey(b.phone); return k ? leadByPhone.get(k) : undefined; })()}
            />
          ))}
        </>
      }
    >
      <Toast toast={toast} />
      <AddSheet
        open={addOpen}
        slice="clients"
        onClose={() => setAddOpen(false)}
        onToast={(msg: string, kind?: ToastKind) => showToast(msg, kind)}
        existing={null}
        existingId={undefined}
      />
    </SliceShell>
  );
}
