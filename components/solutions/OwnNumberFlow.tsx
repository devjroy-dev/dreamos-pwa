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
// status   CE-46 G6-4: the number in a box (the number, its state line, its way line) and ONE control under it:
//          Remove this number -> RemoveNumberSheet (its own inventory). Not drawn for migrated_out or pending.
//          A refusal is stated under the box (FLOW.removeRefused), the box unchanged (F-a (a)).
// room     CE-46 G6-4 S6: after a shared-way removal, FLOW.finishInApp above Connect until Meta's PARTNER_REMOVED (F-c).
// The moved way is therefore stated twice before anything opens (§7b constraint 1,
// c-45.30): once on the consent screen, once on its own screen.
//
// ⚠ NO BYTE IS TYPED HERE. Every word is FLOW's (the founder's, when it lands),
// or the shell's approved ones (NUMBER, COPY, CHIPS, BUTTONS, roomLabel). The
// only strings drawn that are not copy are DATA: her display number and, after a
// Meta error, the session id Meta gave her for support.
//
// ⚠ NO PERSONA NAME ANYWHERE ON THIS SCREEN (R-37.70, b40 C32).
import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { SolutionsStyles } from '@/components/solutions/SolutionsPieces';
import { BUTTONS, CHIPS, COPY, roomLabel } from '@/lib/solutions/copy';
import { NUMBER } from '@/lib/worklist/ownNumber';
import { FLOW, withNumber } from '@/lib/worklist/ownNumberFlow';
import { RemoveNumberSheet } from '@/components/solutions/RemoveNumberSheet';
import { postJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { asNumberLine, asRemoved } from '@/lib/vendor/ownNumberDoor';
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

// CE-45 IGD-1 cut 1 · S1 (the chair, 25 Sept 2026, R-45.27): two optional props so ONE shell holds the room's two sections.
// `sectionHead` is drawn under the room's title in every branch; `after` is drawn after G6's section inside the same shell.
// Both absent, this component renders exactly what it rendered at d78461c7. G6's words and steps are unchanged.
export function OwnNumberFlow({ room, sectionHead, after }: { room: OwnNumberRoom; sectionHead?: string; after?: ReactNode }) {
  const head = sectionHead ? <h2 className="sol-heading">{sectionHead}</h2> : null;
  const [step, setStep] = useState<Step>('room');
  const [outcome, setOutcome] = useState<Outcome>(null);
  const busy = useRef(false);
  const door = room.door;
  // CE-46 G6-4 · the remove sheet: asking, then removing; its host is the nearest shell scope (SignOutSheet's callback ref).
  const [sheet, setSheet] = useState<null | 'asking' | 'removing'>(null);
  const [refused, setRefused] = useState(false);
  const [host, setHost] = useState<Element | null>(null);
  const anchorRef = useCallback((el: HTMLElement | null) => { setHost(el ? (el.closest('[data-wl-mode]') ?? document.body) : null); }, []);
  const removeNow = async () => {
    if (busy.current || !door || !door.number) return;
    busy.current = true;
    setSheet('removing');
    try {
      const res = await postJson<Record<string, unknown>>(API.ownNumberRemove(), {});
      const removed = res && res.ok === true ? asRemoved(res.removed) : undefined;
      if (res && res.ok === true && removed !== undefined) { setSheet(null); setRefused(false); setStep('room'); room.setDoor({ ...door, number: null, removed }); return; }
      setRefused(true); setSheet(null);
    } catch {
      setRefused(true); setSheet(null);
    } finally {
      busy.current = false;
    }
  };

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
    const removable = n.status === 'active' || n.status === 'suspended';
    return (
      <WorklistShell title={roomLabel('number')}>
        <section className="sol-surface" data-own-number="status" data-status={n.status} ref={anchorRef}>
          {chip && <p className="sol-kicker">{chip}</p>}
          {head}
          <div className="on-box" data-way={n.way}>
            <p className="on-number">{n.display_number}</p>
            <p className="on-state">{STATE_LINE[n.status]}</p>
            {n.status !== 'migrated_out' && <p className="on-way">{n.way === 'moved' ? FLOW.wayMoved : FLOW.wayShared}</p>}
          </div>
          {refused && <p className="sol-err on-refused" role="status">{FLOW.removeRefused}</p>}
          {removable && (
            <div className="sol-actions">
              <button type="button" className="sol-btn" onClick={() => { setRefused(false); setSheet('asking'); }}>{FLOW.remove}</button>
            </div>
          )}
        </section>
        {sheet && host && (
          <RemoveNumberSheet host={host} number={n.display_number} way={n.way} working={sheet === 'removing'}
            onCancel={() => setSheet(null)} onConfirm={() => { void removeNow(); }} />
        )}
        {after}
        <SolutionsStyles />
        <style>{BOX_CSS}</style>
      </WorklistShell>
    );
  }

  return (
    <WorklistShell title={roomLabel('number')}>
      <section className="sol-surface" data-own-number={step}>
        {step === 'room' && (
          <>
            <p className="sol-kicker">{CHIPS.not_connected}</p>
            {head}
            <FinishInAppLine door={door} />
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
            {head}
            <h2 className="sol-heading">{FLOW.consentHead}</h2>
            {/* FE_2 · the consent gap (the founder, on the screens): .sol-can is a flex column with a 10px gap
                and no colour of its own, so the two ways read as two choices. No new style. */}
            <div className="sol-can">
              <p className="sol-empty">{FLOW.sharedWay}</p>
              <p className="sol-empty">{FLOW.movedWay}</p>
            </div>
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
            {head}
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
            {head}
            <p className="sol-empty" role="status">{FLOW.connecting}</p>
          </>
        )}
      </section>
      {after}
      <SolutionsStyles />
      <style>{BOX_CSS}</style>
    </WorklistShell>
  );
}

/** CE-46 G6-4 · S6 (F-c): after a shared-way removal, until Meta's PARTNER_REMOVED. Drawn by the flow AND by the shell (door shut). */
export function FinishInAppLine({ door }: { door: OwnNumberRoom['door'] }) {
  const r = door && door.removed;
  if (!r || !r.finish_in_app) return null;
  return (
    <>
      <p className="on-finish" data-s6="finish-in-app">{withNumber(FLOW.finishInApp, r.display_number)}</p>
      <style>{FINISH_CSS}</style>
    </>
  );
}

// CE-46 G6-4 · THE BOX. Tokens only; rungs only (the number at t2: one t1 per room, the head's, R-38.4).
// ⚠ NO BACKTICKS BELOW THIS LINE: the CSS is a template literal.
const BOX_CSS = `
.on-box{border:.5px solid var(--atelier-card-border);background:var(--atelier-card-bg);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:6px}
.on-number{font:var(--wl-t2);color:var(--atelier-ink);margin:0 0 4px;font-variant-numeric:tabular-nums;white-space:nowrap}
.on-state{font:var(--wl-t3);color:var(--atelier-ink-soft);margin:0;max-width:46ch}
.on-way{font:var(--wl-t4);color:var(--atelier-ink-mute);margin:0}
.on-refused{margin:12px 0 0}
`;
const FINISH_CSS = `
.on-finish{font:var(--wl-t3);color:var(--role-caution);margin:0 0 12px;max-width:46ch;padding:12px;border:.5px solid var(--role-caution);border-radius:12px}
`;
