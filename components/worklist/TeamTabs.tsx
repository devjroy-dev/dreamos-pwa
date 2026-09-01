"use client";
// components/worklist/TeamTabs.tsx — TEAM, TASKS AND PAYMENTS AS ONE ROOM.
// CE-39 · ROAD STEP 2b · 2b-2 · arm D (a), built to
// `docs/mocks/studio-rooms-mock.html`, frames `C2-team` / `C2-tasks` / `C2-pay`.
//
// ── WHAT THIS REPLACES, AND WHAT IT DOES NOT ───────────────────────────────
// `/w/team` mounted `TeamHubScreen` — three rows, each a door OUT of the shell.
// The room's STRUCTURE had crossed and its BODY had not, so the vendor who
// tapped Team got a menu whose every item unmounted the shell. The three lists
// now render HERE, under the same masthead, inheriting the shell's theme, with
// no boot animation and no second session resolve.
//
// `app/vendor/team-hub/page.tsx` and `app/vendor/team-hub/screen.tsx` are
// BYTE-UNTOUCHED. The /vendor fallback keeps rendering the row menu it always
// rendered; `TeamHubScreen` keeps BOTH readers until 2c-Studio takes the
// question up with its verbs. Deleting a fallback body to celebrate a crossing
// is how a crossing becomes an outage.
//
// ── ⚠ THIS IS A READ. EVERY WRITE STILL LEAVES THE SHELL ───────────────────
// F-39.30 stays OPEN-AS-NARROWED and card ⑥ says so in the founder's own
// language: 「tapping + opens the old studio page for that tab — declared, not
// cured」. The `+` and every edit path route to `/vendor/studio/team`,
// `/vendor/studio/tasks` and `/vendor/studio/team-payments` — the same three
// hrefs `INTERIM_VENDOR_LINKS` has counted since §4-4, with their source lines.
// The set does not grow: the destinations are unchanged, only who points at
// them. They retire at their own block or die with `app/vendor/layout.tsx` at
// Phase 7, and that ledger is what will say which.
//
// ── ⚠ THE TEAM ROW CARRIES NO STATE WORD, AND THAT IS F-2b2.1 ──────────────
// The contract this body was chartered against read `name · role · active →
// Active/Inactive`, derived from the column: `team_members.active` is
// `boolean NOT NULL`, two-valued, with no CHECK enumerating a third state. The
// column is two-valued. THE DOOR IS NOT.
//
//   src/api/vendor/studio/team.js:48 — `.eq('active', true)`, unconditional.
//   The handler reads no `req.query`; `fetchTeam()` sends no parameter and the
//   route accepts none.
//
// So `active` is `true` on one hundred per cent of the rows this body can ever
// receive. A row rendering `Active/Inactive` would render `Active` forever —
// a two-valued word over a one-valued wire, which is a surface asserting a
// distinction the estate cannot make. `active` LEFT THE CONTRACT (founder,
// arm (a)); the D-1 `C2-team` caption's third-state word is struck by the same
// ruling. An 「inactive members」 view is 2c-Studio's question, with its verbs.
//
// The chair's own correction c-39.39 records why this survived the charter:
// arm (i) was ruled at the COLUMN and not at the DOOR. It is c-2c.2's shape one
// layer up — that one swept the table and not the caller; this one swept the
// column and not the door. `C80` below asserts the absence so the word cannot
// come back in a later edit that looks like a kindness.
//
// ── THE FAB IS THE SHELL'S SEAT, NEVER A SEVENTH ───────────────────────────
// C49 walks `app/w`'s whole import graph for a fixed control with a bottom
// offset, because six seats existed when four were believed to. This file draws
// no geometry: it mounts `Fab`, which reads `GRID.fab`. What the button DOES is
// this room's business and where it SITS is the shell's — `Fab.tsx`'s own rule,
// unchanged here.
//
// ── THE ROOM ADDS UP NOTHING ───────────────────────────────────────────────
// `BooksBody`'s standing: every figure on this surface is a row's own cell.
// The section counts are `list.length` — a count of what is rendered, which is
// not a derivation of anything, and the Payments figures are each row's
// `amount_inr`. No total is composed here and none is asked for by the frames.
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COPY } from '@/lib/worklist/copy';
import { Fab } from '@/components/worklist/Fab';
import { formatRs, formatLongDate } from '@/lib/vendor/format';
import { fetchTeam, fetchTasks } from '@/lib/vendor/api/vendor';
import { fetchPaymentsByWedding, type WeddingPayment } from '@/lib/vendor/api/payments';
import type { TeamMember, TeamTask } from '@/lib/vendor/types/vendor';

type TabId = 'team' | 'tasks' | 'payments';

/** The three tabs, in the frames' order. `add` is the surface the `+` opens —
    a whole href, deliberately: these are NOT rooms, so `roomHref` cannot answer
    for them and inventing a second address book for three strings would be the
    R-38.1 disease with a new spelling. They are the three entries already
    declared in `INTERIM_VENDOR_LINKS`, spelled the same way. */
const TABS: readonly { id: TabId; label: string; add: string }[] = [
  { id: 'team',     label: COPY.teamTabTeam,     add: '/vendor/studio/team' },
  { id: 'tasks',    label: COPY.teamTabTasks,    add: '/vendor/studio/tasks' },
  { id: 'payments', label: COPY.teamTabPayments, add: '/vendor/studio/team-payments' },
] as const;

type LoadState = 'loading' | 'ready' | 'failed';

export function TeamTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>('team');

  const [members,  setMembers]  = useState<TeamMember[]>([]);
  const [tasks,    setTasks]    = useState<TeamTask[]>([]);
  const [payments, setPayments] = useState<WeddingPayment[]>([]);
  const [state, setState] = useState<Record<TabId, LoadState>>({
    team: 'loading', tasks: 'loading', payments: 'loading',
  });

  // ── ONE FETCH PER TAB, ON FIRST VISIT ────────────────────────────────────
  // Three doors, three round trips, and they are NOT fanned out on mount: a
  // vendor who opens Team and leaves has no business paying for the payments
  // read. The guard is the tab's own load state, so a re-tap re-renders and
  // does not re-fetch.
  useEffect(() => {
    let alive = true;
    if (state[tab] !== 'loading') return;

    const settle = (id: TabId, ok: boolean) => {
      if (alive) setState((s) => ({ ...s, [id]: ok ? 'ready' : 'failed' }));
    };

    if (tab === 'team') {
      fetchTeam()
        .then((r) => {
          if (!alive) return;
          if ('members' in r && r.ok) { setMembers(r.members ?? []); settle('team', true); }
          else settle('team', false);
        })
        .catch(() => settle('team', false));
    } else if (tab === 'tasks') {
      // `?state=all` needs no new API surface: tasks.js:31 reads
      // `if (state && state !== 'all')`, so `all` skips the filter rather than
      // being validated against VALID_STATES. Without it the door defaults to
      // open + in_progress and the `Done today` section could never fill.
      fetchTasks({ state: 'all' })
        .then((r) => {
          if (!alive) return;
          if ('tasks' in r && r.ok) { setTasks(r.tasks ?? []); settle('tasks', true); }
          else settle('tasks', false);
        })
        .catch(() => settle('tasks', false));
    } else {
      fetchPaymentsByWedding()
        .then((r) => {
          if (!alive) return;
          if (r && r.ok) {
            // FLATTENED, NOT GROUPED. `/by-wedding` answers in wedding groups
            // plus a `loose` bucket; the frame is a flat two-section list, so
            // both are concatenated. `loose` is NOT an error state — the
            // route's own comment names three lawful roads into it, and a
            // payment dropped on the floor because its binder could not be
            // named is a payment the vendor never sees.
            const flat = [
              ...(r.weddings ?? []).flatMap((w) => w.payments ?? []),
              ...(r.loose?.payments ?? []),
            ];
            setPayments(flat);
            settle('payments', true);
          } else settle('payments', false);
        })
        .catch(() => settle('payments', false));
    }
    return () => { alive = false; };
  }, [tab, state]);

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="wl-tm">
      <style>{TEAM_CSS}</style>

      <div className="wl-tabs" role="tablist" aria-label={COPY.teamTitle}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === tab}
            className={'wl-tab' + (t.id === tab ? ' on' : '')}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="wl-tmbody" role="tabpanel">
        {tab === 'team'     && <TeamList     rows={members}  state={state.team} />}
        {tab === 'tasks'    && <TaskList     rows={tasks}    state={state.tasks} />}
        {tab === 'payments' && <PaymentList  rows={payments} state={state.payments} />}
      </div>

      {/* ONE FAB, and it navigates. `Fab` owns the seat and no behaviour; the
          label names the destination rather than the glyph, because a floating
          control whose accessible name is 「add」 tells a screen reader nothing
          about which of three lists it is about to leave. */}
      <Fab label={current.label + ' — ' + COPY.teamAddSuffix} onClick={() => router.push(current.add)} />
    </div>
  );
}

/** The section head: a word and the count of the rows beneath it. The count is
    `rows.length` — what is on screen, never a figure from the wire that a
    filter could make disagree with the list under it. */
function Section({ label, count }: { label: string; count: number }) {
  return <div className="wl-rsec">{label} <span>{count}</span></div>;
}

function Row({ primary, detail, figure }: { primary: string; detail: string; figure?: string }) {
  return (
    <div className="wl-row">
      <div>
        <span className="wl-rprimary">{primary}</span>
        {detail ? <span className="wl-rdetail">{detail}</span> : null}
      </div>
      {figure ? <div className="wl-rfig">{figure}</div> : <div />}
    </div>
  );
}

function Empty({ state, word }: { state: LoadState; word: string }) {
  if (state === 'loading') return <div className="wl-rempty" aria-busy="true" />;
  return <div className="wl-rempty">{state === 'failed' ? COPY.teamFailed : word}</div>;
}

// ── TEAM ────────────────────────────────────────────────────────────────────
// `role` alone on the detail line. See the state-word paragraph in this file's
// header: `active` is not on the contract and `C80` asserts its absence.
function TeamList({ rows, state }: { rows: TeamMember[]; state: LoadState }) {
  if (state !== 'ready' || rows.length === 0) return <Empty state={state} word={COPY.teamEmptyMembers} />;
  return (
    <>
      <Section label={COPY.teamSecMembers} count={rows.length} />
      {rows.map((m) => <Row key={m.id} primary={m.name} detail={m.role ?? ''} />)}
    </>
  );
}

// ── TASKS ───────────────────────────────────────────────────────────────────
// TWO SECTIONS, AND THE SECOND ONE IS NARROWER THAN 「not open」. `Open` holds
// `open` + `in_progress`; `Done today` holds rows whose `completed_at` FALLS ON
// TODAY. `done` rows completed last month, and every `cancelled` row, appear in
// neither — which is the frame, and it is the honest reading of the words: a
// section headed `Done today` that shows a task finished in July is lying in
// its own heading.
function TaskList({ rows, state }: { rows: TeamTask[]; state: LoadState }) {
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
            <Row
              key={t.id}
              primary={t.title}
              // `Due` is `todayDuePrefix` — ONE key, two consumers now:
              // `TodayCards.tsx:100` and this line. A second `'Due'` in the
              // register would be two homes for one word on two surfaces the
              // same vendor reads in the same minute.
              detail={
                [
                  t.due_date ? COPY.todayDuePrefix + ' ' + formatLongDate(t.due_date) : '',
                  t.team_members?.name ?? COPY.teamUnassigned,
                ].filter(Boolean).join(' · ')
              }
            />
          ))}
        </>
      )}
      {done.length > 0 && (
        <>
          {/* `Done today` is `todayDoneHead` — ONE key, and its consumers are
              now three, all named: TodayCards.tsx:322 and :334 (the aria-labels
              on the rest and done ledgers) and this section head. */}
          <Section label={COPY.todayDoneHead} count={done.length} />
          {done.map((t) => (
            <Row key={t.id} primary={t.title} detail={COPY.teamCompletedPrefix + ' ' + formatLongDate(t.completed_at)} />
          ))}
        </>
      )}
    </>
  );
}

// ── PAYMENTS ────────────────────────────────────────────────────────────────
// `owed` renders as `Unpaid`. The WIRE WORD IS NEVER TRANSLATED IN A SECOND
// PLACE: the section heads below are the only site that turns a state into a
// vendor-facing word on this surface, and each row sits under the head that
// named it rather than carrying a state word of its own.
//
// THE DATE IS THE EVENT'S, NOT `paid_at`. `WeddingPayment.event_date` is the
// function the crew was engaged for, which is what the vendor recognises the
// payment by; `paid_at` is when money moved and is not on the frame. The flat
// `GET /` has no event join at all, which is why this tab rides `/by-wedding`.
function PaymentList({ rows, state }: { rows: WeddingPayment[]; state: LoadState }) {
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
          {unpaid.map((p) => (
            <Row key={p.id} primary={p.member_name ?? COPY.teamUnassigned} detail={line(p)} figure={formatRs(p.amount_inr)} />
          ))}
        </>
      )}
      {paid.length > 0 && (
        <>
          <Section label={COPY.teamSecPaid} count={paid.length} />
          {paid.map((p) => (
            <Row key={p.id} primary={p.member_name ?? COPY.teamUnassigned} detail={line(p)} figure={formatRs(p.amount_inr)} />
          ))}
        </>
      )}
    </>
  );
}

/** Today in the device's own zone, compared as a calendar day rather than a
    duration. `completed_at` is a timestamp; a 24-hour window would put
    yesterday evening's task under a heading that says today. */
function isToday(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return false;
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

// Every rule below is the mock's own, at `docs/mocks/studio-rooms-mock.html`,
// frames C2-team / C2-tasks / C2-pay. Tokens come from `lib/worklist/theme.ts`
// through the shell's scope — no literal colour and no literal type size.
//
// ⚠ `.wl-room` IS NOT DECLARED HERE. `RoomBody` already owns that class and its
// gutter contract (R-38.5: the scroll column owns ONE horizontal inset and no
// component under it sets its own). The mock's `wl-room` div IS `RoomBody`;
// re-declaring it here would be a second home for the room's box.
//
// The tabular-numeral pair is `BooksBody`'s law, restated because it bites the
// same way: `font: var(--wl-t3)` is the SHORTHAND and it RESETS
// font-variant-numeric, so the figure's `font` line and its numeral line are
// two rules and the numeral rule comes second.
const TEAM_CSS = `
.wl-tm{flex:1;display:flex;flex-direction:column;min-height:0}
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
.wl-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;
        padding:11px 0;border-top:.5px solid var(--atelier-card-border)}
.wl-rprimary{display:block;font:var(--wl-t3);color:var(--atelier-ink)}
.wl-rdetail{display:block;margin-top:3px;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.wl-rfig{font:var(--wl-t3);color:var(--atelier-ink);white-space:nowrap}
.wl-rfig{font-variant-numeric:lining-nums tabular-nums}
.wl-rempty{padding:22px 0;font:var(--wl-t4);color:var(--atelier-ink-mute)}
`;
