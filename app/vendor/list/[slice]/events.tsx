'use client';
// app/vendor/list/[slice]/events.tsx — TDW_03 P1
// Events slice module. toRows + cancel route verbatim from the monofile.
// P4 adds swipe (right → done, left → cancel) and window chips.

import { useEventsData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtDate, type Row } from '@/components/vendor/slices/SliceRow';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { VendorEvent } from '@/lib/vendor/types/vendor';

function toRows(events: VendorEvent[]): Row[] {
  return events.map(ev => ({ id: ev.id, primary: ev.title, secondary: ev.kind, meta: fmtDate(ev.event_date)+(ev.event_time?` · ${ev.event_time.slice(0,5)}`:''), badge: ev.state, aiPrimer: `What would you like to change about the event "${ev.title}" on ${fmtDate(ev.event_date)}?`, deletePrimer: `Delete the event "${ev.title}" on ${fmtDate(ev.event_date)} (id: ${ev.id}).`, detail: [{label:'Kind',value:ev.kind},{label:'Date',value:fmtDate(ev.event_date)},{label:'Time',value:ev.event_time?ev.event_time.slice(0,5):'—'},{label:'State',value:ev.state},{label:'Notes',value:ev.notes??'—'}] }));
}

function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/events/${sel.id}/cancel`, method: 'PATCH' };
}

export default function EventsSlice({ vendorId }: { vendorId: string }) {
  return <SliceScreen slice="events" vendorId={vendorId} useData={useEventsData} toRows={toRows} deleteRequest={deleteRequest} />;
}
