// lib/vendor/postAccess.ts
// TDW_04.5 · P5 micro — F-04.118(a): CAN THE POSTER REACH HIS OWN CONNECTIONS?
//
// Framework-agnostic and browser-free (native-implications clause), so the
// changed condition can be PROVEN rather than only rendered. A render condition
// is bench-blind — F-04.105's class, and F-04.118 is exactly what that blindness
// costs: the gate below shipped wrong and no test could see it, because it lived
// inside JSX. Hoisting it out is how the both-ways clause reaches it at all.
//
// ── THE DEFECT (founder-caught live, 2026-07-23) ────────────────────────────
// The old gate was `(interested_count > 0) && post.state === 'open'`, and the
// card carried no tap target of its own. So the moment a post FILLED, every
// response on it — every vendor the poster had actually connected with —
// vanished from the app.
//
// The cruelty is in the timing: **a post fills BECAUSE you connected with
// someone.** The state that hides the connections is caused by making them. And
// settlement — paying the person you just connected with — is the very next
// thing a vendor wants to do. At the smoke the only accepted response in the
// estate sat behind exactly this wall; it was reached by typing the URL.
//
// F-04.114's family, stated in that finding's own terms: the screen was telling
// the vendor something untrue by omission — "there is nothing here" about a
// place where his connections were.
//
// ── THE CURE (CE-ruled, half (a); half (b) is the Roster tab's durable home,
//    chartered into the roster-provenance sitting) ─────────────────────────────
// The gate keys on WHAT THE POST HAS, never on what state it is in. A response
// is a fact about people; a post state is a fact about a requirement. Only the
// first has any bearing on whether the poster may look at his own connections.

/** The narrow shape this predicate needs. Structural — any post row satisfies it. */
export interface PostAccessShape {
  state?:            string | null;
  interested_count?: number | null;
}

/**
 * May the poster open this post's responses?
 *
 * TRUE whenever the post has at least one response, WHATEVER its state.
 *
 * Deliberately NOT keyed on state. `filled` and `closed` are the states in which
 * the poster most needs the screen — filled means he connected, closed means the
 * work is behind him and the money may not be. An expired post's responses are
 * still the record of who answered.
 */
export function canViewResponses(post: PostAccessShape): boolean {
  return (post.interested_count ?? 0) > 0;
}

/**
 * Is the whole card a tap target?
 *
 * The same answer, named separately because it is a different question the
 * screen asks — and because naming it here keeps the card and the button from
 * ever disagreeing about reachability, which is how the defect hid: the button
 * had a rule and the card had none at all.
 */
export function cardIsTappable(post: PostAccessShape): boolean {
  return canViewResponses(post);
}
