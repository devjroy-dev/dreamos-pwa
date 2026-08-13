# repo: dreamos-pwa @ e028d20 · TDW_14 · D-3f — THE POLL STOPS WAITING ON READS IT DOES NOT USE

**Seat:** LE · **Founder-observed on his own screen, 2026-08-14:** 「 theres a lag between opening the page and the poll becoming visible 」
**pwa only. One file. Zero DDL. Zero copy — no byte moves. W-1 shut.**

---

## 1 · THE DEFECT, DERIVED — TWO WAITS, NEITHER OWNED

A poll could not paint until **three** things finished, and **two of them had nothing to do with polls**:

| | what it waited on | why that was wrong |
|---|---|---|
| 1 | **`fetchCircle()`** — the section rendered behind `{!loading && (`, and `loading` is cleared only by that fetch's `.then` | `fetchCircle` returns members, activity and pending invites. **The poll section reads none of them.** |
| 2 | **`await loadMessages()`** — the tick read `await loadMessages(); await loadPolls();` | The poll read **did not begin** until the messages read had fully returned and parsed: a whole round trip, serialised, for data polls do not use. |
| 3 | its own `fetchCirclePolls()` | the only one it owns |

On a slow connection that is the lag exactly.

## 2 · R-D3.5 IS NOT WHAT COST THIS

The ruling was **ONE TIMER** — one `setInterval`, one home for *"how often does this screen refresh."* It says nothing about whether the two reads **inside** that tick run in sequence or together.

`Promise.all([loadMessages(), loadPolls()])` keeps the interval, the tick and the home **exactly as ruled**, and drops a round trip. **§5.3 still counts the intervals and is the real guard against a second one.**

**One hazard named rather than discovered:** neither read can reject — both swallow their own failures and keep last-known state — so `Promise.all`'s fail-fast cannot cost the other its result *here*. **If either is ever rewritten to throw, this must become `allSettled`**, or a thrown messages read will silently take the polls with it. That sentence is in the code, at the line it governs.

## 3 · THE SECTION OWNS ITS OWN "HAVE I LOADED"

`pollsLoaded` replaces the borrowed `loading`. It is set **in a `finally`** — marked loaded on failure too, deliberately: **a dropped packet must not hide the affordance forever.** She keeps her last known polls and can still ask a new one.

## 4 · THE ARC WAS DERIVED AND DELIBERATELY NOT TOUCHED

The same shape exists on the home masthead: `sanctuary/page.tsx` computes `days`, `progress` and `name` **synchronously from the cached blob**, but those lines sit at the **bottom of the effect at `:367`**, below `/api/v2/couple/me` and a second awaited `/api/v2/couple/me/{id}`. The founder's own console confirmed the blob was complete (`wedding_date`, `bride_name` both present), so **the arc could have drawn on the first paint and was queued behind a fetch whose only job is to heal a blob that was already healthy.**

**The cure was offered with its cost and the founder declined it:** hoisting the seed means `days` and `name` paint from cache and **may then change** when the heal returns. Today invisible; with a stale blob it would be a value correcting itself on screen. **F-09.166's re-derivation at `:523` stays untouched either way.**

**Recorded, not built.** The derivation is here so the next sitting starts from it rather than re-doing it.

## 5 · PROOF — 131/131

**§5.2 was re-aimed, and its old form was the problem.** It asserted the tick's exact **sequential text**, so a change that honours R-D3.5 completely reddened it. **A cell that pins an implementation cannot tell a cure from a regression.** It now asserts what the ruling says: the poll read is *called from* the tick, and the tick is what the interval drives.

**Three new mutations:** §8.M5 mints a second interval · **§8.M5b re-serialises the reads** (the lag, restored) · **§8.M5c re-gates the section on `fetchCircle`**.

**`FLOOR = NAMED BASE, no delta`**, sibling-full on a clean tree. `tsc` clean. **The control census held at 165** — this micro moves no controls, only when they render.

## 6 · THE WITNESS THIS CANNOT GIVE

**A bench cannot see a delay.** It proves the two reads are no longer serialised and the section no longer waits on an unrelated fetch — the mechanical facts the lag was a consequence of. **The founder's reload is what closes D-3f.**

**Sequencing beyond this micro is the founder's.**
