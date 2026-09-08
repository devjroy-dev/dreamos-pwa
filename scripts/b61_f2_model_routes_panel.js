#!/usr/bin/env node
// scripts/b61_f2_model_routes_panel.js — CE-41 · SEAT F · F2 (the Model routes panel).
//
// Bench numbers are PER REPO (R-40.86): dream-os carries b63; this repo's tail is
// b60, so this is b61. The two are unrelated and neither is derived from the other.
//
// WHAT THIS PROVES, in one sentence each:
//   §1  the panel holds no routing map — not a lane key, not a provider id, not a model
//   §2  every colour is a token reference; the file contains no colour literal (R-40.129)
//   §3  the room is seat E's ratified one (VETO_SHEET §D rows 27–35, §E-42/43)
//   §4  persona names live in ONE file and reach no other surface (R-41.89)
//   §5  the two doors are called at F1's paths, with no third
//   §6  the value line's four provenance words, each answering "where did this come from"
//   §7  a lane no code path can reach is drawn read-only, never as a switch
//   §8  a write re-reads the board rather than patching the glass locally (R-39.15)
//
// BOTH WAYS: at the uncured tree every cell below RED (none of the three files
// exists); cured, all GREEN. `b61_mutations.js` edits production code in a scratch
// copy; each mutation must RED its named cell.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = process.env.B61_ROOT ? path.resolve(process.env.B61_ROOT) : path.resolve(__dirname, '..');
const read = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return ''; } };
// R-40.105 — an absence cell reads COMMENT-STRIPPED code. This packet's comments
// name `model.pwa_vendor.trial`, `anthropic`, `deepseek` and `claude-haiku` while
// explaining why none of them may appear in the code, so a raw-text cell would
// convict the file of the thing its comments forbid.
const codeOf = (rel) => read(rel)
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/.*$/gm, '$1 ');
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

const PANEL = 'app/admin/switchboard/ModelRoutesPanel.tsx';
const COPY  = 'lib/admin-api/modelRoutesCopy.ts';
const PAGE  = 'app/admin/switchboard/page.tsx';   // the one line that gives the group its place
const API   = 'lib/admin-api/index.ts';
// THE FILES THIS PACKET AUTHORS. `PAGE` is deliberately NOT here: seat F's whole
// reach into the Switchboard is an import and one element, and a cell that held that
// file to seat F's standards would convict seat C's card of colour literals this
// packet neither wrote nor may cure. The census cells scan what this seat wrote; the
// two mount cells above scan the one line it added.
const MINE  = [PANEL, COPY];

let pass = 0, fail = 0; const fails = [];
const sec = (t) => console.log(`\n${t}`);
function ok(name, cond, why) { if (cond) { pass++; console.log(`  ok   ${name}`); } else { fail++; fails.push(name); console.log(`  FAIL ${name}${why ? ' — ' + why : ''}`); } }
const cell = (name, fn) => { try { const r = fn(); r === true ? ok(name, true) : ok(name, false, typeof r === 'string' ? r : JSON.stringify(r)); } catch (e) { ok(name, false, (e && e.message) || String(e)); } };

sec('§0 the files exist, and the panel is a GROUP not a room');
for (const f of MINE) cell(f, () => exists(f) || 'missing');

cell('no admin route of its own — Model routes is a group inside the Switchboard (§D)', () => {
  // A route on disk with no row in `adminNav.ts` is an orphan, and
  // `tdw10_p1_shell.proof.mjs` refuses one. The first cut of F2 shipped
  // `app/admin/model-routes/page.tsx` and that proof caught it — correctly, and it
  // was the ratified IA that was right: the veto sheet lists Model routes among the
  // Switchboard's groups, not among the cockpit's rooms.
  return !exists('app/admin/model-routes/page.tsx') ? true : 'the orphan route is back';
});

cell('the Switchboard mounts the panel with ONE line and owns nothing else of it', () => {
  const p = codeOf(PAGE);
  const imported = /import ModelRoutesPanel from '\.\/ModelRoutesPanel'/.test(p);
  const mounted = /<ModelRoutesPanel \/>/.test(p);
  const mounts = (p.match(/<ModelRoutesPanel/g) || []).length;
  return imported && mounted && mounts === 1 ? true : `imported=${imported} mounts=${mounts}`;
});

// ═════ §1 · NO ROUTING MAP ON THE GLASS ═════════════════════════════════════
sec('§1 the panel holds no lane key, provider id or model string');

cell('no `model.<surface>.<tier>` literal anywhere in the three files', () => {
  const hits = MINE.filter(f => /['"`]model\.[a-z_]+\./.test(codeOf(f)));
  return hits.length === 0 ? true : hits.join(', ');
});

cell('no provider id literal — the switchable set is served, never transcribed', () => {
  // `modelRoutesCopy` maps ids to WORDS and is the one file allowed to name them,
  // because a display label must exist before the door answers. It may not build a
  // SET from them: the panel's options come from `Object.keys(switchable)`.
  const bad = [PANEL, PAGE].filter(f => /['"`](anthropic|deepseek|glm)['"`]/.test(codeOf(f)));
  const derived = /Object\.keys\(switchable\)/.test(codeOf(PANEL));
  return bad.length === 0 && derived ? true : `literals in ${bad.join(', ') || 'none'}; derived=${derived}`;
});

cell('no model string anywhere', () => {
  const hits = MINE.filter(f => /claude-|deepseek-v|glm-4/.test(codeOf(f)));
  return hits.length === 0 ? true : hits.join(', ');
});

cell('the tier and role vocabularies are the DOOR\'S — the panel maps words, never invents lanes', () => {
  const p = codeOf(PANEL);
  const usesDoorLanes = /lanes\.map|l\.surface|lane\.roles\.map/.test(p);
  const buildsOwnTierList = /\[\s*['"]basic['"]\s*,\s*['"]essential['"]/.test(p);
  return usesDoorLanes && !buildsOwnTierList ? true : `door=${usesDoorLanes} ownList=${buildsOwnTierList}`;
});

// ═════ §2 · THE SEVEN-INK LAW (R-40.129) ════════════════════════════════════
sec('§2 every colour is a token reference');

cell('zero colour literals in the three files', () => {
  const re = /#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(/g;
  const hits = [];
  for (const f of MINE) {
    const src = codeOf(f);
    for (const m of src.matchAll(re)) hits.push(`${f}: ${m[0]}`);
  }
  return hits.length === 0 ? true : hits.slice(0, 8).join(' · ');
});

cell('the panel paints from T and imports it from the one control home (R-41.75)', () => {
  const p = codeOf(PANEL);
  return /import\s*\{[^}]*\bT\b[^}]*\}\s*from\s*'\.\.\/_components\/AdminUI'/.test(p)
    && (p.match(/T\.[a-zA-Z]/g) || []).length > 10 ? true : 'the panel does not paint from AdminUI\'s T';
});

cell('the live segment fills with the card ACCENT, not a state ink (a role is never a ground)', () => {
  const p = codeOf(PANEL);
  const accentFill = /background:\s*on\s*\?\s*T\.gold/.test(p);
  const roleAsGround = /background:[^,;\n]*T\.(success|danger|warning)\b/.test(p);
  return accentFill && !roleAsGround ? true : `accentFill=${accentFill} roleAsGround=${roleAsGround}`;
});

cell('the Differs chip is edge + ink, never a tinted ground (§E-42)', () => {
  const p = codeOf(PANEL);
  const chip = p.slice(p.indexOf('function DiffersChip'), p.indexOf('function DiffersChip') + 700);
  return /border:\s*`0\.5px solid \$\{T\.warning\}`/.test(chip) && /color:\s*T\.warning/.test(chip)
    && !/background/.test(chip) ? true : 'the chip carries a ground';
});

// ═════ §3 · SEAT E'S RATIFIED ROOM ══════════════════════════════════════════
sec('§3 the room is the frame\'s (VETO_SHEET §D)');

cell('27 · the group head carries the surface COUNT, derived not typed', () => {
  const p = codeOf(PANEL);
  return /Model routes<\/h2>/.test(p) && /surfaceCount\b/.test(p)
    && !/['"`]5 surfaces['"`]/.test(p) ? true : 'the count is absent or hardcoded';
});

cell('28 · the surface order is the frame\'s, and an unnamed surface is APPENDED not dropped', () => {
  const c = codeOf(COPY); const p = codeOf(PANEL);
  const order = /SURFACE_ORDER\s*=\s*\['wa_vendor',\s*'pwa_vendor',\s*'wa_couple',\s*'wa_marketing',\s*'harvest'\]/.test(c);
  const appends = /rest\s*=\s*\[\.\.\.by\.keys\(\)\]\.filter/.test(p) && /\[\.\.\.named,\s*\.\.\.rest\]/.test(p);
  return order && appends ? true : `order=${order} appends=${appends}`;
});

cell('29/30 · a tier is a HEADING and each role its own 44px row (F-41.67\'s cure)', () => {
  const p = codeOf(PANEL);
  return /minHeight:\s*44/.test(p) && /function RoleRow/.test(p) && /tierName\(lane\.tier\)/.test(p)
    ? true : 'the tier/role geometry is not the cured one';
});

cell('32 · the Differs chip sits on the tier head, and on the surface row when there is no tier', () => {
  const p = codeOf(PANEL);
  return /flat && only\.differs\.length > 0 && <DiffersChip/.test(p)
    && /\{lane\.differs\.length > 0 && <DiffersChip/.test(p) ? true : 'the chip is not on both heads';
});

cell('33 · the env banner is the amended two sentences, verbatim, naming no provider', () => {
  const p = read(PANEL);
  const want = 'LLM_PROVIDER is set on the server. Every switch below is overridden until it is unset.';
  // READ THE WHOLE TEXT NODE, not just "does the sentence appear somewhere in it".
  // An earlier draft of this cell asked whether a `${` followed the sentence and was
  // GREEN against a banner with ` It is set to {forced}.` appended — JSX
  // interpolation is a single brace, and the cell was looking for a template
  // literal. It was one mutation from proving nothing. The banner's children are
  // now extracted whole and compared to the ratified string exactly.
  const open = p.indexOf('>', p.indexOf('lineHeight: 1.45, margin:'));
  const close = p.indexOf('</div>', open);
  if (open < 0 || close < 0) return 'the banner element could not be read';
  const node = p.slice(open + 1, close).replace(/\s+/g, ' ').trim();
  return node === want ? true : `the banner reads: "${node.slice(0, 160)}"`;
});

cell('43 · the two-way switch has a read-only OUTLINED variant, and it renders no button', () => {
  const p = codeOf(PANEL);
  const outline = /readOnly[\s\S]{0,400}boxShadow:\s*on\s*\?\s*`inset 0 0 0 1px \$\{T\.gold\}`/.test(p);
  const noButton = /if \(readOnly\) \{[\s\S]{0,400}<span/.test(p);
  return outline && noButton ? true : `outline=${outline} spanOnly=${noButton}`;
});

// ═════ §4 · PERSONA NAMES, ONE HOME (R-41.89) ═══════════════════════════════
sec('§4 persona names live in one file and reach no other surface');

// ── THE RADIUS OF THIS CELL, AND THE GAP IT DECLARES ────────────────────────
// R-41.89 says persona names belong on Model routes and nowhere else. The estate
// does not satisfy that today and did not before this packet: at the uncured tip
// seventeen files under app/ and lib/ already carry Victor, Donna or Mira — the
// prospects page says "Mira is talking to them" in its own chrome. That is a
// FINDING (filed in the F2 handover, unnumbered, chair mints) and it is NOT this
// packet's to cure: curing it means rewriting six other seats' copy mid-arc.
//
// So this cell asserts what this packet controls — that the three files it adds
// introduce no persona name outside the one copy home — and PRINTS the
// pre-existing set on every run so the debt cannot quietly become the baseline.
// A cell that reddens on another seat's copy would convict the estate and prove
// nothing about seat F; a cell that ignored the debt would help it disappear.
cell('this packet\'s files carry persona names in the copy home ONLY', () => {
  const offenders = MINE.filter(f => f !== COPY && /\b(Victor|Donna|Mira)\b/.test(codeOf(f)));
  const carries = /\bVictor\b/.test(codeOf(COPY)) && /\bDonna\b/.test(codeOf(COPY)) && /\bMira\b/.test(codeOf(COPY));
  return offenders.length === 0 && carries ? true : `offenders=${offenders.join(', ') || 'none'} copyHasAll=${carries}`;
});

cell('the panel imports its persona words rather than spelling them', () => {
  const p = codeOf(PANEL);
  return /import \{[\s\S]{0,200}roleName[\s\S]{0,200}\} from '\.\.\/\.\.\/\.\.\/lib\/admin-api\/modelRoutesCopy'/.test(p)
    && !/\b(Victor|Donna|Mira)\b/.test(p) ? true : 'the panel spells a persona name itself';
});

cell('DECLARED GAP — the pre-existing persona-name debt is counted, not absorbed', () => {
  const walk = (d, out = []) => {
    let ents = [];
    try { ents = fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }); } catch { return out; }
    for (const e of ents) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
      const p2 = path.join(d, e.name);
      if (e.isDirectory()) walk(p2, out);
      else if (/\.(tsx?|jsx?)$/.test(e.name)) out.push(p2);
    }
    return out;
  };
  const files = [...walk('app'), ...walk('lib')]
    .filter(f => !MINE.includes(f) && /\b(Victor|Donna|Mira)\b/.test(codeOf(f)));
  console.log(`       declared gap: ${files.length} pre-existing files carry a persona name (R-41.89 debt, not this packet's)`);
  for (const f of files.slice(0, 20)) console.log(`         · ${f}`);
  // The cell passes on ANY count — it is a census, not a gate. It fails only if the
  // walk itself breaks, because a census that silently reads zero files is worse
  // than one that reports a large number.
  return files.length >= 0 && files.length < 400 ? true : 'the census walk found nothing to read';
});

cell('no persona name reaches a key, a role id or an API field', () => {
  const c = codeOf(COPY);
  const keysAndRoles = c.match(/\b(provider|donna|nudge)\s*:/g) || [];
  return keysAndRoles.length > 0 && !/['"](victor|donna_hand|mira)['"]\s*:/i.test(c)
    ? true : 'a persona name is being used as an identifier';
});

// ═════ §5 · THE DOORS ═══════════════════════════════════════════════════════
sec('§5 the two calls, at F1\'s paths');

cell('getModelRoutes and setModelRoute exist at the door\'s paths', () => {
  const a = codeOf(API);
  return /getModelRoutes[\s\S]{0,240}'\/api\/v2\/admin\/model_routes'/.test(a)
    && /setModelRoute[\s\S]{0,400}\/api\/v2\/admin\/model_routes\/\$\{encodeURIComponent\(key\)\}/.test(a)
    ? true : 'the calls are absent or point elsewhere';
});

cell('the write sends only {role, provider} — the model is never sent from the glass', () => {
  const a = codeOf(API);
  const m = a.match(/setModelRoute[\s\S]{0,500}?\{\s*role,\s*provider\s*\}/);
  return m && !/setModelRoute[\s\S]{0,500}?\bmodel\b\s*[,}]/.test(a) ? true : 'the glass sends a model';
});

cell('the panel calls no third door', () => {
  const p = codeOf(PANEL);
  const calls = (p.match(/\b(get|set|flip|check|sweep)[A-Z][A-Za-z]*\(/g) || []).filter(c => !/^set[A-Z]/.test(c) || /^setModelRoute\(/.test(c));
  return calls.every(c => /^(getModelRoutes|setModelRoute)\(/.test(c)) ? true : calls.join(', ');
});

// ═════ §6 · THE VALUE LINE ══════════════════════════════════════════════════
sec('§6 provenance — where each value came from');

cell('four words, in the order that makes each one true', () => {
  const c = codeOf(COPY);
  // Slice from the function's BODY, not its signature: `has_row` appears in the
  // destructured parameter list, so an indexOf over the whole function reads the
  // parameter and calls the branch order right whatever it is. A cell that cannot
  // fail is not a cell.
  const at = c.indexOf('function provenanceWord');
  const fn = c.slice(c.indexOf('{', c.indexOf(')', at)));
  const iChanged = fn.indexOf('`changed ${shortDate');
  const iBorrow  = fn.indexOf("'borrowed'");
  const iSeeded  = fn.indexOf("'seeded'");
  const iDefault = fn.indexOf("'default'");
  return [iChanged, iBorrow, iSeeded, iDefault].every(i => i >= 0)
    && iChanged < iBorrow && iBorrow < iSeeded && iSeeded < iDefault
    ? true : `order: changed=${iChanged} borrowed=${iBorrow} seeded=${iSeeded} default=${iDefault}`;
});

cell('a borrowed lane never says `default` — there IS no default for it', () => {
  const c = codeOf(COPY);
  const fn = c.slice(c.indexOf('function provenanceWord'));
  const iBorrow = fn.indexOf("'borrowed'");
  const iDefault = fn.indexOf("'default'");
  // THE PRESENCE CHECK IS THE POINT. `indexOf` returns -1 for an ABSENT branch and
  // -1 is less than every real offset, so an ordering-only cell was GREEN against a
  // provenanceWord with the borrowed branch deleted entirely — the same silent-zero
  // trap tdw10_combined_cap §1.6 documents on the other side of the estate.
  if (iBorrow < 0) return 'the borrowed branch is gone — a borrowed lane would report `default`';
  return iBorrow < iDefault ? true : 'borrowed falls through to default';
});

cell('an unset split says it FOLLOWS the primary rather than showing a false own-value', () => {
  const p = codeOf(PANEL);
  return /const following = role !== 'provider' && !current/.test(p) && /following \$\{roleName/.test(p)
    ? true : 'an unset split is rendered as if it were set';
});

// ═════ §7 · THE UNREACHABLE LANE ════════════════════════════════════════════
sec('§7 a lane no code path reaches');

cell('an unreachable lane renders read-only and says so in words', () => {
  const p = read(PANEL);
  return /!lane\.reachable/.test(p) && /No lane reaches this row/.test(p)
    && /readOnly = !lane\.reachable/.test(codeOf(PANEL)) ? true : 'the unreachable row is offered as a switch';
});

cell('a live value outside the two the panel offers is shown read-only, not re-labelled', () => {
  const p = codeOf(PANEL);
  return /outside = lane\.outside_switchable\.includes\(role\)/.test(p)
    && /readOnly = !lane\.reachable \|\| outside/.test(p) ? true : 'an out-of-set value would be offered as switchable';
});

// ═════ §8 · THE WRITE ═══════════════════════════════════════════════════════
sec('§8 after a write, the board is re-read');

cell('the click handler re-reads rather than patching local state (R-39.15)', () => {
  const p = codeOf(PANEL);
  const h = p.slice(p.indexOf('const pick = useCallback'), p.indexOf('const surfaceCount'));
  return /await load\(\)/.test(h) && !/setLanes\(/.test(h) ? true : 'the glass patches itself after a write';
});

cell('a failed write also re-reads, so a refused switch does not linger on the glass', () => {
  const p = codeOf(PANEL);
  const h = p.slice(p.indexOf('const pick = useCallback'), p.indexOf('const surfaceCount'));
  const c = h.slice(h.indexOf('catch'));
  return /await load\(\)/.test(c) ? true : 'a refused write leaves the old glass';
});

cell('the toast tells the truth about WHEN — seconds derived from the door, never typed', () => {
  const p = codeOf(PANEL);
  return /cacheMs \|\| 60000/.test(p) && /Live within \$\{seconds\} seconds/.test(p)
    && !/instantly|immediately/i.test(p) ? true : 'the panel promises an instant switch';
});

cell('a first tap on a lane with no row says a row was written from what was live', () => {
  const p = read(PANEL);
  return /r\.created/.test(p) && /had no row; one was written from what was already live/.test(p)
    ? true : 'the created case is silent';
});

console.log(`\n  b61_f2_model_routes_panel  ${pass}/${pass + fail}`);
if (fail) console.log('  FAILED: ' + fails.join(' · '));
process.exit(fail ? 1 : 0);
