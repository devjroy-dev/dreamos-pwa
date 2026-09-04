# TDW_19 · G1.1 — WEDDING PAGES · THE BUILD SITTING · HANDOVER (dream-os half)

**Seat:** LE, code-capable, one sitting.
**Base:** `dream-os` @ `d58648e`, re-derived at origin at the moment of cutting (R-38.16).
**Sibling:** `dreamos-pwa` @ `ae30180` — byte-clean and **untouched** by this delivery.
**Governing:** kickoff (CE-40, 2026-09-04) · R-40.7/.11/.12/.18/.19/.20/.21/.22/.23/.25 · R-G11.1–.22 · the ratified mock `docs/mocks/wedding-pages-mock.html` @ `ae30180`.
**Workspace:** `/home/claude/g11build/` — one sitting, fresh clones, `git status --porcelain` empty at seating, preflight CLEAR.

---

## H1 · WHAT SHIPPED

| Path | What |
|---|---|
| `db/migrations/0131_wedding_pages.sql` | the three tables — **founder-run, before the pwa apply** |
| `src/lib/cloudinarySign.js` | **new** — the one home for upload signing (R-G11.22) |
| `src/lib/season.js` | **new** — R-40.25's four words, one home |
| `src/lib/vendor/weddings.js` | **new** — sole writer for all three tables |
| `src/lib/vendor/creditInvite.js` | **new** — the dark claim send, two gates |
| `src/api/vendor/studio/weddings.js` | **new** — seven studio doors |
| `src/api/public/weddingPage.js` | **new** — the public page door |
| `src/api/credits.js` | **new** — the public claim pair |
| `scripts/b53_g11_wedding_pages_bench.js` | **new** — 62 cells + 9 mutations |
| `scripts/floor-manifest-g11-dreamos.txt` | **new** — the declared dirt |
| `src/lib/vendor/igImport.js` · `portfolio.js` · `admin/cloudinary.js` | signing delegated; **signatures unchanged** |
| `src/lib/templates.js` | the fifth template, registered `pending` |
| `src/api/router.js` · `src/api/vendor/studio/index.js` | two mount lines |

**Zero pwa bytes. Zero engine bytes. Zero soul bytes** (W-1 needs no lift here).

---

## H2 · THE DOORS

| Method | Path | Auth |
|---|---|---|
| `GET` | `/api/v2/vendor/studio/weddings` | owner |
| `GET` | `/api/v2/vendor/studio/weddings/:id` | owner |
| `POST` | `/api/v2/vendor/studio/weddings` | owner |
| `POST` | `/api/v2/vendor/studio/weddings/:id/credits` | owner |
| `POST` | `/api/v2/vendor/studio/weddings/:id/publish` | owner |
| `POST` | `/api/v2/vendor/studio/weddings/:id/upload-url` | owner |
| `POST` | `/api/v2/vendor/studio/weddings/:id/photos` | owner |
| `GET` | `/api/v2/public/wedding/:code/:slug` | **none** |
| `GET` · `POST` | `/api/v2/credits/:token` · `/claim` · `/decline` | **token only** |

---

## H3 · PROOF

`b53` — **62/62 cells GREEN**, and **9/9 mutations RED with every file restored byte-for-byte**. Every mutation edits production code, never test setup:

| Mutation | Cell it proves |
|---|---|
| slug expands `&` | the ratified addresses |
| the roll is reordered | R-40.7's order |
| a phone joins the public roll | R-G11.6 |
| the consent gate is dropped | R-G11.10 |
| the miss body differs by reason | R-G11.5 |
| the create door stops filtering `deleted_at` | F-40.33 |
| publish implies consent | R-G11.10 |
| a season band is retuned | R-40.25 |
| the dark send loses its flag gate | F-40.21 |

**Signature equivalence (R-G11.22)** was proven against an *independent transcription* of the pre-cure method over four cases, including the wedding folder that did not yet exist — all MATCH. **F-40.34 census by command: 3 `paramsToSign` sites before, 1 after.**

**Floor, by SET, under `--delivery`:** re-derived at the cut and reported in the delivery block. `b07_p4b_body_bench` was A/B'd with `0131` moved aside and back — **75/76 both ways, identical FAIL set** — rather than covered by the base, because its failing cell scans migrations and this delivery adds one.

---

## H4 · WHAT THE FOUNDER MUST DO — NUMBERED

### (A) The template submission — Meta, WhatsApp Manager

The send is **dark**. Until Meta returns Approved, the claim path is walked by pasting the claim URL by hand, and the walk card below does exactly that.

1. Open WhatsApp Manager → **Account tools → Message templates** on WABA **`1739793260373677`** ("The Dream Wedding Direct"). *Not* the other WABA.
2. **Create template**. Name: **`tdw_wedding_credit`** — lowercase, underscores, exactly as spelled.
3. Category: **Utility**. Language: **English**.
4. Body — paste exactly, four variables, typographic apostrophe in `{{3}}’s` and an em dash before *nothing*:

   `{{1}} credited you as {{2}} on {{3}}’s wedding page. Add your name to the page, or decline — nothing is published under your name until you choose.`

   then a blank line, then `{{4}}`.
5. Samples, when Meta asks: `Dev Roy Photography` · `Makeup` · `Priya & Arjun` · `https://thedreamwedding.in/credits/8f2c41a9`
6. Submit. **Do not set any env var yet.**
7. When it returns **Approved**, tell the next seat. Two things flip together: `status: 'pending'` → `'approved'` in `src/lib/templates.js` (a code change, one line, a delivery), and `WEDDING_CREDIT_SEND_ENABLED=1` in Railway. **The flag alone does not open the send, and neither does the approval alone.**

> ⚠ **F-19.07's risk, stated before submission rather than discovered after it.** Meta has reclassified a Utility template on this estate before, and F-40.12 records the review-ask template being classed MARKETING for a similar shape. This message names a specific act by a specific person and carries a decline path, which is the Utility case. If Meta returns MARKETING, that is a finding, not a defect, and it changes the pricing and the opt-out posture — not the code.

### (B) The consent flip

`couple_consent` defaults `false` and **no door in this sitting writes it** (R-G11.10). The fixture carries no couple at all — `couple_id` is NULL on all seven live DEV440 events (F-40.30) — so the page cannot serve until you flip it by hand. **That SQL is withheld behind `0131`** and ships as its own block only once `0131` is witnessed, per the conditional-withheld rule.

---

## H5 · THE FOUNDER'S CARD — you perform, the seat reads

Fixture derived by SELECT, never recalled: owner **DEV440** `Dev Roy Photography`; MUA credit **MAKEUPBYSWATIROY** — the byte is **`Make Up by Swati Roy`**, two words, *not* the mock's placeholder `Makeup by Swati Roy`; wedding **`Verma – reception`, 2026-07-31**, which renders **`Summer 2026`** (R-40.25).

1. Open **Rooms** → *Business Solutions* is the first tile, full width. *(pwa half — not this ZIP.)*
2. Tap it → nine rows, the WhatsApp door at the foot, no old rows.
3. **Wedding pages** → **+** → pick **Verma – reception**. The address derives as **`verma-reception`** and is shown dimmed, not typed.
4. Add two credits: the MUA by handle **`MAKEUPBYSWATIROY`**, and a second by **a number you choose and type yourself** — any number that is not one of the three vendor numbers. **No delivered file and no SQL holds that number** (F-40.32).
5. **Publish.** The room will say the page is waiting on the couple's permission — that is correct and expected. Run the consent-flip block, then reload.
6. Open `/v/dev440/w/verma-reception` **signed out, on a phone**. Expect: the roll in role order, the MUA linked, the typed credit unlinked and **phone-free**.
7. Open the claim URL printed for the typed credit → **Add my name** → the roll updates. Tap again: it shows the terminal state and offers no toggle (R-G11.14).

**Only your device can witness** steps 6 and 7's rendering, the gallery's composition against real frames (CE-116 clause 3 — note DEV440 has **3** approved portfolio images, so there is thin material), and whether the meta line reads well at phone size.

---

## H6 · DISCLOSURE — the errors this seat owns

- **e-1 · the fixture SELECT's first cut destroyed its own field-to-row association.** Long format keyed on `(ord, section, field)` with a *static* section string; two vendors matched and sixteen rows sorted into eight unattributable pairs. Caught by the output contradicting itself (a makeup artist with `category=photography`), not by luck. Cured by a wide-format second cut, one row per record. **The working assumption that `DROY550` *is* `makeupbyswatiroy` was wrong** — there are three vendors — which is precisely why the SELECT precedes the authoring.
- **e-2 · a hollow green, almost written down.** The first post-cure floor read `AFTER: 0 non-green` and I nearly recorded a sweep. It was a **STOP**: `run-floor.sh` refused a dirty tree and emitted zero result lines, and my `grep -c '^RED:'` counted a refusal as a clean floor. The instrument was right and the reading was the defect. Cured lawfully by F-14.16's declared-dirt manifest, not by working around the guard.
- **e-3 · the slug rule contradicted the ratified mock.** My first cut expanded `&` to ` and `, which would have shipped `priya-and-arjun` while every ratified frame draws `priya-arjun` — every address wrong on the first walk. The mock outranks the tidier rule. Now a both-ways cell.
- **F-40.36 / R-G11.23 · A BENCH WAS AMENDED IN THE SITTING WHOSE CODE REDDENED IT — read this one rather than trust it.** `bOB_taxonomy_bench` cell 6.1 went RED because four of R-40.7's ascii role keys (`makeup`, `decor`, `venue`, `mehendi`) are also vendor-taxonomy tokens. **The cell was right to red**, and only the SET comparison surfaced it — a count would have hidden it (R-38.19). Ruled arm (a): a declared exclusion on 6.1b's own precedent, argued in-file, with the no-join derivation stated. Two arms were refused and are named in-file so they are not re-proposed: prefixing the keys contorts a schema to satisfy a lint, and importing `categories.js` would assert the very conflation the bench forbids.
  **The exclusion SUBTRACTS four tokens; it does NOT exempt the file.** My first cut did exempt the file, and this delivery's own non-vacuity mutation caught within minutes that a genuine private taxonomy copy pasted into `weddings.js` then passed unseen — a loosened detector with a comment on it. Narrowed to token-subtraction, and proven able to red in **three** directions: `ROLE_KEYS` drifting from `0131`'s CHECK, a role/category join added to the public door, and a real private copy. All restored byte-for-byte.
  **Filed, not fixed:** the pre-existing bride-namespace exclusion at `:243` has the same file-exempt shape mine started with. I did not touch it — it is not this sitting's, and narrowing it is a change to an instrument on someone else's charter.
- **e-4 · two `b53` cells were wrong about the tree, and the tree was right.** One regex demanded single-space DDL where the file is column-aligned; one storage cell read the claim lane's own comment *forbidding* storage and reported the prohibition as a breach. Both cured in the cells. The mutation harness also caught a mutation site with the wrong indent and **refused to edit rather than silently matching nothing** — which is the guard working.

---

## H6b · THE WALK, AND THE THREE THINGS IT CHANGED (2026-09-05)

The founder walked the estate on `1961164` and steps 1 and 2 held: both wide
tiles render full-width at the head of their bands, work falls 3·3·2 and business
3·3·3 clean, the nine rows stand with the WhatsApp door at the foot, and no
retired row survives. Three findings came off the glass that no bench could have
produced:

- **F-40.50 · `GET /api/v2/vendor/events` 404s.** The door is `/events/:vendorId`
  and always was, and `lib/vendor/api/vendor.ts` already held a typed helper. The
  protocol's §6 requires reading the handler before writing any frontend call;
  this seat had read that file and then did the thing it forbids. **e-8, owned.**
  The same read killed a second defect: the client-side `deleted_at` filter was
  dead code twice over — the door already carries `.is('deleted_at', null)` and
  does not project the column, so the predicate tested a field that never
  arrives. F-40.33's real protection is in the create door, where it belongs.
- **R-40.28 · ARM C — the live hub row now carries `Open`.** `W5-hub` drew it bare and the
  reasoning was sound on a screenshot — a chip that says nothing is chrome. On
  glass it failed: beside eight `Coming` rows, the one **working** row was the
  only one with nothing on its right and read as a heading. **R-39.15 — the
  rendered surface outranks the instrument reasoning about it, and that includes
  a ratified frame.** Founder-vetoed 2026-09-05 from the four-arm rider
  `docs/mocks/g11-hub-row-rider.html`; the arms he refused (a chevron, the label
  in the accent, both together) are drawn there so the choice is on the record.
- **R-40.26 · R3 becomes `Your website & SEO`**, amending R-40.1 for that room
  alone. Four words, which costs nothing new: R-19.6's "≤2 words" and the
  `bs_audit` C6 cell that pinned it retired under R-G11.25.

**TWO BYTES NOW DEPART FROM THE RATIFIED MOCK BY RULING** — `Open` and
`Your website & SEO`. No re-shoot is owed on either (founder's word). `b42`
registers them **by value**, so the exception is exactly two strings wide and is
pinned **both ways**: revert either to the mock's own byte and the carve-out reds
as stale. Every other string is still a BOUNCE if it is not in the mock.

- **F-40.51 · the hub's divider vanished under the one working row.** The rule
  was `.sol-row:last-of-type`, and `:last-of-type` counts PER TAG NAME. Eight
  rows are `<div>`; the live row is an `<a>`, because `RoomRow` renders a Link
  only when there is a destination — so the single `<a>` was both the first AND
  the last of its type and lost its border. **The rule was correct until the
  div/Link split made the eight non-tappable**; that change broke it silently and
  no cell could see it, because the CSS was still present and still valid. Now
  `:last-child`, with a both-ways mutation.
- **F-40.52 · `/credits/` was a third public lane and nothing knew it.** The root
  layout's boot script paints a background per lane; `/credits/<token>` matched
  no branch and inherited the app's near-black above a cream page — F-19.41's
  defect, third instance, under a comment promising *"C38 refuses a third
  instance."* C38 passed only because its census named `/v/` and `/r/` by hand.
  **A named list cannot see a lane nobody added to it**, so the list is now
  declared once and asserted in a loop; a fourth lane joins by one line.
  **The service worker is the third keeper of public lanes and is still
  unaware** — that is the 503 the founder walked, and it is NOT cured here.
- **F-40.53 · the claim page failed silently, and R-40.29 is its cure.** A stale
  service worker returned 503; the page caught it, re-enabled the button and
  rendered nothing. The founder learned the tap had not landed by querying the
  database — a vendor has no database. It satisfied never-a-false-done and that
  was the whole of what it got right. **Silence is not the same as honesty.**
  Cured both ways the founder ruled: the tap is acknowledged (`aria-busy` +
  disabled on BOTH controls) and a non-2xx renders `That didn't go through. Try
  again in a moment.` under the buttons, from `lib/public/copy.ts`. The HTTP
  STATUS is the verdict — a 503 carries no JSON, and a check keyed only on
  `j.ok` reads it as silence, which is exactly how the defect survived review.
- **F-40.54 · no door in G1.1 can produce a linkable credit**, and the walk
  measured it rather than guessing. `publicRoll` links on `claimed && vendor &&
  active && !paused`. The MUA's credit reached `vendor_id` (added by handle) but
  cannot reach `claimed`; the typed credit reached `claimed` through the real
  path but has `vendor_id NULL`, because the claim page is sessionless by ruling
  (R-G11.14) and takes no `vendorId`. **The two live credits sit in opposite
  halves of the predicate and neither is linkable.** The state was witnessed once
  by a founder-run row the product cannot reach, and reverted immediately: the
  roll rendered `Make Up by Swati Roy` — her REGISTERED name, not the `Swati` the
  vendor typed, so a hurried credit cannot mislabel another business — linked
  through to her storefront. That is the acquisition loop, and G1.2's onboarding
  arm is the only thing standing between it and a real vendor.
- **e-13 · finding numbers minted without a chair range (R-M3).** This seat
  minted F-40.41 through F-40.44 itself. The parallel-mint law allows numbers
  only from a chair-issued disjoint range; the chair reissued them as F-40.50–.54
  and this document uses those. **The chair's relay refers to this as `e-9`,
  which collides with e-9 already recorded above (the interrupted seat).** Named
  here as e-13 and flagged rather than silently renumbered — two errors sharing
  one number is how a disclosure stops being a record.
- **e-9 · an interrupted seat cannot tell its own unbanked work from found
  code.** The transcript is its only memory. This sitting was stopped mid-edit;
  on resuming, three files carried Arm C in this seat's voice with citations it
  could not account for, and it held the tree under CE-50/Ruling №6 rather than
  adopt them. The founder accounted for it in one line. Holding was right — the
  cost is asymmetric — but the honest framing was *"I believe these are mine and
  cannot prove it"*, not *"I have no record"*. The cheap standing cure is a
  `git stash` before any pause, or simply telling a stopped seat that it was
  stopped.
- **e-10 · a census keyed on `git ls-files` must be regenerated AFTER staging.**
  `tdw_stripper_census.out.txt` was regenerated in the pwa half while this
  seat's new files were still untracked, so the committed artefact undercounted
  by exactly those files — 208 against a live 213 — and
  `tdw_f3942_census_guard` has been RED at the banked tip ever since. It
  measured the tree the author had, not the tree the estate got. Regenerated
  here by the census's own `--write` step at a tip where every file is tracked.

## H7 · OPEN, HANDED FORWARD

- **F-40.28** — `GET /api/v2/vendor/solutions` has zero product readers after the pwa half, but **eight routes, three files, one green bench (`b43`) and one comment reference**. R-G11.18's condition fails; nothing deleted; post-beta.
- **F-40.29–.33** — the fixture findings: no wedding on DEV440, no `couple_id`, nothing `done`, no untagged number, the soft-deleted event still reading `upcoming`.
- **F-40.35** — three of the four season words were unauthored until R-40.25. Now vetoed and frozen.
- **The PAIR regen is OWED** once `0131` runs: `docs/db/PUBLIC_SCHEMA.md` knows none of the three tables and `0131` is their sole witness under the SQL-provenance law.
- **The no-event create** (`event_id` nullable, door closed) is chartered to **G1.2** with its own mock and strings.
- **The couple's consent switch** — G1.2's, and the only writer `couple_consent` will ever have.

---

## H8 · PROTOCOL ATTESTATION

`docs/TDW_BUILD_PROTOCOL.md` §7 and §11 opened at `dream-os d58648e` and read in full. The §7 apply chain, verbatim:

```
unzip -o FILE.zip && cp -r deploy/* . && rm -rf deploy FILE.zip
```

No dotfile is placed inside `deploy/`. `docs/db/PUBLIC_SCHEMA.md` and `docs/db/ENGINE_SCHEMA.md` both opened; **this sitting reads and writes the `public` plane only** and touches no `engine` byte. Every column in `0131` and in every SELECT is witnessed by ordinal, with the `vendors` staleness named and settled against `information_schema`. LE holds no write credentials; nothing here is banked until the founder pushes.

**Sequencing beyond this sitting is the founder's.**
