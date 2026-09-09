# CE-41 · SEAT E → CHAIR · THE FOUNDER'S WALK, 2026-09-09, SECOND PASS

**Walked at `dreamos-pwa` `d4503113b0af4d54b8d94da1ad098df33beab9b9` (R-41.129 sealed), at 374. Two findings. One is mine; the other is not, and is filed rather than touched.**

Files in this folder:
- `walk-assistance-forward-374.png` — the founder's capture: the Assistance forward sheet, with the network panel open
- `favicon-at-16.png` — three candidates at true 16px and magnified 7× (this seat's derivation, not a capture)
- `WALK_RELAY.md`, `walk-landing-374.png`, `walk-vendor-support-374.png`, `lockup-at-374.png` — the first pass, already on the tree

---

## F-C · THE FAVICON IS THE WHOLE MONOGRAM WITH NO MARGIN, AND 16px CANNOT HOLD IT

**Founder's words:** *"look at the icon on the tab of chrome. it looks hideous."*

He is right, and it is the same error as F-A one size down. Derived by command from the shipped files:

| file | ink box | ink width | ink height |
|---|---|---|---|
| `favicon-16.png` | 0,5 → 15,11 | **16px — the full tile** | **7px** |
| `favicon-32.png` | 0,9 → 31,22 | 32px — the full tile | 14px |
| `favicon-64.png` | 0,19 → 63,44 | 64px — the full tile | 26px |

Two facts, and either alone would be enough:

1. **There is no margin at all.** The ink box spans column 0 to the last column in every size. A tab favicon is drawn inside rounded chrome with the neighbouring tab a few pixels away, so a mark that touches its own tile edges reads as a smear rather than an object. Every other icon in the family has breathing room; these three do not.
2. **Three italic serif letters do not fit in 16px.** `TDW` across 16 pixels is about five pixels per letterform, and the letterforms are Cormorant italic — thin strokes, high contrast, a serif that needs at least two pixels to exist. At 7px tall the crossbar of the T and the bowl of the D fall below one pixel and antialias into the ground. That is the mush in the tab.

`favicon-at-16.png` shows three options at true size with a 7× blow-up above each:

| | what it is | reads at 16px |
|---|---|---|
| **as shipped** | the monogram edge to edge | no — a gold smudge |
| **monogram with a 14% margin** | same mark, breathing room | worse — the margin buys air by making the letters smaller still |
| **one glyph with a margin** | the first letter alone, centred | **yes** — a single letterform gets ~12px and survives |

**The derivation says the same thing F-A did: a three-part mark cannot be a small mark.** The lockup failed at 158px wide; the monogram fails at 16px square. The cure is the same shape — a smaller unit of the same identity — and it is a brand cut, not a code change. **`public/brand/` has no single-glyph or seal file**, so this seat cannot cut it.

**What this seat proposes, for the chair to rule and the founder to draw:**

- A **seal or single-glyph favicon** at 16, 32 and 64, on Graphite, with a real margin (the family's other icons carry roughly 12–15%). Whether that glyph is a `D`, a monogram-in-a-circle, or something else is the founder's, not mine.
- Until it exists, **leave the shipped favicons in place.** They are ugly and they are not wrong: they point at the family, `ce41_brand_family` is 19/0, and swapping them for a different bad option costs a deploy and buys nothing. A tab icon is not a defect that blocks anything.

**No cell would have caught this.** `ce41_brand_family` asserts the wiring — one home, every path on disk, no stray icons — and the wiring is correct. Whether a mark survives 16 pixels is a walk question, and R-39.15 is why the founder saw it and the bench did not. Not filed as a gap in the cell: a cell that judged legibility would be a cell asserting taste.

---

## F-D · THE ASSISTANCE FORWARD RETURNED `no_consent_record` — NOT THIS SEAT'S, FILED

In the same capture, the network panel shows two red `forward` calls with:

```
{ "ok": false, "code": "no_consent_record",
  "error": "No consent record for this number. Ask her in the D…" }
```

The founder was forwarding to someone not on TDW — Instagram handle `@_devroy__`, number `9625759924` (the test couple's fixture), name `test final`. The sheet's own copy promises *"They get one message to join. Her number stays with us until they do."* and the door refused on a consent record that does not exist for that number.

**This seat states what it can see and nothing more.** It did not run the door, has not read the handler, and the handler is in `dream-os`, which this seat reads and never touches. What is visible: the refusal is *structured* (`ok:false` with a code), so it is the door's own guard rather than a crash, and the glass did not surface it — the sheet in the capture shows no refusal text, so from the founder's side the Forward button simply did nothing.

**That second half may be this seat's.** If the door returns a coded refusal and the room draws nothing, the missing refusal line is a cockpit surface question and lands in this seat's radius. The frames ratified in E1 have a refusal shape for exactly this case (§B #13, `--role-critical` edge and ink, one sentence). Whether the room already has one and it failed to render, or has none for this code, needs a read of `app/admin/assistance/page.tsx` at the tip — **which this seat has not done and will not do until the chair rules it in**, because Assistance is seat A's room and (iv-b) has not opened.

Routed to the chair to place. If the glass half comes back to this seat, it is one rider with the door's codes mapped to the room's refusal line.

---

**Derived at `d4503113`, 2026-09-09. STOP — F-C is the founder's brand cut and the chair's ruling; F-D is routed.**
