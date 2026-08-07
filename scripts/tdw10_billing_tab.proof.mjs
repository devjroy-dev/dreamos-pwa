// scripts/tdw10_billing_tab.proof.mjs — TDW_10 · THE BILLING TAB
// Billing leaves Settings and takes its own door off the profile coin.
// Founder ruling 「 Lets put it in avatar under Billing 」; chair ruling R-26.4.
//
// TWENTY-TWO CELLS, the ratified count. §-shape as proposed at read-first:
// door 4 · route 3 · control inventory 6 · gates 3 · F-10.91 2 · #tier 2 · pure
// move + copy 2.
//
// BOTH-WAYS DISCIPLINE: every cell is RED at the uncured tree (1959023) and
// GREEN at the cured tree. Relocation cells redden by the DIFF ITSELF; survival
// cells redden by MUTATION OF PRODUCTION CODE — never by test setup. The full
// ledger rides the handover.
//
// [GUARD] cells assert something the move must NOT have changed. A guard that
// cannot fail is worthless, so each names what would break it.
//
// CE-115 CONTROL INVENTORY, all three clauses: §3 accounts every interactive
// control on the moved card at its new home, and clause 2's three capabilities —
// the verbs living a layer above the component, invisible to a component-identity
// check — are enumerated with them. Clause 3's walk is the founder's own, against
// 9888294440 (basic / cancelled), and it is the smoke card, not a fixture here.
//
// MATCHER NOTE, paid for by running: JSX attribute lists CANNOT be matched with
// `[^>]*` — an arrow handler contains `=>`, and the class stops at its `>`. Six
// cells read RED against correct production code on the first run. Every element
// matcher below is LINE-BASED for that reason.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// ── §9's INSTRUMENT · F-10.110 (R-26.18) · GUARDED (R-26.19 §A) ─────────────
// THE RESOLVER IS IMPORTED AND RUN, not pattern-matched. Every other cell in
// this file reads source text, which is the right method for a relocation — but
// asserting 「 every pair renders a true sentence 」 by matching JSX would
// reproduce the method under test and green on a map that is merely SHAPED
// right. Node strips types, so this bench executes the real function over the
// real matrix.
//
// A STATIC IMPORT WOULD KILL THIS BENCH ON ANY TREE WITHOUT THE MODULE — a
// bisect across this commit would meet an ERR_MODULE_NOT_FOUND and ZERO printed
// cells, which is strictly worse than a red: a red is a report, an ENOENT is a
// silence (F-09.93's refuse-never-crash class; the shape is
// `scripts/tdw09_p2c.proof.mjs:40` and `tdw07_p3_portfolio.proof.mjs:25`, both
// fitted by this bench's own lineage). Guarded, so the module's absence is a
// DECLARED RED with the subject named, and the full cell count still prints.
//
// NEVER A SENTINEL THAT COULD PASS. `execCell` reds outright when the subject is
// absent and never routes into a comparison. This sitting's own defect #4 is the
// reason: a `'\0THREW'` sentinel contains no 「 on Basic 」, so the cell F-10.110
// exists for greened over a resolver that threw on every call.
let statusLine = null;
let RESOLVER_ABSENT = false;
try {
  ({ statusLine } = await import('../lib/vendor/billing/statusLine.ts'));
  if (typeof statusLine !== 'function') { RESOLVER_ABSENT = true; statusLine = null; }
} catch { RESOLVER_ABSENT = true; }
const ABSENT_SUBJECT = 'lib/vendor/billing/statusLine.ts';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// A file that does not exist reads as empty rather than throwing: at the UNCURED
// tree both components/vendor/SubscriptionCard.tsx and app/vendor/billing/page.tsx
// are absent, and a crash would report one red instead of the many this bench
// exists to show. (F-09.93's lesson: refuse, never crash.)
const R = (p) => { try { return readFileSync(join(ROOT, p), 'utf8'); } catch { return ''; } };
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
// The one honest way to grab a JSX element here: the whole source line it sits on.
const lineWith = (src, needle) => (src.split('\n').find(l => l.includes(needle)) ?? '');
let pass = 0, fail = 0;
const cell = (id, ok, msg) => { if (ok) { pass++; console.log(`  PASS ${id} ${msg}`); } else { fail++; console.log(`  FAIL ${id} ${msg}`); } };
// R-26.19 §A — a cell that EXECUTES the resolver. With the subject absent it
// reds by name and its predicate is never evaluated, so nothing can acquit over
// a stand-in. The cell count is unchanged either way, which is the whole point:
// the bisect reads a report instead of a silence.
const execCell = (id, fn, msg) => {
  if (RESOLVER_ABSENT) { cell(id, false, `${msg}  [DECLARED-ABSENT-SUBJECT: ${ABSENT_SUBJECT}]`); return; }
  cell(id, fn(), msg);
};
const sec = (t) => console.log(`\n── ${t} ──`);

const HEADER = R('components/vendor/Header.tsx');
const SETT   = R('app/vendor/settings/page.tsx');
const MORE   = R('app/vendor/more/page.tsx');
const BILL   = R('app/vendor/billing/page.tsx');
const CARD   = R('components/vendor/SubscriptionCard.tsx');
const RES    = R('lib/vendor/billing/statusLine.ts');
const hdr = strip(HEADER), set = strip(SETT), mre = strip(MORE), bil = strip(BILL), crd = strip(CARD);
const res = strip(RES);

// ── §9's FIXTURES, HOISTED HERE AND NOT LEFT AT §9 ──────────────────────────
// AMENDED CELLS 4.3 AND 7.2 READ THEM, and `const` has no hoisting — declared at
// §9 they sit in the temporal dead zone when §4 runs, and the bench THROWS at
// cell 4.3 instead of failing it. That is the CE-210 failure mode exactly: a
// dead bench prints no FAIL line and reads as non-biting when it has destroyed
// the instrument. It happened on this sitting's first run and was caught by
// checking the EXIT CODE and the LINE COUNT, not the summary. Disclosed, and the
// declarations moved rather than the cells reordered.
//
// The matrix is derived, not invented. 0115's CHECK gives four canon tiers; `''`
// is `useSettings.ts`'s EMPTY seed and its `v.tier ?? ''` map, both of which
// reach the render on the pre-fetch frame; `'trial'` is 0115's retired default
// word, alive on any straggler row. 0114's CHECK gives five statuses; `'zzz'`
// stands for the unrecognised word the retired `??` fallback used to absorb.
const TIERS_ALL  = ['basic', 'essential', 'signature', 'prestige', '', 'trial'];
const TIERS_PAID = ['essential', 'signature', 'prestige'];
const STATUSES   = ['none', 'active', 'pending', 'halted', 'cancelled'];
const LAPSED     = ['halted', 'cancelled'];
const LABEL = { basic: 'Basic', essential: 'Essential', signature: 'Signature', prestige: 'Prestige' };
// THROW-SAFE BY CONSTRUCTION, and this is a CE-210 cell in its own right. A
// resolver that throws must FAIL cells, never KILL the bench: cell 4.3 calls
// this before 9.2 ever runs, so an unguarded helper would take the instrument
// down at §4 and print fifteen greens and no FAIL line — indistinguishable, from
// the summary, from a mutation that did not bite. Caught on this sitting's own
// mutation M7. The sentinel can satisfy no assertion below, so a throw reddens
// every cell that touches the pair rather than hiding them.
// 9.2 deliberately does NOT use this helper — it calls `statusLine` raw inside
// its own try/catch, because proving "zero throw" through a catch-all wrapper
// would be vacuous.
const call = (t, s) => {
  try { return statusLine(t, s, LABEL[t] ?? 'Basic'); }
  catch { return { status: '\u0000THREW', note: '\u0000THREW' }; }
};

// ═══════════════════════════════════════════════════════════════════════════
sec('§1 · THE DOOR — the Billing row exists, routes, and is seated by ruling');
{
  // Matched as a whole DItem line so a stray "Billing" in prose cannot green it.
  // INDEPENDENT-METHOD: a bare /Billing/ test would have passed the moment
  // anyone wrote the word in a comment.
  const row = lineWith(hdr, 'label="Billing"');
  cell('1.1', /<DItem/.test(row) && /label="Billing"/.test(row),
    'a DItem labelled "Billing" exists in the profile menu');

  cell('1.2', /router\.push\('\/vendor\/billing'\)/.test(row) && /setProfileOpen\(false\)/.test(row),
    "it routes to '/vendor/billing' — the exact string the cap sitting re-points chat.js to — and closes the panel");

  // FORK C's seating, asserted positionally rather than by eye: the row must
  // fall between the Settings row and the Display section label.
  const iSettings = hdr.indexOf('label="Settings"');
  const iBilling  = hdr.indexOf('label="Billing"');
  const iDisplay  = hdr.indexOf('>Display<');
  cell('1.3', iSettings > -1 && iBilling > iSettings && iDisplay > -1 && iBilling < iDisplay,
    'FORK C — seated in ATELIER, directly after Settings and before the Display section');

  cell('1.4', /glyph="◇"/.test(row) && /subtitle="Plan and payment"/.test(row),
    'it wears the founder-vetoed glyph ◇ and subtitle, verbatim');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§2 · THE ROUTE — a real page, guarded, with somewhere for failures to land');
{
  cell('2.1', /export default function BillingPage/.test(bil) && /<SubscriptionCard/.test(bil),
    'app/vendor/billing/page.tsx exists, default-exports a page, and renders the card');

  cell('2.2', /useVendorSession/.test(bil) && /router\.replace\('\/'\)/.test(bil),
    'session-gated identically to /vendor/settings — no session, no surface');

  // THE TOAST MOUNT. Five of the card's sentences reach the vendor ONLY through
  // show(). Without the mount a failed cancel does nothing and says nothing —
  // a failure that looks like a success. HONEST CONTROLS (CE-209).
  cell('2.3', /<Toast toast=\{toast\}/.test(bil) && /useToast\(\)/.test(bil),
    'HONEST CONTROLS — <Toast> is mounted, so the five failure sentences have a surface');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§3 · CE-115 CONTROL INVENTORY — every control and every verb at its new home');
{
  cell('3.1', /href=\{current\.subscription_link\}/.test(crd) && />Set up monthly payment<\/a>/.test(crd),
    'KEPT — the subscription_link anchor ("Set up monthly payment")');

  cell('3.2', /onClick=\{\(\) => setPicked\(picked === t \? null : t\)\}/.test(crd),
    'KEPT — the picker\u2019s per-tier select buttons');

  cell('3.3', /onClick=\{\(\) => go\(t\)\}/.test(crd) && /V2\.pickerAction/.test(crd),
    'KEPT — the picker\u2019s confirm button');

  cell('3.4', /onClick=\{\(\) => setAsking\(true\)\}/.test(crd),
    'KEPT — CancelBlock\u2019s trigger (the control the charter\u2019s own inventory omitted)');

  cell('3.5', /onClick=\{doCancel\}/.test(crd) && /onClick=\{\(\) => setAsking\(false\)\}/.test(crd),
    'KEPT — CancelBlock\u2019s confirm AND keep pair, both seats');

  // Clause 2 — capabilities living a layer above the component. A component-
  // identity check cannot see these, so they are named.
  const verbs = ['subscribeToTier', 'upgradeToTier', 'cancelSubscription'];
  const imported = verbs.every(v => new RegExp(`import[\\s\\S]{0,240}${v}`).test(crd));
  const called   = verbs.every(v => new RegExp(`await ${v}\\(`).test(crd));
  cell('3.6', imported && called,
    'CLAUSE 2 — all three verbs are imported AND called at the new home (none orphaned by the move)');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§4 · THE GATES SURVIVE THE MOVE — F-10.92 both seats, F-10.77');
{
  // F-09.128 is why each seat gets its own cell: this gate was wiped once
  // already by a delivery cut on an older tree and applied onto a newer one.
  cell('4.1', /!current\.subscription_link && current\.selfserve_enabled/.test(crd),
    'F-10.92 seat 1 — selfserve_enabled gates the PICKER (OFF renders nothing, not a 503 button)');

  cell('4.2', /current\.billing_status === 'active' && current\.subscription_id && current\.selfserve_enabled/.test(crd),
    'F-10.92 seat 2 — selfserve_enabled gates CANCEL, and the id is still required with it');

  // ── AMENDED · R-26.18 Fork 2 · F-10.110 ──────────────────────────────────
  // NOT RETIRED. This cell asserted the gate `current.tier === 'basic' && (...)`
  // in the component. That gate is DELETED by ruling — it was the second half of
  // F-10.110's defect, excluding the one vendor who most needed the explanation.
  //
  // THE PROPERTY THIS CELL EXISTS FOR IS UNCHANGED and is re-asserted here at
  // its new home: a floor-tier vendor off a lapsed rail still reads the SAME
  // verbatim sentence she read before. Only where the condition lives moved.
  // The paid-tier half — the half that was missing — is 9.3 and 9.5's business.
  // Amendment labelled rather than the cell quietly rewritten (acceptance ④).
  execCell('4.3', () => /Moved to Basic — subscription cancelled\./.test(RES)
           && /Moved to Basic — subscription stopped after failed payments\./.test(RES)
           && call('basic', 'cancelled').note !== null && call('basic', 'halted').note !== null
           && /\{line\.note !== null && \(/.test(crd),
    '[AMENDED R-26.18] F-10.77 — the flip-reason line still renders on the floor tier off a lapsed rail, verbatim, now via the pair resolver');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§5 · F-10.91 IS UNCHANGED BY THE MOVE');
{
  // The cure's whole content is WHICH KEY the filter reads. Re-breaking it means
  // dropping the isUpgrade conjunct — which is exactly the pre-cure expression.
  cell('5.1', /\.filter\(t => !\(isUpgrade && t === currentTier\)\)/.test(crd)
           && !/\.filter\(t => t !== currentTier\)/.test(crd),
    'F-10.91 — the filter keys on isUpgrade AND the tier, never on the entitlement alone');

  // EXECUTED — and executed against the PRODUCTION EXPRESSION, lifted out of the
  // component source and run, not re-implemented here.
  //
  // THIS CELL'S FIRST DRAFT WAS VACUOUS and the red run caught it: it declared
  // its own copy of the filter and asserted that copy's behaviour, so it was
  // GREEN at the uncured tree and could never have reddened for any change to
  // the product. A cell that does not read the tree is not a cell. Disclosed by
  // name in the handover.
  //
  // A source-text match alone (5.1) would not catch a logically-inverted rewrite
  // that still contained both names; running the real expression does.
  const lifted = crd.match(/const tiers = \[([^\]]*)\]\s*\n?\s*\.filter\((t =>[\s\S]*?)\);/);
  let filt = null;
  if (lifted) {
    try {
      filt = new Function('isUpgrade', 'currentTier',
        `return [${lifted[1]}].filter(${lifted[2]});`);
    } catch { filt = null; }
  }
  cell('5.2', !!filt
           && filt(false, 'basic').length === 3
           && filt(false, 'prestige').length === 3
           && filt(true, 'signature').length === 2
           && !filt(true, 'signature').includes('signature'),
    'F-10.91 behaviour — the PRODUCTION filter expression, lifted and run: a cancelled or comped vendor is offered all three; only a LIVE mandate filters');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§6 · THE WIRE ADDRESS SURVIVES — /vendor/settings#tier still leads to the picker');
{
  // Not merely present: an empty anchor would satisfy a presence check and
  // strand every capped vendor. The anchor must carry a live route out.
  const block = SETT.split('<div id="tier">')[1]?.split('</SCard>')[0] ?? '';
  cell('6.1', /<div id="tier">/.test(set)
           && /router\.push\('\/vendor\/billing'\)/.test(block)
           && /Moved to Billing\. ›/.test(block),
    'the id="tier" anchor stands AND carries the vetoed signpost with a live route to /vendor/billing');

  // The retirement condition must live at the mechanism (F-06.85) so the sitting
  // that moves the href cannot miss it — and it must name BOTH events, because
  // the href arrives on the wire and a ZIP alone does not change what Railway
  // serves.
  cell('6.2', /RETIREMENT CONDITION/.test(SETT)
           && /Railway redeploys/.test(SETT)
           && /vendor-engine\/chat\.js/.test(SETT),
    'F-06.85 — the retirement condition is named at the anchor, and names BOTH events, not one');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§7 · THE COPY, AND THE PURE MOVE');
{
  // All three copy amendments in one cell because they are one property: no
  // surface claims billing that no longer holds it, and the index stays whole.
  const hSettings = lineWith(hdr, 'label="Settings"');
  const mSettings = lineWith(mre, "href: '/vendor/settings'");
  cell('7.1', /subtitle="Profile and preferences"/.test(hSettings) && !/billing/i.test(hSettings)
           && /description: 'profile and preferences'/.test(mSettings) && !/billing/i.test(mSettings)
           && /\{ href: '\/vendor\/billing', label: 'Billing', description: 'plan and payment', glyph: '◇' \}/.test(mre),
    'neither door claims billing any more (Header AND its donor row in More), and More gains its Billing row verbatim');

  // [GUARD] FORK D, the pure move, proven four ways. Breaks if a future sitting
  // "tidies" the prices back into the page that renders them, leaves a second
  // definition behind, or adds a second caller without a ruling.
  // ── AMENDED · R-26.18 Fork 1 · F-10.110 ──────────────────────────────────
  // NOT RETIRED, and the property is untouched: a vetoed byte has exactly ONE
  // home and `settings/page.tsx` holds none of them. What moved is WHICH file is
  // that home for one string. `"Cancelled. You're on Basic."` left this list for
  // `VETOED_IN_RESOLVER` below, because the status sentences now live beside the
  // pair logic their truth depends on. The guard is strictly stronger for it:
  // each string is asserted present in its own home AND absent from both others.
  const vetoed = ['Rs 999 / month', 'Rs 1,999 / month', 'Rs 2,999 / month',
                  'Choose a plan', 'Keep my plan'];
  const VETOED_IN_RESOLVER = ["Cancelled. You're on Basic.", "Payment failed. You're on Basic."];
  const callers = ['app/vendor/billing/page.tsx', 'app/vendor/settings/page.tsx',
                   'app/vendor/more/page.tsx', 'components/vendor/Header.tsx']
    .filter(p => /<SubscriptionCard/.test(R(p)));
  cell('7.2', vetoed.every(s => CARD.includes(s))
           && vetoed.every(s => !SETT.includes(s))
           && VETOED_IN_RESOLVER.every(s => RES.includes(s))
           && VETOED_IN_RESOLVER.every(s => !SETT.includes(s) && !CARD.includes(s))
           && !/₹/.test(CARD) && !/Rs ?\d+(\.\d+)?\s*[kKlLcC]r?\b/.test(CARD)
           && !/₹/.test(RES) && !/Rs ?\d+(\.\d+)?\s*[kKlLcC]r?\b/.test(RES)
           && !/function TierPicker|function CancelBlock/.test(SETT)
           && !/subscribeToTier|upgradeToTier|cancelSubscription/.test(set)
           && callers.length === 1 && callers[0] === 'app/vendor/billing/page.tsx',
    '[GUARD] FORK D — the vetoed money block moved WHOLE and register-clean, nothing is left behind, and the card has exactly ONE caller');
}

// ═══════════════════════════════════════════════════════════════════════════
sec('§8 · F-10.108 — THE OFFER REACHES HER BEFORE SHE PICKS (R-26.16)');
{
  // SITE 1, one cell for one ruled property: the line exists verbatim, is
  // RENDERED (a constant nobody renders is a byte that ships and never speaks),
  // and is seated ABOVE the tier rows — because it is true of all three tiers
  // uniformly, so a seat inside the map would be three claims where the ruling
  // made one.
  const iHeading = crd.indexOf('V2.pickerHeading');
  const iOffer   = crd.indexOf('V2.offer');
  const iRows    = crd.indexOf('tiers.map');
  cell('8.1', /offer: 'First month free\. Full price from the second month\.'/.test(CARD)
           && /\{V2\.offer\}/.test(crd)
           && iHeading > -1 && iOffer > iHeading && iRows > -1 && iOffer < iRows,
    'the founder-ruled offer line exists verbatim, is rendered, and is seated under the heading ABOVE all three tier rows');

  // SITE 2 WAS REJECTED. This cell exists so the rejected change stays rejected:
  // a later sitting that "helpfully" adds the offer to the confirm sentence
  // would be shipping unvetoed copy on the money surface.
  cell('8.2', /`This opens a Razorpay page to approve \$\{label\} — \$\{price\}\. You approve once; it renews every month until you cancel\.`/.test(CARD)
           && !/free/i.test(crd.split('confirm:')[1]?.split('cancelWarn:')[0] ?? 'free'),
    'V2.confirm is BYTE-UNCHANGED — the rejected Site 2 stayed rejected');

  // MONEY REGISTER on the new string specifically, not the file at large.
  // NON-VACUITY, PAID FOR BY RUNNING. This cell's first draft asserted only
  // NEGATIVES against `lineWith(...)`, and at the uncured tree that helper
  // returns '' — an absent string satisfies every "does not contain" test, so
  // the cell was GREEN where the byte did not exist. The line must be PRESENT
  // before its register can mean anything. Second vacuity self-caught in this
  // bench; both were caught by the red run, neither by reading.
  const offerLine = lineWith(crd, 'offer:');
  cell('8.3', /First month free/.test(offerLine)
           && !/₹/.test(offerLine) && !/\d\s*[kKlL]\b|\bCr\b/.test(offerLine)
           && !/Rs/.test(offerLine),
    'money register holds on the new byte — present, and zero ₹, zero k/L/Cr, naming no figure at all');

  // ── DISCLOSED ADDITION · §D ratified THREE cells here; this is a FOURTH ─────
  // §C ruled the warrant 「 part of the deliverable 」 and named it the thing
  // that turns this from an oversight into a decision. An unasserted comment is
  // one tidy-up away from gone, and the moment it goes, the next reader finds
  // Rs 2 in the ledger, reads 「 free 」, and files a defect against a founder
  // ruling — the exact trap §C describes. F-06.85's own logic, and the same
  // shape as cell 6.2, which asserts the #tier retirement condition.
  cell('8.4', /i know indian mindset|market-register judgment/.test(CARD)
           && /countsAsRevenue/.test(CARD)
           && /Rs 2/.test(CARD)
           && /F-10\.109/.test(CARD),
    '[GUARD] F-06.85 — the warrant survives at the byte: the Rs 2, that it is BOOKED not refunded, the founder\u2019s ground, and .109\u2019s scope limit');
}

// ═══════════════════════════════════════════════════════════════════════════
// §9 · THE STATUS LINE LEARNS THE PAIR — F-10.110 + F-10.106
// ═══════════════════════════════════════════════════════════════════════════
// TWELVE CELLS, the count ratified at R-26.18 §D (26 → 38, chair floor 34).
//
// THE DISEASE, so a later reader does not have to reconstruct it: the Status row
// keyed on `billing_status` ALONE. `vendors.tier` is the entitlement dream-os
// `chat.js:buildLlmForTurn` actually serves — `billing_status` appears ZERO
// times in `chat.js` and ZERO times in `src/lib/vendorInbound.js` — so a vendor
// at `signature`/`cancelled` read PLAN: Signature (true) and STATUS: 「 You're on
// Basic 」 (false) at the same instant, while F-10.77's explanation went silent
// because its gate excluded exactly her. Two admin write-doors produce that pair
// with nobody editing a row: `src/api/admin/vendors.js` and
// `src/admin/router.js` both `.update({ tier })` and never touch the rail.
//
// ⚡ = the cell EXECUTES the resolver. 9.2–9.5 run the real function over the
// real matrix; the rest read source. Both methods are named per cell so a future
// mutation run can tell a dead instrument from a non-biting one.
sec('§9 · THE PAIR — the status line reads tier AND billing_status (F-10.110)');
{
  // 9.1 — the instrument's own precondition. A dependency-free module is what
  // makes 9.2–9.7 and 9.10 possible at all; an `@/` alias or a JSX tag here
  // makes the guarded import above refuse, and every executing cell reds as a
  // DECLARED-ABSENT-SUBJECT rather than taking the bench down with it.
  execCell('9.1', () => typeof statusLine === 'function'
           && !/^\s*import\s/m.test(res) && !/require\(/.test(res) && !/<[A-Za-z]/.test(res),
    '⚡ the resolver imports NOTHING and holds no JSX — an alias or a tag here blinds 9.2–9.10');

  // 9.2 — TOTALITY. Thirty-six pairs, none throwing, every one answering in shape.
  //
  // ⚠ RAW `statusLine`, NEVER `call`. The first draft went through the
  // throw-safe helper, which converts every throw into a well-shaped sentinel —
  // so under mutation M7 (`KNOWN_STATUS = null`, every pair throwing) this cell
  // counted 36 shaped answers and stayed GREEN. A TOTALITY CHECK ROUTED THROUGH
  // A CATCH-ALL IS A CHECK ON THE CATCH-ALL. Caught by the mutation run, not by
  // reading; and the in-comment claim that it called the resolver raw was itself
  // false at the time it was written. Disclosed as this sitting's defect #3.
  execCell('9.2', () => {
    let shaped = 0, threw = 0;
    for (const t of TIERS_ALL) for (const s of [...STATUSES, 'zzz']) {
      try {
        const r = statusLine(t, s, LABEL[t] ?? 'Basic');
        if (r && 'status' in r && 'note' in r) shaped++;
      } catch { threw++; }
    }
    return threw === 0 && shaped === TIERS_ALL.length * (STATUSES.length + 1);
  }, `⚡ all ${6 * 6} pairs answer in shape, zero throw`);

  // 9.3 — THE DEFECT ITSELF, and this is the cell F-10.110 exists for.
  execCell('9.3', () => {
    const liars = [];
    for (const t of TIERS_PAID) for (const s of STATUSES) {
      const r = call(t, s);
      // A THROWN PAIR IS NOT AN HONEST PAIR. Without this line the sentinel
      // satisfies "contains no 'on Basic'" and a resolver that throws on every
      // call greens the cell F-10.110 exists for. Defect #4, same mutation run.
      if (r.status === '\u0000THREW' || r.note === '\u0000THREW') liars.push(`${t}/${s} (threw)`);
      if (r.status && /on Basic/.test(r.status)) liars.push(`${t}/${s}`);
      if (r.note && /AI is off on Basic/.test(r.note)) liars.push(`${t}/${s} (note)`);
    }
    return liars.length === 0;
  }, '⚡ NO paid tier is ever told she is on Basic, in the status line or the note');

  // 9.4 — [GUARD] BYTE-IDENTITY ON APPROVED COPY. Ratified as four; SEVEN are
  // asserted, because seven vetoed strings survive this sitting unchanged and
  // the argument for guarding four is the argument for guarding all of them.
  // Widening DISCLOSED rather than done quietly. This is the cell that stops a
  // sitting rewording bytes the founder already approved.
  execCell('9.4', () => [
    call('basic', 'none').status      === 'Not set up yet.',
    call('basic', 'active').status    === 'Active. Renews monthly.',
    call('basic', 'pending').status   === "Payment didn't go through. Retrying — nothing changes yet.",
    call('basic', 'halted').status    === "Payment failed. You're on Basic.",
    call('basic', 'cancelled').status === "Cancelled. You're on Basic.",
    call('basic', 'cancelled').note   === 'Moved to Basic — subscription cancelled. Profile and leads unchanged. AI is off on Basic.',
    call('basic', 'halted').note      === 'Moved to Basic — subscription stopped after failed payments. Profile and leads unchanged. AI is off on Basic.',
  ].every(Boolean),
    '⚡ [GUARD] all SEVEN surviving founder-vetoed strings are byte-identical');

  // 9.5 — F-10.77's explanation REACHES HER. The half the old gate withheld.
  execCell('9.5', () => {
    const silent = [];
    for (const t of TIERS_PAID) for (const s of LAPSED) {
      const r = call(t, s);
      if (!r.note || r.note === '\u0000THREW' || !r.note.includes(LABEL[t])) silent.push(`${t}/${s}`);
    }
    return silent.length === 0;
  }, '⚡ every paid tier on a lapsed rail gets a note naming HER plan');

  // 9.6 — THE FLOOR ARM IS AN ALLOWLIST, NOT A NEGATION. `''` and `'trial'` must
  // land on the floor sentences; a `tier !== 'basic'` test would classify both
  // as paid and tell a vendor mid-load that her plan is still on.
  execCell('9.6', () => ['', 'trial', 'basic'].every(t =>
       call(t, 'cancelled').status === "Cancelled. You're on Basic."
    && call(t, 'halted').status === "Payment failed. You're on Basic."),
    "⚡ '' and 'trial' land on the FLOOR arm with 'basic' — the pre-fetch frame does not regress");

  // 9.7 — THE `??` FALLBACK IS GONE, both halves. It did not absorb neutrally;
  // it asserted a specific false state to a vendor whose status word it could
  // not read. And the call site passes the SAME label expression the Plan row
  // renders — one home for the tier vocabulary, no second map to drift.
  execCell('9.7', () => call('signature', 'zzz').status === null
           && call('basic', 'zzz').note === null
           && !/\?\?\s*'Not set up yet\.'/.test(crd)
           && /const planLabel = PLAN_LABEL\[current\.tier\] \?\? 'Basic'/.test(crd)
           && /statusLine\(current\.tier, current\.billing_status, planLabel\)/.test(crd),
    "⚡ unrecognised status → null, the `?? 'Not set up yet.'` fallback is gone, and the call site passes the Plan row's own label");

  // 9.8 — FORK 2's DELETION. Not widened — DELETED. The old gate is the reason
  // the two cures could have left a hole between them; there is now exactly one
  // source for the note, and no second condition downstream to drift.
  // SOURCE-TEXT, so it stands even with the resolver absent — deliberately.
  cell('9.8', !/current\.tier === 'basic'/.test(crd)
           && /\{line\.status !== null && <SReadRow label="Status"/.test(crd)
           && /\{line\.note !== null && \(/.test(crd)
           // TWO references, not one, and the count is the point: the gate
           // `line.note !== null` and the render `{line.note}`. A third would
           // mean a second condition had crept back in — the shape Fork 2
           // deleted. Corrected from `=== 1` on the first red run; the miscount
           // was mine (defect #5) and is disclosed rather than tuned away.
           && (crd.match(/line\.note/g) || []).length === 2,
    "the `tier === 'basic'` gate is DELETED from the component and the note has exactly one source");

  // 9.9 — [GUARD] F-06.85. The mechanism the sentences are conditioned on is
  // named in-comment, so the next tidy is forced to read why the pair is read
  // before collapsing it back to one key — which would restore the defect whole.
  //
  // ⚠ WORD-ANCHORED, AND THE ANCHORS ARE PAID FOR. The first draft used bare
  // substring tests and mutation M8 — renaming `buildLlmForTurn` to
  // `buildLlmForTurnX` throughout — left this cell GREEN, because the mutant
  // string still CONTAINS the needle. A GUARD THAT SURVIVES THE DEFACEMENT OF
  // THE THING IT GUARDS IS NOT A GUARD. Defect #2, disclosed.
  cell('9.9', /\bbuildLlmForTurn\b/.test(RES)
           && /\bZERO times\b/.test(RES)
           && /\bsrc\/api\/admin\/vendors\.js\b/.test(RES) && /\bsrc\/admin\/router\.js\b/.test(RES)
           && /Do not key on `billingStatus` alone\./.test(RES),
    '[GUARD] F-06.85 — the warrant survives at the byte: the entitlement reader, the zero-counts, both admin write-doors, and the collapse warning');

  // 9.10 — MONEY REGISTER on every byte this sitting mints. The surface names no
  // figure at all, so the strongest form of the law applies: zero rupee glyphs,
  // zero k/L/Cr shorthand, and no numeral.
  execCell('9.10', () => [
      call('signature', 'cancelled').status,
      call('signature', 'halted').status,
      call('signature', 'cancelled').note,
    ].every(s => typeof s === 'string' && s.length > 0 && s !== '\u0000THREW'
              && !/₹/.test(s) && !/\d\s*[kKlL]\b|\bCr\b/.test(s) && !/\d/.test(s)),
    '⚡ money register holds on all three new bytes — zero ₹, zero k/L/Cr, no numeral at all');

  // 9.11 — THE ABSENT SUBJECT IS CONVICTED BY NAME (R-26.19 §A; the shape is
  // `tdw09_p2c.proof.mjs:397`). This cell is the shim's own driver: without it
  // a guarded bench could be run against a tree with no resolver and reported as
  // 「 mostly green 」. It reds whenever the subject is missing, and it says which.
  cell('9.11', !RESOLVER_ABSENT,
    RESOLVER_ABSENT
      ? `⚠ ABSENT SUBJECT: ${ABSENT_SUBJECT} — every ⚡ cell above reds as DECLARED-ABSENT and acquitted nothing`
      : `[GUARD] the executed subject ${ABSENT_SUBJECT} was actually present and run`);
}


sec('§10 · THE ACCOUNT CARD — chrome does not stand over nothing (F-10.106)');
{
  // 10.1 — the frame takes the gate. Matched line-based: an arrow handler's `=>`
  // breaks any `[^>]*` class, the tuition this file already paid at its header.
  const acct = set.indexOf('<SCard title="Account">');
  const gate = set.lastIndexOf('{current.founding_cohort && (', acct);
  cell('10.1', acct > -1 && gate > -1 && acct - gate < 120
            && !/\{current\.founding_cohort && <SReadRow/.test(set),
    'the founding-cohort condition sits on the SCard FRAME, not on its row — no brass label over emptiness');

  // 10.2 — [GUARD] WRAPPED, NOT RETIRED. The cure must not have deleted a live
  // surface: the cohort it was built for still gets the card AND the row. A
  // retirement would green 10.1 and is exactly what this cell refuses.
  cell('10.2', /<SCard title="Account">/.test(set)
            && /<SReadRow label="Status" value="Founding cohort" \/>/.test(set)
            && /IF A SECOND ROW EVER JOINS THIS CARD/.test(SETT),
    '[GUARD] the founding-cohort vendor still gets the card and its row, and the re-gate condition is named in-comment');
}

console.log(`\n════ tdw10_billing_tab: ${pass} passed, ${fail} failed (total ${pass + fail}) ════`);
process.exit(fail === 0 ? 0 : 1);
