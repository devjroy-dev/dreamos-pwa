'use client';
// app/vendor/list/[slice]/clients.tsx — TDW_03 P1
// Clients slice module. toRows + delete route verbatim from the monofile.
// P2 replaces this module's rendering with binder cards from the Cabinet
// (records plane) — the crown jewel. Until then: typed rows, unchanged.

import { useClientsData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtDate, type Row } from '@/components/vendor/slices/SliceRow';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { Client } from '@/lib/vendor/types/vendor';

function toRows(clients: Client[]): Row[] {
  return clients.map(c => ({ id: c.id, primary: c.name, secondary: c.phone ?? undefined, meta: c.email ?? undefined, phone: c.phone ?? undefined, aiPrimer: `What would you like to change about ${c.name}?`, deletePrimer: `Delete client ${c.name} (id: ${c.id}).`, detail: [{label:'Phone',value:c.phone??'—'},{label:'Email',value:c.email??'—'},{label:'Notes',value:c.notes??'—'},{label:'Added',value:fmtDate(c.created_at)}] }));
}

function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/clients/${sel.id}`, method: 'DELETE' };
}

export default function ClientsSlice({ vendorId }: { vendorId: string }) {
  return <SliceScreen slice="clients" vendorId={vendorId} useData={useClientsData} toRows={toRows} deleteRequest={deleteRequest} />;
}
