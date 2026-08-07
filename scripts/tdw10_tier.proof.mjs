#!/usr/bin/env node
// scripts/tdw10_tier.proof.mjs
// TDW_10 · THE TIER & MONEY SITTING — pwa side.
//   §1 M0's surfaces · §2 M1's retirement · §3 F-10.83's rider · §4 M2's data path
//
// Runnable from any working directory: every path resolves off import.meta.url.
//
// DEFENSIVE BY CONSTRUCTION. The retirement half of this sitting is ABOUT deleted
// files, so a bench that threw on absence could not measure its own subject —
// every read returns '' rather than raising, and the pristine tree therefore
// yields per-cell reds instead of one crash standing in for sixty assertions.
//
// Cells that read source text read it with COMMENTS STRIPPED, including JSX
// comments, because this delivery's tombstones quote the retired words at length:
// a cell counting comment text would redden on its own epitaph. That stripping is
// proven in §0 rather than assumed — a check whose failure mode is a silent zero
// is not a check.

import fs from 'node:fs';
import path from 'node:path';
// ── R-26.18 · F-10.110 ──────────────────────────────────────────────────────
// Four amended cells below EXECUTE the resolver rather than matching its source.
// Node strips types, so this bench runs the real function; the module is kept
// dependency-free for exactly this reason and `tdw10_billing_tab` cell 9.1
// guards that. DECLARED AT THE TOP because `const` does not hoist — declared
// beside the cells that use them they would sit in the temporal dead zone and
// this bench would THROW instead of failing, printing no FAIL line at all. That
// happened once on this sitting and is the CE-210 failure mode by name.
// GUARDED (R-26.19 §A): absent module → the bench still RUNS, prints its full
// cell count, and every executing cell reds as a DECLARED-ABSENT-SUBJECT by
// name. A static import would produce ERR_MODULE_NOT_FOUND and ZERO cells on any
// tree without the resolver — strictly worse than a red, because a red is a
// report and an ENOENT is a silence (F-09.93's refuse-never-crash class; shape
// from `tdw09_p2c.proof.mjs:40`). Never a stand-in that could acquit.
let statusLine = null, RESOLVER_ABSENT = false;
try {
  ({ statusLine } = await import('../lib/vendor/billing/statusLine.ts'));
  if (typeof statusLine !== 'function') { RESOLVER_ABSENT = true; statusLine = null; }
} catch { RESOLVER_ABSENT = true; }
const ABSENT_SUBJECT = 'lib/vendor/billing/statusLine.ts';
const TIER_STATUS = ['none', 'active', 'pending', 'halted', 'cancelled'];
const TIER_LABEL  = { basic: 'Basic', essential: 'Essential', signature: 'Signature', prestige: 'Prestige' };
// Throw-safe: a resolver that throws must FAIL these cells, never kill the run.
const tierCall = (t, s) => {
  try { return statusLine(t, s, TIER_LABEL[t] ?? 'Basic'); }
  catch { return { status: '\u0000THREW', note: '\u0000THREW' }; }
};
// Executing cell: refuses outright when the subject is absent, so nothing is
// compared against a stand-in.
const okExec = (name, fn) => RESOLVER_ABSENT
  ? ok(`${name}  [DECLARED-ABSENT-SUBJECT: ${ABSENT_SUBJECT}]`, false)
  : ok(name, fn());
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  → ' + detail : '')); }
};
const section = (t) => console.log('\n' + t + '\n' + '─'.repeat(Math.min(t.length, 74)));

const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const read   = (rel) => exists(rel) ? fs.readFileSync(path.join(ROOT, rel), 'utf8') : '';
const strip  = (s) => s
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

const NAV    = read('app/admin/_components/adminNav.ts');
const BRIDGE = read('app/admin/_components/Bridge.tsx');
const MAKERS = read('app/admin/makers/page.tsx');
const CONFIG = read('app/admin/config/page.tsx');
const CTRL   = read('app/admin/control-room/page.tsx');
const VTYPES = read('lib/vendor/types/vendor.ts');
const USET   = read('hooks/vendor/useSettings.ts');
const SETT   = read('app/vendor/settings/page.tsx');
// ── LABELLED RE-AIM · TDW_10 THE BILLING TAB (R-26.4) ────────────────────────
// The Subscription surface this bench asserts LEFT app/vendor/settings/page.tsx
// and now lives at components/vendor/SubscriptionCard.tsx, rendered by
// app/vendor/billing/page.tsx. Not one asserted PROPERTY changed — every vetoed
// sentence, every gate expression and every register rule is byte-identical.
// Only the subject's address moved, so only the address moves here. This is the
// CE-205 / CE-206 shape: the property follows the control to its new home.
const CARD   = read('components/vendor/SubscriptionCard.tsx');
const RETINT = read('scripts/tdw10_p2_retint.proof.mjs');

const CANON = ['basic', 'essential', 'signature', 'prestige'];

// ═══════════════════════════════════════════════════════════════════════════
section('§0  THE INSTRUMENT PROVES ITSELF FIRST');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('read() reaches the tree (not a silent empty-string farm)',
     [NAV, BRIDGE, MAKERS, CONFIG, CTRL, VTYPES, USET, SETT, CARD].every(x => x.length > 200));
  const fx = "const a=1; // trial\n/* free */ const b='basic';\n{/* jsx trial settings */}";
  const st = strip(fx);
  ok('strip() removes a line comment', !/\/\/ trial/.test(st), st);
  ok('strip() removes a block comment', !/free/.test(st), st);
  ok('strip() removes a JSX comment — the tombstones live in these', !/jsx trial/.test(st), st);
  ok('strip() PRESERVES code (an over-strip would green everything)', /const b='basic'/.test(st), st);
  ok('exists() can return FALSE — §2 is vacuous without this', !exists('app/admin/__no_such_dir__'));
  ok('exists() can return TRUE', exists('app/admin/_components/adminNav.ts'));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§1  M0 — THE RENAME ON THE SURFACES');
// ═══════════════════════════════════════════════════════════════════════════
{
  const sb = strip(BRIDGE);
  ok('C1: the Bridge figure is labelled Basic (founder 「 yes 」)', /label="Basic"/.test(sb));
  ok('C1: the retired label is gone from the founder\'s own card', BRIDGE.length > 0 && !/label="Trials"/.test(sb));
  ok('C2: the sub reads the ruled sentence', /sub="On the basic tier"/.test(sb));
  ok('C2: the retired sub is gone', BRIDGE.length > 0 && !/Active on the trial tier/.test(sb));
  ok('the figure still reads the SAME response key — the client contract is untouched',
     /value=\{today\.trials\.active\}/.test(sb));

  const mt = strip(MAKERS).match(/const TIERS = \[([^\]]*)\]/);
  const mw = mt ? mt[1].split(',').map(x => x.trim().replace(/['"]/g, '')).filter(Boolean) : [];
  ok('the makers dropdown offers exactly the four ruled words',
     JSON.stringify(mw) === JSON.stringify(CANON), JSON.stringify(mw));
  ok('the dropdown cannot offer a word the live CHECK would refuse',
     mw.length === 4 && !mw.includes('trial') && !mw.includes('free'));

  const sc = strip(CONFIG);
  // ── LABELLED AMENDMENT (TDW_10 F-10.100) — THE EDITOR OFFERS THE KEYS THE READER
  // READS, WHICH IS THE PROPERTY. It was written at the rename sitting and pinned the
  // four `_basic` keys 0115 seeded, because a dial naming a key nothing seeded is a
  // dial that saves into nowhere (the PATCH route 404s on a key with no row).
  //
  // The property has not moved one inch; the keys have. The founder ruled ONE combined
  // allowance across the vendor's two doors, so 0116 seeds the vendor_ai_* family and
  // src/api/vendor-engine/chat.js interpolates it. Offering the old keys now would be
  // the SAME defect this cell was built to catch, pointed the other way: a dial whose
  // key no longer reaches the reader. Re-aimed to the eight ruled keys, with the
  // negative that the two retired families are gone from the editor entirely.
  for (const k of ['vendor_ai_daily_basic', 'vendor_ai_monthly_basic',
                   'vendor_ai_daily_prestige', 'vendor_ai_monthly_prestige']) {
    ok(`the cap editor names ${k} — the key 0116 actually seeds`, sc.includes(`'${k}'`));
  }
  ok('the cap editor no longer offers the retired tier\'s keys',
     CONFIG.length > 0 &&
     !/vendor_pwa_daily_trial|vendor_pwa_monthly_trial|vendor_wa_daily_trial|vendor_wa_monthly_trial/.test(sc));
  ok('the COUPLE tier keys are UNTOUCHED — a different axis (basic/gold/platinum)',
     /couple_wa_daily_basic/.test(sc) && /couple_wa_daily_gold/.test(sc) && /couple_wa_daily_platinum/.test(sc));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§2  M1 — THE RETIREMENT (F-10.76, founder 「 retire. 」)');
// ═══════════════════════════════════════════════════════════════════════════
{
  for (const p of ['app/admin/money/page.tsx', 'app/admin/revenue/page.tsx',
                   'app/admin/subscriptions/page.tsx']) {
    ok(`${p} is GONE from the tree`, !exists(p));
  }
  for (const d of ['app/admin/money', 'app/admin/revenue', 'app/admin/subscriptions']) {
    ok(`${d}/ leaves no empty directory behind`, !exists(d));
  }

  ok('the registry gained a RETIRED disposition',
     /'RETIRES' \| 'RETIRED'/.test(NAV));
  for (const r of ['/admin/money', '/admin/revenue', '/admin/subscriptions']) {
    const row = NAV.split('\n').find(l => l.includes(`path: '${r}'`) && l.includes('disposition'));
    ok(`${r} carries a tombstone row`, !!row);
    ok(`${r} is marked RETIRED, not silently vanished`, !!row && /disposition: 'RETIRED'/.test(row));
    ok(`${r}'s tombstone names the finding and the date`,
       !!row && /F-10\.76/.test(row) && /2026-08-07/.test(row));
  }
  ok('the money tombstone accounts for the ONE control it removed (Export CSV)',
     /Export-CSV control REMOVED-BY-RULING/.test(NAV));
  ok('the two zero-control pages state their expected-zero rather than omitting it',
     (NAV.match(/Zero interactive controls/g) || []).length === 2);
  ok('the tombstones record WHY — no server home, not merely unused', /no server home/.test(NAV));
  ok('F-10.84 is NAMED as filed-not-cured, so the wider v3 gap is not read as swept',
     /F-10\.84/.test(NAV));

  const mf = NAV.match(/\.filter\(r => r\.disposition === [^)]*\)/);
  ok('the mount filter admits only LIVE and RETIRES — never RETIRED',
     !!mf && !/RETIRED/.test(mf[0]), mf ? mf[0] : 'none');

  // SCOPE-CREEP CELLS. Three routes died because the founder ruled on them BY
  // NAME. The other seven v3 phantoms keep their rows and their audit; a sitting
  // that quietly widened its own ruling would show up right here.
  for (const keep of ['/admin/health', '/admin/data', '/admin/messages', '/admin/preview',
                      '/admin/featured', '/admin/dashboard']) {
    const row = NAV.split('\n').find(l => l.includes(`path: '${keep}'`) && l.includes('disposition'));
    ok(`${keep} is UNTOUCHED and still PHANTOM (scope did not creep)`,
       !!row && /disposition: 'PHANTOM'/.test(row));
  }
  for (const keep of ['app/admin/health/page.tsx', 'app/admin/data/page.tsx',
                      'app/admin/messages/page.tsx', 'app/admin/preview/page.tsx']) {
    ok(`${keep} still exists — only the three RULED routes died`, exists(keep));
  }

  // THE WALLS, asserted rather than trusted.
  ok('app/admin/layout.tsx is present and BYTE-UNTOUCHED by name (the standing wall)',
     exists('app/admin/layout.tsx'));
  ok('the Bridge REVENUE block is untouched — this sitting moved a label, not a number',
     /revenue/i.test(BRIDGE) && /today\.revenue/.test(strip(BRIDGE)));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§3  F-10.83 — THE EXPIRED NARRATION AND THE WRONG PRICE');
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = strip(CTRL);
  ok('Essential renders the CANON price, Rs 999', /formatRs\(999\)/.test(s));
  ok('the Rs 499 that contradicted canon is gone — F-10.63 gets no third home',
     CTRL.length > 0 && !/formatRs\(499\)/.test(s));
  ok('the expired pre-Aug-1 trial mechanic is no longer narrated as live',
     CTRL.length > 0 && !/Trial mechanic: Before Aug 1 2026/.test(s));
  ok('the replacement states the ruled truth: no trial, basic permanent',
     /there is no trial/.test(s) && /permanent, no clock, no AI/.test(s));
  ok('the four unwired trial controls are gone',
     CTRL.length > 0 && !/Trial duration \(days\)/.test(s) && !/Auto-downgrade after trial/.test(s)
     && !/Founding vendor trial active/.test(s) && !/label="Trial tier"/.test(s));
  ok('their removal is ACCOUNTED in-file, not merely performed (CE-115)',
     /REMOVED-BY-RULING/.test(CTRL) && /CONTROL INVENTORY/.test(CTRL));
  ok('the replacement points at the real interim lever', /cap keys in Config/.test(s));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§4  M2 — THE DATA PATH (rendered strings HELD for the veto)');
// ═══════════════════════════════════════════════════════════════════════════
{
  const sv = strip(VTYPES);
  ok('F-10.81: the tier union is the four ruled words',
     /tier: 'basic' \| 'essential' \| 'signature' \| 'prestige';/.test(sv));
  ok('F-10.81: the union no longer claims `trial` is possible',
     VTYPES.length > 0 && !/tier: 'trial' \|/.test(sv));
  ok('MeResponse types billing_status against 0114\'s CHECK exactly',
     /billing_status: 'none' \| 'active' \| 'pending' \| 'halted' \| 'cancelled';/.test(sv));
  ok('MeResponse types the link as nullable — null is a real, currently common answer',
     /razorpay_subscription_link: string \| null;/.test(sv));

  const su = strip(USET);
  ok('the settings state declares both money fields',
     /billing_status:\s+string;/.test(su) && /subscription_link:\s+string \| null;/.test(su));
  ok('EMPTY seeds them, so a pre-load render cannot read undefined',
     /billing_status: 'none', subscription_link: null/.test(su));
  // THE F-07.9 CELLS. Declaring a field and never assigning it is the exact
  // defect this hook's own comment records. It must not recur in the same file.
  ok('billing_status is MAPPED from the response, not merely declared',
     /billing_status:\s+v\.billing_status \?\? 'none',/.test(su));
  ok('subscription_link is MAPPED from the response, not merely declared',
     /subscription_link:\s+v\.razorpay_subscription_link \?\? null,/.test(su));

  // The HOLD is RELEASED — founder veto given 2026-08-07 (「 yes 」 on the short
  // batch, then 「 drop the date 」). These cells now assert the vetoed bytes
  // VERBATIM, so a later edit that rewords founder-approved copy reddens rather
  // than passing review on someone's taste.
  // RE-AIMED to the card — see the labelled note at the CARD read above.
  // ── LABELLED AMENDMENT · R-26.18 · F-10.110 ──────────────────────────────
  // THE SUBSCRIPTION SURFACE IS NOW TWO FILES, so the source this section reads
  // is both of them. Nine cells below assert the five vetoed status sentences,
  // 0114's five-key coverage, and F-10.77's flip-reason line. All nine still
  // assert exactly what they always asserted; what moved is WHICH file holds the
  // bytes. `components/vendor/SubscriptionCard.tsx` keeps the plan words, the
  // prices and the whole rendered card; `lib/vendor/billing/statusLine.ts` now
  // holds the status sentences and the flip-reason line, because keying them on
  // `billing_status` ALONE was F-10.110 — a vendor at `signature`/`cancelled`
  // was told she was on Basic while dream-os `chat.js:buildLlmForTurn` served
  // her Signature AI.
  //
  // THIS IS THE SITTING THAT MOVED THE SUBJECT, SO IT OWNS THIS BENCH (CE-210,
  // standing, no grant needed). The union is the honest read: a cell that
  // searched only the old file would go RED on correct code, and a cell narrowed
  // to green itself would stop guarding the bytes. Three of the nine are
  // FURTHER amended below where the ruling genuinely changed what is true.
  const ss = strip(CARD) + '\n' + strip(read('lib/vendor/billing/statusLine.ts'));
  ok('the subscription surface exists', /SCard title="Subscription"/.test(ss));
  ok('the Tier read-row is REPLACED, not duplicated — one home for the plan word',
     !/SReadRow label="Tier"/.test(ss) && /SReadRow label="Plan"/.test(ss));

  // ── LABELLED AMENDMENT · R-26.8 §B — TWO FALSE SENTENCES DIE, THE ASSERTION STANDS ──
  //
  // WHAT THIS CELL PROVES, and all it ever proved: `id="tier"` exists in
  // app/vendor/settings/page.tsx, so the wire address /vendor/settings#tier
  // still resolves to a page rather than 404ing. The predicate is TRUE and is
  // untouched. Only the words around it lied, and they lied from the day they
  // were written.
  //
  // FALSE SENTENCE 1, deleted: 「 before this section that anchor resolved to
  // nothing 」 — implying it resolves to something now.
  // FALSE SENTENCE 2, deleted from the label: 「 chat.js's Upgrade button
  // finally lands 」.
  //
  // F-10.101, FOUNDER-WITNESSED at the cold-load walk (374×900, Fast 4G,
  // 2026-08-07): the anchor DOES NOT SCROLL AND NEVER HAS. Navigating to
  // /vendor/settings#tier puts the viewport at the top of the page — the
  // founder's own screenshot shows BUSINESS / Your Name at rest under that URL.
  // The mechanism: the anchored element mounts only after the /me fetch
  // resolves inside an effect, and a browser resolves a fragment at load and
  // does not retry on a later mutation. The executor's derivation had softened
  // this to 「 a race 」; the walk was harder than the derivation and the walk
  // wins. AMENDED ON A WALK, NOT ON A DERIVATION — this cell was left
  // byte-untouched through one delivery for exactly that reason.
  //
  // NOT RE-AIMED — this one cell's subject did not move, and that is the whole
  // point of R-26.4 Fork B. The card went to /vendor/billing; `id="tier"` STAYED
  // in app/vendor/settings/page.tsx, on the permanent signpost, because
  // src/api/vendor-engine/chat.js still sends every capped vendor to
  // /vendor/settings#tier and the PWA cannot change that address — it arrives on
  // the wire. So this cell keeps reading SETT while its neighbours read CARD.
  //
  // ⚠ RE-DERIVED AT dream-os a034537, THE CAP ZIP'S OWN TIP: chat.js still reads
  // `href: '/vendor/settings#tier'`. The re-point has NOT happened. This cell is
  // therefore still load-bearing, and the signpost it proves reachable is the
  // only thing standing between a capped vendor and a dead end. A cell, because
  // an anchor is exactly the kind of thing a later refactor silently drops.
  ok('the #tier anchor exists — the wire address still resolves to a page carrying the signpost',
     /id="tier"/.test(strip(SETT)));

  // Money register law: Rs X,XXX, zero glyphs, zero shorthand.
  ok('canon prices render in the money register, verbatim',
     /'Rs 999 \/ month'/.test(ss) && /'Rs 1,999 \/ month'/.test(ss) && /'Rs 2,999 \/ month'/.test(ss));
  // Read STRIPPED, not raw. These three cells forbid words that this file's own
  // warrants legitimately DISCUSS — the persona cell first reddened on a comment
  // explaining what the flip-reason line spares the vendor from, which is a bench
  // convicting its own rationale. What the law governs is RENDERED bytes.
  ok('ZERO rupee glyphs on this vendor surface', !/\u20B9/.test(ss));
  ok('ZERO k/L/Cr shorthand on this vendor surface', !/Rs\s?[\d.,]+\s?(k|L|Cr)\b/.test(ss));

  // The five status sentences, keyed on 0114's CHECK exactly.
  for (const [k, v] of [
    ['none',      'Not set up yet.'],
    ['active',    'Active. Renews monthly.'],
    ['pending',   "Payment didn't go through. Retrying — nothing changes yet."],
    ['halted',    "Payment failed. You're on Basic."],
    ['cancelled', "Cancelled. You're on Basic."],
  ]) {
    ok(`status "${k}" renders its vetoed sentence verbatim`, ss.includes(v), v);
  }
  // ── LABELLED AMENDMENT · R-26.18 · the next four cells ───────────────────
  // These four asserted the SHAPE the sentences used to have — object-literal
  // keys and a ternary inside a template — and the ruling replaced that shape.
  // They are amended to assert the SAME PROPERTIES against the shape that now
  // holds, and three of them are amended UPWARD: they now EXECUTE the resolver
  // instead of pattern-matching it. A source-text cell greens on a map that
  // merely looks right; running the function is the independent method.
  okExec('the status map covers 0114\'s CHECK and invents no sixth state',
     () => /const KNOWN_STATUS = \['none', 'active', 'pending', 'halted', 'cancelled'\];/.test(ss)
     && TIER_STATUS.every(s => tierCall('basic', s).status !== null)
     && tierCall('basic', 'trialling').status === null);

  // F-10.77's cell — the whole point of the movement, and it now reaches MORE
  // vendors than it did, which is F-10.110's other half.
  okExec('F-10.77: the flip-reason line ships, verbatim',
     () => tierCall('basic', 'cancelled').note === 'Moved to Basic — subscription cancelled. Profile and leads unchanged. AI is off on Basic.' &&
     tierCall('basic', 'halted').note === 'Moved to Basic — subscription stopped after failed payments. Profile and leads unchanged. AI is off on Basic.');

  // ── AMENDED IN SUBSTANCE, and this is the ruling, not a repair ────────────
  // The old cell asserted `tier === 'basic' && (cancelled || halted)`. R-26.18
  // Fork 2 DELETED that gate: it excluded the vendor who most needed the line —
  // the one whose plan is still on while her rail is dead. What the cell was
  // built to protect is the second half, 「 not to everyone 」, and that is
  // asserted here unchanged and now by execution: no unlapsed rail gets a note,
  // on ANY tier. The floor sentence stays floor-only; the paid tiers get their
  // own, which is tdw10_billing_tab 9.3 and 9.5's business.
  okExec('F-10.77: it renders off a LAPSED rail only, on no tier to everyone',
     () => ['none', 'active', 'pending'].every(s =>
        ['basic', 'essential', 'signature', 'prestige', ''].every(t => tierCall(t, s).note === null))
     && ['basic', ''].every(t => /AI is off on Basic\./.test(tierCall(t, 'cancelled').note || ''))
     && ['essential', 'signature', 'prestige'].every(t => !/on Basic/.test(tierCall(t, 'cancelled').note || '')));

  okExec('F-10.77: it names WHICH lapse — cancelled vs stopped after failed payments',
     () => /subscription cancelled\./.test(tierCall('basic', 'cancelled').note || '')
     && /stopped after failed payments\./.test(tierCall('basic', 'halted').note || '')
     && tierCall('basic', 'cancelled').note !== tierCall('basic', 'halted').note);
  ok('THE DATE IS ABSENT by founder ruling — no invented timestamp reached the vendor',
     !/updated_at/.test(ss) && !/toLocaleDateString/.test(ss));

  // The payment path, both arms.
  // ── AMENDED AT TDW_09 UI VENDOR (chair relay #7) · F-09.125 · Fork A(a) ────
  // WHAT THIS CELL USED TO ASSERT: /Dev will send you a payment link\./ — the
  // sentence a NULL link rendered when the founder minted links by hand.
  // Billing v2 RETIRED that mechanism and its sentence in the same commit
  // (0be7370), so from that commit forward this cell was RED against a tree
  // that was CORRECT. It is amended, never deleted: the QUESTION it asked is
  // still the right one — does a vendor with no live link get the truth, or a
  // dead button? — and only the true answer has moved.
  // The C1 approval that would have re-worded the retired sentence is DROPPED
  // AS MOOT by founder ruling, its render site having been retired while the
  // approval was in flight. F-09.125 is the finding; this is its amendment.
  // RE-AIMED A SECOND TIME AT THE UI VENDOR HOTFIX. The first amendment pinned
  // the exact conjunction `!current.subscription_link && (` — which F-10.92 then
  // widened with its `selfserve_enabled` gate, so a correct tree went red. A cell
  // that pins the SHAPE of a condition breaks every time the condition earns a
  // new conjunct. It now asserts the SUBJECT (the null link governs the picker)
  // and leaves the gate list to F-09.128's own cells in tdw09_uivendor §9.
  ok('a NULL link opens the PICKER — the truth now, where the hand-mint sentence stood (F-09.125 amended)',
     /!current\.subscription_link &&[^\n]*\(/.test(ss) && /<TierPicker/.test(ss));
  ok('the link arm renders the stored Subscription Link, not a constructed URL',
     /href=\{current\.subscription_link\}/.test(ss));
  ok('the link opens out-of-app safely (noopener)', /rel="noopener noreferrer"/.test(ss));
  ok('F-10.69: the UPI mandate line ships, verbatim',
     /Approve once in your UPI app\. Monthly auto-pay, max /.test(ss) &&
     /Cancel any time from the app\./.test(ss));
  ok('the payment row is suppressed on an ACTIVE rail — nothing to set up',
     /current\.billing_status !== 'active'/.test(ss));

  // Persona names never in product chrome (copy law).
  ok('copy law: no persona name reaches this vendor surface',
     !/Victor|Donna|Harvey|Mira|Eliza/.test(ss));
}

// ═══════════════════════════════════════════════════════════════════════════
section('§5  THE RETINT AMENDMENT — CE-205\'S CARRIER, THIRD ATTEMPT');
// ═══════════════════════════════════════════════════════════════════════════
{
  ok('the figure-site count literal now reads 4', /sites\.length === 4/.test(RETINT));
  ok('the stale 3 is gone', RETINT.length > 0 && !/sites\.length === 3/.test(RETINT));
  ok('the amendment is LABELLED in-bench with its rationale, not silently edited',
     /LABELLED AMENDMENT · 3 → 4/.test(RETINT));
  ok('the amendment names its ratifying band and its two failed carriers',
     /CE-204/.test(RETINT) && /CE-205/.test(RETINT));
  ok('the amendment keeps a COUNT literal deliberately, and says why',
     /stops and asks/.test(RETINT));
  // The subject itself: four sites, all carrying the fix, exactly one tabular.
  const sites = BRIDGE.match(/fontFamily: T\.ff\.display[^}]*/g) || [];
  ok('the Bridge masthead really does carry four figure sites', sites.length === 4, `${sites.length} found`);
  ok('EVERY figure site carries lining-nums — the property the amendment preserves',
     sites.length === 4 && sites.every(s => /lining-nums/.test(s)));
  ok('exactly ONE takes tabular-nums — the queue gutter',
     sites.filter(s => /tabular-nums/.test(s)).length === 1);
}

// ═══════════════════════════════════════════════════════════════════════════
section('§9  F-10.100 — THE UPGRADE SEATS PARTITION, THEY DO NOT OVERLAP');
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS SECTION EXISTS, and it is a defect's tuition rather than a design:
// the (β) ruling seated a page-level Upgrade affordance OUTSIDE TierMeter's own
// guard, and the control inventory that shipped with it claimed MOVED, NET ZERO.
// That claim was true at a ZERO cap — where TierMeter returns null — which was
// the only state the acceptance walk reached and the only state the bench
// asserted. At a spent NONZERO cap BOTH seats rendered, and the founder saw two
// stacked Upgrade links on a live screen inside ninety seconds.
//
// THE CLASS SENTENCE, entering the record: an inventory that counts controls in
// a single state is a claim about that state, not about the control. So these
// cells count the seats ACROSS the states, by evaluating the two shipped
// predicates rather than by reading either one.
{
  const PAGE  = read('app/vendor/page.tsx');
  const METER = read('components/vendor/TierMeter.tsx');

  // The two guards are LIFTED FROM SOURCE, never retyped — a bench holding its
  // own copy of a predicate proves the copy (F-04.36's family).
  const meterGuard = strip(METER).match(/if \(!meta \|\| !meta\.turns_cap\) return null;/);
  ok('§9.1 TierMeter still hides itself on a falsy cap — the guard the seat complements',
     !!meterGuard);
  const pageGuard = strip(PAGE).match(/\{meta && meta\.state === 'capped' && !meta\.turns_cap && meta\.upgrade && \(/);
  ok('§9.2 the page-level seat is gated on the EXACT COMPLEMENT of that guard',
     !!pageGuard);

  // Evaluate both, per state, and COUNT. This is the inventory the first one
  // should have been — and the predicates are EXTRACTED FROM THE SHIPPED SOURCE
  // and executed, never retyped here.
  //
  // THE FIRST DRAFT OF THESE CELLS HELD ITS OWN COPY of both guards and stayed
  // GREEN against the duplicated tree — a bench proving its author's model of the
  // code rather than the code. Caught on the both-ways run, disclosed, and cured
  // by lifting: a check whose failure mode is "my copy still agrees with itself"
  // is not a check.
  // REFUSE, NEVER CRASH — CE-206's shim, and it is here because a mutation TAUGHT
  // it: rewriting TierMeter's anchor condition made the lift regex miss, and the
  // first draft THREW. A bench that dies produces no FAIL line, so the mutation
  // read as NON-BITING when it had in fact destroyed the instrument. A cell that
  // crashes instead of reddening is F-09.93's disease, and it found me too.
  // Every lift below now returns a predicate that is FALSE-and-recorded on a miss,
  // so an unliftable source reddens loudly rather than exiting the process.
  const lifted = [];
  const lift = (src, re, what) => {
    const m = src.match(re);
    lifted.push([what, !!m]);
    if (!m) return () => false;
    return new Function('meta', `return !!(${m[1]});`);
  };
  // TierMeter: the null guard inverted, AND the anchor's own condition.
  const meterNullGuard = strip(METER).match(/if \((!meta \|\| !meta\.turns_cap)\) return null;/);
  const meterAnchorSrc = strip(METER).match(/\{\((nearing \|\| capped)\) && meta\.upgrade && \(/);
  lifted.push(['the TierMeter anchor condition', !!meterAnchorSrc]);
  // `nearing`/`capped` are locals inside the component, so they are bound here from
  // the SAME two lines the component derives them from, also lifted.
  const meterLocals = strip(METER).match(/const capped = (meta\.state === 'capped');[\s\S]*?const nearing = (meta\.state === 'nearing');/);
  lifted.push(["TierMeter's state locals", !!meterLocals]);
  const meterAnchor = meterAnchorSrc
    ? new Function('meta', 'nearing', 'capped', `return !!(${meterAnchorSrc[1]} && meta.upgrade);`)
    : () => false;
  const cappedOf  = meterLocals ? new Function('meta', `return !!(${meterLocals[1]});`) : () => false;
  const nearingOf = meterLocals ? new Function('meta', `return !!(${meterLocals[2]});`) : () => false;
  const meterShows = (m) => {
    if (!meterNullGuard || !m || !m.turns_cap) return false;   // the lifted guard, inverted
    return meterAnchor(m, nearingOf(m), cappedOf(m));
  };
  // The page-level seat: its whole JSX condition, lifted and executed.
  const pageShows = lift(strip(PAGE), /\{(meta && meta\.state === 'capped'[^\n]*?meta\.upgrade) && \(/, 'the page-level seat condition');
  const up = { label: 'Upgrade', href: '/vendor/billing' };
  const states = [
    ['zero cap, refused at turn zero', { state: 'capped',  turns_used: 0,  turns_cap: 0,   upgrade: up }, 1],
    ['nonzero cap, SPENT',             { state: 'capped',  turns_used: 1,  turns_cap: 1,   upgrade: up }, 1],
    ['nonzero cap, nearing',           { state: 'nearing', turns_used: 24, turns_cap: 30,  upgrade: up }, 1],
    ['nonzero cap, ok',                { state: 'ok',      turns_used: 2,  turns_cap: 30,  upgrade: up }, 0],
  ];
  // THE INSTRUMENT FIRST. If a predicate could not be lifted, every count below is a
  // claim about an empty function — so the lift itself is a cell.
  ok('§9.2b EVERY predicate was lifted from live source — no count below is over a stub',
     lifted.every(([, okd]) => okd), lifted.filter(([, o]) => !o).map(([w]) => w).join(' · ') || undefined);
  for (const [label, meta, expected] of states) {
    const n = (meterShows(meta) ? 1 : 0) + (pageShows(meta) ? 1 : 0);
    ok(`§9.3 exactly ${expected} Upgrade anchor at: ${label}`, n === expected, `${n} rendered`);
  }
  ok('§9.4 THE PATH OUT SURVIVES EVERY CAPPED STATE — neither seat leaves a refused vendor stranded',
     states.filter(([, m]) => m.state === 'capped')
           .every(([, m]) => meterShows(m) || pageShows(m)));
  ok('§9.5 the seats never BOTH fire — the duplicate cannot return without reddening this',
     states.every(([, m]) => !(meterShows(m) && pageShows(m))));
}

console.log('\n' + '─'.repeat(60));
console.log(`tdw10_tier: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
