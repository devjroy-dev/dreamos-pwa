# TDW_07 tail — F-07.107 + F-07.109 · CLIENT HALF (ZIP 2 of 2)

**Base:** dreamos-pwa `e8db357` · **apply AFTER** the dream-os half (base `c43bec0`).
Order is not cosmetic: the server must be able to serve `sender_name` / `sender_user_id` before
this screen reads them. Applied in the wrong order the bubbles simply keep rendering as they do
today — no crash, but no cure either, and a walk run in that window would report a false miss.

---

## 1 · WHAT THIS SCREEN WAS DOING

`app/coplanner/threads/[threadId]/page.tsx` carried three independent defects on ten lines.

**F-07.109 — the phantom compare.** `:139` computed
`const mine = m.sender_user_id === session.user_id`. `session.user_id` is real. `sender_user_id`
was emitted by **no server response on this lane, in any shape** — zero hits across the whole
dream-os tree. So `mine` was permanently `false`: every bubble took the `!mine` branch, and the
reader's own messages rendered as a stranger's, right-aligned never, gold-filled never.

**F-07.107 — the role wearing a name field.** The server handed `sent_by` to `sender_name`, so the
`!mine` branch printed the role. Combined with the above, the founder's own bubble read
`COUPLE`.

**F-07.110 — the dead map, minted at read-first.** `ROLE_LABEL` keyed on
`Partner / inner_circle / circle / co_planner / primary`. The value arriving in `actor_role` and
`sender_role` is `sent_by`, whose minted space is `couple / bride / circle_member` — and, on live
rows, `agent` (F-07.112). **Zero overlap in every direction**, so `msgRoleLabel()` returned `''`
for every message ever displayed and the ` · Role` suffix has **never once rendered**. F-07.89's
family: the client believing in a value-space the server does not emit — value rather than field.

---

## 2 · WHAT SHIPPED

**`mine` is UNCHANGED.** The cure put the field on the wire rather than bending the line around
its absence. A pre-0105 row, or a send that carried no credential, has a null id: the comparison
is false, the bubble takes the stranger branch, and that is exactly how it rendered before — no
regression on history.

**The label has three cases and no fourth:**

- **own** → 「 You 」 — the delivery's **one** new user-facing byte, founder-vetoed and frozen,
  matching `sanctuary:2625` which has always said 「 You 」 on the bride's own bubbles.
- **named** → the hydrated name alone. No suffix: 「 NO TAG 」.
- **unnamed** → **nothing**. Not the role. Every row written before `0105` has no author and none
  can be invented for it (history stays NULL, founder-ruled). Falling back to the role would
  reprint the exact string this delivery exists to remove — and on the founder's own rows that
  string reads `couple` over a circle member's own words, or `agent` for Mira, who is not a
  person. **An absent label is the honest rendering of an absent author.** It is also zero new
  bytes: the surface already omitted the eyebrow when `sender_name` was falsy, so this is the
  existing branch reached by a new path.

**`ROLE_LABEL` and `msgRoleLabel` are DELETED**, not re-keyed. Re-keying would start printing the
role, which is the thing being cured.

**The `sender_name` parameter is dropped at all three senders** — `page.tsx:93`,
`sanctuary:2906` (which posted the literal `'Bride'`), `journey.ts:490` (which posted the
role-string `'couple'`, not a name at all). The server no longer accepts it; hydration happens
from the owner row.

**`memberName` went with it** — the import and its binding, so no dead reference is left behind.

**KEPT, inventoried and asserted by cell:** `sanctuary:2625`'s 「 You 」/`'Circle'` render and
`:2872`'s optimistic local push. Both are the bride's own surface, both were already correct, and
`:2625` gets a free win from the server half — a member's bubble there printed the literal
`circle_member` and will now print her name, with **zero bytes changed on that line**.
`sanctuary:2906` keeps `sender_role` — it is a role, it is stored as one, and `:2625` reads it.

**`lib/frost/journey.ts`'s `CircleMessage` type** gains `sender_user_id` and a declaration that
its three consumers do not exist. Named rather than silently corrected: `fetchCircleThreads`,
`fetchThreadMessages` and `sendThreadMessage` have **zero consumers** anywhere in this tree. A dead
export with a lying type is what the next reader inherits.

**`app/coplanner/threads/page.tsx` is 0-line.** It declares `sender_name` and renders only
`content`; the server's site-4 cure reaches it with nothing to change here.

---

## 3 · CONTROL INVENTORY — the live surface, every control and verb

| Control / verb | Verdict |
|---|---|
| Back button `:106` | KEPT |
| Message input `:182` | KEPT |
| Send button `:202` | KEPT |
| Enter-to-send `:188` (verb) | KEPT |
| Focus/blur outline `:190`/`:191` (verbs) | KEPT |
| Bubble alignment + fill | **CHANGED** — `mine` becomes true for own rows; this branch has never once executed |
| Bubble sender label | **CHANGED** — condition and content |
| Bubble body / timestamp | KEPT |
| Bubble tap target | **NONE EXISTS** — no `onClick`, `href` or `tabIndex` on any bubble. Declared, not discovered. |
| Poll | **NONE ON THIS SCREEN** — load on mount, reload after send. Sanctuary polls at 10s; this does not. |

---

## 4 · PROOFS

`tdw07_f0772_circle.proof.mjs` **64 → 81**, labeled (§8's thirteen cells + four §7 mutations).
Extended in place: these cells guard the same surfaces §2 and §3 already guard.

The client half is necessarily source-derived — no DOM in the build container, no server to
answer — so §7's **process-boundary** mutations are what make it non-vacuous. Four added:
M-11 the own-bubble loses 「 You 」 · M-12 the compare unwired · M-13 the role creeps back into the
label condition · M-14 sanctuary posts the client-minted name again. **13/13 mutations RED across
process boundaries, all restored byte-identical.**

**§8.13 pins across the repo boundary**: the server half's `0105` must name both columns.
Skips loudly with its reason when the dream-os tree is not beside this one — proven green in a
true sibling layout, never a silent pass.

**Floor, re-derived at this tip:** **tsc ZERO true-exit on cleared `.next`** · p1 43 · p2 48 ·
p3 117 · p4a 69 · slice1 30 · probe 33 · body 133 · f0760 82 · f06133 41 · p6_fold 68 ·
auth_crossover 46 · f0766 28 · f0770 104 · m3_chip GREEN · f0790 37 · f0784 34 · f0789 30 ·
f0774 35/35. Every count byte-identical to CE-125; only `tdw07_f0772_circle` moved, and it is
labeled. The F-07.74 stripper pin is not regressed.

---

## 5 · COPY

**C1 「 You 」 — the only new byte, vetoed and frozen.** C2–C6 are deletions. Nothing else entered.

**Named so it is not read as a miss:** older bubbles will carry **no name line at all**. That is
the designed outcome of history-stays-NULL, not a rendering fault.

---

## 6 · WHAT THE FOUNDER WALKS

The smoke card ships in the delivery message. It walks **new** messages only and names the
pre-cure absence rather than performing it — walking the thread as originally chartered would have
put a member's private exchange with Mira in front of him labelled "group chat", which is the
exposure F-07.112 names.
