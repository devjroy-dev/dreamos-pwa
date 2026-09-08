#!/usr/bin/env node
// scripts/b61_mutations.js — the both-ways half of b61 (CE-41 seat F, F2).
// Each mutation edits PRODUCTION code in a scratch copy; the named cell must RED.
//
// M1–M4 are the four ways this panel could grow a second copy of the routing map,
// which is the defect that makes a glass lie about a wire. M9–M11 are the three
// ways it could tell the founder something untrue about his own switch.
'use strict';
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const PANEL = 'app/admin/switchboard/ModelRoutesPanel.tsx';
const COPY  = 'lib/admin-api/modelRoutesCopy.ts';
const API   = 'lib/admin-api/index.ts';
const PAGE  = 'app/admin/switchboard/page.tsx';

const MUT = [
  ['M1 the panel grows a lane key of its own', PANEL,
    "  const flat = lanes.length === 1 && lanes[0].tier === 'default' && lanes[0].roles.length === 1;",
    "  const flat = lanes.length === 1 && lanes[0].key === 'model.harvest.default';",
    'no `model.<surface>.<tier>` literal anywhere in the three files'],
  ['M2 the panel builds its own provider list', PANEL,
    "    () => Object.keys(switchable).map(id => ({ id, label: providerName(id) })),",
    "    () => ['anthropic', 'deepseek'].map(id => ({ id, label: providerName(id) })),",
    'no provider id literal — the switchable set is served, never transcribed'],
  ['M3 the panel builds its own tier list', PANEL,
    "    const named = SURFACE_ORDER.filter(s => by.has(s)) as string[];",
    "    const _tiers = ['basic', 'essential', 'signature', 'prestige'];\n    const named = SURFACE_ORDER.filter(s => by.has(s)) as string[];",
    'the tier and role vocabularies are the DOOR\'S — the panel maps words, never invents lanes'],
  ['M4 the glass sends a model string with the write', API,
    "}>(`/api/v2/admin/model_routes/${encodeURIComponent(key)}`, { role, provider });",
    "}>(`/api/v2/admin/model_routes/${encodeURIComponent(key)}`, { role, provider, model: provider });",
    'the write sends only {role, provider} — the model is never sent from the glass'],
  ['M5 a colour literal enters the panel', PANEL,
    "          color: on ? T.gold : T.muted,",
    "          color: on ? '#C44058' : T.muted,",
    'zero colour literals in the three files'],
  ['M6 a state ink becomes a ground (R-40.129)', PANEL,
    "              background: on ? T.gold : 'transparent',",
    "              background: on ? T.success : 'transparent',",
    'the live segment fills with the card ACCENT, not a state ink (a role is never a ground)'],
  ['M7 the Differs chip grows a tinted ground', PANEL,
    "        display: 'inline-block', border: `0.5px solid ${T.warning}`, color: T.warning,",
    "        display: 'inline-block', background: T.warning, border: `0.5px solid ${T.warning}`, color: T.warning,",
    'the Differs chip is edge + ink, never a tinted ground (§E-42)'],
  ['M8 the surface count is typed rather than derived (§D-27)', PANEL,
    "          {loading ? '…' : `${surfaceCount} surface${surfaceCount === 1 ? '' : 's'}`}",
    "          {loading ? '…' : '5 surfaces'}",
    '27 · the group head carries the surface COUNT, derived not typed'],
  ['M9 an unnamed surface is dropped instead of appended', PANEL,
    "    return [...named, ...rest].map(s => ({ surface: s, lanes: by.get(s) as ModelRouteLane[] }));",
    "    return [...named].map(s => ({ surface: s, lanes: by.get(s) as ModelRouteLane[] }));",
    '28 · the surface order is the frame\'s, and an unnamed surface is APPENDED not dropped'],
  ['M10 the env banner names the provider (§D-33 reverted)', PANEL,
    "          LLM_PROVIDER is set on the server. Every switch below is overridden until it is unset.",
    "          LLM_PROVIDER is set on the server. Every switch below is overridden until it is unset. It is set to {forced}.",
    '33 · the env banner is the amended two sentences, verbatim, naming no provider'],
  ['M11 the unreachable row is offered as a switch', PANEL,
    "  const readOnly = !lane.reachable || outside;",
    "  const readOnly = outside;",
    'an unreachable lane renders read-only and says so in words'],
  ['M12 an out-of-set live value is offered as switchable', PANEL,
    "  const outside = lane.outside_switchable.includes(role);",
    "  const outside = false;",
    'a live value outside the two the panel offers is shown read-only, not re-labelled'],
  ['M13 the glass patches itself after a write instead of re-reading', PANEL,
    "      await load();\n      const seconds = Math.round((cacheMs || 60000) / 1000);",
    "      setLanes(l => l);\n      const seconds = Math.round((cacheMs || 60000) / 1000);",
    'the click handler re-reads rather than patching local state (R-39.15)'],
  ['M14 a refused write leaves the old glass standing', PANEL,
    "      setToast({ msg: e instanceof Error ? e.message : 'the switch did not land', error: true });\n      await load();",
    "      setToast({ msg: e instanceof Error ? e.message : 'the switch did not land', error: true });",
    'a failed write also re-reads, so a refused switch does not linger on the glass'],
  ['M15 the panel promises an instant switch', PANEL,
    "          : `${roleName(lane.surface, role) || surfaceName(lane.surface)} set to ${providerName(provider)}. Live within ${seconds} seconds.`,",
    "          : `${roleName(lane.surface, role) || surfaceName(lane.surface)} set to ${providerName(provider)}. Live immediately.`,",
    'the toast tells the truth about WHEN — seconds derived from the door, never typed'],
  ['M16 the created case goes silent', PANEL,
    "          ? `${roleName(lane.surface, role) || surfaceName(lane.surface)} set to ${providerName(provider)}. This lane had no row; one was written from what was already live. Live within ${seconds} seconds.`",
    "          ? `${roleName(lane.surface, role) || surfaceName(lane.surface)} set to ${providerName(provider)}.`",
    'a first tap on a lane with no row says a row was written from what was live'],
  ['M17 a borrowed lane falls through to the word `default`', COPY,
    "  if (lane.borrowed) return 'borrowed';",
    "  ;",
    'a borrowed lane never says `default` — there IS no default for it'],
  ['M18 an unset split is drawn as if it held its own value', PANEL,
    "  const following = role !== 'provider' && !current;",
    "  const following = false;",
    'an unset split says it FOLLOWS the primary rather than showing a false own-value'],
  ['M19 the panel spells a persona name itself', PANEL,
    "        {name && <b style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.soft }}>{name}</b>}",
    "        {name && <b style={{ display: 'block', fontSize: 12, fontWeight: 400, color: T.soft }}>{name === 'x' ? 'Victor' : name}</b>}",
    'the panel imports its persona words rather than spelling them'],
  ['M19b the Switchboard stops mounting the group', PAGE,
    "      <ModelRoutesPanel />",
    "      ",
    'the Switchboard mounts the panel with ONE line and owns nothing else of it'],
  ['M20 the role row loses its 44px floor (F-41.67 returns)', PANEL,
    "columnGap: 10, alignItems: 'center', minHeight: 44 }}>",
    "columnGap: 10, alignItems: 'center' }}>",
    '29/30 · a tier is a HEADING and each role its own 44px row (F-41.67\'s cure)'],
];

let bad = 0;
for (const [id, file, from, to, cellName] of MUT) {
  const scratch = fs.mkdtempSync('/tmp/b61m-');
  execSync(`cp -r ${ROOT}/app ${ROOT}/lib ${ROOT}/scripts ${scratch}/ && ln -s ${ROOT}/node_modules ${scratch}/node_modules`);
  const p = path.join(scratch, file); const s = fs.readFileSync(p, 'utf8');
  const n = s.split(from).length - 1;
  if (n !== 1) { console.log(`  ??     ${id} — target matched ${n} times`); bad++; fs.rmSync(scratch, { recursive: true, force: true }); continue; }
  fs.writeFileSync(p, s.replace(from, to));
  let out = '';
  try { out = execSync(`B61_ROOT=${scratch} node ${scratch}/scripts/b61_f2_model_routes_panel.js`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  const line = out.split('\n').find(l => l.includes('FAILED:')) || '';
  const hit = line.includes(cellName);
  console.log(`  ${hit ? 'ok   ' : 'MISS '} ${id}`);
  if (!hit) { bad++; console.log(`         expected RED: ${cellName}`); console.log(`         got: ${line.slice(0, 260)}`); }
  fs.rmSync(scratch, { recursive: true, force: true });
}
console.log(`\n  b61_mutations  ${MUT.length - bad}/${MUT.length}`);
process.exit(bad ? 1 : 0);
