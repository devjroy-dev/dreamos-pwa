// lib/worklist/ownNumber.ts — CE-42 · SHELL · R-42.12 AMENDED.
// EVERY NEW VENDOR-FACING BYTE ON `/vendor/number`, ONE HOME.
//
// Founder-vetoed 2026-09-10, `docs/mocks/SHELL_VETO_SHEET.md` rows N1-N4, frames
// `docs/mocks/shell-screens-mock.html` N1/N2. N1 is the vetoed ALTERNATIVE, not
// the first draft. `b73` pins every string here against the sheet, both ways.
//
// ⚠ THE CTA IS NOT HERE. N5 ruled (a): the button reads `BUTTONS.connect`
// (`lib/solutions/copy.ts`, spec §9) — a byte the founder already approved, so
// this screen authors none. The title is `roomLabel('number')`; the tap byte is
// `COPY.launchingSoon`.
//
// ⚠ NO PERSONA NAME, AND THIS IS THE SCREEN THAT WOULD HAVE HAD ONE. R9 is the
// assistant answering on her own number; the product chrome says what happens
// ("answered in your voice") and never who does it. `b40` C32 walks the shell
// tree for the names and `b73` asserts this file separately.
//
// This file is R9's room's home when it lands (roadmap row J, G6).

export const NUMBER = {
  /** N1 · the lede — the vetoed alternative. U+2019 in `you’re` (R-40.57). */
  lede: 'Enquiries come to your own WhatsApp number, answered even when you\u2019re busy.',
  /** N2-N4 · what she will be able to do: 7c routing, the assistant, K-1 F3. */
  can: [
    'Put your own number on your page instead of ours.',
    'Have enquiries answered in your voice while you work.',
    'Turn a missed call into a WhatsApp reply.',
  ],
} as const;
