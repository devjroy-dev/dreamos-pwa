// lib/public/consentCopy.ts
// BLOCK 19 · G1.2 — EVERY BYTE THE CONSENT LEAF SPEAKS. ONE HOME.
//
// ═══════════════════════════════════════════════════════════════════════════
// NOTHING BELOW IS AUTHORED HERE. EVERY BYTE IS TRANSCRIBED.
// ═══════════════════════════════════════════════════════════════════════════
// Source: `docs/mocks/wedding-guests-mock.html` @ `6eea5bf`, frames G3-consent
// and G3-terminal, ratified by the founder 2026-09-05 as strings 19-25 of the
// thirty on the G1.2 veto table — his word was `veto all approved as proposed`.
// A string not in that file is a BOUNCE, not a judgement call.
//
// ⚠ THE APOSTROPHES ARE TYPOGRAPHIC (U+2019), NOT ASCII — R-40.19.
//
// ⚠ THE SET IS CLOSED AT SIX AND THERE IS NO SEVENTH.
// `coupleSwitch.ts` states this law for its own five and this file inherits it:
// a byte this build discovers it needs is a RAISED FORK, not an authored string.
// The dead-token sentence is deliberately NOT here — it belongs to every
// capability leaf, not to this one, and its home is `lib/public/token.ts`
// (F-40.40). Putting a copy here would be the fourth occurrence of the byte
// that hoist exists to end.
//
// ⚠ NO PERSONA NAME APPEARS HERE. Victor, Mira and Eliza are never in product
// chrome, and this page speaks as the estate, not as anyone.

export const CONSENT_COPY = {
  /** String 19 · the head. */
  head: 'Your wedding page',

  /**
   * String 20 · the lead. The vendor's REGISTERED business name is interpolated,
   * never a name she typed — the same rule the credit roll follows, so a hurried
   * entry cannot mislabel another business (F-40.54's own lesson).
   *
   * The fallback is deliberate and it is not a placeholder: if the owner's name
   * cannot be resolved the sentence still has to make sense to a stranger, and
   * "Your photographer" is true of every case this page can reach.
   */
  lead: (owner: string | null) =>
    `${owner || 'Your photographer'} has made a page for your wedding, with everyone who worked it credited. Nothing is published until you say yes.`,

  /** String 21 · the affirmative. One gold on this page, spent here. */
  publish: 'Publish our wedding',

  /**
   * String 22 · the refusal. `Not now` and not `No thanks`, because this decision
   * is reversible by the same token and the copy must not imply otherwise.
   */
  notNow: 'Not now',

  /** String 23 · after a yes. */
  stateLive: 'Your wedding page is live.',

  /**
   * String 24 · the withdrawal, which exists because consent that cannot be
   * withdrawn is not consent. Terracotta, like every refusal in this lane.
   */
  takeDown: 'Take it down',

  /**
   * String 25 · the failure line — R-40.29's byte, reused from
   * `lib/public/copy.ts` rather than re-authored, because it is the same
   * sentence for the same reason on the sibling leaf. Imported at the call site
   * would be tidier still; it is spelled here so this file is the ONE place a
   * reader looks for what this page can say, and `b42` pins the two equal.
   */
  failed: 'That didn\u2019t go through. Try again in a moment.',
} as const;
