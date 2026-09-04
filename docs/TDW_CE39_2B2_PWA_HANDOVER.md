# TDW · CE-39 · ROAD STEP 2b · 2b-2 (pwa) — HANDOVER

**2b SEALS HERE. F-39.26's both-ways cell — the one 2b-1 declared OWED — is
`C83`, green, and proven by four production mutations.**

**Base `bd60ac2` (worklist), re-derived fetch-first at the cut. Sibling dream-os
`4918275` (band 4).**

**FLOOR = NAMED BASE, compared as a SET** (`run-floor.sh --delivery`, sibling
present, `node_modules` present in BOTH repos). 23 REDs at base, 23 at the cut,
`diff` empty — no bench swapped places (R-38.19).
**`b40` 73 → 77 GREEN · 0 RED · FLOOR GREEN** · **`b41` 6 PASS · 0 FAIL** ·
`tsc --noEmit` exit 0.

**APPLY THIS ZIP FIRST.** The companion follows. Nothing here depends on it and
nothing it does depends on this — the order is `readers leave before their
sources`, kept where it is cheap so it is still there on the day it is not.

---

## 1 · WHAT MOVED

| file | arm |
|---|---|
| `components/worklist/TeamTabs.tsx` | **NEW** — arm D (a), the three tabs |
| `app/w/team/page.tsx` | mounts `TeamTabs`; the §4-4 body paragraph retires |
| `lib/worklist/copy.ts` | the bytes |
| `app/w/expenses/page.tsx` | stale-ink cure (comment only) |
| `scripts/b40_worklist_shell_bench.js` | `C58` amended · `C80` `C81` `C82` `C83` NEW |
| `tools/base_guard.sh` | made byte-identical with dream-os |
| `scripts/floor-manifest-ce39-2b2.txt` | NEW |

## 2 · F-2b2.1 — THE CONTRACT COULD NOT EXECUTE AS WORDED

The charter's Team row read `name · role · active → Active/Inactive`, derived
from the column: `team_members.active` is `boolean NOT NULL` (ordinal 8),
two-valued, no CHECK enumerating a third state.

**The column is two-valued. The door is not.** `src/api/vendor/studio/team.js:48`
filters `.eq('active', true)` unconditionally; the handler reads no `req.query`
and `fetchTeam()` sends none. So `active` is `true` on 100% of the rows this body
can receive, and `Active/Inactive` is a two-valued render over a one-valued wire —
a surface asserting a distinction the estate cannot make.

`active` **left the contract** (founder, arm (a)). The D-1 `C2-team` caption's
third-state word is struck by the same ruling. An 「inactive members」 view is
2c-Studio's question, with its verbs.

**c-39.39 is the chair's**, recorded in the chair's own words: arm (i) was ruled
at the COLUMN and not at the DOOR. It is `c-2c.2` one layer up — that one swept
the TABLE and not the CALLER; this swept the COLUMN and not the DOOR.

`C80` asserts the ABSENCE OF THE WORD, never the absence of the field: a later
seat re-deriving `active` for a filter or a count is doing something no ruling
forbade; a seat PRINTING a state word is undoing one. It also asserts the door's
filter, so a widened door RE-RULES the cell rather than silently leaving it
forbidding a word that has become honest.

## 3 · F-2b2.2 / F-2b2.3 — THE SWEEP THAT WAS THE WRONG INSTRUMENT

Both are dream-os-side findings and the companion carries their dispositions.
Recorded here because the third reader is in THIS repo and the law is general.

`F-2b2.2`: the two engine money GET arms were charted for retirement on
「their readers left at `d38d0ab`」. Zero readers of `vendor-e/binders` and
`vendor-e/cabinet` is TRUE — and the same two handler modules are mounted a
SECOND time at `/api/v2/vendor/{cabinet,binders}` (`core.js:44`/`:46`), which is
what `fetchCabinet` (`vendor.ts:97`) and `fetchLedger` (`:109`) actually call.
A sweep matching one spelling would have killed a live room.

`F-2b2.3`, and it is the sitting's finding: the follow-up sweep — a grep on the
consumers' destructuring — reported ZERO readers of the `paid`/`owed` slices.
Dropping the two fields from `CabinetResponse` made `tsc` name **three** in one
run:

| site | what it does |
|---|---|
| `lib/vendor/derive.ts:100` | `moneyBinders` composes its whole result from `cab.paid` + `cab.owed` |
| `app/vendor/list/[slice]/leads.tsx:96` | all four slices into the phone-keyed binder map |
| `app/vendor/list/[slice]/events.tsx:36` | all four slices into the id-keyed binder map |

The grep alternated on variable names and could see neither `cab.data?.paid` nor
a spread inside an array literal. **`c-2b2.1` is MINE**: I published that zero as
a derivation, in the message that asked for a ruling on it, and the ruling was
given on my number.

**THE LAW, band 5:** *a grep's failure mode is a silent zero; a type resolver's
is an error. For consumers of a typed wire, `tsc` IS the sweep and grep is the
hint.* The independent-method law already said a check whose failure mode is a
silent zero is not a check; this is that sentence with an instrument named.

**Nothing retires.** `CabinetResponse` is byte-identical to `bd60ac2` — restored
by `git checkout` after a hand-revert reordered two fields, because equivalent is
not identical.

## 4 · ARM D (a) — THE ROOM WHOSE BODY FINALLY CROSSED

Three tabs to the D-1 `C2-team` / `C2-tasks` / `C2-pay` frames, under the same
masthead, inheriting the shell, no boot animation, no second session resolve.

| tab | door | rows |
|---|---|---|
| Team | `fetchTeam()` | `name` · `role` |
| Tasks | `fetchTasks({ state: 'all' })` | `title` · `Due <date>` · `team_members.name ?? Unassigned` · `Completed <date>` |
| Payments | `fetchPaymentsByWedding()` | `member_name` · `event_date · description` · `amount_inr` |

`?state=all` needs no new API surface — `tasks.js:31` reads
`if (state && state !== 'all')`, so `all` skips the filter rather than being
validated. Payments flattens `weddings[].payments` + `loose.payments`; `loose` is
not an error state and a payment whose binder cannot be named is still hers.

**ONE FETCH PER TAB, ON FIRST VISIT.** A vendor who opens Team and leaves does
not pay for the payments read.

**`Done today` is narrower than 「not open」** — it holds rows whose `completed_at`
falls on today, compared as a calendar day rather than a 24-hour window. A
section headed `Done today` showing a task finished in July lies in its own
heading.

**THE `+`, RULED.** One `Fab` per tab, each navigating to that tab's old studio
page. The three destinations are the three already in `INTERIM_VENDOR_LINKS` with
their source lines — **the set does not grow at this crossing; only who points at
it changes.** Card ⑥ reads 「tapping + opens the old studio page for that tab —
declared, not cured」. F-39.30 stays OPEN-AS-NARROWED. `C49` governs the seat and
`C82` asserts the import, so a seventh seat drawn without geometry is caught too.

**`TeamHubScreen` KEEPS BOTH READERS.** `app/vendor/team-hub/{page,screen}.tsx`
are byte-untouched; the /vendor fallback still renders the row menu until
2c-Studio. `C58`'s site list grows 5 → 6 — **the movement is STATED, not a count
made to hold** — and its `isPrestige` full-tree sweep and person-name scrub
survive verbatim.

## 5 · THE COPY TABLE, SIDE BY SIDE

Six bytes ship AS AUTHORED under delegation, all picked at the D-1 studio-rooms
mock 2026-08-29. Two more are in the `C2-tasks` frame VERBATIM and ship on its
ratification. Two are reuses and mint nothing.

| key | current | proposed / shipped | provenance |
|---|---|---|---|
| `teamTabTeam` | — | `Team` | D-1 `C2-team`, tab |
| `teamTabTasks` | — | `Tasks` | D-1 `C2-tasks`, tab |
| `teamTabPayments` | — | `Payments` | D-1 `C2-pay`, tab |
| `teamSecMembers` | — | `Members` | D-1 `C2-team`, section |
| `teamSecOpen` | — | `Open` | D-1 `C2-tasks`, section |
| `teamSecUnpaid` | — | `Unpaid` | D-1 `C2-pay`, section (`owed` → `Unpaid`) |
| `teamSecPaid` | — | `Paid` | D-1 `C2-pay`, section |
| `teamUnassigned` | — | `Unassigned` | in the `C2-tasks` frame verbatim |
| `teamCompletedPrefix` | — | `Completed` | in the `C2-tasks` frame verbatim |
| `teamAddSuffix` | — | `add` | executor-authored, a11y name only |
| `teamEmptyMembers` | — | `No team members yet.` | executor-authored |
| `teamEmptyTasks` | — | `No tasks yet.` | executor-authored |
| `teamEmptyPayments` | — | `No team payments yet.` | executor-authored |
| `teamFailed` | — | `Could not load this list.` | executor-authored |
| `todayDuePrefix` | `Due` | **REUSED, not minted** | consumers: `TodayCards.tsx:100` + the Tasks row |
| `todayDoneHead` | `Done today` | **REUSED, not minted** | consumers: `TodayCards.tsx:322`, `:334` + the Tasks section |

`Unassigned` also appears at `app/vendor/studio/tasks/page.tsx:214` as a
`<select>` option in the OLD tree. **That is a different byte on a different
surface with a different job** — a form's null choice, not a row's detail —
untouched by ruling, retiring with `app/vendor/layout.tsx` at Phase 7. Named so
the next reader does not read one word in two trees as one byte in two homes.

**THE BooksBody ELEVENTH-BYTE PRECEDENT CUTS THE OTHER WAY HERE**, and the
distinction is the whole reason these two shipped: that byte was INVENTED by the
seat and was rightly withheld. `Unassigned` and `Completed` were picked with the
frame the founder ratified. Invention is withheld; transcription is not.

## 6 · THE STALE INK THE SWEEP FOUND BY ACCIDENT

`app/w/expenses/page.tsx:6-25` named
`fetchLedger -> GET /api/v2/vendor/binders/:vendorId` as this room's live path.
`fetchExpenses` crossed at 2c and calls `${moneyBase(vendorId)}/expenses/` —
the typed door. **The paragraph carried its own expiry** (「when 2c lands, this
paragraph goes with the plane it describes」) and 2c landed at `d38d0ab` six days
before this sitting.

**The expiry was the part that failed, not the fact.** A comment naming the
condition of its own retirement still has to be retired BY SOMEBODY, and nothing
was watching. It was found by the F-2b2.2 sweep looking for `/binders` readers —
which is to say by luck. `C76` asserts the CODE path; no cell can assert a
paragraph, which is why the sweep is the instrument and it is a slow one.

## 7 · NON-VACUITY — DISCLOSED, NOT PADDED

Four new cells, **eight mutation proofs, every one against PRODUCTION code**:

| # | cell | mutation | result |
|---|---|---|---|
| M1 | `C83` | drop the navigation arm from `WorklistShell` | RED |
| M2 | `C83` | drop the focus arm | RED |
| M3 | `C83` | drop ONE of seven money writes' `refreshToday()` | RED |
| M4 | `C80` | print `m.active ? 'Active' : 'Inactive'` on the Team row | RED |
| M5 | `C82` | import `createTask` into `TeamTabs` | RED |
| M6 | `C82` | point a tab's `+` at an undeclared fourth exit | RED |
| M7 | `C81` | append one byte to `base_guard.sh` | RED |
| M8 | `C58` | restore `isPrestige` in the NEWLY ADDED site | RED |

**TWO INSTRUMENT DEFECTS, BOTH MINE, BOTH CAUGHT BY RUNNING IT:**

**`s-2b2.1`** — my first harness reported **six-for-six STILL GREEN**, which is
not a plausible result and was not doubted for that reason alone. The bench
prints `RED␣␣␣` with three spaces and my matcher expected one. Six real REDs read
as six vacuous cells. F-39.25's pattern: *the instrument, not the tree*.

**`s-2b2.2`** — M3's first cut asserted `  refreshToday();` appears 7 times. It
appears **6**; the seventh is inline at `vendor.ts:793` inside a `.then()`. The
assert fired, the mutation did not land, **and it said so instead of claiming a
proof**. This is s-2c.1's law working: every generated edit asserts its anchor.

## 8 · SQL

**ZERO.**
