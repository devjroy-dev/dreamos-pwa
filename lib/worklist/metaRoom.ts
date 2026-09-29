// lib/worklist/metaRoom.ts · CE-45 · IGD-1 · CUT 1 · R-45.27, THE ROOM "WhatsApp and Instagram".
// EVERY NEW VENDOR-FACING BYTE IN THE ROOM THAT IS NOT G6's, ONE HOME. The founder's table, 25 Sept 2026 ("ok"):
// C1 to C9 and C13 (the Instagram section), A5 (the two section headings), QT1 and QT2 (the quiet time).
// The room's own name and its hub line live in lib/solutions/copy.ts (A1, A3); G6's words stay in ownNumber.ts and
// ownNumberFlow.ts, untouched.
//
// HASH-CARRIED REUSE. C3 and C4 are the portfolio's H4 and H2 (app/vendor/(shell)/portfolio/screen.tsx :137, :131),
// carried here byte for byte because a copy home must not import a page module; b126 pins each against its source.
// NOTE FOR THE FOUNDER'S TABLE: C4 (H2 as it stands) carries an em dash; it is carried as ruled, and named in the handover.
//
// NO PERSONA NAME (R-37.70; b40 C32): the chrome says what happens, never who does it. No brand mark is drawn in this cut
// (the founder, 25 Sept 2026: the official marks ride a later cut).

export const SECTIONS = {
  /** A5 · the first section, G6's screen beneath it. */
  number: 'Your own number',
  /** C1 · the second section. */
  instagram: 'Instagram messages',
} as const;

export const IG = {
  /** C2 · the line when she has not connected, or has connected and not turned it on. */
  lede: 'Let us answer couples who message your Instagram, in your studio\u2019s name, the same way we do on WhatsApp.',
  /** C3 · REUSE H4. */
  connect: 'Connect Instagram',
  /** C4 · REUSE H2 (carried as ruled; see the note above). */
  professional: 'Instagram only allows this for professional accounts \u2014 business or creator. If yours is personal, switching is free and takes a minute in Instagram\u2019s own settings.',
  /** C5 · the consent statement. */
  consent: 'When a couple messages your Instagram, we reply in your studio\u2019s name within minutes: we answer her question, check your date the way your date check does, take her details, and add her to your leads. We never confirm a booking or quote a price you have not set. You can switch this off at any time.',
  /** C6 · the consent's two controls. */
  turnOn: 'Turn on',
  notNow: 'Not now',
  /** C7 · answering. */
  on: 'On. Couples who message your Instagram get a reply in your studio\u2019s name.',
  /** C8 · paused; the line IS the tap (R-43.16), so no second word is needed. */
  paused: 'Paused. Your Instagram connection needs renewing.',
  /** C9 · switched on, waiting on Meta. */
  waiting: 'Ready. This switches on for you as soon as Instagram approves it.',
  /** C13 · the control when it is on or waiting. */
  turnOff: 'Turn off',
} as const;

export const QUIET = {
  /** QT1 · the line; the chosen length follows it. */
  line: 'After you reply to a couple yourself, we stay quiet with her for',
  /** QT2 · the four lengths, 2 hours preselected (the server's default, 120). */
  options: [
    { minutes: 60, label: '1 hour' },
    { minutes: 120, label: '2 hours' },
    { minutes: 240, label: '4 hours' },
    { minutes: 480, label: '8 hours' },
  ],
  defaultMinutes: 120,
} as const;
