// lib/public/token.ts
// THE PUBLIC CAPABILITY-TOKEN CONSTITUTION — R-G12.9, and F-40.40's cure.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS FILE EXISTS
// ═══════════════════════════════════════════════════════════════════════════
// The estate now has THREE public leaves whose whole credential is a token in
// the URL — `app/crew/[token]`, `app/credits/[token]`, and G1.2's
// `app/consent/[token]`. They share a constitution that was never written down
// anywhere, only re-derived by each leaf from the one before it:
//
//   · THE TOKEN IN THE URL IS THE WHOLE CREDENTIAL. No session, no cookie, no
//     header — nothing to remember, and nothing left behind on a borrowed phone.
//   · NO localStorage, NO sessionStorage, anywhere in these lanes. A capability
//     page that persists anything turns a forwarded link into a lasting grant.
//   · A DEAD TOKEN READS IDENTICALLY TO ONE THAT NEVER EXISTED, and to one that
//     was rotated, settled or expired. A body that distinguished them would tell
//     a prober which tokens once existed.
//   · THE HTTP STATUS IS THE VERDICT, NEVER THE BODY'S SHAPE.
//
// ── F-40.40: THE BYTE HAD THREE OCCURRENCES AND NO HOME ────────────────────
// `app/crew/[token]/page.tsx:107` and `:109` render it as an inline JSX literal
// with an `&rsquo;` entity; `app/credits/[token]/page.tsx:46` declared its own
// `const DEAD_LINK`. That file's own comment named the duplication and filed it
// rather than fixing it — "one home would be better and this is the second" —
// because R-G11.15 had hoisted exactly two named strings and the crew page
// belonged to another arc. G1.2 would have made it a THIRD, so the debt is paid
// here instead of grown.
//
// ⚠ THE BYTE IS UNCHANGED. Not re-voiced, not re-punctuated. It is the founder's
// of 2026-07-22, and the chair's correction to the proposed "…isn't active
// anymore." stands: "anymore" leaks that the token once existed, and
// NEVER-EXISTED ≡ SETTLED ≡ EXPIRED ≡ ROTATED must read identically.
//
// ⚠ AND THE APOSTROPHE IS TYPOGRAPHIC (U+2019), NOT ASCII — R-40.19. The credits
// leaf's first cut copied the crew page's COMMENT, which spells it with an ascii
// quote, instead of the JSX it actually renders. A reused byte that differs by
// one character is a re-authoring nobody vetoed.

/** The one dead-token sentence, for every capability leaf in the estate. */
export const TOKEN_DEAD_LINK = 'This link isn\u2019t active.';

/**
 * THE READ RESULT, AS A DISCRIMINATED UNION rather than a nullable payload.
 *
 * `null` cannot say WHY, so every leaf that used one had to keep a second piece
 * of state beside it — and the credits leaf's `dead` boolean plus `credit` object
 * is exactly that shape. Three states, named, so a leaf cannot accidentally
 * render "dead" for an outage:
 *
 *   ok      — the door answered and the token is live
 *   dead    — 404 ONLY. The token is gone, expired, settled or never existed.
 *   offline — anything else: a 500, a dropped connection, a stale service worker
 *             returning 503. THIS IS US FAILING, NOT HER TOKEN EXPIRING, and
 *             telling her the link is dead would make her chase a vendor over
 *             our outage. F-40.53 is what this distinction costs when it is lost.
 */
export type TokenRead<T> =
  | { kind: 'ok'; data: T }
  | { kind: 'dead' }
  | { kind: 'offline' };

/**
 * THE ACT RESULT. Same three states, and `failed` rather than `offline` because
 * a person who has just tapped a button needs to be told the tap did not land —
 * R-40.29, born of the founder learning a claim had failed by querying the
 * database, which a vendor cannot do.
 */
export type TokenAct =
  | { kind: 'ok'; json: Record<string, unknown> }
  | { kind: 'dead' }
  | { kind: 'failed' };

/**
 * ⚠ ONLY A 404 IS A DEAD LINK, and this function is where that rule lives once
 * instead of three times.
 */
export async function readToken<T>(url: string): Promise<TokenRead<T>> {
  try {
    const r = await fetch(url);
    if (r.status === 404) return { kind: 'dead' };
    if (!r.ok) return { kind: 'offline' };
    const j = await r.json().catch(() => null);
    if (!j || !j.ok) return { kind: 'offline' };
    return { kind: 'ok', data: j as T };
  } catch {
    // A dropped connection leaves the page quiet rather than accusing the token.
    return { kind: 'offline' };
  }
}

/**
 * ⚠ THE STATUS IS CHECKED BEFORE THE BODY IS PARSED, AND THAT IS THE WHOLE
 * LESSON OF F-40.53. The founder's walk hit a 503 from a stale service worker:
 * no JSON, nothing to parse, and a check keyed only on `j.ok` read it as
 * "not settled" and rendered NOTHING. It satisfied never-a-false-done and that
 * was the whole of what it got right — silence is not the same as honesty.
 */
export async function actToken(url: string): Promise<TokenAct> {
  try {
    const r = await fetch(url, { method: 'POST' });
    if (r.status === 404) return { kind: 'dead' };
    if (!r.ok) return { kind: 'failed' };
    const j = await r.json().catch(() => null);
    if (!j || !j.ok) return { kind: 'failed' };
    return { kind: 'ok', json: j as Record<string, unknown> };
  } catch {
    return { kind: 'failed' };
  }
}
