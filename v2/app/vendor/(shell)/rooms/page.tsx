"use client";
// v2/app/vendor/(shell)/rooms/page.tsx · DESIGN-1 · THE LAYOUT SWITCH. /vendor/rooms is where today's app opens (main's
// manifest start_url and the front door, both shared and unchanged). In the v2 tree the app opens on Today, the first
// of the five tabs, and More has its own address, /vendor/more; so this address goes to Today.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomsToToday() {
  const router = useRouter();
  useEffect(() => { router.replace('/vendor/today'); }, [router]);
  return <div style={{ minHeight: '100dvh', background: 'var(--atelier-page-bg)' }} aria-busy="true" />;
}
