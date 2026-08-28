'use client';
// app/vendor/calendar/page.tsx — THE SURVIVING FALLBACK ROUTE.
//
// ── §4-2 · CALENDAR CROSSED, AND THIS FILE IS WHAT STAYED BEHIND ────────────
// The room the vendor reaches from the tile is `/w/calendar` now. This route is not deleted
// and must not be: R-38.11's "nothing deletes" holds until Phase 7 retires
// `app/vendor/layout.tsx` with the whole old tree, and a vendor on a stale bookmark, a
// shared link or a service-worker cache still lands here.
//
// ── IT OWNS THE CHROME, AND THAT IS THE WHOLE REASON THE FILE SPLIT ─────────
// `<Header/>` is mounted HERE and imported HERE, and it appears in no file the shell's
// chunk can reach. `SliceShell` proved at S2 that keeping the import and writing
// `{chrome && <Header/>}` renders correctly and still ships the old masthead — drawer,
// /vendor rows, banned bytes and all — into every crossed room's bundle. **A conditional
// does not remove a module from a bundle; only not importing it does.**
//
// THE SHAPE IS `app/vendor/list/[slice]/page.tsx`'s, DELIBERATELY AND NOT BY COINCIDENCE:
// the same wrapper, the same `session.name ?? null`, the same body-as-child. One precedent,
// one shape, so the seven crossings after this one have nothing new to invent and a reader
// comparing two fallback routes finds no difference to explain.
//
// ── THE MOUNT CENSUS DOES NOT SHRINK FOR THIS CROSSING ─────────────────────
// Correct rather than a miss, and stated here because a later reader will check. The six
// list rooms gave up two mounts and their fallback route took one back: net minus one, one
// file leaving the census. Calendar's body and its fallback route were ONE FILE, so the
// mount moved WITHIN the crossing rather than out of it. `app/vendor/calendar/page.tsx`
// still renders exactly one Header, `INTERIM_VENDOR_MOUNTS` still declares it at 1, and the
// constant that shrinks is `INTERIM_VENDOR_ROOMS`. A census bent to shrink here would be a
// number edited to match a sentence.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { CalendarScreen } from '@/app/vendor/calendar/screen';

export default function CalendarPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={session.name ?? null} />
      <CalendarScreen vendorId={session.id} />
    </div>
  );
}
