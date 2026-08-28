// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock’s screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/list/[slice]/page.tsx — TDW_03 P1
// Thin router: slice → module. Session guard verbatim from the monofile.
// All slice logic lives in the colocated modules + components/vendor/slices/.

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import type { DoorSlice } from '@/hooks/vendor/useLastSlice';
import { A, F } from '@/components/vendor/slices/SliceRow';
import LeadsSlice from './leads';
import ClientsSlice from './clients';
import InvoicesSlice from './invoices';
import ExpensesSlice from './expenses';
import EventsSlice from './events';
import NotesSlice from './notes';

const MODULES: Record<DoorSlice, (props: { vendorId: string }) => React.JSX.Element> = {
  leads: LeadsSlice,
  clients: ClientsSlice,
  invoices: InvoicesSlice,
  expenses: ExpensesSlice,
  events: EventsSlice,
  notes: NotesSlice,
};

export default function SlicePage() {
  const router = useRouter();
  const params = useParams<{ slice: string }>();
  const slice  = params?.slice as DoorSlice;
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (!['clients','leads','invoices','events','expenses','notes'].includes(slice))
    return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily: F.script, color: A.inkMute }}>Unknown.</div>
    </div>;
  const Mod = MODULES[slice];
  // ── M-FINISH S2 · R-38.11 · THE MASTHEAD MOUNTS HERE, NOT INSIDE THE FAMILY ──
  // `SliceShell` and the `notes` module each carried their own <Header>. Both are mounted
  // from TWO trees now — this fallback and /w/<room> — so a masthead inside them is a
  // masthead inside the shell, which is the two-mastheads defect R-38.1 removed.
  //
  // IT IS NOT GATED BY A PROP, IT IS MOUNTED AT THE ROUTE, and S1 paid to learn the
  // difference: a conditional still BUNDLES Header into the shell's chunk with its drawer
  // and its banned bytes, and the audit's R-38.1 cell reddens on those hrefs. Only not
  // importing it keeps it out. This route is the only place it is wanted, so this is where
  // it is imported. One mount covers all six modules, including `notes`.
  //
  // ⚠ THIS ROUTE IS AN UNTOUCHED FALLBACK NOW. Nothing in the shell links to it; the six
  // room tiles point at /w/<room> (lib/worklist/rooms.ts). It survives on disk for main and
  // for any wire address already in the world, and it retires at cutover, not before.
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <Mod vendorId={session.id} />
    </div>
  );
}
