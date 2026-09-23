'use client';
// components/solutions/OwnNumberFlow.tsx · CE-45 · G6-1 · CUT ONE (FE_1).
// THE OWN-NUMBER FLOW: the room when the door is open, the consent screens,
// Meta's screen on her tap, and the number's state once one is on file.
// Mounted ONLY by app/vendor/(shell)/number/page.tsx, and only when
// `roomMode` says 'flow' or 'status', which it never says while a byte is owed.
//
// ── THE CONTROL INVENTORY (protocol §10 part 4) ─────────────────────────────
// room     Connect (BUTTONS.connect) -> the consent screen. Nothing is launched.
// consent  sharedGo  -> Meta's screen, the shared way (R-43.15's default, FQ1).
//          movedGo   -> the second confirmation. Nothing is launched.
//          cancel    -> back to the room.
// confirm  movedConfirmGo -> Meta's screen, the moved way.
//          cancel    -> back to the room.
// working  NO control. The state is stated (FLOW.connecting); a second tap is
//          impossible because there is nothing to tap (F-19.20: stated, not hidden).
// status   NO control this cut. Disconnect arrives with the server's own act.
// The moved way is therefore stated twice before anything opens (§7b constraint 1,
// c-45.30): once on the consent screen, once on its own screen.
//
// ⚠ NO BYTE IS TYPED HERE. Every word is FLOW's (the founder's, when it lands),
// or the shell's approved ones (NUMBER, COPY, CHIPS, BUTTONS, roomLabel). The
// only strings drawn that are not copy are DATA: her display number and, after a
// Meta error, the session id Meta gave her for support.
//
// ⚠ NO PERSONA NAME ANYWHERE ON THIS SCREEN (R-37.70, b40 C32).
import { useRef, useState } from 'react';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { SolutionsStyles } from '@/components/solutions/SolutionsPieces';
import { BUTTONS, CHIPS, COPY, roomLabel } from '@/lib/solutions/copy';
import { NUMBER } from '@/lib/worklist/ownNumber';
import { FLOW } from '@/lib/worklist/ownNumberFlow';
import { postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { asNumberLine } from '@/lib/vendor/ownNumberDoor';
import type { ConnectBody, OwnNumberLine, OwnNumberWay } from '@/lib/vendor/ownNumberDoor';
import type { OwnNumberRoom } from '@/hooks/vendor/useOwnNumberRoom';
import { launchSignup } from '@/lib/vendor/metaSignup';

type Step = 'room' | 'consent' | 'confirm' | 'working';
type Outcome = null | { line: string; sessionId: string | null };

const STATE_LINE: Record<OwnNumberLine['status'], string | null> = {
  pending: FLOW.pending, active: FLOW.active, suspended: FLOW.suspended, migrated_out: FLOW.movedOut,
};
const STATE_CHIP: Record<OwnNumberLine['status'], string | null> = {
  pending: null, active: CHIPS.connected, suspended: CHIPS.needs_attention, migrated_out: CHIPS.not_connected,
};

export function OwnNumberFlow({ room }: { room: OwnNumberRoom }) {
  const [step, setStep] = useState<Step>('room');
  const [outcome, setOutcome] = useState<Outcome>(null);
  const busy = useRef(false);
  const door = room.door;

  const go = async (way: OwnNumberWay) => {
    if (busy.current || !door || !door.launch) return;
    busy.current = true;
    setOutcome(null);
    setStep('working');
    try {
      const r = await launchSignup(door.launch, way);
      if (r.kind === 'cancel') {
        const err = !!r.session && (r.session.event === 'ERROR' || !!r.session.error_code);
        setOutcome({ line: String(err ? FLOW.metaError : FLOW.stopped), sessionId: err ? r.session!.session_id : null });
        setStep('room');
        return;
      }
      const body: ConnectBody = {
        code: r.code,
        event: r.session ? r.session.event : null,
        waba_id: r.session ? r.session.waba_id : null,
        phone_number_id: r.session ? r.session.phone_number_id : null,
        business_id: r.session ? r.session.business_id : null,
      };
      const res = await postJson<Record<string, unknown>>(API.ownNumberConnect(), body);
      const line = res && res.ok === true ? asNumberLine(res.number) : undefined;
      if (line) { room.setDoor({ ...door, number: line }); return; }
      const reason = res && typeof res.reason === 'string' ? res.reason : '';
      const said = res && typeof res.reason_text === 'string' && res.reason_text ? res.reason_text : null;
      setOutcome({ line: reason === 'code_expired' ? String(FLOW.expired) : (said || COPY.surfaceUnavailable), sessionId: null });
      setStep('room');
    } catch {
      setOutcome({ line: COPY.surfaceUnavailable, sessionId: null });
      setStep('room');
    } finally {
      busy.current = false;
    }
  };

  if (room.mode === 'status' && door && door.number) {
    const n = door.number;
    const chip = STATE_CHIP[n.status];
    return (
      <WorklistShell title={roomLabel('number')}>
        <section className="sol-surface" data-own-number="status" data-status={n.status}>
          {chip && <p className="sol-kicker">{chip}</p>}
          <h1 className="sol-title">{roomLabel('number')}</h1>
          <p className="sol-addr">{n.display_number}</p>
          <p className="sol-empty">{STATE_LINE[n.status]}</p>
        </section>
        <SolutionsStyles />
      </WorklistShell>
    );
  }

  return (
    <WorklistShell title={roomLabel('number')}>
      <section className="sol-surface" data-own-number={step}>
        {step === 'room' && (
          <>
            <p className="sol-kicker">{CHIPS.not_connected}</p>
            <h1 className="sol-title">{roomLabel('number')}</h1>
            <p className="sol-empty">{NUMBER.lede}</p>
            <p className="sol-subhead">{COPY.canHead}</p>
            <ul className="sol-can">
              {NUMBER.can.map((line) => <li key={line}>{line}</li>)}
            </ul>
            {outcome && <p className="sol-err" role="status">{outcome.line}</p>}
            {outcome && outcome.sessionId && <p className="sol-note">{outcome.sessionId}</p>}
            <div className="sol-actions">
              <button type="button" className="sol-btn" onClick={() => { setOutcome(null); setStep('consent'); }}>{BUTTONS.connect}</button>
            </div>
          </>
        )}
        {step === 'consent' && (
          <>
            <h1 className="sol-title">{roomLabel('number')}</h1>
            <h2 className="sol-heading">{FLOW.consentHead}</h2>
            <p className="sol-empty">{FLOW.sharedWay}</p>
            <p className="sol-empty">{FLOW.movedWay}</p>
            <p className="sol-note">{FLOW.personalNumber}</p>
            <p className="sol-note">{FLOW.whoPays}</p>
            <div className="sol-actions">
              <button type="button" className="sol-btn" onClick={() => { void go('shared'); }}>{FLOW.sharedGo}</button>
              <button type="button" className="sol-btn" onClick={() => setStep('confirm')}>{FLOW.movedGo}</button>
              <button type="button" className="sol-btn" onClick={() => setStep('room')}>{FLOW.cancel}</button>
            </div>
          </>
        )}
        {step === 'confirm' && (
          <>
            <h1 className="sol-title">{roomLabel('number')}</h1>
            <p className="sol-empty">{FLOW.movedConfirm}</p>
            <p className="sol-note">{FLOW.whoPays}</p>
            <div className="sol-actions">
              <button type="button" className="sol-btn" onClick={() => { void go('moved'); }}>{FLOW.movedConfirmGo}</button>
              <button type="button" className="sol-btn" onClick={() => setStep('room')}>{FLOW.cancel}</button>
            </div>
          </>
        )}
        {step === 'working' && (
          <>
            <h1 className="sol-title">{roomLabel('number')}</h1>
            <p className="sol-empty" role="status">{FLOW.connecting}</p>
          </>
        )}
      </section>
      <SolutionsStyles />
    </WorklistShell>
  );
}
