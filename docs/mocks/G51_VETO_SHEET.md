# G5.1 · THE OVERFLOW EXCHANGE — COPY INVENTORY & VETO SHEET

**Packet** `docs/mocks/referrals-mock.html` · sha256 `d342658c005b58487e992a6b7999736bf2862a58137a020725592a0f73095593` (RIDER 1; the cut ratified at R-40.42 was `2fb4d0ef…9df5`)
**Frames** R1-record · R1-forwarded · R2-sheet · R2-picker · R2-refused · R3-peer · R4-room · R4-empty · R5-hub — 9 frames, five shapes, 374 and 390 on the five primaries, both modes, **28 shots**.
**Tips** dreamos-pwa `af295a7` (main) · dream-os `d91ec6e` (main), re-derived at the rider's cut. The mock banked at `2bcd2bf` under base `45be1aa`; this rider amends one frame on top of it.
**Authored against** CE-40's ten G5.1 rulings (R-G51.1–.10) and the five findings of the read-first (F-40.84–.88).

**CURRENT is empty on every line below.** This room has no bytes in the tree: `lib/solutions/copy.ts:113`'s row label `Referrals & partners` is the only string that exists today, and this sitting proposes **no change to it**. Everything else here is new and every line is vendor-facing. Silence ships it as authored; strike anything and it is struck.

---

## A · THE LEAD RECORD — the one control, and what it leaves behind

| # | Where | PROPOSED | Why this and not the other thing |
|---|---|---|---|
| A1 | the control, on the record, above `Mark lost` | **`Forward to a peer`** | Not `Refer` — a referral is what the couple did to get here (Victor's own word, `systemPrompt.js:92`) and reusing it makes two acts share one verb. Not `Pass on`, which is what you do to an offer you decline. |
| A2 | detail row on the sender's record, after the act | label **`Forwarded to`** · value `<peer> · <date>` | Reads like the rows around it — `Arrived`, `Wedding date` — because it is the same kind of fact, not an announcement. |
| A3 | detail row on the peer's record | label **`Forwarded by`** · value `<referrer's business name>` | The peer's first question is *who sent me this*, so the name is the value and not a footnote. |
| A4 | the note, beneath A3's value | the vendor's own sentence, no label, gold rule at the left | A label above it (`Their note`) would be a word between her and the sentence. The rule says *someone said this* without spending a byte. |

---

## B · THE FORWARD SHEET

| # | Slot | PROPOSED | Note |
|---|---|---|---|
| B1 | sheet title | **`Forward this enquiry`** | `Enquiry`, not `lead`: `lead` is the estate's word for the row, `enquiry` is the word for the person who wrote in, and this sheet is about handing over a person. |
| B2 | field label | **`Peer`** | |
| B3 | field label | **`Note for them`** | Not `Message` — a message implies it is sent to someone as a message. This lands on a record. |
| B4 | note placeholder | **`Why you're passing it on`** | Not shown in the frames (they draw a filled field); listed so it is vetoed rather than smuggled. |
| B5 | send verb | **`Forward`** | |
| B6 | the standing line under the verb | **`They get it as a new enquiry, with your name and your note. Nothing is sent to the couple.`** | Two sentences doing two jobs: the first is what the peer sees, the second is R-G51.7 said out loud **before** she taps. She will otherwise assume TDW told the couple, and find out it didn't when the couple asks. |
| B7 | picker title | **`Choose a peer`** | |
| B8 | picker footer | **`Peers you've worked with appear here.`** | **RULED (relay 2): no way in from the picker this sitting; peers are added where the roster is written today.** ⚠ **THE SEAT READS ONE AMBIGUITY AND WILL NOT GUESS IT** — the ruling's words were *"the footer is absent"*, which reads either as *the way-in is absent* (this line stands, as A–F were ratified as proposed) or as *the line itself is struck*. The frame still draws it. One word settles it, and it is a second rider either way. |

---

## C · THE REFUSAL — R-G51.2, the sitting's most important sentence

| # | Slot | PROPOSED |
|---|---|---|
| C1 | the refusal, in the sheet | **`They already have this enquiry — the same number is on their leads. Nothing was forwarded.`** |
| C2 | the way out | **`Close`** |

Three deliberate choices, each of which could have gone the other way:

- **It names the reason, not the rule.** Not *"Duplicate lead"* and not *"This forward could not be completed"* — she gets the actual fact, which is that the peer already knows this couple.
- **`Nothing was forwarded` is the whole point.** `createLead` dedupes on `(vendor_id, phone)` at `src/lib/vendor/leads.js:157–164`, and `ENRICH_REFUSED_KEYS` (`:52`) refuses both `source` and `referrer_name` on that path. Without this sentence the vendor taps `Forward`, nothing is inserted, and she believes she handed the work over. That is the false-done house law forbids.
- **It does not apologise and it does not blame her.** No `Sorry`, no `You can't`. She did a reasonable thing and the world was already in that state.

---

## D · THE ROOM

| # | Slot | PROPOSED | Note |
|---|---|---|---|
| D1 | masthead label | **`Referrals & partners`** | **KEPT byte-for-byte** from `lib/solutions/copy.ts:113`. No new hub string is proposed. |
| D2 | the two head figures | **`Sent`** · **`Received`** | R-G51.6: the unit is forwards. Never `weddings` — the plane holds a lead, and a room that says weddings makes a claim its own table cannot answer. Never money. |
| D3 | section label | **`Your peers`** | |
| D4 | per-peer figure | **`2 sent · 1 received`** | Lower case, the row's own rung, one colour for every peer. **No teal on the reciprocal ones** — a colour that marks some peers and not others is a ranking, and master §7 forbids ranking on this surface. |
| D5 | empty head | **`No forwards yet`** | |
| D6 | empty body | **`When you pass an enquiry to a peer, it's counted here — both ways.`** | `Both ways` is the load-bearing phrase. A vendor can picture giving work away; she cannot picture the room being where it comes back, and that is the only reason she'd open it twice. |

**Refused on this room, stated so it is not re-proposed:** no score, no streak, no "you owe her one", no reciprocity nag of any kind. The balance is stated and left alone. The moment it scolds, the balance becomes a debt and the exchange becomes a currency — which is the commission this block exists to refuse, wearing a different coat.

---

## E · THE HUB — no new bytes

**AMENDED BY LABEL · RIDER 1, R-40.40 / F-40.93, founder-ruled on his walk 2026-09-05. The paragraph below replaced one that read "one deletion and no additions". That sentence is now false and is not left standing.**

`R5-hub` proposes **no new byte and one state correction**: the `Referrals & partners` row gains a destination and, with it, the `Open` chip that `SolutionsPieces.tsx:88` renders on *every* row with an `href`. Two rows carry it — Wedding pages and Referrals & partners — and seven still read `Coming`.

**The first cut drew the live row bare, and that was wrong in a way a screenshot could not show.** The reasoning was that a chip saying nothing is chrome. On glass, beside eight `Coming` rows, the one working row was the only thing with nothing on its right and read as a **heading** rather than a door. R-39.15: the walk outranks the frame.

**Nothing here needs a veto and none is asked for.** `Open` is already the founder's byte at `lib/solutions/copy.ts:62`; `.sol-chip--open` is transcribed from `SolutionsPieces.tsx:185`. The first cut's frame drew a state the component cannot produce — `href ? 'open' : 'coming'` has no bare branch — so this is the frame catching up to the code, not new copy.

## F · WHAT IS **NOT** CURED HERE, drawn so the leaving-alone is visible

- **F-40.86 — `Source` renders the bare token.** `R1-record` draws `whatsapp`; `R3-peer` draws `peer_referral`. Both are the raw column value, because `body.tsx:78` renders `l.source ?? '—'` with no label map. Filed to Block 09's Leads pass by ruling; drawn as-is rather than quietly prettified in this sitting's frames.
- **The state vocabulary's eight homes (F-40.87).** `R1-forwarded` draws `State: new` **after** the forward. That is R-G51.3 on glass: the `lead_referrals` row is the record, so `ALLOWED_STATES` never moves and the three engine homes are never approached. W-1 holds without being tested.
- **`peer_referral` is a token, not a copy byte.** It is a stored value with one home beside `createLead`, and it appears in the frames only because `Source` renders raw. If the founder wants the vendor to read something else there, that is F-40.86's cure and it belongs to Block 09, not to a veto on this sheet.
