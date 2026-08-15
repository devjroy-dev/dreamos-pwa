// lib/frost/eventCopy.ts
// THE ONE HOME for every byte the Events bloom's write affordances speak.
//
// TDW_15 · P1 · P1.3, under CE-34's copy ruling and the founder's veto of
// 2026-08-15 (「 all approved except ask dreamai. change it to ask Mira 」).
//
// ── WHY THIS FILE EXISTS ───────────────────────────────────────────────────
// `assignCopy.ts` one directory over states the pattern and the reason: the
// copy is the part that must not fork. This file is its sibling for a
// different subject — assignCopy owns delegation bytes across TWO surfaces,
// this owns the bride's own write vocabulary on ONE. Two files, not one,
// because assignCopy's header names its subject in its first line and a
// create-sheet byte living in a file about delegation is a byte nobody finds.
// One home per SUBJECT, not one home per feature area.
//
// ── THE BYTES ARE THE FOUNDER'S AND THEY ARE FROZEN AT THE CHARACTER ───────
// APPROVED-COPY-CARRIES-ITS-HASH. Nothing below is edited, softened or
// re-punctuated without a new veto. `scripts/tdw15_p1_events.proof.mjs` §1
// asserts each one character for character and reds on a single character's
// drift; its mutation leg proves that is not decorative.
//
// ── TWO EXPECTED-ZEROS, RATIFIED, AND THEY ARE RULINGS NOT OVERSIGHTS ──────
//
//   ⓵ THE DONE CONTROL CARRIES NO LABEL. Chair-struck at CE-34 (veto line 11):
//     the control is a circle that fills. The member's side has spoken this
//     verb without a word since D-4b (`app/coplanner/page.tsx:363` — an 18px
//     ring, gold when done), and a second vocabulary for one verb is the
//     disease `assignCopy` Ⓖ already named. There is deliberately no
//     EVENT_DONE constant and its absence is asserted.
//
//   ⓶ THE DONE SECTION NEVER ANNOUNCES ITS OWN EMPTINESS. Chair-struck at
//     CE-34 (veto line 12): `EVENT_DONE_HEAD` renders only over a non-empty
//     section. This is Ⓕ's shape, and Fixture 1 is why it was ruled rather
//     than assumed — the canonical bride stands at `done = 0`, so an
//     unconditional head would have shipped a heading over nothing on day one.
//
// ── TWO BYTES BELOW ARE NOT ON THE VETOED SHEET, AND THAT IS DISCLOSED ─────
// `EVENT_EDIT` and `EVENT_REMOVE` are the row's two affordance labels. The
// veto sheet carried the confirm QUESTION and the toast but not the words on
// the controls that raise them — an omission in the sheet's authoring, owned
// in this delivery's handover rather than papered over. They are the plainest
// available and they are one constant each, so a founder change is one line.
export const EVENT_ADD          = 'Add a day';
export const EVENT_ASK_TITLE    = 'What is it?';
export const EVENT_ASK_WHEN     = 'When?';
export const EVENT_ASK_NOTES    = 'Anything to remember?';
export const EVENT_SAVE         = 'Save';
export const EVENT_CANCEL       = 'Cancel';
export const EVENT_ADDED        = 'Added.';
export const EVENT_UPDATED      = 'Updated.';
export const EVENT_NEEDS_TITLE  = 'Give it a name.';
export const EVENT_SAVE_FAILED  = 'Could not save. Try again.';
export const EVENT_REMOVE_ASK   = 'Remove this day?';
export const EVENT_REMOVED      = 'Removed.';
export const EVENT_DONE_HEAD    = 'Done';
export const EVENT_EMPTY        = 'Your first day starts here.';

/** NOT ON THE VETOED SHEET — see the disclosure above. */
export const EVENT_EDIT         = 'Edit';
/** NOT ON THE VETOED SHEET — see the disclosure above. One constant, two
 *  sites: the row's affordance and the confirm sheet's action. */
export const EVENT_REMOVE       = 'Remove';

// ── THE KIND VOCABULARY, AND WHY IT IS PINNED TO THE SERVER'S OWN LIST ─────
// `src/api/couple/events.js` carries this exact twelve in TWO allowlists, and
// the two doors DISAGREE about what happens to a thirteenth: POST silently
// rewrites an unrecognised kind to 'other' (:63) while PATCH refuses it 400
// (:126). That divergence is F-15.5, filed at CE-34 and NOT this delivery's to
// cure — so the sheet's only defence is to never send a kind the server does
// not know. This list is that defence, and a bench cell pins it against the
// sibling repo's own allowlist so the two cannot drift apart in silence.
//
// The values are the wire; the labels are hers. `mua` is the wire's word for a
// thing no bride says aloud, and the display column exists for exactly that.
export const EVENT_KINDS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'shoot',    label: 'Shoot'    },
  { value: 'fitting',  label: 'Fitting'  },
  { value: 'trial',    label: 'Trial'    },
  { value: 'meeting',  label: 'Meeting'  },
  { value: 'recce',    label: 'Venue visit' },
  { value: 'call',     label: 'Call'     },
  { value: 'family',   label: 'Family'   },
  { value: 'social',   label: 'Social'   },
  { value: 'task',     label: 'To do'    },
  { value: 'reminder', label: 'Reminder' },
  { value: 'other',    label: 'Something else' },
];
