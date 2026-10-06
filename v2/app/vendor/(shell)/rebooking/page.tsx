"use client";
// v2/app/vendor/(shell)/rebooking/page.tsx — CE-47 · THE HUB CUT (INS) · the `rebooking` row's shell screen (R-42.14, Option A).
// Its seat replaces THIS FILE when the room lands, and removes `rebooking` from PREVIEW_KEYS in the same edit.
import { ComingRoom } from '@/v2/components/solutions/ComingRoom';

export default function Page() {
  return <ComingRoom k="rebooking" />;
}
