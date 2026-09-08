# CE-41 · A5 — F-41.18 THE SIGN-OUT LOOP · HANDOVER (dreamos-pwa)

**Cut by** LE-A **at** dreamos-pwa `f9bd72e00fb723fac14ba2b658a0063f66c8390c`. **Ruling:** R-41.53 (a)–(d). Hot path: every real vendor who signs out. Three files + manifest.

## 1 · The disease, derived at f9bd72e
Two vendor-session homes: `lib/vendor/session.ts` (the shell's; knows `vendor_session` only, evicts anything without `_v >= 2` at :41) and `lib/frost-api/_base.ts:107–118` (`vendor_session || vendor_web_session`). `clearVendorSession()` (:192) removed only `vendor_session`. The legacy pin pages and the landing's own sign-in write `vendor_web_session` beside it. A3's F-41.1 rider read `_base`'s wider home: after sign-out `/` saw a vendor (the stale key) → `/vendor/rooms`; the shell saw none → `/`; each `replace()` re-armed the other. Seat C's find on the founder's glass; the chair's derivation.

## 2 · The cure
| file | ruling | what |
|---|---|---|
| `lib/vendor/session.ts` | R-41.53a | `clearVendorSession()` also removes `vendor_web_session` (one named constant, the reason in-file). |
| `app/(landing)/page.tsx` | R-41.53b | the F-41.1 effect imports `getVendorSession` from `@/lib/vendor/session` — the shell's home — so `/` and `/vendor/rooms` read one truth. `getCoupleSession` stays on `_base` (the couple sign-out at `settings.tsx:358` already clears both couple keys; one home there). |
| `scripts/b20_a3_assistance_pwa.proof.mjs` §6 | R-41.53c | seven behavioural cells over a fake `window`/`localStorage`, both homes loaded through the repo's TypeScript: plant both keys → redirect; `clearVendorSession()` → both keys gone, both homes null, `entryRedirectFor` null; a stray legacy key alone → no redirect. Three cells RED at `f9bd72e` (the loop's shape), GREEN cured (69/69). |

**A consequence worth having (R-41.53b):** the landing's pre-PIN write of `vendor_session` (`:631`) carries no `_v`, so the shell home evicts it; the front door therefore redirects only a **PIN-verified** vendor (the pin-login stamps `_v: 2` at `pin-login/page.tsx:109`). A3's handover §4(3) had named the pre-PIN redirect as a caveat; it is now gone by construction, and a cell asserts it.

## 3 · R-41.53d — who still writes the legacy key (not this seat's bytes)
`vendor_web_session` is written by: `app/vendor/(legacy)/pin-login/page.tsx:30` · `app/vendor/(legacy)/pin/page.tsx:33` · `app/vendor/(legacy)/pin-reset/page.tsx:45` · `app/(landing)/page.tsx:550` and `:629` (the sign-in and pin-status paths). Read by: the three pin pages (as a fallback beside `vendor_session`) and `lib/frost-api/_base.ts:112/:193`. `_base.ts:62–66` documents it as a deliberate convention for "the new layout". **For the auth sitting:** with `session.ts` now clearing it and the door no longer reading it, the key has no reader that `vendor_session` does not satisfy; retiring the five writes and `_base`'s two reads is one sitting's byte, and until then `_base.getVendorSession()` remains a second, wider home that nothing on the tree should route on. The couple twin (`couple_web_session`) is symmetric and already cleared at sign-out; it is named, not touched.

## 4 · The founder's witness (after Vercel deploys this tip)
1. Sign in as DEV440, enter the PIN, land in the shell. Type the domain → `/vendor/rooms` (unchanged).
2. Sign out from the shell. Type the domain. **Witness:** the marketing page, once, and it stays — no bounce. Reload twice; still the marketing page.
3. DevTools → Application → Local Storage: neither `vendor_session` nor `vendor_web_session` present after step 2.
4. Sign in again but stop at the PIN screen; open a new tab on the domain. **Witness:** the marketing page (a pre-PIN session does not redirect).

Sequencing beyond this sitting is the founder's.
