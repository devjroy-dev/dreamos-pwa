// lib/worklist/weddingPages.ts
// BLOCK 19 · G1.1 — EVERY WEDDING-PAGES STRING, ONE HOME.
//
// ═══════════════════════════════════════════════════════════════════════════
// NOTHING BELOW IS AUTHORED. EVERY BYTE IS TRANSCRIBED.
// ═══════════════════════════════════════════════════════════════════════════
// Source: `docs/mocks/wedding-pages-mock.html` @ `ae30180`, frames W2-room,
// W2-empty, W3-create and W3-credits — ratified by the founder 2026-09-04
// (R-40.18, R-40.24), with R-40.19's typographic apostrophes applied across the
// set. A string not in that file is a BOUNCE, not a judgement call.
//
// ⚠ TWO STRINGS ARE DRAWN NOWHERE AND ARE STILL RATIFIED. `#24 Publish this
// page` and `#25 Waiting on the couple's permission.` exist only in W3-credits'
// CAPTION, because the s-G11.2 correction removed the publish control from the
// frame on purpose: it had been drawn as a live accent button directly above the
// waiting line, which is a refusal wearing a control's clothes. The bytes are in
// the mock file; no frame pictures them; both ship here.
//
// ⚠ THE APOSTROPHES ARE TYPOGRAPHIC (U+2019), NOT ASCII. R-40.19 swept the
// ratified set and the mock carries zero straight apostrophes in a product
// string. e-6 in this sitting was exactly this class caught one character wide:
// a byte reused from a comment rather than from what a surface renders. `b41`
// pins these against the mock rather than against this file's own word.
//
// ⚠ NO PERSONA NAME APPEARS HERE and no money register is needed — nothing on
// this room is money, which is also why the room borrows no `.wl-rfig`.

export const WP = {
  // ── W2-room / W2-empty ───────────────────────────────────────────────────
  roomTitle:         'Wedding pages',
  sectionPublished:  'Published',
  sectionDraft:      'Draft',
  stateNotPublished: 'Not published',
  /** The vendor has published AND the couple has consented — a guest can open it. */
  stateLive:         'Published',
  /** Published by her, waiting on the couple. The row must not read `Published`
   *  when a guest opening the link would find nothing (R-G11.10). */
  stateWaiting:      'Waiting',
  emptyHead:         'No wedding pages yet.',
  emptyBody:         'Publish a wedding and everyone who worked it gets credited.',
  fabLabel:          'New wedding page',

  // ── W3-create ────────────────────────────────────────────────────────────
  createTitle:       'New wedding page',
  fieldEvent:        'Which event',
  fieldTitle:        'Title',
  /** The address is DERIVED by the door from the title. The slug rule has ONE
   *  home (dream-os `slugify`), so this sheet cannot compute it — and before the
   *  row exists there is nothing truthful to put in the field. It renders EMPTY.
   *  A placeholder like 「Created from the title」 was written and then removed:
   *  it is not in the ratified mock, and a string not in the mock is a BOUNCE. */
  fieldAddress:      'Page address',
  fieldVenue:        'Venue',
  fieldCity:         'City',
  save:              'Save',

  // ── W3-credits ───────────────────────────────────────────────────────────
  creditsTitle:      'Who worked this wedding',
  fieldRole:         'Role',
  fieldHandleOrNumber: 'Their handle or number',
  fieldName:         'Name',
  add:               'Add',
  /** #21 · #22 · #23. `Claimed` is R-40.18 as amended (F-40.23 disposed of the
   *  proposed `On the page`); it is true on a draft and after publication alike. */
  stateInvited:      'Invited',
  stateClaimed:      'Claimed',
  stateDeclined:     'Declined',
  /** #26, #25, #24 — the three foot states. */
  pageIsLive:        'This page is live.',
  waitingOnCouple:   'Waiting on the couple\u2019s permission.',
  publish:           'Publish this page',

} as const;

/**
 * R-40.7's TEN, IN R-40.7's ORDER — the picker's options.
 *
 * ⚠ THIS IS A MIRROR AND IT IS DECLARED AS ONE. The AUTHORITY is
 * `wedding_credits_role_check` in `db/migrations/0131_wedding_pages.sql`, which
 * `src/lib/vendor/weddings.js` reads as its own witness and `b53` asserts
 * against. This lane cannot import a Node module, so the ten are transcribed —
 * and `b41` asserts this array equals the dream-os home key-for-key and
 * label-for-label, so the mirror cannot drift in silence. A mirror nobody
 * checks is a second home; a mirror a bench pins is one home with two readers.
 *
 * The order is never re-sorted for display: it is the roll's ruled order and the
 * picker shows it the same way the page prints it.
 */
export const ROLE_OPTIONS: readonly { key: string; label: string }[] = [
  { key: 'shot_by',   label: 'Shot by'   },
  { key: 'makeup',    label: 'Makeup'    },
  { key: 'hair',      label: 'Hair'      },
  { key: 'decor',     label: 'D\u00e9cor' },
  { key: 'mehendi',   label: 'Mehendi'   },
  { key: 'planner',   label: 'Planner'   },
  { key: 'styled_by', label: 'Styled by' },
  { key: 'wearing',   label: 'Wearing'   },
  { key: 'model',     label: 'Model'     },
  { key: 'venue',     label: 'Venue'     },
] as const;
