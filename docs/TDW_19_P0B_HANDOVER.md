# TDW_19 P0-B · HANDOVER (dreamos-pwa) — STEP 1 OF 5: THE CONTRACTS

**Seat:** LE, P0-B · **Chair:** CE-38 · **Sitting date:** 2026-08-28
**Governing kickoff:** TDW_19 P0-B, packet `906ef15b0b19fa9d31079cd74165f61d59c3a32902113ad445265a5028589cf2`
**Built on:** `dreamos-pwa` `b251600` (origin/worklist) · sibling `dream-os` `aeca43f`
**State:** kickoff §4 item 1 COMPLETE and gated. Items 2–5 not started.

⚠ **The kickoff expected `7af1e82`.** The tip had moved to `b251600` — M-FINISH S2
is building on this branch concurrently, and a moved tip is a report, not a STOP.
`docs/TDW_09_M_FINISH_S2_HANDOVER.md` **does not exist at `b251600`**; S2 has not
banked one yet, so S1's handover and `D-38.1` were the read.

This file touches neither `FINDINGS_LOG.md` nor the masterplan.

---

## §1 · WHAT LANDED, AND THE CONTENTION LINE IT STAYS BEHIND

Three files, all new. **No existing file was edited.**

| Path | Lines | What it is |
|---|---|---|
| `lib/solutions/types.ts` | 264 | The authored home of the wire contract: 12 shapes, 60 fields, the subdomain transform, the digest |
| `lib/solutions/copy.ts` | 153 | Every Business Solutions string, one home |
| `tools/bs_audit.mjs` | 382 | The contract gate. Runs bare; exit code is the verdict |

**Kickoff §2 footprint, honoured exactly.** Nothing in `lib/worklist/*`,
`components/worklist/*`, `tools/wl_audit.mjs`, `tools/wl_render.cjs`,
`lib/worklist/rooms.ts` or any `app/w/<room>` was touched. **No relay was
needed** — see §4.

`bs_audit.mjs` lives in `tools/` and not `scripts/` for the reason
`wl_audit.mjs` does: `scripts/run-floor.sh:32` globs
`scripts/*.proof.mjs scripts/*.mjs scripts/*.js` and runs every hit bare.
Enrolling an instrument over one block's contract would move the pwa floor's
named base for a reason that has nothing to do with the floor.

---

## §2 · THE INSTRUMENT — 14 CELLS, AND WHY IT RUNS BARE

```
$ node tools/bs_audit.mjs
COVERAGE  12 shapes, 60 fields parsed from lib/solutions/types.ts; 12/12 declarations matched the parse contract

PASS  C1  seven ruled payload types declared              — 7/7
PASS  C2  CONTRACT_DIGEST literal matches computed        — e31a1a2414ee…
PASS  C3  every money field name ends in Paise            — DomainStatus.renewalPricePaise, DomainSearchResult.pricePaise
PASS  C4  money register clean                            — no glyph, no shorthand, no money string built in copy
PASS  C5  no persona names in copy                        — 6 names checked
PASS  C6  row labels ≤2 words                             — Google page · Website · SEO · Marketing · Proof · Benchmarks
PASS  C7  buttons match spec §9                           — Connect · Disconnect · Get · Renew · Make · Share
PASS  C8  chips cover spec §9                             — all six present · PROPOSED BEYOND THE APPROVED SET, awaiting veto: Coming
PASS  C9  subdomain fixture is the ruled table            — 6 cases, lowercase + trim + null-in-null-out
PASS  C10 copy.ts does not import lib/worklist/copy       — no import, no merge
PASS  C11 bs_audit imports nothing from wl_audit          — 4 imports + 0 requires scanned, zero shared code
PASS  C12 SeoReport carries no score field                — 6 fields, none scoring
PASS  C13 six slugs in delivery order, both homes         — google → website → seo → marketing → proof → benchmarks
PASS  C14 every row declares an empty state               — 6/6

14 PASS · 0 FAIL
exit 0
```

**Running bare is not the thing `wl_audit.mjs` refuses.** That file exits 2 with
no URL because its subject is a DEPLOY, and with no URL it has no subject. This
instrument's subject is SOURCE, on disk beside it — bare is running with the
whole subject present, not with nothing to look at. The two rules do not conflict.

### GATE-UNSOUND rather than a partial verdict set

The parser reads TypeScript as text, because TS types are erased at runtime and
there is nothing to import. If the count of shapes it PARSED does not equal the
count of declarations it can SEE, it prints `GATE-UNSOUND` and **exits 2 having
printed no verdicts at all** — not one PASS, not one FAIL. Proven at M4 below.

The comment strip is itself checked. `types.ts` documents its own parse contract
by quoting the declaration form inside a comment, so a naive regex over the raw
file counts that quotation as a declaration. Comments are stripped first, and if
any marker survives into the stripped text the run is unsound rather than quietly
working on a corrupted subject.

---

## §3 · TWO CELLS FAILED ON THE FIRST RUN AND BOTH WERE THE INSTRUMENT, NOT THE SUBJECT

Disclosed rather than quietly fixed, because both are D-38.1's territory.

**C4** convicted `copy.ts` of carrying a rupee glyph. It did — inside its own
comment stating *"No `₹` glyph"*. The cell read the raw file; the law binds
rendered bytes. **The cure was not to loosen the cell to read the stripped half.**
The comment now NAMES the glyph without showing it, so the raw file is clean and
the strictest possible check stays available. *A rule stated by breaking itself
makes its own gate weaker.*

**C11** convicted itself. The pattern was `/^\s*import[\s\S]*?wl_audit/m` — and
`[\s\S]*?` spans the whole file, so any `import` line anywhere followed by the
string `wl_audit` anywhere matched. This file's own header discusses `wl_audit`
at length, so the cell went RED on a file with zero shared code.

That second one is **D-38.1's corollary running in reverse, and the reason it is
kept in the file as a note**: a pattern that reaches past its subject reports on
the wrong thing in BOTH directions. This one cried wolf — and the identical shape
would have PASSED a real import sitting above a file that happened not to mention
the name. It now scans import and require statements as statements.

---

## §4 · THE CONTENTION QUESTION RESOLVED WITHOUT A RELAY (CE-38 relay #1 item 6)

`rooms.ts:62` already labels the room `Business Solutions` and `copy.ts:112`
already reads `supportTitle: 'Business Solutions'` — **no S2 byte was needed
there.** But `supportHeader` / `supportBody` / `supportAction` are S2-owned and
are rendered by the page R-19.2 replaces, so displacing them would orphan three
strings in a file this seat may not edit.

Ruled and built: **the WhatsApp line survives as the footer beneath the six
rows**, consuming `COPY.supportBody` and `COPY.supportAction` unchanged from
their own home. No orphan, no S2 byte, no relay — and a vendor opening the room
keeps the one thing on it that reaches a human, instead of trading it for six
rows that all read `Not connected`.

`C10` asserts this rather than promising it: `lib/solutions/copy.ts` imports
nothing from `lib/worklist/copy.ts`.

---

## §5 · COPY — WHAT IS PROPOSED AND WHAT IS APPROVED

**Not one byte in `copy.ts` has been through the founder's pass.** Spec §9 gives
him one, and `docs/COPY_REGISTER_TDW19.md` (step 5) carries these two-column for
it. Everything ships as PROPOSED pending veto.

### ⚠ One chip is beyond the approved set, and it is flagged rather than slipped in

Spec §9 approves six: `Not connected` · `Connected` · `Needs attention` ·
`Searching` · `Live` · `Expired`. R-19.5 then requires a chip for a row whose env
gate is CLOSED, and **none of the six says that honestly** — `Not connected`
would tell a vendor she could connect it, which is the one thing she cannot do.

`Coming` is proposed as a seventh. `C8` passes with it present (a proposal is a
legitimate thing to ship pending veto) but **prints it on every run**, so it
cannot become approved by nobody noticing. The founder's to strike.

### The sentences spec §9 requires

| Key | Proposed |
|---|---|
| `domainOwnership` | The domain is registered in your name, not ours. If you ever leave, it goes with you. |
| `costPassThrough` | Billed at cost on your next invoice. We add nothing to it. |
| `benchmarksBelowCohort` | Not enough vendors in {city} yet. *(spec §7's own byte)* |
| `benchmarksNoCity` | Not enough vendors in your category yet. |
| `subdomainPending` | Your web address is ready once onboarding is finished. |
| `publicPageLine` | Takes enquiries through The Dream Wedding. |
| `reviewUnsetLine` | This review link is not set up yet. |

`benchmarksNoCity` is **not in the spec** and exists because
`Not enough vendors in null yet` is the byte that ships if nobody writes the
second sentence.

**No price is ever typed into copy.** `costPassThrough` names no figure; the
amount is rendered beside it by `formatRs` (`lib/vendor/format.ts:21`, the
estate's one money home), so the sentence cannot go stale when the registrar's
rate moves. `C4` asserts that no money string is built in `copy.ts`.

---

## §6 · GATE

```
npx tsc --noEmit                       exit 0
node tools/bs_audit.mjs                14 PASS · 0 FAIL, exit 0
pwa floor --check (pristine tree)      FLOOR = NAMED BASE, no delta, exit 0
```

⚠ **The pwa floor number required a method, and the method is stated in F-19.16
below rather than buried.** On the delivery tree the floor reports a one-bench
delta that is not this delivery's defect.

### Non-vacuity, by mutating production source

Every mutation restored; `diff -q` against the backup confirmed identical before
the next; the run after all of them is 14 PASS · 0 FAIL.

| # | Mutation to production source | Cells that reddened |
|---|---|---|
| M1 | drop `reviewRequestsSent` from `GoogleStatus` | C2 — `literal e31a1a2414ee… but computed 538b3c718a25…` |
| M2 | `pricePaise` → `priceInr` | C2 + **C3 — `offenders: DomainSearchResult.priceInr`** |
| M3 | add `score: number` to `SeoReport` | C2 + **C12 — `found: score`** |
| M4 | move an opening brace off its declaration line | **GATE-UNSOUND, zero verdicts printed**, exit 2 |
| M5 | `'Make'` → `'Make it now'` | C7 — unapproved + missing + over 2 words |
| M6 | fixture stops lowercasing `DEV550` | C9 — declared table differs from the ruling |
| M7 | `'Enquire on WhatsApp'` → `'Ask Victor'` | C5 — `found: Victor` |

### ⚠ M3's first run was contaminated, and is reported rather than left in the record

The shell block carrying M2 died on a `Bad substitution` fault **before its
restore line ran**, so M3's first execution had M2's mutation still on disk and
reported three fails instead of two. It was re-run as a single mutation after a
`diff -q` proved the tree clean, and the table above is the clean run. A
non-vacuity table whose rows are not one-mutation-per-row is not a non-vacuity
table, and correcting it silently would have made it look better than it was.

---

## §7 · F-19.16 · THE PWA FLOOR CANNOT BE MEASURED ON ANY DELIVERY TREE

**OPEN. Not this delivery's defect and not this seat's to cure. Stated for the chair.**

First run:

```
RED: tdw_f0774_vacuity_probe
22a23
FLOOR DELTA — the diff above is this delivery's to explain
```

**Derived in three steps, not assumed.** A warm re-run reproduced it, so it is
not Lesson 1's cold-resolution artifact. Standalone with this delivery present,
the bench prints its own refusal — *"the tree is dirty… on a dirty tree it cannot
prove the restore was clean"*. Moving this seat's entire footprint aside and
re-running the same bench: **exit 0, GREEN**; re-running the whole floor:
**`FLOOR = NAMED BASE, no delta`**.

So the red is the bench refusing the **delivery tree itself**, and this delivery
contributes zero floor movement.

**This is F-14.16's class, in the repo whose runner was said not to have it.**
`dream-os/scripts/run-floor.sh`'s header states *"`dreamos-pwa`'s runner never had
this gap — it has ORDERING, not refusal."* True of the pwa RUNNER, false of the
pwa FLOOR: a pwa BENCH carries the refusal instead. The effect at delivery time is
identical — **a delivery tree is dirty by definition, R-33.7 forbids the executor
the commit that would clean it, so the pwa floor cannot gate the one tree it
exists to gate.** This binds every pwa seat, M-FINISH S2 included.

`grep -rln "tree is dirty\|Commit or stash" scripts/` returns exactly one file.
One bench, not a class of many — which is what makes it cheap.

**Three cures, chair's to rule, none taken here:**
1. Port `--delivery <manifest>` to the pwa runner from `dream-os`, where it works. Cures the class.
2. Give the one bench a declared-dirt escape. Cures the instance.
3. Leave it, and require every pwa delivery to state its measurement method.

**The method used here**, so the number is reproducible: footprint moved aside,
floor measured on the pristine tree, footprint restored — with `git status`
printed either side and `bs_audit.mjs` re-run green afterwards to prove it.

---

## §8 · WHAT STEP 3 INHERITS (the surfaces)

- Six surfaces on Billing's rungs — header word t2, eyebrow t5 — plus `/w/support`
  as the room index. Cormorant survives at t0/t1 only; the wordmark is t2 DM Sans.
- `lib/solutions/client.ts` is **not built** — it is step 3's, and the footprint
  in kickoff §2 reserves it.
- Every surface renders against the contract's empty state. **R-19.2: the empty
  state is the product's real first state, not a placeholder mock** — the empty
  strings in `copy.ts` say what the row will do and what the vendor's one next
  action is, and none of them apologises.
- The footer consumes `COPY.supportBody` / `COPY.supportAction` from
  `lib/worklist/copy.ts` — **read, never edited**.
- `bs_audit.mjs` grows surface cells in step 3 and prints a coverage line either
  way.

## §9 · CARRIED FOR STEP 4 (the redirects)

- `/r/<code>` → 302 to the vendor's review URL; `reviewUnsetLine` when unset.
- `/v/<code>` → **200 holding page on the rungs**, ruled at relay #1: business
  name t1, city and category t4, one sentence, `Enquire on WhatsApp` when the
  vendor's number is public. **No 302 to nowhere.** It is the storefront's
  address from today; P2 replaces the body, not the URL.
- **Demo vendors also get a `/v/` address, flagged demo, with no review link**
  (founder ruling 2026-08-28, carried in relay #1).
- **F-19.14** — no per-vendor public URL exists anywhere in the estate.
  `app/(landing)/discover/page.tsx` renders `<DiscoverFeed>` with no route param
  and no `searchParams`; `middleware.ts` rewrites on `demodreamer.`,
  `demodiscover.`, `demobride.`, `demo.` hosts only, with no wildcard handle map.
  `tdw_referral_invite` is APPROVED at Meta pointing at `/v/` and has been
  pointing at a 404 since 2026-08-28. Carried to the founder as a **Block 07
  prerequisite** as well as a Block 19 one.
