"use client";
// v2/app/vendor/(shell)/supplies/page.tsx · CE-47 · PRO · P1 · SUPPLIES. Replaces INS's "Launching soon." shell page at
// this address (the hub row, its href and its door are INS's).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { SuppliesScreen } from './screen';

export default function SuppliesPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return (<WorklistShell title="Supplies"><RoomBody><SuppliesScreen vendorId={session.id} /></RoomBody></WorklistShell>);
}
