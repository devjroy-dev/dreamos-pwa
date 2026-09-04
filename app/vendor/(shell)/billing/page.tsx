"use client";
// app/w/billing/page.tsx — BILLING, INSIDE THE SHELL. R-38.1 + R-38.8.
//
// R-38.8 made Billing the test case on purpose: it is the estate's only revenue surface,
// and if the register and the scale cannot survive a page with money, states, actions and
// irreversible consequences on it, then they are a style guide rather than a construction.
//
// ONE HEADER. ONE COIN. ONE NAV. Tapping the Billing tile from Rooms crosses no layout
// boundary — same root, same scope, same session resolve, same drawer. At 366a7b5 this
// route mounted app/vendor/layout.tsx, which meant a second Splash, the old DreamAi
// masthead, the old medallion with 「DreamAi on WhatsApp」 in its drawer (banned by
// R-37.70/.78/.83) and the glyph bar underneath.
//
// THE TOAST IS WlToast (CE-38 relay #2, arm (c)) and its mount is load-bearing — see
// components/worklist/BillingRoom.tsx. `useSettings` and `useToast` are the same hooks the
// old surface uses; nothing about the state moved.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { BillingRoom } from '@/components/worklist/BillingRoom';
import { COPY } from '@/lib/worklist/copy';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useSettings } from '@/hooks/vendor/useSettings';
import { useToast } from '@/hooks/vendor/useToast';

export default function ShellBillingPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <BillingScreen />;
}

function BillingScreen() {
  const { current, loading, error } = useSettings();
  const { toast, show } = useToast();

  return (
    <WorklistShell title={COPY.billingTitle}>
      <WlToast toast={toast} />
      {/* NO SPINNER THEATRE (R-38.2). A money surface that flashes a loading word and then
          a card is two paints where one will do: the FRAME renders immediately and the
          values arrive with the fetch. An ERROR is a fact the vendor needs, so it renders
          as one.
          THE FIRST CUT GATED THE WHOLE SURFACE ON `!loading`, which contradicted this very
          comment and was caught by the render arm rather than by reading it: C-R7a could
          not find `.wl-billcard` to measure, because under the arm's synthetic token the
          authenticated fetch fails closed and the card never mounted. A frame that only
          exists once the data does is a frame no instrument can hold a ruler against — and
          it is also the two-paint flash the comment claims not to do. */}
      {error && !loading && <p className="wl-billerr">{error}</p>}
      {/* THE FRAME RENDERS ON THE ERROR PATH TOO, and that is a second correction the
          render arm forced. Gating it on `!error` meant a vendor whose /me call failed saw
          a bare red sentence on an empty page — and it meant C-R7a had nothing to measure
          under the arm's synthetic token, which is how it was found. What she sees now is
          her own money page with the reading missing and a sentence saying so, which is
          the honest shape: the CHROME is a fact about the product, the VALUES are a fact
          about the fetch, and only the second one failed. */}
      <BillingRoom current={current} show={show} loading={loading || !!error} />
      <style>{`
.wl-billerr{font:var(--wl-t3);color:var(--role-critical);margin:16px 0 0}
      `}</style>
    </WorklistShell>
  );
}
