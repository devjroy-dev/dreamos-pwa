'use client';
// app/vendor/list/[slice]/events.tsx — TDW_03 P1 · TDW_04 A3 (L-3 cross-chip)
// Events slice module. TDW_04 A3: each calendar row that names a binder wears
// the cross-chip — "Also a client · <client> · <stage>" — display-only, reading
// the binder the event itself points to (linked_binder_id, wired in this same
// delivery). Reads, never writes; tapping jumps to the twin's slice.
// DISCLOSED: an event with no linked_binder_id wears no chip — absence means
// "this row names no binder", never "no binder exists". SliceShell prints that
// blindness once per list, per ST-2's own rule.

import { roomHref } from '@/lib/worklist/rooms';
import { useCallback, useMemo } from 'react';
import { useEventsData, useCabinetData } from '@/hooks/vendor/useVendorData';
import { SliceScreen } from '@/components/vendor/slices/SliceShell';
import { fmtDate, type Row } from '@/components/vendor/slices/SliceRow';
import { API_BASE } from '@/lib/vendor/api/_base';
import type { VendorEvent } from '@/lib/vendor/types/vendor';
import type { CabinetBinder } from '@/lib/vendor/api/vendor';
import { useCrew, crewWords } from '@/lib/worklist/crew';
import { istPlusDaysISO } from '@/lib/vendor/istDay';

function baseRows(events: VendorEvent[]): Row[] {
  return events.map(ev => ({ id: ev.id, primary: ev.title, secondary: ev.kind, meta: fmtDate(ev.event_date)+(ev.event_time?` · ${ev.event_time.slice(0,5)}`:''), badge: ev.state, sortDate: ev.event_date, twinBinderId: ev.linked_binder_id ?? undefined, aiPrimer: `About ${ev.title} on ${fmtDate(ev.event_date)}: `, deletePrimer: `Delete the event "${ev.title}" on ${fmtDate(ev.event_date)} (id: ${ev.id}).`, detail: [{label:'Kind',value:ev.kind},{label:'Date',value:fmtDate(ev.event_date)},{label:'Time',value:ev.event_time?ev.event_time.slice(0,5):'—'},{label:'State',value:ev.state},{label:'Notes',value:ev.notes??'—',verbatim:true}] }));
}

function deleteRequest(sel: Row) {
  return { url: `${API_BASE}/api/v2/vendor/events/${sel.id}/cancel`, method: 'PATCH' };
}

export default function EventsSlice({ vendorId }: { vendorId: string }) {
  const cab = useCabinetData(vendorId);

  // Every binder this vendor holds, by id — the calendar row names one directly,
  // so no phone-key guessing is needed here (unlike the leads↔binder whisper).
  const binderById = useMemo(() => {
    const m = new Map<string, CabinetBinder>();
    for (const g of [cab.data?.clients, cab.data?.leads]) {
      for (const b of g ?? []) m.set(b.id, b);
    }
    return m;
  }, [cab.data]);

  // DESIGN-1 · STAGE 2: the crew rides every event row (REPORT.md E6), from the bands door's one read for a
  // year either side of today. A function the bands door does not know (a cancelled one) carries no crew line.
  const crew = useCrew(vendorId, istPlusDaysISO(-365), istPlusDaysISO(365));

  const toRows = useCallback((events: VendorEvent[]): Row[] => {
    return baseRows(events).map(r0 => {
      const row = crew.byEvent.has(r0.id) ? { ...r0, crew: { words: crewWords(crew.byEvent.get(r0.id)) } } : r0;
      const b = row.twinBinderId ? binderById.get(row.twinBinderId) : undefined;
      if (!b) return row;
      // DESIGN-1 · STAGE 2: the twin is named in two words; the client's name is the title's, and its stage and
      // money are the Clients row's. The row's one line of facts carries the crew now, which is what it is for.
      return { ...row, crossChip: 'Also a client', crossChipHref: roomHref('clients') };
    });
  }, [binderById, crew]);

  return <SliceScreen slice="events" vendorId={vendorId} useData={useEventsData} toRows={toRows} deleteRequest={deleteRequest} />;
}
