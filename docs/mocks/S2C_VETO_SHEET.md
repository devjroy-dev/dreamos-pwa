# 2c-STUDIO · COPY INVENTORY & VETO SHEET

**Packet** `docs/mocks/studio-sheets-mock.html` · sha256 `c5eb9059b7c32f02f5a0e822c3dd6b9f468f4e4a75aa4e8ef7b473df1af375e3`
**AMENDED 2026-09-02 · F-2c.w1.** The packet ratified at `665b4f3496b8` drew every sheet with no head control, and E1's caption claimed the scrim behind it stayed reachable. On glass the member sheet reaches the masthead and nothing behind it is tappable, so `Remove` and `Save` were the only ways out of it. All five sheets now carry a head dismiss, named `Cancel` (§B, byte unchanged) with the glyph hidden from the accessible tree. Founder-ruled arm (b): the head, never the foot beside `Remove`. E1's caption is corrected in place rather than dropped.
**Frames** E1-member · E2-task · E3-pay · E4-settle · E5-invoice · E6-cancel · E7-settled — 7 frames, 374 and 390, both modes, 28 shots.
**Tips** dreamos-pwa `60e439b` (worklist) · dream-os `f5e1933` (main), both re-derived at the cut.
**Authored against** the chair's four rulings (CE-39 → 2c-Studio seat) and c-39.46's TEN verbs.

Every byte below is vendor-facing. Silence ships it as authored; strike anything and it is struck.

---

## A · THE FOUR RULED BYTES — already carrying the chair's YES, listed so they can still be vetoed

| # | Where | CURRENT | PROPOSED |
|---|---|---|---|
| A1 | mark-paid, expense landed | `Marked as paid` (unconditional) | **`Marked as paid.`** |
| A2 | mark-paid, expense did not land | `Marked as paid` (same byte — the failure was unsayable) | **`Marked as paid — the expense wasn't logged.`** |
| A3 | invoice PDF, ok-false fallback | `PDF not ready yet — try again in a moment.` | **`Couldn't prepare the PDF just now. Try again in a moment.`** |
| A4 | cancel a team payment | button `Delete` · toast `Payment removed` | **button `Cancel payment`** · **toast `Payment cancelled`** |

A3's second site, `SliceShell.tsx:928`, currently reads `PDF not ready yet — record the advance first.` That one is **not** the same defect: it names a real precondition. It moves to `copy.ts` with the first (one home, ruling 4) and its wording is **unchanged**. Struck only if you say so.

---

## B · THE SHEETS — new surfaces, so every byte is a PROPOSAL

### B1 · Member sheet (E1)
| Slot | PROPOSED | Note |
|---|---|---|
| title, add | `Add member` | today `Add Member` — title case retired, the shell sentence-cases |
| title, edit | `Edit member` | today `Edit Member` |
| labels | `Name` · `Role` · `Phone` · `Rate per event` · `Notes` | today `Name *`, `Rate per event (Rs)` — the asterisk and the unit both go: the gate speaks below, and `Rs` belongs to the figure |
| role options | `No role` · `Second shooter` · `Assistant` · `Editor` · `Runner` · `Videographer` · `Makeup artist` · `Coordinator` · `Other` | the door's own tokens, sentence-cased |
| block heads | `Assignments` · `Crew page` | unchanged |
| assignments empty | `No assignments yet.` | unchanged |
| crew buttons | `Send page` · `Rotate link` | unchanged |
| rotate warning | `The old link stops working.` | unchanged |
| gate | `Give the member a name to save them.` | today `Name is required to save.` |
| actions | `Remove` · `Save` | unchanged |
| toasts | `Member added.` · `Member updated.` · `Member removed.` · `New link created.` | today `Member added` · `Updated` · `Removed` · `New link created.` |

**A deliberate absence, flagged rather than hidden.** There is **no active/inactive control** on this sheet. `team_members.active` is `boolean NOT NULL`, the door filters `.eq('active', true)` unconditionally, and a member switched off would simply vanish with no way back. That is F-2b2.1's premise exactly, one layer over, and minting the control here would re-open the finding C80 guards. An *inactive members* view remains unbuilt and unruled.

### B2 · Task sheet (E2)
| Slot | PROPOSED | Note |
|---|---|---|
| title | `New task` | today `New Task` |
| labels | `Title` · `Description` · `Assign to` · `Due date` · `Priority` | today `Title *`, `Assign To`, `Due Date` |
| assignee default | `Unassigned` | `COPY.teamUnassigned` — one home, already read by the tabs |
| priority options | `Low` · `Normal` · `High` · `Urgent` | the CHECK's own four |
| gate | `Give the task a title to save it.` | today `Title is required to save.` |
| actions | `Cancel` · `Create task` | today `Create Task` |
| toasts | `Task created.` · `Task updated.` · `Task deleted.` | today `Task created` · `Updated` · `Task deleted` |

`Task deleted.` keeps its word: `team_tasks` **does** carry `deleted_at` and the route writes it. The word matches the write — which is the whole reason A4 changes and this does not.

### B3 · Log payment sheet (E3)
| Slot | PROPOSED | Note |
|---|---|---|
| title | `Log payment` | today `Log Payment` |
| labels | `Team member` · `Which function` · `Amount` · `Description` | `Which function` and the no-pick option are `settleWords`' existing bytes, carried |
| no-pick option | `No wedding` | unchanged (`NO_WEDDING_OPTION`) |
| suggestion | `Rs 12,000 — one function at Rs 12,000 each. Edit it before saving if that isn't right.` | today two bytes from `settleWords` (`suggestionLine` + `EDIT_BEFORE_SAVING`); this joins them into one sentence — **strike to keep the pair** |
| no rate | `No rate on file for them yet.` | unchanged (`NO_RATE_ON_FILE`) |
| gate | `Pick a member and enter an amount to save.` | today `Select a member and enter a valid amount to save.` |
| actions | `Cancel` · `Log payment` | today `Log Payment` |
| toast | `Payment logged.` | today rides `settleWords`' own result |

### B4 · Mark paid sheet (E4)
| Slot | PROPOSED | Note |
|---|---|---|
| title | `Mark as paid` | today `Mark as Paid` |
| labels | `Paid via` · `Notes` | today `Paid Via` |
| paid-via options | `UPI` · `Cash` · `Bank transfer` · `Other` | today `Bank Transfer` |
| actions | `Cancel` · `Confirm payment` | today `Confirm Payment` |
| toasts | A1 / A2 above | — |

### B5 · Cancel confirm (E6)
| Slot | PROPOSED |
|---|---|
| title | `Cancel this payment?` |
| body | `It stays on file, marked cancelled. Nothing is deleted.` |
| actions | `Keep it` · `Cancel payment` |
| toast | `Payment cancelled.` |

The body says what the estate actually does. `team_payments` has thirteen columns and **none of them is `deleted_at`**; the route sets `state='cancelled'` and the row survives. The old pair told the vendor a thing had been destroyed that had not been.

### B6 · The invoice row button (E5)
| Slot | PROPOSED | Note |
|---|---|---|
| button | `Mark paid` | the **same byte the swipe already reveals** — one word, two affordances, deliberately, so muscle memory and eye agree |
| nothing outstanding | `Already settled.` | unchanged; the button is **not** hidden on a settled row — it answers |

---

## C · WHAT IS NOT ON THIS SHEET, AND WHY

- **`Members` · `Open` · `Done today` · `Unpaid` · `Paid` · `Unassigned` · `Could not load this list.`** — already in `lib/worklist/copy.ts` and already carrying your YES at D-1. Untouched.
- **`Team` · `Tasks` · `Payments`** (the tab words) — ratified at D-1's C2. Untouched.
- Nothing on this sheet names a persona. No `Victor`, no `Donna`, no `Harvey`.

---

## D · ONE THING THE MOCK CANNOT SETTLE — AND IT DID NOT

**Read this before the next packet.** §D below asked whether the nav should stay lit under a tall sheet. It was the right question about the wrong thing: what mattered was not what the sheet COVERED but whether anything under it could be TAPPED. The frame was ratified, built to faithfully, and shipped a member sheet with no exit. A ratified frame proves what a surface looks like; an exit is not something you see. Every future packet states, per frame, how the surface is LEFT.

## D-old · THE NAV QUESTION, AS ORIGINALLY ASKED

E1 is drawn as the EDIT sheet because it is the superset. On a 374×844 frame it stands 790px tall and **covers the nav**; the masthead and the three tabs stay visible, which is the property the crossing exists for. If you would rather the nav stayed lit under a modal, say so and the sheet takes a max-height and scrolls instead — it is a one-rule change and it is cheaper to make now than after the build.
