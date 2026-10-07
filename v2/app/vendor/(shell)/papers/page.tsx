"use client";
// v2/app/vendor/(shell)/papers/page.tsx · CE-47 · PRO · P1 · BUSINESS PAPERS. Replaces INS's "Launching soon." shell
// page at this address (the hub row, its href and its door are INS's; this file is the room behind them).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { PapersScreen } from './screen';

export default function PapersPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return (<WorklistShell title="Business papers"><RoomBody><PapersScreen vendorId={session.id} /></RoomBody></WorklistShell>);
}
