'use client';
// app/vendor/(shell)/google-reviews/page.tsx
// BLOCK 19 · G2 — THE GOOGLE REVIEWS ROOM (R-40.1's R2).
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS ROOM HAS NO CONTROL, AND THAT IS THE DESIGN
// ═══════════════════════════════════════════════════════════════════════════
// No FAB, no button, no toggle, nothing tappable except the shell's own nav.
// Every other room in this estate gives the vendor something to do; this one
// tells her what has already happened.
//
// The reason is mechanical rather than aesthetic: an ask is not something she
// presses. It follows a published wedding page — `publishWedding` is
// `delivered_at`'s sole writer, and the nightly job reads from there. A button
// here would be a second door onto an act she does not drive, and it would have
// to be disabled most of the time, which is the lying-control class this estate
// has now filed twice (R-G11c.8's lineage, and the seal's absent line below).
//
// ── THE FRAME IT IS BUILT TO ──────────────────────────────────────────────
// `docs/mocks/google-reviews-mock.html` @ `af295a7`, frames `G1-room`,
// `G1-empty`, `G1-gbp`. Every string is transcribed in
// `lib/worklist/googleReviews.ts`; all seventeen were ratified as proposed
// (R-40.42). The `W2-room` Leads-card idiom is shared with the wedding-pages
// room — the same two lines, the same right-hand state, the same section header
// carrying a count.
//
// ── ONE READ, AND IT IS THE DOOR'S ────────────────────────────────────────
// `GET /api/v2/vendor/solutions/google-reviews` through `getJson`, addressed by
// `API.googleReviews()` and never by a hand-written path. `lib/vendor/api/`'s
// own header states that rule and the wedding-pages seat's e-8 records what
// ignoring it costs — a hand-written path that 404'd on the founder's walk.
//
// ── R-38.2 · THE FRAME RENDERS FIRST ──────────────────────────────────────
// The bands are drawn before the fetch resolves, and a failed read leaves the
// room standing with one sentence rather than an empty page. Billing paid for
// that lesson; this room inherits it.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson } from '@/lib/vendor/api/_base';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
import { API } from '@/v2/lib/solutions/routes';
import { GR, sealFacts } from '@/v2/lib/worklist/googleReviews';
import type { GoogleReviewsRoom } from '@/lib/solutions/types';

export default function GoogleReviewsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <GoogleReviewsScreen />;
}

/**
 * THE DATE, THROUGH ONE HOME.
 *
 * `3 Sep 2026` — the house format, the same short-month TABLE `src/lib/format.js`
 * renders on the invoice document and in the WhatsApp message about it. NOT
 * `Intl`: `Intl('en-IN')` renders September as `Sept`, four letters alone among
 * the twelve, and the S2 veto sheet carries that as a ruled byte.
 *
 * The month list is transcribed rather than imported because that home is in the
 * other repo. It is twelve tokens and a bench cell would be worth more than this
 * sentence — named as owed rather than claimed as covered.
 */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'] as const; // CE-47 L4 (FE-7): full months (veto 24)
function houseDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function GoogleReviewsScreen() {
  const [room, setRoom] = useState<GoogleReviewsRoom | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; googleReviews: GoogleReviewsRoom }>(API.googleReviews());
      setRoom(r.googleReviews);
    } catch {
      // The room still renders. R-38.2: the chrome is a fact about the product,
      // the numbers are a fact about the fetch, and only the second one failed.
      setFailed(true);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const asked = room?.asked ?? [];
  const seal  = room?.seal ?? null;

  return (
    <WorklistShell title={GR.roomTitle}>
      {/* ── F-40.180 · TRUTHINESS, NOT `!== null` ──────────────────────────
          `undefined !== null` is TRUE. A read that produced nothing fell through
          this test and rendered, which is how the payment-reminders room threw on
          its first field in production. This room's envelope is correct today —
          the guard is still the wrong shape, and the specimen is never the extent
          (R-40.64). R-38.2 as `b40` C106 now states it: on a bad read a room shows
          its ONE standing sentence and nothing else. */}
      {!room && !failed ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {failed ? (
        <div className="gr-room"><p className="gr-note">{GR.unavailable}</p></div>
      ) : null}

      {room ? (
        <Body>
          <p className="fr-lede">{GR.lede}</p>
          {asked.length > 0 ? (<>
            <Head text={GR.sectionAsked} count={room.askedCount} />
            <Group>{asked.map((a, i) => <Row key={i} title={a.coupleName || a.weddingTitle || ''} facts={`${GR.askedState} ${houseDate(a.askedAt)}`} />)}</Group>
            <Head text={GR.sectionReviews} count={room.landedCount || undefined} />
            <p className="fr-empty">{GR.reviewsWaiting}</p>
          </>) : (<><Head text={GR.sectionAsked} /><p className="fr-empty">{GR.askedEmpty}</p></>)}
          <Head text={GR.sectionSeal} />
          {seal ? (<><Group><Row title={GR.sealMark} facts={sealFacts(seal.weddings, seal.deliveryDays)} pill={{ text: GR.sealState, tone: 'ok' }} /></Group>
            <p className="fr-empty" style={{ marginTop: 8 }}>{GR.sealNote}</p></>) : <p className="fr-empty">{GR.sealAbsent}</p>}
          <Head text={GR.sectionListing} />
          <Group><Row title={GR.listingRow} facts={GR.listingFromDate(houseDate(room.gbpAvailableFrom))} pill={{ text: GR.comingSoon, tone: 'soon' }} /></Group>
        </Body>
      ) : null}
      <style>{FR_CSS}</style>
    </WorklistShell>
  );
}
