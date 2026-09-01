"use client";
// components/worklist/TeamTabs.tsx — TEAM, TASKS AND PAYMENTS AS ONE ROOM,
// AND SINCE CE-39 2c-Studio, ONE ROOM THAT WRITES.
//
// ── WHAT CHANGED AT 2c-STUDIO, AND WHY IT WAS NEVER POLISH ─────────────────
// 2b-2 landed arm D (a): the three lists rendered here, under the shell's
// masthead, and EVERY verb still left the shell for `/vendor/studio/*`. That was
// declared, not cured — F-39.30 OPEN-AS-NARROWED, card ⑥ in the founder's own
// language: 「tapping + opens the old studio page for that tab」.
//
// Phase 7 arm (a) retires `/vendor/*` at the flip. So those three exits were
// about to become dangling, and the verbs behind them were about to retire with
// a tree nobody meant to take them. This sitting is a FLIP PREREQUISITE.
//
// ⚠ THE ENDPOINTS DID NOT MOVE. Every verb below reaches the same
// `/api/v2/vendor/studio/*` route it always reached, through the same typed door
// in `lib/vendor/api/vendor.ts`. THIS IS A UI CROSSING, NOT A PLANE CROSSING —
// no route was widened and no second address space was minted. The only door
// that changed shape is `markPaymentPaid`, which stopped erasing a field the
// server was already sending (ruling 3).
//
// ── THE TEN VERBS, NOT NINE  [c-39.46] ─────────────────────────────────────
// team     addTeamMember · updateTeamMember · deleteTeamMember · rotateTeamMemberToken
// tasks    createTask · updateTask · deleteTask
// payments logPayment · markPaymentPaid · cancelPayment
//
// The tenth is `cancelPayment`. The 2b-2 read-first's table listed the SHEET
// verbs and missed the ROW action, so the charter said nine; the count was
// amended at this sitting's read-first. It had no typed door at all — its only
// caller built a bare `fetch` with the path inline and the bearer token dug out
// of `localStorage` — and a verb that dies at the flip is a vendor losing a
// control he had yesterday.
//
// ── ⚠ WHAT THIS ROOM STILL DOES NOT DO ─────────────────────────────────────
// `INTERIM_VENDOR_LINKS` DOES NOT SHRINK AT THIS CROSSING and that is ruled, not
// forgotten. `app/vendor/more/page.tsx:84` and `app/vendor/studio/page.tsx:28`
// still route into `/vendor/team-hub`, whose `STUDIO_ITEMS` points at all three
// studio pages — live readers in a tree that retires at Phase 7 and not before.
// So the three pages KEEP THEIR BODIES this sitting, the D-8 stubs wait for the
// flip's own sweep, and the set stays at seven. Deleting a fallback body to
// celebrate a crossing is how a crossing becomes an outage.
//
// ── THE TEAM ROW STILL CARRIES NO STATE WORD, AND NOW NO TOGGLE EITHER ─────
// `team_members.active` is `boolean NOT NULL` and `src/api/vendor/studio/
// team.js:48` filters `.eq('active', true)` unconditionally, so `active` is true
// on 100% of the rows this body can ever receive. F-2b2.1 struck the word from
// the row; the member sheet declines the CONTROL for the same reason one layer
// up — switching a member off would strand them where nothing can reach them
// again. `C80` asserts the absence of the word; `StudioSheets`' own header
// carries the argument for the absence of the toggle.
//
// ── THE FAB'S BEHAVIOUR CHANGED, ITS SEAT DID NOT ──────────────────────────
// It used to `router.push` the tab's `/vendor/studio/*` address. It now opens
// the tab's sheet. `Fab` still owns the geometry (C49 walks `app/w`'s whole
// import graph for it) and this file still draws none — what the button DOES is
// this room's business and where it SITS is the shell's.
//
// ── THE ROOM ADDS UP NOTHING ───────────────────────────────────────────────
// `BooksBody`'s standing holds: every figure on this surface is a row's own
// cell, the section counts are `list.length` — a count of what is rendered,
// which is not a derivation — and the Payments figures are each row's
// `amount_inr`. No total is composed here and none is asked for by the frames.
import { useCallback, useEffect, useState } from 'react';
import { COPY } from '@/lib/worklist/copy';
import { Fab } from '@/components/worklist/Fab';
import { WlToast } from '@/components/worklist/WlToast';
import { useToast } from '@/hooks/vendor/useToast';
import { formatRs, formatLongDate } from '@/lib/vendor/format';
import {
  fetchTeam, fetchTasks, fetchTeamPayments,
  addTeamMember, updateTeamMember, deleteTeamMember, rotateTeamMemberToken,
  createTask, updateTask, deleteTask,
  logPayment, markPaymentPaid, cancelPayment,
} from '@/lib/vendor/api/vendor';
import {
  fetchPaymentsByWedding, fetchPayableFunctions, fetchPaymentSuggestion,
  type WeddingPayment,
} from '@/lib/vendor/api/payments';
import { fetchMemberAssignments, type MemberAssignment } from '@/lib/vendor/api/roster';
import { NO_WEDDING_OPTION, suggestionSentence, NO_RATE_ON_FILE } from '@/lib/vendor/settleWords';
import { roleLabel } from '@/lib/vendor/roleWords';
import type { TeamMember, TeamTask, TeamPayment } from '@/lib/vendor/types/vendor';
import {
  MemberSheet, TaskSheet, PaySheet, SettleSheet, CancelPaymentConfirm, SHEET_CSS,
  type MemberDraft, type TaskDraft, type PayDraft, type Opt,
} from '@/components/worklist/StudioSheets';

type TabId = 'team' | 'tasks' | 'payments';
type LoadState = 'loading' | 'ready' | 'failed';

/** The three tabs, in the frames' order. The `add` href is GONE: these tabs no
    longer have destinations, they have sheets. What was a third address book for
    three strings is now three pieces of state. */
const TABS: readonly { id: TabId; label: string }[] = [
  { id: 'team',     label: COPY.teamTabTeam },
  { id: 'tasks',    label: COPY.teamTabTasks },
  { id: 'payments', label: COPY.teamTabPayments },
] as const;

const EMPTY_MEMBER: MemberDraft = { name: '', role: '', phone: '', rate: '', notes: '' };
const EMPTY_TASK: TaskDraft = { title: '', description: '', assignedTo: '', dueDate: '', priority: 'normal' };
const EMPTY_PAY: PayDraft = { memberId: '', eventId: '', amount: '', description: '' };

type SheetKind =
  | { k: 'member'; editing: TeamMember | null }
  | { k: 'task' }
  | { k: 'pay' }
  | { k: 'settle'; payment: TeamPayment }
  | { k: 'cancel'; payment: TeamPayment };

export function TeamTabs({ vendorName }: { vendorName: string | null }) {
  const [tab, setTab] = useState<TabId>('team');
  const { toast, show } = useToast();

  const [members,  setMembers]  = useState<TeamMember[]>([]);
  const [tasks,    setTasks]    = useState<TeamTask[]>([]);
  const [payments, setPayments] = useState<WeddingPayment[]>([]);
  /** The Payments tab RENDERS `/by-wedding`'s lines — they carry the event date
      and the member's name, which the flat GET does not — but the WRITE verbs
      need the raw row. Both are held. One read feeds the eye, the other feeds
      the sheet, and neither is derived from the other. */
  const [rawPayments, setRawPayments] = useState<TeamPayment[]>([]);
  const [state, setState] = useState<Record<TabId, LoadState>>({
    team: 'loading', tasks: 'loading', payments: 'loading',
  });

  const [sheet, setSheet]   = useState<SheetKind | null>(null);
  const [saving, setSaving] = useState(false);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>(EMPTY_MEMBER);
  const [taskDraft,   setTaskDraft]   = useState<TaskDraft>(EMPTY_TASK);
  const [payDraft,    setPayDraft]    = useState<PayDraft>(EMPTY_PAY);
  const [paidVia,   setPaidVia]   = useState('upi');
  const [paidNotes, setPaidNotes] = useState('');
  const [assignments, setAssignments] = useState<MemberAssignment[]>([]);
  const [assignState, setAssignState] = useState<'loading' | 'ready' | 'failed'>('ready');
  const [functions, setFunctions] = useState<readonly Opt[]>([{ v: '', l: NO_WEDDING_OPTION }]);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const settle = useCallback((id: TabId, ok: boolean) =>
    setState((s) => ({ ...s, [id]: ok ? 'ready' : 'failed' })), []);

  // ── THE THREE READS, EACH RE-RUNNABLE ────────────────────────────────────
  // 2b-2 fetched a tab once, on first visit, guarded by its own load state. A
  // room that WRITES cannot do that: after a create the list on screen is stale
  // and the vendor is looking at the surface that just lied to him. Each read is
  // now a named function the verbs can call, and the once-only guard lives in
  // the effect below — so a re-tap still does not re-fetch, and a write always
  // does. Same mechanism for the first read and every read after it.
  const loadTeam = useCallback(() => fetchTeam()
    .then((r) => { if ('members' in r && r.ok) { setMembers(r.members ?? []); settle('team', true); } else settle('team', false); })
    .catch(() => settle('team', false)), [settle]);

  const loadTasks = useCallback(() => fetchTasks({ state: 'all' })
    // `?state=all` needs no new API surface: `tasks.js:31` reads
    // `if (state && state !== 'all')`, so `all` skips the filter rather than
    // being validated against VALID_STATES. Without it the door defaults to
    // open + in_progress and the `Done today` section could never fill.
    .then((r) => { if ('tasks' in r && r.ok) { setTasks(r.tasks ?? []); settle('tasks', true); } else settle('tasks', false); })
    .catch(() => settle('tasks', false)), [settle]);

  const loadPayments = useCallback(() => Promise.all([
    fetchPaymentsByWedding(),
    fetchTeamPayments(),
  ]).then(([bw, raw]) => {
    if (bw && bw.ok) {
      // FLATTENED, NOT GROUPED. `/by-wedding` answers in wedding groups plus a
      // `loose` bucket; the frame is a flat two-section list, so both are
      // concatenated. `loose` is NOT an error state — the route names three
      // lawful roads into it, and a payment dropped on the floor because its
      // binder could not be named is a payment the vendor never sees.
      setPayments([
        ...(bw.weddings ?? []).flatMap((w) => w.payments ?? []),
        ...(bw.loose?.payments ?? []),
      ]);
      // ── F-2c.w2 · BOTH READS ARE REQUIRED, SO EITHER ONE FAILING IS A FAIL ──
      // WHAT STOOD HERE: `settle('payments', true)` fired whenever by-wedding
      // succeeded, EVEN IF the raw-row read had failed. The list would render
      // and every row would silently lose its verbs — `rawOf` returns null, the
      // `foot` renders nothing, and `Mark paid` and `Cancel payment` are simply
      // absent with no word anywhere saying why. A vendor would be looking at
      // money he cannot act on and at a surface with no complaint on it.
      //
      // The tab needs BOTH: by-wedding for the eye (it carries the event date
      // and the member's name), the raw rows for the verbs. So a half-answer is
      // a failed answer, and `Could not load this list.` is the honest word for
      // it — F-2c.w2, found while deriving where the payments were, not
      // reported by an instrument.
      if (!('payments' in raw) || !raw.ok) { settle('payments', false); return; }
      setRawPayments(raw.payments ?? []);
      settle('payments', true);
    } else settle('payments', false);
  }).catch(() => settle('payments', false)), [settle]);

  useEffect(() => {
    if (state[tab] !== 'loading') return;
    if (tab === 'team') { void loadTeam(); }
    else if (tab === 'tasks') { void loadTasks(); }
    else { void loadPayments(); }
  }, [tab, state, loadTeam, loadTasks, loadPayments]);

  /** A write invalidates the tab it touched; the effect above re-arms. */
  const invalidate = (id: TabId) => setState((s) => ({ ...s, [id]: 'loading' }));

  /** The task sheet's assignee picker and the payment sheet's member picker both
      need the roster, and a vendor can open either without visiting Team. */
  const ensureMembers = () => { if (members.length === 0) void loadTeam(); };

  // ── THE VERBS ────────────────────────────────────────────────────────────
  // Every one reports its outcome through `show` and nothing else. A write with
  // no toast on screen looks exactly like a write that succeeded, which is the
  // honest-controls law (CE-209) that put `WlToast` in `AddFab`.
  const fail = (r: unknown) => show((r as { error?: string }).error ?? COPY.teamFailed, 'error');

  async function saveMember() {
    if (saving) return;
    setSaving(true);
    const body = {
      name: memberDraft.name.trim(),
      role:  memberDraft.role  || undefined,
      phone: memberDraft.phone || undefined,
      daily_rate_inr: memberDraft.rate ? Number(memberDraft.rate) : undefined,
      notes: memberDraft.notes || undefined,
    };
    const editing = sheet && sheet.k === 'member' ? sheet.editing : null;
    const res = editing ? await updateTeamMember(editing.id, body) : await addTeamMember(body);
    if (!res.ok) fail(res);
    else {
      show(editing ? COPY.studioToastMemberUpdated : COPY.studioToastMemberAdded, 'success');
      setSheet(null); invalidate('team');
    }
    setSaving(false);
  }

  async function removeMember() {
    const editing = sheet && sheet.k === 'member' ? sheet.editing : null;
    if (!editing || saving) return;
    setSaving(true);
    const res = await deleteTeamMember(editing.id);
    if (!res.ok) fail(res);
    else { show(COPY.studioToastMemberRemoved, 'success'); setSheet(null); invalidate('team'); }
    setSaving(false);
  }

  async function rotate() {
    const editing = sheet && sheet.k === 'member' ? sheet.editing : null;
    if (!editing || saving) return;
    setSaving(true);
    const res = await rotateTeamMemberToken(editing.id);
    if (!res.ok) fail(res);
    else {
      show(COPY.studioToastLinkRotated, 'success');
      // The sheet STAYS OPEN and re-seats on the returned row: the point of
      // rotating is to send the new link, and closing the sheet would hide the
      // button the vendor rotated in order to press.
      setSheet({ k: 'member', editing: (res as { member: TeamMember }).member });
      invalidate('team');
    }
    setSaving(false);
  }

  function sendPage(m: TeamMember) {
    // The link is built from THIS APP'S OWN ORIGIN, never from API_BASE:
    // API_BASE points at dream-os on Railway and the crew page is a route in
    // this PWA. Named consequence, unchanged from the /vendor sheet: on the demo
    // subdomain the minted link is visibly dead rather than quietly wrong.
    const url = `${window.location.origin}/crew/${m.page_token}`;
    const text = `Your assignments with ${vendorName ?? 'us'}: ${url}`;
    const digits = (m.phone || '').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  async function createTheTask() {
    if (saving) return;
    setSaving(true);
    const res = await createTask({
      title: taskDraft.title.trim(),
      description: taskDraft.description || undefined,
      assigned_to_member_id: taskDraft.assignedTo || undefined,
      due_date: taskDraft.dueDate || undefined,
      priority: taskDraft.priority,
    });
    if (!res.ok) fail(res);
    else { show(COPY.studioToastTaskCreated, 'success'); setSheet(null); setTaskDraft(EMPTY_TASK); invalidate('tasks'); }
    setSaving(false);
  }

  /** Card ④'s verb. `updateTask` is the door and `state: 'done'` is the whole
      body — `tasks.js:87` stamps `completed_at` SERVER-SIDE, so this surface
      never constructs a completion time of its own. That is why the row reaches
      Today's done ledger and this tab's `Done today` on the same clock. */
  async function completeTask(t: TeamTask) {
    if (saving) return;
    setSaving(true);
    const res = await updateTask(t.id, { state: 'done' });
    if (!res.ok) fail(res);
    else { show(COPY.studioToastTaskUpdated, 'success'); invalidate('tasks'); }
    setSaving(false);
  }

  async function removeTask(t: TeamTask) {
    if (saving) return;
    setSaving(true);
    const res = await deleteTask(t.id);
    if (!res.ok) fail(res);
    else { show(COPY.studioToastTaskDeleted, 'success'); invalidate('tasks'); }
    setSaving(false);
  }

  async function logThePayment() {
    if (saving) return;
    setSaving(true);
    const res = await logPayment({
      team_member_id: payDraft.memberId,
      amount_inr: Number(payDraft.amount),
      description: payDraft.description || undefined,
      linked_event_id: payDraft.eventId || undefined,
    });
    if (!res.ok) fail(res);
    else {
      show(COPY.studioToastPaymentLogged, 'success');
      setSheet(null); setPayDraft(EMPTY_PAY); setSuggestion(null); invalidate('payments');
    }
    setSaving(false);
  }

  // ── MARK PAID, AND THE ARM THAT COULD NOT BE SEEN  [ruling 3] ────────────
  // The money row commits BEFORE the expense leg runs and STAYS committed if the
  // leg fails — reversing a settlement because a derived bookkeeping row failed
  // would be the worse lie, and the route says so in its own words. So the
  // vendor's only signal that Books did not gain the row is `expense_logged`,
  // and until this sitting the typed door dropped it and the surface said
  // 「Marked as paid」 either way.
  //
  // THREE STATES, NOT TWO, and the third is `undefined`. This pwa deploys
  // separately from dream-os and can meet a backend that predates the hygiene
  // sitting; a MISSING field is not a FAILED expense. Only an explicit `false`
  // takes the named byte, and it takes the error register with it — a settlement
  // the ledger did not record is not a success with a footnote.
  async function confirmPaid() {
    const p = sheet && sheet.k === 'settle' ? sheet.payment : null;
    if (!p || saving) return;
    setSaving(true);
    const res = await markPaymentPaid(p.id, { paid_via: paidVia || undefined, notes: paidNotes || undefined });
    if (!res.ok) fail(res);
    else {
      const logged = (res as { expense_logged?: boolean }).expense_logged;
      show(logged === false ? COPY.studioToastPaidNoExpense : COPY.studioToastPaidLogged,
           logged === false ? 'error' : 'success');
      setSheet(null); setPaidVia('upi'); setPaidNotes(''); invalidate('payments');
    }
    setSaving(false);
  }

  /** The tenth verb. `cancel`, never `delete` — `team_payments` carries no
      `deleted_at` column and the route sets `state='cancelled'`. */
  async function confirmCancel() {
    const p = sheet && sheet.k === 'cancel' ? sheet.payment : null;
    if (!p || saving) return;
    setSaving(true);
    const res = await cancelPayment(p.id);
    if (!res.ok) fail(res);
    else { show(COPY.studioToastPaymentCancelled, 'success'); setSheet(null); invalidate('payments'); }
    setSaving(false);
  }

  // ── THE TWO SHEET-OPENING READS ──────────────────────────────────────────
  function openMember(m: TeamMember | null) {
    setSheet({ k: 'member', editing: m });
    setMemberDraft(m
      // NORMALISED ON THE WAY IN (F-2c.w4). A legacy token opens as its word, so
      // saving an untouched sheet UPGRADES the row rather than rewriting the
      // token — and the member's own free text arrives intact, because
      // `roleLabel` passes through anything it does not recognise.
      ? { name: m.name, role: roleLabel(m.role), phone: m.phone ?? '',
          rate: m.daily_rate_inr?.toString() ?? '', notes: m.notes ?? '' }
      : EMPTY_MEMBER);
    if (!m) { setAssignments([]); setAssignState('ready'); return; }
    // Fetched per open rather than cached: the owner may have just assigned them
    // on another screen, and a stale board is worse than a moment's spinner. A
    // non-ok body is a FAILURE, not an empty board — `getJson` returns the
    // envelope on a 404, so the ok flag is the only thing that tells 「none」
    // from 「could not tell」.
    setAssignments([]); setAssignState('loading');
    fetchMemberAssignments(m.id)
      .then((r) => { if (r && r.ok) { setAssignments(r.assignments || []); setAssignState('ready'); } else setAssignState('failed'); })
      .catch(() => setAssignState('failed'));
  }

  function openPay() {
    ensureMembers();
    setSheet({ k: 'pay' }); setPayDraft(EMPTY_PAY); setSuggestion(null);
    void fetchPayableFunctions().then((r) => {
      if (r && r.ok) {
        setFunctions(([{ v: '', l: NO_WEDDING_OPTION }] as Opt[]).concat(
          (r.functions ?? []).map((f) => ({
            v: f.event_id,
            l: [f.title, f.event_date, f.wedding_title].filter(Boolean).join(' · '),
          })),
        ));
      }
    }).catch(() => { /* a picker that cannot load still offers the lawful no-pick */ });
  }

  // THE AUTO-SUGGEST. Asked only when BOTH a member and a function are on the
  // draft, because the scope of the count is the function's wedding. It PREFILLS
  // an empty amount and leaves a typed one alone, so a number the vendor has
  // already touched is his. Absence is NAMED, never zeroed: a member with no
  // rate on file gets a sentence, not an Rs 0 that would read as a settled debt.
  useEffect(() => {
    let live = true;
    if (!payDraft.memberId || !payDraft.eventId) { setSuggestion(null); return; }
    fetchPaymentSuggestion(payDraft.memberId, payDraft.eventId).then((r) => {
      if (!live || !r.ok) return;
      if (r.suggestion) {
        const s = r.suggestion;
        setSuggestion(suggestionSentence(s.amount_inr, s.functions, s.rate_inr));
        setPayDraft((d) => (d.amount.trim() === '' ? { ...d, amount: String(s.amount_inr) } : d));
      } else setSuggestion(r.reason === 'no_rate' ? NO_RATE_ON_FILE : null);
    }).catch(() => { /* a missing suggestion is silence, never a zero */ });
    return () => { live = false; };
  }, [payDraft.memberId, payDraft.eventId]);

  /** The `+`'s job, per tab. It opens a sheet; it navigates nowhere. */
  function onFab() {
    if (tab === 'team') openMember(null);
    else if (tab === 'tasks') { ensureMembers(); setSheet({ k: 'task' }); setTaskDraft(EMPTY_TASK); }
    else openPay();
  }

  const current = TABS.find((t) => t.id === tab)!;
  /** The raw row behind a by-wedding line, for the verbs. Absent means the two
      reads disagree — the row renders without its verbs rather than the verbs
      firing at an id this surface cannot vouch for. */
  const rawOf = (id: string) => rawPayments.find((p) => p.id === id) ?? null;

  return (
    <div className="wl-tm">
      <style>{TEAM_CSS}</style>
      <style>{SHEET_CSS}</style>

      <div className="wl-tabs" role="tablist" aria-label={COPY.teamTitle}>
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={t.id === tab}
                  className={'wl-tab' + (t.id === tab ? ' on' : '')}
                  onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="wl-tmbody" role="tabpanel">
        {tab === 'team' && <TeamList rows={members} state={state.team} onOpen={openMember} />}
        {tab === 'tasks' && (
          <TaskList rows={tasks} state={state.tasks} saving={saving}
                    onComplete={completeTask} onDelete={removeTask} />
        )}
        {tab === 'payments' && (
          <PaymentList rows={payments} state={state.payments} saving={saving} rawOf={rawOf}
                       onSettle={(p) => { setSheet({ k: 'settle', payment: p }); setPaidVia('upi'); setPaidNotes(''); }}
                       onCancel={(p) => setSheet({ k: 'cancel', payment: p })} />
        )}
      </div>

      {/* ONE FAB, and it opens a sheet. The label names the destination rather
          than the glyph, because a floating control whose accessible name is
          「add」 tells a screen reader nothing about which of three lists it
          acts on. */}
      <Fab label={current.label + ' — ' + COPY.teamAddSuffix} onClick={onFab} />

      {sheet && sheet.k === 'member' && (
        <MemberSheet editing={sheet.editing} draft={memberDraft} setDraft={setMemberDraft}
                     assignments={assignments} assignState={assignState} saving={saving}
                     onSave={saveMember} onRemove={removeMember}
                     onSendPage={() => { if (sheet.editing) sendPage(sheet.editing); }}
                     onRotate={rotate} onClose={() => setSheet(null)} />
      )}
      {sheet && sheet.k === 'task' && (
        <TaskSheet draft={taskDraft} setDraft={setTaskDraft} members={members} saving={saving}
                   onCreate={createTheTask} onClose={() => setSheet(null)} />
      )}
      {sheet && sheet.k === 'pay' && (
        <PaySheet draft={payDraft} setDraft={setPayDraft} members={members} functions={functions}
                  suggestion={suggestion} saving={saving}
                  onLog={logThePayment} onClose={() => setSheet(null)} />
      )}
      {sheet && sheet.k === 'settle' && (
        <SettleSheet payment={sheet.payment} paidVia={paidVia} setPaidVia={setPaidVia}
                     notes={paidNotes} setNotes={setPaidNotes} saving={saving}
                     onConfirm={confirmPaid} onClose={() => setSheet(null)} />
      )}
      {sheet && sheet.k === 'cancel' && (
        <CancelPaymentConfirm saving={saving} onConfirm={confirmCancel} onClose={() => setSheet(null)} />
      )}

      <WlToast toast={toast} />
    </div>
  );
}

/** The section head: a word and the count of the rows beneath it. The count is
    `rows.length` — what is on screen, never a figure from the wire that a filter
    could make disagree with the list under it. */
function Section({ label, count }: { label: string; count: number }) {
  return <div className="wl-rsec">{label} <span>{count}</span></div>;
}

function Row({ primary, detail, figure, onClick, foot }: {
  primary: string; detail: string; figure?: string;
  onClick?: () => void; foot?: React.ReactNode;
}) {
  const body = (
    <>
      <div>
        <span className="wl-rprimary">{primary}</span>
        {detail ? <span className="wl-rdetail">{detail}</span> : null}
      </div>
      {figure ? <div className="wl-rfig">{figure}</div> : <div />}
      {foot ? <div className="wl-rfoot">{foot}</div> : null}
    </>
  );
  // A row that DOES something is a button; a row that only reads is a div. A div
  // with a click handler is a control no keyboard can reach.
  return onClick
    ? <button type="button" className="wl-row wl-rowbtn" onClick={onClick}>{body}</button>
    : <div className="wl-row">{body}</div>;
}

function Empty({ state, word }: { state: LoadState; word: string }) {
  if (state === 'loading') return <div className="wl-rempty" aria-busy="true" />;
  return <div className="wl-rempty">{state === 'failed' ? COPY.teamFailed : word}</div>;
}

// ── TEAM ────────────────────────────────────────────────────────────────────
// `role` alone on the detail line. See this file's state-word paragraph: the
// column is two-valued, the door is not, and `C80` asserts the absence so the
// word cannot come back in a later edit that looks like a kindness.
function TeamList({ rows, state, onOpen }: {
  rows: TeamMember[]; state: LoadState; onOpen: (m: TeamMember) => void;
}) {
  if (state !== 'ready' || rows.length === 0) return <Empty state={state} word={COPY.teamEmptyMembers} />;
  return (
    <>
      <Section label={COPY.teamSecMembers} count={rows.length} />
      {/* THE ROW PRINTS THE WORD, NEVER THE TOKEN. `second_shooter` on a
          vendor-facing row was F-2c.w4's visible half; the destructive half was
          the picker beneath it. */}
      {rows.map((m) => <Row key={m.id} primary={m.name} detail={roleLabel(m.role)} onClick={() => onOpen(m)} />)}
    </>
  );
}

// ── TASKS ───────────────────────────────────────────────────────────────────
// TWO SECTIONS, AND THE SECOND IS NARROWER THAN 「not open」. `Open` holds
// `open` + `in_progress`; `Done today` holds rows whose `completed_at` falls on
// today. `done` rows completed last month, and every `cancelled` row, appear in
// neither — a section headed `Done today` that shows a task finished in July is
// lying in its own heading.
function TaskList({ rows, state, saving, onComplete, onDelete }: {
  rows: TeamTask[]; state: LoadState; saving: boolean;
  onComplete: (t: TeamTask) => void; onDelete: (t: TeamTask) => void;
}) {
  const open = rows.filter((t) => t.state === 'open' || t.state === 'in_progress');
  const done = rows.filter((t) => t.state === 'done' && isToday(t.completed_at));
  if (state !== 'ready' || (open.length === 0 && done.length === 0))
    return <Empty state={state} word={COPY.teamEmptyTasks} />;
  return (
    <>
      {open.length > 0 && (
        <>
          <Section label={COPY.teamSecOpen} count={open.length} />
          {open.map((t) => (
            <Row key={t.id} primary={t.title}
                 // `Due` is `todayDuePrefix` — ONE key, two consumers: TodayCards
                 // and this line. A second `'Due'` in the register would be two
                 // homes for one word on two surfaces the same vendor reads in
                 // the same minute.
                 detail={[
                   t.due_date ? COPY.todayDuePrefix + ' ' + formatLongDate(t.due_date) : '',
                   t.team_members?.name ?? COPY.teamUnassigned,
                 ].filter(Boolean).join(' · ')}
                 foot={
                   <button type="button" className="wl-rbtn" disabled={saving}
                           onClick={() => onComplete(t)}>{COPY.todayDoneHead}</button>
                 } />
          ))}
        </>
      )}
      {done.length > 0 && (
        <>
          {/* `Done today` is `todayDoneHead` — ONE key, and its consumers are
              TodayCards' two aria-labels, this section head, and now the verb
              above, which is the same two words doing the same job. */}
          <Section label={COPY.todayDoneHead} count={done.length} />
          {done.map((t) => (
            <Row key={t.id} primary={t.title}
                 detail={COPY.teamCompletedPrefix + ' ' + formatLongDate(t.completed_at)}
                 foot={
                   <button type="button" className="wl-rbtn dan" disabled={saving}
                           onClick={() => onDelete(t)}>{COPY.studioRemove}</button>
                 } />
          ))}
        </>
      )}
    </>
  );
}

// ── PAYMENTS ────────────────────────────────────────────────────────────────
// `owed` renders as `Unpaid`. THE WIRE WORD IS NEVER TRANSLATED IN A SECOND
// PLACE: the section heads are the only site that turns a state into a
// vendor-facing word on this surface, and each row sits under the head that
// named it rather than carrying a state word of its own.
//
// THE DATE IS THE EVENT'S, NOT `paid_at`. `event_date` is the function the crew
// was engaged for, which is what the vendor recognises the payment by; `paid_at`
// is when money moved and is not on the frame.
//
// ⚠ ONLY UNPAID ROWS CARRY VERBS, and both verbs need the RAW row rather than
// the by-wedding line. `markPaymentPaid` and `cancelPayment` each gate on
// `.eq('state','owed')` at the door, so offering the controls on a settled row
// would be a surface promising what the route refuses.
function PaymentList({ rows, state, saving, rawOf, onSettle, onCancel }: {
  rows: WeddingPayment[]; state: LoadState; saving: boolean;
  rawOf: (id: string) => TeamPayment | null;
  onSettle: (p: TeamPayment) => void; onCancel: (p: TeamPayment) => void;
}) {
  const unpaid = rows.filter((p) => p.state === 'owed');
  const paid   = rows.filter((p) => p.state === 'paid');
  if (state !== 'ready' || rows.length === 0) return <Empty state={state} word={COPY.teamEmptyPayments} />;
  const line = (p: WeddingPayment) =>
    [p.event_date ? formatLongDate(p.event_date) : '', p.description ?? ''].filter(Boolean).join(' · ');
  return (
    <>
      {unpaid.length > 0 && (
        <>
          <Section label={COPY.teamSecUnpaid} count={unpaid.length} />
          {unpaid.map((p) => {
            const raw = rawOf(p.id);
            return (
              <Row key={p.id} primary={p.member_name ?? COPY.teamUnassigned} detail={line(p)}
                   figure={formatRs(p.amount_inr)}
                   foot={raw ? (
                     <>
                       <button type="button" className="wl-rbtn" disabled={saving}
                               onClick={() => onSettle(raw)}>{COPY.studioMarkPaid}</button>
                       <button type="button" className="wl-rbtn dan" disabled={saving}
                               onClick={() => onCancel(raw)}>{COPY.studioCancelPayment}</button>
                     </>
                   ) : null} />
            );
          })}
        </>
      )}
      {paid.length > 0 && (
        <>
          <Section label={COPY.teamSecPaid} count={paid.length} />
          {paid.map((p) => (
            <Row key={p.id} primary={p.member_name ?? COPY.teamUnassigned} detail={line(p)}
                 figure={formatRs(p.amount_inr)} />
          ))}
        </>
      )}
    </>
  );
}

/** Today in the device's own zone, compared as a calendar day rather than a
    duration. `completed_at` is a timestamp; a 24-hour window would put yesterday
    evening's task under a heading that says today. */
function isToday(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return false;
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

// Every rule below is the mocks' own — `docs/mocks/studio-rooms-mock.html`
// (frames C2-team / C2-tasks / C2-pay) and `docs/mocks/studio-sheets-mock.html`
// (the row button, frames E2/E3/E5). Tokens come from `lib/worklist/theme.ts`
// through the shell's scope: no literal colour and no literal type size.
//
// ⚠ `.wl-room` IS NOT DECLARED HERE. `RoomBody` owns that class and its gutter
// contract (R-38.5: the scroll column owns ONE horizontal inset and no component
// under it sets its own).
//
// ⚠ `.wl-tm` TAKES `position:relative` AND THAT LINE IS LOAD-BEARING. It is the
// sheet's positioning context, so `position:absolute` in SHEET_CSS resolves
// against the ROOM and not the viewport. That is what keeps the masthead and the
// three tabs visible behind the scrim — the property the whole crossing exists
// for, and it would be lost by an edit that looked like tidying.
//
// The tabular-numeral pair is `BooksBody`'s law, restated because it bites the
// same way: `font: var(--wl-t3)` is the SHORTHAND and it RESETS
// font-variant-numeric, so the figure's `font` line and its numeral line are two
// rules and the numeral rule comes second.
const TEAM_CSS = `
.wl-tm{flex:1;display:flex;flex-direction:column;min-height:0;position:relative}
.wl-tabs{display:flex;gap:20px;padding:14px 0 12px;border-bottom:.5px solid var(--role-metal)}
.wl-tab{background:none;border:none;padding:0;cursor:pointer;font:var(--wl-t4);
        letter-spacing:.06em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.wl-tab.on{color:var(--atelier-ink)}
.wl-tab:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:3px;border-radius:2px}
.wl-tmbody{flex:1;min-height:0;padding-bottom:24px}
.wl-rsec{display:flex;justify-content:space-between;align-items:baseline;gap:12px;
         padding:18px 0 8px;font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;
         color:var(--atelier-ink-mute)}
.wl-rsec span{color:var(--atelier-ink-soft)}
.wl-rsec span{font-variant-numeric:lining-nums tabular-nums}
.wl-row{display:grid;grid-template-columns:1fr auto;align-items:baseline;gap:12px;width:100%;
        padding:11px 0;border-top:.5px solid var(--atelier-card-border);text-align:left}
.wl-rowbtn{background:none;border:none;border-top:.5px solid var(--atelier-card-border);cursor:pointer}
.wl-rowbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:2px}
.wl-rprimary{display:block;font:var(--wl-t3);color:var(--atelier-ink)}
.wl-rdetail{display:block;margin-top:3px;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-rfig{font:var(--wl-t3);color:var(--atelier-ink);white-space:nowrap}
.wl-rfig{font-variant-numeric:lining-nums tabular-nums}
.wl-rfoot{grid-column:1 / -1;display:flex;gap:8px;margin-top:10px}
.wl-rbtn{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 14px;
         border-radius:3px;background:transparent;border:.5px solid var(--atelier-accent-text);
         color:var(--atelier-accent-text);font:var(--wl-t5);letter-spacing:.08em;
         text-transform:uppercase;cursor:pointer}
.wl-rbtn.dan{border-color:var(--role-critical);color:var(--role-critical)}
.wl-rbtn:disabled{opacity:.5;cursor:not-allowed}
.wl-rbtn:focus-visible{outline:2px solid var(--atelier-accent-text);outline-offset:3px}
.wl-rempty{padding:22px 0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
`;
