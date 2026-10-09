"use client";
// v2/app/vendor/(shell)/trends/page.tsx · CE-47 · PRO · P3 · THE TREND ROOM. Replaces INS's "Launching soon." shell page at
// this address (the hub row, its href and its door are INS's; this file is the room behind them), and `trends` leaves
// PREVIEW_KEYS in the same package (v2/lib/solutions/routes.ts).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { TrendsScreen } from './screen';

export default function TrendsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return (<WorklistShell title="Trend room"><RoomBody><TrendsScreen vendorId={session.id} /></RoomBody></WorklistShell>);
}
