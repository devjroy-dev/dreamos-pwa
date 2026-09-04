# TDW · CE-39 · ROAD STEP 2b · 2b-1 (pwa) — HANDOVER

**⚠ F-39.26's BOTH-WAYS CELL IS OWED IN 2b-2. THE WIRING SHIPS NOW; THE SEAL
DOES NOT. 2b seals only when 2b-2 lands and the card walks.**

**Base `d38d0ab` (worklist), re-derived fetch-first at the cut. Sibling dream-os
`4918275` (band 4).**

**FLOOR = NAMED BASE, no delta** (`run-floor.sh --check`, sibling present).
**`b40` FLOOR GREEN** · **`b41` 6 PASS · 0 FAIL** · `tsc --noEmit` clean.

**WHY THIS IS A ZIP AND NOT A NOTE.** The four arms were built and green in an
executor workspace, and a fresh opening means fresh clones. "Nothing at origin"
is the risk, not the reassurance (§11: a commit that exists only in an LE
container is EXPOSED, not banked). Banked at the seam the seat was standing on.

---

## 1 · WHAT MOVED

| file | arm |
|---|---|
| `lib/vendor/ThemeContext.tsx` | E-1 (i) — the pinned path is context-only |
| `app/vendor/billing/page.tsx` | E-2 — D-8 redirect stub |
| `lib/worklist/rooms.ts` | E-2 — LINKS 6→7; the old-chrome census row removed |
| `components/worklist/WorklistShell.tsx` | F-39.26 — navigation + focus |
| `lib/vendor/api/vendor.ts` | F-39.26 — seven money writes |
| `lib/worklist/feed.ts` | F-39.26 — the door's doc corrected |
| `scripts/b41_theme_bleed_fixture.js` | NEW |

## 2 · E-1 (i) — A PINNED PROVIDER NEVER TOUCHES THE DOCUMENT

`applyThemePinned` set `tokens` and `currentTheme` and returns `[]`. No
`classList.toggle`, no `applyCSSVars`, nothing on `documentElement`.

It previously called `applyTheme` whole and relied on a snapshot-and-restore
teardown. **That was not enough**: restoring on unmount does not help while the
pinned tree is MOUNTED, which on a shell route is the whole time.

**What a pinned provider is for, derived not assumed:** `ChatThread` (12 reads)
and `InputBar` (13 reads) call `useT()`. That is CONTEXT, not document. Those 25
reads are byte-identical and **F-38.50 stays exactly where it was**, chartered
separately and untouched.

**The sheet loses nothing.** `AiDock` renders `AskSheet` INLINE — no portal —
inside `WorklistShell`'s `<div className="wl" data-wl-mode>` (shell `:91`, dock
`:134`, close `:155`). Its CSS vars already resolve from the shell's own
`scopeCss`; the pin was writing a second copy onto `<html>`, where the other
lane could read them.

### F-39.32 — OPEN-AS-NARROWED, with its three facts

`b41` eliminates three mechanisms **by measurement**, and a fourth by
derivation:

1. **The shell's ground is SCOPE-IMMUNE to `documentElement`** (§2.2), and
   §3.1 proves it non-vacuously: strip the scope's own declaration and the
   inherited value does take over — `rgb(243,244,244)` → `rgb(20,21,22)`.
2. **Every `/w` consumer of `useT()` mounts its own provider** (§4.1) —
   `AskSheet`, `AddFab`, `WlToast`, checked comment-blind.
3. **The `!important` html/body ground cannot show behind the scope** (§4.2) —
   it covers the viewport and paints opaque, asked of the browser not the
   stylesheet.
4. **The cookie is eliminated by derivation.** `MODE_COOKIE` (`tdw_wl_mode`) is
   written at exactly one site, `lib/worklist/mode.ts:122`, and read at
   `mode.ts:55` and `app/w/layout.tsx`. Nothing in the old tree writes or clears
   it; `MODE_LEGACY_KEY` has no reference outside `mode.ts`.

**The founder's live flip is UNREPRODUCED on a fixture, and `b41`'s printout
says so in those words.** The card is the verdict: light `/w/billing` →
`/vendor/discover/preview` → `/w/billing` still light.

## 3 · E-2 — THE BILLING DOOR AND THE UNLISTED EXIT

`/vendor/billing` is a D-8 redirect stub to `/w/billing`, following
`app/vendor/studio/page.tsx`'s precedent. **It inverts rather than dies at
Phase 7** — arm (a) swaps the paths, so the redirect reverses direction and
`src/lib/pwaPaths.js`'s `billing` value stops being a stale spelling. Stated in
the file so the next seat re-points the line rather than re-deriving it.

**`C26` caught it in the same run** — `app/vendor/billing/page.tsx` was declared
in the old-chrome census and now mounts nothing: 「declared but mounts nothing —
shrink the census」. The row is **REMOVED, not zeroed**: a zero is a claim about
chrome, and there is none.

**`INTERIM_VENDOR_LINKS` 6 → 7.** `/vendor/onboarding` joins — `WorklistBoot.tsx:77`
does `router.replace('/vendor/onboarding')` on incomplete onboarding, a LIVE exit
from the shell that no interim set counted and no audit could see. Found by
sweeping every `/vendor/` string reachable from the shell, not by reading the
sets. **LINKS, not ROOMS**: `C24` counts `href:` fields in the registry and would
have reddened on the wrong set. Not stubbed — billing stubs alone, by ruling.

## 4 · F-39.26 — THE DOOR THAT WAS BUILT AND NEVER WIRED

`refreshToday()` existed, was exported, and its doc read — **in the present
tense** — 「The verbs call this after a write commits」. A sweep of both repos
found **ZERO callers**. `pending` is module-scope, so a fresh mount of
`useTodayFeed` awaits the same settled promise and the vendor reads the state she
just changed.

**Present-tense stale ink is the hardest kind to catch, because it reads as a
description and functions as a promise.** Corrected in place with that recorded.

**Two callers now, one door:**

- `WorklistShell` on every navigation **and on return-to-focus**. The focus arm
  is the half navigation cannot see: a vendor who answers WhatsApp and comes back
  has navigated nowhere, and the reading behind her is as stale as if she had.
- **Seven money writes** in `vendor.ts`, after commit — create/update invoice,
  record payment, cancel, create/update/delete expense. That covers a write and a
  read on ONE route, which navigation cannot see either.

**No verb-specific hack.** Both callers call the same function; the memo has one
way in and one way out. Each verb patching the cached body would be two
derivations of one reading — the disease the memo was built to cure.

**OWED IN 2b-2:** the both-ways cell (drop the door → the stale count witnessed).

## 5 · b41 — A FIXTURE THAT NAMES ITS OWN LIMIT

Six cells, `§3.1` non-vacuous, printout ending **NO BLEED REPRODUCED ON FIXTURE;
GROUND IMMUNITY PROVEN**. It carries `app/globals.css` verbatim from disk and
exercises both writers in the founder's mount order.

Its comment stripper hand-scans for block comments and **refuses to pair an
unclosed `/*` across a file** — F-39.13's cure note gains this instrument.
It exists because the first cut reported `AddFab.tsx` as an unguarded `useT()`
consumer when AddFab never calls it: the mention is inside a JSX `{/* … */}`
explaining why it mounts `WlToast` rather than `Toast`. A cell reading its
subject's explanation of a defect as the defect is F-39.25's mirror.

## 6 · CORRECTIONS THIS SEAT OWNS

**c-2c.7** — the seat published a mechanism off a grep that could not see a
runtime-composed name. `--atelier-page-bg` is composed by `prefixFor` + the token
key `'page-bg'`, so a grep for the full name returns nothing; the seat read that
absence as a fact and named a bleed mechanism inside a single message. Retracted
in full. `b41` now reads the token maps and applies the prefix rule rather than
asserting anything about source text.

**c-2c.8** — the seat wrote a non-vacuity probe against the mechanism it had
already retracted. The probe should have been derived from the founder's
observation, not from a superseded reading.

**s-2c.2 — A LAW, NOT A NOTE.** A `python - <<'PY'` heredoc mangles backslash
escapes into generated JS regexes. The seat hand-patched `b41` four times through
one; the third patch produced a **silent no-op comment stripper and was reported
as a fix**, and only the assert added on the fourth attempt revealed the fifth
had not matched either. **Heredoc-generated JS carrying backslash regexes is
written as a WHOLE FILE, or every edit asserts its anchor.** Every generated edit
in this ZIP asserts; the one that did not match said so instead of claiming
success.

## 7 · WHAT 2b-2 CARRIES

**Arm D (a)** — `/w/team` hosts three tabs as LISTS matching `C2`, under the
masthead, inheriting the shell, no boot animation. The `+` FAB and every edit
path keep routing to `/vendor/studio/*`; those three hrefs STAY in
`INTERIM_VENDOR_LINKS`. Card ⑥ amended: 「tabs open under the masthead; tapping +
still opens the old studio sheet — declared, not cured」. F-39.30
**OPEN-AS-NARROWED** with that sentence.

**The contract, derived and complete:**

| tab | door | rows |
|---|---|---|
| Team | `fetchTeam()` | `name` · `role` · `active` → Active/Inactive |
| Tasks | `fetchTasks({ state: 'all' })` | `title` · `due_date` · `team_members.name` ?? Unassigned · `state` · `completed_at` |
| Payments | `fetchPaymentsByWedding()` | flatten `weddings[].payments` + `loose.payments`; `member_name` · `event_date` · `description` · `amount_inr`; `owed` → Unpaid |

`WeddingPayment` carries every field `C2-pay` renders — the flat `GET /` has no
event join and the frame's date is the EVENT date, not `paid_at`. `fetchTasks`
already takes `params.state`, so `?state=all` needs no new API surface.

**`Invited` is not on the contract** — `team_members.active` is
`boolean NOT NULL` (ordinal 8), two-valued, no CHECK enumerating a third state
and no `invite` token in `team.js`. Arm (i) ruled: render the two states the
boolean holds; the mock's caption amended by delegation.

**C49 constrains it:** the tabs must reach for `Fab`. `.wl-fab` is emitted once
by `WorklistShell:228` from `GRID.fab` and `Fab.tsx:49` is the only component
wearing the class. A `+` drawn inside the tabs body is a seventh seat and C49's
import-graph walk finds it — 「six seats existed when four were believed to」.

Also 2b-2: **F-39.26's cell** · **`C58` amended** (site list changes for the body
swap; its `isPrestige` full-tree sweep and person-name scrub survive verbatim;
`TeamHubScreen` keeps BOTH readers — `app/vendor/team-hub/page.tsx` untouched
until 2c-Studio) · **seven studio copy bytes** by delegation (`Tasks` ·
`Payments` · `Members` · `Open` · `Unpaid` · `Paid`; `Done today` is ONE key with
both consumers named) · **the dream-os companion** (the two engine money GET arms
retire — their readers left at `d38d0ab`; `s-2c.1`'s 900-char lookbehind;
`base_guard` equality + the b40 REFUSED-not-FAIL cell).

`generateInvoiceForBinder` does **not** go dead at that retirement: `b47` 1.3's
declared exception records three live callers — `vendor-engine/chat.js:422`,
`vendorInbound.js:1698`, `index.js:149`. F-39.33 stays open on its own terms.

## 8 · SQL

**ZERO.**
