"use client";
// app/w/books/page.tsx — BOOKS, THE NINETEENTH ROOM. ROAD STEP 2b · R-38.10.
//
// ── THE ONE ROOM BORN INSIDE THE SHELL ──────────────────────────────────────
// Every other room in `app/w/` CROSSED: it existed under `/vendor`, kept its
// body, and gained the shell's layout (R-38.11/R-38.12 — the body is imported,
// never copied, so two list screens never become two homes). This one has no
// fallback twin and never had one. There is nothing under `/vendor/books`, so
// nothing to import and nothing to keep in step.
//
// That is why `BooksBody` reads CSS VARIABLES ONLY and carries none of the
// thirty colour literals F-38.22 captures in the slice tree. A crossed room
// inherited those literals and they were priced rather than swept; a new room
// that acquired them would be adding to a declared debt on purpose.
//
// ── THE TYPED PLANE, ALONE ON THIS BRANCH ───────────────────────────────────
// `GET /api/v2/vendor/money/books/:vendorId` reads public.invoices ⋈
// public.payment_schedules and public.expenses. The Invoices and Expenses rooms
// two tiles to the left still read `engine.records`, where F-39.3 measured zero
// money for all 28 vendors. Both facts are true at once and the room does not
// try to reconcile them — 2c crosses those two, reads and writes together.
//
// ── ZERO VERBS ──────────────────────────────────────────────────────────────
// The body mounts no interactive control at all. The masthead, bottom nav and
// ask dock are the SHELL's, on every room, and are not this room's to own —
// which is the boundary the read-only cell asserts against: the Books module and
// its import graph, never the rendered tree.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { BooksBody } from '@/components/worklist/BooksBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';

export default function ShellBooksPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.booksTitle}>
      <RoomBody><BooksBody vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
