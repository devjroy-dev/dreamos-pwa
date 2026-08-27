"use client";
// app/w/advisor/page.tsx — R-38.9 · THE ADVISOR ROOM.
//
// ── F-38.2, AND WHY A LIVE FIELD HAD NO DOOR ────────────────────────────────
// `victor_mode` is SERVER truth: `engine.agents.victor_mode`, read and written through
// `PATCH /api/v2/vendor-e/mode` (lib/vendor/api/vendor.ts:33-35). No localStorage, no
// client mirror. Its only control, `VictorModeChip`, was re-homed inside the OLD hub's
// risen chat at F-09.129 (app/vendor/page.tsx:1132, inside `{risen && (`), and
// `components/worklist/AskSheet.tsx` never carried it. So on this branch the field was
// live, writable by the server, and reachable by no vendor at all.
//
// ── IT IS A ROOM, NOT A CHIP RETURNING ──────────────────────────────────────
// The founder's verdict on the pill was 「looks forced and out of place」 — a verdict on
// PLACEMENT and REGISTER, which F-09.129 Fork A(a) recorded and Fork B(b1) honoured by
// re-homing rather than retiring. A room honours both readings: the vendor GOES somewhere
// to be advised instead of carrying a switch on every screen. THE MODE CONTROL DOES NOT
// RETURN TO CHROME ANYWHERE, and the audit asserts it.
//
// ── THE COST, DISCLOSED RATHER THAN DISCOVERED ──────────────────────────────
// ⚠ A MODE FLIP RESETS VICTOR'S THREAD, SERVER-SIDE. `VictorModeResponse` carries
// `thread_reset?: boolean` (vendor.ts:27) — the reset is on the wire, not inferred. Until
// the backend holds two threads keyed by mode (chartered separately to the backend seat),
// moving between this room and the dock ERASES the other conversation. That is stated on
// the surface itself, once, in the vendor's own words rather than only in a handover.
//
// THE DOCK STAYS BUSINESS. Opening the dock's chat from any surface PATCHes back to
// business if the mode differs, so a vendor who wandered here and left does not find her
// business assistant quietly answering as an advisor three days later.
import { useEffect, useRef, useState } from 'react';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { COPY } from '@/lib/worklist/copy';
import { fetchVictorMode, setVictorMode } from '@/lib/vendor/api/vendor';

export default function AdvisorPage() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // Mount-once, for the same reason app/w/layout.tsx's resolve is: React 18's development
  // strict mode fires effects twice, and this effect WRITES. A double fire would PATCH the
  // mode twice and reset the thread twice.
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    let live = true;
    (async () => {
      try {
        // READ BEFORE WRITE, and the read is what keeps the reset honest. Sending the PATCH
        // unconditionally would reset the thread on every visit to this room, including a
        // visit by a vendor who was already in advisor mode and lost nothing by arriving.
        const cur = await fetchVictorMode();
        if (!live) return;
        if (cur.victor_mode !== 'advisor') await setVictorMode('advisor');
        if (live) setReady(true);
      } catch {
        // FAILS CLOSED ON THE CLAIM, OPEN ON THE SURFACE. The room still renders; it just
        // does not assert that the mode is advisor, because it does not know. A screen
        // that says 「Advisor」 over a session the server never switched is the class of
        // lie this estate spent Block 06 removing.
        if (live) { setFailed(true); setReady(true); }
      }
    })();
    return () => { live = false; };
  }, []);

  return (
    <WorklistShell title={COPY.advisorTitle}>
      <div className="wl-adv" aria-busy={!ready}>
        <h1 className="wl-advtitle">{COPY.advisorTitle}</h1>
        <p className="wl-advbody">{COPY.advisorEmpty}</p>
        {failed && <p className="wl-advnote">{COPY.advisorUnset}</p>}
        <p className="wl-advnote">{COPY.advisorThreadNote}</p>
      </div>
      <style>{`
.wl-adv{padding-top:20px;padding-bottom:24px;display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.wl-advtitle{font:var(--wl-t1);color:var(--atelier-ink);margin:0}
.wl-advbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}
.wl-advnote{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:8px 0 0;max-width:52ch}
      `}</style>
    </WorklistShell>
  );
}
