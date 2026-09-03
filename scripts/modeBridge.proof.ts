// scripts/modeBridge.proof.ts — F-38.52 · THE BRIDGE IS RETIRED; THE COOKIE IS THE ONE
// AUTHORITY.
//
// ══ AMENDED BY LABEL — §4-4 BATCH ③, CE-38 RELAY #1 (c-3). INVERTED, NOT DELETED. ══
//
// This bench asserted that the interim bridge HELD, both directions. Collab crossed,
// `INTERIM_VENDOR_ROOMS` emptied, the bridge's own stated condition fired, and the write is
// gone from `writeMode`. Six of the eleven cells below were assertions about a line that no
// longer exists.
//
// ── WHY IT IS NOT DELETED, WHICH ITS OWN OLD NOTE ASKED FOR ────────────────
// The note at §3 used to read 「F-38.52 RETIRES NOW: delete the bridge write in
// lib/worklist/mode.ts and this proof with it」. THAT INSTRUCTION IS STRUCK, and the
// reasoning is the whole of the amendment: the SUBJECT retired, the PROPERTY did not.
// Before this cut the property worth guarding was 「one tap reaches both lanes」. After it
// the property worth guarding is 「the cookie is the sole authority and NOTHING writes the
// /vendor lane key from a vendor's choice」 — and that is a real, breakable property, on a
// key three live readers still read from routes that stay on disk until Phase 7. Deleting
// a bench because its subject died would drop the only guard on the successor property, on
// the exact day the successor property became the one that matters. RETIRE-WITH-THE-READER.
//
// ── THE COUNT IS PRESERVED: ELEVEN CELLS BEFORE, ELEVEN AFTER ─────────────
// Not loosened, not thinned. Each inverted cell asserts the NEGATIVE of what it used to
// assert, at the same site, so a bridge that grows back reddens exactly where it used to
// green. An amendment that shrinks a bench is a bench nobody can diff.
//
// ⚠ AND IT NOW READS STRIPPED SOURCE, WHICH IT DID NOT NEED TO BEFORE. An absence cell over
// this file's own subject would CONVICT ON THE CURE COMMENT: `lib/worklist/mode.ts` names
// the retired call in the label that records its retirement, exactly as F-06.85 requires and
// exactly as F-07.89 warns. A reader whose subject is CODE strips before it parses.
//
// ── THE ORIGINAL CHARTER, KEPT BECAUSE A RETIREMENT WITHOUT ITS CAUSE TEACHES NOTHING ──
// The founder walked a split-brain app: eleven rooms on `/w` reading a cookie, seven on
// `/vendor` reading `localStorage['dreamai_theme']`, and the shell's coin writing only the
// first. This asserted the bridge that made one tap reach both lanes until the last room
// crossed. The last room has crossed.
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
import { writeMode, MODE_COOKIE, MODE_LEGACY_KEY, VENDOR_LANE_KEY } from '../lib/worklist/mode';
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// The repo root, hoisted here because `codeOf` below runs with it as cwd. It was declared
// further down beside its first user until §4-4 batch ③ gave it a second one.
const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();

// ── THE ESTATE'S ONE STRIPPER, REACHED ACROSS THE CJS/ESM BOUNDARY ────────
// `scripts/lib/stripComments.mjs` is F-07.74's one home and it is ESM; this bench compiles
// to CommonJS (the wrapper's tsconfig says so, because plain node has to run the output).
// A CJS `require` of an ESM module is a Node-VERSION bet — unflagged only from 22.12 — and a
// bench that throws on the founder's node instead of the container's is a bench that reports
// the runtime rather than the tree. Copying the definition in is the F-07.99 disease and is
// not on the table.
//
// SO IT IS INVOKED OUT OF PROCESS, ONCE PER FILE. The definition stays in exactly one place,
// it is genuinely CALLED rather than merely held, and the ESM import happens in an ESM
// context where it needs no version. Slower than a require; the subject is four files.
const codeOf = (rel: string): string => execSync(
  'node --input-type=module -e '
  + JSON.stringify(
      "import {stripComments} from './scripts/lib/stripComments.mjs';"
      + "import fs from 'node:fs';"
      + 'process.stdout.write(stripComments(fs.readFileSync(process.argv[1],"utf8")));')
  + ' ' + JSON.stringify(rel),
  { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
);

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

console.log('\n§1 · THE FLIP REACHES THE SHELL LANE AND NOTHING ELSE');

// ── Chalk. The shell lane still moves; that half never changed and is asserted first so an
//    inversion of the OTHER half cannot pass on a writer that stopped writing entirely.
writeMode('light');
ok('§1.1 shell lane holds light', cookieValue(MODE_COOKIE) === 'light', String(cookieValue(MODE_COOKIE)));
// INVERTED §4-4 batch ③. The vendor lane is not written at all now. `undefined` and not
// 'light' is the whole assertion: a bridge that grows back reddens here first.
ok('§1.2 the /vendor lane is NOT written on the way to light',
   store.get(VENDOR_LANE_KEY) === undefined, String(store.get(VENDOR_LANE_KEY)));
ok('§1.3 the migration key keeps step', store.get(MODE_LEGACY_KEY) === 'light', String(store.get(MODE_LEGACY_KEY)));

// ── Graphite. THE SECOND DIRECTION IS NOT A FORMALITY, AND IT IS NOT ONE INVERTED EITHER.
//    A bridge re-added on only one arm would leave the key tracking half the vendor's taps,
//    which reads as neither the old behaviour nor the new one.
writeMode('dark');
ok('§1.4 shell lane holds dark', cookieValue(MODE_COOKIE) === 'dark', String(cookieValue(MODE_COOKIE)));
// INVERTED §4-4 batch ③.
ok('§1.5 nor on the way back to dark',
   store.get(VENDOR_LANE_KEY) === undefined, String(store.get(VENDOR_LANE_KEY)));

// ── INVERTED §4-4 batch ③. This cell used to say the two keys never DISAGREE. They are no
//    longer in a relationship: the vendor lane is untouched by any number of flips, so the
//    successor property is that repeated writes leave it exactly as absent as they found it.
writeMode('light');
writeMode('dark');
writeMode('light');
ok('§1.6 no number of flips touches the /vendor lane',
   store.get(VENDOR_LANE_KEY) === undefined && cookieValue(MODE_COOKIE) === 'light',
   String(store.get(VENDOR_LANE_KEY)) + ' | cookie ' + cookieValue(MODE_COOKIE));

console.log('\n§2 · NO WRITER — asserted over source, not over behaviour');

// A behavioural cell cannot see a writer somewhere else in the estate; only the source can.
// §1 proves `writeMode` stopped writing the key; only these cells can prove nobody else
// started. THE FILE LIST IS STILL FOUND RAW, deliberately: a file that merely MENTIONS the
// key in a comment is a file whose comment can rot, and §2.1 is the cell that notices one
// appearing. What must be stripped is the question 「does it WRITE」, which is §2.1b's.
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
  // AMENDED §4-4 batch ③: this file's REASON changed and its membership did not. It still
  // DECLARES the key (three live readers import nothing else) and still names it in the
  // label recording the retirement — but it no longer writes it.
  ['lib/worklist/mode.ts',              'the key\'s one declaration, plus the label recording the bridge\'s retirement — writes it nowhere'],
  // 'app/vendor/layout.tsx' — RETIRED at P7.2: the old layout (the lane's reader) was deleted with the tree; the demo tree's provider is the last reader (FORK 3: the mirror stays, named, until P7.3)
  ['hooks/vendor/useTheme.ts',          'reader'],
  ['lib/vendor/ThemeContext.tsx',       'reader'],
  ['app/layout.tsx',                    'anti-flash boot script: reads before React, plus R-U19\'s one-time flair->dark migration'],
  ['app/demo/vendor/[handle]/layout.tsx', 'COMMENT only — names the key to explain why the demo lane is pinned off it'],
]);
const strays = hits.filter((h) => !EXPECTED.has(h));
ok('§2.1 no unexpected file touches the /vendor lane key', strays.length === 0, strays.join(', '));

// ── §2.1b · INVERTED §4-4 batch ③ · THE NO-CHOICE-WRITER PROPERTY ─────────
// `app/layout.tsx` DOES write the key — `setItem('dreamai_theme','dark')` when it finds the
// retired `'flair'`. That was never a second authority and it is not one now: it NORMALISES
// a retired value once per device and never expresses a vendor's choice. It survives the
// bridge because it is about a value, not about a preference.
//
// SO THE PROPERTY FLIPS FROM 「exactly one site writes a CHOSEN mode」 TO 「NO site does」, and
// the migration remains the one permitted writer of any kind. Reading it against the R-U19
// site by name rather than by count is what keeps a re-added bridge from hiding inside a
// number that happens to stay at one.
//
// ⚠ STRIPPED, AND THIS IS THE CELL THAT FORCED IT. `lib/worklist/mode.ts` now carries the
// text `localStorage.setItem(VENDOR_LANE_KEY, mode)` INSIDE the comment that records the
// retirement — because F-06.85 asks that a cure name the mechanism it retired. A raw read
// here convicts the documentation of the cure, which is F-07.89 exactly.
const writers = [...EXPECTED.keys()].filter((f) => {
  try { return new RegExp(`setItem\\(\\s*['"\`]?(${VENDOR_LANE_KEY}|VENDOR_LANE_KEY)`).test(codeOf(f)); }
  catch { return false; }
});
const MIGRATION_ONLY = 'app/layout.tsx';
ok('§2.1b NO site writes a CHOSEN mode to the /vendor lane; the one write left is R-U19 migration',
   !writers.includes('lib/worklist/mode.ts') && writers.every((w) => w === MIGRATION_ONLY),
   writers.join(', ') || '(no writers at all)');

// ── §2.2 · INVERTED §4-4 batch ③ ──────────────────────────────────────────
// This asserted the bridge write lived INSIDE `writeMode` rather than loose in the module.
// Its successor asserts the write is not in that function at all — and, positively, that
// `writeMode` still does its own job, so a green cannot be bought by gutting the writer.
const modeCode = codeOf('lib/worklist/mode.ts');
const writeModeBody = (modeCode.match(/export function writeMode[\s\S]*?\n}/) || [''])[0];
ok('§2.2 the bridge write is gone from writeMode, which still writes the cookie',
   writeModeBody.length > 0
   && !/VENDOR_LANE_KEY/.test(writeModeBody)
   && writeModeBody.includes('MODE_COOKIE'),
   writeModeBody ? 'writeMode body still names VENDOR_LANE_KEY or lost the cookie' : 'writeMode not found');

// ── THE REVERSE WRITE MUST NOT EXIST. One writer means one; a bridge with traffic both
//    ways is two authorities wearing a bridge's name.
const reverse = ['app/vendor/layout.tsx', 'hooks/vendor/useTheme.ts', 'lib/vendor/ThemeContext.tsx']
  .filter((f) => { try { return readFileSync(ROOT + '/' + f, 'utf8').includes(MODE_COOKIE); } catch { return false; } });
ok('§2.3 the /vendor lane does not write back', reverse.length === 0, reverse.join(', '));

console.log('\n§3 · THE RETIREMENT WAS DERIVABLE, AND IT FIRED');

// ── INVERTED §4-4 batch ③ ────────────────────────────────────────────────
// The bridge retired when no room read the other key. That condition was in the registry
// rather than in a handover, which is why nobody had to remember it — and it is STILL read
// from the registry here, because the successor property is that the condition STAYS fired.
// A room re-pointed at `/vendor` would put a live reader back on the other lane while
// nothing writes it, which is a worse state than either the bridge or its absence: the
// vendor's flip would silently stop reaching a room that still reads the old key.
//
// STRIPPED, for the reason F-38.60 filed one sitting ago: the registry is a prose-carrying
// source file, its comments quote the very hrefs they retired, and the reader that did not
// strip is the one that convicted a correct tree.
// P7.2 AMENDMENT (labeled): the flip put EVERY room on a `/vendor/…` href (arm (a)), so
// "no room reads the /vendor lane" can no longer be measured by href prefix — the prefix is
// the shell now. The retirement condition that survives: no shell surface READS the lane
// key, and the old tree's reader is gone. Measured on the same key, not on an address.
const shellHits = execSync(
  `git grep -ln "${VENDOR_LANE_KEY}" -- "app/vendor/(shell)" components/worklist lib/worklist hooks || true`,
  { cwd: ROOT, encoding: 'utf8' },
).split('\n').filter(Boolean).filter((h) => h !== 'lib/worklist/mode.ts' && h !== 'hooks/vendor/useTheme.ts');
ok('3.1 the retirement condition holds  no shell surface reads the /vendor lane key',
   shellHits.length === 0, 'shell readers of the lane key: ' + (shellHits.join(', ') || 'none'));
ok('3.2 the old tree\'s reader is gone with the tree (P7.2)',
   !existsSync(ROOT + '/app/vendor/layout.tsx'), 'app/vendor/layout.tsx is back');
console.log('');
const total = pass + fail;
console.log(fail === 0 ? `GREEN — modeBridge ${pass}/${total}` : `RED — modeBridge ${pass}/${total}`);
process.exit(fail === 0 ? 0 : 1);
