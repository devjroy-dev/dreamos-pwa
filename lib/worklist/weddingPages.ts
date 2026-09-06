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
  // ── G1.3 · THE RECORD'S TWO NEW CONTROLS ──────────────────────────────────
  // Answered rows on `docs/mocks/G13_VETO_SHEET.md` (25-34), drawn in
  // `wedding-team-mock.html` frames T5, T6-reel-off and T7-reel-ready.
  /** row 25 */ cardsLabel:  'Printed cards',
  /** row 26 */ cardsNote:   'A tent card for the tables and a thank-you insert, both carrying this page\u2019s code.',
  /** row 27 */ cardsMake:   'Make the cards',
  /** row 28 */ cardsTent:   'Tent card',
  /** row 28 */ cardsInsert: 'Insert',
  /** row 29 · AMENDED by the chair from `The cards didn't make. Try again.` */
  cardsFailed: 'The cards couldn\u2019t be made. Try again.',
  /** row 30 */ reelLabel:   'Reel',
  /** row 31 */ reelNote:    'A fifteen-second cut of this gallery, ready to post.',
  /**
   * row 32 · ⚠ THE REFUSED BYTE. `Not available yet` on a DISABLED control was
   * proposed and REFUSED by the chair: a disabled control is the greyed-control
   * class this arc refuses, the same refusal the publish control already carries
   * two fields down. When the probe reads not-detected the reel control is
   * ABSENT and `reelProbeOff` stands alone; when it reads ready the control
   * ARRIVES as `reelMake`. PRESENCE IS THE STATE, so a vendor never reads a
   * control and a refusal in one glance. There is deliberately no string here.
   */
  /** row 33 */ reelProbeOff: 'Video tools on this server: not detected.',
  /** row 33 */ reelProbeOn:  'Video tools on this server: ready.',
  /** row 34 */ reelCheck:    'Check again',
  /** row 32 · shown only when the probe says ready (R-40.53) */
  reelMake:     'Make the reel',

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

  // ═══════════════════════════════════════════════════════════════════════════
  // G1.2 — founder-vetoed 2026-09-05 ("veto all approved as proposed"), from
  // `docs/mocks/wedding-guests-mock.html` @ `6eea5bf`, frames G1-upload,
  // G1-manage and G4-create-noevent. Numbers are the veto table's.
  // ═══════════════════════════════════════════════════════════════════════════

  /** 1 · the strip's label. */
  photos:            'Photographs',
  /** 2 · nothing uploaded yet. */
  photosEmpty:       'No photographs yet.',
  /**
   * 3 · in flight. THE NUMBERS ARE LIVE and the first is 1-based: a vendor
   * watching "Adding 0 of 3" would reasonably think nothing had started.
   */
  photosAdding:      (n: number, total: number) => `Adding ${n} of ${total}\u2026`,
  /** 4 · the upload/remove failure. */
  photoFailed:       'That didn\u2019t upload. Try again.',
  /** 5 · the mark on cell one, which is the hero on the public leaf. */
  photoHero:         'Hero',
  /**
   * 6 · the remove control's accessible name. NOT drawn — the control is a
   * `×` glyph, and this is what a screen reader says. It is an accessible name
   * and not product copy, the same class as the sheet's own `Close`.
   */
  photoRemove:       'Remove',

  // ⚠ STRINGS 26 AND 27 ARE WITHHELD, NOT DROPPED — F-40.99. The founder vetoed
  // 「It isn't on my calendar」 and 「Wedding date」, and they will ship the moment
  // the no-event create has somewhere to put a date: `public.weddings` has
  // thirteen columns and none is a date, so R-G12.6 cannot execute as worded.
  // A vetoed byte with no surface is an unused export, and an unused export is
  // dead code the next reader has to account for.

  /**
   * R-G12.8's ratified byte. `truncated` has ridden the events door since
   * TDW_04 B6-S1 and `EventsResponse` has declared it since — the flag existed,
   * the SURFACE didn't (F-40.78). Two sentences: what she is seeing, and that
   * the rest is not lost, only not here.
   */
  pickerTruncated:   'Showing your latest 200 events. Older ones aren\u2019t listed here yet.',

  // ── THE CONSENT ASK  [F-40.49 · F-40.103] ────────────────────────────────
  // The door shipped with no caller and the card asked the founder to use a
  // button that did not exist. These are the bytes that button speaks.
  /** 31 · the field's label. Her number, not the vendor's. */
  consentLabel:      'The couple\u2019s number',
  /** 32 · the action. */
  consentSend:       'Ask the couple',
  /**
   * R-40.48.1 · after a send. THE LAST FOUR AND NOTHING ELSE.
   *
   * ⚠ WHAT THIS REPLACED WAS THE HOLE. It read "Sent. The link is below if you
   * need it again." and the link WAS below — so the vendor held the couple's
   * consent token and could answer as her. The founder found it on glass
   * (F-40.105); master §2.4 is that silence never means yes and NEITHER DOES
   * THE COUNTERPARTY. It arrived as a dark-send fallback and outlived the
   * approval that retired its reason.
   *
   * The digits are hers already — she typed the number. They tell her it went
   * and where, and give her nothing to act on.
   */
  consentSentLine:   (last4: string) => `Sent to \u2022\u2022\u2022\u2022\u2022 ${last4}`,
  /** R-40.48.2 · the resend. It takes no input: the stored number, or nothing. */
  consentResend:     'Send again',
  /**
   * R-40.48.3 · the failure. The dark fallback RETIRED WITH ITS REASON — both
   * templates are Approved Utility, so a send that fails is a failure and says
   * so, rather than offering the link as a workaround.
   */
  consentFailed:     'That didn\u2019t send. Try again.',

  /** 28 · the create sheet's failure line — F-40.56. */
  saveFailed:        'That didn\u2019t save. Try again.',
  /** 29 · adding a credit — F-40.77. */
  addFailed:         'That didn\u2019t add. Try again.',
  /** 30 · publishing — F-40.77. */
  publishFailed:     'That didn\u2019t publish. Try again.',

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
