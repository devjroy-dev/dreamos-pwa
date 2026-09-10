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
// ⚠ NO PERSONA NAME ANYWHERE ON THIS SCREEN. The capability is the assistant
// answering on her own number; the chrome says what happens, never who does it
// (R-37.70 as amended; b40 C32).
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { BUTTONS, COPY, roomLabel } from '@/lib/solutions/copy';
import { NUMBER } from '@/lib/worklist/ownNumber';
import { SolutionsStyles } from '@/components/solutions/SolutionsPieces';

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
  return (
    <WorklistShell title={roomLabel('number')}>
      <section className="sol-surface">
        <p className="sol-empty">{NUMBER.lede}</p>
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
