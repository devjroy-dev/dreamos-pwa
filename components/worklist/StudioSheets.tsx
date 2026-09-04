"use client";
// components/worklist/StudioSheets.tsx — THE FOUR SHEETS AND THE CONFIRM.
// CE-39 · road step 2c-Studio, built to `docs/mocks/studio-sheets-mock.html`
// (sha256 665b4f3496b8, ratified whole 2026-09-01), frames E1-member, E2-task,
// E3-pay, E4-settle, E6-cancel.
//
// ── WHAT THIS FILE IS FOR ───────────────────────────────────────────────────
// 2b-2 crossed the three tabs as LISTS and left every write outside the shell:
// the `+` on each tab pushed `/vendor/studio/*` and the vendor lost the
// masthead to make a change. F-39.30 was OPEN-AS-NARROWED for exactly that.
// These are the surfaces that close it. Phase 7 arm (a) retires `/vendor/*`, so
// this was never polish — the ten verbs either crossed or died with the tree.
//
// ── ⚠ THE SHEETS DRAW NOTHING OF THEIR OWN ─────────────────────────────────
// Every rule in SHEET_CSS reads a token that already exists. No literal colour,
// no literal type size, no new rung. `--role-sheet` is the sheet surface role;
// `--atelier-input-border` is R-S3's 3:1 control edge, which is the ONLY thing
// that says 「field」 on Chalk (the fill is 1.09:1 over the white sheet and
// cannot help). The corner is the shell's 3px, NOT the 16px the /vendor sheets
// wear: a sheet that crosses into the shell wears the shell's corner.
//
// ── THE SHEET IS INSIDE THE FRAME, NOT OVER THE PAGE ───────────────────────
// `position:absolute` against the room's own stacking context, so the masthead
// and the three tabs stay visible behind the scrim. That is the whole argument
// for the crossing and it is a property, not a decoration. The nav IS covered
// while a sheet is open, ratified at E1: a modal owns the screen until it is
// dismissed; what it may not do is unmount the room.
//
// ── ⚠ NO ACTIVE/INACTIVE CONTROL ON THE MEMBER SHEET, BY RULING ────────────
// `team_members.active` is `boolean NOT NULL` and `src/api/vendor/studio/
// team.js:48` filters `.eq('active', true)` UNCONDITIONALLY — the handler reads
// no `req.query` and `fetchTeam()` sends no parameter. A control that switched a
// member off would strand them: they would vanish from the only list that can
// reach them and nothing in the estate could bring them back. That is F-2b2.1's
// premise one layer up, and `C80` guards the row's half of it. An
// 「inactive members」 view is unbuilt and unruled and belongs to a later seat.
import { useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { formatRs, formatLongDate } from '@/lib/vendor/format';
import type { TeamMember, TeamTask, TeamPayment } from '@/lib/vendor/types/vendor';
import type { MemberAssignment } from '@/lib/vendor/api/roster';
import { confirmationWord, ASSIGNMENTS_ERROR_MSG } from '@/lib/vendor/assignmentWords';
// THE FUNCTION PICKER'S TWO BYTES ARE `settleWords`', NOT THIS ROOM'S. They
// already carry the founder's YES for the /vendor stub and the same vendor reads
// the same question in both trees until Phase 7 retires one of them. Re-minting
// them in `copy.ts` would be two homes for one word, mid-crossing.
import { FUNCTION_LABEL, NO_WEDDING_OPTION } from '@/lib/vendor/settleWords';
import { slotWord, hhmm } from '@/lib/vendor/slotWords';
// F-2c.w4: the crew role's ONE HOME. What is stored is what is shown, and a
// value this picker does not offer is carried rather than dropped.
import { roleOptionsFor } from '@/lib/vendor/roleWords';

// ── THE ENUMERATIONS ARE THE DOOR'S, TRANSCRIBED ONCE ──────────────────────
// `ROLES` mirrors the option set the /vendor team page has always offered; the
// column is free text (`role text`, no CHECK), so this list is a PICKER and not
// a constraint — widening it needs no migration, and that asymmetry is worth
// stating because the two below are the opposite case.
//
// ⚠ `PRIORITIES` AND `PAID_VIA`: `team_tasks_priority_check` enumerates exactly
// low/normal/high/urgent, so PRIORITIES is a DB constraint mirrored in a picker
// and the next person who edits it owes a migration. `paid_via` is `text` with
// NO check — these four are a convention, not a constraint.
//
// The value is the machine token and the label is title-cased FROM it where the
// two differ only by shape; where they differ by words (`second_shooter` →
// `Second shooter`) both are written, because deriving a label by replacing
// underscores is how `makeup_artist` becomes 「Makeup artist」 in one place and
// 「Makeup Artist」 in another.
/** One option shape for every picker in this file. Declared rather than inferred
    because a list that starts with a literal label infers that literal as its
    TYPE, and the roster rows appended after it then do not fit. */
export type Opt = { v: string; l: string };

// ⚠ THE LOCAL `ROLES` LIST IS RETIRED — F-2c.w4. It stored MACHINE TOKENS
// (`second_shooter`) into a free-text column and offered no option for values it
// did not know, so a member whose role was `Decor` opened as 「No role」 and lost
// `Decor` on the next Save. Witnessed on the founder's walk, on a real row.
// The vocabulary lives at `lib/vendor/roleWords.ts` and the options are built
// PER MEMBER, because carrying the member's own value is the half that stops the
// picker deleting it.

const PRIORITIES: readonly Opt[] = [
  { v: 'low',    l: 'Low' },
  { v: 'normal', l: 'Normal' },
  { v: 'high',   l: 'High' },
  { v: 'urgent', l: 'Urgent' },
];
const PAID_VIA: readonly Opt[] = [
  { v: 'upi',   l: 'UPI' },
  { v: 'cash',  l: 'Cash' },
  { v: 'bank',  l: 'Bank transfer' },
  { v: 'other', l: 'Other' },
];

/** The scrim, the head and the panel. One shape, five callers, so a sheet cannot
    acquire a different corner, a different scrim or a different way out by being
    written later.

    ── F-2c.w1 · THE SHEET YOU COULD NOT LEAVE  [founder's walk, 2026-09-02] ──
    THE DEFECT, AND IT SHIPPED: `MemberSheet`'s foot is `Remove | Save` and it
    carried no Cancel. The other four sheets have one, so nobody noticed the
    member sheet did not — and the member sheet is the ONLY full-height one. A
    vendor who opened a crew member just to read his assignments could leave only
    by WRITING (Save) or DESTROYING (Remove).

    ⚠ THE SCRIM DID NOT RESCUE IT, AND THE MOCK'S CAPTION SAID IT WOULD. E1's
    caption claimed the masthead and the tabs stay reachable behind the scrim. On
    glass the member sheet's top edge sits directly under the masthead, so there
    is no scrim left to hit. The claim described the SHORT sheets and was written
    over the tall one.

    ⚠ AND MOCK-FIRST DID NOT CATCH IT, BECAUSE THE MOCK CARRIED IT. Frame E1 drew
    REMOVE + SAVE and no Cancel, was ratified, and was built to faithfully. A
    ratified frame proves what a surface LOOKS like; an exit is not something you
    see, it is something you go looking for. c-2c.s5 is the executor's.

    THE CURE IS ARM (b), FOUNDER-RULED: the dismiss lives in the HEAD, not the
    foot. Not beside `Remove` — an escape hatch one thumb-width from a
    destructive verb on a full-height sheet is how a crew member gets deleted at
    1am.

    ⚠ IT LIVES ON `Sheet`, SO ALL FIVE GET IT, and that is deliberate rather than
    tidy. The member sheet is the acute case but the class is 「a sheet whose only
    exits are its own verbs」, and putting the fix on one caller would leave the
    next tall sheet to rediscover it. The four short sheets keep their foot
    `Cancel` as well: two ways out of a form is not a defect, and removing a byte
    the founder already vetoed to buy symmetry would be trading his ruling for
    tidiness. */
function Sheet({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <>
      {/* The scrim is a BUTTON, not a div with a click handler: a dismissal a
          keyboard cannot reach is a sheet a keyboard cannot leave. It stays —
          it is the right gesture on the short sheets — but it is no longer the
          ONLY way out, because on the tall one it is not reachable at all. */}
      <button type="button" className="wl-shscrim" aria-label={COPY.studioCancel} onClick={onClose} />
      <div className="wl-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="wl-shhead">
          <div className="wl-shtitle">{title}</div>
          {/* THE GLYPH IS HIDDEN FROM THE ACCESSIBLE TREE AND THE NAME IS THE
              VETOED BYTE. A control announced as 「times」 or 「multiplication
              sign」 is a control a screen reader cannot describe, and inventing
              a word here would be a sixth home for 「Cancel」. */}
          <button type="button" className="wl-shx" aria-label={COPY.studioCancel} onClick={onClose}>
            <span aria-hidden>&times;</span>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="wl-fld"><span className="wl-fl">{label}</span>{children}</label>;
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: readonly Opt[];
}) {
  return (
    <select className="wl-fi" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

// ── E1 · MEMBER ─────────────────────────────────────────────────────────────
export type MemberDraft = {
  name: string; role: string; phone: string; rate: string; notes: string;
};
export function MemberSheet({
  editing, draft, setDraft, assignments, assignState, saving,
  onSave, onRemove, onSendPage, onRotate, onClose,
}: {
  editing: TeamMember | null;
  draft: MemberDraft;
  setDraft: (d: MemberDraft) => void;
  assignments: MemberAssignment[];
  assignState: 'loading' | 'ready' | 'failed';
  saving: boolean;
  onSave: () => void;
  onRemove: () => void;
  onSendPage: () => void;
  onRotate: () => void;
  onClose: () => void;
}) {
  // Rotation is irreversible and immediate, so it is asked before it is done —
  // the warning IS the reason the second tap exists. Carried from the /vendor
  // sheet unchanged in substance; only its bytes are sentence-cased.
  const [confirmRotate, setConfirmRotate] = useState(false);
  const canSave = draft.name.trim().length > 0;
  const set = (k: keyof MemberDraft) => (v: string) => setDraft({ ...draft, [k]: v });
  return (
    <Sheet title={editing ? COPY.studioSheetEditMember : COPY.studioSheetAddMember} onClose={onClose}>
      <Field label={COPY.studioFieldName}>
        <input className="wl-fi" value={draft.name} onChange={(e) => set('name')(e.target.value)} />
      </Field>
      <Field label={COPY.studioFieldRole}>
        <Select value={draft.role} onChange={set('role')} options={roleOptionsFor(draft.role)} />
      </Field>
      <Field label={COPY.studioFieldPhone}>
        <input className="wl-fi" value={draft.phone} onChange={(e) => set('phone')(e.target.value)} />
      </Field>
      {/* `inputMode` rather than `type="number"`: a rate is a quantity the vendor
          types, and a spinner on a money field invites a stray scroll to edit it. */}
      <Field label={COPY.studioFieldRate}>
        <input className="wl-fi wl-fnum" inputMode="numeric" value={draft.rate}
               onChange={(e) => set('rate')(e.target.value)} />
      </Field>
      <Field label={COPY.studioFieldNotes}>
        <input className="wl-fi" value={draft.notes} onChange={(e) => set('notes')(e.target.value)} />
      </Field>

      {editing && (
        <>
          {/* ── ASSIGNMENTS · READ-ONLY, AND STRUCTURALLY SO ─────────────────
              The board is fetched per open rather than cached — the owner may
              have just assigned them elsewhere and a stale board is worse than
              a moment's spinner. It is a READ: assignment happens in the booking
              pickers through the events PATCH that routes to `eventWrite`, and a
              second write path to the calendar from a team sheet is exactly what
              the one-writer law forbids. THREE states, not two: loaded-and-empty
              and could-not-load are different facts. */}
          <div className="wl-shrule">
            <span className="wl-fl">{COPY.studioBlockAssignments}</span>
            {assignState === 'loading' ? <div className="wl-shnote" aria-busy="true" />
              : assignState === 'failed' ? <div className="wl-shnote wl-shbad">{ASSIGNMENTS_ERROR_MSG}</div>
              : assignments.length === 0 ? <div className="wl-shnote">{COPY.studioNoAssignments}</div>
              : assignments.map((a) => (
                  <div key={a.event_id} className="wl-asg">
                    <span className="wl-rprimary">
                      {[formatLongDate(a.date), slotWord(a.slot), hhmm(a.call_time)].filter(Boolean).join(' · ')}
                    </span>
                    <span className="wl-rdetail">
                      {[a.title, a.wedding, confirmationWord(a.confirmation)].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                ))}
          </div>

          <div className="wl-shrule">
            <span className="wl-fl">{COPY.studioBlockCrewPage}</span>
            <div className="wl-brow">
              <button type="button" className="wl-btn gho" onClick={onSendPage}>{COPY.studioSendPage}</button>
              <button type="button" className="wl-btn gho" disabled={saving}
                      onClick={() => setConfirmRotate(true)}>{COPY.studioRotateLink}</button>
            </div>
            {confirmRotate && (
              <>
                <p className="wl-shnote">{COPY.studioRotateWarning}</p>
                <div className="wl-brow">
                  <button type="button" className="wl-btn gho" disabled={saving}
                          onClick={() => setConfirmRotate(false)}>{COPY.studioCancel}</button>
                  <button type="button" className="wl-btn dan" disabled={saving}
                          onClick={() => { setConfirmRotate(false); onRotate(); }}>{COPY.studioRotateLink}</button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {!canSave && <p className="wl-shnote">{COPY.studioGateMember}</p>}
      <div className="wl-brow">
        {editing && (
          <button type="button" className="wl-btn dan" disabled={saving} onClick={onRemove}>{COPY.studioRemove}</button>
        )}
        <button type="button" className="wl-btn pri wl-btn2" disabled={!canSave || saving}
                onClick={onSave}>{COPY.studioSave}</button>
      </div>
    </Sheet>
  );
}

// ── E2 · TASK ───────────────────────────────────────────────────────────────
export type TaskDraft = {
  title: string; description: string; assignedTo: string; dueDate: string; priority: string;
};
export function TaskSheet({ draft, setDraft, members, saving, onCreate, onClose }: {
  draft: TaskDraft; setDraft: (d: TaskDraft) => void; members: TeamMember[];
  saving: boolean; onCreate: () => void; onClose: () => void;
}) {
  const canCreate = draft.title.trim().length > 0;
  const set = (k: keyof TaskDraft) => (v: string) => setDraft({ ...draft, [k]: v });
  // `Unassigned` is `teamUnassigned` — ONE key, and its consumers are now the
  // row detail in TeamTabs and this null choice. The /vendor tree spells its own
  // copy of the word at `app/vendor/studio/tasks/page.tsx:214`; that is a
  // different byte on a surface that retires at Phase 7, and it is left alone.
  const assignees: Opt[] = ([{ v: '', l: COPY.teamUnassigned }] as Opt[]).concat(
    members.map((m) => ({ v: m.id, l: m.name })),
  );
  return (
    <Sheet title={COPY.studioSheetNewTask} onClose={onClose}>
      <Field label={COPY.studioFieldTitle}>
        <input className="wl-fi" value={draft.title} onChange={(e) => set('title')(e.target.value)} />
      </Field>
      <Field label={COPY.studioFieldDescription}>
        <input className="wl-fi" value={draft.description} onChange={(e) => set('description')(e.target.value)} />
      </Field>
      <Field label={COPY.studioFieldAssignTo}>
        <Select value={draft.assignedTo} onChange={set('assignedTo')} options={assignees} />
      </Field>
      <Field label={COPY.studioFieldDueDate}>
        <input className="wl-fi" type="date" value={draft.dueDate} onChange={(e) => set('dueDate')(e.target.value)} />
      </Field>
      <Field label={COPY.studioFieldPriority}>
        <Select value={draft.priority} onChange={set('priority')} options={PRIORITIES} />
      </Field>
      {!canCreate && <p className="wl-shnote">{COPY.studioGateTask}</p>}
      <div className="wl-brow">
        <button type="button" className="wl-btn gho" onClick={onClose}>{COPY.studioCancel}</button>
        <button type="button" className="wl-btn pri wl-btn2" disabled={!canCreate || saving}
                onClick={onCreate}>{COPY.studioCreateTask}</button>
      </div>
    </Sheet>
  );
}

// ── E3 · LOG PAYMENT ────────────────────────────────────────────────────────
export type PayDraft = { memberId: string; eventId: string; amount: string; description: string };
export function PaySheet({ draft, setDraft, members, functions, suggestion, saving, onLog, onClose }: {
  draft: PayDraft; setDraft: (d: PayDraft) => void; members: TeamMember[];
  functions: readonly Opt[];
  /** The prefilled sentence, or null. Composed by the caller from the door's own
      words — this sheet never derives a number and never writes one. */
  suggestion: string | null;
  saving: boolean; onLog: () => void; onClose: () => void;
}) {
  const set = (k: keyof PayDraft) => (v: string) => setDraft({ ...draft, [k]: v });
  const canLog = draft.memberId.trim() !== '' && Number(draft.amount) > 0;
  return (
    <Sheet title={COPY.studioSheetLogPayment} onClose={onClose}>
      <Field label={COPY.studioFieldMember}>
        <Select value={draft.memberId} onChange={set('memberId')}
                options={([{ v: '', l: COPY.teamUnassigned }] as Opt[]).concat(members.map((m) => ({ v: m.id, l: m.name })))} />
      </Field>
      {/* THE FUNCTION PICKER, and 「no pick」 IS A LAWFUL ANSWER. The collab plane
          carries no event of its own, so rather than invent a linkage the sheet
          ASKS; an unpicked payout lands in the loose lane, which the by-wedding
          board renders as its own trailing group and never as an error. */}
      <Field label={FUNCTION_LABEL}>
        <Select value={draft.eventId} onChange={set('eventId')} options={functions} />
      </Field>
      <Field label={COPY.studioFieldAmount}>
        <input className="wl-fi wl-fnum" inputMode="numeric" value={draft.amount}
               onChange={(e) => set('amount')(e.target.value)} />
      </Field>
      {/* SUGGEST, NEVER COMMIT. The number that travels is `amount` — the field
          the vendor could edit — and never the suggestion object. Absence is
          NAMED by the caller rather than zeroed: an unfiled rate means unfiled,
          not Rs 0, which would read as a settled debt. */}
      {suggestion && <p className="wl-shnote">{suggestion}</p>}
      <Field label={COPY.studioFieldDescription}>
        <input className="wl-fi" value={draft.description} onChange={(e) => set('description')(e.target.value)} />
      </Field>
      {!canLog && <p className="wl-shnote">{COPY.studioGatePayment}</p>}
      <div className="wl-brow">
        <button type="button" className="wl-btn gho" onClick={onClose}>{COPY.studioCancel}</button>
        <button type="button" className="wl-btn pri wl-btn2" disabled={!canLog || saving}
                onClick={onLog}>{COPY.studioLogPayment}</button>
      </div>
    </Sheet>
  );
}

// ── E4 · MARK PAID ──────────────────────────────────────────────────────────
export function SettleSheet({ payment, who, paidVia, setPaidVia, notes, setNotes, saving, onConfirm, onClose }: {
  payment: TeamPayment;
  /** WHO IS BEING PAID — passed in, because the raw row's joined member name is
      not on this type and a sheet may not go fetching one. F-2c.w6: the summary
      used to read `payment.description || 'Log payment'`, so a payment logged
      without a description confirmed itself as 「Log payment · Rs 5,000」 — the
      sheet's own title, standing in for the thing being settled. A fallback that
      names the FORM instead of the SUBJECT tells the vendor nothing about what
      his money is about to do. The name is the thing he recognises; the
      description is the extra, so absence just drops the second line. */
  who: string;
  paidVia: string; setPaidVia: (v: string) => void;
  notes: string; setNotes: (v: string) => void;
  saving: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Sheet title={COPY.studioSheetMarkPaid} onClose={onClose}>
      {/* The summary is the row's own two cells, restated so the vendor confirms
          a figure rather than a row id. `formatRs` is the estate's one money
          formatter — this surface composes no currency string of its own. */}
      <div className="wl-shsum">
        <span className="wl-rprimary">{[who, payment.description].filter(Boolean).join(' · ')}</span>
        <span className="wl-shfig">{formatRs(payment.amount_inr)}</span>
      </div>
      <Field label={COPY.studioFieldPaidVia}>
        <Select value={paidVia} onChange={setPaidVia} options={PAID_VIA} />
      </Field>
      {/* ABSENT MEANS UNCHANGED, and the door agrees: `mark-paid` writes `notes`
          only when it is a non-empty string (F-04.116's cure). An untouched box
          is not an instruction to erase a thread the vendor cannot see. */}
      <Field label={COPY.studioFieldNotes}>
        <input className="wl-fi" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>
      <div className="wl-brow">
        <button type="button" className="wl-btn gho" onClick={onClose}>{COPY.studioCancel}</button>
        <button type="button" className="wl-btn pri wl-btn2" disabled={saving}
                onClick={onConfirm}>{COPY.studioConfirmPayment}</button>
      </div>
    </Sheet>
  );
}

// ── E6 · CANCEL CONFIRM ─────────────────────────────────────────────────────
// The body says what the estate ACTUALLY does. `public.team_payments` has
// thirteen columns and none of them is `deleted_at`; the route sets
// `state='cancelled'` and the row survives, which is why the destructive verb
// here is `Cancel payment` and not `Delete`.
export function CancelPaymentConfirm({ saving, onConfirm, onClose }: {
  saving: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Sheet title={COPY.studioCancelPaymentTitle} onClose={onClose}>
      <p className="wl-shnote">{COPY.studioCancelPaymentBody}</p>
      <div className="wl-brow">
        <button type="button" className="wl-btn gho" onClick={onClose}>{COPY.studioCancelPaymentKeep}</button>
        <button type="button" className="wl-btn dan" disabled={saving}
                onClick={onConfirm}>{COPY.studioCancelPayment}</button>
      </div>
    </Sheet>
  );
}

// Every rule below is the ratified mock's own, at
// `docs/mocks/studio-sheets-mock.html`, frames E1/E2/E3/E4/E6. Tokens come from
// `lib/worklist/theme.ts` through the shell's scope — no literal colour and no
// literal type size, and no new rung is minted.
//
// The tabular-numeral pair is `BooksBody`'s law, restated because it bites the
// same way: `font: var(--wl-t1)` is the SHORTHAND and it RESETS
// font-variant-numeric, so the figure's `font` line and its numeral line are two
// rules and the numeral rule comes second.
export const SHEET_CSS = `
.wl-shscrim{position:absolute;inset:0;z-index:20;background:var(--role-scrim);border:none;padding:0}
.wl-sheet{position:absolute;left:0;right:0;bottom:0;z-index:21;background:var(--role-sheet);
          border-top:.5px solid var(--atelier-sheet-border);border-radius:3px 3px 0 0;
          padding:20px var(--wl-gutter) 28px;display:flex;flex-direction:column;gap:14px;
          max-height:100%;overflow-y:auto}
.wl-shhead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.wl-shtitle{font:var(--wl-t1);color:var(--atelier-ink)}
/* 44px is the tap floor, and the negative offsets pull the GLYPH back to the
   sheet's optical edge without shrinking the target underneath it. */
.wl-shx{width:44px;height:44px;margin:-10px calc(var(--wl-gutter) * -1 + 8px) -10px 0;flex:none;
        display:flex;align-items:center;justify-content:center;background:transparent;border:none;
        border-radius:3px;cursor:pointer;font:var(--wl-t2);line-height:1;color:var(--atelier-ink-mute)}
.wl-shx:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:-2px}
.wl-fld{display:block}
.wl-fl{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);
       display:block;margin-bottom:6px}
.wl-fi{width:100%;background:var(--atelier-input-bg);border:.5px solid var(--atelier-input-border);
       border-radius:3px;padding:11px 12px;font:var(--wl-t3);color:var(--atelier-ink);display:block;
       outline:none;box-sizing:border-box;-webkit-appearance:none;appearance:none}
.wl-fi:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-fnum{font-variant-numeric:lining-nums tabular-nums}
.wl-brow{display:flex;gap:8px}
/* .wl-btn / .wl-btn2 / :disabled / :focus-visible / .pri HOISTED at P7.2 Arm C into the shell's
   own scoped CSS (WorklistShell's SHELL_CSS), where .wl-tile and .wl-fab live. They were a
   shell-wide register scoped to one room; Storefront's bio call reads the same class now.
   Nothing else moved out of this sheet. */
.wl-btn.gho{border:.5px solid var(--atelier-card-border);color:var(--atelier-ink-soft)}
.wl-btn.dan{border:.5px solid var(--role-critical);color:var(--role-critical)}
.wl-shrule{border-top:.5px solid var(--atelier-card-border);padding-top:14px;
           display:flex;flex-direction:column;gap:10px}
.wl-shnote{font:var(--wl-t5);color:var(--atelier-ink-mute);line-height:1.5;margin:0}
.wl-shbad{color:var(--role-critical)}
.wl-shsum{background:var(--atelier-section-bg);border:.5px solid var(--atelier-card-border);
          border-radius:3px;padding:12px}
.wl-shfig{font:var(--wl-t1);color:var(--role-metal);display:block;margin-top:4px}
.wl-shfig{font-variant-numeric:lining-nums tabular-nums}
.wl-asg{border-left:2px solid var(--role-positive);padding-left:10px}
`;
