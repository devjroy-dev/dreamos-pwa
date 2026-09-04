"use client";
// app/w/calendar/page.tsx — CALENDAR, INSIDE THE SHELL. §4-2, first crossing.
//
// ── WHAT CROSSED ────────────────────────────────────────────────────────────
// THE STRUCTURE. This route is a child of `app/w/layout.tsx`, so tapping the Calendar tile
// mounts no second layout, no second masthead, no second medallion, no second nav and no
// second session resolve. That is the whole of F-38.1 for this surface, and calendar is the
// tile the founder reaches for mid-conversation — the one where the second-layout lag was
// most expensive.
//
// THE BODY DID NOT, AND THAT IS R-38.12 RATHER THAN AN OMISSION. `CalendarScreen` is the
// SAME module the /vendor fallback renders — imported, never copied. Two calendars would be
// two homes for every block, every hot date and every vetoed byte, drifting apart without
// either one erroring.
//
// ── ONE EDIT, THREE SITES, AND THE ADDRESS BOOK ALREADY HELD THE ANSWER ─────
// The registry's href moved (`lib/worklist/rooms.ts`), `AddSheet.tsx`'s block leg moved
// with it, and the Add control's Calendar row moved WITHOUT BEING TOUCHED — it has asked
// `roomHref('calendar')` since R-38.18 and simply started getting a different answer. That
// is what the address book was built for at the S2 ZIP bounce: a room that crosses takes
// its inbound links with it, in the same edit that changes its href.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { CalendarScreen } from './screen';

export default function ShellCalendarPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.calendarTitle}>
      <RoomBody><CalendarScreen vendorId={session.id} /></RoomBody>
    </WorklistShell>
  );
}
