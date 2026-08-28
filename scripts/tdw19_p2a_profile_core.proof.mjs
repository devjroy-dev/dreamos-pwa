// scripts/tdw19_p2a_profile_core.proof.mjs
//
// TDW_19 P2-A §3-2 · THE EXTRACTION'S GATE.
//
// ═══════════════════════════════════════════════════════════════════════════
// EVERY ASSERTION HERE COMES FROM THE CHARTER, NOT FROM THE CODE IT GATES
// ═══════════════════════════════════════════════════════════════════════════
// This file was written BEFORE the extraction was read, by CE-38's binding
// order, and it was run against the UN-EXTRACTED tree first and required to
// RED. The reason is D-38.1's doctrine wearing its worst coat: the extraction
// arrived in this container with a header ASSERTING byte-identity and naming
// this file as its witness, and this file did not exist. A gate written after
// the thing it gates tends to describe it. A gate written first has to be
// argued with.
//
// CE-38's four constraints, each one cell or set of cells below:
//   §1 the content core lands in `components/shared/`
//   §2 the three RENDERING mounts are byte-identical — proven, not intended
//   §3 the fourth consumer survives: `sanctuary` imports `IgChip` and
//      `FeaturedEyebrow` BY NAME from this module, renders the view never, and
//      a compile gate cannot see that break
//   §4 the core takes a palette SEAM (tokens, not inline literals), renders no
//      control, and is graph-free — no 'use client', no lucide, no frost
//
// ── HOW §2 IS PROVEN ───────────────────────────────────────────────────────
// The pre-extraction bytes are read out of git at a PINNED COMMIT, written to a
// temp tree, compiled, and rendered over the same fixture table as the working
// tree's. The two markup maps are compared string by string. No expectation is
// embedded here: a blob of frozen HTML in this file would rot on the first
// legitimate design change and would be re-pasted from the output the day it
// did, which is how a gate becomes a mirror.
//
// ⚠ THE PIN IS EXPLICIT AND MUST STAY THAT WAY. `HEAD` cannot be used: the
// moment the extraction commits, `HEAD` IS the extracted file and this whole
// proof turns vacuous while still printing green. `git log -1 -- <file>` has
// the identical defect one commit later. So the baseline is a named sha with
// its reasoning at site — and a later seat that legitimately changes the card's
// design must MOVE this pin deliberately, in the same cut, and say so.
//
// PIN: 2351af4c856ce0a04420c7ab4fa9d817a0618624
//      "TDW_07 P5 pwa — the enquiry sheet, and the deck's Enquire"
//      The last commit to touch VendorProfileView.tsx before P2-A, derived at
//      the cut by `git log -1 --format=%H -- components/shared/VendorProfileView.tsx`.
//
// ── WHY THE HARNESS IS A SEPARATE FILE ─────────────────────────────────────
// The rendering half is `scripts/lib/profileCoreRender.tsx`, and its header
// records the trap that put it there: a `scripts/*.proof.tsx` beside a
// `run-*-proof.sh` wrapper makes `run-floor.sh`'s ORPHANED guard grep out the
// `…proof.ts` prefix, fail its `-f` test, and STOP THE ENTIRE FLOOR. This file
// is a plain `.mjs`, caught by the floor's own `scripts/*.mjs` glob, running
// bare with its exit code as the verdict — the floor-method, unchanged.
//
// It compiles TypeScript, so it needs `node_modules/.bin/tsc`. On a tree with
// no `npm ci` it says so and exits 2 rather than reporting a false red — the
// preflight's own warning is that seven benches already refuse for this reason.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// ⚠ THE ESTATE'S ONE STRIPPER, INVOKED — not re-authored. F-07.74 records why
// the naive `/\*[\s\S]*?\*/` regex is wrong (it eats live code from
// `accept="image/*"` onward); F-07.99 records the worse failure, a stripper
// PORTED for one-home's sake and then never called. §4 below carries an
// invocation cell for exactly that reason.
import stripComments from './lib/stripComments.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PIN  = '2351af4c856ce0a04420c7ab4fa9d817a0618624';

const VIEW_REL = 'components/shared/VendorProfileView.tsx';
const CORE_REL = 'components/shared/VendorProfileContent.tsx';
const SANCTUARY_REL = 'app/(frost)/frost/canvas/sanctuary/page.tsx';

let pass = 0, fail = 0;
const ok  = (n, why) => { console.log('PASS  ' + n + (why ? '  — ' + why : '')); pass++; };
const no  = (n, why) => { console.log('FAIL  ' + n + '  — ' + why); fail++; };
const chk = (c, n, why) => (c ? ok(n, why) : no(n, why));

const TSC = path.join(ROOT, 'node_modules', '.bin', 'tsc');
if (!existsSync(TSC)) {
  console.error('STOP — node_modules/.bin/tsc is absent. Run `npm ci` first.');
  console.error('This bench compiles TypeScript; without the compiler it can only');
  console.error('report a red it did not earn.');
  process.exit(2);
}

const TMP = mkdtempSync(path.join(tmpdir(), 'p2a-core-'));

// ⚠ THE COMPILED OUTPUT MUST LAND INSIDE THE REPO, AND THE FIRST RUN PROVED IT.
// The header above already said the pinned copy compiles in-repo "because it
// imports `@/lib/...` and `lucide-react` through the repo's alias and
// node_modules" — and then the outDir was a temp directory anyway. Node
// resolves `lucide-react` by walking UP from the emitted file; from /tmp that
// walk never reaches this repo and every render died MODULE_NOT_FOUND. The
// principle was written down and then not followed; the bench found it.
//
// Both scratch paths are dot-prefixed and removed on every exit path, including
// abort — a bench that leaves build output in a delivery tree is F-19.18's
// class, and this one writes more than it reads.
const SCRATCH = [path.join(ROOT, '.p2a-pin'), path.join(ROOT, '.p2a-build')];
const wipe = () => { for (const d of SCRATCH) { try { rmSync(d, { recursive: true, force: true }); } catch {} } };
const cleanup = () => { try { rmSync(TMP, { recursive: true, force: true }); } catch {} wipe(); };
wipe();

/**
 * Compile one VendorProfileView source (tree or pinned) together with the
 * harness, and render the fixture table. Returns the harness's parsed output.
 *
 * The pinned copy is compiled INSIDE the repo — `components/shared/_pinned/` —
 * and not in a temp directory, because it imports `@/lib/...` and `lucide-react`
 * through the repo's alias and node_modules. A copy compiled elsewhere would be
 * proving something about a file that could not resolve its own imports.
 */
function render(label, viewSourcePath, outDir, alsoCore) {
  const cfg = path.join(TMP, `tsconfig.${label}.json`);
  writeFileSync(cfg, JSON.stringify({
    compilerOptions: {
      baseUrl: ROOT,
      paths: { '@/*': ['./*'] },
      module: 'commonjs',
      target: 'es2020',
      moduleResolution: 'node',
      esModuleInterop: true,
      skipLibCheck: true,
      strict: true,
      noEmitOnError: true,
      jsx: 'react-jsx',
      // The harness is a node program: it reads argv and `require`s the view by
      // path. Without this the compile dies on `process`/`require` and the
      // failure LOOKS like a broken component.
      types: ['node'],
      // ⚠ EXPLICIT, BECAUSE THIS CONFIG LIVES IN /tmp. `typeRoots` defaults to
      // walking UP from the tsconfig's own directory looking for
      // `node_modules/@types` — from a temp dir that walk reaches `/tmp` and
      // `/`, never the repo, and tsc reports `Cannot find type definition file
      // for 'node'` even though @types/node is installed three lines away in
      // package.json. Derived by reading the resolution, not guessed.
      typeRoots: [path.join(ROOT, 'node_modules/@types')],
    },
    // BOTH files, and the second one is the whole reason this list is explicit.
    // The harness takes its subject by ARGV so the pinned copy can be swapped
    // in — which means no static import drives the view's emission and `tsc`
    // would compile the harness alone, leaving `require()` pointing at nothing.
    // Naming the view here is what makes a path-parameterised subject compile.
    files: [path.join(ROOT, 'scripts/lib/profileCoreRender.tsx'), path.join(ROOT, viewSourcePath)],
  }, null, 2));

  execFileSync(TSC, ['-p', cfg, '--outDir', outDir], { cwd: ROOT, stdio: 'pipe' });

  const compiledView = path.join(outDir, viewSourcePath.replace(/\.tsx$/, '.js'));
  const compiledCore = path.join(outDir, CORE_REL.replace(/\.tsx$/, '.js'));
  const harness = path.join(outDir, 'scripts/lib/profileCoreRender.js');
  const args = [compiledView];
  // The core is emitted only because the tree's view imports it; on the pinned
  // run it does not exist and the harness is told nothing about it.
  if (alsoCore && existsSync(compiledCore)) args.push(compiledCore);
  // `-r aliasHook` because tsc emits `require('@/...')` verbatim; see that
  // file's header. The compiled output is real JS that needs the repo's alias
  // at RUN time, not only at type-check time.
  const raw = execFileSync(
    process.execPath,
    ['-r', path.join(ROOT, 'scripts/lib/aliasHook.cjs'), harness, ...args],
    { cwd: ROOT, stdio: 'pipe', env: { ...process.env, P2A_ALIAS_ROOT: outDir } },
  ).toString();
  return JSON.parse(raw);
}

try {
  // ═══ §0 · THE BASELINE EXISTS AND IS NOT THE TREE ═══════════════════════
  console.log('\n── §0 · the pinned baseline ──');
  const pinnedSrc = execFileSync('git', ['show', `${PIN}:${VIEW_REL}`], { cwd: ROOT, stdio: 'pipe' }).toString();
  const treeSrc   = readFileSync(path.join(ROOT, VIEW_REL), 'utf8');
  chk(pinnedSrc.length > 0, '§0.1 the pinned pre-extraction source resolves', `${PIN.slice(0, 7)}, ${pinnedSrc.split('\n').length} lines`);
  // If these are equal the extraction has not happened and §2 below can only
  // pass trivially. Stated as its own cell so a vacuous run announces itself.
  chk(pinnedSrc !== treeSrc,
      '§0.2 the tree DIFFERS from the pin — otherwise §2 is comparing a file with itself',
      pinnedSrc === treeSrc ? 'IDENTICAL — no extraction in the tree' : 'the tree has moved');

  // ═══ §1 · THE CORE LANDS IN components/shared/ ══════════════════════════
  console.log('\n── §1 · the core exists, at its ruled home ──');
  const corePath = path.join(ROOT, CORE_REL);
  const coreHere = existsSync(corePath);
  chk(coreHere, '§1.1 the content core is at components/shared/VendorProfileContent.tsx',
      coreHere ? 'present' : 'ABSENT — the extraction has not landed');
  const coreRaw  = coreHere ? readFileSync(corePath, 'utf8') : '';
  // ⚠ EVERY §4 TEXT CELL READS THE STRIPPED SOURCE, AND THE FIRST GREEN RUN IS
  // WHY. §4.2 reddened on `FOUND: <button` against a core whose JSX contains no
  // button at all — the match was inside the header comment explaining that the
  // IG chip IS a `<button>` and therefore stays behind. A cell reading raw text
  // convicts on the explanation, which is F-38.57 and F-38.60's disease in this
  // repo and F-07.74's estate-wide. The cure was already written; this bench
  // just had to call it.
  const core = coreHere ? stripComments(coreRaw) : '';

  // ═══ §2 · THE THREE RENDERING MOUNTS ARE BYTE-IDENTICAL ═════════════════
  console.log('\n── §2 · byte-identity across every prop shape (CE-38, binding) ──');
  const pinnedDir = path.join(ROOT, '.p2a-pin');
  rmSync(pinnedDir, { recursive: true, force: true });
  mkdirSync(path.join(pinnedDir, 'components/shared'), { recursive: true });
  writeFileSync(path.join(pinnedDir, VIEW_REL), pinnedSrc);

  // ⚠ §2 IS GUARDED, AND THE FIRST RUN IS WHY. On the un-extracted tree this
  // block threw and the bench died at exit 2 with §3 and §4 never printed —
  // b43's own disclosed defect, one repo over: "a partial verdict set is
  // precisely what wl_audit's preamble refuses; the reader cannot distinguish
  // an unreported cell from a passing one." A compile failure is a FAILED CELL,
  // not an absent verdict set.
  let before = null, after = null, renderErr = null;
  try {
    before = render('pinned', path.join('.p2a-pin', VIEW_REL), path.join(ROOT, '.p2a-build/pinned'));
    after  = render('tree',   VIEW_REL,                        path.join(ROOT, '.p2a-build/tree'), true);
  } catch (e) {
    if (process.env.P2A_DEBUG) console.error(String(e && e.stderr || ''), String(e && e.stdout || ''), e && e.message);
    renderErr = (e && e.stderr ? String(e.stderr) : String(e && e.message || e)).split('\n')
      .filter(Boolean).slice(0, 3).join(' | ').slice(0, 300);
  }
  if (!before || !after) {
    no('§2.1 the fixture table covers every branch and mount shape', 'render did not complete');
    no('§2.2 rendered markup is byte-identical, pinned vs tree, on EVERY fixture', renderErr || 'render did not complete');
    no('§2.3 \u2026and the markup compared is real, not empty', 'render did not complete');
    no('§3.1 `IgChip` is still exported from VendorProfileView', 'render did not complete');
    no('§3.2 `FeaturedEyebrow` is still exported from VendorProfileView', 'render did not complete');
  } else {
  const names = Object.keys(before.markup);
  const drifted = names.filter((n) => before.markup[n] !== after.markup[n]);
  chk(names.length >= 10, '§2.1 the fixture table covers every branch and mount shape',
      `${names.length} fixtures: ${names.join(', ')}`);
  chk(drifted.length === 0,
      '§2.2 rendered markup is byte-identical, pinned vs tree, on EVERY fixture',
      drifted.length ? 'DRIFTED: ' + drifted.join(', ') : `${names.length}/${names.length} identical`);

  // Non-vacuity of §2.2 in one line: if every fixture rendered the empty string
  // the cell above would pass. It cannot, and this says so.
  const empties = names.filter((n) => !after.markup[n] || after.markup[n].length < 200);
  chk(empties.length === 0, '§2.3 …and the markup compared is real, not empty',
      empties.length ? 'SUSPICIOUSLY SHORT: ' + empties.join(', ') : `shortest ${Math.min(...names.map((n) => after.markup[n].length))} chars`);
  }

  // ═══ §3 · THE FOURTH CONSUMER — sanctuary's named imports ═══════════════
  // A compile gate CANNOT see this break. `sanctuary` imports two names from
  // this module and never renders the view; an extraction that moved either
  // one would typecheck against the new home and throw at runtime on a surface
  // nobody in this sitting opens.
  console.log('\n── §3 · the named exports sanctuary depends on ──');
  if (after) {
    chk(after.exports.IgChip === 'function',
        '§3.1 `IgChip` is still exported from VendorProfileView', `typeof = ${after.exports.IgChip}`);
    chk(after.exports.FeaturedEyebrow === 'function',
        '§3.2 `FeaturedEyebrow` is still exported from VendorProfileView', `typeof = ${after.exports.FeaturedEyebrow}`);
  }
  // ⚠ A CENSUS, NOT A ROSTER. The first cut named `sanctuary` alone, because
  // that was the consumer the seat's own correction had surfaced. Reading the
  // draft turned up a second: `components/frost/blooms/discover.tsx:838` renders
  // `<FeaturedEyebrow>` directly as well as mounting the view. A cell listing
  // the files it knows about would have missed it and would miss the third.
  // So the consumers are DERIVED off the tree and every one is checked.
  const consumers = execFileSync('grep',
    ['-rln', "from '@/components/shared/VendorProfileView'", 'app', 'components'],
    { cwd: ROOT, stdio: 'pipe' }).toString().trim().split('\n').filter(Boolean);
  const named = consumers.filter((f) => {
    const line = readFileSync(path.join(ROOT, f), 'utf8').split('\n')
      .find((l) => l.includes("from '@/components/shared/VendorProfileView'")) || '';
    return /\{[^}]*(IgChip|FeaturedEyebrow)[^}]*\}/.test(line);
  });
  const unresolved = named.filter((f) => {
    const line = readFileSync(path.join(ROOT, f), 'utf8').split('\n')
      .find((l) => l.includes("from '@/components/shared/VendorProfileView'")) || '';
    return [...line.matchAll(/IgChip|FeaturedEyebrow/g)].some((m) => after && after.exports[m[0]] !== 'function');
  });
  chk(named.length >= 2 && unresolved.length === 0,
      '§3.3 every named-export consumer in the tree still resolves — census, not roster',
      `${named.length} consumer(s): ${named.join(', ')}${unresolved.length ? ' — UNRESOLVED: ' + unresolved.join(', ') : ''}`);

  // ═══ §4 · THE CORE'S FOUR PROPERTIES ════════════════════════════════════
  console.log('\n── §4 · graph-free, control-free, palette by seam ──');
  if (!coreHere) {
    // Every §4 cell reports in BOTH legs. A cell that simply vanishes when its
    // subject is absent leaves the reader unable to tell it from a pass.
    no('§4.0 stripComments actually ran', 'core absent');
    no('§4.1 the core is graph-free', 'core absent');
    no('§4.2 the core renders no control', 'core absent');
    no('§4.3 the palette is a seam, not inline literals', 'core absent');
    no('§4.4 the seam actually produces two palettes', 'core absent');
  } else {
    // THE INVOCATION CELL (F-07.99). A stripper imported and not called is how
    // this estate lost a block. Proven by the property rather than asserted: the
    // header's own `<button>` mention survives in the raw text and must be gone
    // from the stripped text.
    chk(/<button/.test(coreRaw) && !/<button/.test(core),
        '§4.0 stripComments actually ran — the header\u2019s `<button>` mention is gone from the stripped text',
        `raw has it: ${/<button/.test(coreRaw)}, stripped does not: ${!/<button/.test(core)}`);

    const banned = [
      ["'use client'", /^\s*['"]use client['"]/m],
      ['lucide-react', /from\s+['"]lucide-react['"]/],
      ['@/lib/frost/', /from\s+['"]@\/lib\/frost\//],
      ['next/', /from\s+['"]next\//],
    ].filter(([, re]) => re.test(core)).map(([n]) => n);
    chk(banned.length === 0, '§4.1 the core is graph-free — no client directive, lucide, frost or next',
        banned.length ? 'IMPORTS: ' + banned.join(', ') : '4 forbidden graphs checked absent');

    const controls = [
      ['<button', /<button[\s>]/],
      ['onClick', /onClick\s*=/],
      ['<a href', /<a[^>]*\shref\s*=/],
      ['onTouch', /onTouch(Start|End)\s*=/],
    ].filter(([, re]) => re.test(core)).map(([n]) => n);
    chk(controls.length === 0, '§4.2 the core renders no interactive element — controls are the mount\u2019s',
        controls.length ? 'FOUND: ' + controls.join(', ') : '4 control forms checked absent');

    // THE SEAM. Dark-glass literals are the disease this constraint names: if
    // `rgba(248,247,245,…)` is scattered through the JSX, `/v/` cannot render
    // on cream without forking the file. They are permitted in ONE place — a
    // named palette declaration — and nowhere else.
    const jsxInk = core
      .split('\n')
      .filter((l) => /rgba\(248,\s*247,\s*245|#F8F7F5|rgba\(255,\s*255,\s*255/.test(l))
      .filter((l) => /style=\{\{|color:\s*['"]rgba|background:\s*['"]rgba/.test(l) && !/PALETTE|Palette|palette/.test(l));
    chk(jsxInk.length === 0, '§4.3 no dark-glass literal is inline in the core\u2019s JSX',
        jsxInk.length ? `${jsxInk.length} inline literal line(s): ${jsxInk[0].trim().slice(0, 70)}` : 'every ink reaches JSX through the palette');

    // And the seam must WORK, not merely exist: two palettes must produce two
    // different renderings of the same vendor. A `palette` prop that nothing
    // reads would pass §4.3 and fail the page.
    // ⚠ THE SEAM IS PROVEN BY RENDERING IT, NOT BY FINDING IT (CE-38 relay).
    // The first cut of this cell grepped for an exported `*PALETTE*` and passed.
    // That passes on a `palette` prop no line reads — tokens existing is not a
    // seam working. So the core is rendered over the SAME fields on BOTH grounds
    // and the two documents are compared: they must differ, the cream one must
    // carry the cream inks and NONE of the glass inks, and §2.2 must still hold
    // — the three mounts stay byte-identical dark while `/v/` comes out cream.
    const cm = after && after.core;
    if (!cm) {
      no('§4.4 one seam, two grounds — proven by rendering', 'the core did not render');
    } else {
      const glassInks = ['rgba(248,247,245,0.5)', '#F8F7F5', 'rgba(248,247,245,0.7)', 'rgba(248,247,245,0.55)'];
      const creamInks = ['#6B6560', '#0C0A09', '#403B36'];
      const differs   = cm.onGlass !== cm.onCream;
      const creamHas  = creamInks.every((i) => cm.onCream.includes(i));
      const creamClean = !glassInks.some((i) => cm.onCream.includes(i));
      const glassHas  = glassInks.every((i) => cm.onGlass.includes(i));
      chk(differs && creamHas && creamClean && glassHas,
          '§4.4 one seam, two grounds — the same fields render dark AND cream',
          `differ=${differs} cream-inks=${creamHas} cream-clean-of-glass=${creamClean} glass-inks=${glassHas}`);
    }
  }
} catch (e) {
  console.error('\nBENCH ABORTED —', e && e.stack ? e.stack : e);
  if (e && e.stderr) console.error(String(e.stderr).slice(0, 3000));
  cleanup();
  process.exit(2);
}

cleanup();
console.log(`\n${pass} PASS \u00b7 ${fail} FAIL`);
process.exit(fail === 0 ? 0 : 1);
