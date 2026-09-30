"use client";
// components/vendor/records/SlicePages.tsx · DESIGN-1 · STAGE 5b · THE INVOICE'S AND THE EVENT'S PAGES. The page's head
// is the record's name (the client's on an invoice, the title on an event), read from the room's own list read (the same
// cache row); the body is the room's own screen in its record mode (SliceRecord), so every act is the list's.
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useInvoicesData, useEventsData } from '@/v2/hooks/vendor/useVendorData';
import { RECORD } from '@/v2/lib/worklist/record';
import InvoicesSlice from '@/v2/app/vendor/(shell)/invoices/body';
import EventsSlice from '@/v2/app/vendor/(shell)/events/body';

export function InvoicePage({ vendorId, id }: { vendorId: string; id: string }) {
  const d = useInvoicesData(vendorId);
  const inv = (d.data ?? []).find((x) => x.id === id);
  return (
    <WorklistShell title={(inv && inv.client_name) || RECORD.invoices}>
      <InvoicesSlice vendorId={vendorId} recordId={id} />
    </WorklistShell>
  );
}

export function EventPage({ vendorId, id }: { vendorId: string; id: string }) {
  const d = useEventsData(vendorId);
  const ev = (d.data ?? []).find((x) => x.id === id);
  return (
    <WorklistShell title={(ev && ev.title) || RECORD.events}>
      <EventsSlice vendorId={vendorId} recordId={id} />
    </WorklistShell>
  );
}
