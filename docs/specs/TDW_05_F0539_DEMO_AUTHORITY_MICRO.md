# TDW_05 · F-05.39 — THE INVITATION SURFACE'S DEMO AUTHORITY

**Repo:** `dreamos-pwa` · **base:** `a9dd0bf` (re-derived at origin, fetch-first)
**Sitting:** eleventh chair, 2026-07-24 · executor · Block 05 closing shelf
**Rulings executed:** R0–R7 + the Vercel addendum. Zero SQL, zero migrations.

---

## 1. THE DISEASE, AS RULED (R1)

The kickoff's derivation was one step off and the chair owned the correction
in-act. The record stands in the ruled words:

`lib/frost/journey.ts` — home of `inviteCircleMember` and the sanctuary's data
layer — gated its mocks on its own `shouldUseMocks()` (the `USE_MOCKS` env var
plus a localStorage-only `access_token` read) and consulted the demo session
**never**. It was not that a demo bride fell through to a harmless 401. On a
**clean** demo device she mints nothing: the demo seed writes no top-level
`access_token`, so no `Authorization` header goes out and dream-os's
`requireCoupleAuth` 401s the whole couple router.

The true disease is **cross-session contamination**. On any device that has
ever held a real couple login, the real token survives under the demo blob —
nothing clears either — so `couple.ts` and `muse.ts` served **mocks** off the
blob while `journey.ts` wrote **real rows to that real couple**. `_base`'s
cookie mirror can resurrect the token under a demo blob with no login at all.
Both authorities live, on one device, disagreeing.

Three findings of record accepted alongside it: there was **no canonical
export** (a declared-drift **triple** of byte-identical private copies);
`app/(frost)/layout.tsx:34` was **dead** (zero callers); and demo mode is
**permanent on a device** — one writer, zero removers.

---

## 2. WHAT SHIPPED

**One home (R2).** `isBrideDemoMode` is now exported from
`lib/frost-api/_base.ts` — the module `couple.ts` and `muse.ts` already import.

| file | change |
|---|---|
| `lib/frost-api/_base.ts` | the ONE `isBrideDemoMode`, exported, with the disease and F-05.65 stated in-file |
| `lib/frost-api/couple.ts` | re-points on the import line; six-line copy **deleted**; 11 call sites unchanged |
| `lib/frost-api/muse.ts` | re-points on the import line; six-line copy **deleted**; 4 call sites unchanged |
| `app/(frost)/layout.tsx` | the dead third copy **DELETED BY NAME** — not re-pointed |
| `lib/frost/journey.ts` | imports the authority + `getAccessToken`; both gates adopt |

Net: one home, three deletions, zero duplication, no new module.

**The two gates in `journey.ts`:**

- `shouldUseMocks()` (22 call sites, all in-file, unchanged) — demo mode wins
  **first**, in the sibling pattern; below it the pre-existing runtime override
  is untouched.
- `fetchMemberFeed`'s raw site — which never went through `shouldUseMocks` at
  all — now reads `isBrideDemoMode() || (USE_MOCKS && !hasToken)`.

**The token reads folded (R3).** Both sites (`shouldUseMocks`'s and
`getToken`'s) now source from `getAccessToken` — cookie-before-localStorage,
F-05.29's own cure, the D2 pattern. `journey.ts` holds **zero** raw
`localStorage.getItem('access_token')` reads. **Known inherited property,
named in-file exactly as `sanctuary/page.tsx` names it:** `getAccessToken`
falls back to the vendor cookie for couple surfaces (F-05.30). The coordinated
auth sitting owns that; it is not this micro's.

---

## 3. PROOF

`scripts/f0539_demo_authority.mjs`, in the `f04_96` precedent's form.

- **33/33 GREEN** on the cured tree.
- **11/33 FAIL at uncured `a9dd0bf`**, on exactly the eleven cure guards —
  run in a scratch clone with the bench copied in, production code unmutated.
  The non-vacuous floor is met **both ways**.
- **Teeth:** the pre-cure gate is reproduced beside the cured one and asserted
  to return **REAL** in state (ii) — the contamination case itself. If the
  disease ever returns, the teeth stop being teeth and the bench goes red.
- Thirteen source grep-guards pin every reproduction to its real site, so the
  bench cannot pass against a reverted tree.
- **`tsc --noEmit` whole-tree: EXIT 0, zero lines**, on a cleared cache
  (`rm -rf .next` first). Run, not claimed.

**Delta vs origin = the five ruled files + the new bench. Nothing else.**
`app/(frost)/frost/canvas/sanctuary/page.tsx` — **0-line**, as expected.

---

## 4. THE FOUNDER'S SMOKE CARD (R4 + the Vercel addendum)

He walks **once**, after proof. Written **env-agnostic** — both beats hold in
both worlds, because `NEXT_PUBLIC_USE_MOCKS` is Vercel-sensitive and unreadable
by anyone, including him.

**BEAT 1 — demo serves mocks.**
1. Open `/demo/bride` and tap **Start Exploring**.
2. Walk to the invitation surface and invite a circle member — any name, role
   `family`.
3. **Evidence:** the returned invite link is the mock (`CIRCLE-MOCK` in the
   `wa.me` text, `invite_token` = `MOCK`, `member_id` = `mock-id`). Screenshot it.
4. **Evidence, the one that matters:** run the read-only `circle_members`
   SELECT delivered with this packet (Supabase editor, its own paste-block,
   nothing to fill in). **Zero rows created by the walk.**

**BEAT 2 — a real session serves real.**
5. **Clear site storage by hand** (browser settings → site data for
   `thedreamwedding.in` → clear). *Why by hand: demo mode has no exit control
   today. Nothing in the code removes the demo blob — that is F-05.65, filed,
   and whether an exit control ships is your product call at your leisure, not
   this micro's.*
6. Log in as the real test couple (`+919625759924`).
7. Walk the same invitation surface. **Evidence:** real circle data renders —
   real member names, no `MOCK` anywhere; screenshot. Response body shows a real
   `invite_token` if you invite.

If beat 1 shows a real token or beat 2 shows `MOCK`, stop and report.

---

## 5. DECLARED GAPS

1. **`NEXT_PUBLIC_USE_MOCKS`'s value is UNWITNESSED-NAMED.** It exists in
   Vercel (Production + Preview, updated May 21) but is sensitive — write-only
   by Vercel's design, unreadable by the founder. The one behaviour it still
   controls is **logged-out non-demo visitors on journey surfaces**, which is
   outside every card step. The bench asserts that behaviour in **both** worlds
   and asserts this cure left it **unchanged**.
2. **Demo mode remains permanent on a device** until site storage is cleared —
   F-05.65, filed, product decision, deliberately not cured here.
3. **A demo member-detail screen now returns `null`** (the pre-existing mock)
   rather than reaching the API. On a clean demo device the observable outcome
   is identical to before (the real call 401'd and was caught into `null`); on a
   contaminated device this is the cure working. Named, not a copy change.
4. **Executor disclosure, one line, vetoable:** `fetchMemberFeed`'s inline
   `hasToken` read was folded onto `getAccessToken` in the same edit R2
   required there. It is the same class R3 ruled and the line was being touched
   regardless — stated rather than absorbed.

---

## 6. COPY INVENTORY: **ZERO.**

No vendor- or bride-facing string added, changed, or removed. Mock payloads
already existed and are demo-only. The demo-tell question is **not chartered**
(R7).

---

## 7. FILED THIS SITTING, ZERO BYTES HERE

- **F-05.63** — `sanctuary/page.tsx:186`, inline localStorage-only
  `access_token` inside `handleAddExpense`: the cookie-blind class **inside**
  the guarded file, untouched by F-05.29's sealed cure at `:3591`. Homed to the
  coordinated auth sitting (F-05.13 + 28 + 30 + 63).
- **F-05.64** — `discover.ts:28/33/38` gate on bare `USE_MOCKS` while the demo
  page writes `tdw_demo_discover` and `discover/page.tsx:36` reads it — a fifth
  authority. Shelf, unsequenced; R2's `_base` export gives it a one-line
  adoption path whenever it seats.
- **F-05.65** — demo mode is permanent: one writer, zero removers. Product
  decision, founder's, at his leisure.

---

## 8. NEXT

Founder applies, runs the verify, walks the card once. Then the shelf as it
stands: **F-05.55 · F-05.60 · F-05.56's deletion ruling · the auth sitting
(now +F-05.63) · F-05.64** — and beyond them the founder's spine, **Block 06 to
M-6 exit**, two-green acceptance clock at ZERO. Sequencing is his.
