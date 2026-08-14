# TDW_14 · D-5c — STEP 9's CURE · HANDOVER

**Base:** dreamos-pwa `2c8e026` · dream-os `47a1f40` (untouched — zero bytes move)
**Findings cured:** F-14.20, F-14.21, F-14.22
**Findings filed, not cured:** F-14.23 (gold siting), F-14.24 (the floor glob)
**Files:** 3 — two edited, one new. No copy proposed; the frozen 34 stand.

---

## 1 · F-14.20 / F-14.21 — one cause, two faces

`app/layout.tsx` renders both offenders as **static children of the root
`<head>`**:

- `:72` — `<link rel="manifest" href="/manifest.json" />` → `public/manifest.json`, `short_name: "TDW"`
- `:76` — `<meta name="apple-mobile-web-app-title" content="TDW" />`

`app/coplanner/layout.tsx` is `'use client'`. React hoists its declarative
`<link>` into the same head, but **after** those. Both tags are
**first-in-tree-wins** — the manifest spec takes the first `rel="manifest"` in
tree order; WebKit takes the first meta of a given name.

So D-5's member key was **correct, served, and never read**. The handler,
`brideName()`, the sentinel, the `?b=` plumbing — all sound, all bypassed. iOS
read `"TDW"` from the meta; Android read `"TDW"` from `/manifest.json`. Step 9
could not have passed on either platform.

**The admin lane shares the defect.** `app/admin/layout.tsx:382,396` mints
`/admin-manifest.json` and `"TDW Control Room"` behind the identical pair. D-5
cited admin as precedent; it is a fellow patient, not a validation. *If the
founder has ever installed the admin panel to a home screen and it showed its
own name, this derivation is overturned and must be re-cut.*

### The cure — the displacement

One `useEffect` in `app/coplanner/layout.tsx`, keyed on `manifestHref`. It
retargets the root's manifest link and rewrites the root's apple title for the
duration of the coplanner scope, and restores both on unmount.

**Why imperative, and why not the shape the kickoff expected.** A second tag
beside the first is not an override — it is a tag the browser never reads.
Adding one reproduces the preemption. And the alternative, root-yields, is
impossible twice over: the root layout is a **server component with no
pathname**, so it cannot scope itself; and the name is **derived from the client
session**, so no `metadata` export or `generateMetadata` can carry it. The cure
has to be client and imperative or it cannot exist. Ruled at CE-33 §5.

**The three binding constraints, and where each is met:**

| constraint | met at | benched at |
|---|---|---|
| attribute selectors, never position; safe no-op if a tag is absent | `querySelector('link[rel="manifest"]')`, `querySelector('meta[name="apple-mobile-web-app-title"]')`, `if (!link && !meta) return;` | §3.1–§3.4 |
| the restore is benched, not promised | the cleanup returns each **captured** value; `live` closes the fetch arm | §4.1–§4.5, mutation §7.4 |
| the pre-hydration window in the file's own ink | the effect's comment block | §5.1–§5.4 |

**The name is not computed here.** The title is read back off the manifest the
handler just served (`m.short_name`), so `manifest/route.ts` stays the **one
site** that owns rule ㉕ and the possessive. If this layout ever built the name
itself, the absent-identity sentinel would reach a home screen as `"the's
Circle"` — the exact failure ㉕ exists to prevent. Mutation §7.5 reddens if a
second site appears.

**The pre-hydration window, honestly.** Until React hydrates, both tags carry the
house wording, and that is correct — nobody has signed in yet. Step 9 does not
care: Add to Home Screen and the Android install prompt are both user gestures
inside an already-hydrated app.

---

## 2 · F-14.22 — the error step had no ground

`SCRIM` (`rgba(12,10,9,0.38)`) is the **bottom strip's** ground, and the error
step is the branch that *replaces* the strip (`step !== 'error'`). It therefore
inherited nothing: two lines at `zIndex 20` over a full-bleed cover photograph, a
vignette **transparent at 20% centre — exactly where the text sits** — and one
`0.18` wash.

### The cure — the panel, not a stronger scrim

`ERROR_PANEL`: opaque `INK` ground, `EDGE` hairline, radius 16, `maxWidth: 340`.
The error step's two lines are seated on it.

**Why the panel.** Contrast against an unknown photograph is not benchable — a
cell could only assert an alpha and call it legibility. Against a fixed opaque
ground it is arithmetic. Adopted into R-33.9's body at CE-33 §6.

The bench **computes** rather than trusts, resolving `INK`/`CREAM` from
`CircleSessionContext` and reading the body alpha off the source:

```
heading  CREAM #F8F7F5 on INK #0C0A09         = 18.45:1
body     CREAM @ 0.6 composited on INK        =  6.88:1     (WCAG AA = 4.5:1)
```

No new raw hex: `INK` and `EDGE` were already in scope, so `tdw07_f0772`'s pinned
import and D-5 §7.3's one-hex count are both untouched (§6.1–§6.3).

---

## 3 · Verification

| check | result |
|---|---|
| `tdw14_d5c_step9.proof.mjs` | **39/39 green**, five mutations non-vacuous |
| `tdw14_d5_welcome.proof.mjs` (D-5's own) | **66/66 green** — no regression |
| Floor, `run-floor.sh --check`, clean sibling-full cured tree | **`FLOOR = NAMED BASE, no delta`** |
| TSX syntax parse, both edited files | clean (`tsc --noResolve`, no TS1xxx) |

**Two declared gaps, not greens:**

1. **Type resolution unproven.** No `node_modules` in the authoring container, so
   only a syntax parse was possible. The founder's build is the settling check.
2. **dream-os floor not taken.** Its runner returns 69 red in an env-less
   container against the seal's ~21. Attributed to missing Supabase/provider env
   and `node_modules`, not accepted as a tree fact. Zero dream-os bytes move in
   this delivery, so this is a formality — but it stays a gap.

**A floor note that cost one cycle, worth carrying forward:** `run-floor.sh`
takes NEEDS_CLEAN benches first, and `tdw_f0774_vacuity_probe` refuses a dirty
tree. **The floor must be run after `git add`, not before.** Two other benches
(`tdw09_p2b_vocab`, `tdw13_d6_parity_matrix`) read the dream-os sibling by
relative path and red without it — the floor is only meaningful **sibling-full**.

---

## 4 · The re-walk — Block 14's last card

Step 9 alone, both platforms, production:

1. **iOS** — open a circle, Share → Add to Home Screen. The suggested name reads
   **`{Bride first name}'s Circle`**.
2. **Android** — browser menu → Install. Same name.
3. **The panel** — re-tap a spent invite link. ㉗ is legible on its own ink
   ground, not floating over a cover photo.

The handset walk is the **settling proof** for the hoisting derivation. No bench
here replaces it: this bench reads source, cannot mount a head, cannot run an
effect, and cannot see a home screen.

Green closes Block 14.

---

## 5 · Filed, not cured

- **F-14.23 — gold, resolved-narrow.** No value drift: `#C9A84C` is identical at
  all 149 render sites. The disease is siting — **eleven** `const GOLD`
  declarations, exactly one exported (`CircleSessionContext:5`), and
  `lib/frost/tokens.ts` carries **no gold at all** (Frost V2 is `#C4856A` wine /
  `#4A7A9B` sky). The destination question — auth/circle accent vs Frost token —
  is real and open. Priced, not taken.
- **F-14.24 — the floor's own glob.** `run-floor.sh` enumerates
  `scripts/*.{proof.mjs,mjs,js}` and omits seven `.proof.ts` benches
  (`assignmentWords`, `bands`, `cityMatch`, `crewCommit`, `postAccess`,
  `rosterMint`, `settleWords`) that live behind their own `run-*-proof.sh`
  wrappers. The file whose header exists to stop hand-written enumerations has
  one. Cure rides the next dream-os-touching delivery; the committed 21-base
  re-derives when it does.
