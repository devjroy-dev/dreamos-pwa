// lib/frost/coupleSwitch.ts
// THE ONE HOME for every byte the couple's publish switch speaks.
//
// TDW_19 · BLOCK 19 · G1.1c — the pwa half, under R-40.30 (the five strings),
// R-G11c.8 (always operable) and R-G11c.10 (the door answers page existence).
//
// ── WHY THIS FILE EXISTS ───────────────────────────────────────────────────
// `eventCopy.ts` one file over states the pattern and the reason: one home per
// SUBJECT, not one home per feature area. `SettingsRoom` has never had a copy
// home — every string it renders today is an inline literal — so the switch's
// bytes get the first one rather than being scattered into the room beside
// them. `FROST_COPY` in `tokens.ts` was refused as the home: its only readers
// are `sanctuary/page.tsx` and `tokens.ts` itself, and it carries a live
// retirement finding (F-38.32) at `dreamCanvas`.
//
// ── THE BYTES ARE THE FOUNDER'S AND THEY ARE FROZEN AT THE CHARACTER ───────
// APPROVED-COPY-CARRIES-ITS-HASH. R-40.30, founder-vetoed 2026-09-05, drawn
// from the ratified mock `docs/mocks/couple-switch-mock.html @ acb68f9` — the
// frames, not a memory of them. String 3 carries the founder's own edit: CAN,
// not "may". An edited comma is a fresh veto.
//
// The sha256 beside each string is of THAT EXACT STRING, and
// `scripts/g11c_couple_switch.proof.mjs` §1 recomputes every one of them. A
// value that disagrees is the finding, never the fix.
//
// ── THE SET IS CLOSED. FIVE, AND THERE IS NO SIXTH ────────────────────────
// The mock's own header rules it: there is NO section header above the switch,
// "because a header would be a byte nobody vetoed". There is no ON/OFF word
// beside the track, no helper line, no toast, no error sentence of this
// subject's own. A sixth string this build discovers it needs is a RAISED
// FORK, not an authored string — that is `envelopeCopy.ts`'s law and this file
// inherits it. The absence of a header is ASSERTED, not merely observed.
//
// ── THE TWO SUB-LINES ARE CHOSEN BY PAGE EXISTENCE, NEVER BY THE SWITCH ────
// Derived from the mock's four frames and then ruled: C1 (off) and C2 (on)
// both draw SUB_HAS_PAGE; C3 (off) and C4 (on) both draw SUB_NO_PAGE. The
// discriminator is `has_wedding_page` off the door (R-G11c.10), never
// `publish_weddings`. Keying the sub-line to the switch's own state would make
// the room say "any published page disappears" to a couple who has no page and
// "no page has been made for you yet" to a couple looking at hers — and it is
// the single easiest mistake to make here, so the bench mutates for it.

/** String 1 · the row label. */
// sha256 b7d99620ab51c35cbb15b543d96db59c8ba68292e62245e5b18ee2cc3eec21e5 (19 bytes)
export const SWITCH_LABEL = 'Publish our wedding';

/** String 2 · the row value when her standing answer is NO. */
// sha256 394acb86efdb85274d27b08ba0321b2b057c79773576985e66a07529ce5f2ea4 (42 bytes)
export const SWITCH_VALUE_OFF = 'Off. Nothing of your wedding is published.';

/** String 3 · the row value when her standing answer is YES. The founder's own
 *  edit lives here — "can", never "may". The vendor still holds the other half
 *  of the gate, which is why this says what her vendors CAN do and not what
 *  will happen. */
// sha256 2956872787422ace2df42d21f5726b80b75336dc6f7b4362816f87c4281682d2 (47 bytes)
export const SWITCH_VALUE_ON = 'On. Your vendors can publish your wedding page.';

/** String 4 · the sub-line when a wedding page carrying her couple_id EXISTS. */
// sha256 07661a36d58496475dd3bb6938db2278012bcee6d03c6bbc664cbb4c6a61c9e9 (48 bytes)
export const SWITCH_SUB_HAS_PAGE = 'Turn this off and any published page disappears.';

/** String 5 · the sub-line when NO wedding page carries her couple_id. Its
 *  promise — "your answer here applies the moment one is" — is literally what
 *  the code does: `couples.publish_weddings` holds her answer with no page in
 *  existence, and `createWedding` seeds `couple_consent` off that row at the
 *  moment it resolves her. It is not a consolation for a control that cannot
 *  hold its state; the control holds it. */
// sha256 3fc015868a46d2c719cb6e886dd11a10d6c31b459851accf35d838a631e2cbfd (86 bytes)
export const SWITCH_SUB_NO_PAGE =
  'No wedding page has been made for you yet. Your answer here applies the moment one is.';
