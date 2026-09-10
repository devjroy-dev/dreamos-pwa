// lib/public/metaPlaceholder.ts
//
// ── F-42.128 · A BEND TO WHAT META ACTUALLY STORED, ON `/v/` ────────────────
// WITNESSED, not inferred. The founder tapped the template's `See my work`
// button, 2026-09-10:
//
//     https://thedreamwedding.in/v/%7B%7B1%7D%7DMAKEUPBYSWATIROY
//     → "this page no longer exists"
//
// Meta's stored base ends in a LITERAL `{{1}}` and our parameter is APPENDED to
// it rather than substituted into it. So the handle arrives as
// `{{1}}MAKEUPBYSWATIROY`, the card door has no such routing handle, and every
// vendor who sent that template sent a link to a page that says she is gone.
//
// THIS IS F-42.1's MECHANISM ON A SECOND FAMILY. `/r/` was cured at D5a with
// exactly this shape (`app/r/[code]/route.ts`, its own `META_PLACEHOLDER`), and
// the finding there was written as though it were about the `enq-` branch. It
// was never about the branch: it is about how Meta stores a base ending in a
// parameter, and it reaches every template we have approved that way. F-42.129
// files that class — why one template's cure was not carried to the others at
// D5a — and that is SEAT B's, not this rider's.
//
// ── ⚠ STRIP, DO NOT DECODE — c-42.5, PAID FOR ONCE ALREADY ─────────────────
// Next decodes dynamic segment params before the handler sees them, so
// `%7B%7B1%7D%7D` ARRIVES as `{{1}}`. A `decodeURIComponent` here would be a
// SECOND decode and would throw `URIError` on any handle holding a bare `%` — a
// 500 where there is a page today, and a regression ranked worse than the
// missing feature. Both spellings are matched anyway, so no assumption about
// the runtime's decoding is load-bearing in either direction.
//
// ── ⚠ LEADING ONLY, AND ANCHORED ──────────────────────────────────────────
// `^` is the whole safety of this. Meta APPENDS, so the placeholder can only
// ever be a prefix; a global replace would silently rewrite a handle that
// legitimately contained the sequence anywhere else. A routing handle cannot
// contain braces today, but this function must not be the thing that assumes it.
//
// ── ⚠ TWO HOMES FOR ONE PATTERN, DELIBERATELY, WITH A CELL BETWEEN THEM ────
// `app/r/[code]/route.ts` keeps its own literal copy and is NOT changed to
// import this. Its comment states the reason at its own site: it is a route
// handler on the public edge with no React runtime, and it was written to avoid
// dragging modules onto a route Meta has already approved. Changing an approved
// route to save four characters would be the wrong trade. So the two copies are
// pinned to each other by `b71` §1.4, which asserts the SOURCE TEXT of both
// patterns is identical — they cannot drift apart in silence, and if a third
// family ever needs it the cell says so out loud.
//
// ── THIS DIES AT META'S NEXT EDIT WINDOW ──────────────────────────────────
// When the stored base is corrected to substitute rather than append, this strip
// retires WITH ITS READERS (all three `/v/` surfaces below). It is a bend to a
// vendor-side fact, not a rule of ours, and leaving it in place afterwards would
// leave a silent rewrite on a public path for no reason anyone could name.
export const META_PLACEHOLDER = /^(\{\{1\}\}|%7B%7B1%7D%7D)/i;

/**
 * The handle as it was meant to arrive.
 *
 * A bare code is returned untouched — this is a no-op for every link that was
 * not built from Meta's stored base, which is nearly all of them.
 */
export function stripMetaPlaceholder(code: string): string {
  return code.replace(META_PLACEHOLDER, '');
}
