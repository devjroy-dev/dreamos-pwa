# TDW_19 · G3.2 — CONTRACTS & DEPOSITS · pwa HALF · HANDOVER

**Seat:** CE-40 · G3.2 · LE · 2026-09-06
**Bases:** part 1 at `dreamos-pwa 89bee50` (landed `364bd0a`) · part 2 at `364bd0a`.
Sibling `dream-os de6be90`.
**Frames:** `docs/mocks/contracts-mock.html`, eleven frames, twenty shots.
**Sheet:** `docs/mocks/G32_VETO_SHEET.md`, 72 rows + T1, vetoed under R-40.42 with
R-40.51 on #15 and the chair's rewording on #64.

---

## 1 · WHAT SHIPPED, ACROSS BOTH PARTS

| | |
|---|---|
| `app/sign/[token]/page.tsx` | **NEW.** The fourth capability leaf. **Terminal.** |
| `lib/public/signCopy.ts` | **NEW.** Nine bytes, rows 56–64, closed set. |
| `app/vendor/(shell)/contracts/screen.tsx` | Four states · state vocabulary · deposit line · the fork · the picker · the record · F12's refusal · preview · send · deposit |
| `lib/vendor/api/vendor.ts` | The fill path; `fetchTypedClients`; three retirements |
| `lib/vendor/types/vendor.ts` | 0138's five columns · `ContractSignature` |
| `lib/solutions/routes.ts` · `support/page.tsx` | The hub row — the **fourth of nine** to open |
| `scripts/b57_contracts_wiring_bench.js` | **NEW.** 26 cells, five mutations |
| `docs/mocks/*` | F-40.122's cure, eleven frames re-cut, twenty shots |

---

## 2 · THE THREE LAWS THIS HALF IS BUILT ON

**The leaf is terminal, and `/consent/` is not.** That page's header says a couple who
can say yes and never no has been given a trapdoor — right about a publication switch,
false about a signature. **Clause 5 is how this agreement is undone**, in writing, with a
slab. A control here that un-signed it would invent a remedy the instrument has not got.
b57 §6 reds if one appears.

**Row 59 is not the surface's byte to choose.** Clause 12, lawyer-passed and sealed by
R-40.46, says *you enter it and tap "I agree". That is your signature.* If the button said
anything else the instrument's own sentence would describe a product that does not exist —
the identical failure the field register names for clause 8. **The frozen document
constrains the surface, not the reverse.**

**A blank prints as a blank.** `Not filled`, `Not set`, `Venue not filled` — the field
register's §4 rule 3 said to the vendor at row 23, obeyed by the renderer at
`contractPdf.js`'s `BLANK`, and by the record's placeholders. Never `N/A`, never a greyed
zero: `contracts_deposit_pct_check` forbids zero precisely so *not set* and *zero* cannot
be confused.

---

## 3 · WHAT b57 FOUND ON ITS FIRST RUN

The chair asked for **a cell asserting every contract API address has a caller** —
F-40.109's class, closed. It found **three orphans, all inside this seat's own delivery**:

- **`fetchContracts`** — the room has read `fetchAllContracts` since part 1, so this had
  zero callers from the moment part 1 landed. **Retired with its reader.** The DOOR is not
  deleted and its default is not widened: `include_cancelled=1` exists to leave every
  other caller alone.
- **`fetchContractProfile` / `saveContractProfile`** — **NOT SHIPPED.** See §4.

A cell that finds three real instances on its first run is the argument for the cell.

---

## 4 · THE ONE HELD FORK — THE PROFILE CARD

**Veto rows 30–31 are vetoed and NOT BUILT, deliberately.**

The card is minted — `Set your policies once` and its sentence — and `R4-record-blank`
draws it. **The sheet behind that button has no frame and no minted bytes.** Every PROFILE
label would be a string the founder's pass never saw, and mock-first (c-39.26) says a byte
this build discovers it needs is a **raised fork, not an authored string**.

So the card is not drawn either: a card whose button went nowhere is a dead control
(s-G11.2, four times in this arc), and one with an invented sheet behind it is worse.

**Consequence, named rather than papered:** `GET`/`POST
/api/v2/vendor/contracts/profile/fields` ship in dream-os with **no pwa caller**. That is a
server-side orphan and the one address b57 §1 cannot police, because §1 reads the client
and there is deliberately nothing in the client to read.

**What is owed:** a frame for the profile sheet, and a veto pass on its labels. Until then
a vendor's PROFILE tokens are unfillable and the instrument prints them as blanks — which
is correct behaviour and an incomplete product.

---

## 5 · TWO PLANES, TWO ID SPACES, ONE WORD

`fetchClients` looks like the composer's call and is not. It goes through `fetchCabinet`
and `binderToClient`, which maps `b.id` — a **binder** id out of `engine.records`.
`POST /compose` looks its id up in `public.clients`. **Every row would 404**, silently,
behind a clean `Client not found.` that reads like a data problem.

`fetchTypedClients` hits `GET /api/v2/vendor/clients/:vendorId` — `resolveVendor` mode B,
so the path id must match the JWT's: a second **address**, never a second authority.

Derived by reading `binderToClient` and the door, not by trusting a name. b57 §2 reds if
the picker is ever pointed back.

---

## 6 · WHAT THIS SEAT GOT WRONG IN THIS HALF

- **A badly chosen mutation.** §4's first attempt renamed one `fetchAllContracts` call
  site and reddened nothing — the room has two, and the survivor satisfied the cell. The
  mutation that removes the behaviour is the query param.
- **A cell that reddened on its own regex.** §5 matched `Mark Signed` within 400 characters
  of its gate; the gate sits 600 away. Widening the window would have been tuning a cell to
  a tree, so it was rewritten to assert the **branch** instead.

Both recorded rather than replaced quietly. Neither is a defect in the product; both are
defects in how it was proven, which is the class this estate spends findings on.

---

## 7 · THE FLOOR

```
tsc --noEmit                    CLEAN
b57_contracts_wiring_bench      26/26   NEW, five mutations both ways
b40 · b42 · b05_f0589           GREEN
tools/bs_audit.mjs              RED · 2 — IDENTICAL at base
tools/wl_audit.mjs              RED · exit only — IDENTICAL at base
DELTA                           ZERO, both parts
```

**`next build` is OWED on the founder's machine.** This container cannot reach
`fonts.googleapis.com`; four `next/font` fetches fail and **not one application error is
reported**. Part 1's build was green on his machine and this seat does not claim part 2's.

**LIVE WITNESS: OWED, on every byte of this arc.** `/sign/[token]` exists as a route. That
is a different claim from a couple having signed anything.

---

## 8 · THE CARD, WHICH CAN NOW RUN

In the charter's order, each SELECT its own paste block (R-40.31), and
`CONTRACT_SIGN_SEND_ENABLED=1` for the walk and **unset after**:

1. DEV440 → Contracts & deposits → `+` → **Fill the standard agreement** → Priya Nair
2. the record opens; the blanks show the row's values; deposit reads **30%**
3. fill the second partner, venue, city, fee `60000`; **Save and finish later**
4. **Preview the PDF** → v3 filled, four pages, clause 3's table one row per function
5. **Send to the couple** → the link is copied; paste it
6. as the couple → `/sign/<token>` → the document → **I agree**
7. the code reaches `+919625759924` → enter it
8. `SELECT state, signed_at FROM contracts WHERE id = '<id>';` → `signed`
9. `SELECT signer_phone, verified_at, document_sha256, sealed_path FROM contract_signatures WHERE contract_id = '<id>';`
10. the sealed PDF's printed digest matches column 3
11. the record reads **Awaiting Rs 18,000** → **Mark the deposit received**
12. `SELECT deposit_pct, deposit_received_at FROM contracts WHERE id = '<id>';`

**Step 2's `Rs 18,000` only appears once a fee exists** — the deposit is a percentage of a
fee, and a contract composed before an invoice has the percentage and not the amount. That
is the one thing on this card that will look wrong and is not.
