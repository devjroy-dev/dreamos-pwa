# TDW_05 — F-05.29 MICRO: THE SANCTUARY GUARD READS THE COOKIE MIRROR

**Base:** dreamos-pwa `23ba0de` (= `origin/main`, re-derived fetch-first at delivery) · dream-os **0-line, untouched**.
**Charter:** CE-65 follow-on micro, founder-sequenced into the same LE session after the couple-soul arc banked. Gate satisfied — the soul ZIP was delivered, founder-pushed at dream-os `0bfc8a5`, walked across five cards, and packeted before this opened.
**This is arc two of one session. It did not interleave with arc one.**

---

## 1. THE CHARTER'S ANCHOR WAS WRONG — REPORTED, NOT ADAPTED AROUND

The charter (inheriting CE-64's filing) sites F-05.29 at `sanctuary/page.tsx:181–182`. **At my tip those lines are inside `handleAddExpense`** — a localStorage-only token read in an expense-add handler, with no bounce, no redirect, and no guard behaviour of any kind.

Checked at **both** tips before saying so:

| tip | `:181–182` |
|---|---|
| `1084089` (the finding's own tip) | `handleAddExpense` |
| `23ba0de` (mine) | `handleAddExpense` |

**The file did not move. The citation was wrong when it was filed.** Had it been followed literally, this micro would have "cured" an expense handler and left the front door exactly as broken, with a green tsc and a founder probe that still bounced.

**THE REAL GUARD IS `:3568–3572`** — the mount-effect auth guard, the only `window.location.replace('/')` on an auth condition in a 4142-line file:

```js
useEffect(()=>{
  // ── Auth guard — if no session, go to landing ──────────────────────────
  const token = localStorage.getItem('access_token');
  const session = localStorage.getItem('couple_session')||localStorage.getItem('couple_web_session');
  if(!token && !session){ window.location.replace('/'); return; }
```

Derived by command: `grep -n "window.location.replace"` returns four sites — `:810` (a sign-out), `:3586` (the onboarding redirect), `:3744` (a pathname read), and `:3572`. Only `:3572` fires on an auth condition. **Chair correction owed: `:181–182` → `:3570`.**

## 2. THE CURE, AS RULED

`:3570`'s token read now goes through `getAccessToken()` from `lib/frost-api/_base` — the D2 source this block already proved live. Two lines: one import, one read. `session` untouched.

**F-05.30's fence honoured:** the function is **imported, never modified**. Its cross-lane cookie fallback is filed to the coordinated auth sitting and is not this micro's to improve.

## 3. THE DERIVATION THE CHARTER DEMANDED

*Does the session-blob read need its own fallback, or does a valid token alone satisfy the guard?*

**A VALID TOKEN ALONE SATISFIES IT. The session leg stays as written.** Three reasons, each derived rather than preferred, and all three stated in the code's own comment:

1. **The guard short-circuits on the token.** `!token && !session` bounces only when both are absent, so a cookie-restored token satisfies it without the session read participating.

2. **`getAccessToken` RESTORES the recovered token to `localStorage` (`_base.ts:141`), and this effect runs at mount.** The file contains roughly twenty further localStorage-only token reads — every panel fetch, every handler. They all heal on their own once the guard has run. **That is what makes a two-line diff sufficient here rather than merely small**, and it is the reason the fence "0-line beyond the guard" is not leaving the surface half-fixed.

3. **The opposite choice would make things worse.** Giving the session leg a cookie fallback would admit a **token-less** bride into a surface whose every fetch requires a Bearer — an empty, silently broken sanctuary instead of a landing page she can sign in from. That widens a pre-existing weak branch for no gain.

**Cookie-writer census, which is what settles (3):** `tdw_couple_session` is written by five doors (`(landing)/page.tsx:29`, `pin-login`, `pin`, `pin-reset`, `join/[code]:45`). `tdw_couple_token` is written in exactly one place — `_base.ts:134`, and only when `localStorage` already held the token. So a session-cookie-only bride is real, and she is precisely the bride who has no token to fetch with.

## 4. DISCLOSED CONSEQUENCE — F-05.30's SURFACE GROWS BY ONE CALLER

`getAccessToken` falls back to `readCookie(VENDOR_COOKIE)` after the couple cookie. Before this micro the sanctuary guard was localStorage-only and could not see a vendor cookie; **now it can.** On a shared device a vendor-only cookie can pass the bride surface's front door.

**Not a leak** — CE-64 recorded the server side as defensible-by-design (token → user → couples lookup, vendor-only identity 403s), so the outcome is a shell that loads and then fails its fetches, not data crossing lanes. **But it is a real widening of exactly the finding that is already filed**, caused by a ruled cure, and it belongs in the coordinated auth sitting's evidence rather than in a footnote. Named, not buried.

## 5. PROOF

- **`npx --no-install tsc --noEmit` — WHOLE TREE, ZERO ERRORS.** Nothing deleted, so no cache clear was required; run on a fresh `npm install` at this tip.
- **Delta: ONE file, 22+/1−.** `sanctuary/page.tsx` beyond the guard: 0-line. dream-os: 0-line.
- **No bench:** none exists on this repo (declared at CE-64, unchanged). The proof is tsc plus the founder's probe — stated as the ceiling of what this delivery can claim.
- **COPY: EXPECTED-ZERO.** A guard fix has no words. No string a bride can read was added, changed, or removed. Zero stated as required.

## 6. THE FOUNDER PROBE

**P1 — the finding's own strengthened probe.** Bride surface open and logged in → DevTools console → `localStorage.clear()` → reload.
**Green:** the sanctuary **loads**, no bounce to landing, and the Network tab shows the authenticated fetch carrying its Bearer.

**P2 — the control, and it matters more than P1.** Now clear the **cookies** too → reload.
**Green:** the guard **bounces** to landing. This proves the fix reads the mirror rather than disabling the guard — without P2, P1 alone is indistinguishable from having deleted the check.

## 7. OPEN

- The chair's anchor correction (`:181–182` → `:3570`), owed one line.
- F-05.30's widened surface (§4) — evidence for the coordinated auth sitting, not cured here.
- The ~20 sibling localStorage-only reads in this file — **not a gap**, per §3(2): the guard's restore heals them at mount. Recorded so a later reader does not re-file them as debt.
