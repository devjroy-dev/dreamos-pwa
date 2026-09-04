# P7.4 · READ-FIRST — THE MERGE, THE CONFIG, THE TEMPLATE PARITY

**Derived at** dreamos-pwa `worklist` **0d0ab05** · `main` **c336a05** · dream-os `main` **7f85ff2**,
by command, 2026-09-04. **Nothing was pushed**: the merge was run in a throwaway clone and measured.

## §1 · THE MERGE

| check | result |
|---|---|
| `git merge-base main worklist` | `aae3f99e` |
| on `main`, not on `worklist` | **TWO commits, not one.** `c336a05` (`/terms`, Meta App Review) **and** `74f7163` (`/privacy`: `help@` → `hello@` per F-19.10, plus a Google Business Profile section, renumbered sections, effective 28 Aug 2026) |
| on `worklist`, not on `main` | 100 commits |
| `git merge --no-commit --no-ff worklist` | **clean — zero conflicts** |
| why clean | `app/terms/page.tsx` is a clean ADD (absent on `worklist`). `app/privacy/page.tsx` is the ONLY file present on both sides, and it merged without conflict |
| survivors verified in the merge tree | `app/terms/page.tsx` present · `app/privacy/page.tsx` carries `hello@` (3 occurrences) |
| `tsc --noEmit` at the merge tip | **exit 0** |
| floor at the merge tip | **23 RED + 1 REFUSED** — identical to `worklist`'s set. **The merge adds no red.** |

> The charter expected one `main`-only commit; there are two. Both survive. This is the whole of
> the "main moved" risk the charter named, and it is discharged.

## §2 · PRODUCTION CONFIG AT THE MERGE TIP

- **`vercel.json`** — thirteen identity rewrites (`source` == `destination`). Three name paths that
  never existed in either tree (`/vendor/login`, `/vendor/dashboard`, `/vendor/demo`). Inert;
  reported, not touched (outside the charter's radius).
- **`next.config.ts`** — headers only. No host or branch assumption.
- **`middleware.ts`** — host-gated rewrites for `demodreamer.` / `demodiscover.` / `demobride.` /
  `demo.`. **The apex host falls through to `NextResponse.next()`**, so `thedreamwedding.in` is
  unaffected by any of them. The founder card's ten steps are safe.
- **SW registrar** — `navigator.serviceWorker.register('/sw.js')`, default scope. No host assumption.
- **Identity** — `app/vendor/(shell)/layout.tsx:53`: `VERCEL_GIT_COMMIT_SHA.slice(0,7) || 'local'`,
  rendered server-side per request. On production it will read the **merge commit**, which is what
  card step ② checks.

### F-39.87 — FILED, NOT CURED
`middleware.ts:38-47`: on the `demo.` host, any `/vendor/<x>` is rewritten to `/demo/vendor/<x>`.
Before the flip that meant a demo handle; **after the flip `/vendor/*` is the shell**, so on the
demo host every shell path is captured and lands on `/demo/not-found`. The apex host is unaffected
(the rewrite is host-gated), so this does not block the merge. It belongs with P7.3's deferred work
(R-39.26), not a merge seat.

## §3 · TEMPLATE PARITY — the code's 19 against the Manager's 26

**The code sends nothing outside one registry.** Every send goes through
`templates.buildTemplatePayload(key, …)` / `buildAuthTemplatePayload(key, code)`, and the names live
in `src/lib/templates.js`. Nineteen names. (`delete_receipt`, `list_receipts`, `save_receipt`,
`get_my_tdw_link` appear in a `name:` grep but are **agent tool names**, not templates —
`src/agent/brideTools.js`, `src/agent/tools.js`.)

Manager list read from the founder's three screenshots, selector on **The Dream Wedding Direct**,
footer: *"26 message templates shown (total active templates: 26 of 6000)"*. Every visible row reads
**Active**. Names are truncated by the UI, so each match below is **by unique prefix**.

| # | code name (`templates.js`) | Manager row (as shown) | verdict |
|---|---|---|---|
| 1 | `tdw_circle_place_ready` | `tdw_circle_place_` | **PRESENT** |
| 2 | `tdw_couple_login_otp` | `tdw_couple_logir…` (Auth, 21 sent, 81% read) | **PRESENT** |
| 3 | `tdw_couple_reset_otp` | `tdw_couple_rese…` (Auth) | **PRESENT** |
| 4 | `tdw_crew_assignment` | `tdw_crew_assign…` | **PRESENT** |
| 5 | `tdw_demo_invite` | `tdw_demo_invite` (untruncated) | **PRESENT** |
| 6 | `tdw_demo_lead_alert` | `tdw_demo_lead_…` | **PRESENT** |
| 7 | `tdw_enquiry_alert_vendor` | `tdw_enquiry_aler…` | **PRESENT** |
| 8 | `tdw_enquiry_brief_vendor` | `tdw_enquiry_brie…` | **PRESENT** |
| 9 | `tdw_enquiry_reply_couple` | `tdw_enquiry_rep…` | **PRESENT** |
| 10 | `tdw_lead_alert_basic` | `tdw_lead_alert_b…` (Marketing) | **PRESENT** |
| 11 | `tdw_morning_nudge_bride` | `tdw_morning_nu…` (one of two) | **PRESENT (as a pair)** |
| 12 | `tdw_morning_nudge_vendor` | `tdw_morning_nu…` (the other; 68 sent / 21 sent) | **PRESENT (as a pair)** |
| 13 | `tdw_payment_due` | `tdw_payment_du…` | **PRESENT** |
| 14 | `tdw_vendor_login_otp` | `tdw_vendor_logir…` (Auth, 1 sent, 100% read) | **PRESENT** |
| 15 | `tdw_vendor_reset_otp` | `tdw_vendor_rese…` (Auth) | **PRESENT** |
| 16 | `tdw_vendor_welcome` | `tdw_vendor_welc…` | **PRESENT** |
| 17 | `tdw_enquiry_update_couple` | `tdw_enquiry_upc…` | **UNRESOLVED** — `update` would truncate as `…upd`; the row reads `…upc` |
| 18 | `tdw_marketing_opener` | `tdw_marketing_c…` | **UNRESOLVED** — `opener` would truncate as `…o`; the row reads `…c` |
| 19 | `tdw_circle_join_otp` | `tdw_circle_join_c…` (Auth) | **UNRESOLVED** — `otp` would truncate as `…join_o`; the row reads `…join_c` |

**Sixteen PRESENT and Active. Three UNRESOLVED — not absent.** In each case a Manager row exists at
the right prefix with the right category (the two Auth rows even carry the OTP body `*{{1}}* is your
v…`), but the visible characters disagree with the code's name at the truncation point. That is
either a UI truncation artefact or a genuine name mismatch, and **a name mismatch is a send that
fails on production**. The founder opens those three rows' detail pages and pastes the full names;
if any differs from the code, it is a **red before the merge**.

**Manager rows no code sends (noted, not acted on):** `booking_confirm`, `tdw_referral_invi…`,
`tdw_review_requ…`, `tdw_admin_sign…` (×2), `tdw_bride_welco…` (×2) — seven.

**The two ⚠ rows** are `tdw_admin_sign…` (Marketing, 12 Aug) and `tdw_bride_welco…` (Marketing,
12 Aug). **Neither is sent by any code path** — both are in the seven above. Whatever the warning
is, it cannot break a send this estate makes.

### F-K4.1 — CLOSED
The sending WABA is **Direct** (`1739793260373677`). The evidence is on the list itself: real send
counts against templates only this code sends — `tdw_vendor_logi…` 1 sent / 100% read,
`tdw_couple_logi…` 21 sent / 81% read, `tdw_morning_nu…` 68 and 21 sent. Those are OTP and nudge
sends, and only this estate sends them. **The "other" WABA's list is therefore unused-or-duplicate:**
no code path targets it, and no template on it shows sends this estate made. Closed on the WABA
level; the three UNRESOLVED names are a template-level question, not a WABA-level one.

## §4 · THE FOUNDER'S COMMANDS — one block each, in order

Before block 1: resolve the three UNRESOLVED names (§3), and rule F-19.51's two address-less rows.

```
git checkout main
```
```
git pull
```
```
git merge --no-ff worklist -m "Phase 7: the flip goes live — the Graphite shell serves /vendor/*, the old tree is gone, the estate ships as beta [CE-39 P7.4]"
```
```
npm ci
```
```
npx tsc --noEmit ; echo "tsc exit $?"
```
```
bash scripts/run-floor.sh 2>&1 | grep -E "^(RED|ERROR|REFUSED):" | sort | cut -d: -f1 | sort | uniq -c
```
**Expected: `23 RED` + `1 REFUSED`.** Anything else STOPS the push — that set is the same one
`worklist` has carried since ZIP 2a, and the merge adds no red.

```
git push origin main
```

Vercel deploys production from `main`. Wait for the deployment to read the merge commit before
walking; the identity in card ② is the check.

## §5 · THE PRODUCTION CARD — `https://thedreamwedding.in`, phone width, both modes, **incognito**

① landing: the two sign-in doors, `New here? Sign up`, the chooser (`‹ Back` returns)
② sign in as DEV440 → `/vendor/today`, Beta badge on the masthead; identity = **the merge commit**
③ Rooms: 19 tiles, every one opens at `/vendor/…`
④ Today: a lead → its sheet · the invoice → its sheet · a task → the **Tasks tab**
⑤ `/vendor/list/invoices`, `/vendor/team-hub`, `/vendor/studio/team` → **404**, never old chrome
⑥ Books · an invoice · a PDF, on production
⑦ `/v/DEV440` live. **AMENDED (R-39.26):** the demo studio is deferred past Block 19, so this step
is the `/v/` page only. The existing `/demo/vendor/<handle>` still renders on the **apex** host;
it is not part of this seal, and on the `demo.` host it is subject to F-39.87.
⑧ drawer → `Report an issue` → Room + Build prefilled → `Send on WhatsApp`
⑨ Swati (MAKEUPBYSWATIROY) signs in, sees her own reading
⑩ WhatsApp: Victor answers on the lane — **transport proof only**; his findings ride the Victor
sitting (R-39.23)

**Green on ten = PHASE 7 SEALED. THE ESTATE IS LIVE AS BETA.**

## §6 · CARRIED FORWARD
F-39.87 (demo-host rewrite) · F-39.86 (cross-repo stale read in `b07_p5_bench.js`) · F-39.85, F-39.83,
F-39.81, F-39.77, F-39.76, F-39.75, F-39.74 · F-38.50's residue · P7.3 (R-39.26) · the `vercel.json`
inert rewrites.
