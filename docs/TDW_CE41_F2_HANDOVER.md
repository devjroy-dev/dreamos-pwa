# CE-41 · F2 — THE MODEL ROUTES PANEL · HANDOVER

**Cut at `81570ed371a547f29ee4be32dd75bf173a6d68af` (dreamos-pwa).** Sibling dream-os
at `c473390` — F1's doors, live. Seat: CE-41 LE-F. Six files.

The room is seat E's (`docs/mocks/COCKPIT/COCKPIT_VETO_SHEET.md` §D, rows 27–35, and
§E-42/43). The plane is F1's. The paint is the current card's `T`, per the chair —
seat E's `--atelier-*` retint has not landed in code at this tip.

---

## 1 · WHAT SHIPS

| File | What it is |
|---|---|
| `app/admin/switchboard/ModelRoutesPanel.tsx` | the group: surfaces, tiers, one 44px role row per switch |
| `lib/admin-api/modelRoutesCopy.ts` | every word, including the three persona names |
| `lib/admin-api/index.ts` | `getModelRoutes` / `setModelRoute` and the lane type |
| `app/admin/switchboard/page.tsx` | **two lines** — an import and one element |
| `scripts/b61_f2_model_routes_panel.js` · `b61_mutations.js` | 34 cells, 21 mutations |
| `scripts/floor-manifest-ce41-f2.txt` | the declared dirt and the floor |

**The panel holds no routing map.** Not a lane key, not a provider id, not a model
string. Keys, roles, the switchable set, the fallback geometry and the tier
vocabulary all arrive from `modelRouter.js`'s registry through the read door. Four
cells and four mutations exist for that one property, because a copy of the routing
map on the glass is the day the glass lies about the wire while the founder reads it.

**Every colour is a `T.*` reference; the two authored files contain no colour
literal.** When seat E's retint lands, the colours to move are all in one place and
there are no others.

**The live segment fills with the card accent, not a state ink.** The frame's teal is
`--atelier-accent-text` in seat E's palette; reaching for `T.success` to match it
would have made a state role into a ground, which R-40.129 forbids. A selection is
not a state. Mutated (`M6`).

---

## 1a · RATIFIED AT THE CUT

**R-41.103** — the three deltas of §3 are ratified: *built to the plane, which
outranks the drawing.* Basic shown as a tier and Trial read-only (F-41.86/.87 made
visible where the founder decides); the couple WhatsApp line switchable, with seat
E's §D-34 *Set on the server* re-aimed at the **bride app lane** (Eliza,
`BRIDE_LLM_PROVIDER`), which holds no row and is the one genuinely read-only line;
and four provenance words — `default · borrowed · seeded · changed <date>` — because
*default* for a borrowed lane was false.

The two seat-owned, self-caught corrections of §2 and §5 are **c-41.51** (the
withdrawn orphan route) and **c-41.52** (the glob misattribution). They were first
issued as c-41.40 / c-41.41 and reassigned — see §8.

## 2 · THE ORPHAN ROUTE — caught by another seat's proof, and it was right

The first cut shipped `app/admin/model-routes/page.tsx` so the founder could walk §7
without waiting for seat E's Switchboard re-shape. The floor came back with one
delta: `RED: tdw10_p1_shell` — *every route on disk has a row in the table*, and the
count assertion moved from 36 to 37.

**I did not edit that proof.** The proof was right and so was the ratified IA: the
veto sheet lists **Model routes among the Switchboard's groups**, not among the
cockpit's rooms, and a room of its own would also have needed a nav row, a domain
placement and a count amendment — three IA decisions belonging to seat E. The route
was withdrawn and the panel mounted where the frame always put it, by **one labelled
cross-seat line** in `app/admin/switchboard/page.tsx` (c-41.10's form, the same
precedent the chair set for `whoFlipped`). The floor is now `NAMED BASE, no delta`.

A cell (`§0`) and a mutation (`M19b`) now hold that shape: no route of its own, and
exactly one mount.

---

## 3 · THREE DELTAS AGAINST THE RATIFIED FRAME — the chair rules, I did not

Each is a place where seat E's §D and the live plane disagree. I built to the plane
and am naming all three rather than silently reconciling either way.

**① The frame draws `Trial` as a live switchable tier on both vendor surfaces, and
does not draw `Basic` at all** (§D-29: *"Trial · Essential · Signature · Prestige ·
Advisor — the router's five"*).

The router's five reachable lanes are **Basic**, Essential, Signature, Prestige,
Advisor. `vendors_tier_check` (0115:118) admits four tier words and `trial` is not
one of them; 0115:104 moved every old trial vendor into `basic`. **Basic is 25 of the
estate's 29 vendors** — the founder's own count, 2026-09-09 — and `model.pwa_vendor.trial`
is a live, well-formed row that no code path can ask for.

The panel therefore shows **Basic** as a tier like any other and **Trial** with the
read-only outlined switch and the words *"No lane reaches this row. It is read-only
until it is retired."* The door refuses writes to it with a 409, so offering a switch
would be a control that does nothing.

**② §D-34 makes "Answer couples on WhatsApp" read-only, *Set on the server*.** That
describes the **bride** lane, which reads `BRIDE_LLM_PROVIDER` from the environment,
holds no row, and is not served by F1's door at all. The **couple** lane is
`model.wa_couple.default` — a live row the router reads and this panel can move. I
render it **switchable**, because drawing a live row as read-only would tell the
founder something untrue about his own estate.

**The bride lane is genuinely missing.** The chair's ruling 3 (first reply) said the
bride lane appears read-only with its env named. F1's door does not serve it — it is
not a row and not in `LANES` — so F2 cannot render it without either a small F1 rider
or a hardcoded lane on the glass, and the second is the thing this whole panel
refuses to do. **Filed as owed: a read-only `bride` entry in the read door's payload.**
Until then the group head says five surfaces, which is what the frame says.

**③ Two provenance words beyond the frame's two.** §D-31 ratified `Anthropic ·
default` and `DeepSeek · changed 4 Sep`. Two more were needed and each answers the
same question — *where did this value come from*:

- **`borrowed`** — a WhatsApp vendor lane with no row of its own resolving through
  its in-app twin (F-41.46). `default` would be false twice over: there is no
  `wa_vendor` entry in the code matrix, and the value shown came from another lane's
  row.
- **`seeded`** — a row exists and no hand has moved it: 0153's four `wa_vendor` rows,
  and every row written before this panel existed. `default` would deny the row;
  `changed` would invent a hand.

A fifth line exists for an unset split: *"following Victor"*, rather than drawing
Donna's switch as though she held her own value when she is riding his.

---

## 4 · THE DECLARED GAP — R-41.89's pre-existing debt

R-41.89 puts persona names on Model routes and nowhere else. **The estate does not
satisfy that and did not before this packet.** Two files carry a persona name in
rendered code at the uncured tip — `app/admin/prospects/page.tsx` (*"Mira is talking
to them"* in its own chrome) and `app/coplanner/page.tsx`.

Curing that means rewriting other seats' copy mid-arc, so this packet does not. The
bench asserts what this seat controls — that its own files carry persona names in the
copy home only — and **prints the pre-existing set on every run** so the debt cannot
quietly become the baseline. Unnumbered finding; the chair mints.

---

## 5 · PROOF

- `b61_f2_model_routes_panel` **34/34** cured · **5/34** at the uncured tree.
- `b61_mutations` **21/21** — each edits production code in a scratch copy and must
  red its **named** cell.
- Floor: **one invocation**, sibling present at `c473390` —
  **`FLOOR = NAMED BASE, no delta (refusals, not in base: 0)`**. Nothing above, nothing
  below.
- `npx tsc --noEmit` clean.
- **`npm run build` is NOT claimed here.** This container cannot reach
  `fonts.googleapis.com` and `next/font` fails against the egress proxy, so the build
  is the founder's gate (R-40.66) and the last line of the verify block.

**Two cells were weak and two mutations found them** — both fixed, both worth naming
because each was one edit from proving nothing:

- The §D-33 banner cell asked whether a `${` followed the ratified sentence. The
  mutation appended ` It is set to {forced}.` — JSX interpolation is a *single*
  brace — and the cell stayed green. It now extracts the banner's whole text node and
  compares it exactly.
- The provenance-order cell compared `indexOf` positions. Deleting the `borrowed`
  branch outright gives `-1`, which is less than every real offset, so the cell was
  green against a `provenanceWord` with the branch gone — the silent-zero trap
  `tdw10_combined_cap` §1.6 documents on the other side of the estate. It now
  requires presence before order.

**And one derivation I got wrong and caught:** I first attributed the floor delta by
running `node scripts/tdw10_p1_shell*.js`, a glob that does not match `.proof.mjs`.
It returned rc=1 — a missing file — and I nearly read that as "already red at the
uncured tip". Run with the right name it was **green** there, which is how the orphan
route was found to be mine. **That is the second time this arc a broken precondition
nearly wrote a false attribution into a handover**; the first was a dangling
`node_modules` symlink in F1. Both were one command from being nothing, and both are
`tools/preflight.sh`'s own named class.

---

## 6 · THE WALK (§7) — now that both fixtures have rows

`+919888294440` DEV440 is **essential**; `+918595356978` MAKEUPBYSWATIROY is
**prestige**. Both have `model.wa_vendor.<tier>` rows from `0153`, so §7's original
order stands.

1. Open **Switchboard**. Model routes is a group on that page, below the register
   groups.
2. Under **Answer vendors on WhatsApp → Essential**, tap **Donna → Anthropic**.
   The line beneath her reads `Anthropic · changed <today>`.
3. Send Victor a WhatsApp message from DEV440 that makes him ask her something.
   Railway prints `[model] surface=wa_vendor tier=essential role=donna provider=anthropic`.
4. Tap **Donna → DeepSeek**. The same line names `deepseek`.
5. Nothing on Victor's row, in the app, or on any other lane moves.

**Mira's nudge** reads on the existing `[closer]` line — `route_provider` beside
`called_provider`. No new byte was needed there.

The panel says *live within 60 seconds* in words. It clears the cache on the server
that took the write; another instance keeps its own window. **It never says
instantly** — mutated (`M15`).

The basic-tier walk (F-41.86) needs a basic vendor and is the founder's own choice
after this lands, per the chair.

---

## 7 · OPEN

1. **The bride lane is not served** — owed: a read-only entry in F1's read door
   (small dream-os rider), or the chair confirms it stays off the panel.
2. **The three frame deltas** of §3 — the chair either amends §D or rules the panel
   changes.
3. **R-41.89's pre-existing debt** — two files, unnumbered, chair mints.
4. **The basic-tier finding and `model.pwa_vendor.trial`'s retirement** — both still
   open from F0/F1; both are now *visible* on this panel rather than silent, which
   was the point.
5. **When seat E's re-shape lands**, the mount moves to its place in the new group
   order. One line there; nothing in seat F's files changes.

---

## 8 · THE RENUMBERING, AND WHAT THE LEDGER ACTUALLY SAID

These two corrections were first issued as **c-41.40** and **c-41.41** and are now
**c-41.51** and **c-41.52**, reassigned by the chair under **F-41.97** — the
parallel-mint law's own failure mode, twice in one arc, on the allocation side rather
than the seat side. The original numbers are recorded here rather than overwritten: a
correction log that loses its own history is a log that cannot be read back, and the
F2 commit at `501d7bf` carries the old pair in its message permanently.

**The collision was one, not two.** A full-body search of both repos at the cut
(`git log --all --format=%B | grep -o 'c-41\.4[01]'`) returns exactly one occurrence
of `c-41.40` — seat D's at `c52e92a`, *"b62_mutations M6 anchor re-derived"* — and
**zero** of `c-41.41`, which no commit but my own F2 has ever held. The first report
of this said two; the fuller search corrected it and the chair recorded the
correction. The pair still moved together, because splitting them across two bands
would make a reader follow a footnote to learn that only one had moved.

`c-41.51` and `c-41.52` were derived free on both repos immediately before allocation,
which is the step whose absence produced F-41.97 in the first place.

**Separately, `c-41.36` is doubled and stays doubled.** Seat E's `81570ed3` — the tip
F2 cut from — reads *"c-41.36 count corrected"*, and seat F's `c473390` reads
*"c-41.35/.36 two transcription cells cured"*. F1 pushed second. It was not visible at
F1's cut and is visible now; the chair holds it.
