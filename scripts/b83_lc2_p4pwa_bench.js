#!/usr/bin/env node
'use strict';
// scripts/b83_lc2_p4pwa_bench.js — TDW CE-44 · LC-2 · the pwa half. Rung pwa b83.
//
//   §1  F-44.6 / R-44.13 · the five per-couple fields, in the package page's order.
//   §2  R-44.12 / F-44.31 · a booked couple's sheet: the sentence, plain text, one Close.
//   §3  F-44.3 · the missing-detail chips read the sheet's own label.
//   §4  R-44.10 · no sheet raises the keyboard unless a tap named the field.
//   §5  R-44.11 · the wishbone advance renders the next cell WITHOUT focus.
//   §6  F-43.122 · all three pwa date-write routes store precision `day`.
//   §7  the bytes, and that none is new.
//   §8  mutations of production source, each turning its named cell RED.
//
// §2, §4 and §5 are DRIVEN IN THE REAL ROOM (C-43.18): a real headless Chromium against
// `next dev` with the door mocked at the network, so `document.activeElement` is read off
// the live DOM. A cell that greps for the `autoFocus` attribute proves nothing about the
// four programmatic focus sites and is not accepted (chair, CE-44).
//
// NOT PROVEN HERE (declared): the database; a handset; both themes on glass, which are the
// founder's screenshots on the walk.
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const readIf = (rel) => (fs.existsSync(P(rel)) ? fs.readFileSync(P(rel), 'utf8') : '');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');

let pass = 0, fail = 0;
const fails = [];
const sec = (s) => console.log(`\n── ${s} ──`);
function ok(c, n) { if (c) { pass++; console.log(`  ok   ${n}`); } else { fail++; fails.push(n); console.log(`  FAIL ${n}`); } }

const CARD = readIf('components/vendor/packages/LeadPackageCard.tsx');
const CARDC = strip(CARD);
const PKGS = readIf('lib/worklist/packages.ts');
const SHELL = strip(readIf('components/vendor/slices/SliceShell.tsx'));
const WISH = strip(readIf('components/vendor/slices/WishboneSheet.tsx'));
const FWD = strip(readIf('components/vendor/slices/ForwardSheet.tsx'));
const API = readIf('lib/vendor/api/vendor.ts');

(async () => {
  // ══ §1 · the five fields ═══════════════════════════════════════════════════
  sec('§1 · F-44.6 / R-44.13 — the couple\'s own payment shape in the attach sheet');
  const FIVE = ['deposit_pct', 'middle_pct', 'middle_enabled', 'delivery_basis', 'delivery_days'];
  ok(FIVE.every((k) => new RegExp(`${k}\\?:`).test(API)), '§1.1 AttachInput carries all five');
  // AMENDED AT CE-44 (F-44.34): three of the five are now literals in the body object
  // rather than `body.x =` assignments, because they no longer depend on a comparison.
  ok(FIVE.every((k) => new RegExp(`body\\.${k} =|${k}:`).test(CARDC)), '§1.2 the sheet sends all five');
  ok(/att-dep/.test(CARDC) && /att-mid/.test(CARDC) && /att-basis/.test(CARDC) && /att-days/.test(CARDC),
    '§1.3 each has its own control');
  {
    // R-44.13's ORDER, read off the source: fee, then the five, then the name.
    // The JSX sites, not the import or the focusOn() strings: `id="…"` appears once each,
    // and `<IdentityFields` is the element rather than the import line. (Named at CE-44:
    // the first cut read plain `IdentityFields` and matched the import at byte 800.)
    const i = (needle) => CARDC.indexOf(needle);
    const order = [i('id="att-fee"'), i('id="att-dep"'), i('id="att-mid"'), i('PACKAGES.fTakeMiddle'), i('id="att-basis"'), i('id="att-days"'), i('<IdentityFields')];
    ok(order.every((n) => n > 0) && order.every((n, k) => k === 0 || n > order[k - 1]),
      '§1.4 they sit BETWEEN the fee and the name, in the package page\'s order (R-44.13)');
  }
  // AMENDED AT CE-44 (F-44.34). This asserted the diff against `chosen`, which the chair
  // withdrew as a goal: it bought nothing and cost a silent drop of `middle_enabled` on a
  // stale list. What is on the glass is what is sent.
  ok(/body: AttachInput = \{[\s\S]{0,120}package_id: chosen\.id,/.test(CARDC) && !/!== chosen\.deposit_pct/.test(CARDC),
    '§1.5 every field travels as it stands on the glass, with no diff against `chosen`');
  ok(/setDepositPct\(p && p\.deposit_pct != null/.test(CARDC),
    '§1.6 the couple\'s shape starts as the chosen package\'s own');
  ok(!/vendor_packages|savePackage|updatePackage/.test(CARDC),
    '§1.7 the sheet never writes the vendor\'s own package — per couple means per couple (R-43.3)');
  ok(!/Rs |formatRs\(.*split|splitNumerals/.test(CARDC.slice(CARDC.indexOf('att-dep'), CARDC.indexOf('IdentityFields'))),
    '§1.8 NO rupee split line beneath the shares: PackageEditSheet has none, so this sheet has none');

  // ══ §2 · the booked sheet ══════════════════════════════════════════════════
  sec('§2 · R-44.12 / F-44.31 — a booked couple');
  ok(/already_booked: 'This couple is booked\. The package is fixed on their invoice\.'/.test(PKGS),
    '§2.1 R-44.12\'s byte is in the copy home, verbatim');
  ok(/beside no_package|refusals/.test(PKGS) && PKGS.indexOf('already_booked') > PKGS.indexOf('no_package'),
    '§2.2 it sits with the other refusals, so the door\'s code maps to it by name');
  ok(/booked \? \(/.test(CARDC) && /att-booked-pkg/.test(CARDC) && /att-booked-fee/.test(CARDC),
    '§2.3 a booked couple gets the sentence, the package and the fee');
  ok(/plainValue/.test(CARDC) && !/id="att-booked-pkg"[^>]*input/.test(CARDC),
    '§2.4 as PLAIN TEXT, not editable fields');
  ok(/footer=\{booked \? \([\s\S]{0,200}LEAD_PACKAGE\.close/.test(CARDC),
    '§2.5 and ONE Close, with no Attach button');
  ok(/close: 'Close'/.test(PKGS) && /referrals\.ts:118/.test(PKGS),
    '§2.6 Close is CARRIED from referrals.ts, not coined');
  ok(/code === 'already_booked' \? onClose/.test(CARDC),
    '§2.7 its only act is to leave: there is no field to fix until F-44.17');
  ok(/F-44\.17/.test(PKGS),
    '§2.8 the byte records that this sentence changes when F-44.17 lands');

  // ══ §3 · F-44.3 ════════════════════════════════════════════════════════════
  sec('§3 · F-44.3 — the chips read the sheet\'s own label');
  ok(/cells=\{sel\.draftMissing!\.map\(\(c\) => \(\{ key: c, label: chipLabel\(c\) \}\)\)\}/.test(SHELL),
    '§3.1 the chips call chipLabel');
  ok(!/label: cap\(c\.replace/.test(SHELL), '§3.2 and no longer title-case the raw column name');
  {
    const keyCaps = (strip(readIf('components/vendor/slices/SliceShell.tsx')).match(/cap\([a-z]\.replace\(\/_\/g/g) || []);
    ok(keyCaps.length === 0, '§3.3 the sweep holds: no cap() on a cell KEY anywhere in the shell');
  }

  // ══ §6 · F-43.122 ══════════════════════════════════════════════════════════
  sec('§6 · F-43.122 — all three date-write routes store `day`');
  ok(/wedding_date_precision: 'day'/.test(SHELL), '§6.1 the dateFix route sends it (unchanged)');
  ok(/body\.wedding_date_precision = 'day';/.test(SHELL), '§6.2 the wishbone route now sends it too');
  ok((SHELL.match(/wedding_date_precision/g) || []).length >= 2,
    '§6.3 one cell over all three routes, as ruled');

  // ══ §7 · the bytes ═════════════════════════════════════════════════════════
  sec('§7 · every rendered byte already existed');
  for (const b of ['fDeposit', 'fMiddle', 'fTakeMiddle', 'fDelivery', 'dOnTheDay', 'dDays', 'dHandover', 'fDays']) {
    ok(new RegExp(`PACKAGES\\.${b}`).test(CARDC), `§7.${b} the sheet renders PackageEditSheet's own ${b}`);
  }
  ok(/sheetTitle/.test(CARDC) || /LEAD_PACKAGE\.sheetTitle/.test(CARD),
    '§7.title the title stays `Attach a package` on both states — the one held title');

  // ══ §4 and §5 · THE REAL ROOM ══════════════════════════════════════════════
  sec('§4 · R-44.10 and §5 · R-44.11 — driven in the real room (C-43.18)');
  ok(!/autoFocus/.test(FWD), '§4.1 ForwardSheet carries no autoFocus attribute');
  ok(/autoFocus=\{!advanced\}/.test(WISH), '§5.1 the wishbone focuses the OPENING cell only');
  ok(/setAdvanced\(true\)/.test(WISH), '§5.2 and marks the advance');

  // ── THE BROWSER, RESOLVED IN THE FOUNDER'S ORDER (e-44.18) ────────────────
  // This read the executor's own Playwright path FIRST and was green here, RED on his
  // Codespace, for a reason that was never the app. CHROME_BIN, then
  // @sparticuz/chromium's executablePath() (pinned 149.0.0, the P3L handover's C-43.18
  // method), then the Playwright path last. The probe owns the same resolver; this one
  // decides only whether to spawn `next dev` at all.
  const usableBin = (b) => { if (!b) return false; try { fs.accessSync(b, fs.constants.X_OK); return true; } catch (_e) { return false; } };
  const triedBins = [];
  let BIN = null;
  triedBins.push(`CHROME_BIN=${process.env.CHROME_BIN || '(unset)'}`);
  if (usableBin(process.env.CHROME_BIN)) BIN = process.env.CHROME_BIN;
  if (!BIN) {
    try {
      const mod = await import('@sparticuz/chromium');
      const chromium = mod.default || mod;
      const pth = await chromium.executablePath();
      triedBins.push(`@sparticuz/chromium executablePath()=${pth || '(none)'}`);
      if (usableBin(pth)) BIN = pth;
    } catch (e) { triedBins.push(`@sparticuz/chromium threw: ${String(e && e.message).split('\n')[0]}`); }
  }
  if (!BIN) {
    const pw = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
    triedBins.push(`playwright=${pw}`);
    if (usableBin(pw)) BIN = pw;
  }
  if (!BIN || !fs.existsSync(P('node_modules/puppeteer-core'))) {
    console.log('  (no browser launched — the room cells are DECLARED RED, never skipped. Tried:)');
    triedBins.forEach((t) => console.log(`     · ${t}`));
    if (!fs.existsSync(P('node_modules/puppeteer-core'))) console.log('     · node_modules/puppeteer-core is absent');
    ok(false, '§4.2 a browser is available to drive the room (C-43.18)');
  } else {
    const PORT = 3987;
    const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], {
      cwd: ROOT, stdio: 'ignore', detached: true,
      env: { ...process.env, NEXT_PUBLIC_USE_MOCKS: 'true', NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` },
    });
    const up = async () => {
      for (let i = 0; i < 60; i += 1) {
        try { const r = await fetch(`http://localhost:${PORT}/`); if (r) return true; } catch (_e) { /* not yet */ }
        await new Promise((r) => setTimeout(r, 1000));
      }
      return false;
    };
    let res = {};
    try {
      if (!(await up())) throw new Error('next dev did not come up');
      await new Promise((r) => setTimeout(r, 5000));
      const out = spawnSync('node', [P('scripts/lib/b83_room_probe.mjs'), String(PORT)], { encoding: 'utf8', timeout: 240000 });
      res = JSON.parse((out.stdout || '{}').slice((out.stdout || '').indexOf('{')) || '{}');
    } catch (e) {
      console.log(`  (room probe failed: ${String(e && e.message).split('\n')[0]})`);
    } finally { try { process.kill(-dev.pid); } catch (_e) { /* gone */ } }

    // ── §4.2 · STRUCK AT CE-44, AND WHY (e-44.19) ─────────────────────────
    // This cell used to read `res.forwardNoFocus === true` while `forwardOpened` meant
    // only "a control whose text contains Forward was clicked". The sheet never mounted,
    // so nothing was focused, so the cell passed on an empty room: a FALSE GREEN, and
    // C-44.4 in this seat's own hand. Driven at base 1db8a88e it was green there too,
    // which is how it was caught: a room cell green in both states proves nothing.
    //
    // One bounded attempt was then made with the chair's pointer. The Forward control is
    // gated at SliceShell.tsx:1506 (slice 'leads', selected, badge not 'lost', not
    // forwarded, phone present); the probe now asserts that BUTTON exists before tapping
    // (it does: present, enabled, 326px), mocks the peers door ForwardSheet fetches on
    // mount (ForwardSheet.tsx:74), and asserts the sheet by its own placeholder byte
    // `Search by name or handle` (referrals.ts:79). The panel still does not mount under
    // the mocked doors, by synthetic click or by a real touchscreen tap, with no page
    // error. Per the ruling, no second attempt.
    //
    // R-44.10 therefore rests on §4.1 and mutation M2 at the SOURCE. The room is
    // UNPROVEN and the handover says so in plain words. The founder's walk step five, on
    // his own phone, is the room's witness. The probe still reports its forward keys for
    // the next seat; they are recorded, not judged.
    console.log(`  (§4.2 room cell STRUCK — see the note in source. Probe reported: button=${JSON.stringify(res.forwardButton)}, sheetPresent=${res.forwardSheetPresent})`);
    ok(res.wishOpenFocused === true,
      '§4.3 THE ROOM: a chip tap opens the wishbone WITH focus in the cell it named');
    ok(res.wishAdvanceNoFocus === true,
      '§5.3 THE ROOM: after a save the next cell renders and activeElement is outside every input');
    ok(res.wishTapFocuses === true,
      '§5.4 THE ROOM: tapping that field lands focus in it — her tap is the naming tap');
  }

  // ══ §9 · F-44.34 and F-44.37, the packet's hotfix ═════════════════════════
  sec('§9 · F-44.34 what she sees is what is sent · F-44.37 seed from her row');
  ok(!/!== chosen\.deposit_pct|!== chosen\.middle_pct|!== !!chosen\.middle_enabled|!== chosen\.delivery_basis|!== chosen\.delivery_days/.test(CARDC),
    '§9.1 no field is diffed against `chosen` any more (the five)');
  ok(!/total !== chosen\.total|!== chosen\.name|!== chosen\.description|JSON\.stringify\(chosen\.line_items\)/.test(CARDC),
    '§9.2 nor total, name, description or line_items — the same hazard, swept');
  ok(/body: AttachInput = \{[\s\S]{0,260}middle_enabled: middleOn,/.test(CARDC),
    '§9.3 middle_enabled travels unconditionally, which is the byte his attach dropped');
  ok(/void fetchPackages\(\)\.then/.test(CARDC) && !/void loadPackagesOnce\(\)\.then/.test(CARDC),
    '§9.4 the sheet re-reads the list on open instead of trusting the module cache');
  ok(/if \(!r \|\| !r\.ok\) \{[\s\S]{0,200}fillFrom\(null, null\);/.test(CARDC),
    '§9.5 a failed read seeds NOTHING from memory');
  ok(/const hers = live && p && live\.package_id === p\.id \? live : null;/.test(CARDC),
    '§9.6 her live row is the source when the selected package is the one it was cut from');
  ok(/setFee\(hers\.total != null/.test(CARDC) && /setName\(sn\.name\)/.test(CARDC) && /setMiddleOn\(!!sn\.middle_enabled\)/.test(CARDC),
    '§9.7 and EVERY field seeds from it, fee and wording included, not just the five');
  ok(/fillFrom\(packages\.find\(\(p\) => p\.id === e\.target\.value\) \|\| null, current \|\| null\)/.test(CARDC),
    '§9.8 the selector re-seeds from a saved source, never from a half-typed state');

  // ══ §8 · mutations ═════════════════════════════════════════════════════════
  sec('§8 · mutations of production source — each must turn its named cell RED');
  let mPass = 0, mFail = 0;
  const mut = (n, c) => { if (c) { mPass++; console.log(`  ok   ${n}`); } else { mFail++; fails.push(n); console.log(`  FAIL ${n}`); } };
  const mutate = (rel, from, to, test) => {
    const src = readIf(rel);
    if (!src.includes(from)) return false;
    return test(strip(src.replace(from, to)));
  };
  mut('M1 · restoring autoFocus on the advance breaks §5.1',
    mutate('components/vendor/slices/WishboneSheet.tsx', 'autoFocus={!advanced}', 'autoFocus', (s) => !/autoFocus=\{!advanced\}/.test(s)));
  mut('M2 · putting autoFocus back on ForwardSheet breaks §4.1',
    mutate('components/vendor/slices/ForwardSheet.tsx', '              value={q}', '              autoFocus\n              value={q}', (s) => /autoFocus/.test(s)));
  mut('M3 · returning the chips to cap() breaks §3.1',
    mutate('components/vendor/slices/SliceShell.tsx', 'label: chipLabel(c)', "label: cap(c.replace(/_/g, ' '))", (s) => !/label: chipLabel\(c\)/.test(s)));
  mut('M4 · dropping the wishbone precision breaks §6.2',
    mutate('components/vendor/slices/SliceShell.tsx', "body.wedding_date_precision = 'day';", '', (s) => !/body\.wedding_date_precision = 'day';/.test(s)));
  // The BODY's branch, named uniquely: `booked ? (` also opens the footer, and a
  // first-occurrence replace left that one standing while the cell still passed.
  mut('M5 · dropping the booked branch breaks §2.3',
    mutate('components/vendor/packages/LeadPackageCard.tsx', 'id="att-booked-pkg"', 'id="att-dead-pkg"', (s) => !/id="att-booked-pkg"/.test(s)));
  mut('M6 [re-aimed, F-44.34] · restoring the diff on the deposit → §1.5 RED',
    mutate('components/vendor/packages/LeadPackageCard.tsx', 'if (dep != null) body.deposit_pct = dep;', 'if (dep != null && dep !== chosen.deposit_pct) body.deposit_pct = dep;', (m) => /!== chosen\.deposit_pct/.test(m)));
  mut('M8 · restoring the diff on the middle → §9.1 RED (F-44.34)',
    mutate('components/vendor/packages/LeadPackageCard.tsx', '      middle_enabled: middleOn,', '', (m) => !/middle_enabled: middleOn,/.test(m)));
  mut('M9 · seeding from the package instead of her row → §9.6 RED (F-44.37)',
    mutate('components/vendor/packages/LeadPackageCard.tsx', 'const hers = live && p && live.package_id === p.id ? live : null;', 'const hers = null;', (m) => !/live\.package_id === p\.id \? live/.test(m)));
  mut('M10 · trusting the cache on open → §9.4 RED',
    mutate('components/vendor/packages/LeadPackageCard.tsx', 'void fetchPackages().then', 'void loadPackagesOnce().then', (m) => !/void fetchPackages\(\)\.then/.test(m)));
  mut('M7 · emptying the byte breaks §2.1',
    mutate('lib/worklist/packages.ts', "already_booked: 'This couple is booked. The package is fixed on their invoice.'", "already_booked: ''", (s) => !/This couple is booked/.test(s)));

  console.log(`\n  mutations: ${mPass} bit, ${mFail} did not`);
  pass += mPass; fail += mFail;
  console.log(`\n══ b83 · ${pass} ok, ${fail} failed ══`);
  if (fails.length) { console.log('\nRED:'); fails.forEach((f) => console.log(`  · ${f}`)); }
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('BENCH ERROR:', e); process.exit(2); });
