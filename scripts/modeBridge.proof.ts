// scripts/modeBridge.proof.ts — F-38.52 · THE INTERIM BRIDGE HOLDS, BOTH WAYS.
//
// The founder walked a split-brain app: eleven rooms on `/w` reading a cookie, seven on
// `/vendor` reading `localStorage['dreamai_theme']`, and the shell's coin writing only the
// first. This asserts the bridge that makes one tap reach both lanes until the last room
// crosses.
//
// IT IMPORTS THE REAL `lib/worklist/mode.ts`. A proof that re-implements the thing it
// proves is a proof of itself, and this estate has filed that shape more than once. The
// document and localStorage below are the only fixtures — they are the BROWSER, not the
// subject.
//
// WHY A `.proof.ts` AND A WRAPPER: the subject is TypeScript and the pwa has no test
// runner. `run-mode-bridge-proof.sh` compiles with `noEmitOnError` and runs the output in
// plain node, exactly as `bands` and the six others do. Exit code is the verdict.
// A RELATIVE PATH, NOT THE `@/*` ALIAS — and the reason is worth one line so the next
// bench does not lose an hour to it. `tsc` resolves the alias at COMPILE time and emits
// the specifier UNCHANGED, so the compiled CommonJS asks plain node for `@/lib/...` and
// node has no idea what that is. `bands.proof.ts` uses a relative path for exactly this
// reason. The alias config still earns its place: it keeps `lib/worklist/mode.ts`'s own
// internal imports resolvable.
import { writeMode, asMode, MODE_COOKIE, MODE_LEGACY_KEY, VENDOR_LANE_KEY } from '../lib/worklist/mode';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, detail?: string) => {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  → ' + detail : '')); }
};

// ── THE BROWSER, STUBBED AT ITS NARROWEST ─────────────────────────────────
// `document.cookie` is a property with a setter that APPENDS rather than replaces, which
// is the one piece of real cookie behaviour this proof depends on. A stub that let the
// last write win would hide a bridge that clobbered the mode cookie.
const store = new Map<string, string>();
const cookies: string[] = [];
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
};
const doc = {
  get cookie() { return cookies.join('; '); },
  set cookie(v: string) { cookies.push(v.split(';')[0]); },
};
(globalThis as unknown as { document: unknown }).document = doc;

const cookieValue = (name: string): string | null => {
  // Last write wins, which is what a browser reports for a repeated name.
  const hits = cookies.filter((c) => c.startsWith(name + '='));
  return hits.length ? hits[hits.length - 1].slice(name.length + 1) : null;
};

console.log('\n§1 · THE FLIP REACHES BOTH LANES, BOTH DIRECTIONS');

// ── Chalk. The semantic mapping: the vendor chose 「light」, so both lanes store 'light'
//    and each renders that word in its own palette.
writeMode('light');
ok('§1.1 shell lane holds light', cookieValue(MODE_COOKIE) === 'light', String(cookieValue(MODE_COOKIE)));
ok('§1.2 /vendor lane holds light', store.get(VENDOR_LANE_KEY) === 'light', String(store.get(VENDOR_LANE_KEY)));
ok('§1.3 the migration key keeps step', store.get(MODE_LEGACY_KEY) === 'light', String(store.get(MODE_LEGACY_KEY)));

// ── Graphite. THE SECOND DIRECTION IS NOT A FORMALITY. A bridge that only ever writes on
//    the way to light leaves a vendor who flips back stranded on cream — which is the
//    founder's complaint with the lanes swapped, and it would read as a NEW defect.
writeMode('dark');
ok('§1.4 shell lane holds dark', cookieValue(MODE_COOKIE) === 'dark', String(cookieValue(MODE_COOKIE)));
ok('§1.5 /vendor lane holds dark', store.get(VENDOR_LANE_KEY) === 'dark', String(store.get(VENDOR_LANE_KEY)));

// ── The bridge must not clobber what it rides beside.
writeMode('light');
ok('§1.6 the two keys never disagree after a write',
   store.get(VENDOR_LANE_KEY) === asMode(cookieValue(MODE_COOKIE)),
   store.get(VENDOR_LANE_KEY) + ' vs ' + cookieValue(MODE_COOKIE));

console.log('\n§2 · ONE WRITER — asserted over source, not over behaviour');

// A behavioural cell cannot see a SECOND writer somewhere else in the estate; only the
// source can. `writeMode` is the sole thing permitted to touch either key.
const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const hits = execSync(
  `git grep -ln "${VENDOR_LANE_KEY}" -- app components lib hooks || true`,
  { cwd: ROOT, encoding: 'utf8' },
).split('\n').filter(Boolean);

// THE SET IS ASSERTED, NOT THE COUNT, and every member carries its reason — because a
// number tells the next reader nothing about which file joined and why.
//
// ⚠ THIS CELL RED ON ITS FIRST RUN AND THE CELL WAS WRONG, NOT THE TREE. It was written
// from a narrower grep and missed two real touchers. Widened with their reasons rather
// than loosened, which is the difference between a list that was thought about and one
// that was made to pass.
const EXPECTED = new Map<string, string>([
  ['lib/worklist/mode.ts',              'THE BRIDGE — the one writer of a vendor CHOICE'],
  ['app/vendor/layout.tsx',             'reader'],
  ['hooks/vendor/useTheme.ts',          'reader'],
  ['lib/vendor/ThemeContext.tsx',       'reader'],
  ['app/layout.tsx',                    'anti-flash boot script: reads before React, plus R-U19\'s one-time flair->dark migration'],
  ['app/demo/vendor/[handle]/layout.tsx', 'COMMENT only — names the key to explain why the demo lane is pinned off it'],
]);
const strays = hits.filter((h) => !EXPECTED.has(h));
ok('§2.1 no unexpected file touches the /vendor lane key', strays.length === 0, strays.join(', '));

// ── §2.1b · THE ONE-WRITER PROPERTY, STATED PRECISELY ─────────────────────
// `app/layout.tsx` DOES write the key — `setItem('dreamai_theme','dark')` when it finds
// the retired `'flair'`. That is not a second authority and it must not be hidden behind
// a green: it NORMALISES a retired value once per device and never expresses a vendor's
// choice. The property that matters is that exactly one site writes a CHOSEN mode, and
// this is where that is said out loud rather than assumed by the cell above.
const writers = [...EXPECTED.keys()].filter((f) => {
  try { return new RegExp(`setItem\\(\\s*['"\`]?(${VENDOR_LANE_KEY}|VENDOR_LANE_KEY)`).test(readFileSync(ROOT + '/' + f, 'utf8')); }
  catch { return false; }
});
const CHOICE_WRITER = 'lib/worklist/mode.ts';
const MIGRATION_ONLY = 'app/layout.tsx';
ok('§2.1b exactly one site writes a CHOSEN mode; the other write is R-U19 migration',
   writers.includes(CHOICE_WRITER) && writers.every((w) => w === CHOICE_WRITER || w === MIGRATION_ONLY),
   writers.join(', '));

const modeSrc = readFileSync(ROOT + '/lib/worklist/mode.ts', 'utf8');
ok('§2.2 the bridge write lives inside writeMode',
   /export function writeMode[\s\S]*?VENDOR_LANE_KEY[\s\S]*?\n}/.test(modeSrc));

// ── THE REVERSE WRITE MUST NOT EXIST. One writer means one; a bridge with traffic both
//    ways is two authorities wearing a bridge's name.
const reverse = ['app/vendor/layout.tsx', 'hooks/vendor/useTheme.ts', 'lib/vendor/ThemeContext.tsx']
  .filter((f) => { try { return readFileSync(ROOT + '/' + f, 'utf8').includes(MODE_COOKIE); } catch { return false; } });
ok('§2.3 the /vendor lane does not write back', reverse.length === 0, reverse.join(', '));

console.log('\n§3 · THE RETIREMENT IS DERIVABLE, NOT REMEMBERED');

// The bridge retires when no room reads the other key. That condition is in the registry,
// so this cell tells the next reader how many crossings are left rather than leaving the
// clause to rot in a handover nobody re-derives.
const registry = readFileSync(ROOT + '/lib/worklist/rooms.ts', 'utf8');
const remaining = (registry.match(/href:\s*'\/vendor\/[^']+'/g) || []).length;
ok('§3.1 the bridge is still needed — /vendor rooms remain', remaining > 0, 'remaining=' + remaining);
if (remaining === 0) {
  console.log('  NOTE — INTERIM_VENDOR_ROOMS is empty. F-38.52 RETIRES NOW: delete the bridge');
  console.log('         write in lib/worklist/mode.ts and this proof with it.');
}
console.log('       ' + remaining + ' room(s) still on the /vendor lane');

console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — modeBridge ${pass}/${total}` : `RED — modeBridge ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
