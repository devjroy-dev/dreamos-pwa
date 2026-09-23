"use client";
// app/vendor/(shell)/number/page.tsx — YOUR OWN NUMBER · THE SHELL SCREEN.
// CE-42 · SHELL · R-42.12 AMENDED (founder-ruled 2026-09-10).
//
// `ROOM_ROWS`' `number` row: what the capability is, and the act that says
// `Launching soon.` on tap. R9's room when it lands (roadmap row J; G6 gated on
// Meta's Advanced Access and the Tech Provider item ZERO) — at this address.
//
// ── THE CONTROL INVENTORY (protocol §10 part 4) ─────────────────────────────
// A NEW surface. ONE control: `Connect` — ACKNOWLEDGE. Enabled (F-19.20), and
// its label is `BUTTONS.connect` (spec §9, N5 ruled (a)): a byte the founder
// approved long before this screen, so the screen authors no button word.
// Plus the shell's own chrome, unchanged.
//
// ── R-42.17 · THE HIERARCHY (CE-42 SHELL-2) ─────────────────────────────────
// Three NON-interactive elements join the surface; the control inventory above
// does not move. The eyebrow reads `CHIPS.coming` (C2, carried — the hub reads
// this row Coming through `PREVIEW_KEYS`; the room's own sitting removes both in
// one edit). The h1 reads `roomLabel(...)`, the SAME byte the shell seat shows
// (A1, the Advisor precedent) — the seat is not changed, so report-issue keeps
// the room. The sub-head reads `COPY.canHead` (T2). No byte is typed here.
//
// ── CE-45 · G6-1 · CUT ONE (FE_1) ───────────────────────────────────────────
// This screen's inventory above is UNCHANGED: the shell stays the shell. The
// page gains one read (`useOwnNumberRoom`) and one branch: when the door is open
// and every flow byte has landed, `OwnNumberFlow` draws instead, with its own
// inventory in its own file. Until then, and whenever the door is absent, shut,
// or malformed, this screen renders exactly what it rendered at 320ad7e.
//
// ⚠ NO PERSONA NAME ANYWHERE ON THIS SCREEN. The capability is the assistant
// answering on her own number; the chrome says what happens, never who does it
// (R-37.70 as amended; b40 C32).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { BUTTONS, CHIPS, COPY, roomLabel } from '@/lib/solutions/copy';
import { NUMBER } from '@/lib/worklist/ownNumber';
import { SolutionsStyles } from '@/components/solutions/SolutionsPieces';
import { OwnNumberFlow } from '@/components/solutions/OwnNumberFlow';
import { useOwnNumberRoom } from '@/hooks/vendor/useOwnNumberRoom';

export default function OwnNumberPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <OwnNumberScreen />;
}

function OwnNumberScreen() {
  // THE MOUNT IS LOAD-BEARING — see /vendor/dates. The CTA's only act is `show()`.
  const { toast, show } = useToast();
  // G6 · CE-45 G6-1 · THE ONE DECISION (read-first FK1, ruling F-a (a)). The flow
  // is drawn only when the door answers open AND every flow byte is the founder's;
  // anything else, including the door not existing yet, is the shell below,
  // byte for byte as it was. The flow's own controls live in OwnNumberFlow.
  const room = useOwnNumberRoom();
  if (room.mode !== 'shell') return <OwnNumberFlow room={room} />;
  return (
    <WorklistShell title={roomLabel('number')}>
      <section className="sol-surface">
        <p className="sol-kicker">{CHIPS.coming}</p>
        <h1 className="sol-title">{roomLabel('number')}</h1>
        <p className="sol-empty">{NUMBER.lede}</p>
        <p className="sol-subhead">{COPY.canHead}</p>
        <ul className="sol-can">
          {NUMBER.can.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <div className="sol-actions">
          <button type="button" className="sol-btn" onClick={() => show(COPY.launchingSoon)}>
            {BUTTONS.connect}
          </button>
        </div>
      </section>
      <WlToast toast={toast} />
      <SolutionsStyles />
    </WorklistShell>
  );
}
