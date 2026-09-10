"use client";
// app/vendor/(shell)/dates/page.tsx — OPEN DATES & RATES · THE SHELL SCREEN.
// CE-42 · SHELL · R-42.12 AMENDED (founder-ruled 2026-09-10).
//
// Every Business Solutions row navigates to its own screen; the screen says what
// the capability is; the act that would run it says `Launching soon.` on tap. No
// inert row and no row-level toast. This is `ROOM_ROWS`' `dates` row, R8's room
// when it lands (roadmap row F) — at this address, so nothing moves on the day.
//
// ── THE CONTROL INVENTORY (protocol §10 part 4) ─────────────────────────────
// A NEW surface, so nothing is KEPT/MOVED/REMOVED from a predecessor. Two
// controls, each with one verb:
//   · `Suggest rates` — ACKNOWLEDGE. An ENABLED button (F-19.20: a disabled one
//     read as dead on the founder's walk) whose only act is the toast.
//   · the Storefront row — NAVIGATE, to `roomHref('storefront')` (S2(a)): the
//     date-check readout already lives there, gated on her trade's capacity, and
//     linking to it is one home where extracting the card would have been two.
// Plus the shell's own chrome (coin, dock, nav), unchanged.
//
// ── R-42.17 · THE HIERARCHY (CE-42 SHELL-2) ─────────────────────────────────
// Three NON-interactive elements join the surface; the control inventory above
// does not move. The eyebrow reads `CHIPS.coming` (C2, carried — the hub reads
// this row Coming through `PREVIEW_KEYS`; the room's own sitting removes both in
// one edit). The h1 reads `roomLabel(...)`, the SAME byte the shell seat shows
// (A1, the Advisor precedent) — the seat is not changed, so report-issue keeps
// the room. The sub-head reads `COPY.canHead` (T2). No byte is typed here.
//
// ── S3(i) · STATIC, ON PURPOSE ──────────────────────────────────────────────
// No `/me` read. A trade for which date checks are ruled off still sees D2 and
// D5; the Storefront room tells her the truth where it already does
// (`storefrontDateRuledOff`), which is one home for that sentence, not two.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { CHIPS, COPY, roomLabel } from '@/lib/solutions/copy';
import { DATES } from '@/lib/worklist/openDates';
import { ROOMS, roomHref } from '@/lib/worklist/rooms';
import { RoomRow, SolutionsStyles } from '@/components/solutions/SolutionsPieces';

export default function OpenDatesPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <OpenDatesScreen />;
}

/** The registry's own byte for the room the door opens — never typed here. */
const STOREFRONT_LABEL = ROOMS.find((r) => r.id === 'storefront')?.label ?? '';

function OpenDatesScreen() {
  // THE MOUNT IS LOAD-BEARING (honest controls, CE-209): `show()` is the ONLY
  // thing the CTA does, so a screen without `<WlToast>` would ship a button that
  // answers nothing — the dead tap R-42.12 exists to end.
  const { toast, show } = useToast();
  return (
    <WorklistShell title={roomLabel('dates')}>
      <section className="sol-surface">
        <p className="sol-kicker">{CHIPS.coming}</p>
        <h1 className="sol-title">{roomLabel('dates')}</h1>
        <p className="sol-empty">{DATES.lede}</p>
        <p className="sol-subhead">{COPY.canHead}</p>
        <ul className="sol-can">
          {DATES.can.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <div className="sol-actions">
          <button type="button" className="sol-btn" onClick={() => show(COPY.launchingSoon)}>
            {DATES.cta}
          </button>
        </div>
        <div className="sol-aside">
          <p className="sol-asideline">{DATES.already}</p>
          <RoomRow href={roomHref('storefront')} label={STOREFRONT_LABEL} />
        </div>
      </section>
      <WlToast toast={toast} />
      <SolutionsStyles />
    </WorklistShell>
  );
}
