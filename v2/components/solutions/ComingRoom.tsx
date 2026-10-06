"use client";
// v2/components/solutions/ComingRoom.tsx — CE-47 · THE HUB CUT (INS, app train 2) · ONE SHELL SCREEN FOR A ROOM NOT YET OPEN.
//
// R-42.12 as amended and R-42.14, Option A as the chair ruled it (6 October 2026): every Business Solutions row opens its
// own screen. A row in PREVIEW_KEYS reads `Coming` on the hub and opens THIS screen at its room's own address: the room's
// name (the same byte as its hub row, roomLabel), its ruled one line (ROW_DESC), and one statement row carrying
// COPY.launchingSoon under the estate's `Coming` chip. No act to tap, so no dead control: the row is a plain div
// (RoomRows' Row with no onClick). No byte is typed here; every word is read from its one home.
//
// A seat landing its room replaces its page file (v2/app/vendor/(shell)/<slug>/page.tsx) and removes its key from
// PREVIEW_KEYS in one edit; this component is not touched.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { CHIPS, COPY, ROW_DESC, roomLabel, type RoomKey } from '@/v2/lib/solutions/copy';
import { Body, Group, Row, FR_CSS } from '@/v2/components/worklist/RoomRows';

export function ComingRoom({ k }: { k: RoomKey }) {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return (
    <WorklistShell title={roomLabel(k)}>
      <Body>
        <p className="fr-lede" data-coming-room={k}>{ROW_DESC[k]}</p>
        <Group>
          <Row title={COPY.launchingSoon} pill={{ text: CHIPS.coming, tone: 'soon' }} />
        </Group>
      </Body>
      <style>{FR_CSS}</style>
    </WorklistShell>
  );
}
