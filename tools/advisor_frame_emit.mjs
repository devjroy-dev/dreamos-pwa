// tools/advisor_frame_emit.mjs — R-41.140.
// Emits the Advisor frame's stylesheet FROM lib/worklist/theme.ts, the same token
// source the shell mounts. NO HAND-TYPED :root — F-41.105 is what happens when a
// frame declares its own palette and the tree holds another.
//
// It refuses rather than guesses: if either map's key count disagrees with
// TOKEN_COUNT_EXPECTED, or CHALK is missing a key GRAPHITE has, it throws. A frame
// drawn from a half-read token file is the same defect wearing a script.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const REPO = process.argv[2];
const src = fs.readFileSync(REPO + '/lib/worklist/theme.ts', 'utf8');
const commit = execSync('git -C ' + REPO + ' rev-parse HEAD').toString().trim();

function block(name) {
  const i = src.indexOf('export const ' + name);
  if (i === -1) throw new Error(name + ' not found in theme.ts');
  const open = src.indexOf('{', i);
  const close = src.indexOf('\n};', open);
  if (open === -1 || close === -1) throw new Error(name + ' has no closing brace');
  const body = src.slice(open + 1, close);
  const out = {};
  for (const line of body.split('\n')) {
    // Keys are QUOTED AND ALREADY KEBAB in theme.ts ('page-bg', not pageBg). The
    // first cut required a bare identifier, parsed zero, and the count guard caught
    // it — which is the guard doing its job rather than a frame shipping empty.
    const p = line.match(/^\s*'?([A-Za-z0-9_-]+)'?\s*:\s*'([^']*)'/);
    if (p) out[p[1]] = p[2];
  }
  return out;
}

const GRAPHITE = block('GRAPHITE');
const CHALK = block('CHALK');
const TYPE = block('TYPE');

const expected = Number((src.match(/TOKEN_COUNT_EXPECTED\s*=\s*(\d+)/) || [])[1]);
const gk = Object.keys(GRAPHITE);
const ck = Object.keys(CHALK);
if (!expected) throw new Error('TOKEN_COUNT_EXPECTED not found');
if (gk.length !== expected) throw new Error('GRAPHITE has ' + gk.length + ', expected ' + expected);
if (ck.length !== expected) throw new Error('CHALK has ' + ck.length + ', expected ' + expected);
const missing = gk.filter((k) => !(k in CHALK));
if (missing.length) throw new Error('CHALK missing: ' + missing.join(', '));

// prefixFor decides --atelier-* vs --wl-*. Read its branches; never assume.
const pf = (src.match(/export function prefixFor[\s\S]*?\n\}/) || [''])[0];
const kebab = (k) => k;   // theme.ts already writes them kebab
const isType = (k) => /^t[0-5]$/.test(k);
const prefixOf = (k) => (isType(k) ? '--wl-' : '--atelier-');

const decls = (map) =>
  Object.keys(map).map((k) => '  ' + prefixOf(k) + kebab(k) + ': ' + map[k] + ';').join('\n');
// TYPE's rungs are OBJECTS, not strings, so block() cannot read them — it parses
// `key: 'value'`. Build the --wl-t* shorthand the way typeCss does (theme.ts:139):
// `weight size/line family`, family resolved through TYPE_ROLE.
const roleOf = (name) => {
  const i = src.indexOf('export const TYPE_ROLE');
  const body = src.slice(src.indexOf('{', i), src.indexOf('\n};', i));
  const m = body.match(new RegExp(name + "\\s*:\\s*'([^']*)'"));
  if (!m) throw new Error('TYPE_ROLE.' + name + ' not found');
  return m[1];
};
const typeRungs = () => {
  const i = src.indexOf('export const TYPE');
  const body = src.slice(src.indexOf('{', i), src.indexOf('\n};', i));
  const out = [];
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*(t[0-5])\s*:\s*\{\s*size:\s*(\d+),\s*line:\s*([\d.]+),\s*weight:\s*(\d+),\s*family:\s*'(\w+)'/);
    if (m) out.push('  --wl-' + m[1] + ': ' + m[4] + ' ' + m[2] + 'px/' + m[3] + ' ' + roleOf(m[5]) + ';');
  }
  if (out.length === 0) throw new Error('no TYPE rungs parsed');
  return out.join('\n');
};
const typeDecls = typeRungs();

const css =
  '/* EMITTED, NOT TYPED — tools/advisor_frame_emit.mjs from lib/worklist/theme.ts\n' +
  '   at dreamos-pwa ' + commit + '\n' +
  '   ' + expected + ' tokens per arm; prefixFor branches: ' +
  [...pf.matchAll(/return\s+'([^']+)'/g)].map((m) => m[1]).join(' ') + '\n' +
  '   Regenerate, never hand-edit (R-41.140). */\n' +
  '.arm-dark {\n' + decls(GRAPHITE) + '\n' + typeDecls + '\n}\n' +
  '.arm-light {\n' + decls(CHALK) + '\n' + typeDecls + '\n}\n';

process.stderr.write('theme.ts @ ' + commit + ' — ' + expected + ' tokens per arm, both maps agree\n');
process.stdout.write(css);
