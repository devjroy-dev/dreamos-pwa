// lib/vendor/roleWords.ts — THE CREW ROLE'S ONE HOME.
//
// ── F-2c.w4 · WHAT WENT WRONG, AND IT DESTROYED A VALUE ─────────────────────
// Witnessed on the founder's walk, 2026-09-02, in three screens:
//   · a member added through the shell rendered as `makeup_artist` — the raw
//     machine token with its underscore, on a vendor-facing row;
//   · Rahul, whose role read `Decor`, opened in the sheet showing `No role` —
//     his value was not in the picker's option list, so the `<select>` fell
//     through to the empty option;
//   · and then the loss itself: Save was pressed and `Decor` became
//     `second_shooter`. NOT a display bug. The column was overwritten.
//
// THE COLUMN IS FREE TEXT. `public.team_members.role` is `text` with NO CHECK,
// and `src/api/vendor/studio/team.js` passes it through its allowlist untouched.
// So nothing below the surface ever agreed on a vocabulary, and two of them grew:
// the /vendor sheet stored TOKENS (`makeup_artist`) and hid them at the row with
// `m.role.replace(/_/g, ' ')`, while free text like `Decor` and `Floral lead`
// arrived by other roads. A column holding both, with nothing able to tell them
// apart, is F-2c.p1's disease — four lists for one vocabulary — in a picker.
//
// ── THE RULE, AND IT IS ONE SENTENCE ───────────────────────────────────────
// WHAT IS STORED IS WHAT IS SHOWN. The option's value IS its label. A role is a
// human word on a human row, and the estate gains no machine vocabulary for a
// column the database never constrained. No migration, no lookup at any future
// reader — the crew page, an export, a WhatsApp line and this row all print the
// same bytes.
//
// ⚠ `roleLabel` IS A LEGACY DECODER, NOT A SECOND VOCABULARY, and the difference
// is the whole reason it is allowed to exist. It reads OLD rows — tokens already
// in the database, and tokens the /vendor sheet keeps writing until Phase 7
// retires it — and turns them into the words they always meant. Nothing calls it
// on the way IN. It is retire-with-the-reader: it lives exactly as long as the
// tree that writes tokens, and it dies with it.
//
// ⚠ AN UNKNOWN VALUE PASSES THROUGH UNCHANGED AND IS OFFERED BACK. That is what
// `Decor` needed and did not get. A picker that silently drops a value it does
// not recognise is a picker that deletes data on the next Save, quietly, under a
// success toast.

/** The offered roles. Value IS label — see the rule above. `''` is 「no role」,
    which is a real answer and not an absence of one. */
export const ROLE_OPTIONS: readonly { v: string; l: string }[] = [
  { v: '',                l: 'No role' },
  { v: 'Second shooter',  l: 'Second shooter' },
  { v: 'Assistant',       l: 'Assistant' },
  { v: 'Editor',          l: 'Editor' },
  { v: 'Runner',          l: 'Runner' },
  { v: 'Videographer',    l: 'Videographer' },
  { v: 'Makeup artist',   l: 'Makeup artist' },
  { v: 'Coordinator',     l: 'Coordinator' },
  { v: 'Other',           l: 'Other' },
] as const;

/** The tokens the /vendor sheet wrote, and the words they meant. READ-ONLY —
    nothing in this repo may write a key of this map into the column. */
const LEGACY_TOKENS: Readonly<Record<string, string>> = {
  second_shooter: 'Second shooter',
  assistant:      'Assistant',
  editor:         'Editor',
  runner:         'Runner',
  videographer:   'Videographer',
  makeup_artist:  'Makeup artist',
  coordinator:    'Coordinator',
  other:          'Other',
};

/** What a stored role SAYS on a surface. A legacy token becomes its word; every
    other value — including free text this estate never offered — is the vendor's
    own and is returned untouched. */
export function roleLabel(raw: string | null | undefined): string {
  if (!raw) return '';
  return LEGACY_TOKENS[raw] ?? raw;
}

/** The options for one member's sheet: the offered set, plus THIS member's own
    value when it is not among them, so opening a member and saving cannot lose
    what was already there. A legacy token is normalised to its word first, so
    saving an untouched sheet upgrades the row instead of re-writing the token. */
export function roleOptionsFor(raw: string | null | undefined): readonly { v: string; l: string }[] {
  const current = roleLabel(raw);
  if (!current || ROLE_OPTIONS.some((o) => o.v === current)) return ROLE_OPTIONS;
  return [...ROLE_OPTIONS, { v: current, l: current }];
}
