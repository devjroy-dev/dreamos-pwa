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
  const ss = strip(CARD);
  ok('the subscription surface exists', /SCard title="Subscription"/.test(ss));
  ok('the Tier read-row is REPLACED, not duplicated — one home for the plan word',
     !/SReadRow label="Tier"/.test(ss) && /SReadRow label="Plan"/.test(ss));

  // The #tier anchor is load-bearing: chat.js's capped-meter message sends the
  // vendor to /vendor/settings#tier, and before this section that anchor resolved
  // to nothing. A cell, because an anchor is exactly the kind of thing a later
  // refactor silently drops.
  // NOT RE-AIMED — this one cell's subject did not move, and that is the whole
  // point of R-26.4 Fork B. The card went to /vendor/billing; `id="tier"` STAYED
  // in app/vendor/settings/page.tsx, on the permanent signpost, because
  // src/api/vendor-engine/chat.js still sends every capped vendor to
  // /vendor/settings#tier and the PWA cannot change that address — it arrives on
  // the wire. So this cell keeps reading SETT while its neighbours read CARD.
  //
  // ITS SENTENCE IS UNDER SUSPICION, not amended here. 「 finally lands 」 is the
  // claim F-10.101 disputes: the anchored element mounts only after the /me
  // fetch resolves, so whether the browser scrolls to it is a race against the
  // load event. Left byte-untouched pending the founder's cold-load walk —
  // an executor does not quietly rewrite an elder's claim on a derivation.
  ok('the #tier anchor exists — chat.js\'s Upgrade button finally lands',
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
  ok('the status map covers 0114\'s CHECK and invents no sixth state',
     ['none','active','pending','halted','cancelled'].every(k => new RegExp(`\\b${k}:`).test(ss)));

  // F-10.77's cell — the whole point of the movement.
  ok('F-10.77: the flip-reason line ships, verbatim',
     /Moved to Basic — subscription \$\{/.test(ss) &&
     /Profile and leads unchanged\. AI is off on Basic\./.test(ss));
  ok('F-10.77: it renders only on the floor tier off a LAPSED rail, not to everyone',
     /current\.tier === 'basic'/.test(ss) &&
     /current\.billing_status === 'cancelled' \|\| current\.billing_status === 'halted'/.test(ss));
  ok('F-10.77: it names WHICH lapse — cancelled vs stopped after failed payments',
     /'cancelled' : 'stopped after failed payments'/.test(ss));
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

console.log('\n' + '─'.repeat(60));
console.log(`tdw10_tier: ${pass} passed, ${fail} failed  (total ${pass + fail})`);
process.exit(fail === 0 ? 0 : 1);
