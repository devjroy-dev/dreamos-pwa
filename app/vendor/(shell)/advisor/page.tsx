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
// ── R-41.139 · THE PAGE COMPOSES ITS OWN CONVERSATION ────────────────────────
// No new component and no sheet variant: the SAME three the shared sheet uses.
// `variant='advisor'` was withdrawn precisely so there is one ChatThread and one
// InputBar in the estate, and this page arranges them rather than forking them.
import { ChatThread } from '@/components/vendor/ChatThread';
import { InputBar } from '@/components/vendor/InputBar';
import { useChat } from '@/hooks/vendor/useChat';
import { getVendorSession } from '@/lib/vendor/session';
import { reportGlitch } from '@/lib/vendor/api/vendor';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { COPY } from '@/lib/worklist/copy';
import Link from 'next/link';
import { roomHref } from '@/lib/worklist/rooms';
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

  // ── R-41.139 · THE ROOM IS ASSERTED HERE AND NOWHERE ELSE ──────────────────
  // The whole estate's path to `room` is this one call. WorklistShell, AiDock and
  // AskSheet no longer carry the prop — a prop nothing passes is how a later seat
  // concludes the shared sheet may assert a room, and the shared sheet staying
  // business on every page is a founder's ruling rather than a default.
  const vendorId = getVendorSession()?.id || '';   // `.id`, as AiDock:35 reads it
  const { messages, loading, send, meta } = useChat({ vendorId, room: 'advisor' });
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = messages.length > 0;

  return (
    // The dock is NOT mounted on this route: WorklistShell renders it for every
    // page, so this page opts out by rendering the conversation itself and hiding
    // the dock in its own stylesheet below. Everywhere else the dock and the shared
    // sheet stay exactly as today and remain business.
    // THE HEADER AND INTRO ARE UNCHANGED — the founder ratified them at 06:12 and
    // R-41.139 proposes no word of them. Only the shape moves.
    <WorklistShell title={COPY.advisorTitle}>
      <div className="wl-advroom" aria-busy={!ready}>
        {/* Before the first message the ratified header and intro stand. Once a
            turn exists they give way: at 374 the page cannot carry a header, an
            intro, a note AND a thread without the conversation starting below the
            fold. Ratified on the frame's read. */}
        {!started && (
          <div className="wl-adv">
            <h1 className="wl-advtitle">{COPY.advisorTitle}</h1>
            <p className="wl-advbody">{COPY.advisorEmpty}</p>
            {failed && <p className="wl-advnote">{COPY.advisorUnset}</p>}
            <p className="wl-advnote">{COPY.advisorThreadNote}</p>
          </div>
        )}
        <div className="wl-advthread" ref={scrollRef}>
          <ChatThread messages={messages} loading={loading} onChipTap={send} scrollRef={scrollRef}
            /* onConfirm/onCancel are required by Props and no-op'd by every caller —
               a contract that has drifted from its component. Matched here as AskSheet
               matches it, rather than papered over; Phase 2 owns the cure. */
            onConfirm={() => {}} onCancel={() => {}}
            onReportGlitch={async () => { await reportGlitch(); }}
            onRetryLast={() => { const last = [...messages].reverse().find((m) => m.role === 'user');
                                 if (last?.text) send(last.text); }} />
        </div>
        {/* The cap door, the same gate AskSheet carries: the EXACT COMPLEMENT of
            TierMeter's, not merely 'capped', so a vendor with a spent nonzero cap
            is not handed two anchors. One state, one seat. */}
        {meta?.state === 'capped' && !meta.turns_cap && (
          <Link href={roomHref('billing')} className="wl-advcap">{COPY.capUpgradeCta}</Link>
        )}
        <div className="wl-advbar"><InputBar onSend={send} /></div>
      </div>
      <style>{`
.wl-advroom{display:flex;flex-direction:column;height:100%;min-height:0}
.wl-adv{padding-top:20px;padding-bottom:8px;display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.wl-advtitle{font:var(--wl-t1);color:var(--atelier-ink);margin:0}
.wl-advbody{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}
.wl-advnote{font:var(--wl-t5);color:var(--atelier-ink-mute);margin:8px 0 0;max-width:52ch}
.wl-advthread{flex:1;min-height:0;overflow-y:auto;padding-top:12px}
.wl-advcap{font:var(--wl-t5);color:var(--atelier-accent-text);margin:8px 0}
.wl-advbar{flex-shrink:0;padding-top:8px;border-top:1px solid var(--atelier-card-border)}
      `}</style>
    </WorklistShell>
  );
}
