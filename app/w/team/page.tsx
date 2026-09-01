"use client";
// app/w/team/page.tsx — TEAM, INSIDE THE SHELL. §4-4 batch ②; BODY CROSSED AT 2b-2.
//
// ── WHAT CROSSED, AND WHEN ──────────────────────────────────────────────────
// THE STRUCTURE crossed at §4-4: this route is a child of `app/w/layout.tsx`, so
// tapping the Team tile mounts no second layout, no second masthead, no second
// medallion, no second nav and no second session resolve.
//
// THE BODY CROSSED AT CE-39 2b-2, arm D (a). It did not at §4-4, and the
// paragraph that stood here explained why — `TeamHubScreen` was the SAME module
// the /vendor fallback rendered, imported and never copied, so the founder's
// three rows existed once. That was true and it is now the past tense: the room
// rendered a MENU whose every item unmounted the shell, and `TeamTabs` renders
// the three lists here instead.
//
// ⚠ `TeamHubScreen` DID NOT DIE AND IS NOT ORPHANED. `app/vendor/team-hub/
// page.tsx` still mounts it and is byte-untouched by ruling; the /vendor
// fallback keeps the row menu until 2c-Studio takes the question up with its
// verbs. `C58` reads BOTH readers for exactly this reason.
//
// ── ⚠ WHAT THIS ROOM STILL IS ──────────────────────────────────────────────
// A READ. Every write still leaves the shell: the `+` on each tab and every edit
// path route to `/vendor/studio/{team,tasks,team-payments}` — the same three
// hrefs `INTERIM_VENDOR_LINKS` has counted since §4-4, with their source lines.
// The set does not grow at this crossing; only who points at the three entries
// changes. F-39.30 is OPEN-AS-NARROWED and card ⑥ carries the sentence.
//
// ── THE DECLARED GAP THAT CLOSED ───────────────────────────────────────────
// The line here used to read 「the body carries the rooms' older type register
// and F-38.22's colour literals — priced, not swept」. That was a statement
// about `TeamHubScreen`, which this route no longer renders. `TeamTabs` reads
// `lib/worklist/theme.ts` through the shell's scope and states no colour and no
// type size of its own, so the gap does not travel with the crossing. The
// sentence retires with the body it described (retire-with-the-reader, applied
// to a comment exactly as to code).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { RoomBody } from '@/components/worklist/RoomBody';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { TeamTabs } from '@/components/worklist/TeamTabs';

export default function ShellTeamPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;

  return (
    <WorklistShell title={COPY.teamTitle}>
      <RoomBody><TeamTabs vendorName={session.name ?? null} /></RoomBody>
    </WorklistShell>
  );
}
