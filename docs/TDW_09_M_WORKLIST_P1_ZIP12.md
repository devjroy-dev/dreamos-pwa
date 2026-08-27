# ZIP 12 — THE GATE'S FIRST RED, ANSWERED

**Over `66dd7dc`. Floor: twenty-three cells, exit 0. tsc: exit 0.**
**Per R-37.86 ⑥: this ZIP is not walk-ready until the audit prints all-PASS on the deploy.**

---

## ① THE THREE FAILS, AND THE RESIDUALS CLASSIFIED PER SITE

**Cure — dead stylesheet.** `.wl-plink`, `.wl-pcopy`, `.wl-pcopy.on` deleted. ZIP 11 removed
the markup and left the rules.

**Cure — the missed pairings.** ZIP 11's regex was *positional*: it matched `F.script`
immediately followed by `fontStyle`. A `fontWeight` between them and it slipped. Second pass
matched the two keys **anywhere in one declaration object** and found **2 more** —
`WishboneSheet.tsx` and `MessageBubble.tsx`.

**Correction — the assertion that was mine.** `/w` redirects client-side in a `useEffect`; a
fetch never runs JS, so no request can observe the hop. The gate now asserts the redirect
target is present in the served `/w` entry, and the behaviour stays where it is actually
proved — C17, against source.

**THE RESIDUALS — read individually, no fourth count, no third regex:**

| site | what it is | verdict |
|---|---|---|
| `contracts/page.tsx:207` | `fontStyle: file ? 'normal' : 'italic'` | **KEEP.** Italic marks an EMPTY field, normal a filled one. That is **state**, the job a placeholder colour does — not the prose voice screen four killed. Converting it deletes a signal |
| `discover/submit:270` | `fontStyle: pitch ? 'normal' : 'italic'` | **KEEP**, same reason |
| `SliceShell.tsx:950` | a **comment** reading "16px on F.script italic 300" | **NO CHANGE.** Prose about a rung, not a declaration. A comment-blind sweep would have "fixed" it |
| `OnboardingOverlay:385/:416`, `AddSheet:506` | `F.display` + italic — italic Italiana | **KEEP.** The display family, not the script role; one deliberate line each. Already Phase-2-deferred under R-37.80's class 3 |

Both conditional sites carry their verdict **as a comment at the site**, so the next sweep
meets the reasoning before it meets the regex.

---

## ② R-37.79 COMPLETED — the shell drawer is the whole drawer

The shell coin rendered **two** rows. The founder could not sign out or reach Settings from the
shell's own coin — a half-adoption that left the shell **less capable than the rooms it fronts.**

Full set, same order as the rooms' drawer: Atelier (Discover Profile · Settings · Billing · The
Dream Wedding · Tips & Features) · Display (Dark/Graphite · Light/Chalk) · Actions (Sign Out).
Scrim behind, 48px rows, hairlines, branch tokens. Sign-out goes through
`clearVendorSession()` — the estate's own single home, not a second implementation.

---

## ③ THE CHAT SHEDS THE COSTUME

`MessageBubble` was one of the two files the second pass caught, so the chat's message prose no
longer ships script+italic. **The placeholder byte 「Ask anything…」 is founder-era copy and is
NOT touched** — flagged, not invented, per the ruling.

---

## ④ THE ESPRESSO FLASH — MECHANISM NAMED, ONE HALF CURED, ONE HALF GLASS-ONLY

**Derived:** `app/globals.css` still declared Espresso at its **original** sites — `:root`
(`:729`, `:787`), the light block (`:812`), the atmospheres (`:892`, `:902`) — with ZIP 3's
Graphite appended at the foot **as an override that has to win**.

**That is the structural mechanism.** An override layer is fragile by construction: it depends
on parse order and on nothing later out-specifying it. And while it wins, the **first parsed
value of every ground is still Espresso** — which is exactly the shape of a first-paint blink.

**Cure: a value that is simply correct cannot lose.** **112 literals rewritten in place** at
their original declarations. First parsed value is Graphite, so the first painted frame is.
The appended block is now belt-and-braces rather than load-bearing.

**HONESTLY CLASSIFIED, per the INCONCLUSIVE discipline:** this cures the half a machine can
see. If a second half exists — a hydration race in `app/vendor/layout.tsx`'s inline pre-paint
pin, which writes `documentElement.style` on mount — **it is observable only on glass.** The
audit asserts the structural half and prints INCONCLUSIVE for the flash itself, with that
sentence as its reason. It gets its own walk beat.

---

## ⑤ THE AUDIT GROWS — each assertion's method stated

| assertion | method |
|---|---|
| the drawer's full row set at the shell mount | **served bytes** |
| no italic inside the chat mount | **served bytes** |
| **no `.wl-*` rule without a consumer** — the `.wl-plink` class of defect, now standing | **served bytes** |
| no Espresso literal parses in the served stylesheet | **served bytes** |
| the flash itself | **GLASS ONLY** — stated as INCONCLUSIVE, never as PASS |
| rooms-first behaviour | **source** (C17); the gate asserts only the served redirect target |
| pixel-identical edges | **GLASS ONLY**, unchanged |

---

## ⑥ THE CLOCK

Nothing here has met a deployed build. **The order of operations is: push → wait for Ready →
run the audit → and only on all-PASS does the founder get a walk card.** If the audit reds
again, this ZIP bounces and the founder is not asked for anything.

**Standing under R-37.86:** every count in this document was derived at the moment of writing.
The brace-matching sweep that corrupted `MessageBubble.tsx:90` is retired — this ZIP's second
pass matched declaration objects and each of its two hits was read individually before and
after.
