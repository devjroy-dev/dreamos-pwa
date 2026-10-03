"use client";
// app/w/support/page.tsx — BUSINESS SOLUTIONS, THE ROOM INDEX (R-19.2).
//
// ═══════════════════════════════════════════════════════════════════════════
// WHAT THIS PAGE WAS, AND WHAT SURVIVED THE TAKEOVER
// ═══════════════════════════════════════════════════════════════════════════
// It was the coming-soon sheet (R-37.66/.67 arm c′) — one sentence and a button
// that reached a human on WhatsApp. R-19.2 makes it the index of six surfaces.
//
// THE WHATSAPP LINE SURVIVES, AS THE FOOTER. Ruled at CE-38 relay #1 item 6, and
// the reasoning is worth keeping at the site: displacing it would have traded
// the one row on this page that reaches a person for six rows that all read
// `Coming`. It consumes `COPY.supportAction` UNCHANGED (the footer body shrank to
// the ruled one-liner at the founder walk — see the footer block below)
// from `lib/worklist/copy.ts` — read, never edited, because that file is the
// M-FINISH S2 seat's (kickoff §2). No string is orphaned and no relay was needed.
//
// THE NUMBER IS STILL NEVER INLINE. `supportWaNumber()` remains the declared
// home. F-09.190 counts six homes for that number already; this makes no seventh.
//
// THE TITLE IS UNCHANGED. `rooms.ts:62` already labels this room `Business
// Solutions` and `copy.ts` already reads `supportTitle: 'Business Solutions'`,
// so the tile, the shell title and this page agreed before it was written.
//
// ── R-38.2 · THE FRAME RENDERS FIRST ───────────────────────────────────────
// The six rows render IMMEDIATELY, with their `coming` chips, before any fetch
// resolves. `GET /solutions` then supplies each row's real state. A vendor never
// sees a spinner where her rooms should be, and if the call fails she sees the
// six rows plus a sentence — not an empty page. Billing paid for this lesson;
// this page inherits it.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { COPY as WL } from '@/v2/lib/worklist/copy';
import { supportWaNumber } from '@/lib/waNumbers';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { COPY, HUB_GROUPS, ROW_DESC, roomLabel } from '@/v2/lib/solutions/copy';
// CE-45 FE-1: ROOM_HREFS and PREVIEW_KEYS MOVED to lib/solutions/routes.ts, byte for byte, so the
// Money shelf and Home's pins resolve a row by the same table as this page (accepted as a move).
import { ROOM_HREFS, PREVIEW_KEYS } from '@/v2/lib/solutions/routes';
import { SolutionsStyles } from '@/v2/components/solutions/SolutionsPieces';
import { RoomIcon } from '@/v2/components/worklist/RoomIcon';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';

export default function SolutionsIndexPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <SolutionsIndexScreen />;
}

function SolutionsIndexScreen() {
  const router = useRouter();
  // ── R-40.23 · THE NINE REPLACE THE SIX, AND THE FETCH RETIRES WITH THEM ────
  // This screen used to hold `rows`, `err` and a `fetchIndex()` effect, because
  // six surfaces each had a live status behind `GET /solutions`. Exactly one of
  // the nine is built, and its row has no status to report — it either opens or
  // the app is broken. So there is no state, no effect and no error branch here:
  // R-38.2's lesson (the frame renders first, never a spinner where her rooms
  // should be) is honoured by having nothing to wait for at all.
  //
  // `fetchIndex` retires with this, its only caller (R-G11.18). The dream-os
  // door `GET /api/v2/vendor/solutions` is NOT deleted — F-40.28: eight routes,
  // three files, one GREEN bench reader and one comment reference, so
  // R-G11.18's removal condition fails. It has zero product readers now, and
  // that is filed rather than acted on.
  //
  // `COPY.indexUnavailable` is KEPT in its home and consumed by nothing here —
  // there is no fetch to fail. It is not deleted because it is the S2 seat's
  // string and other surfaces still read the file.
  return (
    <WorklistShell title={WL.supportTitle}>
      {/* CE-45 FE-1 · P3 RULED "THE PAGE" (chair, 24 Sept 2026). The eleven rows sit under the
          founder’s four headings (HUB_GROUPS: Get found, Get booked, Get paid, Work together;
          R-45.20), in the ruled mock’s order. Each heading takes the eyebrow this page already
          drew above its list, on the same class and rung, so no new type and no new token; the
          one eyebrow it replaces, COPY.indexEyebrow, is kept in its home unconsumed and reported,
          the precedent this page set for WL.supportBody. Each row now carries its line (ROW_DESC)
          under its name. Chips, the Coming state, the footer and the route are unchanged.
          THE ROW ELEMENT IS UNCHANGED IN WHAT IT DECIDES: the href is ROOM_HREFS' (total over
          RoomKey), the chip is PREVIEW_KEYS', exactly as before the move. */}
      <Body>
        {HUB_GROUPS.map((g) => (
          <div key={g.name} data-hub-group={g.name}>
            <Head text={g.name} />
            <Group>{g.keys.map((k) => (
              <Row key={k} title={roomLabel(k)} facts={ROW_DESC[k]} icon={<RoomIcon k={k} className="fr-ic" />} chevron href={ROOM_HREFS[k]} />
            ))}</Group>
          </div>
        ))}
        <Head text={WL.supportHead} />
        <Group><div data-support-action=""><Row title={COPY.footerLine} facts={WL.supportAction} icon={<RoomIcon k="help" className="fr-ic" />} chevron
          onClick={() => window.open(`https://wa.me/${supportWaNumber()}?text=${encodeURIComponent('Hi')}`, '_blank', 'noopener')} /></div></Group>
      </Body>
      <style>{FR_CSS}</style>
      <SolutionsStyles />
      <style>{`
/* Carried from the surface this page replaced, byte-for-byte in its properties.
   R-38.5: the column owns the gutter — vertical only, no horizontal inset. */
.wl-supportaction{background:transparent;border:.5px solid var(--atelier-input-border);border-radius:12px;cursor:pointer;padding:12px 16px;min-height:44px;font:var(--wl-t4);color:var(--atelier-accent-text);touch-action:manipulation}
.wl-supportaction:active{background:var(--atelier-row-hover)}
.wl-supportaction:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
      `}</style>
    </WorklistShell>
  );
}
