# MICRO-WA-DIAL — one-tap WhatsApp from the admin People rows

**Board:** CE-225 · **Repo:** `dreamos-pwa` · **Base:** `33652aa` · **Seat:** LE
**Rulings executed:** FORK A → A3 · FORK B → expanded drawer · FORK C → anchor primitive · floor base → amend

---

## WHAT LANDS

Six files. One new affordance, one new primitive, one new predicate, one bench, one instrument repair.

| file | state | what |
|---|---|---|
| `lib/admin/waDial.ts` | NEW | the one predicate — which rows may be dialled, and the href |
| `app/admin/_components/AdminUI.tsx` | MOD | `ActionLink`, ActionChip's twin for a destination outside the app |
| `app/admin/makers/page.tsx` | MOD | the affordance, seated between `Send welcome` and `Delete` |
| `app/admin/dreamers/page.tsx` | MOD | the same three bytes, seated above `Delete` |
| `scripts/waDial.proof.mjs` | NEW | 48 cells, 9 production mutations |
| `scripts/run-floor.sh` | MOD | the NAMED BASE amended to seven, labelled |

## THE ONE THING TO KNOW

`waDialHref` returns `null` far more readily than you might expect, and every `null` renders **nothing** — no greyed chip, no dead button. It refuses any number that does not wear a `+` and carry more than ten digits, because the alternative is a link that *opens*, *looks correct*, and reaches a stranger. Your 2026-08-24 census is the authority: the predicate is that census's own `CASE`, expressed in TypeScript. 27 makers and 51 dreamers dial. One dreamer — the `RET…` sentinel — shows no button, which is the true rendering of a retired account.

If you ever want to widen it, the census SELECT is the thing to re-run first. That is written into the file's header so the next seat cannot widen it on a hunch.

## PROOF

- **`waDial` bench: GREEN 48/48.**
- **Nine mutations on production source, all RED.** The ledger sits in the bench header.
- **Two vacuity holes found and closed, recorded not hidden.** The first cut was 47/47 green while two live defects sat in the tree: every ten-digit fixture carried no `+`, so the leading-`+` guard answered first and the length boundary behind it was never reached — a loosened boundary (`M2`) and the exact repair A3 refused (`M3`) both passed. Cell `2.5b` reaches it. A third mutation, `M4`, went green because the mutation itself was wrong: it struck `rel="noopener noreferrer"` inside `ActionLink`'s own comment rather than the attribute. Re-anchored, and cell `3.2` scoped to `ActionLink`'s block.
- **Type proxy:** `npx tsc --noEmit` → exit 0. `next build` is unreachable in my container (`fonts.googleapis.com` off-allowlist, failure named verbatim in the read-first); **CE-225 holds that instrument.**
- **Floor before:** 7 reds at untouched `33652aa`. **Floor after:** `FLOOR = NAMED BASE, no delta`, 7 reds, exit 0.

## LE DISCLOSURES

1. **The predicate's home was mine to choose and I chose a new file.** `lib/admin/waDial.ts`, not `AdminUI.tsx` (a design system should not carry a note about `users.phone` legacy shapes) and not `lib/waNumbers.ts` (that file holds *TDW's own* inbound numbers and is a declared drift twin of `dream-os`; this holds none). Not a fork you ruled — say the word if you want it moved.
2. **The bench is a `.proof.mjs` that compiles its own subject**, not a `.proof.ts` behind a wrapper like the estate's other seven executed benches. Forced: every source cell reads `AdminUI.tsx`, which contains `accept = 'image/*'` at `:492` — the exact literal of F-07.74 — so the bench must use the ESM stripper at `scripts/lib/stripComments.mjs`, which a commonjs-compiled `.proof.ts` cannot import. It invokes the repo's own `tsc`, the same binary the seven wrappers use, so no new floor precondition. Reasoning is in the bench header.
3. **No confirm on the new chip**, unlike the two beside it. `Send welcome` messages a real vendor and `Delete` destroys an account; this opens a compose window you still have to type into. A confirm here would be ceremony with no hazard behind it.
4. **Reported, not chased (§6):** four demo/mock surfaces (`app/demo/vendor/…`, `app/admin/demo/page.tsx`) build unguarded `wa.me` links by stripping non-digits off fixture phones. They are mock data and cannot reach a real person. Named so a future sweep does not think it found something new.
5. **`tdw13_d4_extraction`'s ten-eaten cause is still unexamined.** Entered as base with its ground stated, per your ruling. It is owed a sitting.

## THE VERIFY LINE CANNOT RUN THE FULL FLOOR — READ THIS ONE

`tdw_f0774_vacuity_probe` writes to production source and restores it, so it **exits 1 on any dirty tree** and says so plainly. Between applying the ZIP and running the git line your tree is dirty by definition, so a full `run-floor.sh --check` in the verify slot would hand you a STOP every single time, for a reason that is not a defect.

So the verify block below runs the targeted bench and the type proxy. **The full floor runs in block 3, after the commit, on a clean tree** — where it is meaningful. I derived it that way here (local-only commit, floor, unwind; never pushed) and it came back `FLOOR = NAMED BASE, no delta`.

---

## FOUNDER WALK

1. Open `/admin/makers` on your phone. Tap any maker row to expand it.
2. Tap **WHATSAPP**. WhatsApp opens on that vendor's chat, ready to type. Come back.
3. Open `/admin/dreamers`. Tap a dreamer row, tap **WHATSAPP**. Same.
4. Find the sentinel row — search `RET` in the Dreamers search field. Expand it. **There is no WhatsApp chip**, only Tier and Delete. That absence is the cell you are witnessing.
5. Two screenshots: one expanded row with the chip, one expanded sentinel row without it.

What only your device can witness: that WhatsApp actually *opens on the right chat*. The bench proves the href is exactly `https://wa.me/<digits>`; it cannot prove your phone honours it.
