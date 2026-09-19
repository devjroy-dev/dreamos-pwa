'use strict';
// scripts/b87_lcv_p2_panel_bench.js · TDW CE-44 · LCV-1 · LC-Victor P2, THE PANEL CUT (dreamos-pwa). Rung b87.
//
// WHAT IT HOLDS. F-44.43's cure and its class. Since dream-os cb84f6f serves the `listener` role
// on the working-room vendor lanes, the switchboard drew it through a catch-all ternary
// (ModelRoutesPanel.tsx:115 at c82753a1) that read `nudge_provider`: a row named by its raw key
// that could not show the founder's own choice back to him. The cure: an explicit role-to-field
// map; ROLE_NAME `listener: 'Listener'` on wa_vendor and pwa_vendor; ModelRole gains 'listener';
// and the class rule, AN UNKNOWN ROLE RENDERS NO ROW (the console names it).
//
// DRIVEN IN THE REAL PANEL (C-43.18): `next dev` with the admin door mocked at the network, a
// real headless Chromium resolved the pwa's way (CHROME_BIN, then @sparticuz/chromium; never
// the executor's own path, e-44.18), both themes. Without a browser the room cells are DECLARED
// RED, never skipped. One mutation restores the catch-all and must turn the unknown-role cell red;
// the mutated file is restored byte for byte in a `finally` and its hash re-checked.
//
// THE EXIT CODE IS THE VERDICT.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const P = (rel) => path.join(ROOT, rel);
const read = (rel) => fs.readFileSync(P(rel), 'utf8');
let pass = 0; let fail = 0; const failed = [];
function ok(cond, name) { if (cond) { pass += 1; console.log(`  PASS  ${name}`); } else { fail += 1; failed.push(name); console.log(`  FAIL  ${name}`); } }
const sec = (t) => console.log(`\n§${t}`);

(async () => {
  const PANEL = 'app/admin/switchboard/ModelRoutesPanel.tsx';
  const panel = read(PANEL);
  const copy = read('lib/admin-api/modelRoutesCopy.ts');
  const api = read('lib/admin-api/index.ts');

  sec('1  the source');
  ok(/const ROLE_FIELD: Record<string, string> = \{\n  provider: 'provider',\n  donna:    'donna_provider',\n  nudge:    'nudge_provider',\n  listener: 'listener_provider',\n\};/.test(panel), '1.1 an explicit role-to-field map carries all four roles');
  ok(!/: 'nudge_provider';/.test(panel), '1.2 no catch-all to nudge_provider remains');
  ok(/const pf = ROLE_FIELD\[role\];/.test(panel), '1.3 RoleRow reads its field from the map');
  ok(/lane\.roles\.filter\(role => knownRole\(lane, role\)\)\.map\(role =>/.test(panel), '1.4 the lane renders only roles the map knows');
  ok(/export type ModelRole = 'provider' \| 'donna' \| 'nudge' \| 'listener';/.test(api), "1.5 ModelRole carries 'listener'");
  ok(/wa_vendor:\s+\{ provider: 'Victor', donna: 'Donna', listener: 'Listener' \}/.test(copy) && /pwa_vendor:\s+\{ provider: 'Victor', donna: 'Donna', listener: 'Listener' \}/.test(copy),
    "1.6 ROLE_NAME names it 'Listener' on wa_vendor and pwa_vendor (the founder: \"listen-yes\")");
  ok(!/wa_marketing:[^\n]*listener|wa_couple:[^\n]*listener|harvest:[^\n]*listener|bride_app:[^\n]*listener/.test(copy), '1.7 and on no other surface');

  sec('2  the real panel, both themes (C-43.18)');
  const PORT = 3989;
  const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', String(PORT)], {
    cwd: ROOT, stdio: 'ignore', detached: true,
    env: { ...process.env, NEXT_PUBLIC_API_BASE: `http://localhost:${PORT}/__api` },
  });
  const up = async () => {
    for (let i = 0; i < 90; i += 1) {
      try { const r = await fetch(`http://localhost:${PORT}/`); if (r) return true; } catch (_e) { /* not yet */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
  };
  const probe = (mode) => {
    const r = spawnSync('node', [P('scripts/lib/lcv_p2_panel_probe.mjs'), String(PORT), mode], { encoding: 'utf8', timeout: 240000 });
    if (r.status === 3) return { noBrowser: true, text: r.stdout };
    try { return JSON.parse(String(r.stdout).trim().split('\n').pop()); } catch (_e) { return { error: `${r.status} ${String(r.stderr).slice(0, 300)}` }; }
  };
  const rowsOf = (rows, tier) => rows.filter((x) => x.tier === tier).map((x) => x.label.split(' ')[0]);
  const shownOf = (rows, tier, name) => (rows.find((x) => x.tier === tier && x.label.split(' ')[0] === name) || {}).shown;
  const noOracle = (o) => !!o && Array.isArray(o.before) && o.before.length > 0 && !o.before.some((x) => /^oracle/i.test(x.label));
  const MUT_FROM = "  const pf = ROLE_FIELD[role];\n";
  const MUT_TO = "  const pf = ROLE_FIELD[role] || 'nudge_provider';\n";
  const FILTER_FROM = 'lane.roles.filter(role => knownRole(lane, role)).map(role =>';
  const FILTER_TO = 'lane.roles.map(role =>';
  const shaBefore = crypto.createHash('sha256').update(panel).digest('hex');
  try {
    if (!(await up())) throw new Error('next dev did not come up');
    await new Promise((r) => setTimeout(r, 4000));
    for (const mode of ['dark', 'light']) {
      const o = probe(mode);
      if (o.noBrowser) { ok(false, `2.0 a browser is available to drive the panel (C-43.18). Tried: ${o.text}`); break; }
      if (o.error) { ok(false, `2.0 the probe ran (${mode}): ${o.error}`); continue; }
      ok(o.browser === 'CHROME_BIN' || o.browser === '@sparticuz/chromium', `2.1 ${mode}: the browser resolved the pwa's way (${o.browser})`);
      ok(shownOf(o.before, 'Signature', 'Listener') === 'DeepSeek', `2.2 ${mode}: the Signature Listener shows its OWN split (DeepSeek), not the primary`);
      ok(shownOf(o.before, 'Basic', 'Listener') === 'Anthropic' && shownOf(o.after, 'Basic', 'Listener') === 'DeepSeek',
        `2.3 ${mode}: after a pick the Basic Listener shows it (Anthropic following, then DeepSeek)`);
      ok(o.posts.length === 1 && o.posts[0].key === 'model.wa_vendor.basic' && o.posts[0].role === 'listener' && o.posts[0].provider === 'deepseek',
        `2.4 ${mode}: the pick posts role 'listener' to that lane`);
      ok(noOracle(o), `2.5 ${mode}: a lane served an invented role renders NO row for it`);
      ok(o.warnings.some((w) => /unknown role "oracle"/.test(w)), `2.6 ${mode}: and the console names it`);
      ok(JSON.stringify(rowsOf(o.before, 'Advisor')) === JSON.stringify(['Victor', 'Donna']), `2.7 ${mode}: the Advisor lane shows no Listener row`);
      ok(rowsOf(o.before, 'Basic').includes('Listener') && rowsOf(o.before, 'Signature').includes('Listener'), `2.8 ${mode}: the working-room lanes name it Listener`);
    }
    sec('3  the mutation: the catch-all restored');
    const mutated = panel.replace(MUT_FROM, MUT_TO).replace(FILTER_FROM, FILTER_TO);
    ok(mutated !== panel && mutated.includes(MUT_TO) && mutated.includes(FILTER_TO), '3.0 the mutation applies');
    fs.writeFileSync(P(PANEL), mutated);
    await new Promise((r) => setTimeout(r, 6000));
    const m = probe('dark');
    ok(!!m && Array.isArray(m.before) && m.before.length > 0 && noOracle(m) === false, '3.1 M1 restoring the catch-all turns the unknown-role cell red (an oracle row renders)');
  } catch (e) {
    ok(false, `2.x the panel run: ${String(e && e.message).split('\n')[0]}`);
  } finally {
    fs.writeFileSync(P(PANEL), panel);
    try { process.kill(-dev.pid); } catch (_e) { /* gone */ }
  }
  const shaAfter = crypto.createHash('sha256').update(read(PANEL)).digest('hex');
  ok(shaAfter === shaBefore, '3.2 the mutated file is restored byte for byte');

  console.log(`\nb87 · ${pass} pass · ${fail} fail`);
  if (fail) { console.log('FAILED: ' + failed.join(' | ')); process.exit(1); }
  process.exit(0);
})().catch((e) => { console.log(`b87 CRASHED: ${(e && e.stack) || e}`); process.exit(1); });
