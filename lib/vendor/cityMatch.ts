// lib/vendor/cityMatch.ts
// TDW_04.5 · P4 · D2 — THE ONE HOME for the composer's city vocabulary.
//
// Founder-caught at the P4 smoke: the gap pip prefilled `city=Delhi` from the
// vendor's profile and the composer showed "Select city". A <select> whose value
// matches no option renders BLANK — so the prefill did not fail loudly, it
// failed invisibly, and it could never have worked for ANY vendor: profiles
// store `Delhi`, the option list only offers `Delhi NCR`.
//
// The option list and the alias map live in ONE file, beside each other, because
// an alias is meaningless except as a pointer INTO the list. Split across two
// files they drift; here a bad alias is visible on the same screen.
//
// This is a lib, not page-local, for a reason the mutation test proved: a proof
// that carries its own copy of the ladder is a proof of the copy. Framework-free
// and browser-free, so the proof drives the REAL function in plain node — the
// crewCommit / rosterMint precedent.

export const CITIES = [
  'Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad',
  'Kolkata', 'Jaipur', 'Pune', 'Udaipur', 'Goa', 'Other',
];

// Every value here MUST be a member of CITIES. An alias pointing nowhere would
// render the select blank — the exact bug this file exists to close. The proof
// asserts that invariant rather than trusting it.
export const CITY_ALIASES: Record<string, string> = {
  'delhi':      'Delhi NCR',
  'new delhi':  'Delhi NCR',
  'ncr':        'Delhi NCR',
  'gurgaon':    'Delhi NCR',
  'gurugram':   'Delhi NCR',
  'noida':      'Delhi NCR',
  'ghaziabad':  'Delhi NCR',
  'faridabad':  'Delhi NCR',
  'bengaluru':  'Bangalore',
  'bombay':     'Mumbai',
  'madras':     'Chennai',
  'calcutta':   'Kolkata',
};

/**
 * Resolve a free-text city onto one of CITIES. Three rungs, then honesty:
 *   1. exact (case-insensitive) — 'Mumbai'          -> 'Mumbai'
 *   2. alias                    — 'Delhi'           -> 'Delhi NCR'
 *   3. prefix either way        — 'Delhi NCR, India'-> 'Delhi NCR'
 *   4. no match                 -> '' , which renders "Select city"
 *
 * The fallback is DELIBERATELY empty rather than 'Other'. A wrong city silently
 * selected is worse than an unfilled one: the poster would never notice, and the
 * feed's city leg would quietly exclude everybody who should have seen the post.
 * An empty select asks a question; a wrong one tells a lie.
 */
export function matchCity(raw: string): string {
  const q = (raw || '').trim().toLowerCase();
  if (!q) return '';

  const exact = CITIES.find(c => c.toLowerCase() === q);
  if (exact) return exact;

  const alias = CITY_ALIASES[q];
  if (alias) return alias;

  const prefix = CITIES.find(c => {
    const lc = c.toLowerCase();
    return lc.startsWith(q) || q.startsWith(lc);
  });
  return prefix || '';
}
