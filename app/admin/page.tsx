'use client';
// app/admin/page.tsx — THE BRIDGE (TDW_10 P2, ruling A-3).
//
// ── WHAT THIS REPLACES, AND WHAT SURVIVES IT ────────────────────────────────
// The four-tile dashboard that stood here fanned out FOUR client calls and
// derived its figures in the browser — the "dashboard-HALF" F-07.95 names. P2's
// contract is ONE server-assembled aggregation, so the fan-out goes.
//
// ITS DOCTRINE DOES NOT GO. F-07.90's cure lived in that file: every arm read
// `.catch(() => ({ requests: [] }))`, a failed call became an empty collection,
// an empty collection became a zero, and a zero became a confident stat tile on
// the founder's first daily screen. 「 DISCOVER QUEUE · 0 · Under review 」 was
// not zero — it was a 401 the page threw away.
//
// The distinction it rests on is carried forward VERBATIM into the Bridge and
// into src/api/admin/bridge.js: `0` is an ANSWER, `—` is the absence of one,
// and collapsing the second into the first is what made a broken guard look
// like a quiet Tuesday. The Bridge adds a third rendering the old page had no
// need for — the HONEST STATE, for a figure that cannot exist yet rather than
// one that failed to load. Revenue is the specimen (F-10.1).
//
// The retired UNKNOWN_VALUE / UNKNOWN_SUB consts are gone with their tiles;
// their behaviour is now `Figure`'s dead branch in _components/Bridge.tsx.

import { PageHeader } from './_components/AdminUI';
import Bridge from './_components/Bridge';

export default function AdminBridgePage() {
  const today = new Date().toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata',
  });
  return (
    <div>
      <PageHeader title="The Bridge" sub={today} />
      <Bridge />
    </div>
  );
}
