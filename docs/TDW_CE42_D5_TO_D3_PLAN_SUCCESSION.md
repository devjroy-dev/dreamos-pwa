# CE-42 · SEAT D2 → SEAT D3 · SUCCESSION · `/plan`, THE PUBLIC INTAKE (R-41.94)

**Written by seat D2 at** dreamos-pwa `290e90d0efce5b3a30b0233fd36b49b2d011eae7` · dream-os `876cef24a10a8dede0313021a09a5076c3fea76b`, both derived fetch-first at the moment of writing. **Docs-only cut; no code moves with this file.**

**Read this whole file before ruling or building anything, and re-derive both tips before your first relay.** Everything below was true at those two hashes and at no other moment. Trust evidence over narrative — including this note.

---

## 0 · WHY THIS SEAT EXISTS

D5's read-first was answered, its eight forks ruled, its frame vetoed. Every part of D5 **except `/plan` itself** shipped and walked green across three packets tonight (D5, D5b, D5c). `/plan` alone remains, and it was banked rather than built because it lands on `app/(landing)/page.tsx` — the sign-in path for **vendors as well as couples**, and the one file in the estate where a botched extraction locks everyone out of the app rather than out of one lane. Bank-at-the-seam, chair-ruled.

You inherit a fully-ruled charter. **Nothing in §2 needs re-litigating; §5 is what is genuinely open.**

---

## 1 · WHAT ALREADY SHIPPED, SO YOU DO NOT REBUILD IT

All landed, pushed and founder-walked on 2026-09-10.

| | |
|---|---|
| **F-42.55** | `POST /api/v2/couple/assistance/public` — the door `/plan` will call. Inside `requireCoupleAuth`; `origin` chosen by the route, never read from the body; both doors run one handler. A2's reserved body-phone router is **deleted**, not uncommented. |
| **F-42.57** | `src/api/public/enquiry.js` reads `categoryNoun` — `/e/` says *venue and caterer*, not `venue_catering`. |
| **F-42.58** | Cityless **admin-typed** request cannot be forwarded to an outsider. Outsider arm only. |
| **F-42.63** | Filed, uncured: bride/public cityless requests keep the hole until R-41.95. **The founder's SELECT showed five cityless rows, all `origin=admin`** — so this residue is currently an empty set. |
| **R-42.7** | City mandatory at the admin intake — form guard *and* door guard (`400`, *"Add a city to file the request."*). |
| **F-42.73** | A vendor's number at the couple intake refuses with its own code, `409`, naming the handle from the row. |
| **F-42.64 / F-42.74** | Refusals sit still instead of flashing past in a three-second toast — the outsider control closes with its reason beneath it; the intake's reason holds above the button until a field changes. |
| **F-42.1 / F-41.156** | `/r/` strips Meta's literal `{{1}}`; `/e/` reads the public door and renders Service · City · Month · Budget, escaped, light, `noindex`, build-stamped. |

Bench state at your base: **`b20_a3` 203/203**, **`b20_a2` 193/193**, `tsc --noEmit` clean, `FLOOR = NAMED BASE, no delta`.

---

## 2 · THE RULINGS · VERBATIM, ALL BINDING

Recorded from the chair's relays of 2026-09-10. These are **settled**; build to them.

1. **PROCEED** — D4 is at origin; the precondition is met.
2. **RANGE** — issued per seat, derived at both origins. D2's `F-42.55–.64` and `F-42.73–.80` are spent to `.74`; **`.75–.80` remain unspent and are yours if the chair re-assigns them, otherwise ask for a fresh range before filing anything.**
3. **ORIGIN FORK — RULED (ii).** *"A distinct mount `POST /api/v2/couple/assistance/public` hardcoding `'public'`; `:77` byte-untouched; no field on the shared body."* **Already built.** `/plan` calls it.
4. **TOKEN SOURCE — RULED:** *"`PUBLIC_BG #F8F7F5` / ink `#0C0A09` from `app/layout.tsx`, the ground `/v/`, `/r/`, `/credits/` already stand on. No `theme.ts` emitter for `/plan`. The frame is hand-drawn on those two values plus the sheet's existing type; light only."*
5. **FORK B — RULED:** *"pull both roles to `lib/auth/otpSignup.ts`; landing and `/plan` call it; vendor lane touched by extraction only, behaviour cell for both roles, the control table rides the build. §8 reads 'no NEW localStorage writes' — moved writes are not new; α is clean. Cookie-first for the public lane is a later packet, not this one."*
6. **FORK C — RULED (a):** *"She follows the real path: verify → `/couple/onboarding` → frost guard → onboarding → `/frost`, the sheet shows her request. The card is rewritten to that path."*
7. **COPY — VETOED as proposed:** P1 `Tell us what you need.` · P2 `Your phone and name, so we can reach you.` · P3 `Enter the code we sent on WhatsApp.` · P4 `Sent. We'll message you on WhatsApp.` **The twenty existing sheet bytes untouched.**
8. **SITEMAP — RULED:** *"`/plan` joins the sitemap (monthly, 0.5); not in robots' disallow. Reachable is the point."*

**And four riders, equally binding:**

- **FORK D — RULED as proposed:** `?city=` and `?date=YYYY-MM-DD` only; malformed ignored; `area` and `brief` **refused** (a link that pre-writes a stranger's own words back at her can be forged to put words in her request).
- **MIRROR — RULED:** `app/layout.tsx:121` joins with `path === '/plan' || indexOf('/plan/') === 0`. ⚠ The three existing members are trailing-slash prefixes (`'/v/'`, `'/r/'`, `'/credits/'`) and `indexOf('/plan/') === 0` **alone would miss `/plan`**, which is the whole URL. The *"third instance"* comment at `:112–113` gets its fourth paragraph in the same diff.
- **THE TWO 401s — RULED IN SCOPE:** *"not acceptable on a public page — the extracted sheet takes a `signedIn` flag and skips `fetchMyAssistance` and `/couple/me` when false."*
- **R-42.6 · COLOUR, founder-ruled:** *no colour anywhere the estate does not hold.* Every value is transcribed with its `file:line` or it does not ship. Frame v2's census is the specimen.

**Q1/Q2/Q3, ruled at the frame:**
- **Q1** P1 takes #7's slot **on `/plan` only**; #8 (`One sheet. We do the rest.`) kept beneath; the bride lane keeps `Your wedding assistant`.
- **Q2** S2 heading `Almost there.` · S3 heading `Check WhatsApp.` (**not** *Check your messages*); P2/P3 as ledes beneath.
- **Q3** Fixed `+91`. No country picker.
- **S3's two actions:** Verify carries the one gold; Resend is an ink-hairline button, **not** a text link.

---

## 3 · THE CONTROL CENSUS · `app/(landing)/page.tsx` @ `290e90d0`

CE-115 requires this before the file is rewritten. **30 interactive elements**, derived by JSX element and cross-checked independently against closing tags (17 `<button>` opens, 17 `</button>` closes — the two methods agree).

| block | n | elements |
|---|---|---|
| `CountrySheet` · `GoldBtn` · `GhostBtn` · `BackBtn` | 4 | `button@107 212 228 243` |
| **entry** | 5 | `button@808 819 843`, `a@864` (privacy), `a@866` (terms) |
| **join_phone** | 6 | `BackBtn@907`, `input@911` (name), `button@921` (country), `input@925` (phone), `button@932` (category), `GoldBtn@965` *Send code →* |
| **join_otp** | 4 | `BackBtn@972`, `input@977` (otp), `GoldBtn@993` *Verify →*, `button@994` (Resend) |
| **chooser** | 3 | `BackBtn@1014`, `button@1017` (Dreamer), `button@1027` (Maker) |
| **signin_phone** | 4 | `BackBtn@1043`, `button@1056` (country), `input@1060` (phone), `GoldBtn@1066` *Continue →* |
| **exploring** | 4 | `button@1105 1174 1245 1253` |
| **TOTAL** | **30** | |

**Under a pure extraction every one is KEPT; none MOVED, none REMOVED-BY-RULING.** The table ships in the build packet with that accounting made explicit per element.

**e-8, D2's error, recorded so you do not inherit it:** this seat told the chair "41 controls" three times. That figure came from grepping `onClick=` and `onChange=` *lines*, and in this file a `<button>` routinely spans two lines with its handler on the second — one control counted twice. **Count elements, and cross-check by a method whose failure mode differs.**

---

## 4 · THE SIX FILES, AND WHAT EACH ONE MUST DO

### 4.1 `lib/auth/otpSignup.ts` — NEW
Extract `sendOtp` (`:491`) and `verifyOtp` (`:514`) from the landing page, **both roles**. There is no "couple half" to take: `const isVendor = role === 'Maker'` is line 1 of each, and it decides the endpoint (`:499–501`, `:533–535`), the session key (`:559`) and the destination (`:602–608`). Two page-local helpers travel with them — **`safeSetItem` (`:47`) and `mirrorSessionToCookie` (`:55`), neither of which has another home anywhere in the tree.** Leaving them behind means two homes; that is the whole reason Fork B was ruled α.

⚠ **`:481`'s comment names `sendOtp`'s four callers as `:879, :577, :589, :909`. Derived at this tip they are `:635, :647, :965, :995`** — F-42.61, filed, uncured. The comment is load-bearing (it is the reasoning that stops a stranger's mint inheriting a typed name); fix the cites as you move it or the extraction carries a lie into a new file.

### 4.2 `app/components/couple/AssistanceSheet.tsx` — NEW (extraction)
From `app/(frost)/frost/canvas/assistance/page.tsx` (245 lines). Takes **palette, chrome and `signedIn` as parameters** (Fork A α as ruled). The bride lane passes Wine + `CanvasShell`; `/plan` passes the public light ground and no back-to-shell.

**Three §13 traps, all derived, none optional:**
1. `CanvasShell` → `useFrostMode()` → `lib/frost/FrostCtx.tsx:62`, whose default is pinned **`E1A` — Wine Night, dark**. That file's own header says the default *"is inert while the provider wraps every consumer, which it does today… waiting for the one render that does not reach the provider."* **`/plan` outside `(frost)` is that render.**
2. Independently: the sheet hardcodes Wine at `:56–63`. Dark with or without a provider.
3. `CanvasShell` renders Back to `backTo`, which the page passes as `/frost/canvas/sanctuary` — a public stranger's first tap into the authenticated shell.

**Not traps, checked so nobody re-derives them:** fonts hold (`DM Sans` from `app/globals.css:10`, root-imported; Fraunces/Italianno/JetBrains Mono from `app/layout.tsx:67–70`). `ServiceWorkerRegistrar` (`(frost)/layout.tsx:106`, F-19.36 *per authenticated shell*) does not follow the sheet out of the group.

`markAssistRequested()` (`:134` → `lib/frost/assistPopup.ts:57`) writes localStorage. Under ruling 5 that is a **moved** write, not a new one — but it is a popup flag for a lane `/plan` has no popup in, so consider whether the public caller should call it at all.

### 4.3 `app/plan/page.tsx` — NEW
Four screens, per frame v2. Light only, one arm. Ground `#F8F7F5`, ink `#0C0A09`. Send/Verify are `/v/`'s own `.pv-cta` — `app/v/[code]/page.tsx:969–974`, `.5px solid #C9A84C`, radius 2, `#7A621C`, min-height 44, 12px/500/.04em, `:active #F2EFE9`. One gold per screen, on the action only.

### 4.4 `app/layout.tsx` — the branch
`:121`, per the MIRROR ruling above.

### 4.5 `app/sitemap.ts` — the entry
The statics array at `:36–40`. `monthly`, `0.5`. `app/robots.ts` **unchanged**.

### 4.6 `lib/frost-api/assistance.ts` — the public submit
`AssistRequestBody` (`:16–22`) gains **no `origin` field** — ruling (ii). A second function posting to `/api/v2/couple/assistance/public` with the same body type.

---

## 5 · WHAT IS ACTUALLY OPEN

1. **The fixture SELECT is still owed by the founder.** The smoke card is authored **from his pasted rows, never before them** (fixture-state law). Under Fork C(a) the walk is: `/plan` → sheet → phone+name → OTP → `/couple/onboarding` → frost guard → `/frost` shows the request → `/admin` queue shows it, `origin public`. **Four steps longer than the card D5's kickoff carried** — the kickoff said *"OTP → pin → /frost"*, and `:601`'s `coupleNeedsOnboarding` makes `:607` unreachable for a caller who has never had the app.
2. **Whether `markAssistRequested()` fires on the public path** (§4.2).
3. **The `/plan` frame is vetoed and does not need re-drawing** — `TDW_CE42_D5_PLAN_FRAME_v2.html`, delivered in chat, accepted with its nine-value census verified by the chair. If you change any surface it draws, the frame is re-emitted and re-vetoed first.

---

## 6 · DELIVERY SHAPE

**Two ZIPs, pwa-heavy.** Both benches re-derived at the cut, both-ways by production-code mutation with a no-op control. `deploy/`-prefixed; guard block first (`grep -q '"name": "web"' package.json …` then `tools/base_guard.sh`), `git clean -n` as its own block ahead; §7 chain verbatim; one verify line ending the D-10 STOP; git line its own paste block; five-line handover inside each ZIP; every block parsed with `bash -n` before hand-over.

**Standing habits earned tonight, all paid for by a red cell:**
- **e-7:** a byte a cell asserts absent **never appears in a comment**, not even to explain why it is absent. Caught four times in one sitting.
- **A cell that drives a function in isolation proves nothing about whether it is *called*.** Assert the wiring structurally: derive the branch's subject from the source and require it to come from the thing under test.
- **A cell must never re-implement its subject.** Lift the file's own expression and bind it; do not retype it beside it.
- **Sealed cells that red on your cut are amended BY LABEL to the meaning, never deleted and never re-pinned to a new spelling** (R-41.121). Six were amended tonight; each is annotated in place.
- **Blob-check wider than your manifest.** Check every file your bench *reads*, not only the ones you *ship* — a manifest-only check tells you the copy is safe, not that the bench still measures the same tree.
- **Never route a walk through a real vendor's Leads room to prove a negative** (e-6). Fixtures are DEV440 (`9888294440`, vendor) and MAKEUPBYSWATIROY (`8595356978`, vendor) and the test couple `9625759924`. **DEV440 is a vendor and cannot hold a couple request — F-42.73 now says so on the glass.**

**Container limits, declared:** the full dream-os floor exceeds the seat container's per-command wall (the warming pass alone does), so the floor line rides the founder's verify block per R-38.19 with dirt declared under F-14.16. The pwa `b20_a3` needs `typescript` installed or it refuses at §5 and reads 29/29 instead of the true count — R-38.34's precondition wearing the costume of a defect.

═══ END · D5 seals here. D3 begins with §4.1. ═══
