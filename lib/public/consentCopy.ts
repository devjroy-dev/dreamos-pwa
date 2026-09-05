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

  // ── R-40.48 · THE LAST-FOUR CHECK AND THE DISCLAIMER ──────────────────────
  // Founder-vetoed 2026-09-05, curing F-40.105 — the founder's own find on
  // glass: the vendor was handed this link by design and could answer as the
  // couple. These two bytes are the second half, for a link forwarded on by
  // someone who did receive it.

  /**
   * R-40.48.4 · the check, shown BEFORE the switch. It names the number without
   * printing it: she knows which one, we say nothing a forwarded reader could
   * use. A FRICTION CHECK, NOT AN OTP — nothing is sent and nothing is stored.
   */
  checkAsk: 'Enter the last four digits of the number this link was sent to.',

  /**
   * R-40.48.5 · the disclaimer, BENEATH the switch and not above it. Above, it
   * would read as a warning she must clear before she may answer; beneath, it is
   * what she is agreeing to as she answers.
   *
   * ⚠ THE WORD IS MISREPRESENTATION, NOT PLAGIARISM. The founder said
   * "plagiarism"; the chair corrected it and he took the correction. The act
   * here is answering as someone you are not, which is a different wrong from
   * passing off someone's work as your own — and a disclaimer that names the
   * wrong wrong is one nobody can rely on.
   */
  disclaimer:
    'By continuing you confirm you are the couple named on this page. '
    + 'Answering on someone else\u2019s behalf is a misuse of this link. '
    + 'The Dream Wedding takes privacy and misrepresentation seriously.',

  /**
   * The page's own address, shown after a yes — the founder's ask, 2026-09-05.
   * She has just consented to something being published; she should be able to
   * look at it. Not a secret: once consent is true this URL serves to anyone,
   * which is precisely the thing she agreed to.
   */
  seePage: 'See your wedding page',

  /**
   * ⚠ TWO BYTES NOT YET VETOED — raised in the handover, not smuggled.
   * The founder asked for a share control beside the page link (2026-09-05);
   * the WORDS are the seat's proposal and his to change.
   *
   * `share` is the control. `shared` is what it says when the device has no
   * share sheet and the address went to the clipboard instead — a different
   * outcome deserves a different sentence, because "Shared" would be a claim
   * about something that did not happen.
   */
  share:  'Share',
  shared: 'Link copied.',
} as const;
