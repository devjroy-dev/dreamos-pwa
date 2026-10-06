"use client";
// v2/app/vendor/(shell)/payment-links/page.tsx — CE-47 · THE HUB CUT (INS) · the `payment_links` row's shell screen (R-42.14, Option A).
// Its seat replaces THIS FILE when the room lands, and removes `payment_links` from PREVIEW_KEYS in the same edit.
import { ComingRoom } from '@/v2/components/solutions/ComingRoom';

export default function Page() {
  return <ComingRoom k="payment_links" />;
}
