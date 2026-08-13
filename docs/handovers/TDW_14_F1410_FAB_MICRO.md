# repo: dreamos-pwa @ 3f1cb7f · F-14.10 — THE MUSE FAB CLAMP

**Seat:** LE · **One micro, one CSS property.** Founder-caught on his own handset during the D-3 walk, 2026-08-14.
**Tip at build, fetch-first:** dreamos-pwa `3f1cb7f`. **Zero copy. Zero DDL. W-1 shut. dream-os untouched.**

---

## 1 · THE DEFECT

`app/coplanner/muse/page.tsx` positioned the add control with

```
right: 'calc(50vw - 240px + 20px)'
```

— centre it against the 480px content column (`app/coplanner/layout.tsx`, `maxWidth: 480, margin: '0 auto'`) and inset it 20px from that column's right edge. **Correct only while the viewport is wider than the column.** Below 440px the expression goes negative, and `position: fixed` resolves it against the **viewport**, not the column, so the button walks off the screen:

| viewport | `50vw − 240 + 20` | |
|---|---|---|
| 1200px | +380px | fine |
| 480px | +20px | the boundary |
| **374px** | **−33px** | 33px of a 56px control, clipped |
| 360px | −40px | worse |

**Every handset the co-planner is used on is under 440px.** The add affordance has been partially off-screen on every real device since it shipped.

## 2 · WHY NO BENCH HAD IT, AND WHY THE WALK DID

**It looked correct in every desktop browser.** A viewport-arithmetic bug is invisible above its own boundary, and every automated reader of this tree is a string-matcher — no cell in either repo evaluates a CSS expression at a width. The founder's phone found it inside sixty seconds.

That is the maxim's specimen again: **his thumb found what the harnesses could not.** Its absence from the floor was not a gap in coverage but a gap in *kind* — the estate had no cell anywhere that resolved arithmetic the way a browser does. §3 is now that cell.

## 3 · THE CURE

```
right: 'max(20px, calc(50vw - 240px + 20px))'
```

**Bounded, not replaced.** Below 440px it pins to a plain 20px gutter; at and above 480px it is **byte-for-byte the old behaviour**, so no wide-viewport rendering moves. The column-centring is kept because it is right for the case it was written for — it was simply missing its lower bound, and replacing it would have moved every desktop rendering to cure a phone.

**`bottom` is untouched and was checked, not skipped** — the TabBar is `bottom: 0` with `paddingBottom: env(safe-area-inset-bottom)`, and 80px clears it. §1.4 asserts it so a later hand cannot change it believing this finding covered it.

## 4 · PROOF — `scripts/tdw14_f1410_fab_clamp.proof.mjs`, 18/18

**§3 evaluates the arithmetic rather than asserting a string.** `max()` is resolved the way a browser resolves it at 360 / 374 / 440 / 480 / 1200, and swept across every width from 320 to 1200 to prove it never returns below 20. **§3.was re-derives the pre-cure −33px**, so the number in this note is re-runnable evidence and not prose.

**§2 is a walked census, not an inherited list.** It finds every `calc(50vw - …)` / `calc(50% - …)` in `app/` and `components/` — expressions that *subtract*, the only shape that can go negative — and asserts each is clamped. **The count is one.** A second site appearing reds §2.2: it would carry the same hole, and nobody would find it on a desktop either.

**2 mutations, process-boundary, sha256-restored.** M1 removes the clamp — the defect restored, §1.1/§2.1 red. **M2 is the one worth having: it replaces the expression with a plain `20px`**, the "fix" that cures the phone by breaking every wide viewport, and §1.2 reds on it.

**Floor: `FLOOR = NAMED BASE, no delta`**, sibling-full on a clean tree. `tsc --noEmit` clean.

## 5 · SCOPE, DECLARED

**This is outside D-3's charter** — CE-33 authorized two poll surfaces and `muse/page.tsx` is neither; the defect pre-dates D-3b. Cut as its own micro on the founder's word rather than folded into D-3c, so the finding carries its own commit and its own cell.

**A bench cannot see a screen.** This proof claims the expression can no longer resolve negative — the mechanical fact the clipping was a consequence of. **The founder's device is the witness for the rendering**, and his reload is what closes F-14.10.

**Sequencing beyond this micro is the founder's.**
