"use client";
// v2/app/vendor/(shell)/invoices/[id]/page.tsx · DESIGN-1 · STAGE 5b · records as pages: an invoice, a full page
// (components/vendor/records/SlicePages.tsx). The id is the route's own segment (useParams, Next 16's client hook).
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { InvoicePage } from '@/v2/components/vendor/records/SlicePages';

export default function RecordRoute() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session || !params?.id) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <InvoicePage vendorId={session.id} id={decodeURIComponent(String(params.id))} />;
}
