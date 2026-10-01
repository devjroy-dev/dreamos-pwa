'use client';
// app/vendor/(shell)/payment-reminders/page.tsx
// BLOCK 19 · G3.4 — THE PAYMENT REMINDERS ROOM (R-40.1's R5).
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS ROOM HAS EXACTLY ONE CONTROL, AND ITS PLACEMENT IS THE ARGUMENT
// ═══════════════════════════════════════════════════════════════════════════
// The standing switch, and it sits BELOW the three bands rather than above them.
// A vendor reads what has already happened before she is offered a lever — the
// same reason a bank statement does not open with a transfer button.
//
// The send itself is NOT here. The first reminder on every invoice is her own
// tap on the INVOICE RECORD, where the milestone she is chasing is in front of
// her. A send control on this room would be a second door onto an act that needs
// a milestone chosen, and it would have to ask her which one — a decision the
// record has already made by being open.
//
// ── THE FRAME IT IS BUILT TO ──────────────────────────────────────────────
// `docs/mocks/payment-reminders-mock.html` @ `d96d9bc`, frames `P1-room`,
// `P2-empty`, `P3-dark`. Every string is in `lib/worklist/paymentReminders.ts`.
// Rows #3/#6/#7 were AMENDED at the veto — Sent, not Landed — and that copy home
// carries the founder's reasoning at the site.
//
// ── ONE READ AND ONE WRITE, BOTH THE DOOR'S ───────────────────────────────
// `GET /api/v2/vendor/reminders` and `PATCH .../settings`, addressed through
// `API.paymentReminders()` and `API.reminderSettings()` and never by a
// hand-written path. The wedding-pages seat's e-8 records what ignoring that
// rule costs: a hand-written path that 404'd on the founder's walk.
//
// ── R-38.2 · THE FRAME RENDERS FIRST ──────────────────────────────────────
// The bands are drawn before the fetch resolves, and a failed read leaves the
// room standing with one sentence rather than an empty page.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/v2/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, patchJson } from '@/lib/vendor/api/_base';
import { API } from '@/v2/lib/solutions/routes';
import { Body, Group, Row, Head, FR_CSS } from '@/v2/components/worklist/RoomRows';
// CE-47 L4b (FE-7): the switch row's own pieces; tokens only.
const PR2_CSS = `.pr2-swrow{min-height:56px}.pr2-line{margin:0;padding:0 16px 12px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.wl button.pr2-sw[data-tap44]{position:relative;width:52px;height:32px!important;min-height:0!important;border-radius:999px;border:1px solid var(--atelier-card-border);background:var(--atelier-card-bg);padding:0}
.pr2-sw span{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:var(--atelier-ink-mute);transition:left .15s}
.wl button.pr2-sw.on[data-tap44]{background:var(--role-primary);border-color:var(--role-primary)}.pr2-sw.on span{left:23px;background:var(--role-on-primary)}
.pr2-sw::after{content:'';position:absolute;inset:-6px -4px}.pr2-sw:disabled{opacity:.5}`;
import { PR, reminderRs, reminderDate, reminderDetail } from '@/v2/lib/worklist/paymentReminders';
import type { PaymentRemindersRoom } from '@/lib/solutions/types';

export default function PaymentRemindersPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <PaymentRemindersScreen />;
}

function PaymentRemindersScreen() {
  const [room, setRoom]     = useState<PaymentRemindersRoom | null>(null);
  const [failed, setFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      // ── F-40.180 · THE ENVELOPE IS FLAT, AND THE FIRST CUT INVENTED A WRAPPER ──
      // `src/lib/response.js:2` is `res.json({ ok: true, ...payload })` — it SPREADS
      // the payload at the top level. There is no `data` key anywhere in this estate;
      // the G2 room reads `r.googleReviews`, and this door's fields arrive beside `ok`.
      // The first cut typed `{ ok, data }` from habit, so `setRoom(undefined)` ran and
      // the guard below let it render. That was a white screen on production.
      // The field NAMES were derived from the door. The WRAPPER was not, and a shape
      // half-derived is a shape guessed.
      const r = await getJson<{ ok: boolean } & PaymentRemindersRoom>(API.paymentReminders());
      // ⚠ AND THE READ IS VALIDATED BEFORE IT IS TRUSTED. A door that answers 200 with
      // a body this room cannot use is a FAILED read, not a successful one — the
      // distinction the first cut collapsed.
      if (!r || !Array.isArray(r.asked) || !r.sending) { setFailed(true); return; }
      setRoom({
        asked: r.asked, sent_count: r.sent_count, due: r.due ?? [],
        auto_send: !!r.auto_send, sending: r.sending, window_days: r.window_days,
      });
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const asked = room?.asked ?? [];
  const due   = room?.due ?? [];
  const sent  = asked.filter((a) => a.sent);

  // ── THE GATE, REPORTED RATHER THAN RE-DERIVED ───────────────────────────
  // `sending.open` is the BACKEND's answer. This side never computes it from a
  // flag it cannot see, and never guesses from the presence of rows.
  const sendingOpen = room?.sending.open ?? false;
  const approved    = room?.sending.approved ?? false;

  /**
   * THE SWITCH.
   *
   * ⚠ IT IS INERT WHEN THE GATE IS SHUT, AND IT IS STILL DRAWN.
   * Arming a control that cannot act is the lying-control class (R-G11c.8's
   * lineage). Hiding it would be worse — she would not learn the feature exists.
   * So it renders, it says why it cannot act, and the tap does nothing.
   *
   * The optimistic write is deliberate and bounded: the state flips at once and
   * REVERTS on refusal. A switch that waits on a round trip feels broken on a
   * phone; a switch that keeps a value the door rejected is lying.
   */
  const toggle = useCallback(async () => {
    if (!room || saving || !sendingOpen) return;
    const next = !room.auto_send;
    setSaving(true);
    setRoom({ ...room, auto_send: next });
    try {
      await patchJson<{ ok: boolean }>(API.reminderSettings(), { auto_send: next });
    } catch {
      setRoom({ ...room, auto_send: !next });   // the door said no; the glass follows
    } finally {
      setSaving(false);
    }
  }, [room, saving, sendingOpen]);

  return (
    <WorklistShell title={PR.roomTitle}>
      {/* ── F-40.180 · `!== null` IS NOT A GUARD ────────────────────────────
          `undefined !== null` is TRUE, so a read that produced nothing fell
          straight through the old test and rendered. R-38.2 as the cell now
          states it: on a bad read a room shows its ONE standing sentence and
          nothing else. Both tests below are truthiness, so neither null nor
          undefined can reach the markup. */}
      {!room && !failed ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {failed ? (
        <div className="pr-room"><p className="pr-note">{PR.unavailable}</p></div>
      ) : null}

      {room ? (
        <Body>
          {/* CE-47 L4b (FE-7): FE-6's approved frame (board 9) in RoomRows. The switch is its own row, first; it stays
              inert while sending is shut, and beneath it EITHER its state sentence OR the dark line, as before. "Scheduled"
              only when the switch is on and sending is open (then a due reminder will go out); rows open nothing, as today. */}
          <div className="fr-group">
            <div className="fr-row pr2-swrow">
              <span className="fr-t">{PR.switchLabel}</span>
              <span className="fr-aside">
                <button type="button" role="switch" aria-checked={room.auto_send} aria-label={PR.switchLabel} data-tap44=""
                  className={`pr2-sw${room.auto_send ? ' on' : ''}`} onClick={toggle} disabled={!sendingOpen || saving}><span /></button>
              </span>
            </div>
            <p className="pr2-line">{!sendingOpen ? (approved ? PR.darkNote : PR.darkNotFiled) : (room.auto_send ? PR.switchOn : PR.switchOff)}</p>
          </div>
          {due.length > 0 ? (<>
            <Head text={PR.sectionDue} count={due.length} />
            <Group>{due.map((d) => (
              <Row key={d.milestone_id} title={d.client || '\u2014'} facts={[reminderRs(d.amount_due), d.due_date ? PR.dueOn(reminderDate(d.due_date)) : ''].filter(Boolean).join(' \u00b7 ')}
                pill={room.auto_send && sendingOpen ? { text: PR.scheduled, tone: 'warn' } : null} />))}</Group>
          </>) : null}
          {asked.some((a) => !a.sent) ? (<>
            <Head text={PR.sectionAsked} count={asked.filter((a) => !a.sent).length} />
            <Group>{asked.filter((a) => !a.sent).map((a) => (
              <Row key={a.id} title={a.client || '\u2014'} facts={`${reminderDetail(a.milestone, a.amount_due)} \u00b7 ${reminderDate(a.asked_at)}`} pill={{ text: PR.askedState, tone: 'plain' }} />))}</Group>
          </>) : null}
          {sent.length > 0 ? (<>
            <Head text={PR.sectionSent} count={sent.length} />
            <Group>{sent.map((a) => (
              <Row key={`s-${a.id}`} title={a.client || '\u2014'} facts={`${reminderDetail(a.milestone, a.amount_due)} \u00b7 ${reminderDate(a.asked_at)}`} pill={{ text: PR.sentState, tone: 'ok' }} />))}</Group>
            <p className="fr-empty" style={{ marginTop: 8 }}>{PR.sentNote}</p>
          </>) : null}
          {asked.length === 0 && due.length === 0 ? (<><Head text={PR.emptyHead} /><p className="fr-empty">{PR.emptyBody}</p></>) : null}
          <style>{FR_CSS + PR2_CSS}</style>
        </Body>
      ) : null}

      <style>{`
/* THE LEADS-CARD IDIOM, transcribed from the Google-reviews room property for
   property. The Block 19 rooms are one room with different rows, and a second
   set of metrics is how they start to drift. Two rules are new and each earns it:
   .pr-switch is the estate’s first CONTROL inside a room band, so it takes the
   row’s metrics and adds only what a button needs; .pr-swstate is its state word.
   ⚠ NO BACKTICKS IN THIS BLOCK. It is a template literal, and a backtick in a
   CSS comment closes the string — the G2 seat’s first cut failed tsc with eleven
   errors none of which mentioned a backtick. */
.pr-room{padding-top:24px;padding-bottom:32px}
.pr-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px;display:flex;justify-content:space-between}
.pr-sec span{font-variant-numeric:lining-nums tabular-nums}
.pr-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;width:100%;text-align:left;
        background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:12px;
        padding:12px 16px;margin-bottom:var(--wl-step)}
.pr-rprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.pr-rdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:4px;font-variant-numeric:lining-nums tabular-nums}
.pr-rstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap;padding-top:4px}
.pr-rstate.live{color:var(--atelier-accent-text)}
.pr-note{font:var(--wl-t5);color:var(--atelier-ink-fade);line-height:1.5;text-transform:none;letter-spacing:0;margin:4px 0 0;max-width:40ch}
.pr-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:56px 0 32px}
.pr-eh{font:var(--wl-t2);color:var(--atelier-ink)}
.pr-ep{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:250px}
.pr-switch{display:flex;align-items:center;justify-content:space-between;column-gap:12px;width:100%;text-align:left;
           background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:12px;
           padding:12px 16px;margin-bottom:var(--wl-step)}
.pr-switch:disabled{opacity:.55}
.pr-swstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap}
.pr-swstate.on{color:var(--atelier-accent-text)}
      `}</style>
    </WorklistShell>
  );
}
