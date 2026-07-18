'use client';
// /vendor/studio/notes — Notes to Self. The owner's scratchpad.
// TDW_06 P7d (item 4): notes now also live on the business screen (the NOTES slice tab).
// This studio door STAYS (the studio hub's "Notes to Self" link keeps its home — no redirect,
// no orphaned link), and it renders the SAME shared NotesBody as the tab, so the two doors can
// never diverge: one reader (GET /api/v2/vendor/notes), one render, one source of truth.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { NotesBody } from '@/components/vendor/NotesBody';

export default function NotesPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: 'transparent' }} />;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'transparent' }}>
      <Header vendorName={session.name ?? null} />
      <NotesBody />
    </div>
  );
}
