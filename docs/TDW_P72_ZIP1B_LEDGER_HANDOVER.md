# P7.2 · ZIP 1b — THE BENCH LEDGER · HANDOVER

**Base** dreamos-pwa `worklist` **039d005** (ZIP 1 + 1a + 1a-2, sealed). 13 files changed, 2 deleted.
`tsc --noEmit` exit 0 · b40 FLOOR GREEN (89 cells) · floor measured on a clean tree (§3).

## §0 · APPLY — three blocks, each its own STOP

```
unzip -o TDW_P72_ZIP1B_LEDGER.zip && cp -r deploy/* . && rm -rf deploy TDW_P72_ZIP1B_LEDGER.zip
```

```
git rm -q scripts/tdw09_home.proof.mjs scripts/tdw09_p2r1.proof.mjs
```

```
git add -A && git commit -m "P7.2 ZIP 1b: the bench ledger — eight benches disposed, two retired at file grain with their live cells re-homed, every retired assertion quoted in docs/reports [F-39.80 amended · F-39.81 · F-39.82 · F-39.83]" && git push origin worklist
```

## §1 · THE EIGHT, DISPOSED

| bench | disposition | verdict |
|---|---|---|
| `tdw09_hotfix` | 2.6 re-keyed (adopters 3→2); 2.12–2.16 retired, zero-hit derivation stated | 33/33 |
| `obp_vendor_form` | §6 re-keyed onto `(shell)/WorklistBoot.tsx`; 6.2 retired; **6.5's guarantee became structural** — the form sits in `(legacy)`, outside the shell group, so the boot cannot mount on it | GREEN |
| `tdw06_m3_report_chip` | re-keyed onto `components/worklist/AskSheet.tsx` — same two wires, byte-identical | ALL GREEN |
| `tdw09_walkrider` | LEADS re-keyed onto `(shell)/leads/body.tsx`; 4.5 retired (its subject *was* the stub the founder ruled 404) | 16/16 |
| `tdw09_home` | **FILE RETIRED** — 57 of 65 cells read the deleted chat home. 8 live cells re-homed verbatim → `tdw09_home_live.proof.mjs` | 8/8 |
| `tdw09_money` | 3 cells re-keyed onto `Masthead.tsx`; the compact-formatter cell **widened from "at the Hub" to estate-wide** | 18/18 |
| `tdw09_p2r1` | **FILE RETIRED** — 11 of 13 read deleted subjects. 2 `globals.css` cells → `tdw09_p2r1_live.proof.mjs` | 2/2 |
| `tdw10_tier` | `SETT` re-keyed to `(shell)/settings/page.tsx`; §9 stays RED with **F-39.82** named in the file, 9.3's expectation held at 1 | 103/107 |

**The tail:** `tdw09_p2b` 5.2 — `profileMeter.ts`'s provenance comment re-pointed (29/29) · census capture regenerated (`tdw_f3942_census_guard` 10/10) · `tdw09_surface` §3–§7 + §8 + four mutations retired, **REFUSED → RED by measurement** (10/3) · `tdw09_type` M.1/M.3/M.4 retired, **ERROR → RED** (10/3).

**Every retired assertion is quoted in `docs/reports/P72_ZIP1b_RETIRED_CELLS.md`** — 57 + 11 + 3 + 13 + 4 blocks, verbatim, each with its live-twin derivation and `git show` evidence line. A retirement whose assertion lives only in a chat transcript is one nobody can audit.

## §2 · FINDINGS AND AMENDMENTS

- **F-39.80 AMENDED** (c-P72.9): one stale path, not four. The three `app/admin/{money,revenue,subscriptions}` lines are **absence assertions** (`ok(\`${p} is GONE\`, !exists(p))`) — the retirement's own guard — and stay. Only `app/vendor/settings/page.tsx` was a broken read. *Method line: a path literal in a bench is not a read until the verb around it says so.*
- **F-39.81** — `fitMoneySize` has zero component readers; it survives in `lib/vendor/format.ts` as the sanctioned answer to "it does not fit". Retire or re-home in Block 09.
- **F-39.82** — **a vendor at `state:'capped', turns_cap:0` has no Upgrade anchor in the shell.** `TierMeter` hides on the falsy cap; the page-level seat gated on the exact complement died with the old chat page. Cure ruled for ZIP 2 (Arm C): re-home onto the ask sheet's cap refusal with the already-vetoed byte "Upgrade in Billing." → `roomHref('billing')`.
- **F-39.83** — a fresh token-discipline bench against `StudioSheets.tsx` in Block 09, written **from the mock's tokens**, not ported from the old sheet's bytes.
- **c-P72.10** — `tdw09_type`'s ERROR was a defect an earlier sweep of this seat introduced: commenting a path out of `okMutate`'s argument list shifted the arguments so a code fragment became the file path and `readFileSync` threw. Fixed by retiring the three cells at §0.2 (the replacement surface carries zero `fontSize` literals).
- **c-P72.11 — amendment to ZIP 1's handover §2, by number, not by edit:** the vacuity probe's REFUSED in ZIP 1's floor was the **dirty-tree refusal**. It writes to production source and restores it, so it refuses when it cannot prove a clean restore. It is a named refusal by c-39.57 and **is not a base line**. On the clean tree measured below, it runs.

## §3 · THE BASE — measured on a committed tree

Per c-P72.11 the floor was measured on a local throwaway commit (`zip1b-measure`, discarded; a seat never pushes). **31 RED + 1 ERROR + 3 REFUSED → 24 RED + 1 REFUSED.**

Left the base: `obp_vendor_form`, `tdw06_m3_report_chip`, `tdw09_home` (file retired), `tdw09_hotfix`, `tdw09_money`, `tdw09_p2b`, `tdw09_p2r1` (file retired), `tdw09_walkrider`, `tdw_f3942_census_guard`, and the vacuity probe's refusal (c-P72.11).
Moved: `tdw09_surface` REFUSED → RED, `tdw09_type` ERROR → RED — both now failing on their own merits, not on a stale read.
Joined, silent because the base holds failures only: `tdw09_home_live` (8/8), `tdw09_p2r1_live` (2/2) — both in the `scripts/*.proof.mjs` glob, both verified exit 0.
`tdw10_tier` stays RED on F-39.82's four cells alone; `b50_fetch_loop_bench` stays REFUSED (needs a live host).

**Floor after apply:** run `bash scripts/run-floor.sh` on the committed tree — not before the commit, or the vacuity probe refuses by design.

## §4 · METHOD (for the next seat)

- **s-P72.1** — an instrument reporting "0 cells" is a silent zero (F-39.25's shape). Caught by running the benches bare.
- **s-P72.2** — anchor replacements on the **code** line, never the message: em-dashes and `§` in assertion strings break naive matching. `cat -A` first.
- **s-P72.3** — a clever splitter fails silently on regex parens. The third attempt is never a splitter: verified line ranges, batched edits, run after each.
- **s-P72.4** — **a mutation that doesn't change the asserted bytes is not a mutation.** Renaming `useTodayData` → `useTodayDataX` left the substring intact and the bench green; the tell was 8/8 under a "broken" subject.
- Read-vs-assert-absent (c-P72.9), and: a bench that mutates-and-restores production source is measured on a **committed** tree (c-P72.11).

## §5 · NOT IN THIS ZIP
ZIP 2 (F-P72.C's Storefront CTA frame → founder pick → Arm C incl. F-39.82's cure, Arm D, FORK 3) · Arm E (dream-os companion) · P7.3 · P7.4.
