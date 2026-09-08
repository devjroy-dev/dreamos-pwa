# CE-41 · SEAT C · PACKET C2 — THE SWITCHBOARD CARD (dreamos-pwa) — HANDOVER

**Cut by** LE-C under CE-41 **at** dreamos-pwa `02030f0466f08c787325a47946c33ecdf7bd3f71` (sibling dream-os `124751181fe23b35634f26e8ef153d7897a10e3d`, C1b at origin), both derived fetch-first at the cut. Rulings executed: R-41.8 (the card), R-41.43 (short keys shown beneath plain names), the chair's C2 rider (Templates on Meta + Copy as JSON, F-41.6).

## 1 · What shipped (7 paths; manifest `scripts/floor-manifest-ce41-c2.txt`)

| file | what |
|---|---|
| `app/admin/switchboard/page.tsx` | **the card.** Rows grouped by kind (features · templates · permissions · Google), one row per gate: plain-word name, the register key beneath in small type, the status as a **word in ink with a hairline** (never a filled pill), the evidence sentence, `Checked <when> IST · switched <when> by <who>`, `On` / `Off`, `Check now` (templates and scopes only — the probeable kinds), `Switch on automatically once approved` (disabled until a walk seal is entered — fork iii), a walk-seal input. Header action `Check everything now` (the on-demand sweep). Then **Templates on Meta**: `Read from Meta` → the raw listing (name · status · category · language · id) and `Copy as JSON` (the JSON carries `read_at`, `count`, `pages`, `truncated`, `templates`). Never caches; every load asks the doors fresh. |
| `lib/admin-api/index.ts` | six typed calls against `src/api/admin/capabilities.js` at dream-os — shapes copied from the handler, never assumed (§6): `getCapabilities` · `flipCapability` · `setCapabilityAutoOn` · `checkCapability` · `sweepCapabilities` · `getWabaTemplates`. |
| `app/admin/_components/adminNav.ts` | Engine → **Switchboard** (`/admin/switchboard`), palette hints; the disposition table gains one LIVE row. |
| `app/admin/layout.tsx` | the `switchboard` icon (two switch handles). |
| `scripts/tdw10_p1_shell.proof.mjs` | labeled census amendment, A3's precedent: 35→36 on disk, 38→39 rows, 19→20 LIVE; **57/57**. |

## 2 · Proof
`tsc --noEmit` whole tree: **0 errors**. Shell proof 57/57 (was 54/57 before the disposition row — the control-inventory law working). `b59_seven_ink_census` green. `tdw10_p2_bridge`, `tdw07_f0784_panel`, `tdw10_tier`, `b20_a3_assistance_pwa` (60/60) unmoved. `tdw08_p5_prospects_console` and `tdw10_p2_retint` are RED at origin's tree and unchanged. **`next build` is the founder's gate** (R-40.66; seat containers cannot fetch Google Fonts). No screenshot ships: the page is a live route against the admin bearer, not a static frame; the founder's first open is the render's witness.

## 3 · Copy inventory — the chair's veto (R-40.42), every string a person reads
- Nav: `Switchboard`. Title `Switchboard`. Sub: `Every gate in Business Solutions. Meta and Google are checked nightly at 03:50; a status change reaches here within seconds when Meta tells us.`
- Groups: `Features you switch on` · `Message templates on Meta` · `Meta app permissions` · `Google access`.
- Status words: `On` · `Off` · `Ready to switch on` (armed) · `Approved` · `Waiting` (pending) · `Paused by Meta` · `Rejected`.
- Controls: `On` · `Off` · `Check now` · `Check everything now` / `Checking…` · `Switch on automatically once approved` · placeholder `Walk seal (commit hash)` · `Read from Meta` / `Read again` / `Reading…` · `Copy as JSON`.
- Plain names (32, the `NAMES` map in the page) — e.g. `Contract signing link`, `Payment reminders`, `Review request`, `Concierge: we found you a vendor`, `Instagram: reply to DMs`, `Google: Search Console (read)`, `Switchboard notice to you`. The Meta-words twins carry the suffix `(Meta words)`.
- Toasts: `<name>: on.` / `<name>: off.` · `Checked <name>.` · `Checked N gates; M moved.` · `<name> will switch on by itself once approved.` · `<name> waits for your tap.` · `Enter the walk seal first — a plane is pre-authorised only after it was walked.` · `Could not read the switchboard.` · `Could not switch <name> on/off. <error>` · `Could not save. <error>` · `Check failed. <error>` · `Sweep failed. <error>` · `Meta did not answer: <error>` · `Copied N templates as JSON.` · `Copy failed — your browser blocked the clipboard. Long-press the list to select it instead.`
- Empty state: `The switchboard has no rows yet. Run migration 0149 in Supabase and reload.` Truncation: `— the list was cut short; read again`.
No persona name anywhere. No underscore leaves the glass except the register key line, which is deliberately the key (it is what the log says).

## 4 · The fast path is live — what the first inbound event looks like
The founder subscribed `message_template_status_update` at 14:50 IST. When Meta next changes a template's status, the vendor receiver logs one line from `src/index.js`:
`[webhook:meta] template status <name>=<EVENT> → applied` (or `→ no_row` for an OTP/nudge template with no row by design, `→ no_name` for a malformed change). If the row moved, `src/lib/capabilities.js` re-warms and the card shows the new evidence `Meta webhook: <EVENT> · <reason> · id <id> · <ts>Z` on its next load; if a guarded flag was disarmed, a second line `[capabilities] founder notice (withheld until tdw_capability_armed): disarmed flag.<x> — …` follows. Nothing sends.

## 5 · The walk (kickoff §8), on the founder's phone, no shell
Open Engine → Switchboard. (1) `Payment reminders` reads `On` with the seed evidence; tap `Off` → the word turns `Off`, `switched <now> by admin:<8 hex>`; a reminder due for `9888294440` refuses in the Railway log with `flag.payment_reminder_send is off on the switchboard`. (2) Tap `On` → it sends to MAKEUPBYSWATIROY's handset. (3) `Concierge: we found you a vendor` → `Check now` → evidence `Meta: APPROVED · UTILITY · id 3160852754105015 · <ts>Z`, `Checked <now> IST` moves. (4) Templates on Meta → `Read from Meta` → `Copy as JSON` → paste to the chair: seat B's register. Nothing else changes on any vendor's glass. **The walk outranks the bench.**

## 6 · Disclosures
1. The auto-on checkbox is enabled the moment a walk seal is typed (before saving) so the two can be saved in one tap; the door still refuses `auto_on` without `walk_ref` (0149's CHECK and `setAutoOn`).
2. `Check now` is hidden on flags and permissions: flags are not probed; permission probes are withheld (R-41.39). `Check everything now` runs the sweep, which skips them by name.
3. The cockpit's token set (`AdminUI.T`) is the surface's law; R-40.129's principle (state as ink, never ground) is applied inside it.
