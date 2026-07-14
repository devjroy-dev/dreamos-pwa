'use client';
// app/vendor/list/[slice]/page.tsx — TDW_03 P1
// Thin router: slice → module. Session guard verbatim from the monofile.
// All slice logic lives in the colocated modules + components/vendor/slices/.

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import type { ListSlice } from '@/hooks/vendor/useLastSlice';
import { A, F } from '@/components/vendor/slices/SliceRow';
import LeadsSlice from './leads';
import ClientsSlice from './clients';
import InvoicesSlice from './invoices';
import ExpensesSlice from './expenses';
import EventsSlice from './events';

const MODULES: Record<ListSlice, (props: { vendorId: string }) => React.JSX.Element> = {
  leads: LeadsSlice,
  clients: ClientsSlice,
  invoices: InvoicesSlice,
  expenses: ExpensesSlice,
  events: EventsSlice,
};

export default function SlicePage() {
  const router = useRouter();
  const params = useParams<{ slice: string }>();
  const slice  = params?.slice as ListSlice;
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (!['clients','leads','invoices','events','expenses'].includes(slice))
    return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily: F.script, fontStyle: 'italic', color: A.inkMute }}>Unknown.</div>
    </div>;
  const Mod = MODULES[slice];
  return <Mod vendorId={session.id} />;
}
