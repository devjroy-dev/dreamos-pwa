// lib/public/signCopy.ts
// BLOCK 19 · G3.2 — EVERY BYTE THE SIGN LEAF SPEAKS. ONE HOME.
//
// ═══════════════════════════════════════════════════════════════════════════
// NOTHING BELOW IS AUTHORED HERE. EVERY BYTE IS TRANSCRIBED.
// ═══════════════════════════════════════════════════════════════════════════
// Source: `docs/mocks/contracts-mock.html`, frames `S3-sign-read`, `S3-sign-code`
// and `S3-sign-done`, ratified by the chair on 2026-09-06 under the founder's
// standing delegation (R-40.42) as rows 56–64 of the seventy-two on
// `docs/mocks/G32_VETO_SHEET.md`. Row 64 carries the chair's own rewording.
// A string not in that file is a BOUNCE, not a judgement call.
//
// ⚠ THE APOSTROPHES ARE TYPOGRAPHIC (U+2019), NOT ASCII — R-40.19. The credits
// leaf's first cut copied a COMMENT that spelled one with an ascii quote instead
// of the JSX it actually rendered, and a reused byte that differs by one
// character is a re-authoring nobody vetoed.
//
// ⚠ THE SET IS CLOSED AT NINE AND THERE IS NO TENTH. `consentCopy.ts` states
// this law for its own six and this file inherits it: a byte this build
// discovers it needs is a RAISED FORK, not an authored string.
//
// ⚠ THE DEAD-TOKEN SENTENCE IS DELIBERATELY NOT HERE. It belongs to every
// capability leaf, not to this one, and its home is `lib/public/token.ts`
// (F-40.40). A copy here would be the fourth occurrence of the byte that hoist
// exists to end.
//
// ⚠ NO PERSONA NAME APPEARS HERE. Victor, Mira and Eliza are never in product
// chrome, and this page speaks as the estate, not as anyone.

export const SIGN_COPY = {
  /**
   * Row 56 · the head. The vendor's REGISTERED business name is interpolated,
   * never a persona and never "your photographer" — she knows who sent it and
   * the document she is about to read names the same party in clause 1.
   *
   * A null owner is not possible on a live token (the door reads the vendor row
   * beside the contract) but the type admits it, so the fallback says what is
   * true rather than printing the word "null" at someone.
   */
  head: (owner: string | null) =>
    owner ? `${owner} has sent you an agreement.` : 'You have an agreement to read and sign.',

  /** Row 57 · the lead. It names the second control on the page before she
   *  reaches it, because a document she cannot keep is a document she will not
   *  agree to on a phone. */
  lead: 'Read it before you agree. You can save a copy at any time.',

  /** Row 58 · the quiet control, on every state of the leaf. */
  save: 'Save a copy',

  /**
   * Row 59 · THE AFFIRMATIVE, AND IT IS v3's OWN WORDS.
   *
   * ⚠ THIS BYTE IS NOT THE MOCK'S TO CHANGE AND NOT THE FOUNDER'S EITHER.
   * Clause 12 says, in bytes the lawyer approved and R-40.46 sealed: *you enter
   * it and tap "I agree". That is your signature.* If this button said anything
   * else, the instrument's own sentence would describe a product that does not
   * exist — the identical failure the field register names for clause 8, where a
   * composer that flipped a consent flag on signature would make the clause
   * false. The frozen document constrains the surface, not the reverse.
   */
  agree: 'I agree',

  /** Row 60 · the head, after she agrees and the code is on its way. */
  codeHead: 'We\u2019ve sent a code to your WhatsApp.',

  /** Row 61 · the field's own label. */
  codeAsk: 'Enter the code',

  /**
   * Row 62 · THE ONLY FAILURE THIS LEAF DISTINGUISHES, and it distinguishes it
   * from nothing else.
   *
   * A dead token, a spent one, an expired one and one that never existed all
   * read identically — `token.ts`'s constitution, enforced by the door returning
   * one 404 for all four. A WRONG CODE is different in kind: she holds a LIVE
   * token and has simply mistyped, and telling her so tells a prober nothing he
   * did not already know by having a code prompt in front of him.
   */
  codeFailed: 'That code didn\u2019t match. Try again.',

  /**
   * Row 63 · terminal, and it is a full stop.
   *
   * ⚠ THIS LEAF DOES NOT REVERSE, AND `/consent/` DOES. That page's header says
   * a couple who can say yes and never no has been given a trapdoor — which is
   * right about a publication switch and wrong about a signature. Clause 5 is
   * how an agreement is undone: in writing, with a slab. A button here that
   * un-signed it would be this product inventing a remedy the instrument does
   * not have.
   */
  done: 'Agreed.',

  /**
   * Row 64 · THE CHAIR'S REWORDING, 2026-09-06.
   *
   * The proposed byte read `Your signed copy is on its way to your WhatsApp.`
   * and PROMISED A SEND THIS SITTING DOES NOT BUILD — that would be a ninth
   * template and its own veto pass. She already has `Save a copy` on this same
   * leaf, so the sentence now points at the control in front of her rather than
   * at a message that is not coming. If the founder wants the sealed copy
   * texted, it is a filed item for sitting 2 and not a byte tonight.
   */
  doneLead: 'Your signed copy is ready to save below.',
} as const;
