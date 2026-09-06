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
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson, patchJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { PR, reminderDate, reminderDetail } from '@/lib/worklist/paymentReminders';
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
      const r = await getJson<{ ok: boolean; data: PaymentRemindersRoom }>(API.paymentReminders());
      setRoom(r.data);
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
      {room === null && !failed ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {failed ? (
        <div className="pr-room"><p className="pr-note">{PR.unavailable}</p></div>
      ) : null}

      {room !== null ? (
        <div className="pr-room">

          {/* ── ASKED ─────────────────────────────────────────────────────
              The empty state REPLACES this band rather than showing `Asked 0`
              above two lines of explanation. A zero with a heading is a room
              reporting on itself; the empty state is the room. */}
          {asked.length > 0 ? (
            <>
              <div className="pr-sec">{PR.sectionAsked}<span>{asked.length}</span></div>
              {asked.map((a) => (
                <div className="pr-row" key={a.id}>
                  <div>
                    {/* HER CLIENT'S NAME OR AN EM DASH. The door sends null where
                        the name is genuinely absent — including when the invoice
                        itself is gone, since 0139's FK is ON DELETE SET NULL and
                        the reminder OUTLIVES it. An invented name on a vendor's
                        screen is a fact she cannot check. */}
                    <span className="pr-rprimary">{a.client || '\u2014'}</span>
                    <span className="pr-rdetail">{reminderDetail(a.milestone, a.amount_due)}</span>
                  </div>
                  <div className="pr-rstate">{PR.askedState} {reminderDate(a.asked_at)}</div>
                </div>
              ))}
            </>
          ) : null}

          {asked.length === 0 ? (
            <div className="pr-empty">
              <span className="pr-eh">{PR.emptyHead}</span>
              <span className="pr-ep">{PR.emptyBody}</span>
            </div>
          ) : null}

          {/* ── SENT ──────────────────────────────────────────────────────
              `sent` is `wamid IS NOT NULL`, computed by the door. The note is
              NOT optional decoration: without it, `Sent 2` is read as "she got
              it", which is a claim nothing on this path can support. Rendered
              only once something has been asked — a Sent band above an empty
              Asked band would be counting deliveries of nothing. */}
          {asked.length > 0 ? (
            <>
              <div className="pr-sec" style={{ marginTop: 22 }}>{PR.sectionSent}<span>{sent.length}</span></div>
              {sent.map((a) => (
                <div className="pr-row" key={`s-${a.id}`}>
                  <div>
                    <span className="pr-rprimary">{a.client || '\u2014'}</span>
                    <span className="pr-rdetail">{a.milestone}</span>
                  </div>
                  <div className="pr-rstate live">{PR.sentState} {reminderDate(a.asked_at)}</div>
                </div>
              ))}
              <p className="pr-note">{PR.sentNote}</p>
            </>
          ) : null}

          {/* ── DUE ───────────────────────────────────────────────────────
              Pending milestones inside the window with no reminder row. The
              door computes the window from `state = 'pending'` and the IST day;
              this side renders what it is handed and derives no dates. */}
          {due.length > 0 ? (
            <>
              <div className="pr-sec" style={{ marginTop: 22 }}>{PR.sectionDue}<span>{due.length}</span></div>
              {due.map((d) => (
                <div className="pr-row" key={d.milestone_id}>
                  <div>
                    <span className="pr-rprimary">{d.client || '\u2014'}</span>
                    <span className="pr-rdetail">{reminderDetail(d.milestone, d.amount_due)}</span>
                  </div>
                  <div className="pr-rstate">{PR.sectionDue} {reminderDate(d.due_date)}</div>
                </div>
              ))}
            </>
          ) : null}

          {/* ── SENDING ───────────────────────────────────────────────────
              The switch, and beneath it EITHER its own state sentence OR the
              dark line — never both, and never a state sentence that describes
              a cadence which cannot happen. */}
          <div className="pr-sec" style={{ marginTop: 22 }}>{PR.sectionSending}</div>
          <button
            type="button"
            className="pr-switch"
            onClick={toggle}
            disabled={!sendingOpen || saving}
            aria-pressed={room.auto_send}
          >
            <span className="pr-rprimary">{PR.switchLabel}</span>
            <span className={`pr-swstate${room.auto_send && sendingOpen ? ' on' : ''}`}>
              {room.auto_send ? PR.switchOnState : PR.switchOffState}
            </span>
          </button>
          <p className="pr-note">
            {!sendingOpen
              ? (approved ? PR.darkNote : PR.darkNotFiled)
              : (room.auto_send ? PR.switchOn : PR.switchOff)}
          </p>
        </div>
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
.pr-room{padding-top:20px;padding-bottom:28px}
.pr-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px;display:flex;justify-content:space-between}
.pr-sec span{font-variant-numeric:lining-nums tabular-nums}
.pr-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;width:100%;text-align:left;
        background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
        padding:13px 14px;margin-bottom:var(--wl-step)}
.pr-rprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.pr-rdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px;font-variant-numeric:lining-nums tabular-nums}
.pr-rstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap;padding-top:2px}
.pr-rstate.live{color:var(--atelier-accent-text)}
.pr-note{font:var(--wl-t5);color:var(--atelier-ink-fade);line-height:1.5;text-transform:none;letter-spacing:0;margin:2px 0 0;max-width:40ch}
.pr-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:56px 0 30px}
.pr-eh{font:var(--wl-t2);color:var(--atelier-ink)}
.pr-ep{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:250px}
.pr-switch{display:flex;align-items:center;justify-content:space-between;column-gap:12px;width:100%;text-align:left;
           background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
           padding:13px 14px;margin-bottom:var(--wl-step)}
.pr-switch:disabled{opacity:.55}
.pr-swstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap}
.pr-swstate.on{color:var(--atelier-accent-text)}
      `}</style>
    </WorklistShell>
  );
}
