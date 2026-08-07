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
const sec = (t) => console.log(`\n── ${t} ──`);

const HEADER = R('components/vendor/Header.tsx');
const SETT   = R('app/vendor/settings/page.tsx');
const MORE   = R('app/vendor/more/page.tsx');
const BILL   = R('app/vendor/billing/page.tsx');
const CARD   = R('components/vendor/SubscriptionCard.tsx');
const hdr = strip(HEADER), set = strip(SETT), mre = strip(MORE), bil = strip(BILL), crd = strip(CARD);

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

  cell('4.3', /current\.tier === 'basic'[\s\S]{0,160}?billing_status === 'cancelled' \|\| current\.billing_status === 'halted'/.test(crd)
           && /Moved to Basic — subscription/.test(crd),
    'F-10.77 — the flip-reason line renders on the floor tier off a lapsed rail, verbatim');
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
  const vetoed = ['Rs 999 / month', 'Rs 1,999 / month', 'Rs 2,999 / month',
                  "Cancelled. You're on Basic.", 'Choose a plan', 'Keep my plan'];
  const callers = ['app/vendor/billing/page.tsx', 'app/vendor/settings/page.tsx',
                   'app/vendor/more/page.tsx', 'components/vendor/Header.tsx']
    .filter(p => /<SubscriptionCard/.test(R(p)));
  cell('7.2', vetoed.every(s => CARD.includes(s))
           && vetoed.every(s => !SETT.includes(s))
           && !/₹/.test(CARD) && !/Rs ?\d+(\.\d+)?\s*[kKlLcC]r?\b/.test(CARD)
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

console.log(`\n════ tdw10_billing_tab: ${pass} passed, ${fail} failed (total ${pass + fail}) ════`);
process.exit(fail === 0 ? 0 : 1);
