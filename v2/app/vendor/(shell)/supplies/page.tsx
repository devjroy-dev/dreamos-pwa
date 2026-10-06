"use client";
// v2/app/vendor/(shell)/supplies/page.tsx — CE-47 · THE HUB CUT (INS) · the `supplies` row's shell screen (R-42.14, Option A).
// Its seat replaces THIS FILE when the room lands, and removes `supplies` from PREVIEW_KEYS in the same edit.
import { ComingRoom } from '@/v2/components/solutions/ComingRoom';

export default function Page() {
  return <ComingRoom k="supplies" />;
}
