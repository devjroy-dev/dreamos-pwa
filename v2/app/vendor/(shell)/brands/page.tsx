"use client";
// v2/app/vendor/(shell)/brands/page.tsx · CE-47 · PRO · P3 · BRAND COLLABORATIONS. Replaces INS's "Launching soon." shell
// page at this address (the hub row, its href and its door are INS's; this file is the room behind them), and `brands`
// leaves PREVIEW_KEYS in the same package (v2/lib/solutions/routes.ts).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { BrandsScreen } from './screen';

export default function BrandsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return (<WorklistShell title="Brand collaborations"><RoomBody><BrandsScreen vendorId={session.id} /></RoomBody></WorklistShell>);
}
